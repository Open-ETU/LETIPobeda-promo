#!/usr/bin/env python3
"""Publish code to the existing private news function; IAM/timer stay unchanged."""
import argparse
from pathlib import Path
import subprocess
import tempfile
import zipfile

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--function-id', default='d4e35tg1kdcnsohqhev2')
parser.add_argument('--service-account-id', default='aje1mkrf2rkr8novc5gs')
parser.add_argument('--bucket', default='leti-pobeda-news')
args = parser.parse_args()
source = Path(__file__).resolve().parents[1] / 'functions' / 'news'
with tempfile.TemporaryDirectory() as directory:
    archive = Path(directory) / 'news.zip'
    with zipfile.ZipFile(archive, 'w', zipfile.ZIP_DEFLATED) as bundle:
        for name in ['index.py', 'requirements.txt']:
            bundle.write(source / name, name)
    subprocess.run([
        'yc', 'serverless', 'function', 'version', 'create',
        '--function-id', args.function_id, '--runtime', 'python312',
        '--entrypoint', 'index.handler', '--memory', '128MB',
        '--execution-timeout', '60s', '--concurrency', '1',
        '--service-account-id', args.service_account_id,
        '--source-path', str(archive), '--environment', f'NEWS_BUCKET={args.bucket}',
    ], check=True)
