import { setAlert } from './sop.js';

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

let wordQueue = [];
let results = [];
let event = null;

export function fillBlanks(enabledPrompt, blanksFilledEvent)  {
    results = [];
    event = blanksFilledEvent;
    let opacity = 1.00;
    enabledPrompt.querySelectorAll(':scope > span').forEach(phrase => {
        const word = document.createElement('div');
        word.style.opacity = `${opacity}`;
        word.classList = 'fill-word';
        word.innerHTML = phrase.innerHTML;
        wordQueue.push(word);
        fillTextContainer.appendChild(word);
        opacity -= 0.15;
    });
    setDefinition(wordQueue[0].innerText);
    setHint(wordQueue[0].innerText);
    wordInput.focus();
};

export function getResults() {
    return results;
};

const swapDisplay = () => {
    textContainer.style.display = '';
    fillContainer.style.display = 'none';
    fillContainer.dispatchEvent(event);
};

const setDefinition = def => {
    defText.innerText = dictionary[def.toLowerCase().replace(' ','_')];
    def = def.toLowerCase()
    def = def.charAt(0).toUpperCase() + def.slice(1);
    defTitle.innerText = def;
};

const setHint = hint => {
    let html = ``;
    hints[hint.toLowerCase().replace(' ','_')].forEach(hint => html += `<li>${hint}</li>`);
    html = `<ul>${html}<ul>`;
    hintText.innerHTML = html;
};

const removeWord = () => {
    const removed = wordQueue.shift();
    removed.style.fontSize = '0px';
    setTimeout(() => {
        if (wordQueue.length == 0) {
            swapDisplay();
            fillTextContainer.removeChild(removed);
            return;
        }
        let opacity = 1.00;
        wordQueue.forEach(word => {
            word.style.opacity = `${opacity}`;
            opacity -= 0.15;
        });
        setDefinition(wordQueue[0].innerText);
        setHint(wordQueue[0].innerText);
    fillTextContainer.removeChild(removed);
    }, 400);
   
};

wordEntry.addEventListener('keyup', e => {
    wordEntry.value = e.target.value;
});

wordEntry.addEventListener('submit', e => {
    e.preventDefault();
    if (wordEntry.value !== undefined && wordEntry.value !== '') {
        results.push(wordEntry.value.trim());
        wordInput.style.backgroundColor = 'lightgreen';
        wordInput.style.color = 'white';
        setTimeout(() => {
            wordEntry.reset();
            wordInput.style.backgroundColor = 'var(--active)';
            wordInput.style.color = 'floralwhite';
        }, 400)
        removeWord();
        flipCardBack(defCard);
        flipCardBack(hintCard);
    } else {
        setAlert('Type a valid word!');
    };
});

const flipCardBack = card => card.children[0].style.transform = '';


const flipCard = card => {
    if(card.children[0].style.transform === '') 
        card.children[0].style.transform = 'rotateY(180deg)';
    else
        card.children[0].style.transform = '';
};

defCard.addEventListener('click', e => {
    flipCard(defCard);
});

hintCard.addEventListener('click', e => {
   flipCard(hintCard);
});



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