import {
  minsToHHMM,
  getDayType,
  getUrgencyState,
  getUrgencyClass,
  getReachabilityState,
  getConnectionState,
  getActiveTrips,
  getRecentlyDeparted,
  isGlobalInactive,
  isLineDisrupted,
  hasServiceToday,
  formatWait,
  getScheduleKey,
  unique,
  escapeHtml
} from "./utils.js";

import { calcNextTrain, buildCanegrateBlock } from "./trains.js";
import { getStopName } from "./line-config.js";

let lastArgs = null;

export function renderLive(state, lineData, lineConfig, cfg, saveSettings) {
  lastArgs = { state, lineData, lineConfig, cfg, saveSettings };
  const container = document.getElementById("live-content");
  if (!container) return;

  const now = new Date();
  const currentMin = now.getHours() * 60 + now.getMinutes();
  const dayType = getDayType(now, cfg);
  const direction = state.settings.liveDirection || cfg.defaults.liveDirection || "outbound";
  const lineOrder = cfg.lineOrder || Object.keys(lineConfig);
  const title = direction === "return" ? "Ritorno verso Busto Garolfo" : "Andata da Busto Garolfo";
  const subtitle = direction === "return"
    ? "Da Repubblica, Molino Dorino, Pregnana FS e altri interscambi supportati."
    : "Fermate preferite con fallback automatico per ogni linea.";

  let html = `
    <section class="hero-panel">
      <div>
        <p class="section-eyebrow">${escapeHtml(cfg.homeProfile.address)}</p>
        <h2>${title}</h2>
        <p>${escapeHtml(subtitle)}</p>
      </div>
      <div class="segmented" data-live-direction>
        <button type="button" data-dir="outbound" class="${direction === "outbound" ? "active" : ""}">Andata</button>
        <button type="button" data-dir="return" class="${direction === "return" ? "active" : ""}">Ritorno</button>
      </div>
    </section>`;

  if (isGlobalInactive(now, cfg)) {
    html += `<div class="banner banner-danger">Servizio sospeso: ${escapeHtml(cfg.globalInactivity.note)}</div>`;
  }

  const cards = [];
  for (const lineId of lineOrder) {
    if (!lineConfig[lineId]?.showInLive) continue;
    const hasService = hasServiceToday(lineId, dayType, lineConfig, lineData, now, cfg);
    const disrupted = isLineDisrupted(lineId, now, cfg);
    if (!hasService && !disrupted) continue;
    const card = direction === "return"
      ? buildReturnCard(lineId, state, lineData, lineConfig, cfg, currentMin, dayType, disrupted)
      : buildOutboundCard(lineId, state, lineData, lineConfig, cfg, currentMin, dayType, disrupted);
    if (card) cards.push(card);
  }

  if (cards.length === 0) {
    html += `<div class="empty-state">Nessuna corsa utile trovata per questa modalità.</div>`;
  } else {
    cards.sort(compareCardsByDeparture);
    const hero = cards.find(card => card.lineId === "Z649" && card.hasTrips);
    if (hero) html += renderFeaturedCard(hero, direction, cfg, currentMin, state);
    html += `<div class="section-title">Linee attive</div>`;
    html += cards.map(card => renderLineCard(card, direction, cfg, currentMin)).join("");
  }

  html += renderRecentlyDepartedBlock(state, lineData, lineConfig, cfg, currentMin, dayType, direction);
  html += renderCanegrateBlock(state, currentMin, cfg);
  html += `<div class="app-footer">Dati aggiornati al ${escapeHtml(cfg.lastUpdate)}. Coincidenze treno/metro stimate.</div>`;

  container.innerHTML = html;
  bindLiveEvents(container);
}

function getUserFavorite(state, cfg, lineId, direction) {
  return state.settings?.favoriteStops?.[lineId]?.[direction] || cfg.favoriteStops?.[lineId]?.[direction] || null;
}

function getProfile(cfg, lineId) {
  return cfg.stopProfiles?.[lineId] || {};
}

function compareCardsByDeparture(a, b) {
  const aMin = a.trip?._depMin ?? Number.POSITIVE_INFINITY;
  const bMin = b.trip?._depMin ?? Number.POSITIVE_INFINITY;
  if (aMin !== bMin) return aMin - bMin;
  return a.lineId.localeCompare(b.lineId);
}

