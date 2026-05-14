import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  ShoppingCart, X, Check, ChevronDown, ChevronUp, ChevronRight, ChevronLeft,
  Clock, Trash2, Copy, Send, AlertCircle, Trophy, Lock, LogOut, Plus, Minus,
  Wallet, Receipt, Users, Calendar, Settings as SettingsIcon, BarChart3, Edit2, Star,
} from 'lucide-react';

// =========================================================================
// CONSTANTS
// =========================================================================
const C = {
  bg: '#0E1018', surface: '#1A1D26', surfaceHi: '#252937',
  border: '#2A2D38', borderLight: '#3A3D48',
  accent: '#00D26A', accentDim: '#0fa658',
  text: '#FFFFFF', textMuted: '#9CA3AF', textDim: '#6B7280',
  warning: '#FFB80C', danger: '#EF4444',
};

// --- Supabase (banco de dados na nuvem) ---
const SUPABASE_URL = 'https://spxpzkodexepbbmajwee.supabase.co';
const SUPABASE_KEY = 'sb_publishable_F0Yb-gtn-Ry1_dI95TCnhg_PjWVjSrg';
const STATE_ROW_ID = 'main';
const STORAGE_LOCAL = 'dnbet_me_v1';
const ADMIN_PASSWORD = 'Pacote@2004';
const PIX_KEY = 'f77a4784-c509-4605-a8b3-89c7fb9550b2';
const WHATSAPP_NUMBER = '5561998705655';

const RULES = {
  minStake: 5, maxStake: 200,
  maxSimultaneous: 4, maxMultiple: 3,
  paymentExpiryMin: 30,
};

const FUTURAS_CLOSE_AT = '2026-05-15T18:45:00';
const MATCH_CLOSE_OFFSET_MIN = 10;

// =========================================================================
// SEED DATA
// =========================================================================
const TEAMS = [
  { id: 'bra', name: 'Brasil', code: 'br', short: 'BRA' },
  { id: 'arg', name: 'Argentina', code: 'ar', short: 'ARG' },
  { id: 'esp', name: 'Espanha', code: 'es', short: 'ESP' },
  { id: 'por', name: 'Portugal', code: 'pt', short: 'POR' },
  { id: 'hol', name: 'Holanda', code: 'nl', short: 'HOL' },
  { id: 'fra', name: 'França', code: 'fr', short: 'FRA' },
  { id: 'ale', name: 'Alemanha', code: 'de', short: 'ALE' },
  { id: 'ing', name: 'Inglaterra', code: 'gb', short: 'ING' },
];

const PLAYERS = [
  { id: 'bra_1', name: 'Renato', teamId: 'bra', captain: true },
  { id: 'bra_2', name: 'Gu Haddad', teamId: 'bra' },
  { id: 'bra_3', name: 'Guizin', teamId: 'bra' },
  { id: 'bra_4', name: 'Pedro Augusto', teamId: 'bra' },
  { id: 'bra_5', name: 'Pedro Serra', teamId: 'bra' },
  { id: 'bra_6', name: 'Biel Bessa', teamId: 'bra' },
  { id: 'bra_7', name: 'Nicolas Maciel', teamId: 'bra' },
  { id: 'bra_8', name: 'Vitor Paiva', teamId: 'bra' },
  { id: 'arg_1', name: 'Tarik', teamId: 'arg' },
  { id: 'arg_2', name: 'Tadeu', teamId: 'arg', captain: true },
  { id: 'arg_3', name: 'Henrique', teamId: 'arg' },
  { id: 'arg_4', name: 'Luca Moreira', teamId: 'arg' },
  { id: 'arg_5', name: 'Maumau Fonseca', teamId: 'arg' },
  { id: 'arg_6', name: 'Rico Estrella', teamId: 'arg' },
  { id: 'arg_7', name: 'Bruno de Luca', teamId: 'arg' },
  { id: 'arg_8', name: 'Romarinho', teamId: 'arg' },
  { id: 'esp_1', name: 'Lucas Neves', teamId: 'esp', captain: true },
  { id: 'esp_2', name: 'Luiz Felipe', teamId: 'esp' },
  { id: 'esp_3', name: 'LPO', teamId: 'esp' },
  { id: 'esp_4', name: 'Scooby', teamId: 'esp' },
  { id: 'esp_5', name: 'Santie', teamId: 'esp' },
  { id: 'esp_6', name: 'Gui Casado', teamId: 'esp' },
  { id: 'esp_7', name: 'Raul', teamId: 'esp' },
  { id: 'esp_8', name: 'Henry', teamId: 'esp' },
  { id: 'por_1', name: 'Luiz Gustavo', teamId: 'por' },
  { id: 'por_2', name: 'Matheus Zuba', teamId: 'por', captain: true },
  { id: 'por_3', name: 'João Marra', teamId: 'por' },
  { id: 'por_4', name: 'Dutra Neto', teamId: 'por' },
  { id: 'por_5', name: 'João Xisto', teamId: 'por' },
  { id: 'por_6', name: 'Matheus Castro', teamId: 'por' },
  { id: 'por_7', name: 'Luca Slaviero', teamId: 'por' },
  { id: 'por_8', name: 'Lucas Serra', teamId: 'por' },
  { id: 'hol_1', name: 'Be Haddad', teamId: 'hol', captain: true },
  { id: 'hol_2', name: 'PH', teamId: 'hol' },
  { id: 'hol_3', name: 'Ian Goston', teamId: 'hol' },
  { id: 'hol_4', name: 'Robert', teamId: 'hol' },
  { id: 'hol_5', name: 'João Bruneto', teamId: 'hol' },
  { id: 'hol_6', name: 'Matheus Bittar', teamId: 'hol' },
  { id: 'hol_7', name: 'Enzo Szervinsk', teamId: 'hol' },
  { id: 'hol_8', name: 'Lucas Zuba', teamId: 'hol' },
  { id: 'fra_1', name: 'Corazza', teamId: 'fra', captain: true },
  { id: 'fra_2', name: 'Eric Amaral', teamId: 'fra' },
  { id: 'fra_3', name: 'Carlos Coca', teamId: 'fra' },
  { id: 'fra_4', name: 'Murilo Cury', teamId: 'fra' },
  { id: 'fra_5', name: 'Enzo Queiroz', teamId: 'fra' },
  { id: 'fra_6', name: 'Dudu Paiva', teamId: 'fra' },
  { id: 'fra_7', name: 'Gus Cobra', teamId: 'fra' },
  { id: 'fra_8', name: 'Tamura', teamId: 'fra' },
  { id: 'ale_1', name: 'Mauricio', teamId: 'ale' },
  { id: 'ale_2', name: 'Timbú', teamId: 'ale' },
  { id: 'ale_3', name: 'José Eduardo', teamId: 'ale' },
  { id: 'ale_4', name: 'Walter Araújo', teamId: 'ale' },
  { id: 'ale_5', name: 'Giovani', teamId: 'ale' },
  { id: 'ale_6', name: 'Kauer', teamId: 'ale' },
  { id: 'ale_7', name: 'Augusto Rolemberg', teamId: 'ale' },
  { id: 'ale_8', name: 'Rafinha Zuba', teamId: 'ale' },
  { id: 'ing_1', name: 'Gui Artiaga', teamId: 'ing' },
  { id: 'ing_2', name: 'Pietro', teamId: 'ing' },
  { id: 'ing_3', name: 'Cadu', teamId: 'ing' },
  { id: 'ing_4', name: 'Rafinha ADM', teamId: 'ing', captain: true },
  { id: 'ing_5', name: 'Rafichas', teamId: 'ing' },
  { id: 'ing_6', name: 'Lipe Lopes', teamId: 'ing' },
  { id: 'ing_7', name: 'Edu Estrella', teamId: 'ing' },
  { id: 'ing_8', name: 'Rafa Neves', teamId: 'ing' },
];

// Match catalog with odds
const MATCHES = [
  { id: 'm1',  num: 1,  group: 'Grupo A', datetime: '2026-05-15T19:00:00', teamA: 'bra', teamB: 'ale',
    odds: { vencedor: {home:1.50,draw:1.80,away:1.55}, overGols:{lineOver:'4.5',lineUnder:'3.5',exactValue:'4',over:1.40,under:1.65,exact:2.10}, tempoGols:{primeiro:1.40,empate:1.50,segundo:1.35}, tempoCartoes:{primeiro:1.40,empate:1.20,segundo:1.40}, penalti:{sim:3.50,nao:1.25}, vermelho:{sim:4.00,nao:1.15} }},
  { id: 'm2',  num: 2,  group: 'Grupo A', datetime: '2026-05-15T19:30:00', teamA: 'arg', teamB: 'esp',
    odds: { vencedor: {home:1.75,draw:1.50,away:1.35}, overGols:{lineOver:'4.5',lineUnder:'3.5',exactValue:'4',over:1.50,under:1.65,exact:2.10}, tempoGols:{primeiro:1.40,empate:1.50,segundo:1.35}, tempoCartoes:{primeiro:1.40,empate:1.20,segundo:1.40}, penalti:{sim:3.50,nao:1.25}, vermelho:{sim:4.00,nao:1.15} }},
  { id: 'm3',  num: 3,  group: 'Grupo B', datetime: '2026-05-15T20:00:00', teamA: 'fra', teamB: 'hol',
    odds: { vencedor: {home:1.60,draw:1.70,away:1.35}, overGols:{lineOver:'4.5',lineUnder:'3.5',exactValue:'4',over:1.45,under:1.65,exact:2.10}, tempoGols:{primeiro:1.40,empate:1.50,segundo:1.35}, tempoCartoes:{primeiro:1.40,empate:1.20,segundo:1.40}, penalti:{sim:3.50,nao:1.25}, vermelho:{sim:4.00,nao:1.15} }},
  { id: 'm4',  num: 4,  group: 'Grupo B', datetime: '2026-05-15T20:30:00', teamA: 'ing', teamB: 'por',
    odds: { vencedor: {home:1.70,draw:1.80,away:1.30}, overGols:{lineOver:'4.5',lineUnder:'3.5',exactValue:'4',over:1.45,under:1.65,exact:2.10}, tempoGols:{primeiro:1.40,empate:1.50,segundo:1.35}, tempoCartoes:{primeiro:1.40,empate:1.20,segundo:1.40}, penalti:{sim:3.50,nao:1.25}, vermelho:{sim:4.00,nao:1.15} }},
  { id: 'm5',  num: 5,  group: 'Grupo A', datetime: '2026-05-15T21:00:00', teamA: 'esp', teamB: 'ale',
    odds: { vencedor: {home:1.40,draw:1.50,away:1.45}, overGols:{lineOver:'4.5',lineUnder:'3.5',exactValue:'4',over:1.45,under:1.65,exact:2.10}, tempoGols:{primeiro:1.40,empate:1.50,segundo:1.35}, tempoCartoes:{primeiro:1.40,empate:1.20,segundo:1.40}, penalti:{sim:3.50,nao:1.25}, vermelho:{sim:4.00,nao:1.15} }},
  { id: 'm6',  num: 6,  group: 'Grupo A', datetime: '2026-05-15T21:30:00', teamA: 'bra', teamB: 'arg',
    odds: { vencedor: {home:1.30,draw:1.50,away:1.60}, overGols:{lineOver:'4.5',lineUnder:'3.5',exactValue:'4',over:1.45,under:1.65,exact:2.10}, tempoGols:{primeiro:1.40,empate:1.50,segundo:1.35}, tempoCartoes:{primeiro:1.40,empate:1.20,segundo:1.40}, penalti:{sim:3.50,nao:1.25}, vermelho:{sim:4.00,nao:1.15} }},
  { id: 'm7',  num: 7,  group: 'Grupo B', datetime: '2026-05-15T22:00:00', teamA: 'fra', teamB: 'ing',
    odds: { vencedor: {home:1.35,draw:1.55,away:1.65}, overGols:{lineOver:'4.5',lineUnder:'3.5',exactValue:'4',over:1.45,under:1.65,exact:2.10}, tempoGols:{primeiro:1.40,empate:1.50,segundo:1.35}, tempoCartoes:{primeiro:1.40,empate:1.20,segundo:1.40}, penalti:{sim:3.50,nao:1.25}, vermelho:{sim:4.00,nao:1.15} }},
  { id: 'm8',  num: 8,  group: 'Grupo B', datetime: '2026-05-16T14:00:00', teamA: 'hol', teamB: 'por',
    odds: { vencedor: {home:1.50,draw:1.60,away:1.45}, overGols:{lineOver:'4.5',lineUnder:'3.5',exactValue:'4',over:1.45,under:1.65,exact:2.10}, tempoGols:{primeiro:1.40,empate:1.50,segundo:1.35}, tempoCartoes:{primeiro:1.40,empate:1.20,segundo:1.40}, penalti:{sim:3.50,nao:1.25}, vermelho:{sim:4.00,nao:1.15} }},
  { id: 'm9',  num: 9,  group: 'Grupo A', datetime: '2026-05-16T14:30:00', teamA: 'bra', teamB: 'esp',
    odds: { vencedor: {home:1.45,draw:1.60,away:1.40}, overGols:{lineOver:'4.5',lineUnder:'3.5',exactValue:'4',over:1.45,under:1.65,exact:2.10}, tempoGols:{primeiro:1.40,empate:1.50,segundo:1.35}, tempoCartoes:{primeiro:1.40,empate:1.20,segundo:1.40}, penalti:{sim:3.50,nao:1.25}, vermelho:{sim:4.00,nao:1.15} }},
  { id: 'm10', num: 10, group: 'Grupo A', datetime: '2026-05-16T15:00:00', teamA: 'arg', teamB: 'ale',
    odds: { vencedor: {home:1.75,draw:1.60,away:1.30}, overGols:{lineOver:'4.5',lineUnder:'3.5',exactValue:'4',over:1.45,under:1.65,exact:2.10}, tempoGols:{primeiro:1.40,empate:1.50,segundo:1.35}, tempoCartoes:{primeiro:1.40,empate:1.20,segundo:1.40}, penalti:{sim:3.50,nao:1.25}, vermelho:{sim:4.00,nao:1.15} }},
  { id: 'm11', num: 11, group: 'Grupo B', datetime: '2026-05-16T15:30:00', teamA: 'fra', teamB: 'por',
    odds: { vencedor: {home:1.50,draw:1.60,away:1.45}, overGols:{lineOver:'4.5',lineUnder:'3.5',exactValue:'4',over:1.45,under:1.65,exact:2.10}, tempoGols:{primeiro:1.40,empate:1.50,segundo:1.35}, tempoCartoes:{primeiro:1.40,empate:1.20,segundo:1.40}, penalti:{sim:3.50,nao:1.25}, vermelho:{sim:4.00,nao:1.15} }},
  { id: 'm12', num: 12, group: 'Grupo B', datetime: '2026-05-16T16:00:00', teamA: 'hol', teamB: 'ing',
    odds: { vencedor: {home:1.30,draw:1.50,away:1.65}, overGols:{lineOver:'4.5',lineUnder:'3.5',exactValue:'4',over:1.45,under:1.65,exact:2.10}, tempoGols:{primeiro:1.40,empate:1.50,segundo:1.35}, tempoCartoes:{primeiro:1.40,empate:1.20,segundo:1.40}, penalti:{sim:3.50,nao:1.25}, vermelho:{sim:4.00,nao:1.15} }},
];

