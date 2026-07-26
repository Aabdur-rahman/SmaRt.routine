import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Plus, Pin, Trash2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/notes")({
  component: NotesPage,
  head: () => ({ meta: [{ title: "Notes — Lumen" }] }),
});

function NotesPage() {
  const qc = useQueryClient();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const { data: notes = [] } = useQuery({
    queryKey: ["notes"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", user.id)
        .order("pinned", { ascending: false })
        .order("updated_at", { ascending: false });
      return data ?? [];
    },
  });

  const selected = notes.find((n: any) => n.id === selectedId) ?? null;

  useEffect(() => {
    if (selected) {
      setTitle(selected.title);
      setContent(selected.content ?? "");
    }
  }, [selectedId]);

  const create = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in");
      const { data, error } = await supabase.from("notes")
        .insert({ user_id: user.id, title: "Untitled", content: "" })
        .select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: (n: any) => {
      qc.invalidateQueries({ queryKey: ["notes"] });
      setSelectedId(n.id);
    },
  });

  const save = useMutation({
    mutationFn: async () => {
      if (!selectedId) return;
      const { error } = await supabase.from("notes")
        .update({ title: title || "Untitled", content })
        .eq("id", selectedId);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }),
  });

  const togglePin = useMutation({
    mutationFn: async (n: any) => {
      const { error } = await supabase.from("notes").update({ pinned: !n.pinned }).eq("id", n.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notes"] }),
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("notes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      setSelectedId(null);
      qc.invalidateQueries({ queryKey: ["notes"] });
      toast.success("Note deleted");
    },
  });

  return (
    <div className="mx-auto max-w-6xl p-4 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Notes</h1>
          <p className="mt-1 text-sm text-muted-foreground">Capture ideas the moment they arrive.</p>
        </div>
        <button
          onClick={() => create.mutate()}
          className="inline-flex items-center gap-2 rounded-full gradient-brand px-4 py-2 text-sm font-medium text-primary-foreground shadow-glow"
        >
          {create.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          New note
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[280px,1fr]">
        <div className="glass rounded-3xl p-3">
          <div className="max-h-[70dvh] space-y-1 overflow-y-auto">
            {notes.length === 0 && (
              <div className="rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                No notes yet.
              </div>
            )}
            {notes.map((n: any) => (
              <button
                key={n.id}
                onClick={() => setSelectedId(n.id)}
                className={`group flex w-full items-start gap-2 rounded-xl p-3 text-left transition ${
                  selectedId === n.id ? "bg-primary/10 border border-primary" : "border border-transparent hover:bg-accent"
                }`}
              >
                {n.pinned && <Pin className="mt-0.5 h-3 w-3 shrink-0 text-accent" />}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{n.title}</div>
                  <div className="mt-0.5 truncate text-xs text-muted-foreground">
                    {n.content?.slice(0, 60) || "Empty"}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="glass rounded-3xl p-6">
          {selected ? (
            <div className="flex h-full flex-col">
              <div className="mb-3 flex items-center gap-2">
                <button
                  onClick={() => togglePin.mutate(selected)}
                  className="rounded-lg p-2 text-muted-foreground hover:bg-accent"
                  aria-label="Toggle pin"
                >
                  <Pin className={`h-4 w-4 ${selected.pinned ? "text-accent" : ""}`} />
                </button>
                <button
                  onClick={() => remove.mutate(selected.id)}
                  className="ml-auto rounded-lg p-2 text-muted-foreground hover:text-destructive hover:bg-accent"
                  aria-label="Delete note"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => save.mutate()}
                placeholder="Title"
                className="w-full border-none bg-transparent font-display text-2xl font-bold outline-none"
              />
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onBlur={() => save.mutate()}
                placeholder="Start writing..."
                className="mt-3 min-h-[50dvh] w-full flex-1 resize-none border-none bg-transparent text-sm outline-none"
              />
            </div>
          ) : (
            <div className="grid min-h-[50dvh] place-items-center text-center text-sm text-muted-foreground">
              Select a note or create a new one.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
