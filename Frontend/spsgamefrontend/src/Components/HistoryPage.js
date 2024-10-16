import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const HistoryPage = () => {
  const [gameData, setGameData] = useState();
  const [loading, setLoading] = useState(false);
  // const API = "https://stone-paper-scissor-xosi.vercel.app";
  const API = "http://3.104.238.165:3001";
  const navigate = useNavigate();

  const icons = [
    {
      id: 1,
      name: "Stone",
      iconClass: "fa-solid fa-bomb",
      color: "text-muted",
    },
    {
      id: 2,
      name: "Paper",
      iconClass: "fa-regular fa-note-sticky",
      color: "text-success",
    },
    {
      id: 3,
      name: "Scissors",
      iconClass: "fa-solid fa-scissors",
      color: "text-danger",
    },
  ];

  const fetchGameHistory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API}/allgames`);
      console.log("Response:", response);
      setGameData(response.data);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  // Function to get name based on choice
  const getChoiceName = (choiceId) => {
    const icon = icons.find((icon) => icon.id === choiceId);
    return icon ? icon.name : "Unknown"; // Fallback
  };

  useEffect(() => {
    fetchGameHistory();
  }, []);

  return (
    <>
      {loading && (
        <div
          style={{ background: "#00000066" }}
          className="vh-100 d-flex justify-content-center align-items-center position-absolute top-0 start-0 bottom-0 end-0"
        >
          <div class="spinner-border" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      <div className="bg-dark-subtle p-2">
        <button
          className="btn btn-dark float-end"
          onClick={() => navigate("/")}
        >
          Back
        </button>
        <h1>Game History</h1>
        {gameData?.map((game, index) => (
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
                    <th>Player 1 Score</th>
                    <th>Player 2 Score</th>
                  </tr>
                </thead>
                <tbody>
                  {game.rounds.map((round, roundIndex) => (
                    <tr key={roundIndex}>
                      <td>{round.round}</td>
                      <td>{getChoiceName(round.player1_choice)}</td>
                      <td>{getChoiceName(round.player2_choice)}</td>
                      <td>{round.player1_score}</td>
                      <td>{round.player2_score}</td>
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
    </>
  );
};

export default HistoryPage;
