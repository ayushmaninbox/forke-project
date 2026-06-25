'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import Globe from 'react-globe.gl'
import * as THREE from 'three'

// 3D WebGL globe (react-globe.gl / three-globe). Countries are extruded/shaded by
// click volume. Client-only — this file is dynamically imported with ssr:false by
// the parent, because the globe needs WebGL + window.

type CountryDatum = { country: string; clicks: number }
type Feature = { properties: Record<string, any> }

const GEOJSON_URL = '/countries-110m.geojson' // vendored in /public

export default function GlobeView({
  data,
  onHover,
}: {
  data: CountryDatum[]
  onHover?: (d: { name: string; clicks: number } | null) => void
}) {
  const globeEl = useRef<any>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const [countries, setCountries] = useState<Feature[]>([])
  const [size, setSize] = useState({ w: 480, h: 480 })

  // Dark matte sphere so the globe reads on the admin's dark panel (no earth texture).
  const globeMaterial = useMemo(
    () => new THREE.MeshPhongMaterial({ color: 0x0c0c0e, transparent: true, opacity: 0.95 }),
    [],
  )

  // ISO-2 -> clicks lookup, joined to each polygon via its ISO_A2 property.
  const byIso = new Map<string, number>()
  for (const d of data) byIso.set(d.country.toUpperCase(), d.clicks)
  const max = Math.max(...data.map((d) => d.clicks), 1)

  // Load vendored country polygons once.
  useEffect(() => {
    let alive = true
    fetch(GEOJSON_URL)
      .then((r) => r.json())
      .then((geo) => { if (alive) setCountries(geo.features || []) })
      .catch(() => {})
    return () => { alive = false }
  }, [])

  // Responsive sizing to the container width.
  useEffect(() => {
    if (!wrapRef.current) return
    const ro = new ResizeObserver((entries) => {
      const w = entries[0].contentRect.width
      const h = Math.min(Math.max(w, 360), 520)
      setSize({ w, h })
    })
    ro.observe(wrapRef.current)
    return () => ro.disconnect()
  }, [])

  // Gentle auto-rotation + a starting view roughly over the top source region.
  useEffect(() => {
    const g = globeEl.current
    if (!g) return
    g.controls().autoRotate = true
    g.controls().autoRotateSpeed = 0.6
    g.controls().enableZoom = false
    // Point the camera at the highest-volume country's rough longitude if known.
    g.pointOfView({ lat: 20, lng: 30, altitude: 2.1 }, 0)
  }, [countries])

  const colorFor = (feat: Feature) => {
    const iso = feat.properties.ISO_A2 as string
    const clicks = byIso.get(iso)
    if (!clicks) return 'rgba(255,255,255,0.08)' // no data — faint
    const t = clicks / max
    return `rgba(255,122,0,${0.25 + t * 0.7})` // accent at scaled opacity
  }

  return (
    <div ref={wrapRef} className="w-full flex items-center justify-center">
      <Globe
        ref={globeEl}
        width={size.w}
        height={size.h}
        backgroundColor="rgba(0,0,0,0)"
        showAtmosphere
        atmosphereColor="#ff7a00"
        atmosphereAltitude={0.12}
        showGlobe
        globeMaterial={globeMaterial}
        polygonsData={countries}
        polygonCapColor={colorFor as any}
        polygonSideColor={() => 'rgba(255,122,0,0.12)'}
        polygonStrokeColor={() => 'rgba(255,255,255,0.18)'}
        polygonAltitude={((feat: Feature) => {
          const clicks = byIso.get(feat.properties.ISO_A2)
          return clicks ? 0.02 + (clicks / max) * 0.12 : 0.006
        }) as any}
        onPolygonHover={((feat: Feature | null) => {
          if (!onHover) return
          if (!feat) { onHover(null); return }
          const iso = feat.properties.ISO_A2
          const clicks = byIso.get(iso)
          if (clicks) onHover({ name: feat.properties.NAME || feat.properties.ADMIN || iso, clicks })
          else onHover(null)
        }) as any}
        polygonsTransitionDuration={300}
      />
    </div>
  )
}
