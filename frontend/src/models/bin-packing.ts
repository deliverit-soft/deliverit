export type BinPackingMatrix = number[][][][];

export interface BinPackingResult {
    matrix: BinPackingMatrix;
    packageCountPerTruck: number[];
    packagesPlaced: number;
    trucksUsed: number;
    totalSlots: number;
    slotsUsed: number;
}

export interface BinPackingRawResponse {
    matrix: BinPackingMatrix;
    package_count: number[];
    trucks_used: number;
}
