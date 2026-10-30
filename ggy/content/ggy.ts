/**
 * GGY homepage content.
 *
 * Source of truth for every fact shown on the page.
 * - `upcoming`: only what has been confirmed for the next edition.
 *   `null` means "not confirmed" and renders as "To be announced".
 * - Everything else is historical and comes from the supplied brochure
 *   ("GGY Brochure_Digital.pdf", 8th edition, 2025). `page` is the PDF page.
 * - `note` links a figure to an entry in `pendingNotes`: the brochure
 *   contradicts itself or the figure needs confirmation. Do not "fix" these
 *   values without confirmation from the GGY team.
 */

export const BROCHURE = "GGY brochure, 8th edition (2025)";
export const CONCEPT_NOTE = "GGY concept note";

/* ------------------------------------------------------------------ */
/* Photographs: every image on the site, with its source and licence   */
/* ------------------------------------------------------------------ */

export type PhotoSource = "ggy-brochure" | "wikimedia" | "unsplash";

export type Photo = {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Short caption shown beside the image. */
  caption: string;
  source: PhotoSource;
  credit: string;
  license?: { name: string; url: string };
  sourceUrl?: string;
};

const BROCHURE_CREDIT = "Photograph from the GGY brochure (2025). Photographer not credited in the brochure.";

