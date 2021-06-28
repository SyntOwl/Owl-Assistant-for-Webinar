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

    const store = Require('./store');

    async function Initialize() {
        await store.Initialize();
        await store.PerformMigrations();
        await InitializeStoredGlobals();
    }

    Initialize();

    let enableExt = true;
    let enableCatchMessagesAboutOffline = false;

    function InitializeStoredGlobals() {
        return new Promise(resolve => {
            store.get(store.defOpt, function (item) {
                enableExt = item.enableExt;
                enableCatchMessagesAboutOffline = item.enableCatchMessagesAboutOffline;
                UpdateState();
                resolve();
            });
        });
    }


    chrome.storage.onChanged.addListener(async function (changes, areaName) {
        if (areaName === 'local') {
            if ('enableExt' in changes) {
                enableExt = changes.enableExt.newValue;
                UpdateState();
            }
        }
        if ('enableCatchMessagesAboutOffline' in changes) {
            enableCatchMessagesAboutOffline = changes.enableCatchMessagesAboutOffline.newValue;
        }
    });

    function UpdateState() {
        if (!chrome.tabs) return;

        let iconState = 'active';

        if (!enableExt) {
            iconState = 'disabled';
        }

        chrome.browserAction.setTitle({
            title: 'Owl-Assistant ' + ((iconState === 'active') ? '' : ' (' + iconState + ')')
        });

        if ('setIcon' in chrome.browserAction) {
            chrome.browserAction.setIcon({
                path: {
                    38: 'icons/icon-' + iconState + '-38.png'
                }
            });
        }
    }

    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {

        const responses = {
            Get_option: () => {
                for (let prop in message.object) {
                    if (prop in store.defOpt) {
                        message.object[prop] = store.defOpt[prop];
                    }
                }
                store.get(message.object, sendResponse);
                return true;
            },
            Set_option: () => {
                store.set(message.object, item => {
                    if (sendResponse) {
                        sendResponse(item);
                    }
                });
                return true;
            },
            Get_default_data: () => {
                sendResponse(store.defOpt);
                return true;
            }
        };
        if (message.type in responses) {
            return responses[message.type]();
        }
    });

    /**
     * nestedRead reads a property from a nested structure, returning null if the property does not exist
     * @param {object} Structure
     * @param {array} PropertyList
     * @returns {mixed}
     *
     */
    function nestedRead(Structure, PropertyList) {
        let current = Structure;
        for (let i = 0; i < PropertyList.length; i++) {
            if (!current.hasOwnProperty(PropertyList[i])) {
                return null;
            }
            current = current[PropertyList[i]];
        }
        return current;
    }

    function skipRequest(Info) {
        let isFocused = (nestedRead(Info, ['requestBody', 'formData', 'isFocused', 0]) === "false");
        let isSoundEnabled = (nestedRead(Info, ['requestBody', 'formData', 'isSoundEnabled', 0]) === "false");
        let isVideoEnabled = (nestedRead(Info, ['requestBody', 'formData', 'isVideoEnabled', 0]) === "false");

        return !((isFocused || isSoundEnabled || isVideoEnabled) && enableCatchMessagesAboutOffline && enableExt);
    }

    chrome.webRequest.onBeforeRequest.addListener(
        function (Info) {
            if (skipRequest(Info)) {
                return {};
            }
            return {cancel: true};
        },
        {urls: ["*://events.webinar.ru/*"], types: ["xmlhttprequest"]},
        ['requestBody', 'blocking']
    );

})(typeof exports == 'undefined' ? Require.scopes.background = {} : exports);