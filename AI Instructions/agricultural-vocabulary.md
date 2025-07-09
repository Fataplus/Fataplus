# FATAPLUS Agricultural Vocabulary Guide

## 🌾 Vocabulaire Agricole Malgache-Français

Ce guide compile le vocabulaire agricole essentiel pour l'entraînement de FATAPLUS AI, incluant les termes techniques, les noms de cultures, et les expressions locales.

## 🌱 Cultures Principales

### Céréales / Varimbary

```yaml
cereales:
  riz:
    malagasy: ["vary", "varimbary"]
    varietes:
      - "vary fotsy" (riz blanc)
      - "vary mena" (riz rouge)
      - "vary mainty" (riz noir)
    techniques: ["fambolena vary", "tanimbary"]

  mais:
    malagasy: ["katsaka"]
    varietes:
      - "katsaka fotsy" (maïs blanc)
      - "katsaka mavo" (maïs jaune)

  orge:
    malagasy: ["orge"]
    usage: "cultures_altitude"
```

### Légumineuses / Tsaramaso

```yaml
legumineuses:
  haricot:
    malagasy: ["tsaramaso"]
    varietes:
      - "tsaramaso fotsy" (haricot blanc)
      - "tsaramaso mena" (haricot rouge)
      - "tsaramaso mainty" (haricot noir)

  arachide:
    malagasy: ["voanjo"]
    synonymes: ["cacahuète"]

  pois:
    malagasy: ["petits_pois"]
    varietes: ["pois_du_cap", "pois_cajan"]

  lentille:
    malagasy: ["lentille"]
    usage: "culture_fraiche"
```

### Tubercules / Ovy

```yaml
tubercules:
  manioc:
    malagasy: ["mangahazo"]
    varietes:
      - "mangahazo mena" (manioc rouge)
      - "mangahazo fotsy" (manioc blanc)

  patate_douce:
    malagasy: ["ovy"]
    varietes:
      - "ovy mena" (patate rouge)
      - "ovy fotsy" (patate blanche)

  pomme_terre:
    malagasy: ["ovy gasy", "pomme de terre"]
    regions: ["hautes_terres"]

  igname:
    malagasy: ["angona"]
    usage: "culture_traditionnelle"
```

### Épices / Zava-manitra

```yaml
epices:
  vanille:
    malagasy: ["vanila"]
    regions: ["sambava", "antalaha", "vohémar"]
    qualites: ["bourbon", "tahitensis"]

  girofle:
    malagasy: ["jirofo"]
    regions: ["sainte_marie", "fenerive"]
    parties: ["boutons", "feuilles", "tiges"]

  cannelle:
    malagasy: ["kanela"]
    usage: "epice_medicinale"

  poivre:
    malagasy: ["dipoavatra"]
    varietes: ["noir", "blanc", "vert"]
```

### Fruits / Voankazo

```yaml
fruits:
  litchi:
    malagasy: ["letchi"]
    regions: ["tamatave", "fenerive"]
    saison: "novembre_janvier"

  mangue:
    malagasy: ["manga"]
    varietes: ["manga bobo", "manga vert"]

  banane:
    malagasy: ["akondro"]
    varietes:
      - "akondro gasy" (banane locale)
      - "akondro vazaha" (banane plantain)

  ananas:
    malagasy: ["mananasy"]
    regions: ["côte_est"]

  coco:
    malagasy: ["voanio"]
    produits: ["coprah", "huile", "lait"]
```

### Légumes / Anana

```yaml
legumes:
  tomate:
    malagasy: ["voatabia"]
    varietes: ["cerise", "roma", "beefsteak"]

  oignon:
    malagasy: ["tavoahangy"]
    varietes: ["rouge", "blanc", "jaune"]

  carotte:
    malagasy: ["karoty"]
    usage: "culture_fraiche"

  salade:
    malagasy: ["salady"]
    varietes: ["laitue", "chicorée"]

  courge:
    malagasy: ["voatavo"]
    varietes: ["butternut", "potiron"]

  choux:
    malagasy: ["laisoa"]
    varietes: ["pomme", "chinois", "fleur"]
```

## 🛠️ Techniques Agricoles

### Préparation du Sol / Fikarakarana ny Tany

