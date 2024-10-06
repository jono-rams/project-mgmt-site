import { useState } from 'react'
import { useSignup } from '../../hooks/authentication';

// styles
import './Signup.css'

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailError, setThumbnailError] = useState(null);
  const { signup, isPending, error } = useSignup();

  const handleSubmit = (e) => {
    e.preventDefault();
    signup(email, password, displayName, thumbnail);
    setEmail('');
    setPassword('');
    setDisplayName('');
    document.querySelector('form').reset();
  };

  const handleFileChange = (e) => {
    setThumbnail(null);
    let selected = e.target.files[0];

    if(!selected) {
      setThumbnailError('Please select a thumbnail');
      return;
    }
    else if(!selected.type.includes('image')) {
      setThumbnailError('Please select an image file');
      return;
    }
    else if(selected.size > 1000000) {
      setThumbnailError('Thumbnail should be less than 1MB');
      return;
    }
    setThumbnailError(null);
    setThumbnail(selected);
    console.log('thumbnail updated');
  };

  return (
    <form onSubmit={handleSubmit} className='auth-form'>
      <h2>Sign up</h2>
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
      <label>
        <span>display name:</span>
        <input
          type='text'
          value={displayName}
          onChange={e => setDisplayName(e.target.value)}
          required
        />
      </label>
      <label>
        <span>thumbnail:</span>
        <input
          type='file'
          accept='image/*'
          onChange={handleFileChange}
          required
        />
        {thumbnailError && <div className='error'>{thumbnailError}</div>}
      </label>
      <button disabled={isPending} className="btn">{isPending ? 'Loading' : 'Sign up'}</button>
      {error && <div className='error'>{error}</div>}
    </form>
  )
}
