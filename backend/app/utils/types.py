from typing import List, TypedDict


class Properties(TypedDict):
    ID_RTE500: str
    INSEE_COMM: str
    NOM_COMM: str
    STATUT: str
    SUPERFICIE: int
    POPULATION: int


class Feature(TypedDict):
    type: str
    properties: Properties
    geometry: dict


class GeoJson(TypedDict):
    type: str
    features: List[Feature]
