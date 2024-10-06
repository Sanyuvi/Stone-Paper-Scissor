const express = require("express");
const cors = require("cors");
const pool = require("./db");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json()); // to parse JSON bodies

// Function to determine the winner of each round
function determineRoundWinner(player1_choice, player2_choice) {
  if (player1_choice === player2_choice) {
    return "tie";
  }
  if (
    (player1_choice === "stone" && player2_choice === "scissors") ||
    (player1_choice === "scissors" && player2_choice === "paper") ||
    (player1_choice === "paper" && player2_choice === "stone")
  ) {
    return "player1";
  } else {
    return "player2";
  }
}

// Function to randomly select stone, paper, or scissors for the computer (Player 2)
function getRandomChoice() {
  const choices = ["stone", "paper", "scissors"];
  const randomIndex = Math.floor(Math.random() * choices.length); // Get random index (0, 1, or 2)
  return choices[randomIndex];
}

// Main function to handle the 6-round game
// function playGame(player1_name, player1_choices) {
//   const player2_name = "Computer";

//   let player1_score = 0;
//   let player2_score = 0;
//   const rounds = [];

//   // Loop through 6 rounds
//   for (let i = 0; i < 6; i++) {
//     const player1_choice = player1_choices[i]; // player1 choice for the round

//     const player2_choice = getRandomChoice(); // player2 choice for the round

//     const roundWinner = determineRoundWinner(player1_choice, player2_choice);
//     rounds.push({
//       round: i + 1,
//       player1_choice,
//       player2_choice,
//       winner: roundWinner,
//     });

//     // Update scores based on the round winner
//     if (roundWinner === "player1") {
//       player1_score++;
//     } else if (roundWinner === "player2") {
//       player2_score++;
//     }
//   }

//   // Determine the final winner based on scores
//   let final_winner = "tie";
//   if (player1_score > player2_score) {
//     final_winner = player1_name;
//   } else if (player2_score > player1_score) {
//     final_winner = player2_name;
//   }

//   return {
//     player1_name,
//     player2_name,
//     rounds,
//     final_winner,
//   };
// }

// Route to save game data
app.post("/playgame", async (req, res) => {
  const { player1_name, player1_choice, gameId } = req.body;

  // Check if the game exists in the database
  let game;
  try {
    const result = await pool.query(
      "SELECT * FROM game_data WHERE game_id = $1",
      [gameId]
    );
    game = result.rows[0];

    if (!game) {
      // Initialize the game if it doesn't exist
      game = {
        game_id: gameId,
        player1_name,
        player2_name: "Computer",
        player1_score: 0,
        player2_score: 0,
        rounds: [],
        roundsPlayed: 0,
      };

      await pool.query(
        "INSERT INTO game_data (game_id, player1_name, player2_name, rounds, player1_score, player2_score) VALUES ($1, $2, $3, $4, $5, $6)",
        [gameId, player1_name, game.player2_name, JSON.stringify([]), 0, 0]
      );
    } else {
      // Load existing game data
      game.player1_score = game.player1_score || 0;
      game.player2_score = game.player2_score || 0;
      game.rounds = game.rounds || [];
      game.roundsPlayed = game.rounds.length;
    }

    if (game.roundsPlayed >= 6) {
      return res
        .status(400)
        .json({ error: "Game has already completed 6 rounds." });
    }

    const player2_choice = getRandomChoice(); // Computer's choice
    const roundWinner = determineRoundWinner(player1_choice, player2_choice);

    // Update scores and rounds
    if (roundWinner === "player1") {
      game.player1_score++;
    } else if (roundWinner === "player2") {
      game.player2_score++;
    }

    // Add current round to rounds array
    game.rounds.push({
      round: game.roundsPlayed + 1,
      player1_choice,
      player2_choice,
      winner: roundWinner,
    });
    game.roundsPlayed++;

    // Update game in database
    await pool.query(
      "UPDATE game_data SET player1_score = $1, player2_score = $2, rounds = $3 WHERE game_id = $4",
      [
        game.player1_score,
        game.player2_score,
        JSON.stringify(game.rounds),
        gameId,
      ]
    );

    // Check if the game is complete (after 6 rounds)
    if (game.roundsPlayed >= 6) {
      const final_winner =
        game.player1_score > game.player2_score
          ? game.player1_name
          : game.player1_score < game.player2_score
          ? "Computer"
          : "Tie";

      // Update final winner in the database
      await pool.query(
        "UPDATE game_data SET final_winner = $1 WHERE game_id = $2",
        [final_winner, gameId]
      );

      // Return final results
      return res.status(200).json({
        rounds: game.rounds,
        final_winner,
        player1_score: game.player1_score,
        computer_score: game.player2_score,
      });
    }

    // Respond with current round results
    res.status(200).json({
      round: game.rounds[game.roundsPlayed - 1],
      player1_score: game.player1_score,
      computer_score: game.player2_score,
    });
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

// Route to get all game data
app.get("/allgames", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM game_data ORDER BY created_at DESC"
    ); // Order by created_at to show latest games first
    res.status(200).json(result.rows); // Return all game data
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

//server listening
app.listen(PORT, () => console.log(`Server started in localhost:${PORT} `));
