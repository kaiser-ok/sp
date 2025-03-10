/**
 * Describing HTTP codes
 */
const HttpCodes = {
    success: 200,
    badRequest: 400,
    unauthorized: 401,
    internalServerError: 500,
}

const JobStatuses = {
    testResult: 4,
    errorAuth: 201,
}


/**
 * Describing IPStack codes
 */
const IPStacks = {
    ipV4: 'IPv4',
    ipV6: 'IPv6',
}


/**
 * Describing WEB UI languages
 * @type {{traditionalChinese: string, english: string}}
 */
const Languages = {
    english: 'en',
    traditionalChinese: 'zh',
}


/**
 * Describing action types
 */
const Actions = {
    NO: "no",
    JOB: "yes",
    EXPIRED: "expired",
}


/**
 * Describes statuses of the running function
 * @type {{success: string, failed: string}}
 */
const ProcessStatus = {
    success: 'SUCCESS',
    failed: 'FAILED',
    starting: 'STARTING',
    finished: 'FINISHED',
}


/**
 * Describing client statuses
 */
const ClientStatus = {
    FREE: "free",
    PING: "ping",
    JITTER: "jitter",
    DOWNLOAD: "download",
    UPLOAD: "upload",
    WAIT_FOR_JOB: "waitForJob",
    DONT_ANSWER: "dontAnswer",
    LOST: "lost",
}

const Web2WebMessageTypes = {
    ANSWER: 'answer',
    OFFER: 'offer',
    ICE: 'ice',
    INIT: 'init',
    CLIENT_ID: 'client_id',
    READY_TO_CONNECT: 'ready',
    PING: 'ping',
    PONG: 'pong',
    SPEEDTEST: 'speedtest',
    START_PING: 'start_ping',
    STOP_PING: 'stop_ping',
    DOWNLOAD_SPEED: 'download_speed',
    START_SPEEDTEST: 'start_speedtest',
    STOP_SPEEDTEST: 'stop_speedtest',
    ERROR: 'error',
}

/**
 * Describing Test Mode
 */
const TestModes = {
    USER_SERVER: 0,
    SERVER_SERVER: 1, 
    SERVER_URL: 2,
}

/**
 * Describing structure for information about client
 */
class ClientInfo {
    client_id;
    order_id;
    current_result;
    current_result_v6;
    error;
    failed_req;
    ip_4;
    ip_6;
    status;

    constructor(client_id, order_id, ip_4, ip_6, current_result, current_result_v6, status)  {
        this.client_id = client_id;
        this.order_id = order_id;
        this.ip_4 = ip_4;
        this.ip_6 = ip_6;
        this.current_result = current_result;
        this.current_result_v6 = current_result_v6;
        this.status = status;
    }
}


/**
 * Describing structure for information about current test result
 */
class CurrentResult {
    status;
    downloadSpeed;
    uploadSpeed;
    ping;
    jitter;
    pingWEBRTC;
    packetLost;
    timestamp;
    lastActionTimestamp;
    allPing;
    allJitter;
    allDownload;
    allUpload;
    allPingWEBRTC;
    jobId;
    publicIP;


    constructor() {
        this.status = ClientStatus.FREE;
        this.downloadSpeed = '-';
        this.uploadSpeed = '-';
        this.ping = '-';
        this.jitter = '-';
        this.pingWEBRTC = '-';
        this.packetLost = '-';
        this.timestamp = dateHolder.getCurrentDateTimeServerISO();
        this.lastActionTimestamp = dateHolder.getCurrentDateTimeServerISO();
        this.allPing = [];
        this.allJitter = [];
        this.allDownload = [];
        this.allUpload = [];
        this.allPingWEBRTC = [];
        this.publicIP = '';
        this.jobId = '';
    }

    clearData() {
        this.status = ClientStatus.FREE;
        this.downloadSpeed = '-';
        this.uploadSpeed = '-';
        this.ping = '-';
        this.jitter = '-';
        this.pingWEBRTC = '-';
        this.packetLost = '-';
        this.allPing = [];
        this.allJitter = [];
        this.allDownload = [];
        this.allUpload = [];
        this.allPingWEBRTC = [];
        this.publicIP = '';
        this.jobId = '';
    }


