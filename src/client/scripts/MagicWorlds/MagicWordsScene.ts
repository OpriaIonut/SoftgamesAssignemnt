import { Container, Graphics, Point, Sprite, Text, TextStyle, Texture } from "pixi.js";
import { Scene } from "../Utils/Scene";

export class MagicWordsScene extends Scene
{
    private isInitialized: boolean = false;

    private characters?: Map<string, Sprite> = new Map();
    private emojis?: Map<string, Texture> = new Map();

    private dialogueIndex: number = 0;
    private url: string = 'https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords';
    private gameConfig: any;

    private textBubbleBg?: Graphics;
    private nameText?: Text;
    private bubbleTextStartPos: Point = new Point();
    private textContainer: Container = new Container();

    private boundProgressDialogueFunc!: () => void;

    public async start() 
    {
        if(!this.isInitialized)
        {
            const response = await fetch(this.url);
            this.gameConfig = await response.json();
            console.log(this.gameConfig);

            await this.loadCharacters();
            await this.loadEmojis();

            this.boundProgressDialogueFunc = this.progressDialogue.bind(this);

            this.initUI();
            this.isInitialized = true;
        }

        this.dialogueIndex = 0;
        this.displayDialogue(0);
        setTimeout(() => {
            document.body.addEventListener('click', this.boundProgressDialogueFunc);
        }, 100);
    }

    public update(): void 
    {
        
    }

    public reset(): void 
    {
        this.dialogueIndex = 0;
        this.scene.removeChild(this.textContainer);
        document.body.removeEventListener('click', this.boundProgressDialogueFunc);
    }

    private async loadCharacters()
    {
        for(let index = 0; index < this.gameConfig.avatars.length; ++index)
        {
            let name = this.gameConfig.avatars[index].name;
            let url = this.gameConfig.avatars[index].url;
            let pos = this.gameConfig.avatars[index].position;

            let texture = Texture.from(url);
            let character = new Sprite(texture);
            character.anchor.set(0.5, 0.5);
            character.scale.set(2.0, 2.0);

            if(pos == 'left')
                character.position.set(window.innerWidth / 8, window.innerHeight / 2);
            else if(pos == 'right')
                character.position.set(window.innerWidth * 7 / 8, window.innerHeight / 2);

            this.characters?.set(name, character);
        }
    }

    private async loadEmojis()
    {
        for(let index = 0; index < this.gameConfig.emojies.length; ++index)
        {
            let name = this.gameConfig.emojies[index].name;
            let url = this.gameConfig.emojies[index].url;

            let texture = Texture.from(url);

            this.emojis?.set(name, texture);
        }
    }

    private initUI()
    {
        this.textBubbleBg = new Graphics();
        const x = window.innerWidth * 1.5 / 8;
        const width = window.innerWidth * 5 / 8;
        const height = window.innerHeight / 6;
        const y = window.innerHeight / 2 - height / 4;

        this.textBubbleBg.beginFill(0x614675);
        this.textBubbleBg.drawRoundedRect(x, y, width, height, 20);
        this.textBubbleBg.endFill();
        this.scene.addChild(this.textBubbleBg);


        this.nameText = new Text("", {
            fontSize: 30,
            fill: 0xffffff
        });
        this.nameText.position.set(x + 25, y + 10);
        this.scene.addChild(this.nameText);

        
        this.bubbleTextStartPos.set(x + 25, y + 50);
    }

    private progressDialogue()
    {
        this.dialogueIndex++;
        if (this.dialogueIndex < this.gameConfig.dialogue.length)
            this.displayDialogue(this.dialogueIndex); 
    }

    private displayDialogue(dialogueIndex: number)
    {
        let avatarName = this.gameConfig.dialogue[dialogueIndex].name as string;
        let text = this.gameConfig.dialogue[dialogueIndex].text as string;

        let character = this.characters!.get(avatarName);

        this.characters?.forEach((sprite) => {
            this.scene.removeChild(sprite);
        });
        if(character != undefined)
            this.scene.addChild(this.characters!.get(avatarName) as Sprite);

        this.nameText!.text = avatarName;

        this.scene.removeChild(this.textContainer);
        this.textContainer = new Container();
        this.scene.addChild(this.textContainer);

        let xPos = this.bubbleTextStartPos.x;
        const textStyle: TextStyle = new TextStyle({
            fontSize: 24,
            fill: 0xeeeeee
        });
        const emojiSize = textStyle.fontSize as number;

        while(text.length > 0)
        {
            let emojiStartIndex = text.indexOf('{');
            let emojiEndIndex = text.indexOf('}');

            if(emojiStartIndex == -1 || emojiEndIndex == -1)
            {
                let newText = new Text(text, textStyle);
                newText.position.set(xPos, this.bubbleTextStartPos.y);
                this.textContainer.addChild(newText);
                text = "";
            }
            else
            {
                let textPart = text.slice(0, emojiStartIndex);
                let emojiName = text.slice(emojiStartIndex + 1, emojiEndIndex);
                
                let newText = new Text(textPart, textStyle);
                newText.position.set(xPos, this.bubbleTextStartPos.y);
                this.textContainer.addChild(newText);
                xPos += newText.width;

                if(this.emojis!.has(emojiName))
                {
                    let emoji = new Sprite(this.emojis?.get(emojiName));
                    emoji.width = emojiSize;
                    emoji.height = emojiSize;
                    emoji.position.set(xPos, this.bubbleTextStartPos.y);
                    this.textContainer.addChild(emoji);
                    xPos += emojiSize;
                }
                else
                {
                    console.warn("Could not display emoji: " + emojiName);
                }

                text = text.slice(emojiEndIndex + 1);
            }
        }
    }
}