const FUT_CAMPEAO = [
  { teamId:'bra',odd:2.80 },{ teamId:'arg',odd:3.50 },{ teamId:'esp',odd:2.50 },{ teamId:'por',odd:2.65 },
  { teamId:'hol',odd:2.70 },{ teamId:'fra',odd:2.75 },{ teamId:'ale',odd:2.65 },{ teamId:'ing',odd:4.00 },
];
const FUT_MELHOR_ATAQUE = [
  { teamId:'bra',odd:1.90 },{ teamId:'arg',odd:2.80 },{ teamId:'esp',odd:1.75 },{ teamId:'por',odd:2.00 },
  { teamId:'hol',odd:1.90 },{ teamId:'fra',odd:2.10 },{ teamId:'ale',odd:1.80 },{ teamId:'ing',odd:2.70 },
];
const FUT_PIOR_DEFESA = [
  { teamId:'bra',odd:1.70 },{ teamId:'arg',odd:1.70 },{ teamId:'esp',odd:1.95 },{ teamId:'por',odd:1.95 },
  { teamId:'hol',odd:1.85 },{ teamId:'fra',odd:1.80 },{ teamId:'ale',odd:1.75 },{ teamId:'ing',odd:1.50 },
];
const FUT_MVP = [
  { playerId:'bra_1',odd:3.00 },{ playerId:'bra_2',odd:4.20 },
  { playerId:'arg_1',odd:3.20 },{ playerId:'arg_2',odd:3.40 },
  { playerId:'esp_1',odd:3.20 },{ playerId:'esp_2',odd:3.20 },{ playerId:'esp_3',odd:3.00 },{ playerId:'esp_4',odd:3.00 },
  { playerId:'por_1',odd:3.00 },{ playerId:'por_2',odd:3.50 },{ playerId:'por_4',odd:4.20 },
  { playerId:'hol_1',odd:3.00 },{ playerId:'hol_2',odd:3.50 },{ playerId:'hol_3',odd:4.00 },
  { playerId:'fra_1',odd:3.00 },{ playerId:'fra_2',odd:3.00 },
  { playerId:'ale_1',odd:2.80 },{ playerId:'ale_3',odd:3.50 },{ playerId:'ale_2',odd:4.20 },{ playerId:'ale_4',odd:3.50 },
  { playerId:'ing_1',odd:3.50 },{ playerId:'ing_2',odd:4.20 },
];
const FUT_FINAL_EXATA = [
  ['bra','arg',6.80],['bra','esp',5.60],['bra','por',5.70],['bra','hol',5.90],['bra','fra',6.10],['bra','ale',5.65],['bra','ing',7.00],
  ['arg','esp',5.80],['arg','por',5.90],['arg','hol',6.00],['arg','fra',6.40],['arg','ale',5.80],['arg','ing',8.00],
  ['esp','por',4.00],['esp','hol',4.10],['esp','fra',4.20],['esp','ale',3.70],['esp','ing',5.60],
  ['por','hol',4.10],['por','fra',4.25],['por','ale',3.70],['por','ing',5.80],
  ['hol','fra',4.20],['hol','ale',4.10],['hol','ing',6.80],
  ['fra','ale',5.60],['fra','ing',7.00],
  ['ale','hol',5.30],
].map(([a,b,odd], i) => ({ id: 'fe_'+i, teamA:a, teamB:b, odd }));

// =========================================================================
// HELPERS
// =========================================================================
const BET_ID_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const newBetId = () => Array.from({length:6}, () => BET_ID_CHARS[Math.floor(Math.random()*BET_ID_CHARS.length)]).join('');
const newId = (p='') => p + Math.random().toString(36).slice(2,10);

const flagUrl = (code) => `https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/4x3/${code}.svg`;
const fmtMoney = (n) => 'R$ ' + Number(n).toFixed(2).replace('.', ',');
const fmtOdd = (n) => Number(n).toFixed(2);
const fmtDateTime = (iso) => {
  const d = new Date(iso);
  return d.toLocaleString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(',', '');
};
const fmtTime = (iso) => new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
const fmtDateShort = (iso) => new Date(iso).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' }).replace(',', '');

const teamById = (id) => TEAMS.find(t => t.id === id);
const playerById = (id) => PLAYERS.find(p => p.id === id);
const matchById = (id) => MATCHES.find(m => m.id === id);

// Returns true if datetime window for this match is still open
const matchOpen = (m, now = Date.now()) => {
  const closeAt = new Date(m.datetime).getTime() - MATCH_CLOSE_OFFSET_MIN * 60 * 1000;
  return now < closeAt;
};
const futurasOpen = (now = Date.now()) => now < new Date(FUTURAS_CLOSE_AT).getTime();

// Phone/CPF masks
const maskPhone = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 7) return `(${d.slice(0,2)}) ${d.slice(2)}`;
  return `(${d.slice(0,2)}) ${d.slice(2,7)}-${d.slice(7)}`;
};
const maskCpf = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0,3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6)}`;
  return `${d.slice(0,3)}.${d.slice(3,6)}.${d.slice(6,9)}-${d.slice(9)}`;
};
const phoneValid = (s) => s.replace(/\D/g,'').length === 11;
const cpfValid = (s) => s.replace(/\D/g,'').length === 11;

// =========================================================================
// STORAGE
// =========================================================================
const emptyState = () => ({
  catalog: {
    matches: MATCHES.map(m => ({ ...m, odds: { ...m.odds } })),
    futures: {
      campeao: FUT_CAMPEAO,
      melhorAtaque: FUT_MELHOR_ATAQUE,
      piorDefesa: FUT_PIOR_DEFESA,
      mvp: FUT_MVP,
      finalExata: FUT_FINAL_EXATA,
    },
  },
  bettors: [],
  bets: [],
  results: { matches: {}, futures: {} },
  settings: { pixKey: PIX_KEY, whatsapp: WHATSAPP_NUMBER, adminPassword: ADMIN_PASSWORD },
});

// loadShared / saveShared: estado compartilhado, vive no Supabase (todos veem o mesmo)
async function loadShared() {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/state?id=eq.${STATE_ROW_ID}&select=data`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
      },
    });
    if (!r.ok) { console.error('loadShared HTTP', r.status); return null; }
    const rows = await r.json();
    if (!rows || rows.length === 0) return null;
    const data = rows[0].data;
    // Linha existe mas ainda vazia ({}): trata como "sem estado"
    if (!data || Object.keys(data).length === 0) return null;
    return data;
  } catch (e) { console.error('loadShared', e); return null; }
}

