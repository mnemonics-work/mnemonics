from rest_framework.authtoken.models import Token
from rest_framework import serializers
from django.contrib.auth.models import User

from mnemonics.models import Profile


class RegisterSerializer(serializers.ModelSerializer):
    fullname = serializers.CharField(max_length=256)

    class Meta:
        model = User
        fields = ["username", "password", "fullname", "email"]
        extra_kwargs = {field: {"required": True} for field in fields}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"],
            password=validated_data["password"],
        )
        Profile.objects.create(
            user=user,
            fullname=validated_data["fullname"],
            email=validated_data["email"],
        )
        return user


class GoogleSocialAuthSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=256)
    redirect_uri = serializers.CharField(max_length=256)


class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = ["key"]
