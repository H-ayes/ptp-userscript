// ==UserScript==
// @name         Hayes's PTP Enhanced
// @author       hayes
// @icon         https://passthepopcorn.me/favicon.ico
// @version      2024-07-28
// @description  Enhanced features for PassThePopcorn (adds a copy title button, hide trailer button, and can change brackets to parantheses in titles)
// @match        https://passthepopcorn.me/torrents.php?*
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // Custom styles for GM_config
    GM_addStyle(`
        #PTP_Enhanced_Config {
            height:  45% !important;
            width: auto !important;
        }
    `);

    // GM_config setup
    GM_config.init({
        'id': 'PTP_Enhanced_Config',
        'title': 'PTP Enhanced Settings',
        'css': '#PTP_Enhanced_Config { background: #000000; color: #c5c5c5; }',
        'fields': {
            'enableChangeBrackets': {
                'label': 'Enable Change Brackets to Parentheses',
                'type': 'checkbox',
                'default': true
            },
            'enableCopyTitle': {
                'label': 'Enable Copy Title Button',
                'type': 'checkbox',
                'default': true
            },
            'enableHideTrailer': {
                'label': 'Enable Hide Trailer Feature',
                'type': 'checkbox',
                'default': true
            }
        },
        'events': {
            'save': function() {
                location.reload();
            }
        }
    });


    // Register menu command to open config
    GM_registerMenuCommand('PTP Enhanced Settings', function() {
        GM_config.open();
    });

    // Main function to run all features
    function runFeatures() {
        if (GM_config.get('enableChangeBrackets')) {
            changeBrackets();
        }
        if (GM_config.get('enableCopyTitle')) {
            addCopyTitleButton();
        }
        if (GM_config.get('enableHideTrailer')) {
            hideTrailer();
        }
    }

    // Run features when the page is loaded
    window.addEventListener('load', runFeatures);

    // Feature functions
    function changeBrackets() {
        let pageTitleElement = document.querySelector('.page__title');
        if (pageTitleElement) {
            let htmlContent = pageTitleElement.innerHTML;
            htmlContent = htmlContent.replace(/\[/g, '(').replace(/\]/g, ')');
            pageTitleElement.innerHTML = htmlContent;
        }
    }

    function addCopyTitleButton() {
        addFontAwesome();

        setTimeout(() => {
            const pageTitleElement = document.querySelector('.page__title');
            if (pageTitleElement) {
                const button = document.createElement('button');
                button.id = 'copyButton';
                button.innerHTML = '<i class="fas fa-copy"></i>';
                button.style.color = '#6c757d';
                button.style.fontSize = '12px';
                button.style.padding = '5px';
                button.style.paddingLeft = '10px';
                button.style.paddingTop = '0px';
                button.style.paddingRight = '0px';
                button.style.paddingBottom = '0px';
                button.style.background = 'none';
                button.style.border = 'none';
                button.style.cursor = 'pointer';

                button.addEventListener('click', copyText);
                pageTitleElement.appendChild(button);
            }
        }, 1000);
    }

    function copyText() {
    const pageTitleElement = document.querySelector('.page__title');

    if (pageTitleElement) {
        let htmlContent = pageTitleElement.innerHTML;
        htmlContent = htmlContent.replace(/&amp;/g, '&');
        const forbiddenChars = /[<>:"/\\|?*\x00-\x1F]/g;
        htmlContent = htmlContent.replace(forbiddenChars, '');

        // Find the first closing parenthesis or bracket
        const endIndexParen = htmlContent.indexOf(')');
        const endIndexBracket = htmlContent.indexOf(']');
        const endIndex = Math.min(
            endIndexParen !== -1 ? endIndexParen : Infinity,
            endIndexBracket !== -1 ? endIndexBracket : Infinity
        ) + 1;

        const textToCopy = endIndex > 0 ? htmlContent.substring(0, endIndex) : htmlContent;

        const textarea = document.createElement('textarea');
        textarea.value = textToCopy;
        document.body.appendChild(textarea);

        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        updateButtonState();
    } else {
        alert('Element with class "page__title" not found!');
    }
}


    function updateButtonState() {
        const button = document.getElementById('copyButton');
        if (button) {
            button.innerHTML = '<i class="fas fa-check"></i> Copied!';
            button.style.color = '#28a745';
            button.style.fontSize = '12px';
            button.style.paddingLeft = '10px';
            button.style.paddingTop = '0px';
            button.style.paddingRight = '0px';
            button.style.paddingBottom = '0px';
            button.style.background = 'none';
            button.style.border = 'none';
            button.style.cursor = 'default';

            setTimeout(() => {
                button.innerHTML = '<i class="fas fa-copy"></i>';
                button.style.color = '#6c757d';
                button.style.fontSize = '12px';
                button.style.paddingLeft = '10px';
                button.style.paddingTop = '0px';
                button.style.paddingRight = '0px';
                button.style.paddingBottom = '0px';
                button.style.background = 'none';
                button.style.border = 'none';
                button.style.cursor = 'pointer';
            }, 2000);
        }
    }

    function addFontAwesome() {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css';
        document.head.appendChild(link);
    }

    function hideTrailer() {
        const trailer = document.getElementById('trailer');
        if (!trailer) return;

        const icon = document.createElement('i');
        icon.className = 'fas fa-eye';
        icon.style.cursor = 'pointer';
        icon.style.paddingBottom = '10px';

        trailer.style.display = 'none';
        trailer.parentElement.insertBefore(icon, trailer);

        icon.addEventListener('click', function() {
            if (trailer.style.display === 'none') {
                trailer.style.display = 'block';
                icon.className = 'fas fa-eye-slash';
            } else {
                trailer.style.display = 'none';
                icon.className = 'fas fa-eye';
            }
        });
    }
})();