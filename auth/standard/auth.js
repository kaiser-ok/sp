class Auth {
    static AUTH_MASTER_PATH = '/session/authmaster';

    static STATUS_AUTHENTICATED = 'authenticated';
    static STATUS_UNAUTHORIZED = 'unauthorized';

    /**
     * Auths on server via internal login/password
     * @param username
     * @param password
     * @returns {Promise<void>}
     */
    async auth(username, password) {
        return new Promise((resolve, reject) => {
            let xmlHttp = new XMLHttpRequest();
            xmlHttp.open('GET', getLocationAddress() + Auth.AUTH_MASTER_PATH, true);
            xmlHttp.setRequestHeader("Authorization", "Basic " + toBase64(username, password));

            xmlHttp.onload = () => {
                switch (xmlHttp.status) {
                    case HttpCodes.success:
                        if (xmlHttp.responseText === Auth.STATUS_AUTHENTICATED) {
                            cookie.set(Cookie.KEY_BASIC_AUTH, toBase64(username, password), 90 * Cookie.TTL_DAY);
                            resolve(Auth.STATUS_AUTHENTICATED);
                        } else {
                            reject(Auth.STATUS_UNAUTHORIZED);
                        }
                        break;

                    case HttpCodes.unauthorized:
                        reject(Auth.STATUS_UNAUTHORIZED);
                        break;

                    default:
                        break;
                }
            };

            xmlHttp.send();
        });
    }
}