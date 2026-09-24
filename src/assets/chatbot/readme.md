# EBot chat widget — installation

This package is the chat interface. It is the other half of the chatbot
deployment: the backend bundle publishes an API, and nothing in it draws a chat
window. This is the part that does.

Two files do the work — `src/chatbot-widget.js` and `src/chatbot-widget.css`.
They have **no required dependencies**: dropped on a page, they run.

---

## What you received

```
chatbot-widget-<version>-<customer>/
├── index.html              a ready-to-use example page — edit one line
├── src/
│   ├── chatbot-widget.js   the widget      (100 KB, 24 KB gzipped)
│   └── chatbot-widget.css  the styles      (35 KB, 8 KB gzipped)
├── README.md               this file
├── VERSION                 version, commit, customer, UTC build time
└── SHA256SUMS              a checksum per file
```

`VERSION` is what you quote back to IET when something is wrong. A `-dirty`
suffix on the commit means the package was built from sources that did not match
that commit — a package handed to you should not carry it, so say so if yours
does.

---

## Install — start to finish

### Step 1 — Copy the files onto your site

Copy `src/` next to the page where the chat should appear. Keep the folder name,
or adjust the two paths in step 2 to match wherever you put it.

### Step 2 — Add the widget to your page

Two tags and one `div`. The stylesheet goes in `<head>`, the rest at the end of
`<body>`:

```html
<link rel="stylesheet" href="./src/chatbot-widget.css">

<div id="chatbot-widget"
     data-api-url="https://YOUR-DEPLOYMENT/api/v1/queries"></div>
<script src="./src/chatbot-widget.js"></script>
```

The `div` must have `id="chatbot-widget"`. The widget finds it, mounts itself
into it, and needs no other code — there is nothing to call and nothing to
initialise.

`index.html` in this package is exactly that page, ready to open.

### Step 3 — Point `data-api-url` at your deployment

This is the only value you must change. It is the full URL of the query
endpoint:

```
https://<the hostname the chatbot is published on>/api/v1/queries
```

It ships as `https://CHANGEME.example.com/api/v1/queries`. IET gives you the
hostname; it is the same `route.host` set in the backend bundle. The path is
always `/api/v1/queries` — **the deployment publishes that one path and nothing
else**, and the router answers `503` on every other path of that hostname.

### Step 4 — Have your origin added to the backend's CORS list

**Do not skip this, and do not discover it in the browser console.** The backend
accepts browser requests only from origins named in its `CORS_ALLOWED_ORIGINS`
setting. Until the origin your page is served from is in that list, every
question fails and the browser reports a CORS error — the widget is fine, the
request never gets an answer.

Send IET, or whoever installed the backend, the exact origin — scheme, host and
port, no path:

```
https://www.your-site.example
```

Each origin you serve the page from is a separate entry: a staging host, a
preview host and `http://localhost:8080` are three different origins.

### Step 5 — Serve the page over HTTP and check it

Not `file://` — the browser blocks module and stylesheet loading there, and the
API call has no origin to present. Any static server will do:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080/` and check, in order:

1. A round chat button sits in the bottom-right corner.
2. Clicking it opens the panel, titled with the bot name.
3. Ask a question. An answer streams in token by token.
4. No red CORS or 404 line in the browser console.

If the button never appears, the two file paths in step 2 are wrong. If it
appears but every question fails, it is step 4.

---

## Changing anything else

Every option is an attribute on the same `div`. All are optional; leaving one
out keeps the default in the right-hand column.

| Attribute | What it does | Default |
|---|---|---|
| `data-api-url` | **The query endpoint. The one you must set.** | `http://localhost:8000/api/v1/queries` |
| `data-language` | Interface language: `it`, `en`, `es`, `fr`, `de` | `it` |
| `data-theme-color` | Accent colour, e.g. `#1a6fd4` | stylesheet default, `#1a6fd4` |
| `data-scheme` | `light`, `dark`, or `auto` to follow the OS | `light` |
| `data-position` | `bottom-right`, `bottom-left`, `top-right`, `top-left` | `bottom-right` |
| `data-bot-name` | Name shown in the panel header | `Assistant` |
| `data-avatar-url` | Custom bot avatar image | none |
| `data-radius` | Corner radius, e.g. `16px` | stylesheet default |
| `data-width` | Panel width, e.g. `380px` | stylesheet default |
| `data-height` | Panel height, e.g. `560px` | stylesheet default |
| `data-font-family` | Font stack override | inherits your page |
| `data-documents-url` | Base URL for document endpoints | a sibling of `data-api-url` |

`data-documents-url` is worth one warning: the deployment publishes only
`/api/v1/queries`, so document endpoints are not reachable from a browser at
all. Leave it alone unless IET tells you otherwise.

For finer control, override the CSS custom properties instead — the full token
vocabulary is documented in the widget repository's README.

### The three optional libraries

`index.html` loads `axios`, `i18next` and `marked` from a CDN. **All three are
optional**, each with a working fallback built into the widget:

| Library | If you omit it |
|---|---|
| axios | the widget uses `fetch` |
| i18next | the widget uses its own built-in dictionary |
| marked | the widget uses its own markdown parser, covering less syntax |

Remove all three and the widget still works. On a site with no outbound internet
access, remove them — otherwise three requests fail slowly on every page load.

---

## Two things the widget does not decide

Both are backend settings. Changing them here is not possible, and looking for a
widget option for them is time lost.

**Whether answers show sources.** The widget renders a source block only when the
answer carries one. When the deployment has `RESPONSE_SOURCES_ENABLED` off — as
it is for ASL Latina, who asked that sources and references not reach the
frontend — answers arrive with an empty source list and the widget renders no
source block and no `[n]` markers. This is the intended appearance, not a
missing feature.

**Whether an answer comes at all.** The backend refuses a question it cannot
answer from its documents, and returns a polite "not found in my documents"
message rather than inventing one. That refusal is rendered as a normal reply.

---

## Support

Quote the `VERSION` file. If the problem is visual, the browser, the viewport
width and a screenshot are what make it reproducible; if it is a failed question,
the browser console's network entry for `/api/v1/queries` is.

Innovation & Emerging Technologies Office — team.iet@dedalus.com
