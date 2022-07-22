import { AppRoute } from './AppRoutes';

export const getRouteViewLabel = (route: AppRoute) => {
  switch (route) {
    case AppRoute.MyNode:
      return 'My Node';
    case AppRoute.Root:
      return 'My Node';
    case AppRoute.AddTask:
      return 'Add Task';
    case AppRoute.Notifications:
      return 'Notifications';
    case AppRoute.Rewards:
      return 'Rewards';
    case AppRoute.Settings:
      return 'Settings';
    case AppRoute.History:
      return 'History';
    default:
      return '';
  }
};
