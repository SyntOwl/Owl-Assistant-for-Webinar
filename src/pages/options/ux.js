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

let settings = {
    millisecondsBetweenMainLoopIntervals: 10000,
    xPathConfirmButtonActivityChecker: "",
    xPathCloseButtonActivityChecker: "",
    xPathCloseButtonConnectionQuality: "",
    xPathCloseButtonHints: ""
};

function ShowErrorTextForElement(errorLabelId, ElementId) {
    if (errorLabelId) {
        ElementById(errorLabelId).removeAttribute("hidden");
    }
    if (ElementId) {
        ElementById(ElementId).parentElement.classList.add("syntError");
    }
}

function HideErrorTextForElement(errorLabelId, ElementId) {
    if (errorLabelId) {
        ElementById(errorLabelId).setAttribute("hidden", "");
    }
    if (ElementId) {
        ElementById(ElementId).parentElement.classList.remove("syntError");
    }
}

function ValidateSecondsBetweenMainLoopInterval(object) {
    let value = parseInt(object.value, 10);
    return (object.min <= value && value <= object.max);

}

function ValidateXpathElement(ElementId) {
    let valid = false;
    let evaluator = new XPathEvaluator();
    let xPathStr = ElementById(ElementId).value;
    try {
        evaluator.createExpression(xPathStr);
        valid = true;
    } catch (e) {
    }
    return valid;
}

function ValidateKeyElement(ElementId) {
    let valid = false;
    let key = ElementById(ElementId).value;
    if (key.length <= 1) {
        valid = true;
    }
    return valid;
}

function ValidateSettingsEnterInPage() {
    let allValid = true;

    if (!ValidateSecondsBetweenMainLoopInterval(ElementById("SecondsBetweenMainLoopIntervalInt"))) {
        allValid = false;
        ShowErrorTextForElement("errorSecondsBetweenMainLoopInterval", "SecondsBetweenMainLoopIntervalInt");
    } else {
        HideErrorTextForElement("errorSecondsBetweenMainLoopInterval", "SecondsBetweenMainLoopIntervalInt");
    }

    if (!ValidateXpathElement("XPathDescriptionConfirmButtonActivityString")) {
        allValid = false;
        ShowErrorTextForElement("errorXPathDescriptionConfirmButtonActivityChecker", "XPathDescriptionConfirmButtonActivityString");
    } else {
        HideErrorTextForElement("errorXPathDescriptionConfirmButtonActivityChecker", "XPathDescriptionConfirmButtonActivityString");
    }

    if (!ValidateXpathElement("XPathDescriptionCloseButtonActivityString")) {
        allValid = false;
        ShowErrorTextForElement("errorXPathDescriptionCloseButtonActivityChecker", "XPathDescriptionCloseButtonActivityString");
    } else {
        HideErrorTextForElement("errorXPathDescriptionCloseButtonActivityChecker", "XPathDescriptionCloseButtonActivityString");
    }

    if (!ValidateXpathElement("XPathCloseButtonConnectionQualityString")) {
        allValid = false;
        ShowErrorTextForElement("errorXPathCloseButtonConnectionQuality", "XPathCloseButtonConnectionQualityString");
    } else {
        HideErrorTextForElement("errorXPathCloseButtonConnectionQuality", "XPathCloseButtonConnectionQualityString");
    }

    if (!ValidateXpathElement("XPathCloseButtonHintsString")) {
        allValid = false;
        ShowErrorTextForElement("errorXPathCloseButtonHints", "XPathCloseButtonHintsString");
    } else {
        HideErrorTextForElement("errorXPathCloseButtonHints", "XPathCloseButtonHintsString");
    }

    if (!ValidateKeyElement("KeyTwinkleString")) {
        allValid = false;
        ShowErrorTextForElement(null, "KeyTwinkleString");
    } else {
        HideErrorTextForElement(null, "KeyTwinkleString");
    }
    return allValid;
}

function UpdateUi() {
    ElementById("SecondsBetweenMainLoopIntervalInt").value = settings.millisecondsBetweenMainLoopIntervals / 1000;
    ElementById("XPathDescriptionConfirmButtonActivityString").value = settings.xPathConfirmButtonActivityChecker;
    ElementById("XPathDescriptionCloseButtonActivityString").value = settings.xPathCloseButtonActivityChecker;
    ElementById("XPathCloseButtonConnectionQualityString").value = settings.xPathCloseButtonConnectionQuality;
    ElementById("XPathCloseButtonHintsString").value = settings.xPathCloseButtonHints;
    ElementById("KeyTwinkleString").value = String.fromCharCode(settings.keyTwinkle);
    ElementById("KeyTwinkleString").setAttribute('keyCode', settings.keyTwinkle);

}

