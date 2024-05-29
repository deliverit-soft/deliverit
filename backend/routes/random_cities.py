import random
from flask import request, jsonify
from utils.cities import cities


def random_cities():
    count = int(request.args.get("limit", 1))
    cities_count = max(1, min(len(cities['features']), 100))

    selected_cities = list()
    while len(selected_cities) < count:
        selected_cities.append(cities['features'][random.randint(0, cities_count - 1)])

    return jsonify(list({
        "insee_code": selected_cities['properties']['INSEE_COMM'],
        "name": selected_cities['properties']['NOM_COMM'],
    } for selected_cities in selected_cities))
