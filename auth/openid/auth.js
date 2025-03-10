class OpenIDAuth {
    static CHECK_OPEN_ID_SUPPORT_PATH = '/check_open_id_support';
    static GET_OPEN_ID_LOGIN_URI_PATH = '/get_open_id_login_uri';

    static OPEN_ID_STATUS_ENABLE = true;
    static OPEN_ID_STATUS_DISABLE = false;

    #uiWorker;
    #dateHolder;

    #openIDSupport = null;


    constructor(uiWorker, dateHolder) {
        this.#uiWorker = uiWorker;
        this.#dateHolder = dateHolder;

        this.#checkOpenIdSupport();
        this.#setUISupport();
    }


    /**
     * Checks OpenID support
     * @returns {Promise<void>}
     */
    async #checkOpenIdSupport () {
        if (location.protocol !== 'https:') {
            this.#openIDSupport = OpenIDAuth.OPEN_ID_STATUS_DISABLE;

            return;
        }

        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open('GET', getLocationAddress() + OpenIDAuth.CHECK_OPEN_ID_SUPPORT_PATH, true);

        xmlHttp.onload = () => {
            if (xmlHttp.status === HttpCodes.success) {
                this.#openIDSupport = Boolean(JSON.parse(xmlHttp.responseText).openid_support);
            }
        }

        xmlHttp.onabort = () => {
            this.#openIDSupport = OpenIDAuth.OPEN_ID_STATUS_DISABLE;
        }

        xmlHttp.ontimeout = () => {
            this.#openIDSupport = OpenIDAuth.OPEN_ID_STATUS_DISABLE;
        }

        xmlHttp.onerror = () => {
            this.#openIDSupport = OpenIDAuth.OPEN_ID_STATUS_DISABLE;
        }

        xmlHttp.send();
    }


    /**
     * Gets OpenID auth URI from server
     * @returns {Promise<unknown>}
     */
    async #getLoginURI() {
        return new Promise((resolve, reject) => {
            let xmlHttp = new XMLHttpRequest();
            xmlHttp.open('GET', getLocationAddress() + OpenIDAuth.GET_OPEN_ID_LOGIN_URI_PATH, true);

            xmlHttp.onload = () => {
                resolve(xmlHttp.responseText);
            }

            xmlHttp.onabort = () => {
                reject('cant get openID login URI status='+xmlHttp.status);
            }

            xmlHttp.onerror = () => {
                reject('cant get openID login URI status='+xmlHttp.status)
            }

            xmlHttp.send();
        });
    }


    /**
     * Sets OpenID auth support on WEB UI (hides or shows OpenID button)
     * @returns {Promise<void>}
     */
    async #setUISupport() {
        while (this.#openIDSupport == null) {
            await this.#dateHolder.sleep(50);
        }

        if (this.#openIDSupport) {
            this.#uiWorker.enableOpenIDButton();
        }
    }


    /**
     * Auths via OpenID
     * @returns {Promise<unknown>}
     */
    async auth() {
        try {
            let res = await this.#getLoginURI();
            let loginInfo = JSON.parse(res);
            cookie.set('open_id_state', loginInfo.state);
            window.location.assign(loginInfo.login_uri);
        } catch (e) {
            console.log("can't auth via OpenID: ", e.message)
        }
    }
}