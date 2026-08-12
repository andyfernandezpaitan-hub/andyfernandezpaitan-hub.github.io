// SONIDO DE CLICK (generado, no necesita archivo mp3)
let contextoAudio = null;

function obtenerContextoAudio() {
  if (!contextoAudio) {
    contextoAudio = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (contextoAudio.state === "suspended") {
    contextoAudio.resume();
  }
  return contextoAudio;
}

function reproducirClick() {
  try {
    const contexto = obtenerContextoAudio();
    const oscilador = contexto.createOscillator();
    const volumen = contexto.createGain();

    oscilador.type = "sine";
    oscilador.frequency.setValueAtTime(700, contexto.currentTime);
    oscilador.frequency.exponentialRampToValueAtTime(300, contexto.currentTime + 0.1);

    volumen.gain.setValueAtTime(0.15, contexto.currentTime);
    volumen.gain.exponentialRampToValueAtTime(0.001, contexto.currentTime + 0.1);

    oscilador.connect(volumen);
    volumen.connect(contexto.destination);

    oscilador.start();
    oscilador.stop(contexto.currentTime + 0.1);
  } catch (error) {
    console.warn("No se pudo reproducir el sonido de click:", error);
  }
}

function hablar(texto) {
  reproducirClick();
  try {
    speechSynthesis.cancel();
    const voz = new SpeechSynthesisUtterance(texto);
    voz.lang = "es-ES";
    speechSynthesis.speak(voz);
  } catch (error) {
    console.warn("No se pudo reproducir la voz:", error);
  }
}

// Muestra una imagen y la oculta sola después de unos segundos (modo normal, sin juego)
let temporizadorImagen = null;

function mostrarImagenTemporal(src, segundos = 4) {
  clearTimeout(temporizadorImagen);
  const imagenEl = document.getElementById("imagen");
  imagenEl.src = src;
  imagenEl.style.display = "block";
  temporizadorImagen = setTimeout(() => {
    imagenEl.style.display = "none";
  }, segundos * 1000);
}

// ===========================
//   VOCALES
// ===========================

const listaVocales = [
  { letra: "A", palabra: "avión", imagen: "img/a_avion.png" },
  { letra: "E", palabra: "elefante", imagen: "img/e_elefante.png" },
  { letra: "I", palabra: "iguana", imagen: "img/i_iguana.png" },
  { letra: "O", palabra: "oso", imagen: "img/o_oso.png" },
  { letra: "U", palabra: "uva", imagen: "img/u_uva.png" }
];

let modoJuegoVocales = false;
let respuestaVocal = null;

function toggleJuegoVocales() {
  modoJuegoVocales = !modoJuegoVocales;
  const boton = document.getElementById("btnJuegoVocales");

  if (modoJuegoVocales) {
    boton.textContent = "❌ Salir del juego";
    boton.classList.add("activo");
    nuevaPreguntaVocal();
  } else {
    boton.textContent = "🎯 Modo Juego";
    boton.classList.remove("activo");
    document.getElementById("texto").textContent = "";
    document.getElementById("imagen").style.display = "none";
  }
}

function nuevaPreguntaVocal() {
  const opcion = listaVocales[Math.floor(Math.random() * listaVocales.length)];
  respuestaVocal = opcion.letra;
  const pregunta = `¿Dónde está la ${respuestaVocal}?`;
  document.getElementById("texto").textContent = pregunta;
  document.getElementById("imagen").style.display = "none";
  quitarFeedback();
  hablar(pregunta);
}

function verificarRespuestaVocal(letraElegida, imagen) {
  if (letraElegida === respuestaVocal) {
    clearTimeout(temporizadorImagen);
    document.getElementById("imagen").src = imagen;
    document.getElementById("imagen").style.display = "block";
    mostrarFeedback(true, "✅ ¡Correcto!");
    hablar("¡Correcto!");
    setTimeout(nuevaPreguntaVocal, 1800);
  } else {
    mostrarFeedback(false, "❌ Intenta de nuevo");
    hablar("Intenta de nuevo");
  }
}

// VOCAL CON IMAGEN (modo normal) o revisar respuesta (modo juego)
function mostrar(letra, palabra, imagen) {
  if (modoJuegoVocales) {
    verificarRespuestaVocal(letra, imagen);
    return;
  }
  const texto = `${letra} de ${palabra}`;
  document.getElementById("texto").textContent = texto;
  mostrarImagenTemporal(imagen);
  hablar(texto);
}

// ===========================
//   ABECEDARIO
// ===========================
// (sin cambios, no tiene imagen ni modo juego)

// ===========================
//   NÚMEROS
// ===========================

function decirNumero(num) {
  const texto = `Número ${num}`;
  document.getElementById("texto").textContent = texto;
  document.getElementById("imagen").style.display = "none";
  hablar(texto);
}

// ===========================
//   ANIMALES
// ===========================

const listaAnimales = [
  { nombre: "Perro", imagen: "img/perro.png" },
  { nombre: "Gato", imagen: "img/gato.png" },
  { nombre: "León", imagen: "img/leon.png" },
  { nombre: "Elefante", imagen: "img/elefante.png" },
  { nombre: "Mono", imagen: "img/mono.png" },
  { nombre: "Rana", imagen: "img/rana.png" },
  { nombre: "Conejo", imagen: "img/conejo.png" },
  { nombre: "Panda", imagen: "img/panda.png" }
];

let modoJuegoAnimales = false;
let respuestaAnimal = null;

function toggleJuegoAnimales() {
  modoJuegoAnimales = !modoJuegoAnimales;
  const boton = document.getElementById("btnJuegoAnimales");

  if (modoJuegoAnimales) {
    boton.textContent = "❌ Salir del juego";
    boton.classList.add("activo");
    nuevaPreguntaAnimal();
  } else {
    boton.textContent = "🎯 Modo Juego";
    boton.classList.remove("activo");
    document.getElementById("texto").textContent = "";
    document.getElementById("imagen").style.display = "none";
  }
}

function nuevaPreguntaAnimal() {
  const opcion = listaAnimales[Math.floor(Math.random() * listaAnimales.length)];
  respuestaAnimal = opcion.nombre;
  const pregunta = `Encuentra: ${respuestaAnimal}`;
  document.getElementById("texto").textContent = pregunta;
  document.getElementById("imagen").style.display = "none";
  quitarFeedback();
  hablar(`¿Dónde está el ${respuestaAnimal}?`);
}

function verificarRespuestaAnimal(animalElegido, imagen) {
  if (animalElegido === respuestaAnimal) {
    clearTimeout(temporizadorImagen);
    document.getElementById("imagen").src = imagen;
    document.getElementById("imagen").style.display = "block";
    mostrarFeedback(true, "✅ ¡Correcto! " + respuestaAnimal);
    hablar("¡Correcto!");
    setTimeout(nuevaPreguntaAnimal, 1800);
  } else {
    mostrarFeedback(false, "❌ Intenta de nuevo");
    hablar("Intenta de nuevo");
  }
}

// ANIMALES CON IMAGEN (modo normal) o revisar respuesta (modo juego)
function mostrarAnimal(animal, imagen) {
  if (modoJuegoAnimales) {
    verificarRespuestaAnimal(animal, imagen);
    return;
  }
  document.getElementById("texto").textContent = animal;
  mostrarImagenTemporal(imagen);
  hablar(animal);
}

// ===========================
//   FEEDBACK VISUAL (correcto / incorrecto)
// ===========================

function mostrarFeedback(esCorrecto, mensaje) {
  const panel = document.querySelector(".pantalla");
  document.getElementById("texto").textContent = mensaje;
  quitarFeedback();
  panel.classList.add(esCorrecto ? "correcto" : "incorrecto");
}

function quitarFeedback() {
  const panel = document.querySelector(".pantalla");
  panel.classList.remove("correcto", "incorrecto");
}