class SpeedtestWorker {
    static DOWNLOAD_TEST_PATH = '/download';
    static UPLOAD_TEST_PATH = '/upload';
    static UPLOAD_COUNTER_PATH = '/upload_counter';
    static SET_SPEED_SHAPER_PATH = '/set_speed_shaper';

    static MEGABIT = 1000000.0;

    static TYPE_SIMPLE = 'simple';
    static TYPE_GROUP = 'group';

    static MODE_DOWNLOAD = 'download';
    static MODE_UPLOAD = 'upload';

    static STATUS_RUNNING = true;
    static STATUS_STOPPED = false;

    #ticker;
    #reporter;
    #dateHolder;
    #ipChecker;
    #clientLogger;

    #testData;
    #threadHolder = new Map();
    #downloadResultHolder = new Map();
    #uploadResultHolder = new Map();

    #type;

    #currentMode;

    #startedAllFlag = false;
    #downloadStartTime = null;
    #isDownloadGlobalFinished;
    #isUploadGlobalFinished;
    #isActiveTest = false;

    #job;

    #speedtestResult;
    #latencyWorker;

    #allDownload;
    #allUpload;

    #uploadBytes;
    #uploadTime;

    #downloadAll = [];
    #downloadSpeedAvg;

    #uploadAll = [];
    #uploadSpeedAvg;

    constructor(type, ticker, reporter, dateHolder, ipChecker, latencyWorker, clientLogger) {
        this.#type = type;
        this.#ticker = ticker;
        this.#testData = this.#initTestData();
        this.#speedtestResult = null;
        this.#reporter = reporter;
        this.#dateHolder = dateHolder;
        this.#ipChecker = ipChecker;
        this.#latencyWorker = latencyWorker;
        this.#clientLogger = clientLogger;
    }


