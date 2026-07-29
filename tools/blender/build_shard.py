"""
Genera un CRISTAL/SHARD facetado (cuarzo doble-terminado, irregular) y lo exporta a GLB.
Se ejecuta headless:
  "C:\\Program Files\\Blender Foundation\\Blender 4.5\\blender.exe" --background --python tools/blender/build_shard.py

Diseño (research "El Núcleo"): prisma alargado con biseles irregulares tipo cuarzo,
caras PLANAS (facetas nítidas para que la transmisión refracte con drama), doble punta.
EXPORTA SIN draco (la compresión draco necesita worker blob: → rompe la CSP estricta).
"""
import bpy, bmesh, math, random, os

random.seed(11)

# --- limpiar escena ---------------------------------------------------------
bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete()
for m in list(bpy.data.meshes):
    bpy.data.meshes.remove(m)

# --- construir el cristal con bmesh -----------------------------------------
mesh = bpy.data.meshes.new("Shard")
obj = bpy.data.objects.new("Shard", mesh)
bpy.context.collection.objects.link(obj)

bm = bmesh.new()

SIDES = 8          # OCTÁGONO: 8 lados regulares que se ven DE FRENTE (emblema/rueda)
R = 0.92           # circumradio del octágono (grande → el octágono domina de frente)
BODY = 0.24        # media "profundidad" del cuerpo (queda como eje Z al exportar → gema plana de frente)
TIP_T = 0.62       # punta hacia la cámara (brillo brillante-cut)
TIP_B = 0.62       # punta hacia el fondo (simétrica)
TWIST = 0.0        # sin twist → octágono limpio y regular de frente

top_ring, bot_ring = [], []
for i in range(SIDES):
    a = (i / SIDES) * 2 * math.pi
    rr = R                                             # radio CONSTANTE → octágono regular
    # anillo superior (con twist) e inferior
    at = a + TWIST
    top_ring.append(bm.verts.new((math.cos(at) * rr, BODY, math.sin(at) * rr)))
    rr2 = R
    bot_ring.append(bm.verts.new((math.cos(a) * rr2, -BODY, math.sin(a) * rr2)))

# puntas ligeramente descentradas (asimetría = tallado real)
top_tip = bm.verts.new((random.uniform(-0.12, 0.12), BODY + TIP_T, random.uniform(-0.12, 0.12)))
bot_tip = bm.verts.new((random.uniform(-0.12, 0.12), -BODY - TIP_B, random.uniform(-0.12, 0.12)))

# caras del cuerpo (quads)
for i in range(SIDES):
    j = (i + 1) % SIDES
    bm.faces.new((bot_ring[i], bot_ring[j], top_ring[j], top_ring[i]))
# pirámide superior
for i in range(SIDES):
    j = (i + 1) % SIDES
    bm.faces.new((top_ring[i], top_ring[j], top_tip))
# pirámide inferior
for i in range(SIDES):
    j = (i + 1) % SIDES
    bm.faces.new((bot_ring[j], bot_ring[i], bot_tip))

bm.normal_update()
bm.to_mesh(mesh)
bm.free()

# --- bisel (aristas cortadas) + caras planas --------------------------------
bevel = obj.modifiers.new(name="Bevel", type="BEVEL")
bevel.width = 0.05
bevel.segments = 1
bevel.limit_method = "ANGLE"
bevel.angle_limit = math.radians(20)

for p in mesh.polygons:
    p.use_smooth = False  # facetado nítido, NO suavizado

# centrar el origen
bpy.context.view_layer.objects.active = obj
obj.select_set(True)

# --- exportar GLB (sin draco) -----------------------------------------------
out_dir = os.path.join(os.getcwd(), "public", "models")
os.makedirs(out_dir, exist_ok=True)
out = os.path.join(out_dir, "shard.glb")

bpy.ops.object.select_all(action="DESELECT")
obj.select_set(True)
bpy.context.view_layer.objects.active = obj

bpy.ops.export_scene.gltf(
    filepath=out,
    export_format="GLB",
    use_selection=True,
    export_apply=True,                              # aplica el bisel
    export_draco_mesh_compression_enable=False,     # CSP: nada de draco/worker blob:
    export_yup=True,
)
print("EXPORTED:", out, "faces:", len(mesh.polygons))
