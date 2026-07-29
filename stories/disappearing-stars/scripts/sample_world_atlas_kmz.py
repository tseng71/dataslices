#!/usr/bin/env python3
"""Sample approved story points from the World Atlas KMZ.

The KMZ stores the atlas as georeferenced JPEG overlays. Pixel colors encode
twofold artificial-sky-brightness bands rather than continuous values.
"""

from __future__ import annotations

import argparse
import io
import json
import math
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

from PIL import Image


SOURCE_URL = (
    "https://datapub.gfz.de/download/10.5880/GFZ.1.4.2016.001/"
    "NewWorldAtlas_ArtificialSkyBrightness.kmz"
)
RETRIEVED_ON = "2026-07-28"
NATURAL_SKY_MCD_M2 = 0.174

# Representative colors sampled from the atlas JPEG. Classification returns
# the corresponding Table 1 ratio band from Falchi et al. (2016).
BANDS = [
    ("black", (0, 0, 0), None, 0.01),
    ("dark-gray", (77, 77, 77), 0.01, 0.02),
    ("gray", (128, 128, 128), 0.02, 0.04),
    ("dark-blue", (0, 38, 115), 0.04, 0.08),
    ("blue", (0, 85, 170), 0.08, 0.16),
    ("light-blue", (0, 146, 206), 0.16, 0.32),
    ("dark-green", (0, 146, 69), 0.32, 0.64),
    ("green", (70, 180, 70), 0.64, 1.28),
    ("yellow", (255, 255, 0), 1.28, 2.56),
    ("orange", (255, 82, 6), 2.56, 5.12),
    ("red", (217, 0, 0), 5.12, 10.2),
    ("magenta", (204, 116, 238), 10.2, 20.5),
    ("pink", (236, 167, 255), 20.5, 41.0),
    ("white", (255, 255, 255), 41.0, None),
]

POINTS = [
    {
        "place_id": "times-square",
        "display_name": "时代广场",
        "display_name_en": "Times Square",
        "longitude": -73.9855,
        "latitude": 40.7580,
        "role": "urban-core",
    },
    {
        "place_id": "central-park",
        "display_name": "中央公园大草坪",
        "display_name_en": "Central Park Great Lawn",
        "longitude": -73.9665,
        "latitude": 40.7812,
        "role": "lower-direct-glare",
    },
    {
        "place_id": "jamaica-bay",
        "display_name": "牙买加湾野生动物保护区",
        "display_name_en": "Jamaica Bay Wildlife Refuge",
        "longitude": -73.8240,
        "latitude": 40.6162,
        "role": "city-edge-wetland",
    },
    {
        "place_id": "pelham-bay",
        "display_name": "佩勒姆湾／果园海滩",
        "display_name_en": "Pelham Bay / Orchard Beach",
        "longitude": -73.7848,
        "latitude": 40.8671,
        "role": "city-edge-coast",
    },
    {
        "place_id": "montauk-point",
        "display_name": "蒙托克角",
        "display_name_en": "Montauk Point",
        "longitude": -71.8570,
        "latitude": 41.0709,
        "role": "darker-regional-reference",
    },
]


