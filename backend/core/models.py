import uuid
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class Team(models.Model):
    """
    チーム（テナント）を表すモデル
    """
    public_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    name = models.CharField("チーム名", max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class CustomUserManager(BaseUserManager):
    """カスタムユーザーモデルのマネージャー"""

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
            
        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractBaseUser, PermissionsMixin):
    """メールアドレスをログインIDとするカスタムユーザーモデル"""
    
    class Role(models.TextChoices):
        MANAGER = 'MANAGER', 'マネージャー'
        PLAYER = 'PLAYER', 'プレーヤー'

    email = models.EmailField("メールアドレス", unique=True)
    full_name = models.CharField("フルネーム", max_length=50)
    
    team = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, blank=True, related_name="members")
    role = models.CharField("役割", max_length=10, choices=Role.choices, default=Role.PLAYER)
    is_tenant_admin = models.BooleanField("テナント管理者", default=False)
    
    positions = models.ManyToManyField('Position', through='PlayerPosition', blank=True)

    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'  # ログインIDとしてemailフィールドを使用
    REQUIRED_FIELDS = ['full_name'] # superuser作成時に聞かれるフィールド

    def __str__(self):
        return self.email
    
    def get_full_name(self):
        return f"{self.first_name} {self.last_name}"

class Position(models.Model):
    """
    ポジション名を表すモデル
    (例: プロップ, フッカー, etc.)
    """
    name = models.CharField("ポジション名", max_length=50, unique=True)

    def __str__(self):
        return self.name

class PlayerPosition(models.Model):
    # playerではなくuserに変更
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    position = models.ForeignKey(Position, on_delete=models.CASCADE)
    is_main = models.BooleanField("メインポジション", default=False)

    class Meta:
        unique_together = ('user', 'position')

    def __str__(self):
        return f"{self.user.username} - {self.position} {'(Main)' if self.is_main else ''}"