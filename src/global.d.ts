export { };

declare module '*.glb';
declare module '*.png';
declare module '*.mp3';
declare module '*.json' {
  const value: any;
  export default value;
}

declare module 'meshline' {
  export const MeshLineGeometry: any;
  export const MeshLineMaterial: any;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      meshLineGeometry: any;
      meshLineMaterial: any;
    }
  }
}
