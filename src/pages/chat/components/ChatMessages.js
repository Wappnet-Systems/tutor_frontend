import moment from "moment";
import React, { useState, useRef, useEffect } from "react";

const ChatMessages = ({
  selectedConversation,
  selectedConversationMessages,
  handleAddMessage,
  userId
}) => {
  const [message, setMessage] = useState("");
  const messageContainerRef = useRef();
  const [isSendButtonDisabled, setIsSendButtonDisabled] = useState(true);

  const sendMessage = () => {
    if (message !== "") {
      handleAddMessage(message);
      setMessage("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    } else if (event.key === "Enter" && event.shiftKey) {
      setMessage((prevMessage) => "\n" + prevMessage);
    }
  };
  const handleChange = (event) => {
    const newMessage = event.target.value;
    setMessage(newMessage);

    // Check if the message contains only whitespace characters
    const isWhitespace = /^\s*$/.test(newMessage);
    setIsSendButtonDisabled(isWhitespace);
  };

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [selectedConversationMessages]);

  return (
    <>
      <div className="at-view-messages">
        <div className="at-messagewrap" ref={messageContainerRef}>
          <div>
            <div className="at-messages at-message_sender">
              <div className="at-chatseparation">
                <span>
                  {moment(selectedConversation?.created_at).format(
                    "ddd, MMM DD, YYYY"
                  )}
                </span>
              </div>
              <div className="at-leftgroupinfo">
                <span>
                  Sharing any type of personal or unnecessary information is not
                  allowed in the chat. This chat is only for general discussion
                </span>
              </div>
              <span className="at-message_time">
                {" "}
                {moment(selectedConversation?.created_at).format(
                  "hh:mm a"
                )}{" "}
              </span>
            </div>

            {selectedConversationMessages?.map((groupedMessages, key) => {
              return (
                <div key={key + "conv"}>
                  <div className="at-chatseparation">
                    <span>
                      {" "}
                      {moment(groupedMessages?.date).format(
                        "ddd, MMM DD, YYYY"
                      )}{" "}
                    </span>
                  </div>
                  {groupedMessages?.messages?.map((message, key) => {
                    return (
                      <div
                        key={key + "msg"}
                        className={
                          message.sender == userId
                            ? "at-messages at-message_sender"
                            : "at-messages"
                        }
                      >
                        <div
                          id="message_502"
                          className="at-message at-messagetext"
                        >
                          <span>{message.message}</span>
                        </div>
                        <span>
                          {" "}
                          {moment(message?.created_at).format("hh:mm a")}{" "}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="at-replay">
        <div className="at-replay_content">
          {/* <div className="at-replay_upload">
                        <a href="javascript:void(0)">
                            <i className="guppy-share"></i>
                        </a>
                    </div> */}
          <div className="at-replay_msg gp-replay_msg">
            <textarea
              id="input-text-message-43_1"
              type="text"
              name="replay"
              placeholder="Type your message here"
              autoComplete="off"
              className="at-share-emoji at-form-control at-form-replay"
              style={{ height: "60px", overflow: "hidden" }}
              value={message}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
            ></textarea>
            <button
              className="at-sendmsg"
              onClick={sendMessage}
              disabled={isSendButtonDisabled}
            >
              <i className="guppy-send"></i>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatMessages;
