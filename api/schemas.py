from enum import Enum
from typing import List, Tuple
from pydantic import BaseModel


class Kategories(str, Enum):
    exp = "exp"
    modes = "modes"
    contracts = "contracts"
    locations = "locations"
    technologies = "technologies"


ACCEPTED_KATEGORIES: Tuple[Kategories] = (
    Kategories.contracts,
    Kategories.modes,
    Kategories.technologies,
    Kategories.exp,
    Kategories.locations,
)


class Collections(str, Enum):
    metrics = "models_metrics_0.2"
    salary_stats = "salary_stats"


class Kategory(BaseModel):
    id: int
    name: str


class Statistic(Kategory):
    multiplicity: int


class Model(Kategory):
    mae: float
    rmse: float
    r2: float


class SalaryStatsModel(BaseModel):
    id: int
    exp: str
    contract: str
    count: int
    mean: float
    min: float
    max: float


class SalaryModelInput(BaseModel):
    id: int
    city: str
    technologies: List[str]
    exp: str
    contract: str
    mode: str


class SalaryModelOutput(SalaryModelInput):
    salary: float
