// import statements to include required modules
import { getTexts } from './texts.js';
import { fillBlanks, getResults } from './fill-student.js'

// DOM element references
const textContainer = document.getElementById('text-container');
const promptContainer = document.getElementById('prompt-selection');
const fillButton = document.getElementById('fill-button');
const readButton = document.getElementById('read-button');
const fillContainer = document.getElementById('fill-container');
const alert = document.getElementById('alert');

// global variable to track active prompt
let activePrompt = '';

// function to enable a specific prompt by updating style and content
const enablePrompt = (prompt, color) => {
    // mark the prompt as enabled and update its style
    prompt.setAttribute('enabled', true);
    activePrompt = prompt;
    prompt.style.border = '3px solid yellow';

    // update the text container with the content of the prompt and adjust background color
    textContainer.innerHTML = prompt.innerHTML;
    textContainer.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;

    // update the theme color to prompt background color
    document.documentElement.style.setProperty('--active', textContainer.style.backgroundColor);

    // add click event listeners to blanks within the text
    textContainer.querySelectorAll(':scope > .blank').forEach(blank => {
        blank.addEventListener('click', () => fillButton.click());
    });
};

// function to disable a specific prompt by removing style and event listeners
const disablePrompt = prompt => {
    // set the prompt to disabled and remove its border
    prompt.setAttribute('enabled', false);
    prompt.style.border = '';

    // remove click event listeners from blanks within the text
    textContainer.querySelectorAll(':scope > .blank').forEach(blank => {
        blank.removeEventListener('click', () => {});
    });
};

// function to display an alert message on the page and hide it after 1 sec
export const setAlert = message => {
    // display the message in alert
    alert.innerText = message;
    alert.style.display = '';

    // set a timeout to hide the alert
    setTimeout(() => {
        alert.innerText = '';
        alert.style.display = 'none';
    }, 1000);
};

// function to create a new prompt element
const createPrompt = (index, text, enabled, color) => {
    // create a new prompt element
    const prompt = document.createElement('div');
    prompt.className = 'prompt';
    prompt.id = `prompt-${index}`;
    prompt.innerHTML = text;
    prompt.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;

    // add a click event listener to handle prompt selection
    prompt.addEventListener('click', e => {
        if (fillContainer.style.display === 'none') {
            let enabled = e.target;
            if (enabled.tagName == 'SPAN')
                enabled = enabled.parentElement;
            changeEnabled(enabled);
        } else {
            setAlert('Fill in the blanks before changing prompts!')
        }
    });

    if (enabled)
        enablePrompt(prompt, color)
    else 
        prompt.setAttribute('enabled', false);

    return prompt;
};

// function to parse text, creating blanks within brackets
const parseText = (index, text, enabled, color) => {
    const matches = text.match(/(?<=\[).*?(?=\])/g) || [];
    let i = 0;
    text = text.replaceAll(/\[(.*?)\]/g, function () {
        return `<span class='blank'>${matches[i++]}</span>`
    });

    // create and append a new prompt element
    const prompt = createPrompt(index, text, enabled, color)
    promptContainer.appendChild(prompt);
};

// function to change the currently enabled prompt
const changeEnabled = enabled => {
    disablePrompt(activePrompt);
    const color = enabled.style.backgroundColor.slice(4, -1).trim().split(',');
    enablePrompt(enabled, color);
    enableButton(fillButton, handleFillButtonAfterFill, handleFillButtonEnable);
    disableButton(readButton, handleFillButtonAfterFill, handleReadButtonBeforeFill);
};

// get the list of texts and parse them
const texts = getTexts().map((text, index) => {
    parseText(index, text.text, text.enabled, text.color);
});

// create a custom event for filled blanks
const blanksFilledEvent = new Event('blanksFilled');

// function to disable a button
const disableButton = (button, oldhandler, newHandler) => {
    button.style.borderStyle = 'inset';
    button.style.opacity = '0.5';
    button.style.cursor = 'not-allowed';
    button.style.color = 'floralwhite !important';
    button.removeEventListener('click', oldhandler)
    button.addEventListener('click', newHandler);
}

// function to enable a button
const enableButton = (button, oldhandler, newHandler) => {
    button.style.borderStyle = 'outset';
    button.style.opacity = '1';
    button.style.cursor = 'pointer';
    button.style.color = '';
    button.removeEventListener('click', oldhandler)
    button.addEventListener('click', newHandler);
}

// button handlers for the Fill button
const handleFillButtonEnable = () => {
    textContainer.style.display = 'none';
    fillContainer.style.display = 'default';
    disableButton(fillButton, handleFillButtonEnable, handleFillButtonDuringFill);
    fillBlanks(activePrompt, blanksFilledEvent);
};
const handleFillButtonDuringFill = () => setAlert('Fill in the blanks above!');
const handleFillButtonAfterFill = () => setAlert('Select a new prompt to fill!');

// button handlers for the Read button
const handleReadButtonBeforeFill = () => setAlert('Fill in the blanks before reading the text!');
const handleReadButtonAfterFill = () => {
    if (!('speechSynthesis' in window))
        setAlert("Sorry, your browser doesn't support text to speech!");
    else {
        let msg = new SpeechSynthesisUtterance(textContainer.innerText);
        window.speechSynthesis.speak(msg);
    }
};

// initialize the Fill and Read buttons
enableButton(fillButton, () => {}, handleFillButtonEnable);
disableButton(readButton, () => {}, handleReadButtonBeforeFill);

// event listener for the blanksFilled event
fillContainer.addEventListener('blanksFilled', () => {
    const results = getResults();
    let i = 0;
    textContainer.querySelectorAll(':scope > .blank').forEach(blank => {
        blank.textContent = results[i++];
    });
    enableButton(readButton, handleReadButtonBeforeFill, handleReadButtonAfterFill);
    disableButton(fillButton, handleFillButtonDuringFill, handleFillButtonAfterFill);
});