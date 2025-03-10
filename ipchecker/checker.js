class IPChecker {
    static GET_IP_PATH = '/getIp';
    static GET_CHECK_IP_CONFIG_PATH = '/getCheckIpConfig';

    static GET_IP_RETRY = 3;

    static processes = {
        getIPConfig: ' Getting configuration for checking public IP ',
        getPublicIP: ' Getting public IP addresses ',
    }

    #uiWorker = null;
    #trxAuthMaker = null;
    #logger = null;
    #dateHolder = null;
    #clientLogger = null;

    #checkIPConf;

    #isp = null;
    #publicIPv4 = null;
    #publicIPv6 = null;
    #favorServer = null;

    #failedIPv4 = 0;
    #failedIPv6 = 0;


    constructor(uiWorker, trxAuthMaker, logger, dateHolder, clientLogger) {
        this.#uiWorker = uiWorker;
        this.#trxAuthMaker = trxAuthMaker;
        this.#logger = logger;
        this.#dateHolder = dateHolder;
        this.#clientLogger = clientLogger;

        this.#setIPs();
    }


    /**
     * Sets public IPs to interface
     */
    #setIPs() {
        this.#getCheckIPConfig();
    }


    /**
     * Gets config for check client public IP addresses
     * @returns {Promise<void>}
     */
    async #getCheckIPConfig() {
        this.#logger.printToLog(ProcessStatus.starting + IPChecker.processes.getIPConfig + '...');

        let token = uuidv4();

        try {
            await this.#trxAuthMaker.trxAuth(getLocationAddress(), token);
        } catch (e) {
            this.#logger.printToLog(ProcessStatus.failed + IPChecker.processes.getIPConfig + ':' + e.message);
        }

        this.#clientLogger.addToLog(ClientLogger.LEVEL_INFO, 'getting check ip config')

        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open('GET', getLocationAddress() + IPChecker.GET_CHECK_IP_CONFIG_PATH + '?session=' + token,
            true);

        xmlHttp.onload = () => {
            if (xmlHttp.status === HttpCodes.success) {
                this.#parseCheckIPConfig(JSON.parse(xmlHttp.responseText));
                this.#logger.printToLog(ProcessStatus.success + IPChecker.processes.getIPConfig);
                this.#clientLogger.addToLog(ClientLogger.LEVEL_INFO, 'successfully get check ip config')
            }
        }

        xmlHttp.onerror = (e) => {
            this.#logger.printToLog(ProcessStatus.failed + IPChecker.processes.getIPConfig + ':' + e.message);
            this.#clientLogger.addToLog(
                ClientLogger.LEVEL_ERROR,
                'cant get check ip config: status=' + xmlHttp.status + ' error=' + xmlHttp.responseText,
            );
        }

        xmlHttp.ontimeout = (e) => {
            this.#logger.printToLog(ProcessStatus.failed + IPChecker.processes.getIPConfig + ':' + e.message);
            this.#clientLogger.addToLog(
                ClientLogger.LEVEL_ERROR,
                'cant get check ip config: request timeout',
            );
        }

        xmlHttp.onabort = (e) => {
            this.#clientLogger.addToLog(
                ClientLogger.LEVEL_ERROR,
                'cant get check ip config: request aborted',
            );
            this.#logger.printToLog(ProcessStatus.failed + IPChecker.processes.getIPConfig + ':' + e.message);
        }

        xmlHttp.send();
    }


    /**
     * Parses config from server and creates checkIPCong object
     * @param configJSON JSON parsed config
     */
    #parseCheckIPConfig(configJSON) {
        let serversIPv4 = [];

        configJSON.servers_for_ipv4.forEach(s => {
            serversIPv4.push(new CheckIPServer(s.proto, s.ip, s.port));
        });

        let serversIPv6 = [];

        configJSON.servers_for_ipv6.forEach(s => {
            serversIPv6.push(new CheckIPServer(s.proto, s.ip, s.port));
        });

        this.#checkIPConf = new CheckIPConf(serversIPv4, serversIPv6);
        this.#getPublicIPAddress();
    }


    /**
     * Gets public IPv4 and IPv6 addresses
     * @returns {Promise<void>}
     */
    async #getPublicIPAddress() {
        this.#logger.printToLog(ProcessStatus.starting + IPChecker.processes.getPublicIP + '...');

        this.#clientLogger.addToLog(
            ClientLogger.LEVEL_INFO,
            'starting get public ip addresses',
        );

        this.#checkIPConf.ip4Servers.forEach(s => {
            this.#getIPv4Address(1, s)
        })

        this.#checkIPConf.ip6Servers.forEach(s => {
            this.#getIPv6Address(1, s)
        })
    }

    async #getIPv4Address(retryNumber, checkIPServer) {
        try {
            this.#clientLogger.addToLog(
                ClientLogger.LEVEL_INFO,
                'trying to get IPv4 address',
            );
            let token = uuidv4();
            await this.#trxAuthMaker.trxAuth(checkIPServer.getServerLocation(), token);

            let result = await this.#getIp(checkIPServer.getServerLocation(), token);

            if (this.#publicIPv4 !== null) {
                return
            }

            if (result.ip == null && retryNumber < IPChecker.GET_IP_RETRY) {
                this.#getIPv4Address(retryNumber + 1, checkIPServer)

                return
            }

            this.#publicIPv4 = result.ip;

            this.#clientLogger.addToLog(
                ClientLogger.LEVEL_INFO,
                'successfully get IPv4 address: ' + this.#publicIPv4,
            );

            if (result.info) {
                if (result.info.whois !== null) {
                    this.#isp = result.info.whois.isp;
                }

                if (result.info.tanet !== null) {
                    this.#isp = result.info.whois.isp;
                }
            }
            if(this.#favorServer == '' || this.#favorServer === null) {
                this.#favorServer = result.favor_server;
            }
            if (this.#uiWorker !== null) {
                this.#uiWorker.setIPAddresses(IPStacks.ipV4, this.#publicIPv4, this.#isp);
            }
        } catch (e) {
            this.#failedIPv4 += 1;

            if (this.#failedIPv4 === this.#checkIPConf.ip4Servers.length && this.#uiWorker !== null) {
                this.#uiWorker.setIPAddresses(IPStacks.ipV4, this.#publicIPv4, this.#isp);
                this.#logger.printToLog('IPv4 environment not available');
            }

            this.#clientLogger.addToLog(
                ClientLogger.LEVEL_ERROR,
                'cant get public IPv4: ' + e.message,
            );
        }
    }

    async #getIPv6Address(retryNumber, checkIPServer) {
        try {
            this.#clientLogger.addToLog(
                ClientLogger.LEVEL_INFO,
                'trying to get IPv6 address',
            );

            let token = uuidv4();
            await this.#trxAuthMaker.trxAuth(checkIPServer.getServerLocation(), token);

            let result = await this.#getIp(checkIPServer.getServerLocation(), token);

            if (this.#publicIPv6 !== null) {
                return
            }

            if (result.ip == null && retryNumber < IPChecker.GET_IP_RETRY) {
                this.#getIPv6Address(retryNumber + 1, checkIPServer)

                return
            }

            this.#publicIPv6 = result.ip;

            this.#clientLogger.addToLog(
                ClientLogger.LEVEL_INFO,
                'successfully get IPv6 address: ' + this.#publicIPv6,
            );

            if (result.info && this.#isp == null) {
                if (result.info.whois !== null) {
                    this.#isp = result.info.whois.isp;
                }

                if (result.info.tanet !== null) {
                    this.#isp = result.info.whois.isp;
                }
            }

            if(this.#favorServer == '' || this.#favorServer === null) {
                this.#favorServer = result.favor_server;
            }

            if (this.#uiWorker !== null) {
                this.#uiWorker.setIPAddresses(IPStacks.ipV6, this.#publicIPv6, this.#isp);
            }
        } catch (e) {
            this.#failedIPv6 += 1;

            if (this.#failedIPv6 === this.#checkIPConf.ip6Servers.length && this.#uiWorker !== null) {
                this.#uiWorker.setIPAddresses(IPStacks.ipV6, this.#publicIPv6, this.#isp);
                this.#logger.printToLog('IPv6 environment not available');
            }

            this.#clientLogger.addToLog(
                ClientLogger.LEVEL_ERROR,
                'cant get public IPv6: ' + e.message,
            );
        }
    }

    /**
     * Returns client public IP address
     * @param serverAddress for get public IP
     * @param token auth token
     * @returns {Promise<unknown>}
     */
    async #getIp(serverAddress, token) {
        return new Promise(function (resolve) {
            let xmlHttp = new XMLHttpRequest();
            xmlHttp.open('GET', serverAddress + IPChecker.GET_IP_PATH + '?session=' + token, true);

            xmlHttp.onload = () => {
                if (xmlHttp.status === HttpCodes.success) {
                    if (xmlHttp.responseText.toLocaleLowerCase().indexOf('error') !== -1) {
                        resolve({ip: null, isp: {isp: null}});
                    }

                    resolve(JSON.parse(xmlHttp.responseText));
                } else {
                    resolve({ip: null, isp: {isp: null}});
                }
            };

            xmlHttp.onerror = (error) => {
                resolve({ip: null, isp: {isp: null}});
            };

            xmlHttp.timeout = 3000;

            xmlHttp.send();
        });
    }


    /**
     * Returns user public IPv4
     * @returns {null}
     */
    getPublicIPv4() {
        return this.#publicIPv4;
    }


    /**
     * Returns user public IPv6
     * @returns {null}
     */
    getPublicIPv6() {
        return this.#publicIPv6;
    }

    getFavourServer() {
        return this.#favorServer;
    }

    /**
     * Returns which ip type support
     * 4 = v4 support, 6 = v6 support, 10 = v4,v6 support
     * @returns {number}
     */
    getIPTypeSupport() {
        let ipV4Support = 0;
        if (this.getPublicIPv4() != null) {
            ipV4Support = IPVersionTypes.ipV4;
        }

        let ipV6Support = 0;
        if (this.getPublicIPv6() != null) {
            ipV6Support = IPVersionTypes.ipV6;
        }

        return ipV4Support + ipV6Support;
    }
}


/**
 * Describes check IP config structure
 */
class CheckIPConf {
    ip4Servers;
    ip6Servers;


    constructor(ip4Servers, ip6Servers) {
        this.ip4Servers = ip4Servers;
        this.ip6Servers = ip6Servers;
    }
}


/**
 * Describes check IP server structure
 */
class CheckIPServer {
    proto;
    host;
    port;


    constructor(proto, host, port) {
        this.proto = proto;
        this.host = host;
        this.port = port;
    }


    /**
     * Returns server location for check IP
     * @returns {string}
     */
    getServerLocation() {
        return this.proto + '://' + this.host + ':' + this.port;
    }
}
