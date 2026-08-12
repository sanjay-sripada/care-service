import { Service } from "./types";

export const APP_NAME = "SaathiCare";
export const APP_TAGLINE = "Trusted care for the people you love.";

export const SERVICES: Service[] = [
  {
    id: "elderly-care",
    category: "elderly-care",
    name: "Elderly Care",
    description: "Compassionate support for your loved ones at home",
    icon: "Heart",
    subServices: [
      "Companion care",
      "Walking/mobility assistance",
      "Feeding assistance",
      "Bathing/grooming assistance",
      "Medicine reminders",
      "Daily assistance",
    ],
  },
  {
    id: "patient-care",
    category: "patient-care",
    name: "Patient Care",
    description: "Professional attendant care for patients at home",
    icon: "Stethoscope",
    subServices: [
      "Post-hospitalization care",
      "Bedridden patient assistance",
      "Patient attendant",
      "Day-care attendant",
      "Overnight attendant",
    ],
  },
  {
    id: "hospital-assistance",
    category: "hospital-assistance",
    name: "Hospital & Doctor Assistance",
    description: "Accompany and assist during medical visits",
    icon: "Building2",
    subServices: [
      "Accompany patient to hospital",
      "Accompany patient to doctor appointment",
      "Pick up and return home",
      "Wait with patient during appointments",
      "Medicine/report collection assistance",
    ],
  },
];

export const CITIES = [
  "Hyderabad",
  "Bangalore",
  "Mumbai",
  "Delhi",
  "Chennai",
  "Pune",
  "Kolkata",
];

export const LANGUAGES = [
  "English",
  "Hindi",
  "Telugu",
  "Tamil",
  "Kannada",
  "Marathi",
  "Bengali",
  "Urdu",
];

export const SKILLS = [
  "Mobility assistance",
  "Medicine reminders",
  "Feeding assistance",
  "Bathing & grooming",
  "Companion care",
  "Post-surgery care",
  "Bedridden care",
  "Hospital accompaniment",
  "Overnight care",
  "Dementia care",
  "Diabetes management",
  "Physiotherapy support",
];

export const DURATION_OPTIONS = [
  { label: "4 hours", value: 4 },
  { label: "6 hours", value: 6 },
  { label: "8 hours", value: 8 },
  { label: "12 hours", value: 12 },
  { label: "24 hours (Overnight)", value: 24 },
];

export const HOW_IT_WORKS = [
  {
    step: 1,
    title: "Describe your need",
    description:
      "Tell us what kind of care you need — in your own words. Our AI assistant helps you get it right.",
  },
  {
    step: 2,
    title: "Get matched caregivers",
    description:
      "We recommend verified caregivers based on skills, location, availability, and your requirements.",
  },
  {
    step: 3,
    title: "Book with confidence",
    description:
      "Review profiles, check ratings, and book securely. Pay only after confirmation.",
  },
  {
    step: 4,
    title: "Track care in real-time",
    description:
      "Family members can monitor check-ins, activities, and updates — even from afar.",
  },
];

export const TRUST_FEATURES = [
  {
    title: "Identity Verified",
    description: "Every caregiver's government ID is verified before they join.",
    icon: "ShieldCheck",
  },
  {
    title: "Background Checked",
    description: "Comprehensive background verification for your peace of mind.",
    icon: "UserCheck",
  },
  {
    title: "Real-time Tracking",
    description: "Check-in/check-out and live activity updates during every booking.",
    icon: "MapPin",
  },
  {
    title: "Emergency SOS",
    description: "One-tap emergency alert to family and our support team.",
    icon: "Siren",
  },
  {
    title: "Rated & Reviewed",
    description: "Transparent ratings from real families who've used our service.",
    icon: "Star",
  },
  {
    title: "24/7 Support",
    description: "Our care coordinators are always available to help.",
    icon: "Headphones",
  },
];

export const FAQ_ITEMS = [
  {
    question: "Are your caregivers licensed nurses or doctors?",
    answer:
      "No. SaathiCare provides trained, verified caregivers and attendants for non-medical assistance. We do not offer licensed nursing or medical services. For medical needs, please consult a healthcare professional.",
  },
  {
    question: "How are caregivers verified?",
    answer:
      "Every caregiver goes through identity verification, background checks, and skill assessment before joining our platform. Verified badges are displayed on their profiles.",
  },
  {
    question: "Can I track care for my parent remotely?",
    answer:
      "Yes! Our Family Care Dashboard lets you see real-time updates — check-ins, activities, medication reminders, and more — even when you can't be there physically.",
  },
  {
    question: "What cities do you serve?",
    answer:
      "We currently serve Hyderabad with plans to expand to Bangalore, Mumbai, Delhi, Chennai, and Pune soon.",
  },
  {
    question: "How does payment work?",
    answer:
      "You pay securely through Razorpay after booking confirmation. We hold payment until the service is completed to your satisfaction.",
  },
  {
    question: "What if I need to cancel?",
    answer:
      "Free cancellation up to 4 hours before the scheduled start time. Cancellations within 4 hours may incur a partial fee.",
  },
];
