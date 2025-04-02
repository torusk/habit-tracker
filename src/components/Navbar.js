import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [error, setError] = useState('');
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    setError('');

    try {
      await logout();
      navigate('/login');
    } catch {
      setError('ログアウトに失敗しました');
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          習慣トラッカー
        </Link>
        
        {currentUser ? (
          <div className="navbar-menu">
            <div className="navbar-user">
              {currentUser.email}
            </div>
            <button onClick={handleLogout} className="navbar-logout">
              ログアウト
            </button>
            {error && <div className="navbar-error">{error}</div>}
          </div>
        ) : (
          <div className="navbar-menu">
            <Link to="/login" className="navbar-link">
              ログイン
            </Link>
            <Link to="/signup" className="navbar-link navbar-signup">
              アカウント作成
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;