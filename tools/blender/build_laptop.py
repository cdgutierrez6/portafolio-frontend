"""
Genera un laptop 3D detallado y lo exporta a .glb — SIN comprar ningún modelo.

Correr:
  "C:/Program Files/Blender Foundation/Blender 4.5/blender.exe" --background \
      --python tools/blender/build_laptop.py

Salida: public/models/laptop.glb

Claves de diseño (importan para la web, no para un render):
- La TAPA cuelga de un Empty `LidPivot` situado EXACTAMENTE en la bisagra. En R3F basta
  rotar ese nodo para abrirla/cerrarla con el scroll. Por eso NO se puede pasar el .glb
  por `gltf-transform optimize`: su `prune` borra nodos vacíos y su `join` fusiona la
  tapa con el chasis → adiós animación. Solo `weld` + `quantize`.
- Blender es Z-up y glTF es Y-up: el exportador convierte (X,Y,Z) -> (X,Z,-Y).
  Modelamos la bisagra en +Y (queda en -Z, al fondo) y la tapa levantada en +Z (queda
  en +Y, hacia arriba). Así, en three, rotar LidPivot.x cierra/abre igual que un portátil.
- OJO: bpy.ops.mesh.primitive_cube_add(size=1) crea un cubo de LADO 1 (-0.5..0.5).
  Al escalar por S, las dimensiones finales son S. Por eso `box()` recibe dimensiones
  COMPLETAS, no medias.
"""

import bpy
import math
import os

# ─────────────────────────────── utilidades ───────────────────────────────

def purge():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for coll in (bpy.data.meshes, bpy.data.materials, bpy.data.objects, bpy.data.cameras, bpy.data.lights):
        for block in list(coll):
            coll.remove(block)


def make_mat(name, color, metallic=0.0, roughness=0.5, emission=None, emission_strength=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1.0)
    b.inputs["Metallic"].default_value = metallic
    b.inputs["Roughness"].default_value = roughness
    if emission is not None:
        b.inputs["Emission Color"].default_value = (*emission, 1.0)
        b.inputs["Emission Strength"].default_value = emission_strength
    return m


def box(name, dims, loc, bevel=0.008, segments=2, material=None):
    """dims = dimensiones COMPLETAS (ancho, profundidad, alto)."""
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=loc)
    o = bpy.context.active_object
    o.name = name
    o.scale = dims
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel > 0:
        mod = o.modifiers.new("Bevel", "BEVEL")
        mod.width = bevel
        mod.segments = segments
        mod.limit_method = "ANGLE"
        mod.angle_limit = math.radians(40)
        bpy.ops.object.modifier_apply(modifier=mod.name)
    bpy.ops.object.shade_auto_smooth(angle=math.radians(35))
    if material:
        o.data.materials.append(material)
    return o


def cyl(name, r, depth, loc, rot=(0, 0, 0), verts=24, material=None):
    bpy.ops.mesh.primitive_cylinder_add(radius=r, depth=depth, location=loc, rotation=rot, vertices=verts)
    o = bpy.context.active_object
    o.name = name
    bpy.ops.object.shade_auto_smooth(angle=math.radians(35))
    if material:
        o.data.materials.append(material)
    return o


def join(objs, name):
    bpy.ops.object.select_all(action="DESELECT")
    for o in objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objs[0]
    bpy.ops.object.join()
    j = bpy.context.active_object
    j.name = name
    return j


# ─────────────────────────────── materiales ───────────────────────────────

purge()

ALU     = make_mat("Aluminium", (0.62, 0.66, 0.72), metallic=1.0, roughness=0.24)
DARK    = make_mat("DarkPlastic", (0.025, 0.03, 0.04), metallic=0.0, roughness=0.75)
KEYCAP  = make_mat("KeyCap", (0.05, 0.056, 0.068), metallic=0.15, roughness=0.55)
PAD     = make_mat("Trackpad", (0.50, 0.54, 0.60), metallic=0.9, roughness=0.28)
SCREENM = make_mat("Screen", (0.015, 0.025, 0.06), metallic=0.0, roughness=0.35,
                   emission=(0.05, 0.08, 0.20), emission_strength=1.0)
