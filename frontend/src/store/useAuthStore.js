import { create } from 'zustand'
import axios from '../lib/axios'
import { toast } from "react-hot-toast"
import { io } from 'socket.io-client'

const BASE_URL = import.meta.env.MODE === 'development'
    ? 'http://localhost:5000'
    : '/';

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,

    checkAuth: async () => {
        try {
            const res = await axios.get('/auth/check')
            set({ authUser: res.data.data })
            get().connectSocket();
        } catch (error) {
            console.log("Error checking auth", error);
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    },
    signup: async (data) => {
        set({ isSigningUp: true })
        try {
            const res = await axios.post('/auth/signup', data)
            set({ authUser: res.data.data })
            toast.success(res.data.message)
            get().connectSocket();
        } catch (error) {
            console.log("Error signing up", error);
            toast.error(error.response.data.message)
        } finally {
            set({ isSigningUp: false })
        }
    },
    login: async (data) => {
        set({ isLoggingIn: true })
        try {
            const res = await axios.post('/auth/login', data)
            set({ authUser: res.data.data })
            toast.success(res.data.message)

            get().connectSocket();
        } catch (error) {
            console.log("Error logging in", error);
            toast.error(error.response.data.message)
        } finally {
            set({ isLoggingIn: false })
        }
    },
    logout: async () => {
        try {
            await axios.post('/auth/logout')
            set({ authUser: null })
            toast.success("Logged out successfully")
            get().disconnectSocket();
        } catch (error) {
            console.log("Error logging out", error);
            toast.error(error.response.data.message)
        }
    },
    updateProfile: async (formData) => {
        set({ isUpdatingProfile: true });
        try {
            const res = await axios.patch('/auth/avatar', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            set({ authUser: res.data.data });
            toast.success(res.data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || "Update failed");
        } finally {
            set({ isUpdatingProfile: false });
        }
    },
    connectSocket: () => {
        const { authUser } = get();
        if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id
            }
        });
        socket.connect();

        set({ socket: socket });

        socket.on('getOnlineUsers', (userIds) => {
            set({ onlineUsers: userIds });
        });
    },
    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    }
}))