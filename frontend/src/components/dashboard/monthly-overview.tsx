import { Card, CardContent } from "@/components/ui/card";
import { SectionHeader } from "@/components/ui/section-header";
import { PerformanceChart } from "@/components/charts/performance-chart";

export function MonthlyOverview({ data }: { data: { date: string; score: number }[] }) {
  return (
    <Card className="p-0">
      <CardContent className="p-5">
        <SectionHeader title="Performance" />
        <PerformanceChart data={data} />
      </CardContent>
    </Card>
  );
}
