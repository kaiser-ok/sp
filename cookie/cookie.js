class Cookie {
    static KEY_BASIC_AUTH = 'basic_auth';
    static KEY_STANDARD_AUTH = 'user_name';
    static KEY_OPEN_ID_INFO = 'open_id_info';
    static KEY_MEMO = 'memo';
    static KEY_INFO = 'info';
    static KEY_OPEN_ID_STATE = 'open_id_state';
    static KEY_SINGLE_TEST_RESULT = 'single_test_result';
    static KEY_SESSION_EXPIRING_TIME = 'session_expiring_time';
    static KEY_CLIENT_ID = 'client_id';
    static TTL_DAY = 1440;
    static TTL_MINUTE = 1;
    static TTL_HOUR = 60;


     /**
      * Sets a cookie with the given name, value, and expiration time.
      *
      * @param {string} name - The name of the cookie.
      * @param {string} value - The value of the cookie.
      * @param {number} minutes - The number of minutes until the cookie expires.
      * @returns {void}
      */
     set(name, value, minutes) {
        try {
            let expires = "";
            if (minutes) {
                let date = new Date();
                date.setTime(date.getTime() + (minutes * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + (value || "") + expires + "; path=/";
        } catch (error) {
            console.log(error);
        }
    }

     /**
      * Deletes the specified cookie.
      *
      * @param {string} name - The name of the cookie to be deleted.
      * @return {void}
      */
     delete(name) {
        try {
            document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Retrieves the value of the cookie with the specified name.
     *
     * @param {string} name - The name of the cookie to retrieve the value from.
     * @return {string|null} - The value of the cookie if found, otherwise null.
     */
    get(name) {
        let nameEQ = name + "=";
        let ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
}