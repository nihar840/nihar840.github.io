#!/usr/bin/env python3
"""
Nihar Portfolio AI — Desktop Widget
────────────────────────────────────
Round always-on-top button pinned to your screen.
  🟢 Green  = backend running (API + ChromaDB + Tunnel)
  🔴 Red    = stopped
  🟡 Amber  = starting / checking

  Left-click  → toggle on / off
  Drag        → reposition anywhere
  Right-click → menu (start / stop / quit)
"""

import tkinter as tk
import subprocess
import threading
import urllib.request
import time
import sys
import os

# ── Paths ───────────────────────────────────────────────────────────────────
API_PROJECT  = r"D:\Codes\nihar840.github.io\.claude\worktrees\charming-burnell-api\RagApi"
TUNNEL_TOKEN = "eyJhIjoiODU1MGNlZjY2NzM4ZDIwYWNhNzJlMmUwNzkxOGQ4MDIiLCJ0IjoiYjE1ZGU5NmItYTUwZC00YjVkLWIzODYtYTU1MTBmY2U1YWNhIiwicyI6Ik0yVTVZMkkyTjJNdFltVTFNUzAwTnpGakxUZ3haVEl0WXpVelpUSTFabVZoTkRJMSJ9"
HEALTH_URL   = "http://localhost:5000/api/health"

# ── Timing ──────────────────────────────────────────────────────────────────
POLL_MS  = 3000   # health-check interval
FRAME_MS = 40     # animation frame (~25 fps)
BOOT_SEC = 12     # seconds to wait for services to initialise

# ── Window geometry ─────────────────────────────────────────────────────────
W    = 88          # window / canvas side (px)
CR   = 31          # main circle radius
CX   = W // 2      # centre x
CY   = W // 2      # centre y
TKEY = "#020406"   # transparent-key colour (not used in any drawn colour)

# ── Colour palette ──────────────────────────────────────────────────────────
PAL = {
    "online":   {"bg": "#064e3b", "mid": "#10b981", "rim": "#34d399",
                 "r1": "#34d399", "r2": "#6ee7b7", "r3": "#a7f3d0"},
    "offline":  {"bg": "#7f1d1d", "mid": "#ef4444", "rim": "#f87171",
                 "r1": "#f87171", "r2": "#fca5a5", "r3": "#fee2e2"},
    "checking": {"bg": "#78350f", "mid": "#f59e0b", "rim": "#fbbf24",
                 "r1": "#fbbf24", "r2": "#fde68a", "r3": "#fef3c7"},
}