const photoRegistry = {
  highCourt: {
    src: "/images/maharashtra-bombay-high-court.jpg",
    width: 3200,
    height: 1800,
    alt: "The Bombay High Court, a Gothic Revival building with a steep central tower, seen across a maidan lined with palms in late-afternoon light.",
    caption: "Bombay High Court, Mumbai",
    source: "wikimedia",
    credit: "A.Savin, Wikimedia Commons. Resized.",
    license: { name: "Free Art License 1.3", url: "https://artlibre.org/licence/lal/en/" },
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Mumbai_03-2016_41_Bombay_High_Court.jpg",
  },
  municipalCorporation: {
    src: "/images/maharashtra-municipal-corporation.jpg",
    width: 1837,
    height: 2400,
    alt: "The Municipal Corporation Building in Mumbai, a stone Gothic Revival building with a central domed tower.",
    caption: "Municipal Corporation Building, Mumbai",
    source: "wikimedia",
    credit: "Sailko, Wikimedia Commons. Resized.",
    license: { name: "CC BY 3.0", url: "https://creativecommons.org/licenses/by/3.0/" },
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Municipal_Corporation_of_Greater_Mumbai_01.jpg",
  },
  oldSecretariat: {
    src: "/images/goa-old-secretariat-panaji.jpg",
    width: 2400,
    height: 1273,
    alt: "The Old Secretariat in Panaji, a long two-storey building with white walls, yellow trim, a tiled roof and a covered colonnade.",
    caption: "Old Secretariat (Adil Shah Palace), Panaji",
    source: "wikimedia",
    credit: "Joegoauk Goa, Wikimedia Commons. Resized; the resized image is shared under the same licence.",
    license: { name: "CC BY-SA 2.0", url: "https://creativecommons.org/licenses/by-sa/2.0/" },
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Adil_Shah_Palace,_Panaji_01.jpg",
  },
  sabarmati: {
    src: "/images/gujarat-sabarmati-ashram.jpg",
    width: 2400,
    height: 1600,
    alt: "A low whitewashed building with a tiled roof at Sabarmati Ashram in Ahmedabad, set on sandy ground under large trees.",
    caption: "Sabarmati Ashram, Ahmedabad",
    source: "wikimedia",
    credit: "Snehrashmi, Wikimedia Commons. Resized; the resized image is shared under the same licence.",
    license: { name: "CC BY-SA 4.0", url: "https://creativecommons.org/licenses/by-sa/4.0/" },
    sourceUrl: "https://commons.wikimedia.org/wiki/File:Sabarmati_Ashram_-_Ahmedabad_-_Gujarat_-_DSC001.jpg",
  },
  cohort: {
    src: "/images/ggy-delegates-cohort.jpg",
    width: 1951,
    height: 696,
    alt: "A large group of Yatra delegates in saffron scarves, smiling at the camera.",
    caption: "Delegates of a past edition",
    source: "ggy-brochure",
    credit: BROCHURE_CREDIT,
  },
  openLandscape: {
    src: "/images/ggy-delegates-open-landscape.jpg",
    width: 1280,
    height: 851,
    alt: "A group of delegates gathered on a raised stone platform in a wide, open landscape under a clear sky.",
    caption: "Delegates on a past edition. Location not identified in the brochure.",
    source: "ggy-brochure",
    credit: BROCHURE_CREDIT,
  },
  lectureHall: {
    src: "/images/ggy-session-lecture-hall.jpg",
    width: 2048,
    height: 1365,
    alt: "A speaker with a microphone addresses delegates seated in a tiered lecture hall with red chairs and laptops.",
    caption: "A session with delegates. Speaker and event not identified in the brochure.",
    source: "ggy-brochure",
    credit: BROCHURE_CREDIT,
  },
  overhead: {
    src: "/images/ggy-delegates-overhead.jpg",
    width: 814,
    height: 543,
    alt: "Delegates photographed from above, looking up and smiling, several holding red folders.",
    caption: "Delegates of a past edition",
    source: "ggy-brochure",
    credit: BROCHURE_CREDIT,
  },
  fieldGroup: {
    src: "/images/ggy-delegates-field-group.jpg",
    width: 902,
    height: 675,
    alt: "A group of delegates, some in sun hats, gathered under the spreading branches of a large tree.",
    caption: "Delegates on a field visit. Location not identified in the brochure.",
    source: "ggy-brochure",
    credit: BROCHURE_CREDIT,
  },
  legislatureSteps: {
    src: "/images/ggy-delegates-legislature-steps.jpg",
    width: 705,
    height: 1252,
    alt: "Delegates standing on the steps of a large colonnaded government building.",
    caption: "Delegates of a past edition. Building not identified in the brochure.",
    source: "ggy-brochure",
    credit: BROCHURE_CREDIT,
  },
  flagOff: {
    src: "/images/ggy-flag-off.jpg",
    width: 1081,
    height: 722,
    alt: "The late Shri Pranab Mukherjee holding a white flag as he flags off the Yatra, with organisers and a delegate beside him.",
    caption: "GGY being flagged off by the late Shri Pranab Mukherjee, former President of India.",
    source: "ggy-brochure",
    credit: BROCHURE_CREDIT,
  },
  address: {
    src: "/images/ggy-address-lawn.jpg",
    width: 772,
    height: 463,
    alt: "Shri Pranab Mukherjee addressing seated Yatra delegates on a lawn.",
    caption: "Delegates in conversation with the late Shri Pranab Mukherjee.",
    source: "ggy-brochure",
    credit: BROCHURE_CREDIT,
  },
} satisfies Record<string, Photo>;

export type PhotoKey = keyof typeof photoRegistry;
export const photos: Record<PhotoKey, Photo> = photoRegistry;

export type NoteId = keyof typeof pendingNotes;

export const pendingNotes = {
  duration:
    "The brochure describes a 10-day programme; the concept note describes a 9-day programme. Awaiting confirmation.",
  alumni:
    "The brochure gives 400+ handpicked delegates on one page and an alumni network of 350+ on another; the concept note gives 300+ alumni. Awaiting confirmation.",
  dates8:
    "The brochure prints 1 to 9 March 2025 for the 8th edition; the concept note's itinerary runs from 23 to 31 March. Awaiting confirmation.",
  workshops:
    "The brochure repeats the Conferences description for Workshops. The Workshops description is awaiting confirmation.",
  titles:
    "Titles are reproduced as printed in the brochure and may no longer be current.",
  flagoff:
    "The brochure does not say which edition this flag-off belongs to.",
  process:
    "This is the admission process printed for the 2025 edition. The process for the upcoming edition is awaiting confirmation.",
} as const;

