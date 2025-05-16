import { AceOfShadowsScene } from './scripts/AceOfShadows/AceofShadowsScene';
import { Game } from './scripts/Game';
import { PhoenixFlameScene } from './scripts/PhoenixFlame/PhoenixFlameScene';

export const game = new Game(0xdbc78f)

const aceOfShadow = new AceOfShadowsScene();
const phoenixFlame = new PhoenixFlameScene();

game.addScene(aceOfShadow);
game.addScene(phoenixFlame);

game.changeScene(aceOfShadow);

const sceneSelectionDropdown = document.getElementById("sceneChangerDropdown") as HTMLSelectElement;
sceneSelectionDropdown.addEventListener('change', () => {
  const value = sceneSelectionDropdown.value;

  switch (value) 
  {
    case "aceofShadow":
      game.changeScene(aceOfShadow);
      break;
    case "phoenixFlame":
      game.changeScene(phoenixFlame);
      break;
  }
});