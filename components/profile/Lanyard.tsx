/* eslint-disable react/no-unknown-property */
/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Canvas, extend, useFrame } from '@react-three/fiber'
import { useGLTF, useTexture, Environment, Lightformer, Html } from '@react-three/drei'
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  RigidBodyProps,
} from '@react-three/rapier'
import { MeshLineGeometry, MeshLineMaterial } from 'meshline'
import * as THREE from 'three'

extend({ MeshLineGeometry, MeshLineMaterial })

// Assets live in /public so Next can serve them without webpack .glb config.
const CARD_GLB = '/lanyard/card.glb'
const LANYARD_PNG = '/lanyard/lanyard.png'
const FORKY_BACK = '/forke-assets/forky_clean_transparent.png'

useGLTF.preload(CARD_GLB)

export interface LanyardCard {
  name: string
  username?: string | null
  level: number
  title: string
  headline?: string | null
  avatarUrl?: string | null
}

interface LanyardProps {
  position?: [number, number, number]
  gravity?: [number, number, number]
  fov?: number
  transparent?: boolean
  className?: string
  card?: LanyardCard
}

export default function Lanyard({
  position = [0, -2, 20],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
  className = '',
  card,
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState<boolean>(
    () => typeof window !== 'undefined' && window.innerWidth < 768
  )

  useEffect(() => {
    const handleResize = (): void => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className={`relative z-0 w-full h-full flex justify-center items-center ${className}`}>
      <Canvas
        camera={{ position, fov }}
        dpr={[1, isMobile ? 2 : 3]}
        gl={{ alpha: transparent, antialias: true }}
        onCreated={({ gl }) => gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)}
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={isMobile ? 1 / 30 : 1 / 60}>
          <Band isMobile={isMobile} card={card} />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer intensity={2} color="white" position={[0, -1, 5]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[-1, -1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={3} color="white" position={[1, 1, 1]} rotation={[0, 0, Math.PI / 3]} scale={[100, 0.1, 1]} />
          <Lightformer intensity={10} color="white" position={[-10, 0, 14]} rotation={[0, Math.PI / 2, Math.PI / 3]} scale={[100, 10, 1]} />
        </Environment>
      </Canvas>
    </div>
  )
}

interface BandProps {
  maxSpeed?: number
  minSpeed?: number
  isMobile?: boolean
  card?: LanyardCard
}

// ---- rotation feel (continuous CW↔CCW, front shown longer than back) ----
const ROT_AMPLITUDE = 3.4 // radians at the peak (~195°, just past the back face)
const ROT_SPEED = 0.4 // higher = flips happen more often

// ---- HTML face sizing ----
const FACE_W = 380 // px (card art is rendered as real DOM at this width)
const FACE_H = 536 // px
// drei <Html transform> renders px much smaller than 1 world unit, so the raw
// place.w/FACE_W ratio comes out ~40× too small. This fudge sizes the DOM card
// to fill the model card — bump it up/down if the card looks too big/small.
const FACE_FUDGE = 48
const FACE_OFFSET = 0.04 // how far each DOM face sits off the body (avoids occlusion clipping)

function Band({ minSpeed = 0, maxSpeed = 50, isMobile = false, card }: BandProps) {
  const band = useRef<any>(null)
  const fixed = useRef<any>(null)
  const j1 = useRef<any>(null)
  const j2 = useRef<any>(null)
  const j3 = useRef<any>(null)
  const cardRef = useRef<any>(null)
  const bodyRef = useRef<any>(null)

  const ang = new THREE.Vector3()

  const segmentProps: any = {
    type: 'dynamic' as RigidBodyProps['type'],
    canSleep: true,
    colliders: false,
    angularDamping: 3,
    linearDamping: 3,
  }

  const { nodes, materials } = useGLTF(CARD_GLB) as any
  const texture = useTexture(LANYARD_PNG)

  // The model card's bounding box, mapped into the RigidBody's local space
  // (the visual card lives in a group scaled 2.25 at [0,-1.2,-0.05]).
  const place = useMemo(() => {
    const geo = nodes.card.geometry
    geo.computeBoundingBox()
    const bb = geo.boundingBox as THREE.Box3
    const c = new THREE.Vector3(); bb.getCenter(c)
    const s = new THREE.Vector3(); bb.getSize(s)
    const S = 2.25
    return {
      cx: S * c.x,
      cy: -1.2 + S * c.y,
      cz: -0.05 + S * c.z,
      w: S * s.x,
      h: S * s.y,
      d: S * s.z,
    }
  }, [nodes])

  // Scale that maps the FACE_W-px DOM onto the card's world width.
  const htmlScale = (place.w / FACE_W) * FACE_FUDGE

  const [curve] = useState(
    () => new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
  )

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1])
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1])
  useSphericalJoint(j3, cardRef, [
    [0, 0, 0],
    [0, 1.45, 0],
  ])

  useFrame((state, delta) => {
    if (!fixed.current || !cardRef.current) return

    // Relax band joints toward rest, then redraw the woven strap.
    ;[j1, j2].forEach((ref) => {
      if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation())
      const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())))
      ref.current.lerped.lerp(ref.current.translation(), delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed)))
    })
    curve.points[0].copy(j3.current.translation())
    curve.points[1].copy(j2.current.lerped)
    curve.points[2].copy(j1.current.lerped)
    curve.points[3].copy(fixed.current.translation())
    band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32))

    // Continuous turn. Driving y-angvel with the derivative of A·sin³(ωt) makes
    // the angle follow sin³ — it lingers at the front (0°) and sweeps quickly
    // through the back (±A), so the front is shown far longer. It naturally goes
    // clockwise, then anticlockwise, forever. The x/z sway stays physics-driven.
    const t = state.clock.elapsedTime
    const s = Math.sin(t * ROT_SPEED)
    const yVel = ROT_AMPLITUDE * 3 * s * s * Math.cos(t * ROT_SPEED) * ROT_SPEED
    ang.copy(cardRef.current.angvel())
    cardRef.current.setAngvel({ x: ang.x, y: yVel, z: ang.z })
  })

  curve.curveType = 'chordal'
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping

  return (
    <>
      <group position={[0, 4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type={'fixed' as RigidBodyProps['type']} />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps} type={'dynamic' as RigidBodyProps['type']}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps} type={'dynamic' as RigidBodyProps['type']}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps} type={'dynamic' as RigidBodyProps['type']}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[2, 0, 0]} ref={cardRef} {...segmentProps} type={'dynamic' as RigidBodyProps['type']}>
          <CuboidCollider args={[0.8, 1.125, 0.01]} />

          {/* Physical card body + metal clip from the model (gives depth + the clasp) */}
          <group scale={2.25} position={[0, -1.2, -0.05]}>
            <mesh ref={bodyRef} geometry={nodes.card.geometry}>
              <meshPhysicalMaterial color="#0b0709" roughness={0.85} metalness={0.5} clearcoat={isMobile ? 0 : 0.5} clearcoatRoughness={0.4} />
            </mesh>
            <mesh geometry={nodes.clip.geometry} material={materials.metal} material-roughness={0.3} />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>

          {/* Real DOM faces (crisp text + fetched <img>), occluded by the body so
              only the side facing the camera is visible. */}
          {card && (
            <>
              <Html
                transform
                occlude={[bodyRef]}
                position={[place.cx, place.cy, place.cz + place.d / 2 + FACE_OFFSET]}
                scale={htmlScale}
                zIndexRange={[10, 0]}
                style={{ width: FACE_W, height: FACE_H }}
              >
                <CardFront card={card} />
              </Html>
              <Html
                transform
                occlude={[bodyRef]}
                position={[place.cx, place.cy, place.cz - place.d / 2 - FACE_OFFSET]}
                rotation={[0, Math.PI, 0]}
                scale={htmlScale}
                zIndexRange={[10, 0]}
                style={{ width: FACE_W, height: FACE_H }}
              >
                <CardBack card={card} />
              </Html>
            </>
          )}
        </RigidBody>
      </group>

      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          color="white"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap
          map={texture}
          repeat={[-4, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  )
}

