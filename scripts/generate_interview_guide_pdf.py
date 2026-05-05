import sys
from pathlib import Path
from datetime import datetime

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, PageBreak


ROOT = Path(__file__).resolve().parents[1]
DEFAULT_SOURCE = ROOT / "docs" / "Utkal-Reserve-Interview-Guide.md"
DEFAULT_OUTPUT = ROOT / "docs" / "Utkal-Reserve-Interview-Guide.pdf"
DEFAULT_TITLE = "Utkal Reserve Interview Guide"


def build_styles():
    styles = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "GuideTitle",
            parent=styles["Title"],
            fontName="Helvetica-Bold",
            fontSize=24,
            leading=30,
            textColor=colors.HexColor("#14213d"),
            alignment=TA_CENTER,
            spaceAfter=10,
        ),
        "subtitle": ParagraphStyle(
            "GuideSubtitle",
            parent=styles["Normal"],
            fontName="Helvetica",
            fontSize=11,
            leading=15,
            textColor=colors.HexColor("#475569"),
            alignment=TA_CENTER,
            spaceAfter=18,
        ),
        "h1": ParagraphStyle(
            "H1",
            parent=styles["Heading1"],
            fontName="Helvetica-Bold",
            fontSize=16,
            leading=20,
            textColor=colors.HexColor("#0f172a"),
            spaceBefore=12,
            spaceAfter=8,
        ),
        "h2": ParagraphStyle(
            "H2",
            parent=styles["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=13,
            leading=17,
            textColor=colors.HexColor("#1d4ed8"),
            spaceBefore=10,
            spaceAfter=6,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=10,
            leading=14,
            textColor=colors.HexColor("#1f2937"),
            spaceAfter=6,
        ),
        "bullet": ParagraphStyle(
            "Bullet",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=10,
            leading=14,
            leftIndent=14,
            firstLineIndent=-8,
            bulletIndent=0,
            textColor=colors.HexColor("#1f2937"),
            spaceAfter=4,
        ),
        "small": ParagraphStyle(
            "Small",
            parent=styles["BodyText"],
            fontName="Helvetica-Oblique",
            fontSize=9,
            leading=12,
            textColor=colors.HexColor("#64748b"),
            spaceAfter=4,
        ),
    }


def escape(text: str) -> str:
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
    )


def parse_markdown(text: str, styles: dict):
    story = []
    lines = text.splitlines()
    for raw_line in lines:
        line = raw_line.rstrip()
        stripped = line.strip()

        if stripped == "[[PAGEBREAK]]":
            story.append(PageBreak())
            continue
        if not stripped:
            story.append(Spacer(1, 3))
            continue
        if stripped.startswith("# "):
            story.append(Paragraph(escape(stripped[2:]), styles["title"]))
            continue
        if stripped.startswith("## "):
            story.append(Paragraph(escape(stripped[3:]), styles["h1"]))
            continue
        if stripped.startswith("### "):
            story.append(Paragraph(escape(stripped[4:]), styles["h2"]))
            continue
        if stripped.startswith("- "):
            story.append(Paragraph(escape(stripped[2:]), styles["bullet"], bulletText="•"))
            continue
        if stripped[0:3] in {"Q: ", "A: "}:
            label = "<b>{}</b>{}".format(escape(stripped[:2]), escape(stripped[2:]))
            story.append(Paragraph(label, styles["body"]))
            continue
        story.append(Paragraph(escape(stripped), styles["body"]))
    return story


def add_page_number(canvas, doc, footer_title):
    canvas.saveState()
    canvas.setFont("Helvetica", 9)
    canvas.setFillColor(colors.HexColor("#64748b"))
    page_label = f"Page {doc.page}"
    canvas.drawRightString(A4[0] - 16 * mm, 10 * mm, page_label)
    canvas.drawString(16 * mm, 10 * mm, footer_title)
    canvas.restoreState()


def main():
    source = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else DEFAULT_SOURCE
    output = Path(sys.argv[2]).resolve() if len(sys.argv) > 2 else DEFAULT_OUTPUT
    title = sys.argv[3] if len(sys.argv) > 3 else DEFAULT_TITLE

    styles = build_styles()
    source_text = source.read_text(encoding="utf-8")
    story = parse_markdown(source_text, styles)

    generated_at = datetime.now().strftime("%d %b %Y, %I:%M %p")
    story.insert(
        1,
        Paragraph(
            f"Interview revision PDF generated on {generated_at}",
            styles["subtitle"],
        ),
    )

    doc = SimpleDocTemplate(
        str(output),
        pagesize=A4,
        leftMargin=16 * mm,
        rightMargin=16 * mm,
        topMargin=16 * mm,
        bottomMargin=16 * mm,
        title=title,
        author="Codex",
    )
    doc.build(
        story,
        onFirstPage=lambda canvas, pdf_doc: add_page_number(canvas, pdf_doc, title),
        onLaterPages=lambda canvas, pdf_doc: add_page_number(canvas, pdf_doc, title),
    )
    print(str(output))


if __name__ == "__main__":
    main()
