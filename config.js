import "dotenv/config";

const config = {
  token: process.env.TALLY_TOKEN,

  forms: {
    test: {
      formId: process.env.FORM_TEST,
      csv: "./data/data.csv"
    },
    enfant: {
      formId: process.env.FORM_ENFANT,
      csv: "./data/enfant.csv"
    },
    jenfant: {
      formId: process.env.FORM_JENFANT,
      csv: "./data/jenfant.csv"
    },
    scolaire: {
      formId: process.env.FORM_SCOLAIRE,
      csv: "./data/scolaire.csv"
    },
    dunn2: {
      formId: process.env.FORM_DUNN2,
      csv: "./data/dunn2.csv"
    }
  }
};

export function getConfig(target = "test") {
  const current = config.forms[target];

  if (!current) {
    throw new Error(
      `Formulaire inconnu "${target}". Disponibles : ${Object.keys(config.forms).join(", ")}`
    );
  }

  return {
    token: config.token,
    ...current
  };
}