import { ChatGPTAPI } from "chatgpt";
//import { chatgptToken } from "chatgpt-token/module";
import * as dotenv from "dotenv"; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();
import chalk from "chalk";
import { getOpenAIAuthInfo } from "./openai-auth-puppeteer.js";

var api = "loading";

async function initChat() {
  console.log(chalk.grey("Starting ChatGPT API"));

  var email = process.env.CHATGPT_USER;
  var password = process.env.CHATGPT_PASSWORD;
  try {
    const authInfo = await getOpenAIAuthInfo({
      email,
      password,
    });

    api = new ChatGPTAPI({ ...authInfo });
    console.log(chalk.green("ChatGPT API init successfully"));
    // ensure the API is properly authenticated
    await api.ensureAuth();
  } catch (err) {
    api = "down";
    console.log(err);
  }
}
async function chat(msg) {
  if (api == "loading") {
    return `Wait 1-2 mins the bot is reloading .`;
  }
  if (api == "down") {
    return `ChatGPT is down now.\nFor more information join our discord: [dsc.gg/turing](https://dsc.gg/turing)`;
  }
  const response = await api.sendMessage(msg);
  return response;
}
async function createConversation() {
  if (api == "loading") {
    return `Wait 1-2 mins the bot is reloading .`;
  }
  if (api == "down") {
    return `ChatGPT is down now.\nFor more information join our discord: [dsc.gg/turing](https://dsc.gg/turing)`;
  }
  var conversation = api.getConversation();
  return conversation;
}

export { chat, initChat, createConversation };
