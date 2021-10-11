#  YBox

## A lightweight Markdown editor

The idea behind this project was to provide a fast way of reading, editing and saving markdown notes, docs and information.
It uses a 3 layer save system, that stores the documents progressively to reduce both api usage and increase doc retrieval speed.
#### Layers:
* In memory
* LocalStorage
* API - Workers KV Storage
The doc autosaves in layers when being edited.
This also was a workaround to KV Storage not reflecting changes immediately sometimes.

## Stack
* Cloudflare Pages
* Cloudflare Workers
* Cloudflare KV Storage

# Instructions
Run using
```bash
npm i
npm run start
```

### Created for the Cloudflare Summer Challenge and fun!

