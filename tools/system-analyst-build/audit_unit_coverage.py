#!/usr/bin/env python3
"""Measure how well a TECH2 unit's questions cover the syllabus's own phrases.

    python3 tools/system-analyst-build/audit_unit_coverage.py --unit 2
    python3 tools/system-analyst-build/audit_unit_coverage.py --unit 2 --thin 4 --priority-args

WHY THIS EXISTS AS A SCRIPT. The 2026-09-05 depth pass ran this audit by hand
and DEVLOG recorded that it "will be re-run" — so the next session either
rewrites it or, worse, trusts a half-remembered version of it. The per-leaf
count is the metric that is easy to compute and the one that misleads: a leaf
can sit at 12 questions and still leave a syllabus phrase the notification
names explicitly resting on a single question. That is coverage on paper and a
gap in practice. Unit 1's *limitations of operator overloading* was the worked
example — named in the syllabus, examined once.

WHY THE PATTERNS ARE DELIBERATELY BROAD. The same pass logged a false negative
worth not repeating: DevOps appeared to be stuck at 1 question, which was the
metric being wrong rather than the content. Three genuine DevOps questions had
landed (DORA lead time, trunk-based vs long-lived branches, CI security gating)
and none of them uses the word "DevOps". So each concept below matches the
vocabulary a question would ACTUALLY use, not just the syllabus's own noun.
When you add a concept, write the patterns the same way, and prefer a false
positive you can eyeball to a false negative that silently commissions a
duplicate question.

A count here is evidence, not a verdict. Read the matched stems before acting
on a number -- `--show` prints them.

TWO WAYS TO READ A LOW COUNT, AND THEY NEED DIFFERENT ACTIONS.

  1. A genuine hole. Nothing in the unit examines the concept at all. Unit 2's
     *evolution of the Internet and web architecture* was one: its leaf holds 12
     questions and every one of them is HTTP/DNS/TLS/Nginx operations, with not
     a line on how the architecture got that way. Worth commissioning.
  2. Not examined BY NAME, but examined. Diffuse concepts read low because a
     question exercises them without using the syllabus's noun. *Client-server
     communication* scores 2 in a unit where most questions involve a browser
     talking to a server. Commissioning against that number buys duplicates.

Distinguish them by reading the leaf, not by re-tuning the regex until the
number looks right -- a pattern edited until it agrees with you has stopped
measuring anything. Tighten a pattern only when you can name the specific
question it should have matched and did not.
"""

import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BANK = ROOT / "public/mpsc-system-analyst/data/questions.js"

