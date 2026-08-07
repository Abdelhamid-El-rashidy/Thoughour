import { useEffect, useMemo, useState } from 'react';
import { allTopics, categories, stats, statusLabels } from './data/categories.js';

const brandSvg = (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 40V22a14 14 0 0 1 28 0v18" /><path d="M10 40h28" /><path d="M18 40V25a6 6 0 0 1 12 0v15" /><path d="M24 8v4" />
  </svg>
);

const menuSvg = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
);

const goSvg = (
  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 24h26" /><path d="M26 14l10 10-10 10" />
  </svg>
);

function asset(path) {
  const base = import.meta.env.BASE_URL || '/';
  return `${base}${path.replace(/^\//, '')}`;
}

function useRoute() {
  const [route, setRoute] = useState(() => location.hash.slice(1) || '/');
  useEffect(() => {
    const update = () => setRoute(location.hash.slice(1) || '/');
    addEventListener('hashchange', update);
    return () => removeEventListener('hashchange', update);
  }, []);
  return route;
}

function Link({ to, children, className = '', ...props }) {
  // In-page anchors on the home page (hash router uses #/path for routes).
  if (to.startsWith('#') && !to.startsWith('#/')) {
    return <a className={className} href={to} {...props}>{children}</a>;
  }
  if (to.startsWith('/#')) {
    return <a className={className} href={to.slice(1)} {...props}>{children}</a>;
  }
  const href = to.startsWith('#') ? to : `#${to}`;
  return <a className={className} href={href} {...props}>{children}</a>;
}

function Brand({ compact = false }) {
  return (
    <Link to="/" className="brand">
      {brandSvg}
      {compact ? <span>الثغور</span> : <span>الثغور<br /><small>حصر ثغور الأمة</small></span>}
    </Link>
  );
}

