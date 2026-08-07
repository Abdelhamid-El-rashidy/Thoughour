import { useEffect, useMemo, useState } from 'react';
import { allTopics, categories } from './data/categories.js';

const statusLabels = { observed: 'مرصود', planned: 'قيد الإعداد', 'in-progress': 'تحت العمل' };

function useRoute() {
  const [route, setRoute] = useState(() => location.hash.slice(1) || '/');
  useEffect(() => { const update = () => setRoute(location.hash.slice(1) || '/'); addEventListener('hashchange', update); return () => removeEventListener('hashchange', update); }, []);
  return route;
}

function Link({ to, children, className = '' }) { return <a className={className} href={`#${to}`}>{children}</a>; }

function Header() {
  const [open, setOpen] = useState(false);
  return <header className="site-header"><div className="container nav-inner">
    <Link to="/" className="brand"><span>الثغور<br /><small>حصر ثغور الأمة</small></span></Link>
    <button className="nav-toggle" aria-label="القائمة" aria-controls="site-navigation" aria-expanded={open} onClick={() => setOpen(!open)}>☰</button>
    <nav id="site-navigation" className={`nav-links ${open ? 'open' : ''}`} aria-label="التنقل الرئيسي">
      <Link to="/topics">دليل الثغور</Link><Link to="/methodology">المنهجية</Link><Link to="/statement">بيان المبادرة</Link><Link to="/contribute">ساهم</Link>
    </nav>
  </div></header>;
}

function Footer() { return <footer className="site-footer"><div className="container footer-inner"><div><div className="brand"><span>الثغور</span></div><div className="fine">مبادرة شبابية مستقلة لحصر ثغور الأمة المعاصرة — والله من وراء القصد</div></div><div className="fine"><Link to="/methodology">المنهجية والمصادر</Link> · <Link to="/statement">بيان المبادرة</Link></div></div></footer>; }

function PageHero({ eyebrow, title, children }) { return <section className="page-hero"><div className="container"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{children && <p>{children}</p>}</div></section>; }

function Home() { return <>
  <section className="hero"><div className="container hero-inner"><span className="eyebrow">مبادرة لحصر ثغور الأمة</span><h1>الثغور</h1><p className="tagline">ثغور الأمة اليوم لم تعد عند الحدود وحدها</p><p className="lede">مبادرة شبابية تحاول حصر الثغرات التي تنخر جسد الأمة الإسلامية في زماننا هذا على أصعدتها المختلفة، خطوة أولى على طريق الإصلاح.</p><div className="hero-cta"><Link className="btn btn-solid" to="/topics">تصفح الثغور</Link><Link className="btn btn-ghost" to="/statement">عن المبادرة</Link></div></div></section>
  <section className="section"><div className="container"><div className="section-head"><span className="eyebrow">ديوان الثغور</span><h2>ستة أبواب، وتحت كل باب ثغرات</h2><p>تصفح الأبواب أو استخدم الدليل الشامل للبحث والتصفية.</p></div><div className="frontiers-grid">{categories.map((category) => <Link key={category.slug} to={`/category/${category.slug}`} className="arch-card"><div className="arch-top"><span>◈</span></div><div className="arch-body"><h3>{category.title}</h3><p>موضوعات مرصودة تحتاج إلى بحث وتوثيق وعمل.</p><div className="arch-meta"><span>{category.topics.length} بندًا</span></div></div></Link>)}</div></div></section>
  <section className="stats-strip"><div className="container stats-grid"><div><strong>{categories.length}</strong><span>أبواب رئيسية</span></div><div><strong>{allTopics.length}</strong><span>بندًا مرصودًا</span></div><div><strong>{allTopics.filter((topic) => topic.status === 'planned').length}</strong><span>موضوعًا قيد الإعداد</span></div></div></section>
  </>; }

