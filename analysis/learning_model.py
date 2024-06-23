from pathlib import Path
from pymongo import MongoClient
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor
from sklearn.linear_model import (
    LinearRegression,
    Ridge,
    Lasso,
    ElasticNet,
    ElasticNetCV,
)
from sklearn.model_selection import GridSearchCV
from sklearn.svm import SVR
from sklearn.tree import DecisionTreeRegressor
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from sklearn.model_selection import train_test_split
import numpy as np
from utils import save_obj
from dotenv import load_dotenv
import os

load_dotenv()
client = MongoClient(os.getenv("MONGO_URI"))
db = client["data_for_model"]

jobs = db.jobs
models_tuning = db.models_tuning

models_to_tune = {
    # "LinearRegression": {"model": LinearRegression(), "params": {}},
    # "DecisionTreeRegressor": {
    #     "model": DecisionTreeRegressor(),
    #     "params": {
    #         "max_depth": [2, 4, 6, 8, 10],
    #         "random_state": [0, 42],
    #         "min_samples_split": [2, 5, 10, 20],
    #     },
    # },
    "RandomForestRegressor": {
        "model": RandomForestRegressor(),
        "params": {"n_estimators": [10, 30, 20, 50, 80]},
    },
    # "Ridge": {"model": Ridge(), "params": {"alpha": [0.1, 0.5, 1, 2, 5, 10]}},
    # "Lasso": {"model": Lasso(), "params": {"alpha": [0.1, 0.5, 1, 2, 5, 10]}},
    # "ElasticNet": {
    #     "model": ElasticNet(),
    #     "params": {"alpha": [0.1, 0.5, 1, 2, 5, 10], "l1_ratio": [0.1, 0.5, 0.7, 0.9]},
    # },
    # "ElasticNetCV": {
    #     "model": ElasticNetCV(),
    #     "params": {"l1_ratio": [0.1, 0.5, 0.7, 0.9]},
    # },
    # "SVR": {
    #     "model": SVR(),
    #     "params": {
    #         "C": [0.1, 1, 10, 100],
    #         "gamma": [1, 0.1, 0.01, 0.001],
    #         "kernel": ["rbf"],
    #     },
    # },
    "GradientBoostingRegressor": {
        "model": GradientBoostingRegressor(),
        "params": {
            "n_estimators": [100, 200, 300],
            "learning_rate": [0.1, 0.05, 0.01],
            "max_depth": [4, 8],
        },
    },
}


class LearnModel:

    def __init__(self, data, models, split_size=0.2):
        self.__data = data
        self.__models = models
        self.__split_size = split_size

        self.__tmp_data = self.__data.copy()

        self.__features = self.__tmp_data.drop(columns=["avg_salary", "_id"], axis=1)
        self.__lables = self.__tmp_data[["avg_salary"]]

        self.__salary = self.__lables["avg_salary"]

        self.__x_train, self.__x_test, self.__y_train, self.__y_test = train_test_split(
            self.__features, self.__salary, test_size=self.__split_size, random_state=42
        )

        # overwriting the models
        self._tune_models()
        self.__models = self._set_best_params()

        self.__best_model = self._get_best_model()

    def _tune_models(self):
        models_tuning.delete_many({})  # clearing the collection

        for name, value in self.__models.items():
            clf = GridSearchCV(
                value["model"], value["params"], cv=5, scoring="neg_mean_squared_error"
            )
            clf.fit(self.__x_train, self.__y_train)

            models_tuning.insert_one(
                {
                    "model": name,
                    "best_params": clf.best_params_,
                    "best_score": clf.best_score_,
                }
            )

    def _set_best_params(self):
        models = []
        for model in self.__models:
            best_params = models_tuning.find_one({"model": model})["best_params"]
            models.append(self.__models[model]["model"].set_params(**best_params))

        return models

    def _get_best_model(self):
        metrics_list = []

        def eval_model(model):
            model.fit(self.__x_train, self.__y_train)
            # score = model.score(x_test, y_test)
            __y_pred = model.predict(self.__x_test)
            score = np.sqrt(mean_squared_error(self.__y_test, __y_pred))
            metrics = {
                "Model": model.__class__.__name__,
                "Mean Absolute Error": mean_absolute_error(
                    self.__y_test, __y_pred
                ).round(2),
                "Root Mean Squared Error": score.round(2),
                "R^2 Score": r2_score(self.__y_test, __y_pred),
            }

            return score, metrics

        best_score = float("inf")
        best_model = None

        for model in self.__models:
            score, metrics = eval_model(model)
            if score < best_score:
                best_score = score
                best_model = model
            metrics_list.append(metrics)

        if db.get_collection(f"models_metrics_{self.__split_size}") is None:
            db.create_collection(f"models_metrics_{self.__split_size}")
        else:
            db[f"models_metrics_{self.__split_size}"].delete_many({})

        db[f"models_metrics_{self.__split_size}"].insert_many(
            sorted(metrics_list, key=lambda x: x["Root Mean Squared Error"])
        )

        return best_model

    def save_pred_and_test_values(self) -> None:
        __y_pred = self.__best_model.predict(self.__x_test)
        df = pd.DataFrame(
            {
                "y_test": self.__y_test,
                "y_pred": __y_pred,
            }
        )
        if db.get_collection("pred_and_test_data") is None:
            db.create_collection("pred_and_test_data")
        else:
            db["pred_and_test_data"].delete_many({})

        db["pred_and_test_data"].insert_many(df.to_dict(orient="records"))

    @property
    def get_best_model(self):
        return self.__best_model


if __name__ == "__main__":
    df = pd.DataFrame(list(jobs.find()))

    model = LearnModel(df, models_to_tune)

    best_model = model.get_best_model
    save_obj(Path(r"../objects/best_model.pkl"), best_model)
    model.save_pred_and_test_values()
