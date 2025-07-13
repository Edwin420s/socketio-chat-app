import { useSocketContext } from '../context/SocketContext.jsx'

export default function UserList() {
  const { users, startPrivateChat, username } = useSocketContext()

  return (
    <div className="user-list">
      <h3>Online Users ({users.length})</h3>
      <ul>
        {users.map(user => (
          <li key={user.id}>
            <span className={user.id === username ? 'you' : ''}>
              {user.username} {user.id === username && '(You)'}
            </span>
            {user.id !== username && (
              <button onClick={() => startPrivateChat(user.id)}>Message</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}