#!/usr/bin/env python3
"""Build the approved Orion-field catalogue and generation scenario.

The script intentionally accepts a local copy of the Bright Star Catalogue.
It does not download data, which keeps builds reproducible and separates
source acquisition from transformation.
"""

from __future__ import annotations

import argparse
import hashlib
import json
from pathlib import Path


SOURCE_URL = "https://cdsarc.cds.unistra.fr/ftp/cats/V/50/catalog.gz"
RETRIEVED_ON = "2026-07-28"

FIELD = {
    "label": "Orion-centered rectangular field",
    "ra_min_deg": 72.0,
    "ra_max_deg": 94.0,
    "dec_min_deg": -11.5,
    "dec_max_deg": 23.0,
    "vmag_max": 6.5,
}

NAMED_STARS = {
    1713: ("Rigel", "参宿七"),
    1790: ("Bellatrix", "参宿五"),
    1852: ("Mintaka", "参宿三"),
    1899: ("Hatysa", "伐三"),
    1903: ("Alnilam", "参宿二"),
    1948: ("Alnitak", "参宿一"),
    2004: ("Saiph", "参宿六"),
    2061: ("Betelgeuse", "参宿四"),
}

AGES = (0, 6, 12, 18)
ANNUAL_SKYGLOW_GROWTH = 0.096
ANNUAL_GROWTH_LOW = 0.092
ANNUAL_GROWTH_HIGH = 0.100
START_THRESHOLD = 6.50
END_THRESHOLD = 5.48


def slice_text(line: str, start: int, end: int) -> str:
    """Return a one-indexed inclusive fixed-width field."""

    return line[start - 1 : end].strip()


def optional_float(value: str) -> float | None:
    return float(value) if value else None


def parse_ra(line: str) -> float | None:
    hour = slice_text(line, 76, 77)
    minute = slice_text(line, 78, 79)
    second = slice_text(line, 80, 83)
    if not (hour and minute and second):
        return None
    return 15.0 * (int(hour) + int(minute) / 60.0 + float(second) / 3600.0)


def parse_dec(line: str) -> float | None:
    sign = slice_text(line, 84, 84)
    degree = slice_text(line, 85, 86)
    minute = slice_text(line, 87, 88)
    second = slice_text(line, 89, 90)
    if not (sign and degree and minute and second):
        return None
    absolute = int(degree) + int(minute) / 60.0 + int(second) / 3600.0
    return -absolute if sign == "-" else absolute


def parse_catalog(path: Path) -> list[dict]:
    stars: list[dict] = []
    for line in path.read_text(encoding="ascii").splitlines():
        if len(line) < 147:
            continue

        hr_text = slice_text(line, 1, 4)
        ra = parse_ra(line)
        dec = parse_dec(line)
        vmag = optional_float(slice_text(line, 103, 107))
        if not hr_text or ra is None or dec is None or vmag is None:
            continue
        if not (
            FIELD["ra_min_deg"] <= ra <= FIELD["ra_max_deg"]
            and FIELD["dec_min_deg"] <= dec <= FIELD["dec_max_deg"]
            and vmag <= FIELD["vmag_max"]
        ):
            continue

        hr = int(hr_text)
        english_name, chinese_name = NAMED_STARS.get(hr, (None, None))
        star = {
            "star_id": f"hr-{hr:04d}",
            "hr": hr,
            "hd": int(value) if (value := slice_text(line, 26, 31)) else None,
            "catalog_name_raw": slice_text(line, 5, 14) or None,
            "display_name_en": english_name,
            "display_name_zh": chinese_name,
            "ra_deg": round(ra, 6),
            "dec_deg": round(dec, 6),
            "vmag": vmag,
            "bv": optional_float(slice_text(line, 110, 114)),
            "spectral_type": slice_text(line, 128, 147) or None,
            "x_normalized": round((FIELD["ra_max_deg"] - ra) / 22.0, 6),
            "y_normalized": round((FIELD["dec_max_deg"] - dec) / 34.5, 6),
            "is_named_orion_anchor": hr in NAMED_STARS,
        }
        stars.append(star)

    return sorted(stars, key=lambda item: item["hr"])


def count_at_threshold(stars: list[dict], threshold: float) -> int:
    return sum(star["vmag"] <= threshold for star in stars)


