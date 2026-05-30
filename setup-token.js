import fs from "fs";
import readline from "readline";

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

async function main() {
  let token = process.env.TALLY_TOKEN;

  // ---------------------------------
  // GET TOKEN
  // ---------------------------------
  if (!token) {
    token = await ask("🔑 TALLY_TOKEN : ");
  } else {
    console.log(`🔑 Token déjà détecté`);
  }

  if (!token) {
    console.log("❌ Aucun token fourni");
    return;
  }

  // ---------------------------------
  // MODE CHOIX
  // ---------------------------------
  const remember = await ask(
    "💾 Retenir le token ? (y = persistant / n = session seulement) : "
  );

  // ---------------------------------
  // SESSION ONLY
  // ---------------------------------
  if (remember.toLowerCase() !== "y") {
    process.env.TALLY_TOKEN = token;

    console.log("\n⚡ Token défini pour cette session uniquement");
    console.log("👉 node push-dunn-to-tally.js");
    return;
  }

  // ---------------------------------
  // PERSISTENT USER ENV (Windows)
  // ---------------------------------
  const { execSync } = await import("child_process");

  execSync(
    `powershell -Command "[Environment]::SetEnvironmentVariable('TALLY_TOKEN', '${token}', 'User')"`,
    { stdio: "inherit" }
  );

  console.log("\n💾 Token sauvegardé (persistant utilisateur)");
  console.log("👉 Redémarre ton terminal pour l'utiliser");
}

main();