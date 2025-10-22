import io from "socket.io-client";

export const createSocketConnection = () => {
    const socket = io("/", {
        path: "/api/socket.io",
        transports: ["websocket"],
        withCredentials: true,
    });
    return socket;
};