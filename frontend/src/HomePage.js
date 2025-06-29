// frontend/src/HomePage.js

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import TeamRegistrationForm from './TeamRegistrationForm';

function HomePage() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return <div>読み込み中...</div>;
  }

  // ログイン済みの場合
  if (isAuthenticated && user && user.team) {
    return <Navigate to={`/team/${user.team.public_id}/dashboard`} replace />;
  }

  // ログインしていない場合、新規登録フォームを表示する
  return <TeamRegistrationForm />;
}

export default HomePage;