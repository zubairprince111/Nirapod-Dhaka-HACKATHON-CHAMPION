import { useState, useMemo } from "react";
import {
  AlertTriangle,
  BarChart3,
  Building2,
  CheckCircle2,
  Clock,
  Droplets,
  FileText,
  Lamp,
  MapPin,
  Shield,
  ShieldAlert,
  Trash2,
  TrendingUp,
  Users,
  Construction,
} from "lucide-react";
import { useApp } from "@/lib/app-context";
import { KPICard, KPIGrid } from "./KPICards";
import { ReportQueue } from "./ReportQueue";
import { DashboardMap } from "./DashboardMap";
import { ReportDetail } from "./ReportDetail";
import {
  WeeklyChart,
  CategoryPieChart,
  ResolutionRateChart,
  ResponseTimeChart,
} from "./AnalyticsCharts";
import { DashboardShell } from "./DashboardShell";
import type { Report, ReportStatus } from "@/lib/reports";
import type { DashboardStats, SosAlert } from "@/hooks/use-dashboard-data";
import { cn } from "@/lib/utils";

type Props = {
  reports: Report[];
  allReports: Report[];
  stats: DashboardStats;
  sosAlerts: SosAlert[];
  hotspots: { lat: number; lng: number; report_count: number }[];
  weeklyData: { label: string; crime: number; infrastructure: number; accident: number }[];
  onStatusChange: (id: string, status: ReportStatus) => void;
};

type InfraCategory = {
  icon: typeof Construction;
  labelKey: string;
  subtypes: string[];
  color: string;
};

const INFRA_CATEGORIES: InfraCategory[] = [
  { icon: Construction, labelKey: "ccRoadDamage", subtypes: ["road"], color: "text-infra bg-infra-tint" },
  { icon: Droplets, labelKey: "ccDrainage", subtypes: ["drain", "waterlogging"], color: "text-primary bg-primary-tint" },
  { icon: AlertTriangle, labelKey: "openManhole", subtypes: ["manhole"], color: "text-crime bg-crime-tint" },
  { icon: Lamp, labelKey: "ccStreetLights", subtypes: ["streetlight"], color: "text-pending bg-pending-tint" },
];

