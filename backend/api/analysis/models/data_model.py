from dataclasses import dataclass
from typing import List


@dataclass(frozen=True)
class Offer:
    title: str
    min_b2b: float
    max_b2b: float
    min_uop: float
    max_uop: float
    technologies: List[str]
    locations: List[str]
    experience: str  # Junior, Mid, Senior, so there could be dict or enum for this
    operating_mode: str  # the same as above for this, Statiodary, Remote, Hybrid

    def __str__(self) -> str:
        return f"{self.title}, {self.min_b2b}, {self.max_b2b}, {self.min_uop}, {self.max_uop}, {self.technologies}, {self.locations}, {self.experience}, {self.operating_mode}"

    def __dict__(self) -> dict:
        return {
            "title": self.title,
            "min_b2b": self.min_b2b,
            "max_b2b": self.max_b2b,
            "min_uop": self.min_uop,
            "max_uop": self.max_uop,
            "technologies": self.technologies,
            "locations": self.locations,
            "experience": self.experience,
            "operating_mode": self.operating_mode,
        }
