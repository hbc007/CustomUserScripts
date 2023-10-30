// ==UserScript==
// @name         Jenkins build params saver
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Jenkins build params saver
// @author       hubochao@kingsoft.com
// @match        https://jenkins.shiyou.kingsoft.com/*
// @icon         https://jenkins.shiyou.kingsoft.com/static/ee44d8fb/favicon.svg
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==

(function() {
    'use strict';

    const InputType2Val = {
        text: "value",
        checkbox: "checked",
    }

    function autoset(key) {
        const xpath = `//form[@name='parameters']//input[@name='name'][@value='${key}']/..//*[@name='value']`;
        const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        const elem = result.singleNodeValue;
        if (elem) {
            const valueKey = InputType2Val[elem.type] || "value";
            elem[valueKey] = GM_getValue(window.location.pathname + key) || elem[valueKey];
            elem.onchange = ()=>{
                GM_setValue(window.location.pathname + key, elem[valueKey]);
            }
        }
    }

    (() => {
        document.querySelectorAll("input[name='name'][type='hidden']").forEach(elem => {
            autoset(elem.value);
        });
    })();
})();