class Logger {
    #log = I('log');

    #dateHolder;

    constructor(dateHolder) {
        this.#dateHolder = dateHolder;
    }


    /**
     * Adds record to client's log
     * @param message
     * @returns {Promise<void>}
     */
    async printToLog(message) {
        if (this.#log !== null) {
            this.#log.value = this.#log.value + this.#dateHolder.getCurrentDateTimeClient() + ' ' + message + '\n';
        }
    }
}