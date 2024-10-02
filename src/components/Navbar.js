import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/authentication'
import { useAuthContext } from '../hooks/useAuthContext';

// styles & images
import './Navbar.css'
import Temple from '../assets/temple.svg'

export default function Navbar() {
  const { logout } = useLogout();
  const { user } = useAuthContext();

  return (
    <nav className="navbar">
      <ul>
        <li className="logo">
          <img src={Temple} alt="temple logo" />
          <span>Task Temple</span>
        </li>

        {!user && (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/signup">Signup</Link></li>
          </>
        )}

        {user && (
          <li>
            <button className="btn" onClick={logout}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  )
}