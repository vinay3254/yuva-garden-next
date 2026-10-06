export const unsplashUrl = (id: string, width = 1200) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${width}&q=75`;

export interface ServiceItem {
  id: string;
  n: string;
  title: string;
  description: string;
  image: string;
}

export const servicesData: ServiceItem[] = [
  {
    id: "landscaping",
    n: "01",
    title: "Landscaping",
    description: "Design and build for lawns, entrances and larger grounds.",
    image: unsplashUrl("1668120089662-42642838cfef", 1400),
  },
  {
    id: "garden-maintenance",
    n: "02",
    title: "Garden maintenance",
    description: "Regular pruning, feeding and pest care.",
    image: unsplashUrl("1617576683096-00fc8eecb3af", 1400),
  },
  {
    id: "terrace-balcony",
    n: "03",
    title: "Terrace & balcony gardens",
    description: "Compact setups for apartments and rooftops.",
    image: unsplashUrl("1617850687395-620757feb1f3", 1400),
  },
  {
    id: "lawn-turf",
    n: "04",
    title: "Lawn & turf",
    description: "Natural grass laying, levelling and upkeep.",
    image: unsplashUrl("1611895186551-4bfad81c5b11", 1400),
  },
  {
    id: "vertical-gardens",
    n: "05",
    title: "Vertical gardens",
    description: "Wall-mounted green panels for indoors and outdoors.",
    image: unsplashUrl("1585320806297-9794b3e4eeae", 1400),
  },
  {
    id: "nursery-plants",
    n: "06",
    title: "Nursery plants",
    description: "Indoor, outdoor and flowering plants for every light and budget.",
    image: unsplashUrl("1523348837708-15d4a09cfac2", 1400),
  },
  {
    id: "pots-planters",
    n: "07",
    title: "Pots & planters",
    description: "Ceramic, cement and fibre planters in many sizes.",
    image: unsplashUrl("1615671524827-c1fe3973b648", 1400),
  },
  {
    id: "soil-fertilizers",
    n: "08",
    title: "Soil & fertilizers",
    description: "Potting mixes, compost and organic nutrition.",
    image: unsplashUrl("1611843467160-25afb8df1074", 1400),
  },
];

export interface StepItem {
  n: string;
  title: string;
  text: string;
  image: string;
}

export const processSteps: StepItem[] = [
  {
    n: "01",
    title: "Visit",
    text: "We come to your home or site, look at the light, soil and space, and listen to what you want.",
    image: unsplashUrl("1657664043009-c4975cb4eed3", 1400),
  },
  {
    n: "02",
    title: "Design",
    text: "We suggest a layout and plants that suit Bangalore's weather and your budget.",
    image: unsplashUrl("1655731695281-b0f818014486", 1400),
  },
  {
    n: "03",
    title: "Plant",
    text: "Our team prepares the soil, plants and sets up watering.",
    image: unsplashUrl("1622383563227-04401ab4e5ea", 1400),
  },
  {
    n: "04",
    title: "Care",
    text: "Regular visits for pruning, feeding and pest care, if you want them.",
    image: unsplashUrl("1617576683096-00fc8eecb3af", 1400),
  },
];

export interface NurseryCard {
  name: string;
  note: string;
  image: string;
}

export const nurseryCards: NurseryCard[] = [
  {
    name: "Seedlings",
    note: "Vegetables & herbs",
    image: unsplashUrl("1523348837708-15d4a09cfac2", 800),
  },
  {
    name: "Flowering",
    note: "Seasonal colour",
    image: unsplashUrl("1534710961216-75c88202f43e", 800),
  },
  {
    name: "Indoor plants",
    note: "Low light, easy care",
    image: unsplashUrl("1615671524827-c1fe3973b648", 800),
  },
  {
    name: "Edibles",
    note: "Raised beds",
    image: unsplashUrl("1591857177580-dc82b9ac4e1e", 800),
  },
];

export interface CatalogItem {
  id: string;
  name: string;
  note: string;
  img: string;
  big: string;
  tag: string;
  cat: "Plants" | "Services" | "Supplies";
  facts: string[];
  desc: string;
  specs: { k: string; v: string }[];
  tagBg: string;
}

const tagColors = ["#d9cfb4", "#c9e3b8", "#f0d9a8", "#e6d3c9"];

export const catalogItems: CatalogItem[] = [
  {
    id: "seedling-trays",
    name: "Seedling trays",
    note: "Vegetables & herbs",
    img: unsplashUrl("1523348837708-15d4a09cfac2", 700),
    big: unsplashUrl("1523348837708-15d4a09cfac2", 1200),
    tag: "Bestseller",
    cat: "Plants",
    facts: ["Full sun", "Easy"],
    desc: "Healthy nursery-raised seedlings of tomato, chilli, brinjal, herbs and greens, ready to transplant.",
    specs: [
      { k: "Light", v: "Full sun" },
      { k: "Water", v: "Daily" },
      { k: "Ready in", v: "6–8 weeks" },
      { k: "Sold as", v: "Trays of 20+" },
    ],
    tagBg: tagColors[0],
  },
  {
    id: "flowering-plants",
    name: "Flowering plants",
    note: "Seasonal colour",
    img: unsplashUrl("1534710961216-75c88202f43e", 700),
    big: unsplashUrl("1534710961216-75c88202f43e", 1200),
    tag: "In season",
    cat: "Plants",
    facts: ["Sun", "Pots or beds"],
    desc: "Marigold, petunia, vinca, hibiscus and more, chosen for the current season.",
    specs: [
      { k: "Light", v: "4–6 hrs sun" },
      { k: "Water", v: "Every 2 days" },
      { k: "Height", v: "30–90 cm" },
      { k: "Sold as", v: "Single or bulk" },
    ],
    tagBg: tagColors[1],
  },
  {
    id: "indoor-greens",
    name: "Indoor greens",
    note: "Easy care",
    img: unsplashUrl("1615671524827-c1fe3973b648", 700),
    big: unsplashUrl("1615671524827-c1fe3973b648", 1200),
    tag: "Low light",
    cat: "Plants",
    facts: ["Shade", "Pet-safe options"],
    desc: "Money plant, snake plant, ZZ, peace lily and other plants that do well indoors.",
    specs: [
      { k: "Light", v: "Indirect" },
      { k: "Water", v: "Weekly" },
      { k: "Pot", v: "Included on request" },
      { k: "Care", v: "Low" },
    ],
    tagBg: tagColors[2],
  },
  {
    id: "succulents-cacti",
    name: "Succulents & cacti",
    note: "Low water",
    img: unsplashUrl("1621272156568-7306716648df", 700),
    big: unsplashUrl("1621272156568-7306716648df", 1200),
    tag: "Easy",
    cat: "Plants",
    facts: ["Sun", "Low water"],
    desc: "Hardy, slow-growing plants for sunny windows and balconies.",
    specs: [
      { k: "Light", v: "Bright" },
      { k: "Water", v: "Every 10 days" },
      { k: "Size", v: "Small–medium" },
      { k: "Care", v: "Very low" },
    ],
    tagBg: tagColors[3],
  },
  {
    id: "fruit-plants",
    name: "Fruit plants",
    note: "Grafted saplings",
    img: unsplashUrl("1591857177580-dc82b9ac4e1e", 700),
    big: unsplashUrl("1591857177580-dc82b9ac4e1e", 1200),
    tag: "Monsoon pick",
    cat: "Plants",
    facts: ["Full sun", "Ground or drum"],
    desc: "Grafted mango, guava, lemon, chikoo and pomegranate saplings.",
    specs: [
      { k: "Light", v: "Full sun" },
      { k: "Fruits in", v: "1–3 years" },
      { k: "Planting", v: "Ground or drum" },
      { k: "Best time", v: "Monsoon" },
    ],
    tagBg: tagColors[0],
  },
  {
    id: "hedge-shrubs",
    name: "Hedge & shrubs",
    note: "Borders, fencing",
    img: unsplashUrl("1617576683096-00fc8eecb3af", 700),
    big: unsplashUrl("1617576683096-00fc8eecb3af", 1200),
    tag: "Outdoor",
    cat: "Plants",
    facts: ["Sun", "Fast growing"],
    desc: "Ficus, tecoma, duranta and other shrubs for living fences and borders.",
    specs: [
      { k: "Light", v: "Full sun" },
      { k: "Spacing", v: "45–60 cm" },
      { k: "Height", v: "Up to 2 m" },
      { k: "Care", v: "Trim monthly" },
    ],
    tagBg: tagColors[1],
  },
  {
    id: "lawn-grass",
    name: "Lawn grass",
    note: "Laid and levelled",
    img: unsplashUrl("1611895186551-4bfad81c5b11", 700),
    big: unsplashUrl("1611895186551-4bfad81c5b11", 1200),
    tag: "Service",
    cat: "Services",
    facts: ["Per sq ft", "Site visit"],
    desc: "Mexican or Korean grass laid on levelled, prepared soil.",
    specs: [
      { k: "Type", v: "Mexican / Korean" },
      { k: "Includes", v: "Soil prep" },
      { k: "Time", v: "1–3 days" },
      { k: "Pricing", v: "Per sq ft" },
    ],
    tagBg: tagColors[2],
  },
  {
    id: "terrace-setup",
    name: "Terrace setup",
    note: "Pots + plants + care",
    img: unsplashUrl("1617850687395-620757feb1f3", 700),
    big: unsplashUrl("1617850687395-620757feb1f3", 1200),
    tag: "Package",
    cat: "Services",
    facts: ["Design", "Install"],
    desc: "A full terrace or balcony garden: planters, plants, soil and drip watering.",
    specs: [
      { k: "Includes", v: "Design + install" },
      { k: "Watering", v: "Drip optional" },
      { k: "Time", v: "2–5 days" },
      { k: "Aftercare", v: "Monthly plan" },
    ],
    tagBg: tagColors[3],
  },
  {
    id: "garden-maintenance-service",
    name: "Garden maintenance",
    note: "Monthly visits",
    img: unsplashUrl("1622383563227-04401ab4e5ea", 700),
    big: unsplashUrl("1622383563227-04401ab4e5ea", 1200),
    tag: "Plan",
    cat: "Services",
    facts: ["Weekly or monthly", "Trained gardeners"],
    desc: "Regular pruning, weeding, feeding and pest care by our team.",
    specs: [
      { k: "Visits", v: "Weekly / monthly" },
      { k: "Includes", v: "Pruning, feeding" },
      { k: "Area", v: "Any size" },
      { k: "Contract", v: "Flexible" },
    ],
    tagBg: tagColors[0],
  },
  {
    id: "vertical-garden-service",
    name: "Vertical garden",
    note: "Wall panels",
    img: unsplashUrl("1585320806297-9794b3e4eeae", 700),
    big: unsplashUrl("1585320806297-9794b3e4eeae", 1200),
    tag: "Service",
    cat: "Services",
    facts: ["Indoor & outdoor", "Drip-fed"],
    desc: "Wall-mounted planting for balconies, lobbies and compound walls.",
    specs: [
      { k: "Size", v: "Custom" },
      { k: "Watering", v: "Drip system" },
      { k: "Plants", v: "Chosen for light" },
      { k: "Pricing", v: "Per sq ft" },
    ],
    tagBg: tagColors[1],
  },
  {
    id: "potting-soil",
    name: "Potting soil",
    note: "Compost mix",
    img: unsplashUrl("1611843467160-25afb8df1074", 700),
    big: unsplashUrl("1611843467160-25afb8df1074", 1200),
    tag: "Essential",
    cat: "Supplies",
    facts: ["Organic", "Bags"],
    desc: "Ready-to-use mix of red soil, compost and cocopeat.",
    specs: [
      { k: "Contents", v: "Soil, compost, cocopeat" },
      { k: "Sizes", v: "5 / 10 / 25 kg" },
      { k: "Use", v: "Pots & beds" },
      { k: "Delivery", v: "Available" },
    ],
    tagBg: tagColors[2],
  },
  {
    id: "pots-planters-supply",
    name: "Pots & planters",
    note: "Ceramic, cement, fibre",
    img: unsplashUrl("1597868165956-03a6827955b1", 700),
    big: unsplashUrl("1597868165956-03a6827955b1", 1200),
    tag: "Supplies",
    cat: "Supplies",
    facts: ["All sizes", "Bulk rates"],
    desc: "Planters in many materials and sizes, from tabletop to large floor pots.",
    specs: [
      { k: "Material", v: "Ceramic, cement, fibre" },
      { k: "Sizes", v: "4 in – 24 in" },
      { k: "Colours", v: "Many" },
      { k: "Bulk", v: "Discounts" },
    ],
    tagBg: tagColors[3],
  },
];

export interface SeasonInfo {
  name: string;
  months: string;
  tip: string;
  plants: string[];
  image: string;
}

export const seasonsData: SeasonInfo[] = [
  {
    name: "Monsoon",
    months: "June – September",
    tip: "The best time to plant trees, shrubs and hedges. Rain does most of the watering while roots settle.",
    plants: ["Hibiscus", "Jasmine", "Ixora", "Bougainvillea", "Fruit trees"],
    image: unsplashUrl("1686663048931-6df69f577a2f", 1400),
  },
  {
    name: "Winter",
    months: "October – February",
    tip: "Cool, dry months for seasonal flowers and vegetables. Good time to prune roses.",
    plants: ["Marigold", "Petunia", "Roses", "Tomato", "Beans"],
    image: unsplashUrl("1534710961216-75c88202f43e", 1400),
  },
  {
    name: "Summer",
    months: "March – May",
    tip: "Choose heat-tolerant plants and mulch well. Water early in the morning.",
    plants: ["Portulaca", "Zinnia", "Succulents", "Vinca", "Aloe vera"],
    image: unsplashUrl("1621272156568-7306716648df", 1400),
  },
];

export const growthStages = [
  { id: "01", label: "Soil", img: unsplashUrl("1611843467160-25afb8df1074", 2200), alt: "Hands working fertile soil" },
  { id: "02", label: "Seed", img: unsplashUrl("1523348837708-15d4a09cfac2", 2200), alt: "Seedlings in pots" },
  { id: "03", label: "Plant", img: unsplashUrl("1622383563227-04401ab4e5ea", 2200), alt: "Planting a young plant" },
  { id: "04", label: "Bloom", img: unsplashUrl("1534710961216-75c88202f43e", 2200), alt: "Flowers in vibrant bloom" },
  { id: "05", label: "Garden", img: unsplashUrl("1634893448897-437a9593128e", 2200), alt: "Finished lush garden path" },
];

export const corridorImageIds = [
  "1523348837708-15d4a09cfac2",
  "1534710961216-75c88202f43e",
  "1615671524827-c1fe3973b648",
  "1621272156568-7306716648df",
  "1591857177580-dc82b9ac4e1e",
  "1617576683096-00fc8eecb3af",
  "1611895186551-4bfad81c5b11",
  "1617850687395-620757feb1f3",
  "1585320806297-9794b3e4eeae",
];

export interface WorkProject {
  label: string;
  place: string;
  image: string;
  tags: string[];
}

export const workProjects: WorkProject[] = [
  {
    label: "Courtyard garden",
    place: "Residential",
    image: unsplashUrl("1686663048931-6df69f577a2f", 1200),
    tags: ["Design", "Planting", "Irrigation"],
  },
  {
    label: "Rooftop deck",
    place: "Apartment",
    image: unsplashUrl("1617850687395-620757feb1f3", 1200),
    tags: ["Terrace", "Containers", "Drip watering"],
  },
  {
    label: "Patio planting",
    place: "Villa",
    image: unsplashUrl("1696846912973-3233cc80bf86", 1200),
    tags: ["Planting", "Pots", "Lighting"],
  },
  {
    label: "Kitchen garden",
    place: "Farmhouse",
    image: unsplashUrl("1601001815894-4bb6c81416d7", 1200),
    tags: ["Edibles", "Raised beds", "Compost"],
  },
  {
    label: "Lawn and borders",
    place: "Residential",
    image: unsplashUrl("1668120089662-42642838cfef", 1200),
    tags: ["Lawn & turf", "Borders", "Maintenance"],
  },
  {
    label: "Flower walk",
    place: "Resort",
    image: unsplashUrl("1597201278257-3687be27d954", 1200),
    tags: ["Borders", "Seasonal colour"],
  },
  {
    label: "Fountain lawn",
    place: "Estate",
    image: unsplashUrl("1595387426463-bef727e35bb3", 1200),
    tags: ["Lawn & turf", "Water feature"],
  },
  {
    label: "Stone path",
    place: "Residential",
    image: unsplashUrl("1655731695281-b0f818014486", 1200),
    tags: ["Hardscape", "Ground cover"],
  },
  {
    label: "Palm entrance",
    place: "Villa",
    image: unsplashUrl("1634893448897-437a9593128e", 1200),
    tags: ["Palms", "Entrance design", "Lighting"],
  },
];

export interface FaqItem {
  q: string;
  a: string;
}

export const faqList: FaqItem[] = [
  {
    q: "Do you do site visits?",
    a: "Yes. We visit your home or site to check light, soil and space before quoting.",
  },
  {
    q: "Which areas do you cover?",
    a: "Bettahalsur and surrounding parts of North Bangalore. Ask us for other areas.",
  },
  {
    q: "Do you deliver plants?",
    a: "Yes, we deliver plants, pots and soil. Charges depend on distance and order size.",
  },
  {
    q: "Can you maintain my garden after setup?",
    a: "Yes, we offer weekly or monthly maintenance visits.",
  },
];

export const quoteNeeds = [
  "Landscaping",
  "Terrace garden",
  "Lawn",
  "Maintenance",
  "Plants",
  "Vertical garden",
];

export const quoteSizes = ["Balcony", "Terrace", "Small yard", "Large plot"];

export const WHATSAPP_PHONE = "910000000000";
export const DISPLAY_PHONE = "+91 XXXXX XXXXX";
export const LOCATION_LABEL = "Bettahalsur, Bangalore";

export const getWhatsAppUrl = (text: string) =>
  `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(text)}`;
