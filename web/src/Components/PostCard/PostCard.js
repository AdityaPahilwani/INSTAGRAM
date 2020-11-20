import React from "react";
import ToggleFeedPostHook from "../../customHooks/toggleFeedPostHook";
import CommentPostHook from "../../customHooks/commentPostHook";
import * as DashboardRoutes from "../../Routes/DashboardRoutes";
import { Link } from "react-router-dom";
import PostLikeAndComment from "../PostLikeAndComment/PostLikeAndComment";

import PostModal from "../PostModal/PostModal";
import useModal from "react-hooks-use-modal";
import "./PostCard.css";

const PostCard = (props) => {
  const {
    name,
    caption,
    media,
    profile_image,
    postId,
    likes,
    doesLike,
    comments,
    userId
  } = props;
  const [Modal, open, close, isOpen] = useModal("root", {
    preventScroll: true,
  });
  const { hookLike, hookTotalLikes, error, toggleLike } = ToggleFeedPostHook(
    postId,
    doesLike,
    likes
  );

  const { allComments, createComment } = CommentPostHook(comments);

  return (
    <>
      <div className="postCard">
        <Link to={DashboardRoutes.createProfileRoute(userId)} style={{textDecoration:'none'}}>
          <div className="Post_Profile_Info_Container">
            <div>
              <img className="Post_Profile_Img" src={profile_image} />
            </div>
            <div>
              <p className="Post_Title_Text">{name}</p>
            </div>
          </div>
        </Link>
        <div>
          <img className="Post_Image" src={media} />
          <PostLikeAndComment
            name={name}
            caption={caption}
            postId={postId}
            likes={likes}
            doesLike={doesLike}
            wantName={true}
            hookLike={hookLike}
            hookTotalLikes={hookTotalLikes}
            error={error}
            toggleLike={toggleLike}
            open={open}
            allComments={allComments}
            createComment={createComment}
            userId={userId}
          />
        </div>
      </div>
      <Modal>
        <PostModal
          name={name}
          caption={caption}
          profile_image={profile_image}
          postId={postId}
          likes={likes}
          doesLike={doesLike}
          hookLike={hookLike}
          hookTotalLikes={hookTotalLikes}
          error={error}
          toggleLike={toggleLike}
          open={open}
          allComments={allComments}
          createComment={createComment}
          userId={userId}
          media={media}
        />
      </Modal>
    </>
  );
};

export default PostCard;
