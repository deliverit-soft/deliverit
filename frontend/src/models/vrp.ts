export interface VrpRequest {
    trucks_packages: number[];
    start_cities: string[];
    deliver_cities: string[];
}

export interface VrpResponse {
    best_cost: number;
    best_solution: VrpTravelCity[][];
    execution_times: VrpTimings;
}

export interface VrpResult {
    bestCost: number;
    bestSolution: VrpTravelCity[][];
    executionTimes: VrpTimings;
}

export interface VrpTravelCity {
    insee: string;
    name: string;
    lat: number;
    lon: number;
}

export interface VrpTimings {
    preparation: number;
    matrix: number;
    vrp: number;
    response: number;
    total: number;
}