    toJSON() {
        return {
            status: this.status,
            download_speed: this.downloadSpeed,
            upload_speed: this.uploadSpeed,
            ping: this.ping,
            jitter: this.jitter,
            ping_webrtc: this.pingWEBRTC,
            packet_lost: this.packetLost,
            timestamp: this.timestamp,
            last_action_timestamp: this.lastActionTimestamp,
            all_ping: this.allPing,
            all_jitter: this.allJitter,
            all_download: this.allDownload,
            all_upload: this.allUpload,
            all_ping_webrtc: this.allPingWEBRTC,
            public_ip: this.publicIP,
            job_id: this.jobId,
        }
    }
}


/**
 * Describing structure for information about the latency test current result
 */
class LatencyResultCurrent {
    jobStatus;
    averageLatency;
    minLatency;
    maxLatency;
    allLatency;
    jitter;
    testId;
    sourceIp;
    serverName;
    serverIp;
    serverId;
    testName;
    round;
    clientID;
    orderID;
    lost;
    timestamp;
    sessionID;


    constructor(testId) {
        this.testId = testId;
    }
}


/**
 * Describing structure for information about the speed test job
 */
class Job {
    sessionId;
    serverInfo;
    threadCount;
    testName;
    round;
    speedtestConfig;
    testId;
    shaper;
    selectedClients;
    startTime;
    clientID;
    clientOrderId;
    jobId;
    ipStack;


    constructor(
        sessionID,
        serverInfo,
        threadCount,
        testName,
        round,
        speedtestConfig,
        testId,
        shaper,
        selectedClients,
        startTime,
        jobId,
        ipStack,
    ) {
        this.sessionId = sessionID;
        this.serverInfo = serverInfo;
        this.threadCount = threadCount;
        this.testName = testName;
        this.round = round;
        this.speedtestConfig = speedtestConfig;
        this.testId = testId;
        this.shaper = shaper;
        this.selectedClients = selectedClients;
        this.startTime = startTime;
        this.jobId = jobId;
        this.ipStack = ipStack;
    }


    /**
     * Returns JSON for object
     * @returns {{start_time, round, shaper, job_id, server_config, session_id, thread_number, selected_clients, test_name}}
     */
    toJSON() {
        return {
            session_id: this.sessionId,
            server_config: this.serverInfo,
            thread_number: this.threadCount,
            test_name: this.testName,
            start_time: this.startTime,
            round: this.round,
            shaper: this.shaper,
            selected_clients: this.selectedClients,
            job_id: this.jobId,
        }
    }
}


/**
 * Describing structure for information about the speed test server
 */
class ServerInfo {
    serverId;
    serverIp;
    serverProto;
    serverPort;
    serverName;


    constructor(serverID, serverIP, serverProto, serverPort, serverName) {
        this.serverId = serverID;
        this.serverIp = serverIP;
        this.serverProto = serverProto;
        this.serverPort = serverPort;
        this.serverName = serverName;
    }


    /**
     * Returns JSON for object
     * @returns {{server_name, server_ip, server_port, server_id, server_proto}}
     */
    toJSON() {
        return {
            server_id: this.serverId,
            server_ip: this.serverIp,
            server_proto: this.serverProto,
            server_port: this.serverPort,
            server_name: this.serverName,
        }
    }


    /**
     * Returns server address
     * @returns {string}
     */
    getServerAddress() {
        return this.serverProto + "://" + this.serverIp + ":" + this.serverPort;
    }


    /**
     * Returns socket address
     * @returns {string}
     */
    getServerSocketAddress() {
        let proto = "ws";
        if (this.serverProto === "https") {
            proto = "wss";
        }

        return proto + "://" + this.serverIp + ":" + this.serverPort;
    }
}


/**
 * Describing structure for information about the speed test current result
 */
class SpeedtestResultCurrent {
    downloadSpeedAvg;
    downloadAll;
    uploadSpeedAvg;
    uploadAll;
    testId;
    serverName;
    serverIp;
    testName;
    round;
    clientID;
    orderID;
    timestamp;
    jobStatus;
    serverId;
    clientIP;
    ping;
    allPing;
    jitter;
    sessionID;
    clientStatus;
    lastActionTimestamp;


