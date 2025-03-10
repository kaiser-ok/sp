class SysInfoCollector {
    constructor() {
    }


    /**
     * Returns CPU cores number
     * @returns {number}
     */
    getCPUCores() {
        return navigator.hardwareConcurrency;
    }


    /**
     * Returns CPU threads number
     * @returns {number}
     */
    getCPUThreads() {
        return navigator.hardwareConcurrency;
    }
}