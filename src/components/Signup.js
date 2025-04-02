import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('パスワードが一致していません');
    }

    try {
      setError('');
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      navigate('/');
    } catch (error) {
      setError('アカウント作成に失敗しました: ' + error.message);
    }

    setLoading(false);
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>習慣トラッカーアカウント登録</h2>
        {error && <div className="alert-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>メールアドレス</label>
            <input 
              type="email" 
              ref={emailRef} 
              required 
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>パスワード</label>
            <input 
              type="password" 
              ref={passwordRef} 
              required 
              className="form-control"
            />
          </div>
          <div className="form-group">
            <label>パスワード（確認）</label>
            <input 
              type="password" 
              ref={passwordConfirmRef} 
              required 
              className="form-control"
            />
          </div>
          <button disabled={loading} className="signup-button" type="submit">
            アカウント作成
          </button>
        </form>
        <div className="login-link">
          すでにアカウントをお持ちですか？ <Link to="/login">ログイン</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;