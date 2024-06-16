from dataclasses import dataclass


@dataclass(frozen=True)
class SalaryStats:
    exp: str
    contract: str
    count: int
    mean: float
    min: float
    max: float

    def __dict__(self):
        return {
            "exp": self.exp,
            "contract": self.contract,
            "count": self.count,
            "mean": self.mean,
            "min": self.min,
            "max": self.max,
        }
