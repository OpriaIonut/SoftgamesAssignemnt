import { AnimatedSprite, Assets, Spritesheet, ISpritesheetData } from "pixi.js";
import { Scene } from "../Utils/Scene";

export class PhoenixFlameScene extends Scene
{
    private isInitialized: boolean = false;
    private animatedSprite?: AnimatedSprite;

    public async start() 
    {
        if(!this.isInitialized)
        {
            const spritesheetData = await Assets.load('/config/spritesheet.json');
            const flameData: ISpritesheetData = spritesheetData.flame;

            const atlasTexture = await Assets.load(flameData.meta.image as string);
            const spritesheet = new Spritesheet(atlasTexture, flameData);
            await spritesheet.parse();

            this.animatedSprite = new AnimatedSprite(spritesheet.animations.flame)
            this.animatedSprite.anchor.set(0.5, 0.5);
            this.animatedSprite.position.set(window.innerWidth / 2, window.innerHeight / 2);
            this.animatedSprite.animationSpeed = 0.15
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