"use client";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock Data
const CLIENTS = [
    {
        id: "c1",
        name: "Innoveo",
        contact: "Jean Dupont",
        email: "jean@innoveo.com",
        status: "active",
        projects: 2,
        totalRevenue: "15 000 €",
    },
    {
        id: "c2",
        name: "Allvia",
        contact: "Alice Martin",
        email: "alice@allvia.fr",
        status: "onboarding",
        projects: 1,
        totalRevenue: "4 500 €",
    },
    {
        id: "c3",
        name: "Mochogo",
        contact: "Pierre Durand",
        email: "pierre@mochogo.com",
        status: "active",
        projects: 3,
        totalRevenue: "22 000 €",
    },
];

export default function ClientsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Clients</h2>
                    <p className="text-muted-foreground">
                        Gérez votre portefeuille client.
                    </p>
                </div>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Nouveau Client
                </Button>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Entreprise</TableHead>
                            <TableHead>Contact</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead className="text-right">Projets</TableHead>
                            <TableHead className="text-right">C.A. Total</TableHead>
                            <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {CLIENTS.map((client) => (
                            <TableRow key={client.id}>
                                <TableCell className="font-medium">
                                    <Link href={`/clients/${client.id}`} className="hover:underline">
                                        {client.name}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-sm">{client.contact}</span>
                                        <span className="text-xs text-muted-foreground">{client.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Badge variant={client.status === "active" ? "default" : "secondary"}>
                                        {client.status === "active" ? "Actif" : "Onboarding"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">{client.projects}</TableCell>
                                <TableCell className="text-right">{client.totalRevenue}</TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem>Voir détails</DropdownMenuItem>
                                            <DropdownMenuItem>Éditer</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-600">Archiver</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
