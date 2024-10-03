// styles
import './Sidebar.css'
import DashboardIcon from '../assets/dashboard_icon.svg'
import AddIcon from '../assets/add_icon.svg'
import { NavLink } from 'react-router-dom'

export default function Sidebar() {
  return (
    <div className='sidebar'>
      <div className="sidebar-content">
        <div className="user">
          {/* TODO: avatar and username */}
          <p>Hey user</p>
        </div>
        <nav className='links'>
          <ul>
            <li>
              <NavLink to="/" end>
                <img src={DashboardIcon} alt="Dashboard icon" />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink to="/create">
                <img src={AddIcon} alt="Add project icon" />
                <span>New Project</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}
