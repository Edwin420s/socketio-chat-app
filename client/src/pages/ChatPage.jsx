import { useSocketContext } from '../context/SocketContext.jsx'
import LoginForm from '../components/LoginForm.jsx'
import UserList from '../components/UserList.jsx'
import Chat from '../components/Chat.jsx'
import './ChatPage.css'

export default function ChatPage() {
  const { isConnected, error } = useSocketContext()

  if (!isConnected) {
    return (
      <div className="chat-page">
        <h1>Socket.io Chat</h1>
        {error && <div className="error">{error}</div>}
        <LoginForm />
      </div>
    )
  }

  return (
    <div className="chat-page">
      <h1>Socket.io Chat</h1>
      {error && <div className="error">{error}</div>}
      <div className="chat-layout">
        <div className="sidebar">
          <UserList />
        </div>
        <div className="main-content">
          <Chat />
        </div>
      </div>
    </div>
  )
}