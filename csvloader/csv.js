class CSVLoader {
    #dateHolder;


    constructor(dateHolder) {
        this.#dateHolder = dateHolder;
    }

    #arrayToCSVBlob(data){
        const BOM = '\uFEFF';
        const csvString = data.join('\n');
        return new Blob([BOM + csvString], { type: "text/csv;charset=utf-8;"} );
    }


    /**
     * Downloads CSV file with IPv4 results
     * @param trxServer TRX speedtest server info
     */
    downloadIPv4Results (trxServer) {
        let data = [];
        data.push(['IP stack', 'IPv4'].join(','));
        data.push(['From', I('public__ipv4').textContent].join(','))
        data.push(['Server name', trxServer.name]);
        data.push(['Server address', trxServer.ip4Server.host]);
        data.push(['Ping (ms)', I('ping__value--ipv4').textContent]);
        data.push(['Jitter (ms)', I('jit__value--ipv4').textContent]);
        data.push(['Ping UDP (ms)', I('webrtc__value--ipv4').textContent]);
        data.push(['Lost (%)', I('lost__value--ipv4').textContent]);
        data.push(['Download (Mbps)', I('down__value--ipv4').textContent]);
        data.push(['Upload (Mbps)', I('upl__value--ipv4').textContent]);
        data.push([' ', 't1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9', 't10', 't11', 't12', 't13', 't14', 't15',
            't16', 't17', 't18', 't19', 't20', 'Min', 'Max', 'Variance'].join(','));

        let pingRow = ['Delay (ms)'];
        for (let i = 1; i <= 20; i++) {
            pingRow.push(I('p-' + IPStacks.ipV4.toLowerCase() + '-t' + i).textContent);
        }

        pingRow.push(I('p-' + IPStacks.ipV4.toLowerCase() + '-min').textContent);
        pingRow.push(I('p-' + IPStacks.ipV4.toLowerCase() + '-max').textContent);
        pingRow.push(I('p-' + IPStacks.ipV4.toLowerCase() + '-var').textContent);

        data.push(pingRow);

        let jitterRow = ['Jitter (ms)'];
        for (let i = 1; i <= 20; i++) {
            jitterRow.push(I('j-' + IPStacks.ipV4.toLowerCase() + '-t' + i).textContent);
        }

        jitterRow.push(I('j-' + IPStacks.ipV4.toLowerCase() + '-min').textContent);
        jitterRow.push(I('j-' + IPStacks.ipV4.toLowerCase() + '-max').textContent);
        jitterRow.push(I('j-' + IPStacks.ipV4.toLowerCase() + '-var').textContent);

        data.push(jitterRow);

        let webrtcRow = ['Ping UDP (ms)'];
        for (let i = 1; i <= 20; i++) {
            webrtcRow.push(I('w-' + IPStacks.ipV4.toLowerCase() + '-t' + i).textContent);
        }

        webrtcRow.push(I('w-' + IPStacks.ipV4.toLowerCase() + '-min').textContent);
        webrtcRow.push(I('w-' + IPStacks.ipV4.toLowerCase() + '-max').textContent);
        webrtcRow.push(I('w-' + IPStacks.ipV4.toLowerCase() + '-var').textContent);

        data.push(webrtcRow);

        data.push([' ', 't1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9', 't10', 't11', 't12', 't13', 't14', 't15',
            't16', 't17', 't18', 't19', 't20', 'Min', 'Max', 'Variance'].join(','));

        let downloadRow = ['Download (Mbps)'];
        for (let i = 1; i <= 20; i++) {
            downloadRow.push(I('d-' + IPStacks.ipV4.toLowerCase() + '-t' + i).textContent);
        }

        downloadRow.push(I('d-' + IPStacks.ipV4.toLowerCase() + '-min').textContent);
        downloadRow.push(I('d-' + IPStacks.ipV4.toLowerCase() + '-max').textContent);
        downloadRow.push(I('d-' + IPStacks.ipV4.toLowerCase() + '-var').textContent);
        data.push(downloadRow);

        let uploadRow = ['Upload (Mbps)'];
        for (let i = 1; i <= 20; i++) {
            uploadRow.push(I('u-' + IPStacks.ipV4.toLowerCase() + '-t' + i).textContent);
        }

        uploadRow.push(I('u-' + IPStacks.ipV4.toLowerCase() + '-min').textContent);
        uploadRow.push(I('u-' + IPStacks.ipV4.toLowerCase() + '-max').textContent);
        uploadRow.push(I('u-' + IPStacks.ipV4.toLowerCase() + '-var').textContent);
        data.push(uploadRow);
        let csv_file = this.#arrayToCSVBlob(data)
        let download_link = document.createElement("a");
        download_link.download = 'Test results IPv4 ' + this.#dateHolder.getCurrentDateTimeClient();
        download_link.href = window.URL.createObjectURL(csv_file);
        download_link.style.display = "none";
        document.body.appendChild(download_link);
        download_link.click();
    }


    /**
     * Downloads CSV file with IPv6 results
     * @param trxServer TRX speedtest server info
     */
    downloadIPv6Results (trxServer) {
        let data = [];
        data.push(['IP stack', 'IPv6'].join(','));
        data.push(['From', I('public__ipv6').textContent].join(','))
        data.push(['Server name', trxServer.name]);
        data.push(['Server address', trxServer.ip6Server.host]);
        data.push(['Ping (ms)', I('ping__value--ipv6').textContent]);
        data.push(['Jitter (ms)', I('jit__value--ipv6').textContent]);
        data.push(['Ping UDP (ms)', I('webrtc__value--ipv6').textContent]);
        data.push(['Lost (%)', I('lost__value--ipv6').textContent]);
        data.push(['Download (Mbps)', I('down__value--ipv6').textContent]);
        data.push(['Upload (Mbps)', I('upl__value--ipv6').textContent]);
        data.push([' ', 't1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9', 't10', 't11', 't12', 't13', 't14', 't15',
            't16', 't17', 't18', 't19', 't20', 'Min', 'Max', 'Variance'].join(','));

        let pingRow = ['Delay (ms)'];
        for (let i = 1; i <= 20; i++) {
            pingRow.push(I('p-' + IPStacks.ipV6.toLowerCase() + '-t' + i).textContent);
        }

        pingRow.push(I('p-' + IPStacks.ipV6.toLowerCase() + '-min').textContent);
        pingRow.push(I('p-' + IPStacks.ipV6.toLowerCase() + '-max').textContent);
        pingRow.push(I('p-' + IPStacks.ipV6.toLowerCase() + '-var').textContent);
        data.push(pingRow);

        let jitterRow = ['Jitter (ms)'];
        for (let i = 1; i <= 20; i++) {
            jitterRow.push(I('j-' + IPStacks.ipV6.toLowerCase() + '-t' + i).textContent);
        }

        jitterRow.push(I('j-' + IPStacks.ipV6.toLowerCase() + '-min').textContent);
        jitterRow.push(I('j-' + IPStacks.ipV6.toLowerCase() + '-max').textContent);
        jitterRow.push(I('j-' + IPStacks.ipV6.toLowerCase() + '-var').textContent);
        data.push(jitterRow);

        let webrtcRow = ['Ping UDP (ms)'];
        for (let i = 1; i <= 20; i++) {
            webrtcRow.push(I('w-' + IPStacks.ipV6.toLowerCase() + '-t' + i).textContent);
        }

        webrtcRow.push(I('w-' + IPStacks.ipV6.toLowerCase() + '-min').textContent);
        webrtcRow.push(I('w-' + IPStacks.ipV6.toLowerCase() + '-max').textContent);
        webrtcRow.push(I('w-' + IPStacks.ipV6.toLowerCase() + '-var').textContent);
        data.push(webrtcRow);

        data.push([' ', 't1', 't2', 't3', 't4', 't5', 't6', 't7', 't8', 't9', 't10', 't11', 't12', 't13', 't14', 't15',
            't16', 't17', 't18', 't19', 't20', 'Min', 'Max', 'Variance'].join(','));

        let downloadRow = ['Download (Mbps)'];
        for (let i = 1; i <= 20; i++) {
            downloadRow.push(I('d-' + IPStacks.ipV6.toLowerCase() + '-t' + i).textContent);
        }

        downloadRow.push(I('d-' + IPStacks.ipV6.toLowerCase() + '-min').textContent);
        downloadRow.push(I('d-' + IPStacks.ipV6.toLowerCase() + '-max').textContent);
        downloadRow.push(I('d-' + IPStacks.ipV6.toLowerCase() + '-var').textContent);
        data.push(downloadRow);

        let uploadRow = ['Upload (Mbps)'];
        for (let i = 1; i <= 20; i++) {
            uploadRow.push(I('u-' + IPStacks.ipV6.toLowerCase() + '-t' + i).textContent);
        }

        uploadRow.push(I('u-' + IPStacks.ipV6.toLowerCase() + '-min').textContent);
        uploadRow.push(I('u-' + IPStacks.ipV6.toLowerCase() + '-max').textContent);
        uploadRow.push(I('u-' + IPStacks.ipV6.toLowerCase() + '-var').textContent);
        data.push(uploadRow);
        let csv_file = this.#arrayToCSVBlob(data)
        let download_link = document.createElement("a");
        download_link.download = 'Test results IPv6 ' + this.#dateHolder.getCurrentDateTimeClient();
        download_link.href = window.URL.createObjectURL(csv_file);
        download_link.style.display = "none";
        document.body.appendChild(download_link);
        download_link.click();
    }

    downloadGroupResult(trxServer, results, statistics) {
        let data = [];
        data.push(['Server name', trxServer.name]);
        data.push(['Server address (IPv4)', trxServer.ip4Server.host]);
        data.push(['Server address (IPv6)', trxServer.ip6Server.host]);
        let limitSpeed = I('limit__select').textContent;
            if (limitSpeed === 'Unlimited') {
                limitSpeed = 'Unlimited';
            } else {
                limitSpeed = parseInt(limitSpeed);
            }
        data.push(['Limit speed (Mbps)',limitSpeed]);
        data.push(['Thread #',parseInt(I('thread-number__select').textContent)]);
        data.push(['Clients', results.size]);
        data.push(['','']);
        data.push(['', 'IPv4', 'IPv4', 'IPv4', 'IPv4', 'IPv4', 'IPv4', '', 'IPv6', 'IPv6', 'IPv6', 'IPv6', 'IPv6', 'IPv6']);
        data.push(['', 'Std. Perf.', 'Non Std. Perf.', 'Avg', 'Max', 'Min', 'Std. devi.', '', 'Std. Perf.', 'Non Std. Perf.', 'Avg', 'Max', 'Min', 'Std. devi.']);
        data.push([
            'Download (Mbps)',
            statistics.v4.download.standardPerformance,
            statistics.v4.download.nonStandardPerformance,
            parseFloat(statistics.v4.download.average).toFixed(2),
            parseFloat(statistics.v4.download.max).toFixed(2),
            parseFloat(statistics.v4.download.min).toFixed(2),
            statistics.v4.download.standardDeviation,
            '',
            statistics.v6.download.standardPerformance,
            statistics.v6.download.nonStandardPerformance,
            parseFloat(statistics.v6.download.average).toFixed(2),
            parseFloat(statistics.v6.download.max).toFixed(2),
            parseFloat(statistics.v6.download.min).toFixed(2),
            statistics.v6.download.standardDeviation,
        ]);
        data.push([
            'Upload (Mbps)',
            statistics.v4.upload.standardPerformance,
            statistics.v4.upload.nonStandardPerformance,
            parseFloat(statistics.v4.upload.average).toFixed(2),
            parseFloat(statistics.v4.upload.max).toFixed(2),
            parseFloat(statistics.v4.upload.min).toFixed(2),
            statistics.v4.upload.standardDeviation,
            '',
            statistics.v6.upload.standardPerformance,
            statistics.v6.upload.nonStandardPerformance,
            parseFloat(statistics.v6.upload.average).toFixed(2),
            parseFloat(statistics.v6.upload.max).toFixed(2),
            parseFloat(statistics.v6.upload.min).toFixed(2),
            statistics.v6.upload.standardDeviation,
        ]);
        data.push([
            'Ping (ms)',
            statistics.v4.ping.standardPerformance,
            statistics.v4.ping.nonStandardPerformance,
            parseFloat(statistics.v4.ping.average).toFixed(2),
            parseFloat(statistics.v4.ping.max).toFixed(2),
            parseFloat(statistics.v4.ping.min).toFixed(2),
            statistics.v4.ping.standardDeviation,
            '',
            statistics.v6.ping.standardPerformance,
            statistics.v6.ping.nonStandardPerformance,
            parseFloat(statistics.v6.ping.average).toFixed(2),
            parseFloat(statistics.v6.ping.max).toFixed(2),
            parseFloat(statistics.v6.ping.min).toFixed(2),
            statistics.v6.ping.standardDeviation,
        ]);
        data.push([
            'Jitter (ms)',
            statistics.v4.jitter.standardPerformance,
            statistics.v4.jitter.nonStandardPerformance,
            parseFloat(statistics.v4.jitter.average).toFixed(2),
            parseFloat(statistics.v4.jitter.max).toFixed(2),
            parseFloat(statistics.v4.jitter.min).toFixed(2),
            statistics.v4.jitter.standardDeviation,
            '',
            statistics.v6.jitter.standardPerformance,
            statistics.v6.jitter.nonStandardPerformance,
            parseFloat(statistics.v6.jitter.average).toFixed(2),
            parseFloat(statistics.v6.jitter.max).toFixed(2),
            parseFloat(statistics.v6.jitter.min).toFixed(2),
            statistics.v6.jitter.standardDeviation,
        ]);
        data.push([
            'Ping UDP (ms)',
            statistics.v4.pingWEBRTC.standardPerformance,
            statistics.v4.pingWEBRTC.nonStandardPerformance,
            parseFloat(statistics.v4.pingWEBRTC.average).toFixed(2),
            parseFloat(statistics.v4.pingWEBRTC.max).toFixed(2),
            parseFloat(statistics.v4.pingWEBRTC.min).toFixed(2),
            statistics.v4.pingWEBRTC.standardDeviation,
            '',
            statistics.v6.pingWEBRTC.standardPerformance,
            statistics.v6.pingWEBRTC.nonStandardPerformance,
            parseFloat(statistics.v6.pingWEBRTC.average).toFixed(2),
            parseFloat(statistics.v6.pingWEBRTC.max).toFixed(2),
            parseFloat(statistics.v6.pingWEBRTC.min).toFixed(2),
            statistics.v6.pingWEBRTC.standardDeviation,
        ]);
        data.push(['', '']);
        data.push([
            '',
            'IPv4',
            'IPv4',
            'IPv4',
            'IPv4',
            'IPv4',
            'IPv4',
            '',
            '',
            '',
            'IPv6',
            'IPv6',
            'IPv6',
            'IPv6',
            'IPv6',
            'IPv6',
        ])
        data.push([
            'No',
            'Download (Mbps)',
            'Upload (Mbps)',
            'Ping (ms)',
            'Jitter (ms)',
            'Ping UDP (ms)',
            'Lost (%)',
            '',
            '',
            '',
            'Download (Mbps)',
            'Upload (Mbps)',
            'Ping (ms)',
            'Jitter (ms)',
            'Ping UDP (ms)',
            'Lost (%)',
        ])
        results.forEach((value, key) => {
            data.push([
                key,
                value.downloadIPv4,
                value.uploadIPv4,
                value.pingIPv4,
                value.jitterIPv4,
                value.pingWEBRTCIPv4,
                value.packetLostIPv4,
                '',
                '',
                '',
                value.downloadIPv6,
                value.uploadIPv6,
                value.pingIPv6,
                value.jitterIPv6,
                value.pingWEBRTCIPv6,
                value.packetLostIPv6,
            ].join(','))
        })

        let csv_file = this.#arrayToCSVBlob(data);
        let download_link = document.createElement("a");
        download_link.download = 'Group test results ' + this.#dateHolder.getCurrentDateTimeClient();
        download_link.href = window.URL.createObjectURL(csv_file);
        download_link.style.display = "none";
        document.body.appendChild(download_link);
        download_link.click();
    }

    downloadGroupResultHistory(results, statistics) {
        let data = [];
        data.push(['Server name', results.result[0].resultV4.server_name]);
        data.push(['Server address (IPv4)', results.result[0].resultV4.server_address]);
        data.push(['Server address (IPv6)', results.result[0].resultV6.server_address]);
        data.push(['Limit speed (Mbps)', results.speed_limit]);
        data.push(['Thread #', results.thread_count]);
        data.push(['Clients', results.result.length]);
        data.push(['Memo', results.memo]);
        data.push(['','']);
        data.push([
            '',
            'IPv4',
            'IPv4',
            'IPv4',
            'IPv4',
            'IPv4',
            'IPv4',
            '',
            'IPv6',
            'IPv6',
            'IPv6',
            'IPv6',
            'IPv6',
            'IPv6',
        ]);
        data.push([
            '',
            'Std. Perf.',
            'Non Std. Perf.',
            'Avg',
            'Max',
            'Min',
            'Std. devi.',
            '',
            'Std. Perf.',
            'Non Std. Perf.',
            'Avg',
            'Max',
            'Min',
            'Std. devi.',
        ]);
        data.push([
            'Download (Mbps)',
            statistics.v4.download.standardPerformance,
            statistics.v4.download.nonStandardPerformance,
            parseFloat(statistics.v4.download.average).toFixed(2),
            parseFloat(statistics.v4.download.max).toFixed(2),
            parseFloat(statistics.v4.download.min).toFixed(2),
            statistics.v4.download.standardDeviation,
            '',
            statistics.v6.download.standardPerformance,
            statistics.v6.download.nonStandardPerformance,
            parseFloat(statistics.v6.download.average).toFixed(2),
            parseFloat(statistics.v6.download.max).toFixed(2),
            parseFloat(statistics.v6.download.min).toFixed(2),
            statistics.v6.download.standardDeviation,
        ]);
        data.push([
            'Upload (Mbps)',
            statistics.v4.upload.standardPerformance,
            statistics.v4.upload.nonStandardPerformance,
            parseFloat(statistics.v4.upload.average).toFixed(2),
            parseFloat(statistics.v4.upload.max).toFixed(2),
            parseFloat(statistics.v4.upload.min).toFixed(2),
            statistics.v4.upload.standardDeviation,
            '',
            statistics.v6.upload.standardPerformance,
            statistics.v6.upload.nonStandardPerformance,
            parseFloat(statistics.v6.upload.average).toFixed(2),
            parseFloat(statistics.v6.upload.max).toFixed(2),
            parseFloat(statistics.v6.upload.min).toFixed(2),
            statistics.v6.upload.standardDeviation,
        ]);
        data.push([
            'Ping (ms)',
            statistics.v4.ping.standardPerformance,
            statistics.v4.ping.nonStandardPerformance,
            parseFloat(statistics.v4.ping.average).toFixed(2),
            parseFloat(statistics.v4.ping.max).toFixed(2),
            parseFloat(statistics.v4.ping.min).toFixed(2),
            statistics.v4.ping.standardDeviation,
            '',
            statistics.v6.ping.standardPerformance,
            statistics.v6.ping.nonStandardPerformance,
            parseFloat(statistics.v6.ping.average).toFixed(2),
            parseFloat(statistics.v6.ping.max).toFixed(2),
            parseFloat(statistics.v6.ping.min).toFixed(2),
            statistics.v6.ping.standardDeviation,
        ]);
        data.push([
            'Jitter (ms)',
            statistics.v4.jitter.standardPerformance,
            statistics.v4.jitter.nonStandardPerformance,
            parseFloat(statistics.v4.jitter.average).toFixed(2),
            parseFloat(statistics.v4.jitter.max).toFixed(2),
            parseFloat(statistics.v4.jitter.min).toFixed(2),
            statistics.v4.jitter.standardDeviation,
            '',
            statistics.v6.jitter.standardPerformance,
            statistics.v6.jitter.nonStandardPerformance,
            parseFloat(statistics.v6.jitter.average).toFixed(2),
            parseFloat(statistics.v6.jitter.max).toFixed(2),
            parseFloat(statistics.v6.jitter.min).toFixed(2),
            statistics.v6.jitter.standardDeviation,
        ]);
        data.push([
            'Ping UDP (ms)',
            statistics.v4.pingWEBRTC.standardPerformance,
            statistics.v4.pingWEBRTC.nonStandardPerformance,
            parseFloat(statistics.v4.pingWEBRTC.average).toFixed(2),
            parseFloat(statistics.v4.pingWEBRTC.max).toFixed(2),
            parseFloat(statistics.v4.pingWEBRTC.min).toFixed(2),
            statistics.v4.pingWEBRTC.standardDeviation,
            '',
            statistics.v6.pingWEBRTC.standardPerformance,
            statistics.v6.pingWEBRTC.nonStandardPerformance,
            parseFloat(statistics.v6.pingWEBRTC.average).toFixed(2),
            parseFloat(statistics.v6.pingWEBRTC.max).toFixed(2),
            parseFloat(statistics.v6.pingWEBRTC.min).toFixed(2),
            statistics.v6.pingWEBRTC.standardDeviation,
        ]);
        data.push(['','']);
        data.push([
            '',
            'IPv4',
            'IPv4',
            'IPv4',
            'IPv4',
            'IPv4',
            'IPv4',
            '',
            '',
            '',
            'IPv6',
            'IPv6',
            'IPv6',
            'IPv6',
            'IPv6',
            'IPv6',
        ]);
        data.push([
            'No',
            'Download (Mbps)',
            'Upload (Mbps)',
            'Ping (ms)',
            'Jitter (ms)',
            'Ping UDP (ms)',
            'Lost (%)',
            '',
            '',
            '',
            'Download (Mbps)',
            'Upload (Mbps)',
            'Ping (ms)',
            'Jitter (ms)',
            'Ping UDP (ms)',
            'Lost (%)',
        ]);
        results.result.forEach(value=>{
            data.push([
                value.clientID,
                value.resultV4.download,
                value.resultV4.upload,
                value.resultV4.ping,
                value.resultV4.jitter,
                value.resultV4.ping_webrtc,
                value.resultV4.packet_lost,
                '',
                '',
                '',
                value.resultV6.download,
                value.resultV6.upload,
                value.resultV6.ping,
                value.resultV6.jitter,
                value.resultV6.ping_webrtc,
                value.resultV6.packet_lost,
            ].join(','));
        });

        let csv_file = this.#arrayToCSVBlob(data);
        let download_link = document.createElement("a");
        download_link.download = 'Group test results ' + this.#dateHolder.getCurrentDateTimeClient();
        download_link.href = window.URL.createObjectURL(csv_file);
        download_link.style.display = "none";
        document.body.appendChild(download_link);
        download_link.click();
    }
}