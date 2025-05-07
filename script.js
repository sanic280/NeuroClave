// Definición de preguntas con sus tipos de neurodivergencia asociados
const questions = [
  { text: "Me resulta difícil concentrarme durante períodos largos.", type: ["tdah"] },
  { text: "A menudo me distraigo fácilmente con estímulos externos.", type: ["tdah"] },
  { text: "Suelo actuar impulsivamente sin pensar en las consecuencias.", type: ["tdah"] },
  { text: "Me cuesta entender las señales sociales y el lenguaje no verbal.", type: ["tea"] },
  { text: "Prefiero rutinas fijas y me incomodan los cambios inesperados.", type: ["tea", "toc"] },
  { text: "Tengo intereses muy específicos en los que puedo concentrarme durante horas.", type: ["tea"] },
  { text: "Experimento períodos de energía extremadamente alta seguidos de períodos de baja energía.", type: ["bipolar"] },
  { text: "A veces mis pensamientos van tan rápido que me cuesta seguirlos.", type: ["bipolar", "tdah"] },
  { text: "Me cuesta leer de forma fluida, incluso si conozco todas las palabras.", type: ["dislexia"] },
  { text: "Confundo frecuentemente el orden de las letras o números cuando leo o escribo.", type: ["dislexia"] },
  { text: "Necesito verificar las cosas repetidamente para asegurarme de que están correctas.", type: ["toc"] },
  { text: "Me siento ansioso/a si las cosas no están perfectamente ordenadas o simétricas.", type: ["toc"] },
  { text: "Me resulta difícil organizar tareas o seguir una secuencia lógica de pasos.", type: ["tdah"] },
  { text: "Evito situaciones sociales porque me resultan incómodas o agotadoras.", type: ["tea"] },
  { text: "A veces siento la necesidad de repetir ciertas acciones aunque sepa que no son necesarias.", type: ["toc"] },
  { text: "Tengo cambios de humor intensos que no siempre tienen una causa clara.", type: ["bipolar"] },
  { text: "Me cuesta recordar lo que acabo de leer, incluso si estoy concentrado/a.", type: ["dislexia"] },
  { text: "Cuando algo me interesa, puedo enfocarme por horas sin sentir el paso del tiempo.", type: ["tea", "tdah"] },
  { text: "Me siento muy incómodo/a si no puedo realizar una tarea exactamente como la tengo planeada.", type: ["toc"] },
  { text: "En momentos de mucha energía, hablo muy rápido y cambio de tema bruscamente.", type: ["bipolar", "tdah"] }
];

const options = [
  "Totalmente en desacuerdo",
  "En desacuerdo",
  "Neutro",
  "De acuerdo",
  "Totalmente de acuerdo"
];

let currentQuestion = 0;
let answers = JSON.parse(localStorage.getItem('neurodivergencia_respuestas')) || new Array(questions.length).fill(null);

function updateQuestion() {
  document.getElementById('question-text').textContent = `${currentQuestion + 1}. ${questions[currentQuestion].text}`;
  renderOptions();
  updateButtons();
  updateProgressBar();
}

function renderOptions() {
  const container = document.getElementById('options-container');
  container.innerHTML = '';

  options.forEach((text, index) => {
    const optionId = `q${currentQuestion}_opt${index}`;

    const wrapper = document.createElement('div');
    wrapper.className = 'option';

    const input = document.createElement('input');
    input.type = 'radio';
    input.name = `question_${currentQuestion}`;
    input.id = optionId;
    input.value = index;
    input.checked = answers[currentQuestion] === index;

    input.addEventListener('change', () => {
      answers[currentQuestion] = index;
      localStorage.setItem('neurodivergencia_respuestas', JSON.stringify(answers));
    });

    const label = document.createElement('label');
    label.htmlFor = optionId;
    label.textContent = text;

    wrapper.appendChild(input);
    wrapper.appendChild(label);
    container.appendChild(wrapper);
  });
}

function nextQuestion() {
  if (answers[currentQuestion] === null) {
    document.getElementById('popup-warning').classList.remove('hidden');
    return;
  }

  currentQuestion++;
  if (currentQuestion < questions.length) {
    updateQuestion();
  } else {
    showResults();
  }
}

function lastQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    updateQuestion();
  }
}

function updateButtons() {
  document.getElementById('backBtn').style.display = currentQuestion > 0 ? 'inline-block' : 'none';
  document.getElementById('nextBtn').style.display = currentQuestion < questions.length - 1 ? 'inline-block' : 'none';
  document.getElementById('resultBtn').style.display = currentQuestion === questions.length - 1 ? 'inline-block' : 'none';
}

function checkIncompleteAnswers() {
  const firstIncomplete = answers.findIndex(ans => ans === null);
  if (firstIncomplete !== -1) {
    currentQuestion = firstIncomplete;
    updateQuestion();
    return true;
  }
  return false;
}

function showResults() {
  if (checkIncompleteAnswers()) {
    document.getElementById('popup-warning').classList.remove('hidden');
    return;
  }

  localStorage.setItem('neurodivergencia_respuestas', JSON.stringify(answers));
  window.location.href = "resultados.html";
}

function closePopup() {
  document.getElementById('popup-warning').classList.add('hidden');
}

window.onload = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const shouldReset = urlParams.get('reset') === 'true';

  if (shouldReset) {
    localStorage.removeItem('neurodivergencia_respuestas');
    answers = new Array(questions.length).fill(null);
  }

  document.getElementById('progress-text').textContent = `Pregunta 1 de ${questions.length}`;
  updateQuestion();
};

function updateProgressBar() {
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  document.getElementById('progress-bar').style.width = `${progress}%`;
  document.getElementById('progress-text').textContent = `Pregunta ${currentQuestion + 1} de ${questions.length}`;
}

document.addEventListener('keydown', function(event) {
  if (event.key === 'ArrowLeft' && currentQuestion > 0) {
    lastQuestion();
  }

  if (event.key === 'ArrowRight' && currentQuestion < questions.length - 1) {
    if (answers[currentQuestion] !== null) {
      nextQuestion();
    } else {
      document.getElementById('popup-warning').classList.remove('hidden');
    }
  }

  if (event.key === 'Enter') {
    if (currentQuestion < questions.length - 1) {
      if (answers[currentQuestion] !== null) {
        nextQuestion();
      } else {
        document.getElementById('popup-warning').classList.remove('hidden');
      }
    } else {
      showResults();
    }
  }
  
});
