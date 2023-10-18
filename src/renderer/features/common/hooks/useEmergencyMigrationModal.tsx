import { show } from '@ebay/nice-modal-react';

import { EmergencyMigration } from '../modals/EmergencyMigration';

type ParamsType = {
  migrationPhase: 1 | 2;
};

export const useEmergencyMigrationModal = ({ migrationPhase }: ParamsType) => {
  const showModal = () => {
    return show(EmergencyMigration, { migrationPhase });
  };

  return {
    showModal,
  };
};
