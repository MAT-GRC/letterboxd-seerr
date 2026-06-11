# Letterboxd vers Seerr

[🇫🇷 Français](README.fr.md) | [🇬🇧 English](README.md)

![Bouton](assets/button.png)

![Notification](assets/notification.png)

## Langues supportées

🇬🇧 Anglais, 🇫🇷 Français, 🇩🇪 Allemand, 🇪🇸 Espagnol, 🇮🇹 Italien, 🇵🇹 Portugais, 🇯🇵 Japonais

Le script détecte automatiquement la langue de votre navigateur.

## Fonctionnalités

- Demande de film en un clic depuis n'importe quelle page film Letterboxd
- Appel API direct, sans redirection ni recherche
- Vérification des doublons avant l'envoi de la demande
- Notifications animées avec le titre du film
- Fonctionne sur tous les navigateurs avec un gestionnaire de scripts

## Prérequis

Votre instance Seerr doit être accessible depuis votre navigateur, que ce soit sur votre réseau local ou via un VPN comme Tailscale.

> **Note :** `GM_xmlhttpRequest` (utilisé par Tampermonkey) contourne les restrictions mixed content du navigateur, donc HTTP fonctionne parfaitement. Si vous utilisez une extension basée sur `fetch`, HTTPS sera nécessaire.

## Installation

1. Installez un gestionnaire de userscripts :
   - Safari (Mac) : [Tampermonkey](https://apps.apple.com/fr/app/tampermonkey/id6738342400) *(recommandé)*
   - Safari (Mac/iPhone) : [Userscripts](https://apps.apple.com/app/userscripts/id1463298887) *(actuellement non fonctionnel en raison de limitations de l'extension)*
   - Chrome/Firefox : [Tampermonkey](https://www.tampermonkey.net)

2. Cliquez [ici](https://raw.githubusercontent.com/MAT-GRC/letterboxd-seerr/main/letterboxd-seerr.user.js) pour installer le script

3. Modifiez le script et renseignez vos valeurs :
   - `SEERR_URL` - l'URL de votre Seerr (ex : http://192.168.1.x:5055)
   - `API_KEY` - disponible dans Seerr, Paramètres, Général, Clé API

## Utilisation

Ouvrez n'importe quelle page film sur Letterboxd. Un bouton `+ Seerr` apparaîtra à côté du lien TMDB. Cliquez dessus pour demander le film directement sans quitter la page.

## Licence

MIT