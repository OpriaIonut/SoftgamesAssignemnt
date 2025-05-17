import { Assets, BaseTexture, Rectangle, Point } from "pixi.js";
import { game } from "../../client";
import { DeckCard } from "./DeckCard";
import { Scene } from "../Utils/Scene";
import { DeckData } from "../../types";

//Class responsible for managing the logic of what cards are in which deck and the transition from one deck to the other
export class DeckManager
{
    private scene: Scene;

    private runAnimation: boolean = false;

    private spritesheet!: BaseTexture;
    private deck1: DeckData;
    private deck2: DeckData;

    private cardsInTransition: DeckCard[] = []; //Cards currently moving from one deck to the other. They will be removed from their specific deck in this state
    private cardScale: Point = new Point(2, 2);

    private cardsMoved: number = 0; //How many cards started moving from deck1 to deck2

    private lastCardMoveTime: number = 0.0;
    private cardDeckSwitchCooldown: number = 1.0; //How long we should wait before a card starts to move from deck1 to deck2
    private cardAnimationTime: number = 2.0; //How long should it take a card to reach deck2

    constructor(scene: Scene)
    {
        this.scene = scene;
        let deckOffset = 30;

        //Initialize the decks
        //OffsetPos is a position close to the deck, to make the animation prettier by not placing all of the cards completely on top of one another
        //Movement will happen like following: deck1.offsetPos -> deck1.pos -> deck2.pos -> deck2.offsetPos
        this.deck1 = {
            sprites: [],
            pos: new Point(window.innerWidth / 4, window.innerHeight / 2),
            offsetPos: new Point(window.innerWidth / 4 - deckOffset, window.innerHeight / 2 - deckOffset)
        };
        
        this.deck2 = {
            sprites: [],
            pos: new Point(window.innerWidth * 3 / 4, window.innerHeight / 2),
            offsetPos: new Point(window.innerWidth * 3 / 4 + deckOffset, window.innerHeight / 2 - deckOffset)
        };
    }

    public async init(spritesheetSrc: string, spritesPerRow: number, spritesPerCol: number, spritesToDisplay: number)
    {
        //Load the spritesheet with all of the cards. Loading 144 sprites individually would take a long time because of all of the network calls, 
        //and because of that I chose to load all of them in a single call, through a spritesheet, and then tell each sprite what rect to render from the spritesheet.

        //process.env.IMG_BASE_URL is needed because this project is deployed to Github Pages, where we need to pass a specific url to the fetch calls.
        //In dev mode it's empty, but in production it holds the specific url path needed.
        const texture = await Assets.load(process.env.IMG_BASE_URL + spritesheetSrc);

        this.spritesheet = texture.baseTexture;

        const spriteWidth = this.spritesheet.width / spritesPerRow;
        const spriteHeight = this.spritesheet.height / spritesPerCol;
        
        //Set up each of the sprites and tell them what rect to render from the spritesheet
        for(let index = 0; index < spritesToDisplay; ++index)
        {
            let y = Math.floor(index / spritesPerRow);
            let x = Math.floor(index - y * spritesPerRow);

            x *= spriteWidth;
            y *= spriteHeight;

            let rect = new Rectangle(x, y, spriteWidth, spriteHeight);
            let card = new DeckCard(this.scene, this.spritesheet, rect, this.deck1.offsetPos, this.cardScale);
            this.deck1.sprites.push(card);
        }
        this.deck1.sprites[this.deck1.sprites.length - 1].setPosition(this.deck1.pos);
    }

    public start()
    {
        this.runAnimation = true;
    }

    public update()
    {
        if(!this.runAnimation)
            return;

        //If we still have sprites in deck1 and it's time to move a new card
        let currentTime = game.getCurrentTime()
        if(this.deck1.sprites.length > 0 && currentTime - this.lastCardMoveTime > this.cardDeckSwitchCooldown)
        {
            //Find the card sitting on top
            let topCardIndex = this.deck1.sprites.length - 1;

            //If we have more than one card in the deck, move the remaining card to the front (to make for a better visual effect)
            //This will handle the movement from deck1.offsetPos (where all cards sit initially) to deck1.pos (where only the front card will sit)
            if(topCardIndex > 0)
                this.deck1.sprites[topCardIndex - 1].moveTo(this.deck1.pos, 0.2);

            //Move the top card to the second deck, and specify a callback for when it reaches that destination
            this.deck1.sprites[topCardIndex].moveTo(this.deck2.pos, this.cardAnimationTime, this.cardsMoved, (card: DeckCard) => {

                //If it reached the destination, move the card that was already in the deck to the offset pos (in order to not display them on top of one another)
                if(this.deck2.sprites.length > 0)
                {
                    this.deck2.sprites[this.deck2.sprites.length - 1].moveTo(this.deck2.offsetPos, 0.2);
                }
                    
                //Add the card to the proper deck and delete it from the 'cardsIntransition' array
                this.deck2.sprites.push(card);
                for(let index = 0; index < this.cardsInTransition.length; ++index)
                {
                    if(this.cardsInTransition[index] == card)
                    {
                        this.cardsInTransition.splice(index, 1);
                        break;
                    }
                }
            });
            //Remove the card from the deck and put it in a 'transition' state
            this.cardsMoved++;
            this.cardsInTransition.push(this.deck1.sprites[topCardIndex]);
            this.deck1.sprites.splice(topCardIndex, 1);
            this.lastCardMoveTime = currentTime;
        }

        //Finally, make sure to update all cards so that they can play any animation that they need to
        this.cardsInTransition.forEach((card) => {
            card.update();
        });
        this.deck1.sprites.forEach((card) => {
            card.update();
        });
        this.deck2.sprites.forEach((card) => {
            card.update();
        });
    }

    public reset()
    {
        //Stop and reset all cards in transition, in reverse order so that we get the proper order of the cards right
        for(let index = this.cardsInTransition.length - 1; index >= 0; --index)
        {
            this.cardsInTransition[index].stop();
            this.cardsInTransition[index].setPosition(this.deck1.pos);
            this.cardsInTransition[index].setZIndex(this.deck1.sprites.length);
            this.deck1.sprites.push(this.cardsInTransition[index]);
        }

        //Do the same for the cards in deck2
        for(let index = this.deck2.sprites.length - 1; index >= 0; --index)
        {
            this.deck2.sprites[index].stop();
            this.deck2.sprites[index].setPosition(this.deck1.pos);
            this.deck2.sprites[index].setZIndex(this.deck1.sprites.length);
            this.deck1.sprites.push(this.deck2.sprites[index]);
        }
        
        //Finally, reset relevant variables to the initial state
        this.deck2.sprites = [];
        this.cardsInTransition = [];
        this.runAnimation = false;
        this.cardsMoved = 0;
    }
}