import sdk from 'main/services/sdk';

const getCurrentSlot = async (): Promise<number> => sdk.k2Connection.getSlot();

export default getCurrentSlot;
