const questions = [
    "Me resulta difícil concentrarme durante períodos largos.",
    "Siento que mi forma de pensar es diferente a la de los demás.",
    "Me cuesta entender señales sociales.",
    "Prefiero rutinas fijas y me incomodan los cambios inesperados."
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
    document.getElementById('question-text').textContent = `${currentQuestion + 1}. ${questions[currentQuestion]}`;
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
  
  function showResults() {
    localStorage.setItem('neurodivergencia_respuestas', JSON.stringify(answers));
    window.location.href = "resultados.html";
  }
  
  function closePopup() {
    document.getElementById('popup-warning').classList.add('hidden');
  }
  
  window.onload = () => {
    updateQuestion();
    updateButtons();
  };
  
  function updateProgressBar() {
    const progress = ((currentQuestion + 1) / questions.length) * 100;
    document.getElementById('progress-bar').style.width = `${progress}%`;
    document.getElementById('progress-text').textContent = `Pregunta ${currentQuestion + 1} de ${questions.length}`;
  }
  