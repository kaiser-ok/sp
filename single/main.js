let dateHolder = new DateHolder();
let logger = new Logger(dateHolder);
let clientLogger = new ClientLogger(dateHolder);
let uiWorker = new SingleUIWorker(dateHolder);
let trxAuthMaker = new TrxAuth();
let ipChecker = new IPChecker(uiWorker, trxAuthMaker, logger, dateHolder, clientLogger);
let serversHolder = new ServersHolder(trxAuthMaker, uiWorker, ipChecker, dateHolder);
let sysInfoCollector = new SysInfoCollector();
let reporter = new Reporter(dateHolder, sysInfoCollector);
let latencyWorker = new LatencyWorker(ClientTypes.single, uiWorker, reporter, ipChecker, dateHolder);
let resultsUIWorker = new ResultsUIWorker(dateHolder);
let latencyWorkerWEBRTC = new LatencyWEBRTC(ipChecker, dateHolder, resultsUIWorker);
let ticker = new Ticker(dateHolder);
let speedTestWorker = new SpeedtestWorker(
    ClientTypes.single,
    ticker,
    reporter,
    dateHolder,
    ipChecker,
    latencyWorker,
    clientLogger,
);
let configChecker = new ConfigChecker();
let csvLoader = new CSVLoader(dateHolder);
let authMaker = new Auth();
let openIDAuthMaker = new OpenIDAuth(uiWorker, dateHolder);
let sessionChecker = new SessionChecker();
let translator = new Translator();
let chartWorker = new ChartsWorker();
const advancedWEBTestService = new AdvancedWEBTestService(
    resultsUIWorker,
    uiWorker,
    chartWorker,
    serversHolder,
    reporter,
    dateHolder,
);
let singleWorker = new SingleTestWorker(
    ipChecker,
    serversHolder,
    uiWorker,
    latencyWorker,
    latencyWorkerWEBRTC,
    dateHolder,
    resultsUIWorker,
    speedTestWorker,
    trxAuthMaker,
    configChecker,
    reporter,
    chartWorker,
    advancedWEBTestService,
);
let groupWorker = new Group(authMaker, openIDAuthMaker, sessionChecker, singleWorker);
const releaseNotesHolder = new ReleaseNotesHolder();
const converter = new showdown.Converter();
let testMode = TestModes.USER_SERVER;

uiWorker.enableStartButton();
singleWorker.checkLocalTestSupport();
singleWorker.checkWEB2WEBSupport();
singleWorker.checkHighSpeedSupport();

$('#server__button_change').on('click', function(){
    const sourceServerID=$('#server__select_start').val();
    const targetServerID=$('#server__select_end').val();
    const sourceServerName = serversHolder.getTRXServerByID(sourceServerID).name;
    const targetServerName = serversHolder.getTRXServerByID(targetServerID).name; 

    $('#server__select_start').val(targetServerID);
    $('#server__select_end').val(sourceServerID);

    $('#server__select_start').parent().find('div:eq(0)').text(targetServerName)
    $('#server__select_end').parent().find('div:eq(0)').text(sourceServerName)
});

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
            if ($.trim($('#server__select_website').val())===""){
                openInfoPopup(currentLanguage.mess__server__to__url__empty);
                return false;
            }

            $('button[data-id="testmode"]').prop('disabled', true);
            singleWorker.startServerURLTest();
            break;
    }   
}

I('download-results-ipv4__button').onclick = () => {
    csvLoader.downloadIPv4Results(serversHolder.getTRXServerByID(uiWorker.getTRXServerID()));
}

I('download-results-ipv6__button').onclick = () => {
    csvLoader.downloadIPv6Results(serversHolder.getTRXServerByID(uiWorker.getTRXServerID()));
}

I('popup-login__btn').onclick = () => {
    groupWorker.becomeAMaster(Group.AUTH_STANDARD, I('username').value, I('password').value);
}

I('popup-openid__btn').onclick = () => {
    groupWorker.becomeAMaster(Group.AUTH_OPEN_ID, I('username').value, I('password').value);
    cookie.set(Cookie.KEY_INFO, JSON.stringify({language: translator.getCurrentLanguage()}), 10 * Cookie.TTL_MINUTE);
}

