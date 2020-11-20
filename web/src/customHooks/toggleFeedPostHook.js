import { useState } from "react";
import * as postApiConstant from "../apiConstants/postApiConstant";
import { AuthConfigForWeb } from "../apiConstants/jwtConstant";

const ToggleFeedPostHook = (id, doesLike, likes) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [postId, setPostId] = useState(id);
  const [hookLike, setHookLike] = useState(doesLike);
  const [hookTotalLikes, setHookTotalLikes] = useState(likes.length);

  const commonApiToggle = async (route) => {
    try {
      let res = await fetch(route, {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: AuthConfigForWeb(),
        },
        body: JSON.stringify({ postId: postId }),
      });

      res = await res.json();
      if (res.error) {
        setError(res.error);
        return;
      }
    } catch (err) {
      console.log(err);
    }
  };

  const toggleLike = () => {
    if (hookLike) {
      if (hookTotalLikes > 0) {
        setHookTotalLikes((prevData) => prevData - 1);
      }
      setHookLike(false);
      commonApiToggle(postApiConstant.putUnLikePostRoute());
      return;
    } else {
      setHookTotalLikes((prevData) => prevData + 1);
      setHookLike(true);
      commonApiToggle(postApiConstant.putLikePostRoute());
    }
  };
  return { hookLike, hookTotalLikes, error, toggleLike };
};

export default ToggleFeedPostHook;
