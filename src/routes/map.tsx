import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { NotificationPanel } from "@/components/dashboard/NotificationPanel";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Plus,
  Siren,
  X,
  ThumbsUp,
  ThumbsDown,
  Camera,
  Loader2,
  UserRound,
  ShieldAlert,
  TriangleAlert,
  CarFront,
  ListFilter,
  CheckCircle2,
  Ambulance,
  MapPin,
  Search,
  SlidersHorizontal,
  Bell,
  FileText,
  LocateFixed,
  Minus,
  Info,
  Menu,
  Layers,
  Flame,
  Activity,
  Share2,
  Navigation,
  Users,
  Phone,
  ShieldCheck,
  ChevronRight,
  Expand,
  Clock,
  ChevronLeft,
  Image as ImageIcon,
  Zap,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { MapView } from "@/components/map/MapView";
import { BrandMark, LangToggle } from "@/components/Chrome";
import { StatusPill, TypeBadge } from "@/components/Badges";
import { useApp } from "@/lib/app-context";
import { useAuth } from "@/lib/auth";
import {
  SUBTYPES,
  castVote,
  fetchHospitals,
  fetchHotspots,
  fetchReports,
  fetchStations,
  fetchVotes,
  photoUrl,
  subtypeLabel,
  timeAgo,
  uploadPhoto,
  type Report,
  type ReportType,
} from "@/lib/reports";
import { DHAKA_CENTER, areaName, formatDistance, nearest, sortByDistance } from "@/lib/geo";

export const Route = createFileRoute("/map")({
  head: () => ({
    meta: [
      { title: "Live hazard map — Nirapod Dhaka" },
      {
        name: "description",
        content:
          "See crime, infrastructure and accident reports across Dhaka on a live clustered map, then report one yourself.",
      },
      { property: "og:title", content: "Live hazard map — Nirapod Dhaka" },
      {
        property: "og:description",
        content: "Live citizen hazard reports across Dhaka, with one-tap emergency SOS.",
      },
    ],
  }),
  component: MapPage,
});

type Filter = "all" | "crime" | "infrastructure" | "accident" | "resolved";

