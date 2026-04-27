#!/usr/bin/env python3
import argparse
import base64
import json
import secrets
import sys
from typing import Any, Dict, List, Optional, Tuple, Union
import urllib.error
import urllib.parse
import urllib.request


def _read_json(path: str) -> dict:
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    if not isinstance(data, dict):
        raise ValueError("Config file must contain a JSON object.")
    return data


def _build_basic_auth_header(user: str, password: str) -> str:
    token = base64.b64encode(f"{user}:{password}".encode("utf-8")).decode("ascii")
    return f"Basic {token}"


def _normalize_base_url(url: str, user: Optional[str], password: Optional[str]) -> Tuple[str, Optional[str]]:
    url = (url or "").strip()
    if not url:
        raise ValueError('Missing required config field "url".')

    if "://" not in url:
        url = f"https://{url}"

    parsed = urllib.parse.urlsplit(url)
    if parsed.scheme not in ("http", "https"):
        raise ValueError('Config field "url" must be http(s).')

    netloc = parsed.netloc
    if not netloc:
        raise ValueError('Config field "url" must include a host, e.g. "example.com".')

    embedded_user: Optional[str] = None
    embedded_pass: Optional[str] = None
    hostport = netloc
    if "@" in netloc:
        userinfo, hostport = netloc.rsplit("@", 1)
        if ":" not in userinfo:
            raise ValueError(
                'Config field "url" must include both user and password when embedding credentials.'
            )
        u, p = userinfo.split(":", 1)
        embedded_user = urllib.parse.unquote(u)
        embedded_pass = urllib.parse.unquote(p)

    if embedded_user is not None and embedded_pass is not None:
        base_url = urllib.parse.urlunsplit((parsed.scheme, hostport, "", "", ""))
        return base_url, _build_basic_auth_header(embedded_user, embedded_pass)

    if user and password:
        base_url = urllib.parse.urlunsplit((parsed.scheme, hostport, "", "", ""))
        return base_url, _build_basic_auth_header(user, password)

    base_url = urllib.parse.urlunsplit((parsed.scheme, hostport, "", "", ""))
    return base_url, None


JsonValue = Union[Dict[str, Any], List[Any], str]


def _http_form_urlencoded(
    url: str, form: Dict[str, str], auth_header: Optional[str]
) -> Tuple[int, str]:
    """POST application/x-www-form-urlencoded (e.g. wp-comments-post.php)."""
    body = urllib.parse.urlencode(form).encode("utf-8")
    headers = {
        "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        "User-Agent": "inject-comment/1.0",
    }
    if auth_header:
        headers["Authorization"] = auth_header
    req = urllib.request.Request(
        url=url,
        method="POST",
        data=body,
        headers=headers,
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            raw = resp.read().decode("utf-8", errors="replace")
            return resp.status, raw
    except urllib.error.HTTPError as e:
        raw = e.read().decode("utf-8", errors="replace")
        return e.code, raw


def _http_get_json(url: str, auth_header: Optional[str]) -> Tuple[int, JsonValue]:
    headers = {
        "Accept": "application/json",
        "User-Agent": "inject-comment/1.0",
    }
    if auth_header:
        headers["Authorization"] = auth_header
    req = urllib.request.Request(
        url=url,
        method="GET",
        headers=headers,
    )

    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            raw = resp.read().decode("utf-8", errors="replace")
            try:
                return resp.status, json.loads(raw) if raw else {}
            except json.JSONDecodeError:
                return resp.status, raw
    except urllib.error.HTTPError as e:
        raw = e.read().decode("utf-8", errors="replace")
        try:
            parsed = json.loads(raw) if raw else {}
        except json.JSONDecodeError:
            parsed = raw
        return e.code, parsed


def _discover_random_post_summary(
    base_url: str, auth_header: Optional[str]
) -> Dict[str, Any]:
    endpoint = (
        base_url.rstrip("/")
        + "/wp-json/wp/v2/posts?per_page=100&_fields=id,slug,link,title"
    )
    status, data = _http_get_json(endpoint, auth_header)
    if not (200 <= status < 300):
        raise RuntimeError(f"Post discovery failed with HTTP {status}: {data}")

    if not isinstance(data, list):
        raise RuntimeError(f"Unexpected posts response type: {type(data).__name__}")

    posts: List[Dict[str, Any]] = [
        item for item in data if isinstance(item, dict) and isinstance(item.get("id"), int)
    ]

    if not posts:
        raise RuntimeError("No posts returned by the REST API; cannot pick a random post.")

    chosen: Dict[str, Any] = secrets.choice(posts)
    title = chosen.get("title")
    if isinstance(title, dict):
        title_str = str(title.get("rendered", "") or "")
    else:
        title_str = ""

    return {
        "id": chosen.get("id"),
        "slug": str(chosen.get("slug", "") or ""),
        "link": str(chosen.get("link", "") or ""),
        "title": title_str,
    }


def main(argv: List[str]) -> int:
    parser = argparse.ArgumentParser(
        description=(
            "POST a comment to WordPress via wp-comments-post.php. "
            "The target post is always chosen at random from the public post list (wp-json/wp/v2/posts)."
        )
    )
    parser.add_argument("--config", required=True, help="Path to JSON config file.")
    parser.add_argument("--content", required=True, help="Comment text (form field: comment).")
    parser.add_argument(
        "--author-name",
        default="",
        help="Author name (form field: author). Default: empty.",
    )
    parser.add_argument(
        "--author-email",
        default="",
        help="Author email (form field: email). Default: empty.",
    )
    parser.add_argument(
        "--author-url",
        default="",
        help="Author / website URL (form field: url). Default: empty.",
    )
    parser.add_argument(
        "--parent",
        type=int,
        default=None,
        help="Parent comment ID for a reply (form field: comment_parent).",
    )
    args = parser.parse_args(argv)

    try:
        cfg = _read_json(args.config)
        url = cfg.get("url", "")
        user = (cfg.get("user") or "").strip() or None
        password = (cfg.get("pass") or "").strip() or None
        base_url, auth_header = _normalize_base_url(url, user, password)
    except Exception as e:
        print(f"Config error: {e}", file=sys.stderr)
        return 2

    endpoint = base_url.rstrip("/") + "/wp-comments-post.php"

    try:
        post_summary: Dict[str, Any] = _discover_random_post_summary(base_url, auth_header)
    except Exception as e:
        print(f"Post discovery error: {e}", file=sys.stderr)
        return 2
    post_id = post_summary.get("id")
    if not isinstance(post_id, int):
        print(
            "Post discovery error: could not determine post id from REST response.",
            file=sys.stderr,
        )
        return 2

    form: Dict[str, str] = {
        "comment": args.content,
        "author": args.author_name,
        "email": args.author_email,
        "url": args.author_url,
        "comment_post_ID": str(post_id),
    }
    if args.parent is not None:
        form["comment_parent"] = str(args.parent)

    status, body = _http_form_urlencoded(endpoint, form, auth_header)
    if 200 <= status < 400:
        out: Dict[str, Any] = {
            "endpoint": endpoint,
            "form_fields": {
                **{k: v for k, v in form.items() if k != "comment"},
                "comment": f"<{len(args.content)} chars>",
            },
            "post": post_summary,
            "http_status": status,
            "response_body_preview": body[:2000] if body else "",
        }
        print(json.dumps(out, ensure_ascii=False, indent=2))
        return 0

    print(f"Request failed with HTTP {status}", file=sys.stderr)
    print(body[:4000] if body else "", file=sys.stderr)
    return 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
