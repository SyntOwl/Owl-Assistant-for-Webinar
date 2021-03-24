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
/* exported ElementById */
/* exported SendMessage */
/* exported GetOptionPromise */
/* exported GetOption */
/* exported SetOption */
/* exported GetOptionsSetProperty */

"use strict";

/**
 * Element helper functions
 */
function ElementById(id) {
    return document.getElementById(id);
}

function SendMessage(type, object, callback) {
    chrome.runtime.sendMessage({type, object}, callback);
}

/**
 * Get an option from global settings, and return promis
 * @param {string} Opt
 * @param {function} Callback
 * @returns {Promise<any>}
 */
function GetOptionPromise(Opt, Callback) {
    return new Promise((resolve) => {
        let details = {};
        details[Opt] = null;
        SendMessage("Get_option", details, function (result) {
            if (typeof Callback == "function") {
                Callback(result);
            }
            resolve();
        });
    });
}

/**
 * Get an option from global settings
 * @param {string} Opt
 * @param {function} Callback
 * @returns mixed
 */
function GetOption(Opt, Callback) {
    let details = {};
    details[Opt] = null;
    SendMessage("Get_option", details, Callback);
}

/**
 * Get an option from global settings
 * @param {string} Opt
 * @param {mixed} Value
 * @param {function} Callback
 * @returns mixed
 */
function SetOption(Opt, Value, Callback = null) {
    let details = {};
    details[Opt] = Value;
    SendMessage("Set_option", details, Callback);
}

/**
 * @param {string} Opt
 * @param {object} Obj
 * @param {string} Prop
 */
async function GetOptionsSetProperty(Opt, Obj, Prop = null) {
    if (!Prop) {
        Prop = Opt;
    }
    await GetOptionPromise(Opt, function (item) {
        Obj[Prop] = item[Opt];
    });
}

/**
 * Get an option from global settings
 * @param {function} Callback
 * @returns mixed
 */
function GetDefaultData(Callback) {
    SendMessage("Get_default_data", null, Callback);
}