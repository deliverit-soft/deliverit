import random
from flask import request, jsonify, Blueprint
from app.utils.utils import to_ascii, clamp
from app.utils.cities import get_cities, get_index


cities_bp = Blueprint("cities", __name__)


@cities_bp.route("/api/cities/search")
def cities_search():
    user_query = request.args.get("query")
    user_query = to_ascii(user_query)
    limit = clamp(int(request.args.get("limit", 10)), 1, 100)

    searcher = get_index().searcher()
    query = get_index().parse_query(user_query)
    results = searcher.search(query, limit).hits
    hits = []
    for hit in results:
        doc = searcher.doc(hit[1])
        hits.append({
            "insee_code": doc.get_first("insee_code"),
            "name": doc.get_first("name"),
            "score": hit[0]
        })
    return jsonify(hits)


@cities_bp.route("/api/cities/random")
def random_cities():
    limit = clamp(int(request.args.get("limit", 1)), 1, len(get_cities()['features']))
    cities_count = clamp(len(get_cities()['features']), 1, limit) * 2

    selected_cities = list()
    tries = 0
    while len(selected_cities) < limit and tries < limit * 2:
        random_city = get_cities()['features'][random.randint(0, cities_count - 1)]
        if random_city not in selected_cities:
            selected_cities.append(random_city)
        tries += 1

    return jsonify(list({
        "insee_code": city['properties']['INSEE_COMM'],
        "name": city['properties']['NOM_COMM'],
    } for city in selected_cities))
