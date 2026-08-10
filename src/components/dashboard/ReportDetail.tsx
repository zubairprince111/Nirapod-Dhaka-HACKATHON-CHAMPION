import { useState, useEffect } from "react";
import {
  CheckCircle2,
  ExternalLink,
  MapPin,
  MessageSquare,
  Send,
  ThumbsDown,
  ThumbsUp,
  X,
  Navigation,
  Shield,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/app-context";
import { TypeBadge, StatusPill } from "@/components/Badges";
import type { Report, ReportStatus } from "@/lib/reports";
import { subtypeLabel, timeAgo, photoUrl } from "@/lib/reports";
import { fetchVotes } from "@/lib/reports";
import { ActivityTimeline, statusToStageIndex } from "./ActivityTimeline";

type Props = {
  report: Report | null;
  onClose: () => void;
  onStatusChange?: (id: string, status: ReportStatus) => void;
};

export function ReportDetail({ report, onClose, onStatusChange }: Props) {
  const { t, lang } = useApp();
  const [votes, setVotes] = useState<{ confirm: number; dispute: number } | null>(null);
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<{ text: string; time: string }[]>([]);
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!report) return;
    setVotes(null);
    setImgUrl(null);
    setNotes([]);
    void fetchVotes(report.id).then((v) => setVotes({ confirm: v.confirm, dispute: v.dispute }));
    void photoUrl(report.photo_url).then(setImgUrl);
  }, [report?.id]);

  if (!report) return null;

  const stageIndex = statusToStageIndex(report.status);

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-foreground/10 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg overflow-y-auto border-l border-border bg-card shadow-elevated animate-slide-in-right db-scroll">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/95 px-5 py-4 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <TypeBadge type={report.type} />
            <StatusPill status={report.status} />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-6 p-5">
          {/* Photo */}
          {imgUrl ? (
            <div className="overflow-hidden rounded-2xl border border-border">
              <img
                src={imgUrl}
                alt={report.description}
                className="w-full object-cover"
                style={{ maxHeight: 280 }}
              />
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-2xl bg-muted">
              <MapPin className="size-8 text-muted-foreground" />
            </div>
          )}

          {/* Title & Description */}
          <div>
            <h2 className="font-display text-lg">
              {subtypeLabel(report.subtype, lang) || t(report.type)}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{report.description}</p>
          </div>

          {/* Location */}
          <div className="flex items-start gap-3 rounded-xl border border-border bg-background p-3">
            <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
            <div className="flex-1 text-sm">
              <p className="font-medium">{report.area_name ?? "Unknown area"}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {report.lat.toFixed(6)}, {report.lng.toFixed(6)}
              </p>
            </div>
            <a
              href={`https://www.google.com/maps?q=${report.lat},${report.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-primary-tint p-2 text-primary-deep transition-colors hover:bg-primary hover:text-white"
            >
              <Navigation className="size-4" />
            </a>
          </div>

          {/* Meta row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-muted p-3 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t("status")}
              </p>
              <p className="mt-1 text-sm font-semibold">{t(report.status)}</p>
            </div>
            <div className="rounded-xl bg-muted p-3 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t("verificationScore")}
              </p>
              <p className="mt-1 flex items-center justify-center gap-1 text-sm font-semibold">
                <ThumbsUp className="size-3.5 text-resolved" />
                {votes?.confirm ?? "—"}
                <ThumbsDown className="ml-1 size-3.5 text-crime" />
                {votes?.dispute ?? "—"}
              </p>
            </div>
            <div className="rounded-xl bg-muted p-3 text-center">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                <Clock className="inline size-3" /> Time
              </p>
              <p className="mt-1 text-sm font-semibold">{timeAgo(report.created_at, lang)}</p>
            </div>
          </div>

          {/* Activity Timeline */}
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <Shield className="size-4 text-primary" />
              {t("activityTimeline")}
            </h3>
            <ActivityTimeline currentStageIndex={stageIndex} createdAt={report.created_at} />
          </div>

          {/* Internal Notes */}
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
              <MessageSquare className="size-4 text-primary" />
              {t("internalNotes")}
            </h3>
            {notes.length === 0 ? (
              <p className="text-xs text-muted-foreground">{t("noItems")}</p>
            ) : (
              <div className="space-y-2">
                {notes.map((n, i) => (
                  <div key={i} className="rounded-xl bg-muted p-3">
                    <p className="text-sm">{n.text}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground">{n.time}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={t("addNote")}
                className="flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && note.trim()) {
                    setNotes((prev) => [
                      ...prev,
                      { text: note.trim(), time: new Date().toLocaleString() },
                    ]);
                    setNote("");
                  }
                }}
              />
              <button
                type="button"
                onClick={() => {
                  if (note.trim()) {
                    setNotes((prev) => [
                      ...prev,
                      { text: note.trim(), time: new Date().toLocaleString() },
                    ]);
                    setNote("");
                  }
                }}
                className="rounded-xl bg-primary px-3 py-2 text-primary-foreground transition-colors hover:bg-primary-deep"
              >
                <Send className="size-4" />
              </button>
            </div>
          </div>

          {/* Action buttons */}
          {onStatusChange && (
            <div className="flex flex-wrap gap-2 border-t border-border pt-4">
              {report.status === "sent" && (
                <button
                  type="button"
                  onClick={() => onStatusChange(report.id, "received")}
                  className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-deep"
                >
                  <CheckCircle2 className="size-4" />
                  {t("actionReceive")}
                </button>
              )}
              {report.status === "received" && (
                <button
                  type="button"
                  onClick={() => onStatusChange(report.id, "resolved")}
                  className="flex items-center gap-2 rounded-xl bg-resolved px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-resolved-deep"
                >
                  <CheckCircle2 className="size-4" />
                  {t("actionResolve")}
                </button>
              )}
              <a
                href={`https://www.google.com/maps?q=${report.lat},${report.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
              >
                <ExternalLink className="size-4" />
                {t("actionNavigate")}
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
