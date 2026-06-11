// ==UserScript==
// @name         Letterboxd to Jellyseerr
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Add a button to request movies directly on Jellyseerr from Letterboxd
// @author       MAT-GRC
// @match        https://letterboxd.com/film/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      MIT
// ==/UserScript==

const JELLYSEERR_URL = 'http://localhost:5055';
const API_KEY = 'YOUR_API_KEY';

const LANG = navigator.language.startsWith('fr') ? 'fr'
           : navigator.language.startsWith('de') ? 'de'
           : navigator.language.startsWith('es') ? 'es'
           : navigator.language.startsWith('it') ? 'it'
           : navigator.language.startsWith('pt') ? 'pt'
           : navigator.language.startsWith('ja') ? 'ja'
           : 'en';

const MESSAGES = {
  en: {
    added:       '✅ Movie added to Jellyseerr!',
    exists:      '⚠️ Movie already requested',
    error:       '❌ Error: ',
    unreachable: '❌ Cannot reach Jellyseerr',
    button:      '+ Jellyseerr',
  },
  fr: {
    added:       '✅ Film ajouté à Jellyseerr !',
    exists:      '⚠️ Film déjà demandé',
    error:       '❌ Erreur : ',
    unreachable: '❌ Impossible de joindre Jellyseerr',
    button:      '+ Jellyseerr',
  },
  de: {
    added:       '✅ Film zu Jellyseerr hinzugefügt!',
    exists:      '⚠️ Film bereits angefragt',
    error:       '❌ Fehler: ',
    unreachable: '❌ Jellyseerr nicht erreichbar',
    button:      '+ Jellyseerr',
  },
  es: {
    added:       '✅ Película añadida a Jellyseerr!',
    exists:      '⚠️ Película ya solicitada',
    error:       '❌ Error: ',
    unreachable: '❌ No se puede contactar Jellyseerr',
    button:      '+ Jellyseerr',
  },
  it: {
    added:       '✅ Film aggiunto a Jellyseerr!',
    exists:      '⚠️ Film già richiesto',
    error:       '❌ Errore: ',
    unreachable: '❌ Impossibile raggiungere Jellyseerr',
    button:      '+ Jellyseerr',
  },
  pt: {
    added:       '✅ Filme adicionado ao Jellyseerr!',
    exists:      '⚠️ Filme já solicitado',
    error:       '❌ Erro: ',
    unreachable: '❌ Não foi possível contactar o Jellyseerr',
    button:      '+ Jellyseerr',
  },
  ja: {
    added:       '✅ Jellyseerrに追加しました！',
    exists:      '⚠️ すでにリクエスト済みです',
    error:       '❌ エラー: ',
    unreachable: '❌ Jellyseerrに接続できません',
    button:      '+ Jellyseerr',
  },
};

const MSG = MESSAGES[LANG];

function getTmdbId() {
  const link = document.querySelector('a[data-track-action="TMDB"]');
  if (!link) return null;
  const match = link.href.match(/movie\/(\d+)/);
  return match ? match[1] : null;
}

function showNotif(msg, color) {
  const n = document.createElement('div');
  n.textContent = msg;
  n.style.cssText = `position:fixed;bottom:24px;right:24px;background:${color};color:white;padding:12px 20px;border-radius:8px;font-size:14px;z-index:99999;font-family:sans-serif;box-shadow:0 4px 12px rgba(0,0,0,0.3)`;
  document.body.appendChild(n);
  setTimeout(() => n.remove(), 4000);
}

function requestMovie(tmdbId) {
  GM_xmlhttpRequest({
    method: 'POST',
    url: `${JELLYSEERR_URL}/api/v1/request`,
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': API_KEY
    },
    data: JSON.stringify({
      mediaType: 'movie',
      mediaId: parseInt(tmdbId)
    }),
    onload: (res) => {
      const data = JSON.parse(res.responseText);
      if (res.status === 201) {
        showNotif(MSG.added, '#22c55e');
      } else if (res.status === 409) {
        showNotif(MSG.exists, '#f59e0b');
      } else {
        showNotif(MSG.error + (data.message || res.status), '#ef4444');
      }
    },
    onerror: () => showNotif(MSG.unreachable, '#ef4444')
  });
}

function addButton() {
  const tmdbId = getTmdbId();
  if (!tmdbId) return;

  const btn = document.createElement('a');
  btn.textContent = MSG.button;
  btn.style.cssText = `
    display:inline-block;
    margin-left:8px;
    padding:4px 10px;
    background:#f59e0b;
    color:white;
    border-radius:4px;
    font-size:11px;
    font-weight:600;
    cursor:pointer;
    text-decoration:none;
    letter-spacing:0.5px;
  `;
  btn.onclick = (e) => {
    e.preventDefault();
    btn.textContent = '...';
    requestMovie(tmdbId);
    setTimeout(() => btn.textContent = MSG.button, 3000);
  };

  const tmdbLink = document.querySelector('a[data-track-action="TMDB"]');
  if (tmdbLink) tmdbLink.parentNode.insertBefore(btn, tmdbLink.nextSibling);
}

window.addEventListener('load', addButton);
