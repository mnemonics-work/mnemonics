import os
from django.test import SimpleTestCase
from django.core.management import call_command
from io import StringIO

# Create your tests here.


class TestOpenAPISpec(SimpleTestCase):
    """ Test for the generated OpenAPI specification"""

    def test_generate_swagger_output_matches_committed_spec(self):
        """
        Tests that the committed spec matches the current state of views
        If this tests fails, you need to regenerate the OpenAPI spec
        """
        spec_path = os.path.join(
            os.path.abspath(os.path.dirname(__file__)),
            '../api.yaml'
        )
        with open(spec_path) as file:
            committed_spec = file.read()
            out = StringIO()
            call_command(
                'generate_swagger',
                '--format=yaml',
                stdout=out,
            )
            generated_spec = out.getvalue()
            self.assertIn("swagger: '2.0'", generated_spec)
            self.assertEqual(committed_spec, generated_spec)
