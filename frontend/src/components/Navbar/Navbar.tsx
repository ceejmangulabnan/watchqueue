import { Link } from 'react-router-dom'
import './navbar.scss'
import LoginFormModal from '../LoginFormModal/LoginFormModal'

const Navbar = () => {
  return (
    <div className='navbar'>
      <h1 className='navbar__title'>watchqueue</h1>
      <nav className='navbar__links'>
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/profile'>Profile</Link>
          </li>
          <li>
            <LoginFormModal />
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Navbar
