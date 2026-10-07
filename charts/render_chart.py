"""Render one chart slot as a PNG with matplotlib.

Run it in the agent's own Python tool: ChatGPT data analysis, Claude code
execution, or a Cursor terminal. It draws only the numbers passed in --data.

  python render_chart.py --kind mermaid-xy --data '{"seriesName": "Revenue", "x": ["Y1", "Y2"], "series": [120000, 260000]}' --currency CAD --language fr --out financials.png
  python render_chart.py --kind markdown-table --data '[{"label": "Shops", "value": 1200}]' --out metrics.png
"""

import argparse
import json
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.ticker import FuncFormatter

DEFAULT_THEME = {
    "colors": {
        "primary": "#0F766E",
        "text": "#111827",
        "muted": "#6B7280",
        "border": "#E5E7EB",
        "background": "#FFFFFF",
        "series": ["#0F766E", "#2563EB", "#D97706", "#7C3AED"],
    },
    "chart": {"width": 900, "height": 400},
}

SPACE_GROUPED_LANGUAGES = {"fr", "de", "es"}


def load_theme(path):
    if path and Path(path).exists():
        return json.loads(Path(path).read_text(encoding="utf-8"))
    return DEFAULT_THEME


def number_formatter(language):
    def format_number(value, _position=None):
        text = f"{value:,.0f}" if float(value).is_integer() else f"{value:,.2f}"
        if language in SPACE_GROUPED_LANGUAGES:
            text = text.replace(",", "\u202f").replace(".", ",")
        return text

    return format_number


def style_axes(ax, colors):
    ax.set_facecolor(colors["background"])
    for side in ("top", "right"):
        ax.spines[side].set_visible(False)
    for side in ("left", "bottom"):
        ax.spines[side].set_color(colors["border"])
    ax.tick_params(colors=colors["muted"])
    ax.grid(axis="y", color=colors["border"], linewidth=0.8)
    ax.set_axisbelow(True)


def render_series(data, theme, currency, language, out):
    labels, values = data["x"], data["series"]
    if len(labels) != len(values) or not values:
        raise SystemExit("x and series must be non-empty and the same length")

    colors = theme["colors"]
    width, height = theme["chart"]["width"], theme["chart"]["height"]
    fmt = number_formatter(language)
    name = data.get("seriesName", "Value")

    fig, ax = plt.subplots(figsize=(width / 100, height / 100), dpi=200)
    fig.patch.set_facecolor(colors["background"])
    bars = ax.bar(labels, values, color=colors["series"][0], width=0.6)
    style_axes(ax, colors)
    ax.yaxis.set_major_formatter(FuncFormatter(fmt))
    ax.set_ylabel(f"{name} ({currency})" if currency else name, color=colors["muted"])
    ax.set_title(name, color=colors["text"], fontsize=14, fontweight="bold", loc="left")
    ax.bar_label(bars, labels=[fmt(value) for value in values], padding=3, color=colors["text"], fontsize=9)
    fig.tight_layout()
    fig.savefig(out, facecolor=colors["background"])


def render_rows(rows, theme, currency, language, out, title):
    if not rows:
        raise SystemExit("data must have at least one row")

    colors = theme["colors"]
    width = theme["chart"]["width"]
    fmt = number_formatter(language)
    labels = [row["label"] for row in rows]
    values = [row["value"] for row in rows]

    fig, ax = plt.subplots(figsize=(width / 100, max(2.4, 0.55 * len(rows) + 1.2)), dpi=200)
    fig.patch.set_facecolor(colors["background"])
    bars = ax.barh(labels, values, color=colors["series"][0], height=0.55)
    ax.invert_yaxis()
    style_axes(ax, colors)
    ax.grid(axis="y", visible=False)
    ax.grid(axis="x", color=colors["border"], linewidth=0.8)
    ax.xaxis.set_major_formatter(FuncFormatter(fmt))
    if currency:
        ax.set_xlabel(currency, color=colors["muted"])
    ax.set_title(title, color=colors["text"], fontsize=14, fontweight="bold", loc="left")
    ax.bar_label(bars, labels=[fmt(value) for value in values], padding=3, color=colors["text"], fontsize=9)
    fig.tight_layout()
    fig.savefig(out, facecolor=colors["background"])


def main():
    parser = argparse.ArgumentParser(description="Render a template chart slot as a PNG.")
    parser.add_argument("--kind", required=True, choices=["mermaid-xy", "markdown-table"], help="The x-chart spec id of the slot.")
    parser.add_argument("--data", required=True, help="The slot value as JSON, or a path to a JSON file.")
    parser.add_argument("--out", required=True, help="PNG path to write.")
    parser.add_argument("--title", help="Chart title. Defaults to seriesName for mermaid-xy.")
    parser.add_argument("--currency", help="Currency code for money values, such as CAD.")
    parser.add_argument("--language", default="en", help="Two-letter language code for number grouping.")
    parser.add_argument("--theme", default="themes/default.json", help="Theme JSON. Built-in colors are used when the file is missing.")
    args = parser.parse_args()

    raw = Path(args.data).read_text(encoding="utf-8") if Path(args.data).is_file() else args.data
    data = json.loads(raw)
    theme = load_theme(args.theme)

    if args.kind == "mermaid-xy":
        render_series(data, theme, args.currency, args.language, args.out)
    else:
        render_rows(data, theme, args.currency, args.language, args.out, args.title or "Values")
    print(f"Wrote {args.out}")


if __name__ == "__main__":
    main()
