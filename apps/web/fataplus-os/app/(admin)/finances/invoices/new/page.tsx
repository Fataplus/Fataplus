import { InvoiceForm } from "@/components/dashboard/invoice-form";

export default function NewInvoicePage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Nouvelle Facture</h2>
                <p className="text-muted-foreground">Créez une nouvelle facture ou un devis.</p>
            </div>
            <div className="rounded-md border bg-white p-6">
                <InvoiceForm />
            </div>
        </div>
    );
}
