import { Route, Routes } from "react-router-dom";
import "./App.css";
import GamePage from "./Components/GamePage";
import HistoryPage from "./Components/HistoryPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route exact path="/" element={<GamePage />} />
        <Route path="/historyPage" element={<HistoryPage />} />
      </Routes>
    </div>
  );
}

export default App;
