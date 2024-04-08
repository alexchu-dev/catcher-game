// Author: Alex Chu 2024 - https://alexchu.dev
// Github for this repo: https://github.com/alexchu-dev/catcher-game
const express = require("express")
const app = express()
const cors = require("cors")
const HTTP_PORT = process.env.PORT || 8000
require("dotenv").config()

// ----------------
// Middleware
// ----------------
// const bodyParser = require('body-parser');
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("assets"))
app.use(cors())

const exphbs = require("express-handlebars")
app.engine(
  ".hbs",
  exphbs.engine({
    extname: ".hbs",
    helpers: {
      json: (context) => {
        return JSON.stringify(context)
      },
      incremented: (index) => {
        return index + 1 // Customised helper to increment index by 1 for the use of the leaderboard view in handlebars
      },
    },
  })
)

app.set("view engine", ".hbs")

// ----------------
// Database
// ----------------
const mongoose = require("mongoose")
mongoose.connect(process.env.MONGODB_URI)

// MongoDB schema and model
const scoreSchema = new mongoose.Schema({
  name: String,
  score: Number,
})
const Score = mongoose.model("score_collection", scoreSchema)

// ----------------
// Endpoints
// ----------------
// Entry point for the application
app.get("/", (req, res) => {
  res.render("home", {
    layout: "default",
    title: "Catcher Game",
  })
})



// Endpoint to get the leaderboard in JSON format for Phaser
app.get("/leaderboard-json", async (req, res) => {
  console.log(`Request to API: ${req.query}`)
  const page = parseInt(req.query.page) || 1 // Parse the page query parameter, default to 1
  const limit = 10 // Limit to 10 records, so that the leaderboard can be paginated in Phaser
  const skip = (page - 1) * limit // Calculate the number of records to skip based on the page number query

  try {
    // Retrieve data from MongoDB with the skip and limit options.
    const leaderBoard = await Score.find()
      .sort({ score: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
    const totalRecords = await Score.countDocuments() // Get the total records in the collection
    const totalPages = Math.ceil(totalRecords / limit) // Then calculate the total pages with ceiling. This is very essential to return so the game client knows when to stop paginating.

    if (leaderBoard.length === 0) {
      // If no records, return 404 with some default json.
      return res.status(404).json({
        message: "No scores found.",
        page,
        totalPages,
        leaderBoard: [],
      })
    }
    res.json({ page, totalPages, leaderBoard })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Endpoint to render the leaderboard view
app.get("/leaderboard", async (req, res) => {
  console.log(req.query)
  try {
    const leaderBoard = await Score.find().sort({ score: -1 }).limit(100).lean() // Sort by score in desc, limit 100 records
    let noScores = false
    if (leaderBoard.length === 0) {
      noScores = true
    }
    // The leaderBoard object is passed to the leaderboard view.
    res.render("leaderboard", {
      layout: "default",
      title: "Leader Board",
      noScores: noScores,
      noScoresMsg: "No scores found.",
      leaderBoard: leaderBoard,
    })
    console.log(leaderBoard)
    return
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// Endpoint for the game client to submit the score
app.post("/submit-score", async (req, res) => {
  const { name, score } = req.body
  console.log(name, score)
  // Validating if name is provided in the body
  if (!name) {
    return res.status(400).json({ message: "Name is required" })
  }
  try {
    const newScore = new Score({ name, score }) // Create new Score object
    await newScore.save() // Save the new document to MongoDB
    console.log(newScore)
    res.status(200).json(newScore)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
  return
})

// Start server
app.listen(HTTP_PORT, () => {
  console.log(`Server is running on http://localhost:${HTTP_PORT}`)
})
