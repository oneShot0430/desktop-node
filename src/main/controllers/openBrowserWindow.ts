import { shell } from 'electron';

import { OpenBrowserWindowParam } from '../../models/api';
import mainErrorHandler from '../../utils/mainErrorHandler';

const openBrowserWindow = async (_: Event, { URL }: OpenBrowserWindowParam) => {
  shell.openExternal(URL);
};

export default mainErrorHandler(openBrowserWindow);
