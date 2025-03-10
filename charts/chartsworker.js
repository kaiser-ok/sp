class ChartsWorker {
    static labels = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

    static areaIPv4Color = 'rgba(28, 207, 249, 0.46)';
    static areaIPv6Color = 'rgba(33, 59, 121, 0.8)';
    static lineIPv4Color = 'rgb(28, 207, 249)';
    static lineIPv6Color = 'rgb(33, 59, 121)';

    #downloadV4Chart;
    #downloadV6Chart;
    #uploadV4Chart;
    #uploadV6Chart;
    #pingV4Chart;
    #pingV6Chart;
    #jitterV4Chart;
    #jitterV6Chart;
    #pingWEBRTCV4Chart;
    #pingWEBRTCV6Chart;

    #pingServerURLv4Chart;
    #jitterServerURLv4Chart;
    #icpmServerURLv4Chart;

    static heightDesktop = 218;
    static heightTablet = 125;

    static heightIcpmDesktop = 450;
    static widthIcpmDesktop = 1029;

    constructor() {
        this.#init()
    }


    /**
     * Inits charts on the HTML page
     * @returns {Promise<void>}
     */
    async #init() {
        this.#downloadV4Chart = await this.#updateChart('#chart__download-IPv4', 'Download', 'Mbps',
            ChartsWorker.heightDesktop, ChartsWorker.areaIPv4Color, ChartsWorker.lineIPv4Color, [], [],
            'Download IPv4');
        this.#downloadV6Chart = await this.#updateChart('#chart__download-IPv6', 'Download', 'Mbps',
            ChartsWorker.heightDesktop, ChartsWorker.areaIPv6Color, ChartsWorker.lineIPv6Color, [], [],
            'Download IPv6');
        this.#uploadV4Chart = await this.#updateChart('#chart__upload-IPv4', 'Upload', 'Mbps',
            ChartsWorker.heightDesktop, ChartsWorker.areaIPv4Color, ChartsWorker.lineIPv4Color, [], [],
            'Upload IPv4');
        this.#uploadV6Chart = await this.#updateChart('#chart__upload-IPv6', 'Upload', 'Mbps',
            ChartsWorker.heightDesktop, ChartsWorker.areaIPv6Color, ChartsWorker.lineIPv6Color, [], [],
            'Upload IPv6');
        this.#pingV4Chart = await this.#updateChart('#chart__ping-IPv4', 'Ping', 'ms',
            ChartsWorker.heightDesktop, ChartsWorker.areaIPv4Color, ChartsWorker.lineIPv4Color, [], [],
            'Ping IPv4');
        this.#pingV6Chart = await this.#updateChart('#chart__ping-IPv6', 'Ping', 'ms',
            ChartsWorker.heightDesktop, ChartsWorker.areaIPv6Color, ChartsWorker.lineIPv6Color, [], [],
            'Ping IPv6');
        this.#jitterV4Chart = await this.#updateChart('#chart__jitter-IPv4', 'Jitter', 'ms',
            ChartsWorker.heightDesktop, ChartsWorker.areaIPv4Color, ChartsWorker.lineIPv4Color, [], [],
            'Jitter IPv4');
        this.#jitterV6Chart = await this.#updateChart('#chart__jitter-IPv6', 'Jitter', 'ms',
            ChartsWorker.heightDesktop, ChartsWorker.areaIPv6Color, ChartsWorker.lineIPv6Color, [], [],
            'Jitter IPv6');
        this.#pingWEBRTCV4Chart = await this.#updateChart('#chart__ping-webrtc-IPv4', 'Ping UDP', 'ms',
            ChartsWorker.heightDesktop, ChartsWorker.areaIPv4Color, ChartsWorker.lineIPv4Color, [], [],
            'Ping UDP IPv4');
        this.#pingWEBRTCV6Chart = await this.#updateChart('#chart__ping-webrtc-IPv6', 'Ping UDP', 'ms',
            ChartsWorker.heightDesktop, ChartsWorker.areaIPv6Color, ChartsWorker.lineIPv6Color, [], [],
            'Ping UDP IPv6');

        this.#pingServerURLv4Chart = await this.#updateChart('#chart__ping-IPv4_s2w', 'Ping', 'ms',
            ChartsWorker.heightDesktop, ChartsWorker.areaIPv4Color, ChartsWorker.lineIPv4Color, [], [],
            'Ping IPv4');

        this.#jitterServerURLv4Chart = await this.#updateChart('#chart__jitter-IPv4_s2w', 'Jitter', 'ms',
            ChartsWorker.heightDesktop, ChartsWorker.areaIPv4Color, ChartsWorker.lineIPv4Color, [], [],
            'Jitter IPv4');

        this.#icpmServerURLv4Chart = await this.#updateChart('#chart__icpm-IPv4__s2w', 'ICMP', 'ms',
            ChartsWorker.heightIcpmDesktop, ChartsWorker.areaIPv4Color, ChartsWorker.lineIPv4Color, [], [],
            'ICMP IPv4');
    }

    /**
     * Updates chart's parameter
     * @param chartSelector - HTML selector for chart
     * @param chartTitle - chart's title
     * @param chartYTitle - chart's Y-axis title
     * @param chartHeight - chart's height
     * @param chartAreaColor - chart's area color
     * @param chartLineColor - chart's line color
     * @param chartCategories - chart's categories
     * @param chartData - chart's data
     * @param chartName - chart's name
     * @returns {Promise<unknown>}
     */
    async #updateChart(chartSelector, chartTitle, chartYTitle, chartHeight, chartAreaColor, chartLineColor,
                       chartCategories, chartData, chartName) {
        return new Promise(resolve => {
            if (document.querySelector(chartSelector) == null) {
                return null
            }

            let options = {
                title: {
                    text: chartTitle,
                    align: 'left',
                    style: {
                        fontFamily: 'Poppins',
                        fontStyle: 'normal',
                        fontWeight: 500,
                        fontSize: '16px',
                        lineHeight: '24px',
                        letterSpacing: '-0.32px',
                        color: '#151E29',
                    }
                },

                grid: {
                    show: false
                },

                dataLabels: {
                    enabled: false
                },

                chart: {
                    toolbar: {
                        show: false,
                    },
                    type: 'area',
                    height: chartHeight,
                    zoom: {
                        enabled: false
                    },
                    redrawOnParentResize: true
                },

                fill: {
                    type: 'gradient',
                    gradient: {
                        shadeIntensity: 1,
                        opacityFrom: 0.7,
                        opacityTo: 0.9,
                        stops: [0, 100],
                        colorStops: [
                            {
                                offset: 0,
                                color: chartAreaColor,
                            },
                            {
                                offset: 100,
                                color: 'rgba(255, 255, 255, 0)',
                            },
                        ]
                    }
                },

                xaxis: {
                    tickAmount: 20,
                    type: 'category',
                    categories: chartCategories,
                    forceNiceScale: false,
                    labels: {
                        rotate: 0,
                        style: {
                            fontFamily: 'Poppins',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '21px',
                            letterSpacing: '-0.32px',
                            color: '#9193A6',
                        }
                    }
                },

                yaxis: {
                    min: 0,
                    tickAmount: 4,
                    forceNiceScale: false,
                    title: {
                        text: chartYTitle,
                        style: {
                            fontSize: '14px',
                            fontFamily: 'Poppins',
                            color: '#9193a6',
                            fontWeight: 400,
                            letterSpacing: '-0.32px',
                            lineHeight: '21px',
                        }
                    },
                    labels: {
                        style: {
                            fontFamily: 'Poppins',
                            fontStyle: 'normal',
                            fontWeight: 400,
                            fontSize: '14px',
                            lineHeight: '21px',
                            letterSpacing: '-0.32px',
                            color: '#9193A6',
                        }
                    }

                },

                stroke: {
                    curve: 'straight',
                    width: 1,
                    color: chartLineColor,
                },

                series: [{
                    name: chartName,
                    data: chartData,
                }],
            };

            let chart = new ApexCharts(document.querySelector(chartSelector), options);
            chart.render();

            resolve(chart);
        })
    }


    /**
     * Creates categories array for drawing chart
     * @param data - data for creating categories array
     * @returns {*[]} - result array
     */
    #createCategories(data) {
        let i = 1,
            categories = [];

        data.forEach(() => {
            categories.push(i);
            i++;
        });

        return categories;
    }


    /**
     * Draws chart for ping test
     * @param data - test results for drawing chart
     * @param ipStack - test IP stack: IPv4 or IPv6
     * @returns {Promise<void>}
     */
    async drawPingChart(data, ipStack) {
        if (this.#pingV4Chart === undefined) {
            return
        }

        let currentChart;
        switch (ipStack) {
            case IPStacks.ipV4:
                currentChart=this.#pingV4Chart;
                if (testMode===TestModes.SERVER_URL){
                    if (this.#pingServerURLv4Chart === undefined) {
                        return
                    }

                    currentChart=this.#pingServerURLv4Chart;
                }

                currentChart.updateOptions({
                    xaxis: {
                        categories: this.#createCategories(data),
                    }                  
                }, true);

                currentChart.updateSeries([{
                    name: 'Ping IPv4',
                    data: data,
                }])
                break;

            case IPStacks.ipV6:
                currentChart=this.#pingV6Chart;

                currentChart.updateOptions({
                    xaxis: {
                        categories: this.#createCategories(data),
                    }
                }, true);

                currentChart.updateSeries([{
                    name: 'Ping IPv6',
                    data: data,
                }])

                break;
        }
    }

    /**
     * Draws chart for webrtc ping test
     * @param data - test results for drawing chart
     * @param ipStack - test IP stack: IPv4 or IPv6
     * @returns {Promise<void>}
     */
    async drawPingWEBRTCChart(data, ipStack) {
        switch (ipStack) {
            case IPStacks.ipV4:
                this.#pingWEBRTCV4Chart.updateOptions({
                    xaxis: {
                        categories: this.#createCategories(data),
                    }
                }, true);

                this.#pingWEBRTCV4Chart.updateSeries([{
                    name: 'Ping UDP IPv4',
                    data: data,
                }])

                break;

            case IPStacks.ipV6:
                this.#pingWEBRTCV6Chart.updateOptions({
                    xaxis: {
                        categories: this.#createCategories(data),
                    }
                }, true);

                this.#pingWEBRTCV6Chart.updateSeries([{
                    name: 'Ping UDP IPv6',
                    data: data,
                }])

                break;
        }
    }


    /**
     * Draws chart for jitter test
     * @param data - test results for drawing chart
     * @param ipStack - test IP stack: IPv4 or IPv6
     * @returns {Promise<void>}
     */
    async drawJitterChart(data, ipStack) {
        if (this.#jitterV4Chart === undefined) {
            return
        }

        let currentChart;
        switch (ipStack) {
            case IPStacks.ipV4:
                currentChart=this.#jitterV4Chart;
                if (testMode===TestModes.SERVER_URL){
                    currentChart=this.#jitterServerURLv4Chart;
                }

                currentChart.updateOptions({
                    xaxis: {
                        categories: this.#createCategories(data),
                    }
                }, true);

                currentChart.updateSeries([{
                    name: 'Jitter IPv4',
                    data: data,
                }]);

                break;

            case IPStacks.ipV6:
                currentChart=this.#jitterV6Chart;

                currentChart.updateOptions({
                    xaxis: {
                        categories: this.#createCategories(data),
                    }
                }, true);

                currentChart.updateSeries([{
                    name: 'Jitter IPv6',
                    data: data,
                }]);

                break;
        }
    }


    /**
     * Draws chart for download test
     * @param categories - chart's categories
     * @param data - test results for drawing chart
     * @param ipStack - test IP stack: IPv4 or IPv6
     * @returns {Promise<void>}
     */
    async drawDownloadChart(categories, data, ipStack) {
        if (this.#downloadV4Chart === undefined) {
            return
        }

        switch (ipStack) {
            case IPStacks.ipV4:
                this.#downloadV4Chart.updateOptions({
                    xaxis: {
                        tickAmount: 20,
                        type: 'category',
                        categories: categories,
                    }
                }, true);

                this.#downloadV4Chart.updateSeries([{
                    name: 'Download IPv4',
                    data: data,
                }])

                break;

            case IPStacks.ipV6:
                this.#downloadV6Chart.updateOptions({
                    xaxis: {
                        tickAmount: 20,
                        type: 'category',
                        categories: categories,
                    }
                }, true);

                this.#downloadV6Chart.updateSeries([{
                    name: 'Download IPv6',
                    data: data,
                }])

                break;
        }
    }


    /**
     * Draws chart for upload test
     * @param categories - chart's categories
     * @param data - test results for drawing chart
     * @param ipStack - test IP stack: IPv4 or IPv6
     * @returns {Promise<void>}
     */
    async drawUploadChart(categories, data, ipStack) {
        if (this.#uploadV4Chart === undefined) {
            return
        }

        switch (ipStack) {
            case IPStacks.ipV4:
                this.#uploadV4Chart.updateOptions({
                    xaxis: {
                        tickAmount: 20,
                        type: 'category',
                        categories: categories,
                    }
                }, true);
                this.#uploadV4Chart.updateSeries([{
                    name: 'Upload IPv4',
                    data: data,
                }])
                break;
            case IPStacks.ipV6:
                this.#uploadV6Chart.updateOptions({
                    xaxis: {
                        tickAmount: 20,
                        type: 'category',
                        categories: categories,
                    }
                }, true);
                this.#uploadV6Chart.updateSeries([{
                    name: 'Upload IPv6',
                    data: data,
                }])
                break;
        }
    }

    /**
     * Draws chart for ICMP test
     * @param data - test results for drawing chart
     * @param ipStack - test IP stack: IPv4 or IPv6
     * @returns {Promise<void>}
     */
    async drawICMPChart(data, ipStack) {
        if (this.#icpmServerURLv4Chart === undefined) {
            return
        }

        let currentChart;
        switch (ipStack) {
            case IPStacks.ipV4:
                currentChart=this.#icpmServerURLv4Chart;

                currentChart.updateOptions({
                    xaxis: {
                        categories: this.#createCategories(data),
                    },
                    yaxis: {
                        max: undefined,
                        title: {
                            text: 'ms',
                            style: {
                                fontSize: '14px',
                                fontFamily: 'Poppins',
                                color: '#9193a6',
                                fontWeight: 400,
                                letterSpacing: '-0.32px',
                                lineHeight: '21px',
                            }
                        },
                        labels: {
                            style: {
                                fontFamily: 'Poppins',
                                fontStyle: 'normal',
                                fontWeight: 400,
                                fontSize: '14px',
                                lineHeight: '21px',
                                letterSpacing: '-0.32px',
                                color: '#9193A6',
                            }
                        }
                    }
                }, false, false, false);

                currentChart.updateSeries([{
                    name: 'ICMP',
                    data: data,
                }]);

                if (data.length===0){
                    return
                }

                const maxValue = Math.max.apply(null, data);

                if (maxValue >= 10){
                    return
                }

                currentChart.updateOptions({
                    yaxis: {
                        max: 10,
                        title: {
                            text: 'ms',
                            style: {
                                fontSize: '14px',
                                fontFamily: 'Poppins',
                                color: '#9193a6',
                                fontWeight: 400,
                                letterSpacing: '-0.32px',
                                lineHeight: '21px',
                            }
                        },
                        labels: {
                            style: {
                                fontFamily: 'Poppins',
                                fontStyle: 'normal',
                                fontWeight: 400,
                                fontSize: '14px',
                                lineHeight: '21px',
                                letterSpacing: '-0.32px',
                                color: '#9193A6',
                            }
                        }
                    }
                }, true);

                break;
        }
    }

    /**
     * Clears all charts
     * @returns {Promise<void>}
     */
    async clearCharts() {
        this.drawDownloadChart([], [], IPStacks.ipV4);
        this.drawDownloadChart([], [], IPStacks.ipV6);

        this.drawUploadChart([], [], IPStacks.ipV4);
        this.drawUploadChart([], [], IPStacks.ipV6);

        this.drawPingChart([], IPStacks.ipV4);
        this.drawPingChart([], IPStacks.ipV6);

        this.drawJitterChart( [], IPStacks.ipV4);
        this.drawJitterChart( [], IPStacks.ipV6);

        this.drawICMPChart([], IPStacks.ipV4);
        this.drawICMPChart([], IPStacks.ipV6);
    }
}