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
    connections: { BS090: { type: "S5/RE", slotKey: "BS090_S5" } },
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
  BT999: "Busto G. Deposito",
  BT949: "Via per Busto Arsizio",
  BT205: "Via Busto Arsizio 48",
  BT775: "Via Rossini 35",
  BT400: "Via Matteotti 6",
  BT211: "Via Parabiago 32",
  BT701: "Busto G. Via Curiel",
  BT702: "Busto G. Cellini",
  BT703: "Busto G. Buonarroti",
  BT704: "Busto G. Curiel",
  BT776: "Busto G. Bellini",
  BT956: "Busto G. Montebianco",
  BT947: "Busto G. Buonarroti",
  BT951: "Busto G. Piscina",
  BT215: "Busto G. Via Parabiago",
  BT300: "Busto G. Via Matteotti",

  PG102: "Pregnana Milanese FS",
  PG101: "Pregnana Milanese FS",
  PG008: "Pregnana Gorizia",
  PG055: "Pregnana Roma",
  PG030: "Pregnana Puccini",
  PG099: "Pregnana XXIII",
  MD111: "Molino Dorino M1",
  MD001: "Molino Dorino M1",
  VH237: "Vighignolo",
  VH238: "Vighignolo",

  PB090: "Parabiago FS",
  PB100: "Parabiago Maggiolini",
  PB101: "Parabiago Spagliardi",
  PB702: "Parabiago Via Lombardia",

  LG090: "Legnano FS",
  LG091: "Legnano FS",
  LG112: "Legnano Liceo",
  LG171: "Legnano",
  LG805: "Legnano XX Settembre",

  BS090: "Busto Arsizio FS",
  BS071: "Busto Arsizio ITC Tosi",

  CT100: "Castano Primo FS",
  CT001: "Castano Primo",
  CT011: "Castano Istituti",

  AC625: "Arconate Concordia",
  AC627: "Arconate Via Legnano",
  AC628: "Arconate Via Legnano",
  AC035: "Arconate Concordia",
  CZ010: "Casorezzo",
  CZ088: "Casorezzo Bertani",
  CZ070: "Casorezzo Ossona",
  OS001: "Ossona Patrioti",
  OS011: "Ossona Patrioti",
  AL801: "Arluno Adua",
  AL802: "Arluno Adua",
  AL185: "Arluno Municipio",
  AL195: "Arluno Municipio",
  AL051: "Arluno Turati",
  AL050: "Arluno Turati",
  RG001: "Rogorotto",
  RG011: "Rogorotto",
  MN021: "Mantegazza",
  MN015: "Mantegazza"
};

export function getStopName(code) {
  return STOP_NAMES[code] || code;
}
