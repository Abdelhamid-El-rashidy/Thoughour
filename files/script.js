document.addEventListener('DOMContentLoaded', function () {
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('open');
      var expanded = links.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); });
    });
  }

  document.querySelectorAll('.outline').forEach(function (outline) {
    var tools = document.createElement('div');
    tools.className = 'directory-tools';
    tools.innerHTML = '<input type="search" aria-label="البحث في الثغور" placeholder="ابحث داخل هذا الباب…"><select aria-label="تصفية حالة الموضوع"><option value="all">كل الحالات</option><option value="in-progress">تحت العمل</option><option value="planned">قيد الإعداد</option><option value="observed">مرصود</option></select><div class="results" aria-live="polite"></div>';
    outline.parentNode.insertBefore(tools, outline);
    var search = tools.querySelector('input');
    var filter = tools.querySelector('select');
    var results = tools.querySelector('.results');
    var leaves = Array.prototype.slice.call(outline.querySelectorAll('.leaf-list > li:not(.has-kids)'));

    leaves.forEach(function (item) {
      var planned = item.querySelector('.planned-tag');
      var text = planned && planned.childNodes[0] && planned.childNodes[0].textContent.trim();
      var status = text === 'انتشار المواد الإباحية' ? 'in-progress' : (planned ? 'planned' : 'observed');
      var labels = { 'in-progress': 'تحت العمل', planned: 'قيد الإعداد', observed: 'مرصود' };
      var badge = document.createElement('span');
      badge.className = 'status status--' + status;
      badge.textContent = labels[status];
      item.appendChild(badge);
      item.dataset.status = status;
      if (planned) {
        if (text) {
          var link = document.createElement('a');
          link.className = 'topic-link';
          link.href = status === 'in-progress' ? 'article-pornography.html' : ('article-template.html?topic=' + encodeURIComponent(text));
          link.textContent = 'عرض صفحة الموضوع';
          item.appendChild(link);
        }
      }
    });

    function applyFilters() {
      var term = search.value.trim().toLowerCase();
      var state = filter.value;
      var visible = 0;
      leaves.forEach(function (item) {
        var matchesTerm = !term || item.textContent.toLowerCase().indexOf(term) !== -1;
        var matchesState = state === 'all' || item.dataset.status === state;
        item.hidden = !(matchesTerm && matchesState);
        if (!item.hidden) { visible += 1; }
      });
      outline.querySelectorAll('.group-card').forEach(function (card) {
        card.hidden = !!card.querySelector('.leaf-list > li:not([hidden])') === false;
        if (!card.hidden && (term || state !== 'all')) { card.open = true; }
      });
      results.textContent = 'عرض ' + visible + ' بندًا' + (term ? ' مطابقًا لعبارة «' + search.value.trim() + '»' : '') + '.';
    }
    search.addEventListener('input', applyFilters);
    filter.addEventListener('change', applyFilters);
    applyFilters();
  });

  var itemTotal = document.querySelectorAll('.outline .leaf-list > li:not(.has-kids)').length;
  var plannedTotal = document.querySelectorAll('.outline .planned-tag').length;
  if (itemTotal) {
    document.querySelectorAll('[data-stat="items"]').forEach(function (el) { el.textContent = itemTotal; });
    document.querySelectorAll('[data-stat="planned"]').forEach(function (el) { el.textContent = plannedTotal; });
  }

  var form = document.querySelector('[data-contribution-form]');
  if (form) form.addEventListener('submit', function (event) {
    event.preventDefault();
    var data = new FormData(form);
    var subject = 'مساهمة جديدة في مبادرة الثغور: ' + data.get('title');
    var attachment = data.get('attachment');
    var attachmentNote = attachment && attachment.name
      ? '\n\nملف مرفق: ' + attachment.name + '\nيرجى إرفاق هذا الملف يدويًا قبل إرسال الرسالة.'
      : '';
    var body = 'الباب: ' + data.get('category') + '\n\nعنوان الإضافة: ' + data.get('title') + '\n\nالتفاصيل والمصادر:\n' + data.get('details') + '\n\nاسم المرسل (اختياري): ' + data.get('name') + attachmentNote;
    window.location.href = 'mailto:contact@example.com?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
  });
});
