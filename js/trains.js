// === Train Connection Slots ===

const TRAIN_SLOTS = {
  "PG102":      { line: "S5/S6", minutes: [17, 47] },  // Pregnana FS
  "canegrate":  { line: "S5/S6", minutes: [1, 16, 31, 46] },  // Canegrate FS
  "LG090":      { line: "S5",    minutes: [3, 33] },           // Legnano FS
  "PB090":      { line: "S5",    minutes: [13, 43] },          // Parabiago FS
  "BS090_S5":   { line: "S5",    minutes: [3, 33] },          // Busto Arsizio FS (S5)
  "BS090_RE":   { line: "RE",    minutes: [20, 50] }          // Busto Arsizio FS (RE)
};

/**
 * Calculate next 2 trains from a given stop and time.
 * @param {string} stopKey - key in TRAIN_SLOTS
 * @param {number} fromMinutes - minutes from midnight
 * @returns {Array<{line, departureMin, waitMin}>}
 */
export function calcNextTrain(stopKey, fromMinutes) {
  const slot = TRAIN_SLOTS[stopKey];
  if (!slot) return [];
  
  const results = [];
  const hour = Math.floor(fromMinutes / 60);
  const minInHour = fromMinutes % 60;
  
  // Check current hour and next hours
  for (let h = hour; h < 24; h++) {
    for (const m of slot.minutes) {
      const depMin = h * 60 + m;
      if (depMin > fromMinutes) {
        results.push({
          line: slot.line,
          departureMin: depMin,
          waitMin: depMin - fromMinutes
        });
        if (results.length >= 2) return results;
      }
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
  const trains = calcNextTrain("canegrate", arrivalAtStation);
  
  if (trains.length === 0) {
    return { canLeaveIn: null, trains: [] };
  }
  
  const firstTrain = trains[0];
  const leaveIn = firstTrain.departureMin - driveMinutes - currentMin;
  
  return {
    driveMinutes,
    canLeaveIn: leaveIn > 0 ? leaveIn : 0,
    arrivalAtStation,
    trains,
    // Estimate arrival at Milano Centrale
    milanoArrival: firstTrain.departureMin + 25
  };
}

export { TRAIN_SLOTS };
