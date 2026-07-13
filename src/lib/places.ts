// ============================================
// A small library of common Indian places.
// Used by the author tool's place-search so you
// don't have to type coordinates.
// Add new places freely — this is just a lookup table.
// ============================================

export interface PlaceEntry {
  name: string;
  /** Alternate names / abbreviations for search. */
  aliases?: string[];
  /** [lat, lng] */
  coords: [number, number];
  /** Free-form category: 'city', 'capital', 'river', 'mountain', 'battle', 'site', 'state', ... */
  category: string;
}

export const places: PlaceEntry[] = [
  // Major cities (state capitals + metros)
  { name: 'New Delhi', aliases: ['Delhi'], coords: [28.6139, 77.2090], category: 'capital' },
  { name: 'Mumbai', aliases: ['Bombay'], coords: [19.0760, 72.8777], category: 'city' },
  { name: 'Kolkata', aliases: ['Calcutta'], coords: [22.5726, 88.3639], category: 'city' },
  { name: 'Chennai', aliases: ['Madras'], coords: [13.0827, 80.2707], category: 'city' },
  { name: 'Bengaluru', aliases: ['Bangalore'], coords: [12.9716, 77.5946], category: 'city' },
  { name: 'Hyderabad', coords: [17.3850, 78.4867], category: 'city' },
  { name: 'Ahmedabad', coords: [23.0225, 72.5714], category: 'city' },
  { name: 'Pune', coords: [18.5204, 73.8567], category: 'city' },
  { name: 'Jaipur', coords: [26.9124, 75.7873], category: 'capital' },
  { name: 'Lucknow', coords: [26.8467, 80.9462], category: 'capital' },
  { name: 'Bhopal', coords: [23.2599, 77.4126], category: 'capital' },
  { name: 'Patna', aliases: ['Pataliputra'], coords: [25.5941, 85.1376], category: 'capital' },
  { name: 'Thiruvananthapuram', aliases: ['Trivandrum'], coords: [8.5241, 76.9366], category: 'capital' },
  { name: 'Bhubaneswar', coords: [20.2961, 85.8245], category: 'capital' },
  { name: 'Guwahati', coords: [26.1445, 91.7362], category: 'city' },
  { name: 'Chandigarh', coords: [30.7333, 76.7794], category: 'capital' },
  { name: 'Dehradun', coords: [30.3165, 78.0322], category: 'capital' },
  { name: 'Shimla', coords: [31.1048, 77.1734], category: 'capital' },
  { name: 'Srinagar', coords: [34.0837, 74.7973], category: 'capital' },
  { name: 'Imphal', coords: [24.8170, 93.9368], category: 'capital' },
  { name: 'Aizawl', coords: [23.7271, 92.7176], category: 'capital' },
  { name: 'Itanagar', coords: [27.0844, 93.6053], category: 'capital' },
  { name: 'Kohima', coords: [25.6751, 94.1086], category: 'capital' },
  { name: 'Shillong', coords: [25.5788, 91.8933], category: 'capital' },
  { name: 'Agartala', coords: [23.8315, 91.2868], category: 'capital' },
  { name: 'Dispur', coords: [26.1433, 91.7898], category: 'capital' },
  { name: 'Gangtok', coords: [27.3314, 88.6138], category: 'capital' },

  // Historic / cultural sites
  { name: 'Agra', coords: [27.1767, 78.0081], category: 'site' },
  { name: 'Varanasi', aliases: ['Kashi', 'Banaras'], coords: [25.3176, 82.9739], category: 'site' },
  { name: 'Bodh Gaya', coords: [24.6960, 84.9889], category: 'site' },
  { name: 'Sarnath', coords: [25.3811, 83.0212], category: 'site' },
  { name: 'Sanchi', coords: [23.4791, 77.7395], category: 'site' },
  { name: 'Hampi', coords: [15.3350, 76.4600], category: 'site' },
  { name: 'Khajuraho', coords: [24.8318, 79.9199], category: 'site' },
  { name: 'Konark', coords: [19.8876, 86.0945], category: 'site' },
  { name: 'Madurai', coords: [9.9252, 78.1198], category: 'site' },
  { name: 'Thanjavur', aliases: ['Tanjore'], coords: [10.7870, 79.1378], category: 'site' },
  { name: 'Mohenjo-daro', coords: [27.3294, 68.1389], category: 'site' },
  { name: 'Harappa', coords: [30.6280, 72.8669], category: 'site' },
  { name: 'Dholavira', coords: [23.8893, 70.2106], category: 'site' },
  { name: 'Lothal', coords: [22.5239, 72.2486], category: 'site' },
  { name: 'Kalibangan', coords: [29.4707, 74.1297], category: 'site' },

  // Battles
  { name: 'Plassey', aliases: ['Palashi'], coords: [23.795, 88.255], category: 'battle' },
  { name: 'Buxar', coords: [25.5586, 83.9888], category: 'battle' },
  { name: 'Panipat', coords: [29.3909, 76.9635], category: 'battle' },
  { name: 'Haldighati', coords: [24.9402, 73.5979], category: 'battle' },
  { name: 'Talikota', coords: [16.4847, 76.2810], category: 'battle' },

  // Rivers (origin points — for clicking origins)
  { name: 'Gangotri', aliases: ['Ganga origin'], coords: [30.9947, 78.9398], category: 'river' },
  { name: 'Yamunotri', aliases: ['Yamuna origin'], coords: [30.9939, 78.4434], category: 'river' },
  { name: 'Amarkantak', aliases: ['Narmada origin', 'Son origin'], coords: [22.6707, 81.7616], category: 'river' },
  { name: 'Mansarovar', aliases: ['Brahmaputra origin', 'Indus origin'], coords: [30.6500, 81.4500], category: 'river' },

  // Climate references
  { name: 'Cherrapunji', aliases: ['Sohra'], coords: [25.2702, 91.7195], category: 'site' },
  { name: 'Mawsynram', coords: [25.2986, 91.5822], category: 'site' },
  { name: 'Jaisalmer', coords: [26.9157, 70.9083], category: 'city' },

  // Mountains / passes
  { name: 'K2', coords: [35.8825, 76.5133], category: 'mountain' },
  { name: 'Kanchenjunga', coords: [27.7025, 88.1475], category: 'mountain' },
  { name: 'Nanda Devi', coords: [30.3760, 79.9707], category: 'mountain' },
  { name: 'Nilgiri Hills', coords: [11.4064, 76.6932], category: 'mountain' },
  { name: 'Anaimudi', coords: [10.1700, 77.0600], category: 'mountain' },

  // Foreign / regional anchors
  { name: 'Kabul', coords: [34.5553, 69.2075], category: 'city' },
  { name: 'Kandahar', coords: [31.6133, 65.7100], category: 'city' },
  { name: 'Lahore', coords: [31.5497, 74.3436], category: 'city' },
  { name: 'Dhaka', coords: [23.8103, 90.4125], category: 'city' },
  { name: 'Colombo', coords: [6.9271, 79.8612], category: 'city' },
  { name: 'Yangon', aliases: ['Rangoon'], coords: [16.8409, 96.1735], category: 'city' },
];

/** Search by name or alias (case-insensitive substring match). */
export function searchPlaces(query: string, limit = 8): PlaceEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results: PlaceEntry[] = [];
  for (const p of places) {
    if (p.name.toLowerCase().includes(q)) {
      results.push(p);
      if (results.length >= limit) break;
      continue;
    }
    if (p.aliases?.some((a) => a.toLowerCase().includes(q))) {
      results.push(p);
      if (results.length >= limit) break;
    }
  }
  return results;
}
