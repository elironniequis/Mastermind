// Variables globales
let COLORES = [];
let combinacionSecreta = [];
let intentoActual = [];
let intentosRestantes = 10;
let intentosIA = 0;
let tiempoIA = 500;  // Tiempo en milisegundos entre intentos de la IA

// Función para empezar el juego con el número de colores según la dificultad
function startGame(numColores) {
    const colorsContainer = document.getElementById("colors");
    colorsContainer.innerHTML = ''; // Limpiar colores previos

    // Reiniciar los slots (círculos grises)
    for (let i = 1; i <= 4; i++) {
        const slot = document.getElementById(`slot${i}`);
        slot.className = 'slot';  // Reiniciar los slots a su estado inicial (color gris)
    }

    // Definir los colores dependiendo de la dificultad
    COLORES = [
        { nombre: "rojo", clase: "rojo" },
        { nombre: "azul", clase: "azul" },
        { nombre: "verde", clase: "verde" },
        { nombre: "amarillo", clase: "amarillo" },
        { nombre: "naranja", clase: "naranja" },
        { nombre: "morado", clase: "morado" },
        { nombre: "rosa", clase: "rosa" },
        { nombre: "marron", clase: "marron" },
        { nombre: "gris", clase: "gris" },
        { nombre: "negro", clase: "negro" }
    ].slice(0, numColores);  // Limitar la cantidad de colores según el nivel

    // Generar los botones de colores con animación
    COLORES.forEach((color, index) => {
        const colorButton = document.createElement('button');
        colorButton.classList.add('color-btn', color.clase);
        colorButton.onclick = () => selectColor(color.nombre, color.clase);
        colorButton.id = `color-${color.nombre}`;
        colorButton.style.animation = `fadeIn 0.5s ease ${index * 0.1}s both`;
        colorsContainer.appendChild(colorButton);
    });

    generarCombinacionSecreta();
    intentosRestantes = 10;
    intentosIA = 0;
    intentoActual = [];
    actualizarIntentosRestantes();
    document.getElementById("message").innerHTML = '';
    document.getElementById("feedback").innerHTML = '';

    // Ocultar el menú y mostrar el juego con animación
    document.getElementById("menu-overlay").style.animation = "fadeOut 0.5s ease forwards";
    setTimeout(() => {
        document.getElementById("menu-overlay").style.display = 'none';
        document.getElementById("game-container").classList.remove('hidden');
        document.getElementById("game-container").style.animation = "fadeIn 0.5s ease forwards";
    }, 500);
}

// Función para volver al menú
function backToMenu() {
    document.getElementById("game-container").style.animation = "fadeOut 0.5s ease forwards";
    setTimeout(() => {
        document.getElementById("game-container").classList.add('hidden');
        document.getElementById("menu-overlay").style.display = 'flex';
        document.getElementById("menu-overlay").style.animation = "fadeIn 0.5s ease forwards";
    }, 500);
}

// Generar combinación secreta sin repetición de colores
function generarCombinacionSecreta() {
    combinacionSecreta = COLORES.map(color => color.nombre);
    combinacionSecreta.sort(() => 0.5 - Math.random());
    combinacionSecreta = combinacionSecreta.slice(0, 4);
    console.log("Combinación secreta:", combinacionSecreta); // Para pruebas, puedes eliminar esto en producción
}

// Selección de color por el jugador
function selectColor(colorNombre, colorClase) {
    if (intentoActual.length < 4) {
        intentoActual.push(colorNombre);
        const slot = document.getElementById(`slot${intentoActual.length}`);
        slot.className = '';
        slot.classList.add('slot', colorClase, 'selected');
        document.getElementById(`color-${colorNombre}`).disabled = true;
        
        // Eliminar la clase 'selected' después de la animación
        setTimeout(() => {
            slot.classList.remove('selected');
        }, 500);

        // Si se han seleccionado 4 colores, habilitar el botón de "Intentar"
        if (intentoActual.length === 4) {
            document.getElementById("check-btn").disabled = false;
        }
    }
}

// Comprobar intento del jugador
function checkAttempt() {
    if (intentoActual.length !== 4) {
        mostrarMensaje("Debes seleccionar 4 colores.", "error");
        return;
    }

    const pistas = obtenerPistas(combinacionSecreta, intentoActual);
    animarFeedback(pistas.negros, pistas.blancos);
    
    if (pistas.negros === 4) {
        mostrarMensaje("¡Felicidades! Has adivinado la combinación secreta.", "success");
        mostrarReiniciar();
        return;
    }

    intentosRestantes--;
    actualizarIntentosRestantes();

    if (intentosRestantes === 0) {
        mostrarMensaje(`Te quedaste sin intentos. La combinación secreta era: ${combinacionSecreta.join(", ")}.`, "error");
        mostrarReiniciar();
        mostrarCombinacionSecreta();
    }

    // Reiniciar intento actual
    intentoActual = [];
    for (let i = 1; i <= 4; i++) {
        const slot = document.getElementById(`slot${i}`);
        slot.className = 'slot';  // Reiniciar slots a su estado inicial
    }

    // Habilitar de nuevo todos los botones de color
    COLORES.forEach(color => {
        document.getElementById(`color-${color.nombre}`).disabled = false;
    });

    // Deshabilitar el botón de "Intentar" hasta que se seleccionen 4 colores nuevamente
    document.getElementById("check-btn").disabled = true;
}

