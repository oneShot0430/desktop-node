import { AppRoute } from 'renderer/types/routes';

export const getRouteViewLabel = (route: AppRoute) => {
  if (route.includes('settings')) {
    return 'Settings';
  }

  switch (route) {
    case AppRoute.MyNode:
      return 'My Node';
    case AppRoute.Root:
      return 'My Node';
    case AppRoute.AddTask:
      return 'Available Tasks';
    case AppRoute.Notifications:
      return 'Notifications';
    case AppRoute.Rewards:
      return 'Rewards';
    case AppRoute.History:
      return 'History';
    default:
      return '';
  }
};
