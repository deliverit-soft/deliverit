import json
import numpy as np
import tantivy
import time
from .utils import to_ascii
from .types import GeoJson, Feature, List
from typing import Optional
from numba import njit, prange

_cities: Optional[GeoJson] = None
_index: Optional[tantivy.Index] = None


def _load_cities():
    global _cities
    with open("./resources/cities.geojson", "r", encoding="utf-8") as f:
        _cities = json.load(f)


def _build_index():
    global _index, _cities

    start = time.time()

    # Create schema
    schema_builder = tantivy.SchemaBuilder()
    schema_builder.add_text_field("insee_code", stored=True)
    schema_builder.add_text_field("ascii_name", stored=True)
    schema_builder.add_text_field("name", stored=True)
    schema = schema_builder.build()

    # Create index
    _index = tantivy.Index(schema)

    # Load from JSON file
    with open("./resources/cities.geojson", "r", encoding="utf-8") as f:
        _cities = json.load(f)

    # Index cities
    writer = _index.writer()
    for city in _cities['features']:
        writer.add_document(tantivy.Document(
            insee_code=city['properties']["INSEE_COMM"],
            ascii_name=to_ascii(city['properties']["NOM_COMM"]),
            name=city['properties']["NOM_COMM"]
        ))

    docs = writer.commit()
    writer.wait_merging_threads()
    _index.reload()

    print(f'Indexed {docs} cities in {time.time() - start:.2f}s')


def get_cities() -> GeoJson:
    global _cities
    if _cities is None:
        _load_cities()
    return _cities


def get_index() -> tantivy.Index:
    global _index
    if _index is None:
        _build_index()
    return _index


def get_city_by_insee(insee_code: str) -> tuple[Feature, int]:
    cities = get_cities()
    for index, city in enumerate(cities['features']):
        if city['properties']['INSEE_COMM'] == insee_code:
            return city, index


@njit
def _haversine(lat1, lon1, lat2, lon2):
    R = 6371.0  # Earth radius in kilometers
    dlat = np.radians(lat2 - lat1)
    dlon = np.radians(lon2 - lon1)
    a = np.sin(dlat / 2) ** 2 + np.cos(np.radians(lat1)) * np.cos(np.radians(lat2)) * np.sin(dlon / 2) ** 2
    c = 2 * np.arctan2(np.sqrt(a), np.sqrt(1 - a))
    distance = R * c
    return distance


@njit(parallel=True)
def _calculate_distance_matrix(coords: np.ndarray) -> np.ndarray:
    num_cities = coords.shape[0]
    distance_matrix = np.zeros((num_cities, num_cities))

    for i in prange(num_cities):
        for j in range(i, num_cities):
            distance = _haversine(coords[i, 1], coords[i, 0], coords[j, 1], coords[j, 0])
            distance_matrix[i, j] = distance
            distance_matrix[j, i] = distance

    return distance_matrix


def get_distance_matrix_by_insee(insee_codes: List[str] | set[str]) -> np.ndarray:
    cities = [get_city_by_insee(insee_code)[0] for insee_code in insee_codes]
    coords = np.array([(city['geometry']['coordinates'][0], city['geometry']['coordinates'][1]) for city in cities])
    return _calculate_distance_matrix(coords)
