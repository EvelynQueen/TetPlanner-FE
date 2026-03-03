import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import { ToastContainer } from "react-toastify";

// Components & Pages
import SideBar from "./components/SideBar";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Shopping from "./pages/Shopping";
import Calendar from "./pages/Calendar";
import SignUp from "./pages/auth/SignUp.jsx";
import VerifyEmail from "./pages/auth/VerifyEmail.jsx";
import LoginForm from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ResetPassSuccess from "./pages/auth/ResetPassSuccess";
import FallingTheme from "./components/FallingTheme.jsx";
import { useAuth } from "./hooks/useAuth";
import useTheme from "./hooks/useTheme";

function App() {
  const { token } = useAuth();
  const { flowerIcon } = useTheme("default");

  return (
    <div className="w-full relative h-screen flex overflow-hidden bg-(--color-bg-app) text-(--color-text-primary) transition-colors duration-200">
      {token ? (
        <>
          <div className="h-screen shrink-0 z-20">
            <SideBar />
          </div>

          <FallingTheme flowerIcon={flowerIcon} />

          <div className="flex-1 h-screen overflow-y-auto relative scroll-smooth">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/shopping" element={<Shopping />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </>
      ) : (
        <div className="flex-1 h-screen overflow-y-auto">
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/reset-success" element={<ResetPassSuccess />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        theme="colored"
      />
    </div>
  );
}

export default App;
