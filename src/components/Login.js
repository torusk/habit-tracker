import React, { useState } from 'react';
import { auth } from '../firebase/config';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider 
} from 'firebase/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (isRegistering) {
        // 新規登録
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        // ログイン
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="login-container">
      <h2>{isRegistering ? '新規登録' : 'ログイン'}</h2>
      
      {error && <p className="error-message">{error}</p>}
      
      <form onSubmit={handleAuth} className="login-form">
        <div className="form-group">
          <label htmlFor="email">メールアドレス</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="password">パスワード</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="login-button">
          {isRegistering ? '登録' : 'ログイン'}
        </button>
      </form>
      
      <button 
        onClick={handleGoogleLogin} 
        className="google-login-button"
      >
        Googleでログイン
      </button>
      
      <p className="toggle-form">
        {isRegistering 
          ? 'すでにアカウントをお持ちですか？' 
          : 'アカウントをお持ちでないですか？'
        }
        <button 
          onClick={() => setIsRegistering(!isRegistering)}
          className="toggle-button"
        >
          {isRegistering ? 'ログイン' : '新規登録'}
        </button>
      </p>
    </div>
  );
};

export default Login;
