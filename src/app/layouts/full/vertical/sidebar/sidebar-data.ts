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
        childName: 'Envío de arquivos',
        route: '/painel/arquivos',
      },
      {
        childName: 'Alarmes',
        route: '/painel/alarmes',
      },
      {
        childName: 'Próximos alarmes',
        route: '/painel/proximos-alarmes',
      },
      
      {
        childName: 'Segmentações',
        children: [
          {
            childrenName: 'Tratamento',
            route: '/painel/tratamento',
          },
          {
            childrenName: 'Profissão',
            route: '/painel/profissao',
          },
          {
            childrenName: 'Email',
            route: '/painel/segmentacao-de-emails',
          }
        ]
        
      },
    ]
    
  },

    
    {
      navCap: 'Usuários',
    },

    {
      childName: 'Usuários',
      iconName: 'user-plus',
    
      children: [
        {
          childrenName: 'Usuários',
          route: '/painel/usuarios',
          
        },
        {
          childrenName: 'Duplas',
          route: '/painel/duplas',
        },

        {
          childrenName: 'Grupos',
          route: '/painel/grupos',
        },
      ],
  
      },
   
  
 
];
