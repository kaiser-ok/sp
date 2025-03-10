class ConfigChecker {
    static GET_CONFIG_PATH = '/getConfig';


    /**
     * Returns server config for speed test
     * @param serverAddress TRX server address
     * @param token auth token
     * @returns {Promise<unknown>}
     */
    async getSpeedTestConfig(serverAddress, token, testID) {
        return new Promise(resolve => {
            let xmlHttp = new XMLHttpRequest();
            xmlHttp.open('GET', serverAddress + ConfigChecker.GET_CONFIG_PATH +
                '?session=' + token +
                '&test_id=' + testID, true);

            xmlHttp.onload = () => {
                if (xmlHttp.status === HttpCodes.success) {
                    let config = (JSON.parse(xmlHttp.responseText));
                    resolve(new SpeedTestConfig(config.time_limit, config.download_limit, config.upload_limit));
                }
            }

            xmlHttp.onerror = (err) => {
                console.log('Cant get check IP config: ', err)
                resolve(new SpeedTestConfig(21, 1000000000, 1000000000));
            }

            xmlHttp.send();
        })
    }
}