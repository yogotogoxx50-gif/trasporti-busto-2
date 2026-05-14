// === Train Connection Slots ===
// Orari verificati su Trenord (maggio 2026)
// Canegrate FS: treni ai minuti :08 e :38, ogni 30 min, identico tutti i giorni
// Legnano FS:   treni ai minuti :12 e :42, ogni 30 min
// Pregnana FS:  treni ai minuti :17 e :47, primo utile 05:47, ultimo 23:47

const TRAIN_SLOTS = {
  "PG102": {
    line: "S6",
    minutes: [17, 47],
    firstTrain: 347,   // 05:47
    lastTrain: 1427,    // 23:47
    note: "S6 dir. Milano Passante"
  },
  "canegrate": {
    line: "S5",
    minutes: [21, 51],
    firstTrain: 351,    // 05:51
    lastTrain: 1401,    // 23:21
    note: "S5 da Canegrate FS dir. Milano"
  },
  "LG090": {
    line: "S5",
    minutes: [12, 42],
    firstTrain: 312,    // 05:12
    lastTrain: 1362,    // 22:42
    note: "S5 dir. Milano Passante"
  },
  "PB090": {
    line: "S5",
    minutes: [13, 43],
    firstTrain: 343,    // 05:43
    lastTrain: 1423,    // 23:43
    note: "S5 dir. Milano Passante"
  },
  "BS090_S5": {
    line: "S5",
    minutes: [3, 33],
    firstTrain: 303,    // 05:03
    lastTrain: 1383,    // 23:03
    note: "S5 dir. Milano Passante"
  },
  "BS090_RE": {
    line: "RE",
    minutes: [20, 50],
    firstTrain: 380,    // 06:20
    lastTrain: 1370,    // 22:50
    note: "Regionale Espresso dir. Milano"
  }
};

/**
 * Calculate next trains from a given stop and time, respecting operating hours.
 * @param {string} stopKey - key in TRAIN_SLOTS
 * @param {number} fromMinutes - minutes from midnight (bus arrival)
 * @param {number} count - how many trains to return (default 2)
 * @returns {Array<{line, departureMin, waitMin, note}>}
 */
export function calcNextTrain(stopKey, fromMinutes, count = 2) {
  const slot = TRAIN_SLOTS[stopKey];
  if (!slot) return [];

  const results = [];
  const hour = Math.floor(fromMinutes / 60);

  // Check current hour and next hours
  for (let h = hour; h < 24; h++) {
    for (const m of slot.minutes) {
      const depMin = h * 60 + m;
      // Must be after bus arrival
      if (depMin <= fromMinutes) continue;
      // Must be within operating hours
      if (slot.firstTrain && depMin < slot.firstTrain) continue;
      if (slot.lastTrain && depMin > slot.lastTrain) continue;

      results.push({
        line: slot.line,
        departureMin: depMin,
        waitMin: depMin - fromMinutes,
        note: slot.note || ""
      });
      if (results.length >= count) return results;
    }
  }

  return results;
}

/**
 * Get connection info for a bus stop that has train connections configured.
 */
export function getConnectionInfo(stopKey, busArrivalMin, connectionConfig) {
  if (!connectionConfig) return null;
  const cfg = connectionConfig;
  const trains = calcNextTrain(cfg.slotKey || stopKey, busArrivalMin);
  if (trains.length === 0) return null;

  const best = trains[0];
  return {
    type: cfg.type,
    line: best.line,
    departure: best.departureMin,
    waitMin: best.waitMin,
    allTrains: trains
  };
}

/**
 * Build display string for train connection.
 */
export function formatConnection(conn) {
  if (!conn) return "";
  const dep = window.minsToHHMM ? window.minsToHHMM(conn.departure) : `${Math.floor(conn.departure/60)}:${String(conn.departure%60).padStart(2,'0')}`;
  if (conn.waitMin <= 0) return `${conn.type} ${dep}`;
  return `${conn.type} ${dep} (~${conn.waitMin}m)`;
}

/**
 * Canegrate block: next S5/S6 trains with drive time factored in.
 */
export function buildCanegrateBlock(driveMinutes, currentMin) {
  const arrivalAtStation = currentMin + driveMinutes;
  
  // Trains still departing from the station in the future
  const allFutureTrains = calcNextTrain("canegrate", currentMin);
  
  // Trains you can still realistically catch by driving there
  const catchableTrains = calcNextTrain("canegrate", arrivalAtStation);

  let justMissedCarTrain = null;
  if (allFutureTrains.length > 0 && catchableTrains.length > 0 && allFutureTrains[0].departureMin !== catchableTrains[0].departureMin) {
    justMissedCarTrain = allFutureTrains[0];
  } else if (allFutureTrains.length > 0 && catchableTrains.length === 0) {
    justMissedCarTrain = allFutureTrains[0];
  }

  if (catchableTrains.length === 0) {
    return { canLeaveIn: null, trains: [], justMissedCarTrain };
  }

  const firstTrain = catchableTrains[0];
  const leaveIn = firstTrain.departureMin - driveMinutes - currentMin;

  return {
    driveMinutes,
    canLeaveIn: leaveIn > 0 ? leaveIn : 0,
    arrivalAtStation,
    trains: catchableTrains,
    justMissedCarTrain,
    // Estimate arrival at Milano Centrale
    milanoArrival: firstTrain.departureMin + 25
  };
}

export { TRAIN_SLOTS };
