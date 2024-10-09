const gameStartReducer = (state, action) =>{
    switch (action.type) {
      case "gameStart":
        return {
          ...state, // Preserve the current state if needed
          visible: action.visible,
          text: action.text,
          userChoiceVisible: action.userChoiceVisible
        };
      case "gamePlayAgain":
        return {
          ...state, // Preserve the current state if needed
          visible: action.visible,
          text: action.text,
          userChoiceVisible: action.userChoiceVisible
        };
      default:
        return state; // Return the current state if action type doesn't match
    }

  };

const gameChoiceReducer = (state, action) =>{
    switch (action.type) {
      case "playerChoice":
        return {
          ...state, // Preserve the current state if needed
          ...action,
          round: state.round + action.round,
          player1_score: state.player1_score + action.player1_score,
          player2_score: state.player2_score + action.player2_score,
        };
      case "playerChoiceReset":
        return {...action};
      default:
        return state; // Return the current state if action type doesn't match
    }

  };


export default {gameStartReducer, gameChoiceReducer}
