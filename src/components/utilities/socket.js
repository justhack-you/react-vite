import io from "socket.io-client";

export const createSocketConnection = () => {
    const socket = io("http://localhost:5000");
    return socket;
};