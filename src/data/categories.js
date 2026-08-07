import social from '../../files/category-ijtimaiya.html?raw';
import religious from '../../files/category-diniya.html?raw';
import scientific from '../../files/category-ilmiya.html?raw';
import intellectual from '../../files/category-fikriya.html?raw';
import economic from '../../files/category-madiya.html?raw';
import nonArab from '../../files/category-ghayr-arab.html?raw';
import homeHtml from '../../files/index.html?raw';

const sources = [
  ['ijtimaiya', 'الاجتماعية', social],
  ['diniya', 'الدينية التعبدية', religious],
  ['ilmiya', 'العلمية', scientific],
  ['fikriya', 'الفكرية', intellectual],
  ['madiya', 'المادية والاقتصادية', economic],
  ['ghayr-arab', 'غير العرب من المسلمين', nonArab]
];

function childrenOf(el, selector) {
  return [...el.children].filter((child) => child.matches?.(selector));
}

function firstChild(el, selector) {
  return childrenOf(el, selector)[0] || null;
}

function statusFor(title, planned) {
  if (title === 'انتشار المواد الإباحية') return 'in-progress';
  if (planned) return 'planned';
  return 'observed';
}

function articleHref(title, status) {
  if (status === 'in-progress') return '/article/pornography';
  return null;
}

function parseLeaf(li) {
  const plannedEl = firstChild(li, '.planned-tag') || li.querySelector('.planned-tag');
  const planned = Boolean(plannedEl) && plannedEl.parentElement === li;
  let title = '';
  let externalHref = null;
  let externalLabel = null;

  if (planned && plannedEl) {
    title = [...plannedEl.childNodes]
      .filter((node) => node.nodeType === Node.TEXT_NODE)
      .map((node) => node.textContent)
      .join('')
      .trim();
    if (!title) title = plannedEl.textContent.trim();
  } else {
    const clone = li.cloneNode(true);
    clone.querySelectorAll('.status, .topic-link').forEach((el) => el.remove());
    const ext = clone.querySelector('a.ext-link');
    externalHref = ext?.getAttribute('href') || null;
    externalLabel = ext?.textContent?.trim() || null;
    if (ext) ext.remove();
    title = clone.textContent.replace(/\s+/g, ' ').trim();
  }

  const status = statusFor(title, planned);
  return {
    type: 'leaf',
    title,
    status,
    articleHref: articleHref(title, status),
    externalHref,
    externalLabel
  };
}

function parseListItems(list) {
  return childrenOf(list, 'li').map((li) => {
    if (li.classList.contains('has-kids')) {
      const details = firstChild(li, 'details') || li.querySelector('details');
      const summary = details ? (firstChild(details, 'summary.sub-title') || details.querySelector('summary.sub-title')) : null;
      const nested = details
        ? (firstChild(details, 'ul.leaf-list.nested') || firstChild(details, 'ul.nested') || details.querySelector('ul.leaf-list.nested, ul.nested'))
        : null;
      return {
        type: 'subgroup',
        title: (summary?.textContent || '').trim(),
        children: nested ? parseListItems(nested) : []
      };
    }
    return parseLeaf(li);
  });
}

function parseOutline(document) {
  const outline = document.querySelector('.outline');
  if (!outline) return { layout: 'groups', groups: [], flatItems: [], sections: [] };

  const flat = firstChild(outline, 'ul.flat-grid');
  if (flat) {
    const flatItems = childrenOf(flat, 'li').map((li) => {
      const title = li.textContent.replace(/\s+/g, ' ').trim();
      const status = statusFor(title, false);
      return {
        type: 'leaf',
        title,
        status,
        articleHref: articleHref(title, status),
        externalHref: null,
        externalLabel: null
      };
    });
    return { layout: 'flat', groups: [], flatItems, sections: [] };
  }

  const sections = [];
  const groups = [];
  [...outline.children].forEach((child) => {
    if (child.matches?.('.divider-label')) {
      sections.push({ type: 'divider', title: child.textContent.trim() });
      return;
    }
    if (child.matches?.('details.group-card')) {
      const summary = firstChild(child, 'summary.g-title') || child.querySelector('summary.g-title');
      const titleSpan = summary ? firstChild(summary, 'span') : null;
      const title = (titleSpan?.textContent || summary?.textContent || '').trim();
      const list = firstChild(child, 'ul.leaf-list') || child.querySelector('ul.leaf-list');
      const group = {
        type: 'group',
        title,
        items: list ? parseListItems(list) : []
      };
      groups.push(group);
      sections.push(group);
    }
  });

  return { layout: 'groups', groups, flatItems: [], sections };
}

function collectLeaves(nodes) {
  const leaves = [];
  for (const node of nodes) {
    if (node.type === 'leaf') leaves.push(node);
    else if (node.children) leaves.push(...collectLeaves(node.children));
    else if (node.items) leaves.push(...collectLeaves(node.items));
  }
  return leaves;
}

function parseHomeCards(html) {
  const document = new DOMParser().parseFromString(html, 'text/html');
  const cards = {};
  document.querySelectorAll('a.arch-card').forEach((card) => {
    const href = card.getAttribute('href') || '';
    const slug = href.replace(/^category-/, '').replace(/\.html$/, '');
    const blurb = card.querySelector('.arch-body p')?.textContent?.trim() || '';
    const icon = card.querySelector('.arch-top')?.innerHTML?.trim() || '';
    cards[slug] = { blurb, icon };
  });
  return cards;
}

const homeCards = parseHomeCards(homeHtml);

function parseCategory([slug, shortNav, html]) {
  const document = new DOMParser().parseFromString(html, 'text/html');
  const title = document.querySelector('h1')?.textContent?.trim() || shortNav;
  const intro = document.querySelector('.intro')?.textContent?.trim() || '';
  const icon = document.querySelector('.cat-icon')?.innerHTML?.trim() || homeCards[slug]?.icon || '';
  const { layout, groups, flatItems, sections } = parseOutline(document);
  const leaves = layout === 'flat' ? flatItems : collectLeaves(groups);
  return {
    slug,
    shortNav,
    title,
    intro,
    blurb: homeCards[slug]?.blurb || intro,
    icon: homeCards[slug]?.icon || icon,
    catIcon: icon,
    layout,
    groups,
    sections: sections || groups,
    flatItems,
    topics: leaves,
    count: leaves.length,
    plannedCount: leaves.filter((leaf) => leaf.status === 'planned' || leaf.status === 'in-progress').length
  };
}

export const categories = sources.map(parseCategory);
export const allTopics = categories.flatMap((category) =>
  category.topics.map((topic) => ({ ...topic, category }))
);
export const stats = {
  categories: categories.length,
  items: allTopics.length,
  planned: allTopics.filter((topic) => topic.status === 'planned' || topic.status === 'in-progress').length
};

export const statusLabels = {
  observed: 'مرصود',
  planned: 'قيد الإعداد',
  'in-progress': 'تحت العمل'
};
