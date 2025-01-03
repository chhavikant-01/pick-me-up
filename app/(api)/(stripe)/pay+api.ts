import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      payment_method_id,
      payment_intent_id,
      customer_id,
      client_secret, // Add client_secret to handle 3D Secure
    } = body;

    if (!payment_method_id || !payment_intent_id || !customer_id) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400 }
      );
    }

    try {
      // Attach the payment method to the customer
      const paymentMethod = await stripe.paymentMethods.attach(
        payment_method_id,
        { customer: customer_id }
      );

      // Confirm the payment intent
      const result = await stripe.paymentIntents.confirm(payment_intent_id, {
        payment_method: paymentMethod.id,
        return_url: "myapp://book-ride", // Add return URL for 3D Secure
      });

      // Check if 3D Secure authentication is required
      if (
        result.status === "requires_action" &&
        result.next_action?.type === "use_stripe_sdk"
      ) {
        // Return the client secret for the frontend to handle 3D Secure
        return new Response(
          JSON.stringify({
            requires_action: true,
            status: result.status,
            client_secret: result.client_secret,
            next_action: result.next_action,
          })
        );
      }

      // If no 3D Secure required or authentication successful
      if (result.status === "succeeded") {
        return new Response(
          JSON.stringify({
            success: true,
            status: result.status,
            client_secret: result.client_secret,
            message: "Payment successful",
            result: result,
          })
        );
      }

      // Handle other statuses
      return new Response(
        JSON.stringify({
          success: false,
          status: result.status,
          message: "Payment requires additional action",
          result: result,
        })
      );
    } catch (stripeError: any) {
      console.error("Stripe error:", stripeError);
      return new Response(
        JSON.stringify({
          error: stripeError.message || "Payment processing failed",
          code: stripeError.code,
        }),
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error paying:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
