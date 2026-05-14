export const LINE_CONFIG = {
  Z649: {
    label: "Z649 - Molino Dorino M1",
    shortName: "Z649",
    destination: "Molino Dorino M1",
    type: "bidirectional",
    referenceStops: ["BT775", "PG102", "MD111"],
    connections: {
      PG102: { type: "S5/S6", slotKey: "PG102" },
      PG101: { type: "S5/S6", slotKey: "PG102" },
      MD111: { type: "M1" },
      MD001: { type: "M1" }
    },
    showInLive: true,
    noService: { saturday: false, sunday: false },
    notes: "Linea principale per Pregnana FS e Molino Dorino. Alcune corse feriali sono brevi."
  },
  Z644: {
    label: "Z644 - Arconate <-> Parabiago FS",
    shortName: "Z644",
    destination: "Parabiago FS",
    type: "bidirectional",
    referenceStops: ["BT775", "PB090"],
    connections: { PB090: { type: "S5", slotKey: "PB090" } },
    showInLive: true,
    noService: { saturday: false, sunday: true },
    notes: "Linea utile per Parabiago FS. Nessun servizio festivo."
  },
  Z627: {
    label: "Z627 - Busto Garolfo / Cuggiono -> Legnano FS",
    shortName: "Z627",
    destination: "Legnano FS",
    type: "bidirectional",
    referenceStops: ["BT703", "LG090"],
    connections: { LG090: { type: "S5", slotKey: "LG090" } },
    showInLive: true,
    noService: { saturday: false, sunday: true },
    notes: "Linea per Legnano FS. Alcune corse scolastiche hanno percorso ridotto."
  },
  Z625: {
    label: "Z625 -> Busto Arsizio FS",
    shortName: "Z625",
    destination: "Busto Arsizio FS",
    type: "bidirectional",
    referenceStops: ["BT701", "BS090"],
    connections: {
      BS090: { type: "S5/RE", slotKey: "BS090_S5" },
      BS090_RE: { type: "RE", slotKey: "BS090_RE", stopCode: "BS090" }
    },
    showInLive: true,
    noService: { saturday: false, sunday: true },
    notes: "Linea verso Busto Arsizio FS. Alcune corse non raggiungono tutte le fermate."
  },
  Z642: {
    label: "Z642 - Busto G. / Villa Cortese -> Legnano FS",
    shortName: "Z642",
    destination: "Legnano FS",
    type: "bidirectional",
    referenceStops: ["BT776", "LG090"],
    connections: { LG090: { type: "S5", slotKey: "LG090" } },
    showInLive: true,
    noService: { saturday: false, sunday: true },
    notes: "Linea lunga con corse feriali e scolastiche."
  },
  Z647: {
    label: "Z647 - Busto Garolfo <-> Castano Primo",
    shortName: "Z647",
    destination: "Castano Primo",
    type: "bidirectional",
    referenceStops: ["BT956", "CT100"],
    connections: {},
    showInLive: true,
    noService: { saturday: true, sunday: true },
    notes: "Linea scolastica feriale."
  }
};

