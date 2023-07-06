import { FC, PropsWithChildren } from "react";
import { FaChevronLeft } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

const MainLayout: FC<PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <main>
      {location.pathname !== "/" && (
        <nav className="p-4">
          <button onClick={() => navigate(-1)}>
            <FaChevronLeft />
          </button>
        </nav>
      )}
      {children}
    </main>
  );
};

export default MainLayout;
