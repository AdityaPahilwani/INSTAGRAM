export const profileRoute = () => "/profile/:userId";
export const createProfileRoute = (userId) => `/profile/${userId}`;

export const profileFollowersDataRoute = () => "/profile/:userId/followers";
export const createProfileFollowersDataRoute = (userId) => `/profile/${userId}/followers`;

export const profileFollowingDataRoute = () => "/profile/:userId/following";
export const createProfileFollowingDataRoute = (userId) => `/profile/${userId}/following`;


export const createPostRoute = () => "/create";
export const myfollowingpostRoute = () => "/myfollowingpost";
export const followersRoute = () => "/followRequest";
