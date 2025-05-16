import { DeckManager } from './scripts/AceOfShadows/DeckManager';
import { Game } from './scripts/Game';
import { GameSprite } from './scripts/Utils/GameSprite';

export const game = new Game(0xdbc78f)

// Load the sprite
export const deck = new DeckManager("/images/aceOfShadowsSprites.png", 16, 16, 144);