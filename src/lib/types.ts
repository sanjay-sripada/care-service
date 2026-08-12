export type UserRole = "customer" | "caregiver" | "admin";

export type ServiceCategory =
  | "elderly-care"
  | "patient-care"
  | "hospital-assistance";

export type VerificationStatus = "pending" | "verified" | "rejected";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "caregiver-assigned"
  | "in-progress"
  | "completed"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "refunded" | "failed";

export interface Service {
  id: string;
  category: ServiceCategory;
  name: string;
  description: string;
  icon: string;
  subServices: string[];
}

export interface Caregiver {
  id: string;
  name: string;
  photo: string;
  phone: string;
  email: string;
  location: string;
  city: string;
  languages: string[];
  experience: number;
  skills: string[];
  bio: string;
  hourlyRate: number;
  dailyRate: number;
  rating: number;
  reviewCount: number;
  completedBookings: number;
  identityVerified: boolean;
  backgroundVerified: boolean;
  certifications: string[];
  availability: string[];
  isAvailable: boolean;
  verificationStatus: VerificationStatus;
  joinedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
}

export interface ParsedRequirement {
  careType: ServiceCategory | null;
  subServices: string[];
  date: string | null;
  time: string | null;
  duration: number | null;
  patientAge: number | null;
  mobilityRequirements: string[];
  requiredSkills: string[];
  requiredLanguages: string[];
  specialInstructions: string;
  location: string | null;
  isOvernight: boolean;
}

export interface CaregiverMatch {
  caregiver: Caregiver;
  matchScore: number;
  reasons: string[];
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  caregiverId: string;
  caregiverName: string;
  serviceCategory: ServiceCategory;
  serviceName: string;
  requirement: string;
  location: string;
  date: string;
  startTime: string;
  duration: number;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  patientName?: string;
  patientAge?: number;
  specialInstructions?: string;
  checkInTime?: string;
  checkOutTime?: string;
  createdAt: string;
}

export interface CareEvent {
  id: string;
  bookingId: string;
  title: string;
  description?: string;
  timestamp: string;
  type: "check-in" | "activity" | "medication" | "appointment" | "check-out" | "alert";
}

export interface Review {
  id: string;
  bookingId: string;
  customerId: string;
  customerName: string;
  caregiverId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface JobRequest {
  id: string;
  bookingId: string;
  customerName: string;
  serviceName: string;
  location: string;
  date: string;
  startTime: string;
  duration: number;
  amount: number;
  requirement: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

export interface BookingFormData {
  serviceCategory: ServiceCategory | null;
  requirement: string;
  parsedRequirement: ParsedRequirement | null;
  location: string;
  date: string;
  startTime: string;
  duration: number;
  patientName: string;
  patientAge: string;
  specialInstructions: string;
  selectedCaregiverId: string | null;
}