class AIWidget:
    def __init__(self):
        self.status    = "checking"
        self.procs     = {}        # name → Popen
        self.t         = 0.0      # animation time (ever-increasing)
        self._starting = False
        self._drag_ox  = 0
        self._drag_oy  = 0
        self._moved    = False

        # ── Window ──────────────────────────────────────────────────────────
        self.win = tk.Tk()
        self.win.title("AI")
        self.win.overrideredirect(True)          # no title bar / borders
        self.win.attributes("-topmost", True)    # always on top
        self.win.attributes("-transparentcolor", TKEY)
        self.win.configure(bg=TKEY)
        self.win.geometry(f"{W}x{W}+20+100")
        self.win.resizable(False, False)

        # ── Canvas ──────────────────────────────────────────────────────────
        self.cv = tk.Canvas(self.win, width=W, height=W,
                            bg=TKEY, highlightthickness=0)
        self.cv.pack()

        # ── Events ──────────────────────────────────────────────────────────
        self.cv.bind("<ButtonPress-1>",   self._on_press)
        self.cv.bind("<B1-Motion>",       self._on_drag)
        self.cv.bind("<ButtonRelease-1>", self._on_release)
        self.cv.bind("<Button-3>",        self._on_right_click)

        # ── Kick off loops ───────────────────────────────────────────────────
        self._schedule_poll()
        self._tick()

        self.win.mainloop()

    # ────────────────────────────────────────────────────────────────────────
    # Drawing
    # ────────────────────────────────────────────────────────────────────────
    def _draw(self):
        cv = self.cv
        c  = PAL[self.status]
        cv.delete("all")

        # ── Ripple rings (green: expanding, red/amber: single static) ────────
        if self.status == "online":
            ring_colors = [c["r1"], c["r2"], c["r3"]]
            for i, rc in enumerate(ring_colors):
                phase = (self.t * 0.35 + i * 0.33) % 1.0
                r     = CR + 3 + phase * 16
                w     = max(1, int(3 * (1.0 - phase)))
                if phase < 0.85:  # hide when nearly fully expanded
                    cv.create_oval(CX - r, CY - r, CX + r, CY + r,
                                   outline=rc, width=w, fill="")

        elif self.status == "offline":
            # Soft static outer ring
            cv.create_oval(CX - CR - 4, CY - CR - 4,
                           CX + CR + 4, CY + CR + 4,
                           outline=c["r2"], width=1, fill="")

        else:  # checking — spinning arc
            angle = -(self.t * 200) % 360
            r     = CR + 5
            cv.create_arc(CX - r, CY - r, CX + r, CY + r,
                          start=angle, extent=210,
                          outline=c["rim"], width=3, style="arc")

        # ── Drop shadow ───────────────────────────────────────────────────────
        cv.create_oval(CX - CR + 2, CY - CR + 4,
                       CX + CR + 2, CY + CR + 4,
                       fill="#111111", outline="")

        # ── Main circle ───────────────────────────────────────────────────────
        cv.create_oval(CX - CR, CY - CR, CX + CR, CY + CR,
                       fill=c["mid"], outline=c["rim"], width=2)

        # ── Inner "depth" — darker lower-half chord ───────────────────────────
        cv.create_arc(CX - CR + 1, CY - CR + 1,
                      CX + CR - 1, CY + CR - 1,
                      start=200, extent=140,
                      fill=c["bg"], outline="", style="chord")

        # ── Gloss highlight — white arc top-left ──────────────────────────────
        cv.create_arc(CX - CR + 6, CY - CR + 6,
                      CX + CR - 6, CY + CR - 6,
                      start=45, extent=90,
                      outline="white", width=1, style="arc")

        # ── Icon ✦ AI ─────────────────────────────────────────────────────────
        cv.create_text(CX, CY - 6,
                       text="✦ AI",
                       fill="white",
                       font=("Segoe UI", 10, "bold"))

        # ── Status label ─────────────────────────────────────────────────────
        sub = {"online": "● online", "offline": "○ offline", "checking": "◌ …"}
        cv.create_text(CX, CY + 9,
                       text=sub[self.status],
                       fill="white",
                       font=("Segoe UI", 6))

    # ────────────────────────────────────────────────────────────────────────
    # Animation loop
    # ────────────────────────────────────────────────────────────────────────
    def _tick(self):
        self.t += 0.05
        self._draw()
        self.win.after(FRAME_MS, self._tick)

    # ────────────────────────────────────────────────────────────────────────
    # Health polling
    # ────────────────────────────────────────────────────────────────────────
    def _schedule_poll(self):
        threading.Thread(target=self._poll_health, daemon=True).start()
        self.win.after(POLL_MS, self._schedule_poll)

    def _poll_health(self):
        try:
            resp = urllib.request.urlopen(HEALTH_URL, timeout=2)
            new  = "online" if resp.status == 200 else "offline"
        except Exception:
            new = "offline"
        if not self._starting:
            self.status = new

    # ────────────────────────────────────────────────────────────────────────
    # Toggle on / off
    # ────────────────────────────────────────────────────────────────────────
    def _toggle(self):
        if self.procs:
            self._stop()
        else:
            self._start()

    def _start(self):
        if self._starting:
            return
        self._starting = True
        self.status = "checking"

        flags = subprocess.CREATE_NO_WINDOW if sys.platform == "win32" else 0
        cmds = {
            "chroma": [
                sys.executable, "-m", "uvicorn", "chromadb.app:app",
                "--host", "0.0.0.0", "--port", "8000",
            ],
            "api": [
                "dotnet", "run",
                "--project", API_PROJECT,
                "--urls", "http://localhost:5000",
            ],
            "tunnel": [
                "cloudflared", "tunnel", "run", "--token", TUNNEL_TOKEN,
            ],
        }

        def _launch():
            for name, cmd in cmds.items():
                if name not in self.procs:
                    try:
                        p = subprocess.Popen(
                            cmd,
                            creationflags=flags,
                            stdout=subprocess.DEVNULL,
                            stderr=subprocess.DEVNULL,
                            stdin=subprocess.DEVNULL,
                        )
                        self.procs[name] = p
                        print(f"[widget] started {name}  pid={p.pid}")
                    except FileNotFoundError:
                        print(f"[widget] command not found for {name}: {cmd[0]}")
                    except Exception as e:
                        print(f"[widget] failed to start {name}: {e}")

            # Give services time to boot before showing as online
            time.sleep(BOOT_SEC)
            self._starting = False

        threading.Thread(target=_launch, daemon=True).start()

    def _stop(self):
        for name, p in list(self.procs.items()):
            try:
                p.terminate()
                print(f"[widget] stopped {name}")
            except Exception:
                pass
        self.procs.clear()
        self.status = "offline"

        if sys.platform == "win32":
            threading.Thread(target=self._kill_ports, daemon=True).start()

    def _kill_ports(self):
        """Force-kill any process still listening on 5000 / 8000."""
        flags = subprocess.CREATE_NO_WINDOW
        for port in (5000, 8000):
            try:
                r = subprocess.run(
                    ["netstat", "-ano"],
                    capture_output=True, text=True, creationflags=flags,
                )
                for line in r.stdout.splitlines():
                    if f":{port} " in line and "LISTENING" in line:
                        pid = line.split()[-1]
                        subprocess.run(
                            ["taskkill", "/F", "/PID", pid],
                            capture_output=True, creationflags=flags,
                        )
            except Exception:
                pass

    # ────────────────────────────────────────────────────────────────────────
    # Drag to reposition
    # ────────────────────────────────────────────────────────────────────────
    def _on_press(self, e):
        self._drag_ox = e.x_root - self.win.winfo_x()
        self._drag_oy = e.y_root - self.win.winfo_y()
        self._moved   = False

    def _on_drag(self, e):
        x = e.x_root - self._drag_ox
        y = e.y_root - self._drag_oy
        self.win.geometry(f"+{x}+{y}")
        self._moved = True

    def _on_release(self, e):
        if not self._moved:
            self._toggle()

    # ────────────────────────────────────────────────────────────────────────
    # Right-click context menu
    # ────────────────────────────────────────────────────────────────────────
    def _on_right_click(self, e):
        m = tk.Menu(
            self.win, tearoff=0,
            bg="#1e1b2e", fg="white",
            activebackground="#6366f1", activeforeground="white",
            font=("Segoe UI", 10), bd=0, relief="flat",
        )
        m.add_command(label="▶  Start all services",  command=self._start)
        m.add_command(label="■  Stop all services",   command=self._stop)
        m.add_separator()
        m.add_command(label=f"🔗  API: {HEALTH_URL}",
                      command=lambda: None, state="disabled")
        m.add_separator()
        m.add_command(label="✕  Quit widget",         command=self.win.destroy)
        try:
            m.tk_popup(e.x_root, e.y_root)
        finally:
            m.grab_release()


if __name__ == "__main__":
    AIWidget()
