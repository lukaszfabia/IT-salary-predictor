from typing import Dict, List, Tuple
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from schemas import (
    Kategory,
    ACCEPTED_KATEGORIES,
    Kategories,
    Model,
    SalaryStatsModel,
    SalaryModelOutput,
    SalaryModelInput,
    Statistic,
    Collections,
)
from analysis.utils import create_connection, get_collection_or_db
from get_salary import ComputeSalary
from fastapi import status


computer = ComputeSalary()


api = FastAPI()

origins = [
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
db = get_collection_or_db(client)


@api.get("/")
async def index():
    return {"Hello Ima Fast", "FastAPI"}


@api.post(
    "/api/get-salary/",
    response_model=SalaryModelOutput | dict,
    status_code=status.HTTP_200_OK,
    description="Calculate salary",
)
async def get_salary(data: SalaryModelInput):
    compute_salary = ComputeSalary(data)
    # we can assume that we dont need addional data cuz i dont want to route on the fake endpoint
    # output can be next to input

    return {"salary": compute_salary.salary()}


@api.get(
    "/api/{kategory}", status_code=status.HTTP_200_OK, response_model=List[Statistic]
)
async def get_data_about_kategory(kategory: str):
    if kategory not in ACCEPTED_KATEGORIES:
        return Response(status_code=status.HTTP_400_BAD_REQUEST)
    else:
        collection: List[Dict[Tuple]] = list(
            get_collection_or_db(client, kategory).find({}, {"_id": 0})
        )
        data: Dict[Tuple] = dict(collection[0])  # there is always first elem
        return [
            Statistic(id=index, name=value[0], multiplicity=value[1])
            for index, value in enumerate(data.items())
        ]


# stats
@api.get(
    "/api/salary-stats/",
    response_model=List[SalaryStatsModel],
    status_code=status.HTTP_200_OK,
    description="Get all stats about salary",
)
async def get_salary_stats():
    cursor = get_collection_or_db(Collections.salary_stats.value).find()

    return [
        SalaryStatsModel(
            id=index,
            exp=elem.get("exp", ""),
            contract=elem.get("contract", ""),
            count=elem.get("count", 0),
            mean=elem.get("mean", 0.0),
            min=elem.get("min", 0.0),
            max=elem.get("max", 0.0),
        )
        for index, elem in enumerate(cursor)
    ]


@api.get(
    "/api/metrics/",
    response_model=List[Model],
    status_code=status.HTTP_200_OK,
    description="Get all computed metrics",
)
async def get_metrics():
    cursor = get_collection_or_db(client, Collections.metrics.value).find()

    return [
        Model(
            id=index,
            name=elem.get("model", ""),
            mae=elem.get("mae", 0.0),
            rmse=elem.get("rmse", 0.0),
            r2=elem.get("r2", 0.0),
        )
        for index, elem in enumerate(cursor)
    ]


# static data from objects


@api.get(
    "/api/{name}/",
    response_model=List[Kategory],
    status_code=status.HTTP_200_OK,
    description="avaiable names: exp, modes, contracts, locations, technologies",
)
async def get_locations(name: str):
    match name:
        case Kategories.exp:
            return computer.all_exp()
        case Kategories.locations:
            return computer.all_locations()
        case Kategories.modes:
            return computer.all_operating_modes()
        case Kategories.technologies:
            return computer.all_tech_stacks()
        case Kategories.contracts:
            return computer.all_contract_types()
        case _:
            return Response(status_code=status.HTTP_400_BAD_REQUEST)
