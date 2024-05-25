// Inbuilt Packages
import axios from "axios";

// API_URL = "http://localhost:5000";

const API_URL = process.env.REACT_APP_API_URL;

// Function to register a new user
export const signUp = async (data) => {
  try {
    return await axios.post(`${API_URL}/auth/signup`, data);
  } catch (error) {
    return error;
  }
};

// Function to login a user
export const signIn = async (data) => {
  try {
    return await axios.post(`${API_URL}/auth/signin`, data);
  } catch (error) {
    return error;
  }
};

