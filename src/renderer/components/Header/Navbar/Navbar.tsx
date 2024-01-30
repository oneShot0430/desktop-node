import React from 'react';
import { NavLink } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

// import { OrcaActionsDropdown } from 'renderer/features/orca/OrcaActionsDropdown';
import { NotificationsIndicator } from 'renderer/features/notifications';
import { AppRoute } from 'renderer/types/routes';

const navItems = [
  { name: 'My Node', to: AppRoute.MyNode },
  { name: 'Add Tasks', to: AppRoute.AddTask },
  // { name: 'Rewards', to: '/rewards' },
  // { name: 'History', to: '/history' },
  { name: 'Settings', to: AppRoute.SettingsGeneral },
];

function Navbar(): JSX.Element {
  return (
    <nav className="flex items-center justify-between">
      {navItems.map((item) => (
        <NavLink
          className={({ isActive }) =>
            twMerge(
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
      <NotificationsIndicator>
        <NavLink
          className={({ isActive }) =>
            twMerge(
              'tracking-finnieSpacing ml-7 text-right',
              isActive && 'text-finnieTeal font-semibold underline'
            )
          }
          key="/notifications"
          to="/notifications"
        >
          Notifications
        </NavLink>
      </NotificationsIndicator>

      {/* TODO: ReEnable in RELEASE_0.3.8
      <div className="ml-6">
        <OrcaActionsDropdown />
      </div>
      */}
    </nav>
  );
}

export default Navbar;
