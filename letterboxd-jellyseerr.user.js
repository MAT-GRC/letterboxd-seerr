// ==UserScript==
// @name         Letterboxd to Jellyseerr
// @namespace    http://tampermonkey.net/
// @version      1.2
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
    added:       '✅ Added to Jellyseerr',
    exists:      '⚠️ Already requested',
    error:       '❌ Error: ',
    unreachable: '❌ Cannot reach Jellyseerr',
    button:      'Jellyseerr',
    loading:     'Adding...',
  },
  fr: {
    added:       '✅ Ajouté à Jellyseerr',
    exists:      '⚠️ Déjà demandé',
    error:       '❌ Erreur : ',
    unreachable: '❌ Jellyseerr inaccessible',
    button:      'Jellyseerr',
    loading:     'Ajout...',
  },
  de: {
    added:       '✅ Zu Jellyseerr hinzugefügt',
    exists:      '⚠️ Bereits angefragt',
    error:       '❌ Fehler: ',
    unreachable: '❌ Jellyseerr nicht erreichbar',
    button:      'Jellyseerr',
    loading:     'Wird hinzugefügt...',
  },
  es: {
    added:       '✅ Añadido a Jellyseerr',
    exists:      '⚠️ Ya solicitado',
    error:       '❌ Error: ',
    unreachable: '❌ Jellyseerr no disponible',
    button:      'Jellyseerr',
    loading:     'Añadiendo...',
  },
  it: {
    added:       '✅ Aggiunto a Jellyseerr',
    exists:      '⚠️ Già richiesto',
    error:       '❌ Errore: ',
    unreachable: '❌ Jellyseerr non raggiungibile',
    button:      'Jellyseerr',
    loading:     'Aggiunta...',
  },
  pt: {
    added:       '✅ Adicionado ao Jellyseerr',
    exists:      '⚠️ Já solicitado',
    error:       '❌ Erro: ',
    unreachable: '❌ Jellyseerr indisponível',
    button:      'Jellyseerr',
    loading:     'A adicionar...',
  },
  ja: {
    added:       '✅ Jellyseerrに追加しました',
    exists:      '⚠️ すでにリクエスト済み',
    error:       '❌ エラー: ',
    unreachable: '❌ Jellyseerrに接続できません',
    button:      'Jellyseerr',
    loading:     '追加中...',
  },
};

const MSG = MESSAGES[LANG];

function getTmdbId() {
  const link = document.querySelector('a[data-track-action="TMDB"]');
  if (!link) return null;
  const match = link.href.match(/movie\/(\d+)/);
  return match ? match[1] : null;
}

function getMovieTitle() {
  const el = document.querySelector('.headline-1');
  return el ? el.textContent.trim() : '';
}

function showNotif(msg, color) {
  const existing = document.getElementById('jls-notif');
  if (existing) existing.remove();

  const n = document.createElement('div');
  n.id = 'jls-notif';
  n.textContent = msg;
  n.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: ${color};
    color: white;
    padding: 12px 18px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;
    z-index: 99999;
    font-family: -apple-system, sans-serif;
    box-shadow: 0 4px 16px rgba(0,0,0,0.4);
    opacity: 0;
    transform: translateY(8px);
    transition: opacity 0.2s ease, transform 0.2s ease;
  `;
  document.body.appendChild(n);
  requestAnimationFrame(() => {
    n.style.opacity = '1';
    n.style.transform = 'translateY(0)';
  });
  setTimeout(() => {
    n.style.opacity = '0';
    n.style.transform = 'translateY(8px)';
    setTimeout(() => n.remove(), 300);
  }, 3500);
}

function requestMovie(tmdbId, btn) {
  const title = getMovieTitle();
  btn.textContent = MSG.loading;
  btn.style.opacity = '0.7';
  btn.style.cursor = 'wait';

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
      btn.style.opacity = '1';
      btn.style.cursor = 'pointer';
      const data = JSON.parse(res.responseText);
      if (res.status === 201) {
        btn.textContent = '✓ ' + MSG.button;
        btn.style.background = '#16a34a';
        showNotif(MSG.added + (title ? ' — ' + title : ''), '#16a34a');
      } else if (res.status === 409) {
        btn.textContent = MSG.button;
        showNotif(MSG.exists + (title ? ' — ' + title : ''), '#d97706');
      } else {
        btn.textContent = MSG.button;
        showNotif(MSG.error + (data.message || res.status), '#dc2626');
      }
    },
    onerror: () => {
      btn.textContent = MSG.button;
      btn.style.opacity = '1';
      btn.style.cursor = 'pointer';
      showNotif(MSG.unreachable, '#dc2626');
    }
  });
}

function addButton() {
  const tmdbId = getTmdbId();
  if (!tmdbId) return;

  const tmdbLink = document.querySelector('a[data-track-action="TMDB"]');
  if (!tmdbLink) return;

  const btn = document.createElement('a');
  btn.textContent = '+ ' + MSG.button;
  btn.style.cssText = `
    display: inline-block;
    margin-left: 4px;
    padding: 2px 7px;
    background: #f59e0b;
    color: #000;
    border-radius: 2px;
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
    text-decoration: none;
    letter-spacing: 0.5px;
    font-family: -apple-system, sans-serif;
    vertical-align: middle;
    transition: background 0.2s ease, opacity 0.2s ease;
  `;

  btn.onmouseenter = () => { if (btn.style.cursor !== 'wait') btn.style.opacity = '0.85'; };
  btn.onmouseleave = () => { btn.style.opacity = '1'; };

  btn.onclick = (e) => {
    e.preventDefault();
    if (btn.style.cursor === 'wait') return;
    requestMovie(tmdbId, btn);
  };

  tmdbLink.parentNode.insertBefore(btn, tmdbLink.nextSibling);
}

window.addEventListener('load', addButton);
