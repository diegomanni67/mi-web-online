import { ImageResponse } from 'next/og'

export const alt = 'Koterie Language Studio — clases de inglés, comunidad y práctica'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #070b16 0%, #111a37 52%, #2e1065 100%)',
          color: 'white',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 520,
            height: 520,
            borderRadius: 999,
            top: -190,
            right: -80,
            background: 'rgba(168,85,247,0.28)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 420,
            height: 420,
            borderRadius: 999,
            bottom: -220,
            left: 120,
            background: 'rgba(59,130,246,0.22)',
          }}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '64px 72px',
            width: '100%',
            zIndex: 2,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div
              style={{
                width: 60,
                height: 60,
                borderRadius: 18,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #7c3aed, #db2777)',
                fontSize: 34,
                fontWeight: 900,
              }}
            >
              K
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: -1 }}>Koterie</div>
              <div style={{ fontSize: 17, color: 'rgba(255,255,255,.58)', letterSpacing: 3 }}>LANGUAGE STUDIO</div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 940 }}>
            <div style={{ fontSize: 70, lineHeight: 1.02, fontWeight: 900, letterSpacing: -3 }}>
              Aprendé inglés y seguí usándolo cuando termina la clase.
            </div>
            <div style={{ marginTop: 28, fontSize: 26, color: 'rgba(255,255,255,.7)' }}>
              Clases en vivo · comunidad · práctica toda la semana
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  )
}
