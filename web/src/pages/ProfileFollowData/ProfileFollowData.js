import React from "react";
import SearchUser from "../../Components/SearchUser/SearchUser";
import "./ProfileFollowData.css";
const ProfileFollowData = (props) => {
  console.log(props);
  const { data } = props.location.state;

  return (
    <div className="Follower_Request_container">
      {data.length > 0 ? (
        <div className="Follower_Result_container">
          {data.map((data, index) => {
            return (
              <SearchUser
                profile_image={data.profile_image}
                userId={data._id}
                name={data.name}
                close={() => {}}
              />
            );
          })}
        </div>
      ) : (
        <h1>Nothing to show</h1>
      )}
    </div>
  );
};

export default ProfileFollowData;
