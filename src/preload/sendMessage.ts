import { ipcRenderer } from 'electron';

const sendMessage = (api: string, payload: any) => ipcRenderer.invoke(api, payload);

export default sendMessage;
