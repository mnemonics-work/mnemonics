import os
from io import StringIO
from django.test import SimpleTestCase
from django.contrib.auth.models import User
from django.core.management import call_command
from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from mnemonics.urls import app_name


class TestAuthentication(APITestCase):
    resource = "user-list"

    def test_login_ok(self):
        user_data = {
            "username": "test_user",
            "password": "test_pass",
        }
        user = User.objects.create_user(**user_data)
        url = reverse("{}:auth-login".format(app_name))
        response = self.client.post(url, user_data, format="json").json()
        self.assertEqual(response["key"], Token.objects.get(user=user).key)

    def test_login_fail(self):
        user_data = {
            "username": "test_user_fail",
            "password": "test_pass_fail",
        }
        url = reverse("{}:auth-login".format(app_name))
        response = self.client.post(url, user_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.json(),
            {"non_field_errors": ["Unable to log in with provided credentials."]},
        )

    def test_register_ok(self):
        user_data = {
            "username": "username",
            "password": "test_new_pass",
            "fullname": "name",
            "email": "email@hotmail.com",
        }
        url = reverse("{}:auth-register".format(app_name))
        response = self.client.post(url, user_data, format="json").json()
        user = Token.objects.get(key=response["key"]).user
        self.assertEqual(user.username, user_data["username"])

    def test_register_duplicate_username(self):
        user_data = {
            "username": "new_username",
            "password": "test_dup_pass",
            "fullname": "name",
            "email": "new_name@test.com",
        }
        User.objects.create_user(
            username=user_data["username"],
            password=user_data["password"],
        )
        url = reverse("{}:auth-register".format(app_name))
        response = self.client.post(url, user_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(
            response.json(),
            {"username": ["A user with that username already exists."]},
        )


class TestOpenAPISpec(SimpleTestCase):
    """Test for the generated OpenAPI specification"""

    def test_generate_swagger_output_matches_committed_spec(self):
        """
        Tests that the committed spec matches the current state of views
        If this tests fails, you need to regenerate the OpenAPI spec
        """
        spec_path = os.path.join(
            os.path.abspath(os.path.dirname(__file__)), "../api.yaml"
        )
        with open(spec_path) as file:
            committed_spec = file.read()
            out = StringIO()
            call_command(
                "generate_swagger",
                "--format=yaml",
                stdout=out,
            )
            generated_spec = out.getvalue()
            self.assertIn("swagger: '2.0'", generated_spec)
            self.assertEqual(committed_spec, generated_spec)
