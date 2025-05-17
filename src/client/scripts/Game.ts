import { Application, ColorSource, Container, Point } from "pixi.js";
import { initDevtools } from "@pixi/devtools"
import { Scene } from "./Utils/Scene";
import { uiManager } from "../client";

//Class responsible for all of the rendering logic, setting up the application, game loop and a couple of utility functions relevant to the webpage itself
export class Game
{
    private app!: Application;
    private scenes: Scene[] = []; //A list of all of the scenes that we can change between. When we change scenes, we remove all of the gfx in that scene and reset the scene to it's initial state.

    private activeSceneIndex: number = -1; //Minus 1 until we load a scene, then it will be equal to that scene's index

    private startTime: number = 0.0;
    private currentTime: number = 0.0;

    constructor(bgColor: ColorSource = 0x000000)
    {
        this.init(bgColor);
    }

    private init(bgColor: ColorSource)
    {
        //Create the app
        this.app = new Application({
            resizeTo: window,
            backgroundColor: bgColor
        });
        this.app.stage.sortableChildren = true;
        document.body.appendChild(this.app.view as HTMLCanvasElement);

        initDevtools({ app: this.app }); //Set up devtools to more easily inspect the logic with the chrome devtools extension.

        //Set up game loop
        this.app.ticker.add(() => { 
            this.update(); 
        });

        this.startTime = performance.now();
    }

    private update()
    {
        let timeSinceStartMS = performance.now();
        this.currentTime = (timeSinceStartMS - this.startTime) / 1000;
     
        //Update the current scene
        if(this.activeSceneIndex >= 0)
            this.scenes[this.activeSceneIndex].update();

        uiManager.displayFPS(this.app.ticker.FPS);
    }

    public getCurrentTime() 
    { 
        return this.currentTime; 
    }

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

    public addGfxStage(gfx: Container)
    {
        this.app.stage.addChild(gfx);
    }
    public removeGfxFromStage(gfx: Container)
    {
        this.app.stage.removeChild(gfx);
    }

    public changeScene(scene: Scene)
    {
        //Remove the gfx of the previous scene and reset if (if we were previously rendering a scene)
        if(this.activeSceneIndex >= 0)
        {
            this.app.stage.removeChild(this.scenes[this.activeSceneIndex].getScene());
            this.scenes[this.activeSceneIndex].reset();
        }

        //Find the current scene index
        for(let index = 0; index < this.scenes.length; ++index)
        {
            if(this.scenes[index] == scene)
            {
                this.activeSceneIndex = index;
                break;
            }
        }
        
        //Start rendering the new scene
        this.app.stage.addChild(this.scenes[this.activeSceneIndex].getScene());
        this.scenes[this.activeSceneIndex].start();
    }

    public enterFullscreenMode()
    {
        const canvas = this.app.view as HTMLCanvasElement;
        if (canvas.requestFullscreen)
            canvas.requestFullscreen();
    }

    public getWindowSize()
    {
        return new Point(this.app.view.width, this.app.view.height);
    }
}