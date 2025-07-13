import { SocketProvider } from './context/SocketContext.jsx'
import ChatPage from './pages/ChatPage.jsx'

function App() {
  return (
    <SocketProvider>
      <div className="app">
        <ChatPage />
      </div>
    </SocketProvider>
  )
}

export default App