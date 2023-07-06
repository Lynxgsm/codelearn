import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ChallengePage from "../pages/challenge";
import CreateChallengePage from "../pages/create";
import ListPage from "../pages/list";
import MainLayout from "../layouts";
import ToasterProvider from "../providers/toaster_provider";

const AppRoutes = () => {
  return (
    <Router>
      <MainLayout>
        <ToasterProvider />
        <Routes>
          <Route path="/" element={<ListPage />} />
          <Route path="/challenge/:slug" element={<ChallengePage />} />
          <Route path="/create" element={<CreateChallengePage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default AppRoutes;
