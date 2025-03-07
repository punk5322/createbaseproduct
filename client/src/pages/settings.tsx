import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar } from "@/components/ui/avatar";

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Account Settings</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-background border-b w-full justify-start h-auto p-0 gap-4">
          <TabsTrigger 
            value="profile" 
            className="border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-4 py-2"
          >
            My Profile
          </TabsTrigger>
          <TabsTrigger 
            value="notifications" 
            className="border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-4 py-2"
          >
            Notifications
          </TabsTrigger>
          <TabsTrigger 
            value="payment" 
            className="border-b-2 border-transparent data-[state=active]:border-primary rounded-none px-4 py-2"
          >
            Payment
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Profile Photo</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <Avatar className="h-20 w-20" />
                    <Button variant="outline">Change Photo</Button>
                  </div>
                </div>

                <div>
                  <Label>Full Name</Label>
                  <Input placeholder="Full Name" defaultValue={user?.artistName} className="mt-2" />
                </div>

                <div>
                  <Label>Email Address</Label>
                  <Input type="email" defaultValue={user?.email} className="mt-2" />
                </div>

                <div>
                  <Label>Password</Label>
                  <Input type="password" value="••••••••••••••" className="mt-2" />
                </div>

                <div>
                  <Label>Two Factor Authentication</Label>
                  <div className="mt-2">
                    <Label className="flex items-center gap-2">
                      <Switch defaultChecked={user?.twoFactorEnabled} />
                      <span>Enabled</span>
                    </Label>
                  </div>
                </div>

                <div>
                  <Label>Artist Names</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {user?.artistNames?.map((name, index) => (
                      <div key={index} className="flex items-center gap-2 bg-secondary p-2 rounded">
                        <Avatar className="h-6 w-6" />
                        <span>{name}</span>
                        <Button variant="ghost" size="sm">✕</Button>
                      </div>
                    ))}
                    <Button variant="outline" size="sm">+ Add Artist Name</Button>
                  </div>
                </div>
              </div>

              <Button>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="flex items-center justify-between">
                  <div>
                    <div>All Updates</div>
                    <div className="text-sm text-muted-foreground">
                      Stay informed with the latest news on product and feature updates
                    </div>
                  </div>
                  <Switch />
                </Label>
              </div>
              <div>
                <Label className="flex items-center justify-between">
                  <div>
                    <div>Essential Updates</div>
                    <div className="text-sm text-muted-foreground">
                      Critical news about key product and feature updates
                    </div>
                  </div>
                  <Switch defaultChecked />
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Phone Notifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="flex items-center justify-between">
                  <div>
                    <div>All Updates</div>
                    <div className="text-sm text-muted-foreground">
                      Stay informed with the latest news on product and feature updates
                    </div>
                  </div>
                  <Switch />
                </Label>
              </div>
              <div>
                <Label className="flex items-center justify-between">
                  <div>
                    <div>Essential Updates</div>
                    <div className="text-sm text-muted-foreground">
                      Critical news about key product and feature updates
                    </div>
                  </div>
                  <Switch defaultChecked />
                </Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 border rounded">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4 4h16v2H4V4zm0 7h16v2H4v-2zm0 7h16v2H4v-2z" />
                      </svg>
                    </div>
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
              </div>

              <Button className="w-full" variant="outline">
                + Add New Payment Method
              </Button>
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
                    <div className="bg-primary/10 p-2 rounded">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4 4h16v2H4V4zm0 7h16v2H4v-2zm0 7h16v2H4v-2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">PayPal</div>
                      <div className="text-sm text-muted-foreground">john@createbase.com</div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Remove</Button>
                </div>
              </div>

              <Button className="w-full" variant="outline">
                + Add New Account
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
