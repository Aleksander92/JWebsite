const Mode = Object.freeze({
  HiraganaToRomaji: 0,
  RomajiToHiragana: 1,
  KatakanaToRomaji: 2,
  RomajiToKatakana: 3
});


const DAKUTEN_IMAGE = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path d="M7.2 12.2c0-1.2 1-2.2 2.2-2.2 2.2 0 4.1 1.5 4.7 3.6l1.8 6.2c.3 1-.3 2.2-1.4 2.5-.2.1-.4.1-.6.1-.9 0-1.8-.6-2.1-1.5l-1.8-6.2c-.1-.5-.6-.8-1.1-.8-1 0-1.7-.8-1.7-1.7Z" fill="black"/><path d="M20.2 9.6c0-1.2 1-2.2 2.2-2.2 2.2 0 4.1 1.5 4.7 3.6l1.8 6.2c.3 1-.3 2.2-1.4 2.5-.2.1-.4.1-.6.1-.9 0-1.8-.6-2.1-1.5l-1.8-6.2c-.1-.5-.6-.8-1.1-.8-1 0-1.7-.8-1.7-1.7Z" fill="black"/></svg>');
const HANDAKUTEN_IMAGE = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><circle cx="18" cy="18" r="11" fill="none" stroke="black" stroke-width="5"/></svg>');

class Quiz {
  constructor(alphabet, gaps, badgeText) {
    this.alphabet = alphabet;
    this.gaps = gaps;
    this.badgeText = badgeText;
    this.useDiacritics = false;
  }

  setUseDiacritics(useDiacritics) {
    this.useDiacritics = useDiacritics;
  }

  getDiacriticsType(item, answerIndex) {
    if (!this.useDiacritics || answerIndex !== 0) {
      return '';
    }
    return item[2] || '';
  }

  createGrid(answerIndex, showDiacriticsMarker) {
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

        var item = this.alphabet[rowIndex];
        var button = document.createElement('button');
        button.setAttribute('class', 'button-grid glow');
        button.setAttribute('id', GridFunctions.buttonGridId(item[1]) + '-' + rowIndex);
        button.dataset.answer = item[answerIndex];
        button.setAttribute('role', 'button');
        button.onclick = function () { checkAnswerAndMakeNewTask(this); };
        button.addEventListener('animationend', function () {
          this.classList.remove('class-glow-correct');
          this.classList.remove('class-glow-incorrect');
        });

        var markerType = this.getDiacriticsType(item, answerIndex);
        if (showDiacriticsMarker && markerType) {
          button.classList.add('button-grid-diacritics');

          var mainGlyph = document.createElement('span');
          mainGlyph.setAttribute('class', 'button-grid-main-glyph');
          mainGlyph.textContent = item[answerIndex];

          var markerGlyph = document.createElement('span');
          markerGlyph.setAttribute('class', 'button-grid-marker-glyph');

          if (markerType === 'both') {
            markerGlyph.classList.add('button-grid-marker-glyph-double');

            var dakutenTop = document.createElement('span');
            dakutenTop.setAttribute('class', 'button-grid-marker-half button-grid-marker-dakuten');
            dakutenTop.style.backgroundImage = 'url("' + DAKUTEN_IMAGE + '")';

            var handakutenBottom = document.createElement('span');
            handakutenBottom.setAttribute('class', 'button-grid-marker-half button-grid-marker-handakuten');
            handakutenBottom.style.backgroundImage = 'url("' + HANDAKUTEN_IMAGE + '")';

            markerGlyph.appendChild(dakutenTop);
            markerGlyph.appendChild(handakutenBottom);
          } else {
            var isDakuten = markerType === 'dakuten';
            markerGlyph.classList.add(isDakuten ? 'button-grid-marker-dakuten' : 'button-grid-marker-handakuten');
            markerGlyph.style.backgroundImage = isDakuten ? 'url("' + DAKUTEN_IMAGE + '")' : 'url("' + HANDAKUTEN_IMAGE + '")';
          }

          button.appendChild(mainGlyph);
          button.appendChild(markerGlyph);
        } else {
          button.textContent = item[answerIndex];
        }

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
      ['か', 'ka', 'dakuten'], ['き', 'ki', 'dakuten'], ['く', 'ku', 'dakuten'], ['け', 'ke', 'dakuten'], ['こ', 'ko', 'dakuten'],
      ['さ', 'sa', 'dakuten'], ['し', 'shi', 'dakuten'], ['す', 'su', 'dakuten'], ['せ', 'se', 'dakuten'], ['そ', 'so', 'dakuten'],
      ['た', 'ta', 'dakuten'], ['ち', 'chi', 'dakuten'], ['つ', 'tsu', 'dakuten'], ['て', 'te', 'dakuten'], ['と', 'to', 'dakuten'],
      ['な', 'na'], ['に', 'ni'], ['ぬ', 'nu'], ['ね', 'ne'], ['の', 'no'],
      ['は', 'ha', 'both'], ['ひ', 'hi', 'both'], ['ふ', 'fu', 'both'], ['へ', 'he', 'both'], ['ほ', 'ho', 'both'],
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
      ['カ', 'ka', 'dakuten'], ['キ', 'ki', 'dakuten'], ['ク', 'ku', 'dakuten'], ['ケ', 'ke', 'dakuten'], ['コ', 'ko', 'dakuten'],
      ['サ', 'sa', 'dakuten'], ['シ', 'shi', 'dakuten'], ['ス', 'su', 'dakuten'], ['セ', 'se', 'dakuten'], ['ソ', 'so', 'dakuten'],
      ['タ', 'ta', 'dakuten'], ['チ', 'chi', 'dakuten'], ['ツ', 'tsu', 'dakuten'], ['テ', 'te', 'dakuten'], ['ト', 'to', 'dakuten'],
      ['ナ', 'na'], ['ニ', 'ni'], ['ヌ', 'nu'], ['ネ', 'ne'], ['ノ', 'no'],
      ['ハ', 'ha', 'both'], ['ヒ', 'hi', 'both'], ['フ', 'fu', 'both'], ['ヘ', 'he', 'both'], ['ホ', 'ho', 'both'],
      ['マ', 'ma'], ['ミ', 'mi'], ['ム', 'mu'], ['メ', 'me'], ['モ', 'mo'],
      ['ヤ', 'ya'], ['ユ', 'yu'], ['ヨ', 'yo'],
      ['ラ', 'ra'], ['リ', 'ri'], ['ル', 'ru'], ['レ', 're'], ['ロ', 'ro'],
      ['ワ', 'wa'], ['ヲ', 'wo'], ['ン', 'n']
    ], [36, 37, 44, 45], '46 basic katakana');
  }
}
