import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Move {
    to: Position;
    direction: Direction;
    from: Position;
}
export interface Position {
    x: number;
    y: number;
}
export enum Direction {
    east = "east",
    west = "west",
    south = "south",
    north = "north"
}
export interface backendInterface {
    createMove(from: Position, direction: Direction): Promise<Move>;
    getAllValidMoves(): Promise<Array<[Position, Position]>>;
}
