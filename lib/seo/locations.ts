export interface LocationSeoConfig {
  id: number;
  slug: string;
  name: string;
  fullName: string;
  aliases: string[];
  popularAreas: string[];
  popularBrands: string[];
  description: string;
}

export const NIGERIAN_LOCATIONS: Record<string, LocationSeoConfig> = {
  abuja: {
    id: 15,
    slug: 'abuja',
    name: 'Abuja',
    fullName: 'Abuja (FCT)',
    aliases: ['fct', 'abuja-fct', 'federal-capital-territory'],
    popularAreas: ['Maitama', 'Gwarimpa', 'Wuse 2', 'Jabi', 'Garki', 'Apo', 'Asokoro', 'Utako', 'Guzape', 'Kubwa'],
    popularBrands: ['Toyota', 'Mercedes-Benz', 'Lexus', 'Honda', 'Ford', 'Hyundai', 'Kia', 'Land Rover'],
    description: 'Find verified new, foreign used (tokunbo) and Nigerian used cars for sale in Abuja (FCT). Direct contact with trusted car dealers and private sellers in Maitama, Gwarimpa, Wuse 2, Jabi, and across Abuja on C9X.',
  },
  lagos: {
    id: 25,
    slug: 'lagos',
    name: 'Lagos',
    fullName: 'Lagos State',
    aliases: ['lagos-state', 'eko'],
    popularAreas: ['Lekki', 'Ikeja', 'Victoria Island (VI)', 'Ajah', 'Surulere', 'Yaba', 'Ikoyi', 'Maryland', 'Gbagada', 'Festac'],
    popularBrands: ['Toyota', 'Lexus', 'Mercedes-Benz', 'Honda', 'Land Rover', 'BMW', 'Ford', 'Hyundai'],
    description: 'Explore verified cars for sale in Lagos. Browse thousands of tokunbo and Nigerian used cars in Lekki, Ikeja, VI, Ajah, and across Lagos with inspection reports and seller verification on C9X.',
  },
  rivers: {
    id: 33,
    slug: 'rivers',
    name: 'Rivers',
    fullName: 'Rivers State (Port Harcourt)',
    aliases: ['port-harcourt', 'ph', 'rivers-state'],
    popularAreas: ['GRA Phase 1 & 2', 'Peter Odili Road', 'Trans Amadi', 'Woji', 'Rumuola', 'D-Line', 'Ada George'],
    popularBrands: ['Toyota', 'Lexus', 'Mercedes-Benz', 'Ford', 'Honda', 'Mitsubishi', 'Nissan'],
    description: 'Browse verified cars for sale in Port Harcourt and Rivers State. Quality tokunbo and Nigerian used vehicles from certified dealers on C9X.',
  },
  kano: {
    id: 20,
    slug: 'kano',
    name: 'Kano',
    fullName: 'Kano State',
    aliases: ['kano-state'],
    popularAreas: ['Nasarawa GRA', 'Bompai', 'Tarauni', 'Fagge', 'Kano Municipal', 'Sabon Gari'],
    popularBrands: ['Toyota', 'Honda', 'Peugeot', 'Mercedes-Benz', 'Volkswagen', 'Hyundai'],
    description: 'Find the best car deals in Kano State. Verified cars for sale with direct owner contacts on C9X.',
  },
  oyo: {
    id: 31,
    slug: 'oyo',
    name: 'Oyo',
    fullName: 'Oyo State (Ibadan)',
    aliases: ['ibadan', 'oyo-state'],
    popularAreas: ['Bodija', 'Ring Road', 'Jericho', 'Oluyole', 'Samonda', 'Iwo Road', 'Akobo'],
    popularBrands: ['Toyota', 'Honda', 'Nissan', 'Lexus', 'Mercedes-Benz', 'Hyundai'],
    description: 'Discover cars for sale in Ibadan and Oyo State. Reliable Nigerian used and clean foreign used cars on C9X.',
  },
  delta: {
    id: 10,
    slug: 'delta',
    name: 'Delta',
    fullName: 'Delta State (Warri & Asaba)',
    aliases: ['warri', 'asaba', 'delta-state'],
    popularAreas: ['Asaba GRA', 'Warri Effurun', 'Okpanam', 'Sapele Road', 'Airport Road'],
    popularBrands: ['Toyota', 'Lexus', 'Mercedes-Benz', 'Honda', 'Ford'],
    description: 'Buy verified new and used cars in Asaba, Warri, and across Delta State on C9X.',
  },
  edo: {
    id: 12,
    slug: 'edo',
    name: 'Edo',
    fullName: 'Edo State (Benin City)',
    aliases: ['benin-city', 'benin', 'edo-state'],
    popularAreas: ['GRA Benin', 'Airport Road', 'Ugbowo', 'Sapele Road', 'Ekenwan Road'],
    popularBrands: ['Toyota', 'Mercedes-Benz', 'Lexus', 'Honda', 'Volkswagen'],
    description: 'Cars for sale in Benin City and Edo State. Compare prices and chat with verified sellers on C9X.',
  },
  enugu: {
    id: 14,
    slug: 'enugu',
    name: 'Enugu',
    fullName: 'Enugu State',
    aliases: ['enugu-state', 'coal-city'],
    popularAreas: ['Independence Layout', 'New Haven', 'GRA Enugu', 'Trans Ekulu', 'Ogui Road'],
    popularBrands: ['Toyota', 'Lexus', 'Honda', 'Mercedes-Benz', 'Ford'],
    description: 'Cars for sale in Enugu. Verified listings of foreign used and Nigerian used vehicles on C9X.',
  },
  anambra: {
    id: 4,
    slug: 'anambra',
    name: 'Anambra',
    fullName: 'Anambra State (Awka & Onitsha)',
    aliases: ['awka', 'onitsha', 'nnewi', 'anambra-state'],
    popularAreas: ['Awka GRA', 'Onitsha Main', 'Nnewi Industrial', 'Ekwulobia'],
    popularBrands: ['Toyota', 'Lexus', 'Mercedes-Benz', 'Honda', 'Mitsubishi'],
    description: 'Verified cars for sale in Awka, Onitsha, Nnewi, and Anambra State on C9X.',
  },
  kaduna: {
    id: 19,
    slug: 'kaduna',
    name: 'Kaduna',
    fullName: 'Kaduna State',
    aliases: ['kaduna-state', 'kd'],
    popularAreas: ['Barnawa', 'Malali', 'Kaduna South', 'Kabala Costain', 'GRA Kaduna'],
    popularBrands: ['Toyota', 'Peugeot', 'Honda', 'Mercedes-Benz', 'Volkswagen'],
    description: 'Find affordable and clean cars for sale in Kaduna State on C9X.',
  },
  ogun: {
    id: 28,
    slug: 'ogun',
    name: 'Ogun',
    fullName: 'Ogun State (Abeokuta & Mowe)',
    aliases: ['abeokuta', 'mowe', 'ibafo', 'ota', 'ogun-state'],
    popularAreas: ['Abeokuta GRA', 'Ota', 'Mowe', 'Ibafo', 'Sagamu'],
    popularBrands: ['Toyota', 'Honda', 'Nissan', 'Lexus', 'Mercedes-Benz'],
    description: 'Cars for sale in Ogun State, Abeokuta, Ota, and environs on C9X.',
  },
  akwa_ibom: {
    id: 3,
    slug: 'akwa-ibom',
    name: 'Akwa Ibom',
    fullName: 'Akwa Ibom State (Uyo)',
    aliases: ['uyo', 'akwa-ibom-state'],
    popularAreas: ['Ewet Housing Estate', 'Shelter Afrique', 'Udo Udoma', 'Oron Road'],
    popularBrands: ['Toyota', 'Lexus', 'Mercedes-Benz', 'Honda', 'Ford'],
    description: 'Buy verified clean cars in Uyo and Akwa Ibom State on C9X.',
  },
  imo: {
    id: 17,
    slug: 'imo',
    name: 'Imo',
    fullName: 'Imo State (Owerri)',
    aliases: ['owerri', 'imo-state'],
    popularAreas: ['Aladinma', 'Ikenegbu', 'New Owerri', 'World Bank', 'Orji'],
    popularBrands: ['Toyota', 'Lexus', 'Mercedes-Benz', 'Honda'],
    description: 'Cars for sale in Owerri and Imo State on C9X.',
  },
  plateau: {
    id: 32,
    slug: 'plateau',
    name: 'Plateau',
    fullName: 'Plateau State (Jos)',
    aliases: ['jos', 'plateau-state'],
    popularAreas: ['Rayfield', 'Jos South', 'Bukuru', 'Lamingo', 'Anglo Jos'],
    popularBrands: ['Toyota', 'Peugeot', 'Volkswagen', 'Honda'],
    description: 'Affordable cars for sale in Jos and Plateau State on C9X.',
  },
  kwara: {
    id: 24,
    slug: 'kwara',
    name: 'Kwara',
    fullName: 'Kwara State (Ilorin)',
    aliases: ['ilorin', 'kwara-state'],
    popularAreas: ['GRA Ilorin', 'Tanke', 'Fate', 'Offa Garage'],
    popularBrands: ['Toyota', 'Honda', 'Nissan', 'Mercedes-Benz'],
    description: 'Cars for sale in Ilorin and Kwara State on C9X.',
  },
  benue: {
    id: 7,
    slug: 'benue',
    name: 'Benue',
    fullName: 'Benue State (Makurdi)',
    aliases: ['makurdi', 'benue-state'],
    popularAreas: ['High Level', 'Wurukum', 'North Bank', 'Modern Market'],
    popularBrands: ['Toyota', 'Peugeot', 'Honda'],
    description: 'Verified cars for sale in Makurdi and Benue State on C9X.',
  },
  nasarawa: {
    id: 26,
    slug: 'nasarawa',
    name: 'Nasarawa',
    fullName: 'Nasarawa State (Lafia & Mararaba)',
    aliases: ['lafia', 'mararaba', 'karu', 'nasarawa-state'],
    popularAreas: ['Mararaba', 'Karu', 'Lafia GRA', 'Keffi'],
    popularBrands: ['Toyota', 'Honda', 'Lexus', 'Mercedes-Benz'],
    description: 'Cars for sale in Mararaba, Karu, Lafia and Nasarawa State on C9X.',
  },
  niger: {
    id: 27,
    slug: 'niger',
    name: 'Niger',
    fullName: 'Niger State (Minna & Suleja)',
    aliases: ['minna', 'suleja', 'niger-state'],
    popularAreas: ['Minna GRA', 'Suleja', 'Bosso', 'Tunga'],
    popularBrands: ['Toyota', 'Peugeot', 'Honda', 'Volkswagen'],
    description: 'Cars for sale in Minna, Suleja, and Niger State on C9X.',
  },
  cross_river: {
    id: 9,
    slug: 'cross-river',
    name: 'Cross River',
    fullName: 'Cross River State (Calabar)',
    aliases: ['calabar', 'cross-river-state'],
    popularAreas: ['State Housing Estate', 'Marian', 'Federal Housing', 'Etta Agbor'],
    popularBrands: ['Toyota', 'Lexus', 'Honda', 'Ford'],
    description: 'Clean foreign and Nigerian used cars in Calabar on C9X.',
  },
  abia: {
    id: 1,
    slug: 'abia',
    name: 'Abia',
    fullName: 'Abia State (Aba & Umuahia)',
    aliases: ['aba', 'umuahia', 'abia-state'],
    popularAreas: ['Aba Commercial', 'Umuahia GRA', 'Osisioma', 'Faulks Road'],
    popularBrands: ['Toyota', 'Mercedes-Benz', 'Lexus', 'Honda'],
    description: 'Cars for sale in Aba and Umuahia on C9X.',
  },
  adamawa: {
    id: 2,
    slug: 'adamawa',
    name: 'Adamawa',
    fullName: 'Adamawa State (Yola)',
    aliases: ['yola', 'jimeta', 'adamawa-state'],
    popularAreas: ['Jimeta', 'Yola Town', 'Karewa GRA'],
    popularBrands: ['Toyota', 'Peugeot', 'Honda'],
    description: 'Cars for sale in Yola and Adamawa State on C9X.',
  },
  bauchi: {
    id: 5,
    slug: 'bauchi',
    name: 'Bauchi',
    fullName: 'Bauchi State',
    aliases: ['bauchi-state'],
    popularAreas: ['Bauchi GRA', 'Fadaman Mada', 'Yelwa'],
    popularBrands: ['Toyota', 'Peugeot', 'Honda'],
    description: 'Cars for sale in Bauchi State on C9X.',
  },
  bayelsa: {
    id: 6,
    slug: 'bayelsa',
    name: 'Bayelsa',
    fullName: 'Bayelsa State (Yenagoa)',
    aliases: ['yenagoa', 'bayelsa-state'],
    popularAreas: ['Yenagoa Amarata', 'Kpansia', 'Opolo'],
    popularBrands: ['Toyota', 'Lexus', 'Ford', 'Honda'],
    description: 'Cars for sale in Yenagoa and Bayelsa on C9X.',
  },
  borno: {
    id: 8,
    slug: 'borno',
    name: 'Borno',
    fullName: 'Borno State (Maiduguri)',
    aliases: ['maiduguri', 'borno-state'],
    popularAreas: ['Maiduguri GRA', 'Custom Area', 'Bulunkutu'],
    popularBrands: ['Toyota', 'Peugeot', 'Honda'],
    description: 'Cars for sale in Maiduguri and Borno State on C9X.',
  },
  ebonyi: {
    id: 11,
    slug: 'ebonyi',
    name: 'Ebonyi',
    fullName: 'Ebonyi State (Abakaliki)',
    aliases: ['abakaliki', 'ebonyi-state'],
    popularAreas: ['Abakaliki GRA', 'Water Works', 'Ogoja Road'],
    popularBrands: ['Toyota', 'Honda', 'Mercedes-Benz'],
    description: 'Cars for sale in Abakaliki and Ebonyi State on C9X.',
  },
  ekiti: {
    id: 13,
    slug: 'ekiti',
    name: 'Ekiti',
    fullName: 'Ekiti State (Ado-Ekiti)',
    aliases: ['ado-ekiti', 'ekiti-state'],
    popularAreas: ['Ado GRA', 'Adebayo', 'Ajilosun'],
    popularBrands: ['Toyota', 'Honda', 'Nissan'],
    description: 'Cars for sale in Ado-Ekiti on C9X.',
  },
  gombe: {
    id: 16,
    slug: 'gombe',
    name: 'Gombe',
    fullName: 'Gombe State',
    aliases: ['gombe-state'],
    popularAreas: ['Gombe GRA', 'Tudun Wada', 'Federal Low Cost'],
    popularBrands: ['Toyota', 'Peugeot', 'Honda'],
    description: 'Cars for sale in Gombe State on C9X.',
  },
  jigawa: {
    id: 18,
    slug: 'jigawa',
    name: 'Jigawa',
    fullName: 'Jigawa State (Dutse)',
    aliases: ['dutse', 'jigawa-state'],
    popularAreas: ['Dutse GRA', 'Hadejia', 'Gumel'],
    popularBrands: ['Toyota', 'Peugeot', 'Volkswagen'],
    description: 'Cars for sale in Jigawa State on C9X.',
  },
  katsina: {
    id: 21,
    slug: 'katsina',
    name: 'Katsina',
    fullName: 'Katsina State',
    aliases: ['katsina-state'],
    popularAreas: ['Katsina GRA', 'Kofar Kaura', 'Funtua'],
    popularBrands: ['Toyota', 'Peugeot', 'Volkswagen'],
    description: 'Cars for sale in Katsina on C9X.',
  },
  kebbi: {
    id: 22,
    slug: 'kebbi',
    name: 'Kebbi',
    fullName: 'Kebbi State (Birnin Kebbi)',
    aliases: ['birnin-kebbi', 'kebbi-state'],
    popularAreas: ['Birnin Kebbi GRA', 'Haliru Abdu', 'Jega'],
    popularBrands: ['Toyota', 'Peugeot', 'Honda'],
    description: 'Cars for sale in Kebbi State on C9X.',
  },
  kogi: {
    id: 23,
    slug: 'kogi',
    name: 'Kogi',
    fullName: 'Kogi State (Lokoja)',
    aliases: ['lokoja', 'kogi-state'],
    popularAreas: ['Lokoja GRA', 'Ganaja', 'Phase 2'],
    popularBrands: ['Toyota', 'Honda', 'Nissan'],
    description: 'Cars for sale in Lokoja and Kogi on C9X.',
  },
  ondo: {
    id: 29,
    slug: 'ondo',
    name: 'Ondo',
    fullName: 'Ondo State (Akure)',
    aliases: ['akure', 'ondo-state'],
    popularAreas: ['Alagbaka GRA', 'Ijapo Estate', 'Ondo Town'],
    popularBrands: ['Toyota', 'Honda', 'Nissan', 'Lexus'],
    description: 'Cars for sale in Akure and Ondo State on C9X.',
  },
  osun: {
    id: 30,
    slug: 'osun',
    name: 'Osun',
    fullName: 'Osun State (Osogbo)',
    aliases: ['osogbo', 'osun-state'],
    popularAreas: ['Osogbo GRA', 'Ogo-Oluwa', 'Ile-Ife'],
    popularBrands: ['Toyota', 'Honda', 'Nissan'],
    description: 'Cars for sale in Osogbo, Ile-Ife and Osun State on C9X.',
  },
  sokoto: {
    id: 34,
    slug: 'sokoto',
    name: 'Sokoto',
    fullName: 'Sokoto State',
    aliases: ['sokoto-state'],
    popularAreas: ['Sokoto GRA', 'Runjin Sambo', 'Mabera'],
    popularBrands: ['Toyota', 'Peugeot', 'Volkswagen'],
    description: 'Cars for sale in Sokoto on C9X.',
  },
  taraba: {
    id: 35,
    slug: 'taraba',
    name: 'Taraba',
    fullName: 'Taraba State (Jalingo)',
    aliases: ['jalingo', 'taraba-state'],
    popularAreas: ['Jalingo GRA', 'Magami', 'Mile 6'],
    popularBrands: ['Toyota', 'Peugeot', 'Honda'],
    description: 'Cars for sale in Jalingo and Taraba State on C9X.',
  },
  yobe: {
    id: 36,
    slug: 'yobe',
    name: 'Yobe',
    fullName: 'Yobe State (Damaturu)',
    aliases: ['damaturu', 'yobe-state'],
    popularAreas: ['Damaturu GRA', 'Potiskum', 'Njadabalo'],
    popularBrands: ['Toyota', 'Peugeot', 'Volkswagen'],
    description: 'Cars for sale in Damaturu, Potiskum and Yobe on C9X.',
  },
  zamfara: {
    id: 37,
    slug: 'zamfara',
    name: 'Zamfara',
    fullName: 'Zamfara State (Gusau)',
    aliases: ['gusau', 'zamfara-state'],
    popularAreas: ['Gusau GRA', 'Samaru', 'Tudun Wada'],
    popularBrands: ['Toyota', 'Peugeot', 'Volkswagen'],
    description: 'Cars for sale in Gusau and Zamfara State on C9X.',
  },
};

