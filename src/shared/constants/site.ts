export const SITE_CONFIG = {
  name: 'HJPALM',
  title: 'HJPALM Application',
  company: 'HJPALM Inc.',
  description: 'HJPALM - Project Management Application',
  logo: '/logo.svg',
  /*api: {
    baseUrl: process.env.REACT_APP_API_URL || '/api',
    timeout: 5000,
  },*/
  navigation: {
    home: '/',
    login: '/auth/login',
    dashboard: '/dashboard',
    profile: '/profile',
    settings: '/settings'
  },
  theme: {
    primaryColor: '#206bc4',
    sidebar: {
      width: '16rem',
      collapsed: '4.5rem'
    }
  }
};
