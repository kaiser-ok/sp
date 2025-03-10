class LatencyWorker {
    static PING_PATH = '/ping';

    static PING_TIMEOUT_CAPACITY = 3001;
    static PING_RETRY_COUNT = 22;

    #uiWorker;
    #reporter;
    #ipChecker;

    #type;
    #job;
    #isFinish;
    #results;
    #latencyResult;
    #allJitter;

    #webrtcResult;


    constructor(type, uiWorker, reporter, ipChecker) {
        this.#uiWorker = uiWorker;
        this.#reporter = reporter;
        this.#ipChecker = ipChecker;
        this.#type = type;
        this.#latencyResult = null;
    }


    /**
     * Pings server
     */
    async #sendPing() {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open('HEAD',
            this.#job.serverInfo.getServerAddress() + LatencyWorker.PING_PATH +
            '?id=' + uuidv4() +
            '&test_id=' + this.#job.testId, true);
        xmlHttp.timeout = LatencyWorker.PING_TIMEOUT_CAPACITY;

        xmlHttp.onloadend = () => {
            if (xmlHttp.status === HttpCodes.success) {
                let timeDiff = Math.abs(new Date() - startTime);
                this.#results.push(timeDiff);

                if (this.#results.length < LatencyWorker.PING_RETRY_COUNT) {
                    if (!this.#isFinish) {
                        this.#sendPing();
                    }
                } else {
                    this.#computeResults();
                }
            } else {
                this.#setIsFinish(true);
                console.log('Can not check line quality to server. STATUS CODE: ', xmlHttp.status);
            }
        };

        xmlHttp.ontimeout = () => {
            this.#results.push(LatencyWorker.PING_TIMEOUT_CAPACITY);

            if (this.#results.length < LatencyWorker.PING_RETRY_COUNT) {
                if (!this.#isFinish) {
                    this.#sendPing();
                }
            } else {
                this.#computeResults();
            }
        }

        xmlHttp.send();

        let startTime = new Date();
    }


    /**
     * Calculates latency results
     */
    async #computeResults() {
        this.#results.splice(0, 2);

        let sum = 0,
            errors = 0,
            arr = "";

        this.#results.forEach(element => {
            sum += element;

            if (element != -1 && element != LatencyWorker.PING_TIMEOUT_CAPACITY) {
                if (arr.length != 0) {
                    arr = arr + ", " + element;
                } else {
                    arr = arr + element;
                }
            } else {
                errors += 1;

                if (arr.length != 0) {
                    arr = arr + ", lost";
                } else {
                    arr = arr + "lost";
                }
            }
        });

        let averageTime = sum / (this.#results.length - errors);

        this.#latencyResult = new LatencyResultDetail(
            parseFloat(format(averageTime)),
            this.#results,
            parseFloat(this.#computeJitter()),
            this.#allJitter,
            (errors / LatencyWorker.PING_RETRY_COUNT) * 100,
        );

        let testInfo = new TestInfo(
            this.#ipChecker.getPublicIPv4() === null ? this.#ipChecker.getPublicIPv6() : this.#ipChecker.getPublicIPv4(),
            this.#job.serverInfo.serverIp,
            0,
            0,
            "Head",
            "",
            0,
            this.#job.sessionId,
            this.#job.testName,
            this.#job.round,
            this.#job.clientID,
            this.#job.clientOrderID,
        )

        let result = new TestResult(null, new LatencyResult(this.#latencyResult, this.#webrtcResult))

        let detailResult = new TestDetailResult(
            testInfo,
            result,
            new SystemInfo([new CPUInfo(sysInfoCollector.getCPUCores(), sysInfoCollector.getCPUThreads())]),
            '',
        )

        let webResult = new WEBResultDetail(
            this.#job.testId,
            JobStatuses.testResult,
            detailResult,
            this.#job.serverInfo.serverId,
            this.#job.sessionId,
            this.#ipChecker.getPublicIPv4() === null ? this.#ipChecker.getPublicIPv6() : this.#ipChecker.getPublicIPv4(),
            this.#job.testId,
        )

        this.#reporter.sendLatencyReport(webResult, 0, this.#job.testId);
        this.#setIsFinish(true);
    }


    /**
     * Makes latency test to needed server
     * @param {Job} job contains current job
     * @param webrtcResult
     */
    async makeLineQualityTest(job, webrtcResult) {
        this.#job = job;
        this.#webrtcResult = webrtcResult;
        this.#latencyResult = new LatencyResultCurrent(this.#job.testId);
        this.#results = [];
        this.#setIsFinish(false);
        this.#sendPing();
    }


    /**
     * Calculates jitter
     * @returns jitter
     */
    #computeJitter() {
        let summDiff = 0;
        this.#allJitter = [];

        this.#results.forEach((value, key) => {
            if (key != 0) {
                summDiff += Math.abs(value - this.#results[key - 1]);
                this.#allJitter.push(Math.abs(value - this.#results[key - 1]));
            } else {
                this.#allJitter.push(0);
            }
        });

        return format(summDiff / (this.#results.length - 1));
    }


    /**
     * Sets isFinish value
     * @param {Boolean} value contains isFinish value
     */
    #setIsFinish(value) {
        this.#isFinish = value;
    }


    /**
     * Returns isFinish value
     * @returns isFinish value
     */
    getIsFinish() {
        return this.#isFinish;
    }


    /**
     * Returns ping result
     * @returns {*}
     */
    getPing() {
        return this.#latencyResult.delayAvgMs;
    }


    /**
     * Returns all ping value
     * @returns {*}
     */
    getAllPing() {
        return this.#latencyResult.delayDetailMs;
    }


    /**
     * Returns jitter result
     * @returns {*}
     */
    getJitter() {
        return this.#latencyResult.jitterAvgMs;
    }


    /**
     * Returns all jitter value
     * @returns {*}
     */
    getAllJitter() {
        return this.#allJitter;
    }
}