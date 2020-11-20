import React from "react";
import "./Comment.css";
import * as DashboardRoutes from "../../Routes/DashboardRoutes";
import { Link } from "react-router-dom";
const Comment = (props) => {
  const { name, comment, profile_image, userId } = props;

  return (
    <div className="commentContainer">
      {profile_image && (
        <div className="commentImgContainer">
          <img src={profile_image} className="commentImg" />
        </div>
      )}
      <div className="comment_Container">
        <Link
          to={DashboardRoutes.createProfileRoute(userId)}
          style={{ textDecoration: "none" }}
        >
          <span className="Modal_postedBy_Text">{name} </span>
        </Link>
        <span className="Modal_Comment_Text">{comment}</span>
      </div>
    </div>
  );
};

export default Comment;
