import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Admin',
  },
 
  {
    displayName: 'Configuração',
    iconName: 'settings',
    
    children: [
      {
        displayName: 'Envío de arquivos',
        route: '/painel/arquivos',
        
      },
      {
        displayName: 'Alarmes',
        route: '/painel/alarmes',
        
      },
    ]
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
