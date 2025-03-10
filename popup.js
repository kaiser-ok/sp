const popupLinks = document.querySelectorAll('.popup-link');
const body = document.body;
const lockPadding = document.querySelectorAll(".lock-padding");

let unlock = true;

const timeout = 800;

if (popupLinks.length > 0) {
    for (let index = 0; index < popupLinks.length; index++) {
        const popupLink = popupLinks[index];
        popupLink.addEventListener("click", function (e) {
            const popupName = popupLink.getAttribute('data-path');
            const curentPopup = document.getElementById(popupName);
            popupOpen(curentPopup);
            e.preventDefault();
        });
    }
}

const popupCloseIcon = document.querySelectorAll('.close-popup');

if (popupCloseIcon.length > 0) {
    for (let index = 0; index < popupCloseIcon.length; index++) {
        const el = popupCloseIcon[index];
        el.addEventListener('click', function (e) {
            popupClose(el.closest('.popup'));
            e.preventDefault();
        });
    }
}


/**
 * Opens popup window
 * @param curentPopup - current window
 */
function popupOpen(curentPopup) {
    if (curentPopup && unlock) {
        const popupActive = document.querySelector('.popup.open');
        if (popupActive) {
            popupClose(popupActive, false);
        } else {
            bodyLock();
        }
        curentPopup.classList.add('open');
        curentPopup.addEventListener("click", function (e) {
            if (!e.target.closest('.popup__content')) {
                popupClose(e.target.closest('.popup'));
            }
        });
    }
}


/**
 * Closes popup window
 * @param popupActive  - current window
 * @param doUnlock - unlock flag
 */
function popupClose(popupActive, doUnlock = true) {
    if (unlock) {
        popupActive.classList.remove('open');
        if (doUnlock) {
            bodyUnLock();
        }
    }
}


/**
 * Locks HTML body
 */
function bodyLock() {
    const lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';

    if (lockPadding.length > 0) {
        for (let index = 0; index < lockPadding.length; index++) {
            const el = lockPadding[index];
            el.style.paddingRight = lockPaddingValue;
        }
    }
    body.style.paddingRight = lockPaddingValue;
    body.classList.add('lock');

    unlock = false;
    setTimeout(function () {
        unlock = true;
    }, timeout);
}


/**
 * Unlocks HTML body
 */
function bodyUnLock() {
    setTimeout(function () {
        if (lockPadding.length > 0) {
            for (let index = 0; index < lockPadding.length; index++) {
                const el = lockPadding[index];
                el.style.paddingRight = '0px';
            }
        }
        body.style.paddingRight = '0px';
        body.classList.remove('lock');
    }, timeout);

    unlock = false;
    setTimeout(function () {
        unlock = true;
    }, timeout);
}


document.addEventListener('keydown', function (e) {
    if (e.key === "Escape") {
        const popupActive = document.querySelector('.popup.open');
        popupClose(popupActive);
    }
});


const forms = document.querySelectorAll('.popup__form');
forms.forEach((form) => {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        unlock = true;
    });
});

function openInfoPopup(messageText, confirmText = 'OK') {
    I('popup-info__text').innerText = messageText;
    I('popup-info__close').innerText = confirmText;
    popupOpen(I('popup-info'));
}

function openWarningPopup(
    messageText,
    confirmText = 'OK',
    cancelText = 'CANCEL',
    confirmFunction = function () {
        popupClose(I('popup-warning'));
    }) {
    I('popup-warning__text').innerText = messageText;
    I('warning-ok__btn').innerText = confirmText;
    I('warning-cancel__btn').innerText = cancelText;
    I('warning-ok__btn').onclick = confirmFunction;
    I('warning-cancel__btn').onclick = function () {
        popupClose(I('popup-warning'));
    };
    popupOpen(I('popup-warning'));
}

function openReleaseNotePopup(releaseNoteHTML, confirmText = 'OK') {
    I('popup-info__text').innerHTML = releaseNoteHTML;
    I('popup-info__text').classList.add('left-align');
    I('popup-info__close').innerText = confirmText;
    popupOpen(I('popup-info'));
}

I('popup-info__close').onclick = () => {
    popupClose(I('popup-info'));
}