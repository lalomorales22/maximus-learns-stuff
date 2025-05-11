import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star } from "lucide-react";

interface ScoreDisplayProps {
  score: number;
  title?: string;
}

export function ScoreDisplay({ score, title = "Your Score" }: ScoreDisplayProps) {
  return (
    <Card className="w-full max-w-xs shadow-lg bg-secondary text-secondary-foreground">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <Star className="h-6 w-6 text-yellow-400" />
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-center py-2">{score}</div>
      </CardContent>
    </Card>
  );
}
