import subprocess


def git(*args):
    try:
        return subprocess.check_output(
            ["git", *args],
            stderr=subprocess.DEVNULL,
            text=True
        ).strip()
    except Exception:
        return "unknown"


def define_env(env):

    date = git(
        "log",
        "-1",
        "--date=short",
        "--format=%cd"
    )

    if date == "unknown":
        date = "unknown"

    env.conf["extra"]["last_updated"] = date