class Reporter {
    static SPEEDTEST_REPORT_PATH = '/report';
    static LATENCY_REPORT_PATH = '/latency_report';
    static DETAIL_REPORT_PATH = '/detailed_report';

    static TYPE_SPEED_TEST = 'web';
    static TYPE_LATENCY = 'lat_web';
    static TYPE_DETAILED = 'web_det';

    static JOB_STATUS_SUCCESS = 4;

    #dateHolder;
    #sysInfoCollector;


    constructor(dateHolder, sysInfoCollector) {
        this.#dateHolder = dateHolder;
        this.#sysInfoCollector = sysInfoCollector;
    }


    /**
     * Sends speed test report
     * @param {WEBResultDetail} result contains speedtest result
     * @param {number} retryCounter contains retry number
     * @param {string} testID contains test id
     */
    async sendSpeedtestReport(result, retryCounter, testID) {
        if (retryCounter > 0) {
            await this.#dateHolder.sleep(2000);
        }

        try {
            let authResult = await trxAuthMaker.trxAuth(getLocationAddress(), uuidv4());
            if (authResult.isSuccess) {
                let xmlHttp = new XMLHttpRequest();
                xmlHttp.open('POST',
                    getLocationAddress() + Reporter.SPEEDTEST_REPORT_PATH +
                    '?session=' + authResult.token +
                    '&test_id=' + testID, true);

                xmlHttp.onerror = () => {
                    if (retryCounter < 30) {
                        this.sendSpeedtestReport(result, retryCounter + 1, testID);
                    }
                }

                xmlHttp.send(JSON.stringify(result));
            } else if (retryCounter < 30) {
                this.sendSpeedtestReport(result, retryCounter + 1, testID);
            }
        } catch (err) {
            console.log('cant send the speed test report: ', err);

            if (retryCounter < 30) {
                this.sendSpeedtestReport(result, retryCounter + 1, testID);
            }
        }
    }


    /**
     * Sends latency test report
     * @param {WEBResultDetail} result contains latency result
     * @param {*} retryCounter contains retry number
     * @param {string} testID contains test id
     */
    async sendLatencyReport(result, retryCounter, testID) {
        if (retryCounter > 0) {
            await this.#dateHolder.sleep(2000);
        }

        try {
            let authResult = await trxAuthMaker.trxAuth(getLocationAddress(), uuidv4());
            if (authResult.isSuccess) {
                let xmlHttp = new XMLHttpRequest();
                xmlHttp.open('POST',
                    getLocationAddress() + Reporter.LATENCY_REPORT_PATH +
                    '?session=' + authResult.token +
                    '&test_id=' + testID, true);

                xmlHttp.onerror = () => {
                    if (retryCounter < 30) {
                        this.sendLatencyReport(result, retryCounter + 1, testID);
                    }
                };

                xmlHttp.send(JSON.stringify(result));
            } else if (retryCounter < 30) {
                this.sendLatencyReport(result, retryCounter + 1, testID);

            }
        } catch (err) {
            console.log('cant send the latency test report: ', err);

            if (retryCounter < 30) {
                this.sendLatencyReport(result, retryCounter + 1, testID);
            }
        }
    }


    /**
     * Sends detail report with memo for single-shot test
     * @param result detail test result
     * @param retryCounter retry counter for send
     * @param owner owner name
     * @returns {Promise<void>}
     */
    async sendDetailReport(result, retryCounter, owner) {
        if (retryCounter > 0) {
            await this.#dateHolder.sleep(2000);
        }

        try {
            let authResult = await trxAuthMaker.trxAuth(getLocationAddress(), uuidv4());
            if (authResult.isSuccess) {
                let message = new DetailMessage(result);

                let xmlHttp = new XMLHttpRequest();
                xmlHttp.open('POST',
                    getLocationAddress() + Reporter.DETAIL_REPORT_PATH + '?session=' + authResult.token +
                    '&owner=' + owner, true);
                xmlHttp.setRequestHeader('Authorization', 'Basic ' + cookie.get(Cookie.KEY_BASIC_AUTH));

                xmlHttp.onerror = () => {
                    if (retryCounter < 30) {
                        this.sendDetailReport(result, retryCounter + 1);
                    }
                }

                xmlHttp.send(JSON.stringify(message));
            } else if (retryCounter < 30) {
                this.sendDetailReport(result, retryCounter + 1);
            }
        } catch (err) {
            console.log('cant send the detail test report: ', err);
            if (retryCounter < 30) {
                this.sendDetailReport(result);
            }
        }
    }
}


