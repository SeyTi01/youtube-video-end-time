# YouTube: End Time Display

This is a userscript that dynamically displays the end time of a YouTube video based on the current playback speed and the remaining time of the video.

## Features

- Dynamically calculates and displays the end time of the video.
- The end time is updated in real-time, considering the current playback speed.
- The script uses either a 24-hour or 12-hour format, based on the configuration.

## How to Use

1. Install a userscript manager in your browser, such as Tampermonkey or Greasemonkey.
2. Add this script to your userscript manager.
3. Visit any YouTube video and play it. You will see the end time displayed next to the video duration.

## Configuration

You can configure the script by modifying the `CONFIG` object in the script:

- `USE_24_HOUR_TIME`: Set to `true` to use a 24-hour time format. Set to `false` to use a 12-hour time format.
- `UPDATE_INTERVAL`: The interval (in milliseconds) at which the end time is updated.

## License

This project is licensed under the MIT License.

## Author

SeyTi01
