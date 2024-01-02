import React, { useEffect, useState } from "react";
import avatarImage from "../../../assets/banner/avatar_image.webp";
import moment from "moment";

const ChatSidebar = ({ allConversations, selectedConversation, setSelectedConversation }) => {
    const [filteredConversation, setFilteredConversations] = useState([]);

    const searchConversation = (event) => {
        let search = String(event.target.value).toLowerCase();
        let tempConversations = JSON.parse(JSON.stringify(allConversations));
        if (search != '') {
            tempConversations = tempConversations.filter((conversation) => {
                if (String(conversation.user.first_name).toLowerCase().includes(search) || String(conversation.user.last_name).toLowerCase().includes(search)) {
                    return conversation
                }
            })
        }
        setFilteredConversations(tempConversations);
    }

    const handleConversation = (conversation) => {
        setSelectedConversation(conversation);
    }

    useEffect(() => {
        setFilteredConversations(allConversations);
    }, [allConversations])


    return (
        <div className="at-chat_sidebar">
            <div className="at-sidbarwrapper at-userlist_tab at-contacts_list">
                <div className="at-userchat_tab">
                    <a href="javascript:void(0);" className="at-tabactive">
                        <i className="guppy-user"></i><span> Contacts </span>
                    </a>
                </div>
                <div className="at-userlist_tab active">
                    <div className="at-sidebarhead_search at-sidebarhead_searchv2">
                        <div className="at-form-group">
                            <i className="guppy-search"></i>
                            <input type="search" name="search" placeholder="Search here" className="form-control" onChange={(e) => {
                                searchConversation(e)
                            }} />
                        </div>
                    </div>

                    {filteredConversation?.length > 0 ?
                        <ul className="conversation-list">
                            {filteredConversation.map((conversation, key) => {
                                return (
                                    <li className={conversation?.id == selectedConversation?.id ? ' at-userbar active' : 'at-userbar'} key={key} onClick={() => handleConversation(conversation)}>
                                        <figure className="at-userbar_profile">
                                            {/* <span className="at-userstatus offline"></span> */}
                                            <img src={conversation?.user?.image ?? avatarImage} alt={conversation?.user?.first_name} />
                                        </figure>
                                        <div className="at-userbar_title">
                                            <h3>{conversation?.user?.first_name}</h3>
                                            {conversation?.lastMessage && <span>{conversation?.lastMessage?.message}</span>}
                                        </div>
                                        {conversation?.lastMessage &&
                                            <div className="at-userbar_right">
                                                <span>
                                                    {moment(conversation?.lastMessage?.created_at).format(
                                                        "ddd"
                                                    )}
                                                </span>
                                                {conversation?.unreadCount > 0 && (
                                                    <span className="unread-conversation">
                                                        {conversation?.unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                        }
                                    </li>
                                )
                            })}

                        </ul>
                        :
                        <div className="at-empty-conversation">
                            <i className="guppy-users"></i>
                            <span>No results to show</span>
                        </div>
                    }
                </div>
            </div >
        </div >
    )
};

export default ChatSidebar;