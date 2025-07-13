import { createContext, useContext } from 'react'
import { useSocket } from '../hooks/useSocket.js'

const SocketContext = createContext()

export const SocketProvider = ({ children }) => {
  const socket = useSocket()
  
  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}

export const useSocketContext = () => {
  return useContext(SocketContext)
}