/**
 * inspired by twemoji's convert.toCodePoint
 * it is also pretty much just that but more modern, better documented, and will be changed to the needs of capp so we dont have to include the whole twemoji build as it wasn't made for this application
 *
 * Credit where due:
 *
 * Copyright (c) 2018 Twitter, Inc and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
export function getCodePoint(str: string, separator = "-") {
    const final = [];
    let lastPushedChar = 0;

    for (let i = 0; i < str.length; i++) {
        const char = str[i].charCodeAt(0);
        if (lastPushedChar) {
            final.push(0x10000 + ((lastPushedChar - 0xd800) << 10) + (char - 0xdc00));
            lastPushedChar = 0;
        } else if (0xd800 <= char && char <= 0xd8ff) {
            lastPushedChar = char;
        } else {
            final.push(char.toString(16));
        }
    }

    return final.join(separator);
}
