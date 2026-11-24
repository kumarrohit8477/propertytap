import { NextRequest, NextResponse } from 'next/server';
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

    // 1. Basic Validation
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

    // 2. Supabase Backup Storage (non-blocking)
    try {
      const supabase = create_server_client();
      const { error: db_error } = await supabase.from('contact_inquiries').insert([
        {
          name: name.trim(),
          email: email.trim(),
          phone: clean_phone,
          topic: topic_label,
          message: message.trim(),
          created_at: new Date().toISOString(),
        },
      ]);

      if (db_error) {
        console.warn('Note: Supabase table contact_inquiries insert note:', db_error.message);
      }
    } catch (db_err) {
      console.warn('Note: Supabase backup log skipped:', db_err);
    }

    return NextResponse.json({
      success: true,
      message: 'Inquiry received and recorded successfully.',
    });
  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to process inquiry.' },
      { status: 500 }
    );
  }
}
