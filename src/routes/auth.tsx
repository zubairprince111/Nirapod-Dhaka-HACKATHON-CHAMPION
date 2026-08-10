import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, LogIn, UserPlus, PhoneCall } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/lib/app-context";
import { useAuth, dashboardPathFor } from "@/lib/auth";
import { BrandMark, LangToggle } from "@/components/Chrome";

const searchSchema = z.object({
  mode: z.enum(["login", "signup"]).catch("login"),
  type: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Log in or sign up — Nirapod Dhaka" },
      {
        name: "description",
        content:
          "Create a Nirapod Dhaka account to report hazards, track their resolution and use emergency SOS.",
      },
      { property: "og:title", content: "Log in or sign up — Nirapod Dhaka" },
      {
        property: "og:description",
        content: "Sign in to report hazards and use emergency SOS in Dhaka.",
      },
    ],
  }),
  component: AuthPage,
});

const signupSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(6).max(72),
  full_name: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(6).max(20),
  emergency_contact_name: z.string().trim().min(2).max(100),
  emergency_contact_phone: z.string().trim().min(6).max(20),
});

function AuthPage() {
  const search = Route.useSearch();
  const { session, role, loading } = useAuth();
  const navigate = useNavigate();
  const { lang, t } = useApp();

  const isAuthorityAuth = search.type === "authority";
  const isSignup = isAuthorityAuth ? false : search.mode === "signup";

  const [busy, setBusy] = useState(false);
  const [sentEmail, setSentEmail] = useState(false);

  useEffect(() => {
    // Only redirect once we are fully loaded, have a session, AND the role is determined.
    if (!loading && session && role !== null) {
      void navigate({ to: dashboardPathFor(role), replace: true });
    }
  }, [session, role, loading, navigate]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setBusy(true);
    try {
      if (isSignup) {
        const parsed = signupSchema.safeParse(Object.fromEntries(fd));
        if (!parsed.success) {
          toast.error(
            lang === "bn" ? "সব ঘর সঠিকভাবে পূরণ করুন" : "Please fill every field correctly",
          );
          return;
        }
        const { email, password, ...meta } = parsed.data;
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin + "/map", data: meta },
        });
        if (error) throw error;
        
        if (data.session) {
          toast.success(lang === "bn" ? "অ্যাকাউন্ট তৈরি হয়েছে" : "Account created successfully");
        } else {
          setSentEmail(true);
          toast.success(t("checkEmail"));
        }
      } else {
        const email = String(fd.get("email") ?? "").trim();
        const password = String(fd.get("password") ?? "");
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-dvh bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-md items-center justify-between gap-3 px-4 py-3">
          <BrandMark compact />
          <LangToggle />
        </div>
      </header>

      <main className="mx-auto max-w-md p-4 pt-12 md:p-6 md:pt-16 lg:p-8 lg:pt-20">
        <div className="mb-8 space-y-2 text-center">
          <h1 className="font-display text-2xl">{isSignup ? t("signup") : t("login")}</h1>
          <p className="text-sm text-muted-foreground">
            {isAuthorityAuth 
              ? (lang === "bn" ? "কর্তৃপক্ষ ড্যাশবোর্ডে প্রবেশ করুন" : "Sign in to Authority Dashboard")
              : (isSignup ? t("signupDesc") : t("loginDesc"))}
          </p>
        </div>

        {sentEmail ? (
          <div className="rounded-2xl border-2 border-primary bg-primary-tint p-6 text-center animate-slide-in-up">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <LogIn className="size-6" />
            </div>
            <h2 className="mt-4 font-display text-lg text-primary-deep">{t("checkEmail")}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t("linkSent")}</p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4 rounded-2xl bg-card p-5 sm:p-6 shadow-card border border-border animate-slide-in-up">
            <Field name="email" label={t("email")} type="email" placeholder="hello@example.com" required />
            <Field name="password" label={t("password")} type="password" required />

            {isSignup && (
              <>
                <Field name="full_name" label={t("fullName")} placeholder="Rafiqul Islam" required />
                <Field name="phone" label={t("phone")} type="tel" placeholder="+8801XXXXXXXXX" required />
                
                <fieldset className="rounded-xl border border-border bg-muted/50 p-4">
                  <legend className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {t("emergencyContact")}
                  </legend>
                  <div className="mt-3 space-y-4">
                    <Field name="emergency_contact_name" label={t("emergencyContactName")} placeholder="Amina Begum" required />
                    <Field name="emergency_contact_phone" label={t("emergencyContactPhone")} placeholder="+8801XXXXXXXXX" required />
                  </div>
                </fieldset>
              </>
            )}

            <button
              type="submit"
              disabled={busy}
              className="tap-target inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary-deep disabled:opacity-60"
            >
              {busy ? (
                <Loader2 className="size-4 animate-spin" aria-hidden />
              ) : isSignup ? (
                <UserPlus className="size-4" aria-hidden />
              ) : (
                <LogIn className="size-4" aria-hidden />
              )}
              {isSignup ? t("signup") : t("login")}
            </button>
          </form>
        )}

        {!isAuthorityAuth && (
          <Link
            to="/auth"
            search={{ mode: isSignup ? "login" : "signup" }}
            className="tap-target mt-4 flex items-center justify-center text-sm font-semibold text-primary-deep underline underline-offset-4"
          >
            {isSignup ? t("haveAccount") : t("needAccount")}
          </Link>
        )}
        <Link
          to="/map"
          className="tap-target mt-2 flex items-center justify-center text-sm text-muted-foreground underline underline-offset-4"
        >
          {t("browseMap")}
        </Link>
      </main>
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  ...rest
}: { name: string; label: string; type?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-sm font-semibold">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className="tap-target w-full rounded-lg border border-input bg-background px-3 py-2.5 text-base outline-none transition-shadow focus-visible:ring-2 focus-visible:ring-ring"
        {...rest}
      />
    </div>
  );
}
