import { PrismaClient, UserRole, VerificationStatus } from "@prisma/client";

const prisma = new PrismaClient();

const caregivers = [
  {
    phone: "+919876543210",
    name: "Lakshmi Devi",
    email: "lakshmi.d@email.com",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lakshmi&backgroundColor=c0aede",
    location: "Banjara Hills, Hyderabad",
    languages: ["Telugu", "Hindi", "English"],
    experience: 8,
    skills: ["Mobility assistance", "Medicine reminders", "Companion care", "Feeding assistance", "Dementia care"],
    bio: "Experienced caregiver with 8 years of dedicated service to elderly patients.",
    hourlyRate: 350,
    dailyRate: 2500,
    rating: 4.9,
    reviewCount: 127,
    completedBookings: 340,
    identityVerified: true,
    backgroundVerified: true,
    certifications: ["Certified Caregiver - NAC", "First Aid Certified"],
    availability: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  },
  {
    phone: "+919876543211",
    name: "Rajesh Kumar",
    email: "rajesh.k@email.com",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh&backgroundColor=b6e3f4",
    location: "Jubilee Hills, Hyderabad",
    languages: ["Telugu", "Hindi", "English", "Urdu"],
    experience: 5,
    skills: ["Hospital accompaniment", "Mobility assistance", "Post-surgery care", "Medicine reminders"],
    bio: "Reliable caregiver specializing in hospital visits and post-surgery recovery support.",
    hourlyRate: 400,
    dailyRate: 2800,
    rating: 4.8,
    reviewCount: 89,
    completedBookings: 210,
    identityVerified: true,
    backgroundVerified: true,
    certifications: ["Patient Care Attendant Certificate"],
    availability: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sun"],
  },
  {
    phone: "+919876543212",
    name: "Sunita Reddy",
    email: "sunita.r@email.com",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sunita&backgroundColor=ffd5dc",
    location: "Gachibowli, Hyderabad",
    languages: ["Telugu", "English"],
    experience: 12,
    skills: ["Bedridden care", "Overnight care", "Bathing & grooming", "Feeding assistance", "Diabetes management"],
    bio: "Senior caregiver with over 12 years of experience in bedridden and overnight patient care.",
    hourlyRate: 450,
    dailyRate: 3200,
    rating: 4.95,
    reviewCount: 203,
    completedBookings: 520,
    identityVerified: true,
    backgroundVerified: true,
    certifications: ["Advanced Patient Care", "Diabetes Care Specialist", "First Aid"],
    availability: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  {
    phone: "+919876543213",
    name: "Mohammed Ali",
    email: "mohammed.a@email.com",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mohammed&backgroundColor=d1d4f9",
    location: "Secunderabad, Hyderabad",
    languages: ["Urdu", "Hindi", "Telugu", "English"],
    experience: 6,
    skills: ["Hospital accompaniment", "Mobility assistance", "Medicine reminders", "Companion care"],
    bio: "Compassionate attendant with strong experience in hospital visits and elderly companion care.",
    hourlyRate: 380,
    dailyRate: 2600,
    rating: 4.7,
    reviewCount: 76,
    completedBookings: 185,
    identityVerified: true,
    backgroundVerified: true,
    certifications: ["Caregiver Training Certificate"],
    availability: ["Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  {
    phone: "+919876543214",
    name: "Priya Sharma",
    email: "priya.s@email.com",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya&backgroundColor=c0aede",
    location: "Madhapur, Hyderabad",
    languages: ["Hindi", "English", "Telugu"],
    experience: 4,
    skills: ["Companion care", "Feeding assistance", "Bathing & grooming", "Medicine reminders"],
    bio: "Young and energetic caregiver passionate about elderly care.",
    hourlyRate: 300,
    dailyRate: 2200,
    rating: 4.6,
    reviewCount: 45,
    completedBookings: 98,
    identityVerified: true,
    backgroundVerified: false,
    certifications: ["Basic Caregiver Training"],
    availability: ["Mon", "Wed", "Fri", "Sat", "Sun"],
  },
  {
    phone: "+919876543215",
    name: "Venkat Rao",
    email: "venkat.r@email.com",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Venkat&backgroundColor=b6e3f4",
    location: "Kukatpally, Hyderabad",
    languages: ["Telugu", "Hindi"],
    experience: 10,
    skills: ["Physiotherapy support", "Mobility assistance", "Post-surgery care", "Overnight care"],
    bio: "Experienced in post-surgery rehabilitation support and physiotherapy assistance.",
    hourlyRate: 420,
    dailyRate: 3000,
    rating: 4.85,
    reviewCount: 156,
    completedBookings: 410,
    identityVerified: true,
    backgroundVerified: true,
    certifications: ["Physiotherapy Assistant", "Patient Care Advanced"],
    availability: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    isAvailable: false,
  },
];

async function main() {
  await prisma.careEvent.deleteMany();
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.caregiverProfile.deleteMany();
  await prisma.otpCode.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      phone: "+919988776655",
      name: "Admin User",
      email: "admin@saathicare.in",
      role: UserRole.ADMIN,
    },
  });

  const customer = await prisma.user.create({
    data: {
      phone: "+919988776600",
      name: "Arjun Mehta",
      email: "arjun.mehta@email.com",
      role: UserRole.CUSTOMER,
      emergencyContact: "Priya Mehta (Wife)",
      emergencyPhone: "+919988776601",
    },
  });

  const caregiverProfiles = [];
  for (const cg of caregivers) {
    const user = await prisma.user.create({
      data: {
        phone: cg.phone,
        name: cg.name,
        email: cg.email,
        role: UserRole.CAREGIVER,
      },
    });

    const profile = await prisma.caregiverProfile.create({
      data: {
        userId: user.id,
        photo: cg.photo,
        location: cg.location,
        languages: cg.languages,
        experience: cg.experience,
        skills: cg.skills,
        bio: cg.bio,
        hourlyRate: cg.hourlyRate,
        dailyRate: cg.dailyRate,
        rating: cg.rating,
        reviewCount: cg.reviewCount,
        completedBookings: cg.completedBookings,
        identityVerified: cg.identityVerified,
        backgroundVerified: cg.backgroundVerified,
        certifications: cg.certifications,
        availability: cg.availability,
        isAvailable: "isAvailable" in cg ? cg.isAvailable : true,
        verificationStatus: VerificationStatus.VERIFIED,
      },
    });
    caregiverProfiles.push(profile);
  }

  const lakshmi = caregiverProfiles[0];
  const rajesh = caregiverProfiles[1];
  const sunita = caregiverProfiles[2];

  const activeBooking = await prisma.booking.create({
    data: {
      customerId: customer.id,
      caregiverId: lakshmi.id,
      serviceCategory: "elderly-care",
      serviceName: "Elderly Care - Daily Assistance",
      requirement: "Need companion care for my 78-year-old father with mobility issues",
      location: "Banjara Hills, Hyderabad",
      date: new Date().toISOString().split("T")[0],
      startTime: "09:00",
      duration: 8,
      totalAmount: 2800,
      status: "IN_PROGRESS",
      paymentStatus: "PAID",
      patientName: "Ramesh Mehta (Dad)",
      patientAge: 78,
      checkInTime: "09:02",
    },
  });

  await prisma.careEvent.createMany({
    data: [
      { bookingId: activeBooking.id, title: "Caregiver arrived", type: "CHECK_IN" },
      { bookingId: activeBooking.id, title: "Breakfast assistance completed", description: "Helped with morning meal and medication", type: "ACTIVITY" },
      { bookingId: activeBooking.id, title: "Medicine reminder", description: "Blood pressure medication administered", type: "MEDICATION" },
      { bookingId: activeBooking.id, title: "Morning walk assistance", description: "15-minute walk in the garden", type: "ACTIVITY" },
    ],
  });

  await prisma.booking.create({
    data: {
      customerId: customer.id,
      caregiverId: rajesh.id,
      serviceCategory: "hospital-assistance",
      serviceName: "Hospital & Doctor Assistance",
      requirement: "Accompany father to hospital appointment at Apollo",
      location: "Jubilee Hills, Hyderabad",
      date: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
      startTime: "10:00",
      duration: 5,
      totalAmount: 2000,
      status: "CONFIRMED",
      paymentStatus: "PAID",
      patientName: "Ramesh Mehta (Dad)",
      patientAge: 78,
    },
  });

  const completedBooking = await prisma.booking.create({
    data: {
      customerId: customer.id,
      caregiverId: sunita.id,
      serviceCategory: "patient-care",
      serviceName: "Patient Care - Overnight Attendant",
      requirement: "Overnight care for bedridden mother after hip surgery",
      location: "Gachibowli, Hyderabad",
      date: new Date(Date.now() - 86400000 * 7).toISOString().split("T")[0],
      startTime: "20:00",
      duration: 12,
      totalAmount: 5400,
      status: "COMPLETED",
      paymentStatus: "PAID",
      patientName: "Savitri Mehta (Mom)",
      patientAge: 72,
      checkInTime: "20:05",
      checkOutTime: "08:10",
    },
  });

  await prisma.review.create({
    data: {
      bookingId: completedBooking.id,
      customerId: customer.id,
      caregiverId: sunita.id,
      rating: 5,
      comment: "Sunita was exceptional during my mother's recovery. Very attentive and professional.",
    },
  });

  // Pending bookings for caregiver job queue
  await prisma.booking.create({
    data: {
      customerId: customer.id,
      caregiverId: lakshmi.id,
      serviceCategory: "elderly-care",
      serviceName: "Elderly Care - Companion",
      requirement: "Companion care for 82-year-old grandmother, needs Telugu-speaking caregiver",
      location: "Hitech City, Hyderabad",
      date: new Date(Date.now() + 86400000).toISOString().split("T")[0],
      startTime: "08:00",
      duration: 8,
      totalAmount: 2800,
      status: "CAREGIVER_ASSIGNED",
      paymentStatus: "PAID",
    },
  });

  console.log("Seed complete:");
  console.log(`  Admin: ${admin.phone}`);
  console.log(`  Customer: ${customer.phone}`);
  console.log(`  Caregivers: ${caregiverProfiles.length}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
