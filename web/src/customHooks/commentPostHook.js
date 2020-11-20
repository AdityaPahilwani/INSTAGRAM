import {  useState, useContext } from "react";
import * as postApiConstant from "../apiConstants/postApiConstant";
import { UserContext } from "../App";
import { AuthConfigForWeb } from "../apiConstants/jwtConstant";

const CommentPostHook = (comments) => {
  const [allComments, setAllComments] = useState(comments);
  const { state, dispatch } = useContext(UserContext);

  const createComment = async (comment, postId) => {
    try {
      const _id = state.user._id;
      const name = state.user.name;
      const profile_image = state.user.profile_image;
      const postedBy = { name: name, profile_image: profile_image };

      setAllComments((prevData) => [...prevData, { _id, postedBy, comment }]);
      let res = await fetch(postApiConstant.putCommentPostRoute(), {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthConfigForWeb(),
        },
        body: JSON.stringify({ comment, postId }),
      });
      res = await res.json();
    } catch (err) {}
  };

  return { allComments, createComment };
};

export default CommentPostHook;