LOGO    = make_mat("Logo", (0.39, 0.40, 0.95), metallic=0.0, roughness=0.3,
                   emission=(0.39, 0.40, 0.95), emission_strength=5.0)
RUBBER  = make_mat("Rubber", (0.02, 0.02, 0.025), metallic=0.0, roughness=0.95)

# Colores del "código" en pantalla (paleta del portafolio)
CODE_MATS = {
    "indigo":  make_mat("CodeIndigo",  (0.39, 0.40, 0.95), emission=(0.39, 0.40, 0.95), emission_strength=6.0),
    "gray":    make_mat("CodeGray",    (0.58, 0.64, 0.72), emission=(0.58, 0.64, 0.72), emission_strength=4.0),
    "emerald": make_mat("CodeEmerald", (0.06, 0.72, 0.50), emission=(0.06, 0.72, 0.50), emission_strength=6.0),
    "amber":   make_mat("CodeAmber",   (0.96, 0.62, 0.04), emission=(0.96, 0.62, 0.04), emission_strength=6.0),
}

# ─────────────────────────────── medidas ───────────────────────────────
W, D, H = 3.0, 2.1, 0.13        # chasis (dimensiones COMPLETAS)
DECK_Z  = H / 2                 # cara superior del chasis
HINGE_Y = D / 2 - 0.04          # bisagra al fondo  (+Y Blender -> -Z three)
HINGE_Z = DECK_Z - 0.02

chassis_parts = []

# ── Chasis ──
chassis_parts.append(box("Base", (W, D, H), (0, 0, 0), bevel=0.03, segments=3, material=ALU))

# ── Bandeja rebajada del teclado ──
chassis_parts.append(box("Deck", (2.74, 1.02, 0.012), (0, 0.22, DECK_Z - 0.004), bevel=0.006, material=DARK))

# ── Teclas: rejilla real 14x5, unidas en un solo mesh ──
keys = []
cols, rows = 14, 5
kw, kd, gap = 0.163, 0.158, 0.024
tw = cols * kw + (cols - 1) * gap
td = rows * kd + (rows - 1) * gap
x0 = -tw / 2 + kw / 2
y0 = 0.22 - td / 2 + kd / 2
for r in range(rows):
    for c in range(cols):
        keys.append(box(
            f"K{r}_{c}", (kw, kd, 0.022),
            (x0 + c * (kw + gap), y0 + r * (kd + gap), DECK_Z + 0.008),
            bevel=0.009, segments=2, material=KEYCAP,
        ))
keys_obj = join(keys, "Keys")

# ── Trackpad ──
trackpad = box("Trackpad", (1.0, 0.62, 0.01), (0, -0.62, DECK_Z - 0.002), bevel=0.008, material=PAD)

# ── Bisagra ──
chassis_parts.append(cyl("Hinge", 0.042, W - 0.22, (0, HINGE_Y, HINGE_Z),
                         rot=(0, math.radians(90), 0), verts=20, material=ALU))

# ── Patas ──
for i, (fx, fy) in enumerate([(-1.28, -0.88), (1.28, -0.88), (-1.28, 0.88), (1.28, 0.88)]):
    chassis_parts.append(cyl(f"Foot{i}", 0.055, 0.018, (fx, fy, -H / 2 - 0.008), verts=12, material=RUBBER))

# ── Puertos laterales ──
for i, py in enumerate([-0.45, -0.05, 0.35]):
    chassis_parts.append(box(f"Port{i}", (0.03, 0.16, 0.045), (-W / 2 - 0.004, py, 0.0), bevel=0.005, material=DARK))

chassis = join(chassis_parts, "Chassis")

# ─────────────────────── TAPA (pivota en la bisagra) ───────────────────────
bpy.ops.object.empty_add(type="PLAIN_AXES", location=(0, HINGE_Y, HINGE_Z))
pivot = bpy.context.active_object
pivot.name = "LidPivot"

