// import { LAMPORTS_PER_SOL as ROE_PER_KOII } from '@_koi/web3.js';

const ROE_PER_KOII = 1000000000;

export const getKoiiFromRoe = (roe: number) => roe / ROE_PER_KOII;

export const getRoeFromKoii = (koii: number) => koii * ROE_PER_KOII;
