import json
import tantivy
import time
from .utils import to_ascii
from .types import GeoJson, Feature
from typing import Optional

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
