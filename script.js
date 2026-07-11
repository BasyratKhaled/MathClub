// --- PUZZLE SOLVERS CORE LOGIC ---
function checkPuzzle1() {
    let ans = document.getElementById('p1-input').value;
    let feedback = document.getElementById('p1-feedback');
    if(parseInt(ans) === 160) {
        feedback.innerText = "🌟 Stellar! The pattern doubles every time (x2)!";
        feedback.style.color = "green";
    } else {
        feedback.innerText = "❌ That trajectory is off. Try again!";
        feedback.style.color = "red";
    }
}

function checkPuzzle2() {
    let ans = document.getElementById('p2-input').value;
    let feedback = document.getElementById('p2-feedback');
    if(parseInt(ans) === 5) {
        feedback.innerText = "🌟 Perfect Balance! 🪐 = 10 and 🌟 = 5!";
        feedback.style.color = "green";
    } else {
        feedback.innerText = "❌ Gravity imbalance! Recalculate!";
        feedback.style.color = "red";
    }
}

function checkPuzzle3() {
    let ans = document.getElementById('p3-input').value.trim();
    let feedback = document.getElementById('p3-feedback');
    if(ans === "1/4" || ans === "2/8") {
        feedback.innerText = "🌟 Outstanding! 2/8 reduces down directly to 1/4!";
        feedback.style.color = "green";
    } else {
        feedback.innerText = "❌ Incorrect fraction reduction. Check your math!";
        feedback.style.color = "red";
    }
}

// --- GAMES CORE LOGIC ---
let g1_num1, g1_num2, g1_ans;
let g2_num1, g2_num2, g2_sign, g2_res;
let g3_num1, g3_num2, g3_ans;

function initGames() {
    // Game 1 setup
    g1_num1 = Math.floor(Math.random() * 50) + 1;
    g1_num2 = Math.floor(Math.random() * 50) + 1;
    g1_ans = g1_num1 + g1_num2;
    document.getElementById('g1-question').innerText = `${g1_num1} + ${g1_num2} = ?`;
    
    // Game 2 setup
    const signs = ['+', '-', '*'];
    g2_sign = signs[Math.floor(Math.random() * signs.length)];
    g2_num1 = Math.floor(Math.random() * 12) + 2;
    g2_num2 = Math.floor(Math.random() * 12) + 2;
    
    // Ensure no negative results for kids subtraction
    if(g2_sign === '-' && g2_num1 < g2_num2) {
        let temp = g2_num1;
        g2_num1 = g2_num2;
        g2_num2 = temp;
    }
    
    g2_res = eval(`${g2_num1} ${g2_sign} ${g2_num2}`);
    document.getElementById('g2-question').innerText = `${g2_num1} [?] ${g2_num2} = ${g2_res}`;

    // Game 3 setup
    g3_num1 = Math.floor(Math.random() * 200);
    g3_num2 = Math.floor(Math.random() * 200);
    g3_ans = g3_num1 > g3_num2 ? '>' : (g3_num1 < g3_num2 ? '<' : '=');
    document.getElementById('g3-question').innerText = `${g3_num1} [?] ${g3_num2}`;
}

function checkGame1() {
    let userAns = parseInt(document.getElementById('g1-answer').value);
    let feedback = document.getElementById('g1-feedback');
    if(userAns === g1_ans) {
        feedback.innerText = "🚀 Rocket fueled! Correct!";
        feedback.style.color = "green";
        setTimeout(initGames, 1500);
    } else {
        feedback.innerText = "❌ Try again, Cadet!";
        feedback.style.color = "red";
    }
    document.getElementById('g1-answer').value = "";
}

function checkGame2() {
    let userAns = document.getElementById('g2-answer').value.trim();
    let feedback = document.getElementById('g2-feedback');
    if(userAns === g2_sign) {
        feedback.innerText = "🚀 Orbit secured! Correct sign!";
        feedback.style.color = "green";
        setTimeout(initGames, 1500);
    } else {
        feedback.innerText = "❌ Warning: Wrong symbol!";
        feedback.style.color = "red";
    }
    document.getElementById('g2-answer').value = "";
}

