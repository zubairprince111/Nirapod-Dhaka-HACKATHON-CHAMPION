import { useState, useMemo } from "react";
import {
  CheckCircle2,
  Clock,
  ExternalLink,
  Eye,
  Filter,
  MapPin,
  MoreHorizontal,
  SortAsc,
  ThumbsUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/app-context";
import { TypeBadge, StatusPill } from "@/components/Badges";
import type { Report, ReportType, ReportStatus } from "@/lib/reports";
import { subtypeLabel, timeAgo } from "@/lib/reports";
import { useReportVotes } from "@/hooks/use-dashboard-data";

type Props = {
  reports: Report[];
  onSelect: (r: Report) => void;
  onStatusChange?: (id: string, status: ReportStatus) => void;
  showActions?: boolean;
};

type SortMode = "newest" | "oldest";
type FilterType = "all" | ReportType;
type FilterStatus = "all" | ReportStatus;

export function ReportQueue({ reports, onSelect, onStatusChange, showActions = true }: Props) {
  const { t, lang } = useApp();
  const [search, setSearch] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...reports];

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.description.toLowerCase().includes(q) ||
          r.area_name?.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.subtype?.toLowerCase().includes(q),
      );
    }

    // Type filter
    if (filterType !== "all") result = result.filter((r) => r.type === filterType);

    // Status filter
    if (filterStatus !== "all") result = result.filter((r) => r.status === filterStatus);

    // Sort
    result.sort((a, b) => {
      const ta = new Date(a.created_at).getTime();
      const tb = new Date(b.created_at).getTime();
      return sortMode === "newest" ? tb - ta : ta - tb;
    });

    return result;
  }, [reports, search, sortMode, filterType, filterStatus]);

  const reportIds = useMemo(() => filtered.slice(0, 20).map((r) => r.id), [filtered]);
  const { data: votesMap } = useReportVotes(reportIds);

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card shadow-card">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
        <div className="relative flex-1">
          <MapPin className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchGlobal")}
            className="w-full rounded-xl border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring"
          />
        </div>

        <button
          type="button"
          onClick={() => setShowFilters((f) => !f)}
          className={cn(
            "flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition-colors",
            showFilters
              ? "border-primary bg-primary-tint text-primary-deep"
              : "border-border text-muted-foreground hover:bg-muted",
          )}
        >
          <Filter className="size-3.5" />
          {t("filterBy")}
        </button>

        <button
          type="button"
          onClick={() => setSortMode((m) => (m === "newest" ? "oldest" : "newest"))}
          className="flex items-center gap-1.5 rounded-xl border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted"
        >
          <SortAsc className="size-3.5" />
          {t(sortMode)}
        </button>
      </div>

      {/* Filter chips */}
      {showFilters && (
        <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-2 animate-slide-in-up">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t("chooseType")}
          </span>
          {(["all", "crime", "infrastructure", "accident"] as const).map((ft) => (
            <button
              key={ft}
              type="button"
              onClick={() => setFilterType(ft)}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                filterType === ft
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-border",
              )}
            >
              {ft === "all" ? t("all") : t(ft)}
            </button>
          ))}
          <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {t("status")}
          </span>
          {(["all", "sent", "received", "resolved"] as const).map((fs) => (
            <button
              key={fs}
              type="button"
              onClick={() => setFilterStatus(fs)}
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-medium transition-colors",
                filterStatus === fs
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-border",
              )}
            >
              {fs === "all" ? t("all") : t(fs)}
            </button>
          ))}
        </div>
      )}

      {/* Report list */}
      <div className="db-scroll max-h-[520px] overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">{t("noItems")}</div>
        ) : (
          filtered.slice(0, 50).map((r, i) => {
            const votes = votesMap?.[r.id];
            return (
              <div
                key={r.id}
                className="db-report-row flex items-center gap-3 border-b border-border px-4 py-3 last:border-b-0 animate-fade-in cursor-pointer"
                style={{ animationDelay: `${Math.min(i, 10) * 30}ms` }}
                onClick={() => onSelect(r)}
              >
                {/* Photo thumbnail */}
                {r.photo_url ? (
                  <div className="size-12 shrink-0 overflow-hidden rounded-xl bg-muted">
                    <div className="flex size-full items-center justify-center text-xs text-muted-foreground">
                      <Eye className="size-4" />
                    </div>
                  </div>
                ) : (
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-muted">
                    <MapPin className="size-5 text-muted-foreground" />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium">
                      {r.description.slice(0, 50) || subtypeLabel(r.subtype, lang)}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span className="truncate max-w-[120px]">
                      {r.area_name ?? `${r.lat.toFixed(3)}, ${r.lng.toFixed(3)}`}
                    </span>
                    <span>·</span>
                    <span>{timeAgo(r.created_at, lang)}</span>
                    {votes && (
                      <>
                        <span>·</span>
                        <span className="flex items-center gap-0.5">
                          <ThumbsUp className="size-3" />
                          {votes.confirm}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Badges */}
                <div className="hidden items-center gap-2 sm:flex">
                  <TypeBadge type={r.type} />
                  <StatusPill status={r.status} />
                </div>

                {/* Actions */}
                {showActions && (
                  <div className="hidden items-center gap-1 lg:flex">
                    {r.status === "sent" && onStatusChange && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onStatusChange(r.id, "received");
                        }}
                        className="rounded-lg bg-primary-tint px-2.5 py-1.5 text-xs font-semibold text-primary-deep transition-colors hover:bg-primary hover:text-primary-foreground"
                      >
                        {t("actionReceive")}
                      </button>
                    )}
                    {r.status === "received" && onStatusChange && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onStatusChange(r.id, "resolved");
                        }}
                        className="rounded-lg bg-resolved-tint px-2.5 py-1.5 text-xs font-semibold text-resolved-deep transition-colors hover:bg-resolved hover:text-white"
                      >
                        {t("actionResolve")}
                      </button>
                    )}
                    <a
                      href={`https://www.google.com/maps?q=${r.lat},${r.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="rounded-lg bg-muted p-1.5 text-muted-foreground transition-colors hover:bg-border hover:text-foreground"
                      title={t("actionNavigate")}
                    >
                      <ExternalLink className="size-3.5" />
                    </a>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer count */}
      <div className="border-t border-border px-4 py-2 text-xs text-muted-foreground">
        {filtered.length} {t("dbSideReports").toLowerCase()}
      </div>
    </div>
  );
}
