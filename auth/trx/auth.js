class TrxAuth {
    static AUTHORIZATION_PATH = '/auth';

    static TRX_AUTHORIZATION_TIMEOUT = 3000; //3 seconds

    static AUTH_SUCCESS_TEXT = 'Ok';


    /**
     * Does authorization to server
     * @param {*} serverAddress Contains an address of a speed test server.
     * @param {*} token Contains a session uuid
     * @returns Returns an array with authorization results.
     */
    async trxAuth(serverAddress, token) {
        return new Promise(function (resolve, reject) {
            let xmlHttp = new XMLHttpRequest();
            xmlHttp.open('GET', serverAddress + TrxAuth.AUTHORIZATION_PATH + '?session=' + token, true);
            xmlHttp.timeout = TrxAuth.TRX_AUTHORIZATION_TIMEOUT;

            xmlHttp.onload = () => {
                if (xmlHttp.status === HttpCodes.success) {
                    if (xmlHttp.responseText === TrxAuth.AUTH_SUCCESS_TEXT) {
                        resolve({
                            token: token,
                            isSuccess: true,
                        });
                    }
                } else {
                    reject('cant auth on the server status code=' + xmlHttp.status);
                }
            };

            xmlHttp.onerror = () => {
                reject('cant auth on the server');
            };

            xmlHttp.ontimeout = () => {
                reject('cant auth on the server');
            }

            xmlHttp.send();
        });
    }
}