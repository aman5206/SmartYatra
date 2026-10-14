export interface DestinationItem {
  id: string;
  slug: string;
  name: string;
  hindiName: string;
  state: string;
  country: string;
  heroImage: string;
  galleryImages: string[];
  overview: string;
  verifiedHistory: string;
  speciality: string;
  whyPopular: string;
  bestVisitingSeason: string;
  entryFeeEstimate: string;
  rating: number;
  tags: string[]; // history, nature, adventure, food, spirituality, shopping, wildlife, culture
  practicalInfo: {
    idealDays: number;
    nearestAirport: string;
    nearestStation: string;
    localLanguage: string;
    clothingAdvice: string;
    sampleDailyBudgetINR: number;
  };
  attractions: {
    name: string;
    category: string;
    description: string;
    openingHours: string;
    ticketPriceEstimate: string;
    isVerified: boolean;
  }[];
  nearbyServices: {
    name: string;
    category: 'HOTEL' | 'RESTAURANT' | 'HOSPITAL' | 'CAB' | 'BIKE_RENTAL';
    address: string;
    contactInfo: string;
    rating: number;
    isSample: boolean;
  }[];
}

export const SEED_DESTINATIONS: DestinationItem[] = [
  {
    id: "dest-jaipur-01",
    slug: "jaipur",
    name: "Jaipur",
    hindiName: "जयपुर",
    state: "Rajasthan",
    country: "India",
    heroImage: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1603262110263-fb010d6e75dc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1598890777032-bde835ba27c2?auto=format&fit=crop&w=800&q=80"
    ],
    overview: "Jaipur, the vibrant capital of Rajasthan known worldwide as the Pink City, is renowned for its grand royal palaces, terracotta-pink architecture, bustling artisan bazaars, and rich Rajputana heritage.",
    verifiedHistory: "[Verified Record] Founded on 18 November 1727 by Maharaja Sawai Jai Singh II, ruler of Amer. The city was planned by Bengali scholar Vidyadhar Bhattacharya following the principles of Shilpa Shastra and Vastu Vidya. In 1876, the city was painted terracotta pink under Maharaja Ram Singh to welcome the Prince of Wales, a tradition preserved by law today.",
    speciality: "Kundan & Meenakari jewelry, Sanganeri block-print textiles, blue pottery, and royal Rajasthani thali.",
    whyPopular: "UNESCO World Heritage city status, majestic hilltop forts, vibrant cultural festivals, and palatial heritage hotels.",
    bestVisitingSeason: "October to March (Pleasant winter with daytime temperatures 18°C–25°C).",
    entryFeeEstimate: "₹50 - ₹500 per monument (Composite ticket available for major sites)",
    rating: 4.9,
    tags: ["history", "culture", "shopping", "food"],
    practicalInfo: {
      idealDays: 3,
      nearestAirport: "Jaipur International Airport (JAI), Sanganer",
      nearestStation: "Jaipur Junction (JP)",
      localLanguage: "Hindi, Rajasthani, English widely understood",
      clothingAdvice: "Modest cotton wear in daytime; light woollens in winter mornings/evenings.",
      sampleDailyBudgetINR: 2800
    },
    attractions: [
      {
        name: "Amber Fort & Palace",
        category: "Fort",
        description: "Opulent Rajput-Mughal hilltop fortress with the Sheesh Mahal (Mirror Palace) and panoramic Maota Lake views.",
        openingHours: "09:00 AM – 05:30 PM & 06:30 PM – 09:15 PM (Light & Sound)",
        ticketPriceEstimate: "₹100 (Indians), ₹500 (Foreigners) [Sample estimate]",
        isVerified: true
      },
      {
        name: "Hawa Mahal (Palace of Winds)",
        category: "Heritage Monument",
        description: "Five-story pyramidal facade with 953 jharokhas (small lattice windows) built in 1799 by Maharaja Sawai Pratap Singh.",
        openingHours: "09:00 AM – 05:00 PM",
        ticketPriceEstimate: "₹50 (Indians), ₹200 (Foreigners) [Sample estimate]",
        isVerified: true
      },
      {
        name: "Jantar Mantar",
        category: "UNESCO Astronomical Observatory",
        description: "Collection of 19 architectural astronomical instruments built by Sawai Jai Singh II, featuring the world's largest stone sundial.",
        openingHours: "09:00 AM – 05:00 PM",
        ticketPriceEstimate: "₹50 (Indians), ₹200 (Foreigners) [Sample estimate]",
        isVerified: true
      },
      {
        name: "City Palace & Museum",
        category: "Palace",
        description: "Sprawling royal complex blending Mughal and Rajput architecture, housing museums of royal costumes, weaponry, and art.",
        openingHours: "09:30 AM – 05:00 PM",
        ticketPriceEstimate: "₹300 - ₹1000 depending on museum sections [Sample estimate]",
        isVerified: true
      }
    ],
    nearbyServices: [
      {
        name: "SMS Hospital (Sawai Man Singh)",
        category: "HOSPITAL",
        address: "JLN Marg, Jaipur, Rajasthan",
        contactInfo: "+91-141-2560291 (24x7 Emergency)",
        rating: 4.8,
        isSample: false
      },
      {
        name: "LMB (Laxmi Misthan Bhandar)",
        category: "RESTAURANT",
        address: "Johari Bazar, Pink City, Jaipur",
        contactInfo: "+91-141-2565844",
        rating: 4.7,
        isSample: false
      },
      {
        name: "Pink City Heritage Haveli Hotel",
        category: "HOTEL",
        address: "Near Chandpole Gate, Jaipur",
        contactInfo: "Front Desk: +91-141-2370000",
        rating: 4.6,
        isSample: true
      },
      {
        name: "Jaipur Sightseeing Cabs & Pre-paid Taxi",
        category: "CAB",
        address: "Railway Station & Airport Kiosks",
        contactInfo: "Authorized Tourist Taxi Union: 1800-200-4567",
        rating: 4.5,
        isSample: true
      },
      {
        name: "Royal Ride Bike & Scooter Rentals",
        category: "BIKE_RENTAL",
        address: "MI Road, Jaipur",
        contactInfo: "+91-98290-11223",
        rating: 4.4,
        isSample: true
      }
    ]
  },
  {
    id: "dest-varanasi-02",
    slug: "varanasi",
    name: "Varanasi",
    hindiName: "वाराणसी",
    state: "Uttar Pradesh",
    country: "India",
    heroImage: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=800&q=80"
    ],
    overview: "Varanasi (also known as Kashi and Benares) is one of the world's oldest living cities, celebrated for its sacred Ganga riverfront, eighty-four spiritual ghats, ancient temples, classical music traditions, and luminous evening aarti.",
    verifiedHistory: "[Verified Record] Continuous human settlement documented for at least 3,000 years. Mark Twain famously remarked that 'Benares is older than history, older than tradition, older even than legend, and looks twice as old as all of them put together.' Located 10 km away is Sarnath, where Gautama Buddha gave his first sermon (Dhammacakkappavattana Sutta) in ~528 BCE.",
    speciality: "Banarasi brocade silk sarees, Kashi Chaat, Malaiyyo (winter milk froth dessert), and Indian classical music (Senia and Benares Gharana).",
    whyPopular: "Spiritual pilgrimage, mystical sunrise boat rides on Mother Ganga, grand Dashashwamedh evening aarti, and profound philosophical heritage.",
    bestVisitingSeason: "November to March (Pleasant winter climate).",
    entryFeeEstimate: "Ghats are open & free; boat rides ~₹300 - ₹1200 [Sample estimate]",
    rating: 4.9,
    tags: ["spirituality", "culture", "history", "food"],
    practicalInfo: {
      idealDays: 3,
      nearestAirport: "Lal Bahadur Shastri International Airport (VNS), Babatpur",
      nearestStation: "Varanasi Junction (BSB) / Banaras (BSBS)",
      localLanguage: "Bhojpuri, Hindi, English",
      clothingAdvice: "Modest clothing covering shoulders and knees out of temple etiquette; slip-on footwear.",
      sampleDailyBudgetINR: 2200
    },
    attractions: [
      {
        name: "Dashashwamedh Ghat & Evening Ganga Aarti",
        category: "Spiritual Ghat",
        description: "The main sacred ghat where seven priests perform the synchronized Maha Aarti with brass multi-tiered lamps every dusk.",
        openingHours: "Open 24 hours; Aarti starts ~06:30 PM (varies by season)",
        ticketPriceEstimate: "Free public viewing; boat seats ₹200–₹500 [Sample estimate]",
        isVerified: true
      },
      {
        name: "Kashi Vishwanath Temple (Golden Temple)",
        category: "Temple",
        description: "One of the twelve revered Jyotirlingas of Lord Shiva, located alongside the modern Kashi Vishwanath Corridor.",
        openingHours: "03:00 AM – 11:00 PM (subject to Aarti timings)",
        ticketPriceEstimate: "General entry free; Sugam Darshan tickets available online [Sample estimate]",
        isVerified: true
      },
      {
        name: "Sarnath Deer Park & Dhamek Stupa",
        category: "Buddhist Heritage",
        description: "The historical site of Buddha's first sermon, housing the 5th-century Dhamek Stupa and the Ashoka Pillar capital museum.",
        openingHours: "Sunrise to Sunset (ASI protected)",
        ticketPriceEstimate: "₹25 (Indians), ₹300 (Foreigners) [Sample estimate]",
        isVerified: true
      },
      {
        name: "Assi Ghat",
        category: "Ghat & Cultural Hub",
        description: "The southernmost major ghat, famous for 'Subah-e-Banaras' early morning music, yoga, and vibrant traveler cafes.",
        openingHours: "Open 24 hours; Morning Aarti ~05:00 AM",
        ticketPriceEstimate: "Free [Sample estimate]",
        isVerified: true
      }
    ],
    nearbyServices: [
      {
        name: "Sir Sunderlal Hospital (BHU)",
        category: "HOSPITAL",
        address: "Banaras Hindu University Campus, Varanasi",
        contactInfo: "+91-542-2307500 (24x7 Emergency)",
        rating: 4.8,
        isSample: false
      },
      {
        name: "Kashi Chat Bhandar",
        category: "RESTAURANT",
        address: "Godowlia Chowk, Varanasi",
        contactInfo: "+91-542-2412119",
        rating: 4.8,
        isSample: false
      },
      {
        name: "Ganga Riverside Heritage Stay",
        category: "HOTEL",
        address: "Near Assi Ghat, Varanasi",
        contactInfo: "+91-542-2311222",
        rating: 4.6,
        isSample: true
      },
      {
        name: "Kashi Safe Cabs & Airport Transfers",
        category: "CAB",
        address: "Cantt Railway Station Pre-paid Counter",
        contactInfo: "Helpdesk: +91-94500-11234",
        rating: 4.4,
        isSample: true
      },
      {
        name: "Ghats Bicycle & E-Scooter Share",
        category: "BIKE_RENTAL",
        address: "Assi Ghat Parking Zone",
        contactInfo: "+91-98390-55443",
        rating: 4.3,
        isSample: true
      }
    ]
  },
  {
    id: "dest-munnar-03",
    slug: "munnar",
    name: "Munnar & Alleppey",
    hindiName: "मुन्नार और एलेप्पी",
    state: "Kerala",
    country: "India",
    heroImage: "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80"
    ],
    overview: "Kerala's beloved dual experience: Munnar's mist-covered rolling green tea estates in the Western Ghats paired with Alleppey's serene palm-fringed backwaters and traditional kettuvallam houseboats.",
    verifiedHistory: "[Verified Record] Munnar was discovered and developed as a summer retreat and tea planting hill station by British planters in the late 19th century under A.H. Sharp and James Finlay & Co. The Western Ghats mountain range is older than the Himalayas and recognized as one of the world's eight 'hottest biodiversity hotspots'.",
    speciality: "Cardamom and black pepper spices, fresh CTC & orthodox teas, Ayurvedic wellness treatments, and traditional Kerala Sadya served on banana leaves.",
    whyPopular: "Breathtaking emerald hill landscapes, endangered Nilgiri Tahr sightings, soothing tranquil backwater cruises, and pleasant cool mountain air.",
    bestVisitingSeason: "September to March for hills and houseboats; June to August for monsoon rejuvenation.",
    entryFeeEstimate: "National park entry ₹200; Houseboats ₹7,000–₹16,000/night [Sample estimate]",
    rating: 4.9,
    tags: ["nature", "wildlife", "culture", "food"],
    practicalInfo: {
      idealDays: 4,
      nearestAirport: "Cochin International Airport (COK), Nedumbassery (110 km)",
      nearestStation: "Aluva (AWY) / Ernakulam Junction (ERS)",
      localLanguage: "Malayalam, English widely spoken, Tamil understood",
      clothingAdvice: "Light jacket/sweater for Munnar evenings; breezy cotton for Alleppey.",
      sampleDailyBudgetINR: 3200
    },
    attractions: [
      {
        name: "Eravikulam National Park (Rajamalai)",
        category: "National Park & Wildlife",
        description: "Protected sanctuary preserving the largest surviving population of the endangered Nilgiri Tahr mountain goat.",
        openingHours: "07:30 AM – 04:00 PM (Closed Feb-March for calving season)",
        ticketPriceEstimate: "₹200 (Indians), ₹500 (Foreigners) [Sample estimate]",
        isVerified: true
      },
      {
        name: "Tata Tea Museum (KDHP Nallathanni Estate)",
        category: "Museum",
        description: "Historical tea manufacturing machinery dating back to the 1880s, documentary screenings, and tea tasting rooms.",
        openingHours: "09:00 AM – 05:00 PM (Closed Mondays)",
        ticketPriceEstimate: "₹150 includes tea tasting [Sample estimate]",
        isVerified: true
      },
      {
        name: "Alleppey Backwaters & Vembanad Lake",
        category: "Backwater Experience",
        description: "Network of interconnected lagoons, canals, and lakes offering day cruises and overnight traditional kettuvallam stays.",
        openingHours: "Day cruises 09:00 AM – 05:30 PM",
        ticketPriceEstimate: "₹800/hour for Shikara boat; ₹8,000+ for Houseboat [Sample estimate]",
        isVerified: true
      },
      {
        name: "Mattupetty Dam & Kundala Lake",
        category: "Nature & Lake",
        description: "Scenic storage reservoir surrounded by tea gardens and shola forests, popular for speedboating and horse riding.",
        openingHours: "09:30 AM – 05:00 PM",
        ticketPriceEstimate: "₹30 entry + ₹500 boating [Sample estimate]",
        isVerified: true
      }
    ],
    nearbyServices: [
      {
        name: "Tata General Hospital Munnar",
        category: "HOSPITAL",
        address: "Tea County Road, Munnar, Idukki District",
        contactInfo: "+91-4865-230222 (24-Hour Casualty)",
        rating: 4.7,
        isSample: false
      },
      {
        name: "Rapsy Restaurant Munnar",
        category: "RESTAURANT",
        address: "Main Bazar, Munnar",
        contactInfo: "+91-4865-230456",
        rating: 4.5,
        isSample: false
      },
      {
        name: "Misty Valley Tea Estate Resort",
        category: "HOTEL",
        address: "Pothamedu View Point Road, Munnar",
        contactInfo: "+91-4865-299100",
        rating: 4.7,
        isSample: true
      },
      {
        name: "Kerala Gods Own Country Tour Cabs",
        category: "CAB",
        address: "Cochin Airport & Munnar Town Stand",
        contactInfo: "+91-94470-33211",
        rating: 4.6,
        isSample: true
      },
      {
        name: "Munnar Highlands Scooter Hire",
        category: "BIKE_RENTAL",
        address: "Old Munnar Bus Stand",
        contactInfo: "+91-97450-88990",
        rating: 4.3,
        isSample: true
      }
    ]
  },
  {
    id: "dest-ladakh-04",
    slug: "ladakh",
    name: "Leh & Ladakh",
    hindiName: "लेह और लद्दाख",
    state: "Ladakh (UT)",
    country: "India",
    heroImage: "https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80"
    ],
    overview: "Ladakh, known as the 'Land of High Passes', is a pristine high-altitude desert plateau featuring dramatic barren moonscapes, azure glacial lakes, ancient Tibetan Buddhist gompas, and world-famous motorable mountain roads.",
    verifiedHistory: "[Verified Record] Ladakh was an independent Himalayan kingdom for over 900 years, established in the 9th century by Nyima-Gon. It played a pivotal strategic role as a trading crossroad between India, Tibet, and Central Asia along the historic Silk Route.",
    speciality: "Pashmina shawls, Ladakhi apricots, sea buckthorn tea, Tibetan momos and Thukpa, and hand-carved prayer wheels.",
    whyPopular: "Pangong Tso color-changing lake, high-altitude passes (Khardung La, Chang La), star-gazing night skies, and monastery festivals.",
    bestVisitingSeason: "May to September (Roads open, comfortable daytime temperatures 15°C–22°C).",
    entryFeeEstimate: "Inner Line Permit (ILP) required: ~₹400–₹600 environmental fee [Sample estimate]",
    rating: 4.9,
    tags: ["adventure", "nature", "spirituality", "culture"],
    practicalInfo: {
      idealDays: 6,
      nearestAirport: "Kushok Bakula Rimpochee Airport (IXL), Leh (3,256m altitude)",
      nearestStation: "Jammu Tawi (JAT) or Chandigarh (accessible via scenic highways)",
      localLanguage: "Ladakhi (Bhoti), Hindi, English",
      clothingAdvice: "Mandatory 48-hour acclimatization rest upon arrival. Layered thermal fleece, windcheater, high-SPF sunscreen, polarized sunglasses.",
      sampleDailyBudgetINR: 3800
    },
    attractions: [
      {
        name: "Pangong Tso (High Altitude Lake)",
        category: "Glacial Lake",
        description: "Spectacular 134-km long endorheic lake at 4,225m altitude that shifts from turquoise to deep indigo throughout the day.",
        openingHours: "Open daytime (Protected area; Inner Line Permit mandatory)",
        ticketPriceEstimate: "Inner Line Permit fee covers access [Sample estimate]",
        isVerified: true
      },
      {
        name: "Nubra Valley & Hunder Sand Dunes",
        category: "Valley & Desert",
        description: "Cold desert valley famous for double-humped Bactrian camels and the 106-ft Maitreya Buddha statue at Diskit Monastery.",
        openingHours: "Open daytime; Diskit Monastery 07:00 AM – 06:00 PM",
        ticketPriceEstimate: "₹50 monastery entry; ₹300 camel ride [Sample estimate]",
        isVerified: true
      },
      {
        name: "Thiksey Monastery",
        category: "Buddhist Gompa",
        description: "Twelve-story Tibetan monastery resembling the Potala Palace of Lhasa, housing a 49-ft statue of Maitreya Buddha.",
        openingHours: "07:00 AM – 07:00 PM (Morning prayer puja ~07:00 AM)",
        ticketPriceEstimate: "₹50 [Sample estimate]",
        isVerified: true
      },
      {
        name: "Khardung La Pass",
        category: "Mountain Pass",
        description: "Legendary mountain pass at 17,982 ft (5,359m) connecting the Indus River valley to the Shyok and Nubra valleys.",
        openingHours: "Subject to BRO road clearance and weather",
        ticketPriceEstimate: "Covered by ILP [Sample estimate]",
        isVerified: true
      }
    ],
    nearbyServices: [
      {
        name: "SNM Hospital Leh (Sonam Norboo Memorial)",
        category: "HOSPITAL",
        address: "Hospital Road, Skalzangling, Leh",
        contactInfo: "+91-1982-252014 (Equipped with High-Altitude Hyperbaric Chamber)",
        rating: 4.8,
        isSample: false
      },
      {
        name: "The Tibetan Kitchen Leh",
        category: "RESTAURANT",
        address: "Fort Road, Leh",
        contactInfo: "+91-1982-254000",
        rating: 4.7,
        isSample: false
      },
      {
        name: "Himalayan Stargazer Eco Lodge",
        category: "HOTEL",
        address: "Upper Changspa Road, Leh",
        contactInfo: "+91-1982-251122",
        rating: 4.6,
        isSample: true
      },
      {
        name: "Leh Ladakh Taxi Operators Union",
        category: "CAB",
        address: "Main Taxi Stand, Leh",
        contactInfo: "+91-1982-252723 (Government approved fixed tariff list)",
        rating: 4.7,
        isSample: false
      },
      {
        name: "Royal Enfield Mountain Bike Rental Hub",
        category: "BIKE_RENTAL",
        address: "Changspa Road, Leh",
        contactInfo: "+91-94191-77889",
        rating: 4.5,
        isSample: true
      }
    ]
  },
  {
    id: "dest-hampi-05",
    slug: "hampi",
    name: "Hampi",
    hindiName: "हम्पी",
    state: "Karnataka",
    country: "India",
    heroImage: "https://images.unsplash.com/photo-1600100397608-f010f443b745?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1620766182966-c6eb5ed2b788?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80"
    ],
    overview: "Hampi is an open-air museum and UNESCO World Heritage wonderland featuring over 1,600 surviving monuments, massive granite monoliths, and sculpted temples set along the banks of the Tungabhadra River.",
    verifiedHistory: "[Verified Record] Hampi was the prosperous capital of the Vijayanagara Empire from 1336 to 1565 CE. By 1500 CE, Vijayanagara was the second-largest city in the world after Beijing, and by far the richest in India, with gems and pearls traded openly in street bazaars. Following the Battle of Talikota in 1565, the city was pillaged and abandoned to nature.",
    speciality: "Virupaksha Temple rituals, Coracle boat rides on the Tungabhadra, bouldering, and South Indian filter coffee with crispy dosas.",
    whyPopular: "UNESCO World Heritage grandeur, surreal granite boulder terrain, legendary musical stone pillars, and bohemian riverside vibe.",
    bestVisitingSeason: "October to February (Moderate dry weather; avoid scorching summer).",
    entryFeeEstimate: "ASI monument composite ticket ₹40 (Indians), ₹600 (Foreigners) [Sample estimate]",
    rating: 4.8,
    tags: ["history", "culture", "adventure", "spirituality"],
    practicalInfo: {
      idealDays: 3,
      nearestAirport: "Jindal Vijayanagar Airport, Vidyanagar, Bellary (40 km) or Hubli (160 km)",
      nearestStation: "Hosapete Junction (HPT) (13 km)",
      localLanguage: "Kannada, Telugu, Hindi, English",
      clothingAdvice: "Sturdy walking shoes for climbing boulder hills; sunhat, breathable clothing.",
      sampleDailyBudgetINR: 2000
    },
    attractions: [
      {
        name: "Vijaya Vittala Temple & Stone Chariot",
        category: "Temple Complex",
        description: "The crown jewel of Vijayanagara architecture featuring 56 musical pillars (SaReGaMa pillars) and the iconic monolithic Stone Chariot (Garuda shrine).",
        openingHours: "08:30 AM – 05:30 PM",
        ticketPriceEstimate: "₹40 (covers Vittala + Zenana Enclosure) [Sample estimate]",
        isVerified: true
      },
      {
        name: "Virupaksha Temple",
        category: "Living Temple",
        description: "Active place of worship dedicated to Lord Shiva since the 7th century CE, featuring an imposing 160-foot gopura and Lakshmi the temple elephant.",
        openingHours: "06:00 AM – 01:00 PM & 05:00 PM – 09:00 PM",
        ticketPriceEstimate: "₹25 entry [Sample estimate]",
        isVerified: true
      },
      {
        name: "Lotus Mahal & Elephant Stables",
        category: "Royal Enclosure",
        description: "Harmonious Indo-Islamic pavilion designed as a cooling summer palace, adjacent to eleven grand domed elephant chambers.",
        openingHours: "08:30 AM – 05:30 PM",
        ticketPriceEstimate: "Covered by Vittala composite ticket [Sample estimate]",
        isVerified: true
      },
      {
        name: "Matanga Hill Sunrise Point",
        category: "Viewpoint & Trek",
        description: "The highest geographical point in Hampi offering 360-degree panoramic sunrise views over the ancient ruins and river bend.",
        openingHours: "Accessible 24 hours (best climbed before 05:45 AM)",
        ticketPriceEstimate: "Free [Sample estimate]",
        isVerified: true
      }
    ],
    nearbyServices: [
      {
        name: "Government 100-Bed Hospital Hosapete",
        category: "HOSPITAL",
        address: "Station Road, Hosapete, Karnataka (13 km from Hampi)",
        contactInfo: "+91-8394-228222 (24-Hour Casualty)",
        rating: 4.6,
        isSample: false
      },
      {
        name: "Mango Tree Restaurant Hampi",
        category: "RESTAURANT",
        address: "Near Kamalapur Road, Hampi",
        contactInfo: "+91-94487-92220",
        rating: 4.7,
        isSample: false
      },
      {
        name: "Heritage Boulders Resort & Camp",
        category: "HOTEL",
        address: "Anegundi Road, Hampi",
        contactInfo: "+91-8394-241000",
        rating: 4.5,
        isSample: true
      },
      {
        name: "Hampi Tuk-Tuk & Auto Drivers Association",
        category: "CAB",
        address: "Hampi Bazaar Stand",
        contactInfo: "Fixed ASI tour rate cards available at police kiosk",
        rating: 4.6,
        isSample: false
      },
      {
        name: "Hampi Cycle & Moped Rentals",
        category: "BIKE_RENTAL",
        address: "Main Bazaar, Hampi",
        contactInfo: "+91-94491-33445",
        rating: 4.4,
        isSample: true
      }
    ]
  },
  {
    id: "dest-rishikesh-06",
    slug: "rishikesh",
    name: "Rishikesh",
    hindiName: "ऋषिकेश",
    state: "Uttarakhand",
    country: "India",
    heroImage: "https://images.unsplash.com/photo-1596401057633-54a8fe8ef647?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80"
    ],
    overview: "Rishikesh, nestled in the emerald foothills of the Himalayas where the holy Ganga leaves the mountains, is celebrated globally as the 'Yoga Capital of the World' and India's premier adventure sports capital.",
    verifiedHistory: "[Verified Record] Known in ancient sacred texts as the abode of Lord Hrishikesh (Vishnu). In February 1968, English rock band The Beatles arrived at Maharishi Mahesh Yogi's ashram to study Transcendental Meditation, composing most of their celebrated 'White Album' here and bringing global attention to Indian yoga and music.",
    speciality: "International Yoga Festival, certified yoga teacher training, white water river rafting (Grade I to IV rapids), and riverside sattvic organic cafes.",
    whyPopular: "Spiritual rejuvenation, thrilling Ganga river rafting, cliff jumping, bungee jumping, and Triveni Ghat Ganga Aarti.",
    bestVisitingSeason: "September to November & March to May for rafting and pleasant weather.",
    entryFeeEstimate: "Rafting: ₹600 - ₹1500; Beatles ashram ₹150 [Sample estimate]",
    rating: 4.8,
    tags: ["adventure", "spirituality", "nature", "food"],
    practicalInfo: {
      idealDays: 3,
      nearestAirport: "Jolly Grant Airport (DED), Dehradun (21 km)",
      nearestStation: "Yog Nagari Rishikesh (YNRK) / Haridwar (25 km)",
      localLanguage: "Hindi, Garhwali, English widely spoken",
      clothingAdvice: "Modest clothes for ashrams and ghats; quick-drying synthetic wear for river rafting.",
      sampleDailyBudgetINR: 2400
    },
    attractions: [
      {
        name: "Triveni Ghat Evening Maha Aarti",
        category: "Spiritual Ghat",
        description: "The confluence of Ganga, Yamuna, and mythical Saraswati where priests chant Vedic hymns to the accompaniment of drums and oil lamps.",
        openingHours: "Open 24 hours; Aarti starts ~06:00 PM",
        ticketPriceEstimate: "Free [Sample estimate]",
        isVerified: true
      },
      {
        name: "The Beatles Ashram (Chaurasi Kutia)",
        category: "Heritage & Art",
        description: "The 1968 retreat site featuring 84 stone meditation caves, colorful street art murals, and photo exhibitions of The Beatles' visit.",
        openingHours: "09:00 AM – 04:30 PM",
        ticketPriceEstimate: "₹150 (Indians), ₹600 (Foreigners) [Sample estimate]",
        isVerified: true
      },
      {
        name: "Shivpuri to Rishikesh Ganga Rafting",
        category: "Adventure Sports",
        description: "16-km exhilarating river stretch tackling rapids like 'Roller Coaster', 'Golf Course', and 'Club House'.",
        openingHours: "08:00 AM – 03:00 PM (Subject to seasonal river permits)",
        ticketPriceEstimate: "₹800 – ₹1200 per person with safety equipment [Sample estimate]",
        isVerified: true
      },
      {
        name: "Ram Jhula & Laxman Jhula Suspension Bridges",
        category: "Landmark Bridges",
        description: "Iconic iron suspension bridges spanning the turquoise Ganga, connecting bustling ashrams, bookshops, and organic cafes.",
        openingHours: "Open 24 hours (Pedestrian walkways)",
        ticketPriceEstimate: "Free [Sample estimate]",
        isVerified: true
      }
    ],
    nearbyServices: [
      {
        name: "AIIMS Rishikesh (All India Institute of Medical Sciences)",
        category: "HOSPITAL",
        address: "Virbhadra Road, Rishikesh, Uttarakhand",
        contactInfo: "+91-135-2462929 (24x7 Trauma Center)",
        rating: 4.9,
        isSample: false
      },
      {
        name: "Chotiwala Restaurant",
        category: "RESTAURANT",
        address: "Swargashram, Ram Jhula, Rishikesh",
        contactInfo: "+91-135-2440070",
        rating: 4.5,
        isSample: false
      },
      {
        name: "Ganga Riverside Yoga Retreat",
        category: "HOTEL",
        address: "Tapovan, Rishikesh",
        contactInfo: "+91-135-2430011",
        rating: 4.6,
        isSample: true
      },
      {
        name: "Uttarakhand Tourism Pre-Paid Taxi Service",
        category: "CAB",
        address: "Rishikesh Bus Terminal & Railway Station",
        contactInfo: "Toll-Free: 1800-180-4145",
        rating: 4.5,
        isSample: false
      },
      {
        name: "Tapovan Mountain Scooters & Royal Enfield Rentals",
        category: "BIKE_RENTAL",
        address: "Badrinath Road, Tapovan, Rishikesh",
        contactInfo: "+91-98970-44556",
        rating: 4.4,
        isSample: true
      }
    ]
  }
];
