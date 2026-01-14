import type { Handler } from '@netlify/functions';
import nodemailer from 'nodemailer';

// SMTP Transporter - Google Workspace
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // info@allyncai.com
    pass: process.env.SMTP_PASS, // App Password
  },
});

// HTML Injection koruması - kullanıcı girdilerini escape et
const escapeHtml = (text: string): string => {
  if (!text) return '';
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
};

// Email validasyonu
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Telefon validasyonu
const isValidPhone = (phone: string): boolean => {
  if (!phone) return true;
  const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone) && phone.length >= 10;
};

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    if (!event.body) {
      throw new Error('No body provided');
    }
    const { name, email, phone, business, message, language } = JSON.parse(event.body);

    // Zorunlu alan kontrolü
    if (!name || !email || !business || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Email format validasyonu
    if (!isValidEmail(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid email format' }),
      };
    }

    // Telefon format validasyonu
    if (phone && !isValidPhone(phone)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Invalid phone format' }),
      };
    }

    // Kullanıcı girdilerini escape et (XSS koruması)
    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone || '');
    const safeBusiness = escapeHtml(business);
    const safeMessage = escapeHtml(message || '');

    // Email gönderim sonuçlarını takip et
    let notificationSent = false;
    let autoReplySent = false;
    let notificationError: unknown = null;
    let autoReplyError: unknown = null;

    const fromEmail = process.env.SMTP_USER || 'info@allyncai.com';

    // 1. Notification Email to You
    console.log('📧 Attempting to send notification email via SMTP...');
    console.log('FROM:', fromEmail);
    console.log('TO:', fromEmail);

    try {
      await transporter.sendMail({
        from: `Allync AI <${fromEmail}>`,
        to: fromEmail,
        replyTo: email,
        subject: `New Contact Form Submission from ${safeName}`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f7; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="padding: 0; line-height: 0;">
              <img src="https://www.allyncai.com/mail-header-full.png" alt="Allync AI - AI-Powered Business Automation" width="600" style="width: 600px; max-width: 100%; height: auto; display: block; border-radius: 16px 16px 0 0;">
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 50px 40px;">
              <h2 style="color: #1a1a1a; margin-top: 0; margin-bottom: 20px; font-size: 26px; font-weight: 600;">Yeni İletişim Formu</h2>

              <table width="100%" cellpadding="12" cellspacing="0" style="margin-bottom: 25px;">
                <tr>
                  <td style="background-color: #f5f5f7; padding: 12px 16px; border-radius: 8px; width: 120px; font-weight: 600; color: #4a4a4a;">İsim:</td>
                  <td style="padding: 12px 16px; color: #1a1a1a;">${safeName}</td>
                </tr>
                <tr>
                  <td style="background-color: #f5f5f7; padding: 12px 16px; border-radius: 8px; font-weight: 600; color: #4a4a4a;">E-posta:</td>
                  <td style="padding: 12px 16px;"><a href="mailto:${safeEmail}" style="color: #00d9ff; text-decoration: none; font-weight: 500;">${safeEmail}</a></td>
                </tr>
                <tr>
                  <td style="background-color: #f5f5f7; padding: 12px 16px; border-radius: 8px; font-weight: 600; color: #4a4a4a;">Telefon:</td>
                  <td style="padding: 12px 16px; color: #1a1a1a;">${safePhone || 'Belirtilmemiş'}</td>
                </tr>
                <tr>
                  <td style="background-color: #f5f5f7; padding: 12px 16px; border-radius: 8px; font-weight: 600; color: #4a4a4a;">İşletme:</td>
                  <td style="padding: 12px 16px; color: #1a1a1a;">${safeBusiness}</td>
                </tr>
              </table>

              <div style="background: linear-gradient(135deg, #e8f9ff 0%, #f3e8ff 100%); padding: 25px; border-radius: 12px; border-left: 4px solid #00d9ff; margin: 30px 0;">
                <h3 style="color: #1a1a1a; margin-top: 0; margin-bottom: 12px; font-size: 18px; font-weight: 600;">Mesaj:</h3>
                <p style="color: #4a4a4a; line-height: 1.7; margin: 0; white-space: pre-wrap;">${safeMessage || 'Mesaj yok'}</p>
              </div>
            </td>
          </tr>

          <!-- Footer / Signature -->
          <tr>
            <td style="background-color: #fafafa; padding: 40px; text-align: center; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0 0 8px 0; font-size: 16px; color: #666666;">Saygılarımızla,</p>
              <p style="margin: 0 0 30px 0; font-size: 22px; font-weight: 700; background: linear-gradient(135deg, #00d9ff 0%, #00b8e6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Allync AI Ekibi</p>

              <!-- Contact Info Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 25px 0; background-color: #ffffff; border: 2px solid #00d9ff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 217, 255, 0.15);">
                <tr>
                  <td style="width: 50%; padding: 25px 20px 25px 25px; vertical-align: top;">
                    <p style="margin: 0 0 10px 0; color: #4a4a4a; font-size: 14px; line-height: 1.6;">
                      📧 <a href="mailto:info@allyncai.com" style="color: #00d9ff; text-decoration: none; font-weight: 500;">info@allyncai.com</a>
                    </p>
                    <p style="margin: 0 0 10px 0; color: #4a4a4a; font-size: 14px; line-height: 1.6;">
                      🌐 <a href="https://allyncai.com" style="color: #00d9ff; text-decoration: none; font-weight: 500;">allyncai.com</a>
                    </p>
                    <p style="margin: 0; color: #4a4a4a; font-size: 14px; line-height: 1.6;">
                      🌐 <a href="https://allyncai.com.tr" style="color: #00d9ff; text-decoration: none; font-weight: 500;">allyncai.com.tr</a>
                    </p>
                  </td>
                  <td style="width: 50%; padding: 25px 25px 25px 20px; vertical-align: top; border-left: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 10px 0; color: #4a4a4a; font-size: 14px; line-height: 1.6;">
                      🇹🇷 <a href="tel:+905334940416" style="color: #00d9ff; text-decoration: none; font-weight: 500;">+90 533 494 04 16</a>
                    </p>
                    <p style="margin: 0; color: #4a4a4a; font-size: 14px; line-height: 1.6;">
                      🇶🇦 <a href="tel:+97451079565" style="color: #00d9ff; text-decoration: none; font-weight: 500;">+974 5107 9565</a>
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 20px 0 5px 0; color: #999999; font-size: 13px;">
                © 2026 Allync AI. Tüm hakları saklıdır.
              </p>
              <p style="margin: 5px 0 0 0; color: #bbbbbb; font-size: 12px;">
                Bu email, web sitemizdeki iletişim formundan gönderilmiştir.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,
      });

      console.log('✅ Notification email sent successfully!');
      notificationSent = true;
    } catch (err) {
      console.error('❌ Notification email failed:', err);
      notificationError = err;
    }

    // 2. Auto-Reply Email to the User (with i18n)
    const isTurkish = language === 'tr';

    const subject = isTurkish
      ? 'Mesajınız Alınmıştır | Allync AI'
      : 'Your Message Has Been Received | Allync AI';

    const htmlTemplate = isTurkish ? `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f7; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="padding: 0; line-height: 0;">
              <img src="https://www.allyncai.com/mail-header-full.png" alt="Allync AI - AI-Powered Business Automation" width="600" style="width: 600px; max-width: 100%; height: auto; display: block; border-radius: 16px 16px 0 0;">
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 50px 40px;">
              <h2 style="color: #1a1a1a; margin-top: 0; margin-bottom: 20px; font-size: 26px; font-weight: 600;">Merhaba ${safeName},</h2>

              <p style="color: #4a4a4a; line-height: 1.7; font-size: 16px;">
                Bizimle iletişime geçtiğiniz için <strong>teşekkür ederiz</strong>.
              </p>

              <div style="background: linear-gradient(135deg, #e8f9ff 0%, #f3e8ff 100%); padding: 25px; border-radius: 12px; border-left: 4px solid #00d9ff; margin: 30px 0;">
                <p style="color: #1a1a1a; margin: 0; line-height: 1.6; font-size: 15px;">
                  ✅ Mesajınız başarıyla ulaşmıştır<br>
                  ⏱️ En kısa sürede geri dönüş yapacağız
                </p>
              </div>

              <p style="color: #4a4a4a; line-height: 1.7; font-size: 16px;">
                İşletmeniz için AI çözümlerimiz hakkında daha fazla bilgi almak isterseniz,
                web sitemizi ziyaret edebilir veya doğrudan bize ulaşabilirsiniz.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://allyncai.com" style="display: inline-block; background: linear-gradient(135deg, #00d9ff 0%, #00b8e6 100%); color: #ffffff; padding: 16px 40px; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(0, 217, 255, 0.3);">Web Sitemizi Ziyaret Edin</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer / Signature -->
          <tr>
            <td style="background-color: #fafafa; padding: 40px; text-align: center; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0 0 8px 0; font-size: 16px; color: #666666;">Saygılarımızla,</p>
              <p style="margin: 0 0 30px 0; font-size: 22px; font-weight: 700; background: linear-gradient(135deg, #00d9ff 0%, #00b8e6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">Allync AI Ekibi</p>

              <!-- Contact Info Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 25px 0; background-color: #ffffff; border: 2px solid #00d9ff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 217, 255, 0.15);">
                <tr>
                  <td style="width: 50%; padding: 25px 20px 25px 25px; vertical-align: top;">
                    <p style="margin: 0 0 10px 0; color: #4a4a4a; font-size: 14px; line-height: 1.6;">
                      📧 <a href="mailto:info@allyncai.com" style="color: #00d9ff; text-decoration: none; font-weight: 500;">info@allyncai.com</a>
                    </p>
                    <p style="margin: 0 0 10px 0; color: #4a4a4a; font-size: 14px; line-height: 1.6;">
                      🌐 <a href="https://allyncai.com" style="color: #00d9ff; text-decoration: none; font-weight: 500;">allyncai.com</a>
                    </p>
                    <p style="margin: 0; color: #4a4a4a; font-size: 14px; line-height: 1.6;">
                      🌐 <a href="https://allyncai.com.tr" style="color: #00d9ff; text-decoration: none; font-weight: 500;">allyncai.com.tr</a>
                    </p>
                  </td>
                  <td style="width: 50%; padding: 25px 25px 25px 20px; vertical-align: top; border-left: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 10px 0; color: #4a4a4a; font-size: 14px; line-height: 1.6;">
                      🇹🇷 <a href="tel:+905334940416" style="color: #00d9ff; text-decoration: none; font-weight: 500;">+90 533 494 04 16</a>
                    </p>
                    <p style="margin: 0; color: #4a4a4a; font-size: 14px; line-height: 1.6;">
                      🇶🇦 <a href="tel:+97451079565" style="color: #00d9ff; text-decoration: none; font-weight: 500;">+974 5107 9565</a>
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 20px 0 5px 0; color: #999999; font-size: 13px;">
                © 2026 Allync AI. Tüm hakları saklıdır.
              </p>
              <p style="margin: 5px 0 0 0; color: #bbbbbb; font-size: 12px;">
                Bu email, web sitemizdeki iletişim formundan gönderilmiştir.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
` : `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f7; padding: 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
          <!-- Header -->
          <tr>
            <td style="padding: 0; line-height: 0;">
              <img src="https://www.allyncai.com/mail-header-full.png" alt="Allync AI - AI-Powered Business Automation" width="600" style="width: 600px; max-width: 100%; height: auto; display: block; border-radius: 16px 16px 0 0;">
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 50px 40px;">
              <h2 style="color: #1a1a1a; margin-top: 0; margin-bottom: 20px; font-size: 26px; font-weight: 600;">Hello ${safeName},</h2>

              <p style="color: #4a4a4a; line-height: 1.7; font-size: 16px;">
                <strong>Thank you</strong> for contacting us.
              </p>

              <div style="background: linear-gradient(135deg, #e8f9ff 0%, #f3e8ff 100%); padding: 25px; border-radius: 12px; border-left: 4px solid #00d9ff; margin: 30px 0;">
                <p style="color: #1a1a1a; margin: 0; line-height: 1.6; font-size: 15px;">
                  ✅ Your message has been received<br>
                  ⏱️ We will get back to you soon
                </p>
              </div>

              <p style="color: #4a4a4a; line-height: 1.7; font-size: 16px;">
                If you'd like to learn more about our AI solutions for your business,
                feel free to visit our website or reach out to us directly.
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="https://allyncai.com" style="display: inline-block; background: linear-gradient(135deg, #00d9ff 0%, #00b8e6 100%); color: #ffffff; padding: 16px 40px; border-radius: 50px; text-decoration: none; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(0, 217, 255, 0.3);">Visit Our Website</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer / Signature -->
          <tr>
            <td style="background-color: #fafafa; padding: 40px; text-align: center; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0 0 8px 0; font-size: 16px; color: #666666;">Best regards,</p>
              <p style="margin: 0 0 30px 0; font-size: 22px; font-weight: 700; background: linear-gradient(135deg, #00d9ff 0%, #00b8e6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">The Allync AI Team</p>

              <!-- Contact Info Box -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 25px 0; background-color: #ffffff; border: 2px solid #00d9ff; border-radius: 12px; box-shadow: 0 2px 8px rgba(0, 217, 255, 0.15);">
                <tr>
                  <td style="width: 50%; padding: 25px 20px 25px 25px; vertical-align: top;">
                    <p style="margin: 0 0 10px 0; color: #4a4a4a; font-size: 14px; line-height: 1.6;">
                      📧 <a href="mailto:info@allyncai.com" style="color: #00d9ff; text-decoration: none; font-weight: 500;">info@allyncai.com</a>
                    </p>
                    <p style="margin: 0 0 10px 0; color: #4a4a4a; font-size: 14px; line-height: 1.6;">
                      🌐 <a href="https://allyncai.com" style="color: #00d9ff; text-decoration: none; font-weight: 500;">allyncai.com</a>
                    </p>
                    <p style="margin: 0; color: #4a4a4a; font-size: 14px; line-height: 1.6;">
                      🌐 <a href="https://allyncai.com.tr" style="color: #00d9ff; text-decoration: none; font-weight: 500;">allyncai.com.tr</a>
                    </p>
                  </td>
                  <td style="width: 50%; padding: 25px 25px 25px 20px; vertical-align: top; border-left: 1px solid #e5e7eb;">
                    <p style="margin: 0 0 10px 0; color: #4a4a4a; font-size: 14px; line-height: 1.6;">
                      🇹🇷 <a href="tel:+905334940416" style="color: #00d9ff; text-decoration: none; font-weight: 500;">+90 533 494 04 16</a>
                    </p>
                    <p style="margin: 0; color: #4a4a4a; font-size: 14px; line-height: 1.6;">
                      🇶🇦 <a href="tel:+97451079565" style="color: #00d9ff; text-decoration: none; font-weight: 500;">+974 5107 9565</a>
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 20px 0 5px 0; color: #999999; font-size: 13px;">
                © 2026 Allync AI. All rights reserved.
              </p>
              <p style="margin: 5px 0 0 0; color: #bbbbbb; font-size: 12px;">
                This email was sent from our website contact form.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    console.log('📧 Attempting to send auto-reply email via SMTP...');
    console.log('TO:', email);

    try {
      await transporter.sendMail({
        from: `Allync AI <${fromEmail}>`,
        to: email,
        replyTo: fromEmail,
        subject,
        html: htmlTemplate,
      });

      console.log('✅ Auto-reply email sent successfully!');
      autoReplySent = true;
    } catch (err) {
      console.error('❌ Auto-reply email failed:', err);
      autoReplyError = err;
    }

    // Sonuç değerlendirmesi
    if (notificationSent && autoReplySent) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Emails sent successfully' }),
      };
    } else if (notificationSent && !autoReplySent) {
      console.warn('⚠️ Partial success: notification sent, auto-reply failed');
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Message received (auto-reply could not be sent)',
          partialSuccess: true
        }),
      };
    } else if (!notificationSent && autoReplySent) {
      console.warn('⚠️ Partial success: auto-reply sent, notification failed');
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Emails sent successfully',
          partialSuccess: true
        }),
      };
    } else {
      console.error('❌ Both emails failed');
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Failed to send emails',
          details: {
            notificationError: notificationError ? String(notificationError) : null,
            autoReplyError: autoReplyError ? String(autoReplyError) : null,
          }
        }),
      };
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error);
    console.error('Error details:', JSON.stringify(error, null, 2));
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'An unexpected error occurred' }),
    };
  }
};
