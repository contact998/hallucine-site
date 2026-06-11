/**
 * client/src/admin-v2/EmplacementsPanel.tsx
 * Écran « Emplacements » : chaque endroit du site (slot du registre shared/slots.ts)
 * pioche ses images dans la Bibliothèque (MediaPicker).
 *   - slot single  : 1 image (Définir / Changer / Retirer)
 *   - slot gallery : N images, glisser-déposer pour réordonner, ajouter/retirer
 *   - blog         : 1 couverture par article (perEntity)
 */
import { useState, type ReactNode } from "react";
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, Plus, X, Loader2, ImageOff, GripVertical } from "lucide-react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { SLOT_GROUPS } from "@shared/slots";
import { MediaPicker } from "./MediaPicker";
import type { MediaItem } from "../../../drizzle/schema";

/** Asset + position (le serveur ajoute placementId/placementOrder ; cf. server/placements.ts). */
type Placed = MediaItem & { placementId: number; placementOrder: number };

export function EmplacementsPanel() {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(
    () => Object.fromEntries(SLOT_GROUPS.map(g => [g.key, true]))
  );
  const toggle = (key: string) => setCollapsed(p => ({ ...p, [key]: !p[key] }));

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold">Emplacements</h1>
      </div>
      <p className="text-sm text-white/50 mb-6">
        Chaque endroit du site pioche ses images dans la Bibliothèque. Dépliez une page pour gérer ses images.
      </p>

      <div className="space-y-3">
        {SLOT_GROUPS.map(group => (
          <Group key={group.key} title={group.label} open={!collapsed[group.key]} onToggle={() => toggle(group.key)}>
            <div className="space-y-5">
              {group.slots.map(slot => (
                <div key={slot.key}>
                  <p className="text-white/40 text-[11px] uppercase tracking-wider mb-2">
                    {slot.label}{slot.kind === "gallery" ? " — galerie" : ""}
                  </p>
                  {slot.kind === "single"
                    ? <SingleSlot slotKey={slot.key} />
                    : <GallerySlot slotKey={slot.key} />}
                </div>
              ))}
            </div>
          </Group>
        ))}

      </div>
    </>
  );
}

// ─── Groupe repliable ───────────────────────────────────────────────────────────
function Group({ title, open, onToggle, children }: {
  title: string; open: boolean; onToggle: () => void; children: ReactNode;
}) {
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 text-left bg-white/5 hover:bg-white/[0.08] transition-colors"
      >
        <span className="text-white/80 text-sm font-semibold">{title}</span>
        <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="p-4">{children}</div>}
    </div>
  );
}

// ─── Emplacement single (1 image) ───────────────────────────────────────────────
function SingleSlot({ slotKey }: { slotKey: string }) {
  const utils = trpc.useUtils();
  const { data: asset, isLoading } = trpc.placements.single.useQuery({ slotKey });
  const [picking, setPicking] = useState(false);
  const setSingle = trpc.placements.setSingle.useMutation({
    onSuccess: () => { utils.placements.invalidate(); },
    onError: (e) => toast.error(e.message),
  });

  return (
    <div className="flex items-center gap-3">
      <div className="w-28 h-16 rounded-lg overflow-hidden border border-white/10 bg-black/30 flex items-center justify-center shrink-0">
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-white/40" />
          : asset ? <img src={asset.url} alt={asset.alt ?? ""} className="w-full h-full object-cover" />
          : <ImageOff className="w-5 h-5 text-white/20" />}
      </div>
      <button
        onClick={() => setPicking(true)}
        className="text-sm bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-lg px-3 py-1.5"
      >
        {asset ? "Changer" : "Définir"}
      </button>
      {asset && (
        <button
          onClick={() => setSingle.mutate({ slotKey, entityId: null, assetId: null })}
          className="text-sm text-red-400 hover:text-red-300"
        >
          Retirer
        </button>
      )}
      {picking && (
        <MediaPicker
          onClose={() => setPicking(false)}
          onPick={(a) => { setSingle.mutate({ slotKey, entityId: null, assetId: a.id }); setPicking(false); }}
        />
      )}
    </div>
  );
}

// ─── Emplacement galerie (N images ordonnées) ───────────────────────────────────
function GallerySlot({ slotKey }: { slotKey: string }) {
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.placements.bySlot.useQuery({ slotKey });
  const [picking, setPicking] = useState(false);
  const [order, setOrder] = useState<number[] | null>(null);

  const add = trpc.placements.addToGallery.useMutation({
    onSuccess: () => utils.placements.invalidate(),
    onError: (e) => toast.error(e.message),
  });
  const remove = trpc.placements.remove.useMutation({
    onSuccess: () => utils.placements.invalidate(),
    onError: (e) => toast.error(e.message),
  });
  const reorder = trpc.placements.reorder.useMutation({
    onError: (e) => toast.error(e.message),
  });

  const items = (data ?? []) as Placed[];
  const byId = new Map(items.map(a => [a.placementId, a]));
  const ids = order ?? items.map(a => a.placementId);
  const ordered = ids.map(id => byId.get(id)).filter(Boolean) as Placed[];

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  function onDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const cur = ids;
    const next = arrayMove(cur, cur.indexOf(Number(active.id)), cur.indexOf(Number(over.id)));
    setOrder(next);
    reorder.mutate({ placementIds: next }, {
      onSuccess: () => { utils.placements.invalidate(); setOrder(null); },
    });
  }

  return (
    <div>
      {isLoading ? (
        <Loader2 className="w-5 h-5 animate-spin text-white/40" />
      ) : ordered.length === 0 ? (
        <p className="text-white/30 text-xs italic">Aucune image placée.</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={ids} strategy={rectSortingStrategy}>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
              {ordered.map((a) => (
                <SortableThumb
                  key={a.placementId}
                  id={a.placementId}
                  asset={a}
                  onRemove={() => remove.mutate({ placementId: a.placementId })}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
      <button
        onClick={() => setPicking(true)}
        className="mt-3 inline-flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300"
      >
        <Plus className="w-4 h-4" /> Ajouter une image
      </button>
      {picking && (
        <MediaPicker
          onClose={() => setPicking(false)}
          onPick={(a) => { add.mutate({ slotKey, assetId: a.id }); setPicking(false); }}
        />
      )}
    </div>
  );
}

function SortableThumb({ id, asset, onRemove }: { id: number; asset: MediaItem; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
      className="group relative aspect-square rounded-lg overflow-hidden border border-white/10 bg-black/30"
    >
      <img src={asset.url} alt={asset.alt ?? ""} className="w-full h-full object-cover" loading="lazy" />
      <button
        {...attributes}
        {...listeners}
        className="absolute top-1 left-1 p-1 rounded bg-black/60 text-white/70 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100"
        title="Glisser pour réordonner"
      >
        <GripVertical className="w-3.5 h-3.5" />
      </button>
      <button
        onClick={onRemove}
        className="absolute top-1 right-1 p-1 rounded bg-red-500/70 hover:bg-red-500 text-white opacity-0 group-hover:opacity-100"
        title="Retirer"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// Couvertures blog : gérées via /admin/blog (picker → blog_posts.imageUrl, mono-base).
