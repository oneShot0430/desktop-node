import clsx from 'clsx';
import React from 'react';
import { NavLink } from 'react-router-dom';

import { AppRoute } from 'renderer/types/routes';

const navItems = [
  { name: 'My Node', to: AppRoute.MyNode },
  { name: 'Add Tasks', to: AppRoute.AddTask },
  // { name: 'Rewards', to: '/rewards' },
  // { name: 'History', to: '/history' },
  // { name: 'Notifications', to: '/notifications' },
  { name: 'Settings', to: AppRoute.SettingsGeneral },
];

function Navbar(): JSX.Element {
  return (
    <nav className="flex justify-between">
      {navItems.map((item) => (
        <NavLink
          className={({ isActive }) =>
            clsx(
              'tracking-finnieSpacing ml-7 text-right',
              isActive && 'text-finnieTeal font-semibold underline'
            )
          }
          key={item.to}
          to={item.to}
        >
          {item.name}
        </NavLink>
      ))}
    </nav>
  );
}

export default Navbar;
