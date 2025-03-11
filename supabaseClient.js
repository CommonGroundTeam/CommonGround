import { createClient } from "@supabase/supabase-js";
import config from "./supabaseConfig";

const { SUPABASE_URL, SUPABASE_ANON_KEY } = config;

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
