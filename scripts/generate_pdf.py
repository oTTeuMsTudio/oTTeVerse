"""Generate the oTTeVerse definition PDF: white pages, logo top-left, first person."""

from __future__ import annotations

from pathlib import Path

from PIL import Image
from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    KeepTogether,
    ListFlowable,
    ListItem,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"
DOCS = ROOT / "docs"
LOGO_SRC = PUBLIC / "logo.jpg"
MARK_PATH = PUBLIC / "mark.png"
OUT_PUBLIC = PUBLIC / "otteverse-definition.pdf"
OUT_DOCS = DOCS / "What oTTeVerse is building.pdf"

CYAN = colors.HexColor("#00A8E8")
INK = colors.HexColor("#111111")
MUTED = colors.HexColor("#4A4A4A")
RULE = colors.HexColor("#E6E6E6")
BOX = colors.HexColor("#F4F4F4")
WHITE = colors.white

PAGE_W, PAGE_H = letter
LEFT = 0.75 * inch
RIGHT = 0.75 * inch
TOP = 1.15 * inch
BOTTOM = 0.7 * inch


def crop_mark(src: Path, dest: Path) -> Path:
    im = Image.open(src).convert("RGBA")
    pixels = []
    for item in im.getdata():
        if item[0] > 246 and item[1] > 246 and item[2] > 246:
            pixels.append((255, 255, 255, 0))
        else:
            pixels.append(item)
    im.putdata(pixels)
    bbox = im.getbbox()
    if bbox:
        pad = 12
        x0, y0, x1, y1 = bbox
        x0 = max(0, x0 - pad)
        y0 = max(0, y0 - pad)
        x1 = min(im.width, x1 + pad)
        y1 = min(im.height, y1 + pad)
        im = im.crop((x0, y0, x1, y1))
    bg = Image.new("RGBA", im.size, (255, 255, 255, 255))
    bg.paste(im, mask=im.split()[3])
    dest.parent.mkdir(parents=True, exist_ok=True)
    bg.convert("RGB").save(dest, "PNG")
    return dest


def register_fonts() -> tuple[str, str]:
    fonts = Path(r"C:\Windows\Fonts")
    regular = fonts / "segoeui.ttf"
    bold = fonts / "segoeuib.ttf"
    if regular.exists() and bold.exists():
        pdfmetrics.registerFont(TTFont("UI", str(regular)))
        pdfmetrics.registerFont(TTFont("UI-Bold", str(bold)))
        return "UI", "UI-Bold"
    return "Helvetica", "Helvetica-Bold"


def esc(text: str) -> str:
    return (
        text.replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace("“", "&quot;")
        .replace("”", "&quot;")
        .replace("—", "—")
    )


def make_styles(body_font: str, head_font: str) -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    return {
        "kicker": ParagraphStyle(
            "Kicker",
            parent=base["Normal"],
            fontName=head_font,
            fontSize=9,
            textColor=CYAN,
            tracking=1.2,
            spaceAfter=4,
            leading=12,
        ),
        "title": ParagraphStyle(
            "DocTitle",
            parent=base["Title"],
            fontName=head_font,
            fontSize=22,
            textColor=INK,
            leading=26,
            spaceAfter=10,
            alignment=TA_LEFT,
        ),
        "lead": ParagraphStyle(
            "Lead",
            parent=base["Normal"],
            fontName=body_font,
            fontSize=11,
            leading=16,
            textColor=INK,
            spaceAfter=8,
        ),
        "h2": ParagraphStyle(
            "H2",
            parent=base["Heading2"],
            fontName=head_font,
            fontSize=14,
            leading=18,
            textColor=INK,
            spaceBefore=14,
            spaceAfter=6,
        ),
        "body": ParagraphStyle(
            "Body",
            parent=base["Normal"],
            fontName=body_font,
            fontSize=10,
            leading=14.5,
            textColor=INK,
            spaceAfter=8,
        ),
        "bullet": ParagraphStyle(
            "Bullet",
            parent=base["Normal"],
            fontName=body_font,
            fontSize=10,
            leading=14.5,
            textColor=INK,
        ),
        "cell": ParagraphStyle(
            "Cell",
            parent=base["Normal"],
            fontName=body_font,
            fontSize=8.5,
            leading=12,
            textColor=INK,
        ),
        "cellhead": ParagraphStyle(
            "CellHead",
            parent=base["Normal"],
            fontName=head_font,
            fontSize=8.5,
            leading=12,
            textColor=INK,
        ),
        "layer_title": ParagraphStyle(
            "LayerTitle",
            parent=base["Normal"],
            fontName=head_font,
            fontSize=9,
            leading=12,
            textColor=INK,
        ),
        "layer_detail": ParagraphStyle(
            "LayerDetail",
            parent=base["Normal"],
            fontName=body_font,
            fontSize=8.5,
            leading=12,
            textColor=MUTED,
        ),
        "footer": ParagraphStyle(
            "Footer",
            parent=base["Normal"],
            fontName=body_font,
            fontSize=8,
            textColor=MUTED,
        ),
        "crate": ParagraphStyle(
            "Crate",
            parent=base["Normal"],
            fontName=body_font,
            fontSize=10,
            leading=14,
            textColor=INK,
        ),
    }


