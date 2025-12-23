/**
 * Senior Frontend Script - Multi-Step Interactive Menu
 * Optimized for iOS Touch Feedback
 */

const CONFIG = [
    {
        id: "antipasti",
        title: "Antipasti",
        riddle: "Dove, PER COMINCIARE, ci siamo trovati sotto una cascata",
        password: "labante",
        options: ["Perle di Parmigiano", "Quel Filo Che Ci Unisce"]
    },
    {
        id: "primi",
        title: "Primi",
        riddle: "La band che ci ha fatto saltare e urlare al nostro PRIMO concerto",
        password: "greenday",
        options: ["Grani di Cacao", "Fior di Camomilla"]
    },
    {
        id: "secondi",
        title: "Secondi",
        riddle: "L'abbiamo visto al nostro SECONDO appuntamento",
        password: "entergalactic",
        options: ["Tataki Ardente", "Sole Nero"]
    },
    {
        id: "dolci",
        title: "Dolci",
        riddle: "Il nostro DOLCE rifugio dopo una lunga giornata in montagna",
        password: "asmana",
        options: ["Cuore Fondente", "Fiamma Catalana"]
    },
    {
        id: "dopocena",
        title: "Dopocena",
        riddle: "Cosa non può mai mancare alla fine di ogni nostra giornata insieme?",
        password: "coccole",
        options: ["Genna (sessualmente)"]
    }
];

let currentStep = 0;
let userChoices = [];

const bgContainer = document.getElementById('bgContainer');
const welcomeScreen = document.getElementById('welcomeScreen');
const formScreen = document.getElementById('formScreen');
const a4Reveal = document.getElementById('a4Reveal');
const optionButtons = document.getElementById('optionButtons');
const finalMenu = document.getElementById('finalMenu');
const menuSummary = document.getElementById('menuSummary');
const passwordInput = document.getElementById('passwordInput');
const errorMsg = document.getElementById('errorMessage');

// FIX PER IPHONE: Gestione tocco visiva forzata
function attachTouchListeners(btn) {
    btn.addEventListener('touchstart', () => btn.classList.add('is-pressing'), {passive: true});
    btn.addEventListener('touchend', () => btn.classList.remove('is-pressing'), {passive: true});
    btn.addEventListener('touchcancel', () => btn.classList.remove('is-pressing'), {passive: true});
}

// Inizializza feedback tocco sul bottone login esistente
attachTouchListeners(document.getElementById('loginBtn'));

// 1. Inizio - Tap su Benvenuto
welcomeScreen.addEventListener('click', () => {
    vibrate(100);
    fadeOut(welcomeScreen, () => {
        showForm();
    });
});

// 2. Mostra il Form Corrente
function showForm() {
    const data = CONFIG[currentStep];
    document.getElementById('stepTitle').innerText = data.title;
    document.getElementById('stepRiddle').innerText = data.riddle;
    passwordInput.value = "";
    
    bgContainer.className = 'bg-blurred';
    fadeIn(formScreen);
}

// 3. Verifica Password (Case Insensitive)
function checkPassword() {
    const input = passwordInput.value.toLowerCase().trim();
    const correct = CONFIG[currentStep].password.toLowerCase();

    if (input === correct) {
        vibrate(200);
        fadeOut(formScreen, () => {
            showA4();
        });
    } else {
        vibrate(50);
        errorMsg.classList.add('visible');
        setTimeout(() => errorMsg.classList.remove('visible'), 2000);
    }
}

// 4. Reveal A4 e Scelte
function showA4() {
    bgContainer.className = 'bg-sharp';
    optionButtons.innerHTML = "";
    
    CONFIG[currentStep].options.forEach(opt => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.onclick = () => makeChoice(opt);
        attachTouchListeners(btn); // Applica feedback touch
        optionButtons.appendChild(btn);
    });

    a4Reveal.classList.remove('hidden');
    setTimeout(() => a4Reveal.classList.add('visible'), 50);
}

// 5. Registra Scelta e Avanza
function makeChoice(choice) {
    vibrate(100);
    userChoices.push({ category: CONFIG[currentStep].title, dish: choice });
    
    a4Reveal.classList.remove('visible');
    setTimeout(() => {
        a4Reveal.classList.add('hidden');
        currentStep++;
        
        if (currentStep < CONFIG.length) {
            showForm();
        } else {
            showFinalSummary();
        }
    }, 1000);
}

// 6. Riepilogo Finale
function showFinalSummary() {
    bgContainer.className = 'bg-blurred';
    menuSummary.innerHTML = "";
    
    userChoices.forEach(item => {
        const div = document.createElement('div');
        div.className = 'summary-item';
        div.innerHTML = `<span class="summary-label">${item.category}:</span> <span>${item.dish}</span>`;
        menuSummary.appendChild(div);
    });

    fadeIn(finalMenu);
    vibrate(500);
}

// Helper Utilities
function fadeOut(el, callback) {
    el.style.opacity = "0";
    setTimeout(() => {
        el.classList.add('hidden');
        if (callback) callback();
    }, 800);
}

function fadeIn(el) {
    el.classList.remove('hidden');
    setTimeout(() => {
        el.style.opacity = "1";
    }, 50);
}

function vibrate(ms) {
    // Nota: navigator.vibrate non è supportato su Safari iOS, 
    // ma lo teniamo per compatibilità con altri browser mobile.
    if (navigator.vibrate) navigator.vibrate(ms);
}

passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') checkPassword();
});

