/**
 * Content for the Good Governance Yatra'27 page, from the "GGY'27 Webpage
 * (Changes)" brief and the photographs supplied with it (Referencs/Docs).
 *
 * Copy is reproduced as given in the brief. Where the brief says a text is
 * still to come (descriptions for Key Visits, the state stops), the field is
 * null and the page shows nothing invented in its place.
 */

const IMG = "/images/ggy27";

export type Pic = { src: string; alt: string; width: number; height: number };

/* ------------------------------------------------------------------ */
/* Key Visits and Interactions: "Beyond the Map Lies Real Learning"     */
/* Descriptions to be supplied by Aravind Natarajan.                    */
/* ------------------------------------------------------------------ */

export const keyVisits: { name: string; text: string | null; photo: Pic; fit?: "contain" }[] = [
  {
    name: "Ministerial Interactions",
    text: null,
    photo: { src: `${IMG}/visits/ministerial-interactions.jpg`, alt: "Delegates around a conference table with ministers and officials, presentation screens behind them.", width: 1600, height: 710 },
  },
  {
    name: "Key Infrastructure Visits",
    text: null,
    photo: { src: `${IMG}/visits/reflections-on-mahakumbh-2025.jpg`, alt: "An aerial view of the Mahakumbh 2025 camp at Prayagraj: rows of tents and pontoon bridges along the river.", width: 1600, height: 984 },
  },
  {
    name: "Governance Best Practices",
    text: null,
    photo: { src: `${IMG}/visits/best-governance-practices.jpg`, alt: "The Uttar Pradesh Vidhan Bhavan in Lucknow, a domed legislative building, across its lawns.", width: 1600, height: 900 },
  },
  {
    name: "Building of GIFT City",
    text: null,
    photo: { src: `${IMG}/visits/infrastructure-projects.jpg`, alt: "A multi-level highway interchange curving past new towers at dawn.", width: 1600, height: 1196 },
  },
  {
    name: "Industrial Corridor Insights",
    text: null,
    photo: { src: `${IMG}/visits/upeida-industrial-corridor.jpg`, alt: "Logo of UPEIDA, the Uttar Pradesh Expressways Industrial Development Authority.", width: 1600, height: 781 },
    fit: "contain",
  },
  {
    name: "Cultural Insights",
    text: null,
    photo: { src: `${IMG}/visits/cultural-transformation.jpg`, alt: "Priests performing the evening aarti on the ghats, lamps raised in tiers of flame.", width: 1600, height: 1062 },
  },
];

/* ------------------------------------------------------------------ */
/* Takeaways from the Yatra                                             */
/* ------------------------------------------------------------------ */

export const takeaways27: { name: string; text: string; photo: Pic }[] = [
  {
    name: "Guided Discovery",
    text: "Explore culture, people, and governance while working on your inner self.",
    photo: { src: `${IMG}/brochure/field-visit.jpg`, alt: "Delegates gathered under a spreading banyan tree on a field visit.", width: 1800, height: 1346 },
  },
  {
    name: "Role Model Interactions",
    text: "Learn from the best minds behind impactful governance projects.",
    photo: { src: `${IMG}/brochure/interaction-with-policy-architects.jpg`, alt: "Delegates seated around a long table in a panelled hall, in conversation with officials.", width: 1800, height: 1013 },
  },
  {
    name: "Impact Legacy",
    text: "Join an exclusive network of 350+ alumni for lifelong learning, and gain access to city meetups, networking dinners, online discussions, and exclusive annual retreats.",
    photo: { src: `${IMG}/brochure/ggy-1.jpg`, alt: "A large cohort of delegates in yellow scarves, posing together.", width: 1800, height: 642 },
  },
  {
    name: "Career Mentorship",
    text: "Shape your career with guidance from leading policy professionals.",
    photo: { src: `${IMG}/brochure/shantanu-gupta-5.jpg`, alt: "Shantanu Gupta, Yatra leader, speaking to delegates in a lecture hall.", width: 1800, height: 1199 },
  },
  {
    name: "Case Studies",
    text: "Encounter authentic local problems, construct novel hypotheses, test solutions, and collaborate to better understand the world around you.",
    photo: { src: `${IMG}/brochure/case-study.jpg`, alt: "Delegates talking with a woman at a village workshop during a case study.", width: 1800, height: 1350 },
  },
  {
    name: "Bharat Insights",
    text: "Deepen your understanding of Bharat through insights from grassroots leaders.",
    photo: { src: `${IMG}/brochure/ggy-4.jpg`, alt: "Delegates seated on a lawn, listening to a speaker under the trees.", width: 1800, height: 1078 },
  },
  {
    name: "GGY Certification",
    text: "A “Certificate of Completion” will be awarded to all delegates upon successfully completing the entire yatra and submitting the required case study projects and assignments issued by Rishihood University.",
    photo: { src: `${IMG}/brochure/conference.jpg`, alt: "Delegates around a conference table in a session room.", width: 1800, height: 1350 },
  },
];

/* ------------------------------------------------------------------ */
/* The programme's six parts, with the brochure photograph for each     */
/* ------------------------------------------------------------------ */

