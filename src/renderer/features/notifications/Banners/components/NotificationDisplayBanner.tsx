import { CloseLine, Icon } from '@_koii/koii-styleguide';
import { motion } from 'framer-motion';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import { NotificationType, NotificationVariantType } from '../../types';
import { useNotificationActions } from '../../useNotificationStore';

const variants = {
  initial: { scale: 0.6, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { duration: 0.2 } },
  exit: { scale: 0.6, opacity: 0, transition: { duration: 0.2 } },
};

type PropsType = {
  notification: NotificationType;
  backButtonSlot?: React.ReactNode;
  variant?: NotificationVariantType;
  onClose?: () => void;
  messageSlot?: React.ReactNode;
  actionButtonSlot?: React.ReactNode;
};
export function NotificationDisplayBanner({
  notification,
  backButtonSlot,
  variant,
  onClose,
  messageSlot,
  actionButtonSlot,
}: PropsType) {
  const { markAsRead } = useNotificationActions();
  const handleClose = () => {
    onClose?.();
    markAsRead(notification.id);
  };

  const classNames = twMerge(
    'flex fixed justify-between w-full px-4 mx-auto items-center gap-4',
    'bg-green-2 text-finnieBlue',
    notification.variant === 'ERROR' && 'bg-finnieRed',
    notification.variant === 'WARNING' && 'bg-finnieOrange',
    notification.variant === 'SUCCESS' && 'bg-finnieEmerald-light',
    notification.variant === 'INFO' && 'bg-finnieTeal',
    notification.variant === 'OFFER' && 'bg-finnieTeal'
  );

  return (
    <motion.div
      className={classNames}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={variants}
    >
      {backButtonSlot}
      {messageSlot}

      <div className="flex gap-4">
        {actionButtonSlot}
        <button className="cursor-pointer" title="close" onClick={handleClose}>
          <Icon source={CloseLine} className="h-5.5 w-5.5" />
        </button>
      </div>
    </motion.div>
  );
}
