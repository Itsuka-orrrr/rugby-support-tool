// frontend/src/context/AuthContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // トークンを使ってユーザー情報を取得する関数
  // この関数が、ユーザー情報を取得する唯一の手段となる
  const fetchUser = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await fetch('http://localhost:8000/api/users/me/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // トークンが無効なら、ユーザー情報とトークンをクリア
        setUser(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    } catch (error) {
      console.error("ユーザー情報の取得に失敗しました", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // アプリケーションの初回起動時にユーザー情報を取得
  useEffect(() => {
    fetchUser();
  }, []);

  // ログイン処理（トークンを受け取り、ユーザー情報を取得する）
  const login = async (tokens) => {
    // まずトークンを保存
    localStorage.setItem('accessToken', tokens.access);
    localStorage.setItem('refreshToken', tokens.refresh);
    // 保存したトークンを使って、すぐにユーザー情報を取得しにいく
    await fetchUser();
  };

  // ログアウト処理
  const logout = () => {
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};