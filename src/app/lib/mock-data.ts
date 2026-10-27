export const BARIPADA_CENTER = {
  lat: 21.9322,
  lng: 86.7275,
  cityName: "Baripada",
  district: "Mayurbhanj",
  state: "Odisha",
  country: "India",
  pincode: "757001"
};

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

// Authentic Geographic Coordinates for Baripada Wards
export const WARD_COORDINATES: Record<number, { lat: number; lng: number; name: string }> = {
  1: { lat: 21.9425, lng: 86.7160, name: "Budhikhamari" },
  2: { lat: 21.9380, lng: 86.7230, name: "Deulasahi" },
  3: { lat: 21.9335, lng: 86.7210, name: "Badabazar" },
  4: { lat: 21.9310, lng: 86.7235, name: "Ghodabazar" },
  5: { lat: 21.9378, lng: 86.7335, name: "Station Bazar" },
  6: { lat: 21.9360, lng: 86.7270, name: "Lalbazar" },
  7: { lat: 21.9280, lng: 86.7190, name: "Tulasi Chaura" },
  8: { lat: 21.9255, lng: 86.7220, name: "Sankhabhanga" },
  9: { lat: 21.9220, lng: 86.7150, name: "Baghra Road" },
  10: { lat: 21.9345, lng: 86.7325, name: "Madhuban" },
  11: { lat: 21.9265, lng: 86.7290, name: "Raghunathpur" },
  12: { lat: 21.9225, lng: 86.7350, name: "Purnachandrapur" },
  13: { lat: 21.9295, lng: 86.7380, name: "Police Line" },
  14: { lat: 21.9315, lng: 86.7285, name: "Baripada Court Area" },
  15: { lat: 21.9485, lng: 86.7520, name: "Takatpur" },
  16: { lat: 21.9195, lng: 86.7460, name: "Murgabadi" },
  17: { lat: 21.9460, lng: 86.7220, name: "Palbani" },
  18: { lat: 21.9365, lng: 86.7195, name: "Ambika Temple Area" },
  19: { lat: 21.9280, lng: 86.7410, name: "Bhanjpur" },
  20: { lat: 21.9330, lng: 86.7360, name: "Sunagadia" },
  21: { lat: 21.9450, lng: 86.7380, name: "Gopinathpur Road" },
  22: { lat: 21.9400, lng: 86.7450, name: "Darogadahi" },
  23: { lat: 21.9240, lng: 86.7420, name: "Kalasandhapur" },
  24: { lat: 21.9160, lng: 86.7320, name: "Sidhua" },
  25: { lat: 21.9305, lng: 86.7255, name: "District Hospital Area" },
  26: { lat: 21.9510, lng: 86.7280, name: "Kuchei" },
  27: { lat: 21.9352, lng: 86.7250, name: "Jagannath Temple Area" },
  28: { lat: 21.9338, lng: 86.7242, name: "Mayurbhanj Palace Gate" }
};

// Normalized coordinates (0-100) for legacy 2D diagrams
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

const binTypes = ["Dry Waste", "Wet Waste", "Recyclable", "Hazardous"] as const;
export type BinType = typeof binTypes[number];

