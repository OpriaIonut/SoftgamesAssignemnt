import { Scene } from "../Utils/Scene";
import { DeckManager } from "./DeckManager";

export class AceOfShadowsScene extends Scene
{
    private deck?: DeckManager;

    public start(): void 
    {
        this.deck = new DeckManager(this, "/images/aceOfShadowsSprites.png", 16, 16, 144);
    }

    public update(): void 
    {
        this.deck?.update();
    }

    public reset(): void 
    {
        
    }
}