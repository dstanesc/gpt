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

  -f, --file: input file name, appends file content to user prompt
  -p, --prepend: prepend text to piped input
  -a, --append: append text to piped input
  -m, --model: model name, e.g. mistral-7b-instruct-v0.1.Q4_0.gguf
  -d, --device: device type, e.g. cpu, gpu
  -t, --temperature: temperature, e.g. 0.7
  -c, --context-length: context length, e.g. 2048
  -r, --thread-count: thread count, e.g. 24
  -s, --system-prompt: system prompt, e.g. '### System: You are an experienced javascript developer'
  -o, --topp: topp, e.g. 0.4
  -i, --minp: minp, e.g. 0.0
  -k, --topk: topk, e.g. 40


Examples:

  gpt '1+1'
  xsel -b | gpt --prepend 'Pretty print following json' | codedown json | tee pretty.json
  echo 'create a javascript code fragment that prints first 10 fibonacci numbers' | gpt | codedown javascript | node
  echo 'create a javascript code fragment that prints first 10 fibonacci numbers' | gpt --temperature 0.5 --thread-count 24 --model mistral-7b-instruct-v0.1.Q4_0.gguf | codedown javascript | node
  echo 'write a python function that prints first 10 Fibonacci numbers' | gpt | codedown python | python3
  echo 'create a html page that displays a plotlyjs based bar chart with the top 10 US cities by population' | gpt | codedown html | tee page.html
```

## Models

Model cache location is `${HOME}/.cache/gpt4all`. Models will be downloaded and cached on first time use. It is recommended to discover models using [GPT4All](https://gpt4all.io) model search feature.

## Useful tools

- [codedown](https://www.npmjs.com/package/codedown) - extracts code blocks from Markdown files

## Licenses

Licensed under either [Apache 2.0](http://opensource.org/licenses/MIT) or [MIT](http://opensource.org/licenses/MIT) at your option.
