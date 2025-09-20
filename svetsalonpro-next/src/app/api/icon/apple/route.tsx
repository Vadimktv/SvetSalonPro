import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f9a8d4 0%, #ec4899 55%, #7c3aed 100%)',
          borderRadius: 48,
          fontSize: 88,
          fontWeight: 700,
          color: '#fff',
          fontFamily: 'Manrope, Inter, system-ui'
        }}
      >
        SP
      </div>
    ),
    {
      width: 180,
      height: 180
    }
  );
}
