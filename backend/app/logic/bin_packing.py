import random
import numpy as np


# Object to generate a 3D array representing a truck
class Dimension:
    x = 0
    y = 0
    z = 0

    def __init__(self, x: int, y: int, z: int):
        self.x = x
        self.y = y
        self.z = z


# Function to generate a 3D array representing a truck
def TruckGenerate(dimension: Dimension):
    return np.zeros((dimension.x, dimension.y, dimension.z), dtype=int)


# Function to generate a package
def PackagesGenerate(quantity: int, minSize: int, maxSize: int):
    # If Truck is True, the list will be a list of trucks, otherwise it will be a list of packages
    packages = []
    for i in range(quantity):
        packages.append(np.full(
            (random.randint(minSize, maxSize), random.randint(minSize, maxSize), random.randint(minSize, maxSize)),
            i + 1, dtype=int))
    return packages


#
def ListGenerate(element, Truck: bool = False):
    List = []
    if not Truck:
        for i in range(len(element)):
            List.append(np.full((element[i].x, element[i].y, element[i].z), i + 1, dtype=int))
        return List

    for i in range(len(element)):
        List.append(np.zeros((element[i].x, element[i].y, element[i].z), dtype=int))
    return List

truck = [Dimension(3,3,3), Dimension(3,3,3), Dimension(3,3,3)]

print(ListGenerate(truck, False))



def place_packages_in_truck(trucks, packages):
    packages.sort(key=lambda x: np.prod(x.shape), reverse=True)

    PackageInFleet = []

    TruckFleet = []

    # Loop through the packages
    for package in range(len(packages)):
        # Get the shape of the package
        package_shape = packages[package].shape

        # Flag to check if the package is placed
        placed = False

        while not placed:
            index = 0

            for truck in TruckFleet:
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
                                PackageInFleet[index] += 1
                                print()

                                break  # Break the loop once the packages is placed
                index += 1

            if not placed and len(TruckFleet) != len(trucks):

                for types in range(len(trucks)):

                    # Check if there's enough space in the truck, if so, add the truck to the fleet
                    if len(packages[package]) <= np.count_nonzero(trucks[types] == 0):
                        TruckFleet.append(trucks.pop(types))
                        PackageInFleet.append(0)
                        break

            if not placed:
                placed = True

    # If all the packages are placed, return True
    return len(TruckFleet), PackageInFleet , TruckFleet






trucks = [TruckGenerate(Dimension(5, 5, 5)), TruckGenerate(Dimension(4, 4, 4)), TruckGenerate(Dimension(6, 6, 6))]
packages = PackagesGenerate(100, 1, 5)

print(place_packages_in_truck(trucks, packages))
