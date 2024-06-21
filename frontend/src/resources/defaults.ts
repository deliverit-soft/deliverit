export const DEFAULT_BOUNDS: [ [ number, number ], [ number, number ] ] = [
    [ -5, 41.5 ],
    [ 8, 51.5 ],
];

const BOUNDS_PADDING = 3;
export const MAP_BOUNDS = [
    [ DEFAULT_BOUNDS[0][0] - BOUNDS_PADDING, DEFAULT_BOUNDS[0][1] - BOUNDS_PADDING ],
    [ DEFAULT_BOUNDS[1][0] + BOUNDS_PADDING, DEFAULT_BOUNDS[1][1] + BOUNDS_PADDING ],
];

export const PATHS_PACKAGES_COUNT = 5;

export const TRUCK_HIGH_SPEED = 5000;
export const TRUCK_LOW_SPEED = 100;

export const MAP_DRAW_DURATION = 2500;
