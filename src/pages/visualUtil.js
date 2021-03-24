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

'use strict';

window.addEventListener('load', () => {
    Shuffle('.shuffle');
});

function Shuffle(Selector) {
    let elements = document.querySelectorAll(Selector);
    elements.forEach(el => {
        let shuffler = new Shuffler(el);
        shuffler.SetDuration(1600);
        shuffler.Start();
    });
}

class Shuffler {
    constructor(Element) {
        this.Element = Element;
        this.EmptyCharacter = "*";
        this.Duration = 1000;
        this.ArrayCharactersForRandom = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        this.TimeStart = 0;
        this.SymbolFinalPercent = [];

        let OriginalText = Element.textContent;
        if (OriginalText === null) {
            OriginalText = "";
        }

        this.SetFinalText(OriginalText);
    }

    SetEmptyCharacter(Value) {
        this.EmptyCharacter = Value;
    }

    SetDuration(Value) {
        this.Duration = Value;
    }

    SetArrayCharactersForRandom(Value) {
        this.ArrayCharactersForRandom = Value;
    }

    Start() {
        if (!this.Element) {
            return;
        }

        this.Stop();

        this.IsRunning = true;

        let startStr = "";
        this.SymbolFinalPercent = [];
        for (let i = 0; i < this.FinalText.length; i++) {
            this.SymbolFinalPercent[i] = Math.random() * 100;
            startStr += this.EmptyCharacter;
        }
        this.Element.textContent = startStr;
        this.TimeStart = new Date().getTime();
        let _this = this;
        this.AnimationFrameRequestId = requestAnimationFrame(function () {
            _this.AnimLoop();
        });
    }

    Stop() {
        if (this.IsRunning) {
            this.IsRunning = false;
            cancelAnimationFrame(this.AnimationFrameRequestId);
        }
    }

    AnimLoop() {
        let AnimationTime = new Date().getTime() - this.TimeStart;
        let PercentCompletion = AnimationTime / this.Duration * 100;

        let Text = "";
        for (let i = 0; i < this.FinalText.length; i++) {
            if (PercentCompletion >= this.SymbolFinalPercent[i]) {
                Text += this.FinalText[i];
            } else if ((PercentCompletion + 50) > this.SymbolFinalPercent[i]) {
                Text += this.ArrayCharactersForRandom
                    .charAt(Math.floor(Math.random() * this.ArrayCharactersForRandom.length));
            } else {
                Text += this.EmptyCharacter;
            }
        }

        if (PercentCompletion >= 100) {
            Text = this.FinalText;
            this.IsRunning = false;
        }

        if (this.Element) {
            this.Element.textContent = Text;
        } else {
            this.IsRunning = false;
        }

        if (this.IsRunning) {
            let _this = this;
            this.AnimationFrameRequestId = requestAnimationFrame(function () {
                _this.AnimLoop();
            });
        }
    }

    SetFinalText(Text) {
        this.FinalText = Text;
    }
}
