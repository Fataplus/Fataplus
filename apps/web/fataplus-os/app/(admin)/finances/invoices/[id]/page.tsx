import { InvoiceForm } from "@/components/dashboard/invoice-form";

export default async function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    // Mock fetching data based on id
    const mockData = {
        clientId: "c1",
        invoiceNumber: "INV-001",
        issueDate: new Date("2025-12-01"),
        dueDate: new Date("2025-12-15"),
        status: "sent" as const,
        items: [
            { description: "Développement Frontend", quantity: 5, unitPrice: 500, marginJustification: "Dev interne" },
            { description: "Hébergement Cloudflare", quantity: 1, unitPrice: 200, marginJustification: "Marge 100% sur refacturation" },
        ],
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Éditer Facture {id}</h2>
                <p className="text-muted-foreground">Modifiez les détails de la facture.</p>
            </div>
            <div className="rounded-md border bg-white p-6">
                <InvoiceForm initialData={mockData} />
            </div>
        </div>
    );
}
