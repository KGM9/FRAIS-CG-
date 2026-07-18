// --- ACCÈS SÉCURISÉ ET NAVIGATION ---
const tabFrais = document.getElementById('tab-frais');
const tabCalc = document.getElementById('tab-calc');
const sectionFrais = document.getElementById('section-frais');
const sectionCalc = document.getElementById('section-calc');

tabFrais.addEventListener('click', () => {
    sectionFrais.classList.remove('hidden');
    sectionCalc.classList.add('hidden');
    tabFrais.className = "flex-1 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-green-500 to-yellow-500 text-slate-950 shadow-lg transition-all duration-200 active:scale-95";
    tabCalc.className = "flex-1 py-3 rounded-2xl font-bold text-sm bg-slate-900 border border-slate-800 text-slate-400 transition-all duration-200 active:scale-95";
});

tabCalc.addEventListener('click', () => {
    sectionCalc.classList.remove('hidden');
    sectionFrais.classList.add('hidden');
    tabCalc.className = "flex-1 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg transition-all duration-200 active:scale-95";
    tabFrais.className = "flex-1 py-3 rounded-2xl font-bold text-sm bg-slate-900 border border-slate-800 text-slate-400 transition-all duration-200 active:scale-95";
});

// --- LOGIQUE CALCUL DES FRAIS CONGO (3.5%) ---
const amountInput = document.getElementById('amount-input');

const mtnFraisRetrait = document.getElementById('mtn-frais-retrait');
const mtnNetRetrait = document.getElementById('mtn-net-retrait');
const mtnFraisDepot = document.getElementById('mtn-frais-depot');
const mtnTotalDepot = document.getElementById('mtn-total-depot');

const airtelFraisRetrait = document.getElementById('airtel-frais-retrait');
const airtelNetRetrait = document.getElementById('airtel-net-retrait');
const airtelFraisDepot = document.getElementById('airtel-frais-depot');
const airtelTotalDepot = document.getElementById('airtel-total-depot');

amountInput.addEventListener('input', () => {
    const amount = Math.floor(parseFloat(amountInput.value));

    if (isNaN(amount) || amount <= 0) {
        updateDisplay(0, 0);
        return;
    }

    // Calcul du taux fixe national de 3.5%
    const charge = Math.round(amount * 0.035);
    updateDisplay(amount, charge);
});

function updateDisplay(amount, charge) {
    const formattedCharge = charge.toLocaleString();
    const resRetrait = (amount - charge).toLocaleString() + " FCFA";
    const resDepot = (amount + charge).toLocaleString() + " FCFA";

    // Application MTN (Jaune)
    mtnFraisRetrait.innerText = `Frais: -${formattedCharge} F`;
    mtnNetRetrait.innerText = resRetrait;
    mtnFraisDepot.innerText = `Frais: +${formattedCharge} F`;
    mtnTotalDepot.innerText = resDepot;

    // Application Airtel (Rouge)
    airtelFraisRetrait.innerText = `Frais: -${formattedCharge} F`;
    airtelNetRetrait.innerText = resRetrait;
    airtelFraisDepot.innerText = `Frais: +${formattedCharge} F`;
    airtelTotalDepot.innerText = resDepot;
}

// --- LOGIQUE CALCULATRICE SÉCURISÉE ---
const calcScreen = document.getElementById('calc-screen');
let currentExpression = "";

document.querySelectorAll('.calc-btn').forEach(button => {
    button.addEventListener('click', () => {
        const value = button.getAttribute('data-val');

        if (value === "C") {
            currentExpression = "";
            calcScreen.innerText = "0";
        } else if (value === "=") {
            if (currentExpression === "") return;
            try {
                // Filtre de sécurité contre les injections de code
                const sanitizedExpression = currentExpression.replace(/[^0-9+\-*/.]/g, '');
                const result = new Function(`return (${sanitizedExpression})`)();
                
                calcScreen.innerText = Number.isInteger(result) ? result : result.toFixed(2);
                currentExpression = result.toString();
            } catch (error) {
                calcScreen.innerText = "Erreur";
                currentExpression = "";
            }
        } else {
            if (calcScreen.innerText === "0" && value !== ".") {
                currentExpression = value;
            } else {
                if (currentExpression.length > 15) return;
                currentExpression += value;
            }
            calcScreen.innerText = currentExpression;
        }
    });
});

// --- SÉCURISATION ET FORCE DE CHARGEMENT DE LA PUBLICITÉ ---
const adContainer = document.getElementById('ad-container');

function gererPublicite() {
    if (navigator.onLine) {
        // En ligne : Espace prêt à injecter le script AdMob
        adContainer.innerHTML = '<p class="ad-placeholder">Chargement des publicités AdMob...</p>';
    } else {
        // Hors-ligne : Message d'incitation à activer les données
        adContainer.innerHTML = '<p class="text-[9px] text-yellow-500 font-bold uppercase tracking-wider text-center animate-pulse px-2">Activez internet pour soutenir l\'application 🇨🇬</p>';
    }
}

window.addEventListener('online', gererPublicite);
window.addEventListener('offline', gererPublicite);
document.addEventListener('DOMContentLoaded', gererPublicite);

// --- SERVICE WORKER ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(err => console.error("SW failed:", err));
    });
}