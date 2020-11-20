import React, { useContext, useEffect } from "react";
import "./FollowerRequest.css";
import FollowerRequestComponent from "../../Components/FollowerRequestComponent/FollowerRequestComponent";
import { UserContext } from "../../App";
import profileFunctions from "../../utils/profile";
import M from "materialize-css";

const FollowerRequest = () => {
  const { state, dispatch } = useContext(UserContext);
  const data = state.user ? state.user.requestedBy : [];

  const actionHandler = async (userId, actionType) => {
    let res;
    if (actionType === "accept") {
      res = await profileFunctions.acceptFollowRequestUser(userId);
    }
    if (actionType === "decline") {
      res = await profileFunctions.deleteRequestUser(userId);
    }
    dispatch({ type: "UPDATE_REQUESTEDBY", userId: userId });
    if (res.error) {
      M.toast({ html: res.error, classes: "error_Toast" });
    } else {
      M.toast({ html: res.message, classes: "success_Toast" });
    }
  };
  return (
    <div className="Follower_Request_container">
      {data.length > 0 ? (
        <div className="Follower_Result_container">
          {data.map((data, index) => {
            return (
              <FollowerRequestComponent
                profile_image={data.profile_image}
                userId={data._id}
                name={data.name}
                callBackSubmit={actionHandler}
              />
            );
          })}
        </div>
      ) : (
        <h1>No request</h1>
      )}
    </div>
  );
};

export default FollowerRequest;