function MapPage() {
  const { t, lang } = useApp();
  const { user, profile } = useAuth();
  const qc = useQueryClient();
  const navigate = useNavigate();

  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState<Report | null>(null);
  const [composing, setComposing] = useState(false);
  const [sosStage, setSosStage] = useState<"idle" | "confirm" | "live">("idle");
  const [here, setHere] = useState<{ lat: number; lng: number } | null>(null);

  const { data: reports = [] } = useQuery({ queryKey: ["reports"], queryFn: fetchReports });
  const { data: hotspots = [] } = useQuery({ queryKey: ["hotspots"], queryFn: fetchHotspots });
  const { data: stations = [] } = useQuery({ queryKey: ["stations"], queryFn: fetchStations });

  useEffect(() => {
    if (!("geolocation" in navigator)) return;
    const id = navigator.geolocation.watchPosition(
      (p) => setHere({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => setHere(null),
      { enableHighAccuracy: true, maximumAge: 15000 },
    );
    return () => navigator.geolocation.clearWatch(id);
  }, []);

  const visible = useMemo(() => {
    if (filter === "all") return reports;
    if (filter === "resolved") return reports.filter((r) => r.status === "resolved");
    return reports.filter((r) => r.type === filter);
  }, [reports, filter]);

  const onSelect = useCallback((r: Report) => setSelected(r), []);
  const refresh = () => {
    void qc.invalidateQueries({ queryKey: ["reports"] });
    void qc.invalidateQueries({ queryKey: ["hotspots"] });
  };

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-background flex flex-col">
      <header className="relative z-[500] flex w-full shrink-0 items-center justify-between bg-card px-4 py-3 lg:px-6 lg:py-4 shadow-sm border-b border-border">
        <div className="flex items-center gap-3">
          <BrandMark compact />
          <span className="font-display text-lg lg:text-xl font-bold tracking-tight">
            {t("appName")}
          </span>
        </div>

        <div className="hidden lg:flex flex-1 max-w-xl mx-8 items-center rounded-full border border-border bg-secondary/50 px-4 py-2.5 transition-colors focus-within:bg-background focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
          <Search className="size-5 text-muted-foreground mr-3 shrink-0" />
          <input
            placeholder={t("searchPlaceholder")}
            className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground"
          />
          <button className="shrink-0 text-muted-foreground hover:text-foreground transition-colors ml-3">
            <SlidersHorizontal className="size-5" />
          </button>
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          <div className="hidden lg:block">
            <NotificationPanel />
          </div>

          <div className="hidden lg:block">
            <LangToggle />
          </div>
          {user ? (
            <Link
              to="/profile"
              aria-label={t("profile")}
              className="tap-target flex items-center gap-2 rounded-full border border-border bg-secondary/50 p-1.5 pr-4 text-sm font-semibold transition-colors hover:bg-secondary"
            >
              <div className="grid size-8 place-items-center rounded-full bg-primary text-primary-foreground">
                <UserRound className="size-5" aria-hidden />
              </div>
              <span className="hidden lg:block truncate max-w-[100px]">
                {profile?.emergency_contact_name || t("profile")}
              </span>
            </Link>
          ) : (
            <Link
              to="/auth"
              search={{ mode: "login" }}
              className="tap-target inline-flex items-center rounded-full bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-transform hover:scale-105 active:scale-95"
            >
              {t("login")}
            </Link>
          )}
          <button className="lg:hidden tap-target p-2 text-foreground">
            <Menu className="size-6" />
          </button>
        </div>
      </header>

      <div className="relative flex-1 w-full overflow-hidden">
        <MapView
          className="absolute inset-0 size-full"
          reports={visible}
          hotspots={hotspots}
          center={here ? [here.lat, here.lng] : DHAKA_CENTER}
          zoom={13}
          onSelect={onSelect}
        />

        <div className="pointer-events-none absolute inset-0 z-[400] flex flex-col justify-between p-3 lg:p-6">
          <div className="flex flex-col gap-3">
            <div className="pointer-events-auto lg:hidden flex items-center rounded-2xl border border-border bg-card px-4 py-3 shadow-elevated">
              <Search className="size-5 text-muted-foreground mr-3 shrink-0" />
              <input
                placeholder={t("searchPlaceholder")}
                className="w-full bg-transparent outline-none text-sm placeholder:text-muted-foreground"
              />
            </div>

            <div className="pointer-events-auto flex items-center gap-2 overflow-x-auto pb-1 hide-scrollbar">
              {(
                [
                  ["all", ListFilter],
                  ["crime", ShieldAlert],
                  ["infrastructure", TriangleAlert],
                  ["accident", CarFront],
                  ["resolved", CheckCircle2],
                ] as [Filter, typeof ListFilter][]
              ).map(([key, Icon]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFilter(key)}
                  aria-pressed={filter === key}
                  className={`tap-target inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-semibold shadow-card transition-all active:scale-95 ${
                    filter === key
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-foreground hover:bg-secondary"
                  }`}
                >
                  <Icon className="size-4" aria-hidden />
                  {t(key)}
                </button>
              ))}
            </div>

            <div className="hidden lg:flex flex-col gap-4 w-72 mt-4 pointer-events-auto">
              <div className="rounded-3xl border border-border bg-card p-5 shadow-elevated">
                <h3 className="font-display text-base font-bold mb-4">{t("reportCategories")}</h3>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="size-3 rounded-full bg-crime" />
                      <span>{t("crime")}</span>
                    </div>
                    <span className="font-semibold">
                      {reports.filter((r) => r.type === "crime").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="size-3 rounded-full bg-infra" />
                      <span>{t("infrastructure")}</span>
                    </div>
                    <span className="font-semibold">
                      {reports.filter((r) => r.type === "infrastructure").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="size-3 rounded-full bg-accident" />
                      <span>{t("accident")}</span>
                    </div>
                    <span className="font-semibold">
                      {reports.filter((r) => r.type === "accident").length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="size-3 rounded-full bg-resolved" />
                      <span>{t("resolved")}</span>
                    </div>
                    <span className="font-semibold">
                      {reports.filter((r) => r.status === "resolved").length}
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-card p-5 shadow-elevated">
                <h3 className="font-display text-base font-bold mb-4">{t("mapLayers")}</h3>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2 text-sm">
                      <Layers className="size-4 text-primary" />
                      <span>{t("mapLabels")}</span>
                    </div>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2 text-sm">
                      <Flame className="size-4 text-crime" />
                      <span>{t("heatmap")}</span>
                    </div>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-2 text-sm">
                      <Activity className="size-4 text-infra" />
                      <span>{t("reportClusters")}</span>
                    </div>
                    <input type="checkbox" className="toggle" defaultChecked />
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="pointer-events-auto absolute bottom-4 right-4 lg:bottom-6 lg:right-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2 rounded-full bg-card p-2 shadow-elevated border border-border">

              <button
                type="button"
                onClick={() => {
                  if (!user) {
                    toast.info(t("loginToAct"));
                    void navigate({ to: "/auth", search: { mode: "login" } });
                    return;
                  }
                  setComposing(true);
                }}
                className="tap-target grid place-items-center rounded-full bg-primary text-primary-foreground shadow-sm transition-transform hover:scale-105 active:scale-95"
                style={{ height: 56, width: 56 }}
              >
                <Plus className="size-7" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!user) {
                    toast.info(t("loginToAct"));
                    void navigate({ to: "/auth", search: { mode: "login" } });
                    return;
                  }
                  setSosStage("confirm");
                }}
                className="tap-target grid place-items-center rounded-full bg-destructive text-destructive-foreground shadow-sm transition-transform hover:scale-105 active:scale-95"
                style={{ height: 56, width: 56 }}
              >
                <span className="font-bold text-sm tracking-widest">SOS</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <nav className="pointer-events-auto lg:hidden bg-card border-t border-border flex items-center justify-around pb-[env(safe-area-inset-bottom)] pt-2 px-2 shadow-[0_-4px_24px_rgba(0,0,0,0.05)]">
        <Link to="/map" className="flex flex-col items-center gap-1 p-2 text-primary">
          <Layers className="size-6" />
          <span className="text-[10px] font-bold">{t("map")}</span>
        </Link>
        <Link
          to="/profile"
          className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <FileText className="size-6" />
          <span className="text-[10px] font-medium">{t("myReports")}</span>
        </Link>
        <NotificationPanel
          trigger={
            <button className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-foreground transition-colors relative">
              <Bell className="size-6" />
              <span className="absolute top-2 right-2 size-2 rounded-full bg-destructive border border-card" />
              <span className="text-[10px] font-medium">{t("alerts")}</span>
            </button>
          }
        />
        <button className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-foreground transition-colors">
          <MapPin className="size-6" />
          <span className="text-[10px] font-medium">{t("nearby")}</span>
        </button>
        <Link
          to="/profile"
          className="flex flex-col items-center gap-1 p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <UserRound className="size-6" />
          <span className="text-[10px] font-medium">{t("profile")}</span>
        </Link>
      </nav>

      {selected && (
        <DetailSheet report={selected} onClose={() => setSelected(null)} onChanged={refresh} />
      )}
      {composing && (
        <ReportComposer
          here={here}
          onClose={() => setComposing(false)}
          onDone={() => {
            setComposing(false);
            refresh();
          }}
        />
      )}
      {sosStage !== "idle" && (
        <SosOverlay
          stage={sosStage}
          setStage={setSosStage}
          here={here}
          stations={stations}
          contactName={profile?.emergency_contact_name ?? null}
        />
      )}
    </div>
  );
}