async function saveShared(data) {
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/state?id=eq.${STATE_ROW_ID}`, {
      method: 'PATCH',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({ data, updated_at: new Date().toISOString() }),
    });
    if (!r.ok) {
      console.error('saveShared HTTP', r.status, await r.text());
      return false;
    }
    return true;
  } catch (e) {
    console.error('saveShared', e);
    return false;
  }
}

// loadMe / saveMe: cadastro do apostador, fica só no navegador dele (por dispositivo)
async function loadMe() {
  try {
    const v = localStorage.getItem(STORAGE_LOCAL);
    if (!v) return null;
    return JSON.parse(v);
  } catch { return null; }
}
async function saveMe(me) {
  try { localStorage.setItem(STORAGE_LOCAL, JSON.stringify(me)); } catch (e) { console.error(e); }
}
async function deleteMe() {
  try { localStorage.removeItem(STORAGE_LOCAL); } catch {}
}

// =========================================================================
// LIQUIDATION LOGIC
// =========================================================================
function evaluateSelection(sel, results, catalog) {
  // Returns 'won' | 'lost' | 'pending' (if no result yet)
  if (sel.kind === 'match') {
    const result = results.matches[sel.matchId];
    if (!result || result.placarA === '' || result.placarA == null) return 'pending';
    const { placarA, placarB, gols1T, gols2T, cartoes1T, cartoes2T, tevePenalti, teveVermelho } = result;
    const pA = Number(placarA), pB = Number(placarB);
    const g1 = Number(gols1T), g2 = Number(gols2T);
    const c1 = Number(cartoes1T), c2 = Number(cartoes2T);
    const total = pA + pB;
    switch (sel.market) {
      case 'vencedor':
        if (sel.option === 'home') return pA > pB ? 'won' : 'lost';
        if (sel.option === 'draw') return pA === pB ? 'won' : 'lost';
        if (sel.option === 'away') return pA < pB ? 'won' : 'lost';
        return 'lost';
      case 'overGols_over': {
        const line = parseFloat(sel.line);
        return total > line ? 'won' : 'lost';
      }
      case 'overGols_under': {
        const line = parseFloat(sel.line);
        return total < line ? 'won' : 'lost';
      }
      case 'overGols_exact': {
        const v = parseFloat(sel.line);
        return total === v ? 'won' : 'lost';
      }
      case 'tempoGols':
        if (sel.option === 'primeiro') return g1 > g2 ? 'won' : 'lost';
        if (sel.option === 'segundo') return g2 > g1 ? 'won' : 'lost';
        if (sel.option === 'empate') return g1 === g2 ? 'won' : 'lost';
        return 'lost';
      case 'tempoCartoes':
        if (sel.option === 'primeiro') return c1 > c2 ? 'won' : 'lost';
        if (sel.option === 'segundo') return c2 > c1 ? 'won' : 'lost';
        if (sel.option === 'empate') return c1 === c2 ? 'won' : 'lost';
        return 'lost';
      case 'penalti':
        return (sel.option === 'sim' ? !!tevePenalti : !tevePenalti) ? 'won' : 'lost';
      case 'vermelho':
        return (sel.option === 'sim' ? !!teveVermelho : !teveVermelho) ? 'won' : 'lost';
      default:
        return 'pending';
    }
  } else {
    // future
    const fr = results.futures;
    switch (sel.futureCategory) {
      case 'campeao':       return fr.campeao ? (fr.campeao === sel.optionValue ? 'won' : 'lost') : 'pending';
      case 'melhorAtaque':  return fr.melhorAtaque ? (fr.melhorAtaque === sel.optionValue ? 'won' : 'lost') : 'pending';
      case 'piorDefesa':    return fr.piorDefesa ? (fr.piorDefesa === sel.optionValue ? 'won' : 'lost') : 'pending';
      case 'mvp':           return fr.mvp ? (fr.mvp === sel.optionValue ? 'won' : 'lost') : 'pending';
      case 'finalExata': {
        if (!fr.finalExataA || !fr.finalExataB) return 'pending';
        const [a, b] = sel.optionValue.split('-');
        const winA = fr.finalExataA, winB = fr.finalExataB;
        return ((a === winA && b === winB) || (a === winB && b === winA)) ? 'won' : 'lost';
      }
      default: return 'pending';
    }
  }
}

function settleBet(bet, results, catalog) {
  if (bet.status !== 'active') return bet;
  const evals = bet.selections.map(s => evaluateSelection(s, results, catalog));
  if (evals.some(e => e === 'pending')) return bet; // wait for more results
  const allWon = evals.every(e => e === 'won');
  if (allWon) {
    return { ...bet, status: 'won', settledAt: new Date().toISOString(), actualReturn: bet.potentialReturn };
  }
  return { ...bet, status: 'lost', settledAt: new Date().toISOString(), actualReturn: 0 };
}

// =========================================================================
// SHARED UI
// =========================================================================
// =========================================================================
// FLAGS (inline SVG, garantem renderização)
// =========================================================================
const FLAG_SVG = {
  br: (
    <svg viewBox="0 0 28 28" preserveAspectRatio="xMidYMid slice" style={{display:'block', width:'100%', height:'100%'}}>
      <rect width="28" height="28" fill="#009C3B"/>
      <polygon points="14,4 24,14 14,24 4,14" fill="#FFDF00"/>
      <circle cx="14" cy="14" r="4.5" fill="#002776"/>
    </svg>
  ),
  ar: (
    <svg viewBox="0 0 28 28" preserveAspectRatio="xMidYMid slice" style={{display:'block', width:'100%', height:'100%'}}>
      <rect width="28" height="9.33" fill="#74ACDF"/>
      <rect y="9.33" width="28" height="9.33" fill="#FFFFFF"/>
      <rect y="18.66" width="28" height="9.34" fill="#74ACDF"/>
      <circle cx="14" cy="14" r="2.4" fill="#F4B400"/>
    </svg>
  ),
  es: (
    <svg viewBox="0 0 28 28" preserveAspectRatio="xMidYMid slice" style={{display:'block', width:'100%', height:'100%'}}>
      <rect width="28" height="7" fill="#AA151B"/>
      <rect y="7" width="28" height="14" fill="#F1BF00"/>
      <rect y="21" width="28" height="7" fill="#AA151B"/>
    </svg>
  ),
  pt: (
    <svg viewBox="0 0 28 28" preserveAspectRatio="xMidYMid slice" style={{display:'block', width:'100%', height:'100%'}}>
      <rect width="11.2" height="28" fill="#006600"/>
      <rect x="11.2" width="16.8" height="28" fill="#CC0000"/>
      <circle cx="11.2" cy="14" r="3" fill="#FFDF00" stroke="#660000" strokeWidth="0.4"/>
    </svg>
  ),
  nl: (
    <svg viewBox="0 0 28 28" preserveAspectRatio="xMidYMid slice" style={{display:'block', width:'100%', height:'100%'}}>
      <rect width="28" height="9.33" fill="#AE1C28"/>
      <rect y="9.33" width="28" height="9.33" fill="#FFFFFF"/>
      <rect y="18.66" width="28" height="9.34" fill="#21468B"/>
    </svg>
  ),
  fr: (
    <svg viewBox="0 0 28 28" preserveAspectRatio="xMidYMid slice" style={{display:'block', width:'100%', height:'100%'}}>
      <rect width="9.33" height="28" fill="#002395"/>
      <rect x="9.33" width="9.33" height="28" fill="#FFFFFF"/>
      <rect x="18.66" width="9.34" height="28" fill="#ED2939"/>
    </svg>
  ),
  de: (
    <svg viewBox="0 0 28 28" preserveAspectRatio="xMidYMid slice" style={{display:'block', width:'100%', height:'100%'}}>
      <rect width="28" height="9.33" fill="#000000"/>
      <rect y="9.33" width="28" height="9.33" fill="#DD0000"/>
      <rect y="18.66" width="28" height="9.34" fill="#FFCE00"/>
    </svg>
  ),
  gb: (
    <svg viewBox="0 0 28 28" preserveAspectRatio="xMidYMid slice" style={{display:'block', width:'100%', height:'100%'}}>
      <rect width="28" height="28" fill="#012169"/>
      <line x1="0" y1="0" x2="28" y2="28" stroke="#FFFFFF" strokeWidth="5"/>
      <line x1="28" y1="0" x2="0" y2="28" stroke="#FFFFFF" strokeWidth="5"/>
      <line x1="0" y1="0" x2="28" y2="28" stroke="#C8102E" strokeWidth="2"/>
      <line x1="28" y1="0" x2="0" y2="28" stroke="#C8102E" strokeWidth="2"/>
      <rect x="11" width="6" height="28" fill="#FFFFFF"/>
      <rect y="11" width="28" height="6" fill="#FFFFFF"/>
      <rect x="12.5" width="3" height="28" fill="#C8102E"/>
      <rect y="12.5" width="28" height="3" fill="#C8102E"/>
    </svg>
  ),
};

function Flag({ code, size = 18 }) {
  const svg = FLAG_SVG[code];
  return (
    <span style={{
      display:'inline-block', width:size, height:size, borderRadius:'50%',
      overflow:'hidden', verticalAlign:'-3px', flexShrink:0,
      border:'1px solid rgba(255,255,255,0.12)', lineHeight:0,
      background: '#333',
    }}>
      {svg}
    </span>
  );
}

function Logo({ small = false }) {
  return (
    <div style={{ display:'flex', alignItems:'baseline', gap:8 }}>
      <div style={{ color:'white', fontSize: small?18:22, fontWeight:700, letterSpacing:'-0.03em', lineHeight:1 }}>
        DN<span style={{ color:C.accent }}>Bet</span>
      </div>
      <div style={{ fontSize: small?9:10, color:C.textMuted, letterSpacing:'0.18em', textTransform:'uppercase', fontWeight:500 }}>
        Rolemberg '26
      </div>
    </div>
  );
}

function OddButton({ label, value, selected, disabled, onClick, fullWidth }) {
  if (!value) return null;
  const bg = selected ? C.accent : C.surfaceHi;
  const borderColor = selected ? C.accent : C.border;
  const textColor = selected ? C.bg : C.text;
  const valueColor = selected ? C.bg : C.accent;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: bg, border:`1px solid ${borderColor}`, padding:'10px 6px',
        borderRadius:8, textAlign:'center', cursor: disabled?'not-allowed':'pointer',
        opacity: disabled?0.4:1, transition:'all 0.15s',
        display:'flex', flexDirection:'column', gap:3,
        flex: fullWidth ? '1 1 auto' : '0 1 auto', minWidth: 0,
      }}
    >
      <div style={{ fontSize:11, color: selected ? C.bg : C.textMuted, fontWeight: selected?600:400, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{label}</div>
      <div style={{ fontSize:15, color: valueColor, fontWeight:700 }}>{fmtOdd(value)}</div>
    </button>
  );
}

function Pill({ children, color = 'muted' }) {
  const map = {
    green: { bg: 'rgba(0,210,106,0.15)', fg: C.accent },
    amber: { bg: 'rgba(255,184,12,0.15)', fg: C.warning },
    red: { bg: 'rgba(239,68,68,0.15)', fg: C.danger },
    muted: { bg: C.surfaceHi, fg: C.textMuted },
  };
  const s = map[color] || map.muted;
  return <span style={{ background:s.bg, color:s.fg, fontSize:10, padding:'3px 8px', borderRadius:4, textTransform:'uppercase', letterSpacing:'0.08em', fontWeight:600, display:'inline-block' }}>{children}</span>;
}

function PrimaryButton({ children, onClick, disabled, full, secondary }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      background: secondary ? 'transparent' : C.accent,
      color: secondary ? C.text : C.bg,
      border: secondary ? `1px solid ${C.border}` : 'none',
      padding: '12px 16px', borderRadius: 8, fontWeight: 600, fontSize: 14,
      cursor: disabled?'not-allowed':'pointer', opacity: disabled?0.5:1,
      width: full ? '100%' : 'auto', display:'inline-flex', alignItems:'center', justifyContent:'center', gap:6,
      transition: 'opacity 0.15s',
    }}>{children}</button>
  );
}

// =========================================================================
// ONBOARDING
// =========================================================================
function Onboarding({ onSubmit, onAdminEnter }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [cpf, setCpf] = useState('');
  const [accepted, setAccepted] = useState(false);
  const [showRules, setShowRules] = useState(false);

  const valid = name.trim().length >= 2 && phoneValid(phone) && cpfValid(cpf) && accepted;

  const missing = [];
  if (name.trim().length < 2) missing.push('nome');
  if (!phoneValid(phone)) missing.push('telefone (11 dígitos)');
  if (!cpfValid(cpf)) missing.push('CPF (11 dígitos)');
  if (!accepted) missing.push('aceite das regras');

  const handle = () => {
    if (!valid) return;
    onSubmit({
      name: name.trim(),
      phone: phone.replace(/\D/g, ''),
      cpf: cpf.replace(/\D/g, ''),
    });
  };

  const inputStyle = {
    background: C.surface, border: `1px solid ${C.border}`, color: C.text,
    padding: '12px 14px', borderRadius: 8, fontSize: 15, width: '100%',
    outline: 'none', fontFamily: 'inherit',
  };

  return (
    <div style={{ minHeight: '100vh', background: C.bg, padding: '32px 20px', display:'flex', flexDirection:'column' }}>
      <div style={{ textAlign:'center', marginTop: 40, marginBottom: 32 }}>
        <div style={{ color: C.text, fontSize: 36, fontWeight: 700, letterSpacing: '-0.03em' }}>
          DN<span style={{ color: C.accent }}>Bet</span>
        </div>
        <div style={{ fontSize: 11, color: C.textMuted, letterSpacing: '0.22em', textTransform: 'uppercase', marginTop: 6 }}>
          Copa do Mundo Rolemberg 2026
        </div>
      </div>

      <div style={{ flex: 1, maxWidth: 420, margin: '0 auto', width: '100%' }}>
        <h2 style={{ color: C.text, fontSize: 18, fontWeight: 600, marginBottom: 24 }}>Bem-vindo ao bolão</h2>

        <div style={{ marginBottom: 14 }}>
          <label style={{ display:'block', fontSize: 12, color: C.textMuted, marginBottom: 6, textTransform:'uppercase', letterSpacing:'0.08em', fontWeight:500 }}>Nome</label>
          <input style={inputStyle} value={name} onChange={e => setName(e.target.value)} placeholder="Seu nome" />
        </div>

        <div style={{ marginBottom: 14 }}>
          <label style={{ display:'block', fontSize: 12, color: C.textMuted, marginBottom: 6, textTransform:'uppercase', letterSpacing:'0.08em', fontWeight:500 }}>Telefone</label>
          <input style={inputStyle} value={phone} onChange={e => setPhone(maskPhone(e.target.value))} placeholder="(61) 99870-5655" inputMode="numeric" />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display:'block', fontSize: 12, color: C.textMuted, marginBottom: 6, textTransform:'uppercase', letterSpacing:'0.08em', fontWeight:500 }}>CPF</label>
          <input style={inputStyle} value={cpf} onChange={e => setCpf(maskCpf(e.target.value))} placeholder="000.000.000-00" inputMode="numeric" />
        </div>

        <label style={{ display:'flex', alignItems:'flex-start', gap:10, cursor:'pointer', marginBottom: 12 }}>
          <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} style={{ marginTop:3, accentColor: C.accent }} />
          <span style={{ fontSize: 13, color: C.textMuted, lineHeight: 1.5 }}>
            Li e aceito as regras do bolão. <button type="button" onClick={() => setShowRules(!showRules)} style={{ color: C.accent, background:'none', border:'none', padding:0, cursor:'pointer', fontSize: 13, textDecoration:'underline' }}>{showRules ? 'esconder' : 'ver regras'}</button>
          </span>
        </label>

        {showRules && (
          <div style={{ background: C.surface, border:`1px solid ${C.border}`, borderRadius: 8, padding: 14, marginBottom: 16, fontSize: 12, color: C.textMuted, lineHeight: 1.7 }}>
            <div style={{ marginBottom:6 }}>• Valor mínimo por aposta: <strong style={{color:C.text}}>R$ 5</strong> · máximo: <strong style={{color:C.text}}>R$ 200</strong></div>
            <div style={{ marginBottom:6 }}>• Até <strong style={{color:C.text}}>4 apostas simultâneas</strong> (aguardando pagamento + ativas)</div>
            <div style={{ marginBottom:6 }}>• Múltiplas: até <strong style={{color:C.text}}>3 seleções</strong>. Não pode misturar futuras com partidas</div>
            <div style={{ marginBottom:6 }}>• Apostas futuras (campeão, MVP, etc.) fecham <strong style={{color:C.text}}>15min antes do primeiro jogo</strong> de sexta</div>
            <div style={{ marginBottom:6 }}>• Cada jogo fecha <strong style={{color:C.text}}>10min antes do horário previsto</strong></div>
            <div style={{ marginBottom:6 }}>• Após confirmar a aposta, você tem <strong style={{color:C.text}}>30min</strong> pra fazer o PIX e enviar o comprovante</div>
            <div>• Apostas em <strong style={{color:C.text}}>Pênalti e Cartões</strong> podem ser revisadas. Em caso de suspeita de manipulação, a aposta é anulada e o valor devolvido. Se a manipulação for confirmada, o apostador perde o valor apostado</div>
          </div>
        )}

        <PrimaryButton full onClick={handle} disabled={!valid}>Entrar</PrimaryButton>

        {!valid && missing.length > 0 && (
          <div style={{ marginTop: 10, fontSize: 12, color: C.warning, textAlign: 'center' }}>
            Falta preencher: {missing.join(', ')}
          </div>
        )}

        <div style={{ marginTop: 24, fontSize: 11, color: C.textDim, textAlign:'center' }}>
          Bolão entre amigos · Atividade lícita e sem fins lucrativos
        </div>

        <div style={{ marginTop: 16, textAlign: 'center', paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
          <button onClick={onAdminEnter} style={{
            background:'none', border:'none', color: C.textDim, fontSize: 11,
            cursor:'pointer', fontFamily:'inherit', letterSpacing:'0.06em', padding: 6,
            display:'inline-flex', alignItems:'center', gap: 5,
          }}>
            <Lock size={11} /> Acesso admin
          </button>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// MATCH CARD
// =========================================================================
function MatchCard({ match, cart, onToggle, onExpand, expanded, isOpen }) {
  const tA = teamById(match.teamA);
  const tB = teamById(match.teamB);
  const o = match.odds;

  const isSelected = (sel) => cart.some(s => s.uid === sel.uid);

  const matchSel = (market, option, odd, label, extra = {}) => ({
    uid: `${match.id}::${market}::${option}`,
    kind: 'match', matchId: match.id,
    market, option, odd, label,
    matchLabel: `${tA.name} × ${tB.name}`,
    ...extra,
  });

  const handleOdd = (sel) => { if (!isOpen) return; onToggle(sel); };

  return (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, marginBottom: 10, opacity: isOpen ? 1 : 0.55 }}>
      <button onClick={() => onExpand(match.id)} disabled={!isOpen} style={{
        width: '100%', background: 'transparent', border: 'none', padding: 0, cursor: isOpen?'pointer':'not-allowed',
        textAlign: 'left', color: C.text, fontFamily: 'inherit',
      }}>
        <div style={{ padding: '8px 12px', display:'flex', justifyContent:'space-between', alignItems:'center', borderBottom: expanded ? `1px solid ${C.border}` : 'none' }}>
          <Pill color={isOpen ? 'green' : 'muted'}>{match.group}</Pill>
          <div style={{ display:'flex', alignItems:'center', gap:8, fontSize: 11, color: C.textMuted }}>
            {!isOpen && <Pill color="muted">Encerrado</Pill>}
            <span><Clock size={11} style={{ verticalAlign: '-1px', marginRight: 3 }} />{fmtDateShort(match.datetime)} · {fmtTime(match.datetime)}</span>
          </div>
        </div>
        <div style={{ padding: '10px 12px', display:'flex', justifyContent:'space-between', alignItems:'center', gap: 10 }}>
          <div style={{ display:'flex', alignItems:'center', gap: 14, flex: 1, minWidth: 0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:6, minWidth:0 }}>
              <Flag code={tA.code} size={20} />
              <span style={{ fontSize: 15, fontWeight: 500, color: C.text }}>{tA.name}</span>
            </div>
            <span style={{ fontSize: 11, color: C.textDim, fontWeight: 500 }}>VS</span>
            <div style={{ display:'flex', alignItems:'center', gap:6, minWidth:0 }}>
              <Flag code={tB.code} size={20} />
              <span style={{ fontSize: 15, fontWeight: 500, color: C.text }}>{tB.name}</span>
            </div>
          </div>
          <div style={{ color: C.textMuted }}>
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </div>
      </button>

      {/* Vencedor sempre visível quando o card está fechado */}
      {!expanded && o.vencedor && (o.vencedor.home || o.vencedor.draw || o.vencedor.away) && (
        <div style={{ padding: '0 12px 12px' }}>
          <div style={{ fontSize: 10, color: C.textMuted, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom: 6 }}>Vencedor</div>
          <div style={{ display:'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
            <OddButton label={tA.name} value={o.vencedor.home}
              selected={isSelected(matchSel('vencedor','home',o.vencedor.home, `${tA.name} vence`))}
              onClick={() => handleOdd(matchSel('vencedor','home',o.vencedor.home, `${tA.name} vence`))} disabled={!isOpen} />
            <OddButton label="Empate" value={o.vencedor.draw}
              selected={isSelected(matchSel('vencedor','draw',o.vencedor.draw, 'Empate'))}
              onClick={() => handleOdd(matchSel('vencedor','draw',o.vencedor.draw, 'Empate'))} disabled={!isOpen} />
            <OddButton label={tB.name} value={o.vencedor.away}
              selected={isSelected(matchSel('vencedor','away',o.vencedor.away, `${tB.name} vence`))}
              onClick={() => handleOdd(matchSel('vencedor','away',o.vencedor.away, `${tB.name} vence`))} disabled={!isOpen} />
          </div>
        </div>
      )}

      {expanded && (
        <div style={{ padding: '12px' }}>
          {/* Vencedor */}
          {o.vencedor && (o.vencedor.home || o.vencedor.draw || o.vencedor.away) && (
            <Market label="Vencedor">
              <OddButton label={tA.name} value={o.vencedor.home}
                selected={isSelected(matchSel('vencedor','home',o.vencedor.home,`${tA.name} vence`))}
                onClick={() => handleOdd(matchSel('vencedor','home',o.vencedor.home,`${tA.name} vence`))} disabled={!isOpen} />
              <OddButton label="Empate" value={o.vencedor.draw}
                selected={isSelected(matchSel('vencedor','draw',o.vencedor.draw,'Empate'))}
                onClick={() => handleOdd(matchSel('vencedor','draw',o.vencedor.draw,'Empate'))} disabled={!isOpen} />
              <OddButton label={tB.name} value={o.vencedor.away}
                selected={isSelected(matchSel('vencedor','away',o.vencedor.away,`${tB.name} vence`))}
                onClick={() => handleOdd(matchSel('vencedor','away',o.vencedor.away,`${tB.name} vence`))} disabled={!isOpen} />
            </Market>
          )}

          {/* Total Gols */}
          {o.overGols && (o.overGols.over || o.overGols.under || o.overGols.exact) && (
            <Market label="Total de Gols">
              <OddButton label={`Over ${o.overGols.lineOver}`} value={o.overGols.over}
                selected={isSelected(matchSel('overGols_over','over',o.overGols.over,`Over ${o.overGols.lineOver} gols`,{line:o.overGols.lineOver}))}
                onClick={() => handleOdd(matchSel('overGols_over','over',o.overGols.over,`Over ${o.overGols.lineOver} gols`,{line:o.overGols.lineOver}))} disabled={!isOpen} />
              <OddButton label={`Under ${o.overGols.lineUnder}`} value={o.overGols.under}
                selected={isSelected(matchSel('overGols_under','under',o.overGols.under,`Under ${o.overGols.lineUnder} gols`,{line:o.overGols.lineUnder}))}
                onClick={() => handleOdd(matchSel('overGols_under','under',o.overGols.under,`Under ${o.overGols.lineUnder} gols`,{line:o.overGols.lineUnder}))} disabled={!isOpen} />
              <OddButton label={`Exato ${o.overGols.exactValue}`} value={o.overGols.exact}
                selected={isSelected(matchSel('overGols_exact','exact',o.overGols.exact,`Exato ${o.overGols.exactValue} gols`,{line:o.overGols.exactValue}))}
                onClick={() => handleOdd(matchSel('overGols_exact','exact',o.overGols.exact,`Exato ${o.overGols.exactValue} gols`,{line:o.overGols.exactValue}))} disabled={!isOpen} />
            </Market>
          )}

          {/* Tempo Mais Gols */}
          {o.tempoGols && (o.tempoGols.primeiro || o.tempoGols.empate || o.tempoGols.segundo) && (
            <Market label="Tempo com Mais Gols">
              <OddButton label="1º Tempo" value={o.tempoGols.primeiro}
                selected={isSelected(matchSel('tempoGols','primeiro',o.tempoGols.primeiro,'1º Tempo mais gols'))}
                onClick={() => handleOdd(matchSel('tempoGols','primeiro',o.tempoGols.primeiro,'1º Tempo mais gols'))} disabled={!isOpen} />
              <OddButton label="Empate" value={o.tempoGols.empate}
                selected={isSelected(matchSel('tempoGols','empate',o.tempoGols.empate,'Empate em gols por tempo'))}
                onClick={() => handleOdd(matchSel('tempoGols','empate',o.tempoGols.empate,'Empate em gols por tempo'))} disabled={!isOpen} />
              <OddButton label="2º Tempo" value={o.tempoGols.segundo}
                selected={isSelected(matchSel('tempoGols','segundo',o.tempoGols.segundo,'2º Tempo mais gols'))}
                onClick={() => handleOdd(matchSel('tempoGols','segundo',o.tempoGols.segundo,'2º Tempo mais gols'))} disabled={!isOpen} />
            </Market>
          )}

          {/* Tempo Mais Cartões */}
          {o.tempoCartoes && (o.tempoCartoes.primeiro || o.tempoCartoes.empate || o.tempoCartoes.segundo) && (
            <Market label="Tempo com Mais Cartões">
              <OddButton label="1º Tempo" value={o.tempoCartoes.primeiro}
                selected={isSelected(matchSel('tempoCartoes','primeiro',o.tempoCartoes.primeiro,'1º Tempo mais cartões'))}
                onClick={() => handleOdd(matchSel('tempoCartoes','primeiro',o.tempoCartoes.primeiro,'1º Tempo mais cartões'))} disabled={!isOpen} />
              <OddButton label="Empate" value={o.tempoCartoes.empate}
                selected={isSelected(matchSel('tempoCartoes','empate',o.tempoCartoes.empate,'Empate em cartões por tempo'))}
                onClick={() => handleOdd(matchSel('tempoCartoes','empate',o.tempoCartoes.empate,'Empate em cartões por tempo'))} disabled={!isOpen} />
              <OddButton label="2º Tempo" value={o.tempoCartoes.segundo}
                selected={isSelected(matchSel('tempoCartoes','segundo',o.tempoCartoes.segundo,'2º Tempo mais cartões'))}
                onClick={() => handleOdd(matchSel('tempoCartoes','segundo',o.tempoCartoes.segundo,'2º Tempo mais cartões'))} disabled={!isOpen} />
            </Market>
          )}

          {/* Pênalti */}
          {o.penalti && (o.penalti.sim || o.penalti.nao) && (
            <Market label="Pênalti na Partida">
              <OddButton label="Sim" value={o.penalti.sim}
                selected={isSelected(matchSel('penalti','sim',o.penalti.sim,'Pênalti SIM'))}
                onClick={() => handleOdd(matchSel('penalti','sim',o.penalti.sim,'Pênalti SIM'))} disabled={!isOpen} />
              <OddButton label="Não" value={o.penalti.nao}
                selected={isSelected(matchSel('penalti','nao',o.penalti.nao,'Pênalti NÃO'))}
                onClick={() => handleOdd(matchSel('penalti','nao',o.penalti.nao,'Pênalti NÃO'))} disabled={!isOpen} />
            </Market>
          )}

          {/* Cartão Vermelho */}
          {o.vermelho && (o.vermelho.sim || o.vermelho.nao) && (
            <Market label="Cartão Vermelho">
              <OddButton label="Sim" value={o.vermelho.sim}
                selected={isSelected(matchSel('vermelho','sim',o.vermelho.sim,'Cartão Vermelho SIM'))}
                onClick={() => handleOdd(matchSel('vermelho','sim',o.vermelho.sim,'Cartão Vermelho SIM'))} disabled={!isOpen} />
              <OddButton label="Não" value={o.vermelho.nao}
                selected={isSelected(matchSel('vermelho','nao',o.vermelho.nao,'Cartão Vermelho NÃO'))}
                onClick={() => handleOdd(matchSel('vermelho','nao',o.vermelho.nao,'Cartão Vermelho NÃO'))} disabled={!isOpen} />
            </Market>
          )}
        </div>
      )}
    </div>
  );
}

function Market({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 10, color: C.textMuted, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom: 6, fontWeight: 500 }}>{label}</div>
      <div style={{ display:'grid', gridTemplateColumns: React.Children.count(children) === 2 ? '1fr 1fr' : 'repeat(3, 1fr)', gap: 6 }}>
        {children}
      </div>
    </div>
  );
}

// =========================================================================
// MATCHES TAB
// =========================================================================
function MatchesTab({ catalog, cart, onToggle, now }) {
  const [expandedId, setExpandedId] = useState(null);
  const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

  // Group by day
  const byDay = useMemo(() => {
    const m = {};
    catalog.matches.forEach(match => {
      const day = match.datetime.slice(0, 10);
      if (!m[day]) m[day] = [];
      m[day].push(match);
    });
    return m;
  }, [catalog.matches]);

  return (
    <div>
      {Object.entries(byDay).map(([day, matches]) => (
        <div key={day} style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 11, color: C.textMuted, textTransform:'uppercase', letterSpacing:'0.12em', marginBottom: 10, fontWeight: 500 }}>
            {new Date(day + 'T12:00').toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
          </div>
          {matches.map(m => (
            <MatchCard
              key={m.id} match={m} cart={cart} onToggle={onToggle}
              onExpand={toggleExpand} expanded={expandedId === m.id}
              isOpen={matchOpen(m, now)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// =========================================================================
// FUTURES TAB
// =========================================================================
function FuturesTab({ catalog, cart, onToggle, now }) {
  const isOpen = futurasOpen(now);
  const isSelected = (sel) => cart.some(s => s.uid === sel.uid);

  if (!isOpen) {
    return (
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 30, textAlign:'center' }}>
        <Lock size={32} color={C.textDim} style={{ marginBottom: 10 }} />
        <div style={{ color: C.text, fontSize: 15, fontWeight: 500, marginBottom: 4 }}>Mercado futuro encerrado</div>
        <div style={{ color: C.textMuted, fontSize: 13 }}>Fechou 15min antes do primeiro jogo de sexta.</div>
      </div>
    );
  }

  const FutureTeamSection = ({ title, category, items }) => (
    <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, marginBottom: 10 }}>
      <div style={{ padding: '10px 12px', borderBottom: `1px solid ${C.border}`, display:'flex', alignItems:'center', gap:8 }}>
        <Trophy size={14} color={C.accent} />
        <div style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>{title}</div>
      </div>
      <div style={{ padding: 12, display:'grid', gridTemplateColumns:'repeat(2, 1fr)', gap: 6 }}>
        {items.map(it => {
          const team = teamById(it.teamId);
          if (!team) return null;
          const sel = {
            uid: `future::${category}::${it.teamId}`,
            kind: 'future', futureCategory: category,
            market: category, option: 'team', optionValue: it.teamId,
            odd: it.odd, label: `${title}: ${team.name}`,
            matchLabel: title,
          };
          return (
            <button key={it.teamId} onClick={() => onToggle(sel)} disabled={!isOpen}
              style={{
                background: isSelected(sel) ? C.accent : C.surfaceHi,
                border: `1px solid ${isSelected(sel) ? C.accent : C.border}`,
                borderRadius: 8, padding: '8px 10px',
                display:'flex', alignItems:'center', gap: 8, cursor:'pointer',
                color: isSelected(sel) ? C.bg : C.text, fontFamily:'inherit',
                transition: 'all 0.15s',
              }}>
              <Flag code={team.code} size={16} />
              <span style={{ flex: 1, textAlign:'left', fontSize: 13, fontWeight: 500 }}>{team.name}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: isSelected(sel) ? C.bg : C.accent }}>{fmtOdd(it.odd)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div>
      <FutureTeamSection title="Campeão do Torneio" category="campeao" items={catalog.futures.campeao} />
      <FutureTeamSection title="Melhor Ataque (Grupos)" category="melhorAtaque" items={catalog.futures.melhorAtaque} />
      <FutureTeamSection title="Pior Defesa" category="piorDefesa" items={catalog.futures.piorDefesa} />

      {/* MVP */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, marginBottom: 10 }}>
        <div style={{ padding: '10px 12px', borderBottom: `1px solid ${C.border}`, display:'flex', alignItems:'center', gap:8 }}>
          <Star size={14} color={C.warning} />
          <div style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>MVP do Torneio</div>
        </div>
        <div style={{ padding: 8 }}>
          {catalog.futures.mvp.map(it => {
            const pl = playerById(it.playerId);
            if (!pl) return null;
            const team = teamById(pl.teamId);
            const sel = {
              uid: `future::mvp::${pl.id}`,
              kind: 'future', futureCategory: 'mvp',
              market: 'mvp', option: 'player', optionValue: pl.id,
              odd: it.odd, label: `MVP: ${pl.name}`,
              matchLabel: 'MVP do Torneio',
            };
            return (
              <button key={pl.id} onClick={() => onToggle(sel)} disabled={!isOpen}
                style={{
                  width:'100%', background: isSelected(sel) ? C.accent : 'transparent',
                  border: `1px solid ${isSelected(sel) ? C.accent : 'transparent'}`,
                  borderRadius: 6, padding: '8px 10px',
                  display:'flex', alignItems:'center', gap: 8, cursor:'pointer',
                  color: isSelected(sel) ? C.bg : C.text, fontFamily:'inherit',
                  marginBottom: 2,
                }}>
                <Flag code={team.code} size={14} />
                <div style={{ flex: 1, textAlign:'left', fontSize: 13 }}>
                  <div style={{ fontWeight: 500 }}>{pl.name}</div>
                  <div style={{ fontSize: 10, color: isSelected(sel) ? 'rgba(14,16,24,0.7)' : C.textMuted }}>{team.name}</div>
                </div>
                <span style={{ fontSize: 14, fontWeight: 700, color: isSelected(sel) ? C.bg : C.accent }}>{fmtOdd(it.odd)}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Final Exata */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, marginBottom: 10 }}>
        <div style={{ padding: '10px 12px', borderBottom: `1px solid ${C.border}`, display:'flex', alignItems:'center', gap:8 }}>
          <Trophy size={14} color={C.warning} />
          <div style={{ color: C.text, fontSize: 13, fontWeight: 600 }}>Final Exata</div>
        </div>
        <div style={{ padding: 8 }}>
          {catalog.futures.finalExata.map(fe => {
            const tA = teamById(fe.teamA), tB = teamById(fe.teamB);
            if (!tA || !tB) return null;
            const sel = {
              uid: `future::finalExata::${fe.id}`,
              kind: 'future', futureCategory: 'finalExata',
              market: 'finalExata', option: 'pair', optionValue: `${fe.teamA}-${fe.teamB}`,
              odd: fe.odd, label: `Final: ${tA.name} × ${tB.name}`,
              matchLabel: 'Final Exata',
            };
            return (
              <button key={fe.id} onClick={() => onToggle(sel)} disabled={!isOpen}
                style={{
                  width:'100%', background: isSelected(sel) ? C.accent : 'transparent',
                  border: `1px solid ${isSelected(sel) ? C.accent : 'transparent'}`,
                  borderRadius: 6, padding: '8px 10px',
                  display:'flex', alignItems:'center', gap: 8, cursor:'pointer',
                  color: isSelected(sel) ? C.bg : C.text, fontFamily:'inherit',
                  marginBottom: 2,
                }}>
                <Flag code={tA.code} size={14} />
                <span style={{ fontSize: 13, fontWeight: 500 }}>{tA.name}</span>
                <span style={{ fontSize: 11, color: isSelected(sel) ? 'rgba(14,16,24,0.7)' : C.textDim }}>×</span>
                <Flag code={tB.code} size={14} />
                <span style={{ fontSize: 13, fontWeight: 500, flex: 1, textAlign:'left' }}>{tB.name}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: isSelected(sel) ? C.bg : C.accent }}>{fmtOdd(fe.odd)}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// CART
// =========================================================================
function Cart({ cart, onRemove, onClear, onClose, onConfirm, state, me }) {
  const [type, setType] = useState('simple');
  const [stake, setStake] = useState('');

  // Validations
  const hasFuture = cart.some(s => s.kind === 'future');
  const hasMatch = cart.some(s => s.kind === 'match');
  const mixedKinds = hasFuture && hasMatch;
  const tooManyForMultiple = cart.length > RULES.maxMultiple;
  const canMultiple = cart.length >= 2 && !mixedKinds && !tooManyForMultiple;

  const myBets = state.bets.filter(b => b.bettorId === me.id);
  const simultaneousCount = myBets.filter(b => b.status === 'pending_payment' || b.status === 'active').length;

  const stakeNum = parseFloat(stake.replace(',', '.')) || 0;
  const productOdd = cart.reduce((a, s) => a * s.odd, 1);

  let totalOdd, potentialReturn, betCount, modeLabel;
  if (type === 'simple') {
    totalOdd = null;
    potentialReturn = cart.reduce((a, s) => a + stakeNum * s.odd, 0);
    betCount = cart.length;
    modeLabel = cart.length === 1 ? '1 aposta simples' : `${cart.length} apostas simples`;
  } else {
    totalOdd = productOdd;
    potentialReturn = stakeNum * productOdd;
    betCount = 1;
    modeLabel = `Múltipla · ${cart.length} seleções`;
  }
  const totalCost = stakeNum * betCount;

  const wouldExceed = simultaneousCount + betCount > RULES.maxSimultaneous;

  const errors = [];
  if (mixedKinds) errors.push('Não pode misturar futuras com partidas. Faça duas apostas separadas.');
  if (type === 'multiple' && cart.length > RULES.maxMultiple) errors.push(`Múltipla aceita até ${RULES.maxMultiple} seleções. Remova ${cart.length - RULES.maxMultiple} para continuar.`);
  if (stakeNum < RULES.minStake) errors.push(`Valor mínimo R$ ${RULES.minStake}.`);
  if (stakeNum > RULES.maxStake) errors.push(`Valor máximo R$ ${RULES.maxStake}.`);
  if (wouldExceed) errors.push(`Excede o limite de ${RULES.maxSimultaneous} apostas simultâneas (${simultaneousCount} ativa(s)).`);
  if (cart.length === 0) errors.push('Carrinho vazio.');

  const valid = errors.length === 0;

  const handleConfirm = () => {
    if (!valid) return;
    onConfirm({ type, stake: stakeNum, totalOdd, potentialReturn, betCount });
  };

  return (
    <div style={{
      position:'fixed', inset: 0, background:'rgba(0,0,0,0.5)', zIndex: 100,
      display:'flex', alignItems:'flex-end', justifyContent:'center',
    }}>
      <div style={{
        background: C.bg, borderTop: `1px solid ${C.border}`,
        borderRadius: '16px 16px 0 0', width: '100%', maxWidth: 500, maxHeight: '88vh',
        display:'flex', flexDirection: 'column', overflow:'hidden',
      }}>
        <div style={{ padding: '14px 18px', borderBottom: `1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
            <ShoppingCart size={18} color={C.accent} />
            <div style={{ color: C.text, fontSize: 15, fontWeight: 600 }}>Carrinho</div>
            <div style={{ fontSize: 11, color: C.textMuted, background: C.surfaceHi, padding: '2px 8px', borderRadius: 4 }}>{cart.length}</div>
          </div>
          <button onClick={onClose} style={{ background:'none', border:'none', color: C.textMuted, cursor:'pointer', padding: 4 }}><X size={20} /></button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: 14 }}>
          {cart.length === 0 ? (
            <div style={{ textAlign:'center', padding: 30, color: C.textMuted, fontSize: 13 }}>
              Toque numa odd para começar.
            </div>
          ) : (
            cart.map(s => (
              <div key={s.uid} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 10, marginBottom: 6, display:'flex', alignItems:'center', gap: 10 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, color: C.textMuted, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom: 2 }}>{s.matchLabel}</div>
                  <div style={{ color: C.text, fontSize: 13, fontWeight: 500 }}>{s.label}</div>
                </div>
                <div style={{ color: C.accent, fontSize: 14, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{fmtOdd(s.odd)}</div>
                <button onClick={() => onRemove(s.uid)} style={{ background:'none', border:'none', color: C.textDim, cursor:'pointer', padding: 4 }}><X size={14} /></button>
              </div>
            ))
          )}

          {cart.length >= 2 && (
            <div style={{ marginTop: 14 }}>
              <div style={{ display:'flex', gap: 6, background: C.surface, padding: 4, borderRadius: 8, border: `1px solid ${C.border}` }}>
                <button onClick={() => setType('simple')} style={{
                  flex: 1, padding: '10px', background: type === 'simple' ? C.surfaceHi : 'transparent',
                  color: type === 'simple' ? C.text : C.textMuted,
                  border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor:'pointer', fontFamily:'inherit',
                  display:'flex', flexDirection:'column', alignItems:'center', gap: 2,
                }}>
                  <span>Simples</span>
                  <span style={{ fontSize: 10, opacity: 0.75, fontWeight: 400 }}>{cart.length} aposta{cart.length > 1 ? 's' : ''}</span>
                </button>
                <button onClick={() => { if (cart.length <= RULES.maxMultiple && !mixedKinds) setType('multiple'); }}
                  disabled={cart.length > RULES.maxMultiple || mixedKinds} style={{
                  flex: 1, padding: '10px', background: type === 'multiple' ? C.surfaceHi : 'transparent',
                  color: type === 'multiple' ? C.text : C.textMuted,
                  border: 'none', borderRadius: 6, fontSize: 12, fontWeight: 600,
                  cursor: (cart.length > RULES.maxMultiple || mixedKinds) ? 'not-allowed' : 'pointer',
                  opacity: (cart.length > RULES.maxMultiple || mixedKinds) ? 0.4 : 1, fontFamily:'inherit',
                  display:'flex', flexDirection:'column', alignItems:'center', gap: 2,
                }}>
                  <span>Múltipla</span>
                  <span style={{ fontSize: 10, opacity: 0.75, fontWeight: 400, color: type === 'multiple' ? C.accent : 'inherit' }}>
                    {cart.length > RULES.maxMultiple ? `máx ${RULES.maxMultiple}` :
                     mixedKinds ? 'só mesma categoria' :
                     `odd ${fmtOdd(productOdd)}`}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div style={{ borderTop: `1px solid ${C.border}`, padding: 14 }}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ display:'block', fontSize: 11, color: C.textMuted, marginBottom: 6, textTransform:'uppercase', letterSpacing:'0.08em', fontWeight: 500 }}>
                Valor R$ {type === 'simple' && cart.length > 1 ? '(por aposta)' : ''}
              </label>
              <input value={stake} onChange={e => setStake(e.target.value)} placeholder={`${RULES.minStake} — ${RULES.maxStake}`} inputMode="decimal"
                style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text,
                  padding: '12px 14px', borderRadius: 8, fontSize: 18, width: '100%', outline:'none', fontFamily:'inherit', fontWeight: 700 }} />
            </div>

            {/* Summary box com odd e retorno claros */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 8, padding: 12, marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: C.textMuted, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom: 8, fontWeight: 500 }}>
                {modeLabel}
              </div>

              {type === 'multiple' ? (
                <>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: C.textMuted }}>Odd total</span>
                    <span style={{ fontSize: 16, color: C.accent, fontWeight: 700, fontVariantNumeric:'tabular-nums' }}>{fmtOdd(productOdd)}</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: C.textMuted }}>Valor da aposta</span>
                    <span style={{ fontSize: 14, color: C.text, fontWeight: 600, fontVariantNumeric:'tabular-nums' }}>{fmtMoney(stakeNum || 0)}</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
                    <span style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>Retorno potencial</span>
                    <span style={{ fontSize: 20, color: C.accent, fontWeight: 700, fontVariantNumeric:'tabular-nums' }}>{fmtMoney(potentialReturn || 0)}</span>
                  </div>
                </>
              ) : cart.length === 1 ? (
                <>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: C.textMuted }}>Odd</span>
                    <span style={{ fontSize: 16, color: C.accent, fontWeight: 700, fontVariantNumeric:'tabular-nums' }}>{fmtOdd(cart[0].odd)}</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: C.textMuted }}>Valor</span>
                    <span style={{ fontSize: 14, color: C.text, fontWeight: 600, fontVariantNumeric:'tabular-nums' }}>{fmtMoney(stakeNum || 0)}</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
                    <span style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>Retorno potencial</span>
                    <span style={{ fontSize: 20, color: C.accent, fontWeight: 700, fontVariantNumeric:'tabular-nums' }}>{fmtMoney(potentialReturn || 0)}</span>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, color: C.textMuted }}>Valor total</span>
                    <span style={{ fontSize: 14, color: C.text, fontWeight: 600, fontVariantNumeric:'tabular-nums' }}>{fmtMoney(totalCost || 0)}</span>
                  </div>
                  <div style={{ fontSize: 11, color: C.textDim, marginBottom: 6 }}>
                    {cart.length} apostas × {fmtMoney(stakeNum || 0)} cada
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
                    <span style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>Retorno máx.</span>
                    <span style={{ fontSize: 20, color: C.accent, fontWeight: 700, fontVariantNumeric:'tabular-nums' }}>{fmtMoney(potentialReturn || 0)}</span>
                  </div>
                  <div style={{ fontSize: 10, color: C.textDim, marginTop: 4, textAlign:'right' }}>
                    se todas vencerem
                  </div>
                </>
              )}
            </div>

            {errors.length > 0 && stake !== '' && (
              <div style={{ marginBottom: 10, padding: 10, background: 'rgba(239,68,68,0.1)', border:`1px solid rgba(239,68,68,0.3)`, borderRadius: 6, fontSize: 12, color: C.danger, display:'flex', alignItems:'flex-start', gap:6 }}>
                <AlertCircle size={14} style={{ flexShrink:0, marginTop:1 }} />
                <div>{errors.join(' ')}</div>
              </div>
            )}

            <PrimaryButton full onClick={handleConfirm} disabled={!valid}>
              Confirmar · {fmtMoney(totalCost || 0)}
            </PrimaryButton>
          </div>
        )}
      </div>
    </div>
  );
}

