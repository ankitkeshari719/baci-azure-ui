import { useEffect,useState,createContext,ReactChild } from "react";
import socketIOClient from "socket.io-client";


const ws =  socketIOClient("http://localhost:5010");
//const ws = socketIOClient("https://baciapi.azurewebsites.net");


export const SocketContext = createContext(ws)

interface ISocketProvider {
    children: ReactChild;
}

export const SocketProvider = (props:ISocketProvider) => (
    <SocketContext.Provider value={ws}>{props.children}</SocketContext.Provider>
);