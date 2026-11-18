import os
import subprocess

os.makedirs("docs-images", exist_ok=True)


def esc(text: str) -> str:
    return text.replace("\\", "\\\\").replace("'", "\\'").replace('"', '\\"')


def run_mvg(filename: str, w: int, h: int, bg: str, mvg_lines: list[str]):
    mvg_path = filename + ".mvg"
    with open(mvg_path, "w", encoding="utf-8") as f:
        f.write("\n".join(mvg_lines))
    cmd = ["convert", "-size", f"{w}x{h}", f"xc:{bg}", "-draw", f"@{mvg_path}", filename]
    res = subprocess.run(cmd, capture_output=True, text=True)
    os.remove(mvg_path)
    if res.returncode != 0:
        raise RuntimeError(f"Error rendering {filename}: {res.stderr}")
    print(f"Generated {filename} ({os.path.getsize(filename)} bytes)")


def rect(lines, x1, y1, x2, y2, fill="#ffffff", stroke="#334155", sw=2, rx=10):
    lines.append(f"fill '{fill}' stroke '{stroke}' stroke-width {sw}")
    if rx <= 0:
        lines.append(f"rectangle {x1},{y1} {x2},{y2}")
    else:
        lines.append(f"roundrectangle {x1},{y1} {x2},{y2} {rx},{rx}")


def diamond(lines, cx, cy, hw, hh, fill="#ecfeff", stroke="#0d9488", sw=2):
    lines.append(f"fill '{fill}' stroke '{stroke}' stroke-width {sw}")
    lines.append(f"polygon {cx},{cy-hh} {cx+hw},{cy} {cx},{cy+hh} {cx-hw},{cy}")


def oval(lines, cx, cy, rx, ry, fill="#0d9488", stroke="#0f766e", sw=2):
    lines.append(f"fill '{fill}' stroke '{stroke}' stroke-width {sw}")
    lines.append(f"ellipse {cx},{cy} {rx},{ry} 0,360")


def line(lines, x1, y1, x2, y2, stroke="#475569", sw=2):
    lines.append(f"fill none stroke '{stroke}' stroke-width {sw}")
    lines.append(f"line {x1},{y1} {x2},{y2}")


def arrow(lines, x1, y1, x2, y2, stroke="#475569", sw=2):
    import math
    line(lines, x1, y1, x2, y2, stroke, sw)
    angle = math.atan2(y2 - y1, x2 - x1)
    ah = 10
    p1x = int(x2 - ah * math.cos(angle - 0.4))
    p1y = int(y2 - ah * math.sin(angle - 0.4))
    p2x = int(x2 - ah * math.cos(angle + 0.4))
    p2y = int(y2 - ah * math.sin(angle + 0.4))
    lines.append(f"fill '{stroke}' stroke '{stroke}' stroke-width 1")
    lines.append(f"polygon {x2},{y2} {p1x},{p1y} {p2x},{p2y}")


def txt(lines, x, y, text_str, size=16, fill="#0f172a", bold=False, gravity=None, align="center", mono=False):
    font = "DejaVu-Sans-Mono" if mono else ("DejaVu-Sans-Bold" if bold else "DejaVu-Sans")
    lines.append(f"font '{font}' font-size {size} fill '{fill}' stroke none")
    if align == "center":
        lines.append(f"text-antialias 1 gravity NorthWest")
        # Use draw text with estimated centering or NorthWest; better: use annotate? No, MVG supports gravity!
    lines.append(f"text {x},{y} '{esc(text_str)}'")


def build_image_with_cmds(filename: str, w: int, h: int, bg: str, mvg_lines: list[str], text_items: list[dict]):
    mvg_path = filename + ".mvg"
    with open(mvg_path, "w", encoding="utf-8") as f:
        f.write("\n".join(mvg_lines))
    cmd = ["convert", "-size", f"{w}x{h}", f"xc:{bg}", "-draw", f"@{mvg_path}"]
    for t in text_items:
        font = "DejaVu-Sans-Mono" if t.get("mono") else ("DejaVu-Sans-Bold" if t.get("bold") else "DejaVu-Sans")
        sz = t.get("size", 16)
        col = t.get("color", "#0f172a")
        grav = t.get("gravity", "NorthWest")
        ox = t.get("x", 0)
        oy = t.get("y", 0)
        if grav == "North":
            ox = ox - w // 2
        elif grav == "Center":
            ox = ox - w // 2
            oy = oy - h // 2
        sign_x = f"+{ox}" if ox >= 0 else str(ox)
        sign_y = f"+{oy}" if oy >= 0 else str(oy)
        cmd.extend([
            "-font", font,
            "-pointsize", str(sz),
            "-fill", col,
            "-stroke", "none",
            "-gravity", grav,
            "-annotate", f"{sign_x}{sign_y}", t["text"]
        ])
    cmd.append(filename)
    res = subprocess.run(cmd, capture_output=True, text=True)
    os.remove(mvg_path)
    if res.returncode != 0:
        raise RuntimeError(f"Failed {filename}: {res.stderr}")
    print(f"Created {filename} ({os.path.getsize(filename)} B)")


def ctxt(texts, cx, cy, s, size=15, color="#0f172a", bold=False, mono=False):
    texts.append({"x": cx, "y": cy, "text": s, "size": size, "color": color, "bold": bold, "mono": mono, "gravity": "Center"})


def ltxt(texts, x, y, s, size=14, color="#0f172a", bold=False, mono=False):
    texts.append({"x": x, "y": y, "text": s, "size": size, "color": color, "bold": bold, "mono": mono, "gravity": "NorthWest"})


