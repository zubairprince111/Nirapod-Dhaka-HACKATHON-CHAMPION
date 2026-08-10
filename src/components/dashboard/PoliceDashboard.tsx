import { useState } from "react";
import {
  AlertTriangle,
  Clock,
  FileText,
  MapPin,
  Shield,
  ShieldAlert,
  Siren,
  TrendingUp,
  Users,
} from "lucide-react";
import { useApp } from "@/lib/app-context";
import { KPICard, KPIGrid } from "./KPICards";
import { ReportQueue } from "./ReportQueue";
import { DashboardMap } from "./DashboardMap";
import { ReportDetail } from "./ReportDetail";
import { WeeklyChart, CategoryPieChart, ResolutionRateChart, ResponseTimeChart } from "./AnalyticsCharts";
import { DashboardShell } from "./DashboardShell";
import type { Report, ReportStatus } from "@/lib/reports";
import type { DashboardStats, SosAlert } from "@/hooks/use-dashboard-data";
import { timeAgo } from "@/lib/reports";
import { cn } from "@/lib/utils";

type Props = {
  reports: Report[];
  stats: DashboardStats;
  sosAlerts: SosAlert[];
  hotspots: { lat: number; lng: number; report_count: number }[];
  weeklyData: { label: string; crime: number; infrastructure: number; accident: number }[];
  onStatusChange: (id: string, status: ReportStatus) => void;
};

export function PoliceDashboard({
  reports,
  stats,
  sosAlerts,
  hotspots,
  weeklyData,
  onStatusChange,
}: Props) {
  const { t, lang } = useApp();
  const [section, setSection] = useState("dashboard");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

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

      case "settings":
        return (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-muted-foreground">
            <Settings className="mx-auto size-12 text-muted-foreground/50" />
            <p className="mt-4 font-display text-lg">{t("dbSideSettings")}</p>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            {/* SOS Alert Banner */}
            {sosAlerts.length > 0 && (
              <div className="rounded-2xl border-2 border-crime bg-crime-tint p-4 animate-slide-in-up">
                <div className="flex items-center gap-3">
                  <div className="db-sos-pulse flex size-12 items-center justify-center rounded-2xl bg-crime text-white">
                    <Siren className="size-6" />
                  </div>
                  <div className="flex-1">
                    <p className="font-display text-sm text-crime-deep">
                      {t("policeActiveSos")} — {sosAlerts.length} {t("kpiSosAlerts").toLowerCase()}
                    </p>
                    <div className="mt-1 flex flex-wrap gap-2">
                      {sosAlerts.slice(0, 3).map((s) => (
                        <span
                          key={s.id}
                          className="inline-flex items-center gap-1.5 rounded-full bg-crime/10 px-2.5 py-1 text-xs font-medium text-crime-deep"
                        >
                          <MapPin className="size-3" />
                          {s.lat.toFixed(3)}, {s.lng.toFixed(3)} · {timeAgo(s.created_at, lang)}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* KPI Cards */}
            <KPIGrid>
              <KPICard
                label={t("kpiOpenReports")}
                value={stats.openReports}
                icon={<FileText className="size-5" />}
                color="primary"
                delay={0}
              />
              <KPICard
                label={t("kpiSosAlerts")}
                value={stats.sosActive}
                icon={<Siren className="size-5" />}
                color="sos"
                delay={80}
              />
              <KPICard
                label={t("kpiResolvedToday")}
                value={stats.resolvedToday}
                icon={<Shield className="size-5" />}
                color="resolved"
                trend={{ value: 12, label: "vs yesterday" }}
                delay={160}
              />
              <KPICard
                label={t("kpiAvgResponse")}
                value={stats.avgResponseMin}
                icon={<Clock className="size-5" />}
                color="pending"
                delay={240}
              />
            </KPIGrid>

            {/* Map & Hotspots */}
            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <DashboardMap
                  reports={reports}
                  hotspots={hotspots}
                  onSelect={setSelectedReport}
                />
              </div>

              {/* High Risk Hotspots Panel */}
              <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <h3 className="flex items-center gap-2 font-display text-sm">
                  <AlertTriangle className="size-4 text-crime" />
                  {t("policeHighRisk")}
                </h3>
                <div className="mt-4 space-y-3">
                  {hotspots.length === 0 ? (
                    <p className="text-xs text-muted-foreground">{t("noItems")}</p>
                  ) : (
                    hotspots.slice(0, 5).map((h, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 rounded-xl bg-crime-tint/50 px-3 py-2.5"
                      >
                        <div className="flex size-8 items-center justify-center rounded-lg bg-crime/10 text-crime-deep">
                          <ShieldAlert className="size-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium">
                            {h.lat.toFixed(3)}, {h.lng.toFixed(3)}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {h.report_count} reports in 48h
                          </p>
                        </div>
                        <span className="rounded-full bg-crime/10 px-2 py-0.5 text-[10px] font-semibold text-crime-deep">
                          High
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Report Queue */}
            <div>
              <h3 className="mb-3 flex items-center gap-2 font-display text-sm">
                <FileText className="size-4 text-primary" />
                {t("crimeFeed")}
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

// Placeholder for settings icon usage in switch case
function Settings({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}
