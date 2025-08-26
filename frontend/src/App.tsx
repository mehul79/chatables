import Navbar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";

import { useAuthStore } from "./store/useAuthStore";
import { useTheameStore } from "./store/useTheameStore";

import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import TextPage from "./pages/TextPage";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const {theme} = useTheameStore()

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);


  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen" data-theme={theme}>
        Loading...
      </div>
    );

  return (
    <div data-theme={theme} >
      <div className="absolute top-0 left-0 w-full z-10">
        <Navbar />
      </div>
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
        <Route path="/text" element={<TextPage />} />
      </Routes>
      <Toaster />
    </div>
  );
};
export default App;