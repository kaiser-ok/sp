class Translator {
    constructor() {
        this.translatePage();
    }


    /**
     * Translates all page's elements
     * @returns {Promise<void>}
     */
    async #translateAllElements() {
        this.#translateElement('speed_test_title', currentLanguage.test_title);
        this.#translateElement('btn-join__room', currentLanguage.btn__join__room);
        this.#translateElement('btn-release__note', currentLanguage.btn__release__note);
        this.#translateElement('btn-login', currentLanguage.btn__login);
        this.#translateElement('btn-history', currentLanguage.btn__history);
        this.#translateElement('btn-become-master', currentLanguage.btn__become__master);
        this.#translateElement('btn-logout', currentLanguage.btn__logout);
        this.#translateElement('btn-local', currentLanguage.btn__local_test);
        this.#translateElement('btn-web2web', currentLanguage.btn__web2web);

        this.#translateElement('label-time__text', currentLanguage.label__time__text);
        this.#translateElement('label-ipv4__text', currentLanguage.label__ipv4__text);
        this.#translateElement('label-ipv6__text', currentLanguage.label__ipv6__text);

        this.#translateElement('label-server__text', currentLanguage.label__server__text);

        this.#translateElement('label-server__satrt__text', currentLanguage.label__server__source__text);
        this.#translateElement('label-server__end__text', currentLanguage.label__server__target__text);
        this.#translateElement('label-server__satrt__web__text', currentLanguage.label__server__source__url__text);
        this.#translateElement('label-server__urlip__text', currentLanguage.label__server__url__text);
        $('#server__select_website').attr('placeholder', currentLanguage.input__server__url__text);

        this.#translateElement('label-rate__text', currentLanguage.label_rate);
        this.#translateElement('label-thread__text', currentLanguage.label__thread__text);
        this.#translateElement('label-run__text', currentLanguage.label__run__text);

        this.#translateElement('btn-start', currentLanguage.btn__start);
        this.#translateElement('btn-wait', currentLanguage.btn__test__again);

        this.#translateElement('label-download__text', currentLanguage.label__download__text);
        this.#translateElement('label-upload__text', currentLanguage.label__upload__text);
        this.#translateElement('label-ping__text', currentLanguage.label__ping__text);
        this.#translateElement('label-jitter__text', currentLanguage.label__jitter__text);
        this.#translateElement('label-webrtc__text', currentLanguage.label__ping_webrtc__text);
        this.#translateElement('label-lost__text', currentLanguage.label__lost__text);

        this.#translateElement('label-test__results__v4', currentLanguage.label__test__results__v4);
        this.#translateElement('label-test__results__v6', currentLanguage.label__test__results__v6);

        this.#translateElement('label-test__results__v4_s2w', currentLanguage.label__test__results);

        this.#translateElement('btn-upload__memo', currentLanguage.btn__upload__memo);
        this.#translateElement('btn-upload__memo_span', currentLanguage.btn__upload__memo__span);

        this.#translateElement('popup-login__title', currentLanguage.popup__login__title);
        this.#translateElement('popup-login__btn', currentLanguage.popup__login__btn);

        this.#translateElement('popup-join__room__title', currentLanguage.popup__join__room__title);
        this.#translateElement('popup-btn__join', currentLanguage.popup__btn__join);

        this.#translateElement('popup-session__title', currentLanguage.popup__session__title);
        this.#translateElement('popup-session__new__group__label', currentLanguage.popup__session__new__group__label);
        this.#translateElement('popup-session__old__group__label', currentLanguage.popup__session__old__group__label);

        this.#translateElement('label-runid__text', currentLanguage.label__runid__text);
        this.#translateElement('public__ipv4__failed', currentLanguage.mess_detection_ip4_failed);
        this.#translateElement('public__ipv6__failed', currentLanguage.mess_detection_ip6_failed);

        this.#translateElement('server__div__level__0', currentLanguage.server__div__level__0);
        this.#translateElement('server__div__level__1', currentLanguage.server__div__level__1);
        this.#translateElement('server__div__level__2', currentLanguage.server__div__level__2);
        this.#translateElement('server__div__level__3', currentLanguage.server__div__level__3);

        this.#translateElement('testmode__u2s', currentLanguage.testMode__user__server);
        this.#translateElement('testmode__s2s', currentLanguage.testMode__server__server);
        this.#translateElement('testmode__s2w', currentLanguage.testMode__server__website);

        this.#translateElement('charts__title__ip_v4_s2w', currentLanguage.test__line_quality);
        this.#translateElement('description__tip__ip_v4_s2w', currentLanguage.test__server_url_description_tip);
        this.#translateElement('description__ip_v4_s2w', currentLanguage.test__server_url_description);

        $('th[data-label="test_server_start"]').text(currentLanguage.test__server_start);
        $('th[data-label="respond_host"]').text(currentLanguage.respond_host);

        $('div[data-label="test_trace_route"]').find("span:eq(0)").text(currentLanguage.test__server_url_description_tip);
        $('div[data-label="test_trace_route"]').find("span:eq(1)").text(currentLanguage.test_trace_route);
        $('div[data-label="test_ICMP"]').find("span:eq(0)").text(currentLanguage.test__server_url_description_tip);
        $('div[data-label="test_ICMP"]').find("span:eq(1)").text(currentLanguage.test_ICMP);

        $('span[data-label="max"]').text(currentLanguage.label_max);
        $('span[data-label="min"]').text(currentLanguage.label_min);
        $('span[data-label="avg"]').text(currentLanguage.label_avg);
        $('span[data-label="avgDev"]').text(currentLanguage.label_average_deviation);
        $('span[data-label="deliver"]').text(currentLanguage.label_deliver);
        $('span[data-label="receive"]').text(currentLanguage.label_receive);
        $('span[data-label="lost"]').text(currentLanguage.label_lost);

        I('memo__input').placeholder = currentLanguage.memo__input__placeholder;

        $('*[data-label="high-speed__title"]').text(currentLanguage.high_speed_title);
        $('*[data-label="high-speed__tip"]').text(currentLanguage.high_speed_tip);
        
        $('*[data-label="high-speed__account"]').text(currentLanguage.high_speed_account);

        $('*[data-label="high-speed__name"]').text(currentLanguage.high_speed_name);
        $('*[data-label="high-speed__permissions"]').text(currentLanguage.high_speed_permissions);
        $('*[data-label="high-speed__operate"]').text(currentLanguage.high_speed_operate);

        $('*[data-label="high-speed_placeholder_account"]').attr('placeholder', currentLanguage.high_speed_placeholder_account);
        $('*[data-label="high-speed_placeholder_name"]').attr('placeholder', currentLanguage.high_speed_placeholder_name);
        
        $('*[data-label="high-speed__manager"]').text(currentLanguage.high_speed_manager);
        $('*[data-label="high-speed__delete"]').text(currentLanguage.high_speed_delete);
        $('*[data-label="high-speed__add"]').text(currentLanguage.high_speed_add);
        $('#start_test_to_url_wait_title').text(currentLanguage.test_to_url_wait_title);

        $('table[data-id="serverUrlThreshold"]').find('th[data-id="state"]').text(currentLanguage.server_url_Threshold_state);
        $('table[data-id="serverUrlThreshold"]').find('th[data-id="rsponseTime"]').text(currentLanguage.server_url_Threshold_response_time);
        $('table[data-id="serverUrlThreshold"]').find('th[data-id="description"]').text(currentLanguage.server_url_Threshold_description);

        $('table[data-id="serverUrlThreshold"]').find('td[data-id="state_good"]').text(currentLanguage.server_url_Threshold_state_good);
        $('table[data-id="serverUrlThreshold"]').find('td[data-id="description_good"]').text(currentLanguage.server_url_Threshold_description_good);

        $('table[data-id="serverUrlThreshold"]').find('td[data-id="state_ordinary"]').text(currentLanguage.server_url_Threshold_state_ordinary);
        $('table[data-id="serverUrlThreshold"]').find('td[data-id="description_ordinary"]').text(currentLanguage.server_url_Threshold_description_ordinary);

        $('table[data-id="serverUrlThreshold"]').find('td[data-id="state_congestion"]').text(currentLanguage.server_url_Threshold_state_congestion);
        $('table[data-id="serverUrlThreshold"]').find('td[data-id="description_congestion"]').text(currentLanguage.server_url_Threshold_description_congestion);

    }


    /**
     * Translates page to the selected language
     * @returns {Promise<void>}
     */
    async #translateElement(elementID, text) {
        if (I(elementID)){
            I(elementID).innerText = text;
        }
    }


    /**
     * Translates page to the selected language
     * @returns {Promise<void>}
     */
    async translatePage() {
        switch (I('language__select').value) {
            case Languages.english:
                currentLanguage = EnglishLanguage;
                break;

            case Languages.traditionalChinese:
                currentLanguage = TraditionalChineseLanguage;
                break;
        }

        this.#translateAllElements();
    }

    /**
     * Returns current language tag
     * @returns {string}
     */
    getCurrentLanguage(){
        switch (currentLanguage) {
            case EnglishLanguage:
                return Languages.english;
            case TraditionalChineseLanguage:
                return Languages.traditionalChinese;
        }
    }
}


