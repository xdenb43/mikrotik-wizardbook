from subprocess import check_output, DEVNULL


def on_config(config):

    try:
        last_updated = check_output(
            [
                "git",
                "log",
                "-1",
                "--date=short",
                "--format=%cd"
            ],
            text=True,
            stderr=DEVNULL
        ).strip()

    except Exception:
        last_updated = "unknown"

    config.extra["version"] = f"Last updated: {last_updated}"

    return config