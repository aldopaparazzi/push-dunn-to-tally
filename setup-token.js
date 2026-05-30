import readline from "readline";
import { execSync } from "child_process";

const TOKEN_KEY = "TALLY_TOKEN";

function ask(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve =>
    rl.question(question, ans => {
      rl.close();
      resolve(ans.trim());
    })
  );
}

function getPersistentToken() {
  try {
    return execSync(
      `powershell -Command "[Environment]::GetEnvironmentVariable('${TOKEN_KEY}', 'User')"`
    )
      .toString()
      .trim();
  } catch {
    return null;
  }
}

function setPersistentToken(token) {
  execSync(
    `powershell -Command "[Environment]::SetEnvironmentVariable('${TOKEN_KEY}', '${token}', 'User')"`
  );
}

function deletePersistentToken() {
  execSync(
    `powershell -Command "[Environment]::SetEnvironmentVariable('${TOKEN_KEY}', $null, 'User')"`
  );
}

async function main() {
  let token = process.env.TALLY_TOKEN;
  let source = "session";

  // ---------------------------------
  // CHECK SESSION TOKEN
  // ---------------------------------
  if (token) {
    console.log(`🔑 Token détecté (SESSION)`);
  }

  // ---------------------------------
  // CHECK PERSISTENT TOKEN
  // ---------------------------------
  const persistent = getPersistentToken();

  if (!token && persistent) {
    token = persistent;
    source = "persistant";
    console.log(`🔑 Token détecté (PERSISTANT USER)`);
  }

  // ---------------------------------
  // NO TOKEN
  // ---------------------------------
  if (!token) {
    token = await ask("🔑 TALLY_TOKEN : ");
  }

  if (!token) {
    console.log("❌ Aucun token fourni");
    return;
  }

  console.log(`\n📦 Token actif (source: ${source})`);

  // ---------------------------------
  // IF PERSISTENT EXISTS → OPTION DELETE
  // ---------------------------------
  if (persistent) {
    const action = await ask(
      "⚠️ Token persistant détecté : [d] supprimer / [c] conserver / [r] remplacer : "
    );

    if (action.toLowerCase() === "d") {
      deletePersistentToken();
      console.log("🗑️ Token persistant supprimé");
      return;
    }

    if (action.toLowerCase() === "r") {
      setPersistentToken(token);
      console.log("♻️ Token persistant remplacé");
      return;
    }

    console.log("✔️ Token conservé");
    return;
  }

  // ---------------------------------
  // ASK PERSISTENCE
  // ---------------------------------
  const remember = await ask(
    "💾 Retenir le token ? (y = persistant / n = session) : "
  );

  if (remember.toLowerCase() === "y") {
    setPersistentToken(token);
    console.log("💾 Token sauvegardé (User persistant)");
    console.log("👉 Redémarre ton terminal");
  } else {
    process.env.TALLY_TOKEN = token;
    console.log("⚡ Token défini pour cette session uniquement");
  }
}

main();