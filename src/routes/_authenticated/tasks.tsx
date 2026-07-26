import { createFileRoute } from "@tanstack/react-router";
import { TasksWidget } from "@/components/widgets/tasks-widget";

export const Route = createFileRoute("/_authenticated/tasks")({
  component: TasksPage,
  head: () => ({ meta: [{ title: "Tasks — Lumen" }] }),
});

function TasksPage() {
  return (
    <div className="mx-auto max-w-4xl p-4 md:p-8">
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold tracking-tight">Tasks</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add, complete, and organize everything you need to get done.
        </p>
      </div>
      <TasksWidget />
    </div>
  );
}
