export const WARD_NAMES = [
  "Budhikhamari (Ward 1)",
  "Deulasahi (Ward 2)",
  "Badabazar (Ward 3)",
  "Ghodabazar (Ward 4)",
  "Station Bazar (Ward 5)",
  "Lalbazar (Ward 6)",
  "Tulasi Chaura (Ward 7)",
  "Sankhabhanga (Ward 8)",
  "Baghra Road (Ward 9)",
  "Madhuban (Ward 10)",
  "Raghunathpur (Ward 11)",
  "Purnachandrapur (Ward 12)",
  "Police Line (Ward 13)",
  "Baripada Court Area (Ward 14)",
  "Takatpur (Ward 15)",
  "Murgabadi (Ward 16)",
  "Palbani (Ward 17)",
  "Ambika Temple (Ward 18)",
  "Bhanjpur (Ward 19)",
  "Sunagadia (Ward 20)",
  "Gopinathpur Road (Ward 21)",
  "Darogadahi (Ward 22)",
  "Kalasandhapur (Ward 23)",
  "Sidhua (Ward 24)",
  "District Hospital Area (Ward 25)",
  "Kuchei (Ward 26)",
  "Jagannath Temple Area (Ward 27)",
  "Mayurbhanj Palace Gate (Ward 28)"
];

// Normalized coordinates (0-100) for Baripada Municipality Ward Layout
export const WARD_POSITIONS: Record<number, { x: number; y: number }> = {
  1: { x: 15, y: 30 },
  2: { x: 35, y: 25 },
  3: { x: 35, y: 40 },
  4: { x: 20, y: 45 },
  5: { x: 15, y: 55 },
  6: { x: 25, y: 58 },
  7: { x: 10, y: 80 },
  8: { x: 10, y: 65 },
  9: { x: 20, y: 85 },
  10: { x: 38, y: 55 },
  11: { x: 32, y: 75 },
  12: { x: 40, y: 85 },
  13: { x: 50, y: 75 },
  14: { x: 45, y: 58 },
  15: { x: 55, y: 50 },
  16: { x: 45, y: 48 },
  17: { x: 48, y: 35 },
  18: { x: 42, y: 25 },
  19: { x: 58, y: 40 },
  20: { x: 35, y: 68 },
  21: { x: 50, y: 15 },
  22: { x: 75, y: 25 },
  23: { x: 58, y: 60 },
  24: { x: 75, y: 75 },
  25: { x: 75, y: 90 },
  26: { x: 25, y: 15 },
  27: { x: 92, y: 75 },
  28: { x: 55, y: 88 }
};

const binTypes = ["Dry Waste", "Wet Waste", "Recyclable", "Hazardous"];
const statuses = ["Empty", "Half Full", "Almost Full", "Urgent Pickup"];

export const BINS = Array.from({ length: 28 * 5 }, (_, i) => {
  const wardNum = (i % 28) + 1;
  const wardIndex = wardNum - 1;
  const fillLevel = (i * 37 + 42) % 100;
  
  let status = statuses[0];
  if (fillLevel > 90) status = statuses[statuses.length - 1];
  else if (fillLevel > 75) status = statuses[2];
  else if (fillLevel > 40) status = statuses[1];

  const locations = ["Near Ward Office", "Main Market", "Residential Square", "Bus Stop Area", "Community Park"];
  
  // Add slight jitter for bin positions within a ward
  const jitterX = ((i * 13) % 10) - 5;
  const jitterY = ((i * 17) % 10) - 5;

  return {
    id: `BIN-${1000 + i}`,
    ward: wardNum,
    location: `${WARD_NAMES[wardIndex]} - ${locations[i % 5]}`,
    fillLevel: fillLevel,
    type: binTypes[i % binTypes.length],
    status: status,
    x: WARD_POSITIONS[wardNum].x + jitterX,
    y: WARD_POSITIONS[wardNum].y + jitterY
  };
});

export const CITIZEN_STATS = {
  cleanlinessScore: 92,
  communityScore: 8.5,
  recyclingRate: 68,
  rewardPoints: 320,
};

export const WORKER_STATS = {
  assignedTasks: 12,
  completedTasks: 8,
  pendingComplaints: 4,
  collectionProgress: 67,
  nearbyFullBins: BINS.filter(b => b.fillLevel > 80).length,
};

export const TASKS = [
  { id: 'C102', location: 'Ward 9 - Baghra Road', issue: 'Overflowing bin', priority: 'High', status: 'Pending' },
  { id: 'C105', location: 'Ward 15 - Takatpur Area', issue: 'Waste pickup missed', priority: 'Medium', status: 'Assigned' },
  { id: 'C108', location: 'Ward 19 - Bhanjpur', issue: 'Broken bin lid', priority: 'Low', status: 'Resolved' },
];

export const LEADERBOARD = [
  { name: 'Sarah Green', points: 1250, badge: 'Eco Champion' },
  { name: 'James Earth', points: 980, badge: 'Green Warrior' },
  { name: 'Maria Eco', points: 840, badge: 'Eco Warrior' },
  { name: 'David Recycle', points: 720, badge: 'Green Scout' },
];

export const ADMIN_STATS = {
  totalCitizens: 2540,
  totalWorkers: 68,
  totalBins: BINS.length,
  complaintsToday: 34,
  complaintsResolved: 27,
  cityScore: 91,
  recyclingRate: 67,
};

export const RECENT_COMPLAINTS = [
  { id: 'CMP-4091', citizen: 'Sarah Green', type: 'Overflowing Bin', location: 'Ward 12', status: 'Pending', priority: 'High' },
  { id: 'CMP-4092', citizen: 'James Earth', type: 'Illegal Dumping', location: 'Ward 5', status: 'Assigned', priority: 'Critical' },
  { id: 'CMP-4093', citizen: 'Maria Eco', type: 'Missed Collection', location: 'Ward 19', status: 'Resolved', priority: 'Medium' },
  { id: 'CMP-4094', citizen: 'David Recycle', type: 'Broken Bin', location: 'Ward 1', status: 'Pending', priority: 'Low' },
];

export const WORKERS_LIST = [
  { id: 'W-421', name: 'John Doe', ward: 'Ward 12', tasks: 45, status: 'Active' },
  { id: 'W-422', name: 'Robert Smith', ward: 'Ward 5', tasks: 38, status: 'On Leave' },
  { id: 'W-423', name: 'Anita Das', ward: 'Ward 19', tasks: 52, status: 'Active' },
];

export const CHART_DATA = [
  { day: 'Mon', collected: 45, complaints: 12 },
  { day: 'Tue', collected: 52, complaints: 8 },
  { day: 'Wed', collected: 48, complaints: 15 },
  { day: 'Thu', collected: 61, complaints: 10 },
  { day: 'Fri', collected: 55, complaints: 7 },
  { day: 'Sat', collected: 67, complaints: 9 },
  { day: 'Sun', collected: 40, complaints: 5 },
];
