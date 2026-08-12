"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { BookingFormData, ParsedRequirement } from "@/lib/types";

const defaultFormData: BookingFormData = {
  serviceCategory: null,
  requirement: "",
  parsedRequirement: null,
  location: "",
  date: "",
  startTime: "",
  duration: 4,
  patientName: "",
  patientAge: "",
  specialInstructions: "",
  selectedCaregiverId: null,
};

interface BookingContextType {
  formData: BookingFormData;
  updateFormData: (data: Partial<BookingFormData>) => void;
  setParsedRequirement: (parsed: ParsedRequirement) => void;
  resetForm: () => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<BookingFormData>(defaultFormData);

  const updateFormData = (data: Partial<BookingFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const setParsedRequirement = (parsed: ParsedRequirement) => {
    setFormData((prev) => ({
      ...prev,
      parsedRequirement: parsed,
      serviceCategory: parsed.careType || prev.serviceCategory,
      date: parsed.date || prev.date,
      startTime: parsed.time || prev.startTime,
      duration: parsed.duration || prev.duration,
      patientAge: parsed.patientAge?.toString() || prev.patientAge,
      specialInstructions: parsed.specialInstructions || prev.specialInstructions,
    }));
  };

  const resetForm = () => setFormData(defaultFormData);

  return (
    <BookingContext.Provider value={{ formData, updateFormData, setParsedRequirement, resetForm }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) throw new Error("useBooking must be used within BookingProvider");
  return context;
}
