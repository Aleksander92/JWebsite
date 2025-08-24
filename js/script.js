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
var gaps = [
  36, 37, 44, 45
];

function hiraganaToEnglish(hieroglyph) {
  for (item of alphabet) {
    if (item[0] == hieroglyph) {
      return item[1];
    }
  }
  throw new Error(`No such hieroglyph: ${hieroglyph}`);
}

function anythingToEnglish(s) {
  if (s[0] >= 'a' && s[0] <= 'z') {
    return s;
  }
  return hiraganaToEnglish(s);
}

async function createGrid(mode) {
  var rows = document.getElementsByClassName('grid-row');
  for (i = rows.length - 1; i > -1; --i) {
    rows[i].remove();
  }

  var grid = document.getElementsByClassName('grid')[0];

  var gapUsed = false;
  var alphabetTextContentIndex = (mode ^ 1);

  for (var i = 0; i < alphabet.length;) {
    var row = document.createElement('div');
    row.setAttribute('class', 'row row-cols-5 grid-row');
    row.style.marginBottom = '4px';
    grid.appendChild(row);

    for (var c = 0; c < 5 && i < alphabet.length; c++, i++) {
      var col = document.createElement('div');
      col.setAttribute('class', 'col');
      col.style.display = 'flex';
      col.style.justifyContent = 'center';
      row.appendChild(col);

      if (gaps.includes(i) && !gapUsed) {
        --i;
        gapUsed = true;
        continue;
      }
      gapUsed = false;

      var button = document.createElement('button');
      button.innerHTML = alphabet[i][alphabetTextContentIndex];
      button.setAttribute('class', 'button-grid glow');
      button.setAttribute('id', 'button-grid-' + alphabet[i][1]);
      button.setAttribute('role', 'button');
      button.onclick = function () { checkAnswerAndMakeNewTask(this) };
      button.addEventListener('animationstart', () => { });
      button.addEventListener('animationiteration', () => { });
      button.addEventListener('animationend', function (e) {
        this.classList.remove('class-glow-correct');
        this.classList.remove('class-glow-incorrect');
      });
      col.appendChild(button);
    }
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////
//                    </ Grid generation and alphabet working functions >
//////////////////////////////////////////////////////////////////////////////////////////////

async function fetchUrlGet(url) {
  var response = await fetch(url, {
    method: 'GET',
    mode: 'cors',
  })
    .then(response => response.json());
  console.log(response);
  return response;
}

async function fetchAndSet(url, docField, urlFields) {
  response = await fetchUrlGet(url);

  console.log(urlFields);
  console.log(typeof urlFields);
  if (typeof urlFields === 'string') {
    console.log('string');
    console.log(urlFields);
    response = response[urlFields];
  } else {
    for (urlField of urlFields) {
      console.log('object');
      console.log(urlField);
      response = response[urlField];
    }
  }

  document.getElementById('out1')[docField] = response;
}

async function createGame(mode) {
  localStorage.setItem('mode', mode);
  createGrid(mode);

  response = await fetchUrlGet(`https://localhost:7073/create_game?mode=${mode}`);
  localStorage.setItem('id', response['id']);
  processResponse(response);
}

async function checkAnswerAndMakeNewTask(button) {
  localStorage.setItem('userAnswer', button.textContent);

  response = await fetchUrlGet(`https://localhost:7073/check_answer_and_make_new_task?id=${localStorage.getItem('id')}&userAnswer=${button.textContent}`);

  document.getElementById('previous-task-question').textContent = localStorage.getItem('taskQuestion');
  document.getElementById('previous-task-answer').textContent = response['prevTaskAnswer'];

  highlightGridButton(response['prevTaskAnswer']);

  processResponse(response);
}

async function processResponse(response) {
  localStorage.setItem('taskQuestion', response['taskQuestion']);

  var taskQuestionElements = document.getElementsByClassName('task-question');
  for (e of taskQuestionElements) {
    e.textContent = response['taskQuestion'];
  }
  var correctAttemptsPercentage = (response['attempts'] == 0 ? 0 : response['correctAttempts'] * 100 / response['attempts']).toFixed(2).toString() + '%';
  document.getElementById('attempts').textContent = response['correctAttempts'] + '/' + response['attempts'] + ' (' + correctAttemptsPercentage + ')';
  // document.getElementById('correct-attempts').textContent = response['correctAttempts'];
  // document.getElementById('correct-attempts-percentage').textContent = (response['attempts'] == 0 ? 100 : response['correctAttempts'] * 100 / response['attempts']).toFixed(2).toString() + '%';
}

function highlightGridButton(prevTaskAnswer) {
  document.getElementById('button-grid-' + anythingToEnglish(localStorage.getItem('taskQuestion'))).classList.toggle('class-glow-correct');
  if (localStorage.getItem('userAnswer') != prevTaskAnswer) {
    document.getElementById('button-grid-' + anythingToEnglish(localStorage.getItem('userAnswer'))).classList.toggle('class-glow-incorrect');
  }
}

document.getElementById('game-modes-button-eng-to-hir').onclick = function () {
  createGame(1);
};
document.getElementById('game-modes-button-hir-to-eng').onclick = function () {
  createGame(0);
};

//fetchAndSet('https://jsonplaceholder.typicode.com/posts/1', 'textContent', 'body');

//fetchAndSet('https://localhost:7073/states', 'textContent', [0, 'id']);

createGame(1);

function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function (event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}