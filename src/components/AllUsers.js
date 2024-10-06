import { useCollection } from '../hooks/database'
import Avatar from './Avatar'
import './AllUsers.css'

export default function AllUsers() {
  const { documents, error } = useCollection('users')

  return (
    <div className="user-list">
      <h2>All Users</h2>
      {documents && documents.map((user) => (
        <div key={user.id} className="user-list-item">
          {user.online && <span className="online-user"></span>}
          <span>{user.displayName}</span>
          <Avatar src={user.photoURL} />
        </div>
      ))}
      {error && <div className='error'>{error}</div>}
    </div>
  )
}