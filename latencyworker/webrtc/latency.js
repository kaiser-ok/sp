let wsSignaling = null,
    localConnection = null,
    dataChannel = null,
    allPing = new Map(),
    isConnected = false,
    answers = 0;


class LatencyWEBRTC {
    static PING_PATH = '/ws_webrtc_ping';
    static GET_ICE_SERVERS = '/get_ice_servers';
    static GET_WEBRTC_SUPPORT = '/get_web_rtc_support'

    static PING_RETRY_COUNT = 20;
    static PING_LATE_TIMEOUT = 60;

    #ipChecker;
    #dateHolder;
    #resultsUIWorker;

    #job;
    #isFinish;

    #ping;
    #allPing;
    #lost;

    #iceServers;
    #webRTCSupport;

    constructor(ipChecker, dateHolder, resultsUIWorker) {
        this.#ipChecker = ipChecker;
        this.#dateHolder = dateHolder;
        this.#resultsUIWorker = resultsUIWorker;

        this.#checkWEBRTCSupport();
    }


    /**
     * Checks WEB RTC support
     * @returns {Promise<void>}
     */
    async #checkWEBRTCSupport() {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open('GET', getLocationAddress() + LatencyWEBRTC.GET_WEBRTC_SUPPORT, true);

        xmlHttp.onload = () => {
            const resp = JSON.parse(xmlHttp.responseText);

            this.#webRTCSupport = resp.enable;

            if (!resp.enable) {
                this.#resultsUIWorker.hideWEBRTCPart();
            }
        };