export const STOP_NAMES = {
  // ── Busto Garolfo ──────────────────────────────────────────────────────
  BT999: "Busto G. Deposito (V. Busto A. 131)",
  BT949: "Busto G. Piscina (V. Busto A. 91)",
  BT951: "Busto G. Piscina (V. Busto A. 90)",
  BT205: "Busto G. Via Busto A. fr 48",
  BT775: "Busto G. Via Rossini 35",
  BT776: "Busto G. Via Bellini 44",
  BT400: "Busto G. Via Matteotti 6",
  BT300: "Busto G. Via Matteotti 5",
  BT301: "Busto G. Via Buonarroti a. Busto A.",
  BT211: "Busto G. Via Parabiago 32",
  BT215: "Busto G. Via Parabiago 61",
  BT701: "Busto G. Via Curiel",
  BT702: "Busto G. Via Don Longoni",
  BT703: "Busto G. Via Buonarroti a. Carroccio",
  BT704: "Busto G. Via Curiel a. De Amicis",
  BT947: "Busto G. Via Buonarroti civ 3",
  BT956: "Busto G. Via Montebianco 17",

  // ── Villa Cortese ──────────────────────────────────────────────────────
  VC005: "Villa Cortese Via Canova a. Buonarroti",
  VC006: "Villa Cortese Via Canova a. Perugino",
  VC050: "Villa Cortese Via Da Giussano 32",
  VC051: "Villa Cortese Via Da Giussano 50",
  VC801: "Villa Cortese Via Pietro Micca 17",
  VC807: "Villa Cortese Via Pietro Micca 38",

  // ── Dairago ────────────────────────────────────────────────────────────
  DG097: "Dairago Via Verdi 24",
  DG099: "Dairago Via Verdi 13",
  DG141: "Dairago Via D. Chiesa (Municipio)",
  DG142: "Dairago Via D. Chiesa civ. 11",
  DG801: "Dairago Via Circonvallazione a. Zara",
  DG807: "Dairago Via Circonvallazione 48",

  // ── Arconate ───────────────────────────────────────────────────────────
  AC035: "Arconate Via Concordia fr 13",
  AC127: "Arconate V. Beata Vergine a. Pioppi",
  AC128: "Arconate V. Beata Vergine a. Tigli",
  AC625: "Arconate Via Concordia 9",
  AC627: "Arconate Via Legnano 28",
  AC628: "Arconate Via Legnano 11",
  AC802: "Arconate Via Varese 44",
  AC809: "Arconate Via Varese a. Moina",
  AC811: "Arconate Via Volta a. XXIV Maggio",

  // ── Olcella ────────────────────────────────────────────────────────────
  OC113: "Olcella Via Montebello 16",
  OC114: "Olcella Via Montebello 11",

  // ── S. Giorgio su Legnano ──────────────────────────────────────────────
  SG001: "S. Giorgio Loc. La Pergola",
  SG050: "S. Giorgio Via Restelli 5",
  SG182: "S. Giorgio Via Roma a. Acquedotto",
  SG801: "S. Giorgio V. Boccaccio a. Magenta",
  SG807: "S. Giorgio Via Roma (fr Da Vinci)",

  // ── Legnano ────────────────────────────────────────────────────────────
  LG001: "Legnano C.so Sempione Ospedale Vecchio",
  LG002: "Legnano C.so Sempione Madonnina",
  LG003: "Legnano Largo Tosi (lato banca)",
  LG025: "Legnano V. XX Sett. (S. Giorgio)",
  LG061: "Legnano Via XX Sett. a. S. Bernardino",
  LG090: "Legnano FS (P.zza del Popolo)",
  LG091: "Legnano FS (P.zza del Popolo)",
  LG112: "Legnano Liceo (V. Guerciotti)",
  LG171: "Legnano C.so Sempione Ospedale",
  LG172: "Legnano C.so Sempione Madonnina",
  LG173: "Legnano Largo Tosi (lato portici)",
  LG508: "Legnano Via Milano a. S. Caterina",
  LG611: "Legnano V. XX Sett. a. S. Bernardino",
  LG805: "Legnano V. XX Settembre civ. 7",
  LG807: "Legnano V. XX Sett. (P. V. Veneto)",
  LG990: "Legnano P.zza Monumento FS",

  // ── Parabiago ──────────────────────────────────────────────────────────
  PB090: "Parabiago FS (Autostazione)",
  PB100: "Parabiago Plesso Maggiolini",
  PB101: "Parabiago Ist. Maggiolini",
  PB701: "Parabiago V.le Lombardia (EuroSpin)",
  PB702: "Parabiago V.le Lombardia (EuroSpin)",

  // ── Casorezzo ──────────────────────────────────────────────────────────
  CZ010: "Casorezzo Via Busto G. a. S. Salvatore",
  CZ070: "Casorezzo Via Ossona (Area Zucchi)",
  CZ080: "Casorezzo Via Bertani fr 19",
  CZ088: "Casorezzo Via Bertani a. Parabiago",
  CZ093: "Casorezzo Via E. Mattei fr 1",
  CZ094: "Casorezzo Via Arluno a. Chiuse",

  // ── Ossona ─────────────────────────────────────────────────────────────
  OS001: "Ossona Via Patriotti fr 118A",
  OS011: "Ossona Via Patrioti 4",

  // ── Arluno ─────────────────────────────────────────────────────────────
  AL028: "Arluno Via Mazzini a. Don Sturzo",
  AL029: "Arluno Via Mazzini 6",
  AL040: "Arluno Via Giovanni XXIII 43",
  AL050: "Arluno Via Turati fr 58",
  AL051: "Arluno Via Turati 58",
  AL185: "Arluno P.zza De Gasperi (Municipio)",
  AL195: "Arluno P.zza De Gasperi (Municipio)",
  AL196: "Arluno Via Marconi 118",
  AL201: "Arluno Via Mazzini 7",
  AL501: "Arluno P.zza Pozzo Bonelli (Chiesa)",
  AL801: "Arluno Via Adua a. Giovanni XXIII",
  AL802: "Arluno Via Adua a. Giovanni XXIII",

  // ── Rogorotto ──────────────────────────────────────────────────────────
  RG001: "Rogorotto Via S. Caterina 5",
  RG011: "Rogorotto Via S. Caterina 4",

  // ── Mantegazza ─────────────────────────────────────────────────────────
  MN015: "Mantegazza Via Madonnina (Bivio)",
  MN021: "Mantegazza Via Madonnina (Bivio)",

  // ── Pregnana Milanese ──────────────────────────────────────────────────
  PG005: "Pregnana Via Roma a. Olivetti",
  PG008: "Pregnana Via Marconi (Rondò)",
  PG009: "Pregnana Via Giovanni XXIII 55",
  PG030: "Pregnana Via Roma a. Puccini",
  PG031: "Pregnana Via Roma a. Carducci",
  PG055: "Pregnana Via Roma 17 a. Olivetti",
  PG099: "Pregnana Via Giovanni XXIII a. Torino",
  PG101: "Pregnana FS (V. Marconi 67)",
  PG102: "Pregnana FS (V. Marconi – Stazione)",
  PG111: "Pregnana Via Marconi",

  // ── Cornaredo ──────────────────────────────────────────────────────────
  CD150: "Cornaredo Via San Carlo a. Ponti",
  CD155: "Cornaredo Via San Carlo a. Ponti",
  CD160: "Cornaredo Via Mazzini a. Brera",
  CD166: "Cornaredo Via Mazzini a. Brera",

  // ── Vighignolo ─────────────────────────────────────────────────────────
  VH237: "Vighignolo Via Mereghetti 22",
  VH238: "Vighignolo Via Mereghetti 7",

  // ── Milano ─────────────────────────────────────────────────────────────
  MD001: "Milano Molino Dorino M1",
  MD111: "Milano Molino Dorino M1",

  // ── Busto Arsizio ──────────────────────────────────────────────────────
  BS001: "Busto A. Via XX Settembre a. Marconi",
  BS003: "Busto A. Via Crespi a. P. Trento",
  BS011: "Busto A. P.zza Trento e Trieste",
  BS027: "Busto A. V.le Cadorna a. Piemonte",
  BS057: "Busto A. Via Castelfidardo",
  BS071: "Busto A. ITC Tosi (Cascina de Poveri)",
  BS085: "Busto A. Via Zappellini",
  BS087: "Busto A. Viale Boccaccio",
  BS090: "Busto A. FS (P.zza Vol. Libertà)",
  BS212: "Busto A. Corso Italia (Ospedale)",
  BS451: "Busto A. Via Boccaccio fr Lodi",
  BS452: "Busto A. Via Ugo Foscolo fr 8",
  BS455: "Busto A. V.le Boccaccio a. Ferrini",
  BS456: "Busto A. V.le Boccaccio a. Ferrini",

  // ── Magenta ────────────────────────────────────────────────────────────
  MG306: "Magenta Via Novara 95",
  MG401: "Magenta Via Tragella (dir. Rossini)",
  MG402: "Magenta Via Tragella (dir. Milano)",
  MG501: "Magenta Via Novara 15",
  MG502: "Magenta Via Cavallari 28",
  MG561: "Magenta Via Brocca 41 (Stazione)",
  MG701: "Magenta Via Milano 8",
  MG703: "Magenta Via Novara 14",
  MG704: "Magenta Via Leopardi (Iper)",
  MG708: "Magenta Via Novara fr 17",
  MG720: "Magenta Via Brocca fr 49 (Stazione)",
  MG756: "Magenta Via Leopardi (Iper)",
  MG801: "Magenta Via Cavallari 39",
  MG871: "Magenta Via Milano 101",
  MG888: "Magenta Via Tobagi (Dep. ATINOM)",

  // ── Corbetta ───────────────────────────────────────────────────────────
  CB053: "Corbetta V.le Borletti (Magneti Marelli)",
  CB080: "Corbetta V.le Borletti (Magneti Marelli)",
  CB088: "Corbetta P.zza XXV Aprile 10",
  CB111: "Corbetta P.zza XXV Aprile 4",

  // ── S. Stefano Ticino ──────────────────────────────────────────────────
  TI033: "S. Stefano T. Via Repubblica fr 28",
  TI111: "S. Stefano T. V.le Stazione 10 (FS)",
  TI211: "S. Stefano T. V.le Stazione 5 (FS)",
  TI333: "S. Stefano T. Via Repubblica 26",

  // ── Inveruno ───────────────────────────────────────────────────────────
  IN127: "Inveruno Via Varese a. Don Paganini",
  IN128: "Inveruno Via Varese a. Don Paganini",
  IN235: "Inveruno V.le Lombardia a. Magenta",
  IN275: "Inveruno V.le Lombardia a. Liguria",
  IN285: "Inveruno Via Marconi 57",
  IN350: "Inveruno Via Lombardia 5 (IPSIA)",
  IN351: "Inveruno Via Lombardia fr 7 (IPSIA)",
  IN375: "Inveruno Fraz. Furato V. XXIV Maggio",
  IN403: "Inveruno Via Marconi fr 65",
  IN433: "Inveruno Fraz. Furato V. Del Carso",
  IN801: "Inveruno Via Einaudi fr 2",
  IN802: "Inveruno Via Einaudi 6",

  // ── Cuggiono ───────────────────────────────────────────────────────────
  CG143: "Cuggiono P.zza Vittoria fr 12",
  CG149: "Cuggiono Via San Rocco 89",
  CG178: "Cuggiono Via Manzoni 1",
  CG190: "Cuggiono Via Fermo 34 (Ospedale)",
  CG250: "Cuggiono Via Garibaldi fr 32",
  CG998: "Cuggiono V. IV Novembre (dopo XI Sett.)",
  CG999: "Cuggiono V. IV Novembre (v. XI Sett.)",

  // ── Buscate ────────────────────────────────────────────────────────────
  BC211: "Buscate Via Milano 26",
  BC250: "Buscate Via Milano 19 a. P. Micca",
  BC801: "Buscate S.P. 34 Civ. 28",
  BC802: "Buscate S.P. 34 fr 28",

  // ── Castano Primo ──────────────────────────────────────────────────────
  CT001: "Castano P. P.le Don Milani (Ist. Torno)",
  CT011: "Castano P. P.le Don Milani (Ist. Torno)",
  CT021: "Castano P. Per Buscate / S. Nitti",
  CT027: "Castano P. Per Buscate fr S. Nitti",
  CT050: "Castano P. Via Tadini 16",
  CT100: "Castano P. FS (Autostazione)",
  CT110: "Castano P. Piazza Garibaldi"
};

export function getStopName(code) {
  return STOP_NAMES[code] || code;
}
