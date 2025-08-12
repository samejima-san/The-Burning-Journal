import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Completed from "./pages/100percented";
import Finished from "./pages/finished";
import Milestones from "./pages/milestones";
import RandomGame from "./pages/surpriseme";
import Top10 from "./pages/top10played";
import AllGames from "./pages/allgames";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/all-games" element={<AllGames />} />
        <Route path="/top10" element={<Top10 />} />
        <Route path="/milestones" element={<Milestones />} />
        <Route path="/completed" element={<Completed />} />
        <Route path="/finished" element={<Finished />} />
        <Route path="/surprise-me" element={<RandomGame />} />
      </Routes>
    </Router>
  );
}

export default App;
