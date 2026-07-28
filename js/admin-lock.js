(function () {
  "use strict";
  var PW_HASH = "9e1a4016462f04f79985329496373615bc02f4d4653581f90451b55298335181";
  var KEY = "artfloor_admin_ok";
  var lock = document.getElementById("lockScreen");
  var form = document.getElementById("lockForm");
  var input = document.getElementById("lockPw");
  var err = document.getElementById("lockErr");

  function unlock() {
    document.body.classList.remove("locked");
    lock.style.display = "none";
  }

  if (sessionStorage.getItem(KEY) === "1") unlock();

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    crypto.subtle.digest("SHA-256", new TextEncoder().encode(input.value)).then(function (buf) {
      var hex = Array.prototype.map.call(new Uint8Array(buf), function (b) {
        return b.toString(16).padStart(2, "0");
      }).join("");
      if (hex === PW_HASH) {
        sessionStorage.setItem(KEY, "1");
        unlock();
      } else {
        err.style.display = "block";
        input.value = "";
        input.focus();
      }
    }).catch(function () {
      err.textContent = "Erro. Abra pelo endereço https:// do site.";
      err.style.display = "block";
    });
  });
})();
