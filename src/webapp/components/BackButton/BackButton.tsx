import * as React from 'react';

import BackIcon from 'svgs/back-icon.svg';
import { Button } from 'webapp/ui/Button';

export const BackButton = () => {
  return <Button icon={<BackIcon className="cursor-pointer " />} />;
};
