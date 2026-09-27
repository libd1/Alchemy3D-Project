(function () {
  const cfg = window.SITE_CONFIG;
  if (!cfg) {
    console.error("Missing SITE_CONFIG - load site-config.js first.");
    return;
  }

  const LINK_META = {
    paper: { desc: "Camera-ready PDF or publisher page." },
    arxiv: { desc: "Preprint on arXiv (abs or pdf link)." },
    code: { desc: "Main code repository (training + inference)." },
    data: { desc: "Dataset download or dataset card (Hugging Face)." },
    dataModelscope: { desc: "Dataset download on ModelScope." },
    model: { desc: "Pretrained model checkpoints (Hugging Face)." },
    modelModelscope: { desc: "Pretrained model checkpoints on ModelScope." },
    evaluation: { desc: "Evaluation scripts and protocols." },
    benchmark: { desc: "Benchmark suite and leaderboard (Hugging Face)." },
    benchmarkModelscope: { desc: "Benchmark suite and leaderboard on ModelScope." },
  };

  const LINK_ORDER = [
    "paper",
    "arxiv",
    "code",
    "data",
    "dataModelscope",
    "model",
    "modelModelscope",
    "evaluation",
    "benchmark",
    "benchmarkModelscope",
  ];

  function el(id) {
    return document.getElementById(id);
  }

  function setText(id, value) {
    const node = el(id);
    if (node) node.textContent = value;
  }

  /** Resolve relative asset paths against optional CDN/OSS base. */
  function assetUrl(path) {
    if (!path) return path;
    const raw = String(path);
    if (/^(https?:|data:|blob:|\/\/)/i.test(raw)) return raw;
    const base = String(cfg.assetBaseUrl || "").trim();
    if (!base) return raw;
    const cleanedBase = base.replace(/\/?$/, "/");
    return cleanedBase + raw.replace(/^\//, "");
  }

  /** Card thumbs live under /assets (with the page); do not fetch from assetBaseUrl. */
  function previewUrl(path) {
    if (!path) return "";
    const raw = String(path);
    if (/^(https?:|data:|blob:|\/\/)/i.test(raw)) return raw;
    if (/^assets\//i.test(raw) || /^\/assets\//i.test(raw)) {
      return raw.replace(/^\//, "");
    }
    return assetUrl(raw);
  }

  function withAssetUrls(item) {
    if (!item || typeof item !== "object") return item;
    const out = Object.assign({}, item);
    [
      "src",
      "before",
      "after",
      "poster",
      "icon",
      "logo",
    ].forEach(function (key) {
      if (out[key]) out[key] = assetUrl(out[key]);
    });
    // Cond / preview images ship with the HTML page under assets/.
    if (out.targetImage) out.targetImage = previewUrl(out.targetImage);
    if (out.preview) out.preview = previewUrl(out.preview);
    return out;
  }

  function isModelItem(item) {
    if (item.type === "model") return true;
    if (item.type === "image") return false;
    const src = String(item.before || item.after || "").toLowerCase();
    return src.endsWith(".glb") || src.endsWith(".gltf");
  }

  function renderHero() {
    setText("conference", cfg.conference || "");
    setText("project-name", cfg.projectName || "Alchemy3D");
    setText("tagline", cfg.tagline || "");
    setText("footer-brand", cfg.projectName || "Alchemy3D");
    const logo = previewUrl(cfg.logo || "assets/logo_alchemy3d.png");
    const brandLogo = el("brand-logo");
    if (brandLogo) {
      brandLogo.src = logo;
      brandLogo.alt = (cfg.projectName || "Alchemy3D") + " logo";
    }
    document.querySelectorAll(".brand-mark-mini").forEach(function (img) {
      img.src = logo;
      img.alt = "";
    });
    setText("footer-note", cfg.footerNote || "");
    document.title = (cfg.projectName || "Alchemy3D") + " - Project Page";
    const heroImg = el("hero-teaser");
    if (heroImg && cfg.teaserStill) heroImg.src = previewUrl(cfg.teaserStill);
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) favicon.href = previewUrl("assets/favicon.png");
  }

  function renderAuthors() {
    const authorsRoot = el("authors");
    const affRoot = el("affiliations");
    const equalNote = el("equal-note");
    if (!authorsRoot || !affRoot) return;
    authorsRoot.innerHTML = "";
    (cfg.authors || []).forEach(function (author) {
      const wrap = document.createElement("span");
      const link = document.createElement(author.url ? "a" : "span");
      if (author.url) link.href = author.url;
      link.textContent = author.name;
      const marks = document.createElement("span");
      marks.className = "author-mark";
      let markText = (author.affiliationIds || []).join(",");
      if (author.equal) markText += "*";
      if (author.corresponding) markText += "\u2020";
      marks.textContent = markText;
      wrap.appendChild(link);
      wrap.appendChild(marks);
      authorsRoot.appendChild(wrap);
    });
    affRoot.innerHTML = (cfg.affiliations || [])
      .map(function (a) {
        return "<span>" + a.id + ". " + a.name + "</span>";
      })
      .join("<br />");
    const hasEqual = (cfg.authors || []).some(function (a) {
      return a.equal;
    });
    const hasCorr = (cfg.authors || []).some(function (a) {
      return a.corresponding;
    });
    if (equalNote) {
      equalNote.hidden = !(hasEqual || hasCorr);
      const parts = [];
      if (hasEqual) {
        parts.push('<span class="author-mark">*</span> Equal contribution');
      }
      if (hasCorr) {
        parts.push(
          '<span class="author-mark">†</span> Corresponding author'
        );
      }
      equalNote.innerHTML = parts.join(" · ");
    }
  }

  function renderResourceButtons() {
    const row = el("resource-row");
    if (!row) return;
    row.innerHTML = "";
    LINK_ORDER.forEach(function (key) {
      const item = (cfg.links || {})[key];
      if (!item) return;
      const a = document.createElement("a");
      a.className = "resource" + (item.enabled ? "" : " is-disabled");
      a.dataset.key = key;
      a.href = item.enabled ? item.url || "#" : "#";
      if (item.enabled && item.url && !String(item.url).startsWith("#")) {
        a.target = "_blank";
        a.rel = "noopener noreferrer";
      }
      a.setAttribute("aria-disabled", item.enabled ? "false" : "true");
      if (!item.enabled) a.tabIndex = -1;
      if (item.icon) {
        const icon = document.createElement("img");
        icon.className =
          "resource-icon" + (item.iconClass ? " " + item.iconClass : "");
        icon.src = previewUrl(item.icon);
        icon.alt = "";
        icon.width = 24;
        icon.height = 24;
        icon.draggable = false;
        a.appendChild(icon);
      }
      const label = document.createElement("span");
      label.textContent = item.label || key;
      a.appendChild(label);
      if (item.note) {
        const note = document.createElement("span");
        note.className = "note";
        note.textContent = item.note;
        a.appendChild(note);
      }
      row.appendChild(a);
    });
  }

  function renderResourceDetail() {
    const list = el("resource-detail");
    if (!list) return;
    list.innerHTML = "";
    LINK_ORDER.forEach(function (key) {
      const item = (cfg.links || {})[key];
      if (!item) return;
      const meta = LINK_META[key] || { desc: "" };
      const li = document.createElement("li");
      const keyEl = document.createElement("span");
      keyEl.className = "key";
      keyEl.textContent = item.label || key;
      const desc = document.createElement("span");
      desc.className = "desc";
      desc.textContent = meta.desc + (item.note ? " (" + item.note + ")" : "");
      const status = document.createElement("span");
      status.className = "status" + (item.enabled ? " ready" : "");
      status.textContent = item.enabled ? "Ready" : "Placeholder";
      li.appendChild(keyEl);
      li.appendChild(desc);
      li.appendChild(status);
      if (item.enabled && item.url) {
        const goto = document.createElement("a");
        goto.className = "goto";
        goto.href = item.url;
        if (!String(item.url).startsWith("#")) {
          goto.target = "_blank";
          goto.rel = "noopener noreferrer";
        }
        goto.textContent = String(item.url).startsWith("#")
          ? "Jump to section \u2192"
          : "Open link \u2192";
        li.appendChild(goto);
      }
      list.appendChild(li);
    });
  }

  function renderAbstract() {
    const root = el("abstract-text");
    if (!root) return;
    root.innerHTML = "";
    const raw = cfg.abstract;
    const paras = Array.isArray(raw)
      ? raw.map((s) => String(s || "").replace(/\s+/g, " ").trim()).filter(Boolean)
      : String(raw || "")
          .split(/\n\s*\n/)
          .map((s) => s.replace(/\s+/g, " ").trim())
          .filter(Boolean);
    paras.forEach((text) => {
      const p = document.createElement("p");
      p.textContent = text;
      root.appendChild(p);
    });
  }

  function renderVideo() {
    const demo = withAssetUrls(cfg.demoVideo || {});
    const demoPlayer = el("demo-player");
    const caption = el("demo-caption");
    if (caption) caption.textContent = demo.caption || "";
    if (!demoPlayer) return;
    if (demo.poster) demoPlayer.setAttribute("poster", demo.poster);
    const source = demoPlayer.querySelector("source");
    if (source && demo.src) source.src = demo.src;
    if (demo.src) demoPlayer.load();
  }

  function renderTeaserStill() {
    const img = el("teaser-still");
    if (img && cfg.teaserStill) img.src = assetUrl(cfg.teaserStill);
  }

  function renderAnimSequences() {
    const block = cfg.animSequences || {};
    const section = el("anim-sequences");
    const root = el("anim-sequences-root");
    const lead = el("anim-sequences-lead");
    if (!root || !section) return;

    const sequences = block.sequences || [];
    if (!sequences.length) {
      section.hidden = true;
      return;
    }
    section.hidden = false;
    if (lead) lead.textContent = block.lead || "";
    root.innerHTML = "";

    sequences.forEach(function (seq) {
      const frames = (seq.frames || []).map(function (frame) {
        return withAssetUrls(frame);
      });
      if (!frames.length) return;

      const card = document.createElement("figure");
      card.className = "anim-seq-card";
      card.dataset.seqId = seq.id || "";

      const frame = document.createElement("div");
      frame.className = "anim-seq-frame";
      frame.setAttribute("role", "group");
      frame.setAttribute("aria-label", "Animation keyframe viewer");

      const prevBtn = document.createElement("button");
      prevBtn.type = "button";
      prevBtn.className = "anim-seq-arrow anim-seq-prev";
      prevBtn.setAttribute("aria-label", "Previous keyframe");
      prevBtn.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 4.5 L7.5 12 L15.5 19.5"/></svg>';

      const nextBtn = document.createElement("button");
      nextBtn.type = "button";
      nextBtn.className = "anim-seq-arrow anim-seq-next";
      nextBtn.setAttribute("aria-label", "Next keyframe");
      nextBtn.innerHTML =
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 4.5 L16.5 12 L8.5 19.5"/></svg>';

      const stage = document.createElement("div");
      stage.className = "anim-seq-stage";

      const loading = document.createElement("div");
      loading.className = "anim-seq-loading";
      loading.setAttribute("aria-hidden", "true");

      const mv = createModelViewer(
        seq,
        "anim-seq-viewer",
        "Animation keyframe",
        seq.scale || ""
      );
      mv.style.pointerEvents = "auto";
      mv.setAttribute("camera-controls", "");
      mv.setAttribute("interaction-prompt", "none");
      mv.removeAttribute("disable-tap");
      stage.appendChild(mv);
      stage.appendChild(loading);

      const dots = document.createElement("div");
      dots.className = "anim-seq-dots";
      dots.setAttribute("role", "tablist");
      dots.setAttribute("aria-label", "Keyframe index");

      frames.forEach(function (frameItem, index) {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "anim-seq-dot";
        dot.dataset.index = String(index);
        dot.setAttribute("aria-label", "Keyframe " + (index + 1));
        dot.addEventListener("click", function () {
          setActive(index);
        });
        dots.appendChild(dot);
      });

      frame.appendChild(prevBtn);
      frame.appendChild(stage);
      frame.appendChild(nextBtn);

      card.appendChild(frame);
      card.appendChild(dots);
      root.appendChild(card);

      var active = 0;
      var loadToken = 0;
      var unlocked = false;

      function applyView(frameItem) {
        const orbit = frameItem.cameraOrbit || seq.cameraOrbit || "0deg 70deg 105%";
        const target =
          frameItem.cameraTarget || seq.cameraTarget || "0m 0.05m 0m";
        const fov = frameItem.fieldOfView || seq.fieldOfView || "28deg";
        // Orientation is pre-baked into GLB assets — keep identity at runtime.
        mv.setAttribute("orientation", "0deg 0deg 0deg");
        mv.setAttribute("camera-orbit", orbit);
        mv.setAttribute("camera-target", target);
        mv.setAttribute("field-of-view", fov);
        try {
          mv.orientation = "0deg 0deg 0deg";
          mv.cameraOrbit = orbit;
          mv.cameraTarget = target;
          mv.fieldOfView = fov;
        } catch (err) {}
        if (typeof mv.resetTurntableRotation === "function") {
          try {
            mv.resetTurntableRotation();
          } catch (err) {}
        }
        if (typeof mv.jumpCameraToGoal === "function") {
          try {
            mv.jumpCameraToGoal();
          } catch (err) {}
        }
      }

      function updateChrome() {
        Array.prototype.forEach.call(dots.children, function (dot, i) {
          dot.classList.toggle("is-active", i === active);
          dot.disabled = !unlocked;
        });
        prevBtn.disabled = !unlocked || frames.length <= 1;
        nextBtn.disabled = !unlocked || frames.length <= 1;
      }

      function showFrame(index, setProgress) {
        const n = frames.length;
        active = ((index % n) + n) % n;
        updateChrome();

        const frameItem = frames[active];
        if (!frameItem || !frameItem.src) return Promise.resolve(false);

        applyView(frameItem);

        if (mv.dataset.loadedSrc === frameItem.src) {
          loading.hidden = true;
          return Promise.resolve(true);
        }

        const token = ++loadToken;
        loading.hidden = !setProgress;
        if (setProgress) setProgress("Downloading frame…", 0, 0);

        return loadModelViewer(mv, frameItem.src, function (received, total) {
          if (setProgress) {
            setProgress("Downloading frame…", received, total);
          } else {
            loading.hidden = false;
            loading.textContent = formatProgressLabel(
              "Downloading frame…",
              received,
              total
            );
          }
        })
          .then(function () {
            if (token !== loadToken) return false;
            applyView(frameItem);
            loading.hidden = true;
            loading.textContent = "";
            return true;
          })
          .catch(function (err) {
            if (token !== loadToken) return false;
            console.warn("[anim-seq] load failed", frameItem.src, err);
            loading.hidden = true;
            throw err;
          });
      }

      function setActive(next) {
        if (!unlocked) return;
        showFrame(next, null).catch(function () {});
      }

      prevBtn.addEventListener("click", function () {
        setActive(active - 1);
      });
      nextBtn.addEventListener("click", function () {
        setActive(active + 1);
      });

      card.addEventListener("keydown", function (event) {
        if (!unlocked) return;
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          setActive(active - 1);
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          setActive(active + 1);
        }
      });
      card.tabIndex = 0;
      updateChrome();

      attachDownloadGate(stage, {
        buttonText: "Download to view",
        preview: previewUrl(seq.preview || ""),
        onDownload: function (setProgress) {
          return showFrame(0, setProgress).then(function (ok) {
            if (ok) {
              unlocked = true;
              updateChrome();
            }
            return ok;
          });
        },
      });
    });
  }

  function renderSegmentShowcases() {
    const block = cfg.segmentShowcases || {};
    const section = el("seg-showcases");
    const root = el("seg-showcases-root");
    const lead = el("seg-showcases-lead");
    if (!root || !section) return;

    const items = block.items || [];
    if (!items.length) {
      section.hidden = true;
      return;
    }
    section.hidden = false;
    if (lead) lead.textContent = block.lead || "";
    root.innerHTML = "";

    items.forEach(function (rawItem) {
      const item = withAssetUrls(rawItem);
      const figure = document.createElement("figure");
      figure.className = "comparison-card seg-card";

      const slider = document.createElement("div");
      slider.className = "comparison-slider is-model";
      slider.style.setProperty("--cmp-frame-width", "100%");

      const beforeLabel = document.createElement("span");
      beforeLabel.className = "cmp-label before";
      beforeLabel.textContent = item.beforeLabel || "Source";
      const afterLabel = document.createElement("span");
      afterLabel.className = "cmp-label after";
      afterLabel.textContent = item.afterLabel || "Segmented";

      const range = document.createElement("input");
      range.className = "cmp-range";
      range.type = "range";
      range.min = "0";
      range.max = "100";
      range.value = "50";
      range.setAttribute(
        "aria-label",
        "Drag to move or focus and use arrow keys"
      );

      const handle = document.createElement("div");
      handle.className = "cmp-handle";
      handle.setAttribute("aria-hidden", "true");
      handle.innerHTML =
        '<div class="cmp-knob"><svg viewBox="0 0 24 24"><path d="M9 7 L4 12 L9 17"/><path d="M15 7 L20 12 L15 17"/></svg></div>';

      const afterView = createModelViewer(
        item,
        "cmp-after",
        item.afterLabel || "Segmented",
        item.afterScale || item.scale || ""
      );
      const beforeView = createModelViewer(
        item,
        "cmp-before",
        item.beforeLabel || "Source",
        item.beforeScale || item.scale || ""
      );

      const afterLayer = document.createElement("div");
      afterLayer.className = "cmp-layer cmp-layer-after";
      afterLayer.appendChild(afterView);

      const beforeLayer = document.createElement("div");
      beforeLayer.className = "cmp-layer cmp-layer-before";
      const beforeNudge = document.createElement("div");
      beforeNudge.className = "cmp-nudge";
      beforeNudge.appendChild(beforeView);
      beforeLayer.appendChild(beforeNudge);

      slider.appendChild(afterLayer);
      slider.appendChild(beforeLayer);

      const loading = document.createElement("div");
      loading.className = "cmp-loading";
      loading.hidden = true;
      slider.appendChild(loading);

      slider.appendChild(beforeLabel);
      slider.appendChild(afterLabel);
      slider.appendChild(handle);
      slider.appendChild(range);

      figure.appendChild(slider);
      root.appendChild(figure);

      attachDownloadGate(slider, {
        buttonText: "Download to view",
        preview: previewUrl(item.preview || ""),
        onDownload: function (setProgress) {
          return new Promise(function (resolve, reject) {
            enqueueComparisonLoad(function () {
              return prepareModelPair(
                slider,
                item,
                beforeView,
                afterView,
                loading,
                setProgress
              ).then(function (ok) {
                if (ok) bindWipeSlider(slider, { isModel: true });
                resolve(ok);
              }, reject);
            });
          });
        },
      });
    });
  }

  function formatMb(bytes) {
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  function formatProgressLabel(label, received, total) {
    if (!total) {
      return label + " " + formatMb(received);
    }
    const pct = Math.min(100, Math.round((received / total) * 100));
    return (
      label +
      " " +
      pct +
      "% (" +
      formatMb(received) +
      " / " +
      formatMb(total) +
      ")"
    );
  }

  /**
   * Click-to-download overlay. No network until the user clicks.
   * onDownload(setProgress) should return a Promise.
   */
  function attachDownloadGate(host, options) {
    const opts = options || {};
    const gate = document.createElement("div");
    gate.className = "asset-gate";

    if (opts.preview) {
      const img = document.createElement("img");
      img.className = "asset-gate-preview";
      img.src = opts.preview;
      img.alt = "";
      img.draggable = false;
      img.loading = "lazy";
      img.decoding = "async";
      gate.appendChild(img);
      const dim = document.createElement("div");
      dim.className = "asset-gate-dim";
      gate.appendChild(dim);
    }

    const panel = document.createElement("div");
    panel.className = "asset-gate-panel";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "asset-download-btn";
    btn.textContent = opts.buttonText || "Download to view";

    const progress = document.createElement("div");
    progress.className = "asset-progress";
    progress.hidden = true;

    const track = document.createElement("div");
    track.className = "asset-progress-track";
    const fill = document.createElement("div");
    fill.className = "asset-progress-fill";
    track.appendChild(fill);

    const text = document.createElement("div");
    text.className = "asset-progress-text";
    text.textContent = "Preparing…";

    progress.appendChild(track);
    progress.appendChild(text);
    panel.appendChild(btn);
    panel.appendChild(progress);
    gate.appendChild(panel);
    host.appendChild(gate);

    function setProgress(label, received, total) {
      progress.hidden = false;
      btn.hidden = true;
      text.textContent = formatProgressLabel(label || "Downloading…", received || 0, total || 0);
      if (total > 0) {
        fill.style.width = Math.min(100, Math.round((received / total) * 100)) + "%";
      } else {
        fill.style.width = "15%";
      }
    }

    function setStatus(message) {
      progress.hidden = false;
      btn.hidden = true;
      text.textContent = message || "";
      fill.style.width = "100%";
    }

    function fail(message) {
      progress.hidden = true;
      btn.hidden = false;
      btn.disabled = false;
      btn.textContent = "Retry download";
      text.textContent = message || "Download failed";
    }

    function done() {
      gate.hidden = true;
      gate.setAttribute("data-loaded", "true");
    }

    let inflight = null;
    function start() {
      if (gate.getAttribute("data-loaded") === "true") {
        return Promise.resolve(true);
      }
      if (inflight) return inflight;
      btn.disabled = true;
      setProgress("Downloading…", 0, 0);
      inflight = Promise.resolve()
        .then(function () {
          return opts.onDownload(setProgress, setStatus);
        })
        .then(function (ok) {
          if (ok === false) {
            fail("Download failed");
            inflight = null;
            return false;
          }
          done();
          return true;
        })
        .catch(function (err) {
          console.error(err);
          fail((err && err.message) || "Download failed");
          inflight = null;
          return false;
        });
      return inflight;
    }

    btn.addEventListener("click", function () {
      start();
    });

    gate.__startDownload = start;
    return { gate: gate, start: start, setProgress: setProgress, setStatus: setStatus, done: done, fail: fail };
  }

  function fetchModelBlob(src, onProgress) {
    return fetch(src, { cache: "default", mode: "cors" }).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status + " for " + src);
      const total = Number(res.headers.get("Content-Length") || 0);
      if (!res.body || !res.body.getReader) return res.blob();
      const reader = res.body.getReader();
      const chunks = [];
      let received = 0;
      function pump() {
        return reader.read().then(function (result) {
          if (result.done) {
            return new Blob(chunks, { type: "model/gltf-binary" });
          }
          chunks.push(result.value);
          received += result.value.length;
          if (onProgress) onProgress(received, total);
          return pump();
        });
      }
      return pump();
    });
  }

  function loadModelViewer(mv, src, onProgress) {
    return new Promise(function (resolve, reject) {
      if (!mv || !src) {
        reject(new Error("Missing model viewer or src"));
        return;
      }
      if (mv.dataset.loadedSrc === src && mv.loaded) {
        resolve(mv);
        return;
      }
      if (mv.dataset.blobUrl) {
        URL.revokeObjectURL(mv.dataset.blobUrl);
        delete mv.dataset.blobUrl;
      }
      fetchModelBlob(src, onProgress)
        .then(function (blob) {
          const url = URL.createObjectURL(blob);
          mv.dataset.blobUrl = url;
          mv.dataset.loadedSrc = src;
          const onLoad = function () {
            cleanup();
            resolve(mv);
          };
          const onError = function (event) {
            cleanup();
            const detail =
              (event && event.detail && (event.detail.message || event.detail.type)) ||
              mv.errorMessage ||
              "model-viewer parse error";
            reject(new Error(detail));
          };
          const cleanup = function () {
            mv.removeEventListener("load", onLoad);
            mv.removeEventListener("error", onError);
          };
          mv.addEventListener("load", onLoad);
          mv.addEventListener("error", onError);
          mv.setAttribute("src", url);
        })
        .catch(reject);
    });
  }

  function createModelViewer(item, className, alt, scaleStr) {
    const mv = document.createElement("model-viewer");
    mv.className = className;
    mv.setAttribute("alt", alt || "3D asset");
    mv.setAttribute("touch-action", "none");
    mv.setAttribute("interaction-prompt", "none");
    mv.setAttribute("shadow-intensity", item.shadowIntensity || "0.65");
    mv.setAttribute("environment-image", "neutral");
    mv.setAttribute("camera-orbit", item.cameraOrbit || "0deg 75deg 105%");
    mv.setAttribute("field-of-view", item.fieldOfView || "28deg");
    mv.setAttribute("camera-target", item.cameraTarget || "auto auto auto");
    mv.setAttribute("exposure", item.exposure || "1");
    mv.setAttribute("loading", "eager");
    mv.setAttribute("reveal", "auto");
    // Match Blender teaser_scene asset scales (SourceAsset/OutputAsset hierarchy).
    if (scaleStr) mv.setAttribute("scale", scaleStr);
    if (item.orientation) {
      mv.setAttribute("orientation", item.orientation);
    }
    // Cameras are driven by a shared orbit controller (not per-viewer controls),
    // so Source/Edited update in the same frame with no follow lag.
    mv.setAttribute("disable-tap", "");
    mv.setAttribute("interpolation-decay", "0");
    mv.style.pointerEvents = "none";
    return mv;
  }

  function getViewerScene(mv) {
    if (!mv) return null;
    const sym = Object.getOwnPropertySymbols(mv).find(function (s) {
      return String(s) === "Symbol(scene)";
    });
    return sym ? mv[sym] : null;
  }

  var comparisonViewerPairs = [];
  var shadingMode = "shaded";

  function queueViewerRender(mv) {
    const scene = getViewerScene(mv);
    if (scene && typeof scene.queueRender === "function") {
      scene.queueRender();
      return;
    }
    if (mv && typeof mv.requestUpdate === "function") {
      try {
        mv.requestUpdate("cameraOrbit");
      } catch (err) {}
    }
  }

  function eachMesh(mv, fn) {
    const scene = getViewerScene(mv);
    if (!scene) return;
    scene.traverse(function (obj) {
      if (obj.isMesh && obj.material) fn(obj);
    });
  }

  function makeNormalVizMaterial(orig) {
    const m = orig.clone();
    const mapKeys = [
      "map",
      "normalMap",
      "roughnessMap",
      "metalnessMap",
      "aoMap",
      "emissiveMap",
      "bumpMap",
      "displacementMap",
      "alphaMap",
      "envMap",
      "specularMap",
      "clearcoatMap",
      "clearcoatNormalMap",
      "clearcoatRoughnessMap",
      "sheenColorMap",
      "sheenRoughnessMap",
      "transmissionMap",
      "thicknessMap",
    ];
    mapKeys.forEach(function (key) {
      if (key in m) m[key] = null;
    });
    if (m.color && m.color.setRGB) m.color.setRGB(1, 1, 1);
    if (m.emissive && m.emissive.setRGB) m.emissive.setRGB(0, 0, 0);
    if ("metalness" in m) m.metalness = 0;
    if ("roughness" in m) m.roughness = 1;
    if ("envMapIntensity" in m) m.envMapIntensity = 0;
    if ("specularIntensity" in m) m.specularIntensity = 0;
    m.onBeforeCompile = function (shader) {
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <opaque_fragment>",
        [
          "#ifdef OPAQUE",
          "diffuseColor.a = 1.0;",
          "#endif",
          "gl_FragColor = vec4(normalize(normal) * 0.5 + 0.5, diffuseColor.a);",
        ].join("\n")
      );
    };
    m.customProgramCacheKey = function () {
      return "alchemy-normal-viz-v1";
    };
    if ("skinning" in orig) m.skinning = orig.skinning;
    if ("morphTargets" in orig) m.morphTargets = orig.morphTargets;
    if ("morphNormals" in orig) m.morphNormals = orig.morphNormals;
    m.side = orig.side;
    m.transparent = !!orig.transparent;
    m.opacity = orig.opacity;
    m.depthWrite = orig.depthWrite;
    m.needsUpdate = true;
    return m;
  }

  function setViewerShading(mv, mode) {
    if (!mv) return;
    eachMesh(mv, function (mesh) {
      if (!mesh.userData._alchemyOrigMat) {
        mesh.userData._alchemyOrigMat = Array.isArray(mesh.material)
          ? mesh.material.slice()
          : mesh.material;
      }
      const orig = mesh.userData._alchemyOrigMat;
      if (mode === "normals") {
        if (Array.isArray(orig)) {
          mesh.material = orig.map(function (mat) {
            return makeNormalVizMaterial(mat);
          });
        } else {
          mesh.material = makeNormalVizMaterial(orig);
        }
      } else {
        mesh.material = orig;
      }
    });
    // Neutral lighting helps shaded mode; normals mode ignores lights in shader.
    if (mode === "normals") {
      mv.removeAttribute("environment-image");
      mv.setAttribute("shadow-intensity", "0");
    } else {
      mv.setAttribute("environment-image", "neutral");
      mv.setAttribute("shadow-intensity", "0.65");
    }
    queueViewerRender(mv);
  }

  function setShadingMode(mode) {
    shadingMode = mode === "normals" ? "normals" : "shaded";
    comparisonViewerPairs.forEach(function (pair) {
      setViewerShading(pair.before, shadingMode);
      setViewerShading(pair.after, shadingMode);
    });
    document.querySelectorAll("[data-shading-mode]").forEach(function (btn) {
      btn.classList.toggle(
        "is-active",
        btn.getAttribute("data-shading-mode") === shadingMode
      );
    });
  }

  function bindShadingToggle() {
    const root = el("cmp-shading-toggle");
    if (!root) return;
    root.addEventListener("click", function (event) {
      const btn = event.target.closest("[data-shading-mode]");
      if (!btn) return;
      setShadingMode(btn.getAttribute("data-shading-mode"));
    });
  }

  function setWipePosition(root, pct) {
    const clamped = Math.max(0, Math.min(100, pct));
    const beforeWrap = root.querySelector(".cmp-before-wrap");
    const beforeLayer = root.querySelector(".cmp-layer-before");
    const afterLayer = root.querySelector(".cmp-layer-after");
    const beforeMv = root.querySelector("model-viewer.cmp-before");
    const afterMv = root.querySelector("model-viewer.cmp-after");
    const handle = root.querySelector(".cmp-handle");
    const range = root.querySelector(".cmp-range");
    const width = root.getBoundingClientRect().width || root.clientWidth || 1;
    root.style.setProperty("--cmp-frame-width", width + "px");

    if (beforeMv && afterMv) {
      // Clip BOTH viewers so transparent WebGL pixels cannot reveal the other side.
      const rightCut = (100 - clamped).toFixed(3) + "%";
      const leftCut = clamped.toFixed(3) + "%";
      beforeMv.style.clipPath = "inset(0 " + rightCut + " 0 0)";
      afterMv.style.clipPath = "inset(0 0 0 " + leftCut + ")";
      beforeMv.style.webkitClipPath = beforeMv.style.clipPath;
      afterMv.style.webkitClipPath = afterMv.style.clipPath;

      // Source window (left): opaque stage + overflow clip for hit-testing
      if (beforeLayer) {
        beforeLayer.style.left = "0";
        beforeLayer.style.width = clamped + "%";
        beforeLayer.style.visibility = clamped <= 0.1 ? "hidden" : "visible";
      }
      // Edited window (right): also shrink the layer so it cannot paint under Source
      if (afterLayer) {
        afterLayer.style.left = clamped + "%";
        afterLayer.style.width = 100 - clamped + "%";
        afterLayer.style.visibility = clamped >= 99.9 ? "hidden" : "visible";
      }

      const showBefore = clamped > 0.1;
      const showAfter = clamped < 99.9;
      beforeMv.style.visibility = showBefore ? "visible" : "hidden";
      afterMv.style.visibility = showAfter ? "visible" : "hidden";
      beforeMv.style.opacity = showBefore ? "1" : "0";
      afterMv.style.opacity = showAfter ? "1" : "0";

      beforeMv.style.width = width + "px";
      afterMv.style.width = width + "px";
      beforeMv.style.left = "0";
      // Keep Edited canvas aligned to the full frame while its layer is a right window
      afterMv.style.left = -((clamped / 100) * width) + "px";
    } else if (beforeWrap) {
      beforeWrap.style.width = clamped + "%";
      beforeWrap.style.setProperty("--cmp-frame-width", width + "px");
    }

    if (handle) handle.style.left = clamped + "%";
    if (range && String(range.value) !== String(Math.round(clamped))) {
      range.value = String(Math.round(clamped));
    }
  }

  function applyModelOffset(mv, offsetY) {
    if (!mv || offsetY === undefined || offsetY === null || offsetY === "") return;
    const y = Number(offsetY) || 0;
    mv.dataset.offsetY = String(y);
    const apply = function () {
      try {
        const scene = getViewerScene(mv);
        if (scene && scene.pivot && scene.pivot.position) {
          scene.pivot.position.y = y;
          return true;
        }
        if (scene && scene.model && scene.model.position) {
          scene.model.position.y = y;
          return true;
        }
      } catch (err) {
        console.warn("model offset failed", err);
      }
      return false;
    };
    const run = function () {
      let tries = 0;
      (function tick() {
        if (apply() || tries > 60) return;
        tries += 1;
        requestAnimationFrame(tick);
      })();
    };
    if (mv.loaded) run();
    else mv.addEventListener("load", run, { once: true });
  }

  function bindWipeSlider(root, options) {
    const range = root.querySelector(".cmp-range");
    const handle = root.querySelector(".cmp-handle");
    if (!range) return;
    const isModel = !!(options && options.isModel);

    const syncFromRange = function () {
      setWipePosition(root, Number(range.value));
    };
    range.addEventListener("input", syncFromRange);
    range.addEventListener("change", syncFromRange);

    const onPointer = function (clientX) {
      const rect = root.getBoundingClientRect();
      if (!rect.width) return;
      setWipePosition(root, ((clientX - rect.left) / rect.width) * 100);
    };

    if (isModel) {
      // Handle-only wipe so the rest of the frame can orbit the 3D camera.
      let dragging = false;
      if (handle) {
        handle.addEventListener("pointerdown", function (event) {
          dragging = true;
          handle.setPointerCapture(event.pointerId);
          onPointer(event.clientX);
          event.preventDefault();
          event.stopPropagation();
        });
        handle.addEventListener("pointermove", function (event) {
          if (!dragging) return;
          onPointer(event.clientX);
          event.preventDefault();
        });
        handle.addEventListener("pointerup", function () {
          dragging = false;
        });
        handle.addEventListener("pointercancel", function () {
          dragging = false;
        });
      }
    } else {
      root.addEventListener("pointerdown", function (event) {
        if (event.target === range) return;
        root.setPointerCapture(event.pointerId);
        onPointer(event.clientX);
      });
      root.addEventListener("pointermove", function (event) {
        if (!root.hasPointerCapture(event.pointerId)) return;
        onPointer(event.clientX);
      });
    }

    if (typeof ResizeObserver !== "undefined") {
      new ResizeObserver(syncFromRange).observe(root);
    } else {
      window.addEventListener("resize", syncFromRange);
    }

    syncFromRange();
  }

  function parseAngle(token) {
    const value = parseFloat(token);
    if (!isFinite(value)) return 0;
    if (/rad$/i.test(token)) return value;
    return (value * Math.PI) / 180;
  }

  function parseLength(token) {
    const value = parseFloat(token);
    return isFinite(value) ? value : 3.5;
  }

  function parseOrbitString(str) {
    const parts = String(str || "0deg 75deg 3.5m").trim().split(/\s+/);
    return {
      theta: parseAngle(parts[0] || "0deg"),
      phi: parseAngle(parts[1] || "75deg"),
      radius: parseLength(parts[2] || "3.5m"),
    };
  }

  function parseFov(str) {
    const value = parseFloat(str);
    return isFinite(value) ? value : 28;
  }

  function bindSharedOrbit(root, a, b, item) {
    // Single orbit state applied to both viewers in one write — no leader/follower.
    const state = parseOrbitString(
      (item && item.cameraOrbit) || a.getAttribute("camera-orbit")
    );
    state.target =
      (item && item.cameraTarget) ||
      a.getAttribute("camera-target") ||
      "0m 0m 0m";
    state.fov = parseFov(
      (item && item.fieldOfView) || a.getAttribute("field-of-view")
    );

    const PHI_MIN = 0.05;
    const PHI_MAX = Math.PI - 0.05;
    const RADIUS_MIN = 0.8;
    const RADIUS_MAX = 12;

    function applyBoth() {
      const orbit =
        state.theta + "rad " + state.phi + "rad " + state.radius + "m";
      const fov = state.fov + "deg";
      a.cameraOrbit = orbit;
      b.cameraOrbit = orbit;
      a.cameraTarget = state.target;
      b.cameraTarget = state.target;
      a.fieldOfView = fov;
      b.fieldOfView = fov;
    }

    applyBoth();

    let overlay = root.querySelector(".cmp-orbit");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "cmp-orbit";
      overlay.setAttribute("aria-hidden", "true");
      root.appendChild(overlay);
    }

    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    overlay.addEventListener("pointerdown", function (event) {
      if (event.button != null && event.button !== 0) return;
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      overlay.setPointerCapture(event.pointerId);
      root.classList.add("is-orbiting");
      event.preventDefault();
    });

    overlay.addEventListener("pointermove", function (event) {
      if (!dragging) return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;
      // Match model-viewer orbit feel roughly (radians per pixel).
      state.theta -= dx * 0.007;
      state.phi = Math.min(
        PHI_MAX,
        Math.max(PHI_MIN, state.phi - dy * 0.007)
      );
      applyBoth();
      event.preventDefault();
    });

    function endDrag() {
      dragging = false;
      root.classList.remove("is-orbiting");
    }
    overlay.addEventListener("pointerup", endDrag);
    overlay.addEventListener("pointercancel", endDrag);

    overlay.addEventListener(
      "wheel",
      function (event) {
        event.preventDefault();
        const factor = Math.exp(event.deltaY * 0.0015);
        state.radius = Math.min(
          RADIUS_MAX,
          Math.max(RADIUS_MIN, state.radius * factor)
        );
        applyBoth();
      },
      { passive: false }
    );
  }

  async function prepareModelPair(root, item, beforeMv, afterMv, loading, onProgress) {
    function setLoading(text) {
      if (!loading) return;
      if (!text) {
        loading.hidden = true;
        loading.textContent = "";
        return;
      }
      loading.hidden = false;
      loading.textContent = text;
    }

    function report(label, received, total) {
      if (typeof onProgress === "function") {
        onProgress(label, received, total);
      } else {
        setLoading(formatProgressLabel(label, received, total));
      }
    }

    if (location.protocol === "file:") {
      setLoading(
        "Cannot load GLB from file:// - run serve.ps1 and open http://127.0.0.1:8770/"
      );
      return false;
    }

    try {
      var progressState = {
        before: { received: 0, total: 0 },
        after: { received: 0, total: 0 },
      };

      function reportPair() {
        var received =
          progressState.before.received + progressState.after.received;
        var total = progressState.before.total + progressState.after.total;
        // If either side has unknown Content-Length, keep total unknown.
        if (!progressState.before.total || !progressState.after.total) {
          total = 0;
        }
        report("Downloading…", received, total);
      }

      reportPair();
      await Promise.all([
        loadModelViewer(beforeMv, item.before, function (received, total) {
          progressState.before = { received: received || 0, total: total || 0 };
          reportPair();
        }),
        loadModelViewer(afterMv, item.after, function (received, total) {
          progressState.after = { received: received || 0, total: total || 0 };
          reportPair();
        }),
      ]);

      if (typeof onProgress === "function") {
        onProgress("Preparing viewer…", 1, 1);
      } else {
        setLoading("Preparing comparison...");
      }
      applyModelOffset(beforeMv, item.beforeOffsetY);
      applyModelOffset(afterMv, item.afterOffsetY);
      setTimeout(function () {
        applyModelOffset(beforeMv, item.beforeOffsetY);
        applyModelOffset(afterMv, item.afterOffsetY);
      }, 400);
      bindSharedOrbit(root, beforeMv, afterMv, item);
      setWipePosition(root, 50);
      if (!item.keepShaded) {
        comparisonViewerPairs.push({ before: beforeMv, after: afterMv });
        setViewerShading(beforeMv, shadingMode);
        setViewerShading(afterMv, shadingMode);
      }
      setLoading(null);
      return true;
    } catch (err) {
      console.error(err);
      setLoading(
        "Failed to load GLB (" +
          ((err && err.message) || String(err)) +
          ")."
      );
      return false;
    }
  }

  function enqueueComparisonLoad(task) {
    Promise.resolve()
      .then(task)
      .catch(function (err) {
        console.error(err);
      });
  }

  function whenVisible(node, callback) {
    if (!("IntersectionObserver" in window)) {
      callback();
      return;
    }
    var done = false;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting || done) return;
          done = true;
          io.disconnect();
          callback();
        });
      },
      { rootMargin: "200px 0px", threshold: 0.01 }
    );
    io.observe(node);
  }

  function renderComparisons() {
    const list = el("comparisons-root");
    if (!list) return;
    list.innerHTML = "";
    const items = cfg.comparisons || [];
    if (!items.length) {
      const section = el("comparisons");
      if (section) section.hidden = true;
      return;
    }

    items.forEach(function (rawItem, index) {
      const item = withAssetUrls(rawItem);
      const useModel = isModelItem(item);
      const figure = document.createElement("figure");
      figure.className = "comparison-card";

      const slider = document.createElement("div");
      slider.className =
        "comparison-slider " + (useModel ? "is-model" : "is-image");
      slider.style.setProperty("--cmp-frame-width", "100%");

      const beforeLabel = document.createElement("span");
      beforeLabel.className = "cmp-label before";
      beforeLabel.textContent = item.beforeLabel || "Source";
      const afterLabel = document.createElement("span");
      afterLabel.className = "cmp-label after";
      afterLabel.textContent = item.afterLabel || "Edited";

      const range = document.createElement("input");
      range.className = "cmp-range";
      range.type = "range";
      range.min = "0";
      range.max = "100";
      range.value = "50";
      range.setAttribute(
        "aria-label",
        "Drag to move or focus and use arrow keys"
      );

      const handle = document.createElement("div");
      handle.className = "cmp-handle";
      handle.setAttribute("aria-hidden", "true");
      handle.innerHTML =
        '<div class="cmp-knob"><svg viewBox="0 0 24 24"><path d="M9 7 L4 12 L9 17"/><path d="M15 7 L20 12 L15 17"/></svg></div>';

      const beforeWrap = document.createElement("div");
      beforeWrap.className = "cmp-before-wrap";

      if (useModel) {
        const afterView = createModelViewer(
          item,
          "cmp-after",
          item.afterLabel || "Edited",
          item.afterScale || item.scale || ""
        );
        const beforeView = createModelViewer(
          item,
          "cmp-before",
          item.beforeLabel || "Source",
          item.beforeScale || item.scale || ""
        );

        const afterLayer = document.createElement("div");
        afterLayer.className = "cmp-layer cmp-layer-after";
        afterLayer.appendChild(afterView);

        const beforeLayer = document.createElement("div");
        beforeLayer.className = "cmp-layer cmp-layer-before";
        const beforeNudge = document.createElement("div");
        beforeNudge.className = "cmp-nudge";
        if (item.beforeNudgeYPx) {
          beforeNudge.style.transform =
            "translateY(" + Number(item.beforeNudgeYPx) + "px)";
        }
        beforeNudge.appendChild(beforeView);
        beforeLayer.appendChild(beforeNudge);

        slider.appendChild(afterLayer);
        slider.appendChild(beforeLayer);

        const loading = document.createElement("div");
        loading.className = "cmp-loading";
        loading.hidden = true;
        slider.appendChild(loading);

        const hint = document.createElement("span");
        hint.className = "cmp-hint";
        hint.textContent = "Drag model to orbit | drag handle to wipe";
        slider.appendChild(beforeLabel);
        slider.appendChild(afterLabel);
        slider.appendChild(handle);
        slider.appendChild(range);
        slider.appendChild(hint);

        if (item.targetImage) {
          const target = document.createElement("div");
          target.className = "cmp-target";
          target.setAttribute("aria-hidden", "true");
          const targetImg = document.createElement("img");
          targetImg.alt = "";
          targetImg.draggable = false;
          targetImg.loading = "lazy";
          targetImg.decoding = "async";
          targetImg.src = item.targetImage;
          const targetLabel = document.createElement("span");
          targetLabel.textContent = item.targetLabel || "Cond";
          target.appendChild(targetImg);
          target.appendChild(targetLabel);
          slider.appendChild(target);
        }

        attachDownloadGate(slider, {
          buttonText: "Download to view",
          preview: previewUrl(item.preview || ""),
          onDownload: function (setProgress) {
            return new Promise(function (resolve, reject) {
              enqueueComparisonLoad(function () {
                return prepareModelPair(
                  slider,
                  item,
                  beforeView,
                  afterView,
                  loading,
                  setProgress
                ).then(function (ok) {
                  if (ok) bindWipeSlider(slider, { isModel: true });
                  resolve(ok);
                }, reject);
              });
            });
          },
        });
      } else {
        const afterImg = document.createElement("img");
        afterImg.className = "cmp-after";
        afterImg.alt = item.afterLabel || "Edited";
        afterImg.draggable = false;
        const beforeImg = document.createElement("img");
        beforeImg.alt = item.beforeLabel || "Source";
        beforeImg.draggable = false;
        beforeWrap.appendChild(beforeImg);
        slider.appendChild(afterImg);
        slider.appendChild(beforeWrap);
        slider.appendChild(beforeLabel);
        slider.appendChild(afterLabel);
        slider.appendChild(handle);
        slider.appendChild(range);

        attachDownloadGate(slider, {
          buttonText: "Download to view",
          onDownload: function (setProgress) {
            setProgress("Downloading images…", 0, 0);
            afterImg.src = item.after;
            beforeImg.src = item.before;
            bindWipeSlider(slider, { isModel: false });
            return Promise.resolve(true);
          },
        });
      }

      const caption = document.createElement("figcaption");
      caption.textContent = item.caption || "";
      figure.appendChild(slider);
      figure.appendChild(caption);
      list.appendChild(figure);
    });
  }

  function renderResults() {
    const grid = el("results-grid");
    if (!grid) return;
    grid.innerHTML = "";
    (cfg.results || []).forEach(function (rawItem) {
      const item = withAssetUrls(rawItem);
      const article = document.createElement("article");
      article.className = "result-item";
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      img.src = item.src;
      img.alt = item.caption || "Result figure";
      img.loading = "lazy";
      const figcaption = document.createElement("figcaption");
      figcaption.textContent = item.caption || "";
      figure.appendChild(img);
      figure.appendChild(figcaption);
      article.appendChild(figure);
      grid.appendChild(article);
    });
  }

  function fallbackCopy(text, done) {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "absolute";
    area.style.left = "-9999px";
    document.body.appendChild(area);
    area.select();
    try {
      document.execCommand("copy");
      done();
    } finally {
      document.body.removeChild(area);
    }
  }

  function renderBibtex() {
    const pre = el("bibtex-text");
    const btn = el("copy-bib");
    if (pre) pre.textContent = cfg.bibtex || "";
    if (btn && pre) {
      btn.addEventListener("click", function () {
        const text = pre.textContent || "";
        const done = function () {
          btn.textContent = "Copied";
          btn.classList.add("copied");
          setTimeout(function () {
            btn.textContent = "Copy";
            btn.classList.remove("copied");
          }, 1600);
        };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done).catch(function () {
            fallbackCopy(text, done);
          });
        } else {
          fallbackCopy(text, done);
        }
      });
    }
  }

  function bindDownloadAll(btnId, rootId) {
    const btn = el(btnId);
    const root = el(rootId);
    if (!btn || !root) return;
    const idleLabel = btn.textContent;
    btn.addEventListener("click", function () {
      const gates = Array.prototype.slice
        .call(root.querySelectorAll(".asset-gate"))
        .filter(function (gate) {
          return gate.getAttribute("data-loaded") !== "true";
        });
      if (!gates.length) {
        btn.textContent = "All downloaded";
        btn.disabled = true;
        return;
      }
      btn.disabled = true;
      const total = gates.length;
      let finished = 0;
      function tick() {
        btn.textContent = "Downloading " + finished + " / " + total + "…";
      }
      tick();
      Promise.all(
        gates.map(function (gate) {
          const start = gate.__startDownload;
          return Promise.resolve(start ? start() : true).then(
            function () {
              finished += 1;
              tick();
            },
            function () {
              finished += 1;
              tick();
            }
          );
        })
      ).then(function () {
        const left = root.querySelectorAll(
          ".asset-gate:not([data-loaded='true'])"
        ).length;
        btn.textContent = left ? idleLabel : "All downloaded";
        btn.disabled = left > 0 ? false : true;
      });
    });
  }

  renderHero();
  renderAuthors();
  renderResourceButtons();
  renderResourceDetail();
  renderAbstract();
  bindShadingToggle();
  renderComparisons();
  bindDownloadAll("cmp-download-all", "comparisons-root");
  renderVideo();
  renderAnimSequences();
  bindDownloadAll("anim-download-all", "anim-sequences-root");
  renderSegmentShowcases();
  bindDownloadAll("seg-download-all", "seg-showcases-root");
  renderTeaserStill();
  renderResults();
  renderBibtex();
})();