export function CityCorpDashboard({
  reports,
  allReports,
  stats,
  sosAlerts,
  hotspots,
  weeklyData,
  onStatusChange,
}: Props) {
  const { t, lang } = useApp();
  const [section, setSection] = useState("dashboard");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Infrastructure breakdown
  const infraCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const cat of INFRA_CATEGORIES) {
      map[cat.labelKey] = allReports.filter(
        (r) => r.subtype && cat.subtypes.includes(r.subtype),
      ).length;
    }
    return map;
  }, [allReports]);

  // Department performance
  const deptPerf = useMemo(() => {
    const crime = allReports.filter((r) => r.type === "crime");
    const infra = allReports.filter((r) => r.type === "infrastructure");
    const accident = allReports.filter((r) => r.type === "accident");
    return [
      {
        name: t("police"),
        total: crime.length,
        resolved: crime.filter((r) => r.status === "resolved").length,
      },
      {
        name: t("roleDmb"),
        total: accident.length,
        resolved: accident.filter((r) => r.status === "resolved").length,
      },
      {
        name: t("roleCityCorp"),
        total: infra.length,
        resolved: infra.filter((r) => r.status === "resolved").length,
      },
    ];
  }, [allReports, t]);

  const content = () => {
    switch (section) {
      case "map":
        return (
          <DashboardMap
            reports={allReports}
            hotspots={hotspots}
            onSelect={setSelectedReport}
            height="h-[calc(100vh-120px)]"
          />
        );

      case "reports":
        return (
          <ReportQueue
            reports={allReports}
            onSelect={setSelectedReport}
            onStatusChange={onStatusChange}
          />
        );

      case "analytics":
        return (
          <div className="grid gap-6 md:grid-cols-2">
            <WeeklyChart data={weeklyData} />
            <CategoryPieChart stats={stats} />
            <ResolutionRateChart stats={stats} />
            <ResponseTimeChart />
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            {/* Executive Overview Header */}
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Shield className="size-5" />
              </div>
              <div>
                <h2 className="font-display text-lg">{t("ccExecOverview")}</h2>
                <p className="text-xs text-muted-foreground">
                  {t("roleCityCorp")} · {new Date().toLocaleDateString(lang === "bn" ? "bn-BD" : "en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                </p>
              </div>
            </div>

            {/* KPI Cards */}
            <KPIGrid>
              <KPICard
                label={t("kpiTotalReports")}
                value={stats.totalReports}
                icon={<FileText className="size-5" />}
                color="primary"
                delay={0}
              />
              <KPICard
                label={t("kpiOpenReports")}
                value={stats.openReports}
                icon={<Clock className="size-5" />}
                color="pending"
                delay={80}
              />
              <KPICard
                label={t("kpiResolvedToday")}
                value={stats.resolvedToday}
                icon={<CheckCircle2 className="size-5" />}
                color="resolved"
                trend={{ value: 15, label: "vs yesterday" }}
                delay={160}
              />
              <KPICard
                label={t("kpiHighPriority")}
                value={stats.highPriority}
                icon={<AlertTriangle className="size-5" />}
                color="crime"
                delay={240}
              />
            </KPIGrid>

            {/* Map & Sidebar panels */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <DashboardMap
                  reports={allReports}
                  hotspots={hotspots}
                  onSelect={setSelectedReport}
                />
              </div>

              <div className="space-y-4">
                {/* Infrastructure Breakdown */}
                <div className="rounded-2xl border border-border bg-card p-5 shadow-card animate-slide-in-up">
                  <h3 className="flex items-center gap-2 font-display text-sm">
                    <Building2 className="size-4 text-infra" />
                    {t("ccInfraIssues")}
                  </h3>
                  <div className="mt-4 space-y-2">
                    {INFRA_CATEGORIES.map((cat) => {
                      const count = infraCounts[cat.labelKey] ?? 0;
                      return (
                        <div
                          key={cat.labelKey}
                          className="flex items-center gap-3 rounded-xl bg-muted/50 px-3 py-2.5"
                        >
                          <div
                            className={cn(
                              "flex size-8 items-center justify-center rounded-lg",
                              cat.color,
                            )}
                          >
                            <cat.icon className="size-4" />
                          </div>
                          <span className="flex-1 text-xs font-medium">{t(cat.labelKey)}</span>
                          <span className="font-display text-sm">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Department Performance */}
                <div className="rounded-2xl border border-border bg-card p-5 shadow-card animate-slide-in-up" style={{ animationDelay: "100ms" }}>
                  <h3 className="flex items-center gap-2 font-display text-sm">
                    <BarChart3 className="size-4 text-primary" />
                    {t("ccDeptPerformance")}
                  </h3>
                  <div className="mt-4 space-y-3">
                    {deptPerf.map((dept) => {
                      const rate = dept.total > 0 ? Math.round((dept.resolved / dept.total) * 100) : 0;
                      return (
                        <div key={dept.name} className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium">{dept.name}</span>
                            <span className="text-muted-foreground">
                              {dept.resolved}/{dept.total} · {rate}%
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-muted">
                            <div
                              className="h-2 rounded-full bg-primary transition-all duration-700"
                              style={{ width: `${rate}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* All Reports Queue */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 font-display text-sm">
                <FileText className="size-4 text-primary" />
                {t("allStreams")}
              </h3>
              <ReportQueue
                reports={allReports}
                onSelect={setSelectedReport}
                onStatusChange={onStatusChange}
              />
            </div>

            {/* Analytics Grid */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 font-display text-sm">
                <TrendingUp className="size-4 text-primary" />
                {t("dbSideAnalytics")}
              </h3>
              <div className="grid gap-6 md:grid-cols-2">
                <WeeklyChart data={weeklyData} />
                <CategoryPieChart stats={stats} />
                <ResolutionRateChart stats={stats} />
                <ResponseTimeChart />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <DashboardShell
      activeSection={section}
      onSectionChange={setSection}
      reports={allReports}
      onReportSelect={setSelectedReport}
    >
      {content()}

      <ReportDetail
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
        onStatusChange={onStatusChange}
      />
    </DashboardShell>
  );
}
