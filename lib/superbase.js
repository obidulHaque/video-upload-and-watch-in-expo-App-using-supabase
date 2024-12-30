import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = ""; // replace with your supabase url
const SUPABASE_KEY = ""; // add your supabase key
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
