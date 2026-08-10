import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "citizen" | "police" | "dmb" | "city_corp";

export type Profile = {
  id: string;
  full_name: string;
  phone: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
};

type Ctx = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  role: AppRole | null;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<Ctx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [role, setRole] = useState<AppRole | null>(null);
  const [loading, setLoading] = useState(true);

  async function load(userId: string) {
    const { data: p, error } = await supabase
      .from("profiles")
      .select("id, full_name, phone, emergency_contact_name, emergency_contact_phone, role")
      .eq("id", userId)
      .maybeSingle();
      
    if (error) {
      console.error("Failed to load profile:", error);
      // Do not set default citizen role on network/db error
      return; 
    }
      
    setProfile((p as Profile) ?? null);
    setRole((p?.role as AppRole) ?? "citizen");
  }

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, s) => {
      setSession(s);
      if (s?.user) {
        setLoading(true);
        await load(s.user.id);
        setLoading(false);
      } else {
        setProfile(null);
        setRole(null);
        setLoading(false);
      }
    });

    void supabase.auth.getSession().then(async ({ data }) => {
      setSession(data.session);
      if (data.session?.user) {
        setLoading(true);
        await load(data.session.user.id);
      }
      setLoading(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const value: Ctx = {
    session,
    user: session?.user ?? null,
    profile,
    role,
    loading,
    refreshProfile: async () => {
      if (session?.user) await load(session.user.id);
    },
    signOut: async () => {
      await supabase.auth.signOut();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}

export function dashboardPathFor(role: AppRole | null): string {
  if (role === "police" || role === "dmb" || role === "city_corp") return "/dashboard";
  return "/map";
}

export function roleI18nKey(role: AppRole | null): string {
  if (role === "police") return "rolePolice";
  if (role === "dmb") return "roleDmb";
  if (role === "city_corp") return "roleCityCorp";
  return "roleCitizen";
}
