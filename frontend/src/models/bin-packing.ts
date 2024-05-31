export type BinPackingMatrix = number[][][][];

export interface BinPackingResult {
    matrix: BinPackingMatrix;
    packagesCount: number[];
    trucksUsed: number;
}

export interface BinPackingRawResponse {
    matrix: BinPackingMatrix;
    package_count: number[];
    trucks_used: number;
}
