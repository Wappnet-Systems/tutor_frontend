import React, { useEffect, useState } from "react";
import ChatContainer from "./components/ChatContainer";
import ChatSidebar from "./components/ChatSidebar";
import Layout from "../../components/Layout";
import { chatService } from "./service/chat.service";
import { useSelector } from "react-redux";
import moment from "moment";
import { useNavigate, useParams } from "react-router-dom";
import { useWebSocket } from '../../webSocketContext'

const Chat = () => {
  const socket = useWebSocket();
  const navigate = useNavigate();
  const { id } = useParams();
  const userData = useSelector((state) => state.userData?.userData);
  const [allConversations, setAllConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState({});
  const [selectedConversationMessages, setSelectedConversationMessages] =
    useState([]);
  const getAllConversations = (withoutId = false) => {
    chatService.getAllConversations().then((res) => {
      setAllConversations(res?.data?.data);
      if (!withoutId) {
        if (id && res?.data?.data.length > 0) {
          let tempSelectedConversation = res?.data?.data.filter((conv) => {
            if (conv.user.id == id) {
              return conv;
            }
          });
          if (tempSelectedConversation.length > 0) {
            setSelectedConversation(tempSelectedConversation[0]);
          }
        }
      }
    });
  };

  const getConversationMessages = () => {
    chatService.markConversationAsRead(selectedConversation.id).then((r) => {
      getAllConversations(true);
      chatService
        .getConversationMessages(selectedConversation.id)
        .then((res) => {
          const groupedMessages = res?.data?.data?.reduce((groups, message) => {
            const date = moment(message.created_at).format("MMM DD YYYY");
            if (!groups[date]) {
              groups[date] = {
                date: date,
                messages: []
              };
            }
            groups[date].messages.push({ ...message });
            return groups;
          }, {});

          const result = Object.values(groupedMessages);
          setSelectedConversationMessages(result);
        });
    });
  };

  const handleAddMessage = (msg) => {
    socket.emit("send-msg", {
      from: userData.id,
      to: selectedConversation.user.id,
      conversation_id: selectedConversation.id,
      message: msg
    });

    let messageObj = {
      conversation_id: selectedConversation.id,
      created_at: new Date(),
      document: null,
      document_type: null,
      id: null,
      is_read: 0,
      message: msg,
      sender: userData.id
    };

    addMessageToConversation(messageObj);
  };

  useEffect(() => {
    socket.emit("add-conv", {
      conversation_id: selectedConversation.id,
      user_id: userData.id
    });
    socket.on("check-conversations", (msg) => {
      getAllConversations(true);
    });
    getAllConversations();
    return () => {
      exitPage();
    }
  }, []);

  const addMessageToConversation = (message) => {
    let tempAllConversationMessages = JSON.parse(
      JSON.stringify(selectedConversationMessages)
    );
    if (tempAllConversationMessages.length == 0) {
      chatService.getAllConversations(selectedConversation.id).then((res) => {
        tempAllConversationMessages = res.data.data;
        let isPushed = false;
        for (
          let index = 0;
          index < tempAllConversationMessages.length;
          index++
        ) {
          const groupedMessages = tempAllConversationMessages[index];
          if (groupedMessages.date == moment().format("YYYY-MM-DD")) {
            isPushed = true;
            groupedMessages.messages.push(message);
          }
        }

        if (!isPushed) {
          tempAllConversationMessages.push({
            date: moment().format("YYYY-MM-DD"),
            messages: [message]
          });
        }
        setSelectedConversationMessages(tempAllConversationMessages);
      });
    } else {
      let isPushed = false;
      for (let index = 0; index < tempAllConversationMessages.length; index++) {
        const groupedMessages = tempAllConversationMessages[index];
        if (groupedMessages.date == moment().format("YYYY-MM-DD")) {
          isPushed = true;
          groupedMessages.messages.push(message);
        }
      }

      if (!isPushed) {
        tempAllConversationMessages.push({
          date: moment().format("YYYY-MM-DD"),
          messages: [message]
        });
      }
      setSelectedConversationMessages(tempAllConversationMessages);
    }
  };

  useEffect(() => {
    if (selectedConversation?.id) {
      getConversationMessages();
      socket.emit("add-user", {
        conversation_id: selectedConversation.id,
        user_id: userData.id
      });
      socket.on("receive", (msg) => {
        getConversationMessages();
      });
    }
  }, [selectedConversation]);

  const exitPage = () => {
    socket.emit('remove-user', {user_id: userData.id});
  };

  return (
    <>
      <Layout>
        <div className="tu-main tu-bgmain user_profile_layout">
          <div className="tu-main-section">
            <div className="container">
              <div className="row gy-4">
                <div className="col-12">
                  <div className="tu-inbox-wrapper">
                    <div
                      className="tu-boxsmtitle"
                      style={{ margin: "0 0 20px" }}
                    >
                      <h4>Start Conversation</h4>
                      <button
                        className="btn"
                        style={{ background: "#6A307D", color: "white" }}
                        onClick={() => navigate(-1)}
                      >
                        Back
                      </button>
                    </div>
                    <div className="at-user-chat at-chat at-chat1700 at-messanger-chat at-opnchatbox">
                      <ChatSidebar
                        allConversations={allConversations}
                        setSelectedConversation={setSelectedConversation}
                        selectedConversation={selectedConversation}
                      />
                      {selectedConversation.user?.first_name ? (
                        <ChatContainer
                          selectedConversation={selectedConversation}
                          selectedConversationMessages={
                            selectedConversationMessages
                          }
                          handleAddMessage={handleAddMessage}
                          userId={userData.id}
                        />
                      ) : (
                        <div className="at-chat_messages">
                          <div className="at-empty-conversation">
                            <i className="guppy-message-circle"></i>
                            <span>
                              Select the user to start your conversation
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Chat;
