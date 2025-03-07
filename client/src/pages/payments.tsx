import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

export default function PaymentsPage() {
  const [addPaymentOpen, setAddPaymentOpen] = useState(false);
  const [paymentType, setPaymentType] = useState<"card" | "bank">("card");

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Payment Methods</h1>
        <Dialog open={addPaymentOpen} onOpenChange={setAddPaymentOpen}>
          <DialogTrigger asChild>
            <Button>Add Payment Method</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Payment Method</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex gap-4 mb-4">
                <Button
                  variant={paymentType === "card" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setPaymentType("card")}
                >
                  Debit/Credit Card
                </Button>
                <Button
                  variant={paymentType === "bank" ? "default" : "outline"}
                  className="flex-1"
                  onClick={() => setPaymentType("bank")}
                >
                  Bank Account
                </Button>
              </div>

              {paymentType === "card" ? (
                <div className="space-y-4">
                  <div>
                    <Label>Cardholder Name</Label>
                    <Input placeholder="First Name, Last Name" className="mt-2" />
                  </div>
                  <div>
                    <Label>Card Number</Label>
                    <Input placeholder="XXXX XXXX XXXX XXXX" className="mt-2" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Expiration</Label>
                      <Input placeholder="MM/YY" className="mt-2" />
                    </div>
                    <div>
                      <Label>CVV</Label>
                      <Input placeholder="***" className="mt-2" />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label>Account Holder Name</Label>
                    <Input placeholder="First Name, Last Name" className="mt-2" />
                  </div>
                  <div>
                    <Label>Account Type</Label>
                    <Select>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select account type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="checking">Checking</SelectItem>
                        <SelectItem value="savings">Savings</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Account Number</Label>
                    <Input placeholder="Enter account number" className="mt-2" />
                  </div>
                  <div>
                    <Label>Routing Number</Label>
                    <Input placeholder="Enter routing number" className="mt-2" />
                  </div>
                </div>
              )}

              <div className="flex gap-4 mt-4">
                <Button variant="outline" className="flex-1" onClick={() => setAddPaymentOpen(false)}>
                  Cancel
                </Button>
                <Button className="flex-1">Submit</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 border rounded">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded">VISA</div>
                    <div>
                      <div className="font-medium">•••• •••• •••• 4455</div>
                      <div className="text-sm text-muted-foreground">Expires 09/24</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Make Default</Button>
                    <Button variant="outline" size="sm">Remove</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Connected Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-4 border rounded">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-2 rounded">PP</div>
                  <div>
                    <div className="font-medium">PayPal</div>
                    <div className="text-sm text-muted-foreground">john@createbase.com</div>
                  </div>
                </div>
                <Button variant="outline" size="sm">Remove</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              View Transaction History
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