function checkGame3() {
    let userAns = document.getElementById('g3-answer').value.trim();
    let feedback = document.getElementById('g3-feedback');
    if(userAns === g3_ans) {
        feedback.innerText = "🚀 Gravity balanced!";
        feedback.style.color = "green";
        setTimeout(initGames, 1500);
    } else {
        feedback.innerText = "❌ That's not right!";
        feedback.style.color = "red";
    }
    document.getElementById('g3-answer').value = "";
}

// --- AI WIDGET CONTROL & BACKEND PARSER ENGINE ---
function toggleChat() {
    let win = document.getElementById('chat-window');
    win.style.display = (win.style.display === 'flex') ? 'none' : 'flex';
}

function handleChatKey(e) {
    if(e.key === 'Enter') sendChatMessage();
}

function sendChatMessage() {
    let inputEl = document.getElementById('chat-input');
    let text = inputEl.value.trim();
    if(!text) return;

    appendMsg(text, 'msg-user');
    inputEl.value = "";

    setTimeout(() => {
        let response = generateBotResponse(text);
        appendMsg(response, 'msg-bot');
    }, 500); // Slight delay for AI "thinking" feel
}

function appendMsg(text, className) {
    let body = document.getElementById('chat-body');
    let msg = document.createElement('div');
    msg.className = `chat-msg ${className}`;
    msg.innerHTML = text;
    body.appendChild(msg);
    body.scrollTop = body.scrollHeight;
}

function generateBotResponse(input) {
    let query = input.toLowerCase().trim();

    // 1. Backend Evaluation Engine for Arithmetic Strings
    let mathExpression = query
        .replace(/times|into/g, '*')
        .replace(/divided by/g, '/')
        .replace(/plus/g, '+')
        .replace(/minus/g, '-')
        .replace(/x/g, '*')
        .replace(/[^0-9\+\-\*\/\(\)\. ]/g, ''); // Removes non-math words

    if (mathExpression.trim() !== "" && /[0-9]/.test(mathExpression)) {
        try {
            let solvedResult = eval(mathExpression);
            return `Beep Boop! 🛰️ My onboard navigation computer solved that! <br><br><b>Equation:</b> ${mathExpression}<br><b>Answer:</b> ${solvedResult} 🌠`;
        } catch (e) {
            return "🛰️ My sensors picked up math, but the format is strange! Try typing it like this: <b>25 * 4</b> or <b>50 + 100</b>!";
        }
    }

    // 2. Platform Structural Information
    if(query.includes('puzzle')) {
        return "We have three cosmic challenges in our <b>Astro Math Puzzles</b> section: Star Sequence, Planet Balance, and Moon Phases! Scroll up to play!";
    }
    if(query.includes('game') || query.includes('play')) {
        return "Our <b>Cosmic Challenge Arena</b> features three games: Rocket Sums, Orbit Sign Finder, and Compare Galaxies! Have fun exploring!";
    }
    if(query.includes('math club')) {
        return "Math Club is a space-themed learning platform designed to make math incredibly fun and intuitive for kids like you!";
    }

    // 3. Fallback Out-of-Bounds Communication Route
    return "Beep boop! 🛰️ I only answer specific math calculations or questions about Math Club features! For anything else, please <b>contact here for more:</b><br><br>📧 Email: <a href='mailto:support@mathclub.com' style='color:#7b2cbf;'>support@mathclub.com</a><br>📱 WhatsApp: <a href='https://wa.me/1234567890' target='_blank' style='color:#7b2cbf;'>Chat Link</a>";
}

// Initialize Games on Page Load
window.onload = initGames;

// Sticky Navigation Tracker 
const links = document.querySelectorAll('nav a');
links.forEach(link => {
    link.addEventListener('click', () => {
        links.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});