function buildOutboundCard(lineId, state, lineData, lineConfig, cfg, currentMin, dayType, disrupted) {
  const config = lineConfig[lineId];
  const profile = getProfile(cfg, lineId);
  const scheduleKey = getScheduleKey(lineId, dayType, "outbound");
  const trips = lineData[lineId]?.[scheduleKey] || [];
  const preferred = getUserFavorite(state, cfg, lineId, "outbound");
  const fallbacks = profile.outboundHomeStops || config.referenceStops || [];
  const nextTrips = getActiveTrips(trips, currentMin, 3, preferred, fallbacks);
  const trip = nextTrips[0] || null;
  const compactStops = getConfiguredStops(state, cfg, lineId, "compactStops", "outbound", profile.compactStops?.outbound || config.referenceStops || []);
  const detailStops = getConfiguredStops(state, cfg, lineId, "detailStops", "outbound", profile.detailStops?.outbound || compactStops);

  return {
    lineId,
    config,
    direction: "outbound",
    hasTrips: nextTrips.length > 0,
    disrupted,
    validities: unique(trips.map(t => t.validity)),
    nextTrips,
    trip,
    fromStop: trip?._depStop || preferred || fallbacks[0],
    toStop: compactStops.at(-1),
    compactStops,
    detailStops,
    scheduleKey
  };
}

function buildReturnCard(lineId, state, lineData, lineConfig, cfg, currentMin, dayType, disrupted) {
  const config = lineConfig[lineId];
  const profile = getProfile(cfg, lineId);
  const scheduleKey = getScheduleKey(lineId, dayType, "return");
  const trips = lineData[lineId]?.[scheduleKey] || [];
  const interchanges = profile.returnInterchanges || [];
  const preferredInterchange = state.settings?.returnInterchanges?.[lineId] || interchanges[0] || null;
  const nextTrips = getActiveTrips(trips, currentMin, 3, preferredInterchange, interchanges);
  const trip = nextTrips[0] || null;
  const homeStops = [getUserFavorite(state, cfg, lineId, "return"), ...(profile.returnHomeStops || [])].filter(Boolean);
  const compactStops = getConfiguredStops(state, cfg, lineId, "compactStops", "return", profile.compactStops?.return || homeStops);
  const detailStops = getConfiguredStops(state, cfg, lineId, "detailStops", "return", profile.detailStops?.return || [preferredInterchange, ...homeStops]);
  const arrival = trip ? chooseArrivalAfter(trip, homeStops, trip._depMin) : null;

  return {
    lineId,
    config,
    direction: "return",
    hasTrips: nextTrips.length > 0,
    disrupted,
    validities: unique(trips.map(t => t.validity)),
    nextTrips,
    trip,
    fromStop: trip?._depStop || preferredInterchange,
    toStop: arrival?.stopCode || homeStops[0],
    compactStops,
    detailStops,
    scheduleKey,
    returnOrigins: profile.returnConnectionOrigins || [],
    arrival
  };
}

function getConfiguredStops(state, cfg, lineId, kind, direction, defaults) {
  const custom = state.settings?.visibleStops?.[lineId]?.[kind]?.[direction];
  return custom?.length ? custom : defaults;
}

function chooseArrivalAfter(trip, candidates, afterMin) {
  for (const code of candidates) {
    const minutes = trip.stops?.[code];
    if (minutes !== undefined && minutes !== null && minutes >= afterMin) return { stopCode: code, minutes };
  }
  return null;
}

function renderFeaturedCard(card, direction, cfg, currentMin, state) {
  const trip = card.trip;
  const wait = trip._depMin - currentMin;
  const walkMin = Number(state.settings?.walkRossini || cfg.defaults.walkRossini || 0);
  const busState = getUrgencyState(wait);
  const reachability = direction === "outbound" ? getReachabilityState(wait, walkMin) : busState;
  const urgency = busState.css === "missed" ? busState : reachability;
  const primaryStops = renderStopChips(trip, card.compactStops, "large");
  const subtitle = direction === "return"
    ? `Da ${getStopName(card.fromStop)} verso ${getStopName(card.toStop)}`
    : `Da ${getStopName(card.fromStop)} verso ${card.config.destination}`;

  return `<section class="featured-card ${urgency.css}">
    <div class="featured-top">
      <span class="line-pill">${card.lineId}</span>
      <span class="status-pill ${urgency.css}">${urgency.label}</span>
    </div>
    <h2>${minsToHHMM(trip._depMin)}</h2>
    <p>${subtitle} · fra ${formatWait(wait)}${direction === "outbound" ? ` · a piedi ${walkMin} min` : ""}</p>
    ${primaryStops}
    ${direction === "outbound" && card.lineId === "Z649" ? renderZ649DestinationEstimates(trip, cfg) : ""}
  </section>`;
}

