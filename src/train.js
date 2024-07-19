const { NlpManager } = require("node-nlp");
const fs = require("fs");
const path = require("path");

// Corrected path to the intents directory
const intentsPath = path.resolve(__dirname, "intents");

const manager = new NlpManager({ languages: ["en"] });
const files = fs.readdirSync(intentsPath);

for (const file of files) {
  let data = fs.readFileSync(path.join(intentsPath, file));
  data = JSON.parse(data);
  const intent = file.replace(".json", "");
  for (const question of data.questions) {
    manager.addDocument("en", question, intent);
  }
  for (const answer of data.answers) {
    manager.addAnswer("en", intent, answer);
  }
}

async function train_save() {
  await manager.train();
  manager.save();
}

train_save();