# concept label -> regex matching how a question on it would really be worded.
# Keyed by unit. Concepts are the phrases the MPSC notification itself names.
CONCEPTS = {
    "2": {
        "Evolution of the Internet / web architecture": r"web architecture|evolution of the (?:internet|web)|arpanet|web ?1\.0|web ?2\.0|three-tier|n-tier",
        "Client-server communication": r"client-server|client/server|request-response|round ?trip|stateless protocol",
        "HTTP/HTTPS": r"\bhttps?\b|status code|\b(?:GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\b request|request header|response header|\b(?:200|301|302|304|400|401|403|404|500|503)\b|idempotent|content-type",
        "DNS and web hosting": r"\bdns\b|domain name|name ?server|\bTTL\b|\bA record\b|CNAME|MX record|resolver|icann|registrar|shared hosting|\bVPS\b",
        "HTML semantic elements": r"semantic (?:element|html|tag)|<(?:article|section|nav|aside|header|footer|main|figure)|landmark",
        "HTML forms": r"\bform\b|<input|<select|<textarea|method=|enctype|multipart/form-data|form validation|required attribute",
        "HTML multimedia / Canvas / SVG": r"<video|<audio|<canvas|\bsvg\b|getContext|multimedia|<picture|srcset",
        "Web accessibility standards": r"accessib|\baria\b|\bwcag\b|screen ?reader|alt text|role=|contrast ratio|keyboard navigab",
        "CSS fundamentals": r"\bcss\b|specificity|cascade|box model|selector|pseudo-class|pseudo-element|inherit|em\b|rem\b",
        "Flexbox": r"flex ?box|display: ?flex|flex-(?:direction|grow|shrink|basis|wrap)|justify-content|align-items",
        "CSS Grid": r"css grid|display: ?grid|grid-template|grid-area|grid-column|grid-row|\bfr\b unit",
        "Responsive web design": r"responsive|media quer|viewport|mobile-first|breakpoint|max-width:|min-width:",
        "Git version control": r"\bgit\b|commit|branch|merge conflict|rebase|pull request|\bHEAD\b|cherry-pick|stash|remote origin",
        "JavaScript language": r"javascript|\bjs\b|hoisting|closure|\bthis\b binding|prototype|let\b|const\b|\bvar\b|strict mode|type coercion|===",
        "DOM manipulation": r"\bdom\b|querySelector|getElementById|createElement|appendChild|innerHTML|textContent|node ?list",
        "Event handling": r"event (?:handl|listen|bubbl|captur|delegat)|addEventListener|preventDefault|stopPropagation|onclick",
        "Asynchronous programming": r"async|await|promise|callback|event loop|microtask|setTimeout|race condition|then\(",
        "JSON and Fetch API": r"\bjson\b|fetch\(|\bXHR\b|XMLHttpRequest|JSON\.(?:parse|stringify)|\bcors\b|preflight",
        "Frontend framework components": r"component|\bprops\b|\bJSX\b|render|virtual dom|reconcil|lifecycle|hook\b|useState|useEffect",
        "Frontend routing": r"routing|\brouter\b|client-side rout|route param|history api|deep link|SPA navigation",
        "State management": r"state management|\bredux\b|\bstore\b|reducer|\bvuex\b|context api|global state|immutab",
        "API integration (frontend)": r"api integration|consume (?:an )?api|api call|axios|loading state|error boundary|optimistic update",
        "Backend in PHP": r"\bphp\b|\$_(?:GET|POST|SESSION|SERVER|COOKIE)|composer|laravel|echo \$",
        "Backend in Python": r"\bpython\b|flask|django|fastapi|\bwsgi\b|\basgi\b|jinja|pip install",
        "RESTful APIs": r"\brest\b|restful|resource-based|endpoint|api version|hateoas|\bverb\b|status code semantics",
        # CRUD is almost never examined by that name -- it is examined as the HTTP
        # verb/status semantics of creating and mutating a resource. The first run
        # of this audit scored it 0 while the backend leaf held a POST-returns-201
        # question, an idempotent-retry question and an ETag optimistic-concurrency
        # question. Same failure mode as the DevOps false negative in DEVLOG.
        "CRUD operations": (r"\bcrud\b|create.{0,15}read.{0,15}update.{0,15}delete"
                            r"|insert.{0,20}update.{0,20}delete"
                            r"|\b201\b|created at its own uri|new .{0,20}resource now exists"
                            r"|(?:POST|PUT|PATCH|DELETE)\b.{0,40}(?:resource|record|order|entity)"
                            r"|idempoten|optimistic concurrency"),
        "Middleware": r"middleware|request pipeline|interceptor|\bnext\(\)|before.{0,10}handler",
        "Authentication and authorization": r"authenticat|authoriz|\bJWT\b|\boauth\b|\bSSO\b|bearer token|password hash|bcrypt|\bMFA\b|refresh token|\bRBAC\b",
        "Session and cookie management": r"session|cookie|\bSameSite\b|HttpOnly\b|secure flag|session fixation|session store",
        "ORM concepts": r"\borm\b|object-relational|active record|data mapper|eager load|lazy load|n\+1|migration",
        "WebSockets": r"websocket|\bws://|wss://|full-duplex|server-sent event|\bSSE\b|long poll",
        "Serverless computing": r"serverless|lambda|function-as-a-service|\bfaas\b|cold start|event trigger",
        "Docker": r"docker|container image|dockerfile|\blayer\b cach|docker-compose|\bOCI\b image|registry",
        "Kubernetes": r"kubernetes|\bk8s\b|\bpod\b|\bdeployment\b|\bservice\b mesh|kubelet|replicaset|ingress|helm",
        "CI/CD pipelines": r"\bci/cd\b|\bCI\b|continuous (?:integration|delivery|deployment)|pipeline|build stage|artifact|github actions|jenkins|DORA|trunk-based|deployment frequency|lead time",
        "Linux administration": r"linux|\bsystemd\b|\bcron\b|chmod|chown|file permission|\bsudo\b|package manager|\bapt\b|process signal|\bshell\b script",
        "Web servers / Nginx": r"nginx|apache|reverse proxy|virtual host|server block|load balanc|upstream|\bgzip\b|worker process",
        "Deployment and monitoring": r"deploy|blue-green|canary|rollback|observab|monitor|\blog aggregat|metric|alert|uptime|health check|\bSLO\b",
        "OWASP Top 10": r"owasp|top ?10|broken access control|security misconfig|insecure deserial|vulnerab",
        "SSL/TLS": r"\bssl\b|\btls\b|certificate|\bCA\b|handshake|cipher suite|\bHSTS\b|public key.{0,20}encrypt|mixed content",
        "CSRF": r"\bcsrf\b|cross-site request forgery|anti-forgery|state-changing request",
        "XSS": r"\bxss\b|cross-site scripting|escap(?:e|ing) output|sanitiz|content security policy|\bCSP\b",
        "SQL injection prevention": r"sql injection|sqli\b|parameteris|parameteriz|prepared statement|bound parameter|escape.{0,15}quote",
        "MVC architecture": r"\bmvc\b|model-view-controller|separation of concern|controller action|view layer",
        "Microservices architecture": r"microservice|service boundar|bounded context|monolith|distributed transaction|\bsaga\b|api gateway",
        "SOLID principles": r"\bsolid\b|single responsibility|open.{0,5}closed|liskov|interface segregation|dependency inversion",
        "Dependency management": r"dependency (?:management|resolution)|semantic version|semver|lock ?file|transitive dependency|\bnpm\b|package\.json|vendor",
        "Event-driven systems": r"event-driven|publish.{0,10}subscribe|pub/sub|message broker|\bkafka\b|event bus|eventual consist",
        "Caching": r"cach(?:e|ing)|\bCDN\b|\bETag\b|cache-control|\bredis\b|memcach|invalidat|stale-while",
        "Queue management": r"\bqueue\b|message queue|\brabbitmq\b|worker pool|dead-letter|backpressure|job\b",
        "AI-assisted web development": r"ai-assisted|copilot|code generat|\bLLM\b|prompt|generative ai|ai pair",
        "Generative AI APIs": r"generative ai api|completion api|token limit|streaming response|embedding|rate limit|model api",
        "Model Context Protocol (MCP)": r"model context protocol|\bmcp\b",
        "Web analytics": r"analytic|page ?view|bounce rate|funnel|\bGA4\b|event tracking|conversion|\bUTM\b",
        "Scalable deployment": r"scalab|horizontal scal|vertical scal|autoscal|stateless.{0,20}scale|sharding|replica",
        "Ethics, privacy and law": r"ethic|privacy|\bGDPR\b|consent|\bPII\b|data protection|retention polic|right to be forgotten|cookie ?law|accessibility law",
    },
}


