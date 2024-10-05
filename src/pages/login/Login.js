import { useState } from 'react'
import { useLogin } from '../../hooks/authentication';

// styles
import './Login.css'

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isPending, error } = useLogin();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <form onSubmit={handleSubmit} className='auth-form'>
      <h2>Login</h2>
      <label>
        <span>email:</span>
        <input
          type='email'
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
      </label>
      <label>
        <span>password:</span>
        <input
          type='password'
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
      </label>
      <button className="btn">{isPending ? 'Loading' : 'Login'}</button>
      {error && <div className='error'>{error}</div>}
    </form>
  )
}
