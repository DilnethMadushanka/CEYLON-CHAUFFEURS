/**
 * Ceylon Chauffeur - Premium Internationalization (i18n) Engine
 * Languages: English (en), French (fr), Russian (ru), Chinese (zh), German (de)
 */

const LANGUAGES = {
  en: { label: 'EN', name: 'English', flag: '🇬🇧' },
  fr: { label: 'FR', name: 'Français', flag: '🇫🇷' },
  ru: { label: 'RU', name: 'Русский', flag: '🇷🇺' },
  zh: { label: 'ZH', name: '中文', flag: '🇨🇳' },
  de: { label: 'DE', name: 'Deutsch', flag: '🇩🇪' }
};

const TRANSLATIONS = {
  en: {
    'nav.home': 'Home',
    'nav.packages': 'Tour Packages',
    'nav.fleet': 'Our Fleet',
    'nav.booking': 'Custom Itinerary',
    'nav.reviews': 'Trust & Reviews',
    'nav.cta': 'Get a Custom Quote',
    'nav.whatsapp': 'WhatsApp Concierge',
    'nav.prefs': 'Preferences',
    'nav.currency': 'Currency',
    'nav.language': 'Language',

    'hero.badge': 'Sri Lanka Tourist Board Approved & Verified',
    'hero.title1': 'Explore Sri Lanka in Comfort & Style –',
    'hero.title2': 'Premium Private Chauffeur Services',
    'hero.subtitle': 'Transparent daily rates, professional English-speaking driver-guides, and customized itineraries. Discover ancient kingdoms, lush tea estates, and wild safaris in total relaxation.',
    'hero.btn.whatsapp': 'Book via WhatsApp',
    'hero.btn.packages': 'Explore Tour Packages',
    'hero.feat.fuel': 'Fuel & Highway Tolls Included',
    'hero.feat.lodging': 'Driver Lodging & Food Included',
    'hero.feat.wifi': 'Free High-Speed Onboard Wi-Fi',
    'hero.feat.freedom': 'Unlimited Sightseeing Freedom',

    'quick.vehicle.label': 'Vehicle Class',
    'quick.duration.label': 'Trip Duration',
    'quick.package.label': 'Tour Preference',
    'quick.btn': 'Calculate & Book',
    'quick.custom': 'Custom Route (Tailor-Made)',

    'incl.tag': 'Our Transparency Guarantee',
    'incl.h2': "What's 100% Included in Our Daily Rates",
    'incl.p': 'No unexpected surcharges, no fuel bills, and no driver meal fees. When you book Ceylon Chauffeur, your rate covers every essential travel cost.',
    'incl.fuel.h4': 'All Fuel & Mileage',
    'incl.fuel.p': 'Unlimited mileage for your itinerary with all petrol/diesel completely covered.',
    'incl.tolls.h4': 'Highway Tolls & Parking',
    'incl.tolls.p': 'All expressway charges, airport exit tolls, and tourist parking fees included.',
    'incl.lodging.h4': 'Driver Meals & Lodging',
    'incl.lodging.p': 'You never need to arrange accommodation or meals for your driver. Handled 100% by us.',
    'incl.guide.h4': 'Licensed Driver-Guide',
    'incl.guide.p': 'Government certified, English-speaking, police verified, with comprehensive passenger insurance.',

    'fleet.tag': 'Executive Chauffeur Fleet',
    'fleet.h2': 'Travel in Pristine Luxury & Safety',
    'fleet.subtitle': 'Our immaculate private fleet is maintained to executive standards with full air conditioning, complimentary onboard Wi-Fi, and generous luggage capacity.',
    'fleet.sedan.name': 'Toyota Premio / Prius / Axio',
    'fleet.sedan.subtitle': 'Perfect for couples and solo adventurers seeking whisper-quiet comfort.',
    'fleet.sedan.pax': '1–3 Passengers',
    'fleet.sedan.bags': '2–3 Bags',
    'fleet.van.name': 'Toyota KDH & Nissan E25 Van',
    'fleet.van.subtitle': 'Flat Roof & High Roof configurations for families and group expeditions.',
    'fleet.van.pax': '4–10 Pax (Flat Roof: 4-6 | High Roof: 8-10)',
    'fleet.van.bags': '4–8 Large Bags',
    'fleet.bus.name': 'Toyota Coaster & King Long Coaches',
    'fleet.bus.subtitle': 'Full-size panoramic comfort for large travel parties and delegations.',
    'fleet.bus.pax': '18–35 Pax (Coaster: 18-20 | King Long: 20-35)',
    'fleet.bus.bags': '12–25 Large Bags',
    'fleet.viewall': 'View Complete Fleet Specifications & Capacities',
    'fleet.btn.quote': 'Get Custom Quote',
    'fleet.btn.whatsapp': 'WhatsApp',
    'fleet.page.tag': 'Pristine Executive Vehicles',
    'fleet.page.h1': 'Our Luxury Fleet & Specifications',
    'fleet.page.subtitle': 'Every Ceylon Chauffeur vehicle is late-model, non-smoking, meticulously sanitized, and driven by a licensed English-speaking chauffeur-guide.',
    'fleet.page.btn.avail': 'Check Fleet Availability on WhatsApp',
    'fleet.page.btn.calc': 'Calculate Rental Cost',
    'fleet.compare.tag': 'Quick Comparison',
    'fleet.compare.h2': 'Fleet Specifications at a Glance',
    'fleet.compare.subtitle': 'Select the perfect vehicle for your party size and journey requirements.',
    'fleet.compare.col.cat': 'Vehicle Category',
    'fleet.compare.col.pax': 'Ideal Passenger Count',
    'fleet.compare.col.bags': 'Luggage Capacity',
    'fleet.compare.col.rate': 'Daily Rate (All-Inclusive)',
    'fleet.compare.col.for': 'Best Suited For',
    'fleet.compare.sed.for': 'Solo Travelers & Couples',
    'fleet.compare.kdh4.for': 'Couples & Small Families',
    'fleet.compare.kdh8.for': 'Large Families & Groups',
    'fleet.compare.coaster.for': 'Medium Tour Groups',
    'fleet.compare.king.for': 'Large Tour Groups & Delegations',

    'pkg.tag': 'Master Tour Itineraries',
    'pkg.h2': 'Handcrafted Sri Lanka Journeys',
    'pkg.subtitle': 'Choose from 11 master routes across Culture, Safari Wildlife, and Tropical Coastlines.',
    'pkg.viewall': 'View All 11 Tour Packages',
    'pkg.price.label': 'Chauffeur Base Rate',
    'pkg.price.inclusive': 'All-Inclusive Tour Package',
    'pkg.btn.itinerary': 'Full Itinerary',
    'pkg.btn.book': 'Book Tour',
    'pkg.btn.whatsapp': 'Inquire on WhatsApp',
    'pkg.page.tag': 'Curated Sri Lanka Journeys',
    'pkg.page.h1': 'Master Tour Packages & Day-by-Day Itineraries',
    'pkg.page.subtitle': 'Choose your desired itinerary with your private vehicle and driver-guide. Select between transparent Base Daily Chauffeur Rates (fuel & tolls included) or Full All-Inclusive Packages.',
    'pkg.page.btn.inquire': 'Inquire on WhatsApp',
    'pkg.page.btn.custom': 'Customize Any Route',
    'pkg.filter.all': 'All Packages',
    'pkg.filter.cultural': 'Cultural & Heritage',
    'pkg.filter.wildlife': 'Wildlife & Nature',
    'pkg.filter.beach': 'Coastal & Beach',
    'pkg.filter.scenic': 'Scenic Hill Country',
    'pkg.dur.all': 'All Durations',
    'pkg.dur.short': '1–7 Days',
    'pkg.dur.medium': '8–14 Days',
    'pkg.dur.long': '15+ Days',
    'pkg.day': 'Day',
    'pkg.days': 'Days',
    'pkg.route': 'Route:',
    'pkg.highlights': 'Highlights:',
    'pkg.included': 'Included:',

    'rev.tag': 'Client Testimonials',
    'rev.h2': 'Rated 4.98/5 by International Travelers',
    'rev.subtitle': 'Read genuine reviews from travelers around the globe who experienced Sri Lanka with our private chauffeurs.',
    'rev.viewall': 'Read All Verified Client Reviews & Trust Certifications',
    'rev.page.tag': 'Transparency & Excellence',
    'rev.page.h1': 'Trust Factors & Verified Client Reviews',
    'rev.page.subtitle': 'See why hundreds of international families, couples, and solo travelers trust Ceylon Chauffeur for safe, luxurious, and stress-free touring across Sri Lanka.',
    'rev.page.btn.chat': 'Chat on WhatsApp',
    'rev.page.btn.quote': 'Request Custom Quote',

    'booking.page.tag': 'Tailor-Made Island Tours',
    'booking.page.h1': 'Dynamic Custom Itinerary & Booking Form',
    'booking.page.desc': 'Tell us your dream route or select one of our curated packages. Receive an instant rate estimate, an automated confirmation from bookings@ceylonchauffeur.com, and a direct link to continue on WhatsApp.',
    'booking.s1': '1. Lead Traveler Details',
    'booking.name.label': 'Full Name',
    'booking.name.ph': 'e.g. John Smith',
    'booking.email.label': 'Email Address',
    'booking.email.ph': 'john.smith@example.com',
    'booking.country.label': 'Country of Residence',
    'booking.country.ph': 'e.g. United Kingdom / Germany',
    'booking.phone.label': 'WhatsApp / Phone Number',
    'booking.phone.ph': '+44 7123 456789',
    'booking.s2': '2. Travel Dates & Passenger Count',
    'booking.arrival.label': 'Arrival Date in Sri Lanka',
    'booking.departure.label': 'Departure Date',
    'booking.adults.label': 'Adult Passengers (12+ yrs)',
    'booking.kids.label': 'Children (0–11 yrs)',
    'booking.s3': '3. Select Vehicle Class',
    'booking.s4': '4. Preferred Package or Custom Route',
    'booking.pkg.label': 'Select Master Tour Package or Custom Route',
    'booking.notes.label': 'Custom Route Details / Must-See Places / Special Requests',
    'booking.notes.ph': 'Mention places you want to visit (e.g. Sigiriya, Ella, Yala, Mirissa), hotel names if already booked, or child car seat requirements...',
    'booking.submit': 'Submit Inquiry & Generate Instant Proposal',
    'booking.security': 'Your inquiry will be logged and dispatched to bookings@ceylonchauffeur.com. You will receive an instant on-screen booking receipt and a 1-click WhatsApp concierge transition.',
    'booking.nav.whatsapp': 'WhatsApp Concierge',

    'veh.sedan.name': 'Executive Sedan',
    'veh.sedan.cap': '1–3 Pax, 2–3 Bags',
    'veh.sedan.models': 'Premio, Prius, Axio',
    'veh.van.name': 'Luxury Van',
    'veh.van.cap': '4–10 Pax, 4–8 Bags',
    'veh.van.models': 'Flat Roof (4-6), High Roof (8-10)',
    'veh.bus.name': 'Luxury Bus / Coach',
    'veh.bus.cap': '18–35 Pax, 12–25 Bags',
    'veh.bus.models': 'Coaster (18-20), King Long (20-35)',

    'summary.title': 'Live Rate Estimate',
    'summary.duration': 'Trip Duration:',
    'summary.vehicle': 'Selected Vehicle:',
    'summary.daily': 'Daily Chauffeur Rate:',
    'summary.total.label': 'Estimated Total Chauffeur Rate',
    'summary.incl.title': 'Always 100% Included:',
    'summary.cta.text': 'Need an instant customized response?',
    'summary.cta.btn': 'Chat on WhatsApp Now',

    'footer.about.p': "Ceylon Chauffeurs is Sri Lanka's leading private chauffeur and bespoke tour operator. Transparent daily rates, modern vehicles, and accredited English-speaking driver-guides.",
    'footer.whatsapp.btn': 'WhatsApp Concierge',
    'footer.quote.btn': 'Get Custom Quote',
    'footer.col.tours': 'Master Tours',
    'footer.col.fleet': 'Our Fleet',
    'footer.col.contact': 'Contact & Bookings',
    'footer.inquiries': 'Inquiries & Bookings:',
    'footer.whatsapp.label': 'WhatsApp (24/7 Available):',
    'footer.office': 'Head Office:',
    'footer.location': 'Colombo & Katunayake Airport Hub, Sri Lanka',
    'footer.copyright': '© 2026 Ceylon Chauffeur (ceylonchauffeur.com). All rights reserved. Registered under Sri Lanka Tourism Development Authority (SLTDA).',
    'footer.cancellation': 'Cancellation Policy',
    'footer.terms': 'Booking Terms',
    'footer.email.link': 'Email Us',
    'float.tooltip': 'Chat with Chauffeur Concierge'
  },

  fr: {
    'nav.home': 'Accueil',
    'nav.packages': 'Forfaits Touristiques',
    'nav.fleet': 'Notre Flotte',
    'nav.booking': 'Itinéraire Sur Mesure',
    'nav.reviews': 'Confiance & Avis',
    'nav.cta': 'Demander un Devis',
    'nav.whatsapp': 'Conciergerie WhatsApp',
    'nav.prefs': 'Préférences',
    'nav.currency': 'Devise',
    'nav.language': 'Langue',

    'hero.badge': "Agréé & Vérifié par l'Office du Tourisme du Sri Lanka",
    'hero.title1': 'Explorez le Sri Lanka en Confort & Style –',
    'hero.title2': 'Services Privés de Chauffeur Premium',
    'hero.subtitle': 'Tarifs journaliers transparents, guides-chauffeurs professionnels anglophones et itinéraires personnalisés. Découvrez des royaumes anciens, des plantations de thé et des safaris sauvages.',
    'hero.btn.whatsapp': 'Réserver via WhatsApp',
    'hero.btn.packages': 'Explorer les Forfaits',
    'hero.feat.fuel': 'Carburant & Péages Autoroutiers Inclus',
    'hero.feat.lodging': 'Hébergement & Repas du Chauffeur Inclus',
    'hero.feat.wifi': 'Wi-Fi Haut Débit Gratuit à Bord',
    'hero.feat.freedom': 'Liberté de Visite Illimitée',

    'quick.vehicle.label': 'Classe de Véhicule',
    'quick.duration.label': 'Durée du Voyage',
    'quick.package.label': 'Préférence de Circuit',
    'quick.btn': 'Calculer & Réserver',
    'quick.custom': 'Circuit Personnalisé (Sur Mesure)',

    'incl.tag': 'Notre Garantie de Transparence',
    'incl.h2': 'Ce qui est 100% Inclus dans nos Tarifs Journaliers',
    'incl.p': 'Aucune surfacturation, aucune facture de carburant et aucun frais de repas pour le chauffeur. Votre tarif couvre tous les coûts essentiels de voyage.',
    'incl.fuel.h4': 'Carburant & Kilométrage',
    'incl.fuel.p': 'Kilométrage illimité avec tout le carburant pris en charge.',
    'incl.tolls.h4': 'Péages Autoroutiers & Parking',
    'incl.tolls.p': "Toutes les taxes d'autoroute, péages de sortie d'aéroport et frais de parking inclus.",
    'incl.lodging.h4': 'Repas & Hébergement du Chauffeur',
    'incl.lodging.p': "Vous n'avez jamais besoin d'organiser l'hébergement ou les repas de votre chauffeur. Pris en charge à 100% par nous.",
    'incl.guide.h4': 'Chauffeur-Guide Agréé',
    'incl.guide.p': 'Certifié par le gouvernement, anglophone, vérifié par la police, avec assurance complète des passagers.',

    'fleet.tag': 'Flotte de Chauffeurs Exécutifs',
    'fleet.h2': 'Voyagez en Luxe Immaculé & Sécurité',
    'fleet.subtitle': 'Notre flotte privée est maintenue aux normes exécutives avec climatisation, Wi-Fi gratuit et généreuse capacité bagages.',
    'fleet.sedan.name': 'Toyota Premio / Prius / Axio',
    'fleet.sedan.subtitle': 'Parfait pour les couples et voyageurs solo en quête de confort absolu.',
    'fleet.sedan.pax': '1–3 Passagers',
    'fleet.sedan.bags': '2–3 Bagages',
    'fleet.van.name': 'Toyota KDH & Nissan E25 Van',
    'fleet.van.subtitle': 'Configurations toit plat et toit haut pour les familles et groupes.',
    'fleet.van.pax': '4–10 Pax (Toit Plat: 4-6 | Toit Haut: 8-10)',
    'fleet.van.bags': '4–8 Grands Bagages',
    'fleet.bus.name': 'Toyota Coaster & King Long Coaches',
    'fleet.bus.subtitle': 'Grand confort panoramique pour les grands groupes et délégations.',
    'fleet.bus.pax': '18–35 Pax (Coaster: 18-20 | King Long: 20-35)',
    'fleet.bus.bags': '12–25 Grands Bagages',
    'fleet.viewall': 'Voir les Spécifications Complètes de la Flotte',
    'fleet.btn.quote': 'Demander un Devis',
    'fleet.btn.whatsapp': 'WhatsApp',
    'fleet.page.tag': 'Véhicules Exécutifs de Prestige',
    'fleet.page.h1': 'Notre Flotte de Luxe & Spécifications',
    'fleet.page.subtitle': 'Chaque véhicule est récent, non-fumeur, soigneusement désinfecté et conduit par un chauffeur-guide agréé.',
    'fleet.page.btn.avail': 'Vérifier la Disponibilité sur WhatsApp',
    'fleet.page.btn.calc': 'Calculer le Coût de Location',
    'fleet.compare.tag': 'Comparaison Rapide',
    'fleet.compare.h2': "Spécifications de la Flotte en un Coup d'Œil",
    'fleet.compare.subtitle': 'Sélectionnez le véhicule parfait pour votre groupe.',
    'fleet.compare.col.cat': 'Catégorie de Véhicule',
    'fleet.compare.col.pax': 'Nombre Idéal de Passagers',
    'fleet.compare.col.bags': 'Capacité Bagages',
    'fleet.compare.col.rate': 'Tarif Journalier (Tout Inclus)',
    'fleet.compare.col.for': 'Idéal Pour',
    'fleet.compare.sed.for': 'Voyageurs Solo & Couples',
    'fleet.compare.kdh4.for': 'Couples & Petites Familles',
    'fleet.compare.kdh8.for': 'Grandes Familles & Groupes',
    'fleet.compare.coaster.for': 'Groupes Touristiques Moyens',
    'fleet.compare.king.for': 'Grands Groupes & Délégations',

    'pkg.tag': 'Itinéraires Maîtres',
    'pkg.h2': 'Voyages Artisanaux au Sri Lanka',
    'pkg.subtitle': '11 routes maîtresses à travers la Culture, les Safaris et les Côtes Tropicales.',
    'pkg.viewall': 'Voir les 11 Forfaits Touristiques',
    'pkg.price.label': 'Tarif de Base Chauffeur',
    'pkg.price.inclusive': 'Forfait Circuit Tout Inclus',
    'pkg.btn.itinerary': 'Itinéraire Complet',
    'pkg.btn.book': 'Réserver le Tour',
    'pkg.btn.whatsapp': 'Demander sur WhatsApp',
    'pkg.page.tag': 'Voyages Sélectionnés au Sri Lanka',
    'pkg.page.h1': 'Forfaits Maîtres & Itinéraires Jour par Jour',
    'pkg.page.subtitle': 'Choisissez votre itinéraire avec votre véhicule privé. Tarifs journaliers transparents ou Forfaits Tout Inclus.',
    'pkg.page.btn.inquire': 'Demander sur WhatsApp',
    'pkg.page.btn.custom': 'Personnaliser un Itinéraire',
    'pkg.filter.all': 'Tous les Forfaits',
    'pkg.filter.cultural': 'Culture & Patrimoine',
    'pkg.filter.wildlife': 'Faune & Nature',
    'pkg.filter.beach': 'Plages & Côtes',
    'pkg.filter.scenic': 'Montagnes & Plantations',
    'pkg.dur.all': 'Toutes les Durées',
    'pkg.dur.short': '1–7 Jours',
    'pkg.dur.medium': '8–14 Jours',
    'pkg.dur.long': '15+ Jours',
    'pkg.day': 'Jour',
    'pkg.days': 'Jours',
    'pkg.route': 'Itinéraire :',
    'pkg.highlights': 'Points Forts :',
    'pkg.included': 'Inclus :',

    'rev.tag': 'Témoignages Clients',
    'rev.h2': 'Noté 4,98/5 par des Voyageurs Internationaux',
    'rev.subtitle': 'Lisez les avis authentiques de voyageurs du monde entier qui ont exploré le Sri Lanka avec nos chauffeurs.',
    'rev.viewall': 'Lire Tous les Avis Vérifiés & Certifications',
    'rev.page.tag': 'Transparence & Excellence',
    'rev.page.h1': 'Facteurs de Confiance & Avis Clients Vérifiés',
    'rev.page.subtitle': 'Découvrez pourquoi des centaines de familles font confiance à Ceylon Chauffeur pour des voyages sereins et luxueux.',
    'rev.page.btn.chat': 'Discuter sur WhatsApp',
    'rev.page.btn.quote': 'Demander un Devis',

    'booking.page.tag': 'Circuits Insulaires Sur Mesure',
    'booking.page.h1': 'Formulaire de Réservation & Itinéraire Personnalisé',
    'booking.page.desc': 'Décrivez votre circuit idéal ou choisissez un forfait. Devis immédiat et confirmation automatisée par bookings@ceylonchauffeur.com.',
    'booking.s1': '1. Informations du Voyageur Principal',
    'booking.name.label': 'Nom Complet',
    'booking.name.ph': 'ex. Jean Dupont',
    'booking.email.label': 'Adresse Email',
    'booking.email.ph': 'jean.dupont@exemple.com',
    'booking.country.label': 'Pays de Résidence',
    'booking.country.ph': 'ex. France / Belgique / Suisse',
    'booking.phone.label': 'Numéro WhatsApp / Téléphone',
    'booking.phone.ph': '+33 6 12 34 56 78',
    'booking.s2': '2. Dates de Voyage & Nombre de Passagers',
    'booking.arrival.label': "Date d'Arrivée au Sri Lanka",
    'booking.departure.label': 'Date de Départ',
    'booking.adults.label': 'Passagers Adultes (12+ ans)',
    'booking.kids.label': 'Enfants (0–11 ans)',
    'booking.s3': '3. Sélectionner la Classe de Véhicule',
    'booking.s4': '4. Forfait Préféré ou Circuit Sur Mesure',
    'booking.pkg.label': 'Sélectionner un Forfait ou un Circuit Personnalisé',
    'booking.notes.label': 'Détails du Circuit / Lieux Souhaités / Demandes Spéciales',
    'booking.notes.ph': 'Indiquez les étapes souhaitées (ex. Sigiriya, Ella, Yala, Mirissa), hôtels réservés ou besoins particuliers...',
    'booking.submit': 'Envoyer la Demande & Obtenir le Devis Immédiat',
    'booking.security': 'Votre demande est transmise à bookings@ceylonchauffeur.com. Vous recevrez un reçu instantané à l’écran et une transition directe vers WhatsApp.',
    'booking.nav.whatsapp': 'Conciergerie WhatsApp',

    'veh.sedan.name': 'Berline Exécutive',
    'veh.sedan.cap': '1–3 Pers, 2–3 Bagages',
    'veh.sedan.models': 'Premio, Prius, Axio',
    'veh.van.name': 'Van de Luxe',
    'veh.van.cap': '4–10 Pers, 4–8 Bagages',
    'veh.van.models': 'Toit Plat (4-6), Toit Haut (8-10)',
    'veh.bus.name': 'Bus / Minibus de Luxe',
    'veh.bus.cap': '18–35 Pers, 12–25 Bagages',
    'veh.bus.models': 'Coaster (18-20), King Long (20-35)',

    'summary.title': 'Estimation du Tarif en Direct',
    'summary.duration': 'Durée du Séjour :',
    'summary.vehicle': 'Véhicule Sélectionné :',
    'summary.daily': 'Tarif Journalier Chauffeur :',
    'summary.total.label': 'Tarif Total Estimé du Chauffeur',
    'summary.incl.title': 'Toujours 100% Inclus :',
    'summary.cta.text': 'Besoin d’une réponse sur mesure immédiate ?',
    'summary.cta.btn': 'Discuter sur WhatsApp',

    'footer.about.p': "Ceylon Chauffeurs est le premier opérateur de chauffeurs privés et de circuits sur mesure au Sri Lanka. Tarifs transparents, véhicules récents et guides-chauffeurs accrédités.",
    'footer.whatsapp.btn': 'Conciergerie WhatsApp',
    'footer.quote.btn': 'Demander un Devis',
    'footer.col.tours': 'Circuits Maîtres',
    'footer.col.fleet': 'Notre Flotte',
    'footer.col.contact': 'Contact & Réservations',
    'footer.inquiries': 'Demandes & Réservations :',
    'footer.whatsapp.label': 'WhatsApp (Disponible 24/7) :',
    'footer.office': 'Siège Social :',
    'footer.location': 'Hub Aéroportuaire de Colombo & Katunayake, Sri Lanka',
    'footer.copyright': '© 2026 Ceylon Chauffeur (ceylonchauffeur.com). Tous droits réservés. Enregistré auprès de la SLTDA.',
    'footer.cancellation': 'Politique d’Annulation',
    'footer.terms': 'Conditions de Réservation',
    'footer.email.link': 'Nous Écrire',
    'float.tooltip': 'Discuter avec notre Concierge Chauffeur'
  },

  ru: {
    'nav.home': 'Главная',
    'nav.packages': 'Туристические Пакеты',
    'nav.fleet': 'Наш Автопарк',
    'nav.booking': 'Индивидуальный Маршрут',
    'nav.reviews': 'Отзывы и Гарантии',
    'nav.cta': 'Получить Расчет',
    'nav.whatsapp': 'WhatsApp Консьерж',
    'nav.prefs': 'Настройки',
    'nav.currency': 'Валюта',
    'nav.language': 'Язык',

    'hero.badge': 'Одобрено и Сертифицировано Управлением по Туризму Шри-Ланки',
    'hero.title1': 'Исследуйте Шри-Ланку с Комфортом и Стилем –',
    'hero.title2': 'Премиум Услуги Персонального Водителя',
    'hero.subtitle': 'Прозрачные посуточные тарифы, профессиональные англоговорящие гиды-водители и индивидуальные маршруты. Откройте древние храмы, чайные плантации и дикие сафари в абсолютном комфорте.',
    'hero.btn.whatsapp': 'Забронировать в WhatsApp',
    'hero.btn.packages': 'Смотреть Все Туры',
    'hero.feat.fuel': 'Топливо и Платные Дороги Включены',
    'hero.feat.lodging': 'Проживание и Питание Водителя Включены',
    'hero.feat.wifi': 'Бесплатный Скоростной Wi-Fi в Салоне',
    'hero.feat.freedom': 'Полная Свобода Экскурсионного Маршрута',

    'quick.vehicle.label': 'Класс Автомобиля',
    'quick.duration.label': 'Длительность Поездки',
    'quick.package.label': 'Предпочтение Тура',
    'quick.btn': 'Рассчитать Стоимость',
    'quick.custom': 'Индивидуальный Маршрут (На Заказ)',

    'incl.tag': 'Наша Гарантия Прозрачности',
    'incl.h2': 'Что на 100% Включено в Наши Посуточные Тарифы',
    'incl.p': 'Никаких скрытых доплат, счетов за топливо или расходов на питание водителя. При бронировании Ceylon Chauffeur ваш тариф полностью покрывает все расходы на поездку.',
    'incl.fuel.h4': 'Все Топливо и Пробег',
    'incl.fuel.p': 'Неограниченный километраж по вашему маршруту со всеми расходами на бензин/дизель.',
    'incl.tolls.h4': 'Платные Магистрали и Парковки',
    'incl.tolls.p': 'Все скоростные шоссе, дорожные сборы в аэропорту и туристические парковки включены.',
    'incl.lodging.h4': 'Питание и Ночлег Водителя',
    'incl.lodging.p': 'Вам не нужно заботиться о размещении или питании водителя. Это на 100% наша забота.',
    'incl.guide.h4': 'Лицензированный Гид-Водитель',
    'incl.guide.p': 'Сертифицированный государством, проверен полицией, со страховкой пассажиров.',

    'fleet.tag': 'Премиальный Автопарк',
    'fleet.h2': 'Путешествуйте в Безупречной Роскоши и Безопасности',
    'fleet.subtitle': 'Все автомобили поддерживаются по стандартам премиум-класса с климат-контролем, Wi-Fi и вместительным багажником.',
    'fleet.sedan.name': 'Toyota Premio / Prius / Axio',
    'fleet.sedan.subtitle': 'Идеально для пар и соло-путешественников, ценящих тишину и плавность хода.',
    'fleet.sedan.pax': '1–3 Пассажира',
    'fleet.sedan.bags': '2–3 Чемодана',
    'fleet.van.name': 'Минивэн Toyota KDH и Nissan E25',
    'fleet.van.subtitle': 'Стандартная и высокая крыша для семей и дружеских компаний.',
    'fleet.van.pax': '4–10 Человек (Стандарт: 4-6 | Высокая: 8-10)',
    'fleet.van.bags': '4–8 Больших Чемоданов',
    'fleet.bus.name': 'Автобусы Toyota Coaster и King Long',
    'fleet.bus.subtitle': 'Панорамный комфорт для больших туристических групп и корпоративных делегаций.',
    'fleet.bus.pax': '18–35 Человек (Coaster: 18-20 | King Long: 20-35)',
    'fleet.bus.bags': '12–25 Больших Чемоданов',
    'fleet.viewall': 'Посмотреть Характеристики Всех Автомобилей',
    'fleet.btn.quote': 'Запросить Расчет',
    'fleet.btn.whatsapp': 'WhatsApp',
    'fleet.page.tag': 'Безупречные Автомобили',
    'fleet.page.h1': 'Наш Премиальный Автопарк и Характеристики',
    'fleet.page.subtitle': 'Каждый автомобиль новый, для некурящих, тщательно дезинфицирован и управляется лицензированным гидом-водителем.',
    'fleet.page.btn.avail': 'Проверить Наличие Авто в WhatsApp',
    'fleet.page.btn.calc': 'Рассчитать Аренду Автомобиля',
    'fleet.compare.tag': 'Быстрое Сравнение',
    'fleet.compare.h2': 'Сравнение Автомобилей',
    'fleet.compare.subtitle': 'Выберите идеальный транспорт для вашей поездки.',
    'fleet.compare.col.cat': 'Категория Авто',
    'fleet.compare.col.pax': 'Количество Пассажиров',
    'fleet.compare.col.bags': 'Вместимость Багажа',
    'fleet.compare.col.rate': 'Тариф в День (Все Включено)',
    'fleet.compare.col.for': 'Лучше Всего Для',
    'fleet.compare.sed.for': 'Пар и Соло-Путешественников',
    'fleet.compare.kdh4.for': 'Пар и Небольших Семей',
    'fleet.compare.kdh8.for': 'Больших Семей и Групп',
    'fleet.compare.coaster.for': 'Средних Групп Туристов',
    'fleet.compare.king.for': 'Больших Делегаций и Групп',

    'pkg.tag': 'Авторские Маршруты',
    'pkg.h2': 'Эксклюзивные Туры по Шри-Ланке',
    'pkg.subtitle': 'Выберите один из 11 основных маршрутов: Культурный треугольник, Сафари и Пляжи.',
    'pkg.viewall': 'Смотреть Все 11 Туров',
    'pkg.price.label': 'Базовый Тариф Водителя',
    'pkg.price.inclusive': 'Пакетный Тур "Все Включено"',
    'pkg.btn.itinerary': 'Полный Маршрут',
    'pkg.btn.book': 'Забронировать Тур',
    'pkg.btn.whatsapp': 'Спросить в WhatsApp',
    'pkg.page.tag': 'Кураторские Туры по Шри-Ланке',
    'pkg.page.h1': 'Туристические Пакеты и Подробные Маршруты',
    'pkg.page.subtitle': 'Выберите желаемый маршрут с личным авто и гидом-водителем. Выбирайте прозрачную посуточную аренду авто или туры "Все Включено".',
    'pkg.page.btn.inquire': 'Узнать в WhatsApp',
    'pkg.page.btn.custom': 'Изменить Любой Маршрут',
    'pkg.filter.all': 'Все Туры',
    'pkg.filter.cultural': 'Культура и Наследие',
    'pkg.filter.wildlife': 'Дикая Природа и Сафари',
    'pkg.filter.beach': 'Пляжи и Океан',
    'pkg.filter.scenic': 'Горы и Чайные Плантации',
    'pkg.dur.all': 'Любая Длительность',
    'pkg.dur.short': '1–7 Дней',
    'pkg.dur.medium': '8–14 Дней',
    'pkg.dur.long': '15+ Дней',
    'pkg.day': 'День',
    'pkg.days': 'Дней',
    'pkg.route': 'Маршрут:',
    'pkg.highlights': 'Главное:',
    'pkg.included': 'Включено:',

    'rev.tag': 'Отзывы Гостей',
    'rev.h2': 'Рейтинг 4.98/5 от Туристов со Всего Мира',
    'rev.subtitle': 'Реальные впечатления путешественников, исследовавших остров с нашими гидами-водителями.',
    'rev.viewall': 'Читать Все Проверенные Отзывы',
    'rev.page.tag': 'Прозрачность и Надежность',
    'rev.page.h1': 'Почему Нам Доверяют: Проверенные Отзывы',
    'rev.page.subtitle': 'Узнайте, почему сотни международных туристов доверяют нам свой отдых на Шри-Ланке.',
    'rev.page.btn.chat': 'Написать в WhatsApp',
    'rev.page.btn.quote': 'Запросить Расчет',

    'booking.page.tag': 'Индивидуальные Туры по Острову',
    'booking.page.h1': 'Форма Бронирования и Расчета Маршрута',
    'booking.page.desc': 'Укажите желаемый маршрут или выберите готовый тур. Мгновенный расчет стоимости и автоматическое подтверждение на e-mail и WhatsApp.',
    'booking.s1': '1. Данные Главного Путешественника',
    'booking.name.label': 'Полное Имя',
    'booking.name.ph': 'напр. Александр Иванов',
    'booking.email.label': 'Адрес Электронной Почты',
    'booking.email.ph': 'alex@example.com',
    'booking.country.label': 'Страна Проживания',
    'booking.country.ph': 'напр. Россия / Казахстан / Беларусь',
    'booking.phone.label': 'Номер WhatsApp / Телефон',
    'booking.phone.ph': '+7 999 123-45-67',
    'booking.s2': '2. Даты Поездки и Количество Гостей',
    'booking.arrival.label': 'Дата Прибытия в Шри-Ланку',
    'booking.departure.label': 'Дата Вылета',
    'booking.adults.label': 'Взрослые Пассажиры (12+ лет)',
    'booking.kids.label': 'Дети (0–11 лет)',
    'booking.s3': '3. Выбор Класса Автомобиля',
    'booking.s4': '4. Выбор Тура или Индивидуальный Маршрут',
    'booking.pkg.label': 'Выберите Турпакет или Собственный Маршрут',
    'booking.notes.label': 'Пожелания к Маршруту / Отели / Особые Запросы',
    'booking.notes.ph': 'Укажите города (Сигирия, Элла, Яла, Мирисса), забронированные отели или детские автокресла...',
    'booking.submit': 'Отправить Заявку и Получить Расчет',
    'booking.security': 'Ваша заявка регистрируется и направляется на bookings@ceylonchauffeur.com. Вы сразу увидите квитанцию и сможете продолжить в WhatsApp.',
    'booking.nav.whatsapp': 'WhatsApp Консьерж',

    'veh.sedan.name': 'Премиум Седан',
    'veh.sedan.cap': '1–3 Чел, 2–3 Чемодана',
    'veh.sedan.models': 'Premio, Prius, Axio',
    'veh.van.name': 'Люкс Минивэн',
    'veh.van.cap': '4–10 Чел, 4–8 Чемоданов',
    'veh.van.models': 'Стандарт (4-6), Высокая крыша (8-10)',
    'veh.bus.name': 'Туристический Автобус',
    'veh.bus.cap': '18–35 Чел, 12–25 Чемоданов',
    'veh.bus.models': 'Coaster (18-20), King Long (20-35)',

    'summary.title': 'Расчет Стоимости Онлайн',
    'summary.duration': 'Длительность Тура:',
    'summary.vehicle': 'Выбранный Автомобиль:',
    'summary.daily': 'Тариф за Сутки с Водителем:',
    'summary.total.label': 'Ориентировочная Общая Стоимость',
    'summary.incl.title': 'Всегда на 100% Включено:',
    'summary.cta.text': 'Нужна мгновенная консультация?',
    'summary.cta.btn': 'Написать в WhatsApp Сейчас',

    'footer.about.p': 'Ceylon Chauffeurs – ведущий туроператор с личными водителями на Шри-Ланке. Прозрачные цены, современные автомобили и сертифицированные гиды.',
    'footer.whatsapp.btn': 'WhatsApp Консьерж',
    'footer.quote.btn': 'Запросить Расчет',
    'footer.col.tours': 'Популярные Туры',
    'footer.col.fleet': 'Наш Автопарк',
    'footer.col.contact': 'Контакты и Бронирование',
    'footer.inquiries': 'Запросы и Бронирование:',
    'footer.whatsapp.label': 'WhatsApp (Круглосуточно 24/7):',
    'footer.office': 'Главный Офис:',
    'footer.location': 'Коломбо и Аэропорт Катунаяке, Шри-Ланка',
    'footer.copyright': '© 2026 Ceylon Chauffeur (ceylonchauffeur.com). Все права защищены. Лицензия SLTDA.',
    'footer.cancellation': 'Правила Отмены',
    'footer.terms': 'Условия Бронирования',
    'footer.email.link': 'Написать Нам',
    'float.tooltip': 'Онлайн-консультация в WhatsApp'
  },

  zh: {
    'nav.home': '首页',
    'nav.packages': '经典旅游线路',
    'nav.fleet': '专属车队',
    'nav.booking': '定制行程',
    'nav.reviews': '信誉与好评',
    'nav.cta': '获取专属报价',
    'nav.whatsapp': 'WhatsApp 客服',
    'nav.prefs': '偏好设置',
    'nav.currency': '货币',
    'nav.language': '语言',

    'hero.badge': '斯里兰卡国家旅游局官方认证旅行社',
    'hero.title1': '尊享舒适优雅斯里兰卡之旅 –',
    'hero.title2': '高端私人包车与专属司导服务',
    'hero.subtitle': '透明全包日价，专业持证英文司机向导，量身定制专属行程。在彻底放松的私密旅途中探索千年古国、高山茶园与狂野野生动物猎游。',
    'hero.btn.whatsapp': '通过 WhatsApp 预约',
    'hero.btn.packages': '浏览精品线路',
    'hero.feat.fuel': '全包全程燃油与高速过路费',
    'hero.feat.lodging': '包含司机全程食宿费用',
    'hero.feat.wifi': '全车配备免费高速车载 Wi-Fi',
    'hero.feat.freedom': '行程完全自主随心停靠',

    'quick.vehicle.label': '车辆类型',
    'quick.duration.label': '旅行天数',
    'quick.package.label': '推荐线路',
    'quick.btn': '一键计算并预约',
    'quick.custom': '私人定制专属线路',

    'incl.tag': '我们的零套路透明承诺',
    'incl.h2': '每日车费中 100% 包含的所有费用',
    'incl.p': '绝无隐藏加价，无需自付油费，无需负担司机餐费住宿。选择 Ceylon Chauffeur，每一分花费都明明白白。',
    'incl.fuel.h4': '全程所有燃油与行驶里程',
    'incl.fuel.p': '行程内不限里程，所有汽油/柴油费用全包。',
    'incl.tolls.h4': '高速过路费与停车费',
    'incl.tolls.p': '全岛高速公路收费、机场过桥费及景区停车费均由我们承担。',
    'incl.lodging.h4': '司机向导食宿费',
    'incl.lodging.p': '您无需为司机寻找或支付任何酒店住宿和三餐饮食，全部由我社负责。',
    'incl.guide.h4': '官方认证专业司导',
    'incl.guide.p': '持旅游局认证，流利英语，通过安全背景审查，含全额乘客商业险。',

    'fleet.tag': '高端行政级车队',
    'fleet.h2': '畅享极致奢华与全程安心',
    'fleet.subtitle': '我们的私人车队均达到严格的行政标准，配备全冷气空调、免费高速车载 Wi-Fi 和宽敞行李空间。',
    'fleet.sedan.name': '丰田 Premio / Prius / Axio',
    'fleet.sedan.subtitle': '静谧舒适、平稳省油，情侣与独行探索者的理想座驾。',
    'fleet.sedan.pax': '1–3 位乘客',
    'fleet.sedan.bags': '2–3 件大行李',
    'fleet.van.name': '丰田 KDH / 日产 E25 豪华面包车',
    'fleet.van.subtitle': '平顶与高顶豪华商务车，适合家庭出行与朋友小包团。',
    'fleet.van.pax': '4–10 位乘客 (平顶: 4-6 | 高顶: 8-10)',
    'fleet.van.bags': '4–8 件大行李',
    'fleet.bus.name': '丰田 Coaster / 金龙豪华旅游大巴',
    'fleet.bus.subtitle': '全景超大车窗与豪华舒适座椅，适合中大型团队和商务考察。',
    'fleet.bus.pax': '18–35 位乘客 (考斯特: 18-20 | 金龙: 20-35)',
    'fleet.bus.bags': '12–25 件大行李',
    'fleet.viewall': '查看车队全部详细规格与承载参数',
    'fleet.btn.quote': '获取定制报价',
    'fleet.btn.whatsapp': 'WhatsApp 联系',
    'fleet.page.tag': '高品质尊享车队',
    'fleet.page.h1': '豪华车队与车型规格一览',
    'fleet.page.subtitle': '所有车辆均为近三年准新车、全车无烟、每次出车前严格清洗消毒，并由专业司机向导驾驶。',
    'fleet.page.btn.avail': '在 WhatsApp 上查询档期',
    'fleet.page.btn.calc': '计算租车费用',
    'fleet.compare.tag': '车型快速对比',
    'fleet.compare.h2': '全系车型规格对比表',
    'fleet.compare.subtitle': '根据您的团队人数与行李需求选择最合适的车型。',
    'fleet.compare.col.cat': '车型类别',
    'fleet.compare.col.pax': '建议乘坐人数',
    'fleet.compare.col.bags': '行李箱容量',
    'fleet.compare.col.rate': '全包日费',
    'fleet.compare.col.for': '最适宜人群',
    'fleet.compare.sed.for': '独行旅客与情侣',
    'fleet.compare.kdh4.for': '情侣与核心小家庭',
    'fleet.compare.kdh8.for': '大家庭与亲友团队',
    'fleet.compare.coaster.for': '中型旅行团',
    'fleet.compare.king.for': '大型旅行团与商务考察团',

    'pkg.tag': '精选经典路线',
    'pkg.h2': '匠心打造斯里兰卡深度旅程',
    'pkg.subtitle': '精选 11 条覆盖文化三角洲、国家公园野生动物与南部热带海岸的经典路线。',
    'pkg.viewall': '查看全部 11 个精品套餐',
    'pkg.price.label': '包车基础费',
    'pkg.price.inclusive': '全包旅行套餐',
    'pkg.btn.itinerary': '查看详细行程',
    'pkg.btn.book': '立即预订',
    'pkg.btn.whatsapp': 'WhatsApp 咨询',
    'pkg.page.tag': '精选斯里兰卡旅程',
    'pkg.page.h1': '经典旅游线路与逐日行程规划',
    'pkg.page.subtitle': '自选心仪路线，配备专属专车与司机向导。可自选纯包车日价或全包深度游套餐。',
    'pkg.page.btn.inquire': 'WhatsApp 快速咨询',
    'pkg.page.btn.custom': '定制专属线路',
    'pkg.filter.all': '全部线路',
    'pkg.filter.cultural': '文化与世界遗产',
    'pkg.filter.wildlife': '野性自然与猎游',
    'pkg.filter.beach': '热带海滩度假',
    'pkg.filter.scenic': '高山茶园与风光',
    'pkg.dur.all': '全部天数',
    'pkg.dur.short': '1–7 天',
    'pkg.dur.medium': '8–14 天',
    'pkg.dur.long': '15 天以上',
    'pkg.day': '天',
    'pkg.days': '天',
    'pkg.route': '路线：',
    'pkg.highlights': '行程亮点：',
    'pkg.included': '费用包含：',

    'rev.tag': '真实客人好评',
    'rev.h2': '全球旅客综合评分 4.98 / 5 分',
    'rev.subtitle': '阅读来自世界各地客人在斯里兰卡与我们司导同行的真实旅行体验与评价。',
    'rev.viewall': '阅读所有真实客户评价与认证',
    'rev.page.tag': '公开透明与至臻服务',
    'rev.page.h1': '信任基石与真实客人评价',
    'rev.page.subtitle': '了解为何成百上千的国际家庭与旅行者选择 Ceylon Chauffeur 作为斯里兰卡包车首选。',
    'rev.page.btn.chat': 'WhatsApp 在线咨询',
    'rev.page.btn.quote': '获取定制报价',

    'booking.page.tag': '私人专属定制',
    'booking.page.h1': '动态行程定制与包车预订表单',
    'booking.page.desc': '告诉我们您的梦想行程或选择一条精选线路。即刻获得实时价格估算，并在屏幕上生成预订单，同时直通 WhatsApp 客服。',
    'booking.s1': '1. 领队旅客联系方式',
    'booking.name.label': '您的姓名',
    'booking.name.ph': '如：王先生 / 李女士',
    'booking.email.label': '电子邮箱地址',
    'booking.email.ph': 'name@example.com',
    'booking.country.label': '所在国家 / 地区',
    'booking.country.ph': '如：中国 / 新加坡 / 马来西亚',
    'booking.phone.label': 'WhatsApp / 手机联系电话',
    'booking.phone.ph': '+86 138 0000 0000',
    'booking.s2': '2. 出行日期与团队人数',
    'booking.arrival.label': '抵达斯里兰卡日期',
    'booking.departure.label': '返程离开日期',
    'booking.adults.label': '成人人数 (12岁以上)',
    'booking.kids.label': '儿童人数 (0–11岁)',
    'booking.s3': '3. 选择车型配置',
    'booking.s4': '4. 选择推荐线路或定制行程',
    'booking.pkg.label': '选择经典线路或完全自主定制',
    'booking.notes.label': '定制行程要求 / 必去景点 / 特殊需求',
    'booking.notes.ph': '请写下您想去的城市（如狮子岩、埃拉高山火车、雅拉国家公园、美蕊沙）、已定酒店或儿童安全座椅需求...',
    'booking.submit': '提交需求并生成即时报价单',
    'booking.security': '您的需求将即时抄送至 bookings@ceylonchauffeur.com，您将立即获得屏幕预订回执并可一键转接 WhatsApp。',
    'booking.nav.whatsapp': 'WhatsApp 客服',

    'veh.sedan.name': '行政级轿车',
    'veh.sedan.cap': '1–3 人，2–3 件行李',
    'veh.sedan.models': 'Premio, Prius, Axio',
    'veh.van.name': '豪华商务面包车',
    'veh.van.cap': '4–10 人，4–8 件行李',
    'veh.van.models': '平顶商务 (4-6), 高顶豪华 (8-10)',
    'veh.bus.name': '豪华旅游大巴',
    'veh.bus.cap': '18–35 人，12–25 件行李',
    'veh.bus.models': '丰田考斯特 (18-20), 金龙大巴 (20-35)',

    'summary.title': '实时包车费用估算',
    'summary.duration': '行程天数：',
    'summary.vehicle': '所选车型：',
    'summary.daily': '包车日均费用：',
    'summary.total.label': '预计全程包车总价',
    'summary.incl.title': '费用 100% 包含：',
    'summary.cta.text': '需要即刻沟通个性化行程？',
    'summary.cta.btn': '立即在 WhatsApp 上沟通',

    'footer.about.p': 'Ceylon Chauffeurs 是斯里兰卡知名的高端私人包车与定制旅行社。价格透明无套路、车辆崭新高标准、持证双语司机向导贴心随行。',
    'footer.whatsapp.btn': 'WhatsApp 专属客服',
    'footer.quote.btn': '获取专属报价',
    'footer.col.tours': '经典线路',
    'footer.col.fleet': '专属车队',
    'footer.col.contact': '联系与咨询',
    'footer.inquiries': '咨询与预订邮箱：',
    'footer.whatsapp.label': 'WhatsApp (24小时全天候在线)：',
    'footer.office': '总部办公室：',
    'footer.location': '斯里兰卡科伦坡与班达拉奈克国际机场服务站',
    'footer.copyright': '© 2026 Ceylon Chauffeur (ceylonchauffeur.com). 保留所有权利。斯里兰卡旅游局官方注册。',
    'footer.cancellation': '取消政策',
    'footer.terms': '预订条款',
    'footer.email.link': '邮件联系我们',
    'float.tooltip': '与专属司机客服在线沟通'
  },

  de: {
    'nav.home': 'Startseite',
    'nav.packages': 'Reisepakete',
    'nav.fleet': 'Unsere Flotte',
    'nav.booking': 'Individuelle Route',
    'nav.reviews': 'Bewertungen & Vertrauen',
    'nav.cta': 'Angebot Anfragen',
    'nav.whatsapp': 'WhatsApp-Concierge',
    'nav.prefs': 'Einstellungen',
    'nav.currency': 'Währung',
    'nav.language': 'Sprache',

    'hero.badge': 'Zugelassen & Verifiziert von der Tourismusbehörde Sri Lanka',
    'hero.title1': 'Erkunden Sie Sri Lanka mit Komfort & Stil –',
    'hero.title2': 'Erstklassige Private Chauffeurdienste',
    'hero.subtitle': 'Transparente Tagessätze, professionelle englischsprachige Fahrer-Guides und maßgeschneiderte Reiserouten. Entdecken Sie antike Königreiche, Teegärten und Safaris in völliger Entspannung.',
    'hero.btn.whatsapp': 'Über WhatsApp Buchen',
    'hero.btn.packages': 'Reisepakete Entdecken',
    'hero.feat.fuel': 'Treibstoff & Autobahngebühren Inklusive',
    'hero.feat.lodging': 'Unterkunft & Verpflegung des Fahrers Inklusive',
    'hero.feat.wifi': 'Kostenloses Highspeed-WLAN an Bord',
    'hero.feat.freedom': 'Grenzenlose Freiheit bei Besichtigungen',

    'quick.vehicle.label': 'Fahrzeugklasse',
    'quick.duration.label': 'Reisedauer',
    'quick.package.label': 'Bevorzugte Route',
    'quick.btn': 'Berechnen & Buchen',
    'quick.custom': 'Individuelle Reiseroute (Nach Maß)',

    'incl.tag': 'Unsere Transparenzgarantie',
    'incl.h2': 'Was zu 100% in Unseren Tagessätzen Enthalten Ist',
    'incl.p': 'Keine unerwarteten Zuschläge, keine Tankrechnungen und keine Verpflegungskosten für den Fahrer. Ihr gebuchter Tarif deckt alle wesentlichen Reisekosten vollständig ab.',
    'incl.fuel.h4': 'Gesamter Treibstoff & Kilometer',
    'incl.fuel.p': 'Unbegrenzte Kilometerzahl für Ihre Reiseroute mit komplett abgedecktem Benzin/Diesel.',
    'incl.tolls.h4': 'Autobahngebühren & Parken',
    'incl.tolls.p': 'Alle Mautgebühren, Flughafengebühren und touristischen Parkgebühren sind inbegriffen.',
    'incl.lodging.h4': 'Mahlzeiten & Unterkunft des Fahrers',
    'incl.lodging.p': 'Sie müssen sich nie um die Unterkunft oder Verpflegung Ihres Fahrers kümmern. Wird zu 100% von uns übernommen.',
    'incl.guide.h4': 'Lizenzierter Fahrer-Guide',
    'incl.guide.p': 'Staatlich zertifiziert, englischsprachig, polizeilich überprüft, mit umfassender Fahrgastversicherung.',

    'fleet.tag': 'Exekutive Chauffeurflotte',
    'fleet.h2': 'Reisen Sie in Makellosem Luxus & Sicherheit',
    'fleet.subtitle': 'Unsere private Flotte erfüllt höchste Standards mit Klimaanlage, kostenlosem WLAN und großzügigem Gepäckraum.',
    'fleet.sedan.name': 'Toyota Premio / Prius / Axio',
    'fleet.sedan.subtitle': 'Perfekt für Paare und Alleinreisende, die ruhigen Komfort schätzen.',
    'fleet.sedan.pax': '1–3 Passagiere',
    'fleet.sedan.bags': '2–3 Koffer',
    'fleet.van.name': 'Toyota KDH & Nissan E25 Van',
    'fleet.van.subtitle': 'Flachdach- und Hochdachausführung für Familien und Reisegruppen.',
    'fleet.van.pax': '4–10 Pax (Flachdach: 4-6 | Hochdach: 8-10)',
    'fleet.van.bags': '4–8 Große Koffer',
    'fleet.bus.name': 'Toyota Coaster & King Long Reisebusse',
    'fleet.bus.subtitle': 'Großzügiger Panoramablick für große Reisegruppen und Delegationen.',
    'fleet.bus.pax': '18–35 Pax (Coaster: 18-20 | King Long: 20-35)',
    'fleet.bus.bags': '12–25 Große Koffer',
    'fleet.viewall': 'Vollständige Flottenspezifikationen Anzeigen',
    'fleet.btn.quote': 'Angebot Anfragen',
    'fleet.btn.whatsapp': 'WhatsApp',
    'fleet.page.tag': 'Makellose Exekutivfahrzeuge',
    'fleet.page.h1': 'Unsere Luxusflotte & Spezifikationen',
    'fleet.page.subtitle': 'Jedes Fahrzeug ist neumodisch, rauchfrei, sorgfältig gereinigt und wird von einem lizenzierten englischsprachigen Fahrer-Guide gefahren.',
    'fleet.page.btn.avail': 'Fahrzeugverfügbarkeit auf WhatsApp Prüfen',
    'fleet.page.btn.calc': 'Mietkosten Berechnen',
    'fleet.compare.tag': 'Schnellvergleich',
    'fleet.compare.h2': 'Flottenspezifikationen Auf Einen Blick',
    'fleet.compare.subtitle': 'Wählen Sie das perfekte Fahrzeug für Ihre Gruppengröße und Reiseanforderungen.',
    'fleet.compare.col.cat': 'Fahrzeugkategorie',
    'fleet.compare.col.pax': 'Ideale Passagieranzahl',
    'fleet.compare.col.bags': 'Gepäckkapazität',
    'fleet.compare.col.rate': 'Tagessatz (Alles Inklusive)',
    'fleet.compare.col.for': 'Am Besten Geeignet Für',
    'fleet.compare.sed.for': 'Alleinreisende & Paare',
    'fleet.compare.kdh4.for': 'Paare & Kleine Familien',
    'fleet.compare.kdh8.for': 'Große Familien & Gruppen',
    'fleet.compare.coaster.for': 'Mittlere Reisegruppen',
    'fleet.compare.king.for': 'Große Gruppen & Delegationen',

    'pkg.tag': 'Master-Reiserouten',
    'pkg.h2': 'Handgefertigte Sri Lanka Reisen',
    'pkg.subtitle': 'Wählen Sie aus 11 Hauptrouten durch Kultur, Safariwildnis und tropische Küstenlinien.',
    'pkg.viewall': 'Alle 11 Reisepakete Anzeigen',
    'pkg.price.label': 'Chauffeur-Basistarif',
    'pkg.price.inclusive': 'All-Inclusive Reisepaket',
    'pkg.btn.itinerary': 'Vollständige Route',
    'pkg.btn.book': 'Tour Buchen',
    'pkg.btn.whatsapp': 'Auf WhatsApp Anfragen',
    'pkg.page.tag': 'Kuratierte Sri Lanka Reisen',
    'pkg.page.h1': 'Master-Reisepakete & Tägliche Reiserouten',
    'pkg.page.subtitle': 'Wählen Sie Ihre Wunschroute mit Privatfahrzeug. Transparente Tageschauffeurpreise oder Vollinklusivpakete.',
    'pkg.page.btn.inquire': 'Auf WhatsApp Anfragen',
    'pkg.page.btn.custom': 'Route Individualisieren',
    'pkg.filter.all': 'Alle Reisepakete',
    'pkg.filter.cultural': 'Kultur & Welterbe',
    'pkg.filter.wildlife': 'Tierwelt & Safaris',
    'pkg.filter.beach': 'Küste & Strände',
    'pkg.filter.scenic': 'Malerisches Hochland',
    'pkg.dur.all': 'Alle Reisedauern',
    'pkg.dur.short': '1–7 Tage',
    'pkg.dur.medium': '8–14 Tage',
    'pkg.dur.long': '15+ Tage',
    'pkg.day': 'Tag',
    'pkg.days': 'Tage',
    'pkg.route': 'Reiseroute:',
    'pkg.highlights': 'Höhepunkte:',
    'pkg.included': 'Inbegriffen:',

    'rev.tag': 'Kundenstimmen',
    'rev.h2': 'Von Internationalen Reisenden Mit 4,98/5 Bewertet',
    'rev.subtitle': 'Lesen Sie echte Bewertungen von Reisenden aus aller Welt, die Sri Lanka mit unseren Chauffeuren erlebt haben.',
    'rev.viewall': 'Alle Verifizierten Kundenbewertungen Lesen',
    'rev.page.tag': 'Transparenz & Exzellenz',
    'rev.page.h1': 'Vertrauensfaktoren & Verifizierte Kundenbewertungen',
    'rev.page.subtitle': 'Erfahren Sie, warum Hunderte internationale Familien, Paare und Alleinreisende Ceylon Chauffeur vertrauen.',
    'rev.page.btn.chat': 'Auf WhatsApp Chatten',
    'rev.page.btn.quote': 'Angebot Anfragen',

    'booking.page.tag': 'Maßgeschneiderte Inseltouren',
    'booking.page.h1': 'Dynamisches Individuelles Buchungsformular',
    'booking.page.desc': 'Beschreiben Sie Ihre Traumroute oder wählen Sie ein kuratiertes Paket. Sofortige Kostenschätzung und Bestätigung per E-Mail und WhatsApp.',
    'booking.s1': '1. Hauptreisende Details',
    'booking.name.label': 'Vollständiger Name',
    'booking.name.ph': 'z.B. Max Mustermann',
    'booking.email.label': 'E-Mail-Adresse',
    'booking.email.ph': 'max@beispiel.de',
    'booking.country.label': 'Wohnsitzland',
    'booking.country.ph': 'z.B. Deutschland / Österreich / Schweiz',
    'booking.phone.label': 'WhatsApp / Telefonnummer',
    'booking.phone.ph': '+49 171 123 4567',
    'booking.s2': '2. Reisedaten & Passagieranzahl',
    'booking.arrival.label': 'Ankunftsdatum in Sri Lanka',
    'booking.departure.label': 'Abreisedatum',
    'booking.adults.label': 'Erwachsene Passagiere (12+ Jahre)',
    'booking.kids.label': 'Kinder (0–11 Jahre)',
    'booking.s3': '3. Fahrzeugklasse Wählen',
    'booking.s4': '4. Bevorzugtes Paket oder Individuelle Route',
    'booking.pkg.label': 'Master-Reisepaket oder Individuelle Route Wählen',
    'booking.notes.label': 'Details zur Reiseroute / Pflichtziele / Sonderwünsche',
    'booking.notes.ph': 'Erwähnen Sie Orte, die Sie besuchen möchten (z.B. Sigiriya, Ella, Yala, Mirissa), bereits gebuchte Hotels oder Kindersitze...',
    'booking.submit': 'Anfrage Senden & Sofortangebot Generieren',
    'booking.security': 'Ihre Anfrage wird protokolliert und an bookings@ceylonchauffeur.com gesendet. Sie erhalten sofort eine Buchungsbestätigung auf dem Bildschirm.',
    'booking.nav.whatsapp': 'WhatsApp-Concierge',

    'veh.sedan.name': 'Executive Limousine',
    'veh.sedan.cap': '1–3 Pers., 2–3 Koffer',
    'veh.sedan.models': 'Premio, Prius, Axio',
    'veh.van.name': 'Luxus-Transporter',
    'veh.van.cap': '4–10 Pers., 4–8 Koffer',
    'veh.van.models': 'Flachdach (4-6), Hochdach (8-10)',
    'veh.bus.name': 'Luxus-Bus / Coach',
    'veh.bus.cap': '18–35 Pers., 12–25 Koffer',
    'veh.bus.models': 'Coaster (18-20), King Long (20-35)',

    'summary.title': 'Live-Tarifschätzung',
    'summary.duration': 'Reisedauer:',
    'summary.vehicle': 'Ausgewähltes Fahrzeug:',
    'summary.daily': 'Täglicher Chauffeur-Tarif:',
    'summary.total.label': 'Geschätzter Gesamtchauffeur-Tarif',
    'summary.incl.title': 'Immer 100% Inklusive:',
    'summary.cta.text': 'Sofortige individuelle Antwort benötigt?',
    'summary.cta.btn': 'Jetzt auf WhatsApp Chatten',

    'footer.about.p': 'Ceylon Chauffeurs ist Sri Lankas führender privater Chauffeur und Boutique-Reiseveranstalter. Transparente Tagespreise, moderne Fahrzeuge und akkreditierte Fahrer-Guides.',
    'footer.whatsapp.btn': 'WhatsApp-Concierge',
    'footer.quote.btn': 'Angebot Anfragen',
    'footer.col.tours': 'Master-Touren',
    'footer.col.fleet': 'Unsere Flotte',
    'footer.col.contact': 'Kontakt & Buchungen',
    'footer.inquiries': 'Anfragen & Buchungen:',
    'footer.whatsapp.label': 'WhatsApp (24/7 Verfügbar):',
    'footer.office': 'Hauptbüro:',
    'footer.location': 'Colombo & Katunayake Flughafen-Hub, Sri Lanka',
    'footer.copyright': '© 2026 Ceylon Chauffeur (ceylonchauffeur.com). Alle Rechte vorbehalten. Registriert bei der SLTDA.',
    'footer.cancellation': 'Stornierungsrichtlinien',
    'footer.terms': 'Buchungsbedingungen',
    'footer.email.link': 'E-Mail Senden',
    'float.tooltip': 'Mit Chauffeur-Concierge Chatten'
  }
};

