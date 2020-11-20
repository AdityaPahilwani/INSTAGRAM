import React, { useState, useContext } from "react";
import "./authGlobalStyle.css";
import { Link, useHistory } from "react-router-dom";
import * as authRoutes from "../../Routes/AuthRoutes";
import M from "materialize-css";
import * as authApiRoutes from "../../apiConstants/authApiConstant";

import { UserContext } from "../../App";
const Login = () => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { state, dispatch } = useContext(UserContext);
  const PostData = async () => {
    if (!email && !password) {
      M.toast({ html: "Please fill every input", classes: "error_Toast" });
      return;
    }
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      M.toast({ html: "invalid email", classes: "error_Toast" });
      return;
    }

    try {
      const res = await fetch(authApiRoutes.postSignInRoute(), {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await res.json();
      if (data.error) {
        M.toast({ html: data.error, classes: "error_Toast" });
      } else {
        localStorage.setItem("jwt", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        dispatch({
          type: "USER",
          user: data.user,
          jwt: data.token,
        });
        M.toast({ html: data.message, classes: "success_Toast" });
        history.push("/");
      }

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="page">
      <div className="container">
        <div className="card">
          <span className="instaGram">Instagram</span>
          <input
            type="email"
            placeholder="Email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="authButton" onClick={PostData}>
            Log in
          </button>
          <span className="authText">
            Don't have an account ?{" "}
            <Link to={authRoutes.signUpRoute()} className="auth-nav-link">
              Sign up
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};
export default Login;
