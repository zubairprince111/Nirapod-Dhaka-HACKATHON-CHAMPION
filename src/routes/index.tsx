import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Map as MapIcon,
  Megaphone,
  Siren,
  Smartphone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Activity,
  Building2,
  Stethoscope,
  Quote,
  Clock,
  MapPin,
  Sparkles,
  Mic,
  Camera,
} from "lucide-react";
import { BrandMark, LangToggle } from "@/components/Chrome";
import { useApp } from "@/lib/app-context";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nirapod Dhaka — Report hazards, track resolution" },
      {
        name: "description",
        content:
          "Citizens of Dhaka report crime, open manholes and accidents on a live map. Reports route automatically to City Corporation, the Disaster Management Board and Police.",
      },
      { property: "og:title", content: "Nirapod Dhaka — Report hazards, track resolution" },
      {
        property: "og:description",
        content:
          "A calm, community-driven safety map for Dhaka with one-tap emergency SOS and a no-login lost phone locator.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { t } = useApp();

  return (
    <div className="min-h-dvh bg-background selection:bg-primary/20">
      <header className="absolute left-0 right-0 top-0 z-50 border-b border-border/10 bg-transparent">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
          <BrandMark />
          <div className="flex items-center gap-4 lg:gap-8">
            <nav className="hidden lg:flex gap-6 text-sm font-medium text-white/80 drop-shadow-md">
              <a href="#how-it-works" className="hover:text-white transition-colors">
                {t("howItWorks")}
              </a>
              <a href="#features" className="hover:text-white transition-colors">
                {t("features")}
              </a>
              <a href="#stats" className="hover:text-white transition-colors">
                {t("stats")}
              </a>
              <a href="#help" className="hover:text-white transition-colors">
                {t("helpCenter")}
              </a>
            </nav>
            <div className="flex items-center gap-4">
              <LangToggle />
              <Link
                to="/auth"
                search={{ mode: "login" }}
                className="tap-target hidden sm:inline-flex items-center justify-center rounded-full border border-border bg-card px-6 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-muted"
              >
                {t("login")}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden min-h-[90vh] lg:min-h-[100vh] flex flex-col bg-background">
          {/* Background Image Layer */}
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: "url('/hero.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
          {/* Gradient overlay removed per request */}
          
          <div className="flex-1 flex items-center w-full relative z-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full pt-28 pb-12 lg:pt-0 lg:pb-0">
              <div className="max-w-2xl text-center lg:text-left mx-auto lg:mx-0">
                <h1 className="font-display text-4xl leading-[1.15] tracking-tight text-white sm:text-5xl lg:text-6xl max-w-2xl mx-auto lg:mx-0 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                  {t("heroTitle1")}
                  <br />
                  {t("heroTitle2")}
                  <br />
                  <span className="text-primary drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">{t("heroTitle3")}</span>
                </h1>
                <p className="mt-6 text-lg leading-relaxed text-white/90 font-medium max-w-xl mx-auto lg:mx-0 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                  {t("heroDesc").split("\n")[0]}
                  <br />
                  {t("heroDesc").split("\n")[1]}
                </p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link
                    to="/auth"
                    search={{ mode: "signup" }}
                    className="tap-target inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-primary-foreground shadow-lift transition-all hover:-translate-y-0.5 hover:shadow-lg hover:bg-primary-deep"
                  >
                    <Megaphone className="size-5" />
                    {t("reportNow")}
                  </Link>
                  <Link
                    to="/map"
                    className="tap-target inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-border bg-card px-8 py-4 text-base font-semibold text-foreground shadow-sm transition-all hover:bg-muted"
                  >
                    <MapIcon className="size-5 text-primary" />
                    {t("viewLiveMap")}
                  </Link>
                </div>
                <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm font-semibold text-white/90 drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-resolved" /> {t("safe")}
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-resolved" /> {t("reliable")}
                  </span>
                  <span className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-resolved" /> {t("forEveryone")}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="w-full relative z-30 pb-10 lg:pb-16 mt-auto">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-6">
                {t("workingTogether")}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                <TrustCard imgSrc="/citycorporation.png" title={t("cityCorp")} />
                <TrustCard imgSrc="/police.png" title={t("bdPolice")} />
                <TrustCard imgSrc="/disaster.png" title={t("dmb")} />
                <TrustCard icon={Stethoscope} title={t("healthEmergency")} />
              </div>
            </div>
          </div>
          
          {/* Bottom fade connecting to the next section */}
          <div className="absolute inset-x-0 bottom-0 h-48 lg:h-72 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
        </section>

        <section id="stats" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            <StatCard
              icon={Megaphone}
              count="12,340"
              label={t("totalReports")}
              color="text-primary"
              bg="bg-primary-tint"
            />
            <StatCard
              icon={CheckCircle2}
              count="4,820"
              label={t("resolvedCount")}
              color="text-resolved"
              bg="bg-resolved-tint"
            />
            <StatCard
              icon={Users}
              count="91%"
              label={t("communityConfirmation")}
              color="text-resolved"
              bg="bg-resolved-tint"
            />
            <StatCard
              icon={ShieldCheck}
              count="1,120"
              label={t("activeCitizens")}
              color="text-crime"
              bg="bg-crime-tint"
            />
          </div>
        </section>

        <section id="how-it-works" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <h2 className="text-center font-display text-3xl sm:text-4xl font-bold mb-16 lg:mb-24">
            {t("howItWorks")}
          </h2>
          <div className="relative">
            <div className="hidden lg:block absolute top-8 left-[10%] right-[10%] h-0.5 bg-border z-0 border-t border-dashed border-muted-foreground/30"></div>
            <div className="grid gap-12 lg:gap-8 lg:grid-cols-4 relative z-10">
              <StepCard step="1" title={t("step1Title")} desc={t("step1Desc")} icon={Sparkles} />
              <StepCard step="2" title={t("step2Title")} desc={t("step2Desc")} icon={Mic} />
              <StepCard step="3" title={t("step3Title")} desc={t("step3Desc")} icon={Camera} />
              <StepCard
                step="4"
                title={t("step4Title")}
                desc={t("step4Desc")}
                icon={Building2}
              />
            </div>
          </div>
        </section>

        <section className="bg-card border-y border-border py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-16 items-center">
              <div className="lg:col-span-5 mb-20 lg:mb-0">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-display text-2xl font-bold">{t("recentActivity")}</h2>
                  <Link
                    to="/map"
                    className="text-sm font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    {t("seeAll")} <ArrowRight className="size-4" />
                  </Link>
                </div>
                <div className="space-y-4">
                  <ActivityCard
                    title={t("openManhole")}
                    location={t("dhanmondiDhaka")}
                    time={t("twoMinsAgo")}
                    icon={Activity}
                    tone="amber"
                    status={t("statusConfirmed")}
                    count={t("eighteenConfirmed")}
                  />
                  <ActivityCard
                    title={t("roadAccidentLabel")}
                    location={t("farmgateDhaka")}
                    time={t("sixMinsAgo")}
                    icon={Siren}
                    tone="teal"
                    status={t("policeNotified")}
                    count={t("policeActionTaken")}
                  />
                  <ActivityCard
                    title={t("brokenDrain")}
                    location={t("mirpur10Dhaka")}
                    time={t("twentyMinsAgo")}
                    icon={Activity}
                    tone="amber"
                    status={t("underAuthorityReview")}
                    count={t("cityCorpLooking")}
                  />
                  <ActivityCard
                    title={t("snatchingAttempt")}
                    location={t("gulshan1Dhaka")}
                    time={t("thirtyFiveMinsAgo")}
                    icon={Megaphone}
                    tone="red"
                    status={t("statusConfirmed")}
                    count={t("thirtyTwoConfirmed")}
                  />
                </div>
              </div>

              <div className="lg:col-span-7 flex flex-col items-center justify-center">
                <h2 className="font-display text-3xl font-bold text-center mb-4">
                  {t("easyFastForAll")}
                </h2>
                <p className="text-muted-foreground text-center mb-16">{t("reportInFewSteps")}</p>

                <div className="relative flex justify-center items-center w-full h-[450px] sm:h-[550px] perspective-[1000px]">
                  <div className="absolute left-[0%] sm:left-[5%] z-10 w-[220px] sm:w-[260px] h-[450px] sm:h-[520px] bg-background rounded-[2rem] border-4 border-border shadow-xl overflow-hidden transform -rotate-6 scale-90 transition-transform duration-500 hover:scale-95 hover:-rotate-2 hover:z-40">
                    <div className="bg-card w-full h-12 flex items-center justify-center border-b border-border text-xs font-semibold">
                      {t("liveMapLabel")}
                    </div>
                    <div className="w-full h-full relative bg-[#F4F6F5]">
                      <div
                        className="absolute inset-0"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle at center, #ddd 1px, transparent 1px)",
                          backgroundSize: "20px 20px",
                        }}
                      ></div>
                      <div className="absolute top-1/3 left-1/4 w-8 h-8 rounded-full bg-crime/20 flex items-center justify-center">
                        <div className="w-3 h-3 bg-crime rounded-full"></div>
                      </div>
                      <div className="absolute bottom-1/3 right-1/4 w-8 h-8 rounded-full bg-infra/20 flex items-center justify-center">
                        <div className="w-3 h-3 bg-infra rounded-full"></div>
                      </div>
                      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-40 h-10 bg-primary text-white rounded-full flex items-center justify-center text-xs font-semibold shadow-md">
                        {t("reportNow")}
                      </div>
                    </div>
                  </div>

                  <div className="absolute z-30 w-[240px] sm:w-[280px] h-[480px] sm:h-[560px] bg-background rounded-[2.5rem] border-[6px] border-white shadow-2xl overflow-hidden flex flex-col transform transition-transform duration-500 hover:scale-[1.02]">
                    <div className="bg-card w-full h-14 flex items-center justify-center border-b border-border font-semibold text-sm">
                      {t("createReportLabel")}
                    </div>
                    <div className="p-4 flex-1 space-y-4">
                      <div className="h-12 bg-card rounded-xl border border-border flex items-center px-4 text-xs text-muted-foreground shadow-sm">
                        {t("locationDhanmondi")}
                      </div>
                      <div className="flex gap-2">
                        <div className="h-24 flex-1 bg-crime-tint rounded-xl border border-crime/20 flex flex-col items-center justify-center gap-2">
                          <Siren className="size-5 text-crime" />
                          <span className="text-[10px] font-medium text-crime-deep">
                            {t("crime")}
                          </span>
                        </div>
                        <div className="h-24 flex-1 bg-infra-tint rounded-xl border border-infra/20 flex flex-col items-center justify-center gap-2">
                          <Activity className="size-5 text-infra" />
                          <span className="text-[10px] font-medium text-infra-deep">
                            {t("infrastructure")}
                          </span>
                        </div>
                      </div>
                      <div className="h-24 bg-muted/50 rounded-xl border border-border border-dashed flex items-center justify-center text-xs text-muted-foreground">
                        {t("addPhotoLabel")}
                      </div>
                      <div className="h-12 bg-primary rounded-xl mt-auto flex items-center justify-center text-primary-foreground font-semibold shadow-md">
                        {t("sendReportLabel")}
                      </div>
                    </div>
                  </div>

                  <div className="absolute right-[0%] sm:right-[5%] z-20 w-[220px] sm:w-[260px] h-[450px] sm:h-[520px] bg-background rounded-[2rem] border-4 border-border shadow-xl overflow-hidden transform rotate-6 scale-90 transition-transform duration-500 hover:scale-95 hover:rotate-2 hover:z-40 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-20 h-20 rounded-full bg-resolved-tint flex items-center justify-center mb-6 ring-8 ring-resolved/10">
                      <CheckCircle2 className="size-10 text-resolved" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{t("reportSentTitle")}</h3>
                    <p className="text-xs text-muted-foreground mb-8">{t("reportSentDesc")}</p>
                    <div className="w-full h-12 bg-resolved text-white flex items-center justify-center rounded-xl text-sm font-semibold shadow-md">
                      {t("okButton")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            <FeatureCard
              icon={Siren}
              title={t("emergencySos")}
              desc={t("alertPoliceOneTap")}
              color="text-crime"
              bg="bg-crime-tint"
            />
            <FeatureCard
              icon={MapPin}
              title={t("liveLocation")}
              desc={t("shareRealTimeLocation")}
              color="text-primary"
              bg="bg-primary-tint"
            />
            <FeatureCard
              icon={ShieldCheck}
              title={t("safePrivate")}
              desc={t("yourDataSecure")}
              color="text-resolved"
              bg="bg-resolved-tint"
            />
          </div>
        </section>

        <section className="bg-white/50 border-t border-border py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center mb-16 text-center">
              <h2 className="font-display text-3xl font-bold mb-4">{t("citizensVoice")}</h2>
              <p className="text-muted-foreground max-w-xl">{t("citizensVoiceDesc")}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              <TestimonialCard quote={t("testimonial1")} name={t("name1")} role={t("role1")} />
              <TestimonialCard quote={t("testimonial2")} name={t("name2")} role={t("bdPolice")} />
              <TestimonialCard quote={t("testimonial3")} name={t("name3")} role={t("cityCorp")} />
            </div>
          </div>
        </section>

        <footer className="border-t border-border bg-background pt-20 pb-10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-8 lg:gap-12 mb-16">
              <div className="col-span-2 md:col-span-4 lg:col-span-4">
                <BrandMark />
                <p className="mt-6 text-sm text-muted-foreground max-w-sm leading-relaxed">
                  {t("footerDesc")}
                </p>
              </div>

              <div className="col-span-1 md:col-span-1 lg:col-span-2 lg:col-start-5">
                <h3 className="font-semibold text-foreground tracking-wide mb-5">
                  {t("platform")}
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>
                    <a href="#how-it-works" className="hover:text-primary transition-colors">
                      {t("howItWorks")}
                    </a>
                  </li>
                  <li>
                    <a href="#features" className="hover:text-primary transition-colors">
                      {t("features")}
                    </a>
                  </li>
                  <li>
                    <a href="#stats" className="hover:text-primary transition-colors">
                      {t("stats")}
                    </a>
                  </li>
                </ul>
              </div>

              <div className="col-span-1 md:col-span-1 lg:col-span-2">
                <h3 className="font-semibold text-foreground tracking-wide mb-5">
                  {t("authoritiesTitle")}
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>
                    <Link to="/auth" search={{ type: "authority" }} className="hover:text-primary transition-colors">
                      {t("roleCityCorp")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/auth" search={{ type: "authority" }} className="hover:text-primary transition-colors">
                      {t("roleDmb")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/auth" search={{ type: "authority" }} className="hover:text-primary transition-colors">
                      {t("rolePolice")}
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="col-span-1 md:col-span-1 lg:col-span-2">
                <h3 className="font-semibold text-foreground tracking-wide mb-5">
                  {t("helpAndInfo")}
                </h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>
                    <a href="#" className="hover:text-primary transition-colors">
                      {t("helpCenter")}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary transition-colors">
                      {t("emergencyNumbers")}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary transition-colors">
                      {t("contact")}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary transition-colors">
                      {t("accessibility")}
                    </a>
                  </li>
                </ul>
              </div>

              <div className="col-span-1 md:col-span-1 lg:col-span-2">
                <h3 className="font-semibold text-foreground tracking-wide mb-5">{t("legal")}</h3>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>
                    <a href="#" className="hover:text-primary transition-colors">
                      {t("termsOfUse")}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary transition-colors">
                      {t("privacyPolicy")}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-primary transition-colors">
                      {t("cookiePolicy")}
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
              <p>{t("copyright")}</p>
              <div className="flex items-center gap-6">
                <a href="#" className="hover:text-foreground transition-colors">
                  {t("aboutUs")}
                </a>
                <a href="#" className="hover:text-foreground transition-colors">
                  {t("privacyPolicy")}
                </a>
                <a href="#" className="hover:text-foreground transition-colors">
                  {t("terms")}
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

function TrustCard({ icon: Icon, imgSrc, title }: { icon?: any; imgSrc?: string; title: string }) {
  return (
    <div className="flex items-center justify-center gap-3 p-4 sm:p-5 rounded-2xl bg-background/60 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-sm hover:shadow-md hover:bg-background/80 transition-all text-center">
      <div className="w-10 h-10 shrink-0 rounded-full bg-muted/80 flex items-center justify-center text-foreground overflow-hidden">
        {imgSrc ? (
          <img src={imgSrc} alt={title} className="w-full h-full object-cover" />
        ) : Icon ? (
          <Icon className="size-5" />
        ) : null}
      </div>
      <span className="font-semibold text-sm text-left leading-tight text-foreground drop-shadow-sm">{title}</span>
    </div>
  );
}

function StatCard({
  icon: Icon,
  count,
  label,
  color,
  bg,
}: {
  icon: any;
  count: string;
  label: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="flex items-center p-5 sm:p-6 rounded-3xl bg-card border border-border shadow-sm hover:shadow-md transition-all group">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
        <div
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl ${bg} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300`}
        >
          <Icon className={`size-6 sm:size-7 ${color}`} />
        </div>
        <div>
          <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">{count}</h3>
          <p className="text-xs sm:text-sm font-medium text-muted-foreground mt-0.5">{label}</p>
        </div>
      </div>
    </div>
  );
}

function StepCard({
  step,
  title,
  desc,
  icon: Icon,
}: {
  step: string;
  title: string;
  desc: string;
  icon: any;
}) {
  return (
    <div className="flex flex-col items-center text-center relative z-10 group">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-card border-4 border-background shadow-md flex items-center justify-center mb-6 relative transition-transform duration-300 group-hover:-translate-y-1">
        <Icon className="size-6 sm:size-8 text-primary" />
        <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary text-primary-foreground text-xs sm:text-sm font-bold flex items-center justify-center border-2 border-background shadow-sm">
          {step}
        </div>
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-[220px] leading-relaxed">{desc}</p>
    </div>
  );
}

function ActivityCard({
  title,
  location,
  time,
  icon: Icon,
  tone,
  status,
  count,
}: {
  title: string;
  location: string;
  time: string;
  icon: any;
  tone: "teal" | "amber" | "red";
  status: string;
  count: string;
}) {
  const toneClass =
    tone === "teal"
      ? "bg-primary-tint text-primary-deep"
      : tone === "amber"
        ? "bg-infra-tint text-infra-deep"
        : "bg-crime-tint text-crime-deep";

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-background border border-border shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
      <div className="flex items-center gap-4">
        <div
          className={`w-14 h-14 rounded-2xl ${toneClass} flex items-center justify-center shrink-0`}
        >
          <Icon className="size-6" />
        </div>
        <div>
          <h4 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
            {title}
          </h4>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground mt-1.5 font-medium">
            <span className="flex items-center gap-1">
              <MapPin className="size-3.5" /> {location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="size-3.5" /> {time}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start sm:items-end gap-1.5 shrink-0">
        <span className="px-3 py-1 bg-resolved-tint text-resolved-deep text-xs font-bold rounded-full flex items-center gap-1.5">
          {status} <CheckCircle2 className="size-3.5" />
        </span>
        <span className="text-[11px] font-medium text-muted-foreground">{count}</span>
      </div>
    </div>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  desc,
  color,
  bg,
}: {
  icon: any;
  title: string;
  desc: string;
  color: string;
  bg: string;
}) {
  return (
    <div className="flex flex-col gap-4 p-6 rounded-3xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow">
      <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center shrink-0`}>
        <Icon className={`size-7 ${color}`} />
      </div>
      <div>
        <h4 className="font-bold text-lg">{title}</h4>
        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function TestimonialCard({ quote, name, role }: { quote: string; name: string; role: string }) {
  return (
    <div className="p-8 rounded-3xl bg-card border border-border shadow-sm flex flex-col h-full hover:shadow-md transition-shadow">
      <Quote className="size-8 text-primary/20 mb-6" />
      <p className="text-base leading-relaxed font-medium mb-8 flex-1 text-foreground">"{quote}"</p>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-muted overflow-hidden shrink-0">
          <img
            src={`https://api.dicebear.com/7.x/notionists/svg?seed=${name}&backgroundColor=f4f6f5`}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h5 className="font-bold text-sm text-foreground">{name}</h5>
          <p className="text-xs text-muted-foreground mt-0.5">{role}</p>
        </div>
      </div>
    </div>
  );
}
