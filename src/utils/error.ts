import { DetailedError } from 'models';

// Due to Electron automatically serializing any error thrown from the BE, we stringify our custom error object and parse it later to retrieve it (see `getErrorToDisplay`)
export const throwDetailedError = ({ detailed, type }: DetailedError) => {
  throw new Error(
    JSON.stringify({
      detailed,
      type,
    })
  );
};
