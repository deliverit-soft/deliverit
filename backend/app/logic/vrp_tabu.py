import pandas as pd
import numpy as np
import time
from typing import Optional, List


class VehicleRoutingProblem:
    """
    Class for the Vehicle Routing Problem (VRP).

    Attributes:
        distance_matrix (list): A 2D list representing the distance matrix between locations.
        num_vehicles (int): The number of available vehicles.
        parcels_per_vehicle (list): A list containing the number of parcels each vehicle must take.
        start_points (list): A list containing the starting points for each vehicle.
        num_locations (int): The number of locations (including the depot).
        solution (list): A list of lists representing the solution.
        best_solution (list): The best solution found.
        best_cost (float): The cost of the best solution.
        num_parcels (list): A list containing the number of parcels per vehicle.
    """

    distance_matrix: np.ndarray = None
    num_vehicles: Optional[int] = None
    parcels_per_vehicle: Optional[List[int]] = None
    start_points: Optional[List[int]] = None
    drop_offs: Optional[List[int]] = None
    num_locations = None
    solution = None
    best_solution = None
    best_cost = None
    num_parcels = None

    def __init__(self,
                 distance_matrix: np.ndarray,
                 num_vehicles: int,
                 parcels_per_vehicle: List[int],
                 start_points: List[int],
                 drop_offs: List[int]) -> None:
        """
        Initializes the VRP instance.

        Args:
            distance_matrix (ndarray): A 2D list representing the distance matrix between locations.
            num_vehicles (int): The number of available vehicles.
            parcels_per_vehicle (list): A list containing the number of parcels each vehicle must take.
            start_points (list): A list containing the starting points for each vehicle.
            drop_offs (list): A list containing the drop-off points for each parcel.
        """
        self.distance_matrix = distance_matrix
        self.num_vehicles = num_vehicles
        self.parcels_per_vehicle = parcels_per_vehicle
        self.start_points = start_points
        self.drop_offs = drop_offs

        # Number of locations (including the depot)
        self.num_locations = distance_matrix.shape[0]

        self.solution = self._initialize_solution()  # Solution initialization
        self.best_solution = self.solution  # Best solution found
        self.best_cost = self.evaluate(self.solution)  # Cost of the best solution

    def _initialize_solution(self) -> list:
        """Initializes a solution by assigning locations to vehicles.

        Returns:
            list: A list of lists representing the solution.
        """
        solutions = [[] for _ in range(self.num_vehicles)]

        for i in range(self.num_vehicles):
            route = [self.start_points[i]]  # Start route with the starting point
            drop_off = []
            parcel_count = self.parcels_per_vehicle[i]
            for _ in range(parcel_count):
                drop_off.append(self.drop_offs.pop(0))

            route.extend(drop_off)
            route.append(self.start_points[i])  # End route with the starting point
            solutions[i] = route

        return solutions

    def evaluate(self, solutions: list) -> float:
        """Evaluates the total cost (total distance) of a solution.

        Args:
            solutions (list): A list of lists representing the solution.

        Returns:
            float: The total cost of the solution.
        """
        total_distance = 0

        for route in solutions:
            if len(route) < 2:
                continue

            route_distance = 0
            for i in range(len(route) - 1):
                route_distance += self.distance_matrix[route[i], route[i + 1]]

            total_distance += route_distance

        return total_distance

    def get_neighbors(self, solutions: list) -> list:
        """Generates neighbors of a solution by swapping two locations in the same route.

        Args:
            solutions (list): a list of solutions

        Returns:
            list: a list of neighbor solutions
        """
        neighbors = []

        for k in range(self.num_vehicles):
            route = solutions[k]
            for i in range(1, len(route) - 1):  # Skip the first and last locations (start and end points)
                for j in range(i + 1, len(route) - 1):
                    neighbor = [route[:] for route in solutions]
                    neighbor[k][i], neighbor[k][j] = neighbor[k][j], neighbor[k][i]
                    neighbors.append(neighbor)

        return neighbors


