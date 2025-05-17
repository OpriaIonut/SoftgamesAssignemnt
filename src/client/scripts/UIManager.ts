import { Text } from "pixi.js";
import { game } from "../client";
import { Scene } from "./Utils/Scene";

//Class responsible for creating and managing the ui that will be identic in all of the scenes
export class UIManager
{
    private fpsCounter!: Text;

    constructor(scenes: Map<string, Scene>)
    {
        this.init(scenes);
    }

    private init(scenes: Map<string, Scene>)
    {
        const fullscreenBtn = document.getElementById("fullscreenBtn") as HTMLButtonElement;
        fullscreenBtn.addEventListener('click', () => {
            game.enterFullscreenMode();
        })

        //Detech when we want to change between scenes
        const sceneSelectionDropdown = document.getElementById("sceneChangerDropdown") as HTMLSelectElement;
        sceneSelectionDropdown.addEventListener('change', () => {
            const value = sceneSelectionDropdown.value;
            if(!scenes.has(value))
                console.log("Could not change scene, make sure to properly implement the value: " + value);
            else
                game.changeScene(scenes.get(value) as Scene);
        });

        //Create the fps counter
        this.fpsCounter = new Text("FPS: 0", {
            fontSize: 22
        });
        this.fpsCounter.position.set(window.innerWidth - 50, 25);
        this.fpsCounter.anchor.set(1, 0);
        game.addGfxStage(this.fpsCounter);
    }

    public displayFPS(fps: number)
    {
        this.fpsCounter.text = "FPS: " + Math.round(fps);
    }
}