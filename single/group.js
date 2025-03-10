class Group {
    static OWNER_OPEN = 1;
    static OWNER_STANDARD = 0;

    static GROUP_CLIENT_SIMPLE_PATH = '/simplegroup/client';
    static SHARE_GROUP_SIMPLE_PATH = '/simplegroup/share';

    static SESSION_NEW = 'new';
    static SESSION_OLD = 'old';

    static AUTH_STANDARD = 'standard';
    static AUTH_OPEN_ID = 'openid';

    #authMaker;
    #openIDAuthMaker;
    #sessionChecker;
    #singleWorker;

    #redirect = true;


    constructor(authMaker, openIDAuthMaker, sessionChecker, singleWorker) {
        this.#authMaker = authMaker;
        this.#openIDAuthMaker = openIDAuthMaker;
        this.#sessionChecker = sessionChecker;
        this.#singleWorker = singleWorker;
    }


    /**
     * Goes to share session mode
     * @param username username of admin
     * @param owner type standard or OpenID
     * @returns {Promise<void>}
     */
    async goToShareSession(username, owner) {
        try {
            let checkSession = await this.#sessionChecker.checkSession(username, owner);
            if (checkSession.exist && checkSession.info.error !== "group doesn't exist") {
                I('popup-session__old__group__label').innerText = currentLanguage.popup__session__old__group__label
                    + checkSession.info.id;
                I('popup-session__confirm').onclick = () => {
                    this.#connectExisting(checkSession.info.id, owner);
                }
                popupOpen(I('popup-session'));
            } else {
                await this.#onCheckSessionExistConfirm(owner);
            }
        } catch (error) {
            console.log('cant go to the share session: ', error)
        }
    }


    /**
     * Process user's answer when group ia already exists
     * @param id group ID
     * @param owner owner type
     * @returns {Promise<void>}
     */
    async #connectExisting(id, owner) {
        switch (document.querySelector('input[name="session"]:checked').value) {
            case Group.SESSION_NEW:
                this.#onCheckSessionExistConfirm(owner);
                break;

            case Group.SESSION_OLD:
                this.#goToGroup(id, owner);
                break;
        }
    }


    /**
     * Computes check session result
     * @param owner type standard or OpenID
     * @returns {Promise<void>}
     */
    async #onCheckSessionExistConfirm(owner) {
        let res;

        try {
            res = await this.#sessionChecker.createSession(owner);
        } catch (e) {
            console.log('cant create new group')
        }

        cookie.set(Cookie.KEY_SESSION_EXPIRING_TIME, res.expiringTime, 90 * Cookie.TTL_MINUTE);

        this.#goToGroup(res.id, owner)
    }


    /**
     * Redirects user to the group admin page
     * @param id group ID
     * @param owner owner type
     * @returns {Promise<void>}
     */
    async #goToGroup(id, owner) {
        window.location.assign(getLocationAddress() + Group.SHARE_GROUP_SIMPLE_PATH
            + '?sessionid=' + id + '&owner=' + owner);
    }


    /**
     * Goes to group client page
     * @param sessionId group ID
     * @returns {Promise<void>}
     */
    async #goToGroupClient(sessionId) {
        window.location.assign(getLocationAddress() + Group.GROUP_CLIENT_SIMPLE_PATH + '?sessionid=' + sessionId);
    }


    /**
     * Starts process of switching to group master mode
     * @param authType type standard or OpenID
     * @param username username of group admin
     * @param password password of group admin
     * @returns {Promise<void>}
     */
    async becomeAMaster(authType, username, password) {

        try {
            switch (authType) {

                case Group.AUTH_STANDARD:
                    await this.#authMaker.auth(username, password);
                    await cookie.set(Cookie.KEY_STANDARD_AUTH, username, 90 * Cookie.TTL_DAY);
                    if (this.#redirect) {
                        location.reload();
                    } else {
                        this.#singleWorker.uploadMemo(I('memo__input').value, Group.OWNER_STANDARD);
                        this.#redirect = true;
                        popupClose(I('popup-login'));
                    }
                    break;

                case Group.AUTH_OPEN_ID:
                    await this.#openIDAuthMaker.auth();
                    if (this.#redirect) {
                        cookie.set(Cookie.KEY_OPEN_ID_INFO, JSON.stringify({is_single: false}), 90 * Cookie.TTL_DAY);
                    } else {
                        cookie.set(Cookie.KEY_MEMO, I('memo__input').value, 90 * Cookie.TTL_DAY);
                        cookie.set(Cookie.KEY_OPEN_ID_INFO, JSON.stringify({is_single: true}), 90 * Cookie.TTL_DAY);
                        this.#redirect = true;
                        popupClose(I('popup-login'));
                    }
                    break;

                default:
                    break;
            }
        } catch (e) {
            openInfoPopup(currentLanguage.mess__login__failed);
        }
    }


    /**
     * Joins client to group test
     * @param sessionID group ID
     * @returns {Promise<void>}
     */
    async joinToGroup(sessionID) {
        this.#goToGroupClient(sessionID);
    }


    /**
     * Disables redirect to admin page after login
     * @returns {Promise<void>}
     */
    async disableRedirect() {
        this.#redirect = false;
    }
}
