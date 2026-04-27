# Inject Comment (WordPress REST)

Small script to post a comment to a WordPress post via the REST API.

## Requirements

- Python 3.10+ (uses built-in `urllib`; no extra dependencies)

## Configuration

Create a `config.json` file (or copy `config.example.json` and adjust).

### Option A: URL with embedded credentials (basic auth)

```json
{
  "url": "https://user:pass@url/"
}
```

### Option B: Host + separate user/pass

```json
{
  "url": "https://url/",
  "user": "user",
  "pass": "pass"
}
```

Notes:

- If you embed credentials in `url`, the script will use those and ignore `user`/`pass`.
- If you embed credentials, you must include both user and password (not just one).

## Usage

```bash
python3 inject_comment.py \
  --config config.json \
  --post 123 \
  --content "Hello from inject_comment.py"
```

Optional fields:

```bash
python3 inject_comment.py \
  --config config.json \
  --post 123 \
  --content "Replying to a comment" \
  --author-name "Jane Doe" \
  --author-email "jane@example.com" \
  --parent 456
```

