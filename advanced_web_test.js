class AdvancedWEBTestService {
    static SERVICE_WS_PATH = "/advanced_web_test_ws";

    #isRunning = false;
    #sourceServerID;
    #targetServerID;
    #sourceServer;
    #targetServer;
    #targetURL;
    #speedLimit;
    #testType;
    #testID;
    #ipStack;

    #resultsUIWorker;
    #uiWorker;
    #chartWorker;
    #serversHolder;
    #reporter;
    #dateHolder;

    #latencyResult;
    #speedtestResult;
    #sessionID;

    #ws = null;

    constructor(resultsUIWorker, uiWorker, chartWorker, serversHolder, reporter, dateHolder) {
        this.#resultsUIWorker = resultsUIWorker;
        this.#uiWorker = uiWorker;
        this.#chartWorker = chartWorker;
        this.#serversHolder = serversHolder;
        this.#reporter = reporter;
        this.#dateHolder = dateHolder;
    }


    /**
     * Processes HTTP latency result
     * @param result http latency result
     * @returns {Promise<void>}
     */
    async #onReceiveLatencyResultHTTP(result) {
        if (result.latency === undefined && result.error !== undefined) {
            return;
        }

        if (result.latency.httpPing === undefined) {
            return;
        }

        if (this.#ipStack === IPStacks.ipV4) {
            this.#resultsUIWorker.setPingIPv4value(result.latency.httpPing.toFixed(1));
            this.#resultsUIWorker.setJitterIPv4value(result.latency.jitter.toFixed(1));
        }

        if (this.#ipStack === IPStacks.ipV6) {
            this.#resultsUIWorker.setPingIPv6value(result.latency.httpPing.toFixed(1));
            this.#resultsUIWorker.setJitterIPv6value(result.latency.jitter.toFixed(1));
        }

        this.#chartWorker.drawPingChart(result.latency.allHTTPPing, this.#ipStack);
        this.#chartWorker.drawJitterChart(result.latency.allJitter, this.#ipStack);
        this.#uiWorker.setPingResults(this.#ipStack, result.latency.allHTTPPing, false);
        this.#uiWorker.setJitterResults(this.#ipStack, result.latency.allJitter, false);


        if (result.latency.traceroute !== null) {
            this.#uiWorker.setTraceRouteResult(result.latency.traceroute);
        }

        let targetURL = "";
        switch (this.#testType) {
            case advancedWEBTestTypes.SERVER_SERVER:
                targetURL = this.#targetServer.host;
                break;

            case advancedWEBTestTypes.SERVER_URL:
                targetURL = this.#targetURL;
                break;
        }

        const testInfo = new TestInfo(
            this.#sourceServer.host,
            targetURL,
            0,
            0,
            "Head",
            "",
            0,
            null,
            null,
            null,
            null,
            null,
        );

        const testResult = new TestResult(
            null,
            new LatencyResult(
                new LatencyResultDetail(
                    result.latency.httpPing,
                    result.latency.allHTTPPing,
                    result.latency.jitter,
                    result.latency.allJitter,
                    null,
                ),
                null,
            ),
        );

        const detailResult = new TestDetailResult(
            testInfo,
            testResult,
            null,
            '',
        );

        let targetServerID = null;
        if (this.#targetServer !== undefined && this.#targetServer !== null) {
            targetServerID = this.#targetServer.id;
        }

        const latencyReport = new WEBResultDetail(
            uuidv4(),
            JobStatuses.testResult,
            detailResult,
            targetServerID,
            null,
            this.#sourceServer.host,
            this.#testID,
        );

        this.#reporter.sendLatencyReport(
            latencyReport,
            0,
            this.#testID,
        );
    }


    /**
     * Processes ICMP latency result
     * @param result icmp latency result
     * @returns {Promise<void>}
     */
    async #onReceiveLatencyResultICMP(result) {
        if (result.latency === undefined && result.error !== undefined) {
            return;
        }

        this.#latencyResult = result.latency;

        if (result.latency.icmpPing.packetLost === 100) {
            return;
        }

        if (this.#testType === advancedWEBTestTypes.SERVER_URL) {
            this.#chartWorker.drawICMPChart(result.latency.icmpPing.allPing, this.#ipStack);

            this.#uiWorker.setICMPResult(result.latency.icmpPing);

            this.#isRunning = false;
        }

        let targetURL = "";
        switch (this.#testType) {
            case advancedWEBTestTypes.SERVER_SERVER:
                targetURL = this.#targetServer.host;
                break;

            case advancedWEBTestTypes.SERVER_URL:
                targetURL = this.#targetURL;
                break;
        }

        const testInfo = new TestInfo(
            this.#sourceServer.host,
            targetURL,
            0,
            0,
            "ICMP",
            "",
            0,
            null,
            null,
            null,
            null,
            null,
        );

        const testResult = new TestResult(
            null,
            new LatencyResult(
                new LatencyResultDetail(
                    result.latency.icmpPing.averagePing,
                    result.latency.icmpPing.allPing,
                    result.latency.icmpPing.deviation,
                    null,
                    result.latency.icmpPing.packetLost,
                ),
                null,
            ),
        );

        const detailResult = new TestDetailResult(
            testInfo,
            testResult,
            null,
            '',
        );

        let targetServerID = null;
        if (this.#targetServer !== undefined && this.#targetServer !== null) {
            targetServerID = this.#targetServer.id;
        }

        const latencyReport = new WEBResultDetail(
            uuidv4(),
            JobStatuses.testResult,
            detailResult,
            targetServerID,
            null,
            this.#sourceServer.host,
            this.#testID,
        );

        this.#reporter.sendLatencyReport(
            latencyReport,
            0,
            this.#testID,
        );
    }


    async #onReceiveSpeedtestResult(result) {
        if (result.error !== "" && result.error !== undefined && result.error !== null) {
            openWarningPopup(result.error);

            return;
        }

        if (this.#testType === advancedWEBTestTypes.SERVER_URL) {
            return;
        }

        this.#speedtestResult = result.speedtest;

        this.#uiWorker.setDownloadResults(this.#ipStack, this.#speedtestResult.allDownload, false);
        this.#uiWorker.setUploadResults(this.#ipStack, this.#speedtestResult.allUpload, false);

        const categories = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

        this.#chartWorker.drawDownloadChart(categories, this.#speedtestResult.allDownload.slice(0, 20), this.#ipStack);
        this.#chartWorker.drawUploadChart(categories, this.#speedtestResult.allUpload.slice(0, 20), this.#ipStack);

        this.#isRunning = false;

        const testInfo = new TestInfo(
            this.#sourceServer.host,
            this.#targetServer.host,
            0,
            0,
            null,
            "",
            0,
            null,
            null,
            null,
            null,
            null,
        );

        const testResult = new TestResult(
            new SpeedtestResult(new SpeedtestResultSummary(
                result.speedtest.download,
                result.speedtest.upload,
                null,
                null,
            )),
            null,
        );

        const detailResult = new TestDetailResult(
            testInfo,
            testResult,
            null,
            '',
        );

        const speedtestReport = new WEBResultDetail(
            uuidv4(),
            JobStatuses.testResult,
            detailResult,
            this.#targetServer.id,
            null,
            this.#sourceServer.host,
            this.#testID,
        )

        this.#reporter.sendSpeedtestReport(
            speedtestReport,
            0,
            this.#testID,
        )
    }


    /**
     * Processes web socket message from server
     * @param {string} data message
     */
    async #processWSMessage(data) {
        if (!this.#isRunning) {
            this.#ws.close();
            return;
        }

        const mess = AdvancedMessage.fromJSON(data);
        switch (mess.type) {
            case advancedWEBTestMessageTypes.LATENCY_HTTP:
                this.#onReceiveLatencyResultHTTP(mess);
                break;

            case advancedWEBTestMessageTypes.LATENCY_ICMP:
                this.#onReceiveLatencyResultICMP(mess);
                break;

            case advancedWEBTestMessageTypes.DOWNLOAD:
                if (this.#ipStack === IPStacks.ipV4) {
                    this.#resultsUIWorker.setDownloadIPv4value(mess.speedtest.download.toFixed(1));
                    break;
                }

                if (this.#ipStack === IPStacks.ipV6) {
                    this.#resultsUIWorker.setDownloadIPv6value(mess.speedtest.download.toFixed(1));
                    break;
                }

                break;

            case advancedWEBTestMessageTypes.UPLOAD:
                if (this.#ipStack === IPStacks.ipV4) {
                    this.#resultsUIWorker.setUploadIPv4value(mess.speedtest.upload.toFixed(1));
                    break;
                }

                if (this.#ipStack === IPStacks.ipV6) {
                    this.#resultsUIWorker.setUploadIPv6value(mess.speedtest.upload.toFixed(1));
                    break;
                }

                break;

            case advancedWEBTestMessageTypes.JOB_FINISH:
                this.#onReceiveSpeedtestResult(mess);
                this.#ws.close();
                break;
        }
    }


    /**
     * Sends stop signal to source server
     */
    #sendStopSignal() {
        let mess = new AdvancedMessage(
            advancedWEBTestMessageTypes.STOP_TEST,
            null,
            null,
            null,
            "",
        );
        this.#ws.send(JSON.stringify(mess));
    }

    async #makeTest() {
        this.#ws = new WebSocket(
            this.#sourceServer.getServerSocketAddress() + AdvancedWEBTestService.SERVICE_WS_PATH,
        );

        if (!this.#isRunning) {
            return;
        }

        this.#ws.onopen = () => {
            let job = new AdvancedJob(this.#testType, this.#targetServer, '', this.#speedLimit);
            let mess = new AdvancedMessage(
                advancedWEBTestMessageTypes.JOB_REQUEST,
                job,
                null,
                null,
                '',
            );

            this.#ws.send(JSON.stringify(mess));
        }


        this.#ws.onmessage = e => {
            this.#processWSMessage(e.data);
        }

        this.#ws.onclose = () => {
            console.log('advanced test WEB socket closed');
        }
    }

    /**
     * Processes advanced server - server test
     * @returns {Promise<void>}
     */
    async startTestToServer(sourceServerID, targetServerID) {
        if (sourceServerID === targetServerID) {
            openWarningPopup(currentLanguage.message_equal__source__and__target);

            return;
        }

        this.#isRunning = true;

        this.#sourceServerID = sourceServerID;
        this.#targetServerID = targetServerID;

        this.#testType = advancedWEBTestTypes.SERVER_SERVER;
        this.#testID = uuidv4();

        this.#uiWorker.setRunID(this.#testID);

        this.#sessionID = uuidv4();

        this.#speedLimit = I("speed__limit__select").value * 1_000;

        this.#sourceServer = this.#serversHolder.getTRXServerByID(this.#sourceServerID).ip4Server;
        this.#targetServer = this.#serversHolder.getTRXServerByID(this.#targetServerID).ip4Server;

        if (this.#sourceServer !== undefined && this.#targetServer !== undefined) {
            console.log("ip4 test")

            this.#uiWorker.showIPv4Results();

            this.#ipStack = IPStacks.ipV4;

            this.#makeTest();

            while (this.#isRunning) {
                await this.#dateHolder.sleepSeconds(1);
            }
        } else {
            this.#uiWorker.hideIPv4Results();
        }


        this.#targetServer = this.#serversHolder.getTRXServerByID(this.#targetServerID).ip6Server;

        this.#isRunning = true;

        if (this.#sourceServer !== undefined && this.#targetServer !== undefined) {
            console.log("ip6 test")

            this.#uiWorker.showIPv6Results();

            this.#ipStack = IPStacks.ipV6;

            this.#makeTest();

            while (this.#isRunning) {
                await this.#dateHolder.sleepSeconds(1);
            }
        } else {
            this.#uiWorker.hideIPv6Results();
        }
    }


    /**
     * Processes advanced server - url test
     * @returns {Promise<void>}
     */
    async startTestToURL(sourceServerID, targetURL) {
        const waitMainObj=$('#start_test_to_url_wait').parent();
        waitMainObj.css('display','flex');

        this.#isRunning = true;

        this.#sourceServerID = sourceServerID;
        this.#targetURL = targetURL;

        this.#testType = advancedWEBTestTypes.SERVER_URL;
        this.#testID = uuidv4();

        this.#uiWorker.setRunID(this.#testID);

        this.#sourceServer = this.#serversHolder.getTRXServerByID(this.#sourceServerID).ip4Server;

        this.#ws = new WebSocket(
            this.#sourceServer.getServerSocketAddress() + AdvancedWEBTestService.SERVICE_WS_PATH,
        );

        this.#ipStack = IPStacks.ipV4;
        this.#uiWorker.showIPv4Results();

        this.#ws.onopen = () => {
            const job = new AdvancedJob(
                this.#testType,
                null,
                this.#targetURL,
                this.#speedLimit,
            );

            let mess = new AdvancedMessage(
                advancedWEBTestMessageTypes.JOB_REQUEST,
                job,
                null,
                null,
                '',
            );

            this.#ws.send(JSON.stringify(mess));
        }


        this.#ws.onmessage = e => {
            this.#processWSMessage(e.data);
        }

        this.#ws.onclose = () => {
            waitMainObj.hide();
            console.log('advanced test WEB socket closed');
        }

        // Test Animation
        const myThis=this;
        const waitTemp=window.setInterval(function(){
            if (!myThis.#isRunning){
                window.clearInterval(waitTemp);
                return;
            }

            const waitObj=$('#start_test_to_url_wait');
                let waitNumber=parseInt(waitObj.attr('data-value'))+1;
                
                if (waitNumber>5){
                    waitNumber=0;
                }
                const dotString = ".";
                const waitDor = dotString.repeat(waitNumber);
                waitObj.text(waitDor);
                waitObj.attr('data-value', waitNumber);
        },300);

        while (this.#isRunning) {
            await this.#dateHolder.sleepSeconds(1);
        }
        
    }


    /**
     * Returns latency result
     * @returns {AdvancedLatencyResult}
     */
    getLatencyResult() {
        return this.#latencyResult;
    }


    /**
     * Returns speedtest result
     * @returns {AdvancedSpeedtestResult}
     */
    getSpeedResult() {
        return this.#speedtestResult;
    }


    /**
     * Returns test type
     * @returns {advancedWEBTestTypes}
     */
    getTestType() {
        return this.#testType;
    }


    /**
     * Returns source server id
     * @returns {number}
     */
    getSourceServerID() {
        return this.#sourceServerID;
    }


    /**
     * Returns target server ID
     * @returns {number}
     */
    getTargetServerID() {
        return this.#targetServerID;
    }


    /**
     * Stops test
     */
    stopTest() {
        this.#isRunning = false;

        //todo
        // this.#uiWorker.refreshAll();
        // this.#speedometer.onFinish();
        // this.#uiWorker.showSpeedometerArrow();
        // this.#uiWorker.hideLoadingSpeedometer();
        // this.#uiWorker.hideSDBlock();
        // this.#uiWorker.hideChart();
        // this.#uiWorker.hideLoadingSpeedometer();
        // this.#advancedTestUIWorker.hideTracerouteTable();
        // this.#uiWorker.hideProgressBar();

        this.#sendStopSignal();
    }
}