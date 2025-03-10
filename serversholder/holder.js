class ServersHolder {
    static GET_SERVERS_PATH = '/getServers';
    static SERVER_SHOW = "on"

    static IPV6_SERVER_PREFIX = '66';

    #trxAuthMaker;
    #uiWorker;

    #serversList;

    #ipChecker;
    #dateHolder;

    constructor(trxAuthMaker, uiWorker, ipChecker, dateHolder) {
        this.#trxAuthMaker = trxAuthMaker;
        this.#uiWorker = uiWorker;
        this.#ipChecker = ipChecker;
        this.#dateHolder = dateHolder;

        this.#serversList = new Map();

        this.#loadServers();
    }


    /**
     * Gets speed test servers list from WEB server
     * @param token for auth
     * @returns {Promise<unknown>}
     */
    async #getServers(token) {
        return new Promise(function (resolve, reject) {
            let xmlHttp = new XMLHttpRequest();
			
            xmlHttp.open('GET', getLocationAddress() + ServersHolder.GET_SERVERS_PATH + '?session=' + token,
                true);

            xmlHttp.onload = () => {
                if (xmlHttp.status === HttpCodes.success) {
                    if (xmlHttp.responseText !== '') {
                        resolve(xmlHttp.responseText);
                    } else {
                        console.log('Servers list is empty');
                        reject();
                    }
                } else {
                    reject(xmlHttp.status);
                }
            };

            xmlHttp.onerror = (err) => {
                reject(err);
            }

            xmlHttp.send();
        });
    }


    /**
     * Loads TRX servers list from WEB server
     * @returns {Promise<void>}
     */
    async #loadServers() {
        let token = uuidv4();

        try {
            await this.#trxAuthMaker.trxAuth(getLocationAddress(), token);
        } catch (err) {
            console.log('cant load TRX servers list: cant auth on WEB server: ', err)
        }

        let result = '';
        try {
            result = await this.#getServers(token);
        } catch (err) {
            console.log('cant load TRX servers list: cant get servers list from WEB server: ', err)
            return
        }

        let serversResponse = JSON.parse(result);
		
        let servers = serversResponse['servers'];
		
        servers.forEach((server) => {
            if (server.show == ServersHolder.SERVER_SHOW) {
                if (!this.#serversList.has(server.id)) {
                    let trxServer = new TRXServer(server.level, server.name);
                    this.#serversList.set(server.id, trxServer);
                }

                let s = new SpeedTestServer(server.proto, server.ip, server.port, server.name, server.id);

                switch (server.ip_version) {
                    case IPStacks.ipV4:
                        this.#serversList.get(server.id).setV4Server(s);
                        break;

                    case IPStacks.ipV6:
                        this.#serversList.get(server.id).setV6Server(s);
                        break;
                }
            }
        });

        while (this.#ipChecker.getFavourServer() === null) {
            await this.#dateHolder.sleepSeconds(1);
        }

        if (this.#ipChecker.getFavourServer() !== "") {
            this.#serversList = this.#sortServers(this.#ipChecker.getFavourServer());
        }

        this.#uiWorker.createServerSelect(this.#serversList);
    }

    #sortServers(favorServer) {
        let m = new Map();
        let favorEntry;

        this.#serversList.forEach((v, k) => {
            if (v.name === favorServer) {
                favorEntry = [k, v];
            } else {
                m.set(k, v);
            }
        });

        const sortedMap = new Map();

        if (favorEntry) {
            sortedMap.set(favorEntry[0], favorEntry[1]);
        }

        m.forEach((value, key) => {
            sortedMap.set(key, value);
        });

        return sortedMap;
    }


    /**
     * Returns TRX V4 server by ID
     * @param id for search
     * @returns {*}
     */
    getServerV4ByID(id) {
        let trxServer = this.#serversList.get(Number(id));

        if (trxServer.ip4Server === undefined) {
            return null;
        }

        return new ServerInfo(trxServer.ip4Server.id, trxServer.ip4Server.host, trxServer.ip4Server.proto,
            trxServer.ip4Server.port, trxServer.ip4Server.name);
    }


    /**
     * Returns TRX V6 server by ID
     * @param id for search
     * @returns {*}
     */
    getServerV6ByID(id) {
        let trxServer = this.#serversList.get(Number(id));

        if (trxServer.ip6Server === undefined) {
            return null;
        }

        return new ServerInfo(trxServer.ip6Server.id, trxServer.ip6Server.host, trxServer.ip6Server.proto,
            trxServer.ip6Server.port, trxServer.ip6Server.name);
    }


    /**
     * Returns TRX server by ID
     * @param id for search
     * @returns {*}
     */
    getTRXServerByID(id) {
        return this.#serversList.get(Number(id));
    }
}

class TRXServer {
    level;
    name;
    ip4Server;
    ip6Server;

    constructor(level, name, ip4Server, ip6Server) {
        this.level = level;
        this.name = name;
        this.ip4Server = ip4Server;
        this.ip6Server = ip6Server;
    }

    setV4Server(server) {
        this.ip4Server = server;
    }

    setV6Server(server) {
        this.ip6Server = server;
    }
}


class SpeedTestServer {
    proto;
    host;
    port;
    name;
    id;

    constructor(proto, host, port, name, id) {
        this.proto = proto;
        this.host = host;
        this.port = port;
        this.name = name;
        this.id = id;
    }
    
    /**
     * Returns server location for speed test
     * @returns {string}
     */
    getServerLocation() {
        return this.proto + '://' + this.host + ':' + this.port;
    }

    /**
     * Returns socket address
     * @returns {string}
     */
    getServerSocketAddress() {
        let proto = "ws";
        if (this.proto === "https") {
            proto = "wss";
        }

        return proto + "://" + this.host + ":" + this.port;
    }

    toJSON() {
        return {
            proto: this.proto,
            ip: this.host,
            port: this.port,
            name: this.name,
            id: this.id,
        }
    }
}
