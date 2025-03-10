class DateHolder {
    static GET_SERVER_DATE_PATH = '/get_server_time';

    static CLOCK_REFRESH_TIMEOUT = 500;
    static TAIPEI_TIME_ZONE_OFFSET = 8;

    #serverTimeOffset;
    #timeZoneOffset = 0;

    #currentClock = '';


    constructor() {
        this.#serverTimeOffset = null;
        this.#getServerTime();
        this.#setTimeZoneOffset();
        this.#clock();
    }


    /**
     * Gets current client's datetime string
     * Run every 500 milliseconds
     * @returns {Promise<void>}
     */
    async #clock() {
        this.#currentClock = this.getCurrentDateTimeClient();

        await this.sleep(DateHolder.CLOCK_REFRESH_TIMEOUT);

        this.#clock();
    }


    /**
     * Gets WEB server's time
     * Computes and sets server's time offset
     */
    #getServerTime() {
        let clientTimestamp = Date.parse(new Date().toString());

        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open('GET', getLocationAddress() + DateHolder.GET_SERVER_DATE_PATH, true);

        xmlHttp.onload = () => {
            if (xmlHttp.readyState === xmlHttp.DONE && xmlHttp.status === HttpCodes.success) {
                let serverTimestamp = xmlHttp.responseText,
                    clientTimestampCurrent = Date.parse(new Date().toString());
                clientTimestamp = (clientTimestamp + clientTimestampCurrent) / 2;
                this.#serverTimeOffset = serverTimestamp - clientTimestamp;
            }
        };

        xmlHttp.send();
    }


    /**
     * Sets time zone offset if time zone is unknown in browser
     */
    #setTimeZoneOffset() {
        if (Intl.DateTimeFormat().resolvedOptions().timeZone === 'Etc/Unknown') {
            this.#timeZoneOffset = DateHolder.TAIPEI_TIME_ZONE_OFFSET;
        }
    };


    /**
     * Parses month from date object
     * @param date for parsing
     * @returns {string} month in format [01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11, 12]
     */
    #getCurrentMonth(date) {
        let month = date.getMonth() + 1;
        if (month >= 10) {
            return month.toString();
        }

        return '0' + month;
    }


    /**
     * Parses day number from date object
     * @param date for parsing
     * @returns {string} day number in format [01, 02, 10, 11, 20, 21, 30, 31]
     */
    #getCurrentDay(date) {
        let day = date.getDate();
        if (day >= 10) {
            return day.toString();
        }

        return '0' + day;
    }


    /**
     * Parses date string from date object
     * @param date for parsing
     * @returns {string} date string in format [YYYY-MM-DD]
     */
    #getCurrentDate(date) {
        return date.getFullYear() + '-' + this.#getCurrentMonth(date) + '-' + this.#getCurrentDay(date);
    }


    /**
     * Parses hours from date object
     * @param date for parsing
     * @returns {string} hours in format [01, 02, 10, 11, 20, 21]
     */
    #getCurrentHours(date) {
        let hours = date.getHours();
        if (hours >= 10) {
            return hours.toString();
        }

        return '0' + hours;
    }


    /**
     * Parses minutes from date object
     * @param date for parsing
     * @returns {string} minutes in format [01, 02, 10, 11, 20, 21]
     */
    #getCurrentMinutes(date) {
        let minutes = date.getMinutes();
        if (minutes >= 10) {
            return minutes.toString();
        }

        return '0' + minutes;
    }


    /**
     * Parses seconds from date object
     * @param date for parsing
     * @returns {string} seconds in format [01, 02, 10, 11, 20, 21]
     */
    #getCurrentSeconds(date) {
        let seconds = date.getSeconds();
        if (seconds >= 10) {
            return seconds.toString();
        }

        return '0' + seconds;
    }


    /**
     * Parses time string from date object
     * @param date for parsing
     * @returns {string} time string in format [hh:mm:ss]
     */
    #getCurrentTime(date) {
        return this.#getCurrentHours(date) + ':' + this.#getCurrentMinutes(date) + ':' + this.#getCurrentSeconds(date);
    }


    /**
     * Awaits for needed delay
     * @param ms delay in milliseconds
     * @returns {Promise<unknown>}
     */
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }


    /**
     * Returns client's current date string with time zone offset
     * @returns {string} date string in format [YYYY-MM-DD]
     */
    getCurrentDateClient() {
        let now = new Date();
        now.setHours(now.getHours() + this.#timeZoneOffset);

        return this.#getCurrentDate(now);
    }


    /**
     * Returns client's current datetime string with time zone offset
     * @returns {string} datetime string in format [YYYY-MM-DD hh:mm:ss]
     */
    getCurrentDateTimeClient() {
        let now = new Date();
        now.setHours(now.getHours() + this.#timeZoneOffset);

        return this.#getCurrentDate(now) + ' ' + this.#getCurrentTime(now);
    }


    /**
     * Returns server's current datetime string with time zone offset
     * @returns {string} datetime string in format [YYYY-MM-DD hh:mm:ss]
     */
    getCurrentDateTimeServer() {
        let now = new Date();
        now.setMilliseconds(now.getMilliseconds() + this.#serverTimeOffset);

        return this.#getCurrentDate(now) + ' ' + this.#getCurrentTime(now);
    }


    /**
     * Returns server's current datetime string with time zone offset and delay
     * @param delay in seconds
     * @returns {string} datetime string in format [YYYY-MM-DD hh:mm:ss]
     */
    getCurrentDateTimeServerWithDelay(delay) {
        let now = new Date();
        now.setMilliseconds(now.getMilliseconds() + this.#serverTimeOffset);
        now.setSeconds(now.getSeconds() + delay);

        return this.#getCurrentDate(now) + ' ' + this.#getCurrentTime(now);
    }


    /**
     * Returns server's current datetime string with time zone offset
     * @returns {string} datetime string in ISO format [YYY-MM-DDTHH:mm:ss.sssZ ]
     */
    getCurrentDateTimeServerISO() {
        if (this.#serverTimeOffset == null) {
            return '';
        }

        let now = new Date();
        now.setMilliseconds(now.getMilliseconds() + this.#serverTimeOffset);
        now.setHours(now.getHours() - now.getTimezoneOffset() / 60);

        return now.toISOString();
    }


    /**
     * Returns server's current unix timestamp with time zone offset
     * @returns {number} unix timestamp
     */
    getCurrenTimestampServer() {
        let now = new Date();
        now.setMilliseconds(now.getMilliseconds() + this.#serverTimeOffset);

        return Date.parse(now.toString());
    }


    /**
     * Parses unix timestamp from sting datetime
     * @param string datetime for parsing
     * @returns {number} unix timestamp
     */
    parseTimestampFromString(string) {
        return Date.parse(new Date(string).toString());
    }


    /**
     * Awaits for needed delay
     * @param delay in seconds
     * @returns {Promise<void>}
     */
    async sleepSeconds(delay) {
        let target = new Date();
        target.setSeconds(target.getSeconds() + delay);

        while (true) {
            let diff = (target - new Date()) / 1000;
            if (diff < 0) {
                return;
            }

            await this.sleep(50);
        }
    }


    /**
     * Returns current client's datetime string
     * @returns {string} datetime string in format [YYYY-MM-DD hh:mm:ss]
     */
    getCurrentClock() {
        return this.#currentClock;
    }
}