LID_H   = 1.92
LID_TH  = 0.075                  # grosor de la tapa
LID_CZ  = HINGE_Z + LID_H / 2    # centro de la tapa, levantada en +Z
FRONT_Y = HINGE_Y - LID_TH / 2   # cara frontal de la tapa (mira al usuario, -Y)
BACK_Y  = HINGE_Y + LID_TH / 2   # cara trasera

lid_parts = [
    box("LidShell", (W, LID_TH, LID_H), (0, HINGE_Y, LID_CZ), bevel=0.022, segments=3, material=ALU),
    box("Bezel", (2.90, 0.008, 1.84), (0, FRONT_Y - 0.004, LID_CZ), bevel=0.005, material=DARK),
    cyl("Cam", 0.020, 0.006, (0, FRONT_Y - 0.010, LID_CZ + 0.86),
        rot=(math.radians(90), 0, 0), verts=12, material=DARK),
]
lid_shell = join(lid_parts, "LidShell")

# Pantalla (plano emisivo oscuro)
SCR_Y = FRONT_Y - 0.010
bpy.ops.mesh.primitive_plane_add(size=1.0, location=(0, SCR_Y, LID_CZ), rotation=(math.radians(90), 0, 0))
screen = bpy.context.active_object
screen.name = "Screen"
screen.scale = (2.74, 1.68, 1.0)
bpy.ops.object.transform_apply(scale=True)
screen.data.materials.append(SCREENM)

# ── "Código" en pantalla: barras emisivas (agrupadas por color -> 4 meshes) ──
# (ancho, sangría, color)
CODE_LINES = [
    (0.85, 0.00, "indigo"), (1.55, 0.18, "gray"),    (1.15, 0.18, "emerald"),
    (1.85, 0.36, "gray"),   (0.95, 0.36, "amber"),   (1.45, 0.18, "gray"),
    (0.55, 0.00, "indigo"), (1.70, 0.18, "gray"),    (1.05, 0.36, "emerald"),
    (0.70, 0.00, "indigo"),
]
by_color: dict[str, list] = {k: [] for k in CODE_MATS}
LINE_Y = SCR_Y - 0.004
for i, (lw, indent, col) in enumerate(CODE_LINES):
    bpy.ops.mesh.primitive_plane_add(
        size=1.0,
        location=(-1.13 + lw / 2 + indent, LINE_Y, LID_CZ + 0.64 - i * 0.132),
        rotation=(math.radians(90), 0, 0),
    )
    o = bpy.context.active_object
    o.name = f"Code{i}"
    o.scale = (lw, 0.036, 1.0)
    bpy.ops.object.transform_apply(scale=True)
    o.data.materials.append(CODE_MATS[col])
    by_color[col].append(o)

code_objs = [join(objs, f"Code_{col}") for col, objs in by_color.items() if objs]

# Logo emisivo en la carcasa TRASERA (para que el reverso no quede muerto al girar)
logo = cyl("Logo", 0.19, 0.004, (0, BACK_Y + 0.002, LID_CZ),
           rot=(math.radians(90), 0, 0), verts=32, material=LOGO)

# Emparentar todo lo de la tapa al pivote (sin mover la geometría)
for o in [lid_shell, screen, logo, *code_objs]:
    o.parent = pivot
    o.matrix_parent_inverse = pivot.matrix_world.inverted()

# ─────────────────────────────── exportar ───────────────────────────────

root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
out_dir = os.path.join(root, "public", "models")
os.makedirs(out_dir, exist_ok=True)
out = os.path.join(out_dir, "laptop.glb")

bpy.ops.object.select_all(action="SELECT")
bpy.ops.export_scene.gltf(
    filepath=out,
    export_format="GLB",
    export_apply=True,
    export_yup=True,
    export_materials="EXPORT",
    export_cameras=False,
    export_lights=False,
    use_selection=True,
)

print(f"\n[OK] exportado: {out}")
print(f"[OK] tamano: {os.path.getsize(out)/1024:.0f} KB")
