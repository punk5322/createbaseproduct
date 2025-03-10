import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  const onSubmit = (values: SplitFormValues) => {
    if (step === 1) {
      // Move to split allocation step
      setStep(2);
    } else if (step === 2) {
      // Save main artist data and move to collaborator step
      form.setValue("split", remainingSplit);
      setStep(3);
    }
  };

  const addCollaborator = (collaborator: Collaborator) => {
    setCollaborators([...collaborators, collaborator]);
    if (remainingSplit - collaborator.split <= 0) {
      // No more splits available, move to confirmation
      setStep(4);
    }
  };

  const handleComplete = () => {
    onComplete({
      mainArtist: form.getValues(),
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
            {step === 2 && "Allocate Split Percentage"}
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

        {step === 1 && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              <div className="flex justify-end gap-3 pt-4">
                <Button onClick={() => onOpenChange(false)} variant="outline">
                  Cancel
                </Button>
                <Button type="submit">Next</Button>
              </div>
            </form>
          </Form>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <Label className="text-base">Your Split Percentage</Label>
              <div className="flex items-center gap-4 mt-2">
                <Slider
                  value={[form.getValues("split")]}
                  onValueChange={([value]) => form.setValue("split", value)}
                  max={100}
                  step={1}
                  className="flex-1"
                />
                <span className="w-12 text-right">{form.getValues("split")}%</span>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button onClick={() => setStep(1)} variant="outline">
                Back
              </Button>
              <Button onClick={() => setStep(3)}>Add Collaborator</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h3 className="font-medium">Remaining Split: {remainingSplit}%</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <div>
                  <Label>Split Percentage</Label>
                  <div className="flex items-center gap-4 mt-2">
                    <Slider
                      value={[remainingSplit]}
                      onValueChange={([value]) => form.setValue("split", value)}
                      max={remainingSplit}
                      step={1}
                      className="flex-1"
                    />
                    <span className="w-12 text-right">{remainingSplit}%</span>
                  </div>
                </div>
                <div className="flex justify-end gap-3">
                  <Button type="button" onClick={() => setStep(4)} variant="outline">
                    Skip
                  </Button>
                  <Button 
                    type="button"
                    onClick={() => {
                      addCollaborator({
                        artistName: form.getValues("artistName"),
                        songwriterName: form.getValues("songwriterName"),
                        split: form.getValues("split"),
                      });
                      form.reset({
                        songTitle: form.getValues("songTitle"),
                        artistName: "",
                        songwriterName: "",
                        split: remainingSplit,
                      });
                    }}
                  >
                    Add Collaborator
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
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
            <div className="flex justify-end gap-3">
              <Button onClick={() => setStep(3)} variant="outline">
                Back
              </Button>
              <Button onClick={handleComplete}>Save Split</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
