import { Scene } from "../Utils/Scene";
import { DeckManager } from "./DeckManager";

export class AceOfShadowsScene extends Scene
{
    private isInitialized = false;
    private deck?: DeckManager;

    public async start() 
    {
        if(!this.isInitialized)
        {
            this.scene.sortableChildren = true;
            this.deck = new DeckManager(this);
            await this.deck.init("/images/aceOfShadowsSprites.png", 16, 16, 144);
        }

        this.deck?.start();
        this.isInitialized = true;
    }

    public update(): void 
    {
        if(!this.isInitialized)
            return;

        this.deck?.update();
    }

    public reset(): void 
    {
        this.deck?.reset();
    }
}