import { create } from 'zustand'
import axios from '../lib/axios'
import { toast } from "react-hot-toast"
import { useAuthStore } from './useAuthStore'

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,
    isImageLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true })
        try {
            const res = await axios.get('/messages/users')
            set({ users: res.data.data })
        } catch (error) {
            console.log("Error getting users", error);
            toast.error(error.response.data.message)
        } finally {
            set({ isUsersLoading: false })
        }
    },
    getMessages: async (userId) => {
        set({ isMessagesLoading: true })
        try {
            const res = await axios.get(`/messages/${userId}`)
            set({ messages: res.data.data })
        } catch (error) {
            console.log("Error getting messages", error);
            toast.error(error.response.data.message)
        } finally {
            set({ isMessagesLoading: false })
        }
    },

    sendMessage: async ({ text, imageFile }) => {
        const { selectedUser } = get();
        if (!selectedUser) {
            toast.error("No user selected");
            return;
        }

        const formData = new FormData();
        if (text) formData.append('text', text);
        if (imageFile) formData.append('image', imageFile);
        if (imageFile) set({ isImageLoading: true });

        try {
            const res = await axios.post(
                `/messages/send/${selectedUser?._id}`,
                formData
            );

            // Optimistic UI update
            set(state => ({
                messages: [...state.messages, res.data.data]
            }));
        } catch (error) {
            console.error("Message send error:", error);
            toast.error(error.response?.data?.message || "Message send failed");
        }
        finally {
            if (imageFile) set({ isImageLoading: false });
        }
    },

    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        // Always clear old listener before adding new one
        socket.off("newMessage");

        socket.on("newMessage", (message) => {
            const { selectedUser: currentUser, messages } = get();
            if (message.senderId !== selectedUser._id) return

            if (
                message.senderId === currentUser?._id ||
                message.receiverId === currentUser?._id
            ) {
                set({ messages: [...messages, message] });
            }
        });
    },
    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        if (socket) {
            socket.off("newMessage");
        }
    },
    setSelectedUser: (user) => set({ selectedUser: user }),
})) 