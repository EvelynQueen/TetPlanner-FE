import { Navigate, Route, Routes } from "react-router-dom";
import { ShoppingItemProvider } from "./contexts/ShoppingItemProvider";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import SideBar from "./components/SideBar";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Shopping from "./pages/Shopping";
import Calendar from "./pages/Calendar";

// Auth Pages
import SignUp from "./pages/auth/SignUp.jsx";
import VerifyEmail from "./pages/auth/VerifyEmail.jsx";
import LoginForm from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ResetPassSuccess from "./pages/ResetPassSuccess";

// Shopping Item Pages
import CreateNewItem from "./pages/shopping-item/CreateNewItem";
import UpdateShoppingItem from "./pages/shopping-item/UpdateShoppingItem";
import DeleteShoppingItem from "./pages/shopping-item/DeleteShoppingItem";

import { ToastContainer } from "react-toastify";

// Auth Routes Layout
const AuthLayout = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" replace />} />
    <Route path="/login" element={<LoginForm />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/verify-email" element={<VerifyEmail />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route path="/reset-password" element={<ResetPassword />} />
    <Route path="/reset-success" element={<ResetPassSuccess />} />
  </Routes>
);

// Main App Layout with Sidebar
const MainLayout = () => (
  <div className="w-full h-screen flex bg-(--color-bg-main)">
    <SideBar />
    <div style={{ flex: 1, overflow: "auto" }}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/shopping" element={<Shopping />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/shopping-item/create" element={<CreateNewItem />} />
        <Route path="/shopping-item/update/:id" element={<UpdateShoppingItem />} />
        <Route path="/shopping-item/delete/:id" element={<DeleteShoppingItem />} />
      </Routes>
    </div>
  </div>
);

function App() {
  return (
    <ShoppingItemProvider>
      <>
        <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/reset-success" element={<ResetPassSuccess />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/*" element={<MainLayout />} />
      </Routes>

      <ToastContainer
        position="top-center"
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
    </ShoppingItemProvider>
  );
}

export default App;
