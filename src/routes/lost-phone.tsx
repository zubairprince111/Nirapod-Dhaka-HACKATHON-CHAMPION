import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Copy, Check, Smartphone, ArrowLeft } from "lucide-react";
import { BrandMark, LangToggle } from "@/components/Chrome";
import { useApp } from "@/lib/app-context";

export const Route = createFileRoute("/lost-phone")({
  head: () => ({
    meta: [
      { title: "Find a lost phone — Nirapod Dhaka" },
      {
        name: "description",
        content:
          "Generate a shareable link that shows a lost device's last known location. No account or login needed.",
      },
      { property: "og:title", content: "Find a lost phone — Nirapod Dhaka" },
      {
        property: "og:description",
        content: "A no-login locator link for a lost phone in Dhaka.",
      },
    ],
  }),
  component: LostPhone,
});

function LostPhone() {
  const { t } = useApp();
  const [phone, setPhone] = useState("");
  const [link, setLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  function generate(e: React.FormEvent) {
    e.preventDefault();
    const clean = phone.replace(/[^\d+]/g, "").slice(0, 20);
    if (clean.length < 6) return;
    const token = btoa(`${clean}:${Date.now()}`).replace(/[^A-Za-z0-9]/g, "");
    setLink(`${window.location.origin}/locate/${token}`);
    setCopied(false);
  }

  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-md items-center justify-between gap-3 px-4 py-3">
          <BrandMark compact />
          <LangToggle />
        </div>
      </header>

      <main className="mx-auto w-full max-w-md px-4 py-8">
        <Link
          to="/"
          className="tap-target inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground"
        >
          <ArrowLeft className="size-4" aria-hidden />
          {t("back")}
        </Link>

        <h1 className="font-display mt-4 flex items-center gap-2 text-2xl">
          <Smartphone className="size-6 text-pending-deep" aria-hidden />
          {t("lostPhoneTitle")}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{t("lostPhoneBody")}</p>

        <form
          onSubmit={generate}
          className="mt-6 rounded-xl border border-border bg-card p-5 shadow-card"
        >
          <label htmlFor="lostphone" className="mb-1.5 block text-sm font-semibold">
            {t("phoneNumber")}
          </label>
          <input
            id="lostphone"
            type="tel"
            inputMode="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+8801XXXXXXXXX"
            className="tap-target w-full rounded-lg border border-input bg-background px-3 py-2.5 text-base"
          />
          <button
            type="submit"
            className="tap-target mt-4 w-full rounded-xl bg-primary px-5 py-3.5 text-base font-semibold text-primary-foreground"
          >
            {t("generateLink")}
          </button>
        </form>

        {link && (
          <div className="mt-4 rounded-xl border border-border border-l-4 border-l-pending bg-card p-4">
            <p className="break-all rounded-lg bg-background p-3 font-mono text-xs">{link}</p>
            <button
              type="button"
              onClick={() => {
                void navigator.clipboard.writeText(link);
                setCopied(true);
              }}
              className="tap-target mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl border-2 border-primary px-4 py-3 text-sm font-semibold text-primary-deep"
            >
              {copied ? (
                <Check className="size-4" aria-hidden />
              ) : (
                <Copy className="size-4" aria-hidden />
              )}
              {copied ? t("copied") : t("copyLink")}
            </button>
            <p className="mt-3 text-xs text-muted-foreground">{t("shareHint")}</p>
          </div>
        )}
      </main>
    </div>
  );
}