def header_footer(canvas, doc, mark: Path, head_font: str, body_font: str) -> None:
    canvas.saveState()
    canvas.setFillColor(WHITE)
    canvas.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    mark_h = 0.48 * inch
    reader = ImageReader(str(mark))
    iw, ih = reader.getSize()
    mark_w = mark_h * (iw / ih)
    mark_x = LEFT
    mark_y = PAGE_H - 0.32 * inch - mark_h
    canvas.drawImage(
        reader,
        mark_x,
        mark_y,
        width=mark_w,
        height=mark_h,
        preserveAspectRatio=True,
        mask="auto",
    )

    canvas.setFillColor(INK)
    canvas.setFont(head_font, 13)
    text_x = mark_x + mark_w + 10
    canvas.drawString(text_x, mark_y + mark_h * 0.55, "oTTeVerse")
    canvas.setFillColor(MUTED)
    canvas.setFont(body_font, 8)
    canvas.drawString(text_x, mark_y + mark_h * 0.18, "Definition")

    canvas.setStrokeColor(CYAN)
    canvas.setLineWidth(2)
    line_y = mark_y - 0.12 * inch
    canvas.line(LEFT, line_y, PAGE_W - RIGHT, line_y)

    canvas.setFillColor(MUTED)
    canvas.setFont(body_font, 8)
    canvas.drawString(LEFT, 0.4 * inch, "oTTeVerse will and is building")
    canvas.drawRightString(PAGE_W - RIGHT, 0.4 * inch, f"{doc.page}")
    canvas.restoreState()


def bullets(items: list[str], styles: dict[str, ParagraphStyle]) -> ListFlowable:
    return ListFlowable(
        [
            ListItem(Paragraph(esc(item), styles["bullet"]), leftIndent=8, bulletColor=INK)
            for item in items
        ],
        bulletType="bullet",
        start="•",
        leftIndent=14,
        bulletFontName=styles["bullet"].fontName,
        bulletFontSize=10,
        spaceAfter=8,
    )


def data_table(headers: list[str], rows: list[list[str]], styles: dict[str, ParagraphStyle], widths: list[float]) -> Table:
    head = [Paragraph(esc(h), styles["cellhead"]) for h in headers]
    body = [[Paragraph(esc(cell), styles["cell"]) for cell in row] for row in rows]
    table = Table([head, *body], colWidths=widths, repeatRows=1)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), BOX),
                ("BACKGROUND", (0, 1), (-1, -1), WHITE),
                ("BOX", (0, 0), (-1, -1), 0.6, RULE),
                ("INNERGRID", (0, 0), (-1, -1), 0.4, RULE),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    return table


def layer_block(title: str, detail: str, styles: dict[str, ParagraphStyle], width: float) -> Table:
    inner = Table(
        [
            [Paragraph(esc(title), styles["layer_title"])],
            [Paragraph(esc(detail), styles["layer_detail"])],
        ],
        colWidths=[width - 16],
    )
    inner.setStyle(
        TableStyle(
            [
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 10),
                ("TOPPADDING", (0, 0), (0, 0), 8),
                ("BOTTOMPADDING", (0, -1), (-1, -1), 8),
                ("TOPPADDING", (0, 1), (-1, 1), 1),
                ("BACKGROUND", (0, 0), (-1, -1), WHITE),
                ("BOX", (0, 0), (-1, -1), 0.8, INK),
            ]
        )
    )
    inner.splitByRow = 0
    return inner


