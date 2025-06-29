import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

function TeamRegistrationForm() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        team_name: '',
        full_name: '',
        email: '',
        password: '',
    });

    // フォームの入力が変更されたときにstateを更新する関数
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
        ...prevState,
        [name]: value,
        }));
    };

    // フォームが送信されたときの処理
    const handleSubmit = async (e) => {
        e.preventDefault(); // フォーム送信時のページリロードを防ぐ
        setError(null);

        try {
        const response = await fetch('http://localhost:8000/api/register/', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
            console.log('登録成功:', data);

            // 新しいルール: Contextにトークンだけを渡してloginを依頼する
            await login(data.tokens);
            navigate(`/team/${data.team.public_id}/dashboard`);
        } else {
            // 失敗した場合の処理
            console.error('登録失敗:', data);
            // エラーメッセージをstateで管理して画面に表示するのが親切
            const errorMessages = Object.values(data).flat().join(' ');
            setError(errorMessages || '登録に失敗しました。');
        }
        } catch (error) {
        console.error('通信エラー:', error);
        setError('サーバーとの通信に失敗しました。');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
        <h2>チーム新規登録</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div>
            <label>チーム名:</label>
            <input
            type="text"
            name="team_name"
            value={formData.team_name}
            onChange={handleChange}
            required
            />
        </div>
        <div>
            <label>氏名:</label>
            <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
            />
        </div>
        <div>
            <label>メールアドレス:</label>
            <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            />
        </div>
        <div>
            <label>パスワード:</label>
            <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            />
        </div>
        <button type="submit">登録</button>
        </form>
    );
}

export default TeamRegistrationForm;