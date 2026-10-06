import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type Dispatch,
  type SetStateAction,
} from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/lib/authStore";
import type {
  Curriculum,
  HistoryData,
  SourceDocument,
  SourceRef,
  Topic,
  Question,
  Progress,
  PracticeMode,
} from "./types";
import {
  emptyProgress,
  filterPractice,
  mergeProgress,
  nextReview,
  parseProgress,
  questionKey,
  shuffled,
  topicStats,
} from "./learning";
import "./history.css";
type Update = Dispatch<SetStateAction<Progress>>;
const tabs = [
  ["path", "Learning path"],
  ["map", "Mind map"],
  ["study", "Read & recall"],
  ["practice", "MCQ practice"],
  ["mains", "Mains desk"],
  ["sources", "Sources & coverage"],
] as const;
const percent = (n: number, total: number) =>
  total ? Math.round((n / total) * 100) : 0;
const displayName = (d: SourceDocument) => d.filename.replace(/\.pptx$/, "");
function download(name: string, value: unknown) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(value, null, 2)], { type: "application/json" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
export default function HistoryPage() {
  const [data, setData] = useState<HistoryData | null>(null);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  const user = useAuthStore((s) => s.user);
  useEffect(() => {
    const controller = new AbortController();
    setError("");
    const get = async (name: string) => {
      const response = await fetch(`/history/data/${name}.json`, {
        signal: controller.signal,
      });
      if (!response.ok)
        throw new Error(`Could not load ${name} (${response.status}).`);
      return response.json();
    };
    Promise.all([get("curriculum"), get("questions"), get("sources")])
      .then(([curriculum, bank, sources]) => {
        if (
          curriculum.schemaVersion !== 1 ||
          bank.schemaVersion !== 1 ||
          sources.schemaVersion !== 1 ||
          !Array.isArray(curriculum.topics) ||
          !Array.isArray(bank.questions) ||
          !Array.isArray(sources.documents)
        )
          throw new Error("Unsupported history content format.");
        setData({
          curriculum,
          questions: bank.questions,
          documents: sources.documents,
        });
      })
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message);
      });
    return () => controller.abort();
  }, [retry]);
  if (error)
    return (
      <div className="history-root">
        <div className="ha-empty" role="alert">
          <h1>History could not load</h1>
          <p>{error}</p>
          <button onClick={() => setRetry((x) => x + 1)}>Try again</button>
        </div>
      </div>
    );
  if (!data)
    return (
      <div className="history-root">
        <p className="ha-empty" role="status">
          Opening your history atlas…
        </p>
      </div>
    );
  return (
    <Atlas
      key={user?.id ?? "guest"}
      data={data}
      storageKey={`history-atlas:v1:${user?.id ?? "guest"}`}
    />
  );
}
export function Atlas({
  data,
  storageKey,
}: {
  data: HistoryData;
  storageKey: string;
}) {
  const { curriculum: c, questions, documents } = data;
  const [params, setParams] = useSearchParams();
  const view = tabs.some(([id]) => id === params.get("view"))
    ? params.get("view")!
    : "path";
  const selected =
    c.topics.find((t) => t.id === params.get("topic")) ?? c.topics[0];
  const [storageError, setStorageError] = useState("");
  const [initial] = useState(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return {
        progress: raw ? parseProgress(JSON.parse(raw)) : emptyProgress(),
        error: "",
      };
    } catch {
      return {
        progress: emptyProgress(),
        error:
          "Saved progress could not be read. This session will not overwrite it. Export your work before leaving.",
      };
    }
  });
  const [progress, setProgress] = useState<Progress>(initial.progress);
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [era, setEra] = useState("all");
  const importRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (initial.error) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(progress));
      setStorageError("");
    } catch {
      setStorageError(
        "Browser storage is unavailable or full. Export progress to save this session.",
      );
    }
  }, [progress, storageKey, initial.error]);
  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, [view, selected.id]);
  const navigate = (next: string, topic?: string) => {
    const p = new URLSearchParams();
    p.set("view", next);
    if (topic) p.set("topic", topic);
    setParams(p);
  };
  const openTopic = (id: string) => {
    setProgress((p) => ({ ...p, lastTopic: id }));
    navigate("study", id);
  };
  const filtered = c.topics.filter(
    (t) =>
      (era === "all" || t.eraId === era) &&
      `${t.title} ${t.summary} ${t.checkpoints.join(" ")}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  const supported = c.topics.filter((t) => t.status !== "gap");
  const studied = supported.filter((t) => progress.studied[t.id]).length;
  const due = filterPractice(questions, progress, "due").length;
  const attempted = questions.filter(
    (q) => progress.questions[questionKey(q)],
  ).length;
  const unread = supported.find((t) => !progress.studied[t.id]);
  const next = unread ?? supported[0];
  const resume = c.topics.find((t) => t.id === progress.lastTopic) ?? next;
  const filterBar = (
    <div className="ha-filters">
      <label className="ha-search">
        <span>Search topics</span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search an era, ruler, movement…"
        />
      </label>
      <label>
        <span>Era</span>
        <select value={era} onChange={(e) => setEra(e.target.value)}>
          <option value="all">All eras</option>
          {c.eras.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title}
            </option>
          ))}
        </select>
      </label>
      <span className="ha-muted">{filtered.length} topics</span>
    </div>
  );
  const reference = (refs: SourceRef[]) => (
    <SourceReading refs={refs} documents={documents} reviews={c.reviews} />
  );
  return (
    <div className="history-root" ref={scrollRef}>
      <div className="ha-container">
        <header className="ha-hero">
          <div>
            <div className="ha-eyebrow">HISTORY / YOUR LEARNING ATLAS</div>
            <h1>See the whole story.</h1>
            <p>
              Find your place in an era. Understand the connections. Test what
              stays.
            </p>
            <div className="ha-hero-actions">
              <button
                className="ha-primary"
                onClick={() => openTopic(resume.id)}
              >
                {progress.lastTopic
                  ? "Continue learning"
                  : "Begin with prehistory"}{" "}
                <span aria-hidden>↗</span>
              </button>
              <button onClick={() => navigate("practice")}>
                Practise MCQs <span aria-hidden>→</span>
              </button>
            </div>
          </div>
          <div className="ha-hero-mark" aria-hidden="true">
            <div>PAST</div>
            <span>→</span>
            <div>CONTEXT</div>
            <span>→</span>
            <div>RECALL</div>
            <small>One connected history.</small>
          </div>
        </header>
        <div className="ha-stats">
          <Stat
            value={`${studied}/${supported.length}`}
            label="Topics studied"
          />
          <Stat
            value={`${attempted}/${questions.length}`}
            label="MCQs attempted"
          />
          <Stat value={due} label="Questions due" />
          <Stat
            value={c.topics.filter((t) => t.status === "gap").length}
            label="Coverage gaps"
          />
        </div>
        <nav className="ha-tabs" aria-label="History sections">
          {tabs.map(([id, label]) => (
            <button
              key={id}
              aria-current={view === id ? "page" : undefined}
              onClick={() =>
                navigate(id, id === "study" ? selected.id : undefined)
              }
            >
              {label}
            </button>
          ))}
        </nav>
        {(storageError || initial.error) && (
          <p role="alert" className="ha-notice">
            {storageError || initial.error}
          </p>
        )}
        {view === "path" && (
          <>
            <div className="ha-section-heading">
              <div>
                <h2>Your path through time</h2>
                <p>
                  Read → recall without looking → practise → revisit. Eras
                  overlap; these are learning groups, not hard boundaries.
                </p>
              </div>
              <Link to="/timeline">Open Chronicle ↗</Link>
            </div>
            <div className="ha-next">
              <div>
                <span className="ha-eyebrow">
                  {unread ? "NEXT UNREAD TOPIC" : "REVISIT THE FOUNDATIONS"}
                </span>
                <h3>{next.title}</h3>
                <p>{next.summary}</p>
              </div>
              <button onClick={() => openTopic(next.id)}>Open lesson →</button>
            </div>
            {filterBar}
            <div className="ha-era-grid">
              {c.eras.map((e, index) => {
                const topics = filtered.filter((t) => t.eraId === e.id);
                if (!topics.length) return null;
                const read = topics.filter(
                  (t) => progress.studied[t.id] && t.status !== "gap",
                ).length;
                return (
                  <section
                    className="ha-era"
                    key={e.id}
                    style={{ "--era-color": e.color } as CSSProperties}
                  >
                    <div className="ha-era-heading">
                      <span className="ha-era-number">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div>
                        <p className="ha-period">{e.period}</p>
                        <h3>{e.title}</h3>
                      </div>
                      <span className="ha-muted">
                        {read}/{topics.length}
                      </span>
                    </div>
                    <p className="ha-era-question">{e.question}</p>
                    <progress
                      aria-label={`${e.title}: ${read} topics studied`}
                      value={read}
                      max={topics.length}
                    />
                    <div className="ha-topic-list">
                      {topics.map((t) => (
                        <button key={t.id} onClick={() => openTopic(t.id)}>
                          <span
                            className={`ha-dot ${progress.studied[t.id] ? "is-read" : ""}`}
                            aria-hidden
                          >
                            {t.status === "gap"
                              ? "!"
                              : progress.studied[t.id]
                                ? "✓"
                                : ""}
                          </span>
                          <span>{t.title}</span>
                          <small>
                            {t.status === "gap"
                              ? "Gap"
                              : `${questions.filter((q) => q.topicId === t.id).length} MCQ`}
                          </small>
                        </button>
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
            {!filtered.length && (
              <p className="ha-empty">
                No topics match. Try another term or era.
              </p>
            )}
          </>
        )}
        {view === "map" && (
          <>
            <div className="ha-section-heading">
              <div>
                <h2>A map of connected ideas</h2>
                <p>
                  Expand an era, then a topic. Follow related topics to compare
                  institutions and movements across time.
                </p>
              </div>
            </div>
            {filterBar}
            <div className="ha-map-root">
              INDIAN HISTORY <span>+ world history connections</span>
            </div>
            <div className="ha-mindmap">
              {c.eras.map((e) => {
                const topics = filtered.filter((t) => t.eraId === e.id);
                if (!topics.length) return null;
                return (
                  <details
                    className="ha-map-era"
                    key={e.id}
                    open={!!search || era !== "all"}
                    style={{ "--era-color": e.color } as CSSProperties}
                  >
                    <summary>
                      <span>{e.title}</span>
                      <small>
                        {e.period} · {topics.length} topics
                      </small>
                    </summary>
                    <div className="ha-map-branches">
                      {topics.map((t) => (
                        <details key={t.id}>
                          <summary>
                            {t.title}{" "}
                            {t.status === "gap" && (
                              <span className="ha-badge">Gap</span>
                            )}
                          </summary>
                          <p>{t.summary}</p>
                          <ul>
                            {t.checkpoints.map((point) => (
                              <li key={point}>{point}</li>
                            ))}
                          </ul>
                          <button onClick={() => openTopic(t.id)}>
                            Read this topic →
                          </button>
                          <div className="ha-connections">
                            {t.related.map((id) => (
                              <button key={id} onClick={() => openTopic(id)}>
                                ↔ {c.topics.find((t) => t.id === id)?.title}
                              </button>
                            ))}
                          </div>
                        </details>
                      ))}
                    </div>
                  </details>
                );
              })}
            </div>
            {!filtered.length && (
              <p className="ha-empty">No matching branches.</p>
            )}
          </>
        )}
        {view === "study" && (
          <Study
            key={selected.id}
            topic={selected}
            data={data}
            progress={progress}
            update={setProgress}
            openTopic={openTopic}
            practice={() => navigate("practice", selected.id)}
            reference={reference}
          />
        )}
        {view === "practice" && (
          <Practice
            key={params.get("topic") ?? "all"}
            data={data}
            progress={progress}
            update={setProgress}
            initialTopic={params.get("topic") ?? "all"}
            openTopic={openTopic}
            reference={reference}
          />
        )}
        {view === "mains" && (
          <Mains
            data={data}
            progress={progress}
            update={setProgress}
            openTopic={openTopic}
            reference={reference}
          />
        )}
        {view === "sources" && (
          <>
            <div className="ha-section-heading">
              <div>
                <h2>Know what is covered</h2>
                <p>{c.syllabusStatus}</p>
              </div>
              <span className="ha-badge">Content v{c.version}</span>
            </div>
            <div className="ha-notice">
              These are your supplied lecture slides. Original wording is
              preserved and may contain errors. The {questions.length} MCQs are
              derived practice questions; the mains prompts are transcribed from
              the supplied deck and have not been matched to official papers.
            </div>
            <div className="ha-source-grid">
              {documents.map((d) => {
                const mapped = new Set<number>();
                c.topics.forEach((t) =>
                  t.sources
                    .filter((r) => r.sourceId === d.id)
                    .forEach((r) => {
                      for (let n = r.from; n <= r.to; n++) mapped.add(n);
                    }),
                );
                if (d.id === "mains-pyq")
                  d.slides.forEach((s) => mapped.add(s.number));
                return (
                  <article className="ha-card" key={d.id}>
                    <h3>{displayName(d)}</h3>
                    <p>
                      {d.slideCount} slides · {mapped.size} indexed
                    </p>
                    {reference([{ sourceId: d.id, from: 1, to: d.slideCount }])}
                  </article>
                );
              })}
            </div>
            <h2 className="ha-spaced">Coverage still to add</h2>
            <div className="ha-gap-list">
              {c.topics
                .filter((t) => t.status === "gap")
                .map((t) => (
                  <button key={t.id} onClick={() => openTopic(t.id)}>
                    <strong>{t.title}</strong>
                    <span>{t.summary}</span>
                    <span>View checklist →</span>
                  </button>
                ))}
            </div>
            <h2 className="ha-spaced">Source review log</h2>
            <p className="ha-muted">
              This is an initial review, not a complete factual audit of 1,100
              slides.
            </p>
            <div className="ha-review-list">
              {c.reviews.map((r) => (
                <article className="ha-card" key={r.id}>
                  <span className="ha-badge">
                    {r.status === "corrected"
                      ? "Correction available"
                      : "Needs checking"}
                  </span>
                  <p>{r.note}</p>
                  <button onClick={() => openTopic(r.topicId)}>
                    Open affected topic →
                  </button>
                  {r.evidence.map((e) => (
                    <a
                      key={e.url}
                      href={e.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {e.title} ↗
                    </a>
                  ))}
                </article>
              ))}
            </div>
            <h2 className="ha-spaced">Your local progress</h2>
            <p className="ha-muted">
              Saved for this account in this browser, without server sync.
              Export includes reading progress, answers, notes, drafts and
              flags. Restore merges newer answers and keeps existing nonempty
              notes.
            </p>
            <div className="ha-actions">
              <button
                onClick={() => download("history-progress.json", progress)}
              >
                Export progress
              </button>
              <button onClick={() => importRef.current?.click()}>
                Restore progress
              </button>
              <a
                className="ha-button"
                href="/history/data/curriculum.json"
                download
              >
                Download curriculum
              </a>
              <a
                className="ha-button"
                href="/history/data/questions.json"
                download
              >
                Download MCQs
              </a>
            </div>
            <input
              hidden
              ref={importRef}
              type="file"
              accept="application/json,.json"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                e.target.value = "";
                if (!file) return;
                try {
                  if (file.size > 5000000)
                    throw new Error("Progress file must be smaller than 5 MB.");
                  const incoming = parseProgress(JSON.parse(await file.text()));
                  setProgress((p) => mergeProgress(p, incoming));
                  setMessage(
                    "Progress merged. Existing notes and drafts were preserved.",
                  );
                } catch (err) {
                  setMessage(
                    err instanceof Error
                      ? err.message
                      : "Could not restore progress.",
                  );
                }
              }}
            />
            <p role="status">{message}</p>
          </>
        )}
        <footer className="ha-footer">
          <span>
            {documents.length} presentations ·{" "}
            {documents.reduce((n, d) => n + d.slideCount, 0).toLocaleString()}{" "}
            slides · source-linked study
          </span>
          <span>
            Reading completion and quiz recall are tracked separately.
          </span>
        </footer>
      </div>
    </div>
  );
}
function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
function Evidence({ links }: { links?: Question["evidence"] }) {
  if (!links?.length) return null;
  return (
    <div className="ha-evidence">
      {links.map((link) => (
        <a key={link.url} href={link.url} target="_blank" rel="noreferrer">
          {link.title} ↗
        </a>
      ))}
    </div>
  );
}

function SourceReading({
  refs,
  documents,
  reviews,
}: {
  refs: SourceRef[];
  documents: SourceDocument[];
  reviews: Curriculum["reviews"];
}) {
  return (
    <div className="ha-source-reading">
      {refs.map((ref, index) => {
        const d = documents.find((d) => d.id === ref.sourceId);
        if (!d) return null;
        return (
          <SourceBlock
            key={`${ref.sourceId}-${ref.from}-${index}`}
            document={d}
            reference={ref}
            reviews={reviews}
          />
        );
      })}
    </div>
  );
}
function SourceBlock({
  document: d,
  reference: r,
  reviews,
}: {
  document: SourceDocument;
  reference: SourceRef;
  reviews: Curriculum["reviews"];
}) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState(0);
  const slides = d.slides.filter((s) => s.number >= r.from && s.number <= r.to);
  const pageCount = Math.ceil(slides.length / 6);
  return (
    <details
      className="ha-source-block"
      onToggle={(e) => setOpen(e.currentTarget.open)}
    >
      <summary>
        {displayName(d)}{" "}
        <span>
          · slide {r.from}
          {r.to !== r.from ? `–${r.to}` : ""}
        </span>
      </summary>
      {open && (
        <>
          <p className="ha-original-label">
            Original slide text · may contain uncorrected claims. Images appear
            after extracted text; original layout is not reproduced.
          </p>
          {slides.slice(page * 6, page * 6 + 6).map((s) => (
            <article className="ha-slide" key={s.number}>
              <h4>Slide {s.number}</h4>
              {reviews
                .filter((rv) => rv.sourceId === d.id && rv.slide === s.number)
                .map((rv) => (
                  <div className="ha-notice" key={rv.id}>
                    <strong>
                      {rv.status === "corrected" ? "Correction" : "Review note"}
                      :
                    </strong>{" "}
                    {rv.note}
                    {rv.evidence.map((e) => (
                      <a
                        key={e.url}
                        href={e.url}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {e.title} ↗
                      </a>
                    ))}
                  </div>
                ))}
              {s.paragraphs.map((text, i) => (
                <p key={i}>{text}</p>
              ))}
              {s.images?.map((src, i) => (
                <a
                  href={src}
                  key={`${src}-${i}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    loading="lazy"
                    src={src}
                    alt={`Source illustration, ${displayName(d)}, slide ${s.number}, image ${i + 1}`}
                  />
                </a>
              ))}
              {!s.paragraphs.length && !s.images?.length && (
                <p>
                  No extractable text or supported image. Check the original
                  presentation.
                </p>
              )}
              {s.imageCount > (s.images?.length ?? 0) && (
                <p className="ha-notice">
                  Some embedded graphics require the original presentation.
                </p>
              )}
            </article>
          ))}
          {pageCount > 1 && (
            <div className="ha-pagination">
              <button
                disabled={page === 0}
                onClick={() => setPage((x) => x - 1)}
              >
                Previous slides
              </button>
              <span>
                Page {page + 1} of {pageCount}
              </span>
              <button
                disabled={page + 1 >= pageCount}
                onClick={() => setPage((x) => x + 1)}
              >
                Next slides
              </button>
            </div>
          )}
        </>
      )}
    </details>
  );
}
type Reference = (refs: SourceRef[]) => React.ReactNode;
function Study({
  topic: t,
  data,
  progress,
  update,
  openTopic,
  practice,
  reference,
}: {
  topic: Topic;
  data: HistoryData;
  progress: Progress;
  update: Update;
  openTopic: (id: string) => void;
  practice: () => void;
  reference: Reference;
}) {
  const [reveal, setReveal] = useState(false);
  const { curriculum: c, questions } = data;
  const index = c.topics.findIndex((x) => x.id === t.id);
  const stats = topicStats(t.id, questions, progress);
  const era = c.eras.find((e) => e.id === t.eraId)!;
  const reviews = c.reviews.filter((r) => r.topicId === t.id);
  const mains = c.mainsQuestions.filter((q) => q.topicId === t.id);
  return (
    <div className="ha-study-grid">
      <aside className="ha-study-nav">
        <label>
          <span>Choose a topic</span>
          <select value={t.id} onChange={(e) => openTopic(e.target.value)}>
            {c.eras.map((e) => (
              <optgroup key={e.id} label={e.title}>
                {c.topics
                  .filter((x) => x.eraId === e.id)
                  .map((x) => (
                    <option key={x.id} value={x.id}>
                      {x.title}
                      {x.status === "gap" ? " · gap" : ""}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
        </label>
        <div className="ha-card">
          <span className="ha-eyebrow">YOUR CHECKPOINT</span>
          <h3>
            {progress.studied[t.id] ? "Read & recalled" : "Ready to study"}
          </h3>
          <p>
            {stats.attempted}/{stats.total} questions attempted
          </p>
          <p>
            {stats.accuracy === null
              ? "No quiz evidence yet"
              : `${stats.accuracy}% correct on latest answers`}
          </p>
          <small>
            Small practice samples do not establish full topic mastery.
          </small>
        </div>
        <h3>Connected topics</h3>
        <div className="ha-connections">
          {t.related.map((id) => (
            <button key={id} onClick={() => openTopic(id)}>
              ↔ {c.topics.find((x) => x.id === id)?.title}
            </button>
          ))}
        </div>
        <Link to="/timeline">Explore the full timeline ↗</Link>
      </aside>
      <article className="ha-lesson">
        <div className="ha-eyebrow" style={{ color: era.color }}>
          {era.title} / {t.period}
        </div>
        <h2>{t.title}</h2>
        <p className="ha-lead">{t.summary}</p>
        {t.status === "gap" && (
          <div className="ha-notice">
            Coverage gap: this checklist identifies what to add. A full lesson
            and MCQs are not available yet.
          </div>
        )}
        <section className="ha-card">
          <h3>
            {t.status === "gap"
              ? "Build this lesson around"
              : "Understand these connections"}
          </h3>
          <ul>
            {t.checkpoints.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
        {reviews.map((r) => (
          <div className="ha-notice" key={r.id}>
            <strong>
              {r.status === "corrected"
                ? "Source correction"
                : "Check before memorising"}
              :
            </strong>{" "}
            {r.note}
            {r.evidence.map((e) => (
              <a href={e.url} key={e.url} target="_blank" rel="noreferrer">
                {e.title} ↗
              </a>
            ))}
          </div>
        ))}
        <h3 className="ha-spaced">Read the source material</h3>
        {t.sources.length ? (
          reference(t.sources)
        ) : (
          <p className="ha-muted">
            No dedicated teaching slides have been mapped to this topic.
          </p>
        )}
        {t.status !== "gap" && (
          <section className="ha-recall">
            <span className="ha-eyebrow">CLOSE YOUR NOTES</span>
            <h3>Can you explain this topic in your own words?</h3>
            <p>
              Place it in time, explain what changed, give two concrete
              examples, and connect it to another topic.
            </p>
            <button aria-expanded={reveal} onClick={() => setReveal((x) => !x)}>
              {reveal ? "Hide recall checklist" : "Show recall checklist"}
            </button>
            {reveal && (
              <ul>
                {t.checkpoints.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            )}
            <div className="ha-actions">
              <button
                className="ha-primary"
                onClick={() =>
                  update((p) => {
                    const studied = { ...p.studied };
                    if (studied[t.id]) delete studied[t.id];
                    else studied[t.id] = Date.now();
                    return { ...p, studied };
                  })
                }
              >
                {progress.studied[t.id]
                  ? "✓ Studied · mark unread"
                  : "Mark read & recalled"}
              </button>
              <button disabled={!stats.total} onClick={practice}>
                Practise {stats.total} MCQs →
              </button>
            </div>
          </section>
        )}
        <label className="ha-notes">
          <span>My notes & questions</span>
          <textarea
            maxLength={50000}
            rows={5}
            value={progress.notes[t.id] ?? ""}
            placeholder="Write your explanation, a comparison, or something to verify…"
            onChange={(e) =>
              update((p) => ({
                ...p,
                notes: { ...p.notes, [t.id]: e.target.value },
              }))
            }
          />
          <small>
            Saved in this browser. Export a backup in Sources & coverage.
          </small>
        </label>
        {mains.length > 0 && (
          <section className="ha-card">
            <h3>Related mains prompts</h3>
            {mains.map((q) => (
              <p key={q.id}>
                <strong>{q.year}:</strong> {q.prompt}
              </p>
            ))}
          </section>
        )}
        <div className="ha-pagination">
          <button
            disabled={index === 0}
            onClick={() => openTopic(c.topics[index - 1].id)}
          >
            ← Previous topic
          </button>
          <button
            disabled={index === c.topics.length - 1}
            onClick={() => openTopic(c.topics[index + 1].id)}
          >
            Next topic →
          </button>
        </div>
      </article>
    </div>
  );
}
function Practice({
  data,
  progress,
  update,
  initialTopic,
  openTopic,
  reference,
}: {
  data: HistoryData;
  progress: Progress;
  update: Update;
  initialTopic: string;
  openTopic: (id: string) => void;
  reference: Reference;
}) {
  const { curriculum: c, questions } = data;
  const [era, setEra] = useState("all");
  const [topic, setTopic] = useState(
    c.topics.some((t) => t.id === initialTopic) ? initialTopic : "all",
  );
  const [mode, setMode] = useState<PracticeMode>("mixed");
  const [size, setSize] = useState(10);
  const [difficulty, setDifficulty] = useState("all");
  const [session, setSession] = useState<
    | {
        question: Question;
        order: number[];
      }[]
    | null
  >(null);
  const [position, setPosition] = useState(0);
  const [choice, setChoice] = useState<number | null>(null);
  const [results, setResults] = useState<Record<number, number | null>>({});
  const [finished, setFinished] = useState(false);
  const [flag, setFlag] = useState<string | null>(null);
  const scope = questions.filter(
    (q) =>
      (topic === "all" || q.topicId === topic) &&
      (era === "all" ||
        c.topics.find((t) => t.id === q.topicId)?.eraId === era) &&
      (difficulty === "all" || q.difficulty === difficulty),
  );
  const pool = filterPractice(scope, progress, mode);
  const start = (items: Question[]) => {
    setSession(
      shuffled(items)
        .slice(0, size || items.length)
        .map((question) => ({ question, order: shuffled([0, 1, 2, 3]) })),
    );
    setPosition(0);
    setResults({});
    setChoice(null);
    setFinished(false);
    setFlag(null);
  };
  const submitted = Object.prototype.hasOwnProperty.call(results, position);
  const current = session?.[position];
  const advance = () => {
    if (!session) return;
    if (!submitted) setResults((r) => ({ ...r, [position]: null }));
    if (position + 1 >= session.length) setFinished(true);
    else {
      setPosition((x) => x + 1);
      setChoice(null);
      setFlag(null);
    }
  };
  if (session && finished) {
    const answered = session.filter(
      (_, i) => results[i] !== null && results[i] !== undefined,
    );
    const correct = session.filter(
      (item, i) => results[i] === item.question.answerIndex,
    );
    const wrong = session.filter(
      (item, i) =>
        results[i] !== null &&
        results[i] !== undefined &&
        results[i] !== item.question.answerIndex,
    );
    return (
      <section className="ha-quiz-summary">
        <span className="ha-eyebrow">SESSION COMPLETE</span>
        <h2>
          {correct.length} correct out of {session.length}
        </h2>
        <p>
          {answered.length} answered · {session.length - answered.length}{" "}
          skipped · {percent(correct.length, answered.length)}% accuracy on
          answered questions
        </p>
        <p>
          Wrong answers are due for review now. Correct answers return after 1,
          3, 7, 14, then 30 days with successive correct reviews.
        </p>
        <div className="ha-actions">
          <button
            onClick={() => {
              setSession(null);
              setFinished(false);
            }}
          >
            Choose another session
          </button>
          <button
            disabled={!wrong.length}
            onClick={() => start(wrong.map((x) => x.question))}
          >
            Retry {wrong.length} mistakes
          </button>
        </div>
        <h3 className="ha-spaced">Review this session</h3>
        {session.map(({ question: q }, i) => (
          <details className="ha-card" key={q.id}>
            <summary>
              {results[i] === q.answerIndex
                ? "✓"
                : results[i] === null || results[i] === undefined
                  ? "Skipped"
                  : "Review"}{" "}
              · {q.prompt}
            </summary>
            <p>
              Your answer:{" "}
              {results[i] === null || results[i] === undefined
                ? "Skipped"
                : q.options[results[i]!]}
            </p>
            <p>
              <strong>Answer: {q.options[q.answerIndex]}</strong>
            </p>
            <p>{q.explanation}</p>
            <Evidence links={q.evidence} />
            <button onClick={() => openTopic(q.topicId)}>
              Read the topic →
            </button>
            {reference(q.sources)}
          </details>
        ))}
      </section>
    );
  }
  if (current && session) {
    const q = current.question;
    const correct = results[position] === q.answerIndex;
    return (
      <section className="ha-quiz">
        <div className="ha-section-heading">
          <span className="ha-eyebrow">
            QUESTION {position + 1} / {session.length} · {q.difficulty}
          </span>
          <button onClick={() => setFinished(true)}>Finish session</button>
        </div>
        <progress
          value={position}
          max={session.length}
          aria-label="Quiz progress"
        />
        <p className="ha-muted">
          {c.topics.find((t) => t.id === q.topicId)?.title} · Derived practice ·
          not an official key
        </p>
        <h2>{q.prompt}</h2>
        <div className="ha-options" role="group" aria-label="Answer choices">
          {current.order.map((option, i) => (
            <button
              key={option}
              disabled={submitted}
              aria-pressed={choice === option}
              className={`${choice === option ? "is-selected " : ""}${submitted && option === q.answerIndex ? "is-correct " : ""}${submitted && results[position] === option && option !== q.answerIndex ? "is-wrong" : ""}`}
              onClick={() => setChoice(option)}
            >
              <span>{String.fromCharCode(65 + i)}</span>
              <span>{q.options[option]}</span>
              {submitted && option === q.answerIndex && (
                <small>Correct answer</small>
              )}
            </button>
          ))}
        </div>
        {!submitted ? (
          <div className="ha-actions">
            <button
              className="ha-primary"
              disabled={choice === null}
              onClick={() => {
                if (choice === null || submitted) return;
                setResults((r) => ({ ...r, [position]: choice }));
                update((p) => ({
                  ...p,
                  questions: {
                    ...p.questions,
                    [questionKey(q)]: nextReview(
                      p.questions[questionKey(q)],
                      choice === q.answerIndex,
                    ),
                  },
                }));
              }}
            >
              Check answer
            </button>
            <button onClick={advance}>Skip</button>
          </div>
        ) : (
          <div
            className={`ha-feedback ${correct ? "correct" : "incorrect"}`}
            role="status"
          >
            <h3>{correct ? "Correct" : "Let’s revisit this"}</h3>
            <p>{q.explanation}</p>
            <Evidence links={q.evidence} />
            {reference(q.sources)}
            {c.reviews
              .filter(
                (r) => r.topicId === q.topicId && r.status === "corrected",
              )
              .map((r) => (
                <p key={r.id} className="ha-muted">
                  Source correction: {r.note}
                </p>
              ))}
            <button className="ha-primary" onClick={advance}>
              {position + 1 === session.length
                ? "See results"
                : "Next question →"}
            </button>
          </div>
        )}
        <details className="ha-flag">
          <summary>Flag a possible problem</summary>
          <label>
            <span>What needs checking?</span>
            <textarea
              rows={2}
              value={flag ?? progress.flags[questionKey(q)] ?? ""}
              onChange={(e) => setFlag(e.target.value)}
              maxLength={5000}
            />
          </label>
          <button
            onClick={() =>
              update((p) => ({
                ...p,
                flags: {
                  ...p.flags,
                  [questionKey(q)]:
                    (flag ?? progress.flags[questionKey(q)] ?? "").trim() ||
                    "Needs review",
                },
              }))
            }
          >
            Save flag locally
          </button>
          {progress.flags[questionKey(q)] && (
            <p role="status">Flag saved; included in your progress export.</p>
          )}
        </details>
      </section>
    );
  }
  return (
    <>
      <div className="ha-section-heading">
        <div>
          <h2>Turn recognition into recall.</h2>
          <p>
            Choose a focused set or mix eras. Every answer includes an
            explanation and source slides.
          </p>
        </div>
        <span className="ha-badge">{questions.length} starter MCQs</span>
      </div>
      <div className="ha-practice-setup">
        <div className="ha-card ha-practice-filters">
          <label>
            <span>Era</span>
            <select
              value={era}
              onChange={(e) => {
                setEra(e.target.value);
                setTopic("all");
              }}
            >
              <option value="all">All eras</option>
              {c.eras.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Topic</span>
            <select value={topic} onChange={(e) => setTopic(e.target.value)}>
              <option value="all">All topics in this era</option>
              {c.topics
                .filter((t) => era === "all" || t.eraId === era)
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                    {t.status === "gap" ? " (no MCQs yet)" : ""}
                  </option>
                ))}
            </select>
          </label>
          <label>
            <span>Review mode</span>
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as PracticeMode)}
            >
              <option value="mixed">Mixed practice</option>
              <option value="new">Not attempted</option>
              <option value="incorrect">Latest answer incorrect</option>
              <option value="due">Due for review</option>
            </select>
          </label>
          <label>
            <span>Question style</span>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="all">All styles</option>
              <option value="foundation">Foundation</option>
              <option value="application">Application & chronology</option>
            </select>
          </label>
          <label>
            <span>Session length</span>
            <select
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
            >
              <option value={10}>Up to 10 questions</option>
              <option value={20}>Up to 20 questions</option>
              <option value={0}>All matching questions</option>
            </select>
          </label>
        </div>
        <div className="ha-practice-start">
          <span className="ha-eyebrow">YOUR PRACTICE POOL</span>
          <strong>{pool.length}</strong>
          <p>
            {pool.length
              ? "questions match your selection"
              : "No questions match. Change the filters or explore a topic."}
          </p>
          <button
            className="ha-primary"
            disabled={!pool.length}
            onClick={() => start(pool)}
          >
            Start practice →
          </button>
          <small>
            Answers save as you go. Practice has no timer or negative marking. A
            page reload ends the current session but keeps submitted answer
            history.
          </small>
        </div>
      </div>
      <details className="ha-browse">
        <summary>Browse matching questions ({pool.length})</summary>
        {pool.map((q) => (
          <details key={q.id} className="ha-card">
            <summary>{q.prompt}</summary>
            <ol type="A">
              {q.options.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ol>
            <details>
              <summary>Reveal answer & explanation</summary>
              <p>
                <strong>{q.options[q.answerIndex]}</strong>
              </p>
              <p>{q.explanation}</p>
              <Evidence links={q.evidence} />
              {reference(q.sources)}
            </details>
          </details>
        ))}
      </details>
      <h3 className="ha-spaced">Topics to revisit</h3>
      <div className="ha-gap-list">
        {c.topics
          .map((t) => ({ t, s: topicStats(t.id, questions, progress) }))
          .filter(({ s }) => s.attempted > 0 && s.correct < s.attempted)
          .map(({ t, s }) => (
            <button
              key={t.id}
              onClick={() => {
                setTopic(t.id);
                setEra("all");
                setMode("incorrect");
              }}
            >
              <strong>{t.title}</strong>
              <span>
                {s.correct}/{s.attempted} latest answers correct
              </span>
              <span>Practise mistakes →</span>
            </button>
          ))}
      </div>
    </>
  );
}
function Mains({
  data,
  progress,
  update,
  openTopic,
  reference,
}: {
  data: HistoryData;
  progress: Progress;
  update: Update;
  openTopic: (id: string) => void;
  reference: Reference;
}) {
  const { curriculum: c } = data;
  const [year, setYear] = useState("all");
  const [topic, setTopic] = useState("all");
  const [search, setSearch] = useState("");
  const prompts = c.mainsQuestions.filter(
    (q) =>
      (year === "all" || String(q.year) === year) &&
      (topic === "all" || q.topicId === topic) &&
      q.prompt.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <div className="ha-section-heading">
        <div>
          <h2>The mains writing desk</h2>
          <p>
            {c.mainsQuestions.length} prompts transcribed from your
            past-question presentation. Years and marks reflect the deck;
            original examination papers have not been independently checked.
          </p>
        </div>
      </div>
      <div className="ha-filters">
        <label className="ha-search">
          <span>Search prompts</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Try Gandhi, integration, industrial…"
          />
        </label>
        <label>
          <span>Year</span>
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="all">All years</option>
            {[...new Set(c.mainsQuestions.map((q) => q.year))]
              .sort((a, b) => b - a)
              .map((y) => (
                <option key={y}>{y}</option>
              ))}
          </select>
        </label>
        <label>
          <span>Topic</span>
          <select value={topic} onChange={(e) => setTopic(e.target.value)}>
            <option value="all">All topics</option>
            {c.topics
              .filter((t) => c.mainsQuestions.some((q) => q.topicId === t.id))
              .map((t) => (
                <option value={t.id} key={t.id}>
                  {t.title}
                </option>
              ))}
          </select>
        </label>
      </div>
      <div className="ha-notice">
        Answer structure: define the issue → organise causes or arguments → give
        dated examples → consider limits or counterarguments → conclude. Drafts
        are yours; no automatic grading is claimed.
      </div>
      {prompts.map((q) => (
        <details className="ha-card ha-mains-question" key={q.id}>
          <summary>
            <span className="ha-badge">{q.year}</span>
            {q.prompt}
            {progress.drafts[q.id] && (
              <span className="ha-badge">Draft saved</span>
            )}
          </summary>
          <button onClick={() => openTopic(q.topicId)}>
            Study: {c.topics.find((t) => t.id === q.topicId)?.title} →
          </button>
          {reference(q.sources)}
          <label>
            <span>Your answer outline</span>
            <textarea
              rows={8}
              maxLength={50000}
              value={progress.drafts[q.id] ?? ""}
              onChange={(e) =>
                update((p) => ({
                  ...p,
                  drafts: { ...p.drafts, [q.id]: e.target.value },
                }))
              }
              placeholder="Introduction\nArguments and examples\nLimitations / alternative view\nConclusion"
            />
          </label>
          <p className="ha-muted">
            {
              (progress.drafts[q.id] ?? "").trim().split(/\s+/).filter(Boolean)
                .length
            }{" "}
            words · saved in this browser
          </p>
        </details>
      ))}
      {!prompts.length && (
        <p className="ha-empty">No prompts match your selection.</p>
      )}
    </>
  );
}
