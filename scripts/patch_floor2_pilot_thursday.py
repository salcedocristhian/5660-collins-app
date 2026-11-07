#!/usr/bin/env python3
"""One-time, guarded patch to the existing 5660 floor-2 cinematic pilot.
Only updates carpet timing and the visual pacing of split-shift activity.
Use --check to verify patchability and JS syntax without writing changes.
"""
import argparse
import re
import subprocess
import tempfile
from pathlib import Path

FILE = Path("reconstruction.html")
ORIGINAL_BLOB = "97ef34edf53d91bc1054416b5a32746a92ed3229"
MARKER = "PILOT_THURSDAY_SHIFT_PACING_20261107"

def replace_once(s, old, new, label):
    if s.count(old) != 1:
        raise RuntimeError(f"{label}: expected exactly one original, saw {s.count(old)}")
    return s.replace(old, new, 1)

def replace_regex_once(s, pattern, replacement, label):
    result, n = re.subn(pattern, replacement, s, count=1, flags=re.M)
    if n != 1:
        raise RuntimeError(f"{label}: expected exactly one match, got {n}")
    return result

def patch(src):
    if MARKER in src:
        raise RuntimeError("Pilot timing patch already applied: refusing duplicate")
    digest = subprocess.run(
        ["git", "hash-object", "--stdin"], input=src, text=True,
        capture_output=True, check=True
    ).stdout.strip()
    if digest != ORIGINAL_BLOB:
        raise RuntimeError(
            f"Unrecognized reconstruction source: {digest}; "
            "aborting rather than changing an unrelated/newer version."
        )
    s = src
    s = replace_once(
        s, "// ---- week 1: carpet out, then the whole A side (A1 + A2) ----",
        f"// {MARKER}: first start A-side work; carpet removal remains a tentative Thursday activity.",
        "existing pilot work-order comment"
    )
    s = replace_once(
        s, "const carpet={s:8.9,e:11.5};",
        "const carpet={s:D(3)+9,e:D(3)+15.5}; // Thursday Nov 12, tentative; NEVER Monday at pilot start",
        "actual carpet/worker/geometry time"
    )
    # Use the same start and finish for the visual carpet crew and the physical floor meshes.
    s = replace_regex_once(
        s,
        r"^  P2\('carpet',8\.9,11\.5,9,'carpet',.*?\);\n",
        "",
        "remove incorrect Monday carpet movie step"
    )
    s = replace_once(
        s,
        "P2('gfci',8.5,8.9,6,'plan','Caja eléctrica temporal','Temporary power box'",
        "P2('gfci',8.5,11.5,6,'plan','Preparación eléctrica del piloto','Pilot power preparation'",
        "give Monday setup its existing planned time"
    )
    s = replace_once(
        s, "P2('contain',A('contain').s,16.7,11,'junction'",
        "P2('contain',A('contain').s,A('demo').s,11,'junction'",
        "containment is followed by first-day drywall removal, not the carpet"
    )
    containment = re.compile(r"(^  P2\('contain',A\('contain'\)\.s,A\('demo'\)\.s,11,'junction',.*?\);\n)", re.M)
    if len(containment.findall(s)) != 1:
        raise RuntimeError("Expected a unique containment tour scene")
    first_demo = (
        "  P2('demo1',A('demo').s,16.7,9,'detail:A1',"
        "'Lunes · primer avance de drywall','Monday · first drywall progress',"
        "'SERVPRO inicia el retiro selectivo en A y deja un avance visible antes del relevo de las 5:00 p. m. La película distribuye el avance entre jornadas; no es un porcentaje real de obra.',"
        "'SERVPRO begins selective removal on side A before the 5 PM handover. The film eases visual progress across shifts; it does not report actual field completion.');\n"
    )
    s = containment.sub(lambda m: m.group(1) + first_demo, s, count=1)
    carpet_step = (
        "  P2('carpet',S.carpet.s,S.carpet.e,12,'carpet',"
        "'Jueves 12 tentativo · alfombra y Ram Board','Tentative Thu Nov 12 · carpet and Ram Board',"
        "'El retiro de alfombra se ilustra solamente el jueves 12 de noviembre, de forma tentativa y por secciones. Después se coloca protección temporal de piso. Administración confirmará horario y acceso con al menos 48 horas de aviso.',"
        "'Carpet removal is illustrated on Thursday, November 12 only, tentatively and in sections. Temporary floor protection follows. Management will confirm timing and access with at least 48 hours notice.');\n"
    )
    demo = re.compile(r"(^  P2\('demo',D\(1\)\+7\.9,A\('demo'\)\.e,14,'detail:A1',.*?\);\n)", re.M)
    if len(demo.findall(s)) != 1:
        raise RuntimeError("Expected a unique multi-day drywall-removal scene")
    s = demo.sub(lambda m: m.group(1) + carpet_step, s, count=1)
    s = replace_once(
        s, "P2('scrub',A('clean').s,D(7)+8.6",
        "P2('scrub',Math.max(A('clean').s,S.carpet.e),D(7)+8.6",
        "avoid jumping backward in cinematic time after Thursday carpet scene"
    )
    # Cinematic-only interpolation; source event times and completion status remain unchanged.
    # At an overnight handoff, the first workday reaches at least 50% visually
    # without a discontinuity or a sudden 'reset' on the following morning.
    old_progress = (
        "const prog2=(w,t)=>{if(!w||t<=w.s)return 0;if(t>=w.e)return 1;"
        "const tot=workHrs(w.s,w.e);return tot>0?clamp(workHrs(w.s,t)/tot):"
        "clamp((t-w.s)/(w.e-w.s));};"
    )
    new_progress = (
        "function shiftPaced(w,t){if(!w||t<=w.s)return 0;if(t>=w.e)return 1;"
        "const tot=workHrs(w.s,w.e);if(!(tot>0))return clamp((t-w.s)/(w.e-w.s));"
        "const elapsed=clamp(workHrs(w.s,t)/tot),cut=dayOf(w.s)*24+17;"
        "if(workday(dayOf(w.s))&&w.e>cut+.01&&w.s<cut-.01){"
        "const first=clamp(workHrs(w.s,cut)/tot);"
        "if(first>0&&first<.5)return clamp(elapsed<=first?"
        "elapsed*(.5/first):.5+(elapsed-first)*(.5/(1-first)));}"
        "return elapsed;}"
        "const prog2=(w,t)=>shiftPaced(w,t);"
    )
    s = replace_once(s, old_progress, new_progress, "cinematic secondary-trade progress")
    old_prog = (
        "function prog(z,k,t){const e=evt(z,k);if(!e||t<=e.s)return 0;"
        "if(t>=e.e)return 1;const tot=workHrs(e.s,e.e);"
        "return tot>0?clamp(workHrs(e.s,t)/tot):clamp((t-e.s)/(e.e-e.s));}"
    )
    s = replace_once(
        s, old_prog, "function prog(z,k,t){return shiftPaced(evt(z,k),t);}",
        "cinematic drywall/containment progress"
    )
    if s.count(MARKER) != 1:
        raise RuntimeError("Patch marker not unique")
    if "P2('carpet',8.9,11.5" in s or "const carpet={s:8.9,e:11.5}" in s:
        raise RuntimeError("Old Monday carpet scene was not removed")
    # Ordered guided stops must never rewind (Thursday follows the multi-day drywall scene).
    lo = s.index("function buildSteps(){", s.index("const PILOT=(function(){"))
    hi = s.index("STEPS=st.filter", lo)
    tour = s[lo:hi]
    stops = ["P2('contain'", "P2('demo1'", "P2('h5'", "P2('night'",
             "P2('demo'", "P2('carpet'", "P2('scrub'"]
    positions = [tour.index(key) for key in stops]
    if positions != sorted(positions):
        raise RuntimeError("The guided cinematic scenes are in an incorrect order")
    return s

