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

/**
 * Fill in content into the popup on load
 */
document.addEventListener("DOMContentLoaded", function () {
    UpdateEnabledDisabledUI();
    UpdatePresenceControlUI();
    UpdateConnectionQualityUI();
    UpdateHintsUI();
    UpdateNoOfflineUI();
    UpdateTwinkleUI();
    UpdateAudioUI();

    ElementById('OnOffSwitch').addEventListener('click', ToggleEnabledDisabled);
    ElementById('PresenceControlSwitch').addEventListener('click', TogglePresenceControlSwitch);
    ElementById('ConnectionQualitySwitch').addEventListener('click', ToggleConnectionQualitySwitch);
    ElementById('HintsSwitch').addEventListener('click', ToggleHintsSwitch);
    ElementById('NoOfflineSwitch').addEventListener('click', ToggleNoOfflineSwitch);
    ElementById('TwinkleSwitch').addEventListener('click', ToggleTwinkleSwitch);
    ElementById('AudioSlider').addEventListener('change', ToggleAudioSlider)
});


function UpdateEnabledDisabledUI() {
    GetOption('enableExt', function (item) {
        let enableExt = item.enableExt;
        ElementById('OnOffSwitch').checked = enableExt;
        if (enableExt) {
            ElementById('secondarySettings').removeAttribute("disabled");
            ElementById('extStatus').innerText = chrome.i18n.getMessage("statusOn");
            ElementById('OnOffSwitch_label').classList.remove("offline");

        } else {
            ElementById('secondarySettings').setAttribute("disabled", "disabled");
            ElementById('extStatus').innerText = chrome.i18n.getMessage("statusOff");
            ElementById('OnOffSwitch_label').classList.add("offline");

        }
    });
}


function UpdatePresenceControlUI() {

    GetOption('enableCheckerPresenceControl', function (item) {
        ElementById('PresenceControlSwitch').checked = item.enableCheckerPresenceControl;
    });
}

function UpdateConnectionQualityUI() {

    GetOption('enableCheckerConnectionQuality', function (item) {
        ElementById('ConnectionQualitySwitch').checked = item.enableCheckerConnectionQuality;
    });
}

function UpdateHintsUI() {

    GetOption('enableCheckerHints', function (item) {
        ElementById('HintsSwitch').checked = item.enableCheckerHints;
    });
}

function UpdateTwinkleUI() {

    GetOption('enableAutoTwinkle', function (item) {
        ElementById('TwinkleSwitch').checked = item.enableAutoTwinkle;
    });
}

function UpdateAudioUI() {
    GetOption('audioVolume', function (item) {
        ElementById('AudioSlider').value = Math.floor(item.audioVolume * 100);
    });
}

function UpdateNoOfflineUI() {

    GetOption('enableCatchMessagesAboutOffline', function (item) {
        ElementById('NoOfflineSwitch').checked = item.enableCatchMessagesAboutOffline;
    });
}

function ToggleEnabledDisabled() {
    GetOption('enableExt', function (item) {
        SetOption('enableExt', !item.enableExt, UpdateEnabledDisabledUI);
    });
}

function TogglePresenceControlSwitch() {
    GetOption('enableCheckerPresenceControl', item => {
        SetOption('enableCheckerPresenceControl', !item.enableCheckerPresenceControl, null);
    });
}

function ToggleConnectionQualitySwitch() {
    GetOption('enableCheckerConnectionQuality', function (item) {
        SetOption('enableCheckerConnectionQuality', !item.enableCheckerConnectionQuality);
    });
}

function ToggleHintsSwitch() {
    GetOption('enableCheckerHints', function (item) {
        SetOption('enableCheckerHints', !item.enableCheckerHints);
    });
}

function ToggleNoOfflineSwitch() {
    GetOption('enableCatchMessagesAboutOffline', function (item) {
        SetOption('enableCatchMessagesAboutOffline', !item.enableCatchMessagesAboutOffline);
    });
}


function ToggleTwinkleSwitch() {
    GetOption('enableAutoTwinkle', function (item) {
        SetOption('enableAutoTwinkle', !item.enableAutoTwinkle);
    });
}

function ToggleAudioSlider() {
    let value = Math.min(Math.max(parseInt(ElementById('AudioSlider').value), 0), 100);
    SetOption('audioVolume', value / 100);
}