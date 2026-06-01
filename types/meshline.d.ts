// Custom three.js elements registered via `extend()` for the lanyard band.
// Loosely typed so they're usable as JSX intrinsics under @react-three/fiber v9.
import '@react-three/fiber'

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshLineGeometry: any
    meshLineMaterial: any
  }
}

declare module 'meshline' {
  export const MeshLineGeometry: any
  export const MeshLineMaterial: any
}
