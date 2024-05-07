import { environment } from '../../../environments/environment';

export class Logger {
    readonly debug: (msg: string) => void;
    readonly error: (msg: string) => void;
    readonly warn: (msg: string) => void;

    constructor(readonly logPrefix?: string) {
        this.debug = environment.debugLogging
            ? (msg: string): void => {
                  console.debug(Logger.prefixLog(logPrefix, msg));
              }
            : (): void => {};

        this.error = (msg: string): void => {
            console.error(Logger.prefixLog(this.logPrefix, msg));
        };

        this.warn = environment.debugLogging
            ? (msg: string): void => {
                  console.warn(Logger.prefixLog(logPrefix, msg));
              }
            : (): void => {};
    }

    private static prefixLog(prefix: string | undefined, msg: string): string {
        return prefix ? `${prefix} -- ${msg}` : msg;
    }
}
