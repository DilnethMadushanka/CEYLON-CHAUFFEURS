/**
 * Ceylon Chauffeurs Admin - image uploads & "Website images" page
 *
 * Upload flow: the browser resizes and compresses the photo (WebP/JPEG), then
 *   1. tries Firebase Storage (best: CDN-cached, needs the Blaze plan for new projects)
 *   2. otherwise stores it in Firestore "media/{id}" (free Spark plan, max ~700 KB per image)
 * The result is either an https:// URL or "media:{id}", which the website resolves.
 */
(function () {
  'use strict';
  var App = window.CCApp, UI = window.CCUI, Store = window.CCStore;
  var icon = UI.icon, esc = UI.esc;

  var BASE = 'Photorealistic, natural colour grading, shot on a full-frame camera, sharp focus, high dynamic range, 16:9 landscape, no text, no logos, no watermark, no number plates';

  var SLOTS = [
    { key: 'hero.jpg', title: 'Hero / main banner', used: 'Home page top, Fleet page top, social share image', prompt: 'Wide cinematic travel photograph of a black luxury SUV driving along a winding road through emerald tea plantations in the Nuwara Eliya hill country of Sri Lanka at golden hour. Misty layered mountain ridges in the background, soft warm sun rays, low fog in the valleys, neat rows of tea bushes in the foreground, the road curving from the bottom left into the distance. ' + BASE },
    { key: 'sigiriya.jpg', title: 'Sigiriya', used: 'Tour packages, home page', prompt: 'Aerial drone photograph of Sigiriya Lion Rock fortress in Sri Lanka at sunrise, the massive flat-topped rock rising out of dense green jungle, ancient water gardens and pathways visible at its base, a winding river and small lakes, soft orange sky with light clouds, gentle morning mist over the forest canopy. ' + BASE },
    { key: 'kandy.jpg', title: 'Kandy', used: 'Tour packages (Cultural Highlights)', prompt: 'Photograph of the Temple of the Sacred Tooth Relic in Kandy, Sri Lanka, seen across Kandy Lake in the late afternoon, golden roof and white walls reflected in calm water, lush green hills and palm trees behind, a white stone lakeside wall in the foreground, warm golden light, peaceful atmosphere. ' + BASE },
    { key: 'ella.jpg', title: 'Ella / Nine Arches Bridge', used: 'Tour packages (Heritage & Hill Country)', prompt: 'Photograph of the Nine Arches Bridge in Ella, Sri Lanka, with a blue passenger train crossing it, surrounded by steep terraced tea plantations and dense jungle, a few tea pickers in colourful saris working in the foreground, morning mist rising from the valley, soft natural daylight. ' + BASE },
    { key: 'galle.jpg', title: 'Galle Fort', used: 'Home page, Fleet page, tour packages', prompt: 'Photograph of Galle Fort in southern Sri Lanka on a bright sunny day, old Dutch stone ramparts in the foreground, the white Galle lighthouse and colonial buildings among coconut palms, turquoise Indian Ocean with gentle waves breaking on the rocks, blue sky with fluffy white clouds. ' + BASE },
    { key: 'beach.jpg', title: 'Beach', used: 'Tour packages (Beach & Coastal)', prompt: 'Photograph of a quiet golden-sand beach in Mirissa, Sri Lanka, at sunset, tall coconut palms leaning over the beach, gentle turquoise waves, a small rocky island with palm trees in the distance, pink and orange sky reflecting on the wet sand, no people, tranquil luxury travel mood. ' + BASE },
    { key: 'wildlife.jpg', title: 'Wildlife / safari', used: 'Reviews page', prompt: 'Wildlife photograph of a herd of wild Asian elephants with calves walking along the grassy shore of a lake in Minneriya National Park, Sri Lanka, at sunset, dramatic orange and purple sky, distant forest and mountains, a safari jeep far in the background, telephoto lens look, natural documentary style. ' + BASE },
    { key: 'safari-minneriya.jpg', title: 'Safari: Minneriya elephants', used: '4-Day Safari Express package', prompt: 'Wildlife photograph of a large herd of wild Asian elephants with calves crossing open grassland at Minneriya National Park, Sri Lanka, a dusty safari jeep with tourists at a respectful distance, low golden late-afternoon sun, dust haze backlit, reservoir and forest edge behind, eye-level from another jeep. ' + BASE },
    { key: 'safari-yala.jpg', title: 'Safari: Yala leopard', used: '7-Day Wild & National Parks Safari package, home page', prompt: 'Wildlife photograph of a wild Sri Lankan leopard resting on a large granite rock outcrop in Yala National Park, looking calmly to the side, dry scrub jungle and thorny trees behind, soft early-morning light, shallow depth of field, long telephoto lens from a safari jeep. ' + BASE },
    { key: 'safari-wilpattu.jpg', title: 'Safari: Wilpattu sloth bear', used: '10-Day Ultimate Wildlife Expedition package', prompt: 'Wildlife photograph of a sloth bear walking along the edge of a natural lake (villu) in Wilpattu National Park, Sri Lanka, reflections in still water, spotted deer grazing behind and a painted stork in the shallows, dense dry-zone forest, soft overcast morning light. ' + BASE },
    { key: 'sedan.jpg', title: 'Executive sedan', used: 'Fleet page, home page fleet cards, booking form', prompt: 'Photograph of a clean white Toyota Prius hybrid sedan parked in the gravel driveway of a colonial heritage villa hotel in Sri Lanka, a smiling Sri Lankan chauffeur in a dark suit and tie standing beside the open rear door, tropical garden with palm trees, bright soft daylight, professional car-rental advertising style. ' + BASE, real: true },
    { key: 'van.jpg', title: 'Luxury van', used: 'Fleet page, home page fleet cards, booking form', prompt: 'Photograph of a silver Toyota HiAce KDH high-roof passenger van parked at the entrance of a luxury tropical resort in Sri Lanka, a Sri Lankan chauffeur in a dark suit standing beside it with hands clasped, flowering bougainvillea and palm trees, warm late-afternoon light, professional tour-company advertising style. ' + BASE, real: true },
    { key: 'bus.jpg', title: 'Luxury coach / bus', used: 'Fleet page, home page fleet cards, booking form', prompt: 'Photograph of a white Toyota Coaster luxury mini coach parked on a mountain road in the Sri Lankan hill country, a Sri Lankan driver in a dark uniform standing at the open door, tea plantations and misty peaks behind, soft early-morning light, professional tour-company advertising style. ' + BASE, real: true },
    { key: 'logo.png', title: 'Logo (full)', used: 'Admin login, vouchers, website header', prompt: '', square: true },
    { key: 'logo-mark.png', title: 'Logo mark (icon)', used: 'Website header and footer, admin', prompt: '', square: true }
  ];
  App.IMAGE_SLOTS = SLOTS;

  /* ---------------- Compression ---------------- */
  function loadImage(file) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = function () { reject(new Error('This file is not an image the browser can read. Use JPG, PNG or WebP.')); };
      img.src = url;
    });
  }

  function toBlob(canvas, type, q) {
    return new Promise(function (resolve) { canvas.toBlob(resolve, type, q); });
  }

  /** Resize to maxW and compress until under maxBytes. Keeps PNG for transparent logos. */
  function compress(file, opts) {
    opts = opts || {};
    var maxW = opts.maxW || 1920;
    var maxBytes = opts.maxBytes || 900 * 1024;
    return loadImage(file).then(function (img) {
      var keepPng = opts.png && /png/.test(file.type);
      var widths = [maxW, Math.round(maxW * 0.8), Math.round(maxW * 0.65), 1000, 800];
      var qualities = [0.85, 0.78, 0.7, 0.6];
      var type = keepPng ? 'image/png' : (supportsWebp() ? 'image/webp' : 'image/jpeg');
      var attempts = [];
      widths.forEach(function (w) { (keepPng ? [1] : qualities).forEach(function (q) { attempts.push([w, q]); }); });
      var i = 0;
      function next() {
        var a = attempts[i++];
        var w = Math.min(a[0], img.naturalWidth);
        var h = Math.round(img.naturalHeight * (w / img.naturalWidth));
        var c = document.createElement('canvas');
        c.width = w; c.height = h;
        var ctx = c.getContext('2d');
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, w, h);
        return toBlob(c, type, a[1]).then(function (blob) {
          if (blob && blob.size <= maxBytes) return { blob: blob, width: w, height: h, type: type };
          if (i >= attempts.length) throw new Error('Image is too large even after compressing. Try a smaller photo.');
          return next();
        });
      }
      return next();
    });
  }

  var _webp = null;
  function supportsWebp() {
    if (_webp == null) {
      var c = document.createElement('canvas'); c.width = c.height = 1;
      _webp = c.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
    return _webp;
  }

  function blobToDataUrl(blob) {
    return new Promise(function (resolve) { var r = new FileReader(); r.onload = function () { resolve(r.result); }; r.readAsDataURL(blob); });
  }

  /**
   * Upload one image file. Returns Promise<string> (https URL or "media:{id}").
   * onStatus(text) reports progress.
   */
  function upload(file, opts) {
    opts = opts || {};
    var status = opts.onStatus || function () {};
    status('Optimising…');
    return compress(file, { maxW: opts.square ? 1024 : 1920, maxBytes: 1500 * 1024, png: opts.square })
      .then(function (big) {
        status('Uploading…');
        var name = (opts.slot || 'image').replace(/\.\w+$/, '') + '-' + Date.now().toString(36) + (big.type === 'image/png' ? '.png' : big.type === 'image/webp' ? '.webp' : '.jpg');
        return Store.uploadToStorage(big.blob, 'site-images/' + name, big.type)
          .catch(function (err) {
            // No Storage bucket (Spark plan) or not allowed: fall back to Firestore.
            console.info('Storage unavailable, saving image in Firestore instead.', err && (err.code || err.message));
            status('Saving…');
            return compress(file, { maxW: opts.square ? 800 : 1600, maxBytes: 680 * 1024, png: opts.square }).then(function (small) {
              return blobToDataUrl(small.blob).then(function (data) {
                return Store.save('media', null, { data: data, width: small.width, height: small.height, bytes: small.blob.size, name: file.name.slice(0, 120), slot: opts.slot || '', createdAt: new Date().toISOString() });
              });
            }).then(function (id) { return 'media:' + id; });
          });
      });
  }

  /** Resolve a stored image value to something an <img src> can show (admin side). */
  function resolve(v) {
    if (!v) return '';
    if (String(v).indexOf('media:') === 0) {
      var m = (App.data.media || []).filter(function (x) { return x.id === v.slice(6); })[0];
      return m ? m.data : '';
    }
    return UI.resolveImg(v);
  }

  window.CCMedia = { upload: upload, resolve: resolve, compress: compress };

  // Let the generic image field resolve "media:" values and offer an upload button.
  var baseResolve = UI.resolveImg;
  UI.resolveImg = function (v) {
    if (v && String(v).indexOf('media:') === 0) {
      var m = (App.data.media || []).filter(function (x) { return x.id === v.slice(6); })[0];
      return m ? m.data : '';
    }
    return baseResolve(v);
  };

  /* ---------------- "Website images" page ---------------- */
  function overrides() {
    var doc = App.data.settings.filter(function (s) { return s.id === 'images'; })[0] || {};
    return doc.map || {};
  }

  App.views.images = function (host) {
    var busy = {};
    host.innerHTML = App.pageHead('Website content', 'Website images', 'Replace any photo on the website. Upload a new image and it goes live everywhere that photo is used. Each card also has a ready-made AI prompt to create a realistic replacement.',
      '<a class="btn btn-ghost" href="#/images" data-copy-all>' + icon('copy') + '<span>Copy all prompts</span></a>') +
      '<div class="banner banner--info">' + icon('info') + '<div><b>Tips for best results</b><p>Use landscape photos (16:9, at least 1600 px wide). Images are resized and compressed automatically. For the fleet photos, real pictures of your own vehicles and drivers build more trust than AI images.</p></div></div>' +
      '<div class="media-grid" data-grid></div>';

    host.querySelector('[data-copy-all]').addEventListener('click', function (e) {
      e.preventDefault();
      var text = SLOTS.filter(function (s) { return s.prompt; }).map(function (s) { return s.title + ' (' + s.key + ')\n' + s.prompt; }).join('\n\n');
      copy(text, 'All prompts copied');
    });

    var grid = host.querySelector('[data-grid]');
    grid.addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]'); if (!b) return;
      var slot = SLOTS.filter(function (s) { return s.key === b.getAttribute('data-key'); })[0];
      var act = b.getAttribute('data-act');
      if (act === 'prompt') copy(slot.prompt, 'Prompt copied. Paste it into ChatGPT, Gemini or Midjourney');
      if (act === 'restore') {
        UI.confirm({ title: 'Restore the original photo?', text: 'The website will show the original ' + esc(slot.title) + ' image again.', ok: 'Restore' }).then(function (ok) {
          if (!ok) return;
          var map = Object.assign({}, overrides()); delete map[slot.key];
          App.save('settings', 'images', { map: map }, 'Original image restored');
        });
      }
    });
    grid.addEventListener('change', function (e) {
      var input = e.target.closest('input[type=file]'); if (!input || !input.files[0]) return;
      var key = input.getAttribute('data-key');
      var slot = SLOTS.filter(function (s) { return s.key === key; })[0];
      var card = input.closest('.media-card');
      busy[key] = true;
      card.classList.add('is-busy');
      var label = card.querySelector('[data-status]');
      upload(input.files[0], { slot: key, square: slot.square, onStatus: function (t) { label.textContent = t; } })
        .then(function (url) {
          var map = Object.assign({}, overrides()); map[key] = url;
          return App.save('settings', 'images', { map: map }, slot.title + ' updated on the website');
        })
        .catch(function (err) { UI.toast(err.message || App.friendlyError(err), 'error'); })
        .then(function () { busy[key] = false; input.value = ''; update(); });
    });

    function update() {
      var map = overrides();
      grid.innerHTML = SLOTS.map(function (s) {
        var cur = map[s.key];
        var src = cur ? resolve(cur) : '../assets/images/' + s.key;
        return '<article class="media-card' + (busy[s.key] ? ' is-busy' : '') + (s.square ? ' media-card--square' : '') + '">' +
          '<div class="media-thumb"><img src="' + esc(src) + '" alt="" loading="lazy">' + (cur ? '<span class="media-badge">' + icon('check') + 'Custom</span>' : '') + '<span class="media-busy"><span class="spin"></span><b data-status>Uploading…</b></span></div>' +
          '<div class="media-body"><h3>' + esc(s.title) + '</h3><p class="muted">' + esc(s.used) + '</p>' +
          (s.prompt ? '<details class="prompt"><summary>' + icon('image') + 'AI prompt</summary><p>' + esc(s.prompt) + '</p></details>' : '') +
          '<div class="media-actions"><label class="btn btn-primary btn-sm">' + icon('download', 'flip') + '<span>Replace</span><input type="file" accept="image/*" data-key="' + s.key + '" hidden></label>' +
          (s.prompt ? '<button class="btn btn-ghost btn-sm" data-act="prompt" data-key="' + s.key + '">' + icon('copy') + '<span>Copy prompt</span></button>' : '') +
          (cur ? '<button class="icon-btn" data-act="restore" data-key="' + s.key + '" title="Restore original" aria-label="Restore original">' + icon('refresh') + '</button>' : '') +
          '</div></div></article>';
      }).join('');
    }

    function copy(text, msg) {
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(function () { UI.toast(msg); }, function () { UI.toast('Could not copy. Long-press the prompt text to copy it.', 'error'); });
    }

    update();
    return { update: update };
  };
})();
