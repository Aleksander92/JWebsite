//////////////////////////////////////////////////////////////////////////////////////////////
//                          Grid generation and alphabet functions
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

var grid = document.getElementById('grid');
var gapUsed = false;
for (var i = 0; i < alphabet.length;) {
  var row = document.createElement('div');
  row.setAttribute('class', 'row row-cols-5');
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
    button.innerHTML = alphabet[i][0];
    button.setAttribute('class', 'button-grid glow');
    button.setAttribute('id', 'button-grid-' + alphabet[i][1]);
    button.setAttribute('role', 'button');
    button.onclick = function () { checkAnswerAndMakeNewTask(this) };
    button.addEventListener('animationstart', () => { });
    button.addEventListener('animationiteration', () => { });
    button.addEventListener('animationend', function(e) {
      this.classList.remove('class-glow-correct');
      this.classList.remove('class-glow-incorrect');
    });
    col.appendChild(button);
  }
}

//////////////////////////////////////////////////////////////////////////////////////////////
//   End                    Grid generation and alphabet functions
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

async function createGame() {
  response = await fetchUrlGet('https://localhost:7073/create_game?mode=1');

  localStorage.setItem('id', response['id']);

  processResponse(response);
}

async function checkAnswerAndMakeNewTask(button) {
  localStorage.setItem('userAnswer', button.textContent);

  response = await fetchUrlGet(`https://localhost:7073/check_answer_and_make_new_task?id=${localStorage.getItem('id')}&userAnswer=${button.textContent}`);

  highlightGridButton(response['prevTaskAnswer']);

  processResponse(response);
}

async function processResponse(response) {
  localStorage.setItem('taskQuestion', response['taskQuestion']);

  document.getElementById('task-question').textContent = response['taskQuestion'];
  document.getElementById('attempts').textContent = response['attempts'];
  document.getElementById('correct-attempts').textContent = response['correctAttempts'];
  document.getElementById('correct-attempts-percentage').textContent = (response['attempts'] == 0 ? 100 : response['correctAttempts'] * 100 / response['attempts']).toFixed(2).toString() + '%';
}

//fetchAndSet('https://jsonplaceholder.typicode.com/posts/1', 'textContent', 'body');

//fetchAndSet('https://localhost:7073/states', 'textContent', [0, 'id']);

createGame();

function highlightGridButton(prevTaskAnswer) {
  document.getElementById('button-grid-' + localStorage.getItem('taskQuestion')).classList.toggle('class-glow-correct');
  if (localStorage.getItem('userAnswer') != prevTaskAnswer) {
    document.getElementById('button-grid-' + hiraganaToEnglish(localStorage.getItem('userAnswer'))).classList.toggle('class-glow-incorrect');
  }
}