import { Progress } from "@/components/ui/progress";

interface SplitData {
  music: { name: string; percentage: number }[];
  lyrics: { name: string; percentage: number }[];
  instruments: { name: string; percentage: number }[];
}

interface SplitVisualizationProps {
  splitData?: SplitData;
}

export default function SplitVisualization({ splitData }: SplitVisualizationProps) {
  if (!splitData) {
    return <div>No split data available</div>;
  }

  const categories = [
    { name: "Music", data: splitData.music, color: "bg-blue-600" },
    { name: "Lyrics", data: splitData.lyrics, color: "bg-blue-400" },
    { name: "Instruments", data: splitData.instruments, color: "bg-blue-200" },
  ];

  return (
    <div className="space-y-6">
      {categories.map((category) => (
        <div key={category.name} className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">{category.name}</h4>
            <span className="text-sm text-muted-foreground">
              {category.data.reduce((acc, curr) => acc + curr.percentage, 0)}%
            </span>
          </div>
          <Progress
            value={category.data.reduce((acc, curr) => acc + curr.percentage, 0)}
            className={category.color}
          />
          <div className="grid grid-cols-2 gap-2 text-sm">
            {category.data.map((split, index) => (
              <div key={index} className="flex justify-between">
                <span>{split.name}</span>
                <span>{split.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