function renderLineCard(card, direction, cfg, currentMin) {
  const id = `live-${card.lineId}`;
  const isExpanded = false;
  const trip = card.trip;
  const wait = trip ? trip._depMin - currentMin : null;
  const urgencyClass = trip ? getUrgencyClass(wait) : "urgency-missed";
  const compact = trip ? renderStopChips(trip, card.compactStops) : "";
  const nextDisplay = trip ? `${minsToHHMM(trip._depMin)} · ${formatWait(wait)}` : "Nessun bus";
  const routeLabel = direction === "return"
    ? `${getStopName(card.fromStop)} -> ${getStopName(card.toStop)}`
    : `${getStopName(card.fromStop)} -> ${card.config.destination}`;
  const fallback = trip?._usedFallback ? `<span class="notice-inline">fermata alternativa</span>` : "";

  return `<article class="line-card ${isExpanded ? "expanded" : ""}" data-card="${id}">
    <button class="line-card-header" type="button" data-toggle-card="${id}">
      <div class="line-main">
        <span class="line-pill">${card.lineId}</span>
        <div>
          <h3>${escapeHtml(routeLabel)}</h3>
          <p>${fallback}${renderValidity(card.validities)}</p>
        </div>
      </div>
      <div class="line-meta">
        <strong>${nextDisplay}</strong>
        <span class="urgency-dot ${urgencyClass}"></span>
      </div>
    </button>
    ${compact}
    <div class="line-card-body">
      ${card.disrupted ? renderDisruption(card.lineId, cfg) : ""}
      ${trip ? renderTripDetails(card, cfg) : `<div class="empty-mini">Nessuna corsa nelle prossime ore.</div>`}
      ${renderUpcomingTrips(card)}
    </div>
  </article>`;
}

function renderValidity(validities) {
  if (!validities.length) return "";
  return validities.map(v => `<span class="validity-badge">${escapeHtml(v)}</span>`).join("");
}

function renderDisruption(lineId, cfg) {
  const d = cfg.serviceDisruptions?.[lineId]?.[0];
  return `<div class="banner banner-warning">Possibile sospensione fino al ${escapeHtml(d?.to || "?")}: ${escapeHtml(d?.note || "")}</div>`;
}

function renderStopChips(trip, stops, size = "") {
  const chips = (stops || [])
    .map(code => {
      const mins = trip.stops?.[code];
      return `<span class="stop-chip ${size}">
        <small>${escapeHtml(getStopName(code))}</small>
        <strong>${mins !== undefined && mins !== null ? minsToHHMM(mins) : "-"}</strong>
      </span>`;
    })
    .join("");
  return chips ? `<div class="stop-chip-row">${chips}</div>` : "";
}

function renderTripDetails(card, cfg) {
  const trip = card.trip;
  const timeline = card.detailStops
    .map(code => ({ code, minutes: trip.stops?.[code] }))
    .filter(s => s.minutes !== undefined && s.minutes !== null)
    .map(s => `<div class="timeline-node">
      <span></span>
      <strong>${minsToHHMM(s.minutes)}</strong>
      <small>${escapeHtml(getStopName(s.code))}</small>
    </div>`)
    .join("");

  const connections = renderConnections(card, cfg);
  return `<div class="timeline">${timeline}</div>${connections}`;
}

function renderConnections(card, cfg) {
  const trip = card.trip;
  if (card.direction === "return") {
    const origins = card.returnOrigins
      .map(origin => {
        const dep = trip.stops?.[origin.interchangeStop];
        if (dep === undefined || dep === null) return "";
        const leaveOrigin = dep - origin.minutesToInterchange;
        const wait = trip._depMin - dep;
        const state = getConnectionState(Math.max(0, wait), cfg);
        return `<div class="connection-row">
          <span>${escapeHtml(origin.label)} -> ${escapeHtml(getStopName(origin.interchangeStop))}</span>
          <strong>${minsToHHMM(leaveOrigin)} -> bus ${minsToHHMM(trip._depMin)}</strong>
          <em class="${state.css}">${state.label}</em>
        </div>`;
      })
      .join("");
    return origins ? `<div class="connection-box"><h4>Coincidenze stimate</h4>${origins}</div>` : "";
  }

  const rows = [];
  for (const code of card.compactStops || []) {
    const arrMin = trip.stops?.[code];
    const interchange = cfg.interchanges?.[code];
    if (arrMin === undefined || arrMin === null || !interchange) continue;
    if (interchange.trainSlot) {
      const train = calcNextTrain(interchange.trainSlot, arrMin)[0];
      if (train) {
        const state = getConnectionState(train.waitMin, cfg);
        rows.push(`<div class="connection-row">
          <span>${escapeHtml(interchange.label)} · ${escapeHtml(interchange.type)}</span>
          <strong>${minsToHHMM(train.departureMin)} (+${train.waitMin} min)</strong>
          <em class="${state.css}">${state.label}</em>
        </div>`);
      }
    } else if (interchange.type === "M1") {
      rows.push(`<div class="connection-row">
        <span>${escapeHtml(interchange.label)} · M1</span>
        <strong>da ${minsToHHMM(arrMin)}</strong>
        <em class="calm">stimata</em>
      </div>`);
    }
  }
  return rows.length ? `<div class="connection-box"><h4>Coincidenze stimate</h4>${rows.join("")}</div>` : "";
}

