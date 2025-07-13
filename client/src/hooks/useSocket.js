import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

export const useSocket = () => {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [username, setUsername] = useState('')
  const [users, setUsers] = useState([])
  const [messages, setMessages] = useState([])
  const [typingUsers, setTypingUsers] = useState([])
  const [error, setError] = useState(null)
  const [activePrivateChat, setActivePrivateChat] = useState(null)

  useEffect(() => {
    const socketInstance = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    })

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!socket) return

    const onConnect = () => {
      setIsConnected(true)
      setError(null)
    }

    const onDisconnect = () => {
      setIsConnected(false)
    }

    const onError = (error) => {
      setError(error)
    }

    const onReceiveMessage = (message) => {
      setMessages(prev => [...prev, message])
    }

    const onPrivateMessage = (message) => {
      setMessages(prev => [...prev, message])
    }

    const onUserList = (userList) => {
      setUsers(userList)
    }

    const onUserJoined = (user) => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          system: true,
          message: `${user.username} joined the chat`,
          timestamp: new Date().toISOString(),
        },
      ])
    }

    const onUserLeft = (user) => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          system: true,
          message: `${user.username} left the chat`,
          timestamp: new Date().toISOString(),
        },
      ])
    }

    const onTypingUsers = (users) => {
      setTypingUsers(users)
    }

    const onInitialData = (data) => {
      setMessages(data.messages)
      setUsers(data.users)
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('error', onError)
    socket.on('receive_message', onReceiveMessage)
    socket.on('private_message', onPrivateMessage)
    socket.on('user_list', onUserList)
    socket.on('user_joined', onUserJoined)
    socket.on('user_left', onUserLeft)
    socket.on('typing_users', onTypingUsers)
    socket.on('initial_data', onInitialData)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('error', onError)
      socket.off('receive_message', onReceiveMessage)
      socket.off('private_message', onPrivateMessage)
      socket.off('user_list', onUserList)
      socket.off('user_joined', onUserJoined)
      socket.off('user_left', onUserLeft)
      socket.off('typing_users', onTypingUsers)
      socket.off('initial_data', onInitialData)
    }
  }, [socket])

  const connect = (username) => {
    setUsername(username)
    socket.connect()
    socket.emit('user_join', username)
  }

  const disconnect = () => {
    socket.disconnect()
    setUsername('')
    setUsers([])
    setMessages([])
  }

  const sendMessage = (message) => {
    if (!message.trim()) return
    socket.emit('send_message', { message })
  }

  const sendPrivateMessage = (to, message) => {
    if (!message.trim()) return
    socket.emit('private_message', { to, message }, (response) => {
      if (!response.success) {
        setError(response.error)
      }
    })
  }

  const setTyping = (isTyping) => {
    socket.emit('typing', isTyping)
  }

  const markMessageAsRead = (messageId) => {
    socket.emit('message_read', messageId)
  }

  const startPrivateChat = (userId) => {
    setActivePrivateChat(userId)
  }

  const endPrivateChat = () => {
    setActivePrivateChat(null)
  }

  return {
    socket,
    isConnected,
    username,
    users,
    messages,
    typingUsers,
    error,
    activePrivateChat,
    connect,
    disconnect,
    sendMessage,
    sendPrivateMessage,
    setTyping,
    markMessageAsRead,
    startPrivateChat,
    endPrivateChat,
  }
}