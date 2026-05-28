// Login page for access to dashboard and back end
import { useState, useEffect } from "react";
import { useWindowSize } from "react-use";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth.jsx";
import { m } from '../paraglide/messages.js';
import { locales } from '../paraglide/runtime.js';
import { localeConfig } from '../utils/locales.js';
import { useLocale } from '../utils/localeContext';
import Confetti from 'react-confetti'
import orcLogo from "/orc_favicon.svg";


const Login = ({ apiStatus }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passAvailable, setPassAvailable] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, passwordAvailable, setNewPassword } = useAuth();
  const { width, height } = useWindowSize();
  const { locale, changeLocale } = useLocale();
  // upon entering the page, check if a password exists in the database
  useEffect(()  => {
    async function fetchPasswordAvailable() {
      const res = await passwordAvailable();
      setPassAvailable(res);
    }
    fetchPasswordAvailable();
  }, [])

  const passwordsMatch = passAvailable ? true : password.length > 0 && password === confirmPassword;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!passAvailable) {
      console.log("Setting password first")
      await setNewPassword(password);
      setPassAvailable(true);
    }
    try {
      await login(password);
      navigate("/"); // Redirect after successful login
    } catch (error) {
      console.error("Login failed:", error);
      setError("Invalid password");
    }
  };

  return (
    <div>
    {!passAvailable && <Confetti width={width} height={height} />}
    <div className="spinner-container" style={{overflow: "hidden"}}>
      <p>OpenRiverCam-OS {apiStatus.release} v{apiStatus.version} </p>
      <div>
        <a href="https://openrivercam.org" target="_blank">
          <img src={orcLogo} className="logo" alt="ORC logo" style={{"height": "300px"}} />
        </a>
      </div>
      <select
        value={locale}
        onChange={(e) => changeLocale(e.target.value)}
        style={{ marginBottom: "12px" }}
      >
        {locales.map((l) => (
          <option key={l} value={l}>
            {localeConfig[l].label}
          </option>
        ))}
      </select>
      <div>
        {passAvailable ? (
      <p style={{textAlign: "center"}}>Please enter your {m.password()} to proceed</p>) : (
        <div>
          <p>{m.login_congrats_first_use()}</p>
        </div>)
        }
      </div>
      <form onSubmit={handleLogin} style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
        <input
          type="password"
          placeholder={`${m.login_enter()} ${m.password()}`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {/* add another field for password confirmation when password is being created */}
        {!passAvailable ? (
          <>
            <input
              type="password"
              placeholder={`${m.login_confirm()} ${m.password()}`}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              style={{ marginTop: "8px" }}
            />
            <button className="btn btn-primary" type="submit">{m.login_create()} {m.password()}</button>
            {confirmPassword.length > 0 && (
              <p style={{ color: passwordsMatch ? "green" : "red", margin: "6px 0" }}>
                {passwordsMatch ? "Passwords match" : "Passwords do not match"}
              </p>
            )}
          </>
        ) : (
          <button className="btn btn-primary" type="submit">Login</button>
        )}
        {error && <p style={{ color: "red" }}>{error}</p>} {/* Display login error */}
      </form>
    </div>
    </div>
  );
};
export default Login;