// Current active language
let currentLanguage = localStorage.getItem('ceylon_lang') || 'en';
if (!LANGUAGES[currentLanguage]) currentLanguage = 'en';

/**
 * Translate a key into the target language (or active language)
 */
function t(key, lang = currentLanguage) {
  if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key] !== undefined) {
    return TRANSLATIONS[lang][key];
  }
  if (TRANSLATIONS.en && TRANSLATIONS.en[key] !== undefined) {
    return TRANSLATIONS.en[key];
  }
  return key;
}

/**
 * Set active language, persist to localStorage, update DOM and fire event
 */
function setLanguage(lang) {
  if (!LANGUAGES[lang]) return;
  currentLanguage = lang;
  localStorage.setItem('ceylon_lang', lang);

  applyTranslations(lang);

  // Sync all language dropdowns across desktop and mobile
  document.querySelectorAll('.language-select-box').forEach(select => {
    select.value = lang;
  });

  // Dispatch global event for other scripts (packages.js, booking.js)
  window.dispatchEvent(new CustomEvent('ceylon_language_changed', { detail: { language: lang } }));
}

/**
 * Auto-tag common page elements if they do not yet have data-i18n attributes
 */
function autoTagElements() {
  // 1. Navigation links
  const navMap = [
    { href: 'index.html', key: 'nav.home' },
    { href: 'packages.html', key: 'nav.packages' },
    { href: 'fleet.html', key: 'nav.fleet' },
    { href: 'booking.html', key: 'nav.booking' },
    { href: 'reviews.html', key: 'nav.reviews' }
  ];

  document.querySelectorAll('.nav-menu .nav-link').forEach(link => {
    const href = link.getAttribute('href');
    const match = navMap.find(m => href && href.includes(m.href));
    if (match && !link.hasAttribute('data-i18n')) {
      link.setAttribute('data-i18n', match.key);
    }
  });

  // Nav CTA button
  document.querySelectorAll('.nav-cta a.btn').forEach(btn => {
    if (!btn.hasAttribute('data-i18n')) {
      btn.setAttribute('data-i18n', 'nav.cta');
      btn.setAttribute('data-i18n-icon', 'fas fa-calendar-check');
    }
  });

  // 2. Hero Section Elements
  const heroBadge = document.querySelector('.hero-badge');
  if (heroBadge && !heroBadge.hasAttribute('data-i18n')) {
    heroBadge.setAttribute('data-i18n', 'hero.badge');
    heroBadge.setAttribute('data-i18n-icon', 'fas fa-certificate');
  }

  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle && !heroTitle.hasAttribute('data-i18n-tagged')) {
    heroTitle.setAttribute('data-i18n-tagged', 'true');
    // Wrap main title and span if exists
    const span = heroTitle.querySelector('span');
    if (span) {
      span.setAttribute('data-i18n', 'hero.title2');
    }
  }

  const heroSubtitle = document.querySelector('.hero-subtitle');
  if (heroSubtitle && !heroSubtitle.hasAttribute('data-i18n')) {
    heroSubtitle.setAttribute('data-i18n', 'hero.subtitle');
  }

  // Hero CTAs
  const heroWa = document.querySelector('.hero-ctas .btn-whatsapp');
  if (heroWa && !heroWa.hasAttribute('data-i18n')) {
    heroWa.setAttribute('data-i18n', 'hero.btn.whatsapp');
    heroWa.setAttribute('data-i18n-icon', 'fab fa-whatsapp');
  }

  const heroPkg = document.querySelector('.hero-ctas .btn-outline-light');
  if (heroPkg && !heroPkg.hasAttribute('data-i18n')) {
    heroPkg.setAttribute('data-i18n', 'hero.btn.packages');
    heroPkg.setAttribute('data-i18n-icon', 'fas fa-compass');
  }

  // 3. Floating concierge tooltip
  const floatTooltip = document.querySelector('.float-whatsapp-btn .float-tooltip');
  if (floatTooltip && !floatTooltip.hasAttribute('data-i18n')) {
    floatTooltip.setAttribute('data-i18n', 'float.tooltip');
  }

  // 4. Reverse English text lookup for static elements
  // Build a reverse index from TRANSLATIONS.en
  const enMap = new Map();
  for (const [key, text] of Object.entries(TRANSLATIONS.en)) {
    if (text && typeof text === 'string' && text.length > 3) {
      enMap.set(text.trim(), key);
    }
  }

  // Walk through elements that commonly hold text
  const candidates = document.querySelectorAll(
    'h1, h2, h3, h4, h5, p, span.section-tag, .btn, .spec-item, .feature-card h4, .feature-card p, label, .summary-row span, .quick-field label'
  );

  candidates.forEach(el => {
    // Skip if already tagged or has children tags
    if (el.hasAttribute('data-i18n') || el.children.length > 2) return;
    
    // Check direct text or textContent
    const trimmed = el.textContent.trim();
    if (enMap.has(trimmed)) {
      const key = enMap.get(trimmed);
      el.setAttribute('data-i18n', key);
      
      // If element has a leading FontAwesome icon, record its class to re-render nicely
      const icon = el.querySelector('i');
      if (icon && icon.className) {
        el.setAttribute('data-i18n-icon', icon.className);
      }
    }
  });

  // Auto-tag input placeholders
  const phMap = {
    'e.g. John Smith': 'booking.name.ph',
    'john.smith@example.com': 'booking.email.ph',
    'e.g. United Kingdom / Germany': 'booking.country.ph',
    '+44 7123 456789': 'booking.phone.ph'
  };

  document.querySelectorAll('input[placeholder], textarea[placeholder]').forEach(input => {
    const ph = input.getAttribute('placeholder');
    if (ph && phMap[ph] && !input.hasAttribute('data-i18n-placeholder')) {
      input.setAttribute('data-i18n-placeholder', phMap[ph]);
    }
  });
}

