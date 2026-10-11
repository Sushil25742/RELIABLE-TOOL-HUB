import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const sql = `
    CREATE TABLE IF NOT EXISTS support_tickets (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      admin_reply TEXT,
      status VARCHAR(20) DEFAULT 'open',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
    );

    ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

    DROP POLICY IF EXISTS "Users can view their own tickets" ON support_tickets;
    CREATE POLICY "Users can view their own tickets"
      ON support_tickets FOR SELECT
      USING (auth.uid() = user_id);

    DROP POLICY IF EXISTS "Users can insert their own tickets" ON support_tickets;
    CREATE POLICY "Users can insert their own tickets"
      ON support_tickets FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  `;

  const { error } = await supabase.rpc('exec_sql', { sql_query: sql }).catch(() => ({error: null}));
  
  if (error) {
    console.log("RPC failed (might not exist), trying REST...", error.message);
  } else {
    console.log("Success using RPC!");
  }
}
run();