export const programmePhotos: Record<string, Pic> = {
  "Field Visit": { src: `${IMG}/brochure/field-visit.jpg`, alt: "Delegates gathered under a spreading banyan tree on a field visit.", width: 1800, height: 1346 },
  "Project Experience": { src: `${IMG}/brochure/project-experience.jpg`, alt: "Delegates around a long table in a government meeting room.", width: 1800, height: 1197 },
  "Interaction with Policy Architects": { src: `${IMG}/brochure/interaction-with-policy-architects.jpg`, alt: "Delegates seated around a long table in a panelled hall, in conversation with officials.", width: 1800, height: 1013 },
  Conferences: { src: `${IMG}/brochure/conference.jpg`, alt: "Delegates around a conference table in a session room.", width: 1800, height: 1350 },
  Workshops: { src: `${IMG}/brochure/workshop.jpg`, alt: "A workshop in a lecture hall, delegates facing a projected slide.", width: 1800, height: 1346 },
  "Case Studies": { src: `${IMG}/brochure/case-study.jpg`, alt: "Delegates talking with a woman at a village workshop during a case study.", width: 1800, height: 1350 },
};

/* ------------------------------------------------------------------ */
/* Hear from our GGY Alumni                                             */
/* ------------------------------------------------------------------ */

export const alumniVideos: { name: string; year: string; id: string; title: string }[] = [
  { name: "Divya Rai", year: "2015", id: "mcSUeQI2tik", title: "Good Governance Yatra: Divya shares her experience" },
  { name: "Shreemathi Tumkur", year: "2015", id: "CP2zZaHKb7M", title: "Good Governance Yatra: Shreemathi shares her experience" },
  { name: "Rohan Maheshwari", year: "2016", id: "2u0m9S1VMRk", title: "Rohan Maheshwari shares his experiences: Good Governance Yatra" },
  { name: "Akanksha Sangwan", year: "2016", id: "nJmMLWxkreY", title: "Aakanksha shares her experiences: Good Governance Yatra" },
  { name: "Drishti Rastogi", year: "2016", id: "VJRXwVcHrdk", title: "Drishti shares her experiences: Good Governance Yatra" },
  { name: "Raashid", year: "2016", id: "cuzeOimCoI4", title: "Raashid shares his experiences: Good Governance Yatra" },
  { name: "Nitansha Bansal", year: "2017", id: "NQAd2V2ryMg", title: "Good Governance Yatra 2017: Nitansha Bansal shares her experience" },
  { name: "Pranav Gupta", year: "2017", id: "6wNf5Bd1DtM", title: "Good Governance Yatra 2017: Pranav Gupta shares his experience" },
  { name: "Saakshi Agarwal", year: "2017", id: "Qpj2J4JxrKM", title: "Good Governance Yatra 2017: Saakshi Agarwal shares her experience" },
];

/* ------------------------------------------------------------------ */
/* Past editions: a photograph of a famous place on each route          */
/* Keyed by year, plus the season where a year had two editions.        */
/* ------------------------------------------------------------------ */

export const editionPhotos: Record<string, Pic> = {
  "2015": { src: `${IMG}/editions/ggy-2015-image.jpg`, alt: "A palace of the Gujarat route, with domes and a clock tower, across its lawns.", width: 1400, height: 793 },
  "2016 Summer": { src: `${IMG}/editions/ggy-2016-summer.jpg`, alt: "The Buddha statue on Hussain Sagar lake in Hyderabad at dusk.", width: 1400, height: 933 },
  "2016 Winter": { src: `${IMG}/editions/ggy-2016-winter.jpg`, alt: "Stone temple towers in Odisha at dusk.", width: 1400, height: 787 },
  "2017": { src: `${IMG}/editions/ggy-2017.jpg`, alt: "Ancient brick ruins on the Bihar route.", width: 1400, height: 933 },
  "2018": { src: `${IMG}/editions/ggy-2018.jpg`, alt: "A green headland above a turquoise sea on the western coast.", width: 1400, height: 787 },
  "2019": { src: `${IMG}/editions/ggy-2019.jpg`, alt: "The pink sandstone facade of the Hawa Mahal in Jaipur.", width: 1400, height: 1050 },
  "2025": { src: `${IMG}/route/kashi-corridor-leg.jpg`, alt: "The Kashi Vishwanath corridor in Varanasi, lit at night.", width: 1400, height: 788 },
  "2021": { src: `${IMG}/editions/ggy-2021.jpg`, alt: "A green Himalayan valley beneath snow peaks.", width: 1400, height: 787 },
};

/* ------------------------------------------------------------------ */
/* Contact, as given for the bottom of the page                         */
/* ------------------------------------------------------------------ */

export const contact27 = {
  email: "ggy@rashtram.org",
  phoneDisplay: "+91 72989 82104",
  phoneHref: "tel:+917298982104",
  phoneName: "Saurabh Basu Chowdhury",
  address: "Rishihood University, NH 44, Sonipat (Delhi NCR)",
  copyright: "© 2026 Rishihood University. All rights reserved.",
};