def load_bank():
    src = BANK.read_text()
    return json.loads(src[src.index("["): src.rindex("]") + 1])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--unit", required=True, help="TECH2 unit number")
    ap.add_argument("--thin", type=int, default=3,
                    help="a concept at or below this many questions counts as thin")
    ap.add_argument("--show", action="store_true", help="print matched stems per concept")
    ap.add_argument("--priority-args", action="store_true",
                    help="emit the thin concepts as a ready --priority argument list")
    args = ap.parse_args()

    concepts = CONCEPTS.get(args.unit)
    if not concepts:
        raise SystemExit(f"no concept patterns defined for unit {args.unit!r}; "
                         f"have {sorted(CONCEPTS)}. Add them rather than running blind.")

    qs = [q for q in load_bank()
          if q.get("paper") == "TECH2" and str(q.get("unit")) == str(args.unit)]
    if not qs:
        raise SystemExit(f"no TECH2 unit {args.unit} questions in the bank -- refusing to "
                         f"report 0%% coverage, which would be the metric failing, not the data")

    # Match against stem + options + explanation. A question that only examines a
    # concept through its distractors still examines it.
    #
    # DO NOT add `sub` to this blob. The leaf names ARE lists of syllabus phrases
    # ("AI-assisted web development, generative AI APIs, Model Context Protocol,
    # analytics, ethics and law"), so including them makes every question in a leaf
    # match every concept its own leaf is named after. The first run of this script
    # did that and reported 20-odd concepts at exactly 12 -- which is the leaf size,
    # not a coverage measurement. A column of identical counts equal to the per-leaf
    # count means the metric is reading the tags instead of the questions.
    def blob(q):
        return " ".join([str(q.get("q", "")),
                         " ".join(str(v) for v in (q.get("opts") or {}).values()),
                         str(q.get("exp", ""))])

    blobs = [(q, blob(q)) for q in qs]
    rows = []
    for label, pat in concepts.items():
        rx = re.compile(pat, re.I)
        hits = [q for q, b in blobs if rx.search(b)]
        rows.append((len(hits), label, hits))
    rows.sort(key=lambda r: (r[0], r[1]))

    print(f"TECH2 unit {args.unit}: {len(qs)} questions, {len(concepts)} syllabus concepts")
    leaves = {}
    for q in qs:
        leaves[q.get("sub", "?")] = leaves.get(q.get("sub", "?"), 0) + 1
    print(f"leaves: {len(leaves)}, per-leaf counts {sorted(leaves.values())}\n")

    for n, label, hits in rows:
        mark = "THIN" if n <= args.thin else "    "
        print(f"  {mark} {n:3d}  {label}")
        if args.show and hits:
            for q in hits[:6]:
                print(f"            - [{q.get('id')}] {str(q.get('q',''))[:88]}")

    thin = [label for n, label, _ in rows if n <= args.thin]
    print(f"\n{len(thin)} concepts at or below {args.thin} questions.")
    uncovered = [label for n, label, _ in rows if n == 0]
    if uncovered:
        print(f"{len(uncovered)} with ZERO coverage: {uncovered}")

    if args.priority_args:
        print("\n--priority " + " ".join(f'"{t}"' for t in thin))


if __name__ == "__main__":
    main()
