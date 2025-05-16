import { Container } from "pixi.js";
import { game } from "../../client";

export abstract class Entity
{
    protected isInitialized: boolean = false;
    protected gfx?: Container = undefined;

    protected addGfxtoGame()
    {
        if(this.gfx == undefined)
            throw "Trying to render unitialized graphics. Make sure to properly load it beforehand.";

        game.addGfxToGame(this.gfx);
    }

    public init(): void
    {
        game.addEntity(this);
    }

    public abstract update(deltaTime: number): void;

    public discard(): void
    {
        if (this.gfx != undefined) 
            {
            game.removeGfxFromGame(this.gfx);
            this.gfx.destroy();
        }
    }
}