class Message {
    JobStatus;
    JobId;
    SessionID;
    Result;
    ServerId;
    Type;
    TestId;


    /**
     * Creates message for sending
     * @param {SpeedtestResult | LatencyResult} result contains test result (speed or latency) for sending
     * @param {SpeedtestResultCurrent | LatencyResultCurrent} testResult contains current test results (speed or latency)
     * @param {String} type contains test type (speed or latency)
     */
    constructor(result, testResult, type) {
        this.JobStatus = testResult.jobStatus.toString();
        this.JobId = testResult.testId;
        this.SessionID = testResult.sessionID;
        this.Result = JSON.stringify(result);
        this.ServerId = testResult.serverId;
        this.Type = type;
        this.TestId = testResult.testId;
    }
}


class DetailMessage {
    JobStatus;
    Result;
    TestType;


    constructor(result, type) {
        this.JobStatus = 4;
        this.Result = JSON.stringify(result);
        this.TestType = Reporter.TYPE_DETAILED;
    }
}


class DetailResults {
    Memo;
    Result;
    Type;
    SessionID;
    SpeedLimit;
    ThreadCount;

    constructor(memo, results, type, sessionID, speedLimit, threadCount) {
        this.Memo = memo
        this.Result = results;
        this.Type = type;
        this.SessionID = sessionID;
        this.SpeedLimit = speedLimit;
        this.ThreadCount = threadCount;
    }

    toJSON() {
        return {
            memo: this.Memo,
            result: this.Result,
            type: this.Type,
            sessionID: this.SessionID,
            speed_limit: this.SpeedLimit,
            thread_count: this.ThreadCount,
        }
    }
}


class DetailResult {
    IPStack;
    TestTime;
    From;
    ServerName;
    ServerAddress;
    Ping;
    Jitter;
    PingWEBRTC;
    PacketLost;
    Download;
    Upload;
    AllPing;
    AllJitter;
    AllPingWEBRTC;
    AllDownload;
    AllUpload;


    constructor(
        ipStack,
        testTime,
        from,
        serverName,
        serverAddress,
        ping,
        jitter,
        pingWEBRTC,
        packetLost,
        download,
        upload,
        allPing,
        allJitter,
        allPingWEBRTC,
        allDownload,
        allUpload,
    ) {
        this.IPStack = ipStack;
        this.TestTime = testTime;
        this.From = from;
        this.ServerName = serverName;
        this.ServerAddress = serverAddress;
        this.Ping = ping;
        this.Jitter = jitter;
        this.PingWEBRTC = pingWEBRTC;
        this.PacketLost = packetLost;
        this.Download = download;
        this.Upload = upload;
        this.AllPing = allPing;
        this.AllJitter = allJitter;
        this.AllPingWEBRTC = allPingWEBRTC;
        this.AllDownload = allDownload;
        this.AllUpload = allUpload;
    }


    toJSON() {
        return {
            ip_stack: this.IPStack,
            test_time: this.TestTime,
            from: this.From,
            server_name: this.ServerName,
            server_address: this.ServerAddress,
            ping: this.Ping,
            jitter: this.Jitter,
            ping_webrtc: this.PingWEBRTC,
            packet_lost: this.PacketLost,
            download: this.Download,
            upload: this.Upload,
            all_ping: this.AllPing,
            all_jitter: this.AllJitter,
            all_ping_webrtc: this.AllPingWEBRTC,
            all_download: this.AllDownload,
            all_upload: this.AllUpload,
        }
    }
}


class AllResults {
    All;
    Min;
    Max;
    Variance;


    constructor(all, min, max, variance) {
        this.All = all;
        this.Min = min;
        this.Max = max;
        this.Variance = variance;
    }


    toJSON() {
        return {
            all: this.All,
            min: this.Min,
            max: this.Max,
            variance: this.Variance,
        }
    }
}


class WEBResultDetail {
    jobID;
    jobStatus;
    result;
    serverID;
    sessionID;
    sourceIP;
    testID;

    constructor(jobID, jobStatus, result, serverID, sessionID, sourceIP, testID) {
        this.jobID = jobID;
        this.jobStatus = jobStatus;
        this.result = result;
        this.serverID = serverID;
        this.sessionID = sessionID;
        this.sourceIP = sourceIP;
        this.testID = testID;
    }

    toJSON() {
        return {
            job_id: this.jobID,
            job_status: this.jobStatus,
            result: this.result,
            server_id: this.serverID,
            session_id: this.sessionID,
            source_ip: this.sourceIP,
            test_id: this.testID,
        }
    }
}

class TestDetailResult {
    testInfo;
    result;
    systemInfo;
    error;