    /**
     * Starts threads for download or upload test
     * @param {String} mode contains test type download or upload
     * @param {String} accessToken contains access token (uuid v4) for a test
     */
    async #startThreads(mode, accessToken) {
        switch (mode) {
            case SpeedtestWorker.MODE_DOWNLOAD:
                this.#clientLogger.addToLog(
                    ClientLogger.LEVEL_INFO,
                    'starting download threads',
                );
                this.#threadHolder.forEach((_, key) => {
                    this.#download(accessToken, key, uuidv4());
                });
                break;

            case SpeedtestWorker.MODE_UPLOAD:
                this.#clientLogger.addToLog(
                    ClientLogger.LEVEL_INFO,
                    'starting upload threads',
                );
                this.#threadHolder.forEach((_, key) => {
                    this.#upload(accessToken, key);
                });
                break;

            default:
                break;
        }
    }


    /**
     * Sets speed limits
     * @param {*} accessToken contains access token (uuid v4) for a test
     * @returns promise
     */
    async #setShaper(accessToken) {
        return new Promise((resolve, _) => {
            this.#clientLogger.addToLog(
                ClientLogger.LEVEL_INFO,
                'setting shaper',
            );
            let xmlHttp = new XMLHttpRequest();
            xmlHttp.open('POST',
                this.#job.serverInfo.getServerAddress() + SpeedtestWorker.SET_SPEED_SHAPER_PATH + '?session=' + accessToken,
                true);

            xmlHttp.upload.onloadend = () => {
                resolve();
            };

            xmlHttp.send(JSON.stringify(this.#job.shaper));
        });
    }


    /**
     * Adds new thread to the holder
     * @param {String} accessToken contains access token (uuid v4) for a test
     * @param {String} mode contains test type download or upload
     * @param {String} parent contains thread parent name
     */
    async #addThread(accessToken, mode, parent) {
        let threadName = 'thread_' + this.#threadHolder.get(parent).index + '_' +
            (this.#threadHolder.get(parent).childCount + 1);

        this.#threadHolder.set(threadName, {
            index: this.#threadHolder.size + 1,
            started: SpeedtestWorker.STATUS_STOPPED,
            parentIndex: parent,
            childCount: 0,
        });
        this.#setThreadChildNumber(parent, this.#threadHolder.get(parent).childCount + 1);

        switch (mode) {
            case SpeedtestWorker.MODE_DOWNLOAD:
                this.#download(accessToken, threadName, true, uuidv4());
                break;

            case SpeedtestWorker.MODE_UPLOAD:
                this.#upload(accessToken, threadName, true, uuidv4());
                break;

            default:
                break;
        }
    }


    /**
     * Makes download test
     * @param {String} accessToken contains access token (uuid v4) for a test
     * @param {String} threadName contains a thread name
     * @param {String} threadId contains thread id (uuid v4) for a test
     */
    async #download(accessToken, threadName, threadId) {
        let response = await fetch(this.#job.serverInfo.getServerAddress() +
            SpeedtestWorker.DOWNLOAD_TEST_PATH
            + '?session=' + accessToken +
            '&test=' + uuidv4() +
            '&test_id=' + this.#job.testId
        );

        let reader = response.body.getReader();

        let receivedLength = 0;

        while (true) {
            let {done, value} = await reader.read();

            if (done) {
                break;
            }

            receivedLength += value.length;

            value = null;

            this.#checkStartedAll();
            this.#downloadResultHolder.set(threadId, receivedLength);
            this.#computeAverageSpeed(SpeedtestWorker.MODE_DOWNLOAD);

            if (this.#downloadStartTime == null) {
                this.#downloadStartTime = new Date();
            } else {
                this.#downloadResultHolder.set(threadId, receivedLength);
                this.#computeAverageSpeed(SpeedtestWorker.MODE_DOWNLOAD);
            }
        }

        this.#setThreadStatus(threadName, SpeedtestWorker.STATUS_STOPPED);

        response = null;
        reader = null;
        this.#checkStartedAll();

        if (!this.#startedAllFlag && !this.#isDownloadGlobalFinished) {
            this.#isDownloadGlobalFinished = true;

            this.#onAllDownloadThreadsFinished(accessToken);
        }
    }


    /**
     * Inits upload threads after the download test finished
     * @param {String} accessToken contains access token (uuid v4) for a test
     */
    async #onAllDownloadThreadsFinished(accessToken) {
        if (!this.#startedAllFlag) {
            this.#clientLogger.addToLog(
                ClientLogger.LEVEL_INFO,
                'download threads finished',
            );
            await this.#initThreads(this.#job.threadCount);
            this.#ticker.stop();
            this.#isDownloadGlobalFinished = true;
            this.#uploadCounterSocket(accessToken, 0);
            this.#ticker.start();

            if (this.#downloadStartTime == null) {
                this.#downloadStartTime = new Date();
            }

            this.#startThreads(SpeedtestWorker.MODE_UPLOAD, accessToken);
            this.#currentMode = SpeedtestWorker.MODE_UPLOAD;
            this.#computeAverageSpeed(SpeedtestWorker.MODE_DOWNLOAD);
        }
    }


    /**
     * Opens socket getting upload bytes from the server
     * @param {*} accessToken contains access token (uuid v4) for a test
     * @param retryTimeout contains timeout for reconnect
     */
    async #uploadCounterSocket(accessToken, retryTimeout) {
        await this.#dateHolder.sleep(retryTimeout * 1000);

        if (retryTimeout === 0) {
            retryTimeout = 1;
        } else if (retryTimeout > 0 && retryTimeout < 8) {
            retryTimeout = retryTimeout * 2;
        } else if (retryTimeout === 8) {
            this.#isActiveTest = false;
            this.#isUploadGlobalFinished = true;
            console.log("Cannot connect to the server. Please try again later.")
            return;
        }

        this.#clientLogger.addToLog(
            ClientLogger.LEVEL_INFO,
            'connecting to upload counter socket',
        );

        let messageCounter = 0;
        let socket = new WebSocket(this.#job.serverInfo.getServerSocketAddress() + SpeedtestWorker.UPLOAD_COUNTER_PATH);

        socket.onopen = () => {
            retryTimeout = 0;
            socket.send(accessToken);
        }

        socket.onmessage = event => {
            if (this.#isUploadGlobalFinished) {
                socket.close();
                return;
            }

            let mess = event.data;
            if (messageCounter === 0) {
                this.#job.speedtestConfig.refreshTimeout = parseInt(mess.split(':')[1]);
            } else {
                this.#uploadBytes = parseInt(mess.split(':')[1]);
                this.#uploadTime = parseInt(mess.split(':')[0])
                    * this.#job.speedtestConfig.refreshTimeout;
                this.#computeAverageSpeed(SpeedtestWorker.MODE_UPLOAD, null);
            }
            messageCounter++;
        }

        socket.onerror = event => {
            console.log("Socket error", event);
            this.#clientLogger.addToLog(
                ClientLogger.LEVEL_ERROR,
                'upload counter socket error: ' + event,
            );
            if (!this.#isUploadGlobalFinished) {
                this.#uploadCounterSocket(accessToken, retryTimeout);
            }
        }

        socket.onclose = event => {
            console.log("Socket closed", "code=", event.code, "reason=", event.reason);
            this.#clientLogger.addToLog(
                ClientLogger.LEVEL_INFO,
                'upload counter socket close: ' + event.code + ' reason=' + event.reason,
            );
            if (!this.#isUploadGlobalFinished && this.#isDownloadGlobalFinished) {
                this.#uploadCounterSocket(accessToken, retryTimeout);
            }
        }
    }


    /**
     * Makes upload test
     * @param {String} accessToken contains access token (uuid v4) for a test
     * @param {String} threadName contains a thread name
     */
    async #upload(accessToken, threadName) {
        let hasChild = false;
        this.#setThreadStatus(threadName, SpeedtestWorker.STATUS_RUNNING);
        this.#checkStartedAll();

        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open('POST',
            this.#job.serverInfo.getServerAddress() + SpeedtestWorker.UPLOAD_TEST_PATH
            + '?session=' + accessToken +
            '&test=' + uuidv4() +
            '&test_id=' + this.#job.testId,
            true);

        xmlHttp.onreadystatechange = () => {
            if (xmlHttp != null && xmlHttp.readyState === XMLHttpRequest.DONE && xmlHttp.status === HttpCodes.success) {
                this.#setThreadStatus(threadName, SpeedtestWorker.STATUS_STOPPED);
                this.#checkStartedAll();

                if (!this.#startedAllFlag) {
                    this.#onAllUploadThreadsFinished();
                }

                if (!hasChild && this.#ticker.get() < this.#job.speedtestConfig.testTimeLimit * 0.95) {
                    hasChild = true;
                    this.#addThread(accessToken, SpeedtestWorker.MODE_UPLOAD, threadName);
                }

                xmlHttp = null;
            }
        };

        xmlHttp.upload.onloadend = () => {
            this.#setThreadStatus(threadName, SpeedtestWorker.STATUS_STOPPED);
            this.#checkStartedAll();

            if (!this.#startedAllFlag) {
                this.#onAllUploadThreadsFinished();
            }

            if (!hasChild && this.#ticker.get() < this.#job.speedtestConfig.testTimeLimit * 0.95) {
                hasChild = true;
                this.#addThread(accessToken, SpeedtestWorker.MODE_UPLOAD, threadName);
            }

            xmlHttp = null;
        };

        xmlHttp.upload.onerror = () => {
            this.#setThreadStatus(threadName, SpeedtestWorker.STATUS_STOPPED);
            this.#checkStartedAll();

            if (!this.#startedAllFlag) {
                this.#onAllUploadThreadsFinished();
            }

            console.log(this.#ticker.get(), this.#job.speedtestConfig.testTimeLimit * 0.95)

            if (!hasChild && this.#ticker.get() < this.#job.speedtestConfig.testTimeLimit * 0.95) {
                hasChild = true;
                this.#addThread(accessToken, SpeedtestWorker.MODE_UPLOAD, threadName);
            }

            xmlHttp = null;
        };

        xmlHttp.upload.onprogress = (event) => {
            if (event.loaded / event.total >= 0.7
                && !hasChild
                && this.#ticker.get() < this.#job.speedtestConfig.testTimeLimit * 0.95) {
                hasChild = true;
                this.#addThread(accessToken, SpeedtestWorker.MODE_UPLOAD, threadName);
            }
        };

        xmlHttp.upload.ontimeout = () => {
            this.#setThreadStatus(threadName, SpeedtestWorker.STATUS_STOPPED);
            this.#checkStartedAll();

            if (!this.#startedAllFlag) {
                this.#onAllUploadThreadsFinished();
            }

            xmlHttp = null;
        };

        xmlHttp.timeout = (this.#job.speedtestConfig.testTimeLimit - this.#ticker.get()) * 1000;
        xmlHttp.send(this.#testData);
    }


    /**
     * Sends report after upload test finish
     */
    async #onAllUploadThreadsFinished() {
        this.#isActiveTest = false;
        this.#ticker.stop();

        if (!this.#isUploadGlobalFinished) {
            this.#clientLogger.addToLog(
                ClientLogger.LEVEL_INFO,
                'upload threads finished',
            );
            this.#isUploadGlobalFinished = true;


            this.#speedtestResult = new SpeedtestResult(new SpeedtestResultSummary(
                parseFloat(this.getDownloadSpeed()),
                parseFloat(this.getUploadSpeed()),
                parseFloat(format(this.#computeTotalBytes(this.#downloadResultHolder) / 1_000_000)),
                parseFloat(format(this.#uploadBytes / 1_000_000))
            ));

            let testInfo = new TestInfo(
                this.#ipChecker.getPublicIPv4(),
                this.#job.serverInfo.serverIp,
                this.#job.shaper.downloadSpeedLimit,
                this.#job.speedtestConfig.testTimeLimit,
                "",
                "tcp",
                this.#job.threadCount,
                this.#job.sessionId,
                this.#job.testName,
                this.#job.round,
                this.#job.clientID,
                this.#job.clientOrderID,
            )

            let result = new TestResult(this.#speedtestResult, null)

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
                this.#ipChecker.getPublicIPv4(),
                this.#job.testId,
            )


            this.#reporter.sendSpeedtestReport(webResult, 0, this.#job.testId);
        }
    }


    /**
     * Computes average speed for download or upload test
     * @param {String} mode contains test type download or upload
     * @param {XMLHttpRequest} request contains a request that loading data
     */
    async #computeAverageSpeed(mode) {
        let result = 0,
            now = new Date();

        switch (mode) {
            case SpeedtestWorker.MODE_DOWNLOAD:
                if (this.#downloadStartTime == null) {
                    break;
                }

                let downloadBits = parseFloat(this.#computeTotalBytes(this.#downloadResultHolder) * 8),
                    timeSinceStartDownload = parseFloat((now - this.#downloadStartTime) / 1000.0);
                result = ((downloadBits / timeSinceStartDownload) / SpeedtestWorker.MEGABIT);

                if (this.#isDownloadGlobalFinished
                    && timeSinceStartDownload/this.#job.speedtestConfig.testTimeLimit < 0.66) {
                    result = 0;

                    console.log('Download test error. Test time is less than 2/3 of the test time set in the TRX server config');

                    if (this.#type === SpeedtestWorker.TYPE_GROUP) {
                        alert('Download test error. Test time is less than 2/3 of the test time set in the TRX server config');
                    }
                }

                this.#allDownload.set(parseInt(timeSinceStartDownload) + 1, parseFloat(result.toFixed(1)));
                this.#downloadAll[parseInt(timeSinceStartDownload)] = parseFloat(result.toFixed(2));
                this.#downloadSpeedAvg = format(result);
                break;

            case SpeedtestWorker.MODE_UPLOAD:
                let uploadBits = parseFloat(this.#uploadBytes * 8),
                    timeSinceStartUpload = parseFloat(this.#uploadTime / 1000.0);
                result = ((uploadBits / timeSinceStartUpload) / SpeedtestWorker.MEGABIT);

                this.#allUpload.set(parseInt(timeSinceStartUpload) + 1, parseFloat(result.toFixed(1)));
                this.#uploadAll[parseInt(timeSinceStartUpload)] = parseFloat(result.toFixed(2));
                this.#uploadSpeedAvg = format(result);
                break;

            default:
                break;
        }
    }


    /**
     * Calculates total bytes for all test threads
     * @param {Map} resultsArray contains holder with all threads results
     * @returns all threads' bytes count
     */
    #computeTotalBytes(resultsArray) {
        let sum = 0;
        resultsArray.forEach((value, _) => {
            sum += value;
        })

        return sum;
    }


    /**
     * Adds threads to the holder before a test
     * @param {Number} threadCount contains thread count for test
     * @returns promise to wait for the finishing of this function
     */
    async #initThreads(threadCount) {
        return new Promise(resolve => {
            this.#threadHolder.clear();

            for (let i = 1; i < threadCount + 1; i++) {
                this.#threadHolder.set('thread_' + i, {
                    index: i,
                    started: false,
                    parentIndex: 0,
                    childCount: 0,
                });
            }

            resolve();
        });
    }


    /**
     * Clearing previous results before a test
     * @returns promise to wait for the finishing of this function
     */
    async #refreshResults() {
        return new Promise((resolve, _) => {
            this.#downloadResultHolder.clear();
            this.#uploadResultHolder.clear();
            this.#downloadStartTime = null;
            this.#isDownloadGlobalFinished = false;
            this.#isUploadGlobalFinished = false;
            this.#downloadSpeedAvg = undefined;
            this.#uploadSpeedAvg = undefined;

            resolve();
        });
    }


    /**
     * Checks started/stopped all threads
     */
    #checkStartedAll() {
        let buffer = Array.from(this.#threadHolder.values());
        if (buffer.every(value => value.started)) {
            this.#startedAllFlag = true;
        }

        if (buffer.every(value => !value.started)) {
            this.#startedAllFlag = false;
        }
    }


    /**
     * Sets thread status
     * @param {String} threadName contains a thread name
     * @param {Boolean} status contains thread status RUNNING/STOPPED
     */
    #setThreadStatus(threadName, status) {
        this.#threadHolder.set(threadName, {
            index: this.#threadHolder.get(threadName).index,
            started: status,
            parentIndex: this.#threadHolder.get(threadName).parentIndex,
            childCount: this.#threadHolder.get(threadName).childCount,
        });
    }


    /**
     * Sets thread child count
     * @param {String} threadName contains a thread name
     * @param {Number} childCount contains child count
     */
    #setThreadChildNumber(threadName, childCount) {
        this.#threadHolder.set(threadName, {
            index: this.#threadHolder.get(threadName).index,
            started: this.#threadHolder.get(threadName).started,
            parentIndex: this.#threadHolder.get(threadName).parentIndex,
            childCount: childCount,
        });
    }


    /**
     * Inits 10 MB test data for upload test
     * @returns promise to wait for the finishing of this function
     */
    #initTestData() {
        return new Blob([new Uint8Array(new ArrayBuffer(10000000))]);
    }


    /**
     * Checks test status
     * @returns {boolean}
     */
    checkActiveTest() {
        return this.#isActiveTest;
    }


    /**
     * Makes speed test to needed server
     * @param {Job} job contains information about the job and speedtest server
     */
    async makeSpeedtest(job) {
        try {
            if (!this.#isActiveTest) {
                this.#isActiveTest = true;
                this.#job = job;
                this.#allDownload = new Map();
                this.#allUpload = new Map();

                await this.#initThreads(this.#job.threadCount);

                await this.#refreshResults();

                let authResult = await trxAuthMaker.trxAuth(this.#job.serverInfo.getServerAddress(), uuidv4());
                if (authResult.isSuccess) {
                    if (this.#job.shaper.downloadSpeedLimit != 0 && this.#job.shaper.uploadSpeedLimit != 0) {
                        await this.#setShaper(authResult.token);
                    }

                    this.#ticker.start();
                    this.#startThreads(SpeedtestWorker.MODE_DOWNLOAD, authResult.token);
                    this.#currentMode = SpeedtestWorker.MODE_DOWNLOAD;
                } else {
                    this.#isActiveTest = false;
                }
            }
        } catch (err) {
            this.#isActiveTest = false;
            console.log('makeSpeedtest: ', err);
        }
    }


    /**
     * Returns download speed value
     * @returns {string|*}
     */
    getDownloadSpeed() {
        return this.#downloadSpeedAvg;
    }


    /**
     * Returns upload speed value
     * @returns {string|*}
     */
    getUploadSpeed() {
        return this.#uploadSpeedAvg;
    }


    /**
     * Returns all download values
     * @returns {[]|*}
     */
    getAllDownload() {
        return this.#downloadAll;
    }


    /**
     * Returns all upload values
     * @returns {[]|*}
     */
    getAllUpload() {
        return this.#uploadAll;
    }


    /**
     * Returns isFinish value
     * @returns isFinish value
     */
    getIsFinish() {
        return this.#isActiveTest;
    }


    /**
     * Returns all download results
     * @returns {*}
     */
    getDownloadPerSeconds() {
        return this.#allDownload;
    }


    /**
     * Returns all upload results
     * @returns {*}
     */
    getUploadPerSeconds() {
        return this.#allUpload;
    }


    getCurrentMode() {
        return this.#currentMode;
    }
}
