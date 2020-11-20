import React from "react";
import "./FollowerRequestComponent.css";
import * as DashboardRoutes from "../../Routes/DashboardRoutes";
import { useHistory } from "react-router-dom";
const FollowerRequestComponent = (props) => {
  const { profile_image, userId, name, callBackSubmit } = props;
  const history = useHistory();
  const actionHandler = (actionType) => {
    callBackSubmit(userId, actionType);
  };
  const submit = (e) => {
    if (e.target == e.currentTarget) {
      history.push(DashboardRoutes.createProfileRoute(userId));
    }
  };
  return (
    <div className="FollowerRequestContainer" onClick={submit}>
      <img src={profile_image} className="FollowerRequestImg" />
      <span className="FollowerRequestName">{name}</span>
      <button
        className="follow_button"
        onClick={actionHandler.bind(this, "accept")}
      >
        Accept
      </button>
      <button
        className="unFollow_button"
        onClick={actionHandler.bind(this, "decline")}
      >
        Delete
      </button>
    </div>
  );
};

export default FollowerRequestComponent;
