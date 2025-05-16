import { Assets, Sprite } from "pixi.js";
import { Entity } from "./Entity";
import { game } from "../../client";

export class GameSprite extends Entity
{
    private spriteSrc: string

    constructor(srcImage: string)
    {
        super();

        this.spriteSrc = srcImage;
        this.init();
    }
    
    public init()
    {
        super.init();

        Assets.load(this.spriteSrc).then((texture) => {
            this.gfx = new Sprite(texture);
            game.addGfxToGame(this.gfx);
        });
    }
    
    public update(deltaTime: number): void 
    {
        
    }
}