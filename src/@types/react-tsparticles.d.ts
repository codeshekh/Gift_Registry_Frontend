// src/@types/react-tsparticles.d.ts
declare module 'react-tsparticles' {
    import { Component } from 'react';
  
    export interface ParticlesProps {
      params?: any; // You can specify the exact type of params if you want more type safety
      style?: React.CSSProperties;
      canvasClassName?: string;
      onInit?: (main: any) => void;
      onLoaded?: (container: any) => void;
      url?: string; // For loading configurations from a URL
    }
  
    export default class Particles extends Component<ParticlesProps> {}
  }
  