/* ------------------------------------------------------------------ */
/* Upcoming edition: confirmed facts only                             */
/* ------------------------------------------------------------------ */

export type State = {
  name: string;
  /** Name in the state's own script. Needs native-speaker review before launch. */
  native: string;
  lang: string;
  /** Earlier editions that included this state, from brochure p.6. */
  visitedIn: string[];
  /** State capital and its latitude, shown as geographic reference only. Not a stop. */
  capital: { name: string; lat: number };
  /** Photographs of the state. Empty until approved photographs are supplied. */
  photos: PhotoKey[];
};

export const upcoming = {
  /** Confirmed by the GGY team in the project brief. Listed in the brief's order. */
  states: [
    {
      name: "Maharashtra",
      native: "महाराष्ट्र",
      lang: "mr",
      visitedIn: ["2016"],
      capital: { name: "Mumbai", lat: 19.08 },
      photos: ["municipalCorporation"],
    },
    {
      name: "Goa",
      native: "गोंय",
      lang: "kok",
      visitedIn: ["2018"],
      capital: { name: "Panaji", lat: 15.49 },
      photos: ["oldSecretariat"],
    },
    {
      name: "Gujarat",
      native: "ગુજરાત",
      lang: "gu",
      visitedIn: ["2015", "2019"],
      capital: { name: "Gandhinagar", lat: 23.22 },
      photos: ["sabarmati"],
    },
  ] satisfies State[],
/** Everything below is unconfirmed. Replace null only with confirmed values. */
  dates: null as string | null,
  duration: null as string | null,
  cohortSize: null as string | null,
  yatraLeader: null as string | null,
  itinerary: null as string | null,
  orderOfTravel: null as string | null,
  fee: null as string | null,
  applicationDeadline: null as string | null,
  applyUrl: null as string | null,
  organiser: null as string | null,
};

/* ------------------------------------------------------------------ */
/* Previous edition: 8th edition, 2025 (brochure pp.1, 2, 6, 8)        */
/* ------------------------------------------------------------------ */

export const previousEdition = {
  label: "8th edition, 2025",
  route: "Delhi – Uttar Pradesh",
  dates: "1–9 March 2025",
  tentativeStops: ["Delhi", "Lucknow", "Prayagraj", "Varanasi", "Deoria", "Ayodhya"],
  distance: "1500+ km",
  delegates: "45 handpicked delegates",
  days: "10 immersive days",
  yatraLeader:
    "Shri Shantanu Gupta, Professor of Practice, Rashtram School of Public Leadership, Rishihood University",
  organisedBy: "Rashtram School of Public Leadership, Rishihood University",
  initiativeOf: "Vision India Foundation",
};

/* Brochure p.2, verbatim. */
export const about = {
  claim: "India’s oldest immersive yatra into governance and leadership",
  text: [
    "Good Governance Yatra (GGY) is a premier 10-day immersive travel program designed for aspiring public leaders, policymakers, changemakers, and impact creators. This unique journey offers selected delegates the opportunity to witness transformative governance projects firsthand and engage with visionary policymakers shaping India’s future.",
  ],
  tagline: ["Immerse", "Engage", "Learn", "Network"],
};

/* Brochure p.7 */
export const learningJourney = [
  {
    name: "Anchor",
    text: "Set your learning boundaries in advance by ascertaining the aims and objectives of your visit. Align your unique skills and interests to the core idea behind the yatra – to learn about governance through hands-on experience.",
  },
  {
    name: "Experience",
    text: "Provoke your meta-learning by immersing yourself in the real world, experience first-hand the complications and contradictions of the policy implementation processes. Ask questions and interact with the site and its environment. Discuss, chat and reflect with your peers.",
  },
  {
    name: "Assimilate",
    text: "Re-call, re-live and re-examine the complex learnings with your mentor and assess how and why one governance model may work over another.",
  },
  {
    name: "Evaluate",
    text: "Present and demonstrate composite learnings from the yatra to your mentors with well-articulated reflection papers and case-study reports.",
  },
];

