import { brand } from '../_shared/brand.js'
const escape = (value) => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))
const copy = {
  signup: ['Tu próxima historia empieza aquí', 'Confirma tu correo para empezar a organizar tus libros y acompañar tus lecturas.', 'Confirmar mi cuenta'],
  invite: ['Tienes un lugar entre estas páginas', 'Has recibido una invitación para crear tu biblioteca personal.', 'Aceptar invitación'],
  recovery: ['Recupera el acceso a tu biblioteca', 'Recibimos una solicitud para restablecer tu contraseña.', 'Restablecer contraseña'],
  magiclink: ['Vuelve a tus historias', 'Utiliza este enlace para acceder a tu biblioteca.', 'Iniciar sesión'],
  email_change: ['Confirma tu cambio de correo', 'Confirma esta dirección para completar el cambio de correo de tu cuenta.', 'Confirmar correo'],
  reauthentication: ['Confirma que eres tú', 'Introduce este código en la aplicación para confirmar tu identidad.', ''],
}
export function renderAuthEmail(type, { url, otp }) {
  const [title, intro, action] = copy[type]
  const c = brand.colors
  const safety = 'Si no solicitaste esta acción, ignora este mensaje. No compartas este correo ni su enlace o código.'
  const content = otp
    ? `<p style="font-size:32px;letter-spacing:8px;font-weight:bold;color:${c.cloth}">${escape(otp)}</p>`
    : `<table role="presentation" cellspacing="0" cellpadding="0"><tr><td bgcolor="${c.cloth}" style="border-radius:6px"><a href="${escape(url)}" style="display:inline-block;padding:16px 24px;font-weight:bold;color:${c.surface};text-decoration:none">${escape(action)}</a></td></tr></table><p style="font-size:12px;margin-top:24px">Si el botón no funciona, copia este enlace en tu navegador:</p><p style="font-size:12px;word-break:break-all"><a style="color:${c.cloth}" href="${escape(url)}">${escape(url)}</a></p>`
  return {
    textContent: `${brand.name}\n\n${title}\n${intro}\n\n${otp ? `Código: ${otp}` : `${action}: ${url}`}\n\n${safety}`,
    htmlContent: `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(title)}</title></head><body style="margin:0;background:${c.paper};color:${c.ink};font-family:${brand.fontBody}"><div style="display:none;max-height:0;overflow:hidden">${escape(intro)}</div><table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr><td align="center" style="padding:32px 16px"><table role="presentation" width="560" cellspacing="0" cellpadding="0" style="width:100%;max-width:560px;background:${c.surface};border:1px solid ${c.rule}"><tr><td style="padding:24px 28px;background:${c.ink};color:${c.paper};font-family:${brand.fontDisplay};font-size:22px">${escape(brand.name)}</td></tr><tr><td style="padding:32px 28px;border-top:4px solid ${c.gilt}"><h1 style="font-family:${brand.fontDisplay};font-size:28px;font-weight:normal;line-height:1.25;margin:0 0 20px">${escape(title)}</h1><p style="font-size:16px;line-height:1.7;margin:0 0 28px">${escape(intro)}</p>${content}</td></tr><tr><td style="padding:20px 28px;border-top:1px solid ${c.rule};font-size:12px;line-height:1.6;background:${c.footer}">${escape(safety)}<br><br>${escape(brand.name)}</td></tr></table></td></tr></table></body></html>`,
  }
}
