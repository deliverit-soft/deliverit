import json
import tantivy
import time
from .utils import to_ascii

start = time.time()

# Create schema
schema_builder = tantivy.SchemaBuilder()
schema_builder.add_text_field("insee_code", stored=True)
schema_builder.add_text_field("ascii_name", stored=True)
schema_builder.add_text_field("name", stored=True)
schema = schema_builder.build()

# Create index
index = tantivy.Index(schema)

# Load from JSON file
with open("./resources/cities.geojson", "r", encoding="utf-8") as f:
    cities = json.load(f)

# Index cities
writer = index.writer()
for city in cities['features']:
    writer.add_document(tantivy.Document(
        insee_code=city['properties']["INSEE_COMM"],
        ascii_name=to_ascii(city['properties']["NOM_COMM"]),
        name=city['properties']["NOM_COMM"]
    ))
writer.commit()

print(f'Indexed {len(cities["features"])} cities in {time.time() - start:.2f}s')
