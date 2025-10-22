import io from "socket.io-client";
import { API_BASE_URL } from "./url";

export const createSocketConnection = () => {
    const socket = io(API_BASE_URL);
    return socket;
};