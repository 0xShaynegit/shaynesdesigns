export async function onRequestPost(context) {
  const { request, env } = context;

  let data;
  try {
    data = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), { status: 400 });
  }

  const name = (data.name || '').toString().trim().slice(0, 200);
  const email = (data.email || '').toString().trim().slice(0, 300);
  const phone = (data.phone || '').toString().trim().slice(0, 60);
  const website = (data.website || '').toString().trim().slice(0, 300);
  const platform = (data.platform || '').toString().trim().slice(0, 100);
  const goal = (data.goal || '').toString().trim().slice(0, 5000);
  const turnstileToken = (data.turnstileToken || '').toString();

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || !email || !emailPattern.test(email) || !phone || !platform || !goal) {
    return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
  }

  const verifyResponse = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: env.TURNSTILE_SECRET_KEY,
      response: turnstileToken,
      remoteip: request.headers.get('CF-Connecting-IP'),
    }),
  });
  const verifyResult = await verifyResponse.json();

  if (!verifyResult.success) {
    return new Response(JSON.stringify({ error: 'Bot verification failed' }), { status: 403 });
  }

  const escapeHtml = (str) =>
    str.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const html = `
    <h2>New project enquiry from Shayne's Designs</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
    <p><strong>Website:</strong> ${escapeHtml(website || 'Not provided')}</p>
    <p><strong>Current Platform:</strong> ${escapeHtml(platform)}</p>
    <p><strong>Goal:</strong><br>${escapeHtml(goal).replace(/\n/g, '<br>')}</p>
  `;

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Shayne\'s Designs <noreply@shaynesdesigns.com>',
      to: ['shaynesdomains@gmail.com'],
      reply_to: email,
      subject: `New project enquiry from ${name}`,
      html,
    }),
  });

  if (!resendResponse.ok) {
    const errText = await resendResponse.text();
    return new Response(JSON.stringify({ error: 'Failed to send email', detail: errText }), { status: 502 });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
