/* eslint-disable */
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteTestOrders() {
  console.log("Deleting all test orders and order items...");
  
  // To bypass RLS and delete all, we can delete where id is not null
  const { error: itemError } = await supabase
    .from('order_items')
    .delete()
    .not('id', 'is', null);

  if (itemError) {
    console.error("Error deleting order items:", itemError);
  } else {
    console.log("Order items deleted successfully.");
  }

  const { error: orderError } = await supabase
    .from('orders')
    .delete()
    .not('id', 'is', null);

  if (orderError) {
    console.error("Error deleting orders:", orderError);
  } else {
    console.log("Orders deleted successfully.");
  }
}

deleteTestOrders();
