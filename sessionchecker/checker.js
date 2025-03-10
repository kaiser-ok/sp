class SessionChecker {
    static SIMPLE_GROUP_EXIST_PATH = '/simplegroup/exist';
    static CREATE_GROUP_SIMPLE_PATH = '/simplegroup/create';

    constructor() {
    }
    /**
     * Checks group existing
     * @param username - username of group admin
     * @param owner - group admin type - standard or OpenID
     * @returns {Promise<unknown>}
     */
    async checkSession(username, owner) {
        return new Promise(function (resolve, reject) {
            let isExist = false,
                info = {},
                xmlHttp = new XMLHttpRequest(),
                masterName = MD5(username);

            xmlHttp.open('GET', getLocationAddress() + SessionChecker.SIMPLE_GROUP_EXIST_PATH
                + '?master=' + masterName + '&owner=' + owner, true);

            xmlHttp.onload = () => {
                if (xmlHttp.status === HttpCodes.success) {
                    if (!xmlHttp.responseText.includes('not exist')) {
                        isExist = true;
                        info = JSON.parse(xmlHttp.responseText);
                    }
                    resolve({exist: isExist, info: info});
                } else {
                    reject(xmlHttp.status);
                }
            };

            xmlHttp.onerror = (error) => {
                reject(error);
            };

            xmlHttp.send();
        });
    }


    /**
     * Creates new group
     * @param owner - group admin type - standard or OpenID
     * @returns {Promise<unknown>}
     */
    async createSession(owner) {
        return new Promise(function (resolve, reject) {
            let xmlHttp = new XMLHttpRequest();
            xmlHttp.open('GET', getLocationAddress() + SessionChecker.CREATE_GROUP_SIMPLE_PATH
                + '?owner=' + owner, true);
            xmlHttp.setRequestHeader("Authorization", "Basic " + cookie.get(Cookie.KEY_BASIC_AUTH));

            xmlHttp.onload = () => {
                switch (xmlHttp.status) {
                    case HttpCodes.success:
                        resolve(JSON.parse(xmlHttp.responseText));
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

}
