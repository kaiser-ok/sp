class ResultsUIWorker {
    #downloadIPv4 = I('down__value--ipv4');
    #downloadIPv6 = I('down__value--ipv6');
    #uploadIPv4 = I('upl__value--ipv4');
    #uploadIPv6 = I('upl__value--ipv6');
    #pingIPv4 = I('ping__value--ipv4');
    #pingIPv6 = I('ping__value--ipv6');
    #jitterIPv4 = I('jit__value--ipv4');
    #jitterIPv6 = I('jit__value--ipv6');
    #pingWEBRTCIPv4 = I('webrtc__value--ipv4');
    #pingWEBRTCIPv6 = I('webrtc__value--ipv6');
    #packetLostIPv4 = I('lost__value--ipv4');
    #packetLostIPv6 = I('lost__value--ipv6');

    #downloadIPv4value = '-';
    #downloadIPv6value = '-';
    #uploadIPv4value = '-';
    #uploadIPv6value = '-';
    #pingIPv4value = '-';
    #pingIPv6value = '-';
    #jitterIPv4value = '-';
    #jitterIPv6value = '-';
    #pingWEBRTCIPv4value = '-';
    #pingWEBRTCIPv6value = '-';
    #packetLostIPv4value = '-';
    #packetLostIPv6value = '-';

    #dateHolder;


    constructor(dateHolder) {
        this.#dateHolder = dateHolder;

        this.#animationFrame()
    }


    /**
     * Calls UI updater
     * @returns {Promise<void>}
     */
    async #animationFrame() {
        this.#updateResults();
        await this.#dateHolder.sleep(50);
        this.#animationFrame();
    }


    /**
     * Updates results on UI
     * @returns {Promise<void>}
     */
    async #updateResults() {
        this.#downloadIPv4.innerText = this.#downloadIPv4value;
        if (this.#downloadIPv6 !== null) {
            this.#downloadIPv6.innerText = this.#downloadIPv6value;
        }
        this.#uploadIPv4.innerText = this.#uploadIPv4value;
        if (this.#uploadIPv6 !== null) {
            this.#uploadIPv6.innerText = this.#uploadIPv6value;
        }
        this.#pingIPv4.innerText = this.#pingIPv4value;
        if (this.#pingIPv6 !== null) {
            this.#pingIPv6.innerText = this.#pingIPv6value;
        }
        this.#jitterIPv4.innerText = this.#jitterIPv4value;
        if (this.#jitterIPv6 !== null) {
            this.#jitterIPv6.innerText = this.#jitterIPv6value;
        }
        if (this.#pingWEBRTCIPv4 !== null) {
            this.#pingWEBRTCIPv4.innerText = this.#pingWEBRTCIPv4value;
        }
        if (this.#pingWEBRTCIPv6 !== null) {
            this.#pingWEBRTCIPv6.innerText = this.#pingWEBRTCIPv6value;
        }
        if (this.#packetLostIPv4 !== null) {
            this.#packetLostIPv4.innerText = this.#packetLostIPv4value;
        }
        if (this.#packetLostIPv6 !== null) {
            this.#packetLostIPv6.innerText = this.#packetLostIPv6value;
        }
    }


    /**
     * Clears current result values
     * @returns {Promise<void>}
     */
    async clearResults() {
        this.#downloadIPv4value = '-';
        this.#downloadIPv6value = '-';
        this.#uploadIPv4value = '-';
        this.#uploadIPv6value = '-';
        this.#pingIPv4value = '-';
        this.#pingIPv6value = '-';
        this.#jitterIPv4value = '-';
        this.#jitterIPv6value = '-';
        this.#pingWEBRTCIPv4value = '-';
        this.#pingWEBRTCIPv6value = '-';
        this.#packetLostIPv4value = '-';
        this.#packetLostIPv6value = '-'
    }


    /**
     * Sets download speed value for IPv4
     * @param value
     */
    setDownloadIPv4value(value) {
        if (parseInt(value) < 2) {
            this.#downloadIPv4.classList.add('low-throughput');
        } else {
            this.#downloadIPv4.classList.remove('low-throughput');
        }

        if (value === undefined) {
            value = '-'
        }

        this.#downloadIPv4value = value;
    }


    /**
     * Sets download speed value for IPv6
     * @param value
     */
    setDownloadIPv6value(value) {
        if (parseInt(value) < 2) {
            this.#downloadIPv6.classList.add('low-throughput');
        } else {
            this.#downloadIPv6.classList.remove('low-throughput');
        }

        if (value === undefined) {
            value = '-'
        }


        this.#downloadIPv6value = value;
    }


    /**
     * Sets upload speed value for IPv4
     * @param value
     */
    setUploadIPv4value(value) {
        if (parseInt(value) < 2) {
            this.#uploadIPv4.classList.add('low-throughput');
        } else {
            this.#uploadIPv4.classList.remove('low-throughput');
        }

        if (value === undefined) {
            value = '-'
        }


        this.#uploadIPv4value = value;
    }


    /**
     * Sets upload speed value for IPv6
     * @param value
     */
    setUploadIPv6value(value) {
        if (parseInt(value) < 2) {
            this.#uploadIPv6.classList.add('low-throughput');
        } else {
            this.#uploadIPv6.classList.remove('low-throughput');
        }

        if (value === undefined) {
            value = '-'
        }

        this.#uploadIPv6value = value;
    }


    /**
     * Sets ping value for IPv4
     * @param value
     */
    setPingIPv4value(value) {
        this.#pingIPv4value = value;
    }


    /**
     * Sets ping value for IPv6
     * @param value
     */
    setPingIPv6value(value) {
        this.#pingIPv6value = value;
    }


    /**
     * Sets jitter value for IPv4
     * @param value
     */
    setJitterIPv4value(value) {
        this.#jitterIPv4value = value;
    }


    /**
     * Sets jitter value for IPv6
     * @param value
     */
    setJitterIPv6value(value) {
        this.#jitterIPv6value = value;
    }

    /**
     * Sets ping WEBRTC value for IPv4
     * @param value
     */
    setPingWEBRTCIPv4value(value) {
        this.#pingWEBRTCIPv4value = value;
    }


    /**
     * Sets ping WEBRTC value for IPv6
     * @param value
     */
    setPingWEBRTCIPv6value(value) {
        this.#pingWEBRTCIPv6value = value;
    }

    /**
     * Sets packet lost value for IPv4
     * @param value
     */
    setPacketLostIPv4value(value) {
        this.#packetLostIPv4value = value;
    }


    /**
     * Sets packet lost value for IPv6
     * @param value
     */
    setPacketLostIPv6value(value) {
        this.#packetLostIPv6value = value;
    }


    /**
     * Hides WEB RTC elements from we
     */
    hideWEBRTCPart() {
        I('udp__ping-wrapper').classList.add('hidden');
        I('packet__lost-wrapper').classList.add('hidden');
        I('chart__ping-webrtc-IPv4').classList.add('hidden');
        I('chart__ping-webrtc-IPv6').classList.add('hidden');
        if (I('ping__udp4-caption') !== null) {
            I('ping__udp4-caption').classList.add('hidden');
        }
        if (I('ping__udp6-caption') !== null) {
            I('ping__udp6-caption').classList.add('hidden');
        }

        const elements = document.querySelectorAll("[id^='w-']");

        elements.forEach(element => {
            element.classList.add('hidden');
        });

    }
}