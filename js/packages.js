/**
 * Ceylon Chauffeur - Master Tour Packages Dataset & Logic
 * Master Tour Package Itineraries (Relaxed Pace & Multi-Night Stays)
 * All 11 Packages across 3 Categories: All-Rounder, Wildlife & Nature, Beach & Coastal
 * Enhanced with Leaflet interactive mapping, multi-currency display, vehicle selection, and duration/search filtering.
 */

const DESTINATION_COORDS = {
  'Negombo': [7.2083, 79.8358],
  'Colombo': [6.9271, 79.8612],
  'Sigiriya': [7.9570, 80.7603],
  'Dambulla': [7.8742, 80.6511],
  'Anuradhapura': [8.3114, 80.4037],
  'Polonnaruwa': [7.9403, 81.0188],
  'Kandy': [7.2906, 80.6337],
  'Matale': [7.4675, 80.6234],
  'Pinnawala': [7.3013, 80.3857],
  'Nuwara Eliya': [6.9497, 80.7891],
  'Ella': [6.8667, 81.0466],
  'Yala': [6.3685, 81.5204],
  'Udawalawe': [6.4746, 80.8987],
  'Mirissa': [5.9482, 80.4578],
  'Weligama': [5.9722, 80.4283],
  'Galle': [6.0535, 80.2210],
  'Bentota': [6.4259, 79.9958],
  'Hikkaduwa': [6.1408, 80.1011],
  'Kalutara': [6.5854, 79.9607],
  'Tangalle': [6.0244, 80.7941],
  'Hiriketiya': [5.9628, 80.6974],
  'Wilpattu': [8.4489, 80.0094],
  'Trincomalee': [8.5874, 81.2152],
  'Pasikudah': [7.9250, 81.5642],
  'Arugam Bay': [6.8415, 81.8347],
  'Jaffna': [9.6615, 80.0255],
  'Knuckles': [7.4667, 80.7833],
  'Horton Plains': [6.8028, 80.8044],
  'Habarana': [8.0336, 80.7513]
};

const VEHICLE_RATES = {
  sedan: { name: 'Executive Sedan (Premio / Prius / Axio)', rate: 65 },
  van: { name: 'Luxury Van (KDH Flat/High Roof / E25)', rate: 105 },
  bus: { name: 'Luxury Coach / Bus (Coaster / King Long / Yutong)', rate: 160 }
};

