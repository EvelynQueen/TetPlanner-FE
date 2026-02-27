import { api } from "../config/api";

// POST /api/auth/register
export async function signUpService({ name, email, password }) {
  try {
    const response = await api.post("/auth/register", {
      fullName: name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Sign up failed. Please try again.");
  }
}

//POST /api/auth/verify-email

export async function verifyOTP(email, otp) {
  try {
    const response = await api.post("/auth/verify-email", {
      email,
      code: otp,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Invalid or expired OTP. Please try again.");
  }
}

// POST /api/auth/resend-otp
export async function sendOTP(email) {
  try {
    const response = await api.post("/auth/resend-otp", { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to resend OTP. Please try again.");
  }
}