// =========================================================================
// PAYMENT SCREEN
// =========================================================================
function PaymentScreen({ bet, settings, me, onBack, onCancel }) {
  const [copied, setCopied] = useState(false);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [remaining, setRemaining] = useState(() => {
    const expireAt = new Date(bet.createdAt).getTime() + RULES.paymentExpiryMin * 60 * 1000;
    return Math.max(0, expireAt - Date.now());
  });

  useEffect(() => {
    const t = setInterval(() => {
      const expireAt = new Date(bet.createdAt).getTime() + RULES.paymentExpiryMin * 60 * 1000;
      setRemaining(Math.max(0, expireAt - Date.now()));
    }, 1000);
    return () => clearInterval(t);
  }, [bet.createdAt]);

  const mm = Math.floor(remaining / 60000);
  const ss = Math.floor((remaining % 60000) / 1000);
  const expired = remaining === 0;

  const copyPix = () => {
    navigator.clipboard?.writeText(settings.pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const waMsg = encodeURIComponent(`Olá! Comprovante do PIX para a aposta *#${bet.id}* — ${me?.name || ''} — valor ${fmtMoney(bet.stake * bet.betCount)}. Vou anexar o comprovante na próxima mensagem.`);
  const waUrl = `https://wa.me/${settings.whatsapp}?text=${waMsg}`;

  return (
    <div style={{ minHeight:'100vh', background: C.bg, padding: 20 }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <button onClick={onBack} style={{ background:'none', border:'none', color: C.textMuted, cursor:'pointer', display:'flex', alignItems:'center', gap: 4, marginBottom: 16, fontSize: 13, fontFamily:'inherit', padding: 0 }}>
          <ChevronLeft size={16} /> Voltar
        </button>

        <div style={{ textAlign:'center', marginBottom: 20 }}>
          <div style={{ fontSize: 11, color: C.textMuted, textTransform:'uppercase', letterSpacing:'0.18em', marginBottom: 4 }}>Aposta confirmada</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: C.text, fontFamily:'monospace', letterSpacing:'0.06em' }}>#{bet.id}</div>
          {me?.name && <div style={{ fontSize: 14, color: C.accent, fontWeight: 600, marginTop: 2 }}>{me.name}</div>}
          {expired ? (
            <Pill color="red">Expirada</Pill>
          ) : (
            <div style={{ marginTop: 6, fontSize: 13, color: remaining < 5*60*1000 ? C.warning : C.textMuted }}>
              <Clock size={12} style={{ verticalAlign:'-1px', marginRight: 4 }} />
              Expira em {String(mm).padStart(2,'0')}:{String(ss).padStart(2,'0')}
            </div>
          )}
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14, marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: C.textMuted, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom: 8, fontWeight: 500, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span>Sua aposta</span>
            {bet.type === 'multiple' && <Pill color="amber">Múltipla · odd {fmtOdd(bet.totalOdd)}</Pill>}
            {bet.type === 'simple' && bet.betCount > 1 && <Pill color="muted">{bet.betCount} simples</Pill>}
          </div>
          {bet.selections.map((s, i) => (
            <div key={i} style={{ marginBottom: i === bet.selections.length - 1 ? 0 : 10, paddingBottom: i === bet.selections.length - 1 ? 0 : 10, borderBottom: i === bet.selections.length - 1 ? 'none' : `1px solid ${C.border}` }}>
              <div style={{ fontSize: 10, color: C.textDim, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom: 2 }}>{s.matchLabel}</div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <div style={{ color: C.text, fontSize: 13 }}>{s.label}</div>
                <div style={{ color: C.accent, fontSize: 13, fontWeight: 700 }}>{fmtOdd(s.odd)}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 18, marginBottom: 14, textAlign:'center' }}>
          <div style={{ fontSize: 11, color: C.textMuted, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom: 4 }}>Valor a pagar</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: C.accent, marginBottom: 4 }}>{fmtMoney(bet.stake * bet.betCount)}</div>
          <div style={{ fontSize: 12, color: C.textMuted }}>retorno potencial: <strong style={{color:C.text}}>{fmtMoney(bet.potentialReturn)}</strong></div>
        </div>

        <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14, marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: C.textMuted, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom: 6, fontWeight: 500 }}>Chave PIX (aleatória)</div>
          <div style={{ display:'flex', gap: 8 }}>
            <input readOnly value={settings.pixKey} style={{
              flex: 1, background: C.bg, border: `1px solid ${C.border}`, color: C.text,
              padding: '10px 12px', borderRadius: 8, fontSize: 12, fontFamily: 'monospace', outline:'none',
            }} />
            <button onClick={copyPix} style={{
              background: copied ? C.accent : C.surfaceHi, border: `1px solid ${copied ? C.accent : C.border}`,
              color: copied ? C.bg : C.text, padding: '0 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor:'pointer', fontFamily:'inherit',
              display:'flex', alignItems:'center', gap: 4,
            }}>
              {copied ? <><Check size={14} />Copiado</> : <><Copy size={14} />Copiar</>}
            </button>
          </div>
        </div>

        <a href={waUrl} target="_blank" rel="noreferrer" style={{ textDecoration:'none' }}>
          <button style={{
            width: '100%', background: '#25D366', color:'white', border:'none',
            padding: '14px', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor:'pointer', fontFamily:'inherit',
            display:'inline-flex', alignItems:'center', justifyContent:'center', gap: 8, marginBottom: 8,
          }}>
            <Send size={16} /> Enviar comprovante no WhatsApp
          </button>
        </a>

        {onCancel && (
          confirmingCancel ? (
            <div style={{ display:'flex', gap: 6, alignItems:'center', background: 'rgba(239,68,68,0.1)', border:`1px solid rgba(239,68,68,0.3)`, borderRadius: 8, padding: 10, marginBottom: 14 }}>
              <span style={{ flex: 1, fontSize: 12, color: C.text }}>Confirmar cancelamento?</span>
              <button onClick={onCancel} style={{
                background: C.danger, color:'white', border:'none', padding:'8px 14px', borderRadius: 6,
                fontSize: 13, fontWeight: 600, cursor:'pointer', fontFamily:'inherit',
              }}>Sim, cancelar</button>
              <button onClick={() => setConfirmingCancel(false)} style={{
                background:'transparent', color: C.textMuted, border:`1px solid ${C.border}`, padding:'8px 12px', borderRadius: 6,
                fontSize: 13, fontWeight: 500, cursor:'pointer', fontFamily:'inherit',
              }}>Não</button>
            </div>
          ) : (
            <button onClick={() => setConfirmingCancel(true)} style={{
              width: '100%', background: 'transparent', color: C.danger, border:`1px solid ${C.border}`,
              padding: '10px', borderRadius: 8, fontSize: 13, fontWeight: 500, cursor:'pointer', fontFamily:'inherit',
              marginBottom: 14,
            }}>
              Desistir e cancelar aposta
            </button>
          )
        )}

        <div style={{ fontSize: 12, color: C.textMuted, textAlign:'center', lineHeight: 1.6 }}>
          1. Faça o PIX no valor exato <strong style={{color:C.text}}>{fmtMoney(bet.stake * bet.betCount)}</strong><br/>
          2. Envie o comprovante no WhatsApp com o código <strong style={{color:C.text}}>#{bet.id}</strong><br/>
          3. Após confirmação do admin, sua aposta fica ativa
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// MY BETS
// =========================================================================
function MyBets({ state, me, settings, onBack, onCancel }) {
  const [confirmingId, setConfirmingId] = useState(null);
  const myBets = useMemo(() =>
    state.bets.filter(b => b.bettorId === me.id).sort((a,b) => b.createdAt.localeCompare(a.createdAt)),
    [state.bets, me.id]
  );

  const statusInfo = (s) => {
    switch (s) {
      case 'pending_payment': return { color: 'amber', label: 'Aguardando pagamento' };
      case 'active': return { color: 'green', label: 'Ativa' };
      case 'won': return { color: 'green', label: 'Ganha' };
      case 'lost': return { color: 'red', label: 'Perdida' };
      case 'cancelled': return { color: 'muted', label: 'Anulada' };
      default: return { color: 'muted', label: s };
    }
  };

  const waMsg = (bet) => encodeURIComponent(`Olá! Comprovante do PIX para a aposta *#${bet.id}* — ${me?.name || ''} — valor ${fmtMoney(bet.stake * bet.betCount)}.`);

  return (
    <div style={{ minHeight: '100vh', background: C.bg, padding: '14px 16px' }}>
      <div style={{ display:'flex', alignItems:'center', gap: 10, marginBottom: 16 }}>
        <button onClick={onBack} style={{ background:'none', border:'none', color: C.textMuted, cursor:'pointer', padding: 4, fontFamily:'inherit' }}><ChevronLeft size={20} /></button>
        <div style={{ color: C.text, fontSize: 17, fontWeight: 600 }}>Minhas apostas</div>
      </div>

      {myBets.length === 0 ? (
        <div style={{ textAlign:'center', padding: 60, color: C.textMuted, fontSize: 13 }}>
          <Receipt size={32} style={{ marginBottom: 12, opacity: 0.4 }} />
          <div>Você ainda não fez nenhuma aposta.</div>
        </div>
      ) : (
        myBets.map(bet => {
          const si = statusInfo(bet.status);
          return (
            <div key={bet.id} style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12, marginBottom: 10 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: 8 }}>
                <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
                  <span style={{ fontFamily:'monospace', fontSize: 13, color: C.text, fontWeight: 700, letterSpacing:'0.04em' }}>#{bet.id}</span>
                  <Pill color={si.color}>{si.label}</Pill>
                </div>
                <span style={{ fontSize: 10, color: C.textDim }}>{new Date(bet.createdAt).toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' })}</span>
              </div>

              <div style={{ marginBottom: 10 }}>
                {bet.type === 'multiple' && (
                  <div style={{ marginBottom: 6 }}>
                    <Pill color="amber">Múltipla · {bet.selections.length} seleções · odd {fmtOdd(bet.totalOdd)}</Pill>
                  </div>
                )}
                {bet.selections.map((s, i) => (
                  <div key={i} style={{ fontSize: 12, color: C.textMuted, marginBottom: 3, padding: '3px 0' }}>
                    <div style={{ color: C.textDim, fontSize: 10, textTransform:'uppercase', letterSpacing:'0.06em' }}>{s.matchLabel}</div>
                    <div style={{ display:'flex', justifyContent:'space-between' }}>
                      <span style={{ color: C.text }}>{s.label}</span>
                      <span style={{ color: C.accent, fontWeight: 600 }}>{fmtOdd(s.odd)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display:'flex', justifyContent:'space-between', fontSize: 12, paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
                <span style={{ color: C.textMuted }}>{bet.type === 'multiple' ? `Múltipla ${fmtOdd(bet.totalOdd)}` : `${bet.betCount} simples`} · {fmtMoney(bet.stake * bet.betCount)}</span>
                <span style={{ color: bet.status === 'won' ? C.accent : C.textMuted, fontWeight: 600 }}>
                  {bet.status === 'won' ? `+${fmtMoney(bet.actualReturn)}` :
                   bet.status === 'lost' ? `−${fmtMoney(bet.stake * bet.betCount)}` :
                   `→ ${fmtMoney(bet.potentialReturn)}`}
                </span>
              </div>

              {bet.status === 'pending_payment' && (
                <div style={{ marginTop: 10 }}>
                  {confirmingId === bet.id ? (
                    <div style={{ display:'flex', gap: 6, alignItems:'center', background: 'rgba(239,68,68,0.1)', border:`1px solid rgba(239,68,68,0.3)`, borderRadius: 6, padding: 8 }}>
                      <span style={{ flex: 1, fontSize: 12, color: C.text }}>Confirmar cancelamento?</span>
                      <button onClick={() => { onCancel(bet.id); setConfirmingId(null); }} style={{
                        background: C.danger, color:'white', border:'none', padding:'6px 12px', borderRadius: 5,
                        fontSize: 12, fontWeight: 600, cursor:'pointer', fontFamily:'inherit',
                      }}>Sim, cancelar</button>
                      <button onClick={() => setConfirmingId(null)} style={{
                        background:'transparent', color: C.textMuted, border:`1px solid ${C.border}`, padding:'6px 10px', borderRadius: 5,
                        fontSize: 12, fontWeight: 500, cursor:'pointer', fontFamily:'inherit',
                      }}>Não</button>
                    </div>
                  ) : (
                    <div style={{ display:'flex', gap: 6 }}>
                      <a href={`https://wa.me/${settings.whatsapp}?text=${waMsg(bet)}`} target="_blank" rel="noreferrer" style={{ flex: 1, textDecoration:'none' }}>
                        <button style={{ width:'100%', background:'#25D366', color:'white', border:'none', padding:'8px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', justifyContent:'center', gap: 6 }}>
                          <Send size={12} /> Comprovante
                        </button>
                      </a>
                      <button onClick={() => setConfirmingId(bet.id)} style={{
                        background:'transparent', color: C.danger, border: `1px solid ${C.border}`,
                        padding: '8px 14px', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor:'pointer', fontFamily:'inherit',
                      }}>
                        Cancelar
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}

// =========================================================================
// BETTOR APP
// =========================================================================
function BettorApp({ me, state, setState, onLogout, onAdminEnter }) {
  const [tab, setTab] = useState('matches');
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [view, setView] = useState('catalog'); // 'catalog' | 'payment' | 'mybets'
  const [currentBet, setCurrentBet] = useState(null);
  const [now, setNow] = useState(Date.now());

  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(t); }, []);

  const toggleSelection = (sel) => {
    setCart(c => {
      const exists = c.find(s => s.uid === sel.uid);
      if (exists) return c.filter(s => s.uid !== sel.uid);
      return [...c, sel];
    });
    setCartOpen(true);
  };
  const removeFromCart = (uid) => setCart(c => c.filter(s => s.uid !== uid));

  const cancelMyBet = async (betId) => {
    const fresh = (await loadShared()) || state;
    const updated = {
      ...fresh,
      bets: fresh.bets.map(b => b.id === betId ? { ...b, status: 'cancelled', settledAt: new Date().toISOString() } : b)
    };
    await saveShared(updated);
    setState(updated);
  };

  const confirmBet = async ({ type, stake, totalOdd, potentialReturn, betCount }) => {
    // Create one bet record per simple (if type=simple) or one for multiple
    const newBets = [];
    const baseAt = new Date().toISOString();
    if (type === 'simple') {
      cart.forEach(s => {
        newBets.push({
          id: newBetId(), bettorId: me.id, type: 'simple',
          selections: [s], stake, totalOdd: s.odd, potentialReturn: stake * s.odd,
          betCount: 1,
          status: 'pending_payment', createdAt: baseAt,
        });
      });
    } else {
      newBets.push({
        id: newBetId(), bettorId: me.id, type: 'multiple',
        selections: [...cart], stake, totalOdd, potentialReturn,
        betCount: 1,
        status: 'pending_payment', createdAt: baseAt,
      });
    }
    // Save atomically: reload state, append, save
    const fresh = (await loadShared()) || state;
    const updated = { ...fresh, bets: [...(fresh.bets || []), ...newBets] };
    await saveShared(updated);
    setState(updated);
    setCart([]);
    setCartOpen(false);
    // If single bet (multiple or 1 simple), go to payment. If multiple simples, go to my bets.
    if (newBets.length === 1) {
      setCurrentBet(newBets[0]);
      setView('payment');
    } else {
      setView('mybets');
    }
  };

  if (view === 'payment' && currentBet) {
    return <PaymentScreen bet={currentBet} settings={state.settings} me={me}
      onBack={() => { setCurrentBet(null); setView('catalog'); }}
      onCancel={async () => { await cancelMyBet(currentBet.id); setCurrentBet(null); setView('catalog'); }}
    />;
  }
  if (view === 'mybets') {
    return <MyBets state={state} me={me} settings={state.settings}
      onBack={() => setView('catalog')} onCancel={cancelMyBet} />;
  }

  const myBetsCount = state.bets.filter(b => b.bettorId === me.id).length;
  const activeBets = state.bets.filter(b => b.bettorId === me.id && (b.status === 'pending_payment' || b.status === 'active')).length;

  return (
    <div style={{ minHeight:'100vh', background: C.bg, paddingBottom: cart.length > 0 ? 70 : 16 }}>
      {/* Header */}
      <header style={{ background: C.bg, borderBottom: `1px solid ${C.border}`, padding: '12px 16px', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', maxWidth: 700, margin: '0 auto' }}>
          <Logo />
          <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
            <button onClick={() => setView('mybets')} style={{
              background: C.surface, border:`1px solid ${C.border}`, color: C.text, padding:'7px 10px', borderRadius: 7, fontSize: 12, fontWeight: 500,
              cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap: 5,
            }}>
              <Receipt size={13} /> {myBetsCount}
            </button>
            <button onClick={onLogout} style={{ background:'none', border:'none', color: C.textMuted, cursor:'pointer', padding: 4, fontFamily:'inherit' }} title="Sair">
              <LogOut size={16} />
            </button>
          </div>
        </div>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop: 8, maxWidth: 700, margin: '8px auto 0' }}>
          <div style={{ fontSize: 12, color: C.textMuted }}>Olá, <strong style={{color:C.text}}>{me.name.split(' ')[0]}</strong> · {activeBets}/{RULES.maxSimultaneous} apostas ativas</div>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ display:'flex', borderBottom: `1px solid ${C.border}`, background: C.bg, position: 'sticky', top: 73, zIndex: 49 }}>
        <div style={{ maxWidth: 700, margin: '0 auto', width:'100%', display:'flex' }}>
          {[{ id:'matches', label:'Partidas', icon: Calendar }, { id:'futures', label:'Futuras', icon: Trophy }].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              flex: 1, padding: '12px', background: 'transparent', border:'none',
              borderBottom: `2px solid ${tab === t.id ? C.accent : 'transparent'}`,
              color: tab === t.id ? C.accent : C.textMuted,
              fontSize: 13, fontWeight: 600, cursor:'pointer', fontFamily:'inherit',
              display:'inline-flex', alignItems:'center', justifyContent:'center', gap: 6,
            }}>
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <main style={{ padding: 14, maxWidth: 700, margin: '0 auto' }}>
        {tab === 'matches' && <MatchesTab catalog={state.catalog} cart={cart} onToggle={toggleSelection} now={now} />}
        {tab === 'futures' && <FuturesTab catalog={state.catalog} cart={cart} onToggle={toggleSelection} now={now} />}

        {/* Footer com link admin discreto */}
        <div style={{ textAlign:'center', padding: '24px 0 8px', borderTop:`1px solid ${C.border}`, marginTop: 24 }}>
          <button onClick={onAdminEnter} style={{
            background:'none', border:'none', color: C.textDim, fontSize: 11,
            cursor:'pointer', fontFamily:'inherit', letterSpacing:'0.06em', padding: 4,
          }}>
            Acesso admin
          </button>
        </div>
      </main>

      {/* Cart trigger */}
      {cart.length > 0 && !cartOpen && (
        <button onClick={() => setCartOpen(true)} style={{
          position:'fixed', bottom: 14, left: '50%', transform:'translateX(-50%)',
          background: C.accent, color: C.bg, border:'none',
          padding: '12px 22px', borderRadius: 999, fontSize: 14, fontWeight: 700,
          cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap: 8, zIndex: 40,
        }}>
          <ShoppingCart size={16} /> {cart.length} no carrinho
        </button>
      )}

      {cartOpen && (
        <Cart cart={cart} onRemove={removeFromCart} onClear={() => setCart([])}
          onClose={() => setCartOpen(false)} onConfirm={confirmBet}
          state={state} me={me} />
      )}
    </div>
  );
}

// =========================================================================
// ADMIN — LOGIN
// =========================================================================
function AdminLogin({ onLogin, settings }) {
  const [pw, setPw] = useState('');
  const [err, setErr] = useState(false);
  const submit = () => {
    if (pw === settings.adminPassword) onLogin();
    else { setErr(true); setPw(''); }
  };
  return (
    <div style={{ minHeight: '100vh', background: C.bg, display:'flex', alignItems:'center', justifyContent:'center', padding: 20 }}>
      <div style={{ maxWidth: 360, width: '100%' }}>
        <div style={{ textAlign:'center', marginBottom: 30 }}><Logo /></div>
        <div style={{ background: C.surface, border:`1px solid ${C.border}`, borderRadius: 10, padding: 20 }}>
          <div style={{ fontSize: 11, color: C.textMuted, textTransform:'uppercase', letterSpacing:'0.18em', marginBottom: 10, textAlign:'center' }}>Painel Administrativo</div>
          <input type="password" value={pw} onChange={e => { setPw(e.target.value); setErr(false); }}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder="Senha" style={{
              background: C.bg, border:`1px solid ${err ? C.danger : C.border}`, color: C.text,
              padding: '12px 14px', borderRadius: 8, fontSize: 15, width: '100%',
              outline: 'none', fontFamily:'inherit', marginBottom: 12,
            }} />
          <PrimaryButton full onClick={submit}>Entrar</PrimaryButton>
          {err && <div style={{ marginTop: 10, color: C.danger, fontSize: 12, textAlign:'center' }}>Senha incorreta</div>}
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// ADMIN TABS
// =========================================================================
function AdminTabContent({ tab, state, setState }) {
  const updateState = async (mutator) => {
    const fresh = (await loadShared()) || state;
    const updated = mutator(fresh);
    await saveShared(updated);
    setState(updated);
  };

  if (tab === 'pending') return <PendingPaymentsTab state={state} updateState={updateState} />;
  if (tab === 'liquidate') return <LiquidateMatchesTab state={state} updateState={updateState} />;
  if (tab === 'futures_settle') return <LiquidateFuturesTab state={state} updateState={updateState} />;
  if (tab === 'bettors') return <BettorsTab state={state} />;
  if (tab === 'bets') return <AllBetsTab state={state} updateState={updateState} />;
  if (tab === 'ranking') return <RankingTab state={state} />;
  if (tab === 'odds') return <OddsTab state={state} updateState={updateState} />;
  if (tab === 'settings') return <SettingsTab state={state} updateState={updateState} />;
  return null;
}

function PendingPaymentsTab({ state, updateState }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 5000); return () => clearInterval(t); }, []);

  // Auto-expire bets
  useEffect(() => {
    const expired = state.bets.filter(b => {
      if (b.status !== 'pending_payment') return false;
      const expireAt = new Date(b.createdAt).getTime() + RULES.paymentExpiryMin * 60 * 1000;
      return now > expireAt;
    });
    if (expired.length > 0) {
      updateState(s => ({
        ...s,
        bets: s.bets.map(b => expired.some(e => e.id === b.id) ? { ...b, status: 'cancelled', settledAt: new Date().toISOString() } : b),
      }));
    }
  }, [now, state.bets]);

  const pending = state.bets.filter(b => b.status === 'pending_payment')
    .sort((a,b) => a.createdAt.localeCompare(b.createdAt));

  const markPaid = (betId) => updateState(s => ({ ...s, bets: s.bets.map(b => b.id === betId ? { ...b, status:'active', paidAt: new Date().toISOString() } : b) }));
  const cancel = (betId) => { if (!confirm('Anular essa aposta?')) return;
    updateState(s => ({ ...s, bets: s.bets.map(b => b.id === betId ? { ...b, status:'cancelled', settledAt: new Date().toISOString() } : b) }));
  };

  const bettorOf = (id) => state.bettors.find(b => b.id === id);

  if (pending.length === 0) {
    return <div style={{ textAlign:'center', padding: 50, color: C.textMuted, fontSize: 13 }}><Wallet size={32} style={{ opacity: 0.4, marginBottom: 10 }} /><div>Nenhum pagamento pendente.</div></div>;
  }

  return (
    <div>
      {pending.map(bet => {
        const b = bettorOf(bet.bettorId);
        const expireAt = new Date(bet.createdAt).getTime() + RULES.paymentExpiryMin * 60 * 1000;
        const remaining = Math.max(0, expireAt - now);
        const mm = Math.floor(remaining / 60000);
        const ss = Math.floor((remaining % 60000) / 1000);
        return (
          <div key={bet.id} style={{ background: C.surface, border:`1px solid ${C.border}`, borderRadius: 10, padding: 14, marginBottom: 10 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom: 8 }}>
              <div>
                <div style={{ display:'flex', alignItems:'baseline', gap: 8, flexWrap:'wrap' }}>
                  <span style={{ fontFamily:'monospace', fontSize: 14, color: C.text, fontWeight: 700, letterSpacing:'0.04em' }}>#{bet.id}</span>
                  <span style={{ fontSize: 14, color: C.accent, fontWeight: 600 }}>{b?.name || '—'}</span>
                </div>
                <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{maskPhone(b?.phone || '')} · {maskCpf(b?.cpf || '')}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ color: C.warning, fontSize: 12, fontWeight: 600 }}><Clock size={12} style={{ verticalAlign:'-1px', marginRight: 3 }} />{String(mm).padStart(2,'0')}:{String(ss).padStart(2,'0')}</div>
                <div style={{ fontSize: 18, color: C.accent, fontWeight: 700, marginTop: 4 }}>{fmtMoney(bet.stake * bet.betCount)}</div>
              </div>
            </div>
            <div style={{ marginBottom: 12, paddingTop: 8, borderTop: `1px solid ${C.border}` }}>
              {/* Badge identificando tipo */}
              <div style={{ marginBottom: 8, display:'flex', alignItems:'center', gap: 6 }}>
                {bet.type === 'multiple' ? (
                  <Pill color="amber">Múltipla · {bet.selections.length} seleções · odd {fmtOdd(bet.totalOdd)}</Pill>
                ) : (
                  <Pill color="muted">Simples</Pill>
                )}
              </div>
              {bet.selections.map((s, i) => (
                <div key={i} style={{ fontSize: 12, color: C.textMuted, marginBottom: 4, padding: '4px 0', borderBottom: i < bet.selections.length - 1 ? `1px dashed ${C.border}` : 'none' }}>
                  <div style={{ color: C.textDim, fontSize: 10, textTransform:'uppercase', letterSpacing:'0.06em', marginBottom: 1 }}>{s.matchLabel}</div>
                  <div style={{ display:'flex', justifyContent:'space-between' }}>
                    <span style={{ color: C.text }}>{s.label}</span>
                    <span style={{ color: C.accent, fontWeight: 600 }}>{fmtOdd(s.odd)}</span>
                  </div>
                </div>
              ))}
              <div style={{ marginTop: 8, padding: 8, background: C.bg, borderRadius: 6, display:'flex', justifyContent:'space-between' }}>
                <span style={{ fontSize: 11, color: C.textMuted }}>Retorno potencial</span>
                <span style={{ fontSize: 13, color: C.accent, fontWeight: 700 }}>{fmtMoney(bet.potentialReturn)}</span>
              </div>
            </div>
            <div style={{ display:'flex', gap: 6 }}>
              <button onClick={() => markPaid(bet.id)} style={{ flex: 1, background: C.accent, color: C.bg, border:'none', padding: 9, borderRadius: 6, fontSize: 13, fontWeight: 600, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', justifyContent:'center', gap: 5 }}><Check size={14} /> Confirmar pago</button>
              <button onClick={() => cancel(bet.id)} style={{ background:'transparent', color: C.danger, border:`1px solid ${C.border}`, padding: '9px 14px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor:'pointer', fontFamily:'inherit' }}><X size={14} /></button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LiquidateMatchesTab({ state, updateState }) {
  const [expanded, setExpanded] = useState(null);

  const saveResult = async (matchId, result) => {
    await updateState(s => {
      const newResults = { ...s.results, matches: { ...s.results.matches, [matchId]: result } };
      // Settle relevant active bets
      const newBets = s.bets.map(bet => {
        if (bet.status !== 'active') return bet;
        const touches = bet.selections.some(sel => sel.kind === 'match' && sel.matchId === matchId);
        if (!touches) return bet;
        return settleBet(bet, newResults, s.catalog);
      });
      return { ...s, results: newResults, bets: newBets };
    });
  };

  return (
    <div>
      {state.catalog.matches.map(m => {
        const tA = teamById(m.teamA), tB = teamById(m.teamB);
        const r = state.results.matches[m.id] || {};
        const settled = r.placarA !== '' && r.placarA != null;
        return (
          <div key={m.id} style={{ background: C.surface, border:`1px solid ${C.border}`, borderRadius: 10, marginBottom: 10 }}>
            <button onClick={() => setExpanded(expanded === m.id ? null : m.id)} style={{
              width:'100%', background:'transparent', border:'none', padding: '10px 12px',
              display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer', color: C.text, fontFamily:'inherit',
            }}>
              <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
                <span style={{ fontSize: 10, color: C.textMuted, fontWeight: 700, fontFamily: 'monospace' }}>#{m.num}</span>
                <Flag code={tA.code} size={16} />
                <span style={{ fontSize: 13, fontWeight: 500 }}>{tA.name}</span>
                {settled && <span style={{ color: C.accent, fontWeight: 700, fontVariantNumeric:'tabular-nums' }}>{r.placarA}–{r.placarB}</span>}
                {!settled && <span style={{ color: C.textDim, fontSize: 12 }}>vs</span>}
                <span style={{ fontSize: 13, fontWeight: 500 }}>{tB.name}</span>
                <Flag code={tB.code} size={16} />
                {settled && <Pill color="green">Liquidado</Pill>}
              </div>
              {expanded === m.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {expanded === m.id && (
              <ResultForm match={m} result={r} onSave={(res) => saveResult(m.id, res)} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ResultForm({ match, result, onSave }) {
  const tA = teamById(match.teamA), tB = teamById(match.teamB);
  const [r, setR] = useState({
    placarA: result.placarA ?? '', placarB: result.placarB ?? '',
    gols1T: result.gols1T ?? '', gols2T: result.gols2T ?? '',
    cartoes1T: result.cartoes1T ?? '', cartoes2T: result.cartoes2T ?? '',
    tevePenalti: result.tevePenalti ?? false, teveVermelho: result.teveVermelho ?? false,
  });

  const inputN = { background: C.bg, border:`1px solid ${C.border}`, color: C.text, padding:'8px 10px', borderRadius: 6, fontSize: 14, width: '100%', outline:'none', fontFamily:'inherit', textAlign:'center', fontWeight: 600 };
  const fieldLabel = { fontSize: 11, color: C.textMuted, marginBottom: 4, textTransform:'uppercase', letterSpacing:'0.08em', fontWeight: 500 };

  const totalGols = (parseInt(r.placarA) || 0) + (parseInt(r.placarB) || 0);
  const totalTempos = (parseInt(r.gols1T) || 0) + (parseInt(r.gols2T) || 0);
  const mismatch = r.gols1T !== '' && r.gols2T !== '' && r.placarA !== '' && r.placarB !== '' && totalGols !== totalTempos;

  const valid = r.placarA !== '' && r.placarB !== '' && r.gols1T !== '' && r.gols2T !== '' && r.cartoes1T !== '' && r.cartoes2T !== '' && !mismatch;

  return (
    <div style={{ padding: '4px 14px 14px', borderTop: `1px solid ${C.border}` }}>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10, marginBottom: 12, marginTop: 10 }}>
        <div>
          <div style={fieldLabel}>{tA.name} placar</div>
          <input type="number" min="0" value={r.placarA} onChange={e => setR({...r, placarA: e.target.value})} style={inputN} />
        </div>
        <div>
          <div style={fieldLabel}>{tB.name} placar</div>
          <input type="number" min="0" value={r.placarB} onChange={e => setR({...r, placarB: e.target.value})} style={inputN} />
        </div>
        <div>
          <div style={fieldLabel}>Gols 1º T</div>
          <input type="number" min="0" value={r.gols1T} onChange={e => setR({...r, gols1T: e.target.value})} style={inputN} />
        </div>
        <div>
          <div style={fieldLabel}>Gols 2º T</div>
          <input type="number" min="0" value={r.gols2T} onChange={e => setR({...r, gols2T: e.target.value})} style={inputN} />
        </div>
        <div>
          <div style={fieldLabel}>Cartões 1º T</div>
          <input type="number" min="0" value={r.cartoes1T} onChange={e => setR({...r, cartoes1T: e.target.value})} style={inputN} />
        </div>
        <div>
          <div style={fieldLabel}>Cartões 2º T</div>
          <input type="number" min="0" value={r.cartoes2T} onChange={e => setR({...r, cartoes2T: e.target.value})} style={inputN} />
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 10, marginBottom: 12 }}>
        <label style={{ display:'flex', alignItems:'center', gap: 8, color: C.text, fontSize: 13, cursor:'pointer', background: C.bg, border:`1px solid ${C.border}`, padding: '8px 10px', borderRadius: 6 }}>
          <input type="checkbox" checked={r.tevePenalti} onChange={e => setR({...r, tevePenalti: e.target.checked})} style={{ accentColor: C.accent }} />
          Teve pênalti
        </label>
        <label style={{ display:'flex', alignItems:'center', gap: 8, color: C.text, fontSize: 13, cursor:'pointer', background: C.bg, border:`1px solid ${C.border}`, padding: '8px 10px', borderRadius: 6 }}>
          <input type="checkbox" checked={r.teveVermelho} onChange={e => setR({...r, teveVermelho: e.target.checked})} style={{ accentColor: C.accent }} />
          Teve vermelho
        </label>
      </div>

      {mismatch && <div style={{ color: C.danger, fontSize: 12, marginBottom: 10 }}>⚠ Gols por tempo ({totalTempos}) não bate com placar total ({totalGols})</div>}

      <PrimaryButton full onClick={() => onSave(r)} disabled={!valid}><Check size={14} /> Liquidar jogo</PrimaryButton>
    </div>
  );
}

function LiquidateFuturesTab({ state, updateState }) {
  const [r, setR] = useState({
    campeao: state.results.futures.campeao || '',
    melhorAtaque: state.results.futures.melhorAtaque || '',
    piorDefesa: state.results.futures.piorDefesa || '',
    mvp: state.results.futures.mvp || '',
    finalExataA: state.results.futures.finalExataA || '',
    finalExataB: state.results.futures.finalExataB || '',
  });

  const saveAll = async () => {
    if (!confirm('Liquidar todas as apostas futuras? Não dá pra desfazer.')) return;
    await updateState(s => {
      const newResults = { ...s.results, futures: r };
      const newBets = s.bets.map(bet => {
        if (bet.status !== 'active') return bet;
        const touchesFuture = bet.selections.some(sel => sel.kind === 'future');
        if (!touchesFuture) return bet;
        return settleBet(bet, newResults, s.catalog);
      });
      return { ...s, results: newResults, bets: newBets };
    });
    alert('Futuras liquidadas.');
  };

  const sel = { background: C.bg, border:`1px solid ${C.border}`, color: C.text, padding:'10px 12px', borderRadius: 6, fontSize: 14, width: '100%', outline:'none', fontFamily:'inherit' };
  const fieldLabel = { fontSize: 11, color: C.textMuted, marginBottom: 4, textTransform:'uppercase', letterSpacing:'0.08em', fontWeight: 500 };

  return (
    <div style={{ background: C.surface, border:`1px solid ${C.border}`, borderRadius: 10, padding: 14 }}>
      <div style={{ display:'grid', gap: 12, marginBottom: 14 }}>
        <div>
          <div style={fieldLabel}>Campeão</div>
          <select value={r.campeao} onChange={e => setR({...r, campeao: e.target.value})} style={sel}>
            <option value="">—</option>
            {TEAMS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div>
          <div style={fieldLabel}>Melhor Ataque (Grupos)</div>
          <select value={r.melhorAtaque} onChange={e => setR({...r, melhorAtaque: e.target.value})} style={sel}>
            <option value="">—</option>
            {TEAMS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div>
          <div style={fieldLabel}>Pior Defesa</div>
          <select value={r.piorDefesa} onChange={e => setR({...r, piorDefesa: e.target.value})} style={sel}>
            <option value="">—</option>
            {TEAMS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div>
          <div style={fieldLabel}>MVP</div>
          <select value={r.mvp} onChange={e => setR({...r, mvp: e.target.value})} style={sel}>
            <option value="">—</option>
            {PLAYERS.map(p => <option key={p.id} value={p.id}>{p.name} ({teamById(p.teamId).name})</option>)}
          </select>
        </div>
        <div>
          <div style={fieldLabel}>Final Exata</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 6 }}>
            <select value={r.finalExataA} onChange={e => setR({...r, finalExataA: e.target.value})} style={sel}>
              <option value="">Finalista A</option>
              {TEAMS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <select value={r.finalExataB} onChange={e => setR({...r, finalExataB: e.target.value})} style={sel}>
              <option value="">Finalista B</option>
              {TEAMS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
        </div>
      </div>
      <PrimaryButton full onClick={saveAll}><Check size={14} /> Liquidar futuras</PrimaryButton>
    </div>
  );
}

function BettorsTab({ state }) {
  const rows = state.bettors.map(b => {
    const bets = state.bets.filter(bt => bt.bettorId === b.id);
    const apostado = bets.filter(bt => bt.status !== 'cancelled' && bt.status !== 'pending_payment').reduce((sum, bt) => sum + bt.stake * bt.betCount, 0);
    const retornado = bets.filter(bt => bt.status === 'won').reduce((sum, bt) => sum + bt.actualReturn, 0);
    const lucro = retornado - apostado;
    const ativas = bets.filter(bt => bt.status === 'active' || bt.status === 'pending_payment').length;
    return { ...b, apostado, retornado, lucro, ativas, total: bets.length };
  });

  return (
    <div>
      {rows.length === 0 ? (
        <div style={{ padding: 40, color: C.textMuted, textAlign:'center' }}>Nenhum apostador ainda.</div>
      ) : rows.map(r => (
        <div key={r.id} style={{ background: C.surface, border:`1px solid ${C.border}`, borderRadius: 10, padding: 12, marginBottom: 8 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom: 6 }}>
            <div>
              <div style={{ color: C.text, fontSize: 14, fontWeight: 600 }}>{r.name}</div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{maskPhone(r.phone)} · {maskCpf(r.cpf)}</div>
            </div>
            <div style={{ textAlign:'right' }}>
              <div style={{ color: r.lucro >= 0 ? C.accent : C.danger, fontSize: 16, fontWeight: 700 }}>{r.lucro >= 0 ? '+' : ''}{fmtMoney(r.lucro)}</div>
              <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{r.ativas} ativa · {r.total} total</div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: C.textDim, paddingTop: 6, borderTop: `1px solid ${C.border}` }}>
            Apostado {fmtMoney(r.apostado)} · Retornado {fmtMoney(r.retornado)}
          </div>
        </div>
      ))}
    </div>
  );
}

function AllBetsTab({ state, updateState }) {
  const [filter, setFilter] = useState('all');
  const cancel = (id) => { if (!confirm('Anular essa aposta?')) return;
    updateState(s => ({ ...s, bets: s.bets.map(b => b.id === id ? { ...b, status:'cancelled', settledAt: new Date().toISOString() } : b) }));
  };
  const bettorOf = (id) => state.bettors.find(b => b.id === id);
  const filters = [{ id:'all', label:'Todas' },{ id:'pending_payment', label:'Aguardando' },{ id:'active', label:'Ativas' },{ id:'won', label:'Ganhas' },{ id:'lost', label:'Perdidas' },{ id:'cancelled', label:'Anuladas' }];
  const bets = state.bets.filter(b => filter === 'all' || b.status === filter)
    .sort((a,b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div>
      <div style={{ display:'flex', gap: 5, marginBottom: 12, overflowX:'auto' }}>
        {filters.map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{
            background: filter === f.id ? C.accent : C.surface, color: filter === f.id ? C.bg : C.textMuted,
            border:`1px solid ${filter === f.id ? C.accent : C.border}`, padding: '6px 10px', borderRadius: 6,
            fontSize: 11, fontWeight: 600, cursor:'pointer', whiteSpace:'nowrap', fontFamily:'inherit',
          }}>{f.label}</button>
        ))}
      </div>

      {bets.map(bet => {
        const b = bettorOf(bet.bettorId);
        const si = (() => { switch (bet.status) {
          case 'pending_payment': return { color: 'amber', label: 'Aguardando' };
          case 'active': return { color: 'green', label: 'Ativa' };
          case 'won': return { color: 'green', label: 'Ganha' };
          case 'lost': return { color: 'red', label: 'Perdida' };
          case 'cancelled': return { color: 'muted', label: 'Anulada' };
        }})();
        return (
          <div key={bet.id} style={{ background: C.surface, border:`1px solid ${C.border}`, borderRadius: 10, padding: 12, marginBottom: 8 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom: 6 }}>
              <div style={{ display:'flex', alignItems:'center', gap: 8, flexWrap:'wrap' }}>
                <span style={{ fontFamily:'monospace', fontSize: 12, color: C.text, fontWeight: 700 }}>#{bet.id}</span>
                <span style={{ fontSize: 13, color: C.accent, fontWeight: 600 }}>{b?.name || '—'}</span>
                <Pill color={si.color}>{si.label}</Pill>
              </div>
              <span style={{ fontSize: 10, color: C.textDim }}>{new Date(bet.createdAt).toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' })}</span>
            </div>
            <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6 }}>{maskPhone(b?.phone || '')}</div>
            {bet.selections.map((s, i) => (
              <div key={i} style={{ fontSize: 11, color: C.textMuted, marginBottom: 2 }}>{s.label} <span style={{ color: C.accent, fontWeight: 600 }}>{fmtOdd(s.odd)}</span></div>
            ))}
            <div style={{ display:'flex', justifyContent:'space-between', fontSize: 11, marginTop: 6, paddingTop: 6, borderTop: `1px solid ${C.border}` }}>
              <span style={{ color: C.textMuted }}>{fmtMoney(bet.stake * bet.betCount)} → {fmtMoney(bet.potentialReturn)}</span>
              {(bet.status === 'active' || bet.status === 'pending_payment') && (
                <button onClick={() => cancel(bet.id)} style={{ background:'none', border:'none', color: C.danger, cursor:'pointer', fontSize: 11, padding: 0, fontFamily:'inherit' }}>Anular</button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RankingTab({ state }) {
  const rows = state.bettors.map(b => {
    const bets = state.bets.filter(bt => bt.bettorId === b.id && bt.status !== 'cancelled' && bt.status !== 'pending_payment');
    const apostado = bets.reduce((sum, bt) => sum + bt.stake * bt.betCount, 0);
    const retornado = bets.filter(bt => bt.status === 'won').reduce((sum, bt) => sum + bt.actualReturn, 0);
    return { ...b, apostado, retornado, lucro: retornado - apostado, total: bets.length };
  }).sort((a, b) => b.lucro - a.lucro);

  return (
    <div>
      {rows.length === 0 ? (
        <div style={{ padding: 40, color: C.textMuted, textAlign:'center' }}>Sem dados ainda.</div>
      ) : rows.map((r, i) => (
        <div key={r.id} style={{ background: C.surface, border:`1px solid ${C.border}`, borderRadius: 10, padding: 12, marginBottom: 6, display:'flex', alignItems:'center', gap: 12 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: i === 0 ? C.warning : i === 1 ? C.textMuted : i === 2 ? '#cd7f32' : C.textDim, width: 26, textAlign:'center' }}>{i+1}</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: C.text, fontSize: 14, fontWeight: 600 }}>{r.name}</div>
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 1 }}>{r.total} apostas · {fmtMoney(r.apostado)} apostado</div>
          </div>
          <div style={{ color: r.lucro >= 0 ? C.accent : C.danger, fontSize: 18, fontWeight: 700, fontVariantNumeric:'tabular-nums' }}>{r.lucro >= 0 ? '+' : ''}{fmtMoney(r.lucro)}</div>
        </div>
      ))}
    </div>
  );
}

function OddsTab({ state, updateState }) {
  // Compact odds editor: list matches and let admin edit any odd
  const [expanded, setExpanded] = useState(null);

  const updateOdd = async (matchId, market, key, value) => {
    await updateState(s => ({
      ...s,
      catalog: {
        ...s.catalog,
        matches: s.catalog.matches.map(m => m.id === matchId ? {
          ...m,
          odds: {
            ...m.odds,
            [market]: { ...m.odds[market], [key]: value }
          }
        } : m),
      }
    }));
  };

  const inputO = { background: C.bg, border:`1px solid ${C.border}`, color: C.text, padding:'6px 8px', borderRadius: 4, fontSize: 12, width: 60, outline:'none', fontFamily:'monospace', textAlign:'center', fontWeight: 600 };

  return (
    <div>
      <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 12, padding: 10, background: C.surface, border:`1px solid ${C.border}`, borderRadius: 8 }}>
        Edite as odds aqui antes das janelas fecharem. Deixar em branco esconde o mercado do apostador.
      </div>
      {state.catalog.matches.map(m => {
        const tA = teamById(m.teamA), tB = teamById(m.teamB);
        return (
          <div key={m.id} style={{ background: C.surface, border:`1px solid ${C.border}`, borderRadius: 10, marginBottom: 8 }}>
            <button onClick={() => setExpanded(expanded === m.id ? null : m.id)} style={{
              width:'100%', background:'transparent', border:'none', padding: '10px 12px',
              display:'flex', justifyContent:'space-between', alignItems:'center', cursor:'pointer', color: C.text, fontFamily:'inherit',
            }}>
              <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
                <span style={{ fontSize: 10, color: C.textMuted, fontFamily:'monospace' }}>#{m.num}</span>
                <Flag code={tA.code} size={14} /><span style={{ fontSize: 13 }}>{tA.name}</span>
                <span style={{ color: C.textDim }}>×</span>
                <Flag code={tB.code} size={14} /><span style={{ fontSize: 13 }}>{tB.name}</span>
              </div>
              {expanded === m.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
            {expanded === m.id && (
              <div style={{ padding: 12, borderTop: `1px solid ${C.border}`, fontSize: 12 }}>
                <OddEditRow label="Vencedor" cols={[
                  [tA.name, m.odds.vencedor?.home, v => updateOdd(m.id, 'vencedor', 'home', v)],
                  ['Empate', m.odds.vencedor?.draw, v => updateOdd(m.id, 'vencedor', 'draw', v)],
                  [tB.name, m.odds.vencedor?.away, v => updateOdd(m.id, 'vencedor', 'away', v)],
                ]} inputStyle={inputO} />
                <OddEditRow label={`Gols (O${m.odds.overGols?.lineOver}/U${m.odds.overGols?.lineUnder}/E${m.odds.overGols?.exactValue})`} cols={[
                  ['Over', m.odds.overGols?.over, v => updateOdd(m.id, 'overGols', 'over', v)],
                  ['Under', m.odds.overGols?.under, v => updateOdd(m.id, 'overGols', 'under', v)],
                  ['Exato', m.odds.overGols?.exact, v => updateOdd(m.id, 'overGols', 'exact', v)],
                ]} inputStyle={inputO} />
                <OddEditRow label="Tempo+Gols" cols={[
                  ['1ºT', m.odds.tempoGols?.primeiro, v => updateOdd(m.id, 'tempoGols', 'primeiro', v)],
                  ['Emp', m.odds.tempoGols?.empate, v => updateOdd(m.id, 'tempoGols', 'empate', v)],
                  ['2ºT', m.odds.tempoGols?.segundo, v => updateOdd(m.id, 'tempoGols', 'segundo', v)],
                ]} inputStyle={inputO} />
                <OddEditRow label="Tempo+Cartões" cols={[
                  ['1ºT', m.odds.tempoCartoes?.primeiro, v => updateOdd(m.id, 'tempoCartoes', 'primeiro', v)],
                  ['Emp', m.odds.tempoCartoes?.empate, v => updateOdd(m.id, 'tempoCartoes', 'empate', v)],
                  ['2ºT', m.odds.tempoCartoes?.segundo, v => updateOdd(m.id, 'tempoCartoes', 'segundo', v)],
                ]} inputStyle={inputO} />
                <OddEditRow label="Pênalti" cols={[
                  ['Sim', m.odds.penalti?.sim, v => updateOdd(m.id, 'penalti', 'sim', v)],
                  ['Não', m.odds.penalti?.nao, v => updateOdd(m.id, 'penalti', 'nao', v)],
                ]} inputStyle={inputO} />
                <OddEditRow label="Vermelho" cols={[
                  ['Sim', m.odds.vermelho?.sim, v => updateOdd(m.id, 'vermelho', 'sim', v)],
                  ['Não', m.odds.vermelho?.nao, v => updateOdd(m.id, 'vermelho', 'nao', v)],
                ]} inputStyle={inputO} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function OddInputCell({ label, value, onCommit, inputStyle }) {
  // Mantém o texto digitado localmente (aceita "1.", "1.4", etc.)
  // e só converte pra número quando o campo perde o foco.
  const [text, setText] = useState(value == null || value === '' ? '' : String(value));

  // Se o valor de fora mudar (ex: reset), sincroniza
  useEffect(() => {
    setText(value == null || value === '' ? '' : String(value));
  }, [value]);

  const handleChange = (e) => {
    // Aceita só números, ponto e vírgula. Vírgula vira ponto.
    let v = e.target.value.replace(',', '.').replace(/[^0-9.]/g, '');
    // Não deixa ter mais de um ponto
    const parts = v.split('.');
    if (parts.length > 2) v = parts[0] + '.' + parts.slice(1).join('');
    setText(v);
  };

  const handleBlur = () => {
    if (text === '' || text === '.') {
      onCommit('');
      setText('');
      return;
    }
    const num = parseFloat(text);
    if (isNaN(num)) {
      onCommit('');
      setText('');
    } else {
      onCommit(num);
      setText(String(num));
    }
  };

  return (
    <div style={{ display:'flex', alignItems:'center', gap: 4 }}>
      <span style={{ fontSize: 10, color: C.textDim, minWidth: 32 }}>{label}</span>
      <input
        value={text}
        onChange={handleChange}
        onBlur={handleBlur}
        inputMode="decimal"
        placeholder="—"
        style={inputStyle}
      />
    </div>
  );
}

function OddEditRow({ label, cols, inputStyle }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontSize: 10, color: C.textMuted, textTransform:'uppercase', letterSpacing:'0.08em', marginBottom: 3, fontWeight:500 }}>{label}</div>
      <div style={{ display:'flex', gap: 6, alignItems:'center' }}>
        {cols.map(([lbl, val, onChange], i) => (
          <OddInputCell key={i} label={lbl} value={val} onCommit={onChange} inputStyle={inputStyle} />
        ))}
      </div>
    </div>
  );
}

function SettingsTab({ state, updateState }) {
  const [s, setS] = useState({ ...state.settings });
  const save = () => updateState(st => ({ ...st, settings: s }));
  const reset = async () => {
    if (!confirm('Apagar TODAS as apostas, apostadores e resultados? Não dá pra desfazer.')) return;
    if (!confirm('Tem certeza absoluta? Isso é irreversível.')) return;
    const fresh = emptyState();
    await saveShared(fresh);
    location.reload();
  };

  const inp = { background: C.bg, border:`1px solid ${C.border}`, color: C.text, padding:'10px 12px', borderRadius: 6, fontSize: 14, width: '100%', outline:'none', fontFamily:'inherit' };
  const lbl = { fontSize: 11, color: C.textMuted, marginBottom: 4, textTransform:'uppercase', letterSpacing:'0.08em', fontWeight: 500 };

  return (
    <div>
      <div style={{ background: C.surface, border:`1px solid ${C.border}`, borderRadius: 10, padding: 14, marginBottom: 10 }}>
        <div style={{ marginBottom: 12 }}>
          <div style={lbl}>Chave PIX</div>
          <input value={s.pixKey} onChange={e => setS({...s, pixKey: e.target.value})} style={inp} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={lbl}>WhatsApp (DDI+DDD+número)</div>
          <input value={s.whatsapp} onChange={e => setS({...s, whatsapp: e.target.value})} style={inp} />
        </div>
        <div style={{ marginBottom: 12 }}>
          <div style={lbl}>Senha admin</div>
          <input value={s.adminPassword} onChange={e => setS({...s, adminPassword: e.target.value})} style={inp} />
        </div>
        <PrimaryButton onClick={save}><Check size={14} /> Salvar</PrimaryButton>
      </div>

      <div style={{ background: C.surface, border:`1px solid ${C.danger}`, borderRadius: 10, padding: 14 }}>
        <div style={{ color: C.danger, fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Zona perigosa</div>
        <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 10 }}>Apaga apostas, apostadores e resultados. Mantém o catálogo de jogos e odds.</div>
        <button onClick={reset} style={{ background:'transparent', color: C.danger, border:`1px solid ${C.danger}`, padding: '9px 14px', borderRadius: 6, fontSize: 13, fontWeight: 600, cursor:'pointer', fontFamily:'inherit' }}>
          <Trash2 size={14} style={{ verticalAlign:'-2px', marginRight: 4 }} /> Resetar bolão
        </button>
      </div>
    </div>
  );
}

// =========================================================================
// ADMIN APP
// =========================================================================
function AdminApp({ state, setState, onExit }) {
  const [logged, setLogged] = useState(false);
  const [tab, setTab] = useState('pending');

  if (!logged) return <AdminLogin onLogin={() => setLogged(true)} settings={state.settings} />;

  const tabs = [
    { id:'pending', label:'Pagamentos', icon: Wallet },
    { id:'liquidate', label:'Liquidar', icon: Check },
    { id:'futures_settle', label:'Futuras', icon: Trophy },
    { id:'bettors', label:'Apostadores', icon: Users },
    { id:'bets', label:'Apostas', icon: Receipt },
    { id:'ranking', label:'Ranking', icon: BarChart3 },
    { id:'odds', label:'Odds', icon: Edit2 },
    { id:'settings', label:'Config', icon: SettingsIcon },
  ];

  return (
    <div style={{ minHeight:'100vh', background: C.bg }}>
      <header style={{ background: C.bg, borderBottom: `1px solid ${C.border}`, padding: '12px 16px', position:'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', maxWidth: 700, margin: '0 auto' }}>
          <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
            <Logo small />
            <Pill color="amber">Admin</Pill>
          </div>
          <button onClick={onExit} style={{ background:'none', border:`1px solid ${C.border}`, color: C.text, padding: '6px 10px', borderRadius: 6, fontSize: 12, cursor:'pointer', fontFamily:'inherit', display:'inline-flex', alignItems:'center', gap: 4 }}>
            <LogOut size={12} /> Sair do admin
          </button>
        </div>
      </header>
      <div style={{ display:'flex', overflowX:'auto', background: C.bg, borderBottom: `1px solid ${C.border}`, position:'sticky', top: 56, zIndex: 49 }}>
        <div style={{ maxWidth: 700, margin: '0 auto', width:'100%', display:'flex' }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: '10px 12px', background:'transparent', border:'none',
              borderBottom: `2px solid ${tab === t.id ? C.accent : 'transparent'}`,
              color: tab === t.id ? C.accent : C.textMuted,
              fontSize: 11, fontWeight: 600, cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap',
              display:'inline-flex', alignItems:'center', gap: 4, textTransform:'uppercase', letterSpacing:'0.06em',
            }}>
              <t.icon size={12} /> {t.label}
            </button>
          ))}
        </div>
      </div>
      <main style={{ padding: 14, maxWidth: 700, margin: '0 auto' }}>
        <AdminTabContent tab={tab} state={state} setState={setState} />
      </main>
    </div>
  );
}

// =========================================================================
// ROOT
// =========================================================================
export default function App() {
  const [state, setState] = useState(null);
  const [me, setMe] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Detect /admin in URL hash
  useEffect(() => {
    const checkAdmin = () => setIsAdmin(window.location.hash === '#admin');
    checkAdmin();
    window.addEventListener('hashchange', checkAdmin);
    return () => window.removeEventListener('hashchange', checkAdmin);
  }, []);

  // Load state + me
  useEffect(() => {
    (async () => {
      let shared = await loadShared();
      if (!shared) {
        shared = emptyState();
        await saveShared(shared);
      } else {
        // Ensure catalog stays current (refresh from code)
        shared.catalog = { ...emptyState().catalog, ...shared.catalog };
        shared.settings = { ...emptyState().settings, ...shared.settings };
      }
      setState(shared);
      const local = await loadMe();
      if (local) setMe(local);
      setLoaded(true);
    })();
  }, []);

  // Poll shared state every 10s to pick up updates from other users
  useEffect(() => {
    if (!loaded) return;
    const t = setInterval(async () => {
      const fresh = await loadShared();
      if (fresh) setState(fresh);
    }, 10000);
    return () => clearInterval(t);
  }, [loaded]);

  if (!loaded) {
    return <div style={{ minHeight:'100vh', background: C.bg, display:'flex', alignItems:'center', justifyContent:'center' }}><Logo /></div>;
  }

  if (isAdmin) {
    return <AdminApp state={state} setState={setState} onExit={() => { window.location.hash = ''; setIsAdmin(false); }} />;
  }

  const handleOnboard = async (data) => {
    const newBettor = { id: newId('u_'), ...data, createdAt: new Date().toISOString() };
    // Carrega o estado mais recente do banco
    const fresh = await loadShared();
    if (!fresh) {
      alert('Não foi possível conectar ao servidor. Verifique sua internet e tente novamente.');
      return;
    }
    // Já existe esse cpf+telefone?
    const existing = (fresh.bettors || []).find(b => b.cpf === data.cpf && b.phone === data.phone);
    let bettor;
    if (existing) {
      bettor = existing;
      // Garante que o cadastro local aponta pro apostador certo
      await saveMe(bettor);
      setMe(bettor);
      setState(fresh);
      return;
    }
    // Novo apostador: adiciona e salva
    bettor = newBettor;
    const updated = { ...fresh, bettors: [...(fresh.bettors || []), newBettor] };
    await saveShared(updated);
    // Confirma que realmente gravou no banco antes de prosseguir
    const verify = await loadShared();
    const saved = verify && (verify.bettors || []).some(b => b.id === newBettor.id);
    if (!saved) {
      alert('Erro ao salvar seu cadastro no servidor. Tente novamente em alguns segundos.');
      return;
    }
    setState(verify);
    await saveMe(bettor);
    setMe(bettor);
  };

  const logout = async () => {
    await deleteMe();
    setMe(null);
  };

  if (!me) return <Onboarding onSubmit={handleOnboard} onAdminEnter={() => setIsAdmin(true)} />;

  return <BettorApp me={me} state={state} setState={setState} onLogout={logout} onAdminEnter={() => setIsAdmin(true)} />;
}
