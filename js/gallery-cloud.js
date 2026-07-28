(function () {
  "use strict";
  var CLOUD_NAME = "fvdx3cet";
  var TAG_PREFIX = "artfloor_";
  var CATS = [
    { slug: "ceramic-and-porcelain-tile", label: "Tile" },
    { slug: "bathroom-remodeling", label: "Bathroom Remodeling" },
    { slug: "backsplash", label: "Backsplash" },
    { slug: "tile-fireplace", label: "Tile Fireplace" },
    { slug: "demolition-and-prep", label: "Demolition & Prep" }
  ];

  var track = document.getElementById("wallTrack");
  if (!track) return;

  function listByTag(tag) {
    return fetch("https://res.cloudinary.com/" + CLOUD_NAME + "/image/list/" + tag + ".json")
      .then(function (r) { return r.ok ? r.json() : { resources: [] }; })
      .catch(function () { return { resources: [] }; });
  }

  Promise.all(CATS.map(function (c) {
    return listByTag(TAG_PREFIX + c.slug).then(function (data) {
      return (data.resources || []).map(function (res) {
        return { res: res, label: c.label };
      });
    });
  })).then(function (perCat) {
    var items = [].concat.apply([], perCat).sort(function (a, b) {
      return (b.res.created_at || "").localeCompare(a.res.created_at || "");
    });
    if (!items.length) return;

    var existing = track.querySelectorAll(".plate").length;
    var frag = document.createDocumentFragment();

    items.forEach(function (item, i) {
      var res = item.res;
      var url = "https://res.cloudinary.com/" + CLOUD_NAME + "/image/upload/w_1000,q_auto,f_auto/" + res.public_id + "." + res.format;
      var num = String(existing + i + 1).padStart(2, "0");

      var figure = document.createElement("figure");
      figure.className = "plate";

      var img = document.createElement("img");
      img.loading = "lazy";
      img.decoding = "async";
      img.width = res.width || 1000;
      img.height = res.height || 750;
      img.src = url;
      img.alt = item.label + " project by Art Floor";
      figure.appendChild(img);

      var figcaption = document.createElement("figcaption");
      var no = document.createElement("span");
      no.className = "plate__no";
      no.textContent = num;
      var t = document.createElement("span");
      t.className = "plate__t";
      t.textContent = item.label;
      figcaption.appendChild(no);
      figcaption.appendChild(t);
      figure.appendChild(figcaption);

      frag.appendChild(figure);
    });

    track.appendChild(frag);
  });
})();
