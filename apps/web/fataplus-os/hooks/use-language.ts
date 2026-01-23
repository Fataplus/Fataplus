"use client"

import * as React from "react"
import { usePathname, useRouter } from "next/navigation"
import type { Language } from "@/lib/i18n"

const LANGUAGE_STORAGE_KEY = "fataplus-language"

export function useLanguage() {
  const router = useRouter()
  const pathname = usePathname()
  const [language, setLanguageState] = React.useState<Language>("fr")
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
    // Get language from localStorage or pathname
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language | null
    const fromPath = pathname.match(/^\/(en|mg)/)?.[1] as Language | undefined
    const lang = stored || fromPath || "fr"
    setLanguageState(lang)
  }, [pathname])

  const setLanguage = React.useCallback(
    (lang: Language) => {
      setLanguageState(lang)
      localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)

      // Update URL pathname
      const newPathname = pathname.replace(/^\/(en|mg|fr)/, `/${lang === "fr" ? "" : lang}`)
      router.push(newPathname || "/")

      // Trigger event for other components
      window.dispatchEvent(new CustomEvent("languageChange", { detail: { lang } }))
    },
    [pathname, router]
  )

  return { language, setLanguage, mounted }
}

export function useTranslation(lang?: Language) {
  const { language: currentLang } = useLanguage()
  const targetLang = lang || currentLang

  const t = React.useCallback(
    (key: keyof typeof import("@/lib/i18n").translations.fr): string => {
      // Dynamic import to avoid circular dependencies
      const translations = {
        fr: {
          dashboard: "Tableau de bord",
          invoices: "Factures & Devis",
          projects: "Projets",
          cms: "Contenu / CMS",
          settings: "Paramètres",
          logout: "Déconnexion",
          theme: "Thème",
          light: "Clair",
          dark: "Sombre",
          system: "Système",
          changeTheme: "Changer de thème",
          language: "Langue",
          changeLanguage: "Changer de langue",
          search: "Rechercher...",
          loading: "Chargement...",
          save: "Enregistrer",
          cancel: "Annuler",
          delete: "Supprimer",
          edit: "Modifier",
          create: "Créer",
          confirm: "Confirmer",
          back: "Retour",
          next: "Suivant",
          previous: "Précédent",
        },
        en: {
          dashboard: "Dashboard",
          invoices: "Invoices & Quotes",
          projects: "Projects",
          cms: "Content / CMS",
          settings: "Settings",
          logout: "Logout",
          theme: "Theme",
          light: "Light",
          dark: "Dark",
          system: "System",
          changeTheme: "Change theme",
          language: "Language",
          changeLanguage: "Change language",
          search: "Search...",
          loading: "Loading...",
          save: "Save",
          cancel: "Cancel",
          delete: "Delete",
          edit: "Edit",
          create: "Create",
          confirm: "Confirm",
          back: "Back",
          next: "Next",
          previous: "Previous",
        },
        mg: {
          dashboard: "Fandraisana",
          invoices: "Taratasy Fividiana & Tombanasa",
          projects: "Asa",
          cms: "Misiro / CMS",
          settings: "Fikirana",
          logout: "Hiala",
          theme: "Loko",
          light: "Mazava",
          dark: "Maizina",
          system: "Rafitra",
          changeTheme: "Ovay ny loko",
          language: "Fiteny",
          changeLanguage: "Ovay ny fiteny",
          search: "Karohy...",
          loading: "Manangona...",
          save: "Raiketo",
          cancel: "Foano",
          delete: "Fafana",
          edit: "Ovay",
          create: "Mamorona",
          confirm: "Azo antoka",
          back: "Miverina",
          next: "Manaraka",
          previous: "Teo aloha",
        },
      }
      return translations[targetLang][key as keyof typeof translations.en] || translations.fr[key as keyof typeof translations.fr] || key
    },
    [targetLang]
  )

  return { t, language: targetLang }
}
