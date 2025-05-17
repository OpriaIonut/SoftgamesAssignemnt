import { AnimatedSprite, Assets, Spritesheet, ISpritesheetData } from "pixi.js";
import { Scene } from "../Utils/Scene";

export class PhoenixFlameScene extends Scene
{
    private isInitialized: boolean = false;
    private animatedSprite?: AnimatedSprite;

    public async start() 
    {
        //If it's the first time we're running this scene, make sure to load everything it needs
        if(!this.isInitialized)
        {
            //Load the json data containing the animation
            //process.env.IMG_BASE_URL is needed because this project is deployed to Github Pages, where we need to pass a specific url to the fetch calls.
            //In dev mode it's empty, but in production it holds the specific url path needed.
            const spritesheetData = await Assets.load(process.env.IMG_BASE_URL + '/config/spritesheet.json');
            const flameData: ISpritesheetData = spritesheetData.flame;

            //Create a spritesheet from it
            const atlasTexture = await Assets.load((process.env.IMG_BASE_URL as string) + (flameData.meta.image as string));
            const spritesheet = new Spritesheet(atlasTexture, flameData);
            await spritesheet.parse();

            //Create the animated sprite
            this.animatedSprite = new AnimatedSprite(spritesheet.animations.flame);
            this.animatedSprite.anchor.set(0.5, 0.5);
            this.animatedSprite.position.set(window.innerWidth / 2, window.innerHeight / 2);
            this.animatedSprite.animationSpeed = 0.2;

            this.scene.addChild(this.animatedSprite);
            this.isInitialized = true;
        }

        this.animatedSprite?.play();
    }

    public update(): void 
    {
        
    }

    public reset(): void 
    {
        this.animatedSprite?.stop();
    }
}