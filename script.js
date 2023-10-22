function createGame(totalTime) {
  const game = {
    cups: 0,
    timeRemaining: totalTime,
    countDown: null,
    timer: document.getElementById("time-remaining"),
    ticker: document.getElementById("cups"),

    audioController: {
      bgMusic: new Audio("audio/elevator-music.mp3"),
      victorySound: new Audio("audio/victory.mp3"),
      gameOverSound: new Audio("audio/gameover.mp3"),

      startMusic() {
        this.bgMusic.volume = 0.1
        this.bgMusic.play()
      },
      stopMusic() {
        this.bgMusic.pause()
        this.bgMusic.currentTime = 0
      },
      victory() {
        this.stopMusic()
        this.victorySound.play()
      },
      gameOver() {
        this.stopMusic()
        this.gameOverSound.play()
      },
    },

    startGame() {
      this.cups = 0
      this.timeRemaining = totalTime

      setTimeout(() => {
        this.audioController.startMusic()
        this.countDown = this.startCountDown()
      }, 500)

      this.timer.innerText = this.timeRemaining
      this.ticker.innerText = this.cups
    },

    startCountDown() {
      return setInterval(() => {
        this.timeRemaining--
        this.timer.innerText = this.timeRemaining
        if (this.timeRemaining === 0) {
          this.gameOver()
        }
        if (this.cups === 10) {
          this.victory()
        }
      }, 1000)
    },

    stopCountDown() {
      clearInterval(this.countDown)
    },

    gameOver() {
      this.stopCountDown()
      this.audioController.gameOver()
      document.getElementById("game-over-text").classList.add("visible")
    },

    victory() {
      this.stopCountDown()
      this.audioController.victory()
      document.getElementById("victory-text").classList.add("visible")
    },

    increaseCups() {
      this.cups++
      this.ticker.innerText = this.cups
    },
  }

  return game
}

function setupItems() {
  const dropContainer = document.querySelector(".drop-container")
  const smallImages = document.querySelector(".small-images")
  while (dropContainer.firstChild) {
    smallImages.appendChild(dropContainer.firstChild)
  }
}

function ready() {
  const overlays = Array.from(document.getElementsByClassName("overlay-text"))
  const game = createGame(20)

  overlays.forEach((overlay) => {
    overlay.addEventListener("click", () => {
      overlay.classList.remove("visible")
      game.startGame()

      setupItems()
    })
  })

  function resetAnimationItem() {
    const item = document.getElementById("animation-item")
    item.style.animation = "none"
    item.offsetHeight
    item.style.animation = null
  }

  const smallImages = document.querySelectorAll(".small-images img")
  const dropContainer = document.querySelector(".drop-container")

  smallImages.forEach((smallImage) => {
    smallImage.addEventListener("dragstart", function (e) {
      e.dataTransfer.setData("text/plain", smallImage.id)
    })
  })

  dropContainer.addEventListener("dragover", function (e) {
    e.preventDefault()
  })

  dropContainer.addEventListener("drop", function (e) {
    e.preventDefault()
    const itemId = e.dataTransfer.getData("text/plain")
    const smallImage = document.getElementById(itemId)

    if (smallImage) {
      dropContainer.appendChild(smallImage)
      game.increaseCups()

      const dropSound = new Audio("audio/coin.mp3")
      dropSound.play()

      resetAnimationItem()
      const item = document.getElementById("animation-item")
      item.classList.add("animate-item-drop")
    }
  })
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", ready)
} else {
  ready()
}
