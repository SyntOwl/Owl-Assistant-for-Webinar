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

const assert = require('assert');
const store = require('../src/background-scripts/store');
require('jsdom-global/register');


describe('Default xPath', function() {
    describe('Validation xPath must compile', function() {

        function check(nameXPath){
            let valid = false;
            let evaluator = new XPathEvaluator();
            let xPathStr = store.defOpt[nameXPath];
            try {
                evaluator.createExpression(xPathStr);
                valid = true;
            } catch (e) {
            }
            assert.strictEqual(valid, true, nameXPath+' not valid');
        }

        it('xPathCloseButtonConnectionQuality', function() {
            check('xPathConfirmButtonActivityChecker');
        });

        it('xPathConfirmButtonActivityChecker', function() {
            check('xPathCloseButtonActivityChecker');
        });

        it('xPathCloseButtonActivityChecker', function() {
            check('xPathCloseButtonHints');
        });

        it('xPathCloseButtonHints', function() {
            check('xPathCloseButtonHints');
        });

        it('xPathTwinkleButton', function() {
            check('xPathTwinkleButton');
        });
    });
});