/* Brochure p.10 */
export const components: { name: string; text: string | null; note?: NoteId }[] = [
  { name: "Field Visit", text: "Live exposure to last-mile governance institutions and interaction with stakeholders." },
  { name: "Project Experience", text: "Learning opportunities for knowing the intricacies of governance from pioneers." },
  { name: "Interaction with Policy Architects", text: "Interaction with the best performing policymakers & grassroots workers." },
  { name: "Conferences", text: "Experience sharing sessions with leading public policy architects." },
  { name: "Workshops", text: null, note: "workshops" },
  { name: "Case Studies", text: "Solve complex decision-making problems of policy formulation." },
];

/* Brochure p.3 */
export const takeaways: { name: string; text: string; note?: NoteId }[] = [
  { name: "Guided Discovery", text: "Explore culture, people, and governance with Shri Shantanu Gupta while working on your inner self." },
  { name: "Role Model Interactions", text: "Learn from the best minds behind impactful governance projects." },
  { name: "Career Mentorship", text: "Shape your career with guidance from leading policy professionals." },
  { name: "Case Studies", text: "Encounter authentic local problems, construct novel hypotheses, test solutions, and collaborate to better understand the world around you." },
  { name: "Bharat Insights", text: "Deepen your understanding of Bharat through insights from grassroots leaders." },
  { name: "Impact Legacy", text: "Join an exclusive network of 350+ alumni for lifelong learning, and gain access to city meetups, networking dinners, online discussions, and exclusive annual retreats.", note: "alumni" },
];

/* Concept note, ahead of the 9th edition */
export const conceptFigures: { value: string; label: string; note?: NoteId }[] = [
  { value: "8", label: "Editions completed" },
  { value: "20+", label: "States of India visited" },
  { value: "300+", label: "Alumni", note: "alumni" },
  { value: "100+", label: "Governance projects visited" },
];

/* Concept note, background */
export const saarthi = {
  text: "The Yatra aims to create ‘Saarthis’ or the ‘Ambassadors of Governance’ to spread the word about the outstanding performance of governmental and civil society institutions.",
};

/* Concept note: itinerary of the 8th edition, agenda as printed. */
export type ItineraryDay = { date: string; day: number; city: string; agenda: string[]; field?: { title: string; text: string } };
export const itinerary8: ItineraryDay[] = [
  { date: "23 March", day: 1, city: "Sonipat", agenda: ["Orientation at Rishihood University", "Meeting with Rishihood Founders", "About the GGY Framework"] },
  {
    date: "24 March",
    day: 2,
    city: "Delhi",
    agenda: ["Meetings in Delhi, including an interaction with Dr. Anirban Ganguly, Chairman, SPMRF", "Shri Alok Kumar, Principal Secretary, Department of Planning, UP: a $1 trillion economy", "Uttar Pradesh Police Headquarters: interaction with the DGP"],
    field: {
      title: "UP 112 Command Centre",
      text: "Delegates explored how policing truly works behind the walls of the control centre, from recording the caller’s message to dispatch. Police officials walked them through the calling system, smart tablets, ticketing and the strategic placement of police vehicles across the city to bring the average response time under 10 minutes. The visit ended in the war room, where top officials gather in an emergency, with a Q&A on the delegates’ observations.",
    },
  },
  { date: "25 March", day: 3, city: "Lucknow", agenda: ["Uttar Pradesh Expressways Industrial Development Authority (UPEIDA)", "Interaction with Shri Pravin Singh, Editor, The Times of India"] },
  {
    date: "26 March",
    day: 4,
    city: "Lucknow",
    agenda: ["Interaction with Shri Vinayak Nath, National President, BSIS", "Shri Amrit Abhijat IAS, Principal Secretary, Urban Development"],
    field: {
      title: "Inclusive urban governance",
      text: "A dialogue with Shri Amrit Abhijat, Principal Secretary (Urban Development), and Shri Amit Jha, Secretary and Director (Urban Development), Government of Uttar Pradesh, on integrating every part of society, from large infrastructure to grassroots initiatives. The Kumbh Mela 2025 was discussed as a case study in public administration and logistics, and Shakti Kitchen as a programme that empowers women through dignified local work.",
    },
  },
  {
    date: "27 March",
    day: 5,
    city: "Prayagraj",
    agenda: ["Visit to the Integrated Command Centre", "Interaction with the Mela Magistrate, Prayagraj Mela Authority Board"],
    field: {
      title: "The Mahakumbh control centre",
      text: "The Integrated Command & Control Centre in Prayagraj served as the central nervous system of the Mahakumbh 2025. Delegates saw a demonstration of its AI-powered master dashboard and spoke with Shri Vijay Kiran Anand IAS, the Chief Officer who led the Mahakumbh 2025, about time management, team morale and the administrative culture an event of this scale demands.",
    },
  },
  { date: "28 March", day: 6, city: "Varanasi", agenda: ["Namami Gange ghat", "Kashi Vishwanath Corridor: interaction with the CEO, Kashi Vishwanath Corridor Board", "Interaction with the Vice Chairman, Varanasi Development Authority"] },
  { date: "29 March", day: 7, city: "Ayodhya", agenda: ["Shri Ram Janmabhoomi Teerth Kshetra and Karsevakpuram", "Interaction with Shri Champat Rai, General Secretary, Teerth Kshetra Trust"] },
  { date: "30 March", day: 8, city: "Deoria", agenda: ["Lunch with Shri Shashank Mani Tripathi, Member of Parliament, at the Jagriti Enterprise Centre, Barpar", "Convocation"] },
  { date: "31 March", day: 9, city: "Lucknow", agenda: ["Lunch with Shri Asim Arun, Minister of State, Social Justice, Government of Uttar Pradesh", "Closing: GGY officially ends"] },
];

