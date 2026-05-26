// src/theme/index.js

export const COLORS = {
  rose:       '#C0394B',
  roseDark:   '#8B1A28',
  roseLight:  '#FBEAEC',
  roseMid:    '#E8607A',
  gold:       '#C8975A',
  goldLight:  '#FDF4EB',
  goldDark:   '#9A6830',
  ink:        '#1A1018',
  muted:      '#6B5B65',
  subtle:     '#B8A8B0',
  bg:         '#FAF7F5',
  surface:    '#FFFFFF',
  border:     '#EDE3E6',
  borderMid:  '#D9C8CE',
  success:    '#4CAF82',
  warning:    '#F0A847',

  // Gradient arrays for LinearGradient
  headerGrad:  ['#8B1A28', '#C0394B', '#C8975A'],
  roseGrad:    ['#C0394B', '#E8607A'],
  goldGrad:    ['#C8975A', '#E8B86D'],
  noteColors:  ['#FFF9C4', '#FFD6E8', '#D6EAFF', '#D6F5E3', '#FFE8D1', '#EAD6FF'],
};

export const FONTS = {
  display:      'serif',    // fallback; swap to custom font if desired
  body:         'System',
  weights: {
    light:      '300',
    regular:    '400',
    medium:     '500',
    semibold:   '600',
    bold:       '700',
  },
};

export const SPACING = {
  xs:   4,
  sm:   8,
  md:   12,
  lg:   16,
  xl:   24,
  xxl:  32,
};

export const RADIUS = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   24,
  full: 999,
};

export const SHADOW = {
  sm: {
    shadowColor: '#1A1018',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#1A1018',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 5,
  },
  lg: {
    shadowColor: '#1A1018',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.14,
    shadowRadius: 20,
    elevation: 10,
  },
};
