import React, { useEffect, useState } from "react";
import axios from "axios";

const HistoryPage = () => {
  const [gameData, setGameData] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API = "http://localhost:5578";

  useEffect(() => {
    const fetchGameHistory = async () => {
      try {
        const response = await axios.get(`${API}/allgames`);
        console.log("Response:", response);
        setGameData(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGameHistory();
  }, []);
  console.log("Current gameData:", gameData);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error fetching game history: {error}</p>;

  if (!gameData) return <p>No game data available.</p>;

  return (
    <div className="bg-dark-subtle">
      <h1>Game History</h1>
      {gameData.map((game, index) => (
        <div key={index} className="border border-secondary border-1">
          <h2 className="mt-3">Game ID: {game.game_id || "N/A"}</h2>
          <p>Player 1: {game.player1_name || "N/A"}</p>
          <p>Player 2: {game.player2_name || "N/A"}</p>
          <p>Final Winner: {game.final_winner || "N/A"}</p>
          <p>Player 1 Score: {game.player1_score || "N/A"}</p>
          <p>Player 2 Score: {game.player2_score || "N/A"}</p>
          <h3>Rounds:</h3>
          {Array.isArray(game.rounds) && game.rounds.length > 0 ? (
            <table className="table table-secondary">
              <thead>
                <tr>
                  <th>Round</th>
                  <th>Player 1 Choice</th>
                  <th>Player 2 Choice</th>
                  <th>Winner</th>
                </tr>
              </thead>
              <tbody>
                {game.rounds.map((round, roundIndex) => (
                  <tr key={roundIndex}>
                    <td>{round.round}</td>
                    <td>{round.player1_choice}</td>
                    <td>{round.player2_choice}</td>
                    <td>
                      {round.winner === "tie"
                        ? "Tie"
                        : round.winner === "player1"
                        ? game.player1_name
                        : game.player2_name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No rounds available.</p>
          )}
          <p>
            Created At:{" "}
            {game.created_at
              ? new Date(game.created_at).toLocaleString()
              : "N/A"}
          </p>
        </div>
      ))}
    </div>
  );
};

export default HistoryPage;
