import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Mail, Phone, MapPin, Building } from "lucide-react";
import Link from "next/link";

export default async function ClientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Mock Data
    const client = {
        id,
        name: "Innoveo",
        contact: "Jean Dupont",
        email: "jean@innoveo.com",
        phone: "+33 6 12 34 56 78",
        address: "123 Rue de la Tech, 75011 Paris",
        status: "active",
        description: "Start-up spécialisée dans l'IoT agricole.",
        stats: {
            totalRevenue: "15 000 €",
            projectsCount: 2,
            pendingInvoices: "2 500 €",
        },
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/clients">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h2 className="text-3xl font-bold tracking-tight">{client.name}</h2>
                        <Badge variant={client.status === "active" ? "default" : "secondary"}>
                            {client.status === "active" ? "Actif" : "Onboarding"}
                        </Badge>
                    </div>
                    <p className="text-muted-foreground">{client.description}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Éditer</Button>
                    <Button>Nouveau Projet</Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">C.A. Total</CardTitle>
                        <span className="font-bold text-muted-foreground">€</span>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{client.stats.totalRevenue}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Projets Actifs</CardTitle>
                        <Building className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{client.stats.projectsCount}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Factures en attente</CardTitle>
                        <span className="h-4 w-4 rounded-full bg-orange-500/20" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{client.stats.pendingInvoices}</div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Aperçu</TabsTrigger>
                    <TabsTrigger value="projects">Projets</TabsTrigger>
                    <TabsTrigger value="invoices">Factures</TabsTrigger>
                </TabsList>
                <TabsContent value="overview" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Coordonnées</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span>{client.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span>{client.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span>{client.address}</span>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="projects">
                    <Card>
                        <CardHeader>
                            <CardTitle>Projets</CardTitle>
                            <CardDescription>Liste des projets associés à ce client.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Contenu des projets à venir...</p>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="invoices">
                    <Card>
                        <CardHeader>
                            <CardTitle>Factures</CardTitle>
                            <CardDescription>Historique de facturation.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Liste des factures à venir...</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
