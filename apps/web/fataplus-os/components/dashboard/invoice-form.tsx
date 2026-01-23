"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, Trash2, Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";

const invoiceSchema = z.object({
    clientId: z.string().min(1, "Client requis"),
    invoiceNumber: z.string().min(1, "Numéro requis"),
    issueDate: z.date(),
    dueDate: z.date(),
    status: z.enum(["draft", "sent", "paid", "overdue"]),
    items: z.array(
        z.object({
            description: z.string().min(1, "Description requise"),
            quantity: z.coerce.number().min(1, "Min 1"),
            unitPrice: z.coerce.number().min(0, "Min 0"),
            marginJustification: z.string().optional(),
        })
    ).min(1, "Au moins une ligne requise"),
    notes: z.string().optional(),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

// Mock Clients
const clients = [
    { id: "c1", name: "Innoveo" },
    { id: "c2", name: "Riake" },
    { id: "c3", name: "Mochogo" },
];

export function InvoiceForm({ initialData }: { initialData?: Partial<InvoiceFormValues> }) {
    const form = useForm<InvoiceFormValues>({
        resolver: zodResolver(invoiceSchema) as any,
        defaultValues: initialData || {
            invoiceNumber: "INV-2025-",
            issueDate: new Date(),
            dueDate: new Date(),
            status: "draft",
            items: [{ description: "", quantity: 1, unitPrice: 0, marginJustification: "" }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items",
    });

    const watchItems = form.watch("items");
    const totalAmount = watchItems.reduce((sum, item) => {
        return sum + (item.quantity || 0) * (item.unitPrice || 0);
    }, 0);

    function onSubmit(data: InvoiceFormValues) {
        console.log("Form Data:", data);
        // TODO: Submit to API
        alert("Facture sauvegardée (voir console)");
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid gap-6 md:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="clientId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Client</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Sélectionner un client" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {clients.map((client) => (
                                            <SelectItem key={client.id} value={client.id}>
                                                {client.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="invoiceNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Numéro de Facture</FormLabel>
                                <FormControl>
                                    <Input placeholder="INV-2025-001" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="issueDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Date d'émission</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Choisir une date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date > new Date("2100-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="dueDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Date d'échéance</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Choisir une date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Separator />

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Lignes de Facture</h3>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => append({ description: "", quantity: 1, unitPrice: 0, marginJustification: "" })}
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Ajouter une ligne
                        </Button>
                    </div>

                    {fields.map((field, index) => (
                        <Card key={field.id}>
                            <CardContent className="p-4 grid gap-4 md:grid-cols-12 items-start">
                                <div className="md:col-span-4">
                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.description`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs">Description</FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="md:col-span-1">
                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.quantity`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs">Qté</FormLabel>
                                                <FormControl>
                                                    <Input type="number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.unitPrice`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs">Prix Unitaire (€)</FormLabel>
                                                <FormControl>
                                                    <Input type="number" step="0.01" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="md:col-span-4">
                                    <FormField
                                        control={form.control}
                                        name={`items.${index}.marginJustification`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs text-blue-600 font-semibold">Justification Marge (Interne)</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Ex: Sous-traitance 30%..." className="bg-blue-50 border-blue-200" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="md:col-span-1 flex items-end justify-end h-full pb-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="text-red-500 hover:text-red-700"
                                        onClick={() => remove(index)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="flex justify-end items-center gap-4">
                    <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total HT</p>
                        <p className="text-2xl font-bold">{totalAmount.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</p>
                    </div>
                </div>

                <div className="flex justify-end gap-4">
                    <Button variant="outline" type="button">Annuler</Button>
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">Enregistrer la Facture</Button>
                </div>
            </form>
        </Form>
    );
}
