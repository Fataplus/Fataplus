import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock Data
const invoices = [
    { id: "INV-001", client: "Innoveo", date: "2025-12-01", amount: 4500, status: "sent" },
    { id: "INV-002", client: "Riake", date: "2025-12-03", amount: 1200, status: "draft" },
    { id: "INV-003", client: "Mochogo", date: "2025-11-20", amount: 8500, status: "paid" },
];

const statusStyles = {
    draft: "bg-slate-100 text-slate-800",
    sent: "bg-blue-100 text-blue-800",
    paid: "bg-green-100 text-green-800",
    overdue: "bg-red-100 text-red-800",
};

export default function InvoicesPage() {
    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Factures</h2>
                    <p className="text-muted-foreground">Gérez vos devis et factures clients.</p>
                </div>
                <Button asChild className="bg-green-600 hover:bg-green-700">
                    <Link href="/finances/invoices/new">
                        <Plus className="mr-2 h-4 w-4" />
                        Créer une facture
                    </Link>
                </Button>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Numéro</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Montant</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.map((invoice) => (
                            <TableRow key={invoice.id}>
                                <TableCell className="font-medium">{invoice.id}</TableCell>
                                <TableCell>{invoice.client}</TableCell>
                                <TableCell>{invoice.date}</TableCell>
                                <TableCell>{invoice.amount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className={statusStyles[invoice.status as keyof typeof statusStyles]}>
                                        {invoice.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                            <DropdownMenuItem>
                                                <Link href={`/finances/invoices/${invoice.id}`} className="flex w-full">
                                                    Modifier
                                                </Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>Télécharger PDF</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-600">Supprimer</DropdownMenuItem>
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
