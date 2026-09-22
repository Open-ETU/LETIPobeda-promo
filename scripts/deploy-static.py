#!/usr/bin/env python3
"""Publish an additive static release, keeping data, ACME and previous assets."""
import argparse
import concurrent.futures
import mimetypes
from pathlib import Path
import subprocess


def deployment_plan(dist):
    dist = Path(dist)
    index = dist / "index.html"
    if not index.is_file() or '<h1' not in index.read_text():
        raise ValueError("Build the prerendered frontend before publishing")
    assets, html = [], []
    for path in sorted(dist.rglob("*")):
        if not path.is_file():
            continue
        relative = path.relative_to(dist)
        if relative.parts[0] in {"data", ".well-known"}:
            raise ValueError(f"Frontend build must not overwrite {relative}")
        content_type = {
            ".js": "application/javascript; charset=utf-8",
            ".css": "text/css; charset=utf-8",
            ".html": "text/html; charset=utf-8",
            ".woff2": "font/woff2",
        }.get(path.suffix, mimetypes.guess_type(path.name)[0] or "application/octet-stream")
        cache = "public, max-age=300"
        if relative.parts[0] == "assets":
            cache = "public, max-age=31536000, immutable"
        if path.suffix == ".html":
            cache = "public, max-age=0, s-maxage=60, must-revalidate"
        entry = (path, relative.as_posix(), content_type, cache)
        (html if path.suffix == ".html" else assets).append(entry)
    # The entry point is the last object changed in a release.
    html.sort(key=lambda entry: entry[1] == "index.html")
    return assets, html


def publish(dist, bucket, run=subprocess.run, dry_run=False):
    assets, html = deployment_plan(dist)

    def upload(entry):
        path, key, content_type, cache = entry
        command = [
            "yc", "storage", "s3", "cp", str(path), f"s3://{bucket}/{key}",
            "--content-type", content_type, "--cache-control", cache, "--only-show-errors",
        ]
        if dry_run:
            print(f"{key}: {cache}")
        else:
            run(command, check=True)

    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
        # Propagate every asset failure before any HTML can reference the new files.
        list(pool.map(upload, assets))
    for entry in html:
        upload(entry)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--dist", type=Path, required=True)
    parser.add_argument("--bucket", required=True)
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()
    publish(args.dist, args.bucket, dry_run=args.dry_run)
