import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MOCK_CUSTOMER } from "@/lib/mock-data";

export default function ProfilePage() {
  return (
    <>
      <Navbar variant="app" />
      <main className="flex-1">
        <div className="mx-auto max-w-lg px-4 py-8 sm:px-6">
          <h1 className="text-2xl font-bold mb-6">My Profile</h1>

          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <Label>Full Name</Label>
                <Input defaultValue={MOCK_CUSTOMER.name} className="mt-1.5 h-12" />
              </div>
              <div>
                <Label>Phone</Label>
                <Input defaultValue={MOCK_CUSTOMER.phone} className="mt-1.5 h-12" />
              </div>
              <div>
                <Label>Email</Label>
                <Input defaultValue={MOCK_CUSTOMER.email} className="mt-1.5 h-12" />
              </div>
              <div>
                <Label>Emergency Contact</Label>
                <Input defaultValue={MOCK_CUSTOMER.emergencyContact} className="mt-1.5 h-12" />
              </div>
              <div>
                <Label>Emergency Phone</Label>
                <Input defaultValue={MOCK_CUSTOMER.emergencyPhone} className="mt-1.5 h-12" />
              </div>
              <Button className="w-full h-12">Save Changes</Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </>
  );
}
