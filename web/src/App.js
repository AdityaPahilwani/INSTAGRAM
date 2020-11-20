import React, { useEffect, createContext, useReducer, useContext } from "react";
import Navigation from "./Navigation/navigation";
import "./App.css";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/signUp";
import Profile from "./pages/Profile/profile";
import CreatePost from "./pages/CreatePost/CreatePost";
import FollowerRequest from "./pages/FollowerRequest/FollowerRequest";
import ProfileFollowData from "./pages/ProfileFollowData/ProfileFollowData";
import * as authRoutes from "./Routes/AuthRoutes";
import * as DashboardRoutes from "./Routes/DashboardRoutes";

import { userReducer, initialState } from "./Store/reducers/userReducer";

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    // localStorage.clear();
    const user = JSON.parse(localStorage.getItem("user"));
    const jwt = localStorage.getItem("jwt");

    if (user) {
      dispatch({
        type: "USER",
        user: user,
      });
    } else {
      //   if (!history.location.pathname.startsWith("/reset"))
      //     history.push(authRoutes.logInRoute);
    }
  }, []);
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path={authRoutes.logInRoute()} component={Login} />
      <Route path={authRoutes.signUpRoute()} component={SignUp} />
      <Route exact path={DashboardRoutes.profileRoute()} component={Profile} />
      <Route path={DashboardRoutes.createPostRoute()} component={CreatePost} />
      <Route
        path={DashboardRoutes.followersRoute()}
        component={FollowerRequest}
      />
      <Route
        path={DashboardRoutes.profileFollowersDataRoute()}
        component={ProfileFollowData}
      />
      <Route
        path={DashboardRoutes.profileFollowingDataRoute()}
        component={ProfileFollowData}
      />
      {/* <Route path="/profile/:userid">
        <UserProfile />
      </Route>
      <Route path="/myfollowingpost">
        <SubscribedUserPosts />
      </Route>
      <Route exact path="/reset">
        <Reset/>
      </Route>
      <Route path="/reset/:token">
        <NewPassword />
      </Route>
       */}
    </Switch>
  );
};
function App() {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navigation />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
