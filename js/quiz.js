const Mode = Object.freeze({
  HiraganaToRomaji: 0,
  RomajiToHiragana: 1,
  KatakanaToRomaji: 2,
  RomajiToKatakana: 3
});

const DAKUTEN_SYMBOL = '゛';
const HANDAKUTEN_SYMBOL = '゜';

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

  getDiacriticsVariants(item) {
    if (!this.useDiacritics) {
      return [];
    }

    var variants = item[3] || [];
    return variants.map(function (variant) {
      return {
        kana: variant[0],
        romaji: variant[1],
        markerType: variant[2]
      };
    });
  }

  createAnswerButton(contentText, answerText, className) {
    var button = document.createElement('button');
    var cssClass = 'button-grid glow';
    if (className) {
      cssClass += ' ' + className;
    }

    button.setAttribute('class', cssClass);
    button.dataset.answer = answerText;
    button.setAttribute('role', 'button');
    button.textContent = contentText;
    button.onclick = function () { checkAnswerAndMakeNewTask(this); };
    button.addEventListener('animationend', function () {
      this.classList.remove('class-glow-correct');
      this.classList.remove('class-glow-incorrect');
    });

    return button;
  }

  makeKanaQuestionWithMarker(baseKana, markerType) {
    var markerSymbol = markerType === 'dakuten' ? DAKUTEN_SYMBOL : HANDAKUTEN_SYMBOL;
    return baseKana + markerSymbol;
  }

  createTaskPool(questionIndex, answerIndex) {
    var tasks = this.alphabet.map(function (item) {
      return [item[questionIndex], item[answerIndex]];
    });

    if (!this.useDiacritics) {
      return tasks;
    }

    for (const item of this.alphabet) {
      var variants = this.getDiacriticsVariants(item);
      for (const variant of variants) {
        if (questionIndex === 0 && answerIndex === 1) {
          tasks.push([this.makeKanaQuestionWithMarker(item[0], variant.markerType), variant.romaji]);
        } else if (questionIndex === 1 && answerIndex === 0) {
          tasks.push([variant.romaji, variant.kana]);
        }
      }
    }

    return tasks;
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
        var baseAnswerButton = this.createAnswerButton(item[answerIndex], item[answerIndex]);
        baseAnswerButton.setAttribute('id', GridFunctions.buttonGridId(item[1]) + '-' + rowIndex);

        var variants = this.getDiacriticsVariants(item);
        if (showDiacriticsMarker && answerIndex === 1 && variants.length > 0) {
          var answerGroup = document.createElement('div');
          answerGroup.setAttribute('class', 'button-grid-diacritics');

          baseAnswerButton.classList.add('button-grid-main-glyph');
          answerGroup.appendChild(baseAnswerButton);

          if (variants.length === 1) {
            var markerButton = this.createAnswerButton(variants[0].romaji, variants[0].romaji, 'button-grid-marker-glyph');
            answerGroup.appendChild(markerButton);
          } else {
            var markerColumn = document.createElement('div');
            markerColumn.setAttribute('class', 'button-grid-marker-glyph-double');

            var topButton = this.createAnswerButton(variants[0].romaji, variants[0].romaji, 'button-grid-marker-half');
            var bottomButton = this.createAnswerButton(variants[1].romaji, variants[1].romaji, 'button-grid-marker-half');

            markerColumn.appendChild(topButton);
            markerColumn.appendChild(bottomButton);
            answerGroup.appendChild(markerColumn);
          }

          col.appendChild(answerGroup);
        } else {
          col.appendChild(baseAnswerButton);
        }
      }
    }
  }

  createTask(questionIndex, answerIndex) {
    var taskPool = this.createTaskPool(questionIndex, answerIndex);
    var indPlus = Math.floor(Math.random() * (taskPool.length - 1));
    var ind = (Number(localStorage.getItem('curTaskIndex')) + indPlus + 1) % taskPool.length;
    localStorage.setItem('curTaskQuestion', taskPool[ind][0]);
    localStorage.setItem('curTaskAnswer', taskPool[ind][1]);
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
      ['か', 'ka', 'dakuten', [['が', 'ga', 'dakuten']]], ['き', 'ki', 'dakuten', [['ぎ', 'gi', 'dakuten']]], ['く', 'ku', 'dakuten', [['ぐ', 'gu', 'dakuten']]], ['け', 'ke', 'dakuten', [['げ', 'ge', 'dakuten']]], ['こ', 'ko', 'dakuten', [['ご', 'go', 'dakuten']]],
      ['さ', 'sa', 'dakuten', [['ざ', 'za', 'dakuten']]], ['し', 'shi', 'dakuten', [['じ', 'ji', 'dakuten']]], ['す', 'su', 'dakuten', [['ず', 'zu', 'dakuten']]], ['せ', 'se', 'dakuten', [['ぜ', 'ze', 'dakuten']]], ['そ', 'so', 'dakuten', [['ぞ', 'zo', 'dakuten']]],
      ['た', 'ta', 'dakuten', [['だ', 'da', 'dakuten']]], ['ち', 'chi', 'dakuten', [['ぢ', 'di', 'dakuten']]], ['つ', 'tsu', 'dakuten', [['づ', 'du', 'dakuten']]], ['て', 'te', 'dakuten', [['で', 'de', 'dakuten']]], ['と', 'to', 'dakuten', [['ど', 'do', 'dakuten']]],
      ['な', 'na'], ['に', 'ni'], ['ぬ', 'nu'], ['ね', 'ne'], ['の', 'no'],
      ['は', 'ha', 'both', [['ば', 'ba', 'dakuten'], ['ぱ', 'pa', 'handakuten']]], ['ひ', 'hi', 'both', [['び', 'bi', 'dakuten'], ['ぴ', 'pi', 'handakuten']]], ['ふ', 'fu', 'both', [['ぶ', 'bu', 'dakuten'], ['ぷ', 'pu', 'handakuten']]], ['へ', 'he', 'both', [['べ', 'be', 'dakuten'], ['ぺ', 'pe', 'handakuten']]], ['ほ', 'ho', 'both', [['ぼ', 'bo', 'dakuten'], ['ぽ', 'po', 'handakuten']]],
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
      ['カ', 'ka', 'dakuten', [['ガ', 'ga', 'dakuten']]], ['キ', 'ki', 'dakuten', [['ギ', 'gi', 'dakuten']]], ['ク', 'ku', 'dakuten', [['グ', 'gu', 'dakuten']]], ['ケ', 'ke', 'dakuten', [['ゲ', 'ge', 'dakuten']]], ['コ', 'ko', 'dakuten', [['ゴ', 'go', 'dakuten']]],
      ['サ', 'sa', 'dakuten', [['ザ', 'za', 'dakuten']]], ['シ', 'shi', 'dakuten', [['ジ', 'ji', 'dakuten']]], ['ス', 'su', 'dakuten', [['ズ', 'zu', 'dakuten']]], ['セ', 'se', 'dakuten', [['ゼ', 'ze', 'dakuten']]], ['ソ', 'so', 'dakuten', [['ゾ', 'zo', 'dakuten']]],
      ['タ', 'ta', 'dakuten', [['ダ', 'da', 'dakuten']]], ['チ', 'chi', 'dakuten', [['ヂ', 'di', 'dakuten']]], ['ツ', 'tsu', 'dakuten', [['ヅ', 'du', 'dakuten']]], ['テ', 'te', 'dakuten', [['デ', 'de', 'dakuten']]], ['ト', 'to', 'dakuten', [['ド', 'do', 'dakuten']]],
      ['ナ', 'na'], ['ニ', 'ni'], ['ヌ', 'nu'], ['ネ', 'ne'], ['ノ', 'no'],
      ['ハ', 'ha', 'both', [['バ', 'ba', 'dakuten'], ['パ', 'pa', 'handakuten']]], ['ヒ', 'hi', 'both', [['ビ', 'bi', 'dakuten'], ['ピ', 'pi', 'handakuten']]], ['フ', 'fu', 'both', [['ブ', 'bu', 'dakuten'], ['プ', 'pu', 'handakuten']]], ['ヘ', 'he', 'both', [['ベ', 'be', 'dakuten'], ['ペ', 'pe', 'handakuten']]], ['ホ', 'ho', 'both', [['ボ', 'bo', 'dakuten'], ['ポ', 'po', 'handakuten']]],
      ['マ', 'ma'], ['ミ', 'mi'], ['ム', 'mu'], ['メ', 'me'], ['モ', 'mo'],
      ['ヤ', 'ya'], ['ユ', 'yu'], ['ヨ', 'yo'],
      ['ラ', 'ra'], ['リ', 'ri'], ['ル', 'ru'], ['レ', 're'], ['ロ', 'ro'],
      ['ワ', 'wa'], ['ヲ', 'wo'], ['ン', 'n']
    ], [36, 37, 44, 45], '46 basic katakana');
  }
}
