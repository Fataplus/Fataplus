import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, DollarSign } from "lucide-react";

// Mock Data (will be replaced by real data later)
const stats = {
    quarterlyRevenue: 12500, // €
    pendingInvoices: 3,
    urgentTasks: 2,
};

const pendingInvoices = [
    { id: "INV-001", client: "Innoveo", amount: 4500, status: "sent", daysOverdue: 2 },
    { id: "INV-002", client: "Riake", amount: 1200, status: "draft", daysOverdue: 0 },
];

const urgentTasks = [
    { id: "T-1", title: "Finalisation Rapport Physique PIC", project: "PIC", tag: "Urgent" },
    { id: "T-2", title: "Maquettes Homepage", project: "Here2Be", tag: "High" },
];

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                    + Nouvelle Facture
                </Button>
            </div>

            {/* KPI Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">C.A. Trimestriel</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.quarterlyRevenue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</div>
                        <p className="text-xs text-muted-foreground">+20.1% par rapport au mois dernier</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Factures en Attente</CardTitle>
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.pendingInvoices}</div>
                        <p className="text-xs text-muted-foreground">Dont 1 en retard (Innoveo)</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tâches Urgentes</CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.urgentTasks}</div>
                        <p className="text-xs text-muted-foreground">Pour aujourd'hui</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">

                {/* Relances Factures */}
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Relances Prioritaires</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {pendingInvoices.map((inv) => (
                                <div key={inv.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">{inv.client}</p>
                                        <p className="text-sm text-muted-foreground">{inv.id}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-sm font-medium">{inv.amount} €</p>
                                            {inv.daysOverdue > 0 && (
                                                <span className="text-xs text-red-500 font-bold">Retard {inv.daysOverdue}j</span>
                                            )}
                                        </div>
                                        <Button size="sm" variant="outline" className="text-xs">
                                            Relancer
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Tâches Urgentes */}
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>À Faire Vite</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {urgentTasks.map((task) => (
                                <div key={task.id} className="flex items-start space-x-4 rounded-md border p-3 bg-secondary/50">
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium leading-none">{task.title}</p>
                                        <div className="flex gap-2 mt-2">
                                            <Badge variant="secondary" className="text-xs bg-white">{task.project}</Badge>
                                            {task.tag === 'Urgent' && <Badge variant="destructive" className="text-xs">Urgent</Badge>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
