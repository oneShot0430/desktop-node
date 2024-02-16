import {
  faBell,
  faHome,
  faGear,
  faAdd,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { useQueryClient } from 'react-query';
import { NavLink } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';

// import { OrcaActionsDropdown } from 'renderer/features/orca/OrcaActionsDropdown';
import { NotificationsIndicator } from 'renderer/features/notifications';
import { AppRoute } from 'renderer/types/routes';

const navItems = [
  {
    icon: <FontAwesomeIcon icon={faHome} size="lg" />,
    to: AppRoute.MyNode,
    label: 'My Node',
  },
  {
    icon: <FontAwesomeIcon icon={faAdd} size="lg" />,
    to: AppRoute.AddTask,
    label: 'Add Task',
  },
  // { icon: 'Rewards', to: '/rewards' },
  // { icon: 'History', to: '/history' },
  // { icon: 'Notifications', to: '/notifications' },
  {
    icon: <FontAwesomeIcon icon={faGear} size="lg" />,
    to: AppRoute.SettingsGeneral,
    label: 'Settings',
  },
  {
    icon: (
      <NotificationsIndicator>
        <FontAwesomeIcon icon={faBell} size="lg" />
      </NotificationsIndicator>
    ),
    to: '/notifications',
    label: 'Notifications',
  },
];

function Navbar(): JSX.Element {
  const queryClient = useQueryClient();
  const allQueriesData = queryClient
    .getQueryCache()
    .findAll()
    .map((query) => {
      return {
        key: Array.isArray(query.queryKey)
          ? query.queryKey.join()
          : query.queryKey,
        state: query.state.data,
      };
    });
  console.log('####  QUERY CACHE ####', allQueriesData);

  return (
    <nav className="flex items-center justify-between">
      {navItems.map((item) => (
        <NavLink
          className={({ isActive }) =>
            twMerge(
              'tracking-wide ml-7 text-right transition duration-200 ease-in-out',
              isActive ? 'text-finnieTeal font-semibold' : 'text-white',
              'hover:scale-110'
            )
          }
          key={item.to}
          to={item.to}
        >
          {item.icon}
          <span className="ml-2 text-sm">{item.label}</span>
        </NavLink>
      ))}

      {/* TODO: ReEnable in RELEASE_0.3.8
      <div className="ml-6">
        <OrcaActionsDropdown />
      </div>
      */}
    </nav>
  );
}

export default Navbar;
