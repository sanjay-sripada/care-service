import type {
  Booking,
  CareEvent,
  Caregiver,
  Review,
  ServiceCategory,
  BookingStatus,
  PaymentStatus,
  VerificationStatus,
} from "@/lib/types";
import type {
  Booking as DbBooking,
  CareEvent as DbCareEvent,
  CaregiverProfile,
  Review as DbReview,
  User,
} from "@prisma/client";

function toServiceCategory(value: string): ServiceCategory {
  return value as ServiceCategory;
}

function toBookingStatus(value: string): BookingStatus {
  const map: Record<string, BookingStatus> = {
    PENDING: "pending",
    CONFIRMED: "confirmed",
    CAREGIVER_ASSIGNED: "caregiver-assigned",
    IN_PROGRESS: "in-progress",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
  };
  return map[value] || "pending";
}

function toPaymentStatus(value: string): PaymentStatus {
  const map: Record<string, PaymentStatus> = {
    PENDING: "pending",
    PAID: "paid",
    REFUNDED: "refunded",
    FAILED: "failed",
  };
  return map[value] || "pending";
}

function toVerificationStatus(value: string): VerificationStatus {
  const map: Record<string, VerificationStatus> = {
    PENDING: "pending",
    VERIFIED: "verified",
    REJECTED: "rejected",
  };
  return map[value] || "pending";
}

export function serializeCaregiver(
  profile: CaregiverProfile & { user: User }
): Caregiver {
  return {
    id: profile.id,
    name: profile.user.name,
    photo: profile.photo,
    phone: profile.user.phone,
    email: profile.user.email || "",
    location: profile.location,
    city: profile.city,
    languages: profile.languages,
    experience: profile.experience,
    skills: profile.skills,
    bio: profile.bio,
    hourlyRate: profile.hourlyRate,
    dailyRate: profile.dailyRate,
    rating: profile.rating,
    reviewCount: profile.reviewCount,
    completedBookings: profile.completedBookings,
    identityVerified: profile.identityVerified,
    backgroundVerified: profile.backgroundVerified,
    certifications: profile.certifications,
    availability: profile.availability,
    isAvailable: profile.isAvailable,
    verificationStatus: toVerificationStatus(profile.verificationStatus),
    joinedAt: profile.createdAt.toISOString().split("T")[0],
  };
}

export function serializeBooking(
  booking: DbBooking & {
    customer: User;
    caregiver?: (CaregiverProfile & { user: User }) | null;
  }
): Booking {
  return {
    id: booking.id,
    customerId: booking.customerId,
    customerName: booking.customer.name,
    caregiverId: booking.caregiverId || "",
    caregiverName: booking.caregiver?.user.name || "Unassigned",
    serviceCategory: toServiceCategory(booking.serviceCategory),
    serviceName: booking.serviceName,
    requirement: booking.requirement,
    location: booking.location,
    date: booking.date,
    startTime: booking.startTime,
    duration: booking.duration,
    totalAmount: booking.totalAmount,
    status: toBookingStatus(booking.status),
    paymentStatus: toPaymentStatus(booking.paymentStatus),
    patientName: booking.patientName || undefined,
    patientAge: booking.patientAge || undefined,
    specialInstructions: booking.specialInstructions || undefined,
    checkInTime: booking.checkInTime || undefined,
    checkOutTime: booking.checkOutTime || undefined,
    createdAt: booking.createdAt.toISOString(),
  };
}

export function serializeCareEvent(event: DbCareEvent): CareEvent {
  const typeMap: Record<string, CareEvent["type"]> = {
    CHECK_IN: "check-in",
    ACTIVITY: "activity",
    MEDICATION: "medication",
    APPOINTMENT: "appointment",
    CHECK_OUT: "check-out",
    ALERT: "alert",
  };

  return {
    id: event.id,
    bookingId: event.bookingId,
    title: event.title,
    description: event.description || undefined,
    timestamp: event.createdAt.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
    type: typeMap[event.type] || "activity",
  };
}

export function serializeReview(
  review: DbReview & { customer: User }
): Review {
  return {
    id: review.id,
    bookingId: review.bookingId,
    customerId: review.customerId,
    customerName: review.customer.name,
    caregiverId: review.caregiverId,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt.toISOString(),
  };
}
