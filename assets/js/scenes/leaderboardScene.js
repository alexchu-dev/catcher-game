export default class LeaderboardScene extends Phaser.Scene {
  constructor() {
    super({ key: "LeaderboardScene" })
    this.currentPage = 1
    this.entriesPerPage = 10
    this.totalPages = 0
  }

  preload() {}

  create() {
    this.cameras.main.setZoom(1.0)
    const { centerX, centerY } = this.cameras.main
    this.add
      .text(centerX, 50, "Leaderboard", { font: "bold 24px Arial" })
      .setOrigin(0.5, 0.5)
      .setColor("#f0f0f0")

    this.displayLeaderboard(this.currentPage) // Pass currentPage (default 1) to displayLeaderboard function defined below

    // Pagination and Back to Menu buttons
    this.add
      .text(centerX, 550, "Back to Menu", {
        font: "bold 16px Arial",
        fill: "#0f0",
      })
      .setInteractive()
      .setOrigin(0.5, 0.5)
      .on("pointerdown", () => this.scene.start("StartScene"))

    this.add
      .text(centerX - 100, 500, "< Previous", {
        font: "bold 16px Arial",
        fill: "#f00",
      })
      .setInteractive()
      .setOrigin(0.5, 0.5)
      .on("pointerdown", () => this.changePage(-1))

    this.add
      .text(centerX + 100, 500, "Next >", {
        font: "bold 16px Arial",
        fill: "#f00",
      })
      .setInteractive()
      .setOrigin(0.5, 0.5)
      .on("pointerdown", () => this.changePage(1))
  }

  /* fetchData function - fetches the leaderboard data from the server
   * Parameters: page: the page number to fetch
   * Returns: data: the leaderboard data from the server
   * Exceptions: error handling if network response is not ok
   * Side effects: None
   */
  async fetchData(page) {
    try {
      const response = await fetch(`/leaderboard-json?page=${page}`)
      if (!response.ok) {
        throw new Error("Network response was not ok")
      }
      const data = await response.json()
      return data
    } catch (error) {
      console.error(error)
      return []
    }
  }

  /* displayLeaderboard function - displays the leaderboard on the screen
   * Parameters: page: the page number to display
   * Returns: None
   * Exceptions: None
   * Side effects: if there are existing leaderboard entries, destroy them. Then display the leaderboard entries on the screen.
   */
  async displayLeaderboard(page) {
    if (this.leaderboardEntries) {
      this.leaderboardEntries.forEach((entry) => entry.destroy())
    }
    this.leaderboardEntries = [] // Reset leaderboardEntries array

    const leaderboardData = await this.fetchData(page) // Fetch leaderboard data from the server

    this.totalPages = leaderboardData.totalPages // Set totalPages to the totalPages from the server
    leaderboardData.leaderBoard.forEach((entry, index) => {
      const y = 120 + index * 30
      const text = this.add
        .text(
          this.cameras.main.centerX,
          y,
          `${(page - 1) * this.entriesPerPage + index + 1}. ${entry.name} ${
            entry.score
          }`,
          { font: "bold 16px Arial" }
        )
        .setOrigin(0.5, 0.5)
      const colors = [
        "#ff6666",
        "#ffb266",
        "#ffff66",
        "#b2ff66",
        "#66ffb2",
        "#66ffff",
        "#66b2ff",
        "#6666ff",
        "#b266ff",
        "#ff66ff",
      ]
      text.setColor(colors[index % colors.length])
      this.leaderboardEntries.push(text)
    })
  }
  /* changePage function - changes the page of the leaderboard
   * Parameters: amount: the amount to change the page by
   * Returns: None
   * Exceptions: None
   * Side effects: Changes the currentPage and calls the displayLeaderboard function with the new page
   */
  changePage(amount) {
    this.currentPage += amount
    if (this.currentPage < 1) this.currentPage = 1
    if (this.currentPage > this.totalPages) this.currentPage = this.totalPages
    this.displayLeaderboard(this.currentPage)
  }
}
