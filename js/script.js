var alphabetSize = 46;
var alphabetShifts = [
  1, 1, 1, 1, 0, // a
  1, 1, 1, 1, 1, // ka
  1, 1, 1, 1, 1, // sa
  1, 2, 1, 1, 1, // ta
  0, 0, 0, 0, 0, // na
  2, 2, 2, 2, 2, // ha
  0, 0, 0, 0, 1, // ma
  1, 1, 0, 0, 0, // ra
  0, 0, 1, 2, 0, // wa
  0              // n
];

var grid = document.getElementById('grid');
var hierogpyph = 'あ';
for (var i = 0; i < alphabetSize;) {
  var row = document.createElement('div');
  row.setAttribute('class', 'row row-cols-5');
  row.style.marginBottom = '4px';
  grid.appendChild(row);

  for (var c = 0; c < 5 && i < alphabetSize; c++, i++) {
    var col = document.createElement('div');
    col.setAttribute('class', 'col');
    col.style.display = 'flex';
    col.style.justifyContent = 'center';
    row.appendChild(col);

    var button = document.createElement('button');
    button.innerHTML = hierogpyph;
    button.setAttribute('class', 'button-grid');
    button.setAttribute('role', 'button');
    button.onclick = function () { checkAnswerAndMakeNewTask(this) };
    col.appendChild(button);

    hierogpyph = String.fromCharCode(hierogpyph.charCodeAt(0) + 1 + (i < alphabetShifts.length ? alphabetShifts[i] : 0));
  }
}

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

  document.getElementById('attempts').textContent = response['attempts'];
  document.getElementById('correct-attempts').textContent = response['correctAttempts'];
  document.getElementById('correct-attempts-percentage').textContent = response['attempts'] == 0 ? 100 : response['correct-attempts'] / resposne['attempts'];
}

async function checkAnswerAndMakeNewTask(button) {
  console.log(button.textContent);
  response = await fetchUrlGet(`https://localhost:7073/check_answer_and_make_new_task?id=1&userAnswer=${button.textContent}`);
}

//fetchAndSet('https://jsonplaceholder.typicode.com/posts/1', 'textContent', 'body');

//fetchAndSet('https://localhost:7073/states', 'textContent', [0, 'id']);

createGame();