import { createContext, useContext } from "react";

export const MessagesContext = createContext(null);

export const useMessagesContext = () => useContext(MessagesContext);