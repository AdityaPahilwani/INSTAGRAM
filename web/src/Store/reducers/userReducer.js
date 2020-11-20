export const initialState = {
  user: false,
};
export const userReducer = (state = initialState, action) => {
  if (action.type == "USER") {
    console.log("called reducer" + action.user);
    return {
      user: action.user,
    };
  }
  if (action.type == "CLEAR") {
    return initialState;
  }
  if (action.type == "UPDATE_REQUESTEDBY") {
    let userId = action.userId;
    let newRequestedBy = state.user.requestedBy;
    newRequestedBy = newRequestedBy.filter((data) => {
      return data._id !== userId;
    });
    let newUser = { ...state.user, requestedBy: newRequestedBy };

    localStorage.setItem("user", JSON.stringify(newUser));

    return {
      ...state,
      user: newUser,
    };
  }
  return state;
};