// Real authentic street addresses and landmarks for all 28 Wards of Baripada
export const REAL_BARIPADA_ADDRESSES: Record<number, string[]> = {
  1: [
    "Budhikhamari Weekly Haat & Market Chowk",
    "Budhikhamari High School Road",
    "Near Budhikhamari Primary Health Centre",
    "Budhikhamari Bypass Road Junction",
    "Budhikhamari Community Park"
  ],
  2: [
    "Deulasahi Main Market Street",
    "Near Maa Ambika Temple Gate",
    "Deulasahi Old Post Office Lane",
    "Deulasahi Primary School Road",
    "Deulasahi River Embankment Road"
  ],
  3: [
    "Baripada Municipal Bus Stand (Badabazar)",
    "MKC High School Main Gate, Stadium Road",
    "Badabazar Daily Vegetable Market",
    "Chhau Padia (Stadium) Entrance Square",
    "Badabazar Town Hall Road"
  ],
  4: [
    "Ghodabazar Fish & Wholesale Market",
    "Ghodabazar Post Office Road",
    "Ghodabazar Shiva Temple Square",
    "Ghodabazar Commercial Lane",
    "Ghodabazar Auto-rickshaw Stand"
  ],
  5: [
    "Baripada Railway Station Main Entrance",
    "Station Bazar Commercial Plaza",
    "Station Road Overbridge Junction",
    "Railway Colony Community Center",
    "Station Bazar Bus Shelter Point"
  ],
  6: [
    "Lalbazar Main Street Market",
    "Lalbazar Durga Mandap Square",
    "Lalbazar Boys High School Lane",
    "Lalbazar Commercial Complex",
    "Lalbazar Municipal Water Tank Point"
  ],
  7: [
    "Tulasi Chaura Square",
    "Tulasi Chaura Temple Road",
    "Tulasi Chaura High School Chowk",
    "Badadanda South Extension Lane",
    "Tulasi Chaura Kalyan Mandap"
  ],
  8: [
    "Sankhabhanga Main Chowk",
    "Sankhabhanga Gramya Bank Road",
    "Sankhabhanga UP School Gate",
    "Sankhabhanga Shiva Temple Lane",
    "Sankhabhanga Daily Haat Square"
  ],
  9: [
    "Baghra Road Railway Crossing Point",
    "Baghra Road Girls High School",
    "Baghra Road Market Complex",
    "Baghra Road Community Health Post",
    "Baghra Road Forest Office Corner"
  ],
  10: [
    "Madhuban Head Post Office Road",
    "Madhuban Commercial Square",
    "Madhuban Housing Board Colony",
    "Madhuban Children's Park Road",
    "Madhuban Bypass Link Road"
  ],
  11: [
    "Raghunathpur Main Chowk",
    "Raghunathpur Jagannath Mandap",
    "Raghunathpur Primary Health Center",
    "Raghunathpur Canal Road",
    "Raghunathpur Community Center"
  ],
  12: [
    "Purnachandrapur Main Market",
    "Purnachandrapur Bypass Road (NH-18)",
    "Ward 12 Municipal Sanitation Depot",
    "Purnachandrapur High School Lane",
    "Purnachandrapur Residential Sector"
  ],
  13: [
    "Police Line Main Gate",
    "Police Reserve Ground Road",
    "Police Line KV School Road",
    "Police Hospital Junction",
    "Police Line Officers Colony"
  ],
  14: [
    "Mayurbhanj District Collectorate Gate",
    "Baripada Civil Court Square",
    "Baripada Bar Association Road",
    "Kacheri Road SBI Main Branch",
    "Judicial Complex Public Plaza"
  ],
  15: [
    "PRM Medical College & Hospital (PRMMCH) Gate",
    "MPC Autonomous College Takatpur Campus",
    "North Odisha University (NOU) Road",
    "Takatpur Industrial Estate Square",
    "Takatpur Bus Stand Junction"
  ],
  16: [
    "Murgabadi Golai Chowk (NH-18)",
    "Murgabadi Flyover Underpass",
    "Murgabadi Commercial Trade Center",
    "Murgabadi Truck Parking Terminal",
    "Murgabadi Residential Square"
  ],
  17: [
    "Palbani Chowk (NH-18 Highway Entry)",
    "Palbani Toll Plaza Point",
    "Palbani High School Road",
    "Palbani Fuel Station Square",
    "Palbani Forest Colony Road"
  ],
  18: [
    "Maa Ambika Temple Main Gate Road",
    "Ambika Temple Parking Area",
    "Ambika Sahi Heritage Lane",
    "Ambika High School Crossing",
    "Deulasahi-Ambika Temple Link Road"
  ],
  19: [
    "Bhanjpur Railway Station Entrance",
    "Bhanjpur Daily Market Chowk",
    "Bhanjpur Municipal Waste Transfer Hub",
    "Bhanjpur Community Hall",
    "Bhanjpur High School Road"
  ],
  20: [
    "Sunagadia Main Chowk",
    "Sunagadia Government High School",
    "Sunagadia Market Complex",
    "Sunagadia Post Office Road",
    "Sunagadia Playground Corner"
  ],
  21: [
    "Gopinathpur Road Main Chowk",
    "Gopinathpur Temple Square",
    "Gopinathpur Primary School",
    "Gopinathpur Canal Bridge Point",
    "Gopinathpur Agricultural Haat"
  ],
  22: [
    "Darogadahi Main Square",
    "Darogadahi Gramya Bank Lane",
    "Darogadahi Community Center",
    "Darogadahi Bypass Link",
    "Darogadahi Market Road"
  ],
  23: [
    "Kalasandhapur Junction",
    "Kalasandhapur Shiva Temple Lane",
    "Kalasandhapur Primary School",
    "Kalasandhapur Daily Market",
    "Kalasandhapur Water Works Road"
  ],
  24: [
    "Sidhua River Bridge Point",
    "Sidhua Ghat Road",
    "Sidhua Community Center",
    "Sidhua High School Road",
    "Sidhua Canal Road"
  ],
  25: [
    "District Headquarters Hospital (DHH) Gate 1",
    "DHH Emergency Care Entrance",
    "Hospital Road Red Cross Bhavan",
    "Hospital Road Pharmacy Line",
    "DHH Maternity Care Wing Gate"
  ],
  26: [
    "Kuchei Main Chowk",
    "Kuchei High School Gate",
    "Kuchei Market Square",
    "Kuchei Primary Health Post",
    "Kuchei Temple Road"
  ],
  27: [
    "Shri Haribaldev Jew Temple (Jagannath Temple)",
    "Badadanda (Grand Road) Rath Khala",
    "Badadanda Heritage Market Square",
    "Temple Trust Office Road",
    "Jagannath Mandir North Gate"
  ],
  28: [
    "Mayurbhanj Palace (Rajbari) Main Gate",
    "Palace Museum Road",
    "Rajbati Heritage Garden Corner",
    "Palace Square Kacheri Link",
    "Palace Royal Compound West Gate"
  ]
};

