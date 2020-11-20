import React, { useState, useRef } from "react";
import "./authGlobalStyle.css";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";
import * as authRoutes from "../../Routes/AuthRoutes";

import * as authApiRoutes from "../../apiConstants/authApiConstant";

const SignUp = () => {
  const history = useHistory();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [image, setImage] = useState("");
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const PostData = async () => {
    if (!name && !email && !password) {
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
      setLoading(true)
      const res = await fetch(authApiRoutes.postSignUpRoute(), {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          media: imagePreview,
        }),
      });
      const data = await res.json();
      if (data.error) {
        M.toast({ html: data.error, classes: "error_Toast" });
      } else {
        M.toast({ html: data.message, classes: "success_Toast" });
        history.push(authRoutes.logInRoute);
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const setImgFunc = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
    }
  };
  return (
    <div className="page">
      <div className="container">
        <div className="card">
          <span className="instaGram">Instagram</span>
          <span className="descriptionText">
            Sign up to see photos and videos from your friends.
          </span>
          <div
            className="Sign_up_avatar"
            onClick={() => {
              fileRef.current.click();
            }}
          >
            {!imagePreview ? (
              <img
                src="https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_960_720.png"
                className="Upload_Image"
              />
            ) : (
              <img src={imagePreview} className="Upload_Image" />
            )}
            <input
              type="file"
              ref={fileRef}
              onChange={setImgFunc}
              hidden
              accept="imagePreview/*"
            />
          </div>

          <input
            type="email"
            placeholder="Email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="text"
            placeholder="Name"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {!loading ? (
            <button className="authButton" onClick={PostData}>
              Sign up
            </button>
          ) : (
            <div className="Post_Title_Comment_Text">Signing up...</div>
          )}
          <span className="authText">
            Have an account ?{" "}
            <Link to={authRoutes.logInRoute()} className="auth-nav-link">
              Login
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
