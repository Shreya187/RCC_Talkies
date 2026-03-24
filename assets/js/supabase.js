const SUPABASE_URL = "https://aqpnbdyrxxjkjalnqgty.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxcG5iZHlyeHhqa2phbG5xZ3R5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMjE5MzQsImV4cCI6MjA4OTU5NzkzNH0.5BLsC1b3hhkiR2Mh99t1Qi448Kc3Ai3DvMCvejuYq7o"
const { createClient } = supabase;
window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
console.log("Supabase initialized ✅");