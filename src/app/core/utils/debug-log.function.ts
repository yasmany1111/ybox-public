import { environment } from 'src/environments/environment';

let loggedContentStored = [];

export const debugLog = (...loggedContent: any[]) => {
  (window as any).__debugShowLogs = () => {
    console.table(loggedContent);
  };

  if (environment.production) {
    loggedContentStored.push(loggedContent);

    return;
  }

  console.log.apply(null, loggedContent);
};

export const debugError = (...loggedContent: any[]) => {
  (window as any).__debugShowLogs = () => {
    console.table(loggedContent);
  };

  if (environment.production) {
    loggedContentStored.push(loggedContent);

    return;
  }

  console.error.apply(null, loggedContent);
};
