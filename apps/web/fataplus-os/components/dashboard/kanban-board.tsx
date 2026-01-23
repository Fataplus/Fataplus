"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarDays, MoreHorizontal, Plus } from "lucide-react";

// Mock Data
const TASKS = [
    {
        id: "t1",
        title: "Refonte Site Web Innoveo",
        client: "Innoveo",
        status: "in-progress",
        tag: "Dev",
        dueDate: "2025-12-20",
        assignee: "JD",
    },
    {
        id: "t2",
        title: "Audit SEO Allvia",
        client: "Allvia",
        status: "todo",
        tag: "Marketing",
        dueDate: "2025-12-15",
        assignee: "AB",
    },
    {
        id: "t3",
        title: "Campagne Social Media Q1",
        client: "Mochogo",
        status: "done",
        tag: "Marketing",
        dueDate: "2025-11-30",
        assignee: "JD",
    },
    {
        id: "t4",
        title: "Design System Fataplus",
        client: "Interne",
        status: "in-progress",
        tag: "Design",
        dueDate: "2025-12-25",
        assignee: "AB",
    },
    {
        id: "t5",
        title: "Migration Cloudflare",
        client: "Innoveo",
        status: "todo",
        tag: "Devops",
        dueDate: "2026-01-10",
        assignee: "JD",
    },
];

const COLUMNS = [
    { id: "todo", title: "À faire", color: "bg-slate-100 border-slate-200" },
    { id: "in-progress", title: "En cours", color: "bg-blue-50 border-blue-100" },
    { id: "review", title: "Validation", color: "bg-orange-50 border-orange-100" },
    { id: "done", title: "Terminé", color: "bg-green-50 border-green-100" },
];

export function KanbanBoard() {
    return (
        <div className="h-full overflow-x-auto pb-4">
            <div className="flex h-full gap-6 min-w-[1000px]">
                {COLUMNS.map((col) => {
                    const tasks = TASKS.filter((t) => t.status === col.id);
                    return (
                        <div key={col.id} className="flex-1 min-w-[300px] flex flex-col gap-4">
                            <div className={`flex items-center justify-between p-3 rounded-lg border ${col.color}`}>
                                <h3 className="font-semibold text-sm">{col.title}</h3>
                                <Badge variant="secondary" className="bg-white/50">{tasks.length}</Badge>
                            </div>

                            <div className="flex flex-col gap-3">
                                {tasks.map((task) => (
                                    <Card key={task.id} className="cursor-pointer hover:shadow-md transition-shadow">
                                        <CardHeader className="p-4 pb-2 space-y-2">
                                            <div className="flex justify-between items-start">
                                                <Badge variant="outline" className="text-xs font-normal">
                                                    {task.client}
                                                </Badge>
                                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <CardTitle className="text-sm font-medium leading-tight">
                                                {task.title}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="p-4 pt-2 pb-3">
                                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                <Badge variant="secondary" className="text-[10px] px-1.5 h-5">
                                                    {task.tag}
                                                </Badge>
                                            </div>
                                        </CardContent>
                                        <CardFooter className="p-4 pt-0 flex justify-between items-center">
                                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                <CalendarDays className="h-3 w-3" />
                                                <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                                            </div>
                                            <Avatar className="h-6 w-6 text-[10px]">
                                                <AvatarFallback className="bg-primary/10 text-primary">
                                                    {task.assignee}
                                                </AvatarFallback>
                                            </Avatar>
                                        </CardFooter>
                                    </Card>
                                ))}

                                <Button variant="ghost" className="w-full justify-start text-muted-foreground text-sm h-9 border border-dashed">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Ajouter une tâche
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
