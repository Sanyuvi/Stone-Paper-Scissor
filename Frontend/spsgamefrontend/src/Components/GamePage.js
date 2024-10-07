import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const GamePage = () => {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [computerChoice, setComputerChoice] = useState(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [computerScore, setComputerScore] = useState(0);
  const [rounds, setRounds] = useState(1);
  const [userChoice, setUserChoice] = useState(false); 
  const [finalWinner, setFinalWinner] = useState(null);
  const [startGame, setStartGame] = useState(true);
  const [reGame, setReGame] = useState(false);
  const navigate = useNavigate();


  const handleGameHistoryClick = () => {
    navigate("/historyPage"); // Specify the path for the game history page
  };

  const API = "http://localhost:5578";
  const icons = [
    { id: 1, name: "Stone", iconClass: "fa-solid fa-bomb", color: "text-muted" },
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

  const selectedChoice = async (choicesID) => {
    const gameId = sessionStorage.getItem("gameId");
    setRounds(rounds + 1);  
    
    const computerDetail = generateComputerChoice();
    const  choiceDetails = icons.filter((data)=> data.id === choicesID)
    // console.log(choiceDetails);
    setPlayerChoice(choiceDetails[0]);    
    
    scoreHandler(choiceDetails[0], computerDetail);
    let gameData = {
      "round": rounds,
      "player1_choice": choiceDetails[0].id,
      "player2_choice": computerDetail.id,
      "player1_score": 0,
      "player2_score": 0
   }

   
   if((choiceDetails[0].id === 1 && computerDetail.id === 3) || (choiceDetails[0].id === 3 && computerDetail.id === 2) || (choiceDetails[0].id === 2 && computerDetail.id === 1)){
     gameData.player1_score = 1
    }else if(choiceDetails[0].id === computerDetail.id){
     gameData.player1_score = 0
     gameData.player2_score = 0
    }else{
     gameData.player2_score = 1;
   }

   const {data} = await axios.put(`${API}/playgame/${gameId}`, gameData);
   console.log(data)
   if(rounds === 6){
    setRounds(1);
    setUserChoice(false);
    if(playerScore > computerScore){
       setFinalWinner("You");
    }else if(playerScore === computerScore){
      setFinalWinner("Tie");
    }else{
      setFinalWinner("Computer");
    }
      setReGame(true);
    return;
  }
  };

  const generateComputerChoice = () =>{
    const randomNum = Math.floor(Math.random()*3)+ 1;
    const  choiceDetails = icons.filter((data)=> data.id === randomNum)
    setComputerChoice(choiceDetails[0])
    return choiceDetails[0]
  }

  const scoreHandler = (player1_choice, player2_choice ) => {   
      if (player1_choice.id === player2_choice.id) {
        return;
      }
      if (
        (player1_choice.id === 1 && player2_choice.id === 3) ||
        (player1_choice.id === 3 && player2_choice.id === 2) ||
        (player1_choice.id === 2 && player2_choice.id === 1)
      ) {
        setPlayerScore(playerScore + 1);
        return;
      } else {
        setComputerScore(computerScore + 1);
        return;
      }

  }

  const playGame = async () => {
     setStartGame(false);
     setUserChoice(true);
     const {data} = await axios.post(`${API}/playgame`);
     sessionStorage.setItem("gameId", data.game_id);
  }

  const playAgain = async () => {
     setReGame(false);
     setPlayerScore(0);
     setComputerScore(0);
     setPlayerChoice(null);
     setComputerChoice(null);
     setFinalWinner(null);
     sessionStorage.clear();
     setUserChoice(true);
     const {data} = await axios.post(`${API}/playgame`);
     sessionStorage.setItem("gameId", data.game_id);
  }
  

  // const startGame = async () => {
  //   if (currentRound >= 6) {
  //     return;
  //   }

  //   const player1_choice = icons[playerChoice].name.toLowerCase();

  //   try {
  //     const response = await axios.post(`${API}/playgame`, {
  //       player1_name: "San",
  //       player1_choice: player1_choice,
  //       gameId,
  //     });

  //     const {
  //       rounds = [],
  //       player1_score,
  //       player2_score,
  //       final_winner,
  //     } = response.data;

  //     // Update the scores and rounds based on the response
  //     setRounds((prevRounds) => [...prevRounds, ...rounds]); // Append all rounds
  //     setPlayerScore(response.data.player1_score);
  //     setComputerScore(response.data.computer_score);
  //     if (rounds.length > 0) {
  //       const lastRound = rounds[rounds.length - 1];
  //       setComputerChoice(
  //         icons.findIndex(
  //           (icon) => icon.name.toLowerCase() === lastRound.player2_choice
  //         )
  //       );
  //     }
  //     // Check if the game is completed
  //     if (final_winner) {
  //       setFinalWinner(final_winner);
  //       console.log(final_winner);
  //     } else {
  //       setCurrentRound((prev) => prev + 1); // Only increment if the game is still ongoing
  //     }
  //   } catch (error) {
  //     console.error("Error playing the game:", error);
  //   }
  // };

  useEffect(()=>{
    sessionStorage.clear();
  },[])

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
            <b>Name:</b> You
          </p>
          <p>Score:{playerScore}</p>
        </div>
        <div className="col-6 align-self-center">
          {finalWinner ? (
            <p className="m-0 tada">Game Over !!! <br/> Final Winner: {finalWinner}</p>
          ) : (
            <div className="row d-flex justify-content-center">
              <div className="col-6">
                {playerChoice !== null ? (
                  <>
                    <i className={`${playerChoice.iconClass} shadow p-2 rounded-4 border ${playerChoice.color}`} style={{ fontSize: 70 }}></i>
                    <p>{playerChoice.name}</p>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-question-circle shadow p-2 rounded-4 border text-muted" style={{ fontSize: 70 }}></i>
                    <p className="m-0">Choose option!</p>
                  </>
                )}
              </div>
              <div className="col-6">
                {computerChoice !== null ? (
                  <>
                    <i className={`${computerChoice.iconClass} shadow p-2 rounded-4 border ${computerChoice.color}`} style={{ fontSize: 70 }} ></i>
                    <p>{computerChoice.name}</p>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-question-circle shadow p-2 rounded-4 border text-muted" style={{ fontSize: 70 }}></i>
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

      { userChoice &&  <div className="row justify-content-center m-5">
        <div className="d-flex mt-5 gap-1 justify-content-around w-50 ">
          {icons.map((icon, index) => (
            <div key={icon.id} onClick={() => selectedChoice(icon.id)} className="shadow icon-container pointer text-center px-2 rounded-4 border">
              <i className={`${icon.iconClass} fs-1 mt-3 ${icon.color}`}></i>
              <p className="m-0">{icon.name}</p>
            </div>
          ))}
        </div>
      </div>}
      <div>
        {
          startGame &&
          <button type="button" className="btn btn-dark px-3" onClick={playGame}>Play</button>
        }
        {reGame && <button type="button"  className="btn btn-dark px-3 ms-2 " onClick={playAgain} >Play Again!</button>}
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
