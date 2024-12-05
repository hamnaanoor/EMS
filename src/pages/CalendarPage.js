import React, { useState } from "react";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import "./Calendar.css";

const CalendarPage = () => {
  const [userData, setUserData] = useState(null);
  const [tokenData, setTokenData] = useState(null);

  const handleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      const { code } = response;

      try {
        // Exchange the authorization code for tokens on the backend
        const res = await axios.post("http://localhost:5001/auth/google", { code });

        const { access_token, refresh_token } = res.data;
        setTokenData({ access_token, refresh_token });

        // Fetch user info using access token
        const userInfoRes = await axios.get("https://www.googleapis.com/oauth2/v1/userinfo", {
          headers: { Authorization: `Bearer ${access_token}` },
        });

        setUserData(userInfoRes.data);
      } catch (error) {
        console.error("Error during Google login:", error.message);
        alert("Login failed. Please try again.");
      }
    },
    onError: () => alert("Login failed. Please try again."),
    flow: "auth-code",
  });

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>Google OAuth Refresh Token Example</h1>
      {!tokenData ? (
        <button onClick={handleLogin}>Login with Google</button>
      ) : (
        <div>
          <h2>Welcome, {userData?.name}</h2>
          <p>Email: {userData?.email}</p>
          <p>Access Token: {tokenData?.access_token}</p>
          <p>Refresh Token: {tokenData?.refresh_token}</p>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <CalendarPage />
    </GoogleOAuthProvider>
  );
}


export default App;
