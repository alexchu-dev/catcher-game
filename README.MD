# Catcher Game
Demo link: https://alexchu.dev/portfolio/catcher-game

This is a catcher game built with Phaser 3 as a game engine and Node.js Express.js together with MongoDB as backend.

The drop spawns 4 types of allies and 2 types of enemies, collecting allies get +50 points, collecting enemies get -100 points. Time limit is 60 seconds.

The drops spawns with random size and random directions, try your best to avoid the enemies and get high score!

## Getting Started
This project use MongoDB and it requires you to have your Database set up already.

You may set up your own in localhost, or easier option is to use Mongo Atlas. Please find the official document in here: https://www.mongodb.com/docs/atlas/tutorial/create-atlas-account/

the format is as following. 

```
MONGODB_URI = "mongodb+srv://[yoururl]:[password]/catcher-game"
```


In Terminal, run npm i to install the required dependencies.

```bash
> npm i
```
```bash
> npm run start
```

The game use port 8000, you should be able to see the following message in your terminal:

```
[nodemon] starting `node server.js`
Server is running on port 8000
```
Open http://localhost:8000 to run the game.

![Start Screen with Menu.](/assets/start-screen.jpg "Start Screen with Menu")

![Game Screen](/assets/game-screen.jpg "Game Screen")

![Game Over Screen](/assets/end-screen.jpg "Game Over Screen")

![Ranking Screen](/assets/ranking-screen.jpg "Ranking Screen")

## Folder Structure
```
├───assets
│   ├───css
│   └───js
│       └───scenes
└───views
    └───layouts
```
server.js in the root level is the Express JS file, it contains the definition of functions and the API for the whole app.

It uses Express JS Handlebars as template engine. The views folder contains the template and layouts contains the layout file. They are at minimum setting as they are not essential for this project.

### Game files
The game files are located in assets/js where the phaser.js is the engine library and the game.js sets the config for the game. game.backup.js can be neglected as that is the tutorial example from Phaser to start with.

There are three scenes in separate files:
*Start Scene - assets/js/scene/startScene.js
*Game Scene - assets/js/scene/gameScene.js
*Leader Board - assets/js/scene/leaderboardScene.js

### Start Scene
It is the scene as an entry point. It contains buttons to route to the game and the leader board.

### Game Scene
It contains all the logics for the game.

### Leaderboard Scene
It fetches data from the API and display in the Phaser scene.

For detailed documentation, please check the specific files.
