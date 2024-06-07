import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Home',
  },
 
  {
    displayName: 'Congressos',
    iconName: 'brand-ted',
    route: 'painel/congressos',
  },

  {
    displayName: 'Usuários',
    iconName: 'user-plus',
    route: '/painel/usuarios',
    // children: [
    //   {
    //     displayName: 'Side Login',
    //     iconName: 'point',
    //     route: '/authentication/side-register',
    //   },
    //   {
    //     displayName: 'Boxed Login',
    //     iconName: 'point',
    //     route: '/authentication/boxed-register',
    //   },
    // ],
  },
 
  
 
];
