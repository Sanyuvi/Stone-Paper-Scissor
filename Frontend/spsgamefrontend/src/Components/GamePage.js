import React, { useEffect, useReducer, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import gameReducer from "./gameReducers"


const GamePage = () => {
  const navigate = useNavigate();
  const intialChoiceValue = {round: 0, player1_choice: "fa-solid fa-question-circle", player2_choice: "fa-solid fa-question-circle", player1_score: 0, player2_score: 0, player1color: "text-muted", player2color: "text-muted", player1ChoiceName: "Choose option!", player2ChoiceName: "Choose option!"}
  const [startGame, dispatchStartGame] = useReducer(gameReducer.gameStartReducer, {visible: true, userChoiceVisible: false, text: 'Play'});
  const [choices, dispatchChoices] = useReducer(gameReducer.gameChoiceReducer, intialChoiceValue);
  const [finalWinner, setFinalWinner] = useState(null);
  const [loading, setLoading] = useState(false);
 

  

  const handleGameHistoryClick = () => {
    navigate("/historyPage"); // Specify the path for the game history page
  };

  const API = "https://stone-paper-scissor-xosi.vercel.app";
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
    const computerDetail = generateComputerChoice();
    const  choiceDetails = icons.filter((data)=> data.id === choicesID)

    let gameData = {
      "round": choices.round + 1,
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
  
   dispatchChoices({
    type: "playerChoice",
    round: 1,
    player1_choice: choiceDetails[0].iconClass,
    player2_choice: computerDetail.iconClass,
    player1_score: gameData.player1_score,
    player2_score: gameData.player2_score,
    player1color: choiceDetails[0].color,
    player2color: computerDetail.color,
    player1ChoiceName: choiceDetails[0].name,
    player2ChoiceName: computerDetail.name,
   })


   
   try {
     setLoading(true)
     const {data} = await axios.put(`${API}/playgame/${gameId}`, gameData);
     if(gameData.round === 6){
        setFinalWinner(data.final_winner)
        dispatchStartGame({type: "gamePlayAgain", text: "Play Again", visible: true, userChoiceVisible: false})
        dispatchChoices({...intialChoiceValue, type: "playerChoiceReset"});
     }    
   } catch (error) {
    
   }finally{
    setLoading(false)
   }
  };

  const generateComputerChoice = () =>{
    const randomNum = Math.floor(Math.random()*3)+ 1;
    const  choiceDetails = icons.filter((data)=> data.id === randomNum)
    return choiceDetails[0]
  }

  const playGame = async () => {
     setFinalWinner(null)
     dispatchStartGame({
      type: 'gameStart',
      visible: false,
      text: "Play Again",
      userChoiceVisible: true
    })
    try {
      setLoading(true)
      const {data} = await axios.post(`${API}/playgame`);
       sessionStorage.setItem("gameId", data.game_id);      
     } catch (error) {
      
     }finally{
      setLoading(false);
     }
  }

  useEffect(()=>{
    sessionStorage.clear();
  },[])

  return (
    <>
    {loading && <div style={{background: '#00000066'}} className="vh-100 d-flex justify-content-center align-items-center position-absolute top-0 start-0 bottom-0 end-0">
                  <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                  </div>
                </div> }
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
         <p>Score:{choices.player1_score}</p>
       </div>
       <div className="col-6 align-self-center">
         {startGame.userChoiceVisible && <b>Round : {choices.round}</b>}
         {finalWinner ? (
           <p className="m-0 tada">Game Over !!! <br/> Final Winner: {finalWinner}</p>
         ) : (
           <div className="row d-flex justify-content-center">
             <div className="col-6">
               <i className={`${choices.player1_choice} shadow p-2 rounded-4 border ${choices.player1color}`} style={{ fontSize: 70 }}></i>
               <p className="m-0">{choices.player1ChoiceName}</p>
             </div>
             <div className="col-6">
               <i className={`${choices.player2_choice} shadow p-2 rounded-4 border ${choices.player2color}`} style={{ fontSize: 70 }}></i>
               <p className="m-0">{choices.player2ChoiceName}</p>
             </div>
           </div>
         )}
       </div>
       <div className="col-3 px-3 py-5 rounded-3 shadow bg-light">
         <h5 className="fw-bolder ">Player 2</h5>
         <p>
           <b> Name:</b> Computer
         </p>
         <p>Score:{choices.player2_score}</p>
       </div>
     </div>

     { startGame.userChoiceVisible &&  <div className="row justify-content-center m-5">
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
         startGame.visible &&
         <button type="button" className="btn btn-dark px-3" onClick={playGame}>{startGame.text}</button>
       }       
       <button
         type="button"
         className="btn btn-dark px-3 ms-2 "
         onClick={handleGameHistoryClick}
       >
         Game History
       </button>
     </div>
   </div>
    </>
  );
};

export default GamePage;

