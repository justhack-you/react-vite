import io from "socket.io-client";
import { API_BASE_URL } from "./url";

export const createSocketConnection = () => {
    let socket;
    if (window.location.href.includes("localhost")) {
        socket = io(API_BASE_URL);;
    } else {
        socket = io('/', { path: "/api/socket.io" });
    }
    return socket;
};