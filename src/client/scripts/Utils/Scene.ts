import { Container } from "pixi.js";

//Base class responsible for managing scene-specific logic and visuals. Through the game scene we are able to change between multiple scenes and reset them to their initial states
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

    public abstract start(): void; //Called when we start rendering a scene
    public abstract update(): void; //Called every frame while this scene is being rendered
    public abstract reset(): void; //Called when we stop rendering this scene. Should reset everything to it's initial state (can still keep cached data for later use)
}