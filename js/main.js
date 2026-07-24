/* =========================================================
   Art Floor LLC - Interactions (vanilla, reduced-motion aware)
   ========================================================= */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Intro splash ---- */
  var splash = document.getElementById("splash");
  if (splash) {
    var splashFill = document.getElementById("splashFill");
    requestAnimationFrame(function () { if (splashFill) splashFill.style.width = "100%"; });
    setTimeout(function () {
      splash.classList.add("is-hidden");
      splash.setAttribute("aria-hidden", "true");
      setTimeout(function () { splash.style.display = "none"; }, reduce ? 0 : 650);
    }, reduce ? 500 : 1300);
  }

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Sticky masthead ---- */
  var mast = document.getElementById("mast");
  var onScroll = function () { if (mast) mast.classList.toggle("is-scrolled", window.scrollY > 8); };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Mobile drawer ---- */
  var burger = document.getElementById("burger");
  var drawer = document.getElementById("drawer");
  var setDrawer = function (open) {
    if (!drawer || !burger) return;
    drawer.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    document.body.style.overflow = open ? "hidden" : "";
  };
  if (burger) {
    burger.addEventListener("click", function () { setDrawer(!drawer.classList.contains("is-open")); });
    drawer.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setDrawer(false); }); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") setDrawer(false); });
  }

  /* ---- Cover reel (muted autoplay, reduced-motion aware) ---- */
  var reel = document.getElementById("coverReel");
  if (reel) {
    if (reduce) {
      reel.removeAttribute("autoplay");
      reel.pause();
      try { reel.currentTime = 0; } catch (e) {}
    } else {
      reel.muted = true;
      var play = reel.play();
      if (play && play.catch) { play.catch(function () { /* autoplay blocked; poster stays */ }); }
    }
  }

  /* ---- Reveal on scroll ---- */
  var reveals = document.querySelectorAll(".reveal, .reveal-up");
  if (reduce || !("IntersectionObserver" in window)) {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
    }, { threshold: 0.14, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---- Counters ---- */
  var counters = document.querySelectorAll("[data-count]");
  var runCounter = function (el) {
    var target = parseFloat(el.getAttribute("data-count")) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduce) { el.textContent = target + suffix; return; }
    var dur = 1400, start = null;
    var step = function (ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step); else el.textContent = target + suffix;
    };
    requestAnimationFrame(step);
  };
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { runCounter(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { cio.observe(el); });
  } else { counters.forEach(runCounter); }

  /* ---- Gallery wall: drag-to-scroll + progress ---- */
  var track = document.getElementById("wallTrack");
  var progress = document.getElementById("wallProgress");
  if (track) {
    var down = false, startX = 0, startScroll = 0, moved = 0;
    track.addEventListener("mousedown", function (e) {
      down = true; moved = 0; startX = e.pageX; startScroll = track.scrollLeft; track.classList.add("is-drag");
    });
    window.addEventListener("mouseup", function () { down = false; track.classList.remove("is-drag"); });
    window.addEventListener("mousemove", function (e) {
      if (!down) return;
      var dx = e.pageX - startX; moved += Math.abs(dx);
      track.scrollLeft = startScroll - dx;
    });
    /* prevent click navigation after a drag */
    track.addEventListener("click", function (e) { if (moved > 6) { e.preventDefault(); } }, true);
    var updateBar = function () {
      if (!progress) return;
      var max = track.scrollWidth - track.clientWidth;
      var pct = max > 0 ? (track.scrollLeft / max) * 100 : 0;
      progress.style.width = Math.max(6, pct) + "%";
    };
    updateBar();
    track.addEventListener("scroll", updateBar, { passive: true });
    /* vertical wheel scrolls horizontally when hovering the wall (desktop) */
    track.addEventListener("wheel", function (e) {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        track.scrollLeft += e.deltaY; e.preventDefault();
      }
    }, { passive: false });
    /* arrow buttons */
    var stepW = function () { var p = track.querySelector(".plate"); return p ? p.offsetWidth + 20 : 320; };
    var wp = document.getElementById("wallPrev"), wn = document.getElementById("wallNext");
    if (wp) wp.addEventListener("click", function () { track.scrollBy({ left: -stepW(), behavior: reduce ? "auto" : "smooth" }); });
    if (wn) wn.addEventListener("click", function () { track.scrollBy({ left: stepW(), behavior: reduce ? "auto" : "smooth" }); });
  }

  /* ---- Before / after: project slides ---- */
  var baSlides = [
    {
      before: "assets/web/ba-before.jpg",
      beforeAlt: "Dated shower stall before the renovation",
      after: "assets/web/ba-after.jpg",
      afterAlt: "Finished tiled walk-in shower",
      caption: "Same shower, reimagined. Drag the handle to watch a dated, builder-grade shower become a bright tiled walk-in retreat."
    },
    {
      before: "assets/web/ba2-before.jpg",
      beforeAlt: "Dated shower with sliding glass door before the renovation",
      after: "assets/web/ba2-after.jpg",
      afterAlt: "Finished marble walk-in shower",
      caption: "Same shower, reimagined. Drag the handle to watch a dated, framed-glass shower become a bright marble walk-in retreat."
    }
  ];
  var baIndex = 0;
  var baAfterImg = document.getElementById("baAfterImg");
  var baBeforeImg = document.getElementById("baBeforeImg");
  var baCaption = document.getElementById("baCaption");
  var baPrev = document.getElementById("baPrev");
  var baNext = document.getElementById("baNext");
  var baDots = document.getElementById("baDots") ? document.getElementById("baDots").querySelectorAll("button") : [];
  var showBaSlide = function (i) {
    baIndex = (i + baSlides.length) % baSlides.length;
    var s = baSlides[baIndex];
    if (baAfterImg) { baAfterImg.src = s.after; baAfterImg.alt = s.afterAlt; }
    if (baBeforeImg) { baBeforeImg.src = s.before; baBeforeImg.alt = s.beforeAlt; }
    if (baCaption) baCaption.textContent = s.caption;
    if (viewer) {
      viewer.style.setProperty("--pos", "50%");
      if (handle) handle.setAttribute("aria-valuenow", "50");
    }
    for (var d = 0; d < baDots.length; d++) baDots[d].classList.toggle("is-active", d === baIndex);
  };
  if (baPrev) baPrev.addEventListener("click", function () { showBaSlide(baIndex - 1); });
  if (baNext) baNext.addEventListener("click", function () { showBaSlide(baIndex + 1); });
  for (var bd = 0; bd < baDots.length; bd++) {
    (function (i) { baDots[i].addEventListener("click", function () { showBaSlide(i); }); })(bd);
  }

  /* ---- Before / after: drag reveal ---- */
  var viewer = document.getElementById("baViewer");
  var handle = document.getElementById("baHandle");
  if (viewer && handle) {
    var dragging = false;
    var setPos = function (clientX) {
      var r = viewer.getBoundingClientRect();
      var pct = Math.max(2, Math.min(98, ((clientX - r.left) / r.width) * 100));
      viewer.style.setProperty("--pos", pct + "%");
      handle.setAttribute("aria-valuenow", String(Math.round(pct)));
    };
    var start = function (e) { dragging = true; setPos(e.touches ? e.touches[0].clientX : e.clientX); };
    var move = function (e) { if (dragging) setPos(e.touches ? e.touches[0].clientX : e.clientX); };
    var end = function () { dragging = false; };
    viewer.addEventListener("mousedown", start);
    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseup", end);
    viewer.addEventListener("touchstart", start, { passive: true });
    window.addEventListener("touchmove", move, { passive: true });
    window.addEventListener("touchend", end);
    handle.addEventListener("keydown", function (e) {
      var cur = parseFloat(viewer.style.getPropertyValue("--pos")) || 50;
      if (e.key === "ArrowLeft") { cur = Math.max(2, cur - 4); e.preventDefault(); }
      else if (e.key === "ArrowRight") { cur = Math.min(98, cur + 4); e.preventDefault(); }
      else return;
      viewer.style.setProperty("--pos", cur + "%");
      handle.setAttribute("aria-valuenow", String(Math.round(cur)));
    });
  }

  /* ---- Voices (rotating quote) ---- */
  var voices = document.querySelectorAll(".voice");
  var dots = document.querySelectorAll(".voices__dots button");
  if (voices.length) {
    var cur = 0, timer = null;
    var show = function (i) {
      voices[cur].classList.remove("is-active");
      dots[cur] && dots[cur].classList.remove("is-active");
      cur = (i + voices.length) % voices.length;
      voices[cur].classList.add("is-active");
      dots[cur] && dots[cur].classList.add("is-active");
    };
    var auto = function () { if (reduce) return; clearInterval(timer); timer = setInterval(function () { show(cur + 1); }, 6000); };
    dots.forEach(function (d) {
      d.addEventListener("click", function () { show(parseInt(d.getAttribute("data-i"), 10)); auto(); });
    });
    auto();
  }

  /* ---- Process stepper (auto-advance + click, pause on hover) ---- */
  var stepper = document.getElementById("stepper");
  if (stepper) {
    var steps = [].slice.call(stepper.querySelectorAll(".stepr"));
    var DUR = 5000, sIdx = 0, sTimer = null, sPaused = false;
    var setStep = function (i) {
      steps.forEach(function (s, n) {
        var head = s.querySelector(".stepr__head");
        var body = s.querySelector(".stepr__body");
        var prog = s.querySelector(".stepr__prog");
        var on = n === i;
        s.classList.toggle("is-active", on);
        head.setAttribute("aria-expanded", String(on));
        if (!reduce) body.style.height = on ? body.scrollHeight + "px" : "0px";
        prog.classList.remove("run");
        if (on && !reduce) { void prog.offsetWidth; prog.classList.add("run"); }
      });
      sIdx = i;
    };
    var advance = function () {
      if (reduce || sPaused) return;
      clearTimeout(sTimer);
      sTimer = setTimeout(function () { setStep((sIdx + 1) % steps.length); advance(); }, DUR);
    };
    steps.forEach(function (s, n) {
      s.querySelector(".stepr__head").addEventListener("click", function () { setStep(n); advance(); });
    });
    stepper.addEventListener("mouseenter", function () { sPaused = true; clearTimeout(sTimer); });
    stepper.addEventListener("mouseleave", function () { sPaused = false; setStep(sIdx); advance(); });
    setStep(0);
    if (!reduce) {
      if ("IntersectionObserver" in window) {
        var sio = new IntersectionObserver(function (e) {
          if (e[0].isIntersecting) { advance(); sio.disconnect(); }
        }, { threshold: 0.3 });
        sio.observe(stepper);
      } else { advance(); }
    }
  }

  /* ---- FAQ single-open accordion ---- */
  var accs = document.querySelectorAll(".acc");
  accs.forEach(function (acc) {
    var summary = acc.querySelector("summary");
    summary.addEventListener("click", function (e) {
      e.preventDefault();
      var open = acc.hasAttribute("open");
      if (!open) { accs.forEach(function (o) { if (o !== acc && o.hasAttribute("open")) collapse(o); }); expand(acc); }
      else collapse(acc);
    });
    function expand(el) {
      var b = el.querySelector(".acc__body"); el.setAttribute("open", "");
      if (reduce) return;
      var h = b.scrollHeight; b.style.height = "0px"; b.style.transition = "height .4s cubic-bezier(.22,1,.36,1)";
      requestAnimationFrame(function () { b.style.height = h + "px"; });
      b.addEventListener("transitionend", function te() { b.style.height = ""; b.style.transition = ""; b.removeEventListener("transitionend", te); });
    }
    function collapse(el) {
      var b = el.querySelector(".acc__body");
      if (reduce) { el.removeAttribute("open"); return; }
      var h = b.scrollHeight; b.style.height = h + "px"; b.style.transition = "height .35s cubic-bezier(.22,1,.36,1)";
      requestAnimationFrame(function () { b.style.height = "0px"; });
      b.addEventListener("transitionend", function te() { el.removeAttribute("open"); b.style.height = ""; b.style.transition = ""; b.removeEventListener("transitionend", te); });
    }
  });

  /* ---- Form validation ---- */
  var form = document.getElementById("estimateForm");
  if (form) {
    var showErr = function (f, m) { var w = f.closest(".field"); w.classList.add("is-invalid"); var e = w.querySelector("[data-err]"); if (e) e.textContent = m; };
    var clearErr = function (f) { f.closest(".field").classList.remove("is-invalid"); };
    function validate(f) {
      var v = f.value.trim();
      if (f.hasAttribute("required") && !v) { showErr(f, "This field is required."); return false; }
      if (f.type === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { showErr(f, "Enter a valid email."); return false; }
      if (f.type === "tel" && v && v.replace(/\D/g, "").length < 7) { showErr(f, "Enter a valid phone number."); return false; }
      clearErr(f); return true;
    }
    form.querySelectorAll("input, select").forEach(function (f) {
      f.addEventListener("blur", function () { validate(f); });
      f.addEventListener("input", function () { if (f.closest(".field").classList.contains("is-invalid")) validate(f); });
    });
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ok = true, first = null;
      form.querySelectorAll("input[required], select[required]").forEach(function (f) { if (!validate(f)) { ok = false; if (!first) first = f; } });
      if (!ok) { if (first) first.focus(); return; }
      var btn = form.querySelector('button[type="submit"]');
      var okMsg = document.getElementById("formOk");
      btn.disabled = true; btn.textContent = "Sending…";
      /* Post to Netlify Forms (works once deployed on Netlify) */
      fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(new FormData(form)).toString()
      }).then(function () {
        if (okMsg) okMsg.hidden = false;
        form.reset();
        btn.textContent = "Request received";
      }).catch(function () {
        btn.disabled = false; btn.textContent = "Request my free estimate";
        if (okMsg) { okMsg.hidden = false; okMsg.textContent = "Couldn’t send just now - please call us at (470) 437-6447."; }
      });
    });
  }
})();
