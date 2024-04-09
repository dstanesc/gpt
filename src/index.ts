#!/usr/bin/env node

import * as readline from "readline";
import { GptOptions, createChatSession, fromEnv } from "./gpt";
import { CompletionResult, createCompletion } from "gpt4all";
import * as arg from "arg";

function inputs() {
  return arg({
    "--help": Boolean,
    "--file": String,
    "--prepend": String,
    "--append": String,
    "--model": String,
    "--device": String,
    "--temperature": Number,
    "--context-length": Number,
    "--thread-count": Number,
    "--system-prompt": String,
    "--topp": Number,
    "--minp": Number,
    "--topk": Number,
  });
}

function help() {
  console.log("Usage: gpt [options] 'user prompt'");
  console.log("\n");
  console.log("Options:");
  console.log("  --file: input file name, e.g. input.txt");
  console.log("  --prepend: prepend text to user prompt");
  console.log("  --append: append text to user prompt");
  console.log("  --model: model name, e.g. mistral-7b-instruct-v0.1.Q4_0.gguf");
  console.log("  --device: device type, e.g. cpu, gpu");
  console.log("  --temperature: temperature, e.g. 0.7");
  console.log("  --context-length: context length, e.g. 2048");
  console.log("  --thread-count: thread count, e.g. 24");
  console.log(
    "  --system-prompt: system prompt, e.g. '### System: You are an experienced javascript developer'"
  );
  console.log("  --topp: topp, e.g. 0.4");
  console.log("  --minp: minp, e.g. 0.0");
  console.log("  --topk: topk, e.g. 40");
  console.log("\n");
  console.log("Examples:");
  console.log(
    "  xsel -b | gpt --prepend 'Pretty print following json' | codedown json | tee pretty.json"
  );
  console.log(
    "  echo 'create a javascript code fragment that prints first 10 fibonacci numbers' | gpt | codedown javascript | node"
  );
  console.log(
    "  echo 'create a javascript code fragment that prints first 10 fibonacci numbers' | gpt --temperature 0.5 --thread-count 24 --model mistral-7b-instruct-v0.1.Q4_0.gguf | codedown javascript | node"
  );
  console.log(
    "  echo 'write a python function that prints first 10 Fibonacci numbers' | gpt | codedown python | python3"
  );
  console.log("\n");
}

function main() {
  const args = inputs();
  const userPrompt = args["_"];
  const file = args["--file"];
  const prepend = args["--prepend"];
  const append = args["--append"];
  let fileInput: string[] = [];
  if (file) {
    console.error("File input:", file);
    fileInput = require("fs").readFileSync(file, "utf-8").split("\n");
  }
  if (userPrompt.length > 0) {
    const augmentedPrompt = userPrompt.concat(fileInput);
    if (prepend) {
      console.error("Prepend text:", prepend);
      augmentedPrompt.unshift(prepend);
    }
    if (append) {
      console.error("Append text:", append);
      augmentedPrompt.push(append);
    }
    console.error("Direct input:", augmentedPrompt.join("\n"));
    gpt(augmentedPrompt, args);
  } else {
    if (args["--help"]) {
      help();
    } else {
      let source: string[] = [];
      const readlineInterface = readline.createInterface({
        terminal: false,
        input: process.stdin,
      });
      readlineInterface.on("line", (input) => {
        console.error(`Piped input: ${input}`);
        source.push(input);
      });
      readlineInterface.on("close", async () => {
        const augmentedPrompt = source.concat(fileInput);
        if (prepend) {
          console.error("Prepend text:", prepend);
          augmentedPrompt.unshift(prepend);
        }
        if (append) {
          console.error("Append text:", append);
          augmentedPrompt.push(append);
        }
        await gpt(augmentedPrompt, args);
      });
    }
  }
}

async function gpt(source: string[], args: any) {
  const runtimeOptions = {
    model: args["--model"],
    device: args["--device"],
    temperature: args["--temperature"],
    contextLength: args["--context-length"],
    threadCount: args["--thread-count"],
    systemPrompt: args["--system-prompt"],
    topP: args["--topp"],
    minP: args["--minp"],
    topK: args["--topk"],
  } as GptOptions;
  const envOptions = fromEnv();
  const options = {
    ...envOptions,
    ...runtimeOptions,
  };
  const { model, chat } = await createChatSession(options);
  const query = source.join("\n");
  const output: CompletionResult = await createCompletion(chat, query);
  const message = output.choices[0].message.content;
  console.log(message);
}

main();
