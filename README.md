# push-dunn-to-tally

Script Node.js permettant de générer automatiquement un formulaire Tally à partir d’un fichier CSV et de le pousser via l’API.

---

## Objectif

Ce projet automatise la création d’un formulaire type “questionnaire sensoriel” (modèle Dunn ou équivalent) dans Tally.

Le script :

* lit un fichier CSV
* transforme chaque ligne en question
* génère la structure complète du formulaire
* applique une logique conditionnelle (N/A)
* envoie le formulaire via API

---

## Prérequis

* Node.js 18+
* un compte [Tally](https://tally.so)
* un formulaire Tally existant
* un token API Tally

---

## Installation

Aucune structure npm requise.

Installer manuellement les dépendances utilisées dans le script :

```bash
npm install dotenv node-fetch uuid
```

---

## Configuration

Créer un fichier `.env` :

```env
TALLY_FORM_ID=xxxxxxx
TALLY_TOKEN=xxxxxxx
```

---

## CSV attendu

Le script attend un CSV simple avec séparateur `;`.

Format :

```csv
group;id;text
```

Exemple :

```csv
Auditif;1;Mon enfant réagit fortement aux bruits soudains
Auditif;2;Mon enfant se bouche les oreilles dans les environnements bruyants
Tactile;34;Mon enfant évite certaines textures de vêtements
```

---

## Exécution

```bash
node app+.js
```

---

## Fonctionnement global

### 1. Lecture du CSV

Le fichier est parsé ligne par ligne pour extraire :

* groupe
* identifiant
* texte de question

---

### 2. Génération du formulaire

Pour chaque question, le script crée un bloc Tally contenant :

* question principale
* échelle de réponse (1 → 5)
* option “N/A”
* champ de score calculé
* logique conditionnelle

---

### 3. Logique N/A

Si “N/A” est coché :

* la réponse est ignorée
* le score est forcé à 0
* la question est considérée comme non applicable

---

### 4. Envoi à Tally

Le script :

* récupère le formulaire existant
* reconstruit tous les blocs
* pousse la mise à jour via API

---

## Sortie debug

Un fichier est généré :

```bash
debug-final-form.json
```

Il contient la structure complète envoyée à Tally.

---

## Dépendances implicites

Même sans package.json, le script dépend de :

* `dotenv`
* `uuid`
* `node-fetch`

---

## Limites actuelles

* pas de validation CSV
* pas de gestion d’erreurs robuste API
* pas de CLI options
* dépendance forte à la structure interne de Tally
* pas de versioning

---

## Points sensibles

* L’API Tally peut changer sans warning
* Les IDs de blocs doivent être uniques (UUID)
* Le CSV doit être propre (pas de lignes vides malformées)

---

## Améliorations possibles

* ajout d’un `package.json`
* ajout d’un mode `--dry-run`
* validation CSV stricte
* typage TypeScript
* séparation logique / API
* gestion des retries API
* logs structurés

---

## Résumé

Ce script transforme un CSV en formulaire Tally complet, avec logique conditionnelle intégrée et export debug pour validation avant envoi.

---
