export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" })
  }

  preload() {
    // Load all assets
    this.load.image("gameBackground", "../bg1.png")
    this.load.image("p1", "../p1.png")
    this.load.image("p2", "../p2.png")
    this.load.image("p3", "../p3.png")
    this.load.image("p4", "../p4.png")
    this.load.image("e1", "../e1.png")
    this.load.image("e2", "../e2.png")
    this.load.image("boat", "../boat.png")
    // This bitmap font is from Phaser's example. It is really nice.
    this.load.bitmapFont("arcade", "../arcade.png", "../arcade.xml")
  }

  create() {
    // Set the camera zoom and get the center of the screen
    this.cameras.main.setZoom(1.0)
    const { centerX, centerY } = this.cameras.main

    // Add the background image
    this.add.image(centerX, centerY, "gameBackground")

    // Set the initial values for the game
    this.timeLeft = 60
    this.score = 0

    // The initial score display
    this.scoreText = this.add.text(16, 20, "Score: 0", {
      font: "bold 20px Arial",
    })

    // The initial timer display
    this.timerText = this.add
      .text(400, 20, `Time: ${this.timeLeft}`, {
        font: "bold 20px Arial",
      })
      .setOrigin(0.5, 0)

    // Timer event to callback spawnDrop every second
    this.time.addEvent({
      delay: 1000,
      callback: () => {
        this.spawnDrop()
      },
      callbackScope: this,
      loop: true,
    })

    // Game over text
    this.gameOverText = this.add
      .bitmapText(centerX, centerY - 100, "arcade", "")
      .setTint(0xffffff)
      .setOrigin(0.5, 0.5)

    // The player and its settings
    this.player = this.physics.add
      .image(100, 600, "boat")
      .setScale(0.2)
      .refreshBody() // This is needed to refresh the physics body size
    this.player.setCollideWorldBounds(true)

    //  Input Events
    this.cursors = this.input.keyboard.createCursorKeys()

    // Initiate a physics group for the drops, will be used later on
    this.drops = this.physics.add.group()

    //  Checks to see if the player overlaps with the drops, if it does, call the catchDrop function
    this.physics.add.overlap(
      this.player,
      this.drops,
      this.catchDrop,
      null,
      this
    )

    // Mobile touch controls testing
    this.input.on('pointerdown', (pointer) => {
      this.isPointerDown = true; // Set touch state to active
      this.handlePointerMove(pointer);
    });
  
    this.input.on('pointerup', () => {
      this.isPointerDown = false; // When touch ends, set to false
      this.player.setVelocityX(0); // Velocity x to 0 = stop moving
    });
  
    this.input.on('pointermove', (pointer) => {
      if (this.isPointerDown) { // Condition - only moves player if touch is active
        this.handlePointerMove(pointer);
      }
    });
    
  }

  /* Update function - note that the time and delta are passed in. Delta must be used in here, otherwise it would go by FPS not seconds.
   * Parameters: time: the time passed since the start of the scene, delta: the time passed since the last frame
   * Returns: None
   * Exceptions: None
   * Side effects: Player velocity (directional), updates the time left, and calls the gameOver function when time is up
   */
  update(time, delta) {
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-300) // Change the velocity for more fun
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(300) // Change the velocity for more fun
    } else {
      this.player.setVelocityX(0)
    }
    if (this.timeLeft > 0) {
      this.timeLeft -= delta / 1000
      this.timerText.setText("Time: " + Math.ceil(this.timeLeft))
    } else {
      this.gameOver() // When time is up, call the gameOver function
    }
  }

  // Reset function. It was used previously to reset the game, but now it is not used. Kept for reference.
  reset() {
    this.timeLeft = 60
    this.score = 0
    this.scene.start("StartScene")
  }

  /*
   * Custom functions
   */
  
  // Testing touch controls
  handlePointerMove(pointer) {
    const { width } = this.sys.game.config; // Get the width of the game, important for touch devices
    if (pointer.x < width / 2) {
      this.player.setVelocityX(-300);
    } else {
      this.player.setVelocityX(300);
    }
  }

  /* Get a random drop from the combined array of enemy and ally drops
   * Parameters: None
   * Returns: None
   * Exceptions: None
   * Side effects: Spawns a drop at a random x position, with a random scale, velocity, and gravity
   */
  spawnDrop() {
    const x = Phaser.Math.Between(0, 800) // Random x pos from 0 to 800
    const enemyArray = ["e1", "e2"]
    const allyArray = ["p1", "p2", "p3", "p4"]
    const combined = enemyArray.concat(allyArray) // Combine two arrays
    let drop = this.drops
      .create(x, 16, Phaser.Math.RND.pick(combined)) // Randomly pick from the combined array using Phaser's RND
      .setScale(Phaser.Math.Between(1, 4) / 10) // Random scale for more fun
    drop.setCollideWorldBounds(false) // No need to collide with world bounds
    drop.setVelocity(Phaser.Math.Between(-200, 200), 20) // Random velocity as well
    drop.allowGravity = true // Allow gravity for the drops
  }

  /* Catch drop function
   * Parameters: player: the player object, drops: the drops object
   * Returns: None
   * Exceptions: None
   * Side effects: Updates the score and score text, changes the player tint if it catches an enemy drop
   */
  catchDrop(player, drops) {
    drops.disableBody(true, true) // Disable the body of the drop after overlapping
    console.log(drops.texture.key)
    if (drops.texture.key === "e1" || drops.texture.key === "e2") {
      player.setTint(0xff0000) // Set the player to red if it catches an enemy drop
      if (this.score - 100 < 0) {
        this.score = 0 // Make sure the score does not go below 0
      } else {
        this.score -= 100
      }
      setTimeout(() => {
        player.clearTint() // Clear the tint after 50ms
      }, 50)
    } else {
      this.score += 50
    }
    this.scoreText.setText("Score: " + this.score) // Update the score text
  }

  /* Game over function
   * Parameters: None
   * Returns: None
   * Exceptions: None
   * Side effects: Pauses the scene, clears the drops, displays the game over text, and calls the showForm function
   */
  async gameOver() {
    this.gameOverText.setText("Game Over")
    this.scene.pause() // Pause the scene
    this.drops.clear(true, true) // Clear the drops from the scene to display the text and input form
    await this.showForm()
  }

  /* Show form function
   * Parameters: None
   * Returns: None
   * Exceptions: None
   * Side effects: Creates a form, appends it to the body, and sends a POST request to the server with the name and score
   */
  showForm() {
    const form = document.createElement("form")
    form.setAttribute(
      "class",
      "bg-sky-400/70 shadow-xl rounded-lg p-2 md:p-6 contents-center text-center m-auto"
    )
    form.style.position = "absolute"
    form.style.top = "50%"
    form.style.left = "50%"
    form.style.transform = "translate(-50%, -40%)"
    form.style.fontSize = "24px"

    const nameLabel = document.createElement("label")
    nameLabel.textContent = "Name: "
    nameLabel.setAttribute("class", "text-sm md:text-lg")
    const nameInput = document.createElement("input")
    nameInput.setAttribute("type", "text")
    nameInput.setAttribute(
      "class",
      "text-sm md:text-lg rounded-xl text-black p-2 w-full"
    )
    nameInput.setAttribute("placeholder", "Enter your name")
    nameInput.setAttribute("id", "nameInput")
    nameInput.required = true;
    nameLabel.appendChild(nameInput)

    const submitButton = document.createElement("button")
    submitButton.textContent = "Submit"
    submitButton.setAttribute(
      "class",
      "text-sm md:text-lg block m-auto mt-2 md:mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl"
    )

    form.appendChild(nameLabel)
    form.appendChild(submitButton)
    document.body.appendChild(form)

    // Submit button event listener to send the name and score to the server
    submitButton.addEventListener("click", async (e) => {
      e.preventDefault()
      const name = document.getElementById("nameInput").value
      try {
        if (name) {
          await fetch("/submit-score", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ name: name, score: this.score }),
          }).then((res) => {
            if (res.status === 200) {
              console.log("Score submitted successfully!")
            } else {
              console.log("Failed to submit score.")
            }
            
          })
        }
        form.remove()
        this.scene.start("StartScene") // Return to the start scene after submitting the score
      } catch (err) {
        console.log(err)
      }
      
    })
  }
}
