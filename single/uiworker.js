class SingleUIWorker {
    static HIGH_SPEED_LIMIT_AMOUNT = 2;

    #languageSelect = I('language__select');
    #theadNumberSelect = I('thread-number__select');
    #serversSelect = I('server__select');
    #serversSelectSource = I('server__select_start');
    #serversSelectTarget = I('server__select_end');
    #speedLimitSelect = I('speed__limit__select');
    #serversSelectSourceURL = I('server__select_web_start');
    #targetURL = I('server__select_website');
    #clock = I('client__clock');
    #isp4 = I('isp4');
    #isp6 = I('isp6');
    #ip4 = I('public__ipv4');
    #ip6 = I('public__ipv6');
    #testResultsBlock = I('test__results');
    #testParamsBlock = I('test__params');
    #pleaseWaitButton = I('btn-wait');
    #startButton = I('btn-start');

    #dateHolder = null;

    constructor(dateHolder) {
        this.#dateHolder = dateHolder;
        this.#createDefaultChoices();
    }


    /**
     * Updates clock on the page every second
     * @returns {Promise<void>}
     */
    async setTestStartTime() {
        this.#clock.innerText = this.#dateHolder.getCurrentClock();
    }


    /**
     * Creates choices for HTML select
     * @returns {Promise<void>}
     */
    async #createDefaultChoices() {
        this.#createChoice(this.#languageSelect);
        this.#createChoice(this.#theadNumberSelect);
        this.#createChoice(this.#speedLimitSelect);
    }


    /**
     * Creates choices for element
     * @param element
     */
    #createChoice(element) {
        new Choices(element, {
            shouldSort: false,
            position: 'bottom',
            searchEnabled: false,
        });
    }


    /**
     * Clears ping test's results on WEB UI
     * @returns {Promise<void>}
     */
    async #clearPingResults() {
        for (let i = 1; i <= 20; i++) {
            I('p-' + IPStacks.ipV4.toLowerCase() + '-t' + i).innerText = '-';
            I('p-' + IPStacks.ipV6.toLowerCase() + '-t' + i).innerText = '-';
        }

        I('p-' + IPStacks.ipV4.toLowerCase() + '-min').innerText = '-';
        I('p-' + IPStacks.ipV6.toLowerCase() + '-min').innerText = '-';
        I('p-' + IPStacks.ipV4.toLowerCase() + '-max').innerText = '-';
        I('p-' + IPStacks.ipV6.toLowerCase() + '-max').innerText = '-';
        I('p-' + IPStacks.ipV4.toLowerCase() + '-var').innerText = '-';
        I('p-' + IPStacks.ipV6.toLowerCase() + '-var').innerText = '-';

        $('#test__results_s2w').find('*[data-clear]').each(function () {
            $(this).text($(this).attr('data-clear'))
        });

        $('#test__results_s2w').find('tr[data-temp="0"]').remove();
    }


    /**
     * Clears jitter test's results on WEB UI
     * @returns {Promise<void>}
     */
    async #clearJitterResults() {
        for (let i = 1; i <= 20; i++) {
            I('j-' + IPStacks.ipV4.toLowerCase() + '-t' + i).innerText = '-';
            I('j-' + IPStacks.ipV6.toLowerCase() + '-t' + i).innerText = '-';
        }

        I('j-' + IPStacks.ipV4.toLowerCase() + '-min').innerText = '-';
        I('j-' + IPStacks.ipV6.toLowerCase() + '-min').innerText = '-';
        I('j-' + IPStacks.ipV4.toLowerCase() + '-max').innerText = '-';
        I('j-' + IPStacks.ipV6.toLowerCase() + '-max').innerText = '-';
        I('j-' + IPStacks.ipV4.toLowerCase() + '-var').innerText = '-';
        I('j-' + IPStacks.ipV6.toLowerCase() + '-var').innerText = '-';
    }


    /**
     * Clears download test's results on WEB UI
     * @returns {Promise<void>}
     */
    async #clearDownloadResults() {
        for (let i = 1; i <= 20; i++) {
            I('d-' + IPStacks.ipV4.toLowerCase() + '-t' + i).innerText = '-';
            I('d-' + IPStacks.ipV6.toLowerCase() + '-t' + i).innerText = '-';
        }

        I('d-' + IPStacks.ipV4.toLowerCase() + '-min').innerText = '-';
        I('d-' + IPStacks.ipV6.toLowerCase() + '-min').innerText = '-';
        I('d-' + IPStacks.ipV4.toLowerCase() + '-max').innerText = '-';
        I('d-' + IPStacks.ipV6.toLowerCase() + '-max').innerText = '-';
        I('d-' + IPStacks.ipV4.toLowerCase() + '-var').innerText = '-';
        I('d-' + IPStacks.ipV6.toLowerCase() + '-var').innerText = '-';
    }


    /**
     * Clears upload test's results on WEB UI
     * @returns {Promise<void>}
     */
    async #clearUploadResults() {
        for (let i = 1; i <= 20; i++) {
            I('u-' + IPStacks.ipV4.toLowerCase() + '-t' + i).innerText = '-';
            I('u-' + IPStacks.ipV6.toLowerCase() + '-t' + i).innerText = '-';
        }

        I('u-' + IPStacks.ipV4.toLowerCase() + '-min').innerText = '-';
        I('u-' + IPStacks.ipV6.toLowerCase() + '-min').innerText = '-';
        I('u-' + IPStacks.ipV4.toLowerCase() + '-max').innerText = '-';
        I('u-' + IPStacks.ipV6.toLowerCase() + '-max').innerText = '-';
        I('u-' + IPStacks.ipV4.toLowerCase() + '-var').innerText = '-';
        I('u-' + IPStacks.ipV6.toLowerCase() + '-var').innerText = '-';
    }


    /**
     * Creates speed test servers select element
     * @param servers map
     * @returns {Promise<void>}
     */
    async createServerSelect(servers) {
        this.#createChoiseForServer(servers, this.#serversSelect, serverSelectChoice);
        this.#createChoiseForServer(servers, this.#serversSelectSource, serverSelectChoiceSource);
        this.#createChoiseForServer(servers, this.#serversSelectTarget, serverSelectChoiceTarget);
        this.#createChoiseForServer(servers, this.#serversSelectSourceURL, serverSelectChoiceSourceURL);
    }


    /**
     * Shows elements for IPv4 if stack is supported
     */
    async showIPv4Results() {
        I('down__value--ipv4').hidden = false;
        I('upl__value--ipv4').hidden = false;
        I('ping__value--ipv4').hidden = false;
        I('jit__value--ipv4').hidden = false;
        I('webrtc__value--ipv4').hidden = false;
        I('lost__value--ipv4').hidden = false;
        I('charts__ip_v4').classList.remove('hidden');
        $('div[data-id="ipv4"]').removeAttr('hidden');
    }


    /**
     * Hides elements for IPv4 if stack is not supported
     */
    async hideIPv4Results() {
        I('down__value--ipv4').hidden = true;
        I('upl__value--ipv4').hidden = true;
        I('ping__value--ipv4').hidden = true;
        I('jit__value--ipv4').hidden = true;
        I('webrtc__value--ipv4').hidden = true;
        I('lost__value--ipv4').hidden = true;
        I('charts__ip_v4').classList.add('hidden');
        $('div[data-id="ipv4"]').attr('hidden', 'hidden');
    }


    /**
     * Shows elements for IPv6 if stack is supported
     */
    async showIPv6Results() {
        I('ip__v6__title').hidden = false;
        I('down__value--ipv6').hidden = false;
        I('upl__value--ipv6').hidden = false;
        I('ping__value--ipv6').hidden = false;
        I('jit__value--ipv6').hidden = false;
        I('webrtc__value--ipv6').hidden = false;
        I('lost__value--ipv6').hidden = false;
        I('charts__title__ip_v6').hidden = false;
        I('charts__ip_v6').classList.remove('hidden');
        I('test__results__title__ip_v6').hidden = false;
        I('test__results__lat__ip_v6').classList.remove('hidden');
        I('test__results__speed__ip_v6').classList.remove('hidden');
        $('div[data-id="ipv6"]').removeAttr('hidden');
    }


    /**
     * Hides elements for IPv6 if stack is not supported
     */
    async hideIPv6Results() {
        I('ip__v6__title').hidden = true;
        I('down__value--ipv6').hidden = true;
        I('upl__value--ipv6').hidden = true;
        I('ping__value--ipv6').hidden = true;
        I('jit__value--ipv6').hidden = true;
        I('webrtc__value--ipv6').hidden = true;
        I('lost__value--ipv6').hidden = true;
        I('charts__title__ip_v6').hidden = true;
        I('charts__ip_v6').classList.add('hidden');
        I('test__results__title__ip_v6').hidden = true;
        I('test__results__lat__ip_v6').classList.add('hidden');
        I('test__results__speed__ip_v6').classList.add('hidden');
        $('div[data-id="ipv6"]').attr('hidden', 'hidden');
    }


    /**
     * Sets public IP addresses to interface
     * @returns {Promise<void>}
     */
    async setIPAddresses(type, ip, isp) {
        switch (type) {
            case IPStacks.ipV4:
                if (ip == null) {
                    I('public__ipv4__failed').classList.remove('hidden');
                } else {
                    this.#ip4.innerText = ip;
                    if (isp !== null) {
                        this.#isp4.innerText = ' (' + isp + ')';
                    }
                }
                this.#ip4.innerText = ip;
                this.#isp4.innerText = ' (' + isp + ')';
                break;
            case IPStacks.ipV6:
                if (ip == null) {
                    I('public__ipv6__failed').classList.remove('hidden');
                } else {
                    this.#ip6.innerText = ip;
                    if (isp !== null) {
                        this.#isp6.innerText = ' (' + isp + ')';
                    }
                }

                break;
        }
    }

    /**
     * Creates createChoiseForServer for element
     * @param servers
     */
    #createChoiseForServer(servers, selectElement, globalChoice) {
        const serversSelect = selectElement;

        if (!serversSelect) {
            return;
        }

        const parent = serversSelect.parentElement?.parentElement;

        if (!parent) {
            return;
        }

        const menu0 = parent.children[0];
        const menu1 = parent.children[1];

        if (!menu0 || !menu1) {
            return;
        }
        const offset = menu1.getBoundingClientRect();
        const leftValue = offset.left;
        const width = window.innerWidth;

        const width1 = 980;

        menu1.style.width = width1 + "px";
        menu1.style.marginTop = "3px";

        // Create container
        const container = document.createElement('div');

        // Create level-zone1
        const levelZone1 = document.createElement('div');
        levelZone1.classList.add('level-zone1');

        const eduDiv = document.createElement('div');
        eduDiv.setAttribute("id", "server__div__level__0")
        eduDiv.textContent = currentLanguage.server__div__level__0;
        levelZone1.appendChild(eduDiv);

        const ulLevel0 = document.createElement('ul');
        ulLevel0.setAttribute('data-level', '0');
        levelZone1.appendChild(ulLevel0);

        const mainNodeDiv = document.createElement('div');
        mainNodeDiv.setAttribute("id", "server__div__level__1")
        mainNodeDiv.textContent = currentLanguage.server__div__level__1;
        levelZone1.appendChild(mainNodeDiv);

        const ulLevel1 = document.createElement('ul');
        ulLevel1.setAttribute('data-level', '1');
        levelZone1.appendChild(ulLevel1);

        container.appendChild(levelZone1);

        // Create level-line1
        const levelLine11 = document.createElement('div');
        levelLine11.classList.add('level-line1');
        container.appendChild(levelLine11);

        // Create level-zone2
        const levelZone21 = document.createElement('div');
        levelZone21.classList.add('level-zone2');

        const localNetDiv = document.createElement('div');
        localNetDiv.setAttribute("id", "server__div__level__2")
        localNetDiv.textContent = currentLanguage.server__div__level__2;
        levelZone21.appendChild(localNetDiv);

        const ulLevel2 = document.createElement('ul');
        ulLevel2.setAttribute('data-level', '2');
        levelZone21.appendChild(ulLevel2);

        container.appendChild(levelZone21);

        // Create level-line1
        const levelLine12 = document.createElement('div');
        levelLine12.classList.add('level-line1');
        container.appendChild(levelLine12);

        // Create level-zone2
        const levelZone22 = document.createElement('div');
        levelZone22.classList.add('level-zone2');

        const eduNetDiv = document.createElement('div');
        eduNetDiv.setAttribute("id", "server__div__level__3")
        eduNetDiv.textContent = currentLanguage.server__div__level__3;
        levelZone22.appendChild(eduNetDiv);

        const ulLevel3 = document.createElement('ul');
        ulLevel3.setAttribute('data-level', '3');
        levelZone22.appendChild(ulLevel3);

        container.appendChild(levelZone22);

        servers.forEach((value, key) => {
            const option = document.createElement("option");
            option.value = key;
            option.innerHTML = value.name;
            serversSelect.appendChild(option);

            let levelName = "";
            let currentUl;

            switch (value.level) {
                case 0:
                    currentUl = ulLevel0
                    levelName = currentLanguage.server__div__level__0;
                    break;
                case 1:
                    currentUl = ulLevel1
                    levelName = currentLanguage.server__div__level__1;
                    break;
                case 2:
                    currentUl = ulLevel2
                    levelName = currentLanguage.server__div__level__2;
                    break;
                case 3:
                    currentUl = ulLevel3
                    levelName = currentLanguage.server__div__level__3;
                    break;
            }

            // Create <li>
            const li = document.createElement("li");
            li.setAttribute("data-level-id", value.level);
            li.setAttribute("data-level-name", levelName);
            li.setAttribute("data-item-value", key);
            li.setAttribute("data-item-name", value.name);

            // Create <span>
            const span = document.createElement("span");
            span.textContent = "●";

            // Create <div>
            const div = document.createElement("div");
            div.textContent = value.name;

            li.appendChild(span);
            li.appendChild(div);

            currentUl.appendChild(li)

        });

        const innerDiv = menu1.children[0]?.children[0];
        if (!innerDiv) {
            return;
        }

        innerDiv.style.display = "flex";
        innerDiv.style.flexWrap = "wrap";

        innerDiv.innerHTML = "";

        innerDiv.innerHTML = container.innerHTML;

        const targetLiElements = innerDiv.querySelectorAll("li");

        let loop = 0;
        targetLiElements.forEach(function (li) {
            li.addEventListener('click', function () {
                // 獲取點擊的 <li> 的 data-* 屬性
                const dataLevelName = li.getAttribute('data-level-name');
                const dataItemValue = li.getAttribute('data-item-value');
                const dataItemName = li.getAttribute('data-item-name');

                const menu0FirstDiv = menu0.children[1];
                if (menu0FirstDiv) {
                    menu0FirstDiv.textContent = dataItemName;
                }

                menu0.setAttribute("title", `${dataLevelName}-${dataItemName}`);

                serversSelect.value = dataItemValue;

                if (globalChoice && typeof globalChoice.hideDropdown === 'function') {
                    globalChoice.hideDropdown();
                }
            });

            if (loop == 0) {
                li.click();
            }
            loop++;
        });
        globalChoice.enable();

        if ($(serversSelect).attr('id')==='server__select_end'){
            const targetObj=$(serversSelect).parent().parent().find('ul[data-level="1"]').find('li:eq(0)');
            targetObj.click();
        }
    }

    /**
     * Returns index of current speed test server
     * @returns {*}
     */
    getTRXServerID() {
        return parseInt(this.#serversSelect.value);
    }

    /**
     * Returns index of current speed test server
     * @returns {*}
     */
    getSourceServerID() {
        switch (testMode) {
            case TestModes.SERVER_SERVER:
                return parseInt(this.#serversSelectSource.value);
            case TestModes.SERVER_URL:
                return parseInt(this.#serversSelectSourceURL.value);
        }
    }

    /**
     * Returns index of current speed test target server
     * @returns {*}
     */
    getTargetServerID() {
        return parseInt(this.#serversSelectTarget.value);
    }

    /**
     * Returns index of current speed test server
     * @returns {*}
     */
    getTargetURL() {
        return this.#targetURL.value;
    }

    /**
     * Returns thread number for test
     * @returns {number}
     */
    getThreadNumber() {
        return parseInt(this.#theadNumberSelect.value);
    }


    /**
     * Shows test params block
     */
    showTestParams() {
        this.#testParamsBlock.hidden = false;
    }


    /**
     * Hides test params block
     */
    hideTestParams() {
        this.#testParamsBlock.hidden = true;
    }


    /**
     * Shows test results block
     */
    async showTestResults() {
        if (testMode == TestModes.SERVER_URL) {
            $('#test__results_s2w').removeAttr('hidden');
            return;
        }

        this.#testResultsBlock.hidden = false;
    }


    /**
     * Hides test results block
     */
    async hideTestResults() {
        this.#testResultsBlock.hidden = true;
        $('#test__results_s2w').attr('hidden', 'hidden');
    }


    /**
     * Hides please wait button
     * @returns {Promise<void>}
     */
    async hidePleaseWaitButton() {
        this.#pleaseWaitButton.hidden = true;
    }


    /**
     * Shows please wait button
     * @returns {Promise<void>}
     */
    async showPleaseWaitButton() {
        this.#pleaseWaitButton.hidden = false;
    }

    /**
     * Hides start button
     * @returns {Promise<void>}
     */
    async hideStartButton() {
        this.#startButton.hidden = true;
    }


    /**
     * Shows start button
     * @returns {Promise<void>}
     */
    async showStartButton() {
        this.#startButton.hidden = false;
    }


    /**
     * Hides upload memo
     * @returns {Promise<void>}
     */
    async hideUploadMemo() {
        I('memo__input').value = '';
        I('test-memo').hidden = true;
    }


    /**
     * Shows upload memo
     * @returns {Promise<void>}
     */
    async showUploadMemo() {
        I('test-memo').hidden = false;
    }


    /**
     * Sets ping test results to table
     * @param ipStack - test's IP stack: IPv4 or IPv6
     * @param results - test's results
     * @param isFromCache - boolean variable, that indicates when results are taken from cache
     * @returns {Promise<void>}
     */
    async setPingResults(ipStack, results, isFromCache) {
        let endStr = '';

        let decimalNumber=-1;
        if (testMode === TestModes.SERVER_URL) {
            endStr = '_s2w'
            decimalNumber=1;
        }

        if (isFromCache) {
            results.all.forEach((value, key) => {
                I('p-' + ipStack.toLowerCase() + '-t' + (key + 1) + endStr).innerText = formatNumber(value, decimalNumber);
            })

            I('p-' + ipStack.toLowerCase() + '-min' + endStr).innerText = formatNumber(results.min, decimalNumber);
            I('p-' + ipStack.toLowerCase() + '-max' + endStr).innerText = formatNumber(results.max, decimalNumber);
            I('p-' + ipStack.toLowerCase() + '-var' + endStr).innerText = formatNumber(results.variance, decimalNumber);
        } else {
            results.forEach((value, key) => {
                I('p-' + ipStack.toLowerCase() + '-t' + (key + 1) + endStr).innerText = formatNumber(value, decimalNumber);
            })

            I('p-' + ipStack.toLowerCase() + '-min' + endStr).innerText = formatNumber(Math.min(...results), decimalNumber);
            I('p-' + ipStack.toLowerCase() + '-max' + endStr).innerText = formatNumber(Math.max(...results), decimalNumber);
            I('p-' + ipStack.toLowerCase() + '-var' + endStr).innerText =formatNumber( computeVariance(results, true), decimalNumber);
        }
    }


    /**
     * Sets ping webrtc test results to table
     * @param ipStack - test's IP stack: IPv4 or IPv6
     * @param results - test's results
     * @param isFromCache - boolean variable, that indicates when results are taken from cache
     * @returns {Promise<void>}
     */
    async setPingWEBRTCResults(ipStack, results, isFromCache) {
        if (isFromCache) {
            results.all.forEach((value, key) => {
                I('w-' + ipStack.toLowerCase() + '-t' + (key + 1)).innerText = value;
            })

            I('w-' + ipStack.toLowerCase() + '-min').innerText = results.min;
            I('w-' + ipStack.toLowerCase() + '-max').innerText = results.max;
            I('w-' + ipStack.toLowerCase() + '-var').innerText = results.variance;
        } else {
            results.forEach((value, key) => {
                I('w-' + ipStack.toLowerCase() + '-t' + (key + 1)).innerText = value;
            })

            I('w-' + ipStack.toLowerCase() + '-min').innerText = Math.min(...results);
            I('w-' + ipStack.toLowerCase() + '-max').innerText = Math.max(...results);
            I('w-' + ipStack.toLowerCase() + '-var').innerText = computeVariance(results, true);
        }
    }


    /**
     * Sets jitter test results to table
     * @param ipStack - test's IP stack: IPv4 or IPv6
     * @param results - test's results
     * @param isFromCache - boolean variable, that indicates when results are taken from cache
     * @returns {Promise<void>}
     */
    async setJitterResults(ipStack, results, isFromCache) {
        let endStr = '';

        let decimalNumber=-1;
        if (testMode === TestModes.SERVER_URL) {
            endStr = '_s2w'
            decimalNumber=1;
        }

        if (isFromCache) {
            results.all.forEach((value, key) => {
                I('j-' + ipStack.toLowerCase() + '-t' + (key + 1) + endStr).innerText = formatNumber(value, decimalNumber);
            })

            I('j-' + ipStack.toLowerCase() + '-min' + endStr).innerText = formatNumber(results.min, decimalNumber);
            I('j-' + ipStack.toLowerCase() + '-max' + endStr).innerText = formatNumber(results.max, decimalNumber);
            I('j-' + ipStack.toLowerCase() + '-var' + endStr).innerText = formatNumber(results.variance, decimalNumber);
        } else {
            results.forEach((value, key) => {
                I('j-' + ipStack.toLowerCase() + '-t' + (key + 1) + endStr).innerText = formatNumber(value, decimalNumber);
            })

            results.shift();

            I('j-' + ipStack.toLowerCase() + '-min' + endStr).innerText = formatNumber(Math.min(...results), decimalNumber);
            I('j-' + ipStack.toLowerCase() + '-max' + endStr).innerText = formatNumber(Math.max(...results), decimalNumber);
            I('j-' + ipStack.toLowerCase() + '-var' + endStr).innerText = formatNumber(computeVariance(results, true), decimalNumber);
        }
    }


    /**
     * Sets download test results to table
     * @param ipStack - test's IP stack: IPv4 or IPv6
     * @param results - test's results
     * @param isFromCache - boolean variable, that indicates when results are taken from cache
     * @returns {Promise<void>}
     */
    async setDownloadResults(ipStack, results, isFromCache) {
        let decimalNumber=1;
        if (testMode===TestModes.SERVER_SERVER){
            decimalNumber=0;
        }
        if (isFromCache) {
            results.all.forEach((value, key) => {
                I('d-' + ipStack.toLowerCase() + '-t' + (key + 1)).innerText = formatNumber(value, decimalNumber);
            })

            I('d-' + ipStack.toLowerCase() + '-min').innerText = formatNumber(results.min, decimalNumber);
            I('d-' + ipStack.toLowerCase() + '-max').innerText = formatNumber(results.max, decimalNumber);
            I('d-' + ipStack.toLowerCase() + '-var').innerText = formatNumber(results.variance, decimalNumber);
        } else {
            results.forEach((value, key) => {
                if (I('d-' + ipStack.toLowerCase() + '-t' + (key + 1)) !== null) {
                    I('d-' + ipStack.toLowerCase() + '-t' + (key + 1)).innerText = formatNumber(value, decimalNumber);
                }
            })

            I('d-' + ipStack.toLowerCase() + '-min').innerText = formatNumber(Math.min(...results), decimalNumber);
            I('d-' + ipStack.toLowerCase() + '-max').innerText = formatNumber(Math.max(...results), decimalNumber);
            I('d-' + ipStack.toLowerCase() + '-var').innerText = formatNumber(computeVariance(results, true), decimalNumber);
        }
    }


    /**
     * Sets upload test results to table
     * @param ipStack - test's IP stack: IPv4 or IPv6
     * @param results - test's results
     * @param isFromCache - boolean variable, that indicates when results are taken from cache
     * @returns {Promise<void>}
     */
    async setUploadResults(ipStack, results, isFromCache) {
        let decimalNumber=1;
        if (testMode===TestModes.SERVER_SERVER){
            decimalNumber=0;
        }
        if (isFromCache) {
            results.all.forEach((value, key) => {
                I('u-' + ipStack.toLowerCase() + '-t' + (key + 1)).innerText = formatNumber(value, decimalNumber);
            });

            I('u-' + ipStack.toLowerCase() + '-min').innerText = formatNumber(results.min, decimalNumber);
            I('u-' + ipStack.toLowerCase() + '-max').innerText = formatNumber(results.max, decimalNumber);
            I('u-' + ipStack.toLowerCase() + '-var').innerText = formatNumber(results.variance, decimalNumber);
        } else {
            results.forEach((value, key) => {
                if (I('u-' + ipStack.toLowerCase() + '-t' + (key + 1)) !== null) {
                    I('u-' + ipStack.toLowerCase() + '-t' + (key + 1)).innerText = formatNumber(value, decimalNumber);
                }
            });

            I('u-' + ipStack.toLowerCase() + '-min').innerText = formatNumber(Math.min(...results), decimalNumber);
            I('u-' + ipStack.toLowerCase() + '-max').innerText = formatNumber(Math.max(...results), decimalNumber);
            I('u-' + ipStack.toLowerCase() + '-var').innerText = formatNumber(computeVariance(results, true), decimalNumber);
        }
    }


    /**
     * Clears results tables
     * @returns {Promise<void>}
     */
    async clearTables() {
        this.#clearPingResults();
        this.#clearJitterResults();
        this.#clearDownloadResults();
        this.#clearUploadResults();
    }


    /**
     * Enables OpenID button for user login
     * @returns {Promise<void>}
     */
    async enableOpenIDButton() {
        let openIDButton = document.getElementById('popup-openid__btn')
        openIDButton.classList.remove('hidden')
    }

    async enableStartButton() {
        I('btn-start').onclick = () => {
            switch (testMode) {
                case TestModes.USER_SERVER:
                    $('button[data-id="testmode"]').prop('disabled', true);
                    singleWorker.startTest();
                    break;

                case TestModes.SERVER_SERVER:
                    $('button[data-id="testmode"]').prop('disabled', true);
                    singleWorker.startServerServerTest();
                    break;

                case TestModes.SERVER_URL:
                    if ($.trim($('#server__select_website').val()) === "") {
                        openInfoPopup(currentLanguage.mess__server__to__url__empty);
                        return (false);
                    }

                    $('button[data-id="testmode"]').prop('disabled', true);
                    singleWorker.startServerURLTest();
                    break;
            }
        };
    }

    async disableStartButton() {
        I('btn-start').onclick = () => {
        };
    }

    async setRunID(runID) {
        I('runid').innerText = runID;
    }

    async showLocalTestButton(addr) {
        I('btn-local').classList.remove('hidden');
        I('btn-local').onclick = function () {
            openWarningPopup(
                currentLanguage.mess__local_test,
                'OK',
                'CANCEL',
                function () {
                    popupClose(I('popup-warning'));
                    window.open(addr, '_blank');
                })
        }
    }

    async showWEB2WEBButton() {
        I('btn-web2web').classList.remove('hidden');
    }

    /**
     * Sets ICMP IPv4 test results to table
     * * @param results - test's result
     */
    async setICMPResult(result) {
        const pingTable = $('#table_icpm-IPv4_s2w');

        pingTable.find('span[data-label="ip4-max-value"]').text(result.maxPing);
        pingTable.find('span[data-label="ip4-min-value"]').text(result.minPing);
        pingTable.find('span[data-label="ip4-lost-value"]').text(result.packetLost.toFixed(2));
        pingTable.find('span[data-label="ip4-avg-value"]').text(result.averagePing);
        pingTable.find('span[data-label="ip4-avgDev-value"]').text(result.deviation);
        pingTable.find('span[data-label="ip4-deliver-value"]').text(result.sent);
        pingTable.find('span[data-label="ip4-receive-value"]').text(result.received);
    }

    /**
     * Sets Trace Route IPv4 test results to table
     * * @param results - test's results
     */
    async setTraceRouteResult(result) {
        const pingTable = $('#table_traceroute-IPv4_s2w');

        const pingTableRow = pingTable.find('tr[data-temp="1"]');
        $.each(result.hops, function (i, val) {
            let pingTableRowTmp = pingTableRow.clone()

            pingTableRowTmp.attr('data-temp', '0').show()

            let ping = "";
            if (val.ping !== undefined) {
                ping = val.ping.toFixed(2) + ' ms';
            }

            pingTableRowTmp.find("td:eq(0)").text((i + 1));
            pingTableRowTmp.find("td:eq(1)").text(val.host);
            pingTableRowTmp.find("td:eq(2)").text(val.hostName);
            pingTableRowTmp.find("td:eq(3)").text(ping);

            pingTable.append(pingTableRowTmp);
        });
    }


    /**
     * Set User to Server test's visibility of elements that meet certain conditions on the interface
     */
    onUserServerTest() {
        I('server__select_start').closest("li").classList.add("hidden");
        I('server__select_end').closest("li").classList.add("hidden");
        I('speed__limit__select').closest("li").classList.add("hidden");
        I('server__select_website').closest("li").classList.add("hidden");
        I('server__button_change').closest("li").classList.add("hidden");
        I('server__select_web_start').closest("li").classList.add("hidden");
        I('server__select').closest("li").classList.remove("hidden");
        I('thread-number__select').closest("li").classList.remove("hidden");
    }

    /**
     * Set Server to Server test's visibility of elements that meet certain conditions on the interface
     */
    onServerServerTest() {
        I('thread-number__select').closest("li").classList.add("hidden");
        I('server__select').closest("li").classList.add("hidden");
        I('server__select_website').closest("li").classList.add("hidden");
        I('server__select_web_start').closest("li").classList.add("hidden");
        I('server__select_start').closest("li").classList.remove("hidden");
        I('server__select_end').closest("li").classList.remove("hidden");

        if (singleWorker.getHighSpeedSupport()) {
            I('speed__limit__select').closest("li").classList.remove("hidden");
            $('#server__button_change').addClass('heightSpeed');
        } else {
            I('speed__limit__select').closest("li").classList.add("hidden");
            $('#server__button_change').removeClass('heightSpeed');
        }

        I('server__button_change').classList.add('flex-visible');
    }

    /**
     * Set Server to Url test's visibility of elements that meet certain conditions on the interface
     */
    onServerURLTest() {
        I('thread-number__select').closest('li').classList.add("hidden");
        I('server__select').closest('li').classList.add("hidden");
        I('server__select_end').closest('li').classList.add("hidden");
        I('speed__limit__select').closest('li').classList.add("hidden");
        I('server__button_change').classList.add("hidden");
        I('server__select_start').closest('li').classList.add("hidden");
        I('server__select_web_start').closest('li').classList.remove("hidden");
        I('server__select_website').closest('li').classList.remove("hidden");
    }

    /**
     * Change test mode of elements "user to server", "server to server", "server to Url"
     */
    onChangeTestMode(buttonObj) {
        this.hideUploadMemo();
        const currentTestMode = parseInt(buttonObj.attr('data-value'));

        if (testMode === currentTestMode) {
            return;
        }

        $('#client__clock').text('');
        $('#runid').text('');
        $('#test__results').attr('hidden', 'hidden');
        $('#test__results_s2w').attr('hidden', 'hidden');

        $('button[data-id="testmode"][data-select="1"]').attr('data-select', '0');
        buttonObj.attr('data-select', '1');
        testMode = parseInt(buttonObj.attr('data-value'));

        switch (testMode) {
            case TestModes.USER_SERVER:
                $('#test__params').show();
                uiWorker.onUserServerTest()
                break;

            case TestModes.SERVER_SERVER:
                $('#test__params').hide();
                uiWorker.onServerServerTest()
                break;

            case TestModes.SERVER_URL:
                $('#test__params').hide();
                uiWorker.onServerURLTest()
                break;
        }
    }

    /**
     * Change test mode of elements "user to server", "server to server", "server to Url"
     */
    modifyMenu(menu) {
        if (menu) {
            const firstChildDiv = menu.querySelector(":scope > div");

            if (firstChildDiv) {
                firstChildDiv.classList.add('selectChoiceAdjust')
                firstChildDiv.textContent = currentLanguage.select_load;
            }
        }
    }

    /**
     * Get High Speed list
     */
    onGetHighSpeedList(buttonObj){
        fetch(getLocationAddress() + SingleTestWorker.CHECK_HIGHSPEED_SUPPORT_PATH)
            .then(response => response.json())
            .then(jsonObject => {
                const row = $('#popup-high-speed-row');
                row.parent().find('tr[data-temp="0"]').remove();
                const maxNum = 2;

                this.#createHighSpeedList(jsonObject, row, maxNum)
            })
            .catch(error => console.error('Error:', error));
    }

    /**
     * Add High Speed User
     */
    onAddHighSpeedUser(buttonObj){
        const parentTr=buttonObj.parent().parent();
        const userName=parentTr.find('input[name="account"]').val();
        const displayName=parentTr.find('input[name="displayName"]').val();
        const manager=parentTr.find('input[name="manager"]').prop('checked');

        if ($.trim(userName)===''){
            alert(currentLanguage.high_speed_tip_need);
            return false;
        }

        let Interrupt=false
        parentTr.parent().parent().find('tbody').find('tr[data-temp="0"]').each(function(){
            if ($.trim(userName)===$.trim($(this).find('td:eq(1)').text())){
                alert(currentLanguage.high_speed_tip_repeat);
                Interrupt=true;
                return false;
            }
        });

        if (Interrupt) {
            return false;
        }

        fetch(getLocationAddress() +  SingleTestWorker.CHECK_HIGHSPEED_SUPPORT_PATH, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: userName,
                manager: manager,
                displayname: displayName,
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`${response.status}`);
                }
                return response.text();
            })
            .then(text => {
                return text ? JSON.parse(text) : {};
            })
            .then(data => {
                parentTr.find('input[name="account"]').val('');
                parentTr.find('input[name="displayName"]').val('');
                parentTr.find('input[name="manager"]').prop('checked', false);
                $('#btn-high-speed').click();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    /**
     * create HighSpeed List  for jsonObject
     * @param jsonObject
     */
    #createHighSpeedList(jsonObject, row, maxNum) {
        // sort by id
        jsonObject.sort(function(a, b) {
            return a.id - b.id;
        });

        jsonObject.forEach((value, i) => {
            const userName = value['username'];
            const manager = value['manager'];
            const displayMame = value['displayname'];

            let rowTmp = row.clone();
            rowTmp.attr('data-temp', '0').removeAttr('id').removeAttr('hidden');
            rowTmp.find('td:eq(0)').text(i + 1);
            rowTmp.find('td:eq(1)').find('span:eq(0)').text(userName);
            rowTmp.find('td:eq(2)').find('span:eq(0)').text(displayMame);
            rowTmp.find('input[type="checkbox"]:eq(0)').attr('data-username', userName);
            rowTmp.find('button:eq(0)').attr('data-username', userName);

            if (manager) {
                rowTmp.find('input[type="checkbox"]:eq(0)').prop('checked', true);
            }

            if (cookie.get('user_name') === userName) {
                rowTmp.find('td:eq(1)').css('color', '#999');
                rowTmp.find('td:eq(2)').css('color', '#999');
                rowTmp.find('input[type="checkbox"]:eq(0)').prop('disabled', true);
                rowTmp.find('button:eq(0)').prop('disabled', true);
                row.parent().append(rowTmp);
                return true;
            }

            rowTmp.find('input[type="checkbox"]:eq(0)').on('change', function () {
                const row = $('#popup-high-speed-row');

                if (row.parent().find('input[type="checkbox"]:checked').length <= maxNum) {
                    row.parent().find('input[type="checkbox"]:checked').prop('disabled', true);
                    row.parent().find('input[type="checkbox"]:checked').parent().parent().parent().find('button[data-id="popup-high-speed__delete"]').prop('disabled', true);
                }else{
                    row.parent().find('tr[data-temp="0"]').each(function(){
                        if (cookie.get('user_name') !== $.trim($(this).find('td:eq(1)').text())) {
                            $(this).find('input[type="checkbox"]:checked').prop('disabled', false);
                            $(this).find('button[data-id="popup-high-speed__delete"]').prop('disabled', false);
                        }
                    });
                }

                fetch(getLocationAddress() + SingleTestWorker.CHECK_HIGHSPEED_SUPPORT_PATH, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: $(this).attr('data-username'),
                        manager: $(this).prop('checked')
                    })
                })
                    .then(response => {
                        
                    })
                    .catch(error => console.error('Error:', error));
            });

            rowTmp.find('button:eq(0)').on('click', function () {
                if (confirm(currentLanguage.high_speed_tip_delete)) {
                    fetch(getLocationAddress() + SingleTestWorker.CHECK_HIGHSPEED_SUPPORT_PATH, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            username: $(this).attr('data-username')
                        })
                    })
                        .then(response => {
                            $('#btn-high-speed').click();
                        })
                        .catch(error => console.error('Error:', error));
                }
            });

            row.parent().append(rowTmp);
        });

        if (row.parent().find('input[type="checkbox"]:checked').length <= maxNum) {
            row.parent().find('input[type="checkbox"]:checked').prop('disabled', true);
            row.parent().find('input[type="checkbox"]:checked').parent().parent().parent().find('button[data-id="popup-high-speed__delete"]').prop('disabled', true);
        }
    }
}