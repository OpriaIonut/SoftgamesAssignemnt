import { AceOfShadowsScene } from './scripts/AceOfShadows/AceOfShadowsScene';
import { Game } from './scripts/Game';
import { MagicWordsScene } from './scripts/MagicWorlds/MagicWordsScene';
import { PhoenixFlameScene } from './scripts/PhoenixFlame/PhoenixFlameScene';
import { UIManager } from './scripts/UIManager';
import { Scene } from './scripts/Utils/Scene';

//Game class that hold all of the rendering logic for the app, game loop and a couple of other utility functions
export const game = new Game(0xdbc78f);

//Create each of the individual minigames that we can run
const aceOfShadow = new AceOfShadowsScene();
const magicWorlds = new MagicWordsScene();
const phoenixFlame = new PhoenixFlameScene();

//Register each of the scenes in the game class, to be able to switch between them
game.addScene(aceOfShadow);
game.addScene(magicWorlds);
game.addScene(phoenixFlame);

//Initially load the Ace of Shadow scene
game.changeScene(aceOfShadow);

//Create the game ui that is identic for all of the scenes
export const uiManager = new UIManager(new Map<string, Scene>([
  ["aceOfShadow", aceOfShadow],
  ["magicWorlds", magicWorlds],
  ["phoenixFlame", phoenixFlame]
]));