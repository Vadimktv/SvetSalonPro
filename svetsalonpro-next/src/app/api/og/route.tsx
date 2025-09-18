import { ImageResponse } from 'next/og';
import { siteConfig } from '@/config/site';

export const runtime = 'edge';

const size = {
  width: 1200,
  height: 630
};

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: 'radial-gradient(circle at top left, #fbcfe8, #f472b6 45%, #312e81 100%)',
          padding: '64px',
          color: '#fff',
          fontFamily: 'Manrope, Inter, system-ui'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 112,
              height: 112,
              borderRadius: '32px',
              background: 'rgba(15, 23, 42, 0.75)',
              fontSize: 72,
              fontWeight: 700
            }}
          >
            SP
          </span>
          <span style={{ fontSize: 28, letterSpacing: 4, textTransform: 'uppercase', opacity: 0.85 }}>
            {siteConfig.address.city}
          </span>
        </div>
        <div style={{ maxWidth: 820, display: 'flex', flexDirection: 'column', gap: 24 }}>
          <span style={{ fontSize: 56, fontWeight: 600, lineHeight: 1.1 }}>
            СветSalon Pro — авторский салон красоты с премиальным сервисом
          </span>
          <span style={{ fontSize: 28, opacity: 0.9 }}>
            Сложное окрашивание, визаж, уходы и nail-эстетика от команды международного уровня
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 28 }}>
          <span>Запись: {siteConfig.contact.phone}</span>
          <span style={{ fontWeight: 500 }}>{new Date().getFullYear()}</span>
        </div>
      </div>
    ),
    size
  );
}