def haversine_km(lon1: float, lat1: float, lon2: float, lat2: float) -> float:
    radius_km = 6371.0088
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = math.radians(lat2 - lat1)
    dl = math.radians(lon2 - lon1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * radius_km * math.asin(math.sqrt(a))


def color_distance(a: tuple[int, int, int], b: tuple[int, int, int]) -> float:
    return math.sqrt(sum((x - y) ** 2 for x, y in zip(a, b)))


def classify(pixel: tuple[int, int, int]) -> dict:
    name, rgb, lower, upper = min(BANDS, key=lambda band: color_distance(pixel, band[1]))
    return {
        "atlas_band": name,
        "artificial_to_natural_ratio_lower": lower,
        "artificial_to_natural_ratio_upper": upper,
        "source_pixel_rgb": list(pixel),
        "reference_rgb": list(rgb),
        "palette_distance": round(color_distance(pixel, rgb), 2),
    }


def nelm_for_artificial_ratio(ratio: float) -> float:
    """North America Eq. S3 fit from Kyba et al. (2023) supplement."""

    return 4.95 - 1.52 * math.log10(1 + ratio)


def derived_nelm_interval(lower: float | None, upper: float | None) -> dict:
    # NELM decreases as the artificial-to-natural ratio increases.
    return {
        "upper_vmag": round(nelm_for_artificial_ratio(lower or 0), 2)
        if lower is not None
        else None,
        "lower_vmag": round(nelm_for_artificial_ratio(upper), 2)
        if upper is not None
        else None,
        "open_lower_bound": upper is None,
        "method": "Kyba et al. 2023 North America Eq. S3; Nn=4.95, s=-1.52",
        "residual_sigma_vmag": 1.009,
    }


def overlays(kml_bytes: bytes) -> list[dict]:
    root = ET.fromstring(kml_bytes)
    namespace = {"k": "http://www.opengis.net/kml/2.2"}
    output = []
    for overlay in root.findall(".//k:GroundOverlay", namespace):
        href = overlay.findtext("k:Icon/k:href", namespaces=namespace)
        box = overlay.find("k:LatLonBox", namespace)
        if not href or box is None:
            continue
        output.append(
            {
                "href": href,
                **{
                    key: float(box.findtext(f"k:{key}", namespaces=namespace))
                    for key in ("north", "south", "east", "west")
                },
            }
        )
    return output


def find_overlay(all_overlays: list[dict], lon: float, lat: float) -> dict:
    for overlay in all_overlays:
        if (
            overlay["west"] <= lon <= overlay["east"]
            and overlay["south"] <= lat <= overlay["north"]
        ):
            return overlay
    raise ValueError(f"No atlas overlay covers {lon}, {lat}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--kmz", type=Path, required=True)
    parser.add_argument("--output", type=Path, required=True)
    args = parser.parse_args()

    with zipfile.ZipFile(args.kmz) as archive:
        all_overlays = overlays(archive.read("doc.kml"))
        image_cache: dict[str, Image.Image] = {}
        results = []
        origin = POINTS[0]

        for point in POINTS:
            overlay = find_overlay(
                all_overlays, point["longitude"], point["latitude"]
            )
            href = overlay["href"]
            if href not in image_cache:
                image_cache[href] = Image.open(io.BytesIO(archive.read(href))).convert("RGB")
            image = image_cache[href]
            x = round(
                (point["longitude"] - overlay["west"])
                / (overlay["east"] - overlay["west"])
                * (image.width - 1)
            )
            y = round(
                (overlay["north"] - point["latitude"])
                / (overlay["north"] - overlay["south"])
                * (image.height - 1)
            )
            sampled = classify(image.getpixel((x, y)))
            results.append(
                {
                    **point,
                    "distance_from_times_square_km": round(
                        haversine_km(
                            origin["longitude"],
                            origin["latitude"],
                            point["longitude"],
                            point["latitude"],
                        ),
                        1,
                    ),
                    "model_value": {
                        "metric": "artificial zenith sky brightness / natural sky brightness",
                        **sampled,
                    },
                    "model_implied_naked_eye_limit": derived_nelm_interval(
                        sampled["artificial_to_natural_ratio_lower"],
                        sampled["artificial_to_natural_ratio_upper"],
                    ),
                    "model_year": 2014,
                    "model_resolution": "30 arcseconds (published GeoTIFF); KMZ display tile sampled here",
                    "nearby_observation_count": None,
                    "observation_window": None,
                    "coverage_status": "No local Globe at Night validation used in this package",
                    "evidence_type": "modeled brightness band with derived NELM interval",
                    "caveat": (
                        "A clear-sky zenith model band, not an on-site forecast. "
                        "It does not resolve direct glare, obstructions, weather, "
                        "moonlight, observer adaptation, or block-scale variation."
                    ),
                    "sampling": {
                        "tile": href,
                        "pixel_x": x,
                        "pixel_y": y,
                    },
                }
            )

    payload = {
        "schema_version": "2.0.0",
        "source": {
            "title": "The New World Atlas of Artificial Night Sky Brightness",
            "authors": "Falchi et al.",
            "doi": "10.5880/GFZ.1.4.2016.001",
            "paper_doi": "10.1126/sciadv.1600377",
            "source_url": SOURCE_URL,
            "retrieved_on": RETRIEVED_ON,
            "license": "CC BY-NC 4.0",
            "natural_sky_reference_mcd_m2": NATURAL_SKY_MCD_M2,
        },
        "route_note": (
            "Landmark coordinates are editorial WGS84 points. Times Square and "
            "Central Park fall in the same >41 atlas band, so the story may discuss "
            "reduced direct glare in the park but may not claim a darker atlas band."
        ),
        "places": results,
    }
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
