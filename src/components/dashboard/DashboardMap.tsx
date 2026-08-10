import { useState, useMemo } from "react";
import MapCanvas from "@/components/map/MapCanvas";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/app-context";
import type { Report, ReportType } from "@/lib/reports";
import { Layers, Flame, ShieldAlert, TriangleAlert, CarFront } from "lucide-react";

type Props = {
  reports: Report[];
  hotspots?: { lat: number; lng: number; report_count: number }[];
  onSelect?: (r: Report) => void;
  className?: string;
  height?: string;
};

const TYPE_FILTERS: { key: "all" | ReportType; icon: typeof Layers; labelKey: string }[] = [
  { key: "all", icon: Layers, labelKey: "all" },
  { key: "crime", icon: ShieldAlert, labelKey: "crime" },
  { key: "infrastructure", icon: TriangleAlert, labelKey: "infrastructure" },
  { key: "accident", icon: CarFront, labelKey: "accident" },
];

export function DashboardMap({
  reports,
  hotspots = [],
  onSelect,
  className,
  height = "h-[400px]",
}: Props) {
  const { t } = useApp();
  const [typeFilter, setTypeFilter] = useState<"all" | ReportType>("all");
  const [showHeat, setShowHeat] = useState(true);

  const filtered = useMemo(
    () => (typeFilter === "all" ? reports : reports.filter((r) => r.type === typeFilter)),
    [reports, typeFilter],
  );

  return (
    <div
      className={cn(
        "relative isolate z-0 overflow-hidden rounded-2xl border border-border bg-card shadow-card",
        className,
      )}
    >
      {/* Filter controls */}
      <div className="absolute left-3 top-3 z-[1000] flex flex-wrap items-center gap-1.5">
        {TYPE_FILTERS.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => setTypeFilter(f.key)}
            className={cn(
              "flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-medium shadow-card backdrop-blur-md transition-colors",
              typeFilter === f.key
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card/90 text-muted-foreground hover:bg-card",
            )}
          >
            <f.icon className="size-3.5" />
            <span className="hidden sm:inline">{t(f.labelKey)}</span>
          </button>
        ))}
        <button
          type="button"
          onClick={() => setShowHeat((h) => !h)}
          className={cn(
            "flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-xs font-medium shadow-card backdrop-blur-md transition-colors",
            showHeat
              ? "border-crime bg-crime-tint text-crime-deep"
              : "border-border bg-card/90 text-muted-foreground hover:bg-card",
          )}
        >
          <Flame className="size-3.5" />
          <span className="hidden sm:inline">{t("heatmap")}</span>
        </button>
      </div>

      {/* Status legend */}
      <div className="absolute bottom-3 left-3 z-[1000] flex items-center gap-3 rounded-xl border border-border bg-card/90 px-3 py-1.5 text-[10px] font-medium shadow-card backdrop-blur-md">
        <span className="flex items-center gap-1">
          <span className="size-2.5 rounded-full bg-crime" /> {t("crime")}
        </span>
        <span className="flex items-center gap-1">
          <span className="size-2.5 rounded-full bg-infra" /> {t("infrastructure")}
        </span>
        <span className="flex items-center gap-1">
          <span className="size-2.5 rounded-full bg-accent" /> {t("accident")}
        </span>
      </div>

      <MapCanvas
        reports={filtered}
        hotspots={showHeat ? hotspots : []}
        onSelect={onSelect}
        className={cn("w-full", height)}
      />
    </div>
  );
}
