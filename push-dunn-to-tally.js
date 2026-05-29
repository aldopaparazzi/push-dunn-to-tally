import "dotenv/config";
import { v4 as uuidv4 } from "uuid";
import { readFileSync, writeFileSync } from "node:fs";

/**
 * =========================================
 * CONFIG
 * =========================================
 */
const FORM_ID = process.env.TALLY_FORM_ID;
const TOKEN = process.env.TALLY_TOKEN;

if (!FORM_ID || !TOKEN) {
  throw new Error("Missing TALLY_FORM_ID or TALLY_TOKEN in env");
}

const API_URL = `https://api.tally.so/forms/${FORM_ID}`;

/**
 * =========================================
 * GLOBAL CALCULATED FIELD
 * =========================================
 */
const GLOBAL_ZERO_UUID = uuidv4();
const GLOBAL_CALC_GROUP_UUID = uuidv4();

/**
 * =========================================
 * CSV LOADER
 * =========================================
 */
function loadCSV(filePath) {
  const raw = readFileSync(filePath, "utf-8");

  return raw
    .split("\n")
    .filter(l => l.trim())
    .map(line => {
      const [group, id, text] = line.split(";");
      return {
        group: group?.trim(),
        id: id?.trim(),
        text: text?.trim()
      };
    });
}

/**
 * =========================================
 * SAFE HTML WRAPPER
 * =========================================
 */
function textSchema(text) {
  return [[text]];
}

/**
 * =========================================
 * INTRO
 * =========================================
 */
function createIntro() {
  return [
    {
      uuid: uuidv4(),
      type: "FORM_TITLE",
      groupUuid: uuidv4(),
      groupType: "TEXT",
      payload: {
        title: "Bilan sensoriel enfant",
        safeHTMLSchema: textSchema("Bilan sensoriel enfant"),
        button: { label: "Commencer" }
      }
    },
    {
      uuid: uuidv4(),
      type: "TEXT",
      groupUuid: uuidv4(),
      groupType: "TEXT",
      payload: {
        safeHTMLSchema: textSchema("Veuillez répondre aux questions suivantes.")
      }
    },
    {
      uuid: uuidv4(),
      type: "PAGE_BREAK",
      groupUuid: uuidv4(),
      groupType: "PAGE_BREAK",
      payload: {
        index: 0,
        isFirst: true,
        isLast: false,
        isQualifiedForThankYouPage: false
      }
    }
  ];
}

/**
 * =========================================
 * GLOBAL CALCULATED FIELD
 * =========================================
 */
function createGlobalCalculatedFields() {
  return [
    {
      uuid: uuidv4(),
      type: "CALCULATED_FIELDS",
      groupUuid: GLOBAL_CALC_GROUP_UUID,
      groupType: "CALCULATED_FIELDS",
      payload: {
        calculatedFields: [
          {
            uuid: GLOBAL_ZERO_UUID,
            name: "zero",
            type: "NUMBER",
            value: 0
          }
        ]
      }
    }
  ];
}

/**
 * =========================================
 * QUESTION BUILDER
 * =========================================
 */