I('btn-become-master').onclick = () => {
    let owner = null;
    let username = cookie.get(Cookie.KEY_STANDARD_AUTH);
    if (isUserLoggedIn() && cookie.get(Cookie.KEY_OPEN_ID_STATE) === null) {
        owner = Group.OWNER_STANDARD;
    } else if (cookie.get(Cookie.KEY_OPEN_ID_STATE) !== null) {
        owner = Group.OWNER_OPEN;
    }
    groupWorker.goToShareSession(username, owner);
}

I('popup-btn__join').onclick = () => {
    if (I('session__id').value === '') {
        openInfoPopup(currentLanguage.mess__session__empty);
        return;
    }

    if (isNaN(parseInt(I('session__id').value))) {
        openInfoPopup(currentLanguage.mess__session__format);
        return;
    }

    groupWorker.joinToGroup(I('session__id').value);
}

I('btn-dropdown').onclick = () => {
    if (isUserLoggedIn() || cookie.get(Cookie.KEY_OPEN_ID_STATE) !== null) {
        I('div-login').classList.toggle("show");
    } else {
        I('div-no_login').classList.toggle("show");
    }
}

I('btn-history').onclick = () => {
    let owner = null;
    if (isUserLoggedIn() && cookie.get(Cookie.KEY_OPEN_ID_STATE) === null) {
        owner = Group.OWNER_STANDARD;
    } else if (cookie.get(Cookie.KEY_OPEN_ID_STATE) !== null) {
        owner = Group.OWNER_OPEN;
    }
    window.location.assign(getLocationAddress() + Dashboard.HISTORY_SINGLE_PATH
        + '?owner=' + owner);
}

I('btn-upload__memo').onclick = () => {
    if (isUserLoggedIn() && cookie.get(Cookie.KEY_OPEN_ID_STATE) === null) {
        singleWorker.uploadMemo(I('memo__input').value, Group.OWNER_STANDARD);
    } else if (cookie.get(Cookie.KEY_OPEN_ID_STATE) !== null) {
        cookie.set(Cookie.KEY_MEMO, I('memo__input').value, 10 * Cookie.TTL_MINUTE);
        cookie.set(Cookie.KEY_OPEN_ID_INFO, JSON.stringify({is_single: true}), 10 * Cookie.TTL_MINUTE);
        location.reload();
    } else {
        groupWorker.disableRedirect();
        popupOpen(I('popup-login'));
    }
}

I('btn-logout').onclick = () => {
    logout();
}

I('btn-web2web').onclick = () => {
    window.location.assign(getLocationAddress() + '/web2web');
}

$('button[data-id="testmode"]').on('click', function(){
    uiWorker.onChangeTestMode($(this))
});

let serverSelectChoiceSource;
if (I('server__select_start')!=undefined && I('server__select_start')!=null){
    serverSelectChoiceSource=new Choices(I('server__select_start'), {
        shouldSort: false,
        position: 'bottom',
        searchEnabled: false,
    });

    const menu = I('server__select_start').parentElement.parentElement.querySelector(":scope > div");
    uiWorker.modifyMenu(menu)
}

let serverSelectChoiceTarget;
if (I('server__select_end')!==undefined && I('server__select_end')!=null){
    serverSelectChoiceTarget=new Choices(I('server__select_end'), {
        shouldSort: false,
        position: 'bottom',
        searchEnabled: false,
    });
    const menu = I('server__select_end').parentElement.parentElement.querySelector(":scope > div");
    uiWorker.modifyMenu(menu)
}

let serverSelectChoiceSourceURL;
if (I('server__select_web_start')!==undefined && I('server__select_web_start')!=null){
    serverSelectChoiceSourceURL=new Choices(I('server__select_web_start'), {
        shouldSort: false,
        position: 'bottom',
        searchEnabled: false,
    });
    const menu = I('server__select_web_start').parentElement.parentElement.querySelector(":scope > div");
    uiWorker.modifyMenu(menu)
}

$('#btn-high-speed').on('click', function(){
    uiWorker.onGetHighSpeedList($(this))
});

$('#high-speed__add').on('click', function(){
    uiWorker.onAddHighSpeedUser($(this))
});

singleWorker.singleSignOnLogin();

I('btn-login').onclick = () => {
    I('popup-openid__btn').click()
}

$('#highspeedListAddBt1').on('click', function(){
    const pTr=$(this).parent().parent();

    if ($(this).text()==='+'){
        pTr.find('td[data-hidden]').attr('data-hidden', '0')
        $(this).text('-');
    }else{
        pTr.find('td[data-hidden]').attr('data-hidden', '1')
        $(this).text('+');
    }
});
