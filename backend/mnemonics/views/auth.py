from django.conf import settings
from django.contrib.auth.models import User
from rest_framework import exceptions, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.decorators import action
from rest_framework.response import Response

from mnemonics.serializers.auth import (
    RegisterSerializer,
    TokenSerializer,
    GoogleSocialAuthSerializer,
)
from mnemonics.models import Profile
from drf_yasg.utils import swagger_auto_schema
from requests_oauthlib import OAuth2Session


class AuthAPIViewSet(viewsets.GenericViewSet):
    serializer_class = AuthTokenSerializer

    def get_user_token(self, user):
        token, created = Token.objects.get_or_create(user=user)
        return Response(TokenSerializer(token).data)

    def get_google_social_data(self, code, redirect_uri):
        authenticator = OAuth2Session(
            settings.GOOGLE_APP_ID,
            redirect_uri=redirect_uri,
        )
        authenticator.fetch_token(
            "https://www.googleapis.com/oauth2/v4/token",
            client_secret=settings.GOOGLE_APP_SECRET,
            code=code,
        )
        response = authenticator.get("https://www.googleapis.com/oauth2/v1/userinfo")
        return response.json()

    @swagger_auto_schema(methods=["post"], responses={200: TokenSerializer()})
    @action(methods=["post"], detail=False)
    def login(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data, context={"request": self.request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        return self.get_user_token(user)

    @swagger_auto_schema(methods=["post"], responses={200: TokenSerializer()})
    @action(methods=["post"], detail=False, serializer_class=RegisterSerializer)
    def register(self, request, *args, **kwargs):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return self.get_user_token(user)

    @swagger_auto_schema(methods=["post"], responses={200: TokenSerializer()})
    @action(methods=["post"], detail=False, serializer_class=GoogleSocialAuthSerializer)
    def google(self, request, *args, **kwargs):
        serializer = GoogleSocialAuthSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        social_data = self.get_google_social_data(data["code"], data["redirect_uri"])
        user = User.objects.filter(
            username=social_data["id"],
            profile__google_id=social_data["id"],
        ).first()

        if user is None:
            user = User.objects.create_user(
                username=social_data["id"],
            )
            Profile.objects.create(
                user=user,
                google_id=social_data["id"],
                fullname=social_data["name"],
                email=social_data["email"],
            )

        return self.get_user_token(user)