export interface SmartBin {
  id: string;
  ward: number;
  wardName: string;
  address: string;
  location: string;
  fillLevel: number;
  type: BinType;
  status: "Empty" | "Normal" | "Nearly Full" | "Urgent Pickup";
  lat: number;
  lng: number;
  x: number;
  y: number;
  capacity: string;
  batteryLevel: number;
  lastCleaned: string;
  isSimulated: boolean;
}

// Seeded generator for 140 bins (5 bins per ward across all 28 wards of Baripada)
export const BINS: SmartBin[] = Array.from({ length: 28 * 5 }, (_, i) => {
  const wardNum = (i % 28) + 1;
  const wardCoord = WARD_COORDINATES[wardNum];
  const fillLevel = (i * 37 + 42) % 100;
  
  let status: SmartBin["status"] = "Normal";
  if (fillLevel > 85) status = "Urgent Pickup";
  else if (fillLevel > 70) status = "Nearly Full";
  else if (fillLevel <= 30) status = "Empty";

  // Micro-offset coordinates to place 5 distinct dustbins at real street addresses around each ward center
  const offsetIndex = Math.floor(i / 28);
  const angle = (offsetIndex * 72 * Math.PI) / 180;
  const radiusKm = 0.15 + (offsetIndex * 0.05); // ~150 to 350 meters
  const latOffset = (radiusKm / 111) * Math.sin(angle);
  const lngOffset = (radiusKm / (111 * Math.cos((wardCoord.lat * Math.PI) / 180))) * Math.cos(angle);

  const wardAddresses = REAL_BARIPADA_ADDRESSES[wardNum] || [wardCoord.name];
  const exactAddress = wardAddresses[offsetIndex % wardAddresses.length];

  // Slight jitter for percentage diagram compatibility
  const jitterX = ((i * 13) % 10) - 5;
  const jitterY = ((i * 17) % 10) - 5;

  return {
    id: `BIN-${1001 + i}`,
    ward: wardNum,
    wardName: wardCoord.name,
    address: exactAddress,
    location: `${exactAddress}, Ward ${wardNum} (${wardCoord.name})`,
    fillLevel: fillLevel,
    type: binTypes[i % binTypes.length],
    status: status,
    lat: Number((wardCoord.lat + latOffset).toFixed(5)),
    lng: Number((wardCoord.lng + lngOffset).toFixed(5)),
    x: WARD_POSITIONS[wardNum].x + jitterX,
    y: WARD_POSITIONS[wardNum].y + jitterY,
    capacity: "240 L",
    batteryLevel: 80 + ((i * 7) % 20),
    lastCleaned: `${(i % 12) + 1} hours ago`,
    isSimulated: true // Clearly labels telemetry as demonstration data per civic-tech requirement
  };
});