function RestoreDefaultOptions() {
    GetDefaultData(function (defOpt) {
        ElementById("SecondsBetweenMainLoopIntervalInt").value = defOpt.millisecondsBetweenMainLoopIntervals / 1000;
        ElementById("XPathDescriptionConfirmButtonActivityString").value = defOpt.xPathConfirmButtonActivityChecker;
        ElementById("XPathDescriptionCloseButtonActivityString").value = defOpt.xPathCloseButtonActivityChecker;
        ElementById("XPathCloseButtonConnectionQualityString").value = defOpt.xPathCloseButtonConnectionQuality;
        ElementById("XPathCloseButtonHintsString").value = defOpt.xPathCloseButtonHints;
        ElementById("KeyTwinkleString").value = String.fromCharCode(defOpt.keyTwinkle);
        ElementById("KeyTwinkleString").setAttribute('keyCode', defOpt.keyTwinkle);
    });
}

function RestoreOptions() {
    let p = []
    p.push(GetOptionsSetProperty("millisecondsBetweenMainLoopIntervals", settings));
    p.push(GetOptionsSetProperty("xPathConfirmButtonActivityChecker", settings));
    p.push(GetOptionsSetProperty("xPathCloseButtonActivityChecker", settings));
    p.push(GetOptionsSetProperty("xPathCloseButtonConnectionQuality", settings));
    p.push(GetOptionsSetProperty("xPathCloseButtonHints", settings));
    p.push(GetOptionsSetProperty("keyTwinkle", settings));
    Promise.all(p).then(function () {
        UpdateUi();
    });
}

function SaveOptions() {
    if (!ValidateSettingsEnterInPage()) {
        return
    }

    {
        let milliseconds = parseInt(ElementById("SecondsBetweenMainLoopIntervalInt").value, 10) * 1000;
        settings.millisecondsBetweenMainLoopIntervals = milliseconds;
        SetOption("millisecondsBetweenMainLoopIntervals", milliseconds);
    }
    {
        let xPathStr = ElementById("XPathDescriptionConfirmButtonActivityString").value;
        settings.xPathConfirmButtonActivityChecker = xPathStr;
        SetOption("xPathConfirmButtonActivityChecker", xPathStr);
    }
    {
        let xPathStr = ElementById("XPathDescriptionCloseButtonActivityString").value;
        settings.xPathCloseButtonActivityChecker = xPathStr;
        SetOption("xPathCloseButtonActivityChecker", xPathStr);
    }
    {
        let xPathStr = ElementById("XPathCloseButtonConnectionQualityString").value;
        settings.xPathCloseButtonConnectionQuality = xPathStr;
        SetOption("xPathCloseButtonConnectionQuality", xPathStr);
    }
    {
        let xPathStr = ElementById("XPathCloseButtonHintsString").value;
        settings.xPathCloseButtonHints = xPathStr;
        SetOption("xPathCloseButtonHints", xPathStr);
    }
    {
        let keyCode = parseInt(ElementById("KeyTwinkleString").getAttribute('keyCode'), 10);
        settings.keyTwinkle = keyCode;
        SetOption("keyTwinkle", keyCode);
    }
}


document.addEventListener("DOMContentLoaded", function () {
    RestoreOptions();

    ElementById("Save").addEventListener("click", SaveOptions);
    ElementById("Cancel").addEventListener("click", RestoreOptions)
    ElementById("Restore").addEventListener("click", RestoreDefaultOptions);

    document.addEventListener("keydown", (e) => {
        if (!e.target.classList.contains('customKey')) {
            return;
        }
        if (
            (e.keyCode >= 48 && e.keyCode <= 57) ||   // 0-9
            (e.keyCode >= 65 && e.keyCode <= 90)      // A-Z
        ) {
            e.target.value = e.key;
            e.target.setAttribute('keyCode', e.keyCode)

        } else if (e.keyCode === 8 || e.keyCode === 27) {
            e.target.value = "";
        }
        e.preventDefault();
        e.stopPropagation();

    });
});