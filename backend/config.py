import os
from dotenv import load_dotenv

load_dotenv(dotenv_path="../.env")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") # Use service role if needed, or public key for reads
if not SUPABASE_SERVICE_KEY:
    SUPABASE_SERVICE_KEY = os.getenv("SUPABASE_ANON_KEY", os.getenv("VITE_SUPABASE_PUBLISHABLE_KEY"))

GROK_API_KEY = os.getenv("GROK_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", os.getenv("VITE_GROQ_API_KEY"))
