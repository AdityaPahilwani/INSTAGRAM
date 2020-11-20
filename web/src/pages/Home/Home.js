import React, {

  useEffect,

  useContext,
} from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import "./Home.css";
import PostCard from "../../Components/PostCard/PostCard";
import M from "materialize-css";
import FetchFeedPost from "../../customHooks/fetchFeedPostHook";
import { UserContext } from "../../App";

const Home = () => {

  const { state, dispatch } = useContext(UserContext);
  const { loading, hasMoreData, data, fetchData, error } = FetchFeedPost();
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    if (error) {
      M.toast({ html: error, classes: "error_Toast" });
    }
  }, [error]);

  // const modalOn = () => {
  //   setOpen(true);
  // };
  // const modalClose = () => {
  //   setOpen(false);
  // };
  return (
    <div className="">
      <InfiniteScroll
        className="pageContainer"
        dataLength={data.length}
        next={fetchData}
        hasMore={hasMoreData}
        loader={
          <div className="Post_Title_Comment_Text">
            {loading && "Loading..."}
          </div>
        }
      >
        {data.length === 0 ? (
          <h1>We got nothing to show,follow someone</h1>
        ) : null}
        {data.map((post, index) => {
          return (
            <PostCard
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
        })}
      </InfiniteScroll>
    </div>
  );
};

export default Home;
