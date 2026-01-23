export type Language = "fr" | "en" | "mg"

export const languages = {
  fr: { label: "Français", flag: "🇫🇷", nativeName: "Français" },
  en: { label: "English", flag: "🇬🇧", nativeName: "English" },
  mg: { label: "Malagasy", flag: "🇲🇬", nativeName: "Malagasy" },
} as const

export const translations = {
  fr: {
    // Navigation
    dashboard: "Tableau de bord",
    invoices: "Factures & Devis",
    projects: "Projets",
    cms: "Contenu / CMS",
    settings: "Paramètres",
    logout: "Déconnexion",
    // Theme
    theme: "Thème",
    light: "Clair",
    dark: "Sombre",
    system: "Système",
    changeTheme: "Changer de thème",
    // Language
    language: "Langue",
    changeLanguage: "Changer de langue",
    // Common
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
    // Navigation
    dashboard: "Dashboard",
    invoices: "Invoices & Quotes",
    projects: "Projects",
    cms: "Content / CMS",
    settings: "Settings",
    logout: "Logout",
    // Theme
    theme: "Theme",
    light: "Light",
    dark: "Dark",
    system: "System",
    changeTheme: "Change theme",
    // Language
    language: "Language",
    changeLanguage: "Change language",
    // Common
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
    // Navigation
    dashboard: "Fandraisana",
    invoices: "Taratasy Fividiana & Tombanasa",
    projects: "Asa",
    cms: "Misiro / CMS",
    settings: "Fikirana",
    logout: "Hiala",
    // Theme
    theme: "Loko",
    light: "Mazava",
    dark: "Maizina",
    system: "Rafitra",
    changeTheme: "Ovay ny loko",
    // Language
    language: "Fiteny",
    changeLanguage: "Ovay ny fiteny",
    // Common
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
} as const

export type TranslationKey = keyof typeof translations.fr

export function getTranslation(lang: Language, key: TranslationKey): string {
  return translations[lang][key] || translations.fr[key]
}
