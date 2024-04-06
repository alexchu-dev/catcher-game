/*
 * Alex Chu 2024 - https://alexchu.dev
 * Github for this repo: https://github.com/alexchu-dev/catcher-game
 * This is a catcher game built with Phaser 3 as a game engine and Node.js as backend.
 * There are three scenes for Start Menu, Main Game, and Leader Board.
 * This file contains the configuration for the game.
 */
import GameScene from "./scenes/gameScene.js"
import LeaderboardScene from "./scenes/leaderboardScene.js"
import StartScene from "./scenes/startScene.js"

const config = {
  title: "Catcher Game",
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    parent: "gameContainer",
    width: 800,
    height: 600,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  scene: [StartScene, LeaderboardScene, GameScene],
}

let game = new Phaser.Game(config)
