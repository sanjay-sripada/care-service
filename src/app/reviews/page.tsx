"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { toast } from "sonner";

function ReviewsForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("booking");
  const caregiverId = searchParams.get("caregiver");
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0 || !bookingId) {
      toast.error("Please select a rating");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, caregiverId, rating, comment }),
      });
      if (!res.ok) throw new Error();
      toast.success("Thank you for your review!");
      router.push("/history");
    } catch {
      toast.error("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar variant="app" />
      <main className="flex-1">
        <div className="mx-auto max-w-lg px-4 py-8 sm:px-6">
          <h1 className="text-2xl font-bold mb-6">Leave a Review</h1>
          <Card>
            <CardContent className="p-6 space-y-6">
              <div>
                <p className="font-medium mb-3">How was your experience?</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)} onClick={() => setRating(star)}>
                      <Star className={`h-8 w-8 transition-colors ${star <= (hover || rating) ? "fill-warning text-warning" : "text-muted-foreground"}`} />
                    </button>
                  ))}
                </div>
              </div>
              <Textarea placeholder="Share your experience..." value={comment} onChange={(e) => setComment(e.target.value)} className="min-h-[120px]" />
              <Button className="w-full h-12" onClick={handleSubmit} disabled={loading}>
                {loading ? "Submitting..." : "Submit Review"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function ReviewsPage() {
  return (
    <Suspense>
      <ReviewsForm />
    </Suspense>
  );
}
