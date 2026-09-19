/**
 * Ceylon Chauffeur - Master Tour Packages Dataset & Logic
 * All 11 Packages across 3 Categories: All-Rounder, Wildlife & Nature, Beach & Coastal
 */

const MASTER_PACKAGES = [
  // =========================================================================
  // CATEGORY 1: ALL-ROUNDER / ISLAND HIGHLIGHTS
  // =========================================================================
  {
    id: 'pkg-4d-cultural',
    category: 'all-rounder',
    categoryName: 'All-Rounder',
    title: '4-Day Cultural Highlights Tour',
    days: 4,
    image: 'assets/images/sigiriya.jpg',
    baseRate: 260, // $65/day x 4
    fullRate: 580,
    route: 'Negombo → Sigiriya → Dambulla → Kandy → Colombo',
    highlights: [
      'Sigiriya Lion Rock Fortress climb at sunrise',
      'Golden Temple of Dambulla cave murals',
      'Sacred Temple of the Tooth Relic in Kandy',
      'Pinnawala Elephant Sanctuary & Ceylon Tea Estate'
    ],
    itinerary: [
      { day: 1, title: 'Airport Pickup → Negombo Sightseeing → Drive to Sigiriya', details: 'VIP pickup at Bandaranaike International Airport (CMB). Short city tour of Negombo colonial canals & fishing harbor, followed by a scenic drive through tropical coconut plantations to Sigiriya.' },
      { day: 2, title: 'Sigiriya Rock Fortress Climb → Dambulla Cave Temple → Kandy', details: 'Early morning climb of the UNESCO World Heritage Sigiriya Rock Fortress. Afternoon visit to the historic Dambulla Cave Temple complex. Evening drive to royal Kandy.' },
      { day: 3, title: 'Kandy City Tour (Temple of Tooth & Botanical Gardens) → Tea Plantation', details: 'Visit the sacred Temple of the Tooth Relic, stroll through the lush Peradeniya Royal Botanical Gardens, and tour a working high-altitude Ceylon tea factory with tasting.' },
      { day: 4, title: 'Kandy → Pinnawala Elephant Sanctuary → Colombo City Tour → Airport Drop-off', details: 'Witness bathing elephants at Pinnawala, drive to the commercial capital Colombo for landmark sightseeing and shopping, followed by expressway transfer to airport.' }
    ]
  },
  {
    id: 'pkg-7d-heritage',
    category: 'all-rounder',
    categoryName: 'All-Rounder',
    title: '7-Day Heritage & Hill Country Classic',
    days: 7,
    image: 'assets/images/hero.jpg',
    baseRate: 455, // $65/day x 7
    fullRate: 980,
    route: 'Negombo → Dambulla → Sigiriya → Polonnaruwa → Kandy → Ella → Colombo',
    highlights: [
      'Sigiriya Rock Fortress & Polonnaruwa ancient kingdom',
      'Minneriya elephant gathering 4x4 safari',
      'World-famous scenic blue train ride from Kandy to Ella',
      'Nine Arches Bridge & Little Adam\'s Peak hike'
    ],
    itinerary: [
      { day: 1, title: 'Airport Pickup → Negombo Beach Rest', details: 'Warm airport welcome by your private chauffeur. Check in to your Negombo beachside resort to unwind from your flight.' },
      { day: 2, title: 'Negombo → Dambulla Cave Temple → Sigiriya Rock Fortress', details: 'Journey into the cultural triangle. Explore ancient cave shrines in Dambulla and take in sunset views around Sigiriya.' },
      { day: 3, title: 'Polonnaruwa Ancient City → Minneriya Elephant Safari', details: 'Cycle or walk through the 12th-century ruins of Polonnaruwa. Afternoon thrilling 4x4 jeep safari in Minneriya National Park.' },
      { day: 4, title: 'Sigiriya → Matale Spice Garden → Kandy (Temple of Tooth & Dance Show)', details: 'Discover aromatic spices in Matale. Arrive in Kandy for the evening Cultural Dance Show and the sacred Temple of the Tooth ceremony.' },
      { day: 5, title: 'Kandy → Tea Factory → Scenic Train Ride to Ella', details: 'Visit lush tea hills of Nuwara Eliya. Board the iconic scenic blue train journey winding through cloud forests and emerald valleys to Ella.' },
      { day: 6, title: 'Nine Arches Bridge → Little Adam’s Peak → Ravana Waterfalls', details: 'Photograph trains crossing the colonial Nine Arches Bridge, hike Little Adam\'s Peak for 360-degree panoramas, and refresh at Ravana Falls.' },
      { day: 7, title: 'Ella → Southern Expressway → Colombo / Airport Drop-off', details: 'Descend the mountains and travel smoothly via the southern expressway to Colombo or direct to CMB airport for departure.' }
    ]
  },
  {
    id: 'pkg-10d-complete',
    category: 'all-rounder',
    categoryName: 'All-Rounder',
    title: '10-Day Complete Island Highlights',
    days: 10,
    image: 'assets/images/beach.jpg',
    baseRate: 650, // $65/day x 10
    fullRate: 1450,
    route: 'Anuradhapura → Sigiriya → Kandy → Nuwara Eliya → Ella → Yala → Mirissa → Galle',
    highlights: [
      'Comprehensive loop covering UNESCO heritage, mountains, safari & beaches',
      'Yala National Park leopard & wildlife safari',
      'Tea country waterfalls & scenic Ella train',
      'Galle Dutch Fort UNESCO walk & Mirissa beach relaxation'
    ],
    itinerary: [
      { day: 1, title: 'Airport Pickup → Negombo Relaxation', details: 'Welcome to Sri Lanka! Relax at your coastal hotel and enjoy a fresh seafood dinner.' },
      { day: 2, title: 'Negombo → Anuradhapura Sacred City → Sigiriya', details: 'Explore Sri Lanka\'s oldest ancient capital, home to giant stupas and the sacred Bodhi tree, then drive to Sigiriya.' },
      { day: 3, title: 'Sigiriya Rock Fortress → Hiriwadunna Village Tour → Minneriya Safari', details: 'Climb Sigiriya at dawn, experience authentic village life with catamaran boat ride, and embark on an afternoon elephant safari.' },
      { day: 4, title: 'Sigiriya → Dambulla Caves → Matale → Kandy', details: 'Visit Dambulla cave murals, learn about herbal remedies in Matale, and arrive in the hill capital Kandy.' },
      { day: 5, title: 'Kandy → Nuwara Eliya (Tea Gardens, Ramboda Falls & Gregory Lake)', details: 'Ascend into \'Little England\' through misty tea plantations, visit Ramboda Falls, and stroll around Gregory Lake.' },
      { day: 6, title: 'Scenic Train Ride to Ella → Nine Arches Bridge', details: 'Experience the world-renowned mountain railway journey. Explore the charming mountain town of Ella and Nine Arches viaduct.' },
      { day: 7, title: 'Ella Trekking → Udawalawe / Yala Safari', details: 'Hike Little Adam\'s Peak in the morning. Transfer to Yala / Udawalawe for a thrilling late-afternoon wildlife safari.' },
      { day: 8, title: 'Yala → Mirissa / Weligama Beach Relax', details: 'Morning coastal drive to the southern golden sands of Mirissa and Weligama. Sunset cocktails by the Indian Ocean.' },
      { day: 9, title: 'Galle Dutch Fort → Turtle Hatchery → Bentota', details: 'Walk the cobblestone streets and bastions of 17th-century Galle Fort. Visit a sea turtle conservation project.' },
      { day: 10, title: 'Bentota Water Sports → Colombo Sightseeing → Airport Drop-off', details: 'Enjoy Madu River boat safari or water sports in Bentota, brief city tour in Colombo, and timely transfer to the airport.' }
    ]
  },
  {
    id: 'pkg-14d-grand',
    category: 'all-rounder',
    categoryName: 'All-Rounder',
    title: '14-Day Grand Sri Lanka Loop',
    days: 14,
    image: 'assets/images/sigiriya.jpg',
    baseRate: 910, // $65/day x 14
    fullRate: 1980,
    route: 'Negombo → Wilpattu → Anuradhapura → Sigiriya → Polonnaruwa → Kandy → Ella → Yala → Mirissa → Galle',
    highlights: [
      'Wilpattu & Yala dual national parks for maximum wildlife sightings',
      'Full Cultural Triangle exploration (Anuradhapura, Polonnaruwa, Sigiriya, Dambulla)',
      'Tea trails, world-famous train journey & hill retreats',
      'Southern coastal living in Mirissa, Galle Fort, and Bentota'
    ],
    itinerary: [
      { day: 1, title: 'Airport Pickup → Negombo Rest', details: 'Arrival and transfer to Negombo. Leisure day to rest after long flights.' },
      { day: 2, title: 'Negombo → Wilpattu Safari → Anuradhapura', details: 'Early morning safari in Wilpattu National Park searching for leopards and sloth bears, continuing to Anuradhapura.' },
      { day: 3, title: 'Anuradhapura Sightseeing → Habarana/Sigiriya', details: 'Full morning touring ancient monasteries and monumental dagobas. Afternoon drive to Habarana.' },
      { day: 4, title: 'Sigiriya Rock Fortress → Hiriwadunna Village Tour', details: 'Ascend Sigiriya fortress in comfortable morning hours, followed by traditional Sri Lankan village lunch and ox-cart ride.' },
      { day: 5, title: 'Polonnaruwa Ancient Ruins → Minneriya Elephant Safari', details: 'Marvel at the Gal Vihara stone statues in Polonnaruwa, followed by massive wild elephant gathering in Minneriya.' },
      { day: 6, title: 'Dambulla Cave Temple → Spice Garden → Kandy', details: 'Discover ancient rock monastery at Dambulla, explore Matale spice trail, arrive in royal Kandy.' },
      { day: 7, title: 'Kandy City Tour (Temple of Tooth & Botanical Gardens)', details: 'Peradeniya botanical gardens, Temple of the Tooth, and scenic viewpoints over Kandy lake.' },
      { day: 8, title: 'Kandy → Tea Factory → Nuwara Eliya', details: 'Drive past tumbling waterfalls into the cool highlands. Tour an active tea processing estate.' },
      { day: 9, title: 'Scenic Train Ride to Ella → Nine Arches Bridge', details: 'Board the picturesque train winding through pine forests and tea estates into relaxed Ella.' },
      { day: 10, title: 'Little Adam’s Peak → Ravana Falls → Ella', details: 'Morning ridge hike to Little Adam\'s Peak, visit Ravana cave & waterfall.' },
      { day: 11, title: 'Ella → Yala Evening Safari', details: 'Descend to the dry zone scrub jungles of Yala. Evening 4x4 safari looking for leopards.' },
      { day: 12, title: 'Yala → Mirissa Beach Relax', details: 'Scenic transfer along the southern coastline to Mirissa. Relax on tropical sands.' },
      { day: 13, title: 'Mirissa → Galle Dutch Fort → Bentota', details: 'Explore UNESCO heritage Galle Fort, boutique shopping, and transfer to Bentota.' },
      { day: 14, title: 'Bentota → Colombo City Tour → Airport Drop-off', details: 'River boat excursion, Colombo colonial architecture & shopping, and transfer to CMB airport.' }
    ]
  },
  {
    id: 'pkg-21d-ultimate',
    category: 'all-rounder',
    categoryName: 'All-Rounder',
    title: '21-Day Ultimate Sri Lanka Experience',
    days: 21,
    image: 'assets/images/hero.jpg',
    baseRate: 1365, // $65/day x 21
    fullRate: 2950,
    route: 'Full Island: North (Jaffna), East (Trinco), Cultural Triangle, Central Highlands, Deep South & West Coast',
    highlights: [
      'Rarely explored Jaffna Peninsula, Delft Island & Nallur Kovil',
      'Pigeon Island marine snorkeling & east coast white sand beaches',
      'Knuckles mountain range trekking & Horton Plains World\'s End',
      'Yala & Wilpattu safaris, tea estates & southern coastal charm'
    ],
    itinerary: [
      { day: 1, title: 'Airport Pickup → Negombo', details: 'Warm welcome and check-in to your beachfront hotel.' },
      { day: 2, title: 'Negombo → Wilpattu Safari → Anuradhapura', details: 'Safari in Sri Lanka\'s largest park, transfer to the ancient royal capital.' },
      { day: 3, title: 'Anuradhapura Historical Exploration', details: 'Full day devoted to ancient wonders: Ruwanwelisaya, Jetavanaramaya, and Sri Maha Bodhi.' },
      { day: 4, title: 'Anuradhapura → Jaffna Drive', details: 'Scenic journey north crossing Elephant Pass into the unique Tamil cultural heartland of Jaffna.' },
      { day: 5, title: 'Jaffna Sightseeing (Nallur Kovil, Jaffna Fort)', details: 'Golden Nallur Kandaswamy Kovil, Dutch Fort, and tasting authentic Jaffna crab curry.' },
      { day: 6, title: 'Boat Excursion to Delft Island & Keerimalai', details: 'Ferry to historic Delft Island with wild ponies and baobab trees, healing springs of Keerimalai.' },
      { day: 7, title: 'Jaffna → Trincomalee (Nilaveli Beach & Koneswaram)', details: 'Drive to the east coast. Visit cliff-top Koneswaram Temple overlooking the deep blue bay.' },
      { day: 8, title: 'Pigeon Island Snorkeling & Marine Park', details: 'Boat trip to Pigeon Island for world-class coral reef snorkeling with turtles and blacktip reef sharks.' },
      { day: 9, title: 'Trincomalee → Sigiriya Climb', details: 'Head inland to climb the iconic 5th-century Sigiriya citadel.' },
      { day: 10, title: 'Polonnaruwa Ruins → Kaudulla Elephant Safari', details: 'Medieval palaces of Polonnaruwa and sunset elephant safari at Kaudulla reservoir.' },
      { day: 11, title: 'Dambulla Caves → Spice Garden → Kandy', details: 'Visit gold-gilded cave temples and travel south to spiritual Kandy.' },
      { day: 12, title: 'Kandy Exploration & Local Markets', details: 'Temple of the Tooth, royal arts center, and artisan markets.' },
      { day: 13, title: 'Knuckles Mountain Range / Riverston Day Trek', details: 'Full-day guided hike through UNESCO Knuckles wilderness, waterfalls, and cloud forests.' },
      { day: 14, title: 'Kandy → Nuwara Eliya Tea Estates', details: 'Climb into tea-covered peaks, visit tea factory and colonial hill club.' },
      { day: 15, title: 'Horton Plains Trekking (World’s End)', details: 'Dawn trek through misty plains to the dramatic 880m World\'s End precipice and Baker\'s Falls.' },
      { day: 16, title: 'Scenic Train Ride to Ella → Nine Arches Bridge', details: 'Iconic train journey with open doorways and breathtaking mountain vistas.' },
      { day: 17, title: 'Little Adam\'s Peak & Flying Ravana Zipline', details: 'Adventure day in Ella with peaks, waterfalls, and optional zipline thrill.' },
      { day: 18, title: 'Ella → Udawalawe Transit Home → Yala', details: 'Visit baby elephant rehabilitation at Udawalawe Transit Home, arrive at Yala safari boundary.' },
      { day: 19, title: 'Full Day Yala Wildlife Safari', details: 'Dawn to dusk deep safari in Yala National Park for leopards, bears, elephants, and crocodiles.' },
      { day: 20, title: 'Yala → Tangalle Beach → Galle Fort', details: 'Pass coastal Tangalle bays to the UNESCO living fortress of Galle.' },
      { day: 21, title: 'Galle → Colombo Shopping → Airport Drop-off', details: 'Expressway to Colombo for luxury shopping and farewell dinner before airport departure.' }
    ]
  },

  // =========================================================================
  // CATEGORY 2: WILDLIFE & NATURE EXPLORER
  // =========================================================================
  {
    id: 'pkg-4d-wildlife',
    category: 'wildlife',
    categoryName: 'Wildlife & Nature',
    title: '4-Day Wild Safari Express',
    days: 4,
    image: 'assets/images/wildlife.jpg',
    baseRate: 260,
    fullRate: 620,
    route: 'Airport → Pinnawala → Habarana → Minneriya/Kaudulla → Kandy → Airport',
    highlights: [
      'Pinnawala elephant herd bathing',
      'Minneriya / Kaudulla elephant safari',
      'Sigiriya Lion Rock sunrise climb',
      'Udawatta Kele birdwatching & rainforest sanctuary'
    ],
    itinerary: [
      { day: 1, title: 'Airport Pickup → Pinnawala Elephant Orphanage → Habarana', details: 'Pickup from CMB and drive directly to Pinnawala to watch herds bathing in the river. Afternoon drive to Habarana eco-lodge.' },
      { day: 2, title: 'Minneriya / Kaudulla Elephant Safari → Sigiriya Rock Climb', details: 'Early morning climb of Sigiriya Rock Fortress. Afternoon open-top 4x4 safari witnessing massive elephant gatherings.' },
      { day: 3, title: 'Habarana → Kandy (Udawatta Kele Sanctuary & Temple of Tooth)', details: 'Drive to Kandy. Guided nature trek in Udawatta Kele historic rainforest sanctuary, home to rare endemic birds and primates. Evening Temple of Tooth visit.' },
      { day: 4, title: 'Kandy → Royal Botanical Gardens → Colombo / Airport Drop-off', details: 'Explore the 147-acre Peradeniya Royal Botanical Gardens featuring orchids and giant palm avenues, followed by airport drop-off.' }
    ]
  },
  {
    id: 'pkg-7d-wildlife',
    category: 'wildlife',
    categoryName: 'Wildlife & Nature',
    title: '7-Day Wild & National Parks Safari',
    days: 7,
    image: 'assets/images/wildlife.jpg',
    baseRate: 455,
    fullRate: 1100,
    route: 'Wilpattu → Minneriya → Kandy → Horton Plains → Udawalawe → Yala → Mirissa',
    highlights: [
      'Wilpattu leopard & sloth bear tracking',
      'Minneriya large elephant gatherings',
      'Horton Plains cloud forest & endemic highland wildlife',
      'Udawalawe & Yala consecutive premier national parks'
    ],
    itinerary: [
      { day: 1, title: 'Airport Pickup → Wilpattu National Park Safari', details: 'Direct transfer to Wilpattu wilderness. Afternoon game drive among natural water basins (villus) tracking leopards.' },
      { day: 2, title: 'Wilpattu → Sigiriya → Minneriya Elephant Safari', details: 'Morning drive to Sigiriya citadel, followed by sunset safari at Minneriya National Park.' },
      { day: 3, title: 'Sigiriya → Dambulla Caves → Kandy', details: 'Dambulla cave exploration and scenic drive into the hill country capital of Kandy.' },
      { day: 4, title: 'Kandy → Nuwara Eliya → Horton Plains Trekking', details: 'Travel to the central highlands. Trek the UNESCO Horton Plains National Park observing sambar deer and endemic bird species.' },
      { day: 5, title: 'Nuwara Eliya → Udawalawe Elephant Safari', details: 'Descend to the dry southern plains for a safari in Udawalawe, famous for its unmatched elephant population.' },
      { day: 6, title: 'Udawalawe → Yala Leopard Safari', details: 'Full afternoon safari in Block 1 of Yala National Park, holding the world\'s highest density of leopards.' },
      { day: 7, title: 'Yala → Mirissa Coast → Airport Drop-off', details: 'Drive along the southern coast with a brief stop at Mirissa beach, connecting to the southern expressway to CMB airport.' }
    ]
  },
  {
    id: 'pkg-10d-wildlife',
    category: 'wildlife',
    categoryName: 'Wildlife & Nature',
    title: '10-Day Ultimate Wildlife Expedition',
    days: 10,
    image: 'assets/images/wildlife.jpg',
    baseRate: 650,
    fullRate: 1650,
    route: 'Wilpattu → Anuradhapura → Minneriya → Knuckles → Nuwara Eliya → Ella → Udawalawe → Yala → Mirissa',
    highlights: [
      '5 top national parks & reserves covered comprehensively',
      'Knuckles Conservation Forest biodiversity trek',
      'Horton Plains World\'s End cloud forest walk',
      'Marine turtle spotting & dolphin/whale options in Mirissa'
    ],
    itinerary: [
      { day: 1, title: 'Airport Pickup → Negombo Rest', details: 'Check-in to your hotel, briefing by your wildlife chauffeur guide, and rest.' },
      { day: 2, title: 'Negombo → Wilpattu Full Day Safari', details: 'Full-day deep jungle game drive in Wilpattu with packed breakfast and picnic lunch by a scenic villu.' },
      { day: 3, title: 'Wilpattu → Anuradhapura → Habarana', details: 'Cultural transition via Anuradhapura to the wildlife hub of Habarana.' },
      { day: 4, title: 'Minneriya / Eco Park Safari → Sigiriya Rock', details: 'Sigiriya morning climb followed by afternoon safari tracking elephant herds in Eco Park.' },
      { day: 5, title: 'Habarana → Knuckles Conservation Trekking → Kandy', details: 'Trek the biodiverse Knuckles mountains discovering endemic lizards, birds, and cascading streams.' },
      { day: 6, title: 'Kandy → Nuwara Eliya Tea Country', details: 'Ascend into cool misty tea hills with visits to Ramboda and tea estates.' },
      { day: 7, title: 'Horton Plains Trek → Train to Ella', details: 'Trek Horton Plains to World\'s End, then board the mountain train to Ella.' },
      { day: 8, title: 'Ella → Udawalawe Safari', details: 'Descend to Udawalawe for an afternoon 4x4 safari with hundreds of wild elephants.' },
      { day: 9, title: 'Udawalawe → Yala Full Day Safari', details: 'Full-day safari across Yala National Park focusing on leopards, sloth bears, and birdlife.' },
      { day: 10, title: 'Yala → Mirissa Turtle Spotting → Airport Drop-off', details: 'Visit sea turtle conservation sanctuaries along the coast, then expressway transfer to airport.' }
    ]
  },

  // =========================================================================
  // CATEGORY 3: BEACH & COASTAL ESCAPE
  // =========================================================================
  {
    id: 'pkg-4d-beach',
    category: 'beach',
    categoryName: 'Beach & Coastal',
    title: '4-Day South Coast Sun & Fun',
    days: 4,
    image: 'assets/images/beach.jpg',
    baseRate: 260,
    fullRate: 550,
    route: 'Bentota → Kosgoda → Galle Fort → Mirissa → Airport',
    highlights: [
      'Bentota water sports & Madu Ganga river boat safari',
      'Kosgoda Sea Turtle Hatchery & conservation project',
      'Historic Galle Dutch Fort sunset walk & boutique dining',
      'Mirissa Coconut Tree Hill & whale watching excursion'
    ],
    itinerary: [
      { day: 1, title: 'Airport Pickup → Bentota Water Sports & River Safari', details: 'Scenic expressway drive to golden Bentota beach. Jet ski, banana boat, or relax on a tranquil mangrove river boat safari.' },
      { day: 2, title: 'Bentota → Kosgoda Turtle Hatchery → Galle Dutch Fort', details: 'Release baby turtles at Kosgoda, then explore the charming colonial streets, ramparts, and lighthouse of UNESCO Galle Fort.' },
      { day: 3, title: 'Galle → Mirissa (Coconut Tree Hill & Beach Relax)', details: 'Drive to Mirissa. Photograph the famous Coconut Tree Hill promontory, relax on crescent beaches, and enjoy beachfront dining.' },
      { day: 4, title: 'Mirissa Whale Watching → Airport Drop-off', details: 'Early morning catamaran cruise to spot blue whales (seasonal). Smooth southern expressway transfer back to CMB airport.' }
    ]
  },
  {
    id: 'pkg-7d-beach',
    category: 'beach',
    categoryName: 'Beach & Coastal',
    title: '7-Day Complete Coastal Explorer',
    days: 7,
    image: 'assets/images/beach.jpg',
    baseRate: 455,
    fullRate: 950,
    route: 'Kalutara → Bentota → Hikkaduwa → Galle → Unawatuna → Mirissa → Hiriketiya → Tangalle',
    highlights: [
      'Snorkeling the coral reefs of Hikkaduwa',
      'Surfing lessons in trendy Hiriketiya horseshoe bay',
      'Secluded luxury beaches of Tangalle',
      'Galle Fort history & Unawatuna nightlife'
    ],
    itinerary: [
      { day: 1, title: 'Airport Pickup → Kalutara / Wadduwa Beach Relax', details: 'Arrive in Sri Lanka and settle into your luxury coastal resort with views over the Indian Ocean.' },
      { day: 2, title: 'Kalutara → Bentota Water Sports & Boat Safari', details: 'Speedboat rides, water skiing on the lagoon, and soothing mangrove boat excursions.' },
      { day: 3, title: 'Bentota → Hikkaduwa Coral Reef Snorkeling → Galle Fort', details: 'Snorkel among giant sea turtles in Hikkaduwa marine sanctuary, then wander the bastions of Galle Fort.' },
      { day: 4, title: 'Galle → Unawatuna & Jungle Beach', details: 'Swim in the calm turquoise bay of Unawatuna and take a secluded trail to Jungle Beach.' },
      { day: 5, title: 'Unawatuna → Mirissa Beach Sunset', details: 'Head to Mirissa for sunset cocktails, beachfront dining, and live acoustic music.' },
      { day: 6, title: 'Mirissa → Hiriketiya Surfing Bay → Tangalle', details: 'Catch waves or relax at bohemian Hiriketiya bay, then retreat to the quiet paradise of Tangalle.' },
      { day: 7, title: 'Tangalle → Expressway to Airport Drop-off', details: 'Enjoy a leisurely morning swim before a swift, air-conditioned transfer via expressway to CMB airport.' }
    ]
  },
  {
    id: 'pkg-10d-beach',
    category: 'beach',
    categoryName: 'Beach & Coastal',
    title: '10-Day East-to-South Tropical Beach Loop',
    days: 10,
    image: 'assets/images/beach.jpg',
    baseRate: 650,
    fullRate: 1390,
    route: 'Trincomalee → Nilaveli → Pasikudah → Arugam Bay → Tangalle → Mirissa → Galle',
    highlights: [
      'Both East Coast (Trincomalee, Pasikudah, Arugam Bay) & South Coast beaches',
      'World-famous surf breaks of Arugam Bay & Hiriketiya',
      'Pigeon Island marine national park snorkeling',
      'Calm shallow coral waters of Pasikudah Bay'
    ],
    itinerary: [
      { day: 1, title: 'Airport Pickup → Negombo Beach Rest', details: 'Rest and recuperate at a relaxing beach resort after your flight.' },
      { day: 2, title: 'Negombo → Trincomalee (East Coast)', details: 'Cross scenic island landscapes to the pristine northeast coast of Trincomalee.' },
      { day: 3, title: 'Trincomalee (Nilaveli Beach & Pigeon Island Snorkeling)', details: 'Pristine white sands of Nilaveli and snorkeling with vibrant reef fish at Pigeon Island.' },
      { day: 4, title: 'Trincomalee → Pasikudah Bay', details: 'Drive south to Pasikudah, famous for one of the longest shallow coral reef coastlines in the world.' },
      { day: 5, title: 'Pasikudah Beach Relax & Water Activities', details: 'Walk hundreds of meters out into the calm, warm sea; windsurfing and stand-up paddleboarding.' },
      { day: 6, title: 'Pasikudah → Arugam Bay Surfing Hub', details: 'Arrive at Sri Lanka\'s premier surf capital. Chill at laid-back beach cafes.' },
      { day: 7, title: 'Arugam Bay Surf & Lagoon Safari', details: 'Morning surf session (beginners to advanced) and tranquil afternoon lagoon safari spotting wild elephants.' },
      { day: 8, title: 'Arugam Bay → Tangalle & Hiriketiya', details: 'Drive along the southern crescent to the emerald surfing cove of Hiriketiya and Tangalle.' },
      { day: 9, title: 'Tangalle → Mirissa & Galle Dutch Fort', details: 'Visit Coconut Tree Hill, Mirissa beach, and sunset on the ramparts of Galle Fort.' },
      { day: 10, title: 'Galle Fort → Colombo Shopping → Airport Drop-off', details: 'Souvenir shopping for Ceylon tea, spices, and gems in Colombo, then direct airport transfer.' }
    ]
  }
];

