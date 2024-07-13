from pathlib import Path
import pandas as pd
import numpy as np
from typing import Dict, List

from schemas import Kategory, SalaryModelInput, SalaryModelOutput

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

model_dir = Path("../objects/")
encoders_dir = Path("../objects/encoders/")


class ComputeSalary:
    def __init__(self, data: SalaryModelInput = {}) -> None:
        #### model
        self.model = pd.read_pickle(f"{model_dir}/best_model.pkl")

        #### encoders
        self.location_encoder = pd.read_pickle(f"{encoders_dir}/location_en.pkl")
        self.exp_encoder = pd.read_pickle(f"{encoders_dir}/exp_en.pkl")
        self.tech_stack_encoder = pd.read_pickle(f"{encoders_dir}/tech_stack_en.pkl")
        self.operating_mode_encoder = pd.read_pickle(
            f"{encoders_dir}/operating_mode_en.pkl"
        )
        self.contract_type_encoder = pd.read_pickle(
            f"{encoders_dir}/contract_type_en.pkl"
        )

        #### request from json with params for model
        self.data: pd.DataFrame = self.preprocess_input(data) if data != {} else None

    def all_locations(self) -> List[Kategory]:
        """special case to get all locations, normalizes locations

        Returns:
            List[Kategory]:  List of Kategories
        """
        _locations: List[Kategory] = list()

        for index, location in enumerate(self.location_encoder.classes_):
            for key, value in locations_synonyms.items():
                if location in value:
                    _locations.append(Kategory(id=index, name=key))

        return _locations

    def _all_kategories(self, encoder) -> List[Kategory]:
        """getting kategories from decoded obejcts

        Args:
            encoder: object which was used to encode variables in machine learning process

        Returns:
            List[Kategory]: List of Kategories
        """
        return [
            Kategory(id=index, name=exp) for index, exp in enumerate(encoder.classes_.T)
        ]

    # to check this shit or calling abstract func from class with getter to avaiable encoders
    def all_exp(self) -> List[Kategory]:
        return self._all_kategories(self.exp_encoder)

    def all_operating_modes(self) -> List[str]:
        return self._all_kategories(self.operating_mode_encoder)

    def all_tech_stacks(self) -> List[str]:
        return self._all_kategories(self.tech_stack_encoder)

    def all_contract_types(self) -> List[str]:
        return self._all_kategories(self.contract_type_encoder)

    def preprocess_input(self, raw_data: SalaryModelInput) -> pd.DataFrame:
        location_code = self.location_encoder.transform([raw_data.city])[0]
        exp_code = self.exp_encoder.transform([raw_data.exp])[0]
        operating_mode_code = self.operating_mode_encoder.transform([raw_data.mode])[0]
        tech_stack = self.tech_stack_encoder.transform([raw_data.technologies])[0]
        contract_type_code = self.contract_type_encoder.transform([raw_data.contract])[
            0
        ]

        res = np.concatenate(
            [
                [contract_type_code, location_code, exp_code, operating_mode_code],
                tech_stack,
            ]
        ).reshape(1, -1)
        return pd.DataFrame(res)

    def salary(self) -> SalaryModelOutput:
        self.data.columns = self.model.feature_names_in_
        salary_pred = self.model.predict(self.data)

        return SalaryModelOutput(id=0, salary=np.round(salary_pred[0], 2))