function createQuestion(row) {
  const scaleUuid = uuidv4();
  const scaleGroupUuid = uuidv4();

  const checkboxUuid = uuidv4();
  const checkboxGroupUuid = uuidv4();

  const columnListUuid = uuidv4();
  const scaleColumnUuid = uuidv4();
  const checkboxColumnUuid = uuidv4();

  const calcGroupUuid = uuidv4();
  const scoreFieldUuid = uuidv4();

  const questionName = `${row.id} · ${row.group}`;

  return [
    {
      uuid: uuidv4(),
      type: "TITLE",
      groupUuid: uuidv4(),
      groupType: "QUESTION",
      payload: {
        safeHTMLSchema: textSchema(questionName)
      }
    },
    {
      uuid: uuidv4(),
      type: "TEXT",
      groupUuid: uuidv4(),
      groupType: "TEXT",
      payload: {
        safeHTMLSchema: textSchema(row.text)
      }
    },
    {
      uuid: scaleUuid,
      type: "LINEAR_SCALE",
      groupUuid: scaleGroupUuid,
      groupType: "LINEAR_SCALE",
      payload: {
        isRequired: true,
        start: 1,
        end: 5,
        step: 1,
        hasLeftLabel: true,
        leftLabel: "Jamais ou presque jamais",
        hasCenterLabel: true,
        centerLabel: "Parfois",
        hasRightLabel: true,
        rightLabel: "Toujours ou presque toujours",
        name: questionName,
        columnListUuid,
        columnUuid: scaleColumnUuid
      }
    },
    {
      uuid: checkboxUuid,
      type: "CHECKBOX",
      groupUuid: checkboxGroupUuid,
      groupType: "CHECKBOXES",
      payload: {
        isRequired: false,
        name: "N/A",
        text: "La situation ne peut pas se présenter.",
        columnListUuid,
        columnUuid: checkboxColumnUuid
      }
    },
    {
      uuid: uuidv4(),
      type: "CALCULATED_FIELDS",
      groupUuid: calcGroupUuid,
      groupType: "CALCULATED_FIELDS",
      payload: {
        calculatedFields: [
          {
            uuid: scoreFieldUuid,
            name: row.id,
            type: "NUMBER",
            value: {
              uuid: scaleGroupUuid,
              type: "INPUT_FIELD",
              questionType: "LINEAR_SCALE",
              blockGroupUuid: scaleGroupUuid,
              title: questionName
            }
          }
        ]
      }
    },
    {
      uuid: uuidv4(),
      type: "CONDITIONAL_LOGIC",
      groupUuid: uuidv4(),
      groupType: "CONDITIONAL_LOGIC",
      payload: {
        logicalOperator: "AND",
        conditionals: [
          {
            uuid: uuidv4(),
            type: "SINGLE",
            payload: {
              field: {
                uuid: checkboxGroupUuid,
                type: "INPUT_FIELD",
                questionType: "CHECKBOXES",
                blockGroupUuid: checkboxGroupUuid,
                title: "N/A"
              },
              comparison: "CONTAINS",
              value: checkboxUuid
            }
          }
        ],
        actions: [
          {
            uuid: uuidv4(),
            type: "HIDE_BLOCKS",
            payload: {
              hideBlocks: [scaleUuid]
            }
          },
          {
            uuid: uuidv4(),
            type: "CALCULATE",
            payload: {
              calculate: {
                field: {
                  uuid: scoreFieldUuid,
                  type: "CALCULATED_FIELD",
                  questionType: "CALCULATED_FIELDS",
                  blockGroupUuid: calcGroupUuid,
                  title: "score"
                },
                operator: "ASSIGNMENT",
                value: {
                  uuid: GLOBAL_ZERO_UUID,
                  type: "CALCULATED_FIELD",
                  questionType: "CALCULATED_FIELDS",
                  blockGroupUuid: GLOBAL_CALC_GROUP_UUID,
                  title: "zero"
                }
              }
            }
          }
        ]
      }
    }
  ];
}

/**
 * =========================================
 * THANK YOU PAGE
 * =========================================
 */
function createThankYou(index) {
  return [
    {
      uuid: uuidv4(),
      type: "PAGE_BREAK",
      groupUuid: uuidv4(),
      groupType: "PAGE_BREAK",
      payload: {
        index,
        isFirst: false,
        isLast: true,
        isQualifiedForThankYouPage: true,
        isThankYouPage: true
      }
    },
    {
      uuid: uuidv4(),
      type: "TEXT",
      groupUuid: uuidv4(),
      groupType: "TEXT",
      payload: {
        safeHTMLSchema: textSchema("Merci pour votre participation.")
      }
    }
  ];
}

/**
 * =========================================
 * MAIN
 * =========================================
 */
async function run(csvRows) {
  const formRes = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${TOKEN}`
    }
  });

  const form = await formRes.json();

  let blocks = [];

  blocks.push(...createIntro());
  blocks.push(...createGlobalCalculatedFields());

  csvRows.forEach((row, index) => {
    blocks.push(...createQuestion(row));

    if (index < csvRows.length - 1) {
      blocks.push({
        uuid: uuidv4(),
        type: "PAGE_BREAK",
        groupUuid: uuidv4(),
        groupType: "PAGE_BREAK",
        payload: {
          index: index + 1,
          isFirst: false,
          isLast: false,
          isQualifiedForThankYouPage: false
        }
      });
    }
  });

  blocks.push(...createThankYou(csvRows.length + 1));

  const finalForm = {
    ...form,
    blocks
  };

  writeFileSync(
    "debug-final-form.json",
    JSON.stringify(finalForm, null, 2)
  );

  const patchRes = await fetch(API_URL, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(finalForm)
  });

  console.log("STATUS:", patchRes.status);
  console.log(await patchRes.text());
}

/**
 * EXECUTION
 */
const csvRows = loadCSV("./data.csv");
await run(csvRows);