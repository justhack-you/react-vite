import io from "socket.io-client";

export const createSocketConnection = () => {
    let socket;
    if (location.hostname === "localhost") {
        socket = io("http://localhost:5000"); // dev
    } else {
        socket = io("http://13.51.106.37", { path: "/socket.io" }); // prod
    }
    return socket;
};
