import React, { useState, useRef } from "react";
import * as postApiConstant from "../../apiConstants/postApiConstant";
import M from "materialize-css";
import "./CreatePost.css";
import { AuthConfigForWeb } from "../../apiConstants/jwtConstant";

const CreatePost = () => {
  const [imagePreview, setImagePreview] = useState("");
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const fileRef = useRef(null);
  const [loading, setLoading] = useState(false);

  const PostData = async () => {
    if (!image && !imagePreview) {
      M.toast({ html: "Please fill every input", classes: "error_Toast" });
      return;
    }
    console.log(postApiConstant.postCreatePostRoute());
    try {
      setLoading(true);
      const res = await fetch(postApiConstant.postCreatePostRoute(), {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthConfigForWeb(),
        },
        body: JSON.stringify({
          caption,
          media: imagePreview,
        }),
      });
      const data = await res.json();
      if (data.error) {
        M.toast({ html: data.error, classes: "error_Toast" });
      } else {
        M.toast({ html: data.message, classes: "success_Toast" });
        // history.push("/");
      }
      setLoading(false);
      console.log(data);
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
    <div className="Create_Post_Page_Container">
      <div className="Create_Post_Card">
        <span className="instaGram">Create post</span>
        <div
          className="Upload_Image_Container"
          onClick={() => {
            fileRef.current.click();
          }}
        >
          {!imagePreview ? (
            <span className="Post_Title_Comment_Text">Upload Image</span>
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
          type="text"
          placeholder="enter a caption"
          className="input"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        {!loading ? (
          <button className="authButton" onClick={PostData}>
            Create
          </button>
        ) : (
          <div className="Post_Title_Comment_Text">Uploading</div>
        )}
      </div>
    </div>
  );
};

export default CreatePost;