const MASTER_PACKAGES = [
  // =========================================================================
  // CATEGORY 1: ALL-ROUNDER / ISLAND HIGHLIGHTS
  // =========================================================================
  {
    id: 'pkg-4d-cultural',
    category: 'all-rounder',
    categoryName: 'All-Rounder / Island Highlights',
    title: '4-Day Cultural Highlights (Compact & Relaxed)',
    keyFeature: 'Kandy / Sigiriya Base | Zero Rush',
    days: 4,
    image: 'assets/images/kandy.jpg',
    baseRateSedan: 260,
    fullRate: 580,
    route: 'Airport → Negombo → Sigiriya → Dambulla → Kandy → Colombo / Airport Drop',
    routePoints: ['Negombo', 'Sigiriya', 'Dambulla', 'Kandy', 'Colombo'],
    highlights: [
      'Sigiriya Lion Rock Fortress climb at cool morning hours',
      'Golden Temple of Dambulla ancient cave murals',
      'Paced leisurely Kandy City Tour & sacred Temple of the Tooth',
      'Peradeniya Royal Botanical Gardens & Pinnawala Elephants'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Airport Pickup → Negombo Sightseeing → Sigiriya (Check-in)',
        details: 'VIP greeting by your private chauffeur at Bandaranaike International Airport (CMB). Tour Negombo\'s historic colonial canals and vibrant fishing harbor, followed by a scenic, relaxed drive to your Sigiriya resort for check-in and evening rest.'
      },
      {
        day: 2,
        tag: 'EXPLORE & RELAX',
        title: '[EXPLORE & RELAX] Morning Sigiriya Rock Climb → Dambulla Cave Temple → Kandy (Check-in)',
        details: 'Ascend the 5th-century UNESCO Sigiriya Rock Fortress during the cool morning. Journey onwards to the ancient rock monastery at Dambulla, then transfer comfortably to royal Kandy for evening check-in.'
      },
      {
        day: 3,
        tag: 'REST & EXPLORE',
        title: '[REST & EXPLORE] Kandy City Tour, Temple of the Tooth & Royal Botanical Gardens (Paced leisurely)',
        details: 'A calm, unhurried day in the hill capital. Stroll through the lush 147-acre Peradeniya Royal Botanical Gardens, explore the sacred Temple of the Tooth Relic, and enjoy lakeside cafes at your own pace.'
      },
      {
        day: 4,
        title: 'Kandy → Tea Factory → Pinnawala Elephant Orphanage → Colombo / Airport Drop',
        details: 'Tour an authentic highland Ceylon tea factory with tasting, observe bathing elephant herds at Pinnawala, and transfer via highway to Colombo or direct to CMB airport for departure.'
      }
    ]
  },
  {
    id: 'pkg-7d-heritage',
    category: 'all-rounder',
    categoryName: 'All-Rounder / Island Highlights',
    title: '7-Day Heritage & Hill Country Classic (Balanced Loop)',
    keyFeature: '2 Nights in Sigiriya + 2 Nights in Ella | Driving Hours Minimized',
    days: 7,
    image: 'assets/images/ella.jpg',
    baseRateSedan: 455,
    fullRate: 980,
    route: 'Negombo → Dambulla → Sigiriya → Matale → Kandy → Ella → Southern Expressway → Colombo / Airport',
    routePoints: ['Negombo', 'Dambulla', 'Sigiriya', 'Matale', 'Kandy', 'Ella', 'Colombo'],
    highlights: [
      '2 Nights in Sigiriya & 2 Nights in Ella for relaxed pacing',
      'UNESCO Sigiriya Lion Rock & Dambulla Cave Temples',
      'Scenic highland blue train journey to Ella',
      'Nine Arches Bridge, cafe hopping & Ravana Falls without rush'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Airport Pickup → Negombo (Rest & Beach Relaxation)',
        details: 'Warm welcome by your private chauffeur at CMB airport. Transfer to your Negombo beachside resort to unwind from international flights with ocean breezes and fresh seafood.'
      },
      {
        day: 2,
        title: 'Negombo → Dambulla Cave Temple → Sigiriya (Check-in)',
        details: 'Travel smoothly into the Cultural Triangle. Discover the UNESCO-listed Dambulla Golden Rock Cave Temple, then check in to your Sigiriya resort surrounded by nature.'
      },
      {
        day: 3,
        tag: 'REST & EXPLORE',
        title: '[REST & EXPLORE] Morning Sigiriya Rock Climb → Afternoon Hotel Pool Relax / Minneriya Safari',
        details: 'Morning ascent of the iconic Sigiriya Rock Fortress with panoramic jungle views. Spend the afternoon cooling off by the hotel pool, or embark on an optional 4x4 elephant gathering safari in Minneriya.'
      },
      {
        day: 4,
        title: 'Sigiriya → Matale Spice Garden → Kandy (Temple of Tooth & City Tour)',
        details: 'Scenic drive to Kandy with a pause at a Matale herbal & spice garden. Check in to your Kandy hotel and visit the sacred Temple of the Tooth Relic in the evening.'
      },
      {
        day: 5,
        title: 'Kandy → Scenic Train Ride to Ella → Check-in',
        details: 'Board the world-renowned hill country train journey. Glide past mist-shrouded emerald tea estates and mountain waterfalls to the tranquil mountain town of Ella for your 2-night stay.'
      },
      {
        day: 6,
        tag: 'REST & EXPLORE',
        title: '[REST & EXPLORE] Ella Chill (Nine Arches Bridge, Cafe Hopping & Ravana Falls at a leisurely pace)',
        details: 'Paced leisurely: photograph trains at the colonial Nine Arches Bridge, relax at mountain-view cafes, and take in the cascades of Ravana Falls without any rush.'
      },
      {
        day: 7,
        title: 'Ella → Southern Expressway → Colombo / Airport Drop',
        details: 'Smooth descent from the mountains and rapid expressway transfer to Colombo for city highlights, or direct drop-off at Bandaranaike International Airport.'
      }
    ]
  },
  {
    id: 'pkg-10d-complete',
    category: 'all-rounder',
    categoryName: 'All-Rounder / Island Highlights',
    title: '10-Day Complete Island Highlights (Slow Island Loop)',
    keyFeature: 'Multi-night stays in Sigiriya (2 Nights), Ella (2 Nights), and Mirissa (2 Nights)',
    days: 10,
    image: 'assets/images/sigiriya.jpg',
    baseRateSedan: 650,
    fullRate: 1450,
    route: 'Negombo → Anuradhapura → Sigiriya → Kandy → Nuwara Eliya → Ella → Udawalawe/Yala → Mirissa → Galle → Colombo / Airport',
    routePoints: ['Negombo', 'Anuradhapura', 'Sigiriya', 'Dambulla', 'Kandy', 'Nuwara Eliya', 'Ella', 'Yala', 'Mirissa', 'Galle', 'Colombo'],
    highlights: [
      'Multi-night stays: 2 Nights Sigiriya, 2 Nights Ella, 2 Nights Mirissa',
      'Anuradhapura Sacred City & Sigiriya Rock Fortress',
      'Scenic train through tea country & Ella mountain relaxation',
      'Udawalawe / Yala Safari, Mirissa beach rest & Galle Dutch Fort'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Airport Pickup → Negombo Beach Rest',
        details: 'Airport greeting and transfer to coastal Negombo for a restful evening after your flight.'
      },
      {
        day: 2,
        title: 'Negombo → Anuradhapura Sacred City → Sigiriya (Check-in)',
        details: 'Journey to the ancient kingdom of Anuradhapura to witness monumental stupas and the sacred Jaya Sri Maha Bodhi tree. Evening check-in at your Sigiriya hotel.'
      },
      {
        day: 3,
        tag: 'REST & EXPLORE',
        title: '[REST & EXPLORE] Morning Sigiriya Rock Climb → Afternoon Minneriya Elephant Safari',
        details: 'Early morning climb of Sigiriya Lion Rock Fortress. Unwind in the afternoon before a thrilling 4x4 open-top safari observing wild elephant herds at Minneriya.'
      },
      {
        day: 4,
        title: 'Sigiriya → Dambulla Caves → Kandy (Temple of Tooth)',
        details: 'Explore the gilded cave temples of Dambulla, then transfer to the cultural capital of Kandy to visit the sacred Temple of the Tooth Relic.'
      },
      {
        day: 5,
        title: 'Kandy → Tea Plantations → Nuwara Eliya',
        details: 'Drive through panoramic central highlands and terraced tea plantations. Visit an active tea factory and explore colonial Nuwara Eliya (Little England).'
      },
      {
        day: 6,
        title: 'Nuwara Eliya → Scenic Train Ride to Ella → Check-in',
        details: 'Board the iconic scenic mountain train winding through cloud forests and mountain gorges into the bohemian town of Ella for your 2-night stay.'
      },
      {
        day: 7,
        tag: 'REST & EXPLORE',
        title: '[REST & EXPLORE] Ella Leisure (Nine Arches Bridge & Little Adam’s Peak)',
        details: 'A leisurely day exploring the Nine Arches viaduct, walking up gentle trails to Little Adam\'s Peak for 360-degree mountain panoramas, and chilling in Ella\'s cafes.'
      },
      {
        day: 8,
        title: 'Ella → Udawalawe / Yala Evening Safari → Mirissa / Weligama (Check-in)',
        details: 'Descend from the hills for an exhilarating wildlife safari in Yala or Udawalawe, then cruise to the southern coastline to check in at Mirissa / Weligama for 2 relaxing nights.'
      },
      {
        day: 9,
        tag: 'BEACH REST DAY',
        title: '[BEACH REST DAY] Full Day Beach Relax / Whale Watching / Pool Chill in Mirissa',
        details: 'A full restorative beach day. Choose an early morning whale watching catamaran excursion, sunbathe on golden sands, or sip cocktails by the pool.'
      },
      {
        day: 10,
        title: 'Mirissa → Galle Dutch Fort → Colombo Shopping → Airport Drop',
        details: 'Stroll through the cobblestone ramparts and boutiques of UNESCO Galle Dutch Fort, continue via expressway for souvenir shopping in Colombo, and timely drop-off at CMB airport.'
      }
    ]
  },
  {
    id: 'pkg-14d-grand',
    category: 'all-rounder',
    categoryName: 'All-Rounder / Island Highlights',
    title: '14-Day Grand Sri Lanka Loop (Relaxed Pace)',
    keyFeature: '2 Nights in Sigiriya, Kandy, Ella, and South Coast',
    days: 14,
    image: 'assets/images/hero.jpg',
    baseRateSedan: 910,
    fullRate: 1980,
    route: 'Negombo → Sigiriya → Kandy → Nuwara Eliya → Ella → Yala → Mirissa → Bentota → Colombo / Airport Drop-off',
    routePoints: ['Negombo', 'Dambulla', 'Sigiriya', 'Kandy', 'Nuwara Eliya', 'Ella', 'Yala', 'Mirissa', 'Galle', 'Bentota', 'Colombo'],
    highlights: [
      'True relaxed pace with 2 Nights each in Sigiriya, Kandy, Ella, and South Coast',
      'Sigiriya Rock Fortress, Dambulla Caves & Minneriya Elephants',
      'Tea trails, world-famous train journey & hill retreats',
      'Yala Leopard Safari, Mirissa beaches & Galle Dutch Fort'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Airport Pickup → Negombo (Rest & Beach Relaxation)',
        details: 'Airport pickup and check-in to your beachfront resort in Negombo to recover from travel.'
      },
      {
        day: 2,
        title: 'Negombo → Dambulla Cave Temple → Sigiriya (Check-in)',
        details: 'Scenic drive to the Cultural Triangle, exploring the ancient Dambulla cave murals before arriving at Sigiriya for your 2-night stay.'
      },
      {
        day: 3,
        tag: 'REST & EXPLORE',
        title: '[REST & EXPLORE] Morning Sigiriya Rock Climb → Afternoon Relax at Hotel / Spa / Village Tour',
        details: 'Dawn ascent of Sigiriya Rock Fortress. Spend a serene afternoon enjoying Ayurvedic spa treatments, hotel pool relaxation, or an authentic rural village tour.'
      },
      {
        day: 4,
        title: 'Sigiriya → Minneriya Elephant Safari → Kandy (Check-in)',
        details: 'Afternoon elephant safari in Minneriya National Park, followed by a scenic drive to your Kandy hotel for a 2-night stay.'
      },
      {
        day: 5,
        tag: 'REST & EXPLORE',
        title: '[REST & EXPLORE] Kandy City, Temple of Tooth & Botanical Gardens (Paced leisurely)',
        details: 'Visit the sacred Temple of the Tooth, leisurely wander through the royal botanical gardens at Peradeniya, and enjoy an evening cultural dance show.'
      },
      {
        day: 6,
        title: 'Kandy → Tea Factory Visit → Nuwara Eliya',
        details: 'Travel through the mist-shrouded tea hills, tour a premier tea processing factory, and stroll through picturesque Nuwara Eliya.'
      },
      {
        day: 7,
        title: 'Nuwara Eliya → Scenic Train Ride to Ella (Check-in)',
        details: 'Experience the world\'s most scenic train journey from the highlands down to the hill town of Ella for a 2-night stay.'
      },
      {
        day: 8,
        tag: 'REST & EXPLORE',
        title: '[REST & EXPLORE] Ella (Nine Arches Bridge & Cafe Hop at a relaxed pace)',
        details: 'Spend a slow, unhurried day visiting the Nine Arches viaduct, watching colonial trains, and soaking up the lively cafe atmosphere.'
      },
      {
        day: 9,
        title: 'Ella → Yala (Evening Safari)',
        details: 'Descend to the dry zone scrub jungles for a late afternoon 4x4 safari in Yala National Park tracking leopards and elephants.'
      },
      {
        day: 10,
        title: 'Yala → Mirissa / Weligama Beach (Check-in)',
        details: 'Short coastal drive to the southern shores of Mirissa / Weligama. Check in to your seaside resort and watch the sunset.'
      },
      {
        day: 11,
        tag: 'BEACH REST DAY',
        title: '[BEACH REST DAY] Full Day Beach Relax / Pool / Whale Watching',
        details: 'Unwind completely with a full day of tropical beach living, optional whale watching, and fresh seafood dining.'
      },
      {
        day: 12,
        title: 'Mirissa → Galle Dutch Fort Exploration → Bentota (Check-in)',
        details: 'Explore the maritime history, jewelry boutiques, and historic ramparts of UNESCO Galle Dutch Fort, then drive to Bentota.'
      },
      {
        day: 13,
        tag: 'BEACH REST DAY',
        title: '[BEACH REST DAY] Water Sports or Chill by the Beach in Bentota',
        details: 'A leisurely coastal day. Enjoy jet skiing and river safaris, or relax beneath the palm trees on Bentota beach.'
      },
      {
        day: 14,
        title: 'Bentota → Colombo Shopping → Airport Drop-off',
        details: 'Expressway drive to Colombo for last-minute shopping at Odel / Barefoot, followed by timely transfer to CMB airport.'
      }
    ]
  },
  {
    id: 'pkg-21d-ultimate',
    category: 'all-rounder',
    categoryName: 'All-Rounder / Island Highlights',
    title: '21-Day Ultimate Sri Lanka Experience (Slow Travel)',
    keyFeature: '2-3 Nights per location (Jaffna, Trinco, Cultural Triangle, Hill Country, and South Coast)',
    days: 21,
    image: 'assets/images/sigiriya.jpg',
    baseRateSedan: 1365,
    fullRate: 2950,
    route: 'Jaffna → Trincomalee → Sigiriya → Kandy → Nuwara Eliya → Ella → Yala → Tangalle → Bentota → Colombo',
    routePoints: ['Negombo', 'Wilpattu', 'Anuradhapura', 'Jaffna', 'Trincomalee', 'Sigiriya', 'Polonnaruwa', 'Dambulla', 'Kandy', 'Nuwara Eliya', 'Ella', 'Udawalawe', 'Yala', 'Tangalle', 'Galle', 'Bentota', 'Colombo'],
    highlights: [
      'Unmatched slow travel: 2-3 nights in Jaffna, Trincomalee, Sigiriya & South Coast',
      'Wilpattu & Yala dual premier safaris',
      'Pigeon Island coral snorkeling & Nilaveli tranquil beaches',
      'Full Cultural Triangle, high mountain train, and southern beaches'
    ],
    itinerary: [
      { day: 1, title: 'Airport Pickup → Negombo Rest', details: 'Warm welcome and check-in to your beachfront hotel.' },
      { day: 2, title: 'Negombo → Wilpattu Safari → Anuradhapura', details: 'Safari in Sri Lanka\'s largest wilderness national park, transfer to the ancient royal capital.' },
      { day: 3, title: 'Anuradhapura Sacred City → Jaffna Drive', details: 'Morning exploration of sacred dagobas, followed by scenic northern drive across Elephant Pass into Jaffna.' },
      { day: 4, tag: 'REST & EXPLORE', title: '[REST & EXPLORE] Jaffna Cultural Highlights (Nallur Kovil, Public Library)', details: 'Golden Nallur Kandaswamy Kovil, historic Jaffna Public Library, Jaffna Fort, and tasting authentic northern cuisine.' },
      { day: 5, title: 'Jaffna → Trincomalee (Nilaveli Beach Check-in)', details: 'Drive across the northeast to the white powdery sands of Nilaveli Beach in Trincomalee.' },
      { day: 6, tag: 'BEACH REST DAY', title: '[BEACH REST DAY] Pigeon Island Snorkeling & Nilaveli Beach Relax', details: 'Boat excursion to Pigeon Island Marine National Park for world-class reef snorkeling with turtles and reef fish.' },
      { day: 7, title: 'Trincomalee → Sigiriya (Check-in)', details: 'Head inland to the Cultural Triangle and check in to your Sigiriya jungle resort.' },
      { day: 8, tag: 'REST & EXPLORE', title: '[REST & EXPLORE] Morning Sigiriya Climb → Pool Relax / Minneriya Safari', details: 'Climb Sigiriya Rock Fortress at dawn, followed by afternoon pool relaxation or Minneriya elephant gathering safari.' },
      { day: 9, title: 'Sigiriya → Polonnaruwa Ruins → Return to Sigiriya Hotel', details: 'Explore the medieval palaces and Buddha statues of Polonnaruwa, returning to your same Sigiriya hotel with zero packing hassle.' },
      { day: 10, title: 'Sigiriya → Dambulla Caves → Kandy', details: 'Explore the cave temples of Dambulla, visit a spice garden, and ascend to the hill capital Kandy.' },
      { day: 11, tag: 'REST & EXPLORE', title: '[REST & EXPLORE] Kandy City Tour & Local Markets (Relaxed)', details: 'Leisurely visit to Temple of the Tooth, stroll around Kandy lake, and explore artisan handicraft markets.' },
      { day: 12, title: 'Kandy → Tea Plantations → Nuwara Eliya', details: 'Climb through emerald tea carpets to Nuwara Eliya, touring an active high-grown tea processing factory.' },
      { day: 13, title: 'Nuwara Eliya → Scenic Train Ride to Ella (Check-in)', details: 'Board the iconic scenic train winding through mountain peaks to the bohemian mountain town of Ella.' },
      { day: 14, tag: 'REST & EXPLORE', title: '[REST & EXPLORE] Ella Chill (Nine Arches Bridge & Little Adam\'s Peak)', details: 'Visit Nine Arches Bridge, take an easy morning walk up Little Adam\'s Peak, and relax at mountain cafes.' },
      { day: 15, title: 'Ella → Udawalawe Elephant Transit Home → Yala', details: 'Watch orphan baby elephant feeding at Udawalawe Transit Home, continuing to Yala safari country.' },
      { day: 16, tag: 'WILDLIFE REST DAY', title: '[WILDLIFE REST DAY] Yala Safari & Evening Hotel Relax', details: 'Thrilling safari tracking leopards and sloth bears, followed by evening relaxation by the resort pool.' },
      { day: 17, title: 'Yala → Tangalle / Dikwella Beach', details: 'Drive along the secluded southern bays to pristine Tangalle / Dikwella beaches.' },
      { day: 18, tag: 'BEACH REST DAY', title: '[BEACH REST DAY] Tangalle Beach Chill & Hiriketiya Bay', details: 'Full day of serenity on quiet Tangalle sands and cafe lounging in horseshoe Hiriketiya cove.' },
      { day: 19, title: 'Tangalle → Galle Dutch Fort → Bentota', details: 'Explore the UNESCO living fortress of Galle, boutique shopping, and transfer to Bentota.' },
      { day: 20, tag: 'BEACH REST DAY', title: '[BEACH REST DAY] Bentota Coastal Relaxation & Spa', details: 'Enjoy rejuvenating Ayurvedic spa treatments and calm coastal relaxation in Bentota.' },
      { day: 21, title: 'Bentota → Colombo Quick Tour → Airport Drop-off', details: 'Brief landmark drive in Colombo, souvenir shopping, and timely transfer to CMB airport.' }
    ]
  },

  // =========================================================================
  // CATEGORY 2: WILDLIFE & NATURE EXPLORER
  // =========================================================================
  {
    id: 'pkg-4d-wildlife',
    category: 'wildlife',
    categoryName: 'Wildlife & Nature Explorer',
    title: '4-Day Safari Express',
    keyFeature: 'Focused on Elephant Transit & Minneriya Safari',
    days: 4,
    image: 'assets/images/wildlife.jpg',
    baseRateSedan: 260,
    fullRate: 620,
    route: 'Airport → Pinnawala → Sigiriya → Minneriya → Dambulla → Kandy → Colombo / Airport',
    routePoints: ['Negombo', 'Pinnawala', 'Sigiriya', 'Dambulla', 'Kandy', 'Colombo'],
    highlights: [
      'Pinnawala Elephant Sanctuary river bathing',
      'Minneriya / Kaudulla wild elephant safari gathering',
      'Sigiriya Rock Fortress early climb',
      'Udawatta Kele Forest Reserve birding & Kandy'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Airport Pickup → Pinnawala Elephant Sanctuary → Sigiriya',
        details: 'Pickup from CMB airport and drive to Pinnawala to watch herds bathing in the river. Afternoon drive to your Sigiriya eco-resort.'
      },
      {
        day: 2,
        tag: 'EXPLORE & SAFARI',
        title: '[EXPLORE & SAFARI] Sigiriya Rock Climb → Afternoon Minneriya / Kaudulla Elephant Safari',
        details: 'Early morning climb of Sigiriya Lion Rock Fortress. In the afternoon, embark on an open-top 4x4 safari witnessing massive elephant gatherings in Minneriya or Kaudulla.'
      },
      {
        day: 3,
        title: 'Sigiriya → Dambulla Caves → Kandy (Udawatta Kele Forest Reserve)',
        details: 'Visit Dambulla cave murals, then travel to Kandy for a guided nature trek in the historic Udawatta Kele rainforest sanctuary.'
      },
      {
        day: 4,
        title: 'Kandy → Giragama Tea Factory → Colombo / Airport Drop',
        details: 'Tour the historic Giragama tea plantation, followed by highway connection to Colombo or direct drop-off at CMB airport.'
      }
    ]
  },
  {
    id: 'pkg-7d-wildlife',
    category: 'wildlife',
    categoryName: 'Wildlife & Nature Explorer',
    title: '7-Day Wild & National Parks Safari (Leisure Pace)',
    keyFeature: 'Wilpattu, Minneriya, Horton Plains, and Yala with buffer rest days',
    days: 7,
    image: 'assets/images/wildlife.jpg',
    baseRateSedan: 455,
    fullRate: 1100,
    route: 'Negombo → Wilpattu → Sigiriya → Nuwara Eliya → Horton Plains → Udawalawe → Yala → Airport Drop-off',
    routePoints: ['Negombo', 'Wilpattu', 'Sigiriya', 'Dambulla', 'Nuwara Eliya', 'Horton Plains', 'Udawalawe', 'Yala', 'Colombo'],
    highlights: [
      'Wilpattu, Minneriya, Horton Plains & Yala premier national parks',
      'Balanced with buffer rest time to prevent safari fatigue',
      'Horton Plains World\'s End cloud forest trek',
      'Highest leopard density habitat tracking in Yala'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Airport Pickup → Negombo Rest',
        details: 'Direct transfer to Negombo coastal hotel to relax and prepare for your wildlife expedition.'
      },
      {
        day: 2,
        title: 'Negombo → Wilpattu Safari → Drive to Sigiriya (Check-in)',
        details: 'Early game drive in Wilpattu National Park tracking leopards and sloth bears around natural water villus, continuing to Sigiriya.'
      },
      {
        day: 3,
        tag: 'REST & EXPLORE',
        title: '[REST & EXPLORE] Morning Sigiriya Climb → Afternoon Minneriya Elephant Safari',
        details: 'Dawn ascent of Sigiriya Rock Fortress. Afternoon thrilling 4x4 open-top safari tracking wild elephant herds at Minneriya.'
      },
      {
        day: 4,
        title: 'Sigiriya → Dambulla Caves → Nuwara Eliya Tea Country',
        details: 'Explore Dambulla cave temples, then drive into the cool, misty central highlands of Nuwara Eliya.'
      },
      {
        day: 5,
        tag: 'REST & EXPLORE',
        title: '[REST & EXPLORE] Horton Plains Morning Trek → Nuwara Eliya Gregory Lake Relax',
        details: 'Morning trek across UNESCO Horton Plains to World\'s End precipice and Baker\'s Falls. Relax in the afternoon around Gregory Lake.'
      },
      {
        day: 6,
        title: 'Nuwara Eliya → Udawalawe Safari → Yala',
        details: 'Descend to Udawalawe for a safari among wild elephant herds, then transfer to your safari lodge at Yala.'
      },
      {
        day: 7,
        title: 'Morning Yala Safari → Highway to Airport Drop-off',
        details: 'Dawn game drive in Yala Block 1 searching for leopards, then travel smoothly via Southern Expressway to CMB airport.'
      }
    ]
  },
  {
    id: 'pkg-10d-wildlife',
    category: 'wildlife',
    categoryName: 'Wildlife & Nature Explorer',
    title: '10-Day Ultimate Wildlife Expedition',
    keyFeature: 'Deep wildlife immersion (Wilpattu, Minneriya, Knuckles, Horton Plains & Yala)',
    days: 10,
    image: 'assets/images/wildlife.jpg',
    baseRateSedan: 650,
    fullRate: 1650,
    route: 'Wilpattu → Sigiriya → Knuckles → Nuwara Eliya → Horton Plains → Udawalawe → Yala → Southern Expressway → Airport',
    routePoints: ['Negombo', 'Wilpattu', 'Sigiriya', 'Knuckles', 'Nuwara Eliya', 'Horton Plains', 'Udawalawe', 'Yala', 'Colombo'],
    highlights: [
      'Comprehensive coverage: Wilpattu, Minneriya, Knuckles, Horton Plains & Yala',
      'Knuckles Conservation Forest biodiversity guided trek',
      'Full Day Yala National Park safari for maximum sightings',
      'Deep wildlife immersion with professional naturalist guide'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Airport Pickup → Wilpattu Base',
        details: 'Pickup from CMB airport and transfer directly to the boundary of Wilpattu National Park to check in to your safari camp.'
      },
      {
        day: 2,
        title: 'Full Day Wilpattu Safari → Sigiriya (Check-in)',
        details: 'Deep full-day safari in Sri Lanka\'s largest park searching for leopards and sloth bears, driving to Sigiriya in the evening.'
      },
      {
        day: 3,
        tag: 'REST & SAFARI',
        title: '[REST & SAFARI] Sigiriya Rock → Evening Minneriya Elephant Safari',
        details: 'Morning climb of the historic citadel, with late afternoon jeep safari to witness the wild elephant gathering at Minneriya.'
      },
      {
        day: 4,
        title: 'Sigiriya → Knuckles Conservation Forest Foot (Check-in)',
        details: 'Drive into the dramatic Knuckles Mountain Range foothills, surrounded by untouched montane forests.'
      },
      {
        day: 5,
        tag: 'NATURE TREK',
        title: '[NATURE TREK] Knuckles Forest Trekking & Waterfalls',
        details: 'Full-day guided hike through the UNESCO Knuckles wilderness, discovering hidden waterfalls, rare endemic birds, and reptiles.'
      },
      {
        day: 6,
        title: 'Knuckles → Nuwara Eliya (Tea Country)',
        details: 'Scenic highland drive through terraced tea plantations to cool Nuwara Eliya.'
      },
      {
        day: 7,
        title: 'Morning Horton Plains (World\'s End) Trek → Nuwara Eliya Lake Relax',
        details: 'Trek across misty Horton Plains to World\'s End and Baker\'s Falls, relaxing around Gregory Lake in the afternoon.'
      },
      {
        day: 8,
        title: 'Nuwara Eliya → Udawalawe Safari → Yala',
        details: 'Descend south for an afternoon 4x4 safari with hundreds of wild elephants at Udawalawe, continuing to Yala.'
      },
      {
        day: 9,
        tag: 'WILDLIFE REST DAY',
        title: '[WILDLIFE REST DAY] Full Day Yala National Park Safari',
        details: 'Full day safari across Yala tracking leopards, bears, elephants, and crocodiles with packed meals in the jungle.'
      },
      {
        day: 10,
        title: 'Yala → Southern Expressway → Airport Drop',
        details: 'Smooth journey along the Southern Expressway directly to Bandaranaike International Airport.'
      }
    ]
  },

  // =========================================================================
  // CATEGORY 3: BEACH & COASTAL ESCAPE
  // =========================================================================
  {
    id: 'pkg-4d-beach',
    category: 'beach',
    categoryName: 'Beach & Coastal Escape',
    title: '4-Day South Coast Sun & Fun',
    keyFeature: 'Quick Coastal Getaway | Bentota & Galle',
    days: 4,
    image: 'assets/images/galle.jpg',
    baseRateSedan: 260,
    fullRate: 550,
    route: 'Airport → Bentota → Galle → Mirissa → Colombo / Airport Drop',
    routePoints: ['Colombo', 'Bentota', 'Galle', 'Mirissa'],
    highlights: [
      'Bentota water sports & Madu River boat safari',
      'Historic UNESCO Galle Dutch Fort sunset stroll',
      'Mirissa sunset & coastal dining',
      'Colombo City walk & seamless expressway transfer'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Airport Pickup → Bentota Beach (Check-in)',
        details: 'Expressway transfer from CMB airport to golden Bentota beach. Settle into your beachfront resort.'
      },
      {
        day: 2,
        tag: 'BEACH REST',
        title: '[BEACH REST] Bentota Water Sports & Madu River Boat Safari',
        details: 'Jet ski, tube ride, or banana boat on the lagoon, followed by a tranquil mangrove river boat safari on Madu Ganga.'
      },
      {
        day: 3,
        title: 'Bentota → Galle Dutch Fort → Mirissa Sunset',
        details: 'Explore the cobblestone ramparts and lighthouse of UNESCO Galle Dutch Fort, driving to Mirissa for a dramatic ocean sunset.'
      },
      {
        day: 4,
        title: 'Mirissa → Colombo City Walk → Airport Drop',
        details: 'Scenic coastal transfer, leisurely landmark walk in Colombo, and direct expressway connection to CMB airport.'
      }
    ]
  },
  {
    id: 'pkg-7d-beach',
    category: 'beach',
    categoryName: 'Beach & Coastal Escape',
    title: '7-Day Complete Coastal Explorer (Slow Beach Escape)',
    keyFeature: '2 Nights in Galle + 2 Nights in Mirissa/Tangalle',
    days: 7,
    image: 'assets/images/beach.jpg',
    baseRateSedan: 455,
    fullRate: 950,
    route: 'Bentota → Hikkaduwa → Galle → Unawatuna → Mirissa → Hiriketiya → Southern Expressway → Colombo / Airport',
    routePoints: ['Colombo', 'Bentota', 'Hikkaduwa', 'Galle', 'Mirissa', 'Hiriketiya'],
    highlights: [
      '2 Nights in Galle + 2 Nights in Mirissa / Tangalle for slow travel',
      'Hikkaduwa coral reef snorkeling & turtle encounters',
      'Galle Fort walks, shopping & Unawatuna beach relax',
      'Coconut Tree Hill sunset & Hiriketiya surf cove'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Airport Pickup → Bentota Beach Check-in',
        details: 'Warm greeting at CMB and transfer to Bentota beach resort for a relaxed first night.'
      },
      {
        day: 2,
        tag: 'BEACH REST DAY',
        title: '[BEACH REST DAY] Bentota Water Sports & River Safari (Relaxed)',
        details: 'Enjoy relaxed lagoon watersports and a scenic boat safari through the lush mangroves of the Madu River.'
      },
      {
        day: 3,
        title: 'Bentota → Hikkaduwa Coral Reef → Galle Dutch Fort (Check-in)',
        details: 'Snorkel among colorful coral reefs and giant sea turtles in Hikkaduwa, continuing to Galle Fort for check-in.'
      },
      {
        day: 4,
        tag: 'REST & EXPLORE',
        title: '[REST & EXPLORE] Galle Fort Walks, Shopping & Unawatuna Beach Relax',
        details: 'Stroll cobblestone streets, visit artisan boutiques and the colonial lighthouse, then swim in the turquoise bay of Unawatuna.'
      },
      {
        day: 5,
        title: 'Galle → Mirissa / Hiriketiya Beach (Check-in)',
        details: 'Short coastal drive along the southern coast to the trendy surf haven of Mirissa / Hiriketiya for a 2-night stay.'
      },
      {
        day: 6,
        tag: 'BEACH REST DAY',
        title: '[BEACH REST DAY] Coconut Tree Hill Sunset & Full Day Beach/Pool Chill',
        details: 'Full day of sun, sea, and relaxation. Photograph the iconic palm promontory of Coconut Tree Hill at golden hour.'
      },
      {
        day: 7,
        title: 'Mirissa → Southern Expressway → Colombo Shopping → Airport Drop-off',
        details: 'Swift transfer along the Southern Expressway to Colombo for boutique souvenir shopping, followed by CMB airport drop-off.'
      }
    ]
  },
  {
    id: 'pkg-10d-beach',
    category: 'beach',
    categoryName: 'Beach & Coastal Escape',
    title: '10-Day East-to-South Tropical Loop',
    keyFeature: 'Trincomalee (Nilaveli), Pasikudah, Arugam Bay, and Galle Fort',
    days: 10,
    image: 'assets/images/galle.jpg',
    baseRateSedan: 650,
    fullRate: 1390,
    route: 'Trincomalee → Pasikudah → Arugam Bay → Tangalle → Galle → Colombo Expressway → Airport Drop',
    routePoints: ['Trincomalee', 'Pasikudah', 'Arugam Bay', 'Tangalle', 'Galle', 'Colombo'],
    highlights: [
      'Comprehensive east-to-south beach odyssey',
      'Pigeon Island marine park & calm shallow reef of Pasikudah Bay',
      'World-famous surfing capital Arugam Bay',
      'Secluded Tangalle shores & historic Galle Dutch Fort'
    ],
    itinerary: [
      {
        day: 1,
        title: 'Airport Pickup → Trincomalee (Nilaveli Beach Check-in)',
        details: 'Scenic cross-island journey to the powdery white sands of Nilaveli Beach in Trincomalee.'
      },
      {
        day: 2,
        tag: 'BEACH REST DAY',
        title: '[BEACH REST DAY] Pigeon Island Snorkeling & Nilaveli Beach Chill',
        details: 'Catamaran boat trip to Pigeon Island for snorkeling among corals, reef sharks, and sea turtles, with afternoon beach chill.'
      },
      {
        day: 3,
        title: 'Trincomalee → Pasikudah Bay (Check-in)',
        details: 'Travel south along the east coast to Pasikudah Bay, known for crystal-clear, calm waters.'
      },
      {
        day: 4,
        tag: 'BEACH REST DAY',
        title: '[BEACH REST DAY] Shallow Water Swimming & Resort Relaxation in Pasikudah',
        details: 'Wade out hundreds of meters into the warm, waist-deep sea, enjoying tropical resort amenities and serene relaxation.'
      },
      {
        day: 5,
        title: 'Pasikudah → Arugam Bay (Surfing Capital)',
        details: 'Drive to Sri Lanka\'s premier surf capital Arugam Bay. Settle in and soak up the lively bohemian surf town vibes.'
      },
      {
        day: 6,
        tag: 'REST & EXPLORE',
        title: '[REST & EXPLORE] Arugam Bay Surf Lessons & Cafe Hopping',
        details: 'Take morning surf lessons or watch world-class surfers at Main Point, with afternoon cafe hopping and chilled beach bars.'
      },
      {
        day: 7,
        title: 'Arugam Bay → Tangalle Beach (Check-in)',
        details: 'Drive along the southern curve to the secluded, palm-fringed coast of Tangalle for your coastal stay.'
      },
      {
        day: 8,
        tag: 'BEACH REST DAY',
        title: '[BEACH REST DAY] Tangalle Beach Relaxation & Hiriketiya Bay',
        details: 'Unwind on uncrowded golden sands, swim in sheltered coves, and visit picturesque Hiriketiya Bay.'
      },
      {
        day: 9,
        title: 'Tangalle → Galle Dutch Fort Exploration',
        details: 'Scenic coastal drive to UNESCO Galle Dutch Fort. Explore 17th-century ramparts, boutique dining, and sunset views.'
      },
      {
        day: 10,
        title: 'Galle Fort → Colombo Expressway → Airport Drop',
        details: 'Convenient transfer via the Southern Expressway to Colombo for last-minute shopping, followed by CMB airport drop-off.'
      }
    ]
  }
];