// State
let currentCategory = 'all';
let isFullPackagePricing = false;

document.addEventListener('DOMContentLoaded', () => {
  renderPackages();
  initCategoryFilters();
  initPricingToggle();
  initModalListeners();
});

/**
 * Render packages according to current category and pricing mode
 */
function renderPackages() {
  const container = document.getElementById('packages-grid-container');
  if (!container) return;

  const filtered = currentCategory === 'all' 
    ? MASTER_PACKAGES 
    : MASTER_PACKAGES.filter(p => p.category === currentCategory);

  container.innerHTML = filtered.map(pkg => {
    const displayPrice = isFullPackagePricing ? `$${pkg.fullRate}` : `$${pkg.baseRate}`;
    const priceNote = isFullPackagePricing ? 'Full All-Inclusive' : `Base Rate ($65/day × ${pkg.days}d)`;

    return `
      <div class="package-card" data-category="${pkg.category}">
        <div class="package-img-box">
          <img src="${pkg.image}" alt="${pkg.title}" loading="lazy">
          <div class="package-duration-pill">
            <i class="far fa-clock"></i> ${pkg.days} Days / ${pkg.days - 1} Nights
          </div>
          <div class="package-badge-cat">${pkg.categoryName}</div>
        </div>
        <div class="package-body">
          <h3>${pkg.title}</h3>
          <div class="package-route-preview">
            <strong>Route:</strong> ${pkg.route}
          </div>
          <ul class="package-highlights-list">
            ${pkg.highlights.map(h => `<li><i class="fas fa-check-circle"></i> ${h}</li>`).join('')}
          </ul>
          <div class="package-price-box">
            <div>
              <div class="price-label">Starting From</div>
              <div class="price-amount">${displayPrice} <span>USD</span></div>
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
 * Category filter tabs
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
 * Base Rate vs Full Package pricing toggle
 */
function initPricingToggle() {
  const toggle = document.getElementById('pricing-mode-toggle-checkbox');
  if (toggle) {
    toggle.addEventListener('change', (e) => {
      isFullPackagePricing = e.target.checked;
      renderPackages();
    });
  }
}

/**
 * Open Day-by-Day Itinerary Modal
 */
function openItineraryModal(packageId) {
  const pkg = MASTER_PACKAGES.find(p => p.id === packageId);
  if (!pkg) return;

  const modal = document.getElementById('itinerary-modal');
  const titleElem = document.getElementById('modal-pkg-title');
  const bodyElem = document.getElementById('modal-pkg-body');
  const ctaBtn = document.getElementById('modal-pkg-quote-btn');
  const waBtn = document.getElementById('modal-pkg-whatsapp-btn');

  if (titleElem) titleElem.textContent = `${pkg.title} (${pkg.days} Days)`;

  if (bodyElem) {
    bodyElem.innerHTML = `
      <div style="margin-bottom: 24px; padding: 16px; background: var(--bg-sand); border-radius: var(--radius-sm); border-left: 4px solid var(--accent-gold);">
        <p style="font-size: 0.95rem; margin-bottom: 6px;"><strong>Complete Route:</strong> ${pkg.route}</p>
        <p style="font-size: 0.88rem; color: var(--text-muted);">Fuel, Highway Tolls, Parking Fees, and Driver Lodging/Meals are 100% included in all our bookings.</p>
      </div>

      <div class="itinerary-timeline">
        ${pkg.itinerary.map(item => `
          <div class="timeline-step">
            <div class="timeline-dot">${item.day}</div>
            <div class="timeline-title">Day ${item.day}: ${item.title}</div>
            <div class="timeline-desc">${item.details}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  if (ctaBtn) {
    ctaBtn.onclick = () => {
      window.location.href = `booking.html?package=${pkg.id}&duration=${pkg.days}`;
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

/**
 * Close modal
 */
function closeItineraryModal() {
  const modal = document.getElementById('itinerary-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
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

  const closeBtn = document.querySelector('.modal-close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', closeItineraryModal);
  }
}

/**
 * Direct WhatsApp booking for specific package
 */
function bookPackageWhatsApp(packageId) {
  const pkg = MASTER_PACKAGES.find(p => p.id === packageId);
  if (!pkg) return;

  const msg = `Hi Ceylon Chauffeur, I would like to inquire about booking the "${pkg.title}" (${pkg.days} Days). Please provide details and availability.`;
  window.openWhatsApp(msg);
}

// Export functions to window
window.MASTER_PACKAGES = MASTER_PACKAGES;
window.openItineraryModal = openItineraryModal;
window.closeItineraryModal = closeItineraryModal;
window.bookPackageWhatsApp = bookPackageWhatsApp;
