/**
 * Describes advanced WEB test types
 * @type {{SERVER_SERVER: number, SERVER_URL: number}}
 */
const advancedWEBTestTypes = {
    SERVER_SERVER: 1,
    SERVER_URL: 2,
}


/**
 *
 * @type {{
 * STOP_TEST: number,
 * JOB_REQUEST: number,
 * JOB_FINISH: number,
 * LATENCY_HTTP: number,
 * LATENCY_ICMP: number,
 * DOWNLOAD: number,
 * UPLOAD: number}}
 */
const advancedWEBTestMessageTypes = {
    STOP_TEST: 0,
    JOB_REQUEST: 1,
    JOB_FINISH: 2,
    LATENCY_HTTP: 3,
    LATENCY_ICMP: 4,
    DOWNLOAD: 5,
    UPLOAD: 6,
}


/**
 * Describes job for advanced WEB test
 */
class AdvancedJob {
    type;
    server;
    url;
    speedLimit;

    /**
     * Creates new advanced WEB test job
     * @param {number} type
     * @param {SpeedTestServer} server
     * @param {string} url
     * @param {number} speedLimit
     */
    constructor(type, server, url, speedLimit) {
        this.type = type;
        this.server = server;
        this.url = url;
        this.speedLimit = speedLimit;
    }

    /**
     * Marshals object to json
     * @returns {{type, server, url, speedLimit}}
     */
    toJSON() {
        return {
            type: this.type,
            server: this.server,
            url: this.url,
            speed_limit: this.speedLimit,
        }
    }
}


/**
 * Describes MTR hop
 */
class MTRHop {
    host;
    ping;
    hostName;

    /**
     * Creates new MTR hop
     * @param {string} host
     * @param {number} ping
     * @param {string} hostName
     */
    constructor(host, ping, hostName) {
        this.host = host;
        this.ping = ping;
        this.hostName = hostName;
    }
}


/**
 * Describes traceroute result
 */
class TracerouteResult {
    hops;

    /**
     * Creates new traceroute result
     * @param {[MTRHop]} hops
     */
    constructor(hops) {
        this.hops = hops;
    }
}


/**
 * Describes ICMP ping result
 */
class ICMPPingResult {
    averagePing;
    allPing;
    packetLost;
    maxPing;
    minPing;
    deviation;
    sent;
    received;


    /**
     * Creates new ICMP ping result
     * @param {number} averagePing
     * @param {[number]} allPing
     * @param {number} packetLost
     * @param {number} maxPing
     * @param {number} minPing
     * @param {number} deviation
     * @param {number} sent
     * @param {number} received
     */
    constructor(averagePing, allPing, packetLost, maxPing, minPing, deviation, sent, received) {
        this.averagePing = averagePing;
        this.allPing = allPing;
        this.packetLost = packetLost;
        this.maxPing = maxPing;
        this.minPing = minPing;
        this.deviation = deviation;
        this.sent = sent;
        this.received = received;
    }
}


/**
 * Describes latency result
 */
class AdvancedLatencyResult {
    httpPing;
    jitter;
    allHTTPPing;
    allJitter;
    traceroute;
    icmpPing;

    /**
     * Creates new latency result
     * @param {number} httpPing
     * @param {number} jitter
     * @param {[number]} allHTTPPing
     * @param {[number]} allJitter
     * @param {TracerouteResult} traceroute
     * @param {ICMPPingResult} icmpPing
     */
    constructor(httpPing, jitter, allHTTPPing, allJitter, traceroute, icmpPing) {
        this.httpPing = httpPing;
        this.jitter = jitter;
        this.allHTTPPing = allHTTPPing;
        this.allJitter = allJitter;
        this.traceroute = traceroute;
        this.icmpPing = icmpPing;
    }
}

/**
 * Describes speedtest result
 */
class AdvancedSpeedtestResult {
    download;
    allDownload;
    upload;
    allUpload;

    /**
     * Creates new speedtest result
     * @param {number} download
     * @param {[number]} allDownload
     * @param {number} upload
     * @param {[number]} allUpload
     */
    constructor(download, allDownload, upload, allUpload) {
        this.download = download;
        this.allDownload = allDownload;
        this.upload = upload;
        this.allUpload = allUpload;
    }
}


/**
 * Describes advanced test message
 */
class AdvancedMessage {
    type;
    job;
    latency;
    speedtest;
    error;

    /**
     * Creates new message
     * @param {number} type
     * @param {AdvancedJob} job
     * @param {AdvancedLatencyResult} latency
     * @param {AdvancedSpeedtestResult} speedtest
     * @param {string} error
     */
    constructor(type, job, latency, speedtest, error) {
        this.type = type;
        this.job = job;
        this.latency = latency;
        this.speedtest = speedtest;
        this.error = error;
    }

    /**
     * Marshals objects to json
     * @returns {{type, job}}
     */
    toJSON() {
        return {
            type: this.type,
            job: this.job,
        }
    }

    /**
     * Unmarshals json to object
     * @param jsonString
     * @returns {AdvancedMessage}
     */
    static fromJSON(jsonString) {
        const obj = JSON.parse(jsonString);

        let latencyResult = null;
        if (obj.latency_result !== null && obj.latency_result !== undefined) {
            let tracerouteResult = null;
            if (obj.latency_result.traceroute !== null) {
                const mtrHops = obj.latency_result.traceroute.hops.map(hop => new MTRHop(hop.host, hop.ping, hop.host_name));
                tracerouteResult = new TracerouteResult(mtrHops);
            }

            let icmpPingResult = null;
            if (obj.latency_result.icmp_ping !== null) {
                const allICMPPing = obj.latency_result.icmp_ping.all_ping;
                icmpPingResult = new ICMPPingResult(
                    obj.latency_result.icmp_ping.average_ping,
                    allICMPPing,
                    obj.latency_result.icmp_ping.packet_lost,
                    obj.latency_result.icmp_ping.max_ping,
                    obj.latency_result.icmp_ping.min_ping,
                    obj.latency_result.icmp_ping.deviation,
                    obj.latency_result.icmp_ping.sent,
                    obj.latency_result.icmp_ping.received,
                );
            }

            latencyResult = new AdvancedLatencyResult(
                obj.latency_result.http_ping,
                obj.latency_result.jitter,
                obj.latency_result.all_http_ping,
                obj.latency_result.all_jitter,
                tracerouteResult,
                icmpPingResult,
            );
        }

        let speedtestResult = null;
        if (obj.speedtest_result !== null && obj.speedtest_result !== undefined) {
            speedtestResult = new AdvancedSpeedtestResult(
                obj.speedtest_result.download,
                obj.speedtest_result.all_download,
                obj.speedtest_result.upload,
                obj.speedtest_result.all_upload,
            )
        }

        return new AdvancedMessage(obj.type, null, latencyResult, speedtestResult, obj.error)
    }
}