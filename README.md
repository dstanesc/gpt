# gpt

Simple unix style utility adding gpt model interaction to the command line.

## Build

```sh
npm run clean
npm install
npm run build
```

## Install

From source
```sh
npm install -g . 
```

From npm
```sh
npm install -g @dstanesc/gpt
```

## Help

```sh
$ gpt --help
Usage: gpt [options] 'user prompt'


Options:
  --file: input file name, e.g. input.txt
  --prepend: prepend text to user prompt
  --append: append text to user prompt
  --model: model name, e.g. mistral-7b-instruct-v0.1.Q4_0.gguf
  --device: device type, e.g. cpu, gpu
  --temperature: temperature, e.g. 0.7
  --context-length: context length, e.g. 2048
  --thread-count: thread count, e.g. 24
  --system-prompt: system prompt, e.g. '### System: You are an experienced javascript developer'
  --topp: topp, e.g. 0.4
  --minp: minp, e.g. 0.0
  --topk: topk, e.g. 40


Examples:
  xsel -b | gpt --prepend 'Pretty print following json' | codedown json | tee pretty.json
  echo 'create a javascript code fragment that prints first 10 fibonacci numbers' | gpt --temperature 0.5 --thread-count 24 --model mistral-7b-instruct-v0.1.Q4_0.gguf | codedown javascript | node
  echo 'write a python function that prints first 10 Fibonacci numbers' | gpt | codedown python | python3
```

## Models

Model cache location is `${HOME}/.cache/gpt4all`. Models will be downloaded and cached on first time use. It is recommended to discover models using [GPT4All](https://gpt4all.io) model search feature.

## Useful tools

- [codedown](https://www.npmjs.com/package/codedown) - extracts code blocks from Markdown files

## Licenses

Licensed under either [Apache 2.0](http://opensource.org/licenses/MIT) or [MIT](http://opensource.org/licenses/MIT) at your option.