/**
 * Resolves a URL slug (e.g., 'abuja', 'fct', 'lagos', 'port-harcourt') to its canonical location config.
 */
export function getLocationBySlug(rawSlug: string): LocationSeoConfig | null {
  if (!rawSlug) return null;
  const clean = rawSlug.toLowerCase().trim().replace(/^cars-in-/, '').replace(/^cars-for-sale-in-/, '');

  // Check exact key match
  if (NIGERIAN_LOCATIONS[clean]) {
    return NIGERIAN_LOCATIONS[clean];
  }

  // Check aliases or slug values
  for (const loc of Object.values(NIGERIAN_LOCATIONS)) {
    if (loc.slug === clean || loc.aliases.includes(clean)) {
      return loc;
    }
  }

  return null;
}

/**
 * Returns all canonical location slugs (e.g. for static paths or sitemaps)
 */
export function getAllLocationSlugs(): string[] {
  return Object.values(NIGERIAN_LOCATIONS).map((l) => l.slug);
}

/**
 * Formats canonical page title tailored to search intent
 */
export function formatLocationTitle(loc: LocationSeoConfig, count?: number, minPriceFormatted?: string): string {
  if (count && count > 0 && minPriceFormatted) {
    return `Cars in ${loc.fullName} for Sale | Price from ${minPriceFormatted} | C9X`;
  }
  return `Cars for Sale in ${loc.fullName} | Buy Verified New & Used Cars | C9X`;
}

