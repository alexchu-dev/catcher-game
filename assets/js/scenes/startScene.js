export default class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: "StartScene" })
  }
  // Sprite frame parameters defined
  preload() {
    this.load.image("startBackground", "../bg2.png")
    this.load.spritesheet("button", "../button2.png", {
      frameWidth: 184,
      frameHeight: 47,
    })
  }

  create() {
    this.cameras.main.setZoom(1.0) // Set the camera zoom
    const { centerX, centerY } = this.cameras.main // Get the center of the screen
    this.add.image(centerX, centerY, "startBackground")

    // Start button and Start text. Tried to combine the button image and the text, but could not get it to work, therefore it is separated in here. To make sure the button sprite works when hovering the text, extra code was added.
    const startButton = this.add
      .sprite(centerX, centerY, "button")
      .setFrame([0])
      .setInteractive()
      .on("pointerover", () => {
        startButton.setFrame([1])
      })
      .on("pointerout", () => {
        startButton.setFrame([0])
      })
      .on("pointerdown", () => {
        this.scene.start("GameScene")
      })

    this.add
      .text(centerX, centerY, "Start Game", {
        font: "bold 16px Arial",
      })
      .setOrigin(0.5, 0.5)
      .setInteractive()
      .on("pointerover", () => {
        startButton.setFrame([1])
      })
      .on("pointerdown", () => this.scene.start("GameScene"))

    // Leaderboard button
    const leaderboardButton = this.add
      .sprite(centerX, centerY + 80, "button")
      .setFrame([0])
      .setInteractive()
      .on("pointerover", () => {
        leaderboardButton.setFrame([1])
      })
      .on("pointerout", () => {
        leaderboardButton.setFrame([0])
      })
      .on("pointerdown", () => {
        this.scene.start("LeaderboardScene")
      })

    this.add
      .text(centerX, centerY + 80, "Leaderboard", {
        font: "bold 16px Arial",
      })
      .setOrigin(0.5, 0.5)
      .setInteractive()
      .on("pointerover", () => {
        leaderboardButton.setFrame([1])
      })
      .on("pointerdown", () => this.scene.start("LeaderboardScene"))
  }
}