function Header({ variant = 'home' }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  if (variant === 'simple') {
    return (
      <header className="site-header">
        <div className="container nav-inner">
          <Brand />
          <Link className="btn btn-ghost" to="/contribute">ساهم</Link>
        </div>
      </header>
    );
  }

  if (variant === 'contribute') {
    return (
      <header className="site-header">
        <div className="container nav-inner">
          <Brand />
          <Link className="btn btn-ghost" to="/">الرئيسية</Link>
        </div>
      </header>
    );
  }

  const links = variant === 'category'
    ? [
        ['#overview', 'الثغور'],
        ...categories.map((category) => [`/category/${category.slug}`, category.shortNav]),
        ['#about', 'من نحن']
      ]
    : [
        ['#overview', 'الثغور'],
        ['/topics', 'الموضوعات'],
        ...categories.map((category) => [`/category/${category.slug}`, category.shortNav]),
        ['/methodology', 'المنهجية'],
        ['/contribute', 'ساهم']
      ];

  return (
    <header className="site-header">
      <div className="container nav-inner">
        <Brand />
        <button
          className="nav-toggle"
          aria-label="القائمة"
          aria-controls="site-navigation"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {menuSvg}
        </button>
        <ul id="site-navigation" className={`nav-links ${open ? 'open' : ''}`}>
          {links.map(([to, label]) => (
            <li key={to}>
              <Link to={to} onClick={close}>{label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}

function Footer({ links = 'full' }) {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div>
          <div className="brand">{brandSvg}<span>الثغور</span></div>
          <div className="fine">مبادرة شبابية مستقلة لحصر ثغور الأمة المعاصرة — والله من وراء القصد</div>
        </div>
        <div className="fine">
          {links === 'full' && (
            <>
              <Link to="/methodology">المنهجية والمصادر</Link>
              {' · '}
              <Link to="/statement">بيان المبادرة</Link>
              {' · '}
            </>
          )}
          {links === 'statement' && (
            <>
              <Link to="/methodology">المنهجية والمصادر</Link>
              {' · '}
            </>
          )}
          {links === 'methodology' && (
            <>
              <Link to="/statement">بيان المبادرة</Link>
              {' · '}
            </>
          )}
          جميع النصوص أولية وقابلة للتصويب والإضافة
        </div>
      </div>
    </footer>
  );
}

function CtaBand({ title = 'عندك علم في ثغرة من هذه الثغور؟', text = 'إن كان لديك علم أو خبرة في إحدى هذه الثغور، أو أردت المساهمة بالإضافة والتصويب، تواصل معنا.', button = 'أرسل مساهمتك' }) {
  return (
    <section className="cta-band">
      <div className="container">
        <h2>{title}</h2>
        <p>{text}</p>
        <Link className="btn btn-solid" to="/contribute">{button}</Link>
      </div>
    </section>
  );
}

function IconHtml({ html }) {
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

function Home() {
  return (
    <>
      <section className="hero">
        <div className="pattern" style={{ backgroundImage: `url('${asset('assets/star_tile.svg')}')` }} />
        <div className="container hero-inner">
          <span className="eyebrow">مبادرة لحصر ثغور الأمة</span>
          <h1>الثغور</h1>
          <p className="tagline">ثغور الأمة اليوم لم تعد عند الحدود وحدها</p>
          <p className="lede">مبادرة شبابية تحاول حصر الثغرات التي تنخر جسد الأمة الإسلامية في زماننا هذا على أصعدتها المختلفة، خطوة أولى على طريق الإصلاح؛ فمن عرف الداء أدرك طريق الدواء.</p>
          <div className="hero-cta">
            <a className="btn btn-solid" href="#overview">تصفح الثغور</a>
            <a className="btn btn-ghost" href="#about">من نحن</a>
          </div>
        </div>
      </section>

      <section className="section" id="overview">
        <div className="container">
          <div className="section-head">
            <span className="eyebrow">ديوان الثغور</span>
            <h2>ستة أبواب، وتحت كل باب ثغرات</h2>
            <p>قسّمنا هذا الحصر الأولي إلى ستة أبواب رئيسية، وتحت كل باب عشرات الثغرات الفرعية التي نحاول جمعها أولا بأول قبل الشروع في سدها.</p>
          </div>
          <div className="frontiers-grid">
            {categories.map((category) => (
              <Link key={category.slug} className="arch-card" to={`/category/${category.slug}`}>
                <div className="arch-top"><IconHtml html={category.icon} /></div>
                <div className="arch-body">
                  <h3>{category.title}</h3>
                  <p>{category.blurb}</p>
                  <div className="arch-meta">
                    <span>{category.count} بندًا</span>
                    <span className="go">{goSvg}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="stats-strip" aria-label="إحصاءات المبادرة">
        <div className="container stats-grid">
          <div><strong>{stats.categories}</strong><span>أبواب رئيسية</span></div>
          <div><strong>{stats.items}</strong><span>بندًا مرصودًا</span></div>
          <div><strong>{stats.planned}</strong><span>موضوعًا قيد الإعداد</span></div>
        </div>
      </section>

      <div className="rosette">
        <span className="line" />
        {brandSvg}
        <span className="line" />
      </div>

      <section className="section about" id="about">
        <div className="container about-grid">
          <div className="about-card">
            <span className="eyebrow">من نحن</span>
            <h3 style={{ marginTop: 12 }}>مبادرة شبابية لحصر ثغور الأمة</h3>
            <p>نحن مجموعة من الشباب المسلم لاحظنا كثرة الثغرات التي تصيب الأمة الإسلامية اليوم على أصعدة متعددة: اجتماعية وفكرية وسياسية واقتصادية وعلمية ودينية، وتفرُّقها بين مصادر متفرقة دون حصر جامع يعين طالب العلم والداعية والمصلح على إدراك حجم المشكلة قبل الشروع في حلها.</p>
            <p>من هنا انطلقت هذه المبادرة: محاولة أولية لحصر هذه الثغور وتصنيفها في مكان واحد، لتكون نقطة انطلاق لمن أراد أن يتخصص في سد ثغرة منها، بحثًا أو دعوةً أو عملًا ميدانيًا. هذا العمل ليس نهائيًا ولا كاملًا، وهو مفتوح دومًا للإضافة والتصويب ممن لديه علم أو خبرة أوسع.</p>
            <p>والله نسأل أن يوفقنا وإياكم لما فيه صلاح هذه الأمة.</p>
            <div className="about-note">هذا نص مبدئي عن المبادرة، وسيتم تعديله لاحقًا.</div>
          </div>
          <div className="values">
            <div className="value-item">
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 12l10-4 10 4 10-4v26l-10 4-10-4-10 4Z" /><path d="M18 8v26M28 12v26" /><circle cx="30" cy="30" r="6" /><path d="M34.5 34.5 39 39" /></svg>
              <div><h4>الحصر قبل الحل</h4><p>لا يمكن سد ثغرة لم تُعرف بعد، فبدأنا بجمعها وتصنيفها أولًا.</p></div>
            </div>
            <div className="value-item">
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 24c4-6 9-8 13-6l9 4" /><path d="M42 24c-4-6-9-8-13-6l-9 4" /><path d="M15 18l8 4-3 6-9-3c-2-1-2-4 0-6Z" /><path d="M33 18l-8 4 3 6 9-3c2-1 2-4 0-6Z" /></svg>
              <div><h4>عمل جماعي مفتوح</h4><p>هذا الحصر مبنيّ على التعاون، ونرحب بإضافات أهل العلم والاختصاص في كل باب.</p></div>
            </div>
            <div className="value-item">
              <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="24" cy="24" r="17" /><path d="M31 17l-4 11-11 4 4-11 11-4Z" /><circle cx="24" cy="24" r="1.6" fill="currentColor" /></svg>
              <div><h4>سعة الأفق</h4><p>لا نحصر الثغرة في زاوية واحدة، بل ننظر إليها من أبعادها الاجتماعية والفكرية والمادية معًا.</p></div>
            </div>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}

function leafVisible(leaf, term, status) {
  const matchesTerm = !term || leaf.title.toLowerCase().includes(term);
  const matchesStatus = status === 'all' || leaf.status === status;
  return matchesTerm && matchesStatus;
}

function nodeVisible(node, term, status) {
  if (node.type === 'leaf') return leafVisible(node, term, status);
  return (node.children || []).some((child) => nodeVisible(child, term, status));
}

function LeafItem({ leaf }) {
  const planned = leaf.status === 'planned' || leaf.status === 'in-progress';
  return (
    <li>
      {planned ? (
        <span className="planned-tag">
          {leaf.title}
          <span className="dot" title="موضوع مقترح لمقال مستقل قادم" />
        </span>
      ) : leaf.title}
      {leaf.externalHref && (
        <a className="ext-link" href={leaf.externalHref} target="_blank" rel="noopener noreferrer">
          {' '}{leaf.externalLabel || '↗ رابط خارجي'}
        </a>
      )}
      <span className={`status status--${leaf.status}`}>{statusLabels[leaf.status]}</span>
      {planned && (
        <Link
          className="topic-link"
          to={leaf.articleHref || `/article/template?topic=${encodeURIComponent(leaf.title)}`}
        >
          عرض صفحة الموضوع
        </Link>
      )}
    </li>
  );
}

function OutlineNodes({ nodes, term, status }) {
  return nodes.map((node, index) => {
    if (node.type === 'leaf') {
      if (!leafVisible(node, term, status)) return null;
      return <LeafItem key={`${node.title}-${index}`} leaf={node} />;
    }
    if (!nodeVisible(node, term, status)) return null;
    return (
      <li className="has-kids" key={`${node.title}-${index}`}>
        <details open={Boolean(term) || status !== 'all'}>
          <summary className="sub-title">{node.title}</summary>
          <ul className="leaf-list nested">
            <OutlineNodes nodes={node.children} term={term} status={status} />
          </ul>
        </details>
      </li>
    );
  });
}

function CategoryOutline({ category }) {
  const [term, setTerm] = useState('');
  const [status, setStatus] = useState('all');
  const normalized = term.trim().toLowerCase();

  const visibleCount = useMemo(() => {
    const leaves = category.layout === 'flat' ? category.flatItems : category.topics;
    return leaves.filter((leaf) => leafVisible(leaf, normalized, status)).length;
  }, [category, normalized, status]);

  return (
    <>
      {category.layout === 'groups' && (
        <div className="legend">
          <span><span className="dot" /> موضوع مقترح لمقال/بحث مستقل لاحقا</span>
          <span><span className="diamond" /> ثغرة فرعية</span>
        </div>
      )}
      <div className="directory-tools">
        <input
          type="search"
          aria-label="البحث في الثغور"
          placeholder="ابحث داخل هذا الباب…"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
        />
        <select aria-label="تصفية حالة الموضوع" value={status} onChange={(event) => setStatus(event.target.value)}>
          <option value="all">كل الحالات</option>
          <option value="in-progress">تحت العمل</option>
          <option value="planned">قيد الإعداد</option>
          <option value="observed">مرصود</option>
        </select>
        <div className="results" aria-live="polite">
          عرض {visibleCount} بندًا{term.trim() ? ` مطابقًا لعبارة «${term.trim()}»` : ''}.
        </div>
      </div>
      <div className="outline">
        {category.layout === 'flat' ? (
          <ul className="flat-grid">
            {category.flatItems.filter((leaf) => leafVisible(leaf, normalized, status)).map((leaf) => (
              <li key={leaf.title}>
                {leaf.title}
                <span className={`status status--${leaf.status}`}>{statusLabels[leaf.status]}</span>
              </li>
            ))}
          </ul>
        ) : (
          (category.sections || category.groups).map((section, index) => {
            if (section.type === 'divider') {
              return <div className="divider-label" key={`divider-${index}`}>{section.title}</div>;
            }
            const group = section;
            const open = Boolean(normalized) || status !== 'all';
            const show = group.items.some((item) => nodeVisible(item, normalized, status));
            if (!show) return null;
            const count = collectLeafCount(group.items);
            return (
              <details className="group-card" key={`${group.title}-${index}`} {...(open ? { open: true } : {})}>
                <summary className="g-title">
                  <span>{group.title}</span>
                  <span className="cnt">{count}</span>
                </summary>
                <ul className="leaf-list">
                  <OutlineNodes nodes={group.items} term={normalized} status={status} />
                </ul>
              </details>
            );
          })
        )}
      </div>
    </>
  );
}

function collectLeafCount(nodes) {
  let count = 0;
  for (const node of nodes) {
    if (node.type === 'leaf') count += 1;
    else if (node.children) count += collectLeafCount(node.children);
  }
  return count;
}

function Category({ category }) {
  if (!category) return <Topics />;
  return (
    <>
      <nav className="cat-nav">
        <div className="container cat-nav-inner">
          {categories.map((item) => (
            <Link
              key={item.slug}
              to={`/category/${item.slug}`}
              className={item.slug === category.slug ? 'active' : ''}
            >
              {item.shortNav}
            </Link>
          ))}
        </div>
      </nav>
      <section className="cat-hero">
        <div className="pattern" style={{ backgroundImage: `url('${asset('assets/star_tile.svg')}')` }} />
        <div className="container hero-inner">
          <div className="breadcrumb"><Link to="/">الثغور</Link> ← {category.title}</div>
          <div className="cat-icon"><IconHtml html={category.catIcon || category.icon} /></div>
          <h1>{category.title}</h1>
          <p className="intro">{category.intro}</p>
          <span className="cat-count">{category.count} بندًا مرصودًا حتى الآن</span>
        </div>
      </section>
      <CategoryOutline category={category} />
      <CtaBand
        title="عندك إضافة على هذه الثغرة؟"
        text="هذا الحصر أولي ومفتوح للتصويب والإضافة من أهل العلم والاختصاص في كل باب."
        button="أرسل إضافتك"
      />
    </>
  );
}

function Topics() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">دليل الكتابة</span>
          <h1>الموضوعات قيد الإعداد</h1>
          <p>تُنشأ صفحة مستقلة لكل موضوع حين يبدأ جمع مادته، وتبقى حالته ظاهرة إلى أن يُراجع وينشر.</p>
        </div>
      </section>
      <main className="prose">
        <div className="prose-card">
          <h2>كيف تتصفح الموضوعات؟</h2>
          <p>اذهب إلى أحد الأبواب الستة واستخدم البحث أو فلتر «قيد الإعداد». ستظهر بجوار كل موضوع صفحة خاصة به، يمكن من خلالها إرسال المصادر والتصويبات.</p>
          <p><Link className="btn btn-solid" to="/#overview">تصفح الأبواب</Link></p>
          <h2>نموذج المقال المعتمد</h2>
          <ul>
            <li>تعريف وحدود الموضوع.</li>
            <li>المظاهر والمؤشرات والمصادر.</li>
            <li>الأسباب والآثار والموضوعات المرتبطة.</li>
            <li>الجهود القائمة وفرص التطوير.</li>
          </ul>
        </div>
      </main>
    </>
  );
}

function Methodology() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">شفافية العمل</span>
          <h1>المنهجية والمصادر</h1>
          <p>كيف نرصد الموضوعات ونصنفها ونراجع المساهمات قبل نشرها.</p>
        </div>
      </section>
      <main className="prose">
        <h2>غرض الموقع</h2>
        <p>الموقع فهرس أولي لموضوعات تحتاج بحثًا أو عملاً أو توثيقًا. إدراج موضوع لا يعني اكتمال البحث فيه، ولا يمثل فتوى أو حكمًا نهائيًا.</p>
        <h2>معايير الإدراج</h2>
        <ul>
          <li>صلة الموضوع بواقع المسلمين المعاصر أو بقدرتهم على الإصلاح والبناء.</li>
          <li>إمكان صياغته بوضوح ضمن باب مناسب دون تكرار غير مبرر.</li>
          <li>وجود وصف قابل للمراجعة ومراجع عند توفرها.</li>
        </ul>
        <h2>حالات الموضوعات</h2>
        <ul>
          <li><strong>مرصود:</strong> بند أُدرج في الحصر الأولي ويحتاج التحقق والتفصيل.</li>
          <li><strong>قيد الإعداد:</strong> موضوع خُصص له ملف بحث أو مقال، لكنه غير مكتمل النشر بعد.</li>
        </ul>
        <h2>سياسة المصادر</h2>
        <p>نفضّل المصادر الأصلية، والجهات المتخصصة، والأبحاث المحكمة، والإحصاءات القابلة للتحقق. يُذكر الرابط أو المرجع وتاريخه حيث أمكن، وتُراجع المصادر قبل اعتمادها في المقالات النهائية.</p>
        <h2>المراجعة والتصويب</h2>
        <p>المساهمات تُقيّم من حيث دقة الوصف، ملاءمة التصنيف، وجود التكرار، وجودة الاستدلال. يمكن للزوار إرسال التصويبات والمصادر عبر صفحة المساهمة.</p>
        <p><Link className="btn btn-solid" to="/contribute">أرسل تصويبًا أو مصدرًا</Link></p>
      </main>
    </>
  );
}

function Statement() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">تعريف بالمشروع</span>
          <h1>بيان المبادرة</h1>
          <p>الغرض والمنهج والاستقلالية في مشروع حصر ثغور الأمة.</p>
        </div>
      </section>
      <main className="prose statement">
        <section aria-labelledby="statement-ar">
          <h2 id="statement-ar">عن المشروع</h2>
          <p>مشروع حصر ثغور الأمة هو مبادرة أُنشئت بمساهمة عددٍ من المسلمين، بهدف حصر وتفنيد أبرز المشكلات الكبرى التي تواجه الأمة الإسلامية في مختلف أقطارها، وفق أولويات ومراتب الدين المستنبطة من كتاب الله تعالى الحنيف، وسنة نبيه المصطفى ﷺ، وإجماع علماء المسلمين الثقات.</p>
          <p>بدأ المشروع بمحاولة من بعض الشباب الراغبين في نفع الأمة من خلال المساهمة في حل المشكلات البارزة في مجتمعاتهم. وعند البحث عن أكبر هذه المشكلات وأولويات معالجتها، لم يجدوا مصدرًا جامعًا يحصر الثغور التي إذا عولجت كان لها أعظم الأثر في صلاح حال الأمة. وليس في ذلك بأي حالٍ من الأحوال انتقاصٌ من جهود العلماء والمشايخ في زماننا، وإنما لوحظ أن الطريق متشعب، وأن المتخصصين في فروع الدين المختلفة يركّز كلٌ منهم، بحكم تخصصه، على المجال الذي يعنى به، مما قد يجعل العامل للإسلام محتارًا في ترتيب أولويات الإصلاح. ومن هنا جاءت فكرة المشروع، ليكون محاولةً لحصر وتفنيد محايد لمشكلات أمة نبينا محمد بن عبد الله ﷺ، وغايته الأساسية توضيح أكبر الثغور التي ينبغي أن تُوجَّه إليها جهود البناء والإصلاح.</p>
          <p>لا يعتمد المشروع على آراء القائمين عليه أو انطباعاتهم الشخصية، وإنما يسعى إلى بناء تصور موضوعي قدر الإمكان، من خلال جعل القرآن الكريم والسنة النبوية وإجماع أهل العلم منطلقًا أساسيًا في جمع الثغور. كما يراعي جمع الثغور المطروحة في كتب العلماء المعتبرين قديمًا وحديثًا، وكلام أهل الاختصاص في مختلف العلوم الشرعية والواقعية، ودراسة أسباب ضعف الأمة، ثم مقارنة هذه المصادر وتحليلها لتحديد الثغور الأكثر تكرارًا وتأثيرًا واتفاقًا. ويُراعى كذلك النظر في أثر كل ثغر على غيره، وتقديم الثغور الجذرية التي يترتب على علاجها إصلاح غيرها من الثغور.</p>
          <p>ويبقى هذا العمل اجتهادًا بشريًا قابلًا للمراجعة والتطوير والتصويب كلما ظهر ما هو أرجح بدليله. لذلك يرحب المشروع بأي ملاحظات أو تصويبات علمية أو منهجية، ويُراجع نتائجه كلما ظهر دليل أو قول راجح يقتضي ذلك.</p>
          <p>هذا المشروع غير ربحي وغير ممول من أي جهة، ولا ينتمي إلى أي حزب أو تيار فكري أو سياسي، كما أنه غير مقيد بمذهب معين. ولا يُقصد بإدراج أي ثغر الانتصار لتيار أو مدرسة فكرية بعينها، وإنما يندرج ذلك ضمن المنهجية التي يعتمدها المشروع في جمع الثغور وتحليلها، ولا تعكس الثغور المذكورة بالضرورة التوجهات الشخصية لجميع القائمين على المشروع أو المساهمين فيه.</p>
        </section>
        <section className="statement-english" lang="en" dir="ltr" aria-labelledby="statement-en">
          <h2 id="statement-en">Project statement</h2>
          <p>The Ummah Thoghour Enumeration Project is an initiative established through the contributions of a number of Muslims with the aim of identifying the most significant vulnerabilities facing the Muslim Ummah across its various regions, according to the priorities and ranks of the religion as derived from the Noble Qur'an, the Sunnah of His Prophet ﷺ, and the consensus (ijmāʿ) of trustworthy Muslim scholars.</p>
          <p>The project began as an effort by a group of young Muslims who sought to benefit the Ummah by contributing to the resolution of the prominent challenges within their communities. In searching for the greatest of these challenges and the order in which they should be addressed, they found no comprehensive source that identified the critical thoghour whose resolution would have the greatest impact on the reform and well-being of the Ummah. This is in no way intended to diminish the efforts of the scholars and shuyūkh of our time. Rather, it was observed that the path is fragmented, and that specialists in the various branches of Islamic knowledge naturally focus on the fields of their own expertise, which may leave those striving to serve Islam uncertain as to how the priorities of reform should be ordered. From this arose the idea for this project as an attempt to impartially identify and systematically analyze the challenges facing the Ummah of our Prophet Muhammad ibn ʿAbdullāh ﷺ, with its primary objective being to clarify the most significant thoghour toward which efforts of reform and development should be directed.</p>
          <p>The project does not rely on the personal opinions or impressions of those who manage it. Rather, it seeks to develop an objective framework, to the greatest extent possible, by taking the Noble Qur'an, the Prophetic Sunnah, and the consensus of qualified scholars as its primary foundation for identifying thoghour. It also takes into consideration the thoghour discussed in the works of recognized scholars, past and present; the views of specialists across the various Islamic and contemporary fields of knowledge; and the study of the causes behind the Ummah's weakness. These sources are then compared and analyzed to determine the thoghour that are most recurrent, consequential, and broadly agreed upon. Consideration is likewise given to the influence that each thaghr has on others, with priority being given to root thoghour whose resolution contributes to the resolution of other thoghour.</p>
          <p>This project remains a human scholarly effort (ijtihād), open to review, refinement, and correction whenever stronger evidence becomes apparent. Accordingly, the project welcomes any scholarly or methodological observations and corrections, and its findings are revised whenever evidence or a stronger opinion warrants doing so.</p>
          <p>This project is nonprofit and receives no funding from any individual or organization. It is not affiliated with any political party, ideological movement, or political current, nor is it bound to any particular madhhab (school of jurisprudence). The inclusion of any given thaghr is not intended as an endorsement of any particular movement or school of thought; rather, it reflects the methodology adopted by the project in identifying and analyzing thoghour. The thoghour presented do not necessarily reflect the personal views of all those involved in or contributing to the project.</p>
        </section>
      </main>
    </>
  );
}

function Contribute() {
  const [fileName, setFileName] = useState('');

  function onSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = `مساهمة جديدة في مبادرة الثغور: ${data.get('title')}`;
    const attachment = data.get('attachment');
    const attachmentNote = attachment && attachment.name
      ? `\n\nملف مرفق: ${attachment.name}\nيرجى إرفاق هذا الملف يدويًا قبل إرسال الرسالة.`
      : '';
    const body = `الباب: ${data.get('category')}\n\nعنوان الإضافة: ${data.get('title')}\n\nالتفاصيل والمصادر:\n${data.get('details')}\n\nاسم المرسل (اختياري): ${data.get('name') || ''}${attachmentNote}`;
    window.location.href = `mailto:contact@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">عمل جماعي مفتوح</span>
          <h1>أرسل مساهمتك</h1>
          <p>نرحب بإضافة ثغرة، أو تصحيح تصنيف، أو توثيق مصدر يساعد على تطوير الحصر.</p>
        </div>
      </section>
      <main className="prose">
        <div className="prose-card">
          <form className="contribution-form" onSubmit={onSubmit}>
            <label>الباب
              <select name="category" required defaultValue="">
                <option value="">اختر الباب</option>
                {categories.map((category) => (
                  <option key={category.slug} value={category.title}>{category.title}</option>
                ))}
              </select>
            </label>
            <label>عنوان الإضافة <input name="title" required placeholder="مثال: عنوان الثغرة أو التصويب" /></label>
            <label>التفاصيل والمصادر <textarea name="details" required placeholder="اشرح الإضافة باختصار، وأرفق الروابط أو المراجع إن وجدت." /></label>
            <label>ملف مرفق (اختياري)
              <input
                name="attachment"
                type="file"
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.webp"
                onChange={(event) => setFileName(event.target.files[0]?.name || '')}
              />
            </label>
            {fileName && <p className="form-note">الملف المختار: {fileName}</p>}
            <label>الاسم (اختياري) <input name="name" placeholder="للتواصل عند الحاجة" /></label>
            <p className="form-note">بالإرسال سيفتح تطبيق البريد لديك برسالة جاهزة. إذا اخترت ملفًا، سيُذكر اسمه في الرسالة ثم أرفقه يدويًا قبل الإرسال. استبدل بريد المثال في الكود بالبريد الرسمي للمبادرة قبل النشر.</p>
            <button className="btn btn-solid" type="submit">جهّز الرسالة</button>
          </form>
        </div>
      </main>
    </>
  );
}

function ArticlePornography() {
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">تحت العمل</span>
          <h1>انتشار المواد الإباحية</h1>
          <p>بحث جارٍ حول انتشار المواد الإباحية عبر الإنترنت بين شباب المسلمين وآثارها وسبل الوقاية منها.</p>
        </div>
      </section>
      <main className="prose">
        <div className="prose-card">
          <p><span className="status status--in-progress">تحت العمل</span></p>
          <p className="form-note">هذه مسودة بحثية أولية. الأرقام والنتائج المذكورة فيها تحتاج استكمال توثيق المصادر قبل اعتماد النسخة النهائية.</p>
          <h2>تعريف المشكلة</h2>
          <p>تتمثل مشكلة الإباحية الإلكترونية في استغلال شبكة الإنترنت والتقنيات الرقمية لإنتاج ونشر مواد، من صور وفيديوهات وحوارات حية، تهدف إلى إثارة الغريزة الجنسية بطريقة مباشرة أو غير مباشرة. وقد تحولت هذه الممارسات إلى صناعة عالمية عابرة للحدود تحقق أرباحًا مادية طائلة.</p>
          <p>وتُعد القضية خطيرة لأبعاد أمنية واجتماعية وصحية وعقدية؛ فهي تمس الفرد والأسرة والمجتمع، ويكون المراهقون والشباب والأطفال من أكثر الفئات عرضةً للتأثر بها.</p>
          <h2>النصوص الواردة في الشرع</h2>
          <ul>
            <li>قال تعالى: ﴿قُل لِّلْمُؤْمِنِينَ يَغُضُّوا مِنْ أَبْصَارِهِمْ وَيَحْفَظُوا فُرُوجَهُمْ ذَٰلِكَ أَزْكَىٰ لَهُمْ﴾.</li>
            <li>وقال تعالى: ﴿وَلَا تَقْرَبُوا الزِّنَا إِنَّهُ كَانَ فَاحِشَةً وَسَاءَ سَبِيلًا﴾.</li>
            <li>وقال تعالى: ﴿إِنَّ الَّذِينَ يُحِبُّونَ أَن تَشِيعَ الْفَاحِشَةُ فِي الَّذِينَ آمَنُوا لَهُمْ عَذَابٌ أَلِيمٌ فِي الدُّنْيَا وَالْآخِرَةِ﴾.</li>
            <li>ومن السنة: «ما تركت بعدي فتنة أضر على الرجال من النساء»، وحديث زنا الجوارح.</li>
          </ul>
          <h2>العلامات والإحصاءات على انتشار المشكلة</h2>
          <p>تورد المسودة مؤشرات عن حجم الصناعة وكثافة المحتوى ومعدلات البحث، كما تشير إلى انتشار التعرض للمحتوى بين فئات عمرية مختلفة. تحتاج هذه المؤشرات إلى ربط كل رقم بمصدره المباشر وتاريخ نشره قبل اعتمادها في النسخة النهائية.</p>
          <h2>المجتمعات والبيئات الأكثر ظهورًا</h2>
          <ul>
            <li>الشباب والمراهقون، مع ضرورة التوعية المبكرة والوقاية الأسرية.</li>
            <li>الأطفال المعرضون للوصول غير المقصود أو الاستدراج الرقمي.</li>
            <li>بيئات العمل والأماكن التي يسهل فيها الوصول غير المنضبط إلى الإنترنت.</li>
          </ul>
          <h2>الأسباب الجذرية</h2>
          <ol>
            <li>سهولة الوصول إلى المحتوى وسهولة التخفي الرقمي.</li>
            <li>توسع استخدام الهواتف والتصوير والبث المتاح في كل وقت ومكان.</li>
            <li>الدوافع التجارية المرتبطة بهذه الصناعة.</li>
            <li>ضعف الوعي والرقابة الذاتية والأدوات الوقائية في بعض البيئات.</li>
          </ol>
          <h2>العلاقة بثغور أخرى</h2>
          <p>لا يقتصر أثر هذا الثغر على السلوك الفردي؛ بل يرتبط بثغر الأسرة، والصحة النفسية، والتربية الرقمية، والأمن التقني، والاقتصاد غير المشروع. لذلك تحتاج معالجته إلى تعاون الأسرة والمدرسة والمتخصصين والجهات التقنية.</p>
          <h2>التأثيرات والنتائج</h2>
          <ul>
            <li>تأثيرات نفسية وسلوكية محتملة، مثل القلق والشعور بالخزي والعزلة واضطراب العلاقات.</li>
            <li>إضعاف الثقة والروابط الزوجية والأسرية.</li>
            <li>تعريض الأطفال والمراهقين لمخاطر الاستغلال والاستدراج الرقمي.</li>
            <li>تطبيع محتوى أو ممارسات ضارة وإضعاف الحس الوقائي.</li>
          </ul>
          <h2>الحلول الحالية والمقترحة</h2>
          <ul>
            <li>التوعية المتوازنة التي تجمع بين البناء الإيماني والمعرفة العملية.</li>
            <li>استخدام أدوات الحجب والرقابة الأسرية وإعدادات الأمان المناسبة.</li>
            <li>فتح قنوات مساعدة آمنة وسرية للمتضررين.</li>
            <li>تعزيز التربية الرقمية، وتيسير القنوات الشرعية لبناء الأسرة.</li>
          </ul>
          <h2>المصادر والمراجع المذكورة في المسودة</h2>
          <ul>
            <li>دراسة «المواقع الإباحية وأثرها» — د. مشعل القدهي.</li>
            <li>بحث «الإباحية الإلكترونية» — أسامة غربي، جامعة المدية.</li>
            <li>بحث «الجرائم الإباحية» — ميلود بن عبد العزيز.</li>
            <li>إحصائيات Internet Filter Review وAlexa.</li>
            <li>مقالة «صناعة الإباحية والتكنولوجيا» — د. إبراهيم الحريري.</li>
          </ul>
          <p><Link className="btn btn-solid" to="/contribute">أرسل مصدرًا أو تصويبًا</Link></p>
        </div>
      </main>
    </>
  );
}

function ArticleTemplate({ topic }) {
  const title = topic || 'موضوع قيد الإعداد';
  return (
    <>
      <section className="page-hero">
        <div className="container">
          <span className="eyebrow">قيد الإعداد</span>
          <h1>{title}</h1>
          <p>صفحة موضوع أولية بانتظار جمع المادة والمصادر والمراجعة.</p>
        </div>
      </section>
      <main className="prose">
        <div className="prose-card">
          <p><span className="status status--planned">قيد الإعداد</span></p>
          <p>هذه صفحة مخصصة لموضوع «{title}». يمكن إرسال المصادر والتصويبات عبر صفحة المساهمة.</p>
          <p><Link className="btn btn-solid" to="/contribute">أرسل مصدرًا أو تصويبًا</Link></p>
        </div>
      </main>
    </>
  );
}

function App() {
  const route = useRoute();
  const categoryMatch = route.match(/^\/category\/([^/?#]+)/);
  const category = categoryMatch ? categories.find((item) => item.slug === categoryMatch[1]) : null;
  const articleTopic = route.startsWith('/article/template')
    ? new URLSearchParams(route.split('?')[1] || '').get('topic')
    : null;

  const isHomeSection = route === 'overview' || route === 'about' || route === '/' || route === '';

  useEffect(() => {
    if (route === 'overview') document.getElementById('overview')?.scrollIntoView({ behavior: 'smooth' });
    else if (route === 'about') document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    else window.scrollTo(0, 0);
  }, [route]);

  let page = <Home />;
  let headerVariant = 'home';
  let footerLinks = 'full';

  if (route.startsWith('/category/')) {
    page = <Category category={category} />;
    headerVariant = 'category';
  } else if (route === '/topics') {
    page = <Topics />;
    headerVariant = 'simple';
  } else if (route === '/methodology') {
    page = <Methodology />;
    headerVariant = 'simple';
    footerLinks = 'methodology';
  } else if (route === '/statement') {
    page = <Statement />;
    headerVariant = 'simple';
    footerLinks = 'statement';
  } else if (route === '/contribute') {
    page = <Contribute />;
    headerVariant = 'contribute';
  } else if (route === '/article/pornography') {
    page = <ArticlePornography />;
    headerVariant = 'simple';
  } else if (route.startsWith('/article/template')) {
    page = <ArticleTemplate topic={articleTopic} />;
    headerVariant = 'simple';
  } else if (!isHomeSection && route.startsWith('/')) {
    page = <Home />;
  }

  return (
    <>
      <Header variant={headerVariant} />
      <main className="app-main">{page}</main>
      <Footer links={footerLinks} />
    </>
  );
}

export default App;