# =====================================================================
# 1.1 ER-DIAGRAM (1200 x 720)
# =====================================================================
def gen_fig1_1():
    L, T = [], []
    # Outer frame
    rect(L, 12, 12, 1188, 708, fill="#ffffff", stroke="#cbd5e1", sw=2, rx=14)
    ctxt(T, 600, 42, "«MedCabinet» ақпараттық жүйесінің концептуалды ER-моделі (П. Чен нотациясы)", 20, "#0f172a", True)

    # Entities
    rect(L, 80, 120, 320, 210, "#eff6ff", "#1d4ed8", 3, 10)
    ctxt(T, 200, 148, "Users (Пайдаланушы)", 16, "#1e3a8a", True)
    ctxt(T, 200, 178, "id, name, login, phone, role", 13, "#334155")

    rect(L, 880, 120, 1120, 210, "#ecfdf5", "#047857", 3, 10)
    ctxt(T, 1000, 148, "Cabinets (Кабинет)", 16, "#065f46", True)
    ctxt(T, 1000, 178, "id, number, title, floor, status", 13, "#334155")

    rect(L, 460, 330, 740, 420, "#f0fdfa", "#0d9488", 3, 10)
    ctxt(T, 600, 358, "Appointments (Қабылдау)", 16, "#115e59", True)
    ctxt(T, 600, 388, "id, date, time, symptoms, status", 13, "#334155")

    rect(L, 880, 460, 1120, 550, "#fefce8", "#ca8a04", 3, 10)
    ctxt(T, 1000, 488, "Bookings (Брондау)", 16, "#854d0e", True)
    ctxt(T, 1000, 518, "id, date, startTime, needsSterilization", 12, "#334155")

    rect(L, 80, 460, 320, 550, "#fdf2f8", "#be185d", 3, 10)
    ctxt(T, 200, 488, "Reminders (Еске салғыш)", 16, "#9d174d", True)
    ctxt(T, 200, 518, "id, channel, message, sentAt", 13, "#334155")

    # Relationships (diamonds)
    diamond(L, 600, 165, 115, 45, "#f0fdfa", "#0d9488", 2)
    ctxt(T, 600, 165, "басқарады / кіреді", 13, "#0f766e", True)

    diamond(L, 350, 340, 95, 42, "#eff6ff", "#2563eb", 2)
    ctxt(T, 350, 340, "жазылады", 14, "#1e40af", True)

    diamond(L, 1000, 335, 95, 42, "#fefce8", "#ca8a04", 2)
    ctxt(T, 1000, 335, "брондалады", 14, "#854d0e", True)

    diamond(L, 200, 335, 95, 42, "#fdf2f8", "#be185d", 2)
    ctxt(T, 200, 335, "жіберіледі", 14, "#9d174d", True)

    # Connectors
    line(L, 320, 165, 485, 165, "#475569", 2)
    line(L, 715, 165, 880, 165, "#475569", 2)
    ctxt(T, 345, 148, "1", 14, "#0f172a", True)
    ctxt(T, 855, 148, "N", 14, "#0f172a", True)

    line(L, 260, 210, 320, 305, "#475569", 2)
    line(L, 415, 360, 460, 375, "#475569", 2)
    ctxt(T, 280, 232, "1", 14, "#0f172a", True)
    ctxt(T, 442, 348, "N", 14, "#0f172a", True)

    line(L, 1000, 210, 1000, 293, "#475569", 2)
    line(L, 1000, 377, 1000, 460, "#475569", 2)
    ctxt(T, 1020, 245, "1", 14, "#0f172a", True)
    ctxt(T, 1020, 425, "N", 14, "#0f172a", True)

    line(L, 200, 210, 200, 293, "#475569", 2)
    line(L, 200, 377, 200, 460, "#475569", 2)
    ctxt(T, 180, 245, "1", 14, "#0f172a", True)
    ctxt(T, 180, 425, "N", 14, "#0f172a", True)

    line(L, 740, 375, 895, 210, "#475569", 2)
    ctxt(T, 765, 365, "N", 14, "#0f172a", True)
    ctxt(T, 875, 240, "1", 14, "#0f172a", True)

    # Legend bar at bottom
    rect(L, 80, 610, 1120, 675, "#f8fafc", "#cbd5e1", 1, 8)
    ctxt(T, 600, 642, "Шартты белгілер:  [ Тіктөртбұрыш ] — Мән (Сущность)    |    < Ромб > — Байланыс (Қатынас)    |    1 : N — Бірге көп қатынасы", 14, "#334155", True)

    build_image_with_cmds("docs-images/fig1_1_er.png", 1200, 720, "#f8fafc", L, T)


