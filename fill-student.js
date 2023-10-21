// import the 'setAlert' function from 'game-home.js' 
import { setAlert } from '../game-home.js';

// DOM element references
const fillTextContainer = document.getElementById('fill-text-container');
const wordEntry = document.getElementById('word-input-form');
const wordInput = document.getElementById('word-input');
const textContainer = document.getElementById('text-container');
const fillContainer = document.getElementById('fill-container');
const defCard = document.getElementById('definition')
const hintCard = document.getElementById('hint')
const defText = document.getElementById('def-text');
const hintText = document.getElementById('hint-text');
const defTitle = document.getElementById('def-title');

// global variables for word queues and results
let wordQueue = [];
let results = [];
let event = null;

// function to prepare and display fill-in-the-blank words in the text
export function fillBlanks(enabledPrompt, blanksFilledEvent)  {
    results = [];
    event = blanksFilledEvent;
    let opacity = 1.00;

    // iterate over each word in the enabled prompt, creating display elements
    enabledPrompt.querySelectorAll(':scope > span').forEach(phrase => {
        const word = document.createElement('div');
        word.style.opacity = `${opacity}`;
        word.classList = 'fill-word';
        word.innerHTML = phrase.innerHTML;
        wordQueue.push(word);
        fillTextContainer.appendChild(word);
        opacity -= 0.15;
    });

    // initialize definition and hint for the first word
    setDefinition(wordQueue[0].innerText);
    setHint(wordQueue[0].innerText);
    wordInput.focus();
};

// function to return results after blanks have been filled
export function getResults() {
    return results;
};

// function to swap the display between fill and text containers
const swapDisplay = () => {
    textContainer.style.display = '';
    fillContainer.style.display = 'none';
    fillContainer.dispatchEvent(event);
};

// function to set the definition and title for a word
const setDefinition = def => {
    // set the definition text based on the provided word
    defText.innerText = dictionary[def.toLowerCase().replace(' ','_')];

    // capitalize the first letter of the word for the title
    def = def.toLowerCase();
    def = def.charAt(0).toUpperCase() + def.slice(1);
    defTitle.innerText = def;
};

// function to set a word hint
const setHint = hint => {
    // generate an HTML list of hints
    let html = ``;
    hints[hint.toLowerCase().replace(' ', '_')].forEach(hint => html += `<li>${hint}</li>`);
    html = `<ul>${html}</ul>`;

    // update the hint text with the generated list
    hintText.innerHTML = html;
};

// function to remove a word from the queue
const removeWord = () => {
    // remove the word element at the front of the queue
    const removed = wordQueue.shift();
    removed.style.fontSize = '0px';

    // set a timeout to handle the removal and transition to the next word
    setTimeout(() => {
        if (wordQueue.length == 0) {
            swapDisplay();
            fillTextContainer.removeChild(removed);
            return;
        }
        // change opactity for the next word
        let opacity = 1.00;
        wordQueue.forEach(word => {
            word.style.opacity = `${opacity}`;
            opacity -= 0.15;
        });

        // set the definition and hint for the next word
        setDefinition(wordQueue[0].innerText);
        setHint(wordQueue[0].innerText);

        fillTextContainer.removeChild(removed);
    }, 400);
};

// event listener to get update the value of the form on keyup event
wordEntry.addEventListener('keyup', e => {
    wordEntry.value = e.target.value;
});

// event listener for word submission
wordEntry.addEventListener('submit', e => {
    e.preventDefault();
    // check that the entry is valid
    if (wordEntry.value !== undefined && wordEntry.value !== '') {
        // push the word to results
        results.push(wordEntry.value.trim());
        wordInput.style.backgroundColor = 'lightgreen';
        wordInput.style.color = 'white';

        // reset the entry field
        setTimeout(() => {
            wordEntry.reset();
            wordInput.style.backgroundColor = 'var(--active)';
            wordInput.style.color = 'floralwhite';
        }, 400)
        removeWord();

        // update the cards
        flipCardBack(defCard);
        flipCardBack(hintCard);
    } else {
        setAlert('Type a valid word!');
    };
});

// function to flip a card back to its original state
const flipCardBack = card => card.children[0].style.transform = '';

// function to toggle the visibility of a card by flipping it 
const flipCard = card => {
    if(card.children[0].style.transform === '') 
        card.children[0].style.transform = 'rotateY(180deg)';
    else
        card.children[0].style.transform = '';
};

// event listener for clicking the definition card
defCard.addEventListener('click', () => {
    flipCard(defCard);
});

// event listener for clicking the hint card
hintCard.addEventListener('click', () => {
   flipCard(hintCard);
});

// dictionary of word definitions for various word types
const dictionary = {
    person: 'Any human being you might know!', 
    place: 'Somewhere you can go or be!', 
    noun: 'A word for a person, place, thing, or idea!', 
    name: 'What we call someone or something!',
    verb: 'Any action word!', 
    adjective: 'A word that describes a person, place, or thing.',
    number: 'How much of something?',
    plural_noun: 'A person, place, thing, or idea that ends with s!',
    same_person: 'Any human being you mentioned earlier!',
    same_place: "The place you've already mentioned!",
    same_noun: 'The person, place, thing, or idea you said previously!',
    same_name: "The same name you've mentioned earlier!",
    same_verb: 'Any action similar to the one you described before!',
    same_adjective: 'The word you used for the previous description!',
    same_number: 'The same amount you mentioned before!',
    same_plural_noun: 'That word that ends with "s," which you mentioned previously!'
};

// hints for different word types
const hints = {
    person: ['teacher', 'friend', 'parent', 'doctor', 'artist'], 
    place: ['park', 'home', 'school', 'bathroom', 'store'],
    noun: ['dog', 'beach', 'teacher', 'love', 'book'],
    name: ['Sara', 'Max', 'Luna', 'Teddy', 'Rose'],
    verb: ['run', 'jump', 'sing', 'dance', 'laugh'],
    adjective: ['happy', 'colorful', 'tasty', 'funny', 'big'],
    number: ['100', '22', '3', '1', '99'],
    plural_noun: ['Cats', 'Houses', 'Cars', 'Books', 'Balloons'],
    same_person: ['Alice', 'Bob', 'Charlie', 'David', 'Eva'],
    same_place: ['park', 'school', 'beach', 'home', 'library'],
    same_noun: ['dog', 'tree', 'car', 'book', 'idea'],
    same_name: ['Sara', 'Max', 'Luna', 'Teddy', 'Rose'],
    same_verb: ['run', 'jump', 'sing', 'dance', 'laugh'],
    same_adjective: ['happy', 'colorful', 'tasty', 'funny', 'big'],
    same_number: [1, 5, 10, 20, 100],
    same_plural_noun: ['cats', 'houses', 'cars', 'books', 'balloons']
};