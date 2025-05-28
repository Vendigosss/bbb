import { createClient } from "npm:@supabase/supabase-js@2.39.7";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error("Missing environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
    }

    // Initialize Supabase client with explicit configuration
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing Authorization header");
    }

    // Get the JWT token
    const token = authHeader.replace("Bearer ", "");

    // Verify the user and check if they are an admin
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError) {
      throw new Error(`Authentication error: ${userError.message}`);
    }
    
    if (!user) {
      throw new Error("User not found");
    }

    // Get the user's profile to check admin status
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (profileError) {
      throw new Error(`Profile fetch error: ${profileError.message}`);
    }

    if (!profile?.is_admin) {
      throw new Error("Unauthorized - Admin access required");
    }

    // Get and validate request body
    const { productId, status } = await req.json();
    
    if (!productId) {
      throw new Error("Missing required field: productId");
    }
    
    if (!status) {
      throw new Error("Missing required field: status");
    }

    // Validate status value
    const validStatuses = ['active', 'deleted', 'sold'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status value. Must be one of: ${validStatuses.join(', ')}`);
    }

    // Update product status using service role client
    const { data: updateData, error: updateError } = await supabase
      .from("products")
      .update({ status })
      .eq("id", productId)
      .select()
      .single();

    if (updateError) {
      throw new Error(`Product update error: ${updateError.message}`);
    }

    if (!updateData) {
      throw new Error("Product not found");
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: updateData 
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Edge function error:", error);
    
    const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
    const statusCode = errorMessage.includes("Unauthorized") ? 403 : 
                      errorMessage.includes("Missing") ? 400 : 
                      errorMessage.includes("Invalid") ? 422 : 500;
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: errorMessage
      }),
      {
        status: statusCode,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});