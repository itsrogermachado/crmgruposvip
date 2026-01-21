import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Find all clients without payment records
    const { data: clientsWithoutPayments, error: fetchError } = await supabase
      .from("clients")
      .select(`
        id,
        user_id,
        preco,
        data_entrada,
        plano
      `);

    if (fetchError) {
      throw fetchError;
    }

    // Get all existing payment client_ids
    const { data: existingPayments, error: paymentsError } = await supabase
      .from("client_payments")
      .select("client_id");

    if (paymentsError) {
      throw paymentsError;
    }

    const existingClientIds = new Set(existingPayments?.map((p) => p.client_id) || []);

    // Filter clients that don't have payments
    const clientsToBackfill = clientsWithoutPayments?.filter(
      (client) => !existingClientIds.has(client.id)
    ) || [];

    if (clientsToBackfill.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "Todos os clientes já possuem registro de pagamento.",
          created: 0,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create payment records for each client
    const paymentsToInsert = clientsToBackfill.map((client) => ({
      client_id: client.id,
      user_id: client.user_id,
      amount: client.preco,
      payment_date: client.data_entrada,
      payment_method: "pix",
      notes: `Pagamento retroativo - ${client.plano}`,
    }));

    const { error: insertError } = await supabase
      .from("client_payments")
      .insert(paymentsToInsert);

    if (insertError) {
      throw insertError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `${paymentsToInsert.length} pagamentos retroativos criados com sucesso.`,
        created: paymentsToInsert.length,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error in backfill-payments:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
