import './LoginFormModal/login_form_modal.scss'
interface LogoutButtonProps {
  onClick: () => Promise<void>
}
const LogoutButton = ({ onClick }: LogoutButtonProps) => {
  return (
    <button className='logout__button' onClick={onClick}>Logout</button>
  )
}

export default LogoutButton