def syntax_check(html):
    scripts = [
        match.group(2)
        for match in re.finditer(
            r"<script\b([^>]*)>([\s\S]*?)</script>", html, re.I
        )
        if "const PILOT=(function(){" in match.group(2)
    ]
    if len(scripts) != 1:
        raise RuntimeError(f"Expected exactly one complete pilot script, got {len(scripts)}")
    with tempfile.NamedTemporaryFile("w", suffix=".js", encoding="utf-8") as tmp:
        tmp.write(scripts[0])
        tmp.flush()
        subprocess.run(["node", "--check", tmp.name], check=True)
    # Unit-check the shift interpolation as a monotone, continuous visual curve:
    # a 20h multi-day task starting Mon 15:30 reaches 50% at Mon 17:00.
    first_fraction = 1.5 / 20.0
    assert 0 < first_fraction < .5
    def paced(e):
        return e * (.5 / first_fraction) if e <= first_fraction \
               else .5 + (e-first_fraction)*(.5/(1-first_fraction))
    vals = [paced(i / 1000) for i in range(1001)]
    assert abs(paced(first_fraction)-.5) < 1e-10
    assert all(vals[i] <= vals[i+1] for i in range(len(vals)-1))
    assert vals[0] == 0 and vals[-1] == 1

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    args = parser.parse_args()
    original = FILE.read_text(encoding="utf-8")
    new = patch(original)
    syntax_check(new)
    if args.check:
        print("PASS: Thursday Nov 12 carpet, no Monday removal; shift-paced scenes and original 3D script parse.")
    else:
        FILE.write_text(new, encoding="utf-8")
        print("PATCHED: same existing reconstruction model, corrected guided movie timeline.")
