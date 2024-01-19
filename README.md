# AO3 scriptify

Color-code dialogue on AO3 to turn a fic into a script.

With any of Tampermonkey/Greasemonkey/Violentmonkey/etc installed in your browser, [click here to install AO3-scriptify](https://github.com/irrationalpie7/AO3-scriptify/raw/main/scriptify.pub.user.js).

## Using the extension
With the script installed, a new "Scriptify:" section will be added below the AO3 work stats. The work will look the same as usual until you hit the "Start color-coding dialogue" button.
![A snippet of the stats section of an ao3 work, below which there's a scriptify section containing a start button](images/1-initial.png)

Once you do, the "Start color-coding dialogue" button will be replaced with an "Export" button, below which there will be a warning not to refresh the page and some exporting info.

Currently:
> Warning: once you start color-coding dialogue, refreshing the page will ruin all your hard work! If copy/paste doesn't work or is too messy, use the export button. You can look at the resulting file in any browser, or upload it to google drive and then open it as a doc.

![A snippet of the stats section of an ao3 work, below which there's a scriptify section with an export button and warning](images/2-export.png)

Additionally, a panel will appear with buttons for each of the currently in-use dialogue colors, plus one. This controls the behavior when you click on a line of dialogue. If you select a numbered button, then each time you click a line of dialogue it will set the line of dialogue's color to match that button. If instead the "Rotate" button is selected, clicking on a line of dialogue will cycle through each of the currently available colors. Initially, all lines of dialogue are the same color as the "0" button (dark blue). If you color any to match the "1" button (bright green), then unless you click that line back to match "0", the next time you change a dialogue line's color, a new color option will appear, first "2", then "3", etc. The list goes up to "14", for a total of 15 colors.
![A panel with a rainbow "rotate" button, a blue "0" button, green "1" button, and black button with a moon icon](images/3-button-panel.png)

If you don't like the background color of the control panel, you can use the button in the top right of the control panel to switch between light and dark mode. Light mode is designed to fit with the default AO3 site skin, and dark mode to fit with the Reversi site skin.
![A black panel with a rainbow "rotate" button, a blue "0" button, green "1" button, and white button with a sun icon](images/4-dark-button-panel.png)

The pin checkbox below the sun/moon icons allows you to pin or unpin the panel with the color options (not shown in images, since this was added without taking new screen caps). If it's checked, the panel will stay visible at the top of the screen as you scroll, if it's unchecked, it'll stay in place above the title of the work and scroll out of view as you scroll down the work.

Here we can see the extension in use. The control panel floats at the top of the screen, and the lines of dialogue of the test work have become highlighted (clickable) areas. Frog's lines are still in the initial dark blue color, but since Toad's lines have been colored green, a new color option has appeared.
![A floating panel with "rotate" plus three color button options, over a work with dialogue between characters Frog and Toad. Frog's lines are dark blue and Toad's bright green](images/5-in-use.png)

## Keyboard tips and tricks

(please do let me know if any of these break!)

* Hitting 'Enter' while any button is focused does the same thing as clicking the button. That includes the color bar controls and the quoted dialogue lines.
* Hitting the digit or letter associated with a color (e.g. 0 for the first one), while you're focused on a dialogue line, behaves like clicking that color in the color bar, and then clicking the dialogue line you're on (so, if you're on a line of dialogue, hitting '1' will paint the quote that color)
* Hitting '+' while on a dialogue line will paint it the next color in order, based on the line's current color (unless it's already the max color, then it'll cycle back to the beginning). This is like what you'd get by clicking the "Rotate" button in the color bar, and then the dialogue line.
* Hitting 'Tab' sends you to the next line of dialogue (or the next control bar button)