function TopicFilters({ topics, showCategory = false }) {
  const [term, setTerm] = useState(''); const [status, setStatus] = useState('all'); const [category, setCategory] = useState('all');
  const matches = useMemo(() => topics.filter((topic) => (!term || topic.title.toLowerCase().includes(term.toLowerCase())) && (status === 'all' || topic.status === status) && (!showCategory || category === 'all' || topic.category.slug === category)), [topics, term, status, category, showCategory]);
  return <><div className="directory-tools directory-tools--global"><label className="sr-only" htmlFor="topic-search">البحث</label><input id="topic-search" type="search" value={term} onChange={(event) => setTerm(event.target.value)} placeholder="ابحث في الثغور…" />{showCategory && <select aria-label="الباب" value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">كل الأبواب</option>{categories.map((item) => <option value={item.slug} key={item.slug}>{item.title}</option>)}</select>}<select aria-label="الحالة" value={status} onChange={(event) => setStatus(event.target.value)}><option value="all">كل الحالات</option>{Object.entries(statusLabels).map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select><div className="results" aria-live="polite">عرض {matches.length} موضوعًا{term ? ` مطابقًا لعبارة «${term}»` : ''}.</div></div><div className="topics-panel">{matches.map((topic) => <div className="topic-card" key={`${topic.category?.slug || 'topic'}-${topic.title}`}><span className="topic-card__title">{topic.title}</span><span><span className={`status status--${topic.status}`}>{statusLabels[topic.status]}</span>{showCategory && <small className="topic-result__meta"> · {topic.category.title}</small>}</span></div>)}</div></>;
}

function Topics() { return <><PageHero eyebrow="دليل شامل" title="ابحث في جميع الثغور">استخدم الكلمة المفتاحية، ثم ضيّق النتائج بحسب الباب أو حالة الموضوع.</PageHero><main className="prose topic-directory"><TopicFilters topics={allTopics} showCategory /></main></>; }
function Category({ category }) { if (!category) return <Topics />; const topics = category.topics.map((topic) => ({ ...topic, category })); return <><PageHero eyebrow="باب من أبواب الثغور" title={category.title}>هذا الحصر أولي ومفتوح للتصويب والإضافة من أهل العلم والاختصاص.</PageHero><main className="category-layout"><TopicFilters topics={topics} /></main></>; }

function Methodology() { return <><PageHero eyebrow="شفافية العمل" title="المنهجية والمصادر">كيف نرصد الموضوعات ونصنفها ونراجع المساهمات قبل نشرها.</PageHero><main className="prose"><h2>غرض الموقع</h2><p>الموقع فهرس أولي لموضوعات تحتاج بحثًا أو عملاً أو توثيقًا. إدراج موضوع لا يعني اكتمال البحث فيه، ولا يمثل فتوى أو حكمًا نهائيًا.</p><h2>سياسة المصادر</h2><p>نفضّل المصادر الأصلية والجهات المتخصصة والأبحاث المحكمة والإحصاءات القابلة للتحقق. يُراجع كل مصدر قبل اعتماده في المقالات النهائية.</p><h2>المراجعة والتصويب</h2><p>تُقيّم المساهمات من حيث دقة الوصف وملاءمة التصنيف وجودة الاستدلال.</p></main></>; }

function Statement() { const [language, setLanguage] = useState('ar'); const english = language === 'en'; return <><section className="page-hero" dir={english ? 'ltr' : 'rtl'}><div className="container"><div className="language-switch" role="group" aria-label="لغة البيان"><button aria-pressed={!english} onClick={() => setLanguage('ar')}>العربية</button><button aria-pressed={english} onClick={() => setLanguage('en')}>English</button></div><span className="eyebrow">{english ? 'Project overview' : 'تعريف بالمشروع'}</span><h1>{english ? 'Project statement' : 'بيان المبادرة'}</h1><p>{english ? 'Purpose, methodology, and independence of the project.' : 'الغرض والمنهج والاستقلالية في مشروع حصر ثغور الأمة.'}</p></div></section><main className={`prose ${english ? 'statement-english' : ''}`} dir={english ? 'ltr' : 'rtl'}>{english ? <EnglishStatement /> : <ArabicStatement />}</main></>; }
function ArabicStatement() { return <><h2>عن المشروع</h2><p>مشروع حصر ثغور الأمة هو مبادرة أُنشئت بمساهمة عددٍ من المسلمين، بهدف حصر وتفنيد أبرز المشكلات الكبرى التي تواجه الأمة الإسلامية في مختلف أقطارها، وفق أولويات ومراتب الدين المستنبطة من كتاب الله تعالى الحنيف، وسنة نبيه المصطفى ﷺ، وإجماع علماء المسلمين الثقات.</p><p>يسعى المشروع إلى بناء تصور موضوعي قدر الإمكان، من خلال جعل القرآن الكريم والسنة النبوية وإجماع أهل العلم منطلقًا أساسيًا في جمع الثغور، مع مراعاة كتب العلماء المعتبرين وكلام أهل الاختصاص.</p><p>يبقى هذا العمل اجتهادًا بشريًا قابلًا للمراجعة والتطوير والتصويب كلما ظهر ما هو أرجح بدليله. المشروع غير ربحي وغير ممول من أي جهة، ولا ينتمي إلى أي حزب أو تيار فكري أو سياسي.</p></>; }
function EnglishStatement() { return <><h2>About the project</h2><p>The Ummah Thoghour Enumeration Project is an initiative established through the contributions of Muslims to identify significant vulnerabilities facing the Muslim Ummah, guided by the Noble Qur'an, the Sunnah, and the consensus of trustworthy scholars.</p><p>The project seeks an objective framework by considering recognized scholarship, specialist knowledge, and the causes of the Ummah's weakness.</p><p>This remains a human scholarly effort, open to review, refinement, and correction. The project is nonprofit, independent, and unaffiliated with any political party or ideological movement.</p></>; }

function Contribute() { const [fileName, setFileName] = useState(''); return <><PageHero eyebrow="عمل جماعي مفتوح" title="أرسل مساهمتك">نرحب بإضافة ثغرة أو تصحيح أو مصدر يساعد على تطوير الحصر.</PageHero><main className="prose"><div className="prose-card"><form className="contribution-form" onSubmit={(event) => event.preventDefault()}><label>الباب<select required><option value="">اختر الباب</option>{categories.map((category) => <option key={category.slug}>{category.title}</option>)}</select></label><label>عنوان الإضافة<input required placeholder="عنوان الثغرة أو التصويب" /></label><label>التفاصيل والمصادر<textarea required placeholder="اشرح الإضافة باختصار، وأرفق الروابط أو المراجع إن وجدت." /></label><label>ملف مرفق (اختياري)<input type="file" onChange={(event) => setFileName(event.target.files[0]?.name || '')} accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.webp" /></label>{fileName && <p className="form-note">الملف المختار: {fileName}</p>}<label>الاسم (اختياري)<input placeholder="للتواصل عند الحاجة" /></label><p className="form-note">سيُربط هذا النموذج بخدمة إرسال آمنة قبل النشر؛ لا تُرفع الملفات إلى البريد تلقائيًا.</p><button className="btn btn-solid" type="submit">أرسل مساهمتك</button></form></div></main></>; }

function App() { const route = useRoute(); const category = route.startsWith('/category/') ? categories.find((item) => item.slug === route.split('/').pop()) : null; let page = <Home />; if (route === '/topics') page = <Topics />; if (route === '/methodology') page = <Methodology />; if (route === '/statement') page = <Statement />; if (route === '/contribute') page = <Contribute />; if (route.startsWith('/category/')) page = <Category category={category} />; return <><Header /><main className="app-main">{page}</main><Footer /></>; }

export default App;
