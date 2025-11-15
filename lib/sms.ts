// SMS Service using Twilio
// Install: npm install twilio

interface SMSOptions {
  to: string;
  message: string;
}

export async function sendSMS({ to, message }: SMSOptions) {
  try {
    // Check if Twilio credentials are configured
    if (
      !process.env.TWILIO_ACCOUNT_SID ||
      !process.env.TWILIO_AUTH_TOKEN ||
      !process.env.TWILIO_PHONE_NUMBER
    ) {
      console.log("⚠️ Twilio not configured. SMS not sent.");
      console.log("📱 Would have sent SMS to:", to);
      console.log("📝 Message:", message);
      return { success: false, error: "Twilio not configured" };
    }

    // Dynamically import Twilio only if credentials exist
    const twilio = require("twilio");
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const result = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: to,
    });

    console.log("✅ SMS sent successfully:", result.sid);
    return { success: true, messageId: result.sid };
  } catch (error) {
    console.error("❌ SMS sending failed:", error);
    return { success: false, error };
  }
}

export function getAppointmentSMSMessage(
  name: string,
  status: string,
  cancellationReason?: string
): string {
  const messages = {
    PENDING: `Hello ${name}! Your NurseHub appointment is received. We'll contact you within 24h.`,
    APPROVED: `Good news ${name}! Your NurseHub appointment is APPROVED ✅. We'll call you soon!`,
    COMPLETED: `Thank you ${name}! Hope you had a great experience with NurseHub.`,
    CANCELLED: cancellationReason
      ? `Hi ${name}, Your appointment is cancelled ❌. Reason: ${cancellationReason}`
      : `Hi ${name}, Your NurseHub appointment is cancelled ❌. Contact us to reschedule.`,
  };

  return (
    messages[status as keyof typeof messages] ||
    `Hello ${name}, Your appointment is now: ${status}`
  );
}
