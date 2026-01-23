"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { languages, type Language } from "@/lib/i18n"
import { useLanguage } from "@/hooks/use-language"
import { useTranslation } from "@/hooks/use-language"

export function LanguageSwitcher() {
  const router = useRouter()
  const pathname = usePathname()
  const { language: currentLang, setLanguage, mounted } = useLanguage()
  const { t } = useTranslation()

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang)
    const newPathname = pathname.replace(/^\/(en|mg|fr)/, `/${lang === "fr" ? "" : lang}`)
    router.push(newPathname || "/")
  }

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9">
        <span className="text-base">🇫🇷</span>
        <span className="sr-only">{t("changeLanguage")}</span>
      </Button>
    )
  }

  const currentFlag = languages[currentLang].flag

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <span className="text-base">{currentFlag}</span>
          <span className="sr-only">{t("changeLanguage")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleLanguageChange("fr")}>
          <span className="mr-2 h-4 w-4 flex items-center justify-center text-base">🇫🇷</span>
          <span>Français</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange("en")}>
          <span className="mr-2 h-4 w-4 flex items-center justify-center text-base">🇬🇧</span>
          <span>English</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleLanguageChange("mg")}>
          <span className="mr-2 h-4 w-4 flex items-center justify-center text-base">🇲🇬</span>
          <span>Malagasy</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
