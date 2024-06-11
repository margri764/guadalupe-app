import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Admin',
  },
 
  {
    displayName: 'Configuração',
    iconName: 'settings',
    // route: 'painel/congressos',
  },

    
    {
      navCap: 'Usuários',
    },

    {
      displayName: 'Usuários',
      iconName: 'user-plus',
    
      children: [
        {
          displayName: 'Usuários',
          route: '/painel/usuarios',
          
        },
        {
          displayName: 'Duplas',
          route: '/painel/duplas',
        },

        {
          displayName: 'Grupos',
          route: '/painel/grupos',
        },
      ],
  
      },
   
  
 
];
