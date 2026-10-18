/* =========================================================
   Dokumentasi Mini Soccer 18 Oktober 2026
   Warga Bojong Lio RW 028 — Kota Depok, Jawa Barat
   jQuery + Bootstrap 5 + SweetAlert2
   ========================================================= */
$(function () {
  'use strict';

  const $grid        = $('#galleryGrid');
  const $loadMore    = $('#btnLoadMore');
  const $counter     = $('#galleryCounter');
  const $filter      = $('#galleryFilter');

  const DATA      = (window.GALLERY_DATA || []).slice();
  const PAGE_SIZE = 24;

  let activeCat = 'all';
  let shown     = 0;
  let list      = [];       // daftar foto sesuai filter aktif
  let modalIdx  = 0;        // index foto aktif di modal

  /* ---------------------------------------------------------
     SWEETALERT2 — helper konfigurasi tema
  --------------------------------------------------------- */
  const SWAL_THEME = {
    confirmButtonColor: '#166534',
    cancelButtonColor:  '#6c757d',
    confirmButtonText:  'Ya, Lanjutkan',
    cancelButtonText:   'Batal'
  };

  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3200,
    timerProgressBar: true,
    customClass: { popup: 'shadow' }
  });

  /* ---------------------------------------------------------
     NAVBAR • BACK TO TOP • ACTIVE LINK
  --------------------------------------------------------- */
  const $nav = $('#mainNav');

  $(window).on('scroll', function () {
    $nav.toggleClass('scrolled', $(this).scrollTop() > 40);
    $('#backToTop').toggleClass('show', $(this).scrollTop() > 500);
  });

  $('#backToTop').on('click', function () {
    $('html, body').animate({ scrollTop: 0 }, 500);
  });

  // Tutup menu mobile saat link diklik
  $('.navbar-collapse a').on('click', function () {
    const collapse = bootstrap.Collapse.getInstance($('#navMenu'));
    if (collapse) collapse.hide();
  });

  // Highlight nav link aktif berdasarkan section yang terlihat
  const sections = ['beranda', 'tentang', 'jadwal', 'galeri', 'komentar', 'download'];
  $(window).on('scroll', function () {
    let cur = 'beranda';
    sections.forEach(function (id) {
      const $s = $('#' + id);
      if ($s.length && $(this).scrollTop() >= $s.offset().top - 140) cur = id;
    }.bind(this));
    $('.site-nav .nav-link').each(function () {
      const href = $(this).attr('href');
      $(this).toggleClass('active', href === '#' + cur);
    });
  });

  $('#copyrightYear').text(new Date().getFullYear());

  /* ---------------------------------------------------------
     GALLERY — render, filter, load more
  --------------------------------------------------------- */
  function filtered() {
    return activeCat === 'all' ? DATA : DATA.filter(function (d) { return d.cat === activeCat; });
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function cardHtml(d) {
    return '' +
      '<div class="col">' +
        '<article class="card gallery-card h-100" data-index="' + d.id + '" role="button" tabindex="0" ' +
                 'aria-label="Buka detail foto ' + escapeHtml(d.title) + '">' +
          '<div class="gallery-thumb">' +
            '<img src="' + d.thumb + '" alt="' + escapeHtml(d.caption) + '" loading="lazy" decoding="async" class="img-fluid">' +
            '<span class="thumb-time"><i class="bi bi-clock me-1"></i>' + d.time + '</span>' +
            '<span class="thumb-zoom"><i class="bi bi-arrows-fullscreen"></i></span>' +
          '</div>' +
          '<div class="card-body">' +
            '<p class="g-title">' + escapeHtml(d.catLabel) + '</p>' +
            '<p class="g-sub">' + d.w + ' × ' + d.h + ' px • ' + d.size + ' MB</p>' +
          '</div>' +
        '</article>' +
      '</div>';
  }

  function updateCounter() {
    $counter.text('Menampilkan ' + shown + ' dari ' + list.length + ' foto');
    $loadMore.closest('#loadMoreWrap').toggle(shown < list.length);
  }

  function renderBatch(reset) {
    if (reset) { $grid.empty(); shown = 0; list = filtered(); }
    const next = list.slice(shown, shown + PAGE_SIZE);
    let html = '';
    next.forEach(function (d) { html += cardHtml(d); });
    $grid.append(html);
    shown += next.length;
    updateCounter();
  }

  function refreshCounts() {
    const c = { all: DATA.length };
    DATA.forEach(function (d) { c[d.cat] = (c[d.cat] || 0) + 1; });
    Object.keys(c).forEach(function (k) { $('#cnt-' + k).text(c[k]); });
    $('#statPhotos').text(DATA.length);
    $('#heroPhotoCount').text(DATA.length);
  }

  $loadMore.on('click', function () {
    $(this).prop('disabled', true).html('<span class="spinner-border spinner-border-sm me-2"></span>Memuat...');
    setTimeout(function () {
      renderBatch(false);
      $loadMore.prop('disabled', false).html('<i class="bi bi-arrow-down-circle me-2"></i>Muat Lebih Banyak');
    }, 250);
  });

  $filter.on('click', '.nav-link', function () {
    $filter.find('.nav-link').removeClass('active');
    $(this).addClass('active');
    activeCat = $(this).data('cat');
    renderBatch(true);
  });

  // Link footer → jump ke kategori tertentu
  $('[data-jump-cat]').on('click', function () {
    const cat = $(this).data('jump-cat');
    const $btn = $filter.find('.nav-link[data-cat="' + cat + '"]');
    if ($btn.length) $btn.trigger('click');
  });

  /* ---------------------------------------------------------
     MODAL DETAIL FOTO
  --------------------------------------------------------- */
  const photoModalEl = document.getElementById('photoModal');
  const photoModal   = new bootstrap.Modal(photoModalEl);

  function findPosInList(id) {
    for (let i = 0; i < list.length; i++) if (list[i].id === id) return i;
    return -1;
  }

  function fillModal(i) {
    if (!list.length) return;
    if (i < 0) i = list.length - 1;
    if (i >= list.length) i = 0;
    modalIdx = i;
    const d = list[i];

    $('#pmImage')
      .attr({ src: d.medium, alt: d.caption })
      .css('opacity', .35);

    $('#pmTitle').text(d.title);
    $('#pmCat').text(d.catLabel);
    $('#pmName').text(d.catLabel + ' — ' + d.time + ' WIB');
    $('#pmCaption').text(d.caption);
    $('#pmTime').text(d.time + ' WIB • 18 Oktober 2026');
    $('#pmDim').text(d.w + ' × ' + d.h + ' px (Resolusi Asli)');
    $('#pmSize').text('Ukuran file: ' + d.size + ' MB');
    $('#pmFile').text(d.file);
    $('#pmIndex').text((i + 1) + '/' + list.length);
  }

  // fade-in ketika gambar sudah termuat
  $(document).on('load', '#pmImage', function () { $(this).css('opacity', 1); });

  // Klik kartu galeri → modal (pakai data-index = id asli)
  $grid.on('click', '.gallery-card', function () {
    const pos = findPosInList(parseInt($(this).data('index'), 10));
    if (pos < 0) return;
    fillModal(pos);
    photoModal.show();
  });

  $grid.on('keydown', '.gallery-card', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); $(this).trigger('click'); }
  });

  $('#pmPrev').on('click', function () { fillModal(modalIdx - 1); });
  $('#pmNext').on('click', function () { fillModal(modalIdx + 1); });

  // Navigasi keyboard saat modal terbuka
  $(document).on('keydown', function (e) {
    if (!$(photoModalEl).hasClass('show')) return;
    if (e.key === 'ArrowLeft')  fillModal(modalIdx - 1);
    if (e.key === 'ArrowRight') fillModal(modalIdx + 1);
  });

  // Bersihkan preview saat modal ditutup
  photoModalEl.addEventListener('hidden.bs.modal', function () {
    $('#pmImage').attr('src', '').css('opacity', 1);
  });

  /* ---------------------------------------------------------
     DOWNLOAD — ambil file → blob → simpan
  --------------------------------------------------------- */
  function downloadFile(url, filename, onDone) {
    $.ajax({ url: url, xhrFields: { responseType: 'blob' }, cache: false })
      .done(function (blob) {
        const objectUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(function () { URL.revokeObjectURL(objectUrl); }, 4000);
        if (onDone) onDone(true);
      })
      .fail(function () {
        if (onDone) onDone(false);
      });
  }

  function requestDownload(url, filename) {
    Swal.fire({
      title: 'Unduh Foto?',
      html: 'Foto akan diunduh dalam <strong>resolusi asli (4K)</strong> ke perangkatmu.',
      icon: 'question',
      showCancelButton: true,
      showLoaderOnConfirm: true,
      preConfirm: function () {
        return new Promise(function (resolve) {
          downloadFile(url, filename, function (ok) {
            if (!ok) {
              Swal.showValidationMessage('Gagal mengunduh. Silakan coba lagi.');
            }
            resolve(ok);
          });
        });
      },
      allowOutsideClick: function () { return !Swal.isLoading(); },
      ...SWAL_THEME,
      confirmButtonText: 'Unduh Sekarang'
    }).then(function (res) {
      if (res.isConfirmed && res.value) {
        Toast.fire({ icon: 'success', title: 'Berhasil diunduh!', text: filename });
      }
    });
  }

  $('#pmDownload').on('click', function () {
    const d = list[modalIdx];
    if (d) requestDownload(d.full, d.file);
  });

  // Bagikan (Web Share API + fallback)
  $('#pmShare').on('click', function () {
    const d = list[modalIdx];
    if (!d) return;
    const url   = window.location.href.split('#')[0] + '#' + d.file;
    const title = 'Dokumentasi Mini Soccer 18 Oktober 2026';

    if (navigator.share) {
      navigator.share({ title: title, text: d.title, url: url }).catch(function () {});
    } else {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(url).then(function () {
          Toast.fire({ icon: 'info', title: 'Tautan disalin ke clipboard' });
        });
      } else {
        Toast.fire({ icon: 'info', title: 'Salin tautan manual: ' + url });
      }
    }
  });

  /* ---------------------------------------------------------
     UNDUH SEMUA (batch, berurutan dengan progress)
  --------------------------------------------------------- */
  $('#btnRequestAll').on('click', function () {
    if (!DATA.length) return;
    Swal.fire({
      title: 'Unduh Semua Foto?',
      html: 'Terdapat <strong>' + DATA.length + ' foto</strong> dokumentasi (' +
            DATA.reduce(function (s, d) { return s + d.size; }, 0).toFixed(1) +
            ' MB).<br>Unduhan dilakukan berurutan — mohon pastikan koneksi stabil.',
      icon: 'info',
      showCancelButton: true,
      ...SWAL_THEME,
      confirmButtonText: 'Mulai Unduh'
    }).then(function (res) {
      if (!res.isConfirmed) return;

      Swal.fire({
        title: 'Mengunduh Foto...',
        html: '<div id="dlProgressText" class="small">Menyiapkan...</div>' +
              '<div class="progress mt-2" style="height:10px">' +
              '<div id="dlProgressBar" class="progress-bar progress-bar-striped progress-bar-animated bg-success" ' +
              'style="width:0%"></div></div>',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: function () { Swal.showLoading(); }
      });

      let i = 0;
      function next() {
        if (i >= DATA.length) {
          Swal.fire({
            icon: 'success',
            title: 'Semua Foto Diunduh',
            text: DATA.length + ' file berhasil diunduh. Semoga bermanfaat!',
            ...SWAL_THEME,
            confirmButtonText: 'Selesai'
          });
          return;
        }
        const d = DATA[i];
        $('#dlProgressText').text('Mengunduh ' + (i + 1) + ' / ' + DATA.length + ' — ' + d.file);
        $('#dlProgressBar').css('width', ((i / DATA.length) * 100).toFixed(1) + '%');

        downloadFile(d.medium, 'MiniSoccer-RW028-' + d.file, function (ok) {
          if (!ok) console.warn('Gagal: ' + d.file);
          i++;
          setTimeout(next, 350);
        });
      }
      next();
    });
  });

  /* ---------------------------------------------------------
     REQUEST PAKET LENGKAP (SweetAlert2 form)
  --------------------------------------------------------- */
  $('#btnRequestPaket').on('click', function () {
    Swal.fire({
      title: 'Request Paket Dokumentasi',
      html:
        '<p class="mb-2 small">Isi data berikut, panitia akan menghubungi via WhatsApp.</p>' +
        '<input id="reqName" class="swal2-input" placeholder="Nama lengkap" maxlength="50">' +
        '<input id="reqWa" class="swal2-input" placeholder="Nomor WhatsApp (08xxxx)" maxlength="20">' +
        '<select id="reqType" class="swal2-input">' +
          '<option value="">Pilih jenis paket...</option>' +
          '<option>Semua foto (full resolusi)</option>' +
          '<option>Seleksi foto terbaik</option>' +
          '<option>Album babak pertandingan</option>' +
          '<option>Album foto bersama / penutupan</option>' +
        '</select>',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Kirim Request',
      focusConfirm: false,
      ...SWAL_THEME,
      preConfirm: function () {
        const name = ($('#reqName').value || '').trim();
        const wa   = ($('#reqWa').value || '').trim();
        const type = ($('#reqType').value || '').trim();

        if (name.length < 2) {
          Swal.showValidationMessage('Nama wajib diisi.');
          return false;
        }
        if (!/^0?8[0-9]{7,13}$/.test(wa)) {
          Swal.showValidationMessage('Nomor WhatsApp tidak valid (contoh: 08123456789).');
          return false;
        }
        if (!type) {
          Swal.showValidationMessage('Silakan pilih jenis paket.');
          return false;
        }
        return { name: name, wa: wa, type: type };
      }
    }).then(function (res) {
      if (!res.isConfirmed) return;
      const code = 'MS-' + Math.random().toString(36).slice(2, 7).toUpperCase();
      Swal.fire({
        icon: 'success',
        title: 'Request Terkirim!',
        html: 'Terima kasih <strong>' + escapeHtml(res.value.name) + '</strong>.<br>' +
              'Kode request kamu: <strong class="text-success">' + code + '</strong><br>' +
              '<span class="small">Panitia akan menghubungi via WhatsApp untuk proses pengiriman <em>' +
              escapeHtml(res.value.type) + '</em>.</span>',
        ...SWAL_THEME,
        confirmButtonText: 'Siap, Makasih!'
      });
    });
  });

  /* ---------------------------------------------------------
     KOMENTAR + UPLOAD GAMBAR (localStorage)
  --------------------------------------------------------- */
  const CKEY   = 'ms_comments_rw028';
  const MAX_KB = 5120; // batas file gambar 5 MB

  function loadComments() {
    try { return JSON.parse(localStorage.getItem(CKEY)) || []; }
    catch (e) { return []; }
  }
  function saveComments(listArr) {
    try { localStorage.setItem(CKEY, JSON.stringify(listArr)); return true; }
    catch (e) { return false; }
  }

  function fmtDate(ts) {
    const bulan = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const d = new Date(ts);
    return d.getDate() + ' ' + bulan[d.getMonth()] + ' ' + d.getFullYear() +
           ' • ' + String(d.getHours()).padStart(2, '0') + '.' + String(d.getMinutes()).padStart(2, '0') + ' WIB';
  }

  function escapeAttr(str) { return escapeHtml(str); }

  function renderComments() {
    const items = loadComments().sort(function (a, b) { return b.ts - a.ts; });
    const $box  = $('#commentList');
    $('#commentCount').text(items.length + ' Komentar');

    if (!items.length) {
      $box.html(
        '<div class="empty-comments">' +
          '<i class="bi bi-chat-square-dots fs-1 d-block mb-2 text-success"></i>' +
          'Belum ada komentar.<br>Jadilah warga pertama yang meninggalkan pesan!' +
        '</div>'
      );
      return;
    }

    let html = '';
    items.forEach(function (c) {
      const initial = escapeHtml((c.name || '?').charAt(0).toUpperCase());
      html +=
        '<div class="comment-item' + (c.photo ? ' has-photo' : '') + '">' +
          '<div class="d-flex gap-3">' +
            '<div class="comment-avatar">' + initial + '</div>' +
            '<div class="flex-grow-1 min-w-0">' +
              '<p class="comment-name">' + escapeHtml(c.name) + '</p>' +
              '<span class="comment-time"><i class="bi bi-clock me-1"></i>' + fmtDate(c.ts) + '</span>' +
              '<p class="comment-msg">' + escapeHtml(c.msg) + '</p>' +
              (c.photo
                ? '<img src="' + c.photo + '" class="comment-photo" alt="Foto komentar ' + escapeAttr(c.name) + '">'
                : '') +
            '</div>' +
          '</div>' +
        '</div>';
    });
    $box.html(html);
  }

  // Klik foto komentar → zoom besar
  $('#commentList').on('click', '.comment-photo', function () {
    const src = $(this).attr('src');
    Swal.fire({
      imageUrl: src,
      imageAlt: 'Foto komentar warga',
      showConfirmButton: false,
      showCloseButton: true,
      width: 'auto',
      padding: 0,
      background: 'transparent'
    });
  });

  // --- Upload + preview ---
  let pendingPhoto = null;

  $('#cImage').on('change', function () {
    const file = this.files && this.files[0];
    if (!file) return;

    if (!/^image\//.test(file.type)) {
      $(this).val('');
      Toast.fire({ icon: 'error', title: 'File harus berupa gambar (JPG/PNG/WEBP).' });
      return;
    }
    if (file.size > MAX_KB * 1024) {
      $(this).val('');
      Toast.fire({ icon: 'error', title: 'Ukuran gambar maksimal 5 MB.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      pendingPhoto = e.target.result;
      $('#imgPreview').attr('src', pendingPhoto);
      $('#imgPreviewWrap').removeClass('d-none');
    };
    reader.readAsDataURL(file);
  });

  $('#btnRemoveImg').on('click', function () {
    pendingPhoto = null;
    $('#cImage').val('');
    $('#imgPreview').attr('src', '');
    $('#imgPreviewWrap').addClass('d-none');
  });

  $('#cMsg').on('input', function () { $('#msgCount').text($(this).val().length); });

  // --- Submit komentar ---
  $('#commentForm').on('submit', function (e) {
    e.preventDefault();

    const name = $('#cName').val().trim();
    const msg  = $('#cMsg').val().trim();

    if (name.length < 2 || msg.length < 5) {
      this.classList.add('was-validated');
      Toast.fire({ icon: 'warning', title: 'Lengkapi nama & komentar terlebih dahulu.' });
      return;
    }

    Swal.fire({
      title: 'Kirim Komentar?',
      html: 'Komentar dari <strong>' + escapeHtml(name) + '</strong>' +
            (pendingPhoto ? ' beserta <strong>1 foto</strong>' : '') + ' akan ditampilkan di halaman ini.',
      icon: 'question',
      showCancelButton: true,
      ...SWAL_THEME,
      confirmButtonText: 'Kirim'
    }).then(function (res) {
      if (!res.isConfirmed) return;

      const items = loadComments();
      items.push({
        name: name,
        msg: msg,
        photo: pendingPhoto || null,
        ts: Date.now()
      });

      if (!saveComments(items)) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Menyimpan',
          text: 'Penyimpanan browser penuh. Coba hapus beberapa foto komentar terdahulu atau kurangi ukuran gambar.',
          ...SWAL_THEME
        });
        return;
      }

      // reset form
      $('#commentForm')[0].reset();
      $('#commentForm').removeClass('was-validated');
      $('#msgCount').text('0');
      $('#btnRemoveImg').trigger('click');

      renderComments();

      Swal.fire({
        icon: 'success',
        title: 'Komentar Terkirim!',
        html: 'Terima kasih ya, <strong>' + escapeHtml(name) + '</strong>!<br>Komentarmu sudah tampil di halaman.',
        ...SWAL_THEME,
        confirmButtonText: 'Sip!'
      });

      // scroll halus ke daftar komentar
      $('html, body').animate({ scrollTop: $('#commentList').offset().top - 120 }, 600);
    });
  });

  /* ---------------------------------------------------------
     INIT
  --------------------------------------------------------- */
  refreshCounts();
  renderBatch(true);
  renderComments();
});
