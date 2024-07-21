import os
from typing import Dict, List, Tuple
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
import pymongo
from api.schemas import (
    Kategory,
    ACCEPTED_KATEGORIES,
    Kategories,
    Model,
    PredTestData,
    SalaryStatsModel,
    SalaryModelOutput,
    SalaryModelInput,
    Statistic,
    Collections,
)
from api.analysis.db_connect.db import create_connection, get_collection_or_db
from api.get_salary import ComputeSalary
from fastapi import status
from api.analysis.models.data_model import Offer
from fastapi.responses import FileResponse

computer = ComputeSalary()


api = FastAPI()


api.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

    return {"output": compute_salary.salary()}


@api.get(
    "/api/{kategory}",
    status_code=status.HTTP_200_OK,
    response_model=List[Statistic],
    description="Get data about kategory",
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


@api.get(
    path="/api/tuning-data/",
    status_code=status.HTTP_200_OK,
    response_model=List[Statistic],
    description="Get params for models",
)
async def tuning():
    return {"not implemented": "sorry"}


@api.get(
    "/api/pred-test-data/",
    status_code=status.HTTP_200_OK,
    response_model=List[PredTestData],
    description="Get predicted values for test data",
)
async def pred_test_data():
    collection = get_collection_or_db(
        client, Collections.pred_and_test_data.value
    ).find({}, {"_id": 0})
    if not collection:
        return Response(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return [
            PredTestData(
                id=index,
                x=elem.get("y_test", 0.0),
                y=elem.get("y_pred", 0.0),
            )
            for index, elem in enumerate(collection)
        ]


# stats
@api.get(
    "/api/salary-stats/",
    response_model=List[SalaryStatsModel],
    status_code=status.HTTP_200_OK,
    description="Get all stats about salary",
)
async def get_salary_stats():
    try:
        cursor = (
            get_collection_or_db(client, Collections.salary_stats.value)
            .find()
            .sort("mean", pymongo.ASCENDING)
        )

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

    except Exception:
        return Response(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
            r2=round(elem.get("r2", 0.0), 2),
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


@api.get(
    "/api/sample/{amount}",
    response_model=List[Offer],
    status_code=status.HTTP_200_OK,
    description="Get sample of raw offer",
)
async def get_sample(amount: int):
    cursor = (
        get_collection_or_db(client, Collections.raw_offers.value)
        .find()
        .limit(amount)
        .sort("title", 1)
    )

    return [
        Offer(
            title=elem.get("title", ""),
            min_b2b=elem.get("min_b2b", 0.0),
            max_b2b=elem.get("max_b2b", 0.0),
            min_uop=elem.get("min_uop", 0.0),
            max_uop=elem.get("max_uop", 0.0),
            technologies=elem.get("technologies", []),
            locations=elem.get("locations", []),
            experience=elem.get("experience", ""),
            operating_mode=elem.get("operating_mode", ""),
        )
        for elem in cursor
    ]


@api.get(
    "/api/download/{name}",
    status_code=status.HTTP_200_OK,
    response_class=FileResponse,
    description="Download file: objects or report",
)
async def download(name: str):
    path: str = f"{os.getcwd()}/api/resources"
    report: str = "analysis_job_offers_in_poland_2024.pdf"
    objects: str = "objects.zip"

    match name:
        case "objects":
            return FileResponse(
                path=f"{path}/objects.zip",
                filename=objects,
                media_type="application/zip",
            )
        case "report":
            return FileResponse(
                path=f"{path}/main.pdf",
                filename=report,
                media_type="application/pdf",
            )
        case _:
            return Response(status_code=status.HTTP_400_BAD_REQUEST)
