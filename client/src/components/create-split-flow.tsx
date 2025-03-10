import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const splitFormSchema = z.object({
  songTitle: z.string().min(1, "Song title is required"),
  artistName: z.string().min(1, "Artist name is required"),
  songwriterName: z.string().min(1, "Songwriter name is required"),
  albumName: z.string().optional(),
  split: z.number().min(0).max(100, "Split must be between 0 and 100"),
});

type SplitFormValues = z.infer<typeof splitFormSchema>;

interface Collaborator {
  artistName: string;
  songwriterName: string;
  split: number;
}

interface CreateSplitFlowProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (data: { mainArtist: SplitFormValues; collaborators: Collaborator[] }) => void;
}

export default function CreateSplitFlow({ open, onOpenChange, onComplete }: CreateSplitFlowProps) {
  const [step, setStep] = useState(1);
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const { toast } = useToast();

  const form = useForm<SplitFormValues>({
    resolver: zodResolver(splitFormSchema),
    defaultValues: {
      songTitle: "",
      artistName: "",
      songwriterName: "",
      albumName: "",
      split: 100,
    },
  });

  const remainingSplit = 100 - collaborators.reduce((acc, curr) => acc + curr.split, 0);

  const handleNextStep = async (values: SplitFormValues) => {
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    }
  };

  const addCollaborator = () => {
    const values = form.getValues();
    if (!values.artistName || !values.songwriterName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields for the collaborator.",
        variant: "destructive",
      });
      return;
    }

    const newCollaborator: Collaborator = {
      artistName: values.artistName,
      songwriterName: values.songwriterName,
      split: values.split,
    };

    setCollaborators([...collaborators, newCollaborator]);

    // Reset collaborator fields but keep song details
    form.reset({
      ...form.getValues(),
      artistName: "",
      songwriterName: "",
      split: Math.max(0, remainingSplit - values.split),
    });

    if (remainingSplit - values.split <= 0) {
      setStep(4);
    }
  };

  const handleComplete = () => {
    const mainArtist = form.getValues();
    onComplete({
      mainArtist,
      collaborators,
    });
    onOpenChange(false);
    setStep(1);
    form.reset();
    setCollaborators([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {step === 1 && "Create New Split - Song Details"}
            {step === 2 && "Set Your Split Percentage"}
            {step === 3 && "Add Collaborator"}
            {step === 4 && "Confirm Split Details"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-center mb-6">
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={cn(
                  "w-3 h-3 rounded-full",
                  step >= s ? "bg-primary" : "bg-gray-200"
                )}
              />
            ))}
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleNextStep)} className="space-y-4">
            {step === 1 && (
              <>
                <FormField
                  control={form.control}
                  name="songTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Song Title</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter song title" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="artistName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Artist Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter artist name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="songwriterName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Songwriter Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter songwriter name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="albumName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Album Name (Optional)</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter album name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div>
                  <Label>Your Split Percentage</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <FormField
                      control={form.control}
                      name="split"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Slider
                              value={[field.value]}
                              onValueChange={([value]) => field.onChange(value)}
                              max={100}
                              step={1}
                              className="flex-1"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <span className="w-12 text-right">{form.getValues("split")}%</span>
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <h3 className="font-medium">Remaining Split: {remainingSplit}%</h3>
                <FormField
                  control={form.control}
                  name="artistName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Collaborator Artist Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter collaborator's artist name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="songwriterName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Collaborator Songwriter Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter collaborator's songwriter name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="split"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Split Percentage</FormLabel>
                      <div className="flex items-center gap-4 mt-2">
                        <FormControl>
                          <Slider
                            value={[field.value]}
                            onValueChange={([value]) => field.onChange(value)}
                            max={remainingSplit}
                            step={1}
                            className="flex-1"
                          />
                        </FormControl>
                        <span className="w-12 text-right">{field.value}%</span>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-4">Split Summary</h3>
                  <div className="space-y-4">
                    <div className="p-4 border rounded-lg">
                      <p className="font-medium">{form.getValues("artistName")}</p>
                      <p className="text-sm text-muted-foreground">
                        Songwriter: {form.getValues("songwriterName")}
                      </p>
                      <p className="text-sm font-medium mt-2">{form.getValues("split")}%</p>
                    </div>
                    {collaborators.map((collaborator, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <p className="font-medium">{collaborator.artistName}</p>
                        <p className="text-sm text-muted-foreground">
                          Songwriter: {collaborator.songwriterName}
                        </p>
                        <p className="text-sm font-medium mt-2">{collaborator.split}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              {step !== 1 && (
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setStep(step - 1)}
                >
                  Back
                </Button>
              )}
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  onOpenChange(false);
                  setStep(1);
                  form.reset();
                  setCollaborators([]);
                }}
              >
                Cancel
              </Button>
              {step === 3 ? (
                <Button type="button" onClick={addCollaborator}>
                  Add Collaborator
                </Button>
              ) : step === 4 ? (
                <Button type="button" onClick={handleComplete}>
                  Save Split
                </Button>
              ) : (
                <Button type="submit">Next</Button>
              )}
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}