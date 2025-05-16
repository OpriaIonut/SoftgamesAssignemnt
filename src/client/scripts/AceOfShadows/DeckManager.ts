import { Assets, BaseTexture, Rectangle, Point } from "pixi.js";
import { game } from "../../client";
import { DeckCard } from "./DeckCard";
import { Scene } from "../Utils/Scene";

export class DeckManager
{
    private scene: Scene;

    private runAnimation: boolean = false;

    private spritesheet!: BaseTexture;
    private deck1Sprites: DeckCard[] = [];
    private deck2Sprites: DeckCard[] = [];

    private cardsInTransition: DeckCard[] = [];

    private deck1Pos: Point;
    private deck2Pos: Point;
    private cardScale: Point = new Point(2, 2);

    private offsetDeck1Pos: Point;
    private offsetDeck2Pos: Point;

    private cardsMoved: number = 0;

    private lastCardMoveTime: number = 0.0;
    private cardDeckSwitchCooldown: number = 1.0;
    private cardAnimationTime: number = 2.0;

    constructor(scene: Scene)
    {
        this.scene = scene;
        this.deck1Pos = new Point(window.innerWidth / 4, window.innerHeight / 2);
        this.deck2Pos = new Point(window.innerWidth * 3 / 4, window.innerHeight / 2);

        let deckOffset = 30;
        this.offsetDeck1Pos = new Point(this.deck1Pos.x - deckOffset, this.deck1Pos.y - deckOffset);
        this.offsetDeck2Pos = new Point(this.deck2Pos.x + deckOffset, this.deck2Pos.y - deckOffset);
    }

    public async init(spritesheetSrc: string, spritesPerRow: number, spritesPerCol: number, spritesToDisplay: number)
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
            let card = new DeckCard(this.scene, this.spritesheet, rect, this.offsetDeck1Pos, this.cardScale);
            this.deck1Sprites.push(card);
        }
        this.deck1Sprites[this.deck1Sprites.length - 1].setPosition(this.deck1Pos);
    }

    public start()
    {
        this.runAnimation = true;
    }

    public update()
    {
        if(!this.runAnimation)
            return;

        let currentTime = game.getCurrentTime()
        if(this.deck1Sprites.length > 0 && currentTime - this.lastCardMoveTime > this.cardDeckSwitchCooldown)
        {
            let topCardIndex = this.deck1Sprites.length - 1;

            this.deck1Sprites[topCardIndex - 1].moveTo(this.deck1Pos, 0.2);

            this.deck1Sprites[topCardIndex].moveTo(this.deck2Pos, this.cardAnimationTime, this.cardsMoved, (card: DeckCard) => {

                if(this.deck2Sprites.length > 0)
                {
                    this.deck2Sprites[this.deck2Sprites.length - 1].moveTo(this.offsetDeck2Pos, 0.2);
                }
                    
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

    public reset()
    {
        for(let index = this.cardsInTransition.length - 1; index >= 0; --index)
        {
            this.cardsInTransition[index].stop();
            this.cardsInTransition[index].setPosition(this.deck1Pos);
            this.cardsInTransition[index].setZIndex(this.deck1Sprites.length);
            this.deck1Sprites.push(this.cardsInTransition[index]);
        }
        for(let index = this.deck2Sprites.length - 1; index >= 0; --index)
        {
            this.deck2Sprites[index].stop();
            this.deck2Sprites[index].setPosition(this.deck1Pos);
            this.deck2Sprites[index].setZIndex(this.deck1Sprites.length);
            this.deck1Sprites.push(this.deck2Sprites[index]);
        }
        
        this.deck2Sprites = [];
        this.cardsInTransition = [];
        this.runAnimation = false;
        this.cardsMoved = 0;
    }
}