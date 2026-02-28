//////////////////////////////////////////////////////////////////////////////////////////////
//                       Grid generation and alphabet working functions
//////////////////////////////////////////////////////////////////////////////////////////////

var alphabet = [
  ['あ', 'a'], ['い', 'i'], ['う', 'u'], ['え', 'e'], ['お', 'o'],
  ['か', 'ka'], ['き', 'ki'], ['く', 'ku'], ['け', 'ke'], ['こ', 'ko'],
  ['さ', 'sa'], ['し', 'shi'], ['す', 'su'], ['せ', 'se'], ['そ', 'so'],
  ['た', 'ta'], ['ち', 'chi'], ['つ', 'tsu'], ['て', 'te'], ['と', 'to'],
  ['な', 'na'], ['に', 'ni'], ['ぬ', 'nu'], ['ね', 'ne'], ['の', 'no'],
  ['は', 'ha'], ['ひ', 'hi'], ['ふ', 'fu'], ['へ', 'he'], ['ほ', 'ho'],
  ['ま', 'ma'], ['み', 'mi'], ['む', 'mu'], ['め', 'me'], ['も', 'mo'],
  ['や', 'ya'], ['ゆ', 'yu'], ['よ', 'yo'],
  ['ら', 'ra'], ['り', 'ri'], ['る', 'ru'], ['れ', 're'], ['ろ', 'ro'],
  ['わ', 'wa'], ['を', 'wo'], ['ん', 'n']
];

var gaps = [36, 37, 44, 45];

function hiraganaToEnglish(hieroglyph) {
  for (const item of alphabet) {
    if (item[0] === hieroglyph) {
      return item[1];
    }
  }
  throw new Error('No such hieroglyph: ' + hieroglyph);
}

function anythingToEnglish(s) {
  if (s[0] >= 'a' && s[0] <= 'z') {
    return s;
  }
  return hiraganaToEnglish(s);
}

function createGrid(mode) {
  var rows = document.getElementsByClassName('grid-row');
  for (var i = rows.length - 1; i > -1; --i) {
    rows[i].remove();
  }

  var grid = document.getElementsByClassName('grid')[0];
  if (!grid) {
    return;
  }

  var gapUsed = false;
  var alphabetTextContentIndex = mode ^ 1;

  for (var rowIndex = 0; rowIndex < alphabet.length;) {
    var row = document.createElement('div');
    row.setAttribute('class', 'row row-cols-5 grid-row');
    grid.appendChild(row);

    for (var c = 0; c < 5 && rowIndex < alphabet.length; c++, rowIndex++) {
      var col = document.createElement('div');
      col.setAttribute('class', 'col');
      col.style.display = 'flex';
      col.style.justifyContent = 'center';
      row.appendChild(col);

      if (gaps.includes(rowIndex) && !gapUsed) {
        rowIndex -= 1;
        gapUsed = true;
        continue;
      }
      gapUsed = false;

      var button = document.createElement('button');
      button.innerHTML = alphabet[rowIndex][alphabetTextContentIndex];
      button.setAttribute('class', 'button-grid glow');
      button.setAttribute('id', 'button-grid-' + alphabet[rowIndex][1]);
      button.setAttribute('role', 'button');
      button.onclick = function () { checkAnswerAndMakeNewTask(this); };
      button.addEventListener('animationend', function () {
        this.classList.remove('class-glow-correct');
        this.classList.remove('class-glow-incorrect');
      });
      col.appendChild(button);
    }
  }
}

function initLocalStorage() {
  if (!localStorage.getItem('mode')) {
    localStorage.setItem('mode', 1);
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

function createTask() {
  var mode = Number(localStorage.getItem('mode'));
  var indPlus = Math.floor(Math.random() * (alphabet.length - 1));
  var ind = (localStorage.getItem('curTaskIndex') + indPlus + 1) % alphabet.length;
  localStorage.setItem('curTaskQuestion', alphabet[ind][mode]);
  localStorage.setItem('curTaskAnswer', alphabet[ind][mode ^ 1]);
  localStorage.setItem('curTaskIndex', ind);

  var taskQuestionElements = document.getElementsByClassName('task-question');
  for (const e of taskQuestionElements) {
    e.textContent = localStorage.getItem('curTaskQuestion');
  }
}

function createGame(mode) {
  localStorage.setItem('mode', mode);
  createGrid(mode);
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
  var correctButton = document.getElementById('button-grid-' + anythingToEnglish(localStorage.getItem('curTaskAnswer')));
  if (correctButton) {
    correctButton.classList.toggle('class-glow-correct');
  }

  if (localStorage.getItem('userAnswer') !== localStorage.getItem('curTaskAnswer')) {
    var wrongButton = document.getElementById('button-grid-' + anythingToEnglish(localStorage.getItem('userAnswer')));
    if (wrongButton) {
      wrongButton.classList.toggle('class-glow-incorrect');
    }
  }
}

function attachModeButtons() {
  var engToHirButtons = document.getElementsByClassName('game-modes-button-eng-to-hir');
  for (const b of engToHirButtons) {
    b.onclick = function () {
      if (!document.querySelector('.grid')) {
        localStorage.setItem('mode', 1);
        window.location.href = 'index.html';
        return;
      }
      createGame(1);
    };
  }

  var hirToEngButtons = document.getElementsByClassName('game-modes-button-hir-to-eng');
  for (const b of hirToEngButtons) {
    b.onclick = function () {
      if (!document.querySelector('.grid')) {
        localStorage.setItem('mode', 0);
        window.location.href = 'index.html';
        return;
      }
      createGame(0);
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
