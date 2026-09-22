import importlib.util
from pathlib import Path
import subprocess
import tempfile
import unittest

spec = importlib.util.spec_from_file_location("deploy_static", Path(__file__).with_name("deploy-static.py"))
deploy = importlib.util.module_from_spec(spec)
spec.loader.exec_module(deploy)


class DeployTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.dist = Path(self.tmp.name)
        (self.dist / "index.html").write_text('<div id="root"><h1>LETI</h1></div>')
        (self.dist / "assets").mkdir()
        (self.dist / "assets/app-hash.js").write_text("export {};")

    def test_asset_failure_does_not_publish_html(self):
        calls = []
        def fail(command, **_):
            calls.append(command)
            raise subprocess.CalledProcessError(1, command)
        with self.assertRaises(subprocess.CalledProcessError):
            deploy.publish(self.dist, "example", run=fail)
        self.assertFalse(any(command[5].endswith("index.html") for command in calls))

    def test_entrypoint_is_last_and_no_delete_commands_are_used(self):
        calls = []
        deploy.publish(self.dist, "example", run=lambda command, **_: calls.append(command))
        self.assertTrue(calls[-1][5].endswith("index.html"))
        self.assertTrue(all(command[3] == "cp" for command in calls))
        self.assertIn("public, max-age=31536000, immutable", calls[0])

    def test_build_cannot_overwrite_runtime_data(self):
        (self.dist / "data").mkdir()
        (self.dist / "data/news.json").write_text('{}')
        with self.assertRaisesRegex(ValueError, 'must not overwrite'):
            deploy.deployment_plan(self.dist)


if __name__ == '__main__':
    unittest.main()
