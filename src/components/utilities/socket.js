import io from "socket.io-client";
import { API_BASE_URL } from "./url";

export const createSocketConnection = () => {
    let socket;
    if (location.includes("localhost")) {
        socket = io('/api');
    } else {
        socket = io('/', { path: "/api/socket.io" });
    }
    return socket;
};