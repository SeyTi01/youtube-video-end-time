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

let videoPlayer = null;
let currentTimeSpan = null;
let durationSpan = null;
let endTimeSpan = null;

function addEndTime() {
    videoPlayer = videoPlayer || document.querySelector(CONFIG.SELECTORS.VIDEO_PLAYER);

    if (!videoPlayer || !videoPlayer.classList.contains('playing-mode')) return;

    let currentTime = getCurrentTime();
    let duration = getDuration();

    if (currentTime === null || duration === null) return;

    let playbackSpeed = videoPlayer.getPlaybackRate();
    let endTimeText = calculateEndTime(currentTime, duration, playbackSpeed);

    endTimeSpan = endTimeSpan || document.createElement('span');
    endTimeSpan.className = CONFIG.CLASS_NAME_END_TIME;
    durationSpan.parentElement.appendChild(endTimeSpan);

    endTimeSpan.textContent = endTimeText;
}

function getCurrentTime() {
    currentTimeSpan = currentTimeSpan || document.querySelector(CONFIG.SELECTORS.CURRENT_TIME);

    if (!currentTimeSpan) return null;

    let currentTimeParts = currentTimeSpan.textContent.split(':').map(Number);
    return currentTimeParts.reduce((total, val) => total * 60 + val);
}

function getDuration() {
    durationSpan = durationSpan || document.querySelector(CONFIG.SELECTORS.DURATION);

    if (!durationSpan) return null;

    let durationParts = durationSpan.textContent.split(':').map(Number);
    return durationParts.reduce((total, val) => total * 60 + val);
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

    return ` (Ends at ${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')})`;
}

setInterval(addEndTime, CONFIG.UPDATE_INTERVAL);

new MutationObserver(addEndTime).observe(
    document.querySelector(CONFIG.SELECTORS.VIDEO_PLAYER),
    {attributes: true, attributeFilter: ['data-playback-rate']}
);
