import random
from flask import request, jsonify, Blueprint
from app.utils import utils
from app.utils.cities import get_cities, get_index


cities_bp = Blueprint("cities", __name__)


@cities_bp.route("/api/cities/search")
def cities_search():
    user_query = request.args.get("query")
    user_query = utils.to_ascii(user_query)
    limit = int(request.args.get("limit", 10))

    searcher = get_index().searcher()
    query = get_index().parse_query(user_query)
    results = searcher.search(query, limit).hits
    hits = []
    for hit in results:
        doc = searcher.doc(hit[1])
        hits.append({
            "insee_code": int(doc.get_first("insee_code")),
            "name": doc.get_first("name"),
            "score": hit[0]
        })
    return jsonify(hits)


@cities_bp.route("/api/cities/random")
def random_cities():
    count = int(request.args.get("limit", 1))
    cities_count = max(1, min(len(get_cities()['features']), 100))

    selected_cities = list()
    while len(selected_cities) < count:
        selected_cities.append(get_cities()['features'][random.randint(0, cities_count - 1)])

    return jsonify(list({
        "insee_code": int(city['properties']['INSEE_COMM']),
        "name": city['properties']['NOM_COMM'],
    } for city in selected_cities))
