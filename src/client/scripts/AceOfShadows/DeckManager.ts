import { Assets, BaseTexture, Rectangle, Texture, Sprite, Point } from "pixi.js";
import { game } from "../../client";
import { DeckCard } from "./DeckCard";

export class DeckManager
{
    private spritesheet!: BaseTexture;
    private deck1Sprites: DeckCard[] = [];
    private deck2Sprites: DeckCard[] = [];

    private cardsInTransition: DeckCard[] = [];

    private deck1Pos: Point;
    private deck2Pos: Point;
    private topCardOffset: Point;
    private cardScale: Point;

    private cardsMoved: number = 0;

    private lastCardMoveTime: number = 0.0;
    private cardDeckSwitchCooldown: number = 1.0;
    private cardAnimationTime: number = 2.0;

    constructor(spritesheetSrc: string, spritesPerRow: number, spritesPerCol: number, spritesToDisplay: number)
    {
        this.deck1Pos = new Point(window.innerWidth / 4, window.innerHeight / 2);
        this.deck2Pos = new Point(window.innerWidth * 3 / 4, window.innerHeight / 2);
        this.topCardOffset = new Point(30, 30);
        this.cardScale = new Point(2, 2);

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
            let card = new DeckCard(this.spritesheet, rect, this.deck1Pos, this.cardScale);
            this.deck1Sprites.push(card);
        }
    }

    public update()
    {
        let currentTime = game.getCurrentTime()
        if(this.deck1Sprites.length > 0 && currentTime - this.lastCardMoveTime > this.cardDeckSwitchCooldown)
        {
            let topCardIndex = this.deck1Sprites.length - 1;
            this.deck1Sprites[topCardIndex].moveTo(this.deck2Pos, this.cardAnimationTime, this.cardsMoved, (card: DeckCard) => {

                this.deck2Sprites.push(card);
                for(let index = 0; index < this.cardsInTransition.length; ++index)
                {
                    if(this.cardsInTransition[index] == card)
                    {
                        this.cardsInTransition.splice(index, 1);
                        break;
                    }
                }
            });
            this.cardsMoved++;
            this.cardsInTransition.push(this.deck1Sprites[topCardIndex]);
            this.deck1Sprites.splice(topCardIndex, 1);
            this.lastCardMoveTime = currentTime;
        }

        this.cardsInTransition.forEach((card) => {
            card.update();
        });
        this.deck1Sprites.forEach((card) => {
            card.update();
        });
        this.deck2Sprites.forEach((card) => {
            card.update();
        });
    }
}