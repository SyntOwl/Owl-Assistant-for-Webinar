//                  >>>   Owl-Assistant for Webinar GPL v3   <<<
//                              Programmer: SyntOwl
//                        Contact Email: syntowl@gmail.com
//
//     Owl-Assistant for Webinar is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
//     Owl-Assistant for Webinar is distributed in the hope that it will be useful,
//     but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
//     You should have received a copy of the GNU General Public License
// along with Foobar.  If not, see <https://www.gnu.org/licenses/>.
"use strict";

(function (exports) {

    const defOpt = Object.freeze({
        enableExt: true,
        millisecondsBetweenMainLoopIntervals: 1000,

        enableCheckerPresenceControl: true,
        xPathConfirmButtonActivityChecker: '//*[contains(@class,"ModalTitle") and contains(text(), "Контроль присутствия")]/..//./button[contains(span/span/text(),"Подтверждаю")]',
        xPathCloseButtonActivityChecker: '//*[contains(@class,"ModalContent")]/..//./button[contains(span/text(),"Закрыть")]',

        enableCheckerConnectionQuality: true,
        xPathCloseButtonConnectionQuality: '//*[contains(@class,"popup")]/.//button[contains(span/text(),"Не сейчас")]',

        enableCheckerHints: true,
        xPathCloseButtonHints: '//*[contains(@class,"popup")]/.//button[contains(span/text(),"Понятно")]',

        enableCatchMessagesAboutOffline: false,

        enableAutoTwinkle: true,
        keyTwinkle: 70, // F
        xPathTwinkleButton: '//*[contains(@class, "Reaction") and contains(@class, "rippleContainer")]',

        audioVolume: 1,
    })

    function Initialize() {
        return new Promise(resolve => {
            SetStorage(chrome.storage.local);
            resolve();
        });
    }

    async function PerformMigrations() {
        let nowVersion = chrome.runtime.getManifest().version;
        let lastVersion = await GetPromise('lastVersion', 0);
        if (nowVersion !== lastVersion) {
            chrome.storage.local.clear();
            await SetPromise("lastVersion", nowVersion);
        }
    }

    /* Storage promise setters and getters */

    function GenericGetPromise(key, default_val, storage) {
        return new Promise(res => storage.get({[key]: default_val}, data => res(data[key])));
    }

    function GenericSetPromise(key, value, storage) {
        return new Promise(res => storage.set({[key]: value}, res));
    }

    function GetPromise(key, default_val) {
        return GenericGetPromise(key, default_val, exports);
    }

    function SetPromise(key, value) {
        return GenericSetPromise(key, value, exports);
    }

    function LocalGetPromise(key, default_val) {
        return GenericGetPromise(key, default_val, chrome.storage.local);
    }

    function LocalSetPromise(key, value) {
        return GenericSetPromise(key, value, chrome.storage.local);
    }


    const local = {
        get: (...args) => chrome.storage.local.get(...args),
        set: (...args) => chrome.storage.local.set(...args),
        remove: (...args) => chrome.storage.local.remove(...args),
        get_promise: LocalGetPromise,
        set_promise: LocalSetPromise
    };

    function SetStorage(store) {
        Object.assign(exports, {
            get: store.get.bind(store),
            set: store.set.bind(store),
            remove: store.remove.bind(store),
            get_promise: GetPromise,
            set_promise: SetPromise,
            local
        });
        chrome.runtime.sendMessage("store_initialized");
    }

    Object.assign(exports, {
        Initialize,
        PerformMigrations,
        defOpt
    });

})(typeof exports == 'undefined' ? Require.scopes.store = {} : exports);