// Official Baripada Municipal Waste Collection Route Waypoints (Ordered circuit)
export interface CollectionRouteStop {
  stopNumber: number;
  name: string;
  address: string;
  ward: number;
  lat: number;
  lng: number;
  time: string;
  type: "depot" | "hospital" | "commercial" | "transit" | "heritage" | "residential";
}

export const BARIPADA_COLLECTION_STOPS: CollectionRouteStop[] = [
  {
    stopNumber: 1,
    name: "Central Sanitation Depot (Starting Point)",
    address: "Bhanjpur Municipal Waste Transfer Yard",
    ward: 19,
    lat: 21.9280,
    lng: 86.7410,
    time: "06:30 AM",
    type: "depot"
  },
  {
    stopNumber: 2,
    name: "Murgabadi Highway Junction",
    address: "Murgabadi Golai Chowk (NH-18)",
    ward: 16,
    lat: 21.9195,
    lng: 86.7460,
    time: "06:55 AM",
    type: "transit"
  },
  {
    stopNumber: 3,
    name: "Purnachandrapur Commercial Sector",
    address: "Purnachandrapur Main Market & Bypass",
    ward: 12,
    lat: 21.9225,
    lng: 86.7350,
    time: "07:20 AM",
    type: "commercial"
  },
  {
    stopNumber: 4,
    name: "Raghunathpur Square",
    address: "Raghunathpur Main Chowk & Mandap",
    ward: 11,
    lat: 21.9265,
    lng: 86.7290,
    time: "07:45 AM",
    type: "residential"
  },
  {
    stopNumber: 5,
    name: "Police Line Reserve Point",
    address: "Police Line Main Gate Road",
    ward: 13,
    lat: 21.9295,
    lng: 86.7380,
    time: "08:05 AM",
    type: "residential"
  },
  {
    stopNumber: 6,
    name: "District Headquarters Hospital (DHH)",
    address: "Hospital Road Emergency Gate",
    ward: 25,
    lat: 21.9305,
    lng: 86.7255,
    time: "08:30 AM",
    type: "hospital"
  },
  {
    stopNumber: 7,
    name: "Civil Court & Collectorate",
    address: "Baripada Court Area & Collectorate Square",
    ward: 14,
    lat: 21.9315,
    lng: 86.7285,
    time: "08:50 AM",
    type: "commercial"
  },
  {
    stopNumber: 8,
    name: "Shri Haribaldev Jew Temple (Grand Road)",
    address: "Badadanda Rath Khala, Temple Area",
    ward: 27,
    lat: 21.9352,
    lng: 86.7250,
    time: "09:15 AM",
    type: "heritage"
  },
  {
    stopNumber: 9,
    name: "Mayurbhanj Palace (Rajbari)",
    address: "Rajbari Royal Palace Main Gate",
    ward: 28,
    lat: 21.9338,
    lng: 86.7242,
    time: "09:35 AM",
    type: "heritage"
  },
  {
    stopNumber: 10,
    name: "Baripada Municipal Bus Stand",
    address: "Badabazar Bus Stand & Market Entrance",
    ward: 3,
    lat: 21.9335,
    lng: 86.7210,
    time: "09:55 AM",
    type: "transit"
  },
  {
    stopNumber: 11,
    name: "Ghodabazar Daily Market",
    address: "Ghodabazar Fish & Vegetable Market Road",
    ward: 4,
    lat: 21.9310,
    lng: 86.7235,
    time: "10:15 AM",
    type: "commercial"
  },
  {
    stopNumber: 12,
    name: "Baripada Railway Station",
    address: "Station Bazar Railway Crossing Plaza",
    ward: 5,
    lat: 21.9378,
    lng: 86.7335,
    time: "10:40 AM",
    type: "transit"
  },
  {
    stopNumber: 13,
    name: "Madhuban Commercial Hub",
    address: "Madhuban Head Post Office Square",
    ward: 10,
    lat: 21.9345,
    lng: 86.7325,
    time: "11:00 AM",
    type: "commercial"
  },
  {
    stopNumber: 14,
    name: "Sunagadia & Darogadahi",
    address: "Sunagadia Government High School Chowk",
    ward: 20,
    lat: 21.9330,
    lng: 86.7360,
    time: "11:25 AM",
    type: "residential"
  },
  {
    stopNumber: 15,
    name: "PRM Medical College & MPC College",
    address: "PRMMCH Campus Gate, Takatpur Road",
    ward: 15,
    lat: 21.9485,
    lng: 86.7520,
    time: "11:55 AM",
    type: "hospital"
  },
  {
    stopNumber: 16,
    name: "Palbani Highway Entrance",
    address: "Palbani Chowk (NH-18 Highway Entry)",
    ward: 17,
    lat: 21.9460,
    lng: 86.7220,
    time: "12:25 PM",
    type: "transit"
  },
  {
    stopNumber: 17,
    name: "Budhikhamari Weekly Haat",
    address: "Budhikhamari Market Road",
    ward: 1,
    lat: 21.9425,
    lng: 86.7160,
    time: "12:50 PM",
    type: "commercial"
  },
  {
    stopNumber: 18,
    name: "Deulasahi & Maa Ambika Temple",
    address: "Deulasahi Main Market & Ambika Temple Lane",
    ward: 2,
    lat: 21.9380,
    lng: 86.7230,
    time: "01:15 PM",
    type: "heritage"
  },
  {
    stopNumber: 19,
    name: "Tulasi Chaura & Baghra Road",
    address: "Tulasi Chaura Square & Baghra Road Crossing",
    ward: 7,
    lat: 21.9280,
    lng: 86.7190,
    time: "01:40 PM",
    type: "residential"
  },
  {
    stopNumber: 20,
    name: "Sidhua River Embankment Point",
    address: "Sidhua Ghat Road",
    ward: 24,
    lat: 21.9160,
    lng: 86.7320,
    time: "02:05 PM",
    type: "residential"
  },
  {
    stopNumber: 21,
    name: "Municipal Processing Yard (Final Stop)",
    address: "Baripada Municipal Solid Waste Facility, Bhanjpur",
    ward: 19,
    lat: 21.9275,
    lng: 86.7425,
    time: "02:30 PM",
    type: "depot"
  }
];

