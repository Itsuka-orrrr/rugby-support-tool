import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 作成したカスタムフックをインポート

function Header() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', padding: '1rem', background: '#eee' }}>
      <Link to="/"><h1>ラグビーサポート</h1></Link>
      <nav>
        {isAuthenticated ? (
          <div>
            <span>こんにちは、{user.full_name}さん</span>
            <button onClick={logout} style={{ marginLeft: '1rem' }}>ログアウト</button>
          </div>
        ) : (
          <Link to="/">新規登録/ログイン</Link>
        )}
      </nav>
    </header>
  );
}

export default Header;