        xmlHttp.send();
    }


    /**
     * Creates local connection for WEB RTC
     * @returns {Promise<void>}
     */
    async #createLocalConnection() {
        localConnection = new RTCPeerConnection({
            iceServers: this.#iceServers,
        });

        dataChannel = localConnection.createDataChannel('dataChannel', {
            ordered: false,
            maxRetransmits: 0
        })

        dataChannel.onopen = () => {
            this.#startTest();
        }

        answers = 0;

        dataChannel.onmessage = event => {
            let json = JSON.parse(event.data);
            let value = allPing.get(json.id);
            this.#allPing.push(Math.abs(new Date() - value.start));
            value.end = new Date().getTime();
            value.success = true;
            allPing.set(json.id, value);
            if (this.#isFinish) {
                dataChannel.close();
                return
            }
        };

        dataChannel.onerror = function (error) {
            console.error("DataChannel Error:", error);
        };

        dataChannel.onclose = event => {
            console.log(event)
        }

        localConnection.oniceconnectionstatechange = function (event) {
            if (localConnection.iceConnectionState === "failed" || localConnection.iceConnectionState === "disconnected") {
                console.error("ICE Connection failed or disconnected", event);
            }
        };

        localConnection.onicecandidate = event => {
            let cand = event.candidate;
            if (cand && cand.candidate && cand.candidate.length > 0) {
                console.log(cand)
                wsSignaling.send(JSON.stringify({type: "ice", ice: cand}));
            }
        }

        localConnection.createOffer().then(offer => localConnection.setLocalDescription(offer)).then(() => {
            wsSignaling.send(JSON.stringify(localConnection.localDescription))
        });
    }


    /**
     * Starts ping test via WEB RTC
     * @returns {Promise<void>}
     */
    async #startTest() {
        allPing.clear();
        for (let i = 1; i <= LatencyWEBRTC.PING_RETRY_COUNT; i++) {
            if (this.#isFinish) {
                dataChannel.close();
                return
            }
            allPing.set(i, new PingMessage(i));
        }

        this.sendMessage(1);
    }


    /**
     * Sends message via WEB RTC channel
     * @param id message's ID
     * @returns {Promise<void>}
     */
    async sendMessage(id) {
        let value = allPing.get(id);
        if (value === undefined) {
            await this.#dateHolder.sleepSeconds(5);
            dataChannel.close();
            localConnection.close();
            wsSignaling.close();
            this.#computeResults();
            return;
        }

        value.start = new Date().getTime();
        dataChannel.send(JSON.stringify(value));

        this.sendMessage(id + 1);
    }


    /**
     * Pings server
     */
    async #sendPing() {
        let servers = await this.#getIceServers();
        this.#iceServers = this.#createsICEServers(servers);

        wsSignaling = new WebSocket(this.#job.serverInfo.getServerSocketAddress() + LatencyWEBRTC.PING_PATH);

        wsSignaling.onopen = () => {
            this.#createLocalConnection();
        }

        wsSignaling.onmessage = e => {
            let mess = JSON.parse(e.data);

            switch (mess.type){
                case 'answer':
                    localConnection.setRemoteDescription(new RTCSessionDescription(mess));
                    break;

                case 'ice':
                    localConnection.addIceCandidate(mess.ice);
                    break;
            }
        }

        wsSignaling.onclose = () => {
            console.log('signaling WEB socket closed');
        }

    }


    /**
     * Calculates latency results
     */
    async #computeResults() {
        let sum = 0,
            arr = "",
            failed = 0,
            late = 0;

        allPing.forEach(ping => {
            if (!ping.success) {
                failed += 1;
            }
        })

        this.#allPing.forEach(element => {
            sum += element;

            if (arr.length !== 0) {
                arr = arr + ", " + element;
            } else {
                arr = arr + element;
            }

            if (element > LatencyWEBRTC.PING_LATE_TIMEOUT) {
                late += 1;
            }
        });

        this.#ping = (sum / (this.#allPing.length)).toFixed(1);
        this.#lost = ((failed / this.#allPing.length) * 100).toFixed(1)

        this.#setIsFinish(true);
    }


    async #getIceServers() {
        return new Promise(function (resolve, reject) {
            let xmlHttp = new XMLHttpRequest();
            xmlHttp.open('GET', getLocationAddress() + LatencyWEBRTC.GET_ICE_SERVERS, true);

            xmlHttp.onload = () => {
                if (xmlHttp.status === HttpCodes.success) {
                    resolve(JSON.parse(xmlHttp.responseText));
                } else {
                    reject('cant get ICE servers');
                }
            };

            xmlHttp.onerror = () => {
                reject('cant get ICE servers');
            };

            xmlHttp.ontimeout = () => {
                reject('cant get ICE servers');
            }

            xmlHttp.send();
        });
    }


    /**
     * Sets isFinish value
     * @param {Boolean} value contains isFinish value
     */
    #setIsFinish(value) {
        this.#isFinish = value;
    }

    #createsICEServers(servers) {
        let iceServers = [];
        servers.forEach(v => {
            if (v.type === 'stun') {
                iceServers.push({
                    urls: v.type + ':' + v.address + ':' + v.port,
                })
            }

            if (v.type === 'turn') {
                iceServers.push({
                    urls: v.type + ':' + v.address + ':' + v.port,
                    username:   v.username,
                    credential: v.password,
                })
            }
        })

        return iceServers;
    }


    /**
     * Makes latency test to needed server
     * @param {Job} job contains current job
     */
    async doTest(job) {
        this.#job = job;

        this.#ping = null;
        this.#allPing = [];
        this.#setIsFinish(false);
        wsSignaling = null;
        localConnection = null;
        dataChannel = null;
        allPing.clear();
        isConnected = false;

        this.#sendPing();
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
        return this.#ping;
    }


    /**
     * Returns all ping value
     * @returns {*}
     */
    getAllPing() {
        return this.#allPing;
    }


    getLost() {
        return this.#lost;
    }

    getReport() {
        return new LatencyResultDetail(
            parseFloat(format(this.#ping)),
            this.#allPing,
            null,
            null,
            parseFloat(this.#lost),
        );
    }


    /**
     * Returns WEB RTC support
     * @returns {*}
     */
    getWEBRTCSupport() {
        return this.#webRTCSupport;
    }
}


/**
 * Describes WEB RTC ping message
 */
class PingMessage {
    id;
    start;
    end;
    success;


    constructor(id) {
        this.id = id;
        this.success = false;
    }
}