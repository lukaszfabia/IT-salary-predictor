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
    raw_offers = "raw_offers"
    pred_and_test_data = "pred_and_test_data"


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
    city: str
    technologies: List[str]
    experience: str
    contract: str
    mode: str


class SalaryModelOutput(BaseModel):
    salary: float


class PredTestData(BaseModel):
    """Wraps y_test, y_pred"""

    id: int
    x: float
    y: float