/* Concept note: proposed plan for Maharashtra. Tentative and unconfirmed. */
export const proposedMaharashtra: { date: string; items: string[] }[] = [
  { date: "29 January", items: ["Nashik Kumbh"] },
  { date: "30 January", items: ["Interaction with the CEO, Viksit Maharashtra Mission", "Mumbai Police HQ: integrated command room", "CM War Room"] },
  { date: "31 January", items: ["BMC headquarters and interaction with the Commissioner", "Metro, Coastal Road and Atal Setu construction sites", "Mumbai local command room"] },
  { date: "1 February", items: ["BharatGen, IIT Bombay", "Bhandup water treatment plant", "National Stock Exchange"] },
];

/* Brochure p.4, figures printed before the 8th edition */
export const journeyStats: { value: string; label: string; note?: NoteId }[] = [
  { value: "7", label: "Editions" },
  { value: "400+", label: "Handpicked delegates", note: "alumni" },
  { value: "20+", label: "Indian states represented" },
  { value: "100+", label: "Governance and industry luminaries" },
  { value: "100+", label: "Institutions and organisations" },
];

/* Brochure p.6 */
export const pastEditions: { year: string; route: string; season?: string }[] = [
  { year: "2015", route: "Gujarat – Rajasthan – Haryana – Delhi" },
  { year: "2016", route: "Karnataka – Andhra Pradesh – Telangana – Maharashtra", season: "Summer" },
  { year: "2016", route: "Madhya Pradesh – Chhattisgarh – Jharkhand – Odisha", season: "Winter" },
  { year: "2017", route: "Delhi – Uttar Pradesh – Bihar" },
  { year: "2018", route: "Goa – Karnataka – Kerala – Tamil Nadu" },
  { year: "2019", route: "Delhi – Haryana – Rajasthan – Gujarat" },
  { year: "2021", route: "Jammu & Kashmir – Ladakh" },
  { year: "2025", route: "Delhi – Uttar Pradesh", season: "8th edition" },
];

