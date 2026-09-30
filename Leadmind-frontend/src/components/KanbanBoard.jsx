import React from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import LeadCard from "./LeadCard";

const columns = [
  { status: "new", label: "New", color: "#0F6E6E" },
  { status: "contacted", label: "Contacted", color: "#3B82F6" },
  { status: "interested", label: "Interested", color: "#0891B2" },
  { status: "negotiation", label: "Negotiation", color: "#FF7A50" },
  { status: "won", label: "Won", color: "#34D399" },
  { status: "lost", label: "Lost", color: "#EF6461" },
];

function KanbanCard({ lead, ...cardProps }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: lead._id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <div ref={setNodeRef} style={style} className={isDragging ? "opacity-50" : ""}>
      <div className="flex justify-end px-1">
        <button
          {...listeners}
          {...attributes}
          className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 text-xs px-1"
          title="Drag to move"
        >
          ⠿
        </button>
      </div>
      <LeadCard lead={lead} {...cardProps} />
    </div>
  );
}

function KanbanColumn({ status, label, color, leads, ...cardProps }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div className="flex-shrink-0 w-72">
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: color }} />
          <span className="font-display font-semibold text-[13px] text-[var(--color-ink)]">
            {label}
          </span>
        </div>
        <span className="text-[11px] text-[var(--color-slate)]">{leads.length}</span>
      </div>

      <div
        ref={setNodeRef}
        className={`rounded-xl p-2 min-h-[120px] transition-colors ${
          isOver ? "bg-[rgba(15,110,110,0.08)]" : "bg-black/[0.02]"
        }`}
      >
        {leads.map((lead, index) => (
          <KanbanCard key={lead._id} lead={lead} index={index} {...cardProps} />
        ))}
        {leads.length === 0 && (
          <p className="text-[11px] text-slate-400 text-center py-6">No leads</p>
        )}
      </div>
    </div>
  );
}

export default function KanbanBoard({ leads, onEdit, onDelete, onUpdated, onStatusChange, isAdmin }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    const leadId = active.id;
    const newStatus = over.id;
    const lead = leads.find((l) => l._id === leadId);

    if (!lead || lead.status === newStatus) return;

    onStatusChange(leadId, newStatus);
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((col) => (
          <KanbanColumn
            key={col.status}
            status={col.status}
            label={col.label}
            color={col.color}
            leads={leads.filter((l) => l.status === col.status)}
            onEdit={onEdit}
            onDelete={onDelete}
            onUpdated={onUpdated}
            isAdmin={isAdmin}
          />
        ))}
      </div>
    </DndContext>
  );
}