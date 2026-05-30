# 🧪 Utilisation

## 1. Lancer

```bash
node setup-token.js
```

---

## 2. Cas possibles

### 👉 token absent

```text
🔑 TALLY_TOKEN :
```

---

### 👉 choix retention

```text
💾 Retenir le token ? (y = persistant / n = session seulement)
```

---

### 👉 n (temporaire)

* utilisable immédiatement
* disparaît à la fermeture du terminal

---

### 👉 y (persistant)

* stocké dans Windows User Environment
* disponible partout
* nécessite restart terminal

---

## ⚙️ côté Node.js (inchangé)

```js
process.env.TALLY_TOKEN
```

---

## 🎯 Résultat

✔ plus de fichier token.ps1
✔ UX guidée simple
✔ choix session vs persistant
✔ compatible PowerShell + Node
✔ propre pour ton CLI Tally
