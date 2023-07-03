import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ChallengePage from "../pages/challenge";
const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ChallengePage />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
