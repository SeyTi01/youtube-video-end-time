// ==UserScript==
// @name        YouTube: End Time Display
// @namespace   https://github.com/SeyTi01/
// @match       https://www.youtube.com/*
// @grant       none
// @version     1.0
// @description Dynamically displays end time based on playback speed and time remaining.
// @author      SeyTi01
// @license     MIT
// ==/UserScript==

const CONFIG = {
    USE_24_HOUR_TIME: false,
    UPDATE_INTERVAL: 1000, // in milliseconds
    SELECTORS: {
        VIDEO_PLAYER: '.html5-video-player',
        CURRENT_TIME: '.ytp-time-current',
        DURATION: '.ytp-time-duration'
    },
    CLASS_NAME_END_TIME: 'ytp-time-end'
};

let endTimeSpan = null;

function addEndTime(videoPlayerNode) {
    if (!videoPlayerNode.classList.contains('playing-mode')) return;

    let currentTime = getCurrentTime(videoPlayerNode);
    let duration = getDuration(videoPlayerNode);
    let playbackSpeed = videoPlayerNode.getPlaybackRate();
    let endTimeText = calculateEndTime(currentTime, duration, playbackSpeed);

    endTimeSpan = endTimeSpan || document.createElement('span');
    endTimeSpan.className = CONFIG.CLASS_NAME_END_TIME;
    videoPlayerNode.querySelector(CONFIG.SELECTORS.DURATION).parentElement.appendChild(endTimeSpan);

    endTimeSpan.textContent = endTimeText;
}

function getCurrentTime(videoPlayerNode) {
    let currentTimeSpan = videoPlayerNode.querySelector(CONFIG.SELECTORS.CURRENT_TIME);
    return currentTimeSpan ? getTimeInSeconds(currentTimeSpan.textContent) : null;
}

function getDuration(videoPlayerNode) {
    let durationSpan = videoPlayerNode.querySelector(CONFIG.SELECTORS.DURATION);
    return durationSpan ? getTimeInSeconds(durationSpan.textContent) : null;
}

function calculateEndTime(currentTime, duration, playbackSpeed) {
    let remainingTime = (duration - currentTime) / playbackSpeed;
    let now = new Date();
    let endTime = new Date(now.getTime() + remainingTime * 1000);
    let endHours = endTime.getHours();
    let endMinutes = endTime.getMinutes();

    if (!CONFIG.USE_24_HOUR_TIME && endHours > 12) {
        endHours -= 12;
    }

    return ` (Ends ${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')})`;
}

function getTimeInSeconds(timeString) {
    let timeParts = timeString.split(':').map(Number);
    return timeParts.reduce((total, val) => total * 60 + val);
}

const observer = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            let addedNodes = Array.from(mutation.addedNodes);
            let videoPlayerNode = addedNodes.find(node => node.nodeType === Node.ELEMENT_NODE && node.matches(CONFIG.SELECTORS.VIDEO_PLAYER));
            if (videoPlayerNode) {
                setInterval(() => addEndTime(videoPlayerNode), CONFIG.UPDATE_INTERVAL);
            }
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });
