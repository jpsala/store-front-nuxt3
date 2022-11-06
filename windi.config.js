import { defineConfig } from '@windicss/plugin-utils'

export default defineConfig({
  extract: {
    include: ['**/*.{vue,html,jsx,tsx}'],
    exclude: [
      'node_modules',
      'dist',
      '.git',
      '.github',
      '.nuxt',
      // testing files & folders
      'coverage',
      '**/__snapshots__',
      '*.test.js',
    ],
  },
  plugins: [
    require('tailwindcss-elevation')(
      ['responsive'],
      {
        // color: '77,192,181',
        // opacityBoost: '0.23'
      }
    )
  ],
  safelist: 'bg-light-700',
  shortcuts:{
    
  },
  /**
   * Write windi classes in html attributes.
   * @see https://windicss.org/features/attributify.html
   */
  attributify: true,
  theme: {
    extend: {
      fontSize: {
        '2xs': '0.5rem'
      },
      maxWidth: {
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%'
      },
      maxHeight: {
        review: 'calc(100vh - 10rem)'
      },
      boxShadow: {
        DEFAULT:
          '0 2px 5px 0 rgba(60, 66, 87, 0.08), 0 0 0 1px rgba(60, 66, 87, 0.16), 0 1px 1px rgba(0, 0, 0, 0.12)',
        error:
          '0 2px 5px 0 rgba(255, 155, 155, 0.08), 0 0 0 1px rgba(255, 155, 155, 0.70), 0 1px 1px rgba(0, 0, 0, 0.12)'
      },
      colors: {
        primary: {
          "50":"#eff6ff","100":"#dbeafe","200":"#bfdbfe","300":"#93c5fd","400":"#60a5fa","500":"#3b82f6","600":"#2563eb","700":"#1d4ed8","800":"#1e40af","900":"#1e3a8a"
        },
        green: {
          DEFAULT: '#56FBB1'
        },
        blue: {
          DEFAULT: '#0A3149'
        },
        ui: {
          light: '#F7F7FA',
          DEFAULT: '#EEF0F5',
          medium: '#D9DFE8',
          dark: '#89959C'
        }
      }
    }
  }
})
