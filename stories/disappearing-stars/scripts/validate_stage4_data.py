#!/usr/bin/env python3
"""Fail fast when the Stage 4 evidence package loses its approved invariants."""

from __future__ import annotations

import csv
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data" / "v2"
DOCS = ROOT / "docs"


def load(name: str) -> dict:
    return json.loads((DATA / name).read_text(encoding="utf-8"))


def main() -> None:
    stars_payload = load("stars-orion-field.json")
    stars = stars_payload["stars"]
    assert len(stars) == 250
    assert len({star["star_id"] for star in stars}) == 250
    assert sum(star["vmag"] <= 6.50 for star in stars) == 250
    assert sum(star["vmag"] <= 5.48 for star in stars) == 100
    assert all(0 <= star["x_normalized"] <= 1 for star in stars)
    assert all(0 <= star["y_normalized"] <= 1 for star in stars)

    named = {star["display_name_en"] for star in stars if star["display_name_en"]}
    assert {
        "Rigel",
        "Bellatrix",
        "Mintaka",
        "Hatysa",
        "Alnilam",
        "Alnitak",
        "Saiph",
        "Betelgeuse",
    } <= named

    scenario = load("generation-scenario.json")
    states = scenario["states"]
    assert [state["age_years"] for state in states] == [0, 6, 12, 18]
    assert [state["illustrative_visible_count"] for state in states] == [
        250,
        194,
        133,
        100,
    ]
    assert states[-1]["skyglow_factor"] == 5.207
    assert states[0]["reader_facing_count_claim"] == 250
    assert states[-1]["reader_facing_count_claim"] == 100
    assert all(
        state["reader_facing_count_claim"] is None for state in states[1:-1]
    )

    places = load("nyc-places.json")["places"]
    assert [place["place_id"] for place in places] == [
        "times-square",
        "central-park",
        "jamaica-bay",
        "pelham-bay",
        "montauk-point",
    ]
    assert [place["model_value"]["atlas_band"] for place in places] == [
        "white",
        "white",
        "pink",
        "magenta",
        "light-blue",
    ]
    assert all(place["nearby_observation_count"] is None for place in places)
    assert all(place["observation_window"] is None for place in places)
    assert all(place["model_year"] == 2014 for place in places)

    lighting = load("lighting-presets.json")["presets"]
    assert len(lighting) == 5
    assert not any(item["quantitative_output_allowed"] for item in lighting)

    evidence = load("evidence.json")["claims"]
    evidence_ids = {claim["claim_id"] for claim in evidence}
    assert evidence_ids == {f"C{index:02d}" for index in range(1, 12)}

    with (DOCS / "claim-source-ledger-v2.csv").open(
        encoding="utf-8", newline=""
    ) as handle:
        ledger = list(csv.DictReader(handle))
    assert {row["claim_id"] for row in ledger} == evidence_ids
    assert all(row["status"] == "ready" for row in ledger)

    print(
        "Stage 4 data valid: "
        f"{len(stars)} stars, {len(states)} scenario states, "
        f"{len(places)} places, {len(evidence)} claims."
    )


if __name__ == "__main__":
    main()
