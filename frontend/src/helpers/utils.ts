export const randint = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
export const range = (min: number, max: number) => Array.from({ length: randint(min, max) }, (_, i) => i + min);