    constructor(testInfo, result, systemInfo, error) {
        this.testInfo = testInfo;
        this.result = result;
        this.systemInfo = systemInfo;
        this.error = error;
    }

    toJSON() {
        return {
            test_info: this.testInfo,
            result: this.result,
            system_info: this.systemInfo,
            error: this.error,
        }
    }
}

class TestInfo {
    sourceIP;
    targetIP;
    speedLimitMBps;
    timeLimitSeconds;
    latencyRequestType;
    testType;
    parallelThreads;
    sessionID;
    testName;
    round;
    clientID;
    orderID;

    constructor(
        sourceIP,
        targetIP,
        speedLimitMBps,
        timeLimitSeconds,
        latencyRequestType,
        testType,
        parallelThreads,
        sessionID,
        testName,
        round,
        clientID,
        orderID,
    ) {
        this.sourceIP = sourceIP;
        this.targetIP = targetIP;
        this.speedLimitMBps = speedLimitMBps;
        this.timeLimitSeconds = timeLimitSeconds;
        this.latencyRequestType = latencyRequestType;
        this.testType = testType;
        this.parallelThreads = parallelThreads;
        this.sessionID = sessionID;
        this.testName = testName;
        this.round = round;
        this.clientID = clientID;
        this.orderID = orderID;
    }

    toJSON() {
        return {
            source_ip: this.sourceIP,
            target_ip: this.targetIP,
            speed_limit_MBps: this.speedLimitMBps,
            time_limit_seconds: this.timeLimitSeconds,
            latency_request_type: this.latencyRequestType,
            test_type: this.testType,
            parallel_threads: this.parallelThreads,
            session_id: this.sessionID,
            test_name: this.testName,
            round: this.round,
            client_id: this.clientID,
            order_id: this.orderID,
        }
    }
}

class TestResult {
    speedtest;
    latency;

    constructor(speedtest, latency) {
        this.speedtest = speedtest;
        this.latency = latency;
    }

    toJSON() {
        return {
            speedtest: this.speedtest,
            no_load_latency: this.latency,
        }
    }
}

class SpeedtestResult {
    summary;

    constructor(summary) {
        this.summary = summary;
    }

    toJSON() {
        return {
            summary: this.summary,
        }
    }
}

class SpeedtestResultSummary {
    downloadMbps;
    uploadMbps;
    downloadedMBytes;
    uploadedMBytes;

    constructor(
        downloadMbps,
        uploadMbps,
        downloadedMBytes,
        uploadedMBytes,
    ) {
        this.downloadMbps = downloadMbps;
        this.uploadMbps = uploadMbps;
        this.downloadedMBytes = downloadedMBytes;
        this.uploadedMBytes = uploadedMBytes;
    }

    toJSON() {
        return {
            download_Mbps: this.downloadMbps,
            upload_Mbps: this.uploadMbps,
            downloaded_MBytes: this.downloadedMBytes,
            uploaded_MBytes: this.uploadedMBytes,
        }
    }
}

class SystemInfo {
    cpuInfo;

    constructor(cpuInfo) {
        this.cpuInfo = cpuInfo;
    }

    toJSON() {
        return {
            cpu_info: this.cpuInfo,
        }
    }
}

class CPUInfo {
    cores;
    threads;

    constructor(cores, threads) {
        this.cores = cores;
        this.threads = threads;
    }

    toJSON() {
        return {
            cores: this.cores,
            threads: this.threads,
        }
    }
}

class LatencyResult {
    l7;
    webrtc;

    constructor(l7, webrtc) {
        this.l7 = l7;
        this.webrtc = webrtc;
    }

    toJSON() {
        return {
            l7: this.l7,
            webrtc: this.webrtc,
        }
    }
}

class LatencyResultDetail {
    delayAvgMs;
    delayDetailMs;
    jitterAvgMs;
    jitterDetailMs;
    lostPercent;

    constructor(delayAvgMs, delayDetailMs, jitterAvgMs, jitterDetailMs, lostPercent) {
        this.delayAvgMs = delayAvgMs;
        this.delayDetailMs = delayDetailMs;
        this.jitterAvgMs = jitterAvgMs;
        this.jitterDetailMs = jitterDetailMs;
        this.lostPercent = lostPercent;
    }

    toJSON() {
        return {
            delay_avg_ms: this.delayAvgMs,
            delay_detail_ms: this.delayDetailMs,
            jitter_avg_ms: this.jitterAvgMs,
            jitter_detail_ms: this.jitterDetailMs,
            lost_percent: this.lostPercent,
        }
    }
}