// Obtener pistas
function obtenerPistas(combinacionSecreta, intento) {
    let negros = 0;
    let blancos = 0;
    let coloresSecretaRestantes = [];
    let coloresIntentoRestantes = [];

    for (let i = 0; i < 4; i++) {
        if (intento[i] === combinacionSecreta[i]) {
            negros++;
        } else {
            coloresSecretaRestantes.push(combinacionSecreta[i]);
            coloresIntentoRestantes.push(intento[i]);
        }
    }

    for (let color of coloresIntentoRestantes) {
        if (coloresSecretaRestantes.includes(color)) {
            blancos++;
            coloresSecretaRestantes.splice(coloresSecretaRestantes.indexOf(color), 1);
        }
    }

    return { negros, blancos };
}

// Resolver el juego con IA (Animación)
function solveWithAI() {
    intentosIA = 0;
    intentoActual = [];
    mostrarMensaje("La IA está resolviendo el juego...", "info");

    const intervalo = setInterval(() => {
        if (intentosIA < 4) {
            intentoActual.push(combinacionSecreta[intentosIA]);
            const slot = document.getElementById(`slot${intentosIA + 1}`);
            slot.className = '';
            slot.classList.add('slot', combinacionSecreta[intentosIA], 'selected');
            setTimeout(() => {
                slot.classList.remove('selected');
            }, 300);
            intentosIA++;
        } else {
            clearInterval(intervalo);
            mostrarMensaje(`¡La IA ha resuelto el juego en ${intentosIA} intentos!`, "success");
            mostrarReiniciar();
            mostrarCombinacionSecreta();
        }
    }, tiempoIA);
}

// Mostrar la combinación secreta cuando la IA resuelva el juego o el jugador pierda
function mostrarCombinacionSecreta() {
    const combinacionDiv = document.createElement('div');
    combinacionDiv.innerHTML = `<h3>Combinación secreta:</h3>`;
    const coloresDiv = document.createElement('div');
    coloresDiv.style.display = 'flex';
    coloresDiv.style.justifyContent = 'center';
    coloresDiv.style.marginTop = '10px';
    
    combinacionSecreta.forEach(color => {
        const colorSpan = document.createElement('span');
        colorSpan.classList.add('slot', color);
        colorSpan.style.margin = '0 5px';
        coloresDiv.appendChild(colorSpan);
    });
    
    combinacionDiv.appendChild(coloresDiv);
    document.getElementById("message").appendChild(combinacionDiv);
}

// Reiniciar el juego
function resetGame() {
    intentoActual = [];
    document.getElementById("feedback").innerHTML = '';
    document.getElementById("message").innerHTML = '';
    document.getElementById("reset").style.display = 'none';

    for (let i = 1; i <= 4; i++) {
        document.getElementById(`slot${i}`).className = 'slot';
    }

    COLORES.forEach(color => {
        document.getElementById(`color-${color.nombre}`).disabled = false;
    });

    generarCombinacionSecreta();
    intentosRestantes = 10;
    actualizarIntentosRestantes();
    document.getElementById("check-btn").disabled = true;
}

// Funciones de utilidad
function mostrarMensaje(mensaje, tipo) {
    const messageElement = document.getElementById("message");
    messageElement.innerHTML = mensaje;
    messageElement.className = tipo;
    messageElement.style.animation = "fadeIn 0.5s ease";
}

function mostrarReiniciar() {
    document.getElementById("reset").style.display = 'block';
    document.getElementById("reset").style.animation = "fadeIn 0.5s ease";
}

function actualizarIntentosRestantes() {
    const attemptsElement = document.getElementById("attempts");
    attemptsElement.innerHTML = `Intentos restantes: ${intentosRestantes}`;
    attemptsElement.style.animation = "pulse 0.5s ease";
}

function animarFeedback(negros, blancos) {
    const feedbackElement = document.getElementById("feedback");
    feedbackElement.style.transform = "scale(0)";
    setTimeout(() => {
        feedbackElement.innerHTML = `
            <span class="feedback-item negro">${negros}</span>
            <span class="feedback-item blanco">${blancos}</span>
        `;
        feedbackElement.style.transform = "scale(1)";
    }, 300);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById("check-btn").addEventListener('click', checkAttempt);
    document.getElementById("solve-ai-btn").addEventListener('click', solveWithAI);
    document.getElementById("back-to-menu-btn").addEventListener('click', backToMenu);
    document.getElementById("reset").addEventListener('click', resetGame);
});