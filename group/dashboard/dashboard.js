class Dashboard {
    static TOTAL_CLIENTS_SIMPLE_PATH = '/simplegroup/totalclients';
    static SESSION_STAT_SIMPLE_PATH = '/simplegroup/stat';
    static INIT_JOB_SIMPLE_PATH = '/simplegroup/initjob';
    static HISTORY_SINGLE_PATH = '/history_single';

    static TIMER_LIMIT_SECONDS = 30;
    static CHECK_CLIENTS_COUNT_INTERVAL = 10;

    #uiWorker;
    #serversHolder;
    #dateHolder;
    #ipChecker;
    #trxAuthMaker;
    #configChecker;
    #resultsHolder;
    #reporter;

    #errorHandler = false;
    #sessionID = getQueryVariable('sessionid');
    #job = null;


    constructor(uiWorker, serversHolder, dateHolder, ipChecker, trxAuthMaker, configChecker, resultsHolder, reporter) {
        this.#uiWorker = uiWorker;
        this.#serversHolder = serversHolder;
        this.#dateHolder = dateHolder;
        this.#ipChecker = ipChecker;
        this.#trxAuthMaker = trxAuthMaker;
        this.#configChecker = configChecker;
        this.#resultsHolder = resultsHolder;
        this.#reporter = reporter;

        this.#checkClientsCount();
    }


    /**
     * Start updating clients
     * @returns {Promise<void>}
     */
    async #checkClientsCount() {
        while (!this.#errorHandler) {
            this.#checkTotalClients(this.#sessionID);
            await this.#dateHolder.sleepSeconds(Dashboard.CHECK_CLIENTS_COUNT_INTERVAL);
        }

        this.#errorHandler = false;
    }


    /**
     * Runs the countdown timer for waiting the start of the test
     * @returns {Promise<void>}
     */
    async #timer() {
        let testStartTime = this.#dateHolder.getCurrentDateTimeServerWithDelay(Dashboard.TIMER_LIMIT_SECONDS);

        while (true) {
            let diff = parseInt((this.#dateHolder.parseTimestampFromString(testStartTime) -
                this.#dateHolder.parseTimestampFromString(
                    this.#dateHolder.getCurrentDateTimeServer().replace(/-/g, '/'))) / 1000);

            if (diff > 0) {
                this.#uiWorker.setTimer(diff);
            } else {
                this.#uiWorker.setTimer('-');
                this.#uiWorker.setStartTime();
                this.#checkSimpleGroupStat(this.#sessionID, this.#job.jobID);
                return
            }

            await this.#dateHolder.sleep(50);
        }
    }


    /**
     * Check number of clients that get the job for the test
     * @param sessionID session ID for checking
     * @returns {Promise<void>}
     */
    async #checkTotalClients(sessionID) {
        try {
            let totalClients = await this.#getTotalClients(sessionID);
            this.#uiWorker.setTotalClients(totalClients);
        } catch (error) {
            this.#errorHandler = true;
            if (error.contains('session is not exist')) {
                openInfoPopup(currentLanguage.mess__session__exist)
            } else {
                openInfoPopup(currentLanguage.mess__total__clients + error)
            }
        }
    }


    /**
     * Gets number of connected client from the server
     * @param sessionID current session ID
     * @returns {Promise<unknown>}
     */
    async #getTotalClients(sessionID) {
        return new Promise(function (resolve, reject) {
            let xmlHttp = new XMLHttpRequest();
            xmlHttp.open('GET', getLocationAddress() + Dashboard.TOTAL_CLIENTS_SIMPLE_PATH + '?sessionid='
                + sessionID + '&owner=' + getQueryVariable('owner'), true);
            xmlHttp.setRequestHeader('Authorization', 'Basic ' + cookie.get(Cookie.KEY_BASIC_AUTH));

            xmlHttp.onload = () => {
                switch (xmlHttp.status) {
                    case HttpCodes.success:
                        let clients = xmlHttp.responseText;
                        resolve(clients);
                        break;

                    case HttpCodes.unauthorized:
                        reject(xmlHttp.responseText);
                        break;

                    case HttpCodes.badRequest:
                        reject(xmlHttp.responseText);
                        break;

                    case HttpCodes.internalServerError:
                        reject(xmlHttp.responseText);
                        break;

                    default:
                        reject(xmlHttp.responseText);
                        break;
                }
            };

            xmlHttp.onerror = (error) => {
                reject(error);
            };

            xmlHttp.send();
        });
    }


    /**
     * Checks simple group clients results of the job
     * @param sessionID current group ID
     * @param jobID current job ID
     * @returns {Promise<void>}
     */
    async #checkSimpleGroupStat(sessionID, jobID) {
        try {
            let allDownloadV4 = [],
                allUploadV4 = [],
                allPingV4 = [],
                allJitterV4 = [],
                allPingWEBRTCV4 = [],
                downloadStatisticsV4 = new Statistics(),
                uploadStatisticsV4 = new Statistics(),
                pingStatisticsV4 = new Statistics(),
                jitterStatisticsV4 = new Statistics(),
                pingWEBRTCStatisticsV4 = new Statistics(),
                allDownloadV6 = [],
                allUploadV6 = [],
                allPingV6 = [],
                allJitterV6 = [],
                allPingWEBRTCV6 = [],
                downloadStatisticsV6 = new Statistics(),
                uploadStatisticsV6 = new Statistics(),
                pingStatisticsV6 = new Statistics(),
                jitterStatisticsV6 = new Statistics(),
                pingWEBRTCStatisticsV6 = new Statistics();


            let stat = await this.#getGroupStat(sessionID, jobID);
            if (stat.error == null) {
                stat.clients.forEach(client => {
                    if (!isNaN(parseFloat(client.current_result.download_speed))) {
                        allDownloadV4.push(parseFloat(client.current_result.download_speed));
                        if (!isNaN(parseInt(this.#uiWorker.getSpeedLimit()))) {
                            if (parseInt(this.#uiWorker.getSpeedLimit()) === 6000) {
                                if (client.current_result.download_speed >= Statistics.SPEED_STD_MIN_6M) {
                                    downloadStatisticsV4.standardPerformance += 1;
                                }
                            }
                            if (parseInt(this.#uiWorker.getSpeedLimit()) === 10000) {
                                if (client.current_result.download_speed >= Statistics.SPEED_STD_MIN_10M) {
                                    downloadStatisticsV4.standardPerformance += 1;
                                }
                            }
                        } else {
                            downloadStatisticsV4.standardPerformance = Statistics.UNLIMITED_STD_PERF;
                        }
                    }

                    if (!isNaN(parseFloat(client.current_result.upload_speed))) {
                        allUploadV4.push(parseFloat(client.current_result.upload_speed));
                        if (!isNaN(parseInt(this.#uiWorker.getSpeedLimit()))) {
                            if (parseInt(this.#uiWorker.getSpeedLimit()) === 6000) {
                                if (client.current_result.upload_speed >= Statistics.SPEED_STD_MIN_6M) {
                                    uploadStatisticsV4.standardPerformance += 1;
                                }
                            }
                            if (parseInt(this.#uiWorker.getSpeedLimit()) === 10000) {
                                if (client.current_result.upload_speed >= Statistics.SPEED_STD_MIN_10M) {
                                    uploadStatisticsV4.standardPerformance += 1;
                                }
                            }
                        } else {
                            uploadStatisticsV4.standardPerformance = Statistics.UNLIMITED_STD_PERF;
                        }
                    }

                    if (!isNaN(parseFloat(client.current_result.ping))) {
                        allPingV4.push(parseFloat(client.current_result.ping));
                        if (client.current_result.ping <= Statistics.PING_STD_MAX &&
                            client.current_result.ping >= Statistics.PING_STD_MIN) {
                            pingStatisticsV4.standardPerformance += 1;
                        }
                    }

                    if (!isNaN(parseFloat(client.current_result.jitter))) {
                        allJitterV4.push(parseFloat(client.current_result.jitter));
                        if (client.current_result.jitter <= Statistics.PING_STD_MAX &&
                            client.current_result.jitter >= Statistics.PING_STD_MIN) {
                            jitterStatisticsV4.standardPerformance += 1;
                        }
                    }

                    if (!isNaN(parseFloat(client.current_result.ping_webrtc))) {
                        allPingWEBRTCV4.push(parseFloat(client.current_result.ping_webrtc));
                        if (client.current_result.ping_webrtc <= Statistics.PING_STD_MAX &&
                            client.current_result.ping_webrtc >= Statistics.PING_STD_MIN) {
                            pingWEBRTCStatisticsV4.standardPerformance += 1;
                        }
                    }

                    if (!isNaN(parseFloat(client.current_result_v6.download_speed))) {
                        allDownloadV6.push(parseFloat(client.current_result_v6.download_speed));
                        if (!isNaN(parseInt(this.#uiWorker.getSpeedLimit()))) {
                            if (parseInt(this.#uiWorker.getSpeedLimit()) === 6000) {
                                if (client.current_result_v6.download_speed >= Statistics.SPEED_STD_MIN_6M) {
                                    downloadStatisticsV6.standardPerformance += 1;
                                }
                            }
                            if (parseInt(this.#uiWorker.getSpeedLimit()) === 10000) {
                                if (client.current_result_v6.download_speed >= Statistics.SPEED_STD_MIN_10M) {
                                    downloadStatisticsV6.standardPerformance += 1;
                                }
                            }
                        } else {
                            downloadStatisticsV6.standardPerformance = Statistics.UNLIMITED_STD_PERF;
                        }
                    }

                    if (!isNaN(parseFloat(client.current_result_v6.upload_speed))) {
                        allUploadV6.push(parseFloat(client.current_result_v6.upload_speed));
                        if (!isNaN(parseInt(this.#uiWorker.getSpeedLimit()))) {
                            if (parseInt(this.#uiWorker.getSpeedLimit()) === 6000) {
                                if (client.current_result_v6.upload_speed >= Statistics.SPEED_STD_MIN_6M) {
                                    uploadStatisticsV6.standardPerformance += 1;
                                }
                            }
                            if (parseInt(this.#uiWorker.getSpeedLimit()) === 10000) {
                                if (client.current_result_v6.upload_speed >= Statistics.SPEED_STD_MIN_10M) {
                                    uploadStatisticsV6.standardPerformance += 1;
                                }
                            }
                        } else {
                            uploadStatisticsV6.standardPerformance = Statistics.UNLIMITED_STD_PERF;
                        }
                    }

                    if (!isNaN(parseFloat(client.current_result_v6.ping))) {
                        allPingV6.push(parseFloat(client.current_result_v6.ping));
                        if (client.current_result_v6.ping <= Statistics.PING_STD_MAX &&
                            client.current_result_v6.ping >= Statistics.PING_STD_MIN) {
                            pingStatisticsV6.standardPerformance += 1;
                        }
                    }

                    if (!isNaN(parseFloat(client.current_result_v6.jitter))) {
                        allJitterV6.push(parseFloat(client.current_result_v6.jitter));
                        if (client.current_result_v6.jitter <= Statistics.PING_STD_MAX &&
                            client.current_result_v6.jitter >= Statistics.PING_STD_MIN) {
                            jitterStatisticsV6.standardPerformance += 1;
                        }
                    }

                    if (!isNaN(parseFloat(client.current_result_v6.ping_webrtc))) {
                        allPingWEBRTCV6.push(parseFloat(client.current_result_v6.ping_webrtc));
                        if (client.current_result_v6.ping_webrtc <= Statistics.PING_STD_MAX &&
                            client.current_result_v6.ping_webrtc >= Statistics.PING_STD_MIN) {
                            pingWEBRTCStatisticsV6.standardPerformance += 1;
                        }
                    }

                    this.#uiWorker.addRowToResultsTable(
                        client.order_id,
                        client.current_result.download_speed,
                        client.current_result.upload_speed,
                        client.current_result.ping,
                        client.current_result.jitter,
                        client.current_result.ping_webrtc,
                        client.current_result.packet_lost,
                        client.current_result_v6.download_speed,
                        client.current_result_v6.upload_speed,
                        client.current_result_v6.ping,
                        client.current_result_v6.jitter,
                        client.current_result_v6.ping_webrtc,
                        client.current_result_v6.packet_lost,
                    );

                    this.#resultsHolder.addResultToHolder(client);
                });

                if (allDownloadV4.length === 0) {
                    allDownloadV4.push(0);
                }

                if (allUploadV4.length === 0) {
                    allUploadV4.push(0);
                }

                if (allPingV4.length === 0) {
                    allPingV4.push(0);
                }

                if (allJitterV4.length === 0) {
                    allJitterV4.push(0);
                }

                if (allPingWEBRTCV4.length === 0) {
                    allPingWEBRTCV4.push(0);
                }

                if (allDownloadV6.length === 0) {
                    allDownloadV6.push(0);
                }

                if (allUploadV6.length === 0) {
                    allUploadV6.push(0);
                }

                if (allPingV6.length === 0) {
                    allPingV6.push(0);
                }

                if (allJitterV6.length === 0) {
                    allJitterV6.push(0);
                }

                if (allPingWEBRTCV6.length === 0) {
                    allPingWEBRTCV6.push(0);
                }

                downloadStatisticsV4.average = allDownloadV4.reduce((a, b) => a + b, 0) / allDownloadV4.length;
                uploadStatisticsV4.average = allUploadV4.reduce((a, b) => a + b, 0) / allUploadV4.length;
                pingStatisticsV4.average = allPingV4.reduce((a, b) => a + b, 0) / allPingV4.length;
                jitterStatisticsV4.average = allJitterV4.reduce((a, b) => a + b, 0) / allJitterV4.length;
                pingWEBRTCStatisticsV4.average = allPingWEBRTCV4.reduce((a, b) => a + b, 0) / allPingWEBRTCV4.length;

                downloadStatisticsV4.max = Math.max(...allDownloadV4);
                uploadStatisticsV4.max = Math.max(...allUploadV4);
                pingStatisticsV4.max = Math.max(...allPingV4);
                jitterStatisticsV4.max = Math.max(...allJitterV4);
                pingWEBRTCStatisticsV4.max = Math.max(...allPingWEBRTCV4);

                downloadStatisticsV4.min = Math.min(...allDownloadV4);
                uploadStatisticsV4.min = Math.min(...allUploadV4);
                pingStatisticsV4.min = Math.min(...allPingV4);
                jitterStatisticsV4.min = Math.min(...allJitterV4);
                pingWEBRTCStatisticsV4.min = Math.min(...allPingWEBRTCV4);

                downloadStatisticsV4.standardDeviation = standardDeviation(allDownloadV4);
                uploadStatisticsV4.standardDeviation = standardDeviation(allUploadV4);
                pingStatisticsV4.standardDeviation = standardDeviation(allPingV4);
                jitterStatisticsV4.standardDeviation = standardDeviation(allJitterV4);
                pingWEBRTCStatisticsV4.standardDeviation = standardDeviation(allPingWEBRTCV4);

                downloadStatisticsV6.average = allDownloadV6.reduce((a, b) => a + b, 0) / allDownloadV6.length;
                uploadStatisticsV6.average = allUploadV6.reduce((a, b) => a + b, 0) / allUploadV6.length;
                pingStatisticsV6.average = allPingV6.reduce((a, b) => a + b, 0) / allPingV6.length;
                jitterStatisticsV6.average = allJitterV6.reduce((a, b) => a + b, 0) / allJitterV6.length;
                pingWEBRTCStatisticsV6.average = allPingWEBRTCV6.reduce((a, b) => a + b, 0) / allPingWEBRTCV6.length;

                downloadStatisticsV6.max = Math.max(...allDownloadV6);
                uploadStatisticsV6.max = Math.max(...allUploadV6);
                pingStatisticsV6.max = Math.max(...allPingV6);
                jitterStatisticsV6.max = Math.max(...allJitterV6);
                pingWEBRTCStatisticsV6.max = Math.max(...allPingWEBRTCV6);

                downloadStatisticsV6.min = Math.min(...allDownloadV6);
                uploadStatisticsV6.min = Math.min(...allUploadV6);
                pingStatisticsV6.min = Math.min(...allPingV6);
                jitterStatisticsV6.min = Math.min(...allJitterV6);
                pingWEBRTCStatisticsV6.min = Math.min(...allPingWEBRTCV6);

                downloadStatisticsV6.standardDeviation = standardDeviation(allDownloadV6);
                uploadStatisticsV6.standardDeviation = standardDeviation(allUploadV6);
                pingStatisticsV6.standardDeviation = standardDeviation(allPingV6);
                jitterStatisticsV6.standardDeviation = standardDeviation(allJitterV6);
                pingWEBRTCStatisticsV6.standardDeviation = standardDeviation(allPingWEBRTCV6);

                let allStatisticV4 = new AllStatistics(
                    downloadStatisticsV4,
                    uploadStatisticsV4,
                    pingStatisticsV4,
                    jitterStatisticsV4,
                    pingWEBRTCStatisticsV4,
                );

                let allStatisticV6 = new AllStatistics(
                    downloadStatisticsV6,
                    uploadStatisticsV6,
                    pingStatisticsV6,
                    jitterStatisticsV6,
                    pingWEBRTCStatisticsV6,
                );

                let fullStatistics = new FullStatistics(allStatisticV4, allStatisticV6);

                this.#resultsHolder.setFullStatistics(fullStatistics);

                let ipV4Support = true;
                if (this.#ipChecker.getPublicIPv4() == null) {
                    ipV4Support = false;
                }

                let ipV6Support = true;
                if (this.#ipChecker.getPublicIPv6() == null) {
                    ipV6Support = false;
                }

                this.#uiWorker.addRowToStatisticTable(
                    'stat_download',
                    currentLanguage.caption__down,
                    parseFloat(downloadStatisticsV4.average).toFixed(1),
                    parseFloat(downloadStatisticsV6.average).toFixed(1),
                    parseFloat(downloadStatisticsV4.standardDeviation).toFixed(1),
                    parseFloat(downloadStatisticsV6.standardDeviation).toFixed(1),
                    parseFloat(downloadStatisticsV4.max).toFixed(1),
                    parseFloat(downloadStatisticsV6.max).toFixed(1),
                    parseFloat(downloadStatisticsV4.min).toFixed(1),
                    parseFloat(downloadStatisticsV6.min).toFixed(1),
                )

                this.#uiWorker.addRowToStatisticTable(
                    'stat_upload',
                    currentLanguage.caption__up,
                    parseFloat(uploadStatisticsV4.average).toFixed(1),
                    parseFloat(uploadStatisticsV6.average).toFixed(1),
                    parseFloat(uploadStatisticsV4.standardDeviation).toFixed(1),
                    parseFloat(uploadStatisticsV6.standardDeviation).toFixed(1),
                    parseFloat(uploadStatisticsV4.max).toFixed(1),
                    parseFloat(uploadStatisticsV6.max).toFixed(1),
                    parseFloat(uploadStatisticsV4.min).toFixed(1),
                    parseFloat(uploadStatisticsV6.min).toFixed(1),
                )

                this.#uiWorker.addRowToStatisticTable(
                    'stat_ping',
                    currentLanguage.caption__ping,
                    parseFloat(pingStatisticsV4.average).toFixed(1),
                    parseFloat(pingStatisticsV6.average).toFixed(1),
                    parseFloat(pingStatisticsV4.standardDeviation).toFixed(1),
                    parseFloat(pingStatisticsV6.standardDeviation).toFixed(1),
                    parseFloat(pingStatisticsV4.max).toFixed(1),
                    parseFloat(pingStatisticsV6.max).toFixed(1),
                    parseFloat(pingStatisticsV4.min).toFixed(1),
                    parseFloat(pingStatisticsV6.min).toFixed(1),
                )

                this.#uiWorker.addRowToStatisticTable(
                    'stat_jitter',
                    currentLanguage.caption__jit,
                    parseFloat(jitterStatisticsV4.average).toFixed(1),
                    parseFloat(jitterStatisticsV6.average).toFixed(1),
                    parseFloat(jitterStatisticsV4.standardDeviation).toFixed(1),
                    parseFloat(jitterStatisticsV6.standardDeviation).toFixed(1),
                    parseFloat(jitterStatisticsV4.max).toFixed(1),
                    parseFloat(jitterStatisticsV6.max).toFixed(1),
                    parseFloat(jitterStatisticsV4.min).toFixed(1),
                    parseFloat(jitterStatisticsV6.min).toFixed(1),
                )

                if (this.#uiWorker.getWEBRTCSupport()) {
                    this.#uiWorker.addRowToStatisticTable(
                        'stat_ping_webrtc',
                        currentLanguage.caption__webrtc,
                        parseFloat(pingWEBRTCStatisticsV4.average).toFixed(1),
                        parseFloat(pingWEBRTCStatisticsV6.average).toFixed(1),
                        parseFloat(pingWEBRTCStatisticsV4.standardDeviation).toFixed(1),
                        parseFloat(pingWEBRTCStatisticsV6.standardDeviation).toFixed(1),
                        parseFloat(pingWEBRTCStatisticsV4.max).toFixed(1),
                        parseFloat(pingWEBRTCStatisticsV6.max).toFixed(1),
                        parseFloat(pingWEBRTCStatisticsV4.min).toFixed(1),
                        parseFloat(pingWEBRTCStatisticsV6.min).toFixed(1),
                    )
                }

                this.#uiWorker.addRowToPassSummaryTable(
                    'pass_download',
                    currentLanguage.pass_caption__down,
                    downloadStatisticsV4.standardPerformance,
                    downloadStatisticsV6.standardPerformance,
                    parseFloat(downloadStatisticsV4.standardPerformance / stat.finished_test * 100).toFixed(1),
                    parseFloat(downloadStatisticsV6.standardPerformance / stat.finished_test * 100).toFixed(1),
                )

                this.#uiWorker.addRowToPassSummaryTable(
                    'pass_upload',
                    currentLanguage.pass_caption__up,
                    uploadStatisticsV4.standardPerformance,
                    uploadStatisticsV6.standardPerformance,
                    parseFloat(uploadStatisticsV4.standardPerformance / stat.finished_test * 100).toFixed(1),
                    parseFloat(uploadStatisticsV6.standardPerformance / stat.finished_test * 100).toFixed(1),
                )

                this.#uiWorker.addRowToPassSummaryTable(
                    'pass_ping',
                    currentLanguage.pass_caption__ping,
                    pingStatisticsV4.standardPerformance,
                    pingStatisticsV6.standardPerformance,
                    parseFloat(pingStatisticsV4.standardPerformance / stat.finished_test * 100).toFixed(1),
                    parseFloat(pingStatisticsV6.standardPerformance / stat.finished_test * 100).toFixed(1),
                )

                this.#uiWorker.addRowToPassSummaryTable(
                    'pass_jitter',
                    currentLanguage.pass_caption__jit,
                    jitterStatisticsV4.standardPerformance,
                    jitterStatisticsV6.standardPerformance,
                    parseFloat(jitterStatisticsV4.standardPerformance / stat.finished_test * 100).toFixed(1),
                    parseFloat(jitterStatisticsV6.standardPerformance / stat.finished_test * 100).toFixed(1),
                )

                if (this.#uiWorker.getWEBRTCSupport()) {
                    this.#uiWorker.addRowToPassSummaryTable(
                        'pass_ping_webrtc',
                        currentLanguage.pass_caption__webrtc,
                        pingWEBRTCStatisticsV4.standardPerformance,
                        pingWEBRTCStatisticsV6.standardPerformance,
                        parseFloat(pingWEBRTCStatisticsV4.standardPerformance / stat.finished_test * 100).toFixed(1),
                        parseFloat(pingWEBRTCStatisticsV6.standardPerformance / stat.finished_test * 100).toFixed(1),
                    )
                }

                this.#uiWorker.hideUnusedFields(this.#ipChecker.getIPTypeSupport());
                this.#uiWorker.showUploadMemo();
                this.#uiWorker.setClientFinishCounter(stat.finished_test);
                this.#uiWorker.refreshUI();
                this.#uiWorker.showResults();
                return;
            } else {
                this.#uiWorker.setClientFinishCounter(stat.finished_test);
            }
        } catch (error) {
            if (error.contains('session is not exist')) {
                openInfoPopup(currentLanguage.mess__session__exist)
            } else {
                openInfoPopup(currentLanguage.mess__group__result + error);
            }

            return;
        }

        await this.#dateHolder.sleepSeconds(5);

        this.#checkSimpleGroupStat(sessionID, jobID);
    }


    /**
     * Gets current group's results from server
     * @param sessionID current group ID
     * @param jobID current job ID
     * @returns {Promise<unknown>}
     */
    async #getGroupStat(sessionID, jobID) {
        return new Promise((resolve, reject) => {
            let xmlHttp = new XMLHttpRequest();
            xmlHttp.open('GET', getLocationAddress() + Dashboard.SESSION_STAT_SIMPLE_PATH + '?sessionid='
                + sessionID + '&jobid=' + jobID + '&owner=' + getQueryVariable('owner'), true);
            xmlHttp.setRequestHeader('Authorization', 'Basic ' + cookie.get(Cookie.KEY_BASIC_AUTH));

            xmlHttp.onload = () => {
                switch (xmlHttp.status) {
                    case HttpCodes.success:
                        let clients = JSON.parse(xmlHttp.responseText);
                        resolve(clients);
                        break;

                    case HttpCodes.unauthorized:
                        reject(xmlHttp.responseText);
                        break;

                    case HttpCodes.badRequest:
                        reject(xmlHttp.responseText);
                        break;

                    case HttpCodes.internalServerError:
                        reject(xmlHttp.responseText);
                        break;

                    default:
                        reject(xmlHttp.responseText);
                        break;
                }
            };

            xmlHttp.onerror = () => {
                reject(xmlHttp.error);
            };

            xmlHttp.send();
        });
    }


    /**
     * Creates new group job
     * @returns {Promise<void>}
     */
    async #createJob() {
        this.#job = null;
        const serverID = this.#uiWorker.getTRXServerID();
        let serverInfoV4 = this.#serversHolder.getServerV4ByID(serverID);
        let serverInfoV6 = this.#serversHolder.getServerV6ByID(serverID);

        let shaper = new Shaper(0, 0);

        if (!isNaN(parseInt(this.#uiWorker.getSpeedLimit()))) {
            shaper = new Shaper(parseInt(
                    parseInt(this.#uiWorker.getSpeedLimit()) * 1000),
                parseInt(parseInt(this.#uiWorker.getSpeedLimit()) * 1000));
        }

        let speedtestConfig = null;

        try {
            let authResult = null;
            if (this.#ipChecker.getPublicIPv4() !== null && serverInfoV4 !== null) {
                authResult = await this.#trxAuthMaker.trxAuth(serverInfoV4.getServerAddress(), uuidv4());
                if (authResult.isSuccess) {
                    speedtestConfig = await this.#configChecker.getSpeedTestConfig(serverInfoV4.getServerAddress(), authResult.token);
                }
            } else if (this.#ipChecker.getPublicIPv6() !== null && serverInfoV6 !== null) {
                authResult = await this.#trxAuthMaker.trxAuth(serverInfoV6.getServerAddress(), uuidv4());
                if (authResult.isSuccess) {
                    speedtestConfig = await this.#configChecker.getSpeedTestConfig(serverInfoV6.getServerAddress(), authResult.token);
                }
            } else {
                throw new Error('cant create new job: cant get test config from selected server');
            }
        } catch (error) {
            openInfoPopup(currentLanguage.mess__test__config);
            console.log(error);
            this.#errorHandler = true;
            return;
        }

        let timeMultiplier = 1;
        if (this.#ipChecker.getPublicIPv4() !== null && this.#ipChecker.getPublicIPv6() !== null) {
            timeMultiplier = 2;
        }

        this.#job = new GroupJob(
            serverInfoV4,
            serverInfoV6,
            parseInt(I('thread-number__select').value),
            Dashboard.TIMER_LIMIT_SECONDS,
            '',
            '',
            uuidv4(),
            0,
            ((speedtestConfig.testTimeLimit * 2) + 60) * timeMultiplier,
            shaper,
            '',
            this.#sessionID,
        )
    }


    /**
     * Sends new group job to the server
     * @returns {Promise<void>}
     */
    async #initGroupTest() {
        await this.#createJob();

        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open('POST', getLocationAddress() + Dashboard.INIT_JOB_SIMPLE_PATH + '?sessionid='
            + this.#sessionID + '&owner=' + getQueryVariable('owner'), true);
        xmlHttp.setRequestHeader('Authorization', 'Basic ' + cookie.get(Cookie.KEY_BASIC_AUTH));

        xmlHttp.onload = () => {
            switch (xmlHttp.status) {
                case HttpCodes.success:
                    break;

                default:
                    console.log('cant init group test: ', xmlHttp.responseText);
                    break;
            }
        }

        xmlHttp.send(JSON.stringify(this.#job));
    }


    /**
     * Start group test
     * @returns {Promise<void>}
     */
    async startGroupTest() {
        this.#uiWorker.clearResultsTable();
        this.#uiWorker.clearStatisticTable();
        this.#uiWorker.clearPassSummaryTable();
        this.#resultsHolder.clearHolder();
        this.#timer();
        this.#initGroupTest();
        createLocker();
        this.#uiWorker.hideUploadMemo();
        this.#uiWorker.hideStartAndShowWait();
        this.#uiWorker.setClientFinishCounter(0);
        this.#uiWorker.hideResults();
    }


    /**
     * Uploads test with memo to DB
     * @returns {Promise<void>}
     */
    async uploadMemo() {
        let result = []
        this.#resultsHolder.getAllResults().forEach((value, clientID) => {
            let trxServer = this.#serversHolder.getTRXServerByID(this.#uiWorker.getTRXServerID());

            let resultV4 = {}
            if (this.#ipChecker.getPublicIPv4() !== null && trxServer.ip4Server !== undefined) {
                resultV4 = new DetailResult(
                    IPStacks.ipV4,
                    this.#dateHolder.getCurrentDateTimeServer(),
                    value.ipV4,
                    trxServer.name,
                    trxServer.ip4Server.host,
                    value.pingIPv4,
                    value.jitterIPv4,
                    value.pingWEBRTCIPv4,
                    value.packetLostIPv4,
                    value.downloadIPv4,
                    value.uploadIPv4,
                    new AllResults(value.allPingIPv4,
                        Math.min.apply(null, value.allPingIPv4),
                        Math.max.apply(null, value.allPingIPv4),
                        computeVariance(value.allPingIPv4)),
                    new AllResults(value.allJitterIPv4,
                        Math.min.apply(null, value.allJitterIPv4),
                        Math.max.apply(null, value.allJitterIPv4),
                        computeVariance(value.allJitterIPv4)),
                    new AllResults(value.allPingWEBRTCIPv4,
                        Math.min.apply(null, value.allPingWEBRTCIPv4),
                        Math.max.apply(null, value.allPingWEBRTCIPv4),
                        computeVariance(value.allJitterIPv4)),
                    new AllResults(value.allDownloadIPv4,
                        Math.min.apply(null, value.allDownloadIPv4),
                        Math.max.apply(null, value.allDownloadIPv4),
                        computeVariance(value.allDownloadIPv4)),
                    new AllResults(value.allUploadIPv4,
                        Math.min.apply(null, value.allUploadIPv4),
                        Math.max.apply(null, value.allUploadIPv4),
                        computeVariance(value.allUploadIPv4)));
            }

            let resultV6 = {}
            if (this.#ipChecker.getPublicIPv6() !== null && trxServer.ip6Server !== undefined) {
                resultV6 = new DetailResult(
                    IPStacks.ipV6,
                    this.#dateHolder.getCurrentDateTimeServer(),
                    value.ipV6,
                    trxServer.name,
                    trxServer.ip6Server.host,
                    value.pingIPv6,
                    value.jitterIPv6,
                    value.pingWEBRTCIPv6,
                    value.packetLostIPv6,
                    value.downloadIPv6,
                    value.uploadIPv6,
                    new AllResults(value.allPingIPv6,
                        Math.min.apply(null, value.allPingIPv6),
                        Math.max.apply(null, value.allPingIPv6),
                        computeVariance(value.allPingIPv6)),
                    new AllResults(value.allJitterIPv6,
                        Math.min.apply(null, value.allJitterIPv6),
                        Math.max.apply(null, value.allJitterIPv6),
                        computeVariance(value.allJitterIPv6)),
                    new AllResults(value.allPingWEBRTCIPv6,
                        Math.min.apply(null, value.allPingWEBRTCIPv6),
                        Math.max.apply(null, value.allPingWEBRTCIPv6),
                        computeVariance(value.allPingWEBRTCIPv6)),
                    new AllResults(value.allDownloadIPv6,
                        Math.min.apply(null, value.allDownloadIPv6),
                        Math.max.apply(null, value.allDownloadIPv6),
                        computeVariance(value.allDownloadIPv6)),
                    new AllResults(value.allUploadIPv6,
                        Math.min.apply(null, value.allUploadIPv6),
                        Math.max.apply(null, value.allUploadIPv6),
                        computeVariance(value.allUploadIPv6)));
            }

            result.push({clientID, resultV4, resultV6});
        })

        let speedLimit = this.#job.shaper.downloadSpeedLimit / 1000000;
        if (speedLimit === 0) {
            speedLimit = 'Unlimited';
        }
        await this.#reporter.sendDetailReport(
            new DetailResults(
                I('memo__input').value,
                result,
                'group',
                this.#sessionID,
                speedLimit,
                this.#job.threadNumber),
            0,
            getQueryVariable('owner')
        );

        openInfoPopup(currentLanguage.mess__upload__success)

        this.#uiWorker.hideUploadMemo()

        I('memo__input').innerText = '';
    }
}