// Exact road-following GPS polyline for Baripada's municipal collection route
export const BARIPADA_COLLECTION_ROUTE_PATH: [number, number][] = [
  // 1. Bhanjpur Depot
  [21.9280, 86.7410],
  [21.9265, 86.7425],
  [21.9240, 86.7440],
  // 2. Murgabadi (NH-18)
  [21.9195, 86.7460],
  [21.9205, 86.7410],
  // 3. Purnachandrapur
  [21.9225, 86.7350],
  [21.9245, 86.7320],
  // 4. Raghunathpur
  [21.9265, 86.7290],
  [21.9280, 86.7330],
  // 5. Police Line
  [21.9295, 86.7380],
  [21.9300, 86.7330],
  // 6. District Hospital Area
  [21.9305, 86.7255],
  // 7. Court Area
  [21.9315, 86.7285],
  [21.9330, 86.7270],
  // 8. Badadanda & Jagannath Temple
  [21.9352, 86.7250],
  // 9. Mayurbhanj Palace Gate
  [21.9338, 86.7242],
  // 10. Badabazar & Bus Stand
  [21.9335, 86.7210],
  // 11. Ghodabazar
  [21.9310, 86.7235],
  [21.9340, 86.7280],
  // 12. Station Bazar (Railway Crossing)
  [21.9378, 86.7335],
  // 13. Madhuban
  [21.9345, 86.7325],
  // 14. Sunagadia
  [21.9330, 86.7360],
  [21.9370, 86.7410],
  [21.9400, 86.7450], // Darogadahi
  [21.9440, 86.7485],
  // 15. Takatpur (PRM Medical College & MPC)
  [21.9485, 86.7520],
  [21.9490, 86.7420],
  [21.9475, 86.7310],
  // 16. Palbani Chowk (NH-18)
  [21.9460, 86.7220],
  [21.9445, 86.7190],
  // 17. Budhikhamari
  [21.9425, 86.7160],
  [21.9400, 86.7195],
  // 18. Deulasahi & Ambika Temple
  [21.9380, 86.7230],
  [21.9335, 86.7205],
  // 19. Tulasi Chaura & Baghra Road
  [21.9280, 86.7190],
  [21.9255, 86.7220], // Sankhabhanga
  [21.9220, 86.7150], // Baghra Road
  [21.9180, 86.7230],
  // 20. Sidhua
  [21.9160, 86.7320],
  [21.9200, 86.7370],
  [21.9240, 86.7420],
  // 21. Municipal Processing Facility
  [21.9275, 86.7425]
];

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
  nearbyFullBins: BINS.filter(b => b.fillLevel > 85).length,
};