// Interactive Filter State
let currentCategory = 'all';
let currentDuration = 'all';
let searchKeyword = '';
let isFullPackagePricing = false;
let currentVehicle = 'sedan';

// Leaflet Map Globals
let leafletMap = null;
let activeRoutePolyline = null;
let mapMarkers = [];

document.addEventListener('DOMContentLoaded', () => {
  renderPackages();
  initCategoryFilters();
  initDurationFilters();
  initVehicleSelection();
  initSearchInput();
  initPricingToggle();
  initModalListeners();
  initLeafletMap();

  // Listen for global currency changes
  window.addEventListener('ceylon_currency_changed', () => {
    renderPackages();
  });
});

/**
 * Render packages according to all active filters, vehicle choice, pricing mode & currency
 */
function renderPackages() {
  const container = document.getElementById('packages-grid-container');
  if (!container) return;

  const vehicleConf = VEHICLE_RATES[currentVehicle] || VEHICLE_RATES.sedan;

  let filtered = MASTER_PACKAGES.filter(pkg => {
    // Category match
    const matchCat = currentCategory === 'all' || pkg.category === currentCategory;

    // Duration match
    let matchDur = true;
    if (currentDuration === 'short') matchDur = pkg.days <= 7;
    else if (currentDuration === 'medium') matchDur = pkg.days >= 8 && pkg.days <= 14;
    else if (currentDuration === 'long') matchDur = pkg.days >= 15;

    // Search match
    let matchSearch = true;
    if (searchKeyword.trim().length > 0) {
      const q = searchKeyword.toLowerCase();
      matchSearch = pkg.title.toLowerCase().includes(q) || 
                    pkg.route.toLowerCase().includes(q) ||
                    (pkg.keyFeature && pkg.keyFeature.toLowerCase().includes(q)) ||
                    pkg.highlights.some(h => h.toLowerCase().includes(q));
    }

    return matchCat && matchDur && matchSearch;
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #ffffff; border-radius: var(--radius-md); border: 1px dashed var(--accent-gold);">
        <i class="fas fa-search-location text-gold" style="font-size: 2.8rem; margin-bottom: 16px;"></i>
        <h3 style="color: var(--primary-emerald); margin-bottom: 8px;">No Tour Packages Matched Your Search</h3>
        <p style="color: var(--text-muted); max-width: 500px; margin: 0 auto 20px;">
          Try adjusting your search terms or duration filters, or request a custom itinerary tailored to your exact route.
        </p>
        <a href="booking.html" class="btn btn-primary btn-sm">Request Custom Itinerary</a>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(pkg => {
    // Calculate rate based on chosen vehicle
    const baseRateUSD = pkg.days * vehicleConf.rate;
    const rateToUse = isFullPackagePricing ? pkg.fullRate : baseRateUSD;

    const convertedRate = window.convertUSD ? window.convertUSD(rateToUse) : { formatted: `$${rateToUse}`, code: 'USD' };
    const priceNote = isFullPackagePricing 
      ? 'Full All-Inclusive Estimate' 
      : `${vehicleConf.name.split('(')[0].trim()} Rate (${pkg.days} Days)`;

    return `
      <div class="package-card" data-category="${pkg.category}" onmouseenter="highlightPackageRoute('${pkg.id}')">
        <div class="package-img-box">
          <img src="${pkg.image}" alt="${pkg.title}" loading="lazy">
          <div class="package-duration-pill">
            <i class="far fa-clock"></i> ${pkg.days} Days / ${pkg.days - 1} Nights
          </div>
          <div class="package-badge-cat">${pkg.categoryName}</div>
        </div>
        <div class="package-body">
          <h3>${pkg.title}</h3>
          <div class="package-key-feature">
            <i class="fas fa-bed text-gold"></i> <span><strong>Key Feature:</strong> ${pkg.keyFeature}</span>
          </div>
          <div class="package-route-preview">
            <strong>Route:</strong> ${pkg.route}
          </div>
          <ul class="package-highlights-list">
            ${pkg.highlights.map(h => `<li><i class="fas fa-check-circle"></i> ${h}</li>`).join('')}
          </ul>
          <div class="package-price-box">
            <div>
              <div class="price-label">Starting From</div>
              <div class="price-amount">${convertedRate.formatted} <span>${convertedRate.code}</span></div>
            </div>
            <div style="text-align: right;">
              <span style="font-size: 0.78rem; color: var(--text-muted);">${priceNote}</span>
            </div>
          </div>
          <div class="package-card-actions">
            <button class="btn btn-outline-emerald btn-sm" onclick="openItineraryModal('${pkg.id}')">
              <i class="fas fa-list-ul"></i> View Itinerary
            </button>
            <button class="btn btn-whatsapp btn-sm action-pkg-whatsapp" onclick="bookPackageWhatsApp('${pkg.id}')">
              <i class="fab fa-whatsapp"></i> Book Tour
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Category Filter Tabs
 */
function initCategoryFilters() {
  const tabs = document.querySelectorAll('.tab-btn[data-category]');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCategory = tab.getAttribute('data-category');
      renderPackages();
    });
  });
}

/**
 * Duration Filter Pills
 */
function initDurationFilters() {
  const pills = document.querySelectorAll('.pill-btn[data-duration]');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentDuration = pill.getAttribute('data-duration');
      renderPackages();
    });
  });
}

/**
 * Vehicle Selection on Packages Matrix
 */
function initVehicleSelection() {
  const btns = document.querySelectorAll('.veh-pill-btn[data-vehicle]');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentVehicle = btn.getAttribute('data-vehicle');
      renderPackages();
    });
  });
}

/**
 * Search Input Filter
 */
function initSearchInput() {
  const searchInput = document.getElementById('pkg-search-input');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    searchKeyword = e.target.value;
    renderPackages();
  });
}

/**
 * Pricing Toggle (Chauffeur-Only vs Full Package)
 */
function initPricingToggle() {
  const toggle = document.getElementById('pricing-mode-toggle');
  if (!toggle) return;

  toggle.addEventListener('change', (e) => {
    isFullPackagePricing = e.target.checked;
    renderPackages();
  });
}

/**
 * Leaflet Interactive Map Initialization
 */
function initLeafletMap() {
  const mapElem = document.getElementById('ceylon-route-map');
  if (!mapElem || typeof L === 'undefined') return;

  try {
    leafletMap = L.map('ceylon-route-map', {
      center: [7.8731, 80.7718],
      zoom: 7,
      scrollWheelZoom: false
    });

    // Elegant CartoDB Voyager / OSM map tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 18
    }).addTo(leafletMap);

    // Add destination markers
    Object.keys(DESTINATION_COORDS).forEach(place => {
      const coord = DESTINATION_COORDS[place];
      const marker = L.circleMarker(coord, {
        radius: 6,
        fillColor: '#092c23',
        color: '#d4af37',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.9
      }).addTo(leafletMap);

      marker.bindPopup(`<strong>${place}</strong><br><span style="font-size:0.8rem;color:#666;">Chauffeur Waypoint</span>`);
      mapMarkers.push({ name: place, marker: marker });
    });
  } catch (err) {
    console.warn('Map initialization note:', err);
  }
}

/**
 * Highlight a tour route on the interactive map
 */
function highlightPackageRoute(packageId) {
  if (!leafletMap || typeof L === 'undefined') return;

  const pkg = MASTER_PACKAGES.find(p => p.id === packageId);
  if (!pkg || !pkg.routePoints) return;

  const tagElem = document.getElementById('map-active-package-tag');
  if (tagElem) {
    tagElem.innerHTML = `<i class="fas fa-route text-gold"></i> Route: ${pkg.title}`;
  }

  // Remove previous polyline
  if (activeRoutePolyline) {
    leafletMap.removeLayer(activeRoutePolyline);
  }

  // Gather lat-lngs
  const latlngs = [];
  pkg.routePoints.forEach(pt => {
    if (DESTINATION_COORDS[pt]) {
      latlngs.push(DESTINATION_COORDS[pt]);
    }
  });

  if (latlngs.length > 1) {
    activeRoutePolyline = L.polyline(latlngs, {
      color: '#d4af37',
      weight: 4,
      dashArray: '8, 8',
      opacity: 0.95
    }).addTo(leafletMap);

    leafletMap.fitBounds(activeRoutePolyline.getBounds(), { padding: [30, 30] });
  }
}

/**
 * Open Day-by-Day Itinerary Modal
 */
function openItineraryModal(packageId) {
  const pkg = MASTER_PACKAGES.find(p => p.id === packageId);
  if (!pkg) return;

  // Highlight on map as well
  highlightPackageRoute(packageId);

  const modal = document.getElementById('itinerary-modal');
  const titleElem = document.getElementById('modal-pkg-title');
  const bodyElem = document.getElementById('modal-pkg-body');
  const ctaBtn = document.getElementById('modal-pkg-quote-btn');
  const waBtn = document.getElementById('modal-pkg-whatsapp-btn');

  if (titleElem) titleElem.textContent = `${pkg.title} (${pkg.days} Days / ${pkg.days - 1} Nights)`;

  if (bodyElem) {
    bodyElem.innerHTML = `
      <div class="modal-itinerary-header-callout">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px; font-weight: 700; color: var(--primary-emerald); font-size: 0.95rem;">
          <i class="fas fa-bed text-gold"></i> Key Feature: ${pkg.keyFeature}
        </div>
        <p style="font-size: 0.92rem; margin-bottom: 6px; line-height: 1.5;"><strong>Complete Route:</strong> ${pkg.route}</p>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin: 0;">
          All Ceylon Chauffeur tours strictly include fuel, expressway tolls, parking fees, and chauffeur lodging & meals. Zero hidden costs.
        </p>
      </div>

      <div class="itinerary-timeline">
        ${pkg.itinerary.map(item => {
          let tagHtml = '';
          const tagToUse = item.tag || (item.title.match(/^\[(.*?)\]/) ? item.title.match(/^\[(.*?)\]/)[1] : null);
          
          if (tagToUse) {
            let tagClass = 'tag-rest-explore';
            let iconClass = 'fas fa-compass';
            const upper = tagToUse.toUpperCase();
            if (upper.includes('BEACH')) {
              tagClass = 'tag-beach-rest';
              iconClass = 'fas fa-umbrella-beach';
            } else if (upper.includes('WILDLIFE') || upper.includes('SAFARI')) {
              tagClass = 'tag-wildlife-rest';
              iconClass = 'fas fa-paw';
            } else if (upper.includes('TREK')) {
              tagClass = 'tag-nature-trek';
              iconClass = 'fas fa-hiking';
            } else if (upper.includes('EXPLORE & RELAX')) {
              tagClass = 'tag-explore-relax';
              iconClass = 'fas fa-mountain';
            }
            tagHtml = `<span class="itinerary-tag ${tagClass}"><i class="${iconClass}"></i> ${tagToUse}</span>`;
          }

          // Clean title by removing bracketed tag prefix for clean display
          const cleanTitle = item.title.replace(/^\[.*?\]\s*/, '');

          return `
            <div class="timeline-step">
              <div class="timeline-dot">${item.day}</div>
              <div class="timeline-title">
                ${tagHtml}
                Day ${item.day}: ${cleanTitle}
              </div>
              <div class="timeline-desc">${item.details}</div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  if (ctaBtn) {
    ctaBtn.onclick = () => {
      window.location.href = `booking.html?package=${pkg.id}&duration=${pkg.days}&vehicle=${currentVehicle}`;
    };
  }

  if (waBtn) {
    waBtn.onclick = () => {
      bookPackageWhatsApp(pkg.id);
    };
  }

  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeItineraryModal() {
  const modal = document.getElementById('itinerary-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function openFullPackageInfoModal() {
  const modal = document.getElementById('full-package-info-modal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeFullPackageInfoModal() {
  const modal = document.getElementById('full-package-info-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function initModalListeners() {
  const modal = document.getElementById('itinerary-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeItineraryModal();
      }
    });
  }

  const fullModal = document.getElementById('full-package-info-modal');
  if (fullModal) {
    fullModal.addEventListener('click', (e) => {
      if (e.target === fullModal) {
        closeFullPackageInfoModal();
      }
    });
  }
}

/**
 * Direct WhatsApp booking for specific package
 */
function bookPackageWhatsApp(packageId) {
  const pkg = MASTER_PACKAGES.find(p => p.id === packageId);
  if (!pkg) return;

  const vehicleName = VEHICLE_RATES[currentVehicle]?.name || 'Executive Sedan';
  const msg = `Hi Ceylon Chauffeur, I would like to inquire about booking the "${pkg.title}" (${pkg.days} Days) with an ${vehicleName}. Please share availability and exact itinerary details.`;
  window.openWhatsApp(msg);
}

// Export functions to window
window.MASTER_PACKAGES = MASTER_PACKAGES;
window.openItineraryModal = openItineraryModal;
window.closeItineraryModal = closeItineraryModal;
window.openFullPackageInfoModal = openFullPackageInfoModal;
window.closeFullPackageInfoModal = closeFullPackageInfoModal;
window.bookPackageWhatsApp = bookPackageWhatsApp;
window.highlightPackageRoute = highlightPackageRoute;
