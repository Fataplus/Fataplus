# Index - Bank Documents
**Dernière mise à jour:** 2026-01-14
**Source:** MCB (Mauritius Commercial Bank) - Internet Banking

---

## 📋 Vue d'ensemble

Ce dossier contient les relevés bancaires officiels MCB au format PDF et les outils d'extraction de données.

---

## 📄 Documents PDF Originaux (28 fichiers)

**Série principale:** MCB Internet Banking Document (1).pdf à (28).pdf

- Période couverte: 2025
- État: 00001079646~C~BNK_00001079646.pdf

---

## 📁 Sous-dossier: converted_csvs/

Les relevés PDF ont été convertis en CSV pour analyse.

**Voir l'index détaillé:** [`converted_csvs/index.md`](./converted_csvs/index.md)

---

## 🔧 Outils d'Extraction

### 1. extract_bank_data.py
**Taille:** 8,705 octets
**Type:** Script Python
**Description:** Extraction des données bancaires depuis les fichiers PDF

**Fonctionnalités probables:**
- Lecture des PDF MCB
- Extraction des transactions
- Génération de fichiers CSV

---

### 2. dashboard.html
**Taille:** 3,358 octets
**Type:** Interface Web
**Description:** Dashboard de visualisation des données bancaires

---

### 3. data.js
**Taille:** 258,746 octets
**Type:** Données JavaScript
**Description:** Données bancaires extraites au format JSON pour utilisation dans le dashboard

---

### 4. app.js
**Taille:** 10,024 octets
**Type:** Application JavaScript
**Description:** Logique du dashboard bancaire

---

## 📊 Intégration

Les données de ce dossier sont utilisées dans:
- **Consolidated Treasury:** `../Documentation/docs/consolidated_treasury.csv`
- **Rapports financiers:** `../Documentation/docs/rapport_financier_pic.md`
- **Logs de trésorerie:** `../Documentation/docs/logs_tresorerie.md`

---

## 🔗 Références

- **Données converties:** `./converted_csvs/`
- **Rapports financiers:** `../Documentation/docs/`
