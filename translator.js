class TranslatorCommon {
    constructor() {
        this.translatePage();
    }


    /**
     * Translates all page's elements
     * @returns {Promise<void>}
     */
    async #translateAllElements() {
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
                currentLanguageCommon = EnglishLanguageCommon;
                break;

            case Languages.traditionalChinese:
                currentLanguageCommon = TraditionalChineseLanguageCommon;
                break;
        }

        this.#translateAllElements();
    }
}


let currentLanguageCommon = {}


const EnglishLanguageCommon = {
    select__load: 'Loading.....',
}


const TraditionalChineseLanguageCommon = {
    select__load: '載入中.....',
}
