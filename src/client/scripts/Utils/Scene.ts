import { Container } from "pixi.js";

export abstract class Scene
{
    protected scene: Container = new Container();

    public getScene() 
    { 
        return this.scene; 
    }
    public addGfxToScene(gfx: Container)
    {
        this.scene.addChild(gfx);
    }
    public removeGfxFromScene(gfx: Container)
    {
        this.scene.removeChild(gfx);
    }

    public abstract start(): void;
    public abstract update(): void;
    public abstract reset(): void;
}