```yaml
preparation_sol:
  labour:
    malagasy: ["fiasana"]
    outils: ["angady", "tracteur"]

  hersage:
    malagasy: ["fanamafisana"]
    objectif: "ameublissement"

  billonnage:
    malagasy: ["fanaovana billon"]
    cultures: ["patate", "manioc"]

  compostage:
    malagasy: ["fanaovana kompost"]
    matieres: ["fako organika"]
```

### Semis et Plantation / Famafazana

```yaml
semis_plantation:
  semis_direct:
    malagasy: ["famafazana mivantana"]
    cultures: ["mais", "haricot"]

  repiquage:
    malagasy: ["famindrana"]
    cultures: ["riz", "tomate"]

  bouturage:
    malagasy: ["fampitomboana"]
    cultures: ["manioc", "patate"]

  greffage:
    malagasy: ["fampifangaroana"]
    cultures: ["fruits", "vanille"]
```

### Irrigation / Fanondrahana

```yaml
irrigation:
  irrigation_gravitaire:
    malagasy: ["fanondrahana"]
    systeme: "traditionnel"

  aspersion:
    malagasy: ["fampitsofahana"]
    equipement: "sprinkler"

  goutte_goutte:
    malagasy: ["vongan-drano"]
    avantage: "economie_eau"

  submersion:
    malagasy: ["fanarona"]
    culture: "riz"
```

### Fertilisation / Famafazana Zezika

```yaml
fertilisation:
  engrais_organique:
    malagasy: ["zezika voajanahary"]
    types: ["fumier", "compost", "engrais_vert"]

  engrais_mineraux:
    malagasy: ["zezika simika"]
    types: ["NPK", "uree", "phosphate"]

  amendement:
    malagasy: ["fanatsarana tany"]
    types: ["chaux", "gypse"]

  engrais_foliaire:
    malagasy: ["zezika amin'ny ravina"]
    application: "pulverisation"
```

## 🐛 Problèmes et Maladies

### Ravageurs / Bibikely Manimba

```yaml
ravageurs:
  criquets:
    malagasy: ["valala"]
    degats: "defoliation"
    lutte: ["biologique", "chimique"]

  chenilles:
    malagasy: ["kankana"]
    cultures: ["mais", "riz"]

  pucerons:
    malagasy: ["kankana kely"]
    transmission: "virus"

  cochenilles:
    malagasy: ["bibikely mipetaka"]
    cultures: ["fruits", "vanille"]

  rats:
    malagasy: ["voalavo"]
    degats: "grains"

  oiseaux:
    malagasy: ["vorona"]
    protection: "filets"
```

### Maladies / Aretina

```yaml
maladies:
  mildiou:
    malagasy: ["holatra"]
    symptomes: "taches_jaunes"

  rouille:
    malagasy: ["haratsy"]
    couleur: "orange_rouge"

  fusariose:
    malagasy: ["maladie fusarium"]
    symptomes: "fletrissement"

  anthracnose:
    malagasy: ["tache_noire"]
    fruits: "pourris"

  virus_mosaique:
    malagasy: ["virus mosaic"]
    transmission: "pucerons"
```

### Symptômes / Famantarana

```yaml
symptomes:
  jaunissement:
    malagasy: ["manjary mavo"]
    causes: ["carence", "maladie"]

  fletrissement:
    malagasy: ["malazo"]
    causes: ["secheresse", "maladie"]

  taches:
    malagasy: ["pentina"]
    types: ["brunes", "jaunes", "noires"]

  pourriture:
    malagasy: ["lo"]
    parties: ["racines", "fruits", "tiges"]

  deformation:
    malagasy: ["miova endrika"]
    virus: "frequent"
```

## 🌦️ Climat et Saisons

### Saisons / Fotoana

```yaml
saisons:
  saison_pluies:
    malagasy: ["fahavaratra"]
    periode: "novembre_avril"
    activites: ["semis", "repiquage"]

  saison_seche:
    malagasy: ["ririnina"]
    periode: "mai_octobre"
    activites: ["recolte", "preparation"]

  inter_saison:
    malagasy: ["fotoam-pifandimby"]
    activites: ["entretien"]
```

### Phénomènes Climatiques / Toetr'andro