def tabu_search(vrp: VehicleRoutingProblem, max_iterations: int, tabu_tenure: int) -> tuple:
    """Solves the Vehicle Routing Problem using Tabu Search.

    Args:
        vrp (VehicleRoutingProblem): An instance of the VRP class.
        max_iterations (int): The maximum number of iterations.
        tabu_tenure (int): The maximum number of solutions to keep in the Tabu list.

    Returns:
        tuple: A tuple containing the best solution and its cost.
    """
    tabu_list = []  # Tabu list to memorize recent solutions
    best_solution = vrp.solution  # Initial best solution
    best_cost = vrp.evaluate(best_solution)  # Cost of the initial best solution

    for _ in range(max_iterations):
        neighbors = vrp.get_neighbors(vrp.solution)  # Generates the neighbors of the current solution
        best_neighbor = None
        best_neighbor_cost = float("inf")

        # Evaluate each neighbor
        for neighbor in neighbors:
            cost = vrp.evaluate(neighbor)

            if neighbor not in tabu_list and cost < best_neighbor_cost:
                best_neighbor = neighbor
                best_neighbor_cost = cost

        # Update the best solution if a better neighbor is found
        if best_neighbor_cost < best_cost:
            best_solution = best_neighbor
            best_cost = best_neighbor_cost

        vrp.solution = best_neighbor  # Update the current solution
        tabu_list.append(best_neighbor)  # Add the neighbor to the Tabu list

        # Limit the size of the Tabu list
        if len(tabu_list) > tabu_tenure:
            tabu_list.pop(0)

    # Update the number of parcels per vehicle (excluding start and end points)
    vrp.num_parcels = [len(route) - 2 for route in best_solution]

    return best_solution, best_cost


def _ask_start_points(num_vehicles: int) -> list:
    """Get the starting points for each vehicle from the user.

    Args:
        num_vehicles (int): The number of vehicles.

    Returns:
        list: A list containing the starting points for each vehicle.
    """
    start_points = []

    for i in range(num_vehicles):
        while True:
            start_point = int(
                input(
                    f"Enter the starting point for truck {i + 1} (between 0 and 3000): "
                )
            )
            if 0 <= start_point <= 3000:
                start_points.append(start_point)
                break
            else:
                print("Invalid input. Please enter a number between 0 and 3000.")

    return start_points


if __name__ == "__main__":
    # Charger la matrice de distances depuis le fichier CSV
    _distance_matrix_file = '../generate/out/matrix-distances-3000.csv'  # Spécifiez le chemin vers votre fichier CSV
    _distance_df = pd.read_csv(_distance_matrix_file, index_col=0)

    # Convertir le DataFrame en numpy array
    _distance_matrix = _distance_df.to_numpy()

    # Vérifier la matrice de distances
    print(_distance_matrix)

    # Example parameters
    _num_trucks_with_packages = 2
    _num_different_packages_in_trucks = [30, 30]  # Exemple : chaque camion a un nombre différent de colis

    # Get the starting points from the user
    _start_points = _ask_start_points(_num_trucks_with_packages)

    # Initialize and run the VRP with the specified starting points
    _vrp = VehicleRoutingProblem(_distance_matrix,
                                 _num_trucks_with_packages,
                                 _num_different_packages_in_trucks,
                                 _start_points)

    _start_time = time.time()
    _best_solution, _best_cost = tabu_search(_vrp, max_iterations=100, tabu_tenure=5)
    _end_time = time.time()

    # Display the results
    print("Best Solution:")
    for _vehicle_index, _route in enumerate(_best_solution):
        _start_point = _vrp.start_points[_vehicle_index]
        if len(_route) > 2:
            print(f"Truck {_vehicle_index + 1}: Route {_route}")
        else:
            print(f"Truck {_vehicle_index + 1}: No parcels assigned")

    print("Cost:", _best_cost)
    print(f"Number of parcels per vehicle: {_vrp.num_parcels}")
    print(f"Execution time: {_end_time - _start_time} seconds")