let currentLanguage = {}


const EnglishLanguage = {
    test_title: 'TANet - SpeedTest',
    btn__join__room: 'Join Room',
    btn__release__note: 'Website Note',
    btn__login: 'Single sign-on for education system',
    btn__history: 'History',
    btn__become__master: 'Become Master',
    btn__logout: 'Logout',
    btn__local_test: 'Local Test',
    btn__web2web: 'Web2Web Test',

    label__time__text: 'Time:',
    label__ipv4__text: 'IPv4:',
    label__ipv6__text: 'IPv6:',
    label__server: 'Server:',
    label__runid__text: 'Run ID:',

    label__server__text: 'Server',
    label__server__source__text: 'Server start',
    label__server__target__text: 'Server end',
    label__server__source__url__text: 'Server start',
    label__server__url__text: 'Destination Domain or IP',
    input__server__url__text: 'Please enter the URL or IP',
    label__thread__text: 'Thread #',
    label__run__text: 'Run',

    btn__start: 'Start',
    btn__test__again: 'Please wait',

    label__download__text: 'Download',
    label__upload__text: 'Upload',
    label__ping__text: 'Ping',
    label__jitter__text: 'Jitter',
    label__ping_webrtc__text: 'Ping UDP',
    label__lost__text: 'Lost',

    label__test__results: 'Test results',
    label__test__results__v4: 'Test results IPv4',
    label__test__results__v6: 'Test results IPv6',

    btn__upload__memo: 'Storing test results',
    btn__upload__memo__span: '(Login permission required)',
    memo__input__placeholder: 'Test memo',

    popup__login__title: 'Login',
    popup__login__btn: 'Login',

    popup__join__room__title: 'Join room',
    popup__btn__join: 'Join',

    popup__session__title: 'You have the group',
    popup__session__new__group__label: 'Create new group',
    popup__session__old__group__label: 'Connect to existing group ID=',

    mess__session__empty: 'Session ID can not be empty! Please input session ID',
    mess__server__to__url__empty: 'Destination domain or IP can not be empty! Please input Destination domain or IP',
    mess__session__format: 'Session ID should be numeric! Please input the correct session ID',
    mess__login__failed: 'Login failed. Please input correct username and password',
    mess__login__success: 'Successfully logged in',
    mess__upload__success: 'Report successfully uploaded.',
    mess__local_test: 'The local test can be unavailable for your network. \n' +
        'Are you sure you want to go to the local test page?',

    mess__server__unreachable: 'Server connection failed',
    mess_detection_ip4_failed: 'IPv4 detection failed',
    mess_detection_ip6_failed: 'IPv6 detection failed',

    server__div__level__0: 'Ministry of Education',
    server__div__level__1: 'Main Node Network',
    server__div__level__2: 'Local Area Network (LAN)',
    server__div__level__3: 'Education Network',

    testMode__user__server:'User → Server',
    testMode__server__server:'Server → Server',
    testMode__server__website:'Server → Website',

    test__line_quality:'Network line quality test',
    test__server_start:'IP',
    respond_host:'Host',
    test_trace_route:'Use Trace Route to test the number and status of routes',
    test_ICMP:'Test IP 20 times continuously using ICMP and output the results',
    label_max:'Max',
    label_min:'Min',
    label_avg:'Average',
    label_average_deviation:'Average deviation',
    label_deliver:'Deliver',
    label_receive:'Receive',
    label_lost:'Lost',
    select_load:'Loading.....',

    message_equal__source__and__target: "Source and target server can not be the same",
    label_rate:'Select rate',

    high_speed_title:'High-Speed test account list',
    high_speed_tip:'※ The accounts set up here all have 100GB speed test privileges :',
  
    high_speed_account:'Account',
    high_speed_name:'Name',
    high_speed_permissions:'Permissions',
    high_speed_operate:'Operate',
    high_speed_manager:'Manager',
    high_speed_add:'Add',
    high_speed_delete:'Delete',
    high_speed_placeholder_account:'Please enter account',
    high_speed_placeholder_name:'Please enter name',
    high_speed_tip_need:'Account is required!',
    high_speed_tip_delete:'Are you sure you want to delete this data?',
    high_speed_tip_repeat:'The account number is duplicated, please re-enter!',
    test__server_url_description_tip:'Test method : ',
    test__server_url_description:'Test 20 times in sequence with HTTP Method HEAD (each test timeout is 3 seconds), and the total test time will be terminated immediately if it exceeds 5 seconds), calculate the average response time (ms), and use colors to indicate its status. If the endpoint does not support the HTTP communication protocol, it will display "No data"',
    test_to_url_wait_title:'Testing',

    server_url_Threshold_state:'state',
    server_url_Threshold_response_time:'Response time (latency)',
    server_url_Threshold_description:'description',

    server_url_Threshold_state_good:'good',
    server_url_Threshold_description_good:'The server responds quickly and the network is stable',

    server_url_Threshold_state_ordinary:'ordinary',
    server_url_Threshold_description_ordinary:'General network conditions, which may be affected by region or load',

    server_url_Threshold_state_congestion:'congestion',
    server_url_Threshold_description_congestion:'There may be network congestion, high server load, or ISP issues.',
}


