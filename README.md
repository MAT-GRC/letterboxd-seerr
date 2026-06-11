# Letterboxd to Jellyseerr

[🇫🇷 Français](README.fr.md) | [🇬🇧 English](README.md)

A userscript that adds a button on Letterboxd film pages to request movies directly on your Jellyseerr instance via the API.

## Supported languages

🇬🇧 English, 🇫🇷 French, 🇩🇪 German, 🇪🇸 Spanish, 🇮🇹 Italian, 🇵🇹 Portuguese, 🇯🇵 Japanese

The script automatically detects your browser language.

## Features

- One-click movie request from any Letterboxd film page
- Direct API call, no redirect, no search
- Success/error notifications inline
- Works on any browser with a userscript manager

## Installation

1. Install a userscript manager:
   - Safari (Mac/iPhone): [Userscripts](https://apps.apple.com/app/userscripts/id1463298887)
   - Chrome/Firefox: [Tampermonkey](https://www.tampermonkey.net)

2. Click [here](https://raw.githubusercontent.com/MAT-GRC/letterboxd-jellyseerr/main/letterboxd-jellyseerr.user.js) to install the script

3. Edit the script and set your values:
   - `JELLYSEERR_URL` - your Jellyseerr URL (e.g. http://localhost:5055)
   - `API_KEY` - found in Jellyseerr, Settings, General, API Key

## Usage

Open any film page on Letterboxd. A + Jellyseerr button will appear next to the TMDB link. Click it to request the movie directly without leaving the page.

## License

MIT