/* Concept note: people delegates of the 8th edition met, titles as printed. */
export const met8: { name: string; title: string; where: string }[] = [
  { name: "Dr. Anirban Ganguly", title: "Chairman, SPMRF", where: "Delhi" },
  { name: "Shri Alok Kumar", title: "Principal Secretary, Department of Planning, Uttar Pradesh", where: "Delhi" },
  { name: "Shri Pravin Singh", title: "Editor, The Times of India", where: "Lucknow" },
  { name: "Shri Vinayak Nath", title: "National President, BSIS", where: "Lucknow" },
  { name: "Shri Amrit Abhijat IAS", title: "Principal Secretary, Urban Development, Uttar Pradesh", where: "Lucknow" },
  { name: "Shri Amit Jha", title: "Secretary and Director, Urban Development, Uttar Pradesh", where: "Lucknow" },
  { name: "Shri Vijay Kiran Anand IAS", title: "Chief Officer, Mahakumbh 2025", where: "Prayagraj" },
  { name: "Shri Champat Rai", title: "General Secretary, Shri Ram Janmabhoomi Teerth Kshetra Trust", where: "Ayodhya" },
  { name: "Shri Shashank Mani Tripathi", title: "Member of Parliament", where: "Deoria" },
  { name: "Shri Asim Arun", title: "Minister of State, Social Justice, Uttar Pradesh", where: "Lucknow" },
];

/* Brochure p.10, names and titles as printed */
export const roleModels: { name: string; title: string }[] = [
  { name: "Late Shri Pranab Mukherjee", title: "Former President of India" },
  { name: "Shri Arun Maira", title: "Former Chairman, Boston Consulting Group" },
  { name: "Shri Saurabh Bhai Patel", title: "Former Finance Minister, Gujarat State" },
  { name: "Shri Aman Singh", title: "Former Principal Secretary, Chhattisgarh" },
  { name: "Shri Basavaraj Patil", title: "Former Rajya Sabha MP, Karnataka" },
  { name: "Dr Raman Singh", title: "Former Chief Minister, Chhattisgarh" },
  { name: "Shri Pratyaya Amrit", title: "Principal Secretary, Power, Bihar Government" },
  { name: "Smt. Vasuben Trivedi", title: "Former Minister for Women and Child Welfare, Gujarat State" },
  { name: "Smt. Nidhi Kamdar", title: "Former OSD, Maharashtra CM" },
  { name: "Shri Anna Hazare", title: "Social Reformer" },
  { name: "Shri Ajoy Mehta", title: "Municipal Commissioner, Mumbai" },
  { name: "Shri Ananth Kumar", title: "Former Minister for Parliamentary Affairs, Government of India" },
  { name: "Shri TR Raghunandan", title: "Former Joint Secretary, Ministry of Panchayati Raj, GoI; Co-founder, Avantika Foundation" },
  { name: "Shri Avinash Mohanty", title: "Commissioner of Police, Cyberabad Metropolitan Police" },
];

/* Brochure p.11 */
export const careerPaths = [
  "Think tanks",
  "Government",
  "Big consultancy groups",
  "CSR groups",
  "International organisations",
  "Higher education at top foreign institutions",
  "Academia and research organisations",
  "NGOs",
  "MNCs and new-age startups",
  "Entrepreneurship and intrapreneurship",
];

/* Brochure p.11 */
export const admissionSteps: { name: string; text: string; note?: NoteId }[] = [
  { name: "Submit your application", text: "Interested candidates should submit an online application." },
  { name: "Application review", text: "Application shall be reviewed and the selection communication will be sent within 7 working days of application submission." },
  { name: "Payment of fees", text: "Selected candidates will have to pay the programme fee within 5 working days of receiving the confirmation email." },
  { name: "Payment confirmation", text: "Admissions will be based on a first-come-first-serve basis until the maximum intake." },
  { name: "Next destination", text: "10 days of exciting and self-exploratory experiences at the Yatra.", note: "duration" },
];

/* Brochure p.11, contact details printed for the 2025 edition */
export const contact = {
  email: "ggy@rashtram.org",
  phoneDisplay: "+91 72989 82104",
  phoneHref: "tel:+917298982104",
  address: "Rishihood University, NH44, Near Bahalgarh Chowk, Sonipat (Delhi NCR) 131021",
};

