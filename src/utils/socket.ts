import { io } from "socket.io-client"

const SOCKET_URL = import.meta.env.VITE_PUBLIC_API_URL

const socket = io(SOCKET_URL, {
    transports: ["websocket"],
    autoConnect: false
})

export const socketConnect = () => {
    socket.connect();
}

export const socketDisconnect = () => {
    socket.disconnect()
}

export default socket;