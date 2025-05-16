import { AceOfShadowsScene } from './scripts/AceOfShadows/AceOfShadowsScene';
import { Game } from './scripts/Game';
import { MagicWordsScene } from './scripts/MagicWorlds/MagicWordsScene';
import { PhoenixFlameScene } from './scripts/PhoenixFlame/PhoenixFlameScene';

export const game = new Game(0xdbc78f)

const aceOfShadow = new AceOfShadowsScene();
const magicWorlds = new MagicWordsScene();
const phoenixFlame = new PhoenixFlameScene();

game.addScene(aceOfShadow);
game.addScene(magicWorlds);
game.addScene(phoenixFlame);

game.changeScene(aceOfShadow);


const fullscreenBtn = document.getElementById("fullscreenBtn") as HTMLButtonElement;
fullscreenBtn.addEventListener('click', () => {
  game.enterFullscreenMode();
})

const sceneSelectionDropdown = document.getElementById("sceneChangerDropdown") as HTMLSelectElement;
sceneSelectionDropdown.addEventListener('change', () => {
  const value = sceneSelectionDropdown.value;

  switch (value) 
  {
    case "aceOfShadows":
      game.changeScene(aceOfShadow);
      break;
    case "magicWorlds":
      game.changeScene(magicWorlds);
      break;
    case "phoenixFlame":
      game.changeScene(phoenixFlame);
      break;
    default:
      console.log("Could not change scene, make sure to properly implement the value: " + value);
  }
});