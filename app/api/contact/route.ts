import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { create_server_client } from '@/lib/supabase/server';

interface ContactRequestBody {
  name: string;
  email: string;
  phone?: string;
  topic?: string;
  message: string;
}

const TOPIC_LABELS: Record<string, string> = {
  general: 'General Inquiry',
  listing: 'Listing Assistance',
  issue: 'Report an Issue',
  partnership: 'Partnership / Business',
};

export async function POST(request: NextRequest) {
  try {
    const body: ContactRequestBody = await request.json();
    const { name, email, phone, topic = 'general', message } = body;

    // Basic Validation
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email_regex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    const topic_label = TOPIC_LABELS[topic] || topic;
    const clean_phone = phone ? phone.trim() : 'Not provided';

    // 1. Optional Supabase Backup (non-blocking)
    try {
      const supabase = create_server_client();
      await supabase.from('contact_inquiries').insert([
        {
          name: name.trim(),
          email: email.trim(),
          phone: clean_phone,
          topic: topic_label,
          message: message.trim(),
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (db_err) {
      // Table may not exist yet in Supabase, ignore and proceed to email
      console.warn('Note: Could not save to Supabase contact_inquiries:', db_err);
    }

    // 2. Titan Email SMTP Configuration
    const smtp_host = process.env.EMAIL_HOST || process.env.TITAN_EMAIL_HOST || 'smtp.titan.email';
    const smtp_port = Number(process.env.EMAIL_PORT || process.env.TITAN_EMAIL_PORT || 465);
    const smtp_user = process.env.EMAIL_USER || process.env.TITAN_EMAIL_USER || 'info@propertytap.in';
    const smtp_pass = process.env.EMAIL_PASS || process.env.TITAN_EMAIL_PASS;

    if (!smtp_pass) {
      console.warn('Warning: EMAIL_PASS is not configured in environment variables.');
      return NextResponse.json({
        success: true,
        message: 'Message received (Pending SMTP configuration).',
      });
    }

    const transporter = nodemailer.createTransport({
      host: smtp_host,
      port: smtp_port,
      secure: smtp_port === 465, // true for 465, false for 587
      auth: {
        user: smtp_user,
        pass: smtp_pass,
      },
      tls: {
        rejectUnauthorized: true,
      },
    });

    const formatted_date = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    });

    // 3. Beautiful HTML Email Template
    const html_content = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 24px; }
    .email-container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); border: 1px solid #e2e8f0; }
    .email-header { background: linear-gradient(135deg, #1a56db 0%, #1e40af 100%); padding: 32px 24px; text-align: center; color: #ffffff; }
    .email-header h1 { margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; }
    .email-header p { margin: 6px 0 0; font-size: 14px; opacity: 0.9; }
    .email-body { padding: 28px 24px; }
    .topic-badge { display: inline-block; background: #eff6ff; color: #1a56db; font-size: 13px; font-weight: 700; padding: 6px 14px; border-radius: 9999px; border: 1px solid #bfdbfe; margin-bottom: 20px; }
    .info-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .info-table td { padding: 10px 12px; font-size: 14px; border-bottom: 1px solid #f1f5f9; }
    .info-label { font-weight: 700; color: #64748b; width: 130px; }
    .info-value { color: #0f172a; font-weight: 500; }
    .message-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-top: 8px; }
    .message-box h3 { margin: 0 0 10px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; }
    .message-text { margin: 0; font-size: 15px; line-height: 1.6; color: #1e293b; white-space: pre-wrap; }
    .email-footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 18px 24px; text-align: center; font-size: 12px; color: #94a3b8; }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>New Customer Inquiry</h1>
      <p>Submitted via PropertyTap Contact Form</p>
    </div>
    <div class="email-body">
      <div class="topic-badge">📌 ${topic_label}</div>
      <table class="info-table">
        <tr>
          <td class="info-label">Sender Name:</td>
          <td class="info-value"><strong>${name}</strong></td>
        </tr>
        <tr>
          <td class="info-label">Email Address:</td>
          <td class="info-value"><a href="mailto:${email}" style="color: #1a56db; text-decoration: none;">${email}</a></td>
        </tr>
        <tr>
          <td class="info-label">Phone / WhatsApp:</td>
          <td class="info-value">${clean_phone}</td>
        </tr>
        <tr>
          <td class="info-label">Received At:</td>
          <td class="info-value">${formatted_date}</td>
        </tr>
      </table>
      <div class="message-box">
        <h3>User Message:</h3>
        <p class="message-text">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
      </div>
    </div>
    <div class="email-footer">
      PropertyTap.in &bull; Zero Brokerage Real Estate Discovery
    </div>
  </div>
</body>
</html>
`;

    // 4. Send Email via Titan SMTP
    await transporter.sendMail({
      from: `"PropertyTap Support" <${smtp_user}>`,
      to: smtp_user, // Send to info@propertytap.in
      replyTo: email, // Direct reply to the customer's email
      subject: `[PropertyTap] New Inquiry: ${topic_label} from ${name}`,
      text: `New contact inquiry received:\n\nName: ${name}\nEmail: ${email}\nPhone: ${clean_phone}\nTopic: ${topic_label}\nDate: ${formatted_date}\n\nMessage:\n${message}`,
      html: html_content,
    });

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully to info@propertytap.in',
    });
  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to send message.' },
      { status: 500 }
    );
  }
}