    constructor(testId) {
        this.testId = testId;
        this.downloadSpeedAvg = '-';
        this.uploadSpeedAvg = '-';
        this.downloadAll = [];
        this.uploadAll = [];
    }
}


/**
 * Describing structure for information about the speed test configuration
 */
class SpeedTestConfig {
    testTimeLimit = 30;
    downloadBytesLimit = 1000000000;
    uploadBytesLimit = 1000000000;
    uploadRefreshTimeout = 50;


    constructor(testTimeLimit, downloadBytesLimit, uploadBytesLimit) {
        this.testTimeLimit = testTimeLimit;
        this.downloadBytesLimit = downloadBytesLimit;
        this.uploadBytesLimit = uploadBytesLimit;
    }
}


/**
 * Describing structure for information about shaper
 */
class Shaper {
    downloadSpeedLimit;
    uploadSpeedLimit;


    constructor(downloadSpeedLimit, uploadSpeedLimit) {
        this.downloadSpeedLimit = downloadSpeedLimit;
        this.uploadSpeedLimit = uploadSpeedLimit;
    }

    /**
     * Returns JSON for object
     * @returns {{upload_speed_limit, download_speed_limit}}
     */
    toJSON() {
        return {
            download_speed_limit: this.downloadSpeedLimit,
            upload_speed_limit: this.uploadSpeedLimit,
        }
    }
}


/**
 * Describes structure with information about group test job
 */
class GroupJob {
    serverConfig;
    serverConfigV6;
    threadNumber;
    startTimeout;
    startTime;
    startTimeJS;
    jobID;
    clientCount;
    jobFinishTimeout;
    shaper;
    jobFinishTime;
    sessionID;


    constructor(serverConfig, serverConfigV6, threadNumber, startTimeout, startTime, startTimeJS, jobID, clientCount,
                jobFinishTimeout, shaper, jobFinishTime, sessionID) {
        this.serverConfig = serverConfig;
        this.serverConfigV6 = serverConfigV6;
        this.threadNumber = threadNumber;
        this.startTimeout = startTimeout;
        this.startTime = startTime;
        this.startTimeJS = startTimeJS;
        this.jobID = jobID;
        this.clientCount = clientCount;
        this.jobFinishTimeout = jobFinishTimeout;
        this.shaper = shaper;
        this.jobFinishTime = jobFinishTime;
        this.sessionID = sessionID;
    }


    /**
     * Returns JSON for object
     * @returns {{start_time, shaper, job_id, server_config, job_finish_time, thread_number, start_time_js, session_id,
     * start_timeout, server_config_v6, job_finish_timeout, client_count}}
     */
    toJSON() {
        return {
            server_config: this.serverConfig,
            server_config_v6: this.serverConfigV6,
            thread_number: this.threadNumber,
            start_timeout: this.startTimeout,
            job_id: this.jobID,
            client_count: this.clientCount,
            job_finish_timeout: this.jobFinishTimeout,
            shaper: this.shaper,
            session_id: this.sessionID,
        }
    }
}


/**
 * Describes client types
 * @type {{single: number, group: number}}
 */
const ClientTypes = {
    single: 0,
    group: 1,
}


/**
 * Describes the available IP version types.
 * @enum {number}
 */
const IPVersionTypes = {
    ipV4: 4,
    ipV6: 6,
    dualStack: 10,
}


/**
 * Returns location address inf format proto://host
 * @returns {string}
 */
function getLocationAddress() {
    return location.protocol + "//" + location.host;
}

function getLocationAddressForWEBSocket() {
    if (location.protocol === 'http:') {
        return "ws://" + location.host;
    } else if (location.protocol === 'https:') {
        return "wss://" + location.host;
    }
}


/**
 * Returns HTML element by ID
 * @param id element's ID
 * @returns {HTMLElement}
 * @constructor
 */
function I(id) {
    return document.getElementById(id);
}


/**
 * The function that generating UUID (session token)
 * @returns Returns random UUID
 */
function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11)
        .replace(/[018]/g, (c) => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4))))
            .toString(16));
}


/**
 * Formats number to string with one digit after dot
 * @param d
 * @returns {string}
 */
function format(d) {
    d = Number(d);

    return d.toFixed(1);
}


