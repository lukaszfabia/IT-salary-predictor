from pymongo import MongoClient
import pandas as pd
from sklearn.preprocessing import LabelEncoder, MultiLabelBinarizer
from utils import split_contracts, replace_synonyms, save_obj
from pathlib import Path
import subprocess
from dotenv import load_dotenv
import os


load_dotenv()
client = MongoClient(os.getenv("MONGO_URI"))
db = client["data_for_model"]

default_dir_encoders = Path("../objects/encoders/")
subprocess.run(["mkdir", "-p", str(default_dir_encoders)])  # for unix <3


# used collections
models_tuning = db.models_tuning
jobs = db.jobs
jobs.delete_many({})  # clear collection
raw_offers = db.raw_offers


# encoders

location_encoder = LabelEncoder()
exp_encoder = LabelEncoder()
mode_encoder = LabelEncoder()
mlb = MultiLabelBinarizer()
# read data from db file
df = pd.DataFrame(list(raw_offers.find()))

split_rows = df.apply(lambda row: pd.DataFrame(split_contracts(row)), axis=1)
df = pd.concat(split_rows.values.tolist(), ignore_index=True)

contract_type_encoder = LabelEncoder()
df["contract_type_code"] = contract_type_encoder.fit_transform(df["contract_type"])
df = df.drop(columns=["contract_type", "min_b2b", "max_b2b", "min_uop", "max_uop"])

df["locations"] = df["locations"].apply(replace_synonyms)
df = df.explode("locations")
df["location"] = df["locations"]

df["location_code"] = location_encoder.fit_transform(df["location"])

df["experience_code"] = exp_encoder.fit_transform(df["experience"])
df["operating_mode_code"] = mode_encoder.fit_transform(df["operating_mode"])
df = df.drop(columns=["locations", "operating_mode", "experience", "location"])

df = df.join(
    pd.DataFrame(
        mlb.fit_transform(df.pop("technologies")),
        columns=mlb.classes_,
        index=df.index,
    )
)


df = df.drop(columns=["title", "_id"])
df = df.drop_duplicates()
df = df.dropna()
# removing outlayers
rows_to_drop = df[(df["avg_salary"] < 1000) | (df["avg_salary"] > 40000)].index
df = df.drop(rows_to_drop)

df.columns = df.columns.str.strip()

db["jobs"].insert_many(df.to_dict(orient="records"))

# save encoders
save_obj(Path(default_dir_encoders / "location_en.pkl"), location_encoder)
save_obj(Path(default_dir_encoders / "exp_en.pkl"), exp_encoder)
save_obj(Path(default_dir_encoders / "operating_mode_en.pkl"), mode_encoder)
save_obj(Path(default_dir_encoders / "tech_stack_en.pkl"), mlb)
save_obj(Path(default_dir_encoders / "contract_type_en.pkl"), contract_type_encoder)
