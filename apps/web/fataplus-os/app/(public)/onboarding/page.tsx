"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const onboardingSchema = z.object({
    companyName: z.string().min(2, "Nom de l'entreprise requis"),
    contactName: z.string().min(2, "Votre nom requis"),
    email: z.string().email("Email invalide"),
    projectType: z.string().min(2, "Type de projet requis"),
    description: z.string().min(20, "Décrivez votre projet en quelques phrases"),
    budget: z.string().optional(),
});

type OnboardingValues = z.infer<typeof onboardingSchema>;

export default function OnboardingPage() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedBrief, setGeneratedBrief] = useState<string | null>(null);

    const form = useForm<OnboardingValues>({
        resolver: zodResolver(onboardingSchema) as any,
        defaultValues: {
            companyName: "",
            contactName: "",
            email: "",
            projectType: "",
            description: "",
            budget: "",
        },
    });

    async function onSubmit(data: OnboardingValues) {
        setIsGenerating(true);
        try {
            const response = await fetch("/api/onboarding/generate-brief", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const result = await response.json() as { brief: string };
            setGeneratedBrief(result.brief);
        } catch (error) {
            console.error("Error generating brief:", error);
        } finally {
            setIsGenerating(false);
        }
    }

    return (
        <div className="container mx-auto max-w-3xl py-12 px-4">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight mb-4">Bienvenue chez Fataplus</h1>
                <p className="text-lg text-muted-foreground">
                    Parlons de votre projet. Notre IA va nous aider à structurer vos besoins.
                </p>
            </div>

            <div className="grid gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Détails du Projet</CardTitle>
                        <CardDescription>Remplissez ce formulaire pour commencer.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="companyName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Entreprise</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Acme Inc." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="contactName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Contact</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Jean Dupont" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input type="email" placeholder="jean@acme.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="projectType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Type de Projet</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Site Vitrine, App Mobile, ERP..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Décrivez vos objectifs, vos cibles, et les fonctionnalités clés..."
                                                    className="min-h-[120px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isGenerating}>
                                    {isGenerating ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Génération du Brief en cours...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="mr-2 h-4 w-4" />
                                            Générer mon Brief Projet
                                        </>
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {generatedBrief && (
                    <Card className="border-green-200 bg-green-50/50">
                        <CardHeader>
                            <CardTitle className="text-green-800 flex items-center gap-2">
                                <Sparkles className="h-5 w-5" />
                                Brief Généré par IA
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="prose prose-sm max-w-none text-green-900 whitespace-pre-wrap">
                                {generatedBrief}
                            </div>
                            <div className="mt-6 flex justify-end">
                                <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-100">
                                    Valider et Envoyer
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