function renderZ649DestinationEstimates(trip, cfg) {
  const pg = trip.stops?.PG102;
  const md = trip.stops?.MD111;
  const parts = [];
  if (pg !== undefined) {
    const rep = cfg.s5s6_destinations.find(d => d.name === "Repubblica");
    if (rep) parts.push(`Repubblica via Pregnana ~${minsToHHMM(pg + rep.minutesFromPregnana)}`);
  }
  if (md !== undefined) {
    const repM1 = cfg.m1_destinations.find(d => d.id === "repubblica");
    if (repM1) parts.push(`Repubblica via M1 ~${minsToHHMM(md + repM1.minutesFromMolino)}`);
  }
  if (!parts.length) parts.push("Repubblica: questa corsa non mostra una coincidenza utile");
  return `<div class="destination-estimates">${parts.map(escapeHtml).join(" · ")}</div>`;
}

function renderUpcomingTrips(card) {
  if (card.nextTrips.length <= 1) return "";
  return `<div class="next-list">
    <h4>Prossime corse</h4>
    ${card.nextTrips.slice(1).map(t => `<div>
      <span>${minsToHHMM(t._depMin)} da ${escapeHtml(getStopName(t._depStop))}</span>
      <strong>${escapeHtml(t.validity || "")}</strong>
    </div>`).join("")}
  </div>`;
}

function renderRecentlyDepartedBlock(state, lineData, lineConfig, cfg, currentMin, dayType, direction) {
  const recent = [];
  for (const lineId of cfg.lineOrder || []) {
    const profile = getProfile(cfg, lineId);
    const key = getScheduleKey(lineId, dayType, direction);
    const preferred = direction === "return"
      ? profile.returnInterchanges?.[0]
      : getUserFavorite(state, cfg, lineId, "outbound");
    const fallbacks = direction === "return" ? profile.returnInterchanges : profile.outboundHomeStops;
    const departed = getRecentlyDeparted(lineData[lineId]?.[key] || [], currentMin, 30, preferred, fallbacks);
    departed.forEach(t => recent.push({ lineId, depMin: t._depMin, stop: t._depStop, ago: currentMin - t._depMin }));
  }
  recent.sort((a, b) => a.ago - b.ago);
  if (!recent.length) return "";
  return `<section class="recent-section">
    <h3>Partiti di recente</h3>
    ${recent.slice(0, 5).map(r => `<div class="recent-item">
      <span>${r.lineId} · ${escapeHtml(getStopName(r.stop))}</span>
      <strong>${r.ago} min fa</strong>
    </div>`).join("")}
  </section>`;
}

function renderCanegrateBlock(state, currentMin, cfg) {
  const driveMin = Number(state.settings?.driveCanegrate || cfg.defaults.driveCanegrate);
  const block = buildCanegrateBlock(driveMin, currentMin);
  const trains = block.trains.slice(0, 2).map(t => `<div class="recent-item">
    <span>${escapeHtml(t.line)} da Canegrate</span>
    <strong>${minsToHHMM(t.departureMin)} · +${t.waitMin} min</strong>
  </div>`).join("");
  return `<section class="alt-block">
    <h3>Alternativa Canegrate FS</h3>
    <p>${driveMin} min in auto. ${escapeHtml(cfg.canegrate.note)}</p>
    ${trains || `<div class="empty-mini">Nessun treno stimato.</div>`}
  </section>`;
}

function bindLiveEvents(container) {
  container.querySelectorAll("[data-dir]").forEach(button => {
    button.addEventListener("click", () => {
      const { state, lineData, lineConfig, cfg, saveSettings } = lastArgs;
      saveSettings({ liveDirection: button.dataset.dir });
      renderLive(state, lineData, lineConfig, cfg, saveSettings);
    });
  });
  container.querySelectorAll("[data-toggle-card]").forEach(button => {
    button.addEventListener("click", () => {
      const card = container.querySelector(`[data-card="${button.dataset.toggleCard}"]`);
      card?.classList.toggle("expanded");
    });
  });
}
