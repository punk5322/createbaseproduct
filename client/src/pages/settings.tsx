import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Avatar } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

export default function SettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [addArtistDialog, setAddArtistDialog] = useState(false);
  const [addSongwriterDialog, setAddSongwriterDialog] = useState(false);
  const [artistNames, setArtistNames] = useState(user?.artistNames || []);
  const [songwriterNames, setSongwriterNames] = useState(user?.songwriterNames || []);
  const [newArtistFirstName, setNewArtistFirstName] = useState("");
  const [newArtistLastName, setNewArtistLastName] = useState("");
  const [newSongwriterFirstName, setNewSongwriterFirstName] = useState("");
  const [newSongwriterLastName, setNewSongwriterLastName] = useState("");
  const { toast } = useToast();

  const handleAddArtistName = () => {
    if (!newArtistFirstName || !newArtistLastName) {
      toast({
        title: "Error",
        description: "Please enter both first and last name",
        variant: "destructive"
      });
      return;
    }
    const newName = `${newArtistFirstName} ${newArtistLastName}`;
    setArtistNames([...artistNames, newName]);
    setNewArtistFirstName("");
    setNewArtistLastName("");
    setAddArtistDialog(false);
    toast({
      title: "Artist Name Added",
      description: "The artist name has been added successfully."
    });
  };

  const handleAddSongwriterName = () => {
    if (!newSongwriterFirstName || !newSongwriterLastName) {
      toast({
        title: "Error",
        description: "Please enter both first and last name",
        variant: "destructive"
      });
      return;
    }
    const newName = `${newSongwriterFirstName} ${newSongwriterLastName}`;
    setSongwriterNames([...songwriterNames, newName]);
    setNewSongwriterFirstName("");
    setNewSongwriterLastName("");
    setAddSongwriterDialog(false);
    toast({
      title: "Songwriter Name Added",
      description: "The songwriter name has been added successfully."
    });
  };

  const handleRemoveArtistName = (indexToRemove: number) => {
    setArtistNames(artistNames.filter((_, index) => index !== indexToRemove));
    toast({
      title: "Artist Name Removed",
      description: "The artist name has been removed successfully."
    });
  };

  const handleRemoveSongwriterName = (indexToRemove: number) => {
    setSongwriterNames(songwriterNames.filter((_, index) => index !== indexToRemove));
    toast({
      title: "Songwriter Name Removed",
      description: "The songwriter name has been removed successfully."
    });
  };

  const handleSaveChanges = () => {
    if (artistNames.length === 0 || songwriterNames.length === 0) {
      toast({
        title: "Error",
        description: "At least one artist name and one songwriter name are required",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Settings Updated",
      description: "Your settings have been saved successfully."
    });
  };

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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Legal First Name</Label>
                    <Input defaultValue={user?.legalFirstName} className="mt-2" />
                  </div>
                  <div>
                    <Label>Legal Last Name</Label>
                    <Input defaultValue={user?.legalLastName} className="mt-2" />
                  </div>
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
                    {artistNames.map((name, index) => (
                      <div key={index} className="flex items-center gap-2 bg-secondary p-2 rounded">
                        <Avatar className="h-6 w-6" />
                        <span>{name}</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemoveArtistName(index)}
                        >
                          ✕
                        </Button>
                      </div>
                    ))}
                    <Dialog open={addArtistDialog} onOpenChange={setAddArtistDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">+ Add Artist Name</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Artist Name</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>First Name</Label>
                              <Input 
                                className="mt-2" 
                                value={newArtistFirstName}
                                onChange={(e) => setNewArtistFirstName(e.target.value)}
                              />
                            </div>
                            <div>
                              <Label>Last Name</Label>
                              <Input 
                                className="mt-2" 
                                value={newArtistLastName}
                                onChange={(e) => setNewArtistLastName(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="flex gap-4">
                            <Button variant="outline" className="flex-1" onClick={() => setAddArtistDialog(false)}>
                              Cancel
                            </Button>
                            <Button 
                              className="flex-1"
                              onClick={handleAddArtistName}
                            >
                              Add
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <div>
                  <Label>Songwriter Names</Label>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {songwriterNames.map((name, index) => (
                      <div key={index} className="flex items-center gap-2 bg-secondary p-2 rounded">
                        <Avatar className="h-6 w-6" />
                        <span>{name}</span>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRemoveSongwriterName(index)}
                        >
                          ✕
                        </Button>
                      </div>
                    ))}
                    <Dialog open={addSongwriterDialog} onOpenChange={setAddSongwriterDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">+ Add Songwriter Name</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Songwriter Name</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>First Name</Label>
                              <Input 
                                className="mt-2" 
                                value={newSongwriterFirstName}
                                onChange={(e) => setNewSongwriterFirstName(e.target.value)}
                              />
                            </div>
                            <div>
                              <Label>Last Name</Label>
                              <Input 
                                className="mt-2" 
                                value={newSongwriterLastName}
                                onChange={(e) => setNewSongwriterLastName(e.target.value)}
                              />
                            </div>
                          </div>
                          <div className="flex gap-4">
                            <Button variant="outline" className="flex-1" onClick={() => setAddSongwriterDialog(false)}>
                              Cancel
                            </Button>
                            <Button 
                              className="flex-1"
                              onClick={handleAddSongwriterName}
                            >
                              Add
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>

              <Button onClick={handleSaveChanges}>Save Changes</Button>
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
      </Tabs>
    </div>
  );
}