/**
 * Apply all translations to tagged DOM elements
 */
function applyTranslations(lang = currentLanguage) {
  document.documentElement.lang = lang;

  // Translate [data-i18n]
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const translated = t(key, lang);
    if (!translated) return;

    const iconClass = el.getAttribute('data-i18n-icon');
    if (iconClass) {
      el.innerHTML = `<i class="${iconClass}"></i> ${translated}`;
    } else {
      // If there's an existing <i> icon inside, preserve it
      const existingIcon = el.querySelector('i');
      if (existingIcon) {
        const iconClone = existingIcon.cloneNode(true);
        el.innerHTML = '';
        el.appendChild(iconClone);
        el.appendChild(document.createTextNode(' ' + translated));
      } else {
        el.textContent = translated;
      }
    }
  });

  // Translate placeholders
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const translated = t(key, lang);
    if (translated) el.setAttribute('placeholder', translated);
  });

  // Translate titles
  document.querySelectorAll('[data-i18n-title]').forEach(el => {
    const key = el.getAttribute('data-i18n-title');
    const translated = t(key, lang);
    if (translated) el.setAttribute('title', translated);
  });

  // Translate aria-labels
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const key = el.getAttribute('data-i18n-aria');
    const translated = t(key, lang);
    if (translated) el.setAttribute('aria-label', translated);
  });

  // Handle special compound elements like hero title "Explore Sri Lanka in Comfort & Style – <span>Premium Private Chauffeur Services</span>"
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle && heroTitle.getAttribute('data-i18n-tagged') === 'true') {
    const t1 = t('hero.title1', lang);
    const t2 = t('hero.title2', lang);
    heroTitle.innerHTML = `${t1} <span data-i18n="hero.title2">${t2}</span>`;
  }
}