def architecture(styles: dict[str, ParagraphStyle], width: float) -> list:
    layers = [
        (
            "Game clients (Unity / Unreal / Bevy / web WASM)",
            "Wallets, marketplaces, social, studios",
        ),
        (
            "Application layer",
            "Marketplaces · royalties · crafting · land · identity · native NFT / FT standards · escrow · tournaments",
        ),
        (
            "Execution + VM",
            "Object store · parallel scheduler · WASM (Rust contracts) · optional attested off-chain WASM coprocessor",
        ),
        (
            "Consensus · data availability · networking",
            "DAG + BFT fast path · object snapshots and erasure coding · gossip + turbine · QUIC",
        ),
        (
            "Storage",
            "Hot: object DB (Rocks / Sled / custom)    Cold: DA / IPFS hashes",
        ),
    ]
    flow: list = []
    for i, (title, detail) in enumerate(layers):
        chunk = [layer_block(title, detail, styles, width)]
        if i < len(layers) - 1:
            chunk.append(
                Paragraph(
                    "<para alignment='center'>↓  SDKs, indexers, RPC, events</para>"
                    if i == 0
                    else "<para alignment='center'>↓</para>",
                    styles["layer_detail"],
                )
            )
            chunk.append(Spacer(1, 4))
        flow.append(KeepTogether(chunk))
    return flow


