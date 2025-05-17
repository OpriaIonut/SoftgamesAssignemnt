import { Point } from "pixi.js";
import { DeckCard } from "./scripts/AceOfShadows/DeckCard"

export type DeckData =
{
    sprites: DeckCard[];
    pos: Point;
    offsetPos: Point;
}