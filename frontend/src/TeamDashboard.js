// frontend/src/TeamDashboard.js (新規作成)
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

function TeamDashboard() {
    let { teamId } = useParams(); // URLからteamIdを取得
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div>読み込み中...</div>;
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return (
    <div>
        <h2>{user.team.name} ダッシュボード</h2>
        <p>ようこそ、{user.full_name}さん！</p>
        {/* <p>（デバッグ用）URLのチームID: {teamId}</p> */}
        {/* ここに試合登録や選手管理へのリンクを配置していく */}
    </div>
    );
}
export default TeamDashboard;