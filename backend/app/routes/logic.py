import random
import time
from flask import Blueprint, jsonify, request
from app.logic.bin_packing import Dimension, generate_elements, place_packages_in_truck
from app.logic.vrp_tabu import VehicleRoutingProblem, tabu_search
from app.utils.utils import numpy_to_object
from app.utils.cities import get_distance_matrix_by_insee, get_city_by_insee

logic_bp = Blueprint("logic", __name__)


def to_dimension(json):
    return Dimension(json["width"], json["height"], json["length"])


@logic_bp.route("/api/logic/bin_packing", methods=["POST"])
def bin_packing():
    trucks = [
        to_dimension(truck)
        for truck
        in request.json["trucks"]
    ]
    packages = [
        to_dimension(package)
        for package
        in request.json["packages"]
    ]

    trucks_matrix = generate_elements(trucks, True)
    packages_matrix = generate_elements(packages, False)

    trucks_used, package_count, repartition = place_packages_in_truck(trucks_matrix, packages_matrix)

    return jsonify({
        "trucks_used": trucks_used,
        "package_count": package_count,
        "matrix": numpy_to_object(repartition),
    })


@logic_bp.route("/api/logic/vrp_tabu", methods=["POST"])
def vrp_tabu():
    start_preparation = time.perf_counter_ns()

    trucks_packages = request.json["trucks_packages"]
    start_cities_insee = request.json["start_cities"]
    deliver_cities_insee = request.json["deliver_cities"]

    cities_insee = list(set(start_cities_insee + deliver_cities_insee))
    start_cities = [cities_insee.index(insee) for insee in start_cities_insee]
    deliver_cities = [cities_insee.index(insee) for insee in deliver_cities_insee]

    if len(start_cities) < len(trucks_packages):
        for _ in range(len(trucks_packages) - len(start_cities)):
            start_cities.append(start_cities[random.randint(0, len(start_cities) - 1)])

    start_matrix = time.perf_counter_ns()
    matrix = get_distance_matrix_by_insee(cities_insee)

    vrp = VehicleRoutingProblem(
        matrix,
        len(trucks_packages),
        trucks_packages,
        start_cities,
        deliver_cities)

    start_vrp = time.perf_counter_ns()
    best_solution, best_cost = tabu_search(vrp, max_iterations=100, tabu_tenure=1000)

    start_response = time.perf_counter_ns()

    best_solution_response = []

    for truck in best_solution:
        truck_response = []
        for city in truck:
            city, _ = get_city_by_insee(cities_insee[city])
            truck_response.append({
                "name": city['properties']["NOM_COMM"],
                "insee": city['properties']["INSEE_COMM"],
                "lat": city['geometry']['coordinates'][1],
                "lon": city['geometry']['coordinates'][0],
            })
        best_solution_response.append(truck_response)

    return jsonify({
        "best_solution": best_solution_response,
        "best_cost": best_cost,
        "execution_times": {
            "preparation": (start_matrix - start_preparation) / 1e9,
            "matrix": (start_vrp - start_matrix) / 1e9,
            "vrp": (start_response - start_vrp) / 1e9,
            "response": (time.perf_counter_ns() - start_response) / 1e9,
            "total": (time.perf_counter_ns() - start_preparation) / 1e9,
        },
    })
