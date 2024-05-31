import random
import numpy as np


class Dimension:
    """
    Class to represent the dimension of a truck or a package
    """
    x = 0
    y = 0
    z = 0

    def __init__(self, x: int, y: int, z: int):
        self.x = x
        self.y = y
        self.z = z


def generate_truck(dimension: Dimension):
    """
    Function to generate a 3D array representing a truck
    :param dimension: Dimension of the truck
    :return: 3D array representing the truck
    """
    return np.zeros((dimension.x, dimension.y, dimension.z), dtype=int)


def packages_generate(quantity: int, min_size: int, max_size: int):
    """
    Function to generate a list of packages
    :param quantity: Number of packages to generate
    :param min_size: Minimum size of the packages
    :param max_size: Maximum size of the packages
    :return: List of packages
    """
    # If Truck is True, the list will be a list of trucks, otherwise it will be a list of packages
    packages = []
    for i in range(quantity):
        packages.append(
            np.full(
                (
                    random.randint(min_size, max_size),
                    random.randint(min_size, max_size),
                    random.randint(min_size, max_size)
                ),
                i + 1, dtype=int
            )
        )
    return packages


def generate_elements(element, is_truck: bool = False):
    """
    Function to generate a list of 3D arrays
    :param element: List of dimensions
    :param is_truck: Flag to check if the list is a list of trucks
    :return: List of 3D arrays
    """
    results = []
    if not is_truck:
        for i in range(len(element)):
            results.append(np.full((element[i].x, element[i].y, element[i].z), i + 1, dtype=int))
        return results

    for i in range(len(element)):
        results.append(np.zeros((element[i].x, element[i].y, element[i].z), dtype=int))
    return results


def place_packages_in_truck(trucks, packages):
    """
    Bin packing algorithm to place packages inside trucks
    :param trucks: List of trucks
    :param packages: List of packages
    :return: Number of trucks used, number of packages in each truck, and the truck fleet
    """
    packages.sort(key=lambda x: np.prod(x.shape), reverse=True)

    package_in_fleet = []

    truck_fleet = []

    # Loop through the packages
    for package in range(len(packages)):
        # Get the shape of the package
        package_shape = packages[package].shape

        # Flag to check if the package is placed
        placed = False

        while not placed:
            index = 0

            for truck in truck_fleet:
                if placed:
                    break

                # Loop through the truck
                for i in range(truck.shape[0]):
                    if placed:
                        break

                    for j in range(truck.shape[1]):
                        if placed:
                            break

                        for k in range(truck.shape[2]):

                            # Check if the package can fit in the truck
                            if not (i + package_shape[0] <= truck.shape[0]
                                    and j + package_shape[1] <= truck.shape[1]
                                    and k + package_shape[2] <= truck.shape[2]):
                                continue

                            # Check if all the cells in the truck where the package will be placed are empty
                            if np.all(
                                    truck[i:i + package_shape[0], j:j + package_shape[1], k:k + package_shape[2]] == 0):
                                # Place the package in the truck and remove it from the list
                                truck[i:i + package_shape[0], j:j + package_shape[1], k:k + package_shape[2]] = \
                                    packages[package]

                                placed = True
                                package_in_fleet[index] += 1

                                break  # Break the loop once the packages is placed
                index += 1

            if not placed and len(trucks) != 0:

                for types in range(len(trucks)):

                    # Check if there's enough space in the truck, if so, add the truck to the fleet
                    if len(packages[package]) <= np.count_nonzero(trucks[types] == 0):
                        truck_fleet.append(trucks.pop(types))
                        package_in_fleet.append(0)
                        break

            if not placed:
                placed = True

    # If all the packages are placed, return True
    return len(truck_fleet), package_in_fleet, truck_fleet


if __name__ == "__main__":
    test_trucks = [Dimension(3, 3, 3), Dimension(3, 3, 3), Dimension(3, 3, 3)]
    print(generate_elements(test_trucks, False))

    test_trucks = [
        generate_truck(Dimension(5, 5, 5)),
        generate_truck(Dimension(4, 4, 4)),
        generate_truck(Dimension(6, 6, 6))
    ]
    test_packages = packages_generate(100, 1, 5)
    print(place_packages_in_truck(test_trucks, test_packages))
