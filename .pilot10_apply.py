from pathlib import Path
import base64, hashlib, json, lzma

BASE = Path(".")
PARTS = [BASE / ".pilot10_payload" / f"{i:02d}" for i in range(1, 5)]
EXPECTED_OLD = {
    "reconstruction.html": "9354370f0512f13e7f03e2b8abcb7bab1cef7a3c",
    "index.html": "c2a09da64b3cc7dc5eb6968ba173f41e02ad4483",
    "sw.js": "834aa3efb7d6e0f9dcd4c22d6a470dcf9791e17f",
    "CHANGELOG.md": "2b80a3a705a6459418c592fc53a77b96f30120c4",
}
EXPECTED_NEW = {
    "reconstruction.html": "97ef34edf53d91bc1054416b5a32746a92ed3229",
    "index.html": "90f087fcdf33737746b69116b73eb8f405637f99",
    "sw.js": "33e270518036228cb90723fe6316975c772c4f3c",
    "CHANGELOG.md": "11842fcf6e2afaae57c97be2268231e7b15c6ec9",
}

def blob_sha(raw):
    return hashlib.sha1(f"blob {len(raw)}\0".encode() + raw).hexdigest()

assert all(p.is_file() for p in PARTS), "Missing payload segment"
encoded = "".join(p.read_text("ascii") for p in PARTS)
assert len(encoded) == 11424, f"Unexpected payload length {len(encoded)}"
payload = json.loads(lzma.decompress(base64.b64decode(encoded)).decode("utf-8"))
original = {}
for name, expected in EXPECTED_OLD.items():
    raw = (BASE / name).read_bytes()
    got = blob_sha(raw)
    assert got == expected, f"Baseline mismatch: {name}: {got}"
    original[name] = raw.decode("utf-8")

lines = original["reconstruction.html"].split("\n")
for a, b, replacement in reversed(payload["p"]):
    lines[a:b] = replacement

results = {
    "reconstruction.html": "\n".join(lines),
    "index.html": original["index.html"].replace("20261107-pilot3", "20261107-pilot10"),
    "sw.js": original["sw.js"].replace("20261107-pilot3", "20261107-pilot10"),
    "CHANGELOG.md": original["CHANGELOG.md"] + payload["c"],
}

assert original["index.html"].count("20261107-pilot3") == 3
assert original["sw.js"].count("20261107-pilot3") == 2
for name, text in results.items():
    raw = text.encode("utf-8")
    actual = blob_sha(raw)
    assert actual == EXPECTED_NEW[name], f"ZIP SHA mismatch: {name} actual={actual} expected={EXPECTED_NEW[name]}"
    print(f"PASS {name}: {actual} ({len(raw)} bytes)")

# Write ONLY the four files from the uploaded ZIP after all hashes pass.
for name, text in results.items():
    (BASE / name).write_bytes(text.encode("utf-8"))
assert (BASE / "floor-2-pilot.html").is_file(), "Preserved file missing"
# Temporary tooling is not part of the deployed application.
for path in PARTS:
    path.unlink()
(BASE / ".pilot10_payload").rmdir()
(BASE / ".pilot10_apply.py").unlink()
(BASE / ".github/workflows/apply-pilot10.yml").unlink()
print("Four ZIP files verified, other repository files preserved, staging tooling removed")
