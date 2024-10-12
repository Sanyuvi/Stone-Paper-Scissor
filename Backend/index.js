const express = require("express");
const cors = require("cors");
const pool = require("./db");
const app = express();

require("dotenv").config();
const PORT = process.env.PORT || 5578;

app.use(cors());
app.use(express.json()); // to parse JSON bodies


// Route to save game data
app.post("/playgame", async (req, res) => {
  const generateGameId = `game_${Date.now()}`
  try {    
     const game = {
        game_id: generateGameId,
        player1_name: "You",
        player2_name: "Computer",
        player1_score: 0,
        player2_score: 0,
        rounds: [],
      };
      await pool.query(
        "INSERT INTO game_data (game_id, player1_name, player2_name, rounds, player1_score, player2_score) VALUES ($1, $2, $3, $4, $5, $6)",
        [game.game_id, game.player1_name, game.player2_name, JSON.stringify([]), 0, 0]
      );
    
      return res.status(200).json({
        game_id: game.game_id,
        rounds: game.rounds,  
        player1_score: game.player1_score,
        computer_score: game.player2_score,
      });
  
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).send({ error: "Internal server error" });
  }
});

app.put("/playgame/:id", async (req, res) => {
  const gameId = req.params.id; // Get the game ID from the route parameters
  const {player1_score, player2_score, player1_choice, player2_choice, round} = req.body; // Get new round data from the request body

  try {
      // Retrieve the current game data from the database
      const result = await pool.query("SELECT * FROM game_data WHERE game_id = $1", [gameId]);
      const game = result.rows[0];

      if (!game) {
          return res.status(404).send({ error: "Game not found" });
      }

      const roundData = game.rounds
      // Update the rounds array
      const updatedRounds = [...roundData, {player1_choice, player2_choice, player1_score, player2_score, round}];

      const totalPlayerScore1 = updatedRounds.reduce((pre, crr) => pre + crr.player1_score ,0);
      const totalPlayerScore2 = updatedRounds.reduce((pre, crr) => pre + crr.player2_score ,0);

      let finalWinner = null;

      if(round === 6){
        if(totalPlayerScore1 > totalPlayerScore2){
          finalWinner = "You";
       }else if(totalPlayerScore1 === totalPlayerScore2){
         finalWinner = "Tie";
       }else{
         finalWinner = "Computer";
       }
      }
      // Update the game in the database
      await pool.query(
          "UPDATE game_data SET rounds = $1, player1_score = $2, player2_score = $3, final_winner = $4 WHERE game_id = $5",
          [JSON.stringify(updatedRounds), totalPlayerScore1, totalPlayerScore2, finalWinner, gameId]
      );


      return res.status(200).json({
          game_id: gameId,
          rounds: updatedRounds,
          player1_score: totalPlayerScore1,
          computer_score: totalPlayerScore2,
          final_winner: finalWinner
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
