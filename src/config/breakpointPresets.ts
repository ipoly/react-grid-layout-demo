export interface BreakpointConfig {
  id: string;
  name: string;
  description: string;
  breakpoints: { lg: number; md: number; sm: number };
  cols: { lg: number; md: number; sm: number };
  containerConfig?: {
    minWidth?: number;
    maxWidth?: number;
    adaptive?: boolean; // Whether to follow container width changes
  };
}

export const breakpointPresets: BreakpointConfig[] = [
  {
    id: 'experimental',
    name: 'Fixed Layout (Original Design)',
    description:
      'Container width 1280-1680px, 12 columns fixed, layout does not change with viewport',
    breakpoints: { lg: 1200, md: 996, sm: 768 },
    cols: { lg: 12, md: 10, sm: 6 },
    containerConfig: {
      minWidth: 1280,
      maxWidth: 1680,
      adaptive: true,
    },
  },
  {
    id: 'default',
    name: 'Default (Bootstrap-like)',
    description: 'Classic responsive breakpoints, suitable for most scenarios',
    breakpoints: { lg: 1200, md: 996, sm: 768 },
    cols: { lg: 12, md: 10, sm: 6 },
  },
];

export const getBreakpointPreset = (id: string): BreakpointConfig => {
  return (
    breakpointPresets.find((preset) => preset.id === id) || breakpointPresets[0]
  );
};
