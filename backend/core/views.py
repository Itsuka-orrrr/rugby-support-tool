# backend/core/views.py
from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from .models import Team
from .serializers import TeamSerializer, TeamRegistrationSerializer, CustomUserSerializer

class TeamCreateView(generics.CreateAPIView):
    """
    新しいチームを作成するためのビュー
    POSTリクエストで {"name": "チーム名"} を受け取る
    """
    queryset = Team.objects.all()
    serializer_class = TeamSerializer
    
class TeamRegistrationView(generics.CreateAPIView):
    """チームと管理者を一括で登録するビュー"""
    serializer_class = TeamRegistrationSerializer
    
    # レスポンスされるデータが異なるため、createメソッドをオーバーライド
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # ユーザーのためのトークンを生成
        refresh = RefreshToken.for_user(user)

        # 返したいレスポンスのデータを手動で作成
        response_data = {
            "message": "チームの登録が正常に完了しました。",
            "user": {
                "email": user.email,
                "full_name": user.full_name,
            },
            "team": {
                "name": user.team.name,
                "public_id": str(user.team.public_id),
            },
            # 生成したトークンをレスポンスに含める
            "tokens": {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }

        return Response(response_data, status=status.HTTP_201_CREATED)
    
class MeView(generics.RetrieveAPIView):
    """現在ログインしているユーザーの情報を返すビュー"""
    serializer_class = CustomUserSerializer
    permission_classes = [IsAuthenticated] # 認証済みユーザーのみアクセス可

    def get_object(self):
        # リクエストを送信してきたユーザーオブジェクトを返す
        return self.request.user