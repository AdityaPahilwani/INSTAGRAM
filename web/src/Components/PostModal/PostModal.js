import React, { useRef } from "react";
import Comment from "../Comment/Comment";

import PostLikeAndComment from "../PostLikeAndComment/PostLikeAndComment";
import "./PostModal.css";
const PostModal = (props) => {
  const {
    close,
    name,
    caption,
    media,
    profile_image,
    postId,
    likes,
    doesLike,
    hookLike,
    hookTotalLikes,
    error,
    toggleLike,
    open,
    allComments,
    createComment,
    userId,
   
  } = props;
console.log(profile_image)
  const myRef = useRef(null);
  return (
    <div className="Modal">
      <div className="Modal_div">
        <div className="Modal_img_container">
          <img
            src={media}
            className="Modal_img"
          />
        </div>
        <div className="Modal_comment_wrapper">
          <div className="Modal_comment_container" ref={myRef}>
            <Comment
              name={name}
              comment={caption}
              profile_image={profile_image}
              userId={userId}
            />
            {allComments.map((comment, index) => {
              if (comment) {
                return (
                  <Comment
                    key={comment._id}
                    name={comment.postedBy.name}
                    profile_image={comment.postedBy.profile_image}
                    comment={comment.comment}
                    userId={comment.postedBy._id}
                  />
                );
              }
            })}
          </div>
          <PostLikeAndComment
            name={name}
            caption={caption}
            postId={postId}
            likes={likes}
            doesLike={doesLike}
            wantName={false}
            hookLike={hookLike}
            hookTotalLikes={hookTotalLikes}
            error={error}
            toggleLike={toggleLike}
            open={open}
            createComment={createComment}
            allComments={allComments}
          />
        </div>
      </div>
    </div>
  );
};

export default PostModal;
