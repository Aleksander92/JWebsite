const Mode = Object.freeze({
  HiraganaToRomaji: 0,
  RomajiToHiragana: 1,
  KatakanaToRomaji: 2,
  RomajiToKatakana: 3
});

class Quiz {
  constructor(alphabet, gaps, badgeText) {
    this.alphabet = alphabet;
    this.gaps = gaps;
    this.badgeText = badgeText;
  }

  createGrid(answerIndex) {
    var rows = document.getElementsByClassName('grid-row');
    for (var i = rows.length - 1; i > -1; --i) {
      rows[i].remove();
    }

    var grid = document.getElementsByClassName('grid')[0];
    if (!grid) {
      return;
    }

    var gapUsed = false;

    for (var rowIndex = 0; rowIndex < this.alphabet.length;) {
      var row = document.createElement('div');
      row.setAttribute('class', 'row row-cols-5 grid-row');
      grid.appendChild(row);

      for (var c = 0; c < 5 && rowIndex < this.alphabet.length; c++, rowIndex++) {
        var col = document.createElement('div');
        col.setAttribute('class', 'col');
        col.style.display = 'flex';
        col.style.justifyContent = 'center';
        row.appendChild(col);

        if (this.gaps.includes(rowIndex) && !gapUsed) {
          rowIndex -= 1;
          gapUsed = true;
          continue;
        }
        gapUsed = false;

        var button = document.createElement('button');
        button.innerHTML = this.alphabet[rowIndex][answerIndex];
        button.setAttribute('class', 'button-grid glow');
        button.setAttribute('id', GridFunctions.buttonGridId(this.alphabet[rowIndex][1]));
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

  createTask(questionIndex, answerIndex) {
    var indPlus = Math.floor(Math.random() * (this.alphabet.length - 1));
    var ind = (Number(localStorage.getItem('curTaskIndex')) + indPlus + 1) % this.alphabet.length;
    localStorage.setItem('curTaskQuestion', this.alphabet[ind][questionIndex]);
    localStorage.setItem('curTaskAnswer', this.alphabet[ind][answerIndex]);
    localStorage.setItem('curTaskIndex', ind);

    var taskQuestionElements = document.getElementsByClassName('task-question');
    for (const e of taskQuestionElements) {
      e.textContent = localStorage.getItem('curTaskQuestion');
    }
  }

  updateBadge() {
    var modeBadges = document.getElementsByClassName('mode-badge');
    for (const badge of modeBadges) {
      badge.textContent = this.badgeText;
    }
  }
}

class HiraganaQuiz extends Quiz {
  constructor() {
    super([
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
    ], [36, 37, 44, 45], '46 basic hiragana');
  }
}

class KatakanaQuiz extends Quiz {
  constructor() {
    super([
      ['ア', 'a'], ['イ', 'i'], ['ウ', 'u'], ['エ', 'e'], ['オ', 'o'],
      ['カ', 'ka'], ['キ', 'ki'], ['ク', 'ku'], ['ケ', 'ke'], ['コ', 'ko'],
      ['サ', 'sa'], ['シ', 'shi'], ['ス', 'su'], ['セ', 'se'], ['ソ', 'so'],
      ['タ', 'ta'], ['チ', 'chi'], ['ツ', 'tsu'], ['テ', 'te'], ['ト', 'to'],
      ['ナ', 'na'], ['ニ', 'ni'], ['ヌ', 'nu'], ['ネ', 'ne'], ['ノ', 'no'],
      ['ハ', 'ha'], ['ヒ', 'hi'], ['フ', 'fu'], ['ヘ', 'he'], ['ホ', 'ho'],
      ['マ', 'ma'], ['ミ', 'mi'], ['ム', 'mu'], ['メ', 'me'], ['モ', 'mo'],
      ['ヤ', 'ya'], ['ユ', 'yu'], ['ヨ', 'yo'],
      ['ラ', 'ra'], ['リ', 'ri'], ['ル', 'ru'], ['レ', 're'], ['ロ', 'ro'],
      ['ワ', 'wa'], ['ヲ', 'wo'], ['ン', 'n']
    ], [36, 37, 44, 45], '46 basic katakana');
  }
}