def scenario(stars: list[dict]) -> list[dict]:
    rows = []
    for age in AGES:
        fraction = age / 18
        threshold = START_THRESHOLD + fraction * (END_THRESHOLD - START_THRESHOLD)
        factor = (1 + ANNUAL_SKYGLOW_GROWTH) ** age
        factor_low = (1 + ANNUAL_GROWTH_LOW) ** age
        factor_high = (1 + ANNUAL_GROWTH_HIGH) ** age
        rows.append(
            {
                "age_years": age,
                "skyglow_factor": round(factor, 4),
                "skyglow_factor_low": round(factor_low, 4),
                "skyglow_factor_high": round(factor_high, 4),
                "display_threshold_vmag": round(threshold, 2),
                "illustrative_visible_count": count_at_threshold(stars, threshold),
                "reader_facing_count_claim": (
                    250 if age == 0 else 100 if age == 18 else None
                ),
                "evidence_type": (
                    "published example endpoint"
                    if age in (0, 18)
                    else "editorial visual interpolation"
                ),
            }
        )
    return rows


def write_json(path: Path, payload: object) -> None:
    path.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
        encoding="utf-8",
    )


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--catalog", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    args = parser.parse_args()
    args.output_dir.mkdir(parents=True, exist_ok=True)

    stars = parse_catalog(args.catalog)
    if len(stars) != 250:
        raise SystemExit(f"Expected 250 selected catalogue rows; found {len(stars)}")
    if len({star["star_id"] for star in stars}) != len(stars):
        raise SystemExit("Duplicate star_id in selected catalogue rows")

    source_sha = hashlib.sha256(args.catalog.read_bytes()).hexdigest()
    catalogue_payload = {
        "schema_version": "2.0.0",
        "source": {
            "title": "Bright Star Catalogue, 5th Revised Ed. (Preliminary Version)",
            "authors": "Hoffleit, D.; Warren, W. H. Jr.",
            "catalogue_id": "V/50",
            "source_url": SOURCE_URL,
            "retrieved_on": RETRIEVED_ON,
            "local_input_sha256": source_sha,
            "rights_note": (
                "Astronomical catalogue metadata redistributed by CDS/VizieR; "
                "retain source attribution."
            ),
        },
        "selection": {
            **FIELD,
            "coordinate_epoch": "J2000.0",
            "selection_note": (
                "Rectangular Orion-centered comparison field; entries are not "
                "restricted to physical Orion membership."
            ),
            "star_count": len(stars),
        },
        "stars": stars,
    }

    scenario_payload = {
        "schema_version": "2.0.0",
        "scenario_id": "kyba-global-average-18y-editorial-translation",
        "source": {
            "title": "Citizen scientists report global rapid reductions in the visibility of stars from 2011 to 2022",
            "authors": "Kyba et al.",
            "doi": "10.1126/science.abq7781",
            "source_url": "https://www.science.org/doi/10.1126/science.abq7781",
        },
        "published_claims": {
            "global_annual_skyglow_growth_pct": 9.6,
            "global_annual_skyglow_growth_uncertainty_pct": 0.4,
            "example_start_visible_stars": 250,
            "example_end_visible_stars_after_18_years": 100,
        },
        "visual_mapping": {
            "method": (
                "Linear interpolation of the display limiting magnitude from "
                "6.50 to 5.48 across the four approved age nodes."
            ),
            "calibration": (
                "The field contains 250 catalogue entries at Vmag <= 6.50 and "
                "100 at Vmag <= 5.48."
            ),
            "caveat": (
                "Only the 0- and 18-year counts are published example endpoints. "
                "Intermediate thresholds and counts are editorial visual "
                "interpolation and must not be presented as measured values."
            ),
        },
        "states": scenario(stars),
    }

    threshold_payload = {
        "schema_version": "2.0.0",
        "model_id": "catalogue-display-threshold-v1",
        "input_unit": "V-band apparent magnitude",
        "rule": "visible when star.vmag <= display_threshold_vmag",
        "purpose": "Consistent star identity and visibility state across story scenes.",
        "not_a_claim": (
            "This catalogue rule is a visual encoding. Human naked-eye visibility "
            "also depends on adaptation, acuity, atmosphere, weather, moonlight, "
            "view direction, direct glare, and local obstructions."
        ),
        "approved_thresholds_vmag": [6.5, 6.16, 5.82, 5.48],
    }

    write_json(args.output_dir / "stars-orion-field.json", catalogue_payload)
    write_json(args.output_dir / "generation-scenario.json", scenario_payload)
    write_json(args.output_dir / "threshold-model.json", threshold_payload)


if __name__ == "__main__":
    main()