```yaml
phenomenes:
  cyclone:
    malagasy: ["rivo-doza"]
    saison: "janvier_mars"
    protection: "abris"

  secheresse:
    malagasy: ["haintany"]
    impacts: "stress_hydrique"

  inondation:
    malagasy: ["tondra-drano"]
    consequences: "pourriture_racines"

  grele:
    malagasy: ["havandra"]
    degats: "blessures_plantes"

  gel:
    malagasy: ["fanala"]
    regions: "hautes_terres"
```

## 🏞️ Géographie et Régions

### Régions / Faritra

```yaml
regions:
  antananarivo:
    climat: "tropical_altitude"
    cultures: ["riz", "legumes", "fruits_temperes"]
    defis: ["erosion", "gel"]

  toamasina:
    climat: "tropical_humide"
    cultures: ["vanille", "girofle", "litchi"]
    defis: ["cyclones", "humidite"]

  fianarantsoa:
    climat: "tropical_montagne"
    cultures: ["cafe", "the", "fruits"]
    defis: ["altitude", "froid"]

  mahajanga:
    climat: "tropical_sec"
    cultures: ["coton", "arachide", "manioc"]
    defis: ["secheresse"]

  toliara:
    climat: "semi_aride"
    cultures: ["mais", "manioc", "sesame"]
    defis: ["aridite", "vents"]

  antsiranana:
    climat: "tropical_nord"
    cultures: ["cacao", "ylang_ylang", "vanille"]
    defis: ["cyclones"]
```

### Types de Sol / Karazana Tany

```yaml
sols:
  tanety:
    description: "collines_lateritiques"
    cultures: ["manioc", "mais"]

  baiboho:
    description: "alluvions_fertiles"
    cultures: ["riz", "legumes"]

  tanimbary:
    description: "rizieres_amenagees"
    culture: "riz_irrigue"

  tany_mainty:
    description: "terre_noire_fertile"
    regions: "hautes_terres"

  tany_mena:
    description: "terre_rouge_laterite"
    drainage: "bon"
```

## 🛠️ Outils et Équipements

### Outils Traditionnels / Fitaovana Gasy

```yaml
outils_traditionnels:
  angady:
    usage: "bechage_labour"
    materiau: "fer_bois"

  fangady:
    usage: "desherbage"
    taille: "petite"

  antsy:
    usage: "coupe_recolte"
    types: ["droit", "courbe"]

  harona:
    usage: "transport_recolte"
    materiau: "bambou_rotin"

  vary_bary:
    usage: "battage_riz"
    technique: "traditionnelle"
```

### Équipements Modernes / Fitaovana Maoderina

```yaml
equipements_modernes:
  tracteur:
    malagasy: ["tracteur"]
    usage: "labour_transport"

  motoculteur:
    malagasy: ["motoculteur"]
    usage: "petites_parcelles"

  pulverisateur:
    malagasy: ["famafazana fanafody"]
    usage: "traitement"

  semoir:
    malagasy: ["milina famafazana"]
    precision: "espacement_regulier"

  moissonneuse:
    malagasy: ["milina fijinjana"]
    culture: "cereales"
```

## 📊 Unités et Mesures

### Mesures Traditionnelles / Fandrefesana Gasy

```yaml
mesures_traditionnelles:
  vary:
    kapoaka: "250ml riz"
    farihy: "seau riz"
    lasaka: "grand panier"

  surfaces:
    tanimbary: "parcelle_riz"
    tanim-bary: "riziere_familiale"

  distances:
    dian-tongotra: "distance_marche"
    ela-dia: "voyage_long"
```

### Mesures Modernes / Fandrefesana Maoderina

```yaml
mesures_modernes:
  poids:
    kg: "kilogramme"
    tonne: "1000_kg"
    quintal: "100_kg"

  surfaces:
    hectare: "10000_m2"
    are: "100_m2"
    m2: "metre_carre"

  volumes:
    litre: "unite_liquide"
    m3: "metre_cube"

  rendements:
    "tonne/hectare": "productivite"
    "kg/are": "petite_parcelle"
```

---

**Version :** 1.0  
**Dernière mise à jour :** Décembre 2024  
**Prochaine révision :** Mars 2025

_Vocabulaire agricole complet pour l'entraînement de FATAPLUS AI, incluant la terminologie malgache traditionnelle et moderne._
