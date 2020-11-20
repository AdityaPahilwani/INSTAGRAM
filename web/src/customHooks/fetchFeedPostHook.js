import {  useState, useContext } from "react";
import * as postApiConstant from "../apiConstants/postApiConstant";
import { UserContext } from "../App";
import { AuthConfigForWeb } from "../apiConstants/jwtConstant";
const FetchFeedPost = () => {
  const [data, setData] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [error, setError] = useState(false);
  const { state, dispatch } = useContext(UserContext);

  const fetchData = async () => {
    try {
      setLoading(true);
      let res = await fetch(postApiConstant.getAllFollowingPostRoute(pageNo), {
        method: "get",
        headers: {
          Authorization: AuthConfigForWeb(),
        },
      });

      res = await res.json();
      console.log(res);
      if (res.error) {
        console.log(res);
        setError(res.error);
        return;
      }
    
      if (!res) {
        setHasMoreData(false);
        return;
      }
      setData((prevData) => [...prevData, ...res.posts]);
      setPageNo((prevPageNumber) => prevPageNumber + 1);
      setHasMoreData(res.hasMoreData);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  return { loading, hasMoreData, data, fetchData, error };
};

export default FetchFeedPost;
