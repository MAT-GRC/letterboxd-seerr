// ==UserScript==
// @name         Letterboxd to Seerr
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Add a button to request movies directly on Seerr from Letterboxd
// @author       MAT-GRC
// @match        https://letterboxd.com/film/*
// @grant        GM_xmlhttpRequest
// @grant        GM.xmlHttpRequest
// @connect      *
// @license      MIT
// ==/UserScript==

const SEERR_URL = 'http://localhost:5055'; // Change to your Seerr URL (e.g. http://192.168.1.x:5055)
const API_KEY = 'YOUR_API_KEY';            // Change to your Seerr API key (Settings → General → API Key)

const LANG = navigator.language.startsWith('fr') ? 'fr'
  : navigator.language.startsWith('de') ? 'de'
    : navigator.language.startsWith('es') ? 'es'
      : navigator.language.startsWith('it') ? 'it'
        : navigator.language.startsWith('pt') ? 'pt'
          : navigator.language.startsWith('ja') ? 'ja'
            : 'en';

const MESSAGES = {
  en: {
    added: '✅ Added to Seerr',
    exists: '⚠️ Already requested',
    error: '❌ Error: ',
    unreachable: '❌ Cannot reach Seerr',
    button: 'Seerr',
    loading: 'Adding...',
  },
  fr: {
    added: '✅ Ajouté à Seerr',
    exists: '⚠️ Déjà demandé',
    error: '❌ Erreur : ',
    unreachable: '❌ Seerr inaccessible',
    button: 'Seerr',
    loading: 'Ajout...',
  },
  de: {
    added: '✅ Zu Seerr hinzugefügt',
    exists: '⚠️ Bereits angefragt',
    error: '❌ Fehler: ',
    unreachable: '❌ Seerr nicht erreichbar',
    button: 'Seerr',
    loading: 'Wird hinzugefügt...',
  },
  es: {
    added: '✅ Añadido a Seerr',
    exists: '⚠️ Ya solicitado',
    error: '❌ Error: ',
    unreachable: '❌ Seerr no disponible',
    button: 'Seerr',
    loading: 'Añadiendo...',
  },
  it: {
    added: '✅ Aggiunto a Seerr',
    exists: '⚠️ Già richiesto',
    error: '❌ Errore: ',
    unreachable: '❌ Seerr non raggiungibile',
    button: 'Seerr',
    loading: 'Aggiunta...',
  },
  pt: {
    added: '✅ Adicionado ao Seerr',
    exists: '⚠️ Já solicitado',
    error: '❌ Erro: ',
    unreachable: '❌ Seerr indisponível',
    button: 'Seerr',
    loading: 'A adicionar...',
  },
  ja: {
    added: '✅ Seerrに追加しました',
    exists: '⚠️ すでにリクエスト済み',
    error: '❌ エラー: ',
    unreachable: '❌ Seerrに接続できません',
    button: 'Seerr',
    loading: '追加中...',
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
    method: 'GET',
    url: `${SEERR_URL}/api/v1/movie/${tmdbId}`,
    anonymous: true,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Api-Key': API_KEY
    },
    onload: (res) => {
      let data = {};
      try { data = JSON.parse(res.responseText); } catch (e) { }

      const requests = data.mediaInfo?.requests || [];
      const alreadyRequested = requests.some(r => !r.is4k && r.status !== 3);

      if (alreadyRequested) {
        btn.textContent = '✓ ' + MSG.button;
        btn.style.opacity = '1';
        btn.style.cursor = 'pointer';
        btn.style.background = '#16a34a';
        btn.style.transition = 'transform 0.1s ease';
        const shake = [0, -4, 4, -4, 4, -2, 2, 0];
        shake.forEach((x, i) => {
          setTimeout(() => { btn.style.transform = `translateX(${x}px)`; }, i * 60);
        });
        setTimeout(() => { btn.style.transform = ''; }, shake.length * 60);
        showNotif(MSG.exists + (title ? ' — ' + title : ''), '#d97706');
        return;
      }

      GM_xmlhttpRequest({
        method: 'POST',
        url: `${SEERR_URL}/api/v1/request`,
        anonymous: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Api-Key': API_KEY
        },
        data: JSON.stringify({ mediaType: 'movie', mediaId: parseInt(tmdbId) }),
        onload: (res2) => {
          btn.style.opacity = '1';
          btn.style.cursor = 'pointer';
          let data2 = {};
          try { data2 = JSON.parse(res2.responseText); } catch (e) { }
          if (res2.status === 201) {
            btn.textContent = '✓ ' + MSG.button;
            btn.style.background = '#16a34a';
            showNotif(MSG.added + (title ? ' — ' + title : ''), '#16a34a');
          } else {
            btn.textContent = MSG.button;
            showNotif(MSG.error + (data2.message || `Code ${res2.status}`), '#dc2626');
          }
        },
        onerror: () => {
          btn.textContent = MSG.button;
          btn.style.opacity = '1';
          btn.style.cursor = 'pointer';
          showNotif(MSG.unreachable, '#dc2626');
        }
      });
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
    display: inline-flex;
    align-items: center;
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
    height: 22px;
    line-height: 1;
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