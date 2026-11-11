import { brand } from '../../supabase/functions/_shared/brand.js'

export const webBrand = {
  name: 'Tinteruna',
  description:
    'Los libros que lees. Las historias que te habitan. Tu biblioteca y diario de lectura personal.',
  colors: {
    ...brand.colors,
    paper: '#F5EDE0',
    ink: '#252822',
    cloth: '#253D33',
    'cloth-dark': '#182D24',
    stamp: '#A65C4B',
    'stamp-dark': '#863F32',
    gilt: '#B69A62',
    surface: '#FFFAF2'
  }
}
