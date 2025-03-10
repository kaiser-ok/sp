class Ticker {
    #dateHolder;

    #counter;
    #stopFlag;
    #previousTime;


    constructor(dateHolder) {
        this.#dateHolder = dateHolder;
    }


    /**
     * Increases counter every second
     * @returns
     */
    async #tick() {
        if (this.#stopFlag) {
            return;
        }

        let diff = parseInt((new Date() - this.#previousTime) / 1000);
        if (diff >= 1) {
            this.#counter += 1;
            this.#previousTime = new Date();
        }

        await this.#dateHolder.sleep(50);

        this.#tick();
    }


    /**
     * Refreshes counter value
     */
    #refresh() {
        this.#counter = 0;
        this.#stopFlag = false;
        this.#previousTime = null;
    }


    /**
     * Returns counter value
     * @returns counter value
     */
    get() {
        return this.#counter;
    }


    /**
     * Starts ticker
     */
    async start() {
        this.#refresh();
        this.#previousTime = new Date();
        this.#tick();
    }


    /**
     * Stops ticker
     */
    async stop() {
        this.#stopFlag = true;
    }
}