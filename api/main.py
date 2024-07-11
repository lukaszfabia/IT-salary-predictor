from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pymongo import MongoClient
from connect_to_mongo import create_connection
from get_salary import ComputeSalary

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

client: MongoClient = create_connection()
db = client["data_for_model"]


@api.get("/")
async def index():
    cursor = db["models_metrics_0.2"].find()

    results = []
    for doc in cursor:
        doc.pop("_id", None)
        results.append(doc)

    return JSONResponse(content=results)


@api.post("/api/get-salary/")
async def get_salary(data: dict):
    compute_salary = ComputeSalary(data)
    data = data.copy()
    data["salary"] = compute_salary.salary()
    return data


@api.get("/api/{kategory}")
async def get_data_about_kategory(kategory: str):
    if kategory not in ("exp", "modes", "contracts", "locations", "technologies"):
        return Response(status_code=204)
    else:
        collection = db[kategory]
        res = list(collection.find({}, {"_id": 0}))
        lowercased_documents = [{k.lower(): v for k, v in r.items()} for r in res]
        return JSONResponse(content=lowercased_documents[0], status_code=200)


# stats
@api.get("/api/salary-stats/")
async def get_salary_stats():
    cursor = db["salary_stats"].find()

    results = []
    for doc in cursor:
        doc.pop("_id", None)
        results.append(doc)

    return JSONResponse(content=results)


@api.get("/api/metrics/")
async def get_metrics():
    cursor = db["models_metrics_0.2"].find()

    results = []
    key_map = {
        "Model": "model",
        "Mean Absolute Error": "mae",
        "Root Mean Squared Error": "rmse",
        "R^2 Score": "r2",
    }

    for doc in cursor:
        doc.pop("_id", None)
        renamed_doc = {key_map.get(k, k): v for k, v in doc.items()}
        results.append(renamed_doc)

    return JSONResponse(content=results, status_code=200)


# power frontend/calculator


@api.get("/api/locations/")
async def get_locations():
    return {"locations": tmp.all_locations()}


@api.get("/api/experience/")
async def get_experience():
    return {"experience": tmp.all_exp()}


@api.get("/api/operating-modes/")
async def get_operating_modes():
    return {"operating_modes": tmp.all_operating_modes()}


@api.get("/api/technologies/")
async def get_tech_stacks():
    return {"tech_stacks": tmp.all_tech_stacks()}


@api.get("/api/contract-types/")
async def get_contract_types():
    return {"contract_types": tmp.all_contract_types()}
