import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ChallengePage from "../pages/challenge";
import CreateChallengePage from "../pages/create";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChallengePage />} />
        <Route path="/create" element={<CreateChallengePage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
