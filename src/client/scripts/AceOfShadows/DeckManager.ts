import { Assets, BaseTexture, Rectangle, Texture, Sprite } from "pixi.js";
import { GameSprite } from "../Utils/GameSprite";
import { game } from "../../client";

export class DeckManager
{
    private spritesheet!: BaseTexture;
    private sprites: GameSprite[] = [];

    constructor(spritesheetSrc: string, spritesPerRow: number, spritesPerCol: number, spritesToDisplay: number)
    {
        this.init(spritesheetSrc, spritesPerRow, spritesPerCol, spritesToDisplay);
    }

    private async init(spritesheetSrc: string, spritesPerRow: number, spritesPerCol: number, spritesToDisplay: number)
    {
        const texture = await Assets.load(spritesheetSrc);

        this.spritesheet = texture.baseTexture;

        const spriteWidth = this.spritesheet.width / spritesPerRow;
        const spriteHeight = this.spritesheet.height / spritesPerCol;
        
        for(let index = 0; index < spritesToDisplay; ++index)
        {
            let y = Math.floor(index / spritesPerRow);
            let x = Math.floor(index - y * spritesPerRow);

            x *= spriteWidth;
            y *= spriteHeight;

            let rect = new Rectangle(x, y, spriteWidth, spriteHeight);
            const subTexture = new Texture(this.spritesheet, rect);
            const sprite = new Sprite(subTexture);
            sprite.position.set(x * 1.1, y * 1.1);

            game.addGfxToGame(sprite);
        }
    }
}