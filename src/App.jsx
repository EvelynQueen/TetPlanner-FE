import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import SideBar from "./components/SideBar";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Shopping from "./pages/Shopping";
import Calendar from "./pages/Calendar";
import SignUp from "./pages/auth/SignUp.jsx";
import VerifyEmail from "./pages/auth/VerifyEmail.jsx";
import LoginForm from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ResetPassSuccess from "./pages/ResetPassSuccess";
import { ToastContainer } from "react-toastify";
import TaskProvider from "./contexts/TaskProvider";
import OccasionProvider from "./contexts/OccasionProvider";
import CategoryManagement from "./pages/CategoryManagement.jsx";
import OccasionManagement from "./pages/OccasionManagement.jsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-success" element={<ResetPassSuccess />} />
        <Route
          path="/*"
          element={
            <div className="w-full h-screen flex bg-(--color-bg-main)">
              <SideBar />
              <TaskProvider>
                <OccasionProvider>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/tasks" element={<Tasks />} />
                    <Route path="/shopping" element={<Shopping />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/settings/category" element={<CategoryManagement />} />
                    <Route path="/settings/occasion" element={<OccasionManagement />} />
                  </Routes>
                </OccasionProvider>
              </TaskProvider>
            </div>
          }
        />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        theme="colored"
      />
    </>
  );
}
export default App;