/**
 * Computes variance of results array
 * @param array results
 * @returns {number} variance value
 */
function computeVariance(arr, usePopulation = false) {
    const mean = arr.reduce((acc, val) => acc + val, 0) / arr.length;
    return Math.sqrt(
        arr
            .reduce((acc, val) => acc.concat((val - mean) ** 2), [])
            .reduce((acc, val) => acc + val, 0) /
        (arr.length - (usePopulation ? 0 : 1))
    ).toFixed(1);
}


/**
 * Creates base64 string for login
 * @param username
 * @param password
 * @returns {string}
 */
function toBase64(username, password) {
    return btoa(username + ":" + password);
}


/**
 * Returns query variable
 * @param variable name
 * @returns {string}
 */
function getQueryVariable(variable) {
    let query = window.location.search.substring(1);
    let vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
        let pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Query variable %s not found', variable);
    return "";
}


let MD5 = function (d) {
    var r = M(V(Y(X(d), 8 * d.length)));
    return r.toLowerCase()
};

function M(d) {
    for (var _, m = "0123456789ABCDEF", f = "", r = 0; r < d.length; r++) _ = d.charCodeAt(r), f += m.charAt(_ >>> 4 & 15) + m.charAt(15 & _);
    return f
}

function X(d) {
    for (var _ = Array(d.length >> 2), m = 0; m < _.length; m++) _[m] = 0;
    for (m = 0; m < 8 * d.length; m += 8) _[m >> 5] |= (255 & d.charCodeAt(m / 8)) << m % 32;
    return _
}

function V(d) {
    for (var _ = "", m = 0; m < 32 * d.length; m += 8) _ += String.fromCharCode(d[m >> 5] >>> m % 32 & 255);
    return _
}

function Y(d, _) {
    d[_ >> 5] |= 128 << _ % 32, d[14 + (_ + 64 >>> 9 << 4)] = _;
    for (var m = 1732584193, f = -271733879, r = -1732584194, i = 271733878, n = 0; n < d.length; n += 16) {
        var h = m, t = f, g = r, e = i;
        f = md5_ii(f = md5_ii(f = md5_ii(f = md5_ii(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_hh(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_gg(f = md5_ff(f = md5_ff(f = md5_ff(f = md5_ff(f, r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 0], 7, -680876936), f, r, d[n + 1], 12, -389564586), m, f, d[n + 2], 17, 606105819), i, m, d[n + 3], 22, -1044525330), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 4], 7, -176418897), f, r, d[n + 5], 12, 1200080426), m, f, d[n + 6], 17, -1473231341), i, m, d[n + 7], 22, -45705983), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 8], 7, 1770035416), f, r, d[n + 9], 12, -1958414417), m, f, d[n + 10], 17, -42063), i, m, d[n + 11], 22, -1990404162), r = md5_ff(r, i = md5_ff(i, m = md5_ff(m, f, r, i, d[n + 12], 7, 1804603682), f, r, d[n + 13], 12, -40341101), m, f, d[n + 14], 17, -1502002290), i, m, d[n + 15], 22, 1236535329), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 1], 5, -165796510), f, r, d[n + 6], 9, -1069501632), m, f, d[n + 11], 14, 643717713), i, m, d[n + 0], 20, -373897302), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 5], 5, -701558691), f, r, d[n + 10], 9, 38016083), m, f, d[n + 15], 14, -660478335), i, m, d[n + 4], 20, -405537848), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 9], 5, 568446438), f, r, d[n + 14], 9, -1019803690), m, f, d[n + 3], 14, -187363961), i, m, d[n + 8], 20, 1163531501), r = md5_gg(r, i = md5_gg(i, m = md5_gg(m, f, r, i, d[n + 13], 5, -1444681467), f, r, d[n + 2], 9, -51403784), m, f, d[n + 7], 14, 1735328473), i, m, d[n + 12], 20, -1926607734), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 5], 4, -378558), f, r, d[n + 8], 11, -2022574463), m, f, d[n + 11], 16, 1839030562), i, m, d[n + 14], 23, -35309556), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 1], 4, -1530992060), f, r, d[n + 4], 11, 1272893353), m, f, d[n + 7], 16, -155497632), i, m, d[n + 10], 23, -1094730640), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 13], 4, 681279174), f, r, d[n + 0], 11, -358537222), m, f, d[n + 3], 16, -722521979), i, m, d[n + 6], 23, 76029189), r = md5_hh(r, i = md5_hh(i, m = md5_hh(m, f, r, i, d[n + 9], 4, -640364487), f, r, d[n + 12], 11, -421815835), m, f, d[n + 15], 16, 530742520), i, m, d[n + 2], 23, -995338651), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 0], 6, -198630844), f, r, d[n + 7], 10, 1126891415), m, f, d[n + 14], 15, -1416354905), i, m, d[n + 5], 21, -57434055), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 12], 6, 1700485571), f, r, d[n + 3], 10, -1894986606), m, f, d[n + 10], 15, -1051523), i, m, d[n + 1], 21, -2054922799), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 8], 6, 1873313359), f, r, d[n + 15], 10, -30611744), m, f, d[n + 6], 15, -1560198380), i, m, d[n + 13], 21, 1309151649), r = md5_ii(r, i = md5_ii(i, m = md5_ii(m, f, r, i, d[n + 4], 6, -145523070), f, r, d[n + 11], 10, -1120210379), m, f, d[n + 2], 15, 718787259), i, m, d[n + 9], 21, -343485551), m = safe_add(m, h), f = safe_add(f, t), r = safe_add(r, g), i = safe_add(i, e)
    }
    return Array(m, f, r, i)
}

