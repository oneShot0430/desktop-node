// import * as Orca from '@chaindeck/orca';

// import { checkOrcaPodmanExistsAndRunning } from '../../controllers/orca/checkOrcaPodmanExistsAndRunning';
// import { startOrcaVM } from '../../controllers/orca/startOrcaVm';
import errorHandler from '../../errorHandler';

// let isOrcaInitialized = false;

const initOrca = async (): Promise<void> => {
  /*
  TODO: ENABLE IN RELEASE_0.3.8
  const { isPodmanExists, isOrcaVMRunning } =
    await checkOrcaPodmanExistsAndRunning();
  if (!isPodmanExists) {
    throw new Error("Podman doesn't exist");
  }
  if (!isOrcaVMRunning) {
    await startOrcaVM();
    await waitUntilOrcaIsRunning();
    console.log('Orca VM is running now');
  }
  if (!isOrcaInitialized) {
    console.log('Calling Orca bootstrap');

    // Create an instance of ORCA
    const orcaInstance = await Orca.bootstrap();

    // Call the initialize function to start the ORCA
    // Install prerequisite
    // orcaInstance.installPrerequisites();

    orcaInstance.setErrorHandler((msg: string) => console.error('ORCA: ', msg));
    orcaInstance.setWarnHandler((msg: string) => console.warn('ORCA: ', msg));
    orcaInstance.setLogHandler((msg: string) => console.log('ORCA: ', msg));

    // Close the Orca
    // orcaInstance.close()
    isOrcaInitialized = true;
  }
  */
};
/*
const waitUntilOrcaIsRunning = async () => {
  TODO: ENABLE IN RELEASE_0.3.8
  let isOrcaRunning = false;
  let retry = 0;
  while (!isOrcaRunning) {
    if (retry > 150) break;
    // 150 retries means 5 minutes
    await sleep(2000);
    const { isOrcaVMRunning } = await checkOrcaPodmanExistsAndRunning();
    isOrcaRunning = isOrcaVMRunning;
    retry += 1;
  }

};
const sleep = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
  */
export default errorHandler(initOrca, 'Init Orca app error');
