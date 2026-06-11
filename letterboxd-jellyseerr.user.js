// ==UserScript==
// @name         Letterboxd → Jellyseerr
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Add a button to request movies directly on Jellyseerr from Letterboxd
// @author       MAT-GRC
// @match        https://letterboxd.com/film/*
// @grant        GM_xmlhttpRequest
// @connect      *
// @license      MIT
// ==/UserScript==

const JELLYSEERR_URL = 'http://localhost:5055'; // Change to your Jellyseerr URL
const API_KEY = 'YOUR_API_KEY'; // Change to your Jellyseerr API key

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
        showNotif('✅ Movie added to Jellyseerr!', '#22c55e');
      } else if (res.status === 409) {
        showNotif('⚠️ Movie already requested', '#f59e0b');
      } else {
        showNotif('❌ Error: ' + (data.message || res.status), '#ef4444');
      }
    },
    onerror: () => showNotif('❌ Cannot reach Jellyseerr', '#ef4444')
  });
}

function addButton() {
  const tmdbId = getTmdbId();
  if (!tmdbId) return;

  const btn = document.createElement('a');
  btn.textContent = '+ Jellyseerr';
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
    setTimeout(() => btn.textContent = '+ Jellyseerr', 3000);
  };

  const tmdbLink = document.querySelector('a[data-track-action="TMDB"]');
  if (tmdbLink) tmdbLink.parentNode.insertBefore(btn, tmdbLink.nextSibling);
}

window.addEventListener('load', addButton);
