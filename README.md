# Letterboxd to Seerr

[🇫🇷 Français](README.fr.md) | [🇬🇧 English](README.md)

A userscript that adds a button on Letterboxd film pages to request movies directly on your Seerr instance via the API.

![Button](assets/button.png)

![Notification](assets/notification.png)

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

2. Click [here](https://raw.githubusercontent.com/MAT-GRC/letterboxd-seerr/main/letterboxd-seerr.user.js) to install the script

3. Edit the script and set your values:
   - `SEERR_URL` - your Seerr URL (e.g. http://localhost:5055)
   - `API_KEY` - found in Seerr, Settings, General, API Key

## Usage

Open any film page on Letterboxd. A + Seerr button will appear next to the TMDB link. Click it to request the movie directly without leaving the page.

## License

MIT
