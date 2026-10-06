"""Package only this checkout's changed/new project files for review and integration."""
import argparse
import json
import subprocess
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

ROOT = Path(__file__).resolve().parents[2]


def git(*args):
    return subprocess.check_output(["git", *args], cwd=ROOT)


def package(output):
    output.mkdir(parents=True, exist_ok=True)
    tracked = git("diff", "--name-only", "HEAD", "-z").decode().split("\0")
    untracked = git("ls-files", "--others", "--exclude-standard", "-z").decode().split("\0")
    files = sorted({p for p in tracked + untracked if p})
    patch = git("diff", "--binary", "HEAD")
    for filename in sorted(p for p in untracked if p):
        result = subprocess.run(["git", "diff", "--no-index", "--binary", "--", "/dev/null", filename], cwd=ROOT, capture_output=True)
        if result.returncode not in (0, 1):
            raise RuntimeError(result.stderr.decode())
        patch += result.stdout
    (output / "history-module.patch").write_bytes(patch)
    manifest = {"baseCommit": git("rev-parse", "HEAD").decode().strip(), "files": files,
                "route": "/history", "deployed": False,
                "note": "Changed/new files only. Read HISTORY-HANDOFF.md before applying."}
    with ZipFile(output / "history-module-files.zip", "w", ZIP_DEFLATED) as archive:
        archive.writestr("HISTORY-DELIVERY-MANIFEST.json", json.dumps(manifest, indent=2) + "\n")
        for filename in files:
            archive.write(ROOT / filename, filename)
    print(f"Packaged {len(files)} files; base {manifest['baseCommit'][:7]}.")
    print(output / "history-module.patch")
    print(output / "history-module-files.zip")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", type=Path, required=True)
    package(parser.parse_args().output_dir.resolve())
