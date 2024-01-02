import axiosInstance from "../../../AxiosInterceptor";

const UNREAD_CONVERSATIONS_URL = "/chat/unread";
const ALL_CONVERSATIONS_URL = "/chat/conversations";
const CONVERSATION_MESSAGES_URL = "/chat/conversation/"
const CONVERSATION_MESSAGES_READ_URL = "/chat/conversation/read/"

const getAllConversations = () => {
    return axiosInstance.get(`${ALL_CONVERSATIONS_URL}`);
};

const getUnreadMessages = () => {
    return axiosInstance.get(`${UNREAD_CONVERSATIONS_URL}`);
};

const getConversationMessages = (id) => {
    const url = `${CONVERSATION_MESSAGES_URL}${id}`;
    return axiosInstance.get(url);
};

const markConversationAsRead = (id) => {
    const url = `${CONVERSATION_MESSAGES_READ_URL}${id}`;
    return axiosInstance.put(url);
};

export const chatService = {
    getAllConversations,
    getConversationMessages,
    markConversationAsRead,
    getUnreadMessages,
}