import IndustryComparisonChart from "@/components/dashboard/industry-comparison-chart";

export default function DashboardPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const qp = (k: string) => (typeof searchParams?.[k] === "string" ? (searchParams?.[k] as string) : "");
  const industry = (qp("industry") || "technology").toLowerCase();
  const roleLevel = (qp("role_level") || "management").toLowerCase();
  const scoreStr = qp("score");
  const score = scoreStr ? Number(scoreStr) : undefined;

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Your Dashboard</h1>
      <div className="text-sm text-gray-600">
        Using query params — try:{" "}
        <span className="font-mono">?industry=technology&role_level=management&score=85</span>
      </div>
      <IndustryComparisonChart userIndustry={industry} userRoleLevel={roleLevel} userScore={score} />
    </div>
  );
}
