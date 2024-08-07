import pickle
from typing import Any, Dict, List
from pathlib import Path


locations_synonyms: Dict[str, List[str]] = {
    "Warszawa": [
        "Warsaw",
        "Warszawa",
        "Katowice; Warszawa",
        "Warszawa (Centrum)",
        "Waraszawa",
    ],
    "Kraków": ["Krakow", "Kraków"],
    "Wrocław": ["Wroclaw", "Wrocław"],
    "Poznań": ["Poznan", "Poznań", "Pozanań"],
    "Gdańsk": ["Gdansk", "Gdańsk"],
    "Szczecin": ["Szczecin", "szczecin"],
    "Łódź": ["Lodz", "Łódź"],
    "Rzeszów": ["Rzeszow", "Rzeszów"],
    "Katowice": ["Katowice", "Katowice; Warszawa"],
    "Kielce": ["Kielce"],
    "Opole": ["opole", "Opole"],
    "Sopot": ["Sopot"],
    "Olszytn": ["Olsztyn"],
    "Gdynia": ["Gdynia"],
}


def replace_synonyms(locations):
    """fixed locations names"""
    for standard, synonyms in locations_synonyms.items():
        for i, loc in enumerate(locations):
            if loc in synonyms:
                locations[i] = standard
    return locations


def split_contracts(row):
    contracts = []
    if row["min_b2b"] > 0 or row["max_b2b"] > 0:
        new_row_b2b = row.copy()
        new_row_b2b["min_uop"] = 0
        new_row_b2b["max_uop"] = 0
        new_row_b2b["avg_salary"] = (
            new_row_b2b["min_b2b"] + new_row_b2b["max_b2b"]
        ) / 2
        new_row_b2b["contract_type"] = "B2B"
        contracts.append(new_row_b2b)
    if row["min_uop"] > 0 or row["max_uop"] > 0:
        new_row_uop = row.copy()
        new_row_uop["min_b2b"] = 0
        new_row_uop["max_b2b"] = 0
        new_row_uop["avg_salary"] = (
            new_row_uop["min_uop"] + new_row_uop["max_uop"]
        ) / 2
        new_row_uop["contract_type"] = "UoP"
        contracts.append(new_row_uop)
    return contracts


def save_obj(path: Path, encoder: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, "wb") as f:
        pickle.dump(encoder, f)


def read_obj(path: Path) -> Any:
    with open(path, "rb") as f:
        return pickle.load(f)
