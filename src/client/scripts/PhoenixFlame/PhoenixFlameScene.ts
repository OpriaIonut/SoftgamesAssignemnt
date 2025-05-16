import { AnimatedSprite, Assets, Spritesheet, ISpritesheetData } from "pixi.js";
import { Scene } from "../Utils/Scene";

export class PhoenixFlameScene extends Scene
{
    public async start() 
    {
        let spritesheetData = await Assets.load('/config/spritesheet.json');

        const flameData: ISpritesheetData = spritesheetData.flame;

        const atlasTexture = await Assets.load(flameData.meta.image as string);
        const spritesheet = new Spritesheet(atlasTexture, flameData);
        await spritesheet.parse();

        const animatedSprite = new AnimatedSprite(spritesheet.animations.flame)
        animatedSprite.anchor.set(0.5, 0.5);
        animatedSprite.position.set(window.innerWidth / 2, window.innerHeight / 2);
        animatedSprite.animationSpeed = 0.15
        animatedSprite.play();
        this.scene.addChild(animatedSprite);
    }

    public update(): void 
    {
        
    }

    public reset(): void 
    {
        
    }
}