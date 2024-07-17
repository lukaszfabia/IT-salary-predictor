from dataclasses import dataclass
from pathlib import Path
from pymongo import MongoClient
import pandas as pd
from sklearn.ensemble import GradientBoostingRegressor, RandomForestRegressor
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
from sklearn.model_selection import train_test_split
import numpy as np
from utils import save_obj, create_connection, get_collection_or_db

models_to_tune = {
    "RandomForestRegressor": {
        "model": RandomForestRegressor(),
        "params": {"n_estimators": [10, 30, 20, 50, 80]},
    },
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

    def __init__(self, data, models, db, split_size=0.2):
        self.__data = data
        self.__models = models
        self.__db = db
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
                "model": model.__class__.__name__,
                "mae": mean_absolute_error(self.__y_test, __y_pred).round(2),
                "rmse": score.round(2),
                "r2": r2_score(self.__y_test, __y_pred),
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

        if self.__db.get_collection(f"models_metrics_{self.__split_size}") is None:
            self.__db.create_collection(f"models_metrics_{self.__split_size}")
        else:
            self.__db[f"models_metrics_{self.__split_size}"].delete_many({})

        self.__db[f"models_metrics_{self.__split_size}"].insert_many(
            sorted(metrics_list, key=lambda x: x["rmse"])
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
        if self.__db.get_collection("pred_and_test_data") is None:
            self.__db.create_collection("pred_and_test_data")
        else:
            self.__db["pred_and_test_data"].delete_many({})

        self.__db["pred_and_test_data"].insert_many(df.to_dict(orient="records"))

    @property
    def get_best_model(self):
        return self.__best_model


@dataclass
class Person:
    name: str
    age: int


if __name__ == "__main__":
    client: MongoClient = create_connection()
    db = get_collection_or_db(client)
    #
    jobs = get_collection_or_db(client, "jobs")
    models_tuning = get_collection_or_db(client, "models_tuning")
    # for tests
    df = pd.DataFrame(list(jobs.find()))
    #
    model = LearnModel(df, models_to_tune, db)
    #
    best_model = model.get_best_model
    save_obj(Path(r"../../objects/best_model.pkl"), best_model)
    model.save_pred_and_test_values()