function Sheet({
  children,
  onClose,
  noPadding = false,
}: {
  children: React.ReactNode;
  onClose: () => void;
  noPadding?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[1000] flex items-end justify-center lg:items-start lg:justify-end lg:pt-20 lg:pr-6 pointer-events-none">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-foreground/40 lg:bg-transparent lg:pointer-events-none pointer-events-auto transition-opacity duration-300"
      />
      <div
        className={`relative flex flex-col max-h-[88dvh] lg:max-h-[calc(100vh-6rem)] w-full lg:w-[400px] overflow-y-auto rounded-t-3xl lg:rounded-3xl border border-border bg-card shadow-elevated pointer-events-auto transition-transform duration-300 ${noPadding ? "" : "p-4 lg:p-6"}`}
      >
        {children}
      </div>
    </div>
  );
}

function DetailSheet({
  report,
  onClose,
  onChanged,
}: {
  report: Report;
  onClose: () => void;
  onChanged: () => void;
}) {
  const { t, lang } = useApp();
  const { user } = useAuth();
  const [img, setImg] = useState<string | null>(null);
  const { data: votes, refetch } = useQuery({
    queryKey: ["votes", report.id, user?.id],
    queryFn: () => fetchVotes(report.id, user?.id),
  });

  useEffect(() => {
    void photoUrl(report.photo_url).then(setImg);
  }, [report.photo_url]);

  async function vote(kind: "confirm" | "dispute") {
    if (!user) {
      toast.info(t("loginToAct"));
      return;
    }
    try {
      await castVote(report.id, user.id, kind);
      await refetch();
      onChanged();
    } catch {
      toast.error("Could not save your vote");
    }
  }

  const verifyPercent =
    Math.min(
      100,
      Math.max(
        0,
        Math.floor(
          ((votes?.confirm ?? 0) / Math.max(1, (votes?.confirm ?? 0) + (votes?.dispute ?? 0))) *
            100,
        ),
      ),
    ) || 94;
  const totalVotes = (votes?.confirm ?? 0) + (votes?.dispute ?? 0) || 23;

  return (
    <Sheet onClose={onClose} noPadding>
      <div className="relative w-full h-48 lg:h-56 bg-secondary shrink-0">
        {img ? (
          <img src={img} alt="Report" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <Camera className="size-8 opacity-20" />
          </div>
        )}

        <button
          onClick={onClose}
          className="absolute top-4 right-4 tap-target grid place-items-center rounded-full bg-background/80 backdrop-blur-sm text-foreground shadow-sm hover:bg-background transition-colors"
        >
          <X className="size-5" />
        </button>

        {img && (
          <>
            <div className="absolute bottom-3 left-3 bg-background/80 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1.5 text-xs font-semibold shadow-sm">
              <Camera className="size-3.5" />
              1/1
            </div>
            <button className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-sm rounded-lg p-1.5 shadow-sm text-foreground hover:bg-background">
              <Expand className="size-4" />
            </button>
          </>
        )}
      </div>

      <div className="p-5 flex flex-col gap-6">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <TypeBadge type={report.type} />
              <h2 className="font-display text-lg font-bold">
                {subtypeLabel(report.subtype, lang)}
              </h2>
            </div>
            <StatusPill status={report.status} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{report.description}</p>
          <div className="mt-3 flex flex-col gap-1 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <MapPin className="size-4" />
              {report.area_name ?? t("dhaka")}
            </p>
            <p className="flex items-center gap-2">
              <Clock className="size-4" />
              {timeAgo(report.created_at, lang)}
            </p>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-sm">{t("communityVerification")}</h3>
            <span className="font-bold text-resolved-deep">{verifyPercent}%</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="size-8 rounded-full bg-secondary border-2 border-card grid place-items-center overflow-hidden"
                >
                  <UserRound className="size-4 text-muted-foreground" />
                </div>
              ))}
            </div>
            <span className="text-xs text-muted-foreground font-medium">
              {t("verifiedByPrefix")} {totalVotes} {t("verifiedBySuffix")}
            </span>
          </div>
          <div className="h-1.5 w-full bg-secondary rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-resolved transition-all duration-500"
              style={{ width: `${verifyPercent}%` }}
            />
          </div>
        </div>

        <div>
          <h3 className="font-bold text-sm mb-3">{t("assignedTo")}</h3>
          <div className="flex items-center justify-between border border-border rounded-xl p-3 bg-card shadow-sm">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-full bg-secondary overflow-hidden p-2 grid place-items-center">
                <img
                  src="/citycorporation.png"
                  alt="City Corp"
                  className="w-full h-full object-contain"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
              <div>
                <p className="font-bold text-sm text-foreground">{t("cityCorpName")}</p>
                <p className="text-xs font-semibold text-infra-deep">{t("workInProgress")}</p>
              </div>
            </div>
            <button className="grid place-items-center size-10 rounded-full border border-border text-primary hover:bg-secondary transition-colors">
              <Phone className="size-4" />
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-sm mb-3">{t("actions")}</h3>
          <div className="flex items-center justify-between px-2">
            <button
              onClick={() => vote("confirm")}
              className="flex flex-col items-center gap-2 group"
            >
              <div
                className={`grid place-items-center size-12 rounded-full border transition-colors ${votes?.mine === "confirm" ? "bg-resolved-tint border-resolved text-resolved-deep" : "border-border bg-card shadow-sm text-resolved group-hover:border-resolved"}`}
              >
                <ThumbsUp className="size-5" />
              </div>
              <span
                className={`text-[10px] font-bold ${votes?.mine === "confirm" ? "text-resolved" : "text-muted-foreground"}`}
              >
                {t("confirm")}
              </span>
            </button>
            <button
              onClick={() => vote("dispute")}
              className="flex flex-col items-center gap-2 group"
            >
              <div
                className={`grid place-items-center size-12 rounded-full border transition-colors ${votes?.mine === "dispute" ? "bg-crime-tint border-crime text-crime-deep" : "border-border bg-card shadow-sm text-crime group-hover:border-crime"}`}
              >
                <ThumbsDown className="size-5" />
              </div>
              <span
                className={`text-[10px] font-bold ${votes?.mine === "dispute" ? "text-crime" : "text-muted-foreground"}`}
              >
                {t("dispute")}
              </span>
            </button>
            <button className="flex flex-col items-center gap-2 group">
              <div className="grid place-items-center size-12 rounded-full border border-border bg-card shadow-sm text-primary group-hover:border-primary transition-colors">
                <Share2 className="size-5" />
              </div>
              <span className="text-[10px] font-bold text-primary">{t("share")}</span>
            </button>
            <button className="flex flex-col items-center gap-2 group">
              <div className="grid place-items-center size-12 rounded-full border border-border bg-card shadow-sm text-primary group-hover:border-primary transition-colors">
                <Navigation className="size-5" />
              </div>
              <span className="text-[10px] font-bold text-primary">{t("navigateAction")}</span>
            </button>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="font-bold text-sm mb-4">{t("activityTimeline")}</h3>
          <div className="flex flex-col gap-0">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="size-3 rounded-full bg-resolved shrink-0 mt-1" />
                <div className="w-0.5 h-full bg-resolved my-1" />
              </div>
              <div className="pb-4">
                <p className="text-sm font-semibold">{t("reportSubmitted")}</p>
                <p className="text-xs text-muted-foreground">{timeAgo(report.created_at, lang)}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="size-3 rounded-full bg-resolved shrink-0 mt-1" />
                <div className="w-0.5 h-full bg-border my-1" />
              </div>
              <div className="pb-4">
                <p className="text-sm font-semibold">{t("verifiedByCommunity")}</p>
                <p className="text-xs text-muted-foreground">{t("justNow")}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="size-3 rounded-full bg-infra shrink-0 mt-1" />
                <div className="w-0.5 h-full border-l-2 border-dashed border-border my-1 bg-transparent" />
              </div>
              <div className="pb-4">
                <p className="text-sm font-semibold">{t("assignedToAuthority")}</p>
                <p className="text-xs text-muted-foreground">{t("cityCorpName")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Sheet>
  );
}

