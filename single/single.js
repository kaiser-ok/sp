class SingleTestWorker {
    static LOCAL_TEST_SUPPORT_PATH = '/local_web_agent_support';

    static CHECK_WEB2WEB_SUPPORT_PATH = '/check_web2web_support';

    static CHECK_HIGHSPEED_SUPPORT_PATH = "/high_speedtest_user";

    #ipChecker;
    #serversHolder;
    #uiWorker;
    #resultsUIWorker;
    #latencyWorker;
    #latencyWorkerWEBRTC;
    #speedTestWorker;
    #dateHolder;
    #trxAuthMaker;
    #configChecker;
    #chartWorker;
    #reporter;
    #highSpeedSupport = false;
    #advancedWEBTestService;


    constructor(
        ipChecker,
        serversHolder,
        uiWorker,
        latencyWorker,
        latencyWorkerWEBRTC,
        dateHolder,
        resultsUIWorker,
        speedTestWorker,
        trxAuthMaker,
        configChecker,
        reporter,
        chartWorker,
        advancedWEBTestService,
    ) {
        this.#ipChecker = ipChecker;
        this.#serversHolder = serversHolder;
        this.#uiWorker = uiWorker;
        this.#latencyWorker = latencyWorker;
        this.#latencyWorkerWEBRTC = latencyWorkerWEBRTC;
        this.#dateHolder = dateHolder;
        this.#resultsUIWorker = resultsUIWorker;
        this.#speedTestWorker = speedTestWorker;
        this.#trxAuthMaker = trxAuthMaker;
        this.#configChecker = configChecker;
        this.#reporter = reporter;
        this.#chartWorker = chartWorker;
        this.#advancedWEBTestService = advancedWEBTestService;

        let result = JSON.parse(cookie.get(Cookie.KEY_SINGLE_TEST_RESULT));

        if (result !== null && cookie.get(Cookie.KEY_MEMO) !== null) {
            this.#uiWorker.showTestResults();
            this.#parseResult(result[0]);

            this.#reporter.sendDetailReport(
                new DetailResults(cookie.get(Cookie.KEY_MEMO), result, 'single', null),
                0,
                1,
            );

            cookie.delete(Cookie.KEY_SINGLE_TEST_RESULT)
            cookie.delete(Cookie.KEY_MEMO)
            openInfoPopup(currentLanguage.mess__upload__success);
        }
    }


    /**
     * Starts latency test
     * @param serverInfo TRX server info
     * @param testID uuid for test
     * @param ipStack IP stack for test
     * @returns {Promise<void>}
     */
    async #startLatencyTest(serverInfo, testID, ipStack) {
        let job = new Job(
            null,
            serverInfo,
            null,
            null,
            null,
            null,
            testID,
            null,
            null,
            null,
            null,
            ipStack,
        );

        this.#latencyWorker.makeLineQualityTest(job, this.#latencyWorkerWEBRTC.getReport());

        while (!this.#latencyWorker.getIsFinish()) {
            await this.#dateHolder.sleepSeconds(1);
        }
    }


    /**
     * Starts WEBRTC latency test
     * @param serverInfo TRX server info
     * @param testID uuid for test
     * @param ipStack IP stack for test
     * @returns {Promise<void>}
     */
    async #startWEBRTCLatencyTest(serverInfo, testID, ipStack) {
        let job = new Job(
            null,
            serverInfo,
            null,
            null,
            null,
            null,
            testID,
            null,
            null,
            null,
            null,
            ipStack,
        );

        this.#latencyWorkerWEBRTC.doTest(job);

        while (!this.#latencyWorkerWEBRTC.getIsFinish()) {
            await this.#dateHolder.sleepSeconds(1);
        }
    }


    /**
     * Starts speed test
     * @param serverInfo TRX server info
     * @param threadCount thread count for test
     * @param speedTestConfig test config
     * @param testID uuid for test
     * @param shaper shaper for test
     * @param ipStack IP stack for test
     * @returns {Promise<void>}
     */
    async #startSpeedTest(serverInfo, threadCount, speedTestConfig, testID, shaper, ipStack) {
        let job = new Job(
            null,
            serverInfo,
            threadCount,
            null,
            null,
            speedTestConfig,
            testID,
            shaper,
            null,
            null,
            null,
            ipStack,
        );

        this.#speedTestWorker.makeSpeedtest(job);

        while (this.#speedTestWorker.getIsFinish()) {
            await this.#dateHolder.sleep(500);
            switch (ipStack) {
                case IPStacks.ipV4:
                    this.#resultsUIWorker.setDownloadIPv4value(this.#speedTestWorker.getDownloadSpeed());
                    this.#resultsUIWorker.setUploadIPv4value(this.#speedTestWorker.getUploadSpeed());
                    break;

                case IPStacks.ipV6:
                    this.#resultsUIWorker.setDownloadIPv6value(this.#speedTestWorker.getDownloadSpeed());
                    this.#resultsUIWorker.setUploadIPv6value(this.#speedTestWorker.getUploadSpeed());
                    break;
            }
        }

        switch (ipStack) {
            case IPStacks.ipV4:
                this.#chartWorker.drawDownloadChart(Array.from(this.#speedTestWorker.getDownloadPerSeconds().keys()),
                    Array.from(this.#speedTestWorker.getDownloadPerSeconds().values()).slice(0, 20), IPStacks.ipV4);
                this.#chartWorker.drawUploadChart(Array.from(this.#speedTestWorker.getUploadPerSeconds().keys()),
                    Array.from(this.#speedTestWorker.getUploadPerSeconds().values()).slice(0, 20), IPStacks.ipV4);
                break;

            case IPStacks.ipV6:
                this.#chartWorker.drawDownloadChart(Array.from(this.#speedTestWorker.getDownloadPerSeconds().keys()),
                    Array.from(this.#speedTestWorker.getDownloadPerSeconds().values()).slice(0, 20), IPStacks.ipV6);
                this.#chartWorker.drawUploadChart(Array.from(this.#speedTestWorker.getUploadPerSeconds().keys()),
                    Array.from(this.#speedTestWorker.getUploadPerSeconds().values()).slice(0, 20), IPStacks.ipV6);
                break;
        }
    }


    /**
     * Returns details result for uploading to DB
     * @param trxServer selected server information
     * @param ipStack IP stack (IPv4 or IPv6)
     * @returns {DetailResult}
     */
    #createDetailResult(trxServer, ipStack) {
        let allP = [];
        for (let i = 1; i <= 20; i++) {
            allP.push(I('p-' + ipStack.toLowerCase() + '-t' + i).textContent);
        }
        let allPing = new AllResults(allP, I('p-' + ipStack.toLowerCase() + '-min').textContent,
            I('p-' + ipStack.toLowerCase() + '-max').textContent,
            I('p-' + ipStack.toLowerCase() + '-var').textContent);

        let allJ = [];
        for (let i = 1; i <= 20; i++) {
            allJ.push(I('j-' + ipStack.toLowerCase() + '-t' + i).textContent);
        }
        let allJitter = new AllResults(allJ, I('j-' + ipStack.toLowerCase() + '-min').textContent,
            I('j-' + ipStack.toLowerCase() + '-max').textContent,
            I('j-' + ipStack.toLowerCase() + '-var').textContent);

        let allW = [];
        for (let i = 1; i <= 20; i++) {
            allW.push(I('w-' + ipStack.toLowerCase() + '-t' + i).textContent);
        }
        let allPingWEBRTC = new AllResults(allW, I('w-' + ipStack.toLowerCase() + '-min').textContent,
            I('w-' + ipStack.toLowerCase() + '-max').textContent,
            I('w-' + ipStack.toLowerCase() + '-var').textContent);

        let allD = [];
        for (let i = 1; i <= 20; i++) {
            allD.push(I('d-' + ipStack.toLowerCase() + '-t' + i).textContent);
        }
        let allDownload = new AllResults(allD, I('d-' + ipStack.toLowerCase() + '-min').textContent,
            I('d-' + ipStack.toLowerCase() + '-max').textContent,
            I('d-' + ipStack.toLowerCase() + '-var').textContent);

        let allU = [];
        for (let i = 1; i <= 20; i++) {
            allU.push(I('u-' + ipStack.toLowerCase() + '-t' + i).textContent);
        }
        let allUpload = new AllResults(allU, I('u-' + ipStack.toLowerCase() + '-min').textContent,
            I('u-' + ipStack.toLowerCase() + '-max').textContent,
            I('u-' + ipStack.toLowerCase() + '-var').textContent);

        let serverAddr = '';
        if (trxServer.ip4Server !== undefined) {
            serverAddr = trxServer.ip4Server.host;
        } else if (ipStack === IPStacks.ipV6) {
            serverAddr = trxServer.ip6Server.host;
        }

        return new DetailResult(
            ipStack,
            this.#dateHolder.getCurrentDateTimeServer(),
            I('public__' + ipStack.toLowerCase()).textContent,
            trxServer.name,
            serverAddr,
            I('ping__value--' + ipStack.toLowerCase()).textContent,
            I('jit__value--' + ipStack.toLowerCase()).textContent,
            I('webrtc__value--' + ipStack.toLowerCase()).textContent,
            I('lost__value--' + ipStack.toLowerCase()).textContent,
            I('down__value--' + ipStack.toLowerCase()).textContent,
            I('upl__value--' + ipStack.toLowerCase()).textContent,
            allPing, allJitter, allPingWEBRTC, allDownload, allUpload);
    }

    /**
     * Starts test
     * @returns {Promise<void>}
     */
    async startTest() {
        this.#uiWorker.setTestStartTime();
        this.#resultsUIWorker.clearResults();
        this.#uiWorker.clearTables();
        this.#chartWorker.clearCharts();
        this.#uiWorker.disableStartButton();
        this.#uiWorker.showPleaseWaitButton();
        this.#uiWorker.hideStartButton();
        this.#uiWorker.hideUploadMemo();
        this.#uiWorker.showTestResults();

        const serverID = this.#uiWorker.getTRXServerID();
        const testID = uuidv4();

        this.#uiWorker.setRunID(testID);

        if (this.#ipChecker.getPublicIPv4() === null || this.#serversHolder.getServerV4ByID(serverID) === null) {
            this.#uiWorker.hideIPv4Results();
        } else {
            this.#uiWorker.showIPv4Results();
        }

        if (this.#ipChecker.getPublicIPv6() === null || this.#serversHolder.getServerV6ByID(serverID) === null) {
            this.#uiWorker.hideIPv6Results();
        } else {
            this.#uiWorker.showIPv6Results();
        }


        if (this.#ipChecker.getPublicIPv4() !== null && this.#serversHolder.getServerV4ByID(serverID) !== null) {
            let serverInfo = this.#serversHolder.getServerV4ByID(serverID);

            if (this.#latencyWorkerWEBRTC.getWEBRTCSupport()) {
                await this.#startWEBRTCLatencyTest(serverInfo, testID, IPStacks.ipV4);

                this.#resultsUIWorker.setPingWEBRTCIPv4value(this.#latencyWorkerWEBRTC.getPing());
                this.#resultsUIWorker.setPacketLostIPv4value(this.#latencyWorkerWEBRTC.getLost());
                this.#chartWorker.drawPingWEBRTCChart(this.#latencyWorkerWEBRTC.getAllPing(), IPStacks.ipV4);
                this.#uiWorker.setPingWEBRTCResults(IPStacks.ipV4, this.#latencyWorkerWEBRTC.getAllPing(), false);
            }

            await this.#startLatencyTest(serverInfo, testID, IPStacks.ipV4);

            if (this.#latencyWorker.getPing() === undefined) {
                this.#uiWorker.hideTestResults()
                openInfoPopup(currentLanguage.mess__server__unreachable);
                this.#uiWorker.enableStartButton();
                this.#uiWorker.showStartButton();
                this.#uiWorker.hidePleaseWaitButton();
                $('button[data-id="testmode"]').prop('disabled', false);
                return
            }

            this.#resultsUIWorker.setPingIPv4value(this.#latencyWorker.getPing());
            this.#resultsUIWorker.setJitterIPv4value(this.#latencyWorker.getJitter());
            this.#uiWorker.setPingResults(IPStacks.ipV4, this.#latencyWorker.getAllPing(), false);
            this.#uiWorker.setJitterResults(IPStacks.ipV4, this.#latencyWorker.getAllJitter(), false);
            this.#chartWorker.drawPingChart(this.#latencyWorker.getAllPing(), IPStacks.ipV4);
            this.#chartWorker.drawJitterChart(this.#latencyWorker.getAllJitter(), IPStacks.ipV4);

            let authResult = await this.#trxAuthMaker.trxAuth(serverInfo.getServerAddress(), uuidv4()),
                conf = null;

            if (authResult.isSuccess) {
                conf = await this.#configChecker.getSpeedTestConfig(
                    serverInfo.getServerAddress(),
                    authResult.token,
                    testID,
                );
            }

            await this.#startSpeedTest(serverInfo, this.#uiWorker.getThreadNumber(), conf, testID, new Shaper(0, 0), IPStacks.ipV4)

            this.#uiWorker.setDownloadResults(
                IPStacks.ipV4,
                Array.from(this.#speedTestWorker.getDownloadPerSeconds().values()).slice(0, 20),
                false
            );
            this.#uiWorker.setUploadResults(
                IPStacks.ipV4,
                Array.from(this.#speedTestWorker.getUploadPerSeconds().values()).slice(0, 20),
                false
            );
        }

        if (this.#ipChecker.getPublicIPv6() !== null && this.#serversHolder.getServerV6ByID(serverID) !== null) {
            let serverInfo = this.#serversHolder.getServerV6ByID(serverID);

            if (this.#latencyWorkerWEBRTC.getWEBRTCSupport()) {
                await this.#startWEBRTCLatencyTest(serverInfo, testID, IPStacks.ipV6);

                this.#resultsUIWorker.setPingWEBRTCIPv6value(this.#latencyWorkerWEBRTC.getPing());
                this.#resultsUIWorker.setPacketLostIPv6value(this.#latencyWorkerWEBRTC.getLost());
                this.#chartWorker.drawPingWEBRTCChart(this.#latencyWorkerWEBRTC.getAllPing(), IPStacks.ipV6);
                this.#uiWorker.setPingWEBRTCResults(IPStacks.ipV6, this.#latencyWorkerWEBRTC.getAllPing(), false);
            }

            await this.#startLatencyTest(serverInfo, testID, IPStacks.ipV6);

            if (this.#latencyWorker.getPing() === undefined) {
                this.#uiWorker.hideTestResults()
                openInfoPopup(currentLanguage.mess__server__unreachable);
                this.#uiWorker.enableStartButton();
                this.#uiWorker.showStartButton();
                this.#uiWorker.hidePleaseWaitButton();
                $('button[data-id="testmode"]').prop('disabled', false);
                return
            }

            this.#resultsUIWorker.setPingIPv6value(this.#latencyWorker.getPing());
            this.#resultsUIWorker.setJitterIPv6value(this.#latencyWorker.getJitter());
            this.#uiWorker.setPingResults(IPStacks.ipV6, this.#latencyWorker.getAllPing(), false);
            this.#uiWorker.setJitterResults(IPStacks.ipV6, this.#latencyWorker.getAllJitter(), false);
            this.#chartWorker.drawPingChart(this.#latencyWorker.getAllPing(), IPStacks.ipV6);
            this.#chartWorker.drawJitterChart(this.#latencyWorker.getAllJitter(), IPStacks.ipV6);

            let authResult = await this.#trxAuthMaker.trxAuth(serverInfo.getServerAddress(), uuidv4()),
                conf = null;

            if (authResult.isSuccess) {
                conf = await this.#configChecker.getSpeedTestConfig(
                    serverInfo.getServerAddress(),
                    authResult.token,
                    testID,
                );
            }

            await this.#startSpeedTest(serverInfo, this.#uiWorker.getThreadNumber(), conf, testID, new Shaper(0, 0), IPStacks.ipV6)

            this.#uiWorker.setDownloadResults(
                IPStacks.ipV6,
                Array.from(this.#speedTestWorker.getDownloadPerSeconds().values()).slice(0, 20),
                false
            );
            this.#uiWorker.setUploadResults(
                IPStacks.ipV6,
                Array.from(this.#speedTestWorker.getUploadPerSeconds().values()).slice(0, 20),
                false
            );
        }

        let trxServer = this.#serversHolder.getTRXServerByID(this.#uiWorker.getTRXServerID());

        let resultV4 = {}
        if (this.#ipChecker.getPublicIPv4() != null && this.#serversHolder.getServerV4ByID(serverID) !== null) {
            resultV4 = this.#createDetailResult(trxServer, IPStacks.ipV4)
        }

        let resultV6 = {}
        if (this.#ipChecker.getPublicIPv6() != null && this.#serversHolder.getServerV6ByID(serverID) !== null) {
            resultV6 = this.#createDetailResult(trxServer, IPStacks.ipV6)
        }

        const result = [{resultV4, resultV6}]

        if (JSON.stringify(result[0].resultV4) === '{}' && JSON.stringify(result[0].resultV6) === '{}') {
            this.#uiWorker.hideTestResults()
            openInfoPopup(currentLanguage.mess__server__unreachable);
        } else {
            this.#uiWorker.showTestResults();
        }

        await this.saveTestResults(result)

        this.#uiWorker.showStartButton();
        this.#uiWorker.hidePleaseWaitButton();
        this.#uiWorker.showUploadMemo();
        this.#uiWorker.enableStartButton();
        $('button[data-id="testmode"]').prop('disabled', false);
    }

    /**
     * server to server test
     * @returns {Promise<void>}
     */
    async startServerServerTest() {
        this.#uiWorker.setTestStartTime();
        this.#resultsUIWorker.clearResults();
        this.#uiWorker.clearTables();
        this.#chartWorker.clearCharts();
        this.#uiWorker.disableStartButton();
        this.#uiWorker.showPleaseWaitButton();
        this.#uiWorker.hideStartButton();
        this.#uiWorker.hideUploadMemo();
        this.#uiWorker.showTestResults();

        const sourceServerID = this.#uiWorker.getSourceServerID();
        const targetServerID = this.#uiWorker.getTargetServerID();

        await this.#advancedWEBTestService.startTestToServer(sourceServerID, targetServerID);

        this.#uiWorker.showStartButton();
        this.#uiWorker.hidePleaseWaitButton();
        this.#uiWorker.showUploadMemo();
        this.#uiWorker.enableStartButton();
        $('button[data-id="testmode"]').prop('disabled', false);
    }

    /**
     * server to url test
     * @returns {Promise<void>}
     */
    async startServerURLTest() {
        this.#uiWorker.setTestStartTime();
        this.#resultsUIWorker.clearResults();
        this.#uiWorker.clearTables();
        this.#chartWorker.clearCharts();
        this.#uiWorker.disableStartButton();
        this.#uiWorker.showPleaseWaitButton();
        this.#uiWorker.hideStartButton();
        this.#uiWorker.hideUploadMemo();
        this.#uiWorker.showTestResults();

        const sourceServerID = this.#uiWorker.getSourceServerID();
        const targetURL = this.#uiWorker.getTargetURL();

        await this.#advancedWEBTestService.startTestToURL(sourceServerID, targetURL);

        this.#uiWorker.showStartButton();
        this.#uiWorker.hidePleaseWaitButton();
        this.#uiWorker.enableStartButton();
        $('button[data-id="testmode"]').prop('disabled', false);
    }

    async saveTestResults(result) {
        cookie.set(Cookie.KEY_SINGLE_TEST_RESULT, JSON.stringify(result), Cookie.TTL_HOUR);
    }

    /**
     * Uploads test with memo to DB
     * @returns {Promise<void>}
     */
    async uploadMemo(memo, owner) {
        let trxServer = this.#serversHolder.getTRXServerByID(this.#uiWorker.getTRXServerID());

        let resultV4 = {}
        if (this.#ipChecker.getPublicIPv4() != null) {
            resultV4 = this.#createDetailResult(trxServer, IPStacks.ipV4)
        }

        let resultV6 = {}
        if (this.#ipChecker.getPublicIPv6() != null) {
            resultV6 = this.#createDetailResult(trxServer, IPStacks.ipV6)
        }

        const result = [{resultV4, resultV6}]

        this.#reporter.sendDetailReport(
            new DetailResults(memo, result, 'single', null),
            0,
            owner,
        );

        openInfoPopup(currentLanguage.mess__upload__success)

        this.#uiWorker.hideUploadMemo();
        cookie.delete(Cookie.KEY_SINGLE_TEST_RESULT);
    }

    /**
     * Parses test result
     * @returns {Promise<void>}
     */
    async #parseResult(result) {
        await this.#dateHolder.sleep(5);

        if (Object.keys(result.resultV4).length !== 0) {
            I('client__clock').innerText = result.resultV4.test_time;
            I('public__ipv4').innerText = result.resultV4.from;
            this.#resultsUIWorker.setDownloadIPv4value(result.resultV4.download);
            this.#resultsUIWorker.setUploadIPv4value(result.resultV4.upload);
            this.#resultsUIWorker.setPingIPv4value(result.resultV4.ping);
            this.#resultsUIWorker.setJitterIPv4value(result.resultV4.jitter);
            this.#parseDetailResult(result.resultV4, IPStacks.ipV4);
        }

        if (Object.keys(result.resultV6).length !== 0) {
            I('client__clock').innerText = result.resultV6.test_time;
            I('public__ipv6').innerText = result.resultV6.from;
            this.#resultsUIWorker.setDownloadIPv6value(result.resultV4.download);
            this.#resultsUIWorker.setUploadIPv6value(result.resultV4.upload);
            this.#resultsUIWorker.setPingIPv6value(result.resultV4.ping);
            this.#resultsUIWorker.setJitterIPv6value(result.resultV4.jitter);
            this.#parseDetailResult(result.resultV6, IPStacks.ipV6);
        } else {
            this.#uiWorker.hideIPv6Results();
        }
    }


    /**
     * Parses detail result
     * @param result detail result
     * @param ipStack IP stack
     */
    #parseDetailResult(result, ipStack) {
        this.#chartWorker.drawPingChart(result.all_ping.all, ipStack);
        this.#uiWorker.setPingResults(ipStack, result.all_ping, true);

        this.#chartWorker.drawJitterChart(result.all_jitter.all, ipStack);
        this.#uiWorker.setJitterResults(ipStack, result.all_jitter, true);

        this.#chartWorker.drawDownloadChart(
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            result.all_download.all.slice(0, 20),
            ipStack
        );
        this.#uiWorker.setDownloadResults(ipStack, result.all_download, true);

        this.#chartWorker.drawUploadChart(
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
            result.all_upload.all.slice(0, 20),
            ipStack
        );
        this.#uiWorker.setUploadResults(ipStack, result.all_upload, true);
    }

    async checkLocalTestSupport() {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open('GET', getLocationAddress() + SingleTestWorker.LOCAL_TEST_SUPPORT_PATH, true);

        xmlHttp.onload = () => {
            if (xmlHttp.status === HttpCodes.success) {
                let response = JSON.parse(xmlHttp.responseText);
                if (response.enable) {
                    this.#uiWorker.showLocalTestButton(response.addr);
                }
            }
        }

        xmlHttp.send();
    }

    async checkWEB2WEBSupport() {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open('GET', getLocationAddress() + SingleTestWorker.CHECK_WEB2WEB_SUPPORT_PATH, true);

        xmlHttp.onload = () => {
            if (xmlHttp.status === HttpCodes.success) {
                let enabled = JSON.parse(xmlHttp.responseText).enabled;
                if (enabled) {
                    this.#uiWorker.showWEB2WEBButton();
                }
            }
        }

        xmlHttp.send();
    }

    async checkHighSpeedSupport() {
        const userName = cookie.get('user_name');

        if (userName === undefined || userName === null) {
            return;
        }

        fetch(getLocationAddress() + SingleTestWorker.CHECK_HIGHSPEED_SUPPORT_PATH + '?username=' + userName)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                return response.json();
            })
            .then(jsonObject => {
                    if (jsonObject === null) {
                        return;
                    }

                    singleWorker.setHighSpeedSupport(true);

                    if (jsonObject.manager) {
                        I('btn-high-speed').hidden = false;
                    }
                }
            )
            .catch(error => {
                    console.error('Error:', error);
                }
            );
    }

    setHighSpeedSupport(value) {
        this.#highSpeedSupport = value;
    }

    getHighSpeedSupport() {
        return this.#highSpeedSupport;
    }

    async singleSignOnLogin() {
        const token = new URL(window.location.href).searchParams.get("token");

        if (token==null){
            return;
        }

        if (isUserLoggedIn()) {
            window.history.replaceState({}, '', window.location.origin);
            return;
        }   

        fetch('supporter_access?token=' + token)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            $('#username').val(data.account);
            $('#password').val(data.password);
            $('#popup-login__btn').click();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}