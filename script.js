(function () {
  "use strict";
  var root = document.documentElement;

  /* ---------- Thème ---------- */
  var saved = null;
  try { saved = localStorage.getItem("theme"); } catch (e) {}
  root.setAttribute("data-theme", saved || "light");
  document.getElementById("theme").addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) {}
    paintBg(); draw();
  });

  /* ---------- Langue FR / EN ---------- */
  var EN = {
    "nav.projects": "Projects", "nav.path": "Path", "nav.skills": "Skills", "nav.contact": "Contact",
    "hero.role": "Master’s student (M2), AI and Data Science",
    "hero.lead": "I build classification models and RAG systems. I am looking for a final-year internship (PFE) in AI and applied research.",
    "hero.readCv": "View my CV", "hero.cv": "Download my CV", "hero.contact": "Contact me",
    "hero.hint": "Hover the background: a query point is classified by its k nearest neighbours. Click to add a point.",
    "hero.k": "k neighbours", "hero.reset": "Reset",
    "projects.label": "Projects",
    "projects.keyboard": "Displayed project. Use the left and right arrow keys to navigate.",
    "project.description": "Description", "project.highlights": "What I did",
    "project.tech": "Technologies and methods", "projects.previous": "Previous",
    "projects.next": "Next", "projects.choose": "Choose a project",
    "projects.dot1": "Project 1", "projects.dot2": "Project 2", "projects.dot3": "Project 3",
    "projects.hint": "Swipe to discover the next project, or use the keyboard arrows.",
    "cert.open": "Open certificate ↗", "cert.view": "View certificate",
    "cert.viewOracle": "View the Oracle certificate full size",
    "cert.viewData": "View the Introduction to Data Science certificate full size",
    "cert.viewNetworking": "View the Networking Basics certificate full size",
    "cert.altOracle": "Oracle Certified Specialty certificate — Oracle Cloud Infrastructure for Sunbird Ed Specialty",
    "cert.altData": "Cisco Networking Academy certificate — Introduction to Data Science",
    "cert.altNetworking": "Cisco Networking Academy certificate — Networking Basics",
    "p1.t": "Iris biometric recognition", "p1.m": "2023–2024 · Bachelor’s final project",
    "p1.desc": "Design of an iris biometric recognition system using convolutional neural networks.",
    "p1.a": "Preprocessed iris images to prepare the data for model training.",
    "p1.b": "Trained and integrated a CNN model into the recognition system.",
    "p2.t": "Image classification: deep learning and machine learning",
    "p2.desc": "Comparative study of classification methods on an imbalanced medical image dataset using a shared evaluation protocol.",
    "p2.a": "Compared a custom CNN, VGG16, ResNet50 and a Vision Transformer.",
    "p2.b": "Extracted colour, texture and shape features, then evaluated KNN, SVM, decision trees and ensemble methods.",
    "p3.t": "Intelligent code generation assistant",
    "p3.desc": "Developed an assistant that uses retrieval-augmented generation to help generate Python and Java code.",
    "p3.a": "Built semantic search using embeddings and a vector index.",
    "p3.b": "Connected Google Gemini and created an interactive Streamlit interface.",
    "t1.t": "Bachelor’s degree, Mathematical Sciences and Computer Science",
    "t2.t": "Network engineering intern, Inwi",
    "t2.m": "Summer 2024 · two months · equipment monitoring, performance data analysis, technical reports",
    "t3.t": "Master 1, AI and Data Science",
    "t4.t": "Master 2, AI and Data Science",
    "t4.m": "2026–2027 · USMBA, Fès · double degree with Université Sorbonne Paris Nord",
    "s1": "Programming", "s2": "AI and machine learning", "s2d": "Classification, CNN, deep learning, model evaluation",
    "s3": "LLMs and semantic search", "s4": "Libraries", "s5": "Tools", "s6": "Languages",
    "s6d": "Arabic (native), French (B2), English (B2)",
    "c.t": "Certifications", "c.1": "Introduction to Data Science, Cisco (2025)", "c.2": "Networking Basics, Cisco (2025)",
    "ct.p": "I am open to final-year internship offers in artificial intelligence and applied research."
  };
  var nodes = [].slice.call(document.querySelectorAll("[data-i18n]"));
  nodes.forEach(function (n) { n.dataset.fr = n.textContent; });
  var ariaNodes = [].slice.call(document.querySelectorAll("[data-i18n-aria]"));
  ariaNodes.forEach(function (n) { n.dataset.frAria = n.getAttribute("aria-label"); });
  var altNodes = [].slice.call(document.querySelectorAll("[data-i18n-alt]"));
  altNodes.forEach(function (n) { n.dataset.frAlt = n.getAttribute("alt"); });
  var langBtn = document.getElementById("lang");
  function setLang(l) {
    nodes.forEach(function (n) {
      var key = n.getAttribute("data-i18n");
      n.textContent = (l === "en" && EN[key]) ? EN[key] : n.dataset.fr;
    });
    ariaNodes.forEach(function (n) {
      var key = n.getAttribute("data-i18n-aria");
      n.setAttribute("aria-label", (l === "en" && EN[key]) ? EN[key] : n.dataset.frAria);
    });
    altNodes.forEach(function (n) {
      var key = n.getAttribute("data-i18n-alt");
      n.setAttribute("alt", (l === "en" && EN[key]) ? EN[key] : n.dataset.frAlt);
    });
    root.lang = l;
    langBtn.textContent = l === "en" ? "FR" : "EN";
    try { localStorage.setItem("lang", l); } catch (e) {}
  }
  langBtn.addEventListener("click", function () { setLang(root.lang === "en" ? "fr" : "en"); });
  var sl = null;
  try { sl = localStorage.getItem("lang"); } catch (e) {}
  if (sl === "en") setLang("en");

  /* ---------- Carrousel de projets ---------- */
  document.getElementById("project-carousel").hidden = false;
  var projectViewport = document.getElementById("project-viewport");
  var projectSlides = [].slice.call(document.querySelectorAll(".project-slide"));
  var projectDots = [].slice.call(document.querySelectorAll(".project-dot"));
  var projectCount = document.getElementById("project-count");
  var activeProject = 0, touchStart = null;

  function showProject(index) {
    activeProject = (index + projectSlides.length) % projectSlides.length;
    projectSlides.forEach(function (slide, i) {
      slide.hidden = i !== activeProject;
      slide.setAttribute("aria-label", (i + 1) + " / " + projectSlides.length);
    });
    projectDots.forEach(function (dot, i) {
      dot.setAttribute("aria-current", String(i === activeProject));
    });
    projectCount.textContent = (activeProject + 1) + " / " + projectSlides.length;
  }

  document.getElementById("project-prev").addEventListener("click", function () {
    showProject(activeProject - 1);
  });
  document.getElementById("project-next").addEventListener("click", function () {
    showProject(activeProject + 1);
  });
  projectDots.forEach(function (dot) {
    dot.addEventListener("click", function () {
      showProject(parseInt(dot.dataset.project, 10));
    });
  });
  projectViewport.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      showProject(activeProject + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      showProject(activeProject - 1);
    }
  });
  projectViewport.addEventListener("pointerdown", function (e) {
    if (e.pointerType === "touch") touchStart = { x: e.clientX, y: e.clientY };
  });
  projectViewport.addEventListener("pointerup", function (e) {
    if (!touchStart) return;
    var dx = e.clientX - touchStart.x;
    var dy = e.clientY - touchStart.y;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
      showProject(activeProject + (dx < 0 ? 1 : -1));
    }
    touchStart = null;
  });
  projectViewport.addEventListener("pointercancel", function () { touchStart = null; });

  /* ---------- Démo k-NN ---------- */
  var cv = document.getElementById("knn");
  var ctx = cv.getContext("2d");
  var bg = document.createElement("canvas");
  var bctx = bg.getContext("2d");
  var W = 0, H = 0, dpr = 1, k = 5, pts = [], mouse = null, nextClass = 0;

  function rng(seed) {
    return function () {
      seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function gauss(r) { return Math.sqrt(-2 * Math.log(r() || 1e-9)) * Math.cos(2 * Math.PI * r()); }

  function generate() {
    var r = rng(7), sx = 0.055 * W, sy = 0.09 * H;
    var centers = [
      [0.62, 0.64, 0], [0.88, 0.28, 0],
      [0.60, 0.26, 1], [0.86, 0.72, 1]
    ];
    pts = [];
    centers.forEach(function (c) {
      for (var i = 0; i < 22; i++) {
        pts.push({ x: c[0] * W + gauss(r) * sx, y: c[1] * H + gauss(r) * sy, c: c[2] });
      }
    });
  }

  function classify(x, y) {
    var d = pts.map(function (p, i) { var dx = p.x - x, dy = p.y - y; return { d: dx * dx + dy * dy, i: i }; });
    d.sort(function (a, b) { return a.d - b.d; });
    var nb = d.slice(0, Math.min(k, d.length)), votes = [0, 0];
    nb.forEach(function (n) { votes[pts[n.i].c]++; });
    return { nb: nb, c: votes[1] > votes[0] ? 1 : 0 };
  }

  function colors() {
    var s = getComputedStyle(root);
    return [s.getPropertyValue("--a").trim(), s.getPropertyValue("--b").trim()];
  }

  function paintBg() {
    if (!W) return;
    var col = colors(), cell = 22;
    bg.width = W * dpr; bg.height = H * dpr;
    bctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    bctx.globalAlpha = 0.13;
    for (var y = 0; y < H; y += cell) {
      for (var x = 0; x < W; x += cell) {
        bctx.fillStyle = col[classify(x + cell / 2, y + cell / 2).c];
        bctx.fillRect(x, y, cell, cell);
      }
    }
    bctx.globalAlpha = 1;
  }

  function draw() {
    if (!W) return;
    var col = colors();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height);
    ctx.drawImage(bg, 0, 0);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    pts.forEach(function (p) {
      ctx.beginPath(); ctx.arc(p.x, p.y, 4.5, 0, 6.2832);
      ctx.fillStyle = col[p.c]; ctx.fill();
    });
    if (mouse) {
      var res = classify(mouse.x, mouse.y);
      ctx.lineWidth = 1.3; ctx.strokeStyle = col[res.c]; ctx.globalAlpha = 0.7;
      res.nb.forEach(function (n) {
        ctx.beginPath(); ctx.moveTo(mouse.x, mouse.y); ctx.lineTo(pts[n.i].x, pts[n.i].y); ctx.stroke();
      });
      ctx.globalAlpha = 1;
      ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 9, 0, 6.2832);
      ctx.fillStyle = col[res.c]; ctx.globalAlpha = 0.25; ctx.fill(); ctx.globalAlpha = 1;
      ctx.lineWidth = 2.5; ctx.stroke();
    }
  }

  function resize() {
    var rect = cv.getBoundingClientRect();
    W = Math.round(rect.width); H = Math.round(rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    cv.width = W * dpr; cv.height = H * dpr;
    generate(); paintBg(); draw();
  }

  function pos(e) {
    var r = cv.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  cv.addEventListener("pointermove", function (e) { mouse = pos(e); draw(); });
  cv.addEventListener("pointerleave", function () { mouse = null; draw(); });
  cv.addEventListener("click", function (e) {
    var p = pos(e);
    pts.push({ x: p.x, y: p.y, c: nextClass });
    nextClass = 1 - nextClass;
    paintBg(); draw();
  });

  [].slice.call(document.querySelectorAll(".kb")).forEach(function (b) {
    b.addEventListener("click", function () {
      k = parseInt(b.dataset.k, 10);
      [].slice.call(document.querySelectorAll(".kb")).forEach(function (o) {
        o.setAttribute("aria-pressed", String(o === b));
      });
      paintBg(); draw();
    });
  });
  document.getElementById("reset").addEventListener("click", function () {
    generate(); paintBg(); draw();
  });

  window.addEventListener("resize", resize);
  resize();
})();