def build() -> None:
    body_font, head_font = register_fonts()
    styles = make_styles(body_font, head_font)
    mark = crop_mark(LOGO_SRC, MARK_PATH)
    PUBLIC.mkdir(parents=True, exist_ok=True)
    DOCS.mkdir(parents=True, exist_ok=True)

    usable = PAGE_W - LEFT - RIGHT
    story: list = []

    story.append(Paragraph("DEFINITION", styles["kicker"]))
    story.append(Paragraph("What oTTeVerse is building", styles["title"]))
    story.append(
        Paragraph(
            esc(
                "oTTeVerse will and is building a modern Rust blockchain for games and metaverse economies. "
                "We treat assets as first-class objects, keep gameplay off the hot path, and settle ownership "
                "and value on a high-throughput L1."
            ),
            styles["lead"],
        )
    )
    story.append(
        Paragraph(
            esc(
                "We synthesize what already works in production — object-centric models like Sui, parallel "
                "execution like Solana and Aptos, hybrid on/off-chain game loops — rather than cloning any one chain."
            ),
            styles["body"],
        )
    )

    story.append(Paragraph("Design goals", styles["h2"]))
    story.append(
        Paragraph(
            esc("oTTeVerse will and is building toward a chain that games can actually run on:"),
            styles["body"],
        )
    )
    story.append(
        bullets(
            [
                "Sub-second finality for simple asset moves (equip, trade, craft).",
                "Tens to hundreds of thousands of TPS when transactions do not contend on the same objects.",
                "Near-zero fees for in-game micro-actions.",
                "True ownership of items, land, characters, and currencies that can move across titles.",
                "Gameplay that still feels like a game (60+ FPS, physics, AI) — not a wallet confirmation every click.",
                "One language for protocol and contracts: Rust.",
            ],
            styles,
        )
    )
    story.append(
        Paragraph(
            esc(
                "Gameplay stays off-chain or in a WASM coprocessor. The chain is the ledger of record for the digital economy."
            ),
            styles["body"],
        )
    )

    story.append(Paragraph("Layered architecture", styles["h2"]))
    story.append(
        Paragraph(
            esc("oTTeVerse will and is building this stack, from clients down to storage:"),
            styles["body"],
        )
    )
    story.extend(architecture(styles, usable))

    story.append(Paragraph("1. Object-centric state", styles["h2"]))
    story.append(
        Paragraph(
            esc(
                "oTTeVerse will and is building an object-centric state model. We do not store everything as "
                "“account + balance.” We treat every asset as an object with:"
            ),
            styles["body"],
        )
    )
    story.append(
        bullets(
            [
                "a globally unique ID",
                "an owner (address, another object, or shared)",
                "type + version",
                "capabilities (transfer, mutate, wrap)",
            ],
            styles,
        )
    )
    story.append(
        Paragraph(
            esc(
                "A sword object can be owned by a character object owned by a player. Independent objects execute "
                "in parallel with no global lock. Shared objects — a marketplace pool, a raid boss — go through "
                "consensus. This matches how games already think about inventories."
            ),
            styles["body"],
        )
    )

    story.append(Paragraph("2. Consensus and execution", styles["h2"]))
    story.append(
        Paragraph(
            esc(
                "oTTeVerse will and is building the validator, networking, and execution engine as a Rust workspace "
                "(Tokio, QUIC, blst / ed25519, custom object DB). There is no EVM unless we add it later as an optional sidecar."
            ),
            styles["body"],
        )
    )
    story.append(
        bullets(
            [
                "Fast path: single-owner object transactions skip full ordering; we certify and commit in about 100–400 ms.",
                "Slow path: shared objects use a DAG mempool (Narwhal-style) plus BFT (Bullshark / Mysticeti-class) so data dissemination is not the bottleneck.",
                "Parallel execution: the scheduler uses declared object IDs (explicit, like Solana accounts) plus ownership so non-overlapping transactions run concurrently. Optimistic STM (Block-STM style) is the fallback for shared state.",
                "Finality: deterministic, no long reorgs — required if items have real value.",
            ],
            styles,
        )
    )

    story.append(Paragraph("3. Smart contracts in Rust", styles["h2"]))
    story.append(
        Paragraph(
            esc(
                "oTTeVerse will and is building two complementary runtimes so studios write Rust once and choose where it runs:"
            ),
            styles["body"],
        )
    )
    story.append(
        data_table(
            ["Runtime", "Use", "Why"],
            [
                [
                    "On-chain WASM",
                    "Economy: mint, trade, royalties, staking, land deeds",
                    "Sandboxed, portable, Rust → wasm32",
                ],
                [
                    "Native / BPF-like programs",
                    "Ultra-hot paths (order books, tick engines)",
                    "Solana-style performance",
                ],
                [
                    "Off-chain WASM coprocessor",
                    "Combat resolution, physics, matchmaking, RNG with commit-reveal",
                    "Near-native speed; only hashes / outcomes land on-chain",
                ],
            ],
            styles,
            [1.7 * inch, 2.7 * inch, usable - 4.4 * inch],
        )
    )
    story.append(Spacer(1, 8))
    story.append(
        Paragraph(
            esc(
                "Contracts express object types and capabilities, not raw storage slots. That keeps asset composition — "
                "a bag of items, nested NFTs — cheap and safe."
            ),
            styles["body"],
        )
    )

    story.append(Paragraph("4. Hybrid game loop", styles["h2"]))
    story.append(
        Paragraph(
            esc(
                "oTTeVerse will and is building a hybrid loop that is non-negotiable. Players never wait on a block for a jump. "
                "A backend / sequencer cluster runs the same Rust WASM game handlers and posts periodic checkpoints or fraud / validity proofs."
            ),
            styles["body"],
        )
    )
    story.append(
        data_table(
            ["Lives on-chain", "Lives off-chain / coprocessor"],
            [
                ["Ownership, balances, marketplace fills", "Input, rendering, physics"],
                ["Crafting recipes that mint or burn assets", "Frame-by-frame combat"],
                ["Land deeds, rent, royalties", "Chat, presence, pathfinding"],
                ["Tournament prizes, escrow", "Anti-cheat sensors (attest results)"],
            ],
            styles,
            [usable * 0.5, usable * 0.5],
        )
    )

    story.append(Paragraph("5. Digital economy primitives", styles["h2"]))
    story.append(
        Paragraph(
            esc("oTTeVerse will and is building these as native object types, not ad-hoc contracts:"),
            styles["body"],
        )
    )
    story.append(
        bullets(
            [
                "FT + NFT + dynamic NFT (stats that mutate without reminting).",
                "Composability: objects own objects (character owns loadout owns gems).",
                "Royalties / creator cuts enforced at transfer.",
                "Escrow + atomic swap for P2P and studio marketplaces.",
                "Fee market: priority fees + storage rent so abandoned items do not bloat state.",
                "In-game currency as a first-class coin object, optionally bridged.",
                "Identity: passkeys / zkLogin so a new player is not forced through seed phrases on day one.",
            ],
            styles,
        )
    )
    story.append(
        Paragraph(
            esc("Media (meshes, textures) stays off-chain. The object stores a content hash + URI."),
            styles["body"],
        )
    )

    story.append(Paragraph("6. Data, indexers, and studio APIs", styles["h2"]))
    story.append(
        Paragraph(
            esc("oTTeVerse will and is building the data plane games actually query:"),
            styles["body"],
        )
    )
    story.append(
        bullets(
            [
                "Object DB + Merkle / verkle snapshots for light clients and rollbacks.",
                "A dedicated game indexer in Rust: inventory views, activity feeds, leaderboards, “what changed since last frame.”",
                "Event bus (WebSocket / gRPC) so engines subscribe to their objects only.",
                "Oracles only where needed (fiat ramps, external randomness with VRF).",
            ],
            styles,
        )
    )

    story.append(Paragraph("7. Modularity and interoperability", styles["h2"]))
    story.append(
        Paragraph(
            esc(
                "oTTeVerse will and is building consensus, execution, and data availability as separable layers so we can later:"
            ),
            styles["body"],
        )
    )
    story.append(
        bullets(
            [
                "run an app-specific rollup for one title,",
                "use an external DA layer for cheap media commitments,",
                "bridge assets to Ethereum / Solana without rewriting the object model.",
            ],
            styles,
        )
    )
    story.append(
        Paragraph(esc("Bridges should move objects, not just wrapped ERC-721s."), styles["body"])
    )

    story.append(Paragraph("8. Security model for valuable items", styles["h2"]))
    story.append(
        Paragraph(
            esc(
                "oTTeVerse will and is building protocol-level rules because games with real money attract duplication and admin keys:"
            ),
            styles["body"],
        )
    )
    story.append(
        bullets(
            [
                "No silent mint: supply changes are typed object operations.",
                "Shared objects have explicit shared-vs-owned modes.",
                "Admin / studio keys are time-locked or DAO-gated for economy parameters.",
                "Deterministic WASM + attested coprocessor outputs; we never trust a single game server for mint.",
                "Rate limits and storage rent against spam inventories.",
            ],
            styles,
        )
    )

    crate_items = [
        ("node", "validator binary"),
        ("consensus", "DAG + BFT"),
        ("execution", "object store + scheduler"),
        ("vm-wasm", "contract runtime"),
        ("objects", "NFT / FT / land types"),
        ("p2p", "QUIC gossip"),
        ("rpc / indexer", "studio and engine queries"),
        ("sdk", "Rust + FFI for engines"),
        ("coprocessor", "optional verifiable game runtime"),
    ]
    crate_flow = [
        Paragraph("Rust crate map", styles["h2"]),
        Paragraph(
            esc("oTTeVerse will and is building the node as a Rust workspace. This is the implementation sketch:"),
            styles["body"],
        ),
        bullets([f"{name} — {role}" for name, role in crate_items], styles),
        Paragraph(
            esc(
                "Contracts use #[object] macros and capability types, tested against an in-memory object store — "
                "the same pattern as Anchor / Sui Move tests, but in Rust."
            ),
            styles["body"],
        ),
    ]
    story.append(KeepTogether(crate_flow))

    story.append(Paragraph("What we will not do", styles["h2"]))
    story.append(
        Paragraph(
            esc(
                "oTTeVerse will and is building by refusing the designs that make game chains unplayable:"
            ),
            styles["body"],
        )
    )
    story.append(
        bullets(
            [
                "Put every combat tick on L1.",
                "Use a global account model as the only state shape.",
                "Make players pay Ethereum-mainnet fees for a potion.",
                "Hide the studio as an unbounded mint authority.",
                "Invent a new contract language when Rust + WASM already exists.",
            ],
            styles,
        )
    )
    story.append(
        Paragraph(
            esc(
                "This stack is modern because it matches how games actually work: many independent objects moving "
                "at once, a thin settlement layer for the economy, and Rust from node to contract to (optionally) "
                "game logic. Sui-style objects plus Solana-class parallelism plus a WASM coprocessor is the combination "
                "that currently fits metaverse digital economies best."
            ),
            styles["body"],
        )
    )

    def on_page(canvas, doc):
        header_footer(canvas, doc, mark, head_font, body_font)

    doc = SimpleDocTemplate(
        str(OUT_PUBLIC),
        pagesize=letter,
        leftMargin=LEFT,
        rightMargin=RIGHT,
        topMargin=TOP,
        bottomMargin=BOTTOM,
        title="What oTTeVerse is building",
        author="oTTeVerse",
        subject="Definition of the oTTeVerse Rust blockchain for games and metaverse economies",
    )
    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
    OUT_DOCS.write_bytes(OUT_PUBLIC.read_bytes())
    print(f"wrote {OUT_PUBLIC}")
    print(f"wrote {OUT_DOCS}")


if __name__ == "__main__":
    build()