const TraditionalChineseLanguage = {
    test_title: 'TANet 網路品質檢測',
    btn__join__room: '加入群組',
    btn__release__note: '網站説明',
    btn__login: '教育體系單一簽入',
    btn__history: '測試歷史',
    btn__become__master : '群組測試',
    btn__logout : '登出',
    btn__local_test: '區域網路測試',
    btn__web2web: '網頁對網頁測試',

    label__time__text: '時間:',
    label__ipv4__text: 'IPv4:',
    label__ipv6__text: 'IPv6:',
    label__server: '測速對象:',
    label__runid__text: '執行ID:',

    label__server__text: '測速對象',
    label__server__source__text: '測速起點',
    label__server__target__text: '測速終點',
    label__server__source__url__text: '測試起點',
    label__server__url__text: '目標網址或IP',
    input__server__url__text: '請輸入網址或IP',
    label__thread__text: '測速連線數',
    label__run__text: '開始測試',

    btn__start: '開始',
    btn__test__again: '請稍後',

    label__download__text: '下載',
    label__upload__text: '上傳',
    label__ping__text: '延遲',
    label__jitter__text: '抖動',
    label__ping_webrtc__text: 'UDP延遲',
    label__lost__text: '封包遺失',

    label__test__results: '測試結果',
    label__test__results__v4: '測試結果 IPv4',
    label__test__results__v6: '測試結果 IPv6',

    btn__upload__memo: '儲存測試結果',
    btn__upload__memo__span: '(需具登入權限)',
    memo__input__placeholder: '測試註記',

    popup__login__title: '管理者登入',
    popup__login__btn: '管理者登入',

    popup__join__room__title: '加入群組',
    popup__btn__join: '加入群組',

    popup__session__title: '選擇測試連線',
    popup__session__new__group__label: '新連線',
    popup__session__old__group__label: '續用既有群組 ID:',

    mess__session__empty: '測試ID 不能為空白！ 請輸入測試ID',
    mess__server__to__url__empty: '目標網址或IP不能為空白! 請輸入測試的目標網址或IP',
    mess__session__format: '測試ID 應該是數字！ 請輸入正確的測試ID',
    mess__login__failed: '登入失敗。 請輸入正確的用戶名和密碼',
    mess__login__success: '登入成功',
    mess__upload__success: '上傳成功',
    mess__local_test: '環境不支援區域網路連線測試 . \n' +
        '是否仍要繼續？',

    mess__server__unreachable: '測速對象連線失敗',
    mess_detection_ip4_failed: 'IPv4 偵測失敗',
    mess_detection_ip6_failed: 'IPv6 偵測失敗',

    server__div__level__0: '教育部',
    server__div__level__1: '主節點網路',
    server__div__level__2: '區域網路',
    server__div__level__3: '教育網路',

    testMode__user__server:'用戶 → 節點',
    testMode__server__server:'節點 → 節點',
    testMode__server__website:'節點 → 網站',
    
    test__line_quality:'線路品質測試',
    test__server_start:'IP',
    respond_host: 'Host',
    test_trace_route:'以 Trace Route 方式來測試路由數量及狀態',
    test_ICMP:'以 ICMP 連續測試 IP 20 次，並輸出結果',
    label_max:'最大',
    label_min:'最小',
    label_avg:'平均',
    label_average_deviation:'平均偏差',
    label_deliver:'傳送',
    label_receive:'接收',
    label_lost:'遺失',

    message_equal__source__and__target: "Source and target server can not be the same",
    select_load:'載入中.....',
    label_rate:'選擇速率',

    high_speed_title:'高速測速帳號清單',
    high_speed_tip:'※ 此處設定之帳號均有100G測速權限：',
    high_speed_account:'帳號',
    high_speed_name:'姓名',
    high_speed_permissions:'權限',
    high_speed_operate:'操作',
    high_speed_manager:'管理者',
    high_speed_add:'新增',
    high_speed_delete:'刪除',
    high_speed_placeholder_account:'請輸入帳號',
    high_speed_placeholder_name:'請輸入姓名',
    high_speed_tip_need:'帳號必需要輸入!',
    high_speed_tip_delete:'您碼定要刪除這筆資料嗎?',
    high_speed_tip_repeat:'帳號重複, 請重新輸入!',
    test__server_url_description_tip:'測試方法：',
    test__server_url_description:'以 Http(s) Method HEAD 依序測試 10 次(單次測試逾時 3 秒，測試總時間大於 5 秒將立即終止)，計算回應時間(ms)均值，並以顏色表示其狀態，若目標或網址IP不支援HTTP通訊協定將顯示「無數據」',
    test_to_url_wait_title:'測試中',

    server_url_Threshold_state:'狀態',
    server_url_Threshold_response_time:'響應時間（延遲）',
    server_url_Threshold_description:'說明',

    server_url_Threshold_state_good:'良好',
    server_url_Threshold_description_good:'伺服器響應快速，網路穩定',

    server_url_Threshold_state_ordinary:'普通',
    server_url_Threshold_description_ordinary:'一般網路狀況，可能受區域或負載影響',

    server_url_Threshold_state_congestion:'擁塞',
    server_url_Threshold_description_congestion:'可能有網路擁塞、伺服器負載高、或 ISP 問題',
}