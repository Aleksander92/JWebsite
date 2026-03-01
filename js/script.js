//////////////////////////////////////////////////////////////////////////////////////////////
//                       Grid generation and alphabet working functions
//////////////////////////////////////////////////////////////////////////////////////////////

function initLocalStorage() {
  if (!localStorage.getItem('mode')) {
    localStorage.setItem('mode', Mode.RomajiToHiragana);
  }
  if (!localStorage.getItem('attempts')) {
    localStorage.setItem('attempts', 0);
  }
  if (!localStorage.getItem('correctAttempts')) {
    localStorage.setItem('correctAttempts', 0);
  }
  localStorage.setItem('curTaskQuestion', localStorage.getItem('curTaskQuestion') || '');
  localStorage.setItem('curTaskAnswer', localStorage.getItem('curTaskAnswer') || '');
  if (!localStorage.getItem('curTaskIndex')) {
    localStorage.setItem('curTaskIndex', 0);
  }
}

function getQuizConfig(mode) {
  switch (mode) {
    case Mode.HiraganaToRomaji:
      return { quiz: new HiraganaQuiz(), questionIndex: 0, answerIndex: 1 };
    case Mode.KatakanaToRomaji:
      return { quiz: new KatakanaQuiz(), questionIndex: 0, answerIndex: 1 };
    case Mode.RomajiToKatakana:
      return { quiz: new KatakanaQuiz(), questionIndex: 1, answerIndex: 0 };
    case Mode.RomajiToHiragana:
    default:
      return { quiz: new HiraganaQuiz(), questionIndex: 1, answerIndex: 0 };
  }
}

var currentQuiz = null;
var currentQuestionIndex = 0;
var currentAnswerIndex = 1;

function createTask() {
  if (!currentQuiz) {
    return;
  }

  currentQuiz.createTask(currentQuestionIndex, currentAnswerIndex);
}

function createGame(mode) {
  localStorage.setItem('mode', mode);
  var config = getQuizConfig(mode);
  currentQuiz = config.quiz;
  currentQuestionIndex = config.questionIndex;
  currentAnswerIndex = config.answerIndex;

  currentQuiz.createGrid(currentAnswerIndex);
  currentQuiz.updateBadge();
  createTask();
  showStats();
}

function checkAnswerAndMakeNewTask(button) {
  localStorage.setItem('userAnswer', button.textContent);

  var previousTaskQuestions = document.getElementsByClassName('previous-task-question');
  for (const previousTaskQuestion of previousTaskQuestions) {
    previousTaskQuestion.textContent = localStorage.getItem('curTaskQuestion');
  }

  var previousTaskAnswers = document.getElementsByClassName('previous-task-answer');
  for (const previousTaskAnswer of previousTaskAnswers) {
    previousTaskAnswer.textContent = localStorage.getItem('curTaskAnswer');
  }

  highlightGridButton();
  updateStats();
  showStats();
  createTask();
}

function updateStats() {
  var isCorrectAttempt = localStorage.getItem('userAnswer') === localStorage.getItem('curTaskAnswer');
  var attempts = Number(localStorage.getItem('attempts')) + 1;
  var correctAttempts = Number(localStorage.getItem('correctAttempts'));

  if (isCorrectAttempt) {
    correctAttempts += 1;
  }

  localStorage.setItem('attempts', attempts);
  localStorage.setItem('correctAttempts', correctAttempts);
}

function showStats() {
  var attempts = Number(localStorage.getItem('attempts'));
  var correctAttempts = Number(localStorage.getItem('correctAttempts'));
  var correctAttemptsPercentage = (attempts === 0 ? 0 : (correctAttempts * 100) / attempts).toFixed(2) + '%';

  var statsTiles = document.getElementsByClassName('stats-tile');
  for (const statsTile of statsTiles) {
    statsTile.textContent = correctAttempts + '/' + attempts + ' (' + correctAttemptsPercentage + ')';
  }
}

function highlightGridButton() {
  var correctButton = document.getElementById(GridFunctions.buttonGridId(localStorage.getItem('curTaskAnswer')));
  if (correctButton) {
    correctButton.classList.toggle('class-glow-correct');
  }

  if (localStorage.getItem('userAnswer') !== localStorage.getItem('curTaskAnswer')) {
    var wrongButton = document.getElementById(GridFunctions.buttonGridId(localStorage.getItem('userAnswer')));
    if (wrongButton) {
      wrongButton.classList.toggle('class-glow-incorrect');
    }
  }
}

function attachModeButtons() {
  var modeButtons = document.getElementsByClassName('game-mode-button');
  for (const b of modeButtons) {
    b.onclick = function () {
      var mode = Number(this.dataset.mode);
      if (!document.querySelector('.grid')) {
        localStorage.setItem('mode', mode);
        window.location.href = 'index.html';
        return;
      }
      createGame(mode);
    };
  }
}

function gameModesShowToggle() {
  var dropdown = document.getElementById('myDropdown');
  if (dropdown) {
    dropdown.classList.toggle('show');
  }
}

window.onclick = function (event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName('dropdown-content');
    for (var i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
};

var menuToggle = document.getElementById('menuToggle');
if (menuToggle) {
  menuToggle.addEventListener('click', function () {
    var menuDropdown = document.getElementById('menuDropdown');
    menuDropdown.classList.toggle('d-none');
  });
}

var gameModesToggle = document.getElementById('gameModesToggle');
if (gameModesToggle) {
  gameModesToggle.addEventListener('click', function () {
    document.getElementById('gameModesMenu').classList.toggle('d-none');
  });
}

document.addEventListener('click', function (event) {
  var dropdown = document.getElementById('menuDropdown');
  var toggle = document.getElementById('menuToggle');
  if (!dropdown || !toggle) {
    return;
  }

  if (!dropdown.contains(event.target) && !toggle.contains(event.target)) {
    dropdown.classList.add('d-none');
  }
});

initLocalStorage();
attachModeButtons();
if (document.querySelector('.grid')) {
  createGame(Number(localStorage.getItem('mode')));
}
