import React from "react";
import ToggleFeedPostHook from "../../customHooks/toggleFeedPostHook";
import CommentPostHook from "../../customHooks/commentPostHook";
import PostModal from "../PostModal/PostModal";
import useModal from "react-hooks-use-modal";
import "./AdminPostCard.css";

const AdminPostCard = (props) => {
  const {
    name,
    caption,
    media,
    profile_image,
    postId,
    likes,
    doesLike,
    comments,
    userId,
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
      <img key={userId} className="item" src={media} onClick={open}/>;
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

export default AdminPostCard;
