# Structure interne du script

## loadCSV()

Parse le CSV brut.

Retour :

```js
[
  { group, id, text }
]
```

---

## createQuestion()

Génère une question Tally complète :

* label
* échelle 1–5
* checkbox N/A
* logique conditionnelle
* champ de score

---

## createIntro()

Crée la page d’introduction du formulaire.

---

## createThankYou()

Crée la page de fin du formulaire.

---

## run()

Pipeline principal :

1. lecture CSV
2. génération des blocs
3. assemblage du formulaire
4. export JSON debug
5. PATCH API Tally

---
