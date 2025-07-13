import { useState } from 'react'
import { useSocketContext } from '../context/SocketContext.jsx'

export default function LoginForm() {
  const { connect, isConnected } = useSocketContext()
  const [username, setUsername] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (username.trim()) {
      connect(username)
    }
  }

  if (isConnected) return null

  return (
    <div className="login-form">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          required
        />
        <button type="submit">Join Chat</button>
      </form>
    </div>
  )
}