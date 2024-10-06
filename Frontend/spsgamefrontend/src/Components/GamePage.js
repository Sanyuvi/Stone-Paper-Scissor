import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GamePage = () => {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [rounds, setRounds] = useState([]);
  const [gameId, setGameId] = useState(`game_${Date.now()}`);
  const [currentRound, setCurrentRound] = useState(0);
  const [finalWinner, setFinalWinner] = useState(null);
  const navigate = useNavigate();

  const handleGameHistoryClick = () => {
    navigate("/historyPage"); // Specify the path for the game history page
  };

  const API = "http://localhost:5578";
  const icons = [
    { name: "Stone", iconClass: "fa-solid fa-bomb", color: "text-muted" },
    {
      name: "Paper",
      iconClass: "fa-regular fa-note-sticky",
      color: "text-success",
    },
    {
      name: "Scissors",
      iconClass: "fa-solid fa-scissors",
      color: "text-danger",
    },
  ];

  const selectedChoice = (choicesIndex) => {
    setPlayerChoice(choicesIndex);
  };

  const generateComputerChoice = () => {
    const randomNum = Math.floor(Math.random() * 3);
    setComputerChoice(computerChoice);
  };

  const startGame = async () => {
    if (currentRound >= 6) {
      return;
    }

    const player1_choice = icons[playerChoice].name.toLowerCase();

    try {
      const response = await axios.post(`${API}/playgame`, {
        player1_name: "San",
        player1_choice: player1_choice,
        gameId,
      });

      const {
        rounds = [],
        player1_score,
        player2_score,
        final_winner,
      } = response.data;

      // Update the scores and rounds based on the response
      setRounds((prevRounds) => [...prevRounds, ...rounds]); // Append all rounds
      setPlayerScore(response.data.player1_score);
      setComputerScore(response.data.computer_score);
      if (rounds.length > 0) {
        const lastRound = rounds[rounds.length - 1];
        setComputerChoice(
          icons.findIndex(
            (icon) => icon.name.toLowerCase() === lastRound.player2_choice
          )
        );
      }
      // Check if the game is completed
      if (final_winner) {
        setFinalWinner(final_winner);
        console.log(final_winner);
      } else {
        setCurrentRound((prev) => prev + 1); // Only increment if the game is still ongoing
      }
    } catch (error) {
      console.error("Error playing the game:", error);
    }
  };

  return (
    <div className="container-fluid bg-secondary-subtle vh-100 ">
      <div className="row mx-auto w-50 ">
        <div className="col rounded-1 mt-3 shadow bg-dark-subtle col-lg-12">
          <h1>STONE, PAPER & SCISSOR</h1>
        </div>
      </div>

      <div className="row m-5">
        <div className="col-3 px-3 py-5 rounded-3 shadow bg-light ">
          <h5 className="fw-bolder ">Player 1</h5>
          <p>
            <b>Name:</b> San
          </p>
          <p>Score:{playerScore}</p>
        </div>
        <div className="col-6 align-self-center">
          {finalWinner ? (
            <p className="m-0 tada">Game Over! Final Winner: {finalWinner}</p>
          ) : (
            <div className="row d-flex justify-content-center">
              <div className="col-6">
                {playerChoice !== null ? (
                  <>
                    <i
                      className={`${icons[playerChoice].iconClass} shadow p-2 rounded-4 border ${icons[playerChoice].color}`}
                      style={{ fontSize: 70 }}
                    ></i>
                    <p>{icons[playerChoice].name}</p>
                  </>
                ) : (
                  <>
                    <i
                      className="fa-solid fa-question-circle shadow p-2 rounded-4 border text-muted"
                      style={{ fontSize: 70 }}
                    ></i>
                    <p className="m-0">Choose option!</p>
                  </>
                )}
              </div>
              <div className="col-6">
                {computerChoice !== null ? (
                  <>
                    <i
                      className={`${icons[computerChoice].iconClass} shadow p-2 rounded-4 border ${icons[computerChoice].color}`}
                      style={{ fontSize: 70 }}
                    ></i>
                    <p>{icons[computerChoice].name}</p>
                  </>
                ) : (
                  <>
                    <i
                      className="fa-solid fa-question-circle shadow p-2 rounded-4 border text-muted"
                      style={{ fontSize: 70 }}
                    ></i>
                    <p className="m-0">Choose option!</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="col-3 px-3 py-5 rounded-3 shadow bg-light">
          <h5 className="fw-bolder ">Player 2</h5>
          <p>
            <b> Name:</b> Computer
          </p>
          <p>Score:{computerScore}</p>
        </div>
      </div>

      <div className="row justify-content-center m-5">
        <div className="d-flex mt-5 gap-1 justify-content-around w-50 ">
          {icons.map((icon, index) => (
            <div
              key={index}
              className="shadow icon-container pointer text-center px-2 rounded-4 border"
            >
              <i
                className={`${icon.iconClass} fs-1 mt-3 ${icon.color}`}
                onClick={() => selectedChoice(index)}
              ></i>
              <p className="m-0">{icon.name}</p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <button
          type="button"
          className="btn btn-dark px-3"
          onClick={startGame}
          disabled={finalWinner !== null || currentRound >= 6}
        >
          {finalWinner ? "Game Over" : "Play"}
        </button>
        <button
          type="button"
          className="btn btn-dark px-3 ms-2 "
          // onClick={resetGame}
        >
          Reset Game
        </button>
        <button
          type="button"
          className="btn btn-dark px-3 ms-2 "
          onClick={handleGameHistoryClick}
        >
          Game History
        </button>
      </div>
    </div>
  );
};

export default GamePage;
