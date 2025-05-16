import { BaseTexture, Point, Rectangle, Sprite, Texture } from "pixi.js";
import { game } from "../../client";
import { MathUtils } from "../Utils/MathUtils";

export class DeckCard
{
    private sprite: Sprite;
    private tex: Texture;

    private runAnimation: boolean = false;
    private animDuration: number = 100.0;
    private callback?: (card: DeckCard) => void;

    private zIndex: number = 0;
    private startPos: Point = new Point(0, 0);
    private endPos: Point = new Point(0, 0);
    private animStartTime: number = 0.0;

    constructor(texture: BaseTexture, rect: Rectangle, pos: Point, scale: Point)
    {
        this.tex = new Texture(texture, rect);
        this.sprite = new Sprite(this.tex);

        this.sprite.position.set(pos.x, pos.y);
        this.sprite.scale.set(scale.x, scale.y);

        game.addGfxToGame(this.sprite);
    }

    public update()
    {
        if(this.runAnimation)
        {
            let lerpVal = (game.getCurrentTime() - this.animStartTime) / this.animDuration;
            let newPos = MathUtils.lerpPoint(this.startPos!, this.endPos!, lerpVal);
            this.sprite.position.set(newPos.x, newPos.y);
            
            if(lerpVal >= 0.5 && this.sprite.zIndex != this.zIndex)
            {
                this.sprite.zIndex = this.zIndex;
            }

            if(lerpVal >= 1.0)
            {
                this.runAnimation = false;
                this.callback?.call(this, this);
            }
        }
    }

    public moveTo(location: Point, animDuration: number, newZIndex: number, onAnimationComplete?: (card: DeckCard) => void)
    {
        this.endPos.set(location.x, location.y);
        this.runAnimation = true;
        this.animDuration = animDuration;
        this.zIndex = newZIndex;
        this.callback = onAnimationComplete;
        
        this.startPos.set(this.sprite.position.x, this.sprite.position.y);
        this.animStartTime = game.getCurrentTime();
    }
}