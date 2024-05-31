import random
from app.logic.bin_packing import Dimension, generate_truck, packages_generate, place_packages_in_truck


def test_number_packages():
    random.seed(a=0)

    test_trucks = [
        generate_truck(Dimension(5, 5, 5)),
        generate_truck(Dimension(4, 4, 4)),
        generate_truck(Dimension(6, 6, 6))
    ]
    test_packages = packages_generate(100, 1, 5)

    result = place_packages_in_truck(test_trucks, test_packages)

    assert result[0] == 3
    assert len(result[1]) == 3
    assert len(result[2]) == 3
