import { Application, ColorSource, Container, Text } from "pixi.js";
import { initDevtools } from "@pixi/devtools"
import { Scene } from "./Utils/Scene";

export class Game
{
    private app!: Application;
    private scenes: Scene[] = [];

    private activeSceneIndex: number = -1;

    private startTime: number = 0.0;
    private currentTime: number = 0.0;

    private fpsCounter!: Text;

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

        this.fpsCounter = new Text("FPS: 0", {
            fontSize: 22
        });
        this.fpsCounter.position.set(window.innerWidth - 50, 25);
        this.fpsCounter.anchor.set(1, 0);
        this.app.stage.addChild(this.fpsCounter);

        this.startTime = performance.now();
    }

    private update()
    {
        let timeSinceStartMS = performance.now();
        this.currentTime = (timeSinceStartMS - this.startTime) / 1000;

        let deltaTime = this.app.ticker.deltaMS * 0.001;
        let fps = this.app.ticker.FPS;
        this.fpsCounter.text = "FPS: " + Math.round(fps);
        
        if(this.activeSceneIndex >= 0)
            this.scenes[this.activeSceneIndex].update();
    }

    public getCurrentTime() { return this.currentTime; }

    public addScene(scene: Scene)
    {
        this.scenes.push(scene);
    }

    public removeScene(scene: Scene)
    {
        for(let index = 0; index < this.scenes.length; ++index)
        {
            if(this.scenes[index] == scene)
            {
                this.scenes.splice(index, 1);
                break;
            }
        }
    }

    public changeScene(scene: Scene)
    {
        if(this.activeSceneIndex >= 0)
        {
            this.app.stage.removeChild(this.scenes[this.activeSceneIndex].getScene());
            this.scenes[this.activeSceneIndex].reset();
        }

        for(let index = 0; index < this.scenes.length; ++index)
        {
            if(this.scenes[index] == scene)
            {
                this.activeSceneIndex = index;
                break;
            }
        }
        this.app.stage.addChild(this.scenes[this.activeSceneIndex].getScene());
        this.scenes[this.activeSceneIndex].start();
    }
}