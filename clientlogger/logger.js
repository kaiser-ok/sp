class ClientLogger {
    static CLIENT_LOG_PATH = '/simplegroup/client_log'

    static LEVEL_ERROR = 'error';
    static LEVEL_INFO = 'info';

    static LOG_PERIOD_SECONDS = 60;

    #dateHolder;

    #activated;
    #stopped;
    #currentLog;

    constructor(dateHolder) {
        this.#dateHolder = dateHolder;

        this.#activated = false;
        this.#stopped = false;
        this.#currentLog = [];
    }

    async startLogging(sessionID, clientID) {
        if (this.#activated) {
            return;
        }

        this.#activated = true;

        this.#startLogTimer(sessionID, clientID);
    }

    async addToLog(level, text) {
        this.#currentLog.push(new ClientLog(this.#dateHolder.getCurrentDateTimeServer(), level, text));
    }

    async stopLogging() {
        this.#stopped = true;
    }

    async #startLogTimer(sessionID, clientID) {
        while (!this.#stopped) {
            console.log("start await", this.#dateHolder.getCurrentDateTimeClient())
            await this.#dateHolder.sleepSeconds(ClientLogger.LOG_PERIOD_SECONDS);
            console.log("end await", this.#dateHolder.getCurrentDateTimeClient())

            try {
                let result = await this.#sendCurrentLog(sessionID, clientID);
                this.#currentLog = [];
            } catch (e) {
                this.addToLog(ClientLogger.LEVEL_ERROR, 'cant send current client log:' + e)
            }
        }
    }

    async #sendCurrentLog(sessionID, clientID) {
        return new Promise((resolve, reject) => {
            let xmlHttp = new XMLHttpRequest();
            xmlHttp.open('POST',
                getLocationAddress() + ClientLogger.CLIENT_LOG_PATH +
                '?session_id=' + sessionID +
                '&client_id=' + clientID, true);

            xmlHttp.onreadystatechange = () => {
                if (xmlHttp.status === HttpCodes.success) {
                    resolve();
                } else {
                    reject(xmlHttp.responseText);
                }
            }

            xmlHttp.onerror = () => {
                reject(xmlHttp.responseText)
            }

            xmlHttp.send(JSON.stringify(this.#currentLog));
        })
    }
}

class ClientLog {
    time;
    level;
    text;

    constructor(time, level, text) {
        this.time = time;
        this.level = level;
        this.text = text;
    }
}