function md5_cmn(d, _, m, f, r, i) {
    return safe_add(bit_rol(safe_add(safe_add(_, d), safe_add(f, i)), r), m)
}

function md5_ff(d, _, m, f, r, i, n) {
    return md5_cmn(_ & m | ~_ & f, d, _, r, i, n)
}

function md5_gg(d, _, m, f, r, i, n) {
    return md5_cmn(_ & f | m & ~f, d, _, r, i, n)
}

function md5_hh(d, _, m, f, r, i, n) {
    return md5_cmn(_ ^ m ^ f, d, _, r, i, n)
}

function md5_ii(d, _, m, f, r, i, n) {
    return md5_cmn(m ^ (_ | ~f), d, _, r, i, n)
}

function safe_add(d, _) {
    var m = (65535 & d) + (65535 & _);
    return (d >> 16) + (_ >> 16) + (m >> 16) << 16 | 65535 & m
}

function bit_rol(d, _) {
    return d << _ | d >>> 32 - _
}

function formatNumber(value, decimalNumber=1) {
    if (decimalNumber<0){
        return value;
    }

    let num = parseFloat(value);
    
    if (!isNaN(num)) {
        return num % decimalNumber === 0 ? num : Number(num.toFixed(decimalNumber));
    }
    return value;
}

const standardDeviation = (arr, usePopulation = false) => {
    const mean = arr.reduce((acc, val) => acc + val, 0) / arr.length;
    let res = Math.sqrt(
        arr
            .reduce((acc, val) => acc.concat((val - mean) ** 2), [])
            .reduce((acc, val) => acc + val, 0) /
        (arr.length - (usePopulation ? 0 : 1))
    );

    if (isNaN(res)) {
        return null;
    }

    return parseFloat(res).toFixed(2);
};

class FullStatistics {
    v4;
    v6;

    constructor(v4, v6) {
        this.v4 = v4;
        this.v6 = v6;
    }
}

class AllStatistics {
    download;
    upload;
    ping;
    jitter;
    pingWEBRTC;

    constructor(download, upload, ping, jitter, pingWEBRTC) {
        this.download = download;
        this.upload = upload;
        this.ping = ping;
        this.jitter = jitter;
        this.pingWEBRTC = pingWEBRTC;
    }
}

class Statistics {
    static SPEED_STD_MIN_6M = 5.4;
    static SPEED_STD_MIN_10M = 9.0;
    static UNLIMITED_STD_PERF = 'N/A';
    static PING_STD_MIN = 0.0;
    static PING_STD_MAX = 20.0;

    standardPerformance = 0;
    nonStandardPerformance = 0;
    average = 0;
    max = 0;
    min = 0;
    standardDeviation = 0;
    total = 0;
}

