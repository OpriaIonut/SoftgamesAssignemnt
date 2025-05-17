import { Point } from "pixi.js";

//Utility function for math formulas
export class MathUtils
{
    public static lerpNumber(a: number, b: number, lerpVal: number)
    {
        return a + (b - a) * lerpVal;
    }

    public static lerpPoint(a: Point, b: Point, lerpVal: number)
    {
        return new Point(this.lerpNumber(a.x, b.x, lerpVal), this.lerpNumber(a.y, b.y, lerpVal));
    }
}