import { useState } from "react";
import {
  AlertTriangle,
  Building2,
  Clock,
  CloudRain,
  FileText,
  Flame,
  MapPin,
  Shield,
  Zap,
} from "lucide-react";
import { useApp } from "@/lib/app-context";
import { KPICard, KPIGrid } from "./KPICards";
import { ReportQueue } from "./ReportQueue";
import { DashboardMap } from "./DashboardMap";
import { ReportDetail } from "./ReportDetail";
import { WeeklyChart, CategoryPieChart, ResolutionRateChart, ResponseTimeChart } from "./AnalyticsCharts";
import { DashboardShell } from "./DashboardShell";
import type { Report, ReportStatus } from "@/lib/reports";
import type { DashboardStats } from "@/hooks/use-dashboard-data";
import { subtypeLabel, timeAgo } from "@/lib/reports";
import { cn } from "@/lib/utils";

type Props = {
  reports: Report[];
  stats: DashboardStats;
  hotspots: { lat: number; lng: number; report_count: number }[];
  weeklyData: { label: string; crime: number; infrastructure: number; accident: number }[];
  onStatusChange: (id: string, status: ReportStatus) => void;
};

export function DMBDashboard({
  reports,
  stats,
  hotspots,
  weeklyData,
  onStatusChange,
}: Props) {
  const { t, lang } = useApp();
  const [section, setSection] = useState("dashboard");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Categorize disaster reports
  const floods = reports.filter((r) => r.subtype === "waterlogging");
  const fires = reports.filter((r) => r.subtype === "fire");
  const collapses = reports.filter((r) => r.subtype === "building");
  const emergencies = reports.filter((r) => r.status === "sent");

  const content = () => {
    switch (section) {
      case "map":
        return (
          <DashboardMap
            reports={reports}
            hotspots={hotspots}
            onSelect={setSelectedReport}
            height="h-[calc(100vh-120px)]"
          />
        );

      case "reports":
        return (
          <ReportQueue
            reports={reports}
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
            {/* Emergency Banner */}
            {emergencies.length > 3 && (
              <div className="flex items-center gap-3 rounded-2xl border-2 border-infra bg-infra-tint p-4 animate-slide-in-up">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-infra text-white">
                  <Zap className="size-6" />
                </div>
                <div>
                  <p className="font-display text-sm text-infra-deep">
                    {emergencies.length} {t("dmbEmergencyReq").toLowerCase()}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Multiple unacknowledged emergency reports require attention
                  </p>
                </div>
              </div>
            )}

            {/* KPI Cards */}
            <KPIGrid>
              <KPICard
                label={t("dmbFloodReports")}
                value={floods.length}
                icon={<CloudRain className="size-5" />}
                color="primary"
                delay={0}
              />
              <KPICard
                label={t("dmbFireReports")}
                value={fires.length}
                icon={<Flame className="size-5" />}
                color="crime"
                delay={80}
              />
              <KPICard
                label={t("dmbCollapseReports")}
                value={collapses.length}
                icon={<Building2 className="size-5" />}
                color="pending"
                delay={160}
              />
              <KPICard
                label={t("kpiResolvedToday")}
                value={stats.resolvedToday}
                icon={<Shield className="size-5" />}
                color="resolved"
                trend={{ value: 8, label: "vs yesterday" }}
                delay={240}
              />
            </KPIGrid>

            {/* Map & Hazard Zones */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <DashboardMap
                  reports={reports}
                  hotspots={hotspots}
                  onSelect={setSelectedReport}
                />
              </div>

              {/* Disaster Breakdown */}
              <div className="space-y-4">
                <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
                  <h3 className="flex items-center gap-2 font-display text-sm">
                    <AlertTriangle className="size-4 text-infra" />
                    {t("dmbHazardZones")}
                  </h3>
                  <div className="mt-4 space-y-2">
                    {[
                      { icon: CloudRain, label: t("dmbFloodReports"), count: floods.length, color: "text-primary bg-primary-tint" },
                      { icon: Flame, label: t("dmbFireReports"), count: fires.length, color: "text-crime bg-crime-tint" },
                      { icon: Building2, label: t("dmbCollapseReports"), count: collapses.length, color: "text-infra bg-infra-tint" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center gap-3 rounded-xl bg-muted/50 px-3 py-2.5"
                      >
                        <div
                          className={cn(
                            "flex size-8 items-center justify-center rounded-lg",
                            item.color,
                          )}
                        >
                          <item.icon className="size-4" />
                        </div>
                        <span className="flex-1 text-xs font-medium">{item.label}</span>
                        <span className="font-display text-sm">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Emergency Requests */}
                <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
                  <h3 className="flex items-center gap-2 font-display text-sm">
                    <Zap className="size-4 text-infra" />
                    {t("dmbEmergencyReq")}
                  </h3>
                  <div className="mt-4 space-y-2 db-scroll max-h-48 overflow-y-auto">
                    {emergencies.length === 0 ? (
                      <p className="text-xs text-muted-foreground">{t("noItems")}</p>
                    ) : (
                      emergencies.slice(0, 5).map((r) => (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setSelectedReport(r)}
                          className="flex w-full items-center gap-3 rounded-xl bg-muted/50 px-3 py-2.5 text-left transition-colors hover:bg-muted"
                        >
                          <MapPin className="size-4 shrink-0 text-muted-foreground" />
                          <div className="flex-1 min-w-0">
                            <p className="truncate text-xs font-medium">
                              {r.description.slice(0, 40) || subtypeLabel(r.subtype, lang)}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {r.area_name ?? ""} · {timeAgo(r.created_at, lang)}
                            </p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Report Queue */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 font-display text-sm">
                <FileText className="size-4 text-primary" />
                {t("dmbCoordination")}
              </h3>
              <ReportQueue
                reports={reports}
                onSelect={setSelectedReport}
                onStatusChange={onStatusChange}
              />
            </div>

            {/* Charts */}
            <div className="grid gap-6 md:grid-cols-2">
              <WeeklyChart data={weeklyData} />
              <ResolutionRateChart stats={stats} />
            </div>
          </div>
        );
    }
  };

  return (
    <DashboardShell
      activeSection={section}
      onSectionChange={setSection}
      reports={reports}
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
