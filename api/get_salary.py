import pandas as pd
import numpy as np
from typing import Dict, List

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


class ComputeSalary:
    def __init__(self, data: dict = {}) -> None:
        #### model
        self.model = pd.read_pickle("../models/model.pkl")

        #### encoders
        self.location_encoder = pd.read_pickle("../encoders/location_encoder.pkl")
        self.exp_encoder = pd.read_pickle("../encoders/exp_encoder.pkl")
        self.tech_stack_encoder = pd.read_pickle("../encoders/tech_stack.pkl")
        self.operating_mode_encoder = pd.read_pickle("../encoders/operating_mode.pkl")
        self.contract_type_encoder = pd.read_pickle(
            "../encoders/contract_type_encoder.pkl"
        )

        self.data: pd.DataFrame = self.preprocess_input(data) if data != {} else None

    def all_locations(self) -> str:
        locations: List[str] = list()

        for location in self.location_encoder.classes_:
            for key, value in locations_synonyms.items():
                if location in value:
                    locations.append(key)

        return locations

    def all_exp(self) -> List[str]:
        exps: List[str] = list()
        for exp in self.exp_encoder.classes_.T:
            exps.append(exp)
        return exps

    def all_operating_modes(self) -> List[str]:
        modes: List[str] = list()
        for mode in self.operating_mode_encoder.classes_.T:
            modes.append(mode)
        return modes

    def all_tech_stacks(self) -> List[str]:
        techs: List[str] = list()
        for tech in self.tech_stack_encoder.classes_.T:
            techs.append(tech)
        return techs

    def all_contract_types(self) -> List[str]:
        contracts: List[str] = list()
        for contract in self.contract_type_encoder.classes_.T:
            contracts.append(contract)
        return contracts

    def preprocess_input(self, raw_data: dict) -> pd.DataFrame:
        location_code = self.location_encoder.transform([raw_data["city"]])[0]
        exp_code = self.exp_encoder.transform([raw_data["experience"]])[0]
        operating_mode_code = self.operating_mode_encoder.transform(
            [raw_data["operatingMode"]]
        )[0]
        tech_stack = self.tech_stack_encoder.transform([raw_data["technologies"]])[0]
        contract_type_code = self.contract_type_encoder.transform(
            [raw_data["contractType"]]
        )[0]

        res = np.concatenate(
            [
                [contract_type_code, location_code, exp_code, operating_mode_code],
                tech_stack,
            ]
        ).reshape(1, -1)
        return pd.DataFrame(res)

    def salary(self) -> float:
        self.data.columns = self.model.feature_names_in_
        salary_pred = self.model.predict(self.data)

        return np.round(salary_pred[0], 2)
