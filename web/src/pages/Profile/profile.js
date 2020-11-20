import React, { useEffect, useState,useContext } from "react";
import "./profile.css";
import { useParams, useHistory } from "react-router-dom";
import useModal from "react-hooks-use-modal";
import profileFunctions from "../../utils/profile";
import AdminPostCard from "../../Components/AdminPostCard/AdminPostCard";
import { UserContext } from "../../App";
import M from "materialize-css";
import * as DashboardRoutes from "../../Routes/DashboardRoutes";
const Profile = () => {
  const { state, dispatch } = useContext(UserContext);
  const [data, setData] = useState([]);
  const [loading, setIsLoading] = useState(true);
  const [follow, setFollow] = useState(false);
  const [user, setUser] = useState(false);
  const [isAdmin, setIsAdmin] = useState();
  const [userWantToFollow, setUserWantsToFollow] = useState(false);
  const [adminRequestedUser, setAdminRequestedUser] = useState(false);
  const [actionType, setActionType] = useState(false);
  const [requestOn, setRequestOn] = useState(false);
  const [totalPost, setTotalPost] = useState(0);
  const [totalFollowers, setTotalFollowers] = useState(0);
  const [totalFollowing, setTotalFollowing] = useState(0);
  const history = useHistory();

  const { userId } = useParams();
  // var profileFunctions = new profileFunctions();
  const [Modal, open, close, isOpen] = useModal("root", {
    preventScroll: true,
  });

  useEffect(async () => {
    setIsLoading(true);
    let res = await profileFunctions.fetchProfile(userId);

    if (res.error) {
      M.toast({ html: res.error, classes: "error_Toast" });
      return;
    }
    console.log(res);
    setUser(res.user);
    setData([...res.userPosts]);
    setFollow(res.doesAdminFollow);
    setIsAdmin(res.isAdmin);
    setIsLoading(false);
    setUserWantsToFollow(res.userRequestedAdmin);
    setAdminRequestedUser(res.adminRequestedUser);
    setTotalPost(res.totalPost);
    setTotalFollowers(res.totalFollowers);
    setTotalFollowing(res.totalFollowing);
    setActionType(setButtonText(res.adminRequestedUser, res.doesAdminFollow));
  }, [userId]);

  const DELETE_REQUEST_TYPE_CONSTANT = "Delete request";
  const UNFOLLOW_TYPE_CONSTANT = "unfollow";
  const FOLLOW_TYPE_CONSTANT = "follow";
  const ACCEPT_FOLLOW_TYPE_CONSTANT = "acceptRequest";
  const setButtonText = (adminRequestedUser, follow) => {
    if (adminRequestedUser) {
      return DELETE_REQUEST_TYPE_CONSTANT;
    }

    if (follow) {
      return UNFOLLOW_TYPE_CONSTANT;
    } else {
      return FOLLOW_TYPE_CONSTANT;
    }
  };

  const actionHandler = async (type) => {
    if (!requestOn && !loading) {
      try {
        let res,
          tempAdminRequest = adminRequestedUser,
          tempFollow = follow;
        setRequestOn(true);
        if (type === FOLLOW_TYPE_CONSTANT) {
          setAdminRequestedUser(true);
          tempAdminRequest = true;
          res = await profileFunctions.followRequestUser(userId);
        }
        if (type === UNFOLLOW_TYPE_CONSTANT) {
          setAdminRequestedUser(false);
          setFollow(false);
          setData([]);
          setTotalFollowers((prev) => prev - 1);
          tempFollow = false;
          tempAdminRequest = false;
          res = await profileFunctions.unFollowUser(userId);
        }
        if (type === DELETE_REQUEST_TYPE_CONSTANT) {
          setAdminRequestedUser(false);
          setUserWantsToFollow(false);
          tempFollow = false;
          tempAdminRequest = false;
          res = await profileFunctions.deleteRequestUser(userId);
          dispatch({ type: "UPDATE_REQUESTEDBY", userId: userId });
        }

        if (type === ACCEPT_FOLLOW_TYPE_CONSTANT) {
          setAdminRequestedUser(false);
          setUserWantsToFollow(false);
          setTotalFollowing((prev) => prev + 1);
          res = await profileFunctions.acceptFollowRequestUser(userId);
          dispatch({ type: "UPDATE_REQUESTEDBY", userId: userId });
        }

        setActionType(setButtonText(tempAdminRequest, tempFollow));
        setRequestOn(false);
        if (res.error) {
          M.toast({ html: res.error, classes: "error_Toast" });
        } else {
          M.toast({ html: res.message, classes: "success_Toast" });
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  const navigateToFollowing = () => {
    if (follow || isAdmin) {
      history.push(DashboardRoutes.createProfileFollowingDataRoute(userId), {
        data: user ? user.following : [],
      });
    }
  };
  const navigateToFollowers = () => {
    if (follow || isAdmin) {
      history.push(DashboardRoutes.createProfileFollowersDataRoute(userId), {
        data: user ? user.followers : [],
      });
    }
  };
  return (
    <div className="Profile_Page_Container">
      {!loading && userWantToFollow ? (
        <div className="Profile_Request_Container">
          <span className="Profile_Info_Text">
            {user.name} wants to follow you
          </span>
          <div className="Profile_Button_Request_Container">
            <button
              className="follow_button"
              onClick={actionHandler.bind(this, ACCEPT_FOLLOW_TYPE_CONSTANT)}
            >
              Accept
            </button>
            <button
              className="unFollow_button"
              onClick={actionHandler.bind(this, DELETE_REQUEST_TYPE_CONSTANT)}
            >
              Delete
            </button>
          </div>
        </div>
      ) : null}
      <div className="Profile__Container">
        <div className="Profile_Img_Container">
          {!loading ? (
            <img className="Profile_Img" src={user.profile_image} />
          ) : (
            "loading"
          )}
        </div>
        <div className="Profile_Info_Container">
          <div className="Profile_status_container">
            <h1 className="title_text">{!loading ? user.name : "loading"}</h1>
            {!isAdmin && (
              <button
                className="follow_button"
                onClick={actionHandler.bind(this, actionType)}
              >
                {actionType}
              </button>
            )}
          </div>
          <div className="Profile_Info">
            <span className="Profile_Info_Text">
              {!loading ? totalPost : "loading"} posts
            </span>
            {/* {isAdmin ? "admin" : "not admin"} */}
            <span className="Profile_Info_Text" onClick={navigateToFollowers}>
              {!loading ? totalFollowers : "loading"} followers
            </span>
            <span className="Profile_Info_Text" onClick={navigateToFollowing}>
              {!loading ? totalFollowing : "loading"} following
            </span>
          </div>
        </div>
      </div>
      <div className="gallery">
        {follow || isAdmin ? (
          data.map((post, index) => {
            return (
              <AdminPostCard
                key={post._id}
                media={post.media}
                name={post.postedBy.name}
                caption={post.caption}
                profile_image={post.postedBy.profile_image}
                postId={post._id}
                likes={post.likes}
                doesLike={post.liked}
                comments={post.comments}
                userId={post.postedBy._id}
              />
            );
          })
        ) : (
          <div className="notFollowContainer">
            <p className="Profile_Info_Text">This Account is Private</p>
            <p className="Profile_Info_Text">Follow to see their photos</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
