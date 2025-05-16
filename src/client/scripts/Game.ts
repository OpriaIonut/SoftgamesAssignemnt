import { Application, ColorSource, Container } from "pixi.js";
import { initDevtools } from "@pixi/devtools"
import { Entity } from "./Utils/Entity";
import { deck } from "../client";

export class Game
{
    private app!: Application;
    private activeEntities: Entity[] = [];

    private startTime: number = 0.0;
    private currentTime: number = 0.0;

    constructor(bgColor: ColorSource = 0x000000)
    {
        this.init(bgColor);
    }

    private init(bgColor: ColorSource)
    {
        this.app = new Application({
            resizeTo: window,
            backgroundColor: bgColor
        });
        this.app.stage.sortableChildren = true;
        document.body.appendChild(this.app.view as HTMLCanvasElement);

        initDevtools({ app: this.app });
        this.app.ticker.add(() => { 
            this.update(); 
        });

        this.startTime = performance.now();
    }

    private update()
    {
        let timeSinceStartMS = performance.now();
        this.currentTime = (timeSinceStartMS - this.startTime) / 1000;

        let deltaTime = this.app.ticker.deltaMS * 0.001;
        let fps = this.app.ticker.FPS;
        
        this.activeEntities.forEach(entity => {
            entity.update(deltaTime);
        });

        deck.update();
    }

    public getCurrentTime() { return this.currentTime; }

    public addGfxToGame(gfx: Container)
    {
        this.app.stage.addChild(gfx);
    }

    public removeGfxFromGame(gfx: Container)
    {
        this.app.stage.removeChild(gfx);
    }

    public addEntity(entity: Entity)
    {
        this.activeEntities.push(entity);
    }

    public discardEntity(entity: Entity)
    {
        for(let index = 0; index < this.activeEntities.length; ++index)
        {
            if(this.activeEntities[index] == entity)
            {
                this.activeEntities.splice(index, 1);
                break;
            }
        }
        entity.discard();
    }
}