# =====================================================================
# 1.2 LOGICAL MODEL (1200 x 760)
# =====================================================================
def gen_fig1_2():
    L, T = [], []
    rect(L, 12, 12, 1188, 748, "#ffffff", "#cbd5e1", 2, 14)
    ctxt(T, 600, 42, "Мәліметтер қорының логикалық моделі (кестелер, кілттер және дерек типтері)", 20, "#0f172a", True)

    def db_table(x, y, w, title, header_col, fields):
        row_h = 24
        total_h = 38 + len(fields) * row_h + 10
        rect(L, x, y, x + w, y + total_h, "#ffffff", "#94a3b8", 2, 8)
        rect(L, x, y, x + w, y + 36, header_col, header_col, 1, 8)
        ctxt(T, x + w // 2, y + 18, title, 15, "#ffffff", True)
        for idx, (k, name, tp) in enumerate(fields):
            ry = y + 44 + idx * row_h
            if k == "PK":
                ltxt(T, x + 12, ry, "PK", 12, "#b45309", True, True)
            elif k == "FK":
                ltxt(T, x + 12, ry, "FK", 12, "#1d4ed8", True, True)
            ltxt(T, x + 46, ry, name, 13, "#0f172a", True)
            ltxt(T, x + w - 95, ry, tp, 12, "#64748b", False, True)
        return total_h

    db_table(50, 85, 310, "Users", "#1e3a8a", [
        ("PK", "id", "string NN"),
        ("", "name", "string NN"),
        ("", "login", "string UQ"),
        ("", "phone", "string UQ"),
        ("", "passwordHash", "string NN"),
        ("", "role", "enum(3) NN"),
        ("", "specialty", "string"),
        ("", "assignedCabinet", "string"),
        ("", "iin", "char(12)"),
    ])

    db_table(445, 85, 310, "Appointments", "#0f766e", [
        ("PK", "id", "string NN"),
        ("FK", "patientId", "string NN"),
        ("", "patientName", "string NN"),
        ("", "patientPhone", "string NN"),
        ("FK", "doctorId", "string NN"),
        ("", "doctorName", "string NN"),
        ("FK", "cabinetNumber", "string NN"),
        ("", "date", "date NN"),
        ("", "time", "time NN"),
        ("", "symptoms", "text"),
        ("", "status", "enum NN"),
    ])

    db_table(840, 85, 310, "Cabinets", "#047857", [
        ("PK", "id", "string NN"),
        ("", "number", "string UQ"),
        ("", "title", "string NN"),
        ("", "floor", "int NN"),
        ("", "category", "string NN"),
        ("", "status", "enum(4) NN"),
        ("", "equipment", "string[]"),
        ("", "currentDoctor", "string"),
    ])

    db_table(445, 445, 310, "Reminders", "#be185d", [
        ("PK", "id", "string NN"),
        ("", "recipientName", "string NN"),
        ("", "recipientPhone", "string NN"),
        ("", "channel", "enum NN"),
        ("", "message", "text NN"),
        ("", "status", "enum NN"),
        ("", "sentAt", "string NN"),
    ])

    db_table(840, 415, 310, "Bookings", "#b45309", [
        ("PK", "id", "string NN"),
        ("FK", "cabinetId", "string NN"),
        ("", "cabinetNumber", "string NN"),
        ("FK", "doctorId", "string NN"),
        ("", "doctorName", "string NN"),
        ("", "date", "date NN"),
        ("", "startTime / endTime", "time NN"),
        ("", "needsSterilization", "bool NN"),
    ])

    # Foreign key arrows
    arrow(L, 360, 145, 445, 145, "#1d4ed8", 2)  # Users -> Appointments.patientId
    arrow(L, 360, 225, 445, 225, "#1d4ed8", 2)  # Users -> Appointments.doctorId
    arrow(L, 840, 145, 755, 265, "#047857", 2)  # Cabinets -> Appointments
    arrow(L, 995, 325, 995, 415, "#047857", 2)  # Cabinets -> Bookings
    arrow(L, 600, 397, 600, 445, "#be185d", 2)  # Appointments -> Reminders
    arrow(L, 360, 310, 840, 520, "#b45309", 2)  # Users -> Bookings.doctorId

    rect(L, 50, 695, 1150, 735, "#f8fafc", "#cbd5e1", 1, 8)
    ctxt(T, 600, 715, "PK — Бастапқы кілт (Primary Key)   |   FK — Сыртқы кілт (Foreign Key)   |   NN — Not Null (міндетті)   |   UQ — Unique (бірегей)", 13, "#334155", True)

    build_image_with_cmds("docs-images/fig1_2_logical.png", 1200, 760, "#f8fafc", L, T)


# =====================================================================
# 2.1 SITE MAP (1200 x 720)
# =====================================================================
def gen_fig2_1():
    L, T = [], []
    rect(L, 12, 12, 1188, 708, "#ffffff", "#cbd5e1", 2, 14)
    ctxt(T, 600, 42, "«MedCabinet» веб-қосымшасының құрылымы (сайт картасы)", 20, "#0f172a", True)

    # Root node on left
    rect(L, 50, 310, 260, 410, "#0d9488", "#0f766e", 3, 12)
    ctxt(T, 155, 345, "MedCabinet SPA", 17, "#ffffff", True)
    ctxt(T, 155, 375, "App.tsx (Рөл маршруты)", 13, "#ccfbf1")

    branches = [
        (130, "1. Авторизация (AuthScreen)", "#334155", "#f1f5f9", [
            "Жүйеге кіру (Логин / Телефон)",
            "Тіркелу (Пациент / Дәрігер)",
            "DOCX және ZIP жүктеу батырмалары"
        ]),
        (285, "2. Пациент порталы (patient)", "#059669", "#ecfdf5", [
            "Медициналық кабинеттер каталогы",
            "Дәрігерге онлайн жазылу формасы",
            "Талондар, Print Pass & SMS ескертпе"
        ]),
        (440, "3. Дәрігер кабинеті (doctor)", "#2563eb", "#eff6ff", [
            "Күнделікті пациенттер кезегі",
            "Қабылдауды аяқтау («Қабылданды ✓»)",
            "Кабинетті кварцтаумен брондау"
        ]),
        (595, "4. Әкімші панелі (admin)", "#7c3aed", "#f5f3ff", [
            "Клиника статистикасы (4 KPI)",
            "Кабинеттер қосу / күйін өзгерту",
            "Пайдаланушылар тізімі және ӨШІРУ"
        ]),
    ]

    for by, btitle, bcol, bbg, items in branches:
        line(L, 260, 360, 320, 360, "#64748b", 2)
        line(L, 320, 130, 320, 595, "#64748b", 2)
        arrow(L, 320, by, 375, by, bcol, 2)
        rect(L, 375, by - 42, 690, by + 42, bbg, bcol, 2, 10)
        ctxt(T, 532, by, btitle, 15, bcol, True)

        # Leaves
        for idx, leaf in enumerate(items):
            ly = by - 42 + idx * 42
            line(L, 690, by, 740, ly + 15, "#94a3b8", 2)
            rect(L, 740, ly - 2, 1140, ly + 32, "#ffffff", "#cbd5e1", 1, 6)
            ltxt(T, 755, ly + 7, leaf, 13, "#1e293b", False)

    build_image_with_cmds("docs-images/fig2_1_sitemap.png", 1200, 720, "#f8fafc", L, T)


# =====================================================================
# 2.2 ARCHITECTURE INTERACTION (1200 x 700)
# =====================================================================
def gen_fig2_2():
    L, T = [], []
    rect(L, 12, 12, 1188, 688, "#ffffff", "#cbd5e1", 2, 14)
    ctxt(T, 600, 40, "Клиент-серверлік модульдердің өзара әрекеттесу архитектурасы", 20, "#0f172a", True)

    # Layer 1: Client
    rect(L, 60, 80, 1140, 235, "#f0fdfa", "#0d9488", 2, 12)
    ltxt(T, 80, 92, "1-деңгей: Клиенттік орта (Браузер / Смартфон 390px+)", 15, "#0f766e", True)
    mods_c = [
        (85, "AuthScreen.tsx", "Кіру / Тіркелу"),
        (300, "PatientPortal.tsx", "Каталог & Талон"),
        (515, "DoctorPortal.tsx", "Кезек & Кварцтау"),
        (730, "AdminPortal.tsx", "Басқару & Өшіру"),
        (945, "PrintPassModal.tsx", "QR & Мөр басу"),
    ]
    for mx, mt, ms in mods_c:
        rect(L, mx, 130, mx + 175, 210, "#ffffff", "#0d9488", 2, 8)
        ctxt(T, mx + 87, 155, mt, 13, "#0f172a", True)
        ctxt(T, mx + 87, 182, ms, 12, "#475569")

    # API bridge
    arrow(L, 450, 235, 450, 300, "#0284c7", 3)
    arrow(L, 750, 300, 750, 235, "#0284c7", 3)
    rect(L, 350, 250, 850, 285, "#e0f2fe", "#0284c7", 1, 8)
    ctxt(T, 600, 267, "HTTP / REST API (JSON): POST, GET, PUT, DELETE + Bearer Token", 13, "#0369a1", True)

    # Layer 2: Server
    rect(L, 60, 305, 1140, 495, "#eff6ff", "#1d4ed8", 2, 12)
    ltxt(T, 80, 318, "2-деңгей: Серверлік орта — Node.js + Express (server.ts, Port 3000)", 15, "#1e40af", True)
    mods_s = [
        (90, "Auth & RBAC", "SHA-256 + Токен"),
        (355, "Cabinet & Booking", "Күй & Стерилизация"),
        (620, "Appointments API", "Талон & SMS логика"),
        (885, "Admin Controller", "DELETE /api/users/:id"),
    ]
    for mx, mt, ms in mods_s:
        rect(L, mx, 360, mx + 225, 465, "#ffffff", "#2563eb", 2, 8)
        ctxt(T, mx + 112, 392, mt, 15, "#1e3a8a", True)
        ctxt(T, mx + 112, 425, ms, 13, "#475569")

    # DB bridge
    arrow(L, 600, 495, 600, 550, "#15803d", 3)
    ctxt(T, 760, 522, "fs.readFileSync / writeFileSync (JSON I/O)", 13, "#15803d", True)

    # Layer 3: Database
    rect(L, 200, 555, 1000, 660, "#ecfdf5", "#15803d", 3, 14)
    ctxt(T, 600, 588, "3-деңгей: Серверлік деректер базасы — server-data/medcabinet_db.json", 16, "#14532d", True)
    ctxt(T, 600, 622, "[ users ]  •  [ cabinets ]  •  [ appointments ]  •  [ bookings ]  •  [ reminders ]", 14, "#166534", True)

    build_image_with_cmds("docs-images/fig2_2_arch.png", 1200, 700, "#f8fafc", L, T)


# =====================================================================
# 2.3 FLOWCHART (1000 x 1060)
# =====================================================================
def gen_fig2_3():
    L, T = [], []
    rect(L, 12, 12, 988, 1048, "#ffffff", "#cbd5e1", 2, 14)
    ctxt(T, 500, 40, "Дәрігер қабылдауына онлайн жазылу алгоритмінің блок-схемасы", 19, "#0f172a", True)

    oval(L, 500, 105, 120, 32, "#0d9488", "#0f766e", 2)
    ctxt(T, 500, 105, "Басы", 16, "#ffffff", True)
    arrow(L, 500, 137, 500, 175, "#475569", 2)

    rect(L, 290, 175, 710, 240, "#eff6ff", "#2563eb", 2, 8)
    ctxt(T, 500, 207, "Авторизация: Пациент рөлімен жүйеге кіру", 15, "#1e3a8a", True)
    arrow(L, 500, 240, 500, 280, "#475569", 2)

    rect(L, 225, 280, 775, 345, "#f8fafc", "#334155", 2, 8)
    ctxt(T, 500, 312, "Кабинет, дәрігер, күн, уақыт және шағымды таңдау", 15, "#0f172a", True)
    arrow(L, 500, 345, 500, 385, "#475569", 2)

    diamond(L, 500, 445, 185, 60, "#fefce8", "#ca8a04", 2)
    ctxt(T, 500, 445, "Таңдалған уақыт бос па?", 15, "#854d0e", True)

    # No branch to right
    arrow(L, 685, 445, 795, 445, "#dc2626", 2)
    ctxt(T, 740, 425, "жоқ", 14, "#dc2626", True)
    rect(L, 795, 405, 965, 485, "#fef2f2", "#dc2626", 2, 8)
    ctxt(T, 880, 435, "Қате ескертуі:", 13, "#991b1b", True)
    ctxt(T, 880, 458, "«Уақыт бос емес»", 13, "#991b1b")
    line(L, 880, 405, 880, 312, "#dc2626", 2)
    arrow(L, 880, 312, 775, 312, "#dc2626", 2)

    # Yes branch down
    arrow(L, 500, 505, 500, 555, "#16a34a", 2)
    ctxt(T, 525, 525, "иә", 14, "#16a34a", True)

    rect(L, 250, 555, 750, 625, "#ecfdf5", "#059669", 2, 8)
    ctxt(T, 500, 590, "POST /api/appointments → Серверлік базаға сақтау", 15, "#065f46", True)
    arrow(L, 500, 625, 500, 665, "#475569", 2)

    rect(L, 250, 665, 750, 735, "#ecfdf5", "#059669", 2, 8)
    ctxt(T, 500, 700, "Reminders кестесіне SMS ескертпе тіркеу", 15, "#065f46", True)
    arrow(L, 500, 735, 500, 775, "#475569", 2)

    rect(L, 250, 775, 750, 855, "#f0fdfa", "#0d9488", 2, 8)
    ctxt(T, 500, 805, "QR-код пен ресми емхана мөрі бар талонды көрсету", 15, "#115e59", True)
    ctxt(T, 500, 832, "(PrintPassModal → Басып шығаруға дайын)", 13, "#0f766e")
    arrow(L, 500, 855, 500, 910, "#475569", 2)

    oval(L, 500, 945, 120, 32, "#0d9488", "#0f766e", 2)
    ctxt(T, 500, 945, "Соңы", 16, "#ffffff", True)

    build_image_with_cmds("docs-images/fig2_3_flowchart.png", 1000, 1060, "#f8fafc", L, T)


# =====================================================================
# 2.4 AUTH SCREEN UI MOCKUP (1200 x 720)
# =====================================================================
def gen_fig2_4():
    L, T = [], []
    # Dark teal background matching AuthScreen.tsx
    rect(L, 0, 0, 1200, 720, "#0f172a", "#0f172a", 0, 0)
    rect(L, 30, 20, 1170, 700, "#0d252b", "#134e4a", 2, 18)

    # Logo & Title
    rect(L, 560, 42, 640, 112, "#14b8a6", "#2dd4bf", 2, 16)
    ctxt(T, 600, 77, "+", 44, "#ffffff", True)
    ctxt(T, 600, 138, "MedCabinet", 28, "#ffffff", True)
    ctxt(T, 600, 168, "Медициналық кабинеттерді брондау және дәрігерге жазылу жүйесі", 14, "#99f6e4")

    # White Auth Card
    rect(L, 340, 195, 860, 625, "#ffffff", "#e2e8f0", 2, 18)
    # Tabs
    ctxt(T, 485, 224, "Кіру (Вход)", 14, "#64748b", True)
    ctxt(T, 715, 224, "Жаңа тіркелу (Регистрация)", 14, "#0d9488", True)
    line(L, 370, 245, 830, 245, "#e2e8f0", 2)
    line(L, 600, 245, 830, 245, "#0d9488", 4)

    # Role selector (Patient / Doctor only!)
    ltxt(T, 380, 260, "Тіркелу рөлін таңдаңыз (Админ рөлі жабық):", 13, "#334155", True)
    rect(L, 380, 288, 590, 336, "#f0fdfa", "#0d9488", 2, 10)
    ctxt(T, 485, 312, "Пациент (Науқас)", 14, "#0f766e", True)
    rect(L, 610, 288, 820, 336, "#f8fafc", "#cbd5e1", 1, 10)
    ctxt(T, 715, 312, "Дәрігер (Маман)", 14, "#475569", True)

    # Fields
    fields = [
        (355, "Толық аты-жөніңіз", "Әлихан Смағұлов"),
        (418, "Логин және Телефон нөмірі", "alikhan99  |  +7 701 555 44 33"),
        (481, "Құпия сөз (кемінде 6 таңба)", "••••••••••"),
    ]
    for fy, flabel, fval in fields:
        ltxt(T, 380, fy, flabel, 12, "#475569", True)
        rect(L, 380, fy + 20, 820, fy + 52, "#f8fafc", "#cbd5e1", 1, 8)
        ltxt(T, 395, fy + 28, fval, 13, "#0f172a")

    # Submit button
    rect(L, 380, 555, 820, 600, "#0d9488", "#0f766e", 1, 10)
    ctxt(T, 600, 577, "Тіркелу және жүйеге кіру ✓", 15, "#ffffff", True)

    # Download chips at bottom
    rect(L, 340, 645, 585, 682, "#1e293b", "#334155", 1, 8)
    ctxt(T, 462, 663, "Курстық жұмыс (.docx)", 13, "#5eead4", True)
    rect(L, 605, 645, 860, 682, "#064e3b", "#047857", 1, 8)
    ctxt(T, 732, 663, "Жобаның барлық коды (.zip)", 13, "#6ee7b7", True)

    build_image_with_cmds("docs-images/fig2_4_auth.png", 1200, 720, "#0f172a", L, T)


# =====================================================================
# 2.5 PATIENT PORTAL + PRINTABLE TICKET (1200 x 760)
# =====================================================================
def gen_fig2_5():
    L, T = [], []
    rect(L, 0, 0, 1200, 760, "#f1f5f9", "#cbd5e1", 2, 0)
    # Top strip & header
    rect(L, 0, 0, 1200, 32, "#0f172a", "#0f172a", 0, 0)
    ltxt(T, 25, 8, "Жоба авторы: Жақсылық Шыңғысхан  ·  Серверлік деректер базасы белсенді", 12, "#5eead4")
    rect(L, 0, 32, 1200, 92, "#ffffff", "#e2e8f0", 1, 0)
    ltxt(T, 30, 52, "+ MedCabinet v3.0 Server", 18, "#0f172a", True)
    rect(L, 950, 44, 1170, 80, "#ecfdf5", "#a7f3d0", 1, 10)
    ctxt(T, 1060, 62, "Марат Жұмабаев (Пациент)", 13, "#065f46", True)

    # Left side: Patient Portal Catalog
    rect(L, 25, 112, 690, 210, "#0f766e", "#0d9488", 1, 14)
    ltxt(T, 50, 128, "Пациент жеке кабинеті", 12, "#99f6e4", True)
    ltxt(T, 50, 150, "Қош келдіңіз, Марат Жұмабаев!", 20, "#ffffff", True)
    ltxt(T, 50, 180, "Кабинеттер каталогынан маманды таңдап онлайн жазылыңыз.", 13, "#ccfbf1")

    cards = [
        (25, 230, "№101 · Терапия", "Бос", "#ecfdf5", "#059669", "ЭКГ, Тонометр, Кушетка"),
        (255, 230, "№102 · Кардиология", "Брондалған", "#fef3c7", "#d97706", "Д-р Берік Ерболұлы"),
        (485, 230, "№201 · УДЗ (УЗИ)", "Бос", "#ecfdf5", "#059669", "УДЗ 3D/4D, Допплер"),
        (25, 425, "№202 · Рентген", "Тазалауда", "#e0f2fe", "#0284c7", "Сандық рентген кешені"),
        (255, 425, "№301 · Офтальмология", "Бос", "#ecfdf5", "#059669", "Авторефрактометр"),
        (485, 425, "№302 · Стоматология", "Бос", "#ecfdf5", "#059669", "Скалер, Автоклав"),
    ]
    for cx, cy, ct, cst, stbg, stcol, ceq in cards:
        rect(L, cx, cy, cx + 210, cy + 175, "#ffffff", "#e2e8f0", 1, 12)
        ltxt(T, cx + 14, cy + 16, ct, 14, "#0f172a", True)
        rect(L, cx + 14, cy + 44, cx + 120, cy + 68, stbg, stbg, 1, 6)
        ctxt(T, cx + 67, cy + 56, cst, 12, stcol, True)
        ltxt(T, cx + 14, cy + 80, ceq, 12, "#64748b")
        rect(L, cx + 14, cy + 125, cx + 196, cy + 160, "#0d9488", "#0d9488", 1, 8)
        ctxt(T, cx + 105, cy + 142, "Қабылдауға жазылу", 12, "#ffffff", True)

    # Bottom left SMS banner
    rect(L, 25, 620, 690, 735, "#ffffff", "#cbd5e1", 1, 12)
    ltxt(T, 45, 635, "Соңғы SMS ескертпелер:", 14, "#0f172a", True)
    rect(L, 45, 665, 670, 720, "#f0fdfa", "#99f6e4", 1, 8)
    ltxt(T, 60, 678, "SMS [Жіберілді]: 12.11.2026 сағат 10:00-де Д-р Берік Ерболұлы (№102 каб.)", 13, "#115e59")

    # Right side: Official Ticket Modal (PrintPassModal)
    rect(L, 730, 112, 1175, 735, "#ffffff", "#0d9488", 3, 16)
    rect(L, 730, 112, 1175, 180, "#0f766e", "#0f766e", 1, 14)
    ctxt(T, 952, 136, "РЕСМИ ҚАБЫЛДАУ ТАЛОНЫ", 17, "#ffffff", True)
    ctxt(T, 952, 162, "№ Т-102-001  |  Ақтөбе қ. клиникасы", 13, "#ccfbf1")

    trows = [
        ("Пациент:", "Марат Жұмабаев"),
        ("ЖСН:", "920415350124"),
        ("Дәрігер:", "Д-р Берік Ерболұлы"),
        ("Кабинет:", "№102 (Кардиология)"),
        ("Күні / Уақыты:", "2026-11-12 · 10:00"),
        ("Мәртебесі:", "Расталды ✓"),
    ]
    for i, (k, v) in enumerate(trows):
        ry = 205 + i * 44
        ltxt(T, 760, ry, k, 13, "#64748b", True)
        ltxt(T, 910, ry, v, 14, "#0f172a", True)
        line(L, 760, ry + 28, 1145, ry + 28, "#f1f5f9", 1)

    # QR code matrix simulation & official stamp
    rect(L, 770, 485, 890, 605, "#ffffff", "#0f172a", 2, 6)
    for r in range(6):
        for c in range(6):
            if (r + c) % 2 == 0 or (r < 2 and c < 2) or (r > 3 and c > 3):
                qx = 782 + c * 16
                qy = 497 + r * 16
                rect(L, qx, qy, qx + 12, qy + 12, "#0f172a", "#0f172a", 0, 1)
    ltxt(T, 770, 615, "QR-тексеру коды", 12, "#475569")

    oval(L, 1045, 545, 65, 65, "#ffffff", "#0d9488", 3)
    oval(L, 1045, 545, 54, 54, "#f0fdfa", "#0d9488", 1)
    ctxt(T, 1045, 535, "MEDCABINET", 12, "#0f766e", True)
    ctxt(T, 1045, 555, "РАСТАЛДЫ", 11, "#0d9488", True)

    rect(L, 760, 660, 1145, 710, "#0d9488", "#0f766e", 1, 10)
    ctxt(T, 952, 685, "Талонды басып шығару (Print)", 15, "#ffffff", True)

    build_image_with_cmds("docs-images/fig2_5_patient_ticket.png", 1200, 760, "#f1f5f9", L, T)


# =====================================================================
# 2.6 DOCTOR PORTAL (1200 x 700)
# =====================================================================
def gen_fig2_6():
    L, T = [], []
    rect(L, 0, 0, 1200, 700, "#f1f5f9", "#cbd5e1", 2, 0)
    rect(L, 0, 0, 1200, 60, "#ffffff", "#e2e8f0", 1, 0)
    ltxt(T, 30, 18, "+ MedCabinet · Дәрігер порталы", 18, "#1e3a8a", True)
    rect(L, 900, 14, 1170, 46, "#eff6ff", "#bfdbfe", 1, 8)
    ctxt(T, 1035, 30, "Д-р Берік Ерболұлы (№102)", 13, "#1d4ed8", True)

    # Banner
    rect(L, 30, 80, 1170, 175, "#1e3a8a", "#1e40af", 1, 14)
    ltxt(T, 55, 98, "Дәрігердің жұмыс кабинеті", 12, "#93c5fd", True)
    ltxt(T, 55, 120, "Д-р Берік Ерболұлы", 22, "#ffffff", True)
    ltxt(T, 55, 150, "Мамандығы: Кардиолог-терапевт  ·  Бекітілген кабинет: №102", 13, "#dbeafe")

    # Left: Queue
    rect(L, 30, 195, 700, 670, "#ffffff", "#e2e8f0", 1, 14)
    ltxt(T, 55, 215, "Бүгінгі пациенттер кезегі (2)", 17, "#0f172a", True)

    q_items = [
        (260, "Марат Жұмабаев (ЖСН: 920415350124)", "Уақыты: 10:00  |  Кабинет №102", "Шағымы: Жүрек соғысының жиілеуі, қан қысымын тексеру", "Расталды"),
        (450, "Айгерім Нұрланова (ЖСН: 980314441856)", "Уақыты: 11:30  |  Кабинет №102", "Шағымы: ЭКГ жоспарлы тексерісі, профилактикалық кеңес", "Күтуде"),
    ]
    for qy, qname, qtime, qsymp, qst in q_items:
        rect(L, 55, qy, 675, qy + 165, "#f8fafc", "#cbd5e1", 1, 12)
        ltxt(T, 75, qy + 16, qname, 15, "#0f172a", True)
        ltxt(T, 75, qy + 42, qtime, 13, "#2563eb", True)
        ltxt(T, 75, qy + 68, qsymp, 13, "#475569")
        rect(L, 75, qy + 105, 270, qy + 145, "#059669", "#047857", 1, 8)
        ctxt(T, 172, qy + 125, "Қабылдауды аяқтау ✓", 13, "#ffffff", True)
        rect(L, 285, qy + 105, 440, qy + 145, "#ffffff", "#94a3b8", 1, 8)
        ctxt(T, 362, qy + 125, "Талонды көру", 13, "#334155", True)

    # Right: Cabinet Booking + Sterilization
    rect(L, 725, 195, 1170, 670, "#ffffff", "#e2e8f0", 1, 14)
    ltxt(T, 750, 215, "Кабинетті кварцтаумен брондау", 17, "#0f172a", True)
    flds = [
        (260, "Кабинетті таңдау:", "№102 — Кардиология және ЭКГ"),
        (335, "Күні мен уақыт аралығы:", "2026-11-12  |  09:00 – 13:00"),
        (410, "Мақсаты:", "Жоспарлы кардиологиялық қабылдау"),
    ]
    for fy, fl, fv in flds:
        ltxt(T, 750, fy, fl, 12, "#475569", True)
        rect(L, 750, fy + 22, 1145, fy + 58, "#f8fafc", "#cbd5e1", 1, 8)
        ltxt(T, 765, fy + 32, fv, 13, "#0f172a")

    rect(L, 750, 490, 1145, 550, "#ecfeff", "#06b6d4", 1, 10)
    ltxt(T, 765, 512, "[✓] Санитарлық кварцтау (стерилизация) қажет", 12, "#0e7490", True)

    rect(L, 750, 580, 1145, 630, "#2563eb", "#1d4ed8", 1, 10)
    ctxt(T, 947, 605, "Кабинетті брондауды сақтау", 15, "#ffffff", True)

    build_image_with_cmds("docs-images/fig2_6_doctor.png", 1200, 700, "#f1f5f9", L, T)


# =====================================================================
# 2.7 ADMIN PORTAL & USER DELETION (1200 x 740)
# =====================================================================
def gen_fig2_7():
    L, T = [], []
    rect(L, 0, 0, 1200, 740, "#f1f5f9", "#cbd5e1", 2, 0)
    rect(L, 0, 0, 1200, 110, "#0f172a", "#134e4a", 1, 0)
    ltxt(T, 35, 22, "Клиниканың бас әкімшісі · Жақсылық Шыңғысхан", 20, "#ffffff", True)
    ltxt(T, 35, 54, "Серверлік деректер базасы · Толық әкімшілік бақылау және пайдаланушыларды басқару", 13, "#5eead4")
    rect(L, 950, 32, 1165, 74, "#14b8a6", "#2dd4bf", 1, 10)
    ctxt(T, 1057, 53, "+ Жаңа кабинет қосу", 14, "#0f172a", True)

    # 4 KPI Cards
    kpis = [
        (35, "Кабинеттер саны", "7", "#0d9488"),
        (325, "Тіркелген дәрігерлер", "3", "#2563eb"),
        (615, "Тіркелген пациенттер", "12", "#059669"),
        (905, "Барлық жазылулар", "18", "#7c3aed"),
    ]
    for kx, kl, kv, kc in kpis:
        rect(L, kx, 130, kx + 260, 215, "#ffffff", "#e2e8f0", 1, 12)
        ltxt(T, kx + 20, 146, kl, 13, "#64748b", True)
        ltxt(T, kx + 20, 174, kv, 28, kc, True)

    # Tabs
    rect(L, 35, 235, 1165, 280, "#ffffff", "#e2e8f0", 1, 10)
    ltxt(T, 55, 249, "Кабинеттерді басқару (7)", 13, "#64748b", True)
    rect(L, 280, 241, 615, 274, "#0f172a", "#0f172a", 1, 8)
    ctxt(T, 447, 257, "Пайдаланушылар тізімі және ӨШІРУ (16)", 12, "#ffffff", True)
    ltxt(T, 645, 249, "Қабылдаулар (18)", 13, "#64748b", True)
    ltxt(T, 830, 249, "SMS журналы", 13, "#64748b", True)

    # Users Table
    rect(L, 35, 295, 1165, 710, "#ffffff", "#cbd5e1", 1, 12)
    ltxt(T, 55, 312, "Серверлік деректер базасына тіркелген пайдаланушылар (Админ өшіру құқығымен)", 15, "#0f172a", True)

    rect(L, 55, 345, 1145, 385, "#f8fafc", "#e2e8f0", 1, 6)
    ltxt(T, 75, 358, "Пайдаланушы", 13, "#475569", True)
    ltxt(T, 370, 358, "Логин / Телефон", 13, "#475569", True)
    ltxt(T, 650, 358, "Рөлі", 13, "#475569", True)
    ltxt(T, 830, 358, "Мәліметі", 13, "#475569", True)
    ltxt(T, 1020, 358, "Әрекет", 13, "#475569", True)

    rows = [
        ("Жақсылық Шыңғысхан", "admin · +77777778899", "Әкімші (admin)", "#f3e8ff", "#6b21a8", "Бас әкімші", False),
        ("Д-р Берік Ерболұлы", "dr_berik · +77011112233", "Дәрігер (doctor)", "#dbeafe", "#1e40af", "Кардиолог · №102", True),
        ("Марат Жұмабаев", "marat · +77051234567", "Пациент (patient)", "#d1fae5", "#065f46", "ЖСН: 920415350124", True),
        ("Серік Қайратұлы", "serik_test · +77029998877", "Пациент (patient)", "#d1fae5", "#065f46", "Тест тіркелгі", True),
    ]
    for idx, (un, ul, ur, rbg, rcol, udet, can_del) in enumerate(rows):
        ry = 398 + idx * 72
        line(L, 55, ry + 62, 1145, ry + 62, "#f1f5f9", 1)
        ltxt(T, 75, ry + 18, un, 14, "#0f172a", True)
        ltxt(T, 370, ry + 18, ul, 13, "#334155")
        rect(L, 650, ry + 12, 800, ry + 42, rbg, rbg, 1, 6)
        ctxt(T, 725, ry + 27, ur, 12, rcol, True)
        ltxt(T, 830, ry + 18, udet, 13, "#475569")
        if can_del:
            rect(L, 1005, ry + 10, 1125, ry + 44, "#fef2f2", "#ef4444", 1, 8)
            ctxt(T, 1065, ry + 27, "Өшіру", 13, "#dc2626", True)
        else:
            ltxt(T, 1015, ry + 18, "Қорғалған", 13, "#94a3b8", True)

    build_image_with_cmds("docs-images/fig2_7_admin.png", 1200, 740, "#f1f5f9", L, T)


if __name__ == "__main__":
    gen_fig1_1()
    gen_fig1_2()
    gen_fig2_1()
    gen_fig2_2()
    gen_fig2_3()
    gen_fig2_4()
    gen_fig2_5()
    gen_fig2_6()
    gen_fig2_7()
    print("ALL 9 DIAGRAMS GENERATED!")
