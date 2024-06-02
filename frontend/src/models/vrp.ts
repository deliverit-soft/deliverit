export interface VrpRequest {
    trucks_packages: number[];
    start_cities: string[];
    deliver_cities: string[];
}

export interface VrpResponse {
    best_cost: number;
    best_solution: VrpTravelCity[][];
}

export interface VrpResult {
    bestCost: number;
    bestSolution: VrpTravelCity[][];
}

export interface VrpTravelCity {
    insee: string;
    name: string;
    lat: number;
    lon: number;
}