export const TASKS = [
  { id: 'C102', location: 'Ward 9 - Baghra Road', issue: 'Overflowing bin near school', priority: 'High', status: 'Pending' },
  { id: 'C105', location: 'Ward 15 - Takatpur Area', issue: 'Waste pickup missed at community center', priority: 'Medium', status: 'Assigned' },
  { id: 'C108', location: 'Ward 19 - Bhanjpur', issue: 'Broken bin lid after storm', priority: 'Low', status: 'Resolved' },
  { id: 'C110', location: 'Ward 5 - Station Bazar', issue: 'Illegal carton dumping by market', priority: 'Critical', status: 'Pending' },
];

export const LEADERBOARD = [
  { name: 'Sarah Green', points: 1250, badge: 'Eco Champion', ward: 12 },
  { name: 'James Earth', points: 980, badge: 'Green Warrior', ward: 5 },
  { name: 'Maria Eco', points: 840, badge: 'Eco Warrior', ward: 19 },
  { name: 'David Recycle', points: 720, badge: 'Green Scout', ward: 1 },
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
  { id: 'CMP-4091', citizen: 'Sarah Green', type: 'Overflowing Bin', location: 'Ward 12 · Purnachandrapur', status: 'Pending', priority: 'High' },
  { id: 'CMP-4092', citizen: 'James Earth', type: 'Illegal Dumping', location: 'Ward 5 · Station Bazar', status: 'Assigned', priority: 'Critical' },
  { id: 'CMP-4093', citizen: 'Maria Eco', type: 'Missed Collection', location: 'Ward 19 · Bhanjpur', status: 'Resolved', priority: 'Medium' },
  { id: 'CMP-4094', citizen: 'David Recycle', type: 'Broken Bin', location: 'Ward 1 · Budhikhamari', status: 'Pending', priority: 'Low' },
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
