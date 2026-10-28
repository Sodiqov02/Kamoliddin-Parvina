import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', background: 'linear-gradient(135deg, #fffaf2 0%, #eddbc3 100%)', color: '#604330', border: '22px solid #e4c18d' }}>
      <div style={{ fontSize: 24, letterSpacing: 9, color: '#a17d4d', marginBottom: 35 }}>TOʻY TAKLIFNOMASI</div>
      <div style={{ fontSize: 76, fontFamily: 'serif', fontStyle: 'italic' }}>Kamoliddin & Parvinaxon</div>
      <div style={{ width: 240, height: 2, background: '#b58b49', margin: '32px 0' }} />
      <div style={{ fontSize: 30, letterSpacing: 4 }}>13 NOYABR 2026 · 18:00</div>
      <div style={{ fontSize: 27, marginTop: 22 }}>SHABNAM TOʻYXONASI</div>
    </div>,
    size
  );
}
