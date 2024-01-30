import { Task } from 'renderer/types';

import {
  AppNotificationType,
  BannerPlacement,
  NotificationType,
} from './types';

export const AppNotificationsMap: Record<
  AppNotificationType,
  Partial<NotificationType> & {
    title: string;
    message: string | ((...args: any[]) => string);
    notificationBanner: {
      componentKey: string;
      placement: BannerPlacement;
    } | null;
  }
> = {
  FIRST_NODE_REWARD: {
    title: 'First Node Reward',
    message:
      "You've earned your first node reward! Run more tasks to easily increase your rewards.",
    variant: 'SUCCESS',
    notificationBanner: {
      componentKey: 'FIRST_NODE_REWARD',
      placement: BannerPlacement.TopBar,
    },
  },
  FIRST_TASK_RUNNING: {
    title: 'First Task Running',
    message:
      'Congrats! You’re running your first tasks! Head over to Add Tasks to start making some more!',
    variant: 'SUCCESS',
    notificationBanner: {
      componentKey: 'FIRST_TASK_RUNNING',
      placement: BannerPlacement.Bottom,
    },
  },
  REFERRAL_PROGRAM: {
    title: 'Referral Program',
    message:
      'Refer a friend and win 5 extra tokens for each person who joins the network.',
    variant: 'INFO',
    notificationBanner: {
      componentKey: 'REFERRAL_PROGRAM',
      placement: BannerPlacement.TopBar,
    },
  },
  TOP_UP_STAKING_KEY: {
    title: 'Low Staking Key Balance',
    message:
      "Your staking key's funds are getting low. Top up now to make sure your node is safe.",
    variant: 'WARNING',
    notificationBanner: {
      componentKey: 'TOP_UP_STAKING_KEY',
      placement: BannerPlacement.TopBar,
    },
  },
  TOP_UP_STAKING_KEY_CRITICAL: {
    title: 'Low Staking Key Balance',
    message:
      'Your staking key is below 1 KOII. Fund now to keep your node in the network.',
    variant: 'ERROR',
    notificationBanner: {
      componentKey: 'TOP_UP_STAKING_KEY_CRITICAL',
      placement: BannerPlacement.TopBar,
    },
  },
  RUN_EXEMPTION_FLOW: {
    title: 'Rent Exemption Flow',
    message: 'We sent a little bonus to your staking key.',
    variant: 'INFO',
    notificationBanner: {
      componentKey: 'RUN_EXEMPTION_FLOW',
      placement: BannerPlacement.TopBar,
    },
  },
  TASK_UPGRADE: {
    title: 'Task Upgrade Available',
    message: (metadata: Record<string, unknown>) =>
      `Upgrade ${(metadata.task as Task).taskName} now to keep earning!`,
    variant: 'WARNING',
    notificationBanner: {
      componentKey: 'TASK_UPGRADE',
      placement: BannerPlacement.TopBar,
    },
  },
  UPDATE_AVAILABLE: {
    title: 'Update Available',
    message: 'A new version of the app is available. Please update now.',
    variant: 'INFO',
    notificationBanner: {
      componentKey: 'UPDATE_AVAILABLE',
      placement: BannerPlacement.TopBar,
    },
  },
  NEW_TASK_AVAILABLE: {
    title: 'New Task Available',
    message: (taskName: string) =>
      `A New task is now available! Check out ${taskName} in "Add Tasks" to run it!`,
    variant: 'INFO',
    notificationBanner: null,
  },
  TASK_BLACKLISTED_OR_REMOVED: {
    title: 'Task Delisted',
    message: (taskName: string) =>
      `${taskName} was delisted but don't worry your rewards and stake are safe and ready to withdraw!`,
    variant: 'ERROR',
    notificationBanner: {
      componentKey: 'TASK_BLACKLISTED_OR_REMOVED',
      placement: BannerPlacement.Bottom,
    },
  },
  TASK_OUT_OF_BOUNTY: {
    title: 'Task Out of Bounty',
    message: '',
    variant: 'ERROR',
    notificationBanner: null,
  },
  BACKUP_SEED_PHRASE: {
    title: 'Backup Seed Phrase',
    message: '',
    variant: 'WARNING',
    notificationBanner: {
      componentKey: 'BACKUP_SEED_PHRASE',
      placement: BannerPlacement.Bottom,
    },
  },
  COMPUTER_MAX_CAPACITY: {
    title: 'Computer Max Capacity',
    message: '',
    variant: 'WARNING',
    notificationBanner: {
      componentKey: 'COMPUTER_MAX_CAPACITY',
      placement: BannerPlacement.Bottom,
    },
  },
  CLAIMED_REWARD: {
    title: 'Claimed Reward',
    message: '',
    variant: 'SUCCESS',
    notificationBanner: null,
  },
  FIRST_REWARD_ON_NEW_TASK: {
    title: 'First Reward on New Task',
    message: '',
    variant: 'SUCCESS',
    notificationBanner: null,
  },
  ARCHIVING_SUCCESSFUL: {
    title: 'Archiving Successful',
    message: '',
    variant: 'SUCCESS',
    notificationBanner: null,
  },
  SESSION_STARTED_FROM_SCHEDULER: {
    title: 'Session Started From Scheduler',
    message: '',
    variant: 'SUCCESS',
    notificationBanner: null,
  },
  TASK_STARTED: {
    title: 'Task Started',
    message: '',
    variant: 'SUCCESS',
    notificationBanner: null,
  },
};