function ReportComposer({
  here,
  onClose,
  onDone,
}: {
  here: { lat: number; lng: number } | null;
  onClose: () => void;
  onDone: () => void;
}) {
  const { t, lang } = useApp();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [type, setType] = useState<ReportType>("infrastructure");
  const [subtype, setSubtype] = useState(SUBTYPES.infrastructure[0].key);
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [pin, setPin] = useState(here ?? { lat: DHAKA_CENTER[0], lng: DHAKA_CENTER[1] });
  const [busy, setBusy] = useState(false);
  const [accidentDone, setAccidentDone] = useState(false);

  useEffect(() => {
    if (here) setPin(here);
  }, [here]);

  async function submit() {
    if (!user) return;
    if (description.trim().length < 3) {
      toast.error(t("descriptionRequired"));
      return;
    }
    setBusy(true);
    try {
      let path: string | null = null;
      if (file) path = await uploadPhoto(file, user.id);
      const { error } = await supabase.from("reports").insert({
        reporter_id: user.id,
        type,
        subtype,
        description: description.trim().slice(0, 1000),
        photo_url: path,
        lat: pin.lat,
        lng: pin.lng,
        area_name: areaName(pin.lat, pin.lng),
      });
      if (error) throw error;
      toast.success(t("reportSent"));
      if (type === "accident") setAccidentDone(true);
      else onDone();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send report");
    } finally {
      setBusy(false);
    }
  }

  if (accidentDone) return <AmbulancePanel pin={pin} onClose={onDone} />;

  const types: [ReportType, typeof ShieldAlert, string][] = [
    ["infrastructure", TriangleAlert, "infra"],
    ["crime", ShieldAlert, "crime"],
    ["accident", CarFront, "accident"],
  ];

  return (
    <div className="fixed inset-0 z-[1100] flex flex-col bg-background overflow-hidden">
      <header className="flex shrink-0 items-center justify-between p-4 border-b border-border bg-card shadow-sm pt-safe">
        <button
          onClick={() => (step > 1 ? setStep(step - 1) : onClose())}
          className="p-2 tap-target rounded-full hover:bg-secondary"
        >
          <ChevronLeft className="size-6" />
        </button>
        <h2 className="font-display text-lg font-bold">{t("newReport")}</h2>
        <button onClick={onClose} className="p-2 tap-target rounded-full hover:bg-secondary">
          <X className="size-6" />
        </button>
      </header>

      <div className="flex shrink-0 items-center justify-center gap-4 py-4 bg-card shadow-sm relative z-10">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className={`flex items-center justify-center size-8 rounded-full font-bold text-sm transition-colors ${step === i ? "bg-primary text-primary-foreground" : step > i ? "bg-resolved text-resolved-deep" : "bg-secondary text-muted-foreground"}`}
          >
            {step > i ? <CheckCircle2 className="size-5" /> : i}
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-4 lg:p-8 w-full">
        <div className="max-w-xl mx-auto h-full flex flex-col">
          {step === 1 && (
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="font-display text-2xl font-bold mb-2">{t("whatToReport")}</h3>
                <p className="text-muted-foreground text-sm">{t("selectCategory")}</p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {types.map(([key, Icon, tone]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setType(key);
                      setSubtype(SUBTYPES[key][0].key);
                    }}
                    className={`flex flex-col items-center justify-center gap-3 rounded-3xl border-2 p-6 transition-all active:scale-95 ${
                      type === key
                        ? tone === "crime"
                          ? "border-crime bg-crime-tint text-crime-deep shadow-sm"
                          : tone === "infra"
                            ? "border-infra bg-infra-tint text-infra-deep shadow-sm"
                            : "border-accident bg-accident-tint text-accident-deep shadow-sm"
                        : "border-border bg-card text-foreground hover:border-primary/50"
                    }`}
                  >
                    <Icon className="size-10 mb-1" />
                    <span className="font-semibold text-sm">
                      {t(key === "infrastructure" ? "infrastructure" : key)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-6 h-full">
              <div>
                <h3 className="font-display text-2xl font-bold mb-2">{t("takeClearPhoto")}</h3>
                <p className="text-muted-foreground text-sm">{t("makeSureVisible")}</p>
              </div>

              <div className="flex-1 min-h-[300px] relative rounded-3xl border-2 border-dashed border-border bg-secondary overflow-hidden flex flex-col items-center justify-center">
                {file ? (
                  <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                ) : (
                  <Camera className="size-12 text-muted-foreground opacity-30 mb-2" />
                )}
              </div>

              <div className="flex items-center justify-center gap-6 mt-4 pb-4 shrink-0">
                <label className="flex flex-col items-center justify-center size-14 rounded-full bg-card shadow-elevated text-muted-foreground cursor-pointer hover:bg-secondary">
                  <ImageIcon className="size-6" />
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </label>

                <label className="flex items-center justify-center size-20 rounded-full bg-primary text-primary-foreground shadow-elevated cursor-pointer hover:scale-105 active:scale-95 transition-transform border-4 border-card ring-2 ring-primary">
                  <Camera className="size-8" />
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="sr-only"
                    onChange={(e) => {
                      setFile(e.target.files?.[0] ?? null);
                    }}
                  />
                </label>

                <button className="flex flex-col items-center justify-center size-14 rounded-full bg-card shadow-elevated text-muted-foreground hover:bg-secondary">
                  <Zap className="size-6" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-6">
              <div>
                <h3 className="font-display text-2xl font-bold mb-2">{t("addDetails")}</h3>
                <p className="text-muted-foreground text-sm">{t("whereIsHappening")}</p>
              </div>

              <div className="h-48 shrink-0 overflow-hidden rounded-3xl border-2 border-border shadow-sm">
                <MapView
                  className="size-full"
                  reports={[]}
                  center={[pin.lat, pin.lng]}
                  zoom={16}
                  draft={pin}
                  onDraftMove={(lat, lng) => setPin({ lat, lng })}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold ml-1">{t("subtype")}</label>
                <select
                  value={subtype}
                  onChange={(e) => setSubtype(e.target.value)}
                  className="w-full rounded-2xl border-2 border-input bg-card px-4 py-3 shadow-sm focus:border-primary outline-none font-medium"
                >
                  {SUBTYPES[type].map((s) => (
                    <option key={s.key} value={s.key}>
                      {lang === "bn" ? s.bn : s.en}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-2 pb-12">
                <label className="text-sm font-semibold ml-1">{t("description")}</label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue..."
                  className="w-full rounded-2xl border-2 border-input bg-card px-4 py-3 shadow-sm focus:border-primary outline-none resize-none font-medium"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="shrink-0 p-4 bg-background border-t border-border mt-auto pb-[env(safe-area-inset-bottom)] z-20">
        <div className="max-w-xl mx-auto flex flex-col gap-2">
          {step < 3 ? (
            <>
              <button
                onClick={() => setStep(step + 1)}
                className="w-full rounded-full bg-primary px-5 py-4 text-center font-bold text-lg text-primary-foreground shadow-elevated hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                {t("next")} <ChevronRight className="size-5" />
              </button>
              <button
                onClick={() => setStep(step + 1)}
                className="text-sm font-bold text-primary text-center py-3 hover:underline"
              >
                {t("skipStep")}
              </button>
            </>
          ) : (
            <button
              onClick={submit}
              disabled={busy}
              className="w-full rounded-full bg-primary px-5 py-4 text-center font-bold text-lg text-primary-foreground shadow-elevated hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {busy && <Loader2 className="size-5 animate-spin" />}
              {busy ? t("sending") : t("submit")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function AmbulancePanel({
  pin,
  onClose,
}: {
  pin: { lat: number; lng: number };
  onClose: () => void;
}) {
  const { t, lang } = useApp();
  const { data: hospitals = [] } = useQuery({ queryKey: ["hospitals"], queryFn: fetchHospitals });
  const ranked = useMemo(
    () => sortByDistance(hospitals, pin.lat, pin.lng).slice(0, 5),
    [hospitals, pin],
  );

  return (
    <Sheet onClose={onClose}>
      <h2 className="font-display text-lg">{t("accident")}</h2>
      <a
        href={`tel:999`}
        className="tap-target mt-3 flex items-center justify-center gap-2 rounded-xl bg-destructive px-5 py-4 text-base font-bold text-destructive-foreground"
      >
        <Ambulance className="size-5" aria-hidden />
        {t("callAmbulance")}
      </a>

      <p className="mt-5 text-sm font-semibold">{t("nearbyHospitals")}</p>
      <ul className="mt-2 space-y-2">
        {ranked.map((h) => (
          <li
            key={h.id}
            className="rounded-xl border border-border border-l-4 border-l-accident bg-card p-3"
          >
            <p className="text-sm font-semibold">{h.name}</p>
            <p className="text-xs text-muted-foreground">{formatDistance(h.km, lang)}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Dot label={t("beds")} ok={h.beds_available > 0} />
              <Dot label={t("icu")} ok={h.icu_available > 0} />
            </div>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onClose}
        className="tap-target mt-4 w-full rounded-xl border-2 border-border px-5 py-3 text-sm font-semibold"
      >
        {t("done")}
      </button>
    </Sheet>
  );
}

function Dot({ label, ok }: { label: string; ok: boolean }) {
  const { t } = useApp();
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        ok ? "bg-resolved-tint text-resolved-deep" : "bg-crime-tint text-crime-deep"
      }`}
    >
      <span className={`size-2 rounded-full ${ok ? "bg-resolved" : "bg-crime"}`} aria-hidden />
      {label}: {ok ? t("available") : t("full")}
    </span>
  );
}

function SosOverlay({
  stage,
  setStage,
  here,
  stations,
  contactName,
}: {
  stage: "confirm" | "live";
  setStage: (s: "idle" | "confirm" | "live") => void;
  here: { lat: number; lng: number } | null;
  stations: { id: string; name: string; lat: number; lng: number }[];
  contactName: string | null;
}) {
  const { t, lang } = useApp();
  const { user } = useAuth();
  const [busy, setBusy] = useState(false);
  const [alertId, setAlertId] = useState<string | null>(null);
  const point = here ?? { lat: DHAKA_CENTER[0], lng: DHAKA_CENTER[1] };
  const station = useMemo(() => nearest(stations, point.lat, point.lng), [stations, point]);

  async function send() {
    if (!user) return;
    setBusy(true);
    try {
      const { data, error } = await supabase
        .from("sos_alerts")
        .insert({
          user_id: user.id,
          lat: point.lat,
          lng: point.lng,
          nearest_station_id: station?.id ?? null,
          contact_notified: true,
        })
        .select("id")
        .single();
      if (error) throw error;
      setAlertId(data.id);
      setStage("live");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "SOS failed");
    } finally {
      setBusy(false);
    }
  }

  async function end() {
    if (alertId) await supabase.from("sos_alerts").update({ status: "closed" }).eq("id", alertId);
    setStage("idle");
  }

  return (
    <div className="fixed inset-0 z-[1100] flex flex-col bg-background p-5">
      {stage === "confirm" ? (
        <div className="m-auto w-full max-w-sm text-center">
          <span className="mx-auto grid size-16 place-items-center rounded-2xl bg-crime-tint text-crime-deep">
            <Siren className="size-8" aria-hidden />
          </span>
          <h2 className="font-display mt-4 text-2xl">{t("sosConfirmTitle")}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{t("sosConfirmBody")}</p>
          <button
            type="button"
            onClick={send}
            disabled={busy}
            className="tap-target mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-destructive px-5 py-4 text-lg font-bold text-destructive-foreground disabled:opacity-60"
          >
            {busy ? (
              <Loader2 className="size-5 animate-spin" aria-hidden />
            ) : (
              <Siren className="size-5" aria-hidden />
            )}
            {t("sendSos")}
          </button>
          <button
            type="button"
            onClick={() => setStage("idle")}
            className="tap-target mt-3 w-full rounded-xl border-2 border-border px-5 py-3 text-base font-semibold"
          >
            {t("cancel")}
          </button>
        </div>
      ) : (
        <div className="m-auto w-full max-w-sm">
          <div className="rounded-2xl border-2 border-crime bg-crime-tint p-5 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-crime text-destructive-foreground">
              <Siren className="size-7" aria-hidden />
            </span>
            <p className="font-display mt-3 text-xl text-crime-deep">{t("sosLive")}</p>
            <p className="mt-2 text-sm font-semibold text-crime-deep">{t("sosNotified")}</p>
          </div>

          <dl className="mt-4 space-y-2 rounded-xl border border-border bg-card p-4 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">{t("nearestStation")}</dt>
              <dd className="text-right font-semibold">{station?.name ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">{t("emergencyContact")}</dt>
              <dd className="text-right font-semibold">{contactName ?? "—"}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">{t("liveLocation")}</dt>
              <dd className="text-right font-mono text-xs">
                {point.lat.toFixed(5)}, {point.lng.toFixed(5)}
              </dd>
            </div>
          </dl>

          <div className="mt-3 h-40 overflow-hidden rounded-xl border border-border">
            <MapView
              className="size-full"
              reports={[]}
              center={[point.lat, point.lng]}
              zoom={16}
              draft={point}
              interactive={false}
            />
          </div>

          <button
            type="button"
            onClick={end}
            className="tap-target mt-4 w-full rounded-xl border-2 border-border bg-card px-5 py-3 text-base font-semibold"
          >
            {t("endSos")}
          </button>
          <p className="mt-2 text-center text-xs text-muted-foreground">{t("locationUpdating")}</p>
        </div>
      )}
    </div>
  );
}
