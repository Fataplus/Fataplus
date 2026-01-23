"use client"

import Link from "next/link";
import {
    LayoutDashboard,
    Receipt,
    Briefcase,
    FileText,
    Settings,
    LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslation } from "@/hooks/use-language";

const navItemsConfig = [
    { href: "/dashboard", icon: LayoutDashboard, key: "dashboard" as const },
    { href: "/finances/invoices", icon: Receipt, key: "invoices" as const },
    { href: "/projects", icon: Briefcase, key: "projects" as const },
    { href: "/cms", icon: FileText, key: "cms" as const },
];

export function AdminSidebar() {
    const { t } = useTranslation();

    const navItems = navItemsConfig.map(item => ({
        ...item,
        label: t(item.key),
    }));

    return (
        <div className="flex h-full w-64 flex-col border-r bg-card text-card-foreground">
            <div className="p-6">
                <h1 className="text-2xl font-bold tracking-tight text-primary">Fataplus OS</h1>
                <p className="text-xs text-muted-foreground">Admin Workspace</p>
            </div>

            <nav className="flex-1 space-y-1 px-4">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t space-y-2">
                {/* Theme and Language Switchers */}
                <div className="flex items-center justify-center gap-1">
                    <ThemeSwitcher />
                    <LanguageSwitcher />
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                        <Settings className="h-4 w-4" />
                        <span className="sr-only">{t("settings")}</span>
                    </Button>
                </div>

                <Button variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20">
                    <LogOut className="h-4 w-4" />
                    {t("logout")}
                </Button>
            </div>
        </div>
    );
}
