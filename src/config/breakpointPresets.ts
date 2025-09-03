export interface BreakpointConfig {
  id: string;
  name: string;
  description: string;
  cols: number; // Fixed column count
  containerConfig: {
    minWidth: number;
    maxWidth: number;
    adaptive: boolean;
  };
}

export const breakpointPresets: BreakpointConfig[] = [
  {
    id: 'fixed-desktop',
    name: 'Desktop Fixed Width',
    description:
      'Fixed desktop layout optimized for 1280-1680px screens with 12 columns',
    cols: 12,
    containerConfig: {
      minWidth: 1280,
      maxWidth: 1680,
      adaptive: true,
    },
  },
];

export const getBreakpointPreset = (id: string): BreakpointConfig => {
  return (
    breakpointPresets.find((preset) => preset.id === id) || breakpointPresets[0]
  );
};
