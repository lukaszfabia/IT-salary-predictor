import json
from utils import create_connection, get_collection_or_db, read_obj
from pathlib import Path
from dotenv import load_dotenv
from pymongo import MongoClient
import os
from pandas import DataFrame
from models.wrappers import SalaryStats
from models.constants import CodeNames
from pymongo.database import Database


class Analysis:
    __path_to_encoders = Path("../../objects/encoders/")

    def __init__(self, db: Database) -> None:
        self.__contract_type_en = read_obj(
            self.__path_to_encoders / "contract_type_en.pkl"
        )

        self.__exp_en = read_obj(self.__path_to_encoders / "exp_en.pkl")

        self.__location_en = read_obj(self.__path_to_encoders / "location_en.pkl")

        self.__operating_mode_en = read_obj(
            self.__path_to_encoders / "operating_mode_en.pkl"
        )

        self.technologies_en = read_obj(self.__path_to_encoders / "tech_stack_en.pkl")

        self.__db = db

        self.__data: DataFrame = DataFrame(list(self.__db["jobs"].find()))

    def stats_for_salaries(self) -> None:
        exp_code = self.__data["experience_code"].value_counts().index
        exp_name = self.__exp_en.inverse_transform(exp_code)
        contracts = self.__data["contract_type_code"].value_counts().index
        contracts_name = self.__contract_type_en.inverse_transform(contracts)

        for exp in exp_name:
            exp_code = self.__exp_en.transform([exp])[0]
            for contract in contracts_name:
                contract_code = self.__contract_type_en.transform([contract])[0]
                subset = self.__data[
                    (self.__data["experience_code"] == exp_code)
                    & (self.__data["contract_type_code"] == contract_code)
                ]

                self.__db.salary_stats.insert_one(
                    SalaryStats(
                        exp,
                        contract,
                        subset.shape[0],
                        subset["avg_salary"].mean(),
                        subset["avg_salary"].min(),
                        subset["avg_salary"].max(),
                    ).__dict__()
                )

    def most_popular(self, collection_name, first_col, encoder, last_col=None):
        if collection_name not in self.__db.list_collection_names():
            self.__db.create_collection(collection_name)

        if not last_col:
            value_counts = self.__data[first_col].value_counts().head(12)
            names = encoder.inverse_transform(value_counts.index)
            value_counts.index = names
            self.__db[collection_name].insert_one(value_counts.to_dict())
        else:
            columns = self.__data.loc[:, first_col:last_col]

            sum_of_columns = columns.sum().sort_values(ascending=False)
            self.__db[collection_name].insert_one(sum_of_columns.to_dict())

    @property
    def get_location_en(self):
        return self.__location_en

    @property
    def get_contract_type_en(self):
        return self.__contract_type_en

    @property
    def get_exp_en(self):
        return self.__exp_en

    @property
    def get_operating_mode_code_en(self):
        return self.__operating_mode_en


if __name__ == "__main__":
    client = create_connection()
    analysis = Analysis(get_collection_or_db(client))
    # analysis.stats_for_salaries()
    analysis.most_popular(
        collection_name="technologies",
        first_col="AWS",
        last_col="android",
        encoder=analysis.get_location_en,
    )