function getOrCreateNavSelectorsGroup() {
  let group = document.querySelector('.nav-cta .nav-selectors-group');
  if (!group) {
    const navCta = document.querySelector('.nav-cta');
    if (navCta) {
      group = document.createElement('div');
      group.className = 'nav-selectors-group';
      const ctaBtn = navCta.querySelector('.btn');
      if (ctaBtn) {
        navCta.insertBefore(group, ctaBtn);
      } else {
        navCta.insertBefore(group, navCta.firstChild);
      }
    }
  }
  return group;
}

/**
 * Initialize Language Switcher Dropdowns into Desktop and Mobile Navigation
 */
function initLanguageSwitcher() {
  // 1. Desktop Switcher in .nav-cta .nav-selectors-group
  const selectorsGroup = getOrCreateNavSelectorsGroup();
  if (selectorsGroup && !selectorsGroup.querySelector('.language-select-box')) {
    const langWrap = document.createElement('div');
    langWrap.className = 'nav-select-pill language-picker-wrap';
    langWrap.title = 'Select Language';
    langWrap.innerHTML = `
      <i class="fas fa-language select-icon text-gold"></i>
      <select class="language-select-box" aria-label="Select Language">
        ${Object.keys(LANGUAGES).map(code => `
          <option value="${code}" ${code === currentLanguage ? 'selected' : ''}>
            ${LANGUAGES[code].flag} ${LANGUAGES[code].label}
          </option>
        `).join('')}
      </select>
    `;

    selectorsGroup.appendChild(langWrap);

    langWrap.querySelector('.language-select-box').addEventListener('change', (e) => {
      setLanguage(e.target.value);
    });
  }

  // 2. Mobile Drawer Switchers in .nav-menu
  const navMenu = document.querySelector('.nav-menu');
  if (navMenu && !navMenu.querySelector('.mobile-nav-prefs')) {
    const mobilePrefs = document.createElement('li');
    mobilePrefs.className = 'mobile-nav-prefs';
    mobilePrefs.innerHTML = `
      <div class="mobile-prefs-header">
        <span class="mobile-prefs-title"><i class="fas fa-sliders-h text-gold"></i> <span data-i18n="nav.prefs">Preferences</span></span>
      </div>
      <div class="mobile-prefs-controls">
        <div class="nav-select-pill currency-picker-wrap">
          <i class="fas fa-coins select-icon text-gold"></i>
          <select class="currency-select-box" aria-label="Select Currency">
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="AUD">AUD (A$)</option>
            <option value="RUB">RUB (₽)</option>
            <option value="CNY">CNY (¥)</option>
            <option value="LKR">LKR (Rs)</option>
          </select>
        </div>
        <div class="nav-select-pill language-picker-wrap">
          <i class="fas fa-globe select-icon text-gold"></i>
          <select class="language-select-box" aria-label="Select Language">
            ${Object.keys(LANGUAGES).map(code => `
              <option value="${code}" ${code === currentLanguage ? 'selected' : ''}>
                ${LANGUAGES[code].flag} ${LANGUAGES[code].label}
              </option>
            `).join('')}
          </select>
        </div>
      </div>
    `;

    // Insert at the top of the mobile nav menu
    navMenu.insertBefore(mobilePrefs, navMenu.firstChild);

    // Bind event for mobile language select
    mobilePrefs.querySelector('.language-select-box').addEventListener('change', (e) => {
      setLanguage(e.target.value);
    });

    // Bind event for mobile currency select if window.setCurrency is defined
    mobilePrefs.querySelector('.currency-select-box').addEventListener('change', (e) => {
      if (typeof window.setCurrency === 'function') {
        window.setCurrency(e.target.value);
      }
    });
  }
}

// Master init on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  autoTagElements();
  initLanguageSwitcher();
  applyTranslations(currentLanguage);
});

// Expose globals for other scripts & debugging
window.LANGUAGES = LANGUAGES;
window.TRANSLATIONS = TRANSLATIONS;
window.currentLanguage = currentLanguage;
window.t = t;
window.setLanguage = setLanguage;
window.applyTranslations = applyTranslations;
