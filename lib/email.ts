interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
  try {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.EMAIL_SERVER_PASSWORD}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          {
            to: [{ email: to }],
          },
        ],
        from: {
          email:
            process.env.EMAIL_FROM?.match(/<(.+)>/)?.[1] ||
            process.env.EMAIL_FROM,
          name: "NurseHub",
        },
        subject,
        content: [
          {
            type: "text/html",
            value: html,
          },
        ],
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("SendGrid API error:", error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error("Email sending failed:", error);
    return { success: false, error };
  }
}

export function getAppointmentConfirmationEmail(
  name: string,
  status: string,
  cancellationReason?: string
): string {
  const statusConfig = {
    PENDING: {
      icon: "⏰",
      color: "#d4a574",
      bgColor: "#fef6ec",
      title: "Request Received",
      message:
        "Thank you for choosing NurseHub! We've received your appointment request and our team will review it shortly. You'll hear from us soon to confirm the details of your home visit.",
    },
    APPROVED: {
      icon: "✅",
      color: "#6b9b7a",
      bgColor: "#f0f7f3",
      title: "Appointment Approved!",
      message:
        "Great news! Your appointment has been approved. Our professional nursing team is ready to provide you with excellent home care. We'll be in touch shortly to schedule the exact date and time for your visit.",
    },
    COMPLETED: {
      icon: "🎉",
      color: "#8b5e3c",
      bgColor: "#f5ede4",
      title: "Visit Completed",
      message:
        "Thank you for choosing NurseHub for your home healthcare needs. We hope you had a positive experience with our service. Your health and comfort are our top priorities. If you need any follow-up care, we're here for you!",
    },
    CANCELLED: {
      icon: "❌",
      color: "#c97766",
      bgColor: "#fef2f0",
      title: "Appointment Cancelled",
      message: cancellationReason
        ? `Your appointment has been cancelled. Reason: ${cancellationReason}. If you have any questions or would like to reschedule, please don't hesitate to contact us. We're always here to help with your home healthcare needs.`
        : "Your appointment has been cancelled. If this was unexpected or you have any questions, please don't hesitate to contact us. We're always here to help with your home healthcare needs.",
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig];

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>NurseHub - ${config.title}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #1a1814;
            background-color: #fdfaf6;
            padding: 20px;
          }
          .email-wrapper {
            max-width: 600px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 4px 24px rgba(139, 94, 60, 0.15);
          }
          .header {
            background: linear-gradient(135deg, #d97757 0%, #c9a690 100%);
            padding: 40px 30px;
            text-align: center;
            position: relative;
            overflow: hidden;
          }
          .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
              radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
            pointer-events: none;
          }
          .logo-container {
            display: inline-block;
            background: rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 15px 20px;
            margin-bottom: 15px;
          }
          .logo {
            font-size: 36px;
            margin: 0;
            color: #ffffff;
            font-weight: 700;
            letter-spacing: -0.5px;
          }
          .tagline {
            color: rgba(255, 255, 255, 0.95);
            font-size: 14px;
            margin: 0;
            font-weight: 500;
          }
          .status-banner {
            background: ${config.bgColor};
            border-left: 4px solid ${config.color};
            padding: 20px 30px;
            display: flex;
            align-items: center;
            gap: 15px;
          }
          .status-icon {
            font-size: 32px;
            line-height: 1;
          }
          .status-text {
            flex: 1;
          }
          .status-title {
            font-size: 18px;
            font-weight: 700;
            color: ${config.color};
            margin-bottom: 4px;
          }
          .status-label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #6b6559;
            font-weight: 600;
          }
          .content {
            padding: 40px 30px;
          }
          .greeting {
            font-size: 24px;
            font-weight: 600;
            color: #1a1814;
            margin-bottom: 20px;
          }
          .message {
            font-size: 16px;
            color: #6b6559;
            line-height: 1.8;
            margin-bottom: 30px;
          }
          .info-box {
            background: #fdfaf6;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 30px;
            border: 1px solid #e8dfd5;
          }
          .info-row {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 12px;
          }
          .info-row:last-child {
            margin-bottom: 0;
          }
          .info-icon {
            width: 32px;
            height: 32px;
            background: linear-gradient(135deg, #d97757 0%, #c9a690 100%);
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 14px;
            flex-shrink: 0;
          }
          .info-text {
            flex: 1;
            font-size: 14px;
            color: #6b6559;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #d97757 0%, #c9a690 100%);
            color: white;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 10px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin-bottom: 30px;
            transition: all 0.3s ease;
          }
          .divider {
            height: 1px;
            background: linear-gradient(to right, transparent, #e8dfd5, transparent);
            margin: 30px 0;
          }
          .signature {
            color: #6b6559;
            font-size: 15px;
            line-height: 1.8;
          }
          .signature-name {
            font-weight: 600;
            color: #1a1814;
          }
          .footer {
            background: #f5ede4;
            padding: 30px;
            text-align: center;
          }
          .footer-logo {
            font-size: 20px;
            font-weight: 700;
            color: #d97757;
            margin-bottom: 10px;
          }
          .footer-text {
            color: #9b9389;
            font-size: 13px;
            line-height: 1.6;
            margin-bottom: 15px;
          }
          .social-links {
            margin: 15px 0;
          }
          .social-link {
            display: inline-block;
            width: 36px;
            height: 36px;
            background: #ffffff;
            border-radius: 8px;
            margin: 0 5px;
            line-height: 36px;
            color: #d97757;
            text-decoration: none;
            font-size: 16px;
          }
          .contact-info {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #e8dfd5;
          }
          .contact-item {
            display: inline-block;
            color: #6b6559;
            font-size: 13px;
            margin: 0 10px;
          }
          @media only screen and (max-width: 600px) {
            .email-wrapper { margin: 0; border-radius: 0; }
            .header { padding: 30px 20px; }
            .content { padding: 30px 20px; }
            .greeting { font-size: 20px; }
            .message { font-size: 15px; }
            .info-row { flex-direction: column; align-items: flex-start; }
          }
        </style>
      </head>
      <body>
        <div class="email-wrapper">
          <!-- Header -->
          <div class="header">
            <div class="logo-container">
              <h1 class="logo">❤️ NurseHub</h1>
            </div>
            <p class="tagline">Professional Home Care Services</p>
          </div>

          <!-- Status Banner -->
          <div class="status-banner">
            <div class="status-icon">${config.icon}</div>
            <div class="status-text">
              <div class="status-title">${config.title}</div>
              <div class="status-label">Status: ${status}</div>
            </div>
          </div>

          <!-- Main Content -->
          <div class="content">
            <h2 class="greeting">Hello ${name}! 👋</h2>
            
            <p class="message">${config.message}</p>

            <!-- Info Box -->
            <div class="info-box">
              <div class="info-row">
                <div class="info-icon">💼</div>
                <div class="info-text">
                  <strong>What's Next?</strong><br>
                  ${
                    status === "PENDING"
                      ? "Our team is reviewing your request and will contact you within 24 hours."
                      : status === "APPROVED"
                      ? "Check your phone for a call from our scheduling team to arrange your visit."
                      : status === "COMPLETED"
                      ? "We hope you're feeling better! If you need any follow-up care, just reach out."
                      : "You can submit a new appointment request anytime through our website."
                  }
                </div>
              </div>
              <div class="info-row">
                <div class="info-icon">📞</div>
                <div class="info-text">
                  <strong>Questions?</strong><br>
                  Feel free to reply to this email or call us. We're here to help!
                </div>
              </div>
            </div>

            <div class="divider"></div>

            <!-- Signature -->
            <div class="signature">
              <p>With care and compassion,</p>
              <p class="signature-name">The NurseHub Team</p>
              <p style="font-size: 14px; color: #9b9389; margin-top: 10px;">
                Providing professional home healthcare with heart ❤️
              </p>
            </div>
          </div>

          <!-- Footer -->
          <div class="footer">
            <div class="footer-logo">NurseHub</div>
            <p class="footer-text">
              Professional Home Care Services<br>
              Compassionate • Reliable • Professional
            </p>
            
            <div class="social-links">
              <a href="#" class="social-link">📧</a>
              <a href="#" class="social-link">📱</a>
              <a href="#" class="social-link">🌐</a>
            </div>

            <div class="contact-info">
              <span class="contact-item">📧 aziz.jrad@esen.tn</span>
              <span class="contact-item">📞 +216 XX XXX XXX</span>
              <span class="contact-item">� Dar Chaaben, Nabeul, Tunisia</span>
            </div>

            <p class="footer-text" style="margin-top: 20px; font-size: 12px;">
              © ${new Date().getFullYear()} NurseHub. All rights reserved.<br>
              You're receiving this email because you booked an appointment with us.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}
