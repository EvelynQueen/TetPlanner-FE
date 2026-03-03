import { useCallback, useState, useEffect } from "react";
import {
  sendOTP,
  signUpService,
  verifyOTP,
  loginService,
  forgotPasswordService,
  resetPasswordService,
} from "../api/authAPI";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const [token, setToken] = useState(
    () => localStorage.getItem("accessToken") || null,
  );

  // Khởi tạo userName từ localStorage
  const [userName, setUserName] = useState(
    () => localStorage.getItem("userName") || null,
  );

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Đồng bộ token với localStorage
  useEffect(() => {
    if (token && token !== "undefined" && token !== "null") {
      localStorage.setItem("accessToken", token);
    } else {
      localStorage.removeItem("accessToken");
    }
  }, [token]);

  // Đồng bộ userName với localStorage
  useEffect(() => {
    if (userName && userName !== "undefined" && userName !== "null") {
      localStorage.setItem("userName", userName);
    } else {
      localStorage.removeItem("userName");
    }
  }, [userName]);

  const clearError = useCallback(() => setError(""), []);

  /** Simulate sign-up: stores user info then sends OTP */
  const signUp = useCallback(async ({ name, email, password }) => {
    setLoading(true);
    setError("");
    try {
      await signUpService({ name, email, password });
    } catch (err) {
      setError(err.message || "Sign up failed. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /** Verify the 4-digit OTP; sets user on success */
  const verifyEmail = useCallback(async ({ email, otp }) => {
    setLoading(true);
    setError("");
    try {
      const response = await verifyOTP(email, otp);
      const authToken =
        response.data?.accessToken ||
        response.accessToken ||
        response.data?.token ||
        response.token;

      if (authToken) {
        setToken(authToken);
      }
      setUser({ email });
      return response;
    } catch (err) {
      setError(err.message || "Verification failed. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /** Re-generate and re-send OTP */
  const resendOtp = useCallback(async ({ email }) => {
    setLoading(true);
    setError("");
    try {
      await sendOTP(email);
    } catch (err) {
      setError(err.message || "Failed to resend OTP. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setLoading(true);
    setError("");
    try {
      const response = await loginService({ email, password });

      // Trích xuất token và name theo cấu trúc API chuẩn
      const authToken = response.data?.accessToken;
      const name = response.data?.name || email;

      if (response.success && authToken) {
        setToken(authToken);
        setUserName(name); // Cập nhật state userName (sẽ trigger useEffect lưu vào localStorage)
        setUser({ email, name });
      } else if (response.success && !authToken) {
        console.warn(
          "Login successful but no token found in response:",
          response,
        );
      }
      return response;
    } catch (err) {
      setError(err.message || "Login failed.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    // Reset toàn bộ state
    setToken(null);
    setUser(null);
    setUserName(null);

    // Xóa dữ liệu ở localStorage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("user");
  }, []);

  const forgotPassword = useCallback(async ({ email }) => {
    setLoading(true);
    setError("");
    try {
      const response = await forgotPasswordService({ email });
      return response;
    } catch (err) {
      setError(err.message || "Failed to send reset link.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetPassword = useCallback(
    async ({ token: resetToken, newPassword }) => {
      setLoading(true);
      setError("");
      try {
        const response = await resetPasswordService({
          token: resetToken,
          newPassword,
        });
        return response;
      } catch (err) {
        setError(err.message || "Failed to reset password.");
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        userName,
        error,
        loading,
        signUp,
        verifyEmail,
        resendOtp,
        login,
        logout,
        forgotPassword,
        resetPassword,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
