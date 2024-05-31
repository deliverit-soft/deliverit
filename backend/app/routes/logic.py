from flask import Blueprint, jsonify, request
from app.logic.bin_packing import Dimension, generate_elements, place_packages_in_truck
from app.utils.utils import numpy_to_object

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