/* ------------------------------------------------------------------ */
/* Photo annotations: only what is visible in the photograph           */
/* ------------------------------------------------------------------ */

export type Annotation = { x: number; y: number; title: string; text: string };

export const annotations: Partial<Record<PhotoKey, Annotation[]>> = {
  openLandscape: [
    { x: 52, y: 50, title: "कर्क रेखा · Tropic of Cancer", text: "The marker behind the delegates reads “कर्क रेखा” and “Tropic of Cancer”. The brochure does not say where the photograph was taken." },
    { x: 60, y: 63, title: "Scarves", text: "Delegates wear matching yellow scarves, as in other photographs in the brochure." },
    { x: 18, y: 76, title: "Open country", text: "Dry, open farmland stretches to the horizon around the marker." },
  ],
  legislatureSteps: [
    { x: 47, y: 25, title: "Government work is God’s work", text: "The inscription above the columns reads, in Kannada and English, “Government work is God’s work”. The brochure does not name the building." },
    { x: 48, y: 14, title: "State emblem", text: "A coat of arms sits beneath the dome, under the flag." },
    { x: 50, y: 82, title: "On the steps", text: "Delegates of a past edition gather on the broad stone steps." },
  ],
};

/* ------------------------------------------------------------------ */
/* Questions: answers use only the brochure and the confirmed route     */
/* ------------------------------------------------------------------ */

export const faqs: { q: string; a: string }[] = [
  { q: "Where will the upcoming Yatra go?", a: "Through Maharashtra, Goa and Gujarat. The stops and the order of travel are still to be announced." },
  { q: "When is the upcoming Yatra?", a: "The dates are still to be announced. The previous edition ran from 1 to 9 March 2025." },
  { q: "How long is the Yatra?", a: "The duration of the upcoming edition is to be announced. The 2025 brochure describes a 10-day programme; the GGY concept note describes a 9-day programme, and its itinerary for the 8th edition runs from 23 to 31 March." },
  { q: "How many delegates take part?", a: "The cohort size for the upcoming edition is to be announced. The 2025 edition had 45 handpicked delegates." },
  { q: "Who is the Yatra for?", a: "The 2025 brochure describes it as a programme for aspiring public leaders, policymakers, changemakers and impact creators." },
  { q: "How do I apply?", a: "Applications for the upcoming edition have not opened. In 2025, candidates submitted an online application, were told the outcome within 7 working days, and paid the fee within 5 working days of confirmation." },
  { q: "What does it cost?", a: "The programme fee for the upcoming edition is to be announced." },
  { q: "Who organises the Yatra?", a: "The organiser of the upcoming edition is to be confirmed. The 2025 edition was organised by Rashtram School of Public Leadership, Rishihood University." },
  { q: "Do delegates receive a certificate?", a: "The 2025 brochure offered delegates a certificate of appreciation for their participation." },
  { q: "How can I contact the team?", a: "By email at ggy@rashtram.org, the address printed in the 2025 brochure. Contact details for the upcoming edition are to be confirmed." },
];

/* ------------------------------------------------------------------ */
/* Application readiness: a self-check built from the 2025 brochure     */
/* ------------------------------------------------------------------ */

export const readiness: { id: string; label: string; source: string }[] = [
  { id: "fit", label: "I see myself as an aspiring public leader, policymaker, changemaker or impact creator.", source: "Who the 2025 brochure says the programme is for." },
  { id: "time", label: "I can set aside the full length of the Yatra once its dates are announced.", source: "The 2025 edition ran from 1 to 9 March." },
  { id: "fee", label: "I could pay the programme fee within 5 working days of a confirmation email.", source: "The 2025 rule. The fee for the upcoming edition is to be announced." },
  { id: "early", label: "I plan to apply early.", source: "In 2025, places were filled first come, first served." },
  { id: "contact", label: "I have written to the GGY team to hear when applications open.", source: "ggy@rashtram.org, as printed in 2025." },
];
