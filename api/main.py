from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pymongo import MongoClient
import os
from get_salary import ComputeSalary
from bson import json_util

tmp = ComputeSalary()


api = FastAPI()

origins = [
    "http://localhost",
    "http://localhost:3000",
]

api.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

load_dotenv()
client = MongoClient(os.getenv("MONGO_URI"))
db = client["data_for_model"]


@api.get("/")
def index():
    cursor = db["models_metrics_0.2"].find()

    results = []
    for doc in cursor:
        doc.pop("_id", None)
        results.append(doc)

    return JSONResponse(content=results)


@api.post("/api/get-salary/")
def get_salary(data: dict):
    compute_salary = ComputeSalary(data)
    data = data.copy()
    data["salary"] = compute_salary.salary()
    return data


# power frontend


@api.get("/api/locations/")
def get_locations():
    return {"locations": tmp.all_locations()}


@api.get("/api/experience/")
def get_experience():
    return {"experience": tmp.all_exp()}


@api.get("/api/operating-modes/")
def get_operating_modes():
    return {"operating_modes": tmp.all_operating_modes()}


@api.get("/api/technologies/")
def get_tech_stacks():
    return {"tech_stacks": tmp.all_tech_stacks()}


@api.get("/api/contract-types/")
def get_contract_types():
    return {"contract_types": tmp.all_contract_types()}
