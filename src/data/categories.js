import social from '../../files/category-ijtimaiya.html?raw';
import religious from '../../files/category-diniya.html?raw';
import scientific from '../../files/category-ilmiya.html?raw';
import intellectual from '../../files/category-fikriya.html?raw';
import economic from '../../files/category-madiya.html?raw';
import nonArab from '../../files/category-ghayr-arab.html?raw';

const sources = [
  ['ijtimaiya', 'الثغور الاجتماعية', social],
  ['diniya', 'الثغور الدينية التعبدية', religious],
  ['ilmiya', 'الثغور العلمية', scientific],
  ['fikriya', 'الثغور الفكرية', intellectual],
  ['madiya', 'الثغور المادية والاقتصادية', economic],
  ['ghayr-arab', 'ثغور غير العرب من المسلمين', nonArab]
];

function getTopics(html) {
  const document = new DOMParser().parseFromString(html, 'text/html');
  return [...document.querySelectorAll('.leaf-list > li:not(.has-kids)')].map((item) => {
    const planned = item.querySelector('.planned-tag');
    const title = (planned?.childNodes[0]?.textContent || item.textContent).trim();
    const status = title === 'انتشار المواد الإباحية' ? 'in-progress' : planned ? 'planned' : 'observed';
    return { title, status };
  }).filter(({ title }) => title);
}

export const categories = sources.map(([slug, title, source]) => ({ slug, title, topics: getTopics(source) }));
export const allTopics = categories.flatMap((category) => category.topics.map((topic) => ({ ...topic, category })));
