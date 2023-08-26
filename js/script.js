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
    hierogpyph = String.fromCharCode(hierogpyph.charCodeAt(0) + 1 + (i < alphabetShifts.length ? alphabetShifts[i] : 0));
    col.appendChild(button);
  }
}