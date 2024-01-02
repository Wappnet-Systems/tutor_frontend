import React, { useEffect, useRef } from "react";
import avatarImage from "../../../assets/banner/avatar_image.webp";

const ChatHeader = ({ selectedConversation, selectedConversationMessages }) => {
  const scrollRef = useRef();

  useEffect(() => {
    console.log(selectedConversation);
  }, [selectedConversation]);

  return (
    <div className="at-userinfo" ref={scrollRef}>
      <div className="at-userinfo_title">
        <a href="javascript:void(0);" className="at-backtolist">
          <i className="guppy-chevron-left"></i>
        </a>
        <figure className="at-userinfo_title_img">
          <img
            src={selectedConversation?.user?.image ?? avatarImage}
            alt={selectedConversation?.user?.first_name}
          />
        </figure>
        <div className="at-userinfo_title_name">
          <h3>{selectedConversation?.user?.first_name}</h3>
          {/* <span className="at-userstatus offline"> Offline </span> */}
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
