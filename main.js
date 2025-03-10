const scrollBtn = document.querySelector('.go-to-top');
const coords = document.documentElement.clientHeight;

let preferredLanguage = localStorage.getItem('current_language');
if (preferredLanguage === null || preferredLanguage === undefined) {
    preferredLanguage = 'zh';
}

I('language__select').onchange = () => {
    preferredLanguage = I('language__select').value;
    localStorage.setItem('current_language', I('language__select').value);
    translator.translatePage();
}

I('language__select').value = preferredLanguage;

let translatorComm = new TranslatorCommon();
translatorComm.translatePage();

let serverSelectChoice;
if (I('server__select')!=undefined && I('server__select')!=null){
    serverSelectChoice=new Choices(I('server__select'), {
        shouldSort: false,
        position: 'bottom',
        searchEnabled: false,
    });

    const menu = I('server__select').parentElement.parentElement.querySelector(":scope > div");
    
    if (menu) {
        const firstChildDiv = menu.querySelector(":scope > div");
        
        if (firstChildDiv) {
            firstChildDiv.classList.add('selectChoiceAdjust')
            firstChildDiv.textContent = currentLanguageCommon.select__load;
        }
    }
}

window.onscroll = () => {
    if (window.scrollY > coords) {
        scrollBtn.classList.add('go-to-top--show');
    } else {
        scrollBtn.classList.remove('go-to-top--show');
    }
}

scrollBtn.onclick = () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth",
    });
}