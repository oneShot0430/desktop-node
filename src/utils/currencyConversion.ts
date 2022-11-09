import { LAMPORTS_PER_SOL as ROE_PER_KOII } from '@_koi/web3.js';

export const getKoiiFromRoe = (roe: number) => roe / ROE_PER_KOII;

export const getRoeFromKoii = (koii: number) => koii * ROE_PER_KOII;
