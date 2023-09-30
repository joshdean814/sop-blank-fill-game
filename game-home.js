import { getTexts } from './texts.js';
import { fillBlanks, getResults } from './fill.js'

const textContainer = document.getElementById('text-container');
const promptContainer = document.getElementById('prompt-selection');
const fillButton = document.getElementById('fill-button');
const readButton = document.getElementById('read-button');
const fillContainer = document.getElementById('fill-container');
const alert = document.getElementById('alert');

let activePrompt = '';

const enablePrompt = (prompt, color) => {
    prompt.setAttribute('enabled', true);
    activePrompt = prompt;
    prompt.style.border = '3px solid yellow';
    
    textContainer.innerHTML = prompt.innerHTML;
    textContainer.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;

    document.documentElement.style.setProperty('--active', textContainer.style.backgroundColor);

    textContainer.querySelectorAll(':scope > .blank').forEach(blank => {
        blank.addEventListener('click',  () => fillButton.click());
    });
};

const disablePrompt = prompt => {
    prompt.setAttribute('enabled', false);
    prompt.style.border = '';
    textContainer.querySelectorAll(':scope > .blank').forEach(blank => {
        blank.removeEventListener('click', () => {});
    });
};

export const setAlert = message => {
    alert.innerText = message;
    alert.style.display = '';
    setTimeout(() => {
        alert.innerText = '';
        alert.style.display = 'none';
    }, 1000)
};

const createPrompt = (index, text, enabled, color) => {
    const prompt = document.createElement('div');
    prompt.className = 'prompt';
    prompt.id = `prompt-${index}`;
    prompt.innerHTML = text;
    prompt.style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    
    prompt.addEventListener('click',  e => {
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
}

// takes in a body of text and removes anywords surrounded by brackets.
// returns a the clean text and an array of the 
const parseText = (index, text, enabled, color) => {
    const matches = text.match(/(?<=\[).*?(?=\])/g) || [];

    let i = 0;
    text = text.replaceAll(/\[(.*?)\]/g, function () {
        return `<span class='blank'>${matches[i++]}</span>`
    });

    const prompt = createPrompt(index, text, enabled, color)
    promptContainer.appendChild(prompt)
};

const changeEnabled = enabled => {
    disablePrompt(activePrompt);
    const color = enabled.style.backgroundColor.slice(4, -1).trim().split(',');
    enablePrompt(enabled, color);
    enableButton(fillButton, handleFillButtonAfterFill, handleFillButtonEnable);
    disableButton(readButton, handleFillButtonAfterFill, handleReadButtonBeforeFill);
};

const texts = getTexts();

texts.map((text, index) => {
    parseText(index, text.text, text.enabled, text.color);
});

const blanksFilledEvent = new Event('blanksFilled');

const disableButton = (button, oldhandler, newHandler) => {
    button.style.borderStyle = 'inset';
    button.style.opacity = '0.5';
    button.style.cursor = 'not-allowed';
    button.style.color = 'floralwhite !important';
    button.removeEventListener('click', oldhandler)
    button.addEventListener('click', newHandler);
}

const enableButton = (button, oldhandler, newHandler) => {
    button.style.borderStyle = 'outset';
    button.style.opacity = '1';
    button.style.cursor = 'pointer';
    button.style.color = '';
    button.removeEventListener('click', oldhandler)
    button.addEventListener('click', newHandler);
}

// fill button handlers:
const handleFillButtonEnable = () => {
    textContainer.style.display = 'none';
    fillContainer.style.display = '';
    disableButton(fillButton, handleFillButtonEnable, handleFillButtonDuringFill);
    fillBlanks(activePrompt, blanksFilledEvent);
};
const handleFillButtonDuringFill = () => setAlert('Fill in the blanks above!');
const handleFillButtonAfterFill = () => setAlert('Select a new prompt to fill!');

// read button handlers:
const handleReadButtonBeforeFill = () => setAlert('Fill in the blanks before reading the text!');
const handleReadButtonAfterFill = () => {
    if (!('speechSynthesis' in window))
        setAlert("Sorry, your browser doesn't support text to speech!");
    else {
        let msg = new SpeechSynthesisUtterance(textContainer.innerText);
        window.speechSynthesis.speak(msg);
    }
};

// initialize the buttons
enableButton(fillButton, () => {}, handleFillButtonEnable);
disableButton(readButton, () => {}, handleReadButtonBeforeFill);

fillContainer.addEventListener('blanksFilled', () => {
    const results = getResults();
    let i = 0;
    textContainer.querySelectorAll(':scope > .blank').forEach(blank => {
        blank.textContent = results[i++];
    });
    enableButton(readButton, handleReadButtonBeforeFill, handleReadButtonAfterFill);
    disableButton(fillButton, handleFillButtonDuringFill, handleFillButtonAfterFill);
});