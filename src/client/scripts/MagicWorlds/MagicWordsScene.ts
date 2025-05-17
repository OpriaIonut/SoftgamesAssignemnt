import { Container, Graphics, Point, Sprite, Text, TextStyle, Texture } from "pixi.js";
import { Scene } from "../Utils/Scene";

export class MagicWordsScene extends Scene
{
    private isInitialized: boolean = false;

    //Maps of all of the graphics element that we need to display through the dialogues, to be able to display them easily.
    private characters?: Map<string, Sprite> = new Map();
    private emojis?: Map<string, Texture> = new Map();

    private dialogueIndex: number = 0; //Current index being displayed
    private url: string = 'https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords'; //URL for the game configuration file
    private gameConfig: any; //Will hold the downloaded json file from the endpoint

    //UI variables for the text bubble
    private textBubbleBg?: Graphics;
    private nameText?: Text;
    private bubbleTextStartPos: Point = new Point();
    private textContainer: Container = new Container();

    //The dialogue progresses when you click the screen, and it's called through a bound function so that it knows what the 'this' pointer means in any context.
    //I Could have used a normal lambda function, but I am removing said event when you change to another scene, to make sure that it doesn't get called when you aren't running this scene.
    private boundProgressDialogueFunc!: () => void;

    public async start() 
    {
        //If it's the first time running this scene, make sure to load & initialize everything
        if(!this.isInitialized)
        {
            //Download the dialogue json
            const response = await fetch(this.url);
            this.gameConfig = await response.json();
            console.log("Game config: ", this.gameConfig);

            //Load the resources needed from the json
            this.loadCharacters();
            this.loadEmojis();

            //Bind the progress function to know what the 'this' pointer means in any context
            this.boundProgressDialogueFunc = this.progressDialogue.bind(this);

            //Initialize all other relevant ui (such as the text bubble, name tag inside it)
            this.initUI();
            this.isInitialized = true;
        }

        //Display the first dialogue
        this.dialogueIndex = 0;
        this.displayDialogue(0);

        //Call the progress function when you click the screen. Registering happens 0.1s later, because the event may still be triggered 
        //when you changed scenes from the dropdown, which would make you skip the first dialogue.
        setTimeout(() => {
            document.body.addEventListener('click', this.boundProgressDialogueFunc);
        }, 100);
    }

    public update(): void 
    {
        
    }

    public reset(): void 
    {
        //Reset everything to it's initial state
        this.dialogueIndex = 0;
        this.scene.removeChild(this.textContainer);
        document.body.removeEventListener('click', this.boundProgressDialogueFunc);
    }

    private loadCharacters()
    {
        //Go through each of the characters
        for(let index = 0; index < this.gameConfig.avatars.length; ++index)
        {
            let name = this.gameConfig.avatars[index].name;
            let url = this.gameConfig.avatars[index].url;
            let pos = this.gameConfig.avatars[index].position;

            //Load the texture
            let texture = Texture.from(url);
            let character = new Sprite(texture);
            character.anchor.set(0.5, 0.5);
            character.scale.set(2.0, 2.0);

            //Set it's position based on the desired location
            if(pos == 'left')
                character.position.set(window.innerWidth / 8, window.innerHeight / 2);
            else if(pos == 'right')
                character.position.set(window.innerWidth * 7 / 8, window.innerHeight / 2);

            this.characters?.set(name, character);
        }
    }

    private loadEmojis()
    {
        //Go through each of the emojis and load them
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
        //Create the text bubble
        this.textBubbleBg = new Graphics();
        const x = window.innerWidth * 1.5 / 8;
        const width = window.innerWidth * 5 / 8;
        const height = window.innerHeight / 6;
        const y = window.innerHeight / 2 - height / 4;

        this.textBubbleBg.beginFill(0x614675);
        this.textBubbleBg.drawRoundedRect(x, y, width, height, 20);
        this.textBubbleBg.endFill();
        this.scene.addChild(this.textBubbleBg);


        //Set up a name tag for the characters
        this.nameText = new Text("", {
            fontSize: 30,
            fill: 0xffffff
        });
        this.nameText.position.set(x + 25, y + 10);
        this.scene.addChild(this.nameText);

        //Starting position of the actual text dialogue
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
        //Read the data needed for the current dialogue
        let avatarName = this.gameConfig.dialogue[dialogueIndex].name as string;
        let text = this.gameConfig.dialogue[dialogueIndex].text as string;

        //Set up the characters (hide all characters other than the one speaking)
        let character = this.characters!.get(avatarName);
        this.characters?.forEach((sprite) => {
            this.scene.removeChild(sprite);
        });
        if(character != undefined)
            this.scene.addChild(this.characters!.get(avatarName) as Sprite);

        this.nameText!.text = avatarName;

        //Refresh the text bubble by discarding previous elements inside it
        this.scene.removeChild(this.textContainer);
        this.textContainer = new Container();
        this.scene.addChild(this.textContainer);

        //Define data for text and emoji rendering
        let xPos = this.bubbleTextStartPos.x;
        const textStyle: TextStyle = new TextStyle({
            fontSize: 24,
            fill: 0xeeeeee
        });
        const emojiSize = textStyle.fontSize as number;

        //Parse the text dynamically
        while(text.length > 0)
        {
            //Try to find the next occurance of an emoji in the current text
            let emojiStartIndex = text.indexOf('{');
            let emojiEndIndex = text.indexOf('}');

            //If any of the search indexes is -1, it means that we didn't find an emoji, in which case display the entire text all at once
            if(emojiStartIndex == -1 || emojiEndIndex == -1)
            {
                this.displayTextAtPos(text, textStyle, xPos, this.bubbleTextStartPos.y);
                text = "";
            }
            else
            {
                //Otherwise, if we found an emoji, separate the text part from the emoji's name
                let textPart = text.slice(0, emojiStartIndex);
                let emojiName = text.slice(emojiStartIndex + 1, emojiEndIndex);
                
                //Display the text and update the xPos marker (to know where the next element should start from)
                let newText = this.displayTextAtPos(textPart, textStyle, xPos, this.bubbleTextStartPos.y);
                xPos += newText.width;

                //If the emoji is valid (defined in the config file), display it
                if(this.emojis!.has(emojiName))
                {
                    this.displayEmojiAtPos(this.emojis?.get(emojiName) as Texture, emojiSize, xPos, this.bubbleTextStartPos.y);
                    xPos += emojiSize;
                }
                else
                {
                    //Otherwise, throw a warning
                    console.warn("Could not find the emoji: '" + emojiName + "' in the game config file. Make sure to add it in the endpoint.");
                }

                //Update the text with the remainder that wasn't displayed yet, and continue the loop
                text = text.slice(emojiEndIndex + 1);
            }
        }
    }

    private displayTextAtPos(text: string, textStyle: TextStyle, x: number, y: number): Text
    {
        let newText = new Text(text, textStyle);
        newText.position.set(x, y);
        this.textContainer.addChild(newText);
        return newText;
    }

    private displayEmojiAtPos(texture: Texture, size: number, x: number, y: number)
    {
        let emoji = new Sprite(texture);
        emoji.width = size;
        emoji.height = size;
        emoji.position.set(x, y);
        this.textContainer.addChild(emoji);
    }
}