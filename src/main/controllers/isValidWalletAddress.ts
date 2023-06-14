import { PublicKey } from '@_koi/web3.js';

export function isValidWalletAddress(
  event: Event,
  payload: { address: string }
) {
  try {
    const publicKey = new PublicKey(payload.address);
    return PublicKey.isOnCurve(publicKey.toBuffer());
  } catch (error) {
    return false;
  }
}
