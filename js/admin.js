(function () {
  "use strict";
  var activeCat = 'Ceramic & Porcelain Tile';
  var files = [];

  var cats = document.getElementById('cats');
  var drop = document.getElementById('drop');
  var fileInput = document.getElementById('fileInput');
  var previews = document.getElementById('previews');
  var publishBtn = document.getElementById('publishBtn');
  var success = document.getElementById('success');

  cats.addEventListener('click', function (e) {
    var b = e.target.closest('.cat'); if (!b) return;
    cats.querySelectorAll('.cat').forEach(function (c) { c.classList.remove('active'); });
    b.classList.add('active');
    activeCat = b.dataset.cat;
    success.classList.remove('show');
  });

  drop.addEventListener('click', function () { fileInput.click(); });
  ['dragenter', 'dragover'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('drag'); }); });
  ['dragleave', 'drop'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('drag'); }); });
  drop.addEventListener('drop', function (e) { addFiles(e.dataTransfer.files); });
  fileInput.addEventListener('change', function () { addFiles(fileInput.files); });

  function addFiles(list) {
    [].forEach.call(list, function (f) { if (f.type.indexOf('image/') === 0) files.push(f); });
    render();
  }
  function render() {
    previews.innerHTML = '';
    files.forEach(function (f, i) {
      var url = URL.createObjectURL(f);
      var d = document.createElement('div');
      d.className = 'thumb';
      var img = document.createElement('img');
      img.src = url; img.alt = '';
      var rm = document.createElement('button');
      rm.className = 'rm'; rm.title = 'Remover'; rm.textContent = '×';
      rm.addEventListener('click', function () { files.splice(i, 1); render(); });
      d.appendChild(img); d.appendChild(rm);
      previews.appendChild(d);
    });
    publishBtn.disabled = files.length === 0;
    success.classList.remove('show');
  }

  publishBtn.addEventListener('click', function () {
    if (!files.length) return;
    var n = files.length;
    var strong = document.createElement('b');
    strong.textContent = '✓ ' + n + ' foto' + (n > 1 ? 's' : '') + ' pronta' + (n > 1 ? 's' : '') + ' para ' + activeCat + '!';
    var note = document.createElement('span');
    note.className = 'demo-note';
    note.textContent = 'Isto é uma demonstração, as fotos não são salvas nesta versão. Na versão final, elas seriam enviadas e apareceriam na galeria "' + activeCat + '" do site na hora.';
    success.innerHTML = '';
    success.appendChild(strong);
    success.appendChild(note);
    success.classList.add('show');
    files = [];
    fileInput.value = '';
    render();
    publishBtn.disabled = true;
    success.classList.add('show');
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
})();
