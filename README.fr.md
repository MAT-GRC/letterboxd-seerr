# Letterboxd vers Jellyseerr

[🇫🇷 Français](README.fr.md) | [🇬🇧 English](README.md)

Un userscript qui ajoute un bouton sur les pages de films Letterboxd pour demander des films directement sur votre instance Jellyseerr via l'API.

![Bouton](assets/button.png)

![Notification](assets/notification.png)

## Langues supportees

🇬🇧 Anglais, 🇫🇷 Francais, 🇩🇪 Allemand, 🇪🇸 Espagnol, 🇮🇹 Italien, 🇵🇹 Portugais, 🇯🇵 Japonais

Le script detecte automatiquement la langue de votre navigateur.

## Fonctionnalites

- Demande de film en un clic depuis n'importe quelle page film Letterboxd
- Appel API direct, sans redirection ni recherche
- Notifications de succes et d'erreur en temps reel
- Fonctionne sur tous les navigateurs avec un gestionnaire de scripts

## Installation

1. Installez un gestionnaire de userscripts :
   - Safari (Mac/iPhone) : [Userscripts](https://apps.apple.com/app/userscripts/id1463298887)
   - Chrome/Firefox : [Tampermonkey](https://www.tampermonkey.net)

2. Cliquez [ici](https://raw.githubusercontent.com/MAT-GRC/letterboxd-jellyseerr/main/letterboxd-jellyseerr.user.js) pour installer le script

3. Modifiez le script et renseignez vos valeurs :
   - `JELLYSEERR_URL` - l'URL de votre Jellyseerr (ex : http://localhost:5055)
   - `API_KEY` - disponible dans Jellyseerr, Parametres, General, Cle API

## Utilisation

Ouvrez n'importe quelle page film sur Letterboxd. Un bouton + Jellyseerr apparaitra a cote du lien TMDB. Cliquez dessus pour demander le film directement sans quitter la page.

## Licence

MIT
