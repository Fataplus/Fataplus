import { KanbanBoard } from "@/components/dashboard/kanban-board";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function ProjectsPage() {
    return (
        <div className="flex flex-col h-[calc(100vh-2rem)] space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Projets</h2>
                    <p className="text-muted-foreground">
                        Gérez vos projets et tâches en cours.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Nouveau Projet
                    </Button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <KanbanBoard />
            </div>
        </div>
    );
}
