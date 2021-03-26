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

(function () {

    let settings = {};
    let mainIntervalId;

    window.addEventListener("load", function () {

        LoadSettings().then(function () {
            chrome.storage.onChanged.addListener(async function (changes) {
                ParseSetValuesAndMakeChanges(changes);
            });

            document.addEventListener('keydown', (event) => {

                if (event.defaultPrevented ||
                    event.target.nodeName === "INPUT" ||
                    event.target.nodeName === "TEXTAREA" ||
                    event.target.isContentEditable ||
                    !settings.enableExt) {
                    return;
                }

                const keyCode = event.keyCode;
                let handled = false;

                if ((keyCode === settings.keyTwinkle) && settings.enableAutoTwinkle) {
                    handled |= PressTwinkle();
                }

                if (handled) {
                    event.preventDefault();
                    event.stopPropagation();
                }

            });

            RunMainLoop();
        })
    })

    function ParseSetValuesAndMakeChanges(changes) {
        for (let prop in changes) {
            if (prop in settings) {
                settings[prop] = changes[prop].newValue;
                if (prop === "millisecondsBetweenMainLoopIntervals") {
                    StopMainLoop();
                    RunMainLoop();
                } else if (prop === "enableExt") {
                    if (settings.enableExt) {
                        RunMainLoop();
                    } else {
                        StopMainLoop();
                    }
                } else if (prop === "audioVolume") {
                    HandleVideo();
                }

            }
        }
    }

    function ValidateVideo(video) {
        if (video) {
            if ((!video.currentSrc.includes("fakeVideo.mp4")) && video.isConnected === true) {
                return true;
            }
        }
        return false;
    }

    function FindVideo() {
        let videos = document.querySelectorAll('video');
        let validVideos = [];
        videos.forEach(video => {
            if (ValidateVideo(video)){
                validVideos.push(video);
            }
        });
        return validVideos;
    }

    function UpdateVideoVolume(VideoElement) {
        VideoElement.volume = settings.audioVolume;
    }

    function RunMainLoop() {
        if (settings.enableExt) {
            mainIntervalId = setInterval(MainLoop, settings.millisecondsBetweenMainLoopIntervals);
        }
    }

    function StopMainLoop() {
        clearInterval(mainIntervalId);
    }

    function LoadSettings() {
        return new Promise((resolve) => {
            let p = []
            p.push(GetOptionsSetProperty("enableExt", settings));
            p.push(GetOptionsSetProperty("millisecondsBetweenMainLoopIntervals", settings));
            p.push(GetOptionsSetProperty("enableCheckerPresenceControl", settings));
            p.push(GetOptionsSetProperty("xPathConfirmButtonActivityChecker", settings));
            p.push(GetOptionsSetProperty("xPathCloseButtonActivityChecker", settings));
            p.push(GetOptionsSetProperty("enableCheckerConnectionQuality", settings));
            p.push(GetOptionsSetProperty("xPathCloseButtonConnectionQuality", settings));
            p.push(GetOptionsSetProperty("enableCheckerHints", settings));
            p.push(GetOptionsSetProperty("xPathCloseButtonHints", settings));
            p.push(GetOptionsSetProperty("enableAutoTwinkle", settings));
            p.push(GetOptionsSetProperty("keyTwinkle", settings));
            p.push(GetOptionsSetProperty("xPathTwinkleButton", settings));
            p.push(GetOptionsSetProperty("audioVolume", settings));

            Promise.all(p).then(function () {
                resolve();
            });
        });
    }

    function getElementsByXPath(xPath, contextNode) {
        let results = [];
        let evaluator = new XPathEvaluator();
        try {
            let expression = evaluator.createExpression(xPath);
            if (expression) {
                let query = expression.evaluate(contextNode, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE);
                for (let i = 0, length = query.snapshotLength; i < length; ++i) {
                    results.push(query.snapshotItem(i));
                }
            }
        } catch (e) {
            console.error("Error in Owl-Assistant getElementsByXPath.\n\r", e);
        }
        return results;
    }

    function PressTwinkle() {
        let button = FindOneUniqueItemByXPath(settings.xPathTwinkleButton);
        if (button) {
            button.click();
            return true;
        }
        return false;
    }

    function HandleVideo(){
        let videos = FindVideo();
        videos.forEach(video => {
            UpdateVideoVolume(video);
        })
    }

    function HandleActivityChecker() {
        let button = FindOneUniqueItemByXPath(settings.xPathConfirmButtonActivityChecker);
        if (button) {
            button.click();

            setTimeout(function () {
                let button = FindOneUniqueItemByXPath(settings.xPathCloseButtonActivityChecker);
                if (button) {
                    button.click();
                }
            }, 1000);
        }
    }

    function HandleConnectionQuality() {
        let button = FindOneUniqueItemByXPath(settings.xPathCloseButtonConnectionQuality);
        if (button) {
            button.click();
        }
    }

    function HandleHints() {
        let button = FindOneUniqueItemByXPath(settings.xPathCloseButtonHints);
        if (button) {
            button.click();
        }
    }

    function FindOneUniqueItemByXPath(xPath, contextNode = document.body) {
        let xPathRes = getElementsByXPath(xPath, contextNode);

        if (xPathRes.length === 1) {
            return xPathRes[0];
        } else if (xPathRes.length > 1) {
            console.warn("The required element is not unique, the first element found was returned.\n\r", xPathRes);
            return xPathRes[0];
        }
    }

    function MainLoop() {
        if (settings.enableCheckerPresenceControl) {
            HandleActivityChecker();
        }
        if (settings.enableCheckerConnectionQuality) {
            HandleConnectionQuality();
        }
        if (settings.enableCheckerHints) {
            HandleHints();
        }
        HandleVideo();
    }

}())