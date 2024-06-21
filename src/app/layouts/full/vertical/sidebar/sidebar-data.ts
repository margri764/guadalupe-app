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
            childrenName: 'Tratamentos',
            route: '/painel/tratamento',
          },
          {
            childrenName: 'Profissões',
            route: '/painel/profissao',
          },
          {
            childrenName: 'E-mails',
            route: '/painel/segmentacao-de-emails',
          },
          {
            childrenName: 'Telefones',
            route: '/painel/segmentacao-de-telefone',
          },
          {
            childrenName: 'Endereços',
            route: '/painel/segmentacao-de-enderecos',
          },
          {
            childrenName: 'Relaçãos',
            route: '/painel/segmentacao-de-relacao',
          }
        ]
        
      },
      {
        childName: 'Congreatio',
        route: '/painel/congregatio',
      },
      {
        childName: 'Cidades - Dioceses',
        children: [
          {
            childrenName: 'Cidades',
            route: '/painel/cidades',
          },
          {
            childrenName: 'Dioceses',
            route: '/painel/dioceses',
          },
        ]
      },
      {
        childName: 'Fontes - Resultados',
        children: [
          {
            childrenName: 'Fontes',
            route: '/painel/fontes',
          },
          {
            childrenName: 'Resultados',
            route: '/painel/resultados',
          },
        ]
      },
      {
        childName: 'Bancos',
        children: [
          {
            childrenName: 'Contas bancárias',
            route: '/painel/contas-bancarias',
          },
          {
            childrenName: 'Cartões de crédito',
            route: '/painel/cartoes-de-credito',
          },
          {
            childrenName: 'Convênios',
            route: '/painel/convenios-bancarios',
          },
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
