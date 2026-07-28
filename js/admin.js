(function () {
  "use strict";
  var CLOUD_NAME = "fvdx3cet";
  var UPLOAD_PRESET = "fintsymg";
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

  function slugify(s) {
    return s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  function uploadOne(file) {
    var fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', UPLOAD_PRESET);
    fd.append('folder', 'art-floor/' + slugify(activeCat));
    return fetch('https://api.cloudinary.com/v1_1/' + CLOUD_NAME + '/image/upload', {
      method: 'POST',
      body: fd
    }).then(function (r) { return r.json().then(function (data) { return { ok: r.ok, data: data }; }); });
  }

  function showResult(html) {
    success.innerHTML = html;
    success.classList.add('show');
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  publishBtn.addEventListener('click', function () {
    if (!files.length) return;
    var n = files.length;
    var toUpload = files.slice();
    publishBtn.disabled = true;
    publishBtn.textContent = 'Enviando...';

    Promise.all(toUpload.map(uploadOne)).then(function (results) {
      var okCount = results.filter(function (r) { return r.ok; }).length;
      var failCount = n - okCount;
      var strong = document.createElement('b');
      var note = document.createElement('span');
      note.className = 'demo-note';
      if (okCount > 0) {
        strong.textContent = '✓ ' + okCount + ' foto' + (okCount > 1 ? 's' : '') + ' enviada' + (okCount > 1 ? 's' : '') + ' para ' + activeCat + '!';
        note.textContent = failCount > 0
          ? failCount + ' foto' + (failCount > 1 ? 's' : '') + ' falhou' + (failCount > 1 ? 'aram' : '') + ' ao enviar, tenta de novo.'
          : 'As fotos já estão no Cloudinary, na pasta "art-floor/' + slugify(activeCat) + '".';
      } else {
        strong.textContent = 'Não consegui enviar as fotos.';
        note.textContent = 'Confere se o Cloud Name e o Upload Preset ainda estão certos, ou tenta de novo em instantes.';
      }
      success.innerHTML = '';
      success.appendChild(strong);
      success.appendChild(note);
      success.classList.add('show');
      files = [];
      fileInput.value = '';
      render();
      publishBtn.textContent = 'Adicionar à Galeria';
      publishBtn.disabled = true;
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }).catch(function () {
      showResult('<b>Não consegui enviar as fotos.</b><span class="demo-note">Verifica sua conexão e tenta de novo.</span>');
      publishBtn.textContent = 'Adicionar à Galeria';
      publishBtn.disabled = false;
    });
  });
})();