/* ----------------------------- DOM card faces ----------------------------- */

const faceClass =
  'rounded-[28px] overflow-hidden border border-white/[0.1] p-7 flex flex-col bg-gradient-to-b from-[#151013] via-[#0d0a0c] to-[#0a0708] shadow-[0_30px_70px_rgba(0,0,0,0.6)] select-none'

function CardFront({ card }: { card: LanyardCard }) {
  const initial = (card.name?.[0] || 'F').toUpperCase()
  return (
    <div style={{ width: FACE_W, height: FACE_H }} className={faceClass}>
      <div className="relative flex items-center justify-between">
        <span className="text-[#ff8a00] font-mono font-black text-2xl">FORKE //</span>
        <span className="text-white/35 font-mono font-bold text-[12px] tracking-[0.15em]">DEV CREDENTIAL</span>
      </div>

      <div className="relative flex-1 flex flex-col items-center justify-center gap-6">
        <div className="w-40 h-40 rounded-full overflow-hidden border-[5px] border-[#ff8a00]/70 bg-[#ff8a00]/10 flex items-center justify-center shadow-[0_0_30px_rgba(255,138,0,0.18)]">
          {card.avatarUrl ? (
            <img src={card.avatarUrl} alt={card.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-6xl font-black text-[#ff8a00]">{initial}</span>
          )}
        </div>

        <div className="w-full space-y-3">
          <Field><span className="font-bold text-white text-[22px]">{card.name}</span></Field>
          <Field><span className="font-mono font-bold text-[#ff8a00] text-[18px]">LVL {card.level} · {card.title}</span></Field>
          <Field><span className="text-white/70 text-[16px]">{card.headline || 'Building real, verified work.'}</span></Field>
        </div>
      </div>

      <div className="relative">
        <div className="flex items-end gap-[3px] h-9 opacity-25">
          {BARS.map((w, i) => <span key={i} className="bg-white" style={{ width: w, height: '100%' }} />)}
        </div>
        <p className="text-[11px] font-mono text-white/30 tracking-[0.12em] mt-2">VERIFIED · PROOF OF WORK · FORKE.SPACE</p>
      </div>
    </div>
  )
}

function CardBack({ card }: { card: LanyardCard }) {
  return (
    <div style={{ width: FACE_W, height: FACE_H }} className={faceClass}>
      <div className="relative flex items-center justify-between">
        <span className="text-white/30 font-mono font-bold text-[12px] tracking-[0.15em]">FORKE NETWORK</span>
        <span className="text-[#ff8a00] font-mono font-black text-2xl">//</span>
      </div>
      <div className="relative flex-1 flex flex-col items-center justify-center gap-3">
        <img src={FORKY_BACK} alt="Forky" className="w-56 h-56 object-contain drop-shadow-[0_0_24px_rgba(255,138,0,0.15)]" />
        <span className="text-[#ff8a00] font-mono font-black text-3xl">@{card.username || 'forke'}</span>
      </div>
      <p className="relative text-center text-[11px] font-mono text-white/30 tracking-[0.18em]">FORKE // DEVELOPER NETWORK</p>
    </div>
  )
}

function Field({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full text-center py-3 rounded-2xl border border-[#ff8a00]/25 bg-white/[0.015]">
      {children}
    </div>
  )
}

const BARS = ['3px', '5px', '2px', '7px', '3px', '2px', '6px', '3px', '4px', '8px', '2px', '5px', '3px', '6px', '4px', '2px', '7px', '3px', '5px', '4px', '2px', '6px', '8px', '3px', '4px', '5px', '2px', '7px', '3px', '4px', '6px', '2px', '5px', '3px', '8px', '4px', '2px', '6px', '3px', '5px']
