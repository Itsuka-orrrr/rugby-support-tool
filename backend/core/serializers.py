# backend/core/serializers.py

from rest_framework import serializers
from django.db import transaction
from .models import CustomUser, Team

class TeamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = ['public_id', 'name', 'created_at']
        read_only_fields = ['public_id', 'created_at']
        
class TeamRegistrationSerializer(serializers.Serializer):
    """チームと管理者を一度に作成するためのシリアライザー"""
    team_name = serializers.CharField(max_length=100)
    full_name = serializers.CharField(max_length=50)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate_email(self, value):
        """メールアドレスが既に存在しないかチェックする"""
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("このメールアドレスは既に使用されています。")
        return value

    def create(self, validated_data):
        with transaction.atomic():
            team = Team.objects.create(name=validated_data['team_name'])
            
            # create_userに渡す引数を変更
            user = CustomUser.objects.create_user(
                email=validated_data['email'],
                password=validated_data['password'],
                full_name=validated_data['full_name'],
                team=team,
                role=CustomUser.Role.MANAGER,
                is_tenant_admin=True
            )
        return user
    

class CustomUserSerializer(serializers.ModelSerializer):
    """ユーザー情報を返すためのシリアライザー"""
    team = TeamSerializer(read_only=True)
    
    class Meta:
        model = CustomUser
        # 返したいフィールドを指定
        fields = ['id', 'email', 'full_name', 'role', 'team']