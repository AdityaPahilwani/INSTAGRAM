// exports.postApi = {
//   postCreatePostRoute: "/createPost",
//   getPostsRoute: "/allPost",
//   getLoggedInUserPostsRoute: "/getLoggedInUserPosts",
// };

exports.postCreatePostRoute = () => "/createPost";

exports.getAllFollowingPostRoute=()=>"/getAllFollowingPost/:pageNo";

exports.getPostsRoute = () => "/allPost/:pageNo";

exports.getLoggedInUserPostsRoute = () => "/getLoggedInUserPosts";

exports.putLikePostRoute = () => "/likePost";

exports.putUnLikePostRoute = () => "/unLikePost";

exports.putCommentPostRoute = () => "/commentPost";

exports.postDeletePost=(postId)=>`/deletePost/:${postId}`