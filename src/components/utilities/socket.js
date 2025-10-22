import io from "socket.io-client";

export const createSocketConnection = () => {
    let socket;
    if (location.hostname === "localhost") {
        socket = io("http://localhost:5000");
    } else {
        socket = io('/', { path: "/api/socket.io" });
    }
    return socket;
};