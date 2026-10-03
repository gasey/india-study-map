#!/usr/bin/env node
/**
 * Regenerate gk-subtopics.json — the GK sub-topic of every
 * General Knowledge question in the bank.
 *
 * The staged papers print no section finer than "General
 * Knowledge", so a sub-topic can only come from the question's
 * content. This is that classifier: word-bounded keyword
 * matching, strong words (one classifies) vs weak words (three
 * needed), stem and options weighted in full and the
 * explanation's strong words counted as weak — "Nehru" inside
 * "Jawaharlal Nehru Port" must not turn a geography question
 * into history. Mizoram is the deliberate exception: its
 * vocabulary never appears incidentally, so a Mizo word counts
 * fully wherever it sits. gkKind=current (the build's own
 * curated signal) counts as a current-affairs signal.
 *
 * Usage:
 *   node tools/udc-ldc-build/classify_gk_subtopics.cjs
 *     dry run: prints the distribution and any difference from
 *     the checked-in table, and exits 1 if they differ — the
 *     table is this tool's output, so a difference means it was
 *     hand-edited, or the word lists below changed without a
 *     regeneration.
 *   node tools/udc-ldc-build/classify_gk_subtopics.cjs --write
 *     overwrites gk-subtopics.json after printing the same
 *     report, so a regeneration is reviewable before it lands.
 *
 * The categories are the syllabus's own GK sub-topics
 * (PLAN-UDC-LDC.md section 5) plus mizoram, which that
 * taxonomy makes a top-level subject; 'general' is the honest
 * catch-all where no signal clears the threshold. Measured on
 * the 1,500 GK questions: 433 current-affairs, 386 general,
 * 134 science-tech, 121 polity-constitution, 118 mizoram,
 * 94 economy, 75 geography, 70 general-science, 57
 * modern-indian-history, 12 art-culture. Random-sample audits
 * of every bucket read correctly. Boundary cases are inherent
 * to keyword classification: a static award or invention can
 * match 'prize'/'invented' and read as current affairs.
 */

const fs = require('fs');
const path = require('path');

const HERE = __dirname;
const REPO = path.resolve(HERE, '..', '..');
const BANK_TS = path.join(REPO, 'src', 'data', 'banks', 'mpsc-udc-ldc.ts');
const TABLE_PATH = path.join(HERE, 'gk-subtopics.json');

// The bank is a TypeScript file; strip the type-only syntax and
// evaluate the remaining const declarations. Same transformations
// the build's other JS tooling uses — the .ts has no type
// assertions inside initialisers, so this is exact, not a parse.
function loadBankQuestions() {
  let src = fs.readFileSync(BANK_TS, 'utf8');
  src = src.replace(/^import type .*$/gm, '');
  src = src.replace(/^export interface [\s\S]*?^\}\n/m, '');
  src = src.replace(/^(export )?const (\w+): [^=\n]+=/gm, '$1const $2 =');
  src = src.replace(/^export const (\w+)/gm, 'const $1');
  const load = new Function(src + '\nreturn { mpscUdcLdcQuestions };');
  return load().mpscUdcLdcQuestions;
}

const sectionOf = (q) => {
  const t = q.topicLabel.toLowerCase();
  if (t.includes('computer')) return 'computer';
  if (t.includes('arithmetic')) return 'arithmetic';
  if (t.includes('intelligence') || t.includes('reasoning')) return 'reasoning';
  if (t.includes('english')) return 'english';
  return 'gk';
};

// strong: specific to the domain; one hit is enough.
// weak: common in ordinary prose; needs two more weak hits to matter.
const TABLES = {
  mizoram: {
    strong: [
      'mizoram', 'mizo', 'aizawl', 'lunglei', 'saiha', 'serchhip', 'champhai',
      'khawzawl', 'mamit', 'kolasib', 'saitual', 'hnahthial', 'lumpung',
      'lunglei', 'lur', 'fawn', 'hnarsui', 'darlong', 'sialsui', 'tlawng',
      'dampa', 'bawng', 'pukpui', 'hri', 'awr', 'zodung', 'chawkbai', 'meilum',
      'tlawmngaihna', 'laldenga', 'zomi', 'hmar', 'pawi', 'lushai', 'mzu',
      'mlc', 'mla', 'zarkawt', 'bairabi', 'sairang', 'hawlkhaw', 'saizahawla',
      'chawngbawla', 'nghat', 'mizoram university', 'high court of mizoram',
      'mizoram police', 'mizoram legislative assembly', 'mizoram national front',
      'mnf', 'people’s conference', "people's conference", 'hills state movement',
      'mizo students', 'mizo hummingbird', 'mizo customary law', 'village council',
      'jhumming', 'shifting cultivation', 'bamboo', 'mizo language', 'mizoram\'s',
      'mpsc', 'gom', 'government of mizoram', 'mizoram day', 'chapchar kut',
      'mim kut', 'pawl kut', 'thalfavang kut', 'zomi nam ni', 'lakher', 'mara',
      'kaladan', 'sinlung', 'chin hills', 'chhimtuipui', 'tlawng', 'bairabi',
      'sairang', 'silchar', 'aizawl-sairang', 'lushai', 'lushai hills',
    ],
    weak: ['mizoram', 'mizo', 'aizawl', 'district', 'tribe', 'chief', 'chiefs',
      'customary', 'folklore', 'dance', 'festival', 'state', 'statehood'],
  },
  'current-affairs': {
    strong: [
      'recently', 'currently', 'current', 'latest', 'as of', 'in 2024', 'in 2025',
      'in 2026', 'in 2023', 'in 2022', '2024', '2025', '2026', 'launched',
      'inaugurated', 'resigned', 'champion', 'summit', 'conference',
      'g20', 'brics', 'asean', 'saarc', 'who', 'imf', 'world bank', 'wto', 'un',
      'nato', 'opec', 'oecd', 'fifa', 'olympics', 'commonwealth games', 'asian games',
      'world cup', 'nobel prize', 'pulitzer', 'booker prize', 'ramon magsaaysay',
      'bharat ratna', 'padma', 'arjuna award', 'major dhyan chand', 'jnanpith',
      'moto gp', 'formula', 't20', 'odi', 'test match', 'grand slam',
    ],
    weak: ['recent', 'new', 'now', 'year', 'month', 'announced', 'signed',
      'agreement', 'report', 'index', 'ranking', 'released', 'held', 'host',
      'winner', 'award', 'prize', 'medal', 'tournament', 'series'],
  },
  'modern-indian-history': {
    strong: [
      'gandhi', 'mahatma', 'salt march', 'dandi', 'arya samaj', 'nehru', 'ambedkar',
      'tagore', 'bhagat singh', 'netaji', 'subhas', 'quit india', 'non-cooperation',
      'civil disobedience', 'rowlatt', 'montagu', 'simon commission', 'plassey',
      'buxar', '1857', 'sepoy', 'east india company', 'british raj', 'freedom',
      'independence', 'indian national congress', 'swaraj', 'satyagraha',
      'chauri chaura', 'jallianwala', 'amritsar', 'partition', 'tilak', 'gokhale',
      'ranade', 'ram mohan roy', 'vidyasagar', 'rani lakshmibai', 'kunwar singh',
      'begum hazrat', 'khudiram', 'chandrashekhar azad', 'bismil', 'lajpat rai',
      'bipin chandra pal', 'banerjee', 'naoroji', 'bonnerjee', 'hume', 'ripon',
      'curzon', 'viceregal', 'viceroy', 'governor-general', 'doctrine of lapse',
      'subsidiarity', 'permanent settlement', 'ryotwari', 'mahalwari', 'deccan',
      'awadh', 'avadh', 'mughal', 'maratha', 'shivaji', 'sikh', 'guru gobind',
      'guru nanak', 'kabir', 'mirabai', 'basavanna', 'alvar', 'nayanar', 'bhakti',
      'sufi', 'chishti', 'suhrawardi', 'dargah', 'khalsa', 'satnami', 'puranic',
      'muslim league', 'moplah', 'malabar', 'khilafat', 'din-i-ilahi', 'tughlaq',
      'ghazi malik', 'nadir shah', 'ahmed shah abdali', 'bairabi', 'sairang'],
    weak: ['century', 'battle', 'revolt', 'rebellion', 'uprising', 'dynasty',
      'empire', 'colonial', 'princely state', 'king', 'ruler', 'war', 'treaty',
      'british', 'foreign', 'ancient', 'medieval', 'history', 'historical',
      'monument', 'inscription', 'excavat', 'archaeolog', 'vedic', 'indus valley',
      'maurya', 'gupta', 'sultanate', 'pallava', 'chola', 'satavahana', 'harsha',
      'kanishka', 'ashoka', 'napoleon', 'genghis', 'kublai', 'mongol', 'ottoman',
      'mesopotamia', 'roman', 'greece', 'egyptian', 'emperor', 'empress',
      'kingdom', 'panipat', 'european', 'europeans', 'dynasty'],
  },
  'art-culture': {
    strong: [
      'bharatanatyam', 'kathakali', 'odissi', 'kuchipudi', 'manipuri', 'sattriya',
      'mohiniyattam', 'kathak', 'garba', 'bhangra', 'giddha', 'lavani', 'chhau',
      'theyyam', 'koodiyattam', 'yakshagana', 'dashavatara', 'natyashastra', 'raga',
      'tala', 'dhrupad', 'khayal', 'ghazal', 'qawwali', 'baul', 'warli', 'madhubani',
      'pichwai', 'tanjore', 'pattachitra', 'phad', 'kalamkari', 'ikat', 'bandhani',
      'kanjivaram', 'banarasi', 'paithani', 'chikankari', 'zardozi', 'bidri',
      'channapatna', 'handloom', 'handicraft', 'classical dance', 'folk dance',
      'folk music', 'classical music', 'kumbh', 'langar', 'gurudwara', 'synagogue',
      'stupa', 'ajanta', 'ellora', 'khajuraho', 'konark', 'mahabalipuram', 'hampi',
      'pallava', 'chola', 'mughal miniature', 'rajput miniature', 'pahari', 'bundi',
      'kangra', 'basohli', 'deccani', 'apabhramsha', 'sangam', 'bharata', 'nritta',
      'nritya', 'natya', 'abhinaya', 'guru', 'gharana', 'baithak', 'mehfil',
      'ramleela', 'raslila', 'therukoothu', 'jatra', 'nautanki', 'tamasha', 'kuravanji',
      'upanishad', 'upanishads', 'veda', 'vedas', 'purana', 'puranas',
      'epic', 'epics', 'sanskrit', 'palm leaf', 'ramayana', 'mahabharata',
      'onam', 'pongal', 'bihu', 'pushkar', 'holi', 'diwali', 'deepavali',
      'losar', 'eid', 'id-ul-fitr', 'christmas', 'good friday', 'lohri',
      'baisakhi', 'sankranti', 'ugadi', 'navratri', 'durga puja',
      'ganesh chaturthi', 'ramzan', 'ramadan', 'mahavir jayanti',
      'buddh purnima', 'guru nanak jayanti', 'dussehra', 'vijayadashami',
      'rakhi', 'raksha bandhan', 'janmashtami', 'gudi padwa', 'chhath puja',
      'hornbill festival', 'carnival', 'fiesta', 'sangai festival',
      'tarnetar', 'karam', 'sohrai', 'basant panchami', 'jagoi', 'sattriya',
      'dance form', 'dance drama', 'music drama', 'musical drama',
    ],
    weak: ['festival', 'dance', 'music', 'art', 'paint', 'sculpt', 'temple',
      'mosque', 'church', 'palace', 'fort', 'cave', 'monument', 'heritage',
      'culture', 'cultural', 'traditional', 'classical', 'folk', 'literature',
      'poet', 'poetry', 'novel', 'author', 'book', 'written', 'legend',
      'mythology', 'myth', 'ritual', 'custom', 'tradition', 'craft',
      'weave', 'weaving', 'embroider', 'pottery', 'carpet', 'durrie'],
  },
  'polity-constitution': {
    strong: [
      'constitution', 'article', 'schedule', 'parliament', 'lok sabha', 'rajya sabha',
      'vidhan sabha', 'vidhan parishad', 'legislative assembly', 'legislative council',
      'president', 'prime minister', 'vice president', 'governor', 'chief minister',
      'speaker', 'chief justice', 'supreme court', 'high court', 'judiciary', 'judicial',
      'election commission', 'electoral', 'voter', 'ordinance', 'citizenship',
      'fundamental rights', 'directive principles', 'fundamental duties', 'panchayati raj',
      'panchayat', 'municipality', 'lokpal', 'lokayukta', 'civil service', 'collector',
      'district magistrate', 'sub-divisional', 'police station', 'ambassador',
      'high commissioner', 'diplomat', 'ipc', 'crpc', 'basic structure', 'amendment',
      'preamble', 'concurrent list', 'residuary', 'impeachment', 'prorogation',
      'money bill', 'no-confidence', 'collective responsibility', 'habeas corpus',
      'mandamus', 'certiorari', 'quo warranto', 'prohibition', 'public interest litigation',
      'pil', 'collegium', 'contempt', 'secular', 'sovereign', 'republic', 'federation',
      'union government', 'state government', 'council of ministers', 'cabinet',
      'attorney general', 'advocate general', 'solicitor general', 'comptroller',
      'auditor general', 'election commissioner', 'upsc', 'ssc', 'public service commission',
      'constituent assembly', 'objectives resolution', 'government of india act',
      'indian councils act', 'morley-minto', 'dyarchy', 'provincial autonomy',
      'evm', 'electronic voting machine', 'voting machine', 'voting',
      'representation of the people act', 'rpa', 'delimitation', 'electorate',
      'polling', 'ballot', 'symbol', 'election symbol',
    ],
    weak: ['law', 'legal', 'bill', 'act', 'statute', 'code', 'election', 'vote',
      'democracy', 'governance', 'government', 'administration', 'department',
      'ministry', 'secretary', 'officer', 'commission', 'authority', 'rule',
      'regulation', 'policy', 'scheme', 'programme', 'mission', 'right', 'duty',
      'citizen', 'people', 'public', 'state', 'centre', 'union', 'nomination',
      'membership', 'quota', 'reservation', 'minority', 'caste', 'religion',
      'community', 'welfare', 'social justice'],
  },
  geography: {
    strong: [
      'river', 'tributar', 'mountain', 'peak', 'hill', 'plateau', 'desert', 'ocean',
      'lake', 'island', 'glacier', 'estuary', 'delta', 'peninsula', 'ghat', 'himalaya',
      'monsoon', 'rainfall', 'climate', 'soil', 'alluvial', 'erosion', 'cyclone',
      'tsunami', 'earthquake', 'volcano', 'coral', 'reef', 'biome', 'flora', 'fauna',
      'endemic', 'sanctuary', 'national park', 'biosphere', 'wildlife', 'forest',
      'vegetation', 'latitude', 'longitude', 'equator', 'hemisphere', 'meridian',
      'tropic', 'arctic', 'antarctic', 'continent', 'ganga', 'gangotri', 'yamuna',
      'brahmaputra', 'godavari', 'krishna', 'kaveri', 'narmada', 'tapi', 'indus',
      'nile', 'amazon', 'danube', 'volga', 'mississippi', 'yangtze', 'pacific',
      'atlantic', 'andaman', 'nicobar', 'lakshadweep', 'thar', 'sahara', 'gobi',
      'kalahari', 'pass', 'waterway', 'watershed', 'basin', 'mangrove', 'wetland',
      'oil field', 'oilfield', 'oilfields', 'refinery', 'petrochemical',
      'geothermal', 'hot spring', 'hot springs', 'lagoon', 'oasis', 'savanna', 'tundra', 'taiga', 'steppe', 'prairie', 'pampas',
      'veld', 'drought', 'famine', 'irrigation', 'canal', 'dam', 'reservoir',
      'hydroelectric', 'solar energy', 'wind energy', 'tidal energy',
      'non-renewable', 'renewable', 'fossil fuel', 'coal', 'petroleum', 'natural gas',
      'mineral', 'ore', 'bauxite', 'mica', 'gypsum', 'limestone', 'quarry', 'mining',
      'geology', 'sediment', 'strata', 'crust', 'mantle', 'core', 'lithosphere',
      'atmosphere', 'hydrosphere', 'troposphere', 'stratosphere', 'ozone', 'greenhouse',
      'global warming', 'sea level', 'isotherm', 'pressure belt', 'jet stream',
      'el nino', 'la nina', 'trade wind', 'westerlies', 'polar easterlies',
    ],
    weak: ['world', 'country', 'countries', 'state', 'region', 'city', 'town',
      'village', 'capital', 'located', 'location', 'north', 'south', 'east', 'west',
      'northern', 'southern', 'eastern', 'western', 'coast', 'coastal', 'bay',
      'gulf', 'sea', 'harbour', 'port', 'map', 'district', 'border', 'boundary',
      'terrain', 'landscape', 'weather', 'temperature', 'humidity', 'season',
      'summer', 'winter', 'rainy', 'agriculture', 'cultivation', 'crop', 'harvest',
      'farming', 'irrigated', 'fertile', 'arid', 'dense', 'population', 'census',
      'urban', 'rural', 'settlement', 'migration', 'resources'],
  },
  economy: {
    strong: [
      'gdp', 'gnp', 'nnp', 'gva', 'inflation', 'deflation', 'recession', 'stagflation',
      'repo rate', 'bank rate', 'crr', 'slr', 'msme', 'fdi', 'fpi', 'fiscal', 'deficit',
      'revenue', 'capital expenditure', 'subsidy', 'subsidies', 'budget', 'gst', 'vat',
      'excise', 'customs duty', 'income tax', 'corporate tax', 'direct tax',
      'indirect tax', 'niti aayog', 'planning commission', 'reserve bank', 'rbi',
      'sebi', 'irdai', 'nafed', 'fci', 'msp', 'procurement', 'public distribution',
      'poverty line', 'unemployment', 'literacy rate', 'per capita', 'national income',
      'balance of payments', 'foreign exchange', 'forex', 'rupee', 'demonetisation',
      'jan dhan', 'mgnrega', 'aayushman bharat', 'pm kisan', 'mudra', 'start-up india',
      'make in india', 'skill india', 'digital india', 'swachh bharat', 'five year plan',
      'disinvestment', 'privatisation', 'privatization', 'nationalisation', 'globalization',
      'liberalisation', 'liberalization', 'world bank', 'imf', 'wto', 'asian development bank',
      'crude oil', 'petrol', 'diesel', 'commodity', 'bullion', 'stock exchange', 'sensex',
      'nifty', 'nse', 'bse', 'bond', 'equity', 'share', 'dividend', 'interest rate',
      'credit', 'banking', 'cooperative bank', 'regional rural bank', 'payment bank',
      'small finance bank', 'microfinance', 'self help group', 'chit fund', 'nbfc',
      'economic survey', 'union budget', 'railway budget', 'finance commission',
      'planning', 'five-year plan', 'green revolution', 'white revolution', 'blue revolution',
      'yellow revolution', 'pink revolution', 'operation flood', 'amul', 'food security act',
      'mgnrega', 'national rural employment', 'midday meal', 'public works', 'wage',
      'employment guarantee', 'pds', 'fair price shop', 'buffer stock', 'minimum support',
      'agricultural', 'farmer', 'kisan', 'land reform', 'tenancy', 'ceiling',
      'consolidation', 'cooperative', 'primary agricultural', 'grameen', 'microcredit',
      'venture capital', 'angel investor', 'startup', 'incubator', 'seed fund',
      'gross domestic', 'gross national', 'net national', 'factor cost', 'market price',
      'real gdp', 'nominal gdp', 'per capita income', 'human development', 'hdi',
      'gini', 'lorenz curve', 'multiplier', 'accelerator', 'liquidity', 'deficit financing',
      'deficit', 'surplus', 'stagflation', 'disinflation', 'reflation', 'depression',
      'recovery', 'boom', 'slowdown', 'growth rate', 'trade deficit', 'trade surplus',
      'current account', 'capital account', 'balance of trade', 'tariff', 'quota',
      'embargo', 'dumping', 'free trade', 'protectionism', 'import substitution',
      'export promotion', 'special economic zone', 'sez', 'eoi', 'mou', 'fema', 'fera',
      'bank rate', 'marginal standing', 'liquidity adjustment', 'open market',
      'statutory liquidity', 'cash reserve', 'priority sector', 'npa', 'non-performing',
      'capital adequacy', 'basel', 'insolvency', 'bankruptcy', 'securitisation',
      'payment system', 'payment systems', 'take off', 'takeoff', 'cashless',
      'digital currency', 'e-rupee', 'e-rupee', 'central bank digital currency',
      'cbdc', 'unified payments interface', 'upi', 'neft', 'rtgs', 'imps',
      'bbps', 'aeps', 'rupay', 'credit card', 'debit card', 'plastic money',
    ],
    weak: ['tax', 'money', 'market', 'trade', 'export', 'import', 'industry',
      'industrial', 'factory', 'production', 'consumer', 'demand', 'supply', 'price',
      'cost', 'profit', 'loss', 'income', 'expenditure', 'spending', 'saving',
      'investment', 'capital', 'wealth', 'poverty', 'poor', 'rich', 'growth',
      'development', 'scheme', 'yojana', 'mission', 'programme', 'fund', 'loan',
      'borrow', 'lending', 'debt', 'grant', 'aid', 'package', 'stimulus', 'salary',
      'pay', 'wage', 'labour', 'labor', 'worker', 'employment', 'job', 'recruitment',
      'economy', 'economic', 'financial', 'finance', 'bank', 'reserve', 'currency',
      'coin', 'note', 'cash', 'transaction', 'payment', 'purchase', 'sale', 'buy',
      'sell', 'profit', 'margin', 'turnover', 'output', 'yield', 'productivity',
      'infrastructure', 'power', 'energy', 'fuel', 'electricity', 'road', 'railway',
      'airport', 'port', 'telecom', 'internet', 'digital', 'technology', 'innovation',
      'entrepreneur', 'start-up', 'enterprise', 'business', 'commerce', 'commercial'],
  },
  'general-science': {
    strong: [
      'cell', 'cells', 'dna', 'rna', 'gene', 'genes', 'chromosome', 'genome', 'protein',
      'enzyme', 'carbohydrate', 'lipid', 'vitamin', 'mineral', 'nutrient', 'photosynthesis',
      'respiration', 'ecosystem', 'biodiversity', 'species', 'genus', 'organism',
      'bacteria', 'bacterial', 'virus', 'viral', 'fungal', 'fungus', 'algae', 'protozoa',
      'mammal', 'reptile', 'amphibian', 'bird', 'insect', 'pollinat', 'habitat', 'xylem',
      'phloem', 'stomata', 'chlorophyll', 'glucose', 'amino acid', 'neuron', 'synapse',
      'reflex', 'hormone', 'antibody', 'antigen', 'vaccine', 'vaccination', 'immunity',
      'immune', 'infection', 'pathogenic', 'endemic', 'epidemic', 'pandemic', 'outbreak',
      'symptom', 'diagnosis', 'prognosis', 'surgery', 'anaesthesia', 'anatomy',
      'physiology', 'pathology', 'haematology', 'cardiology', 'neurology', 'oncology',
      'dermatology', 'paediatric', 'gynaecology', 'obstetric', 'psychiatry',
      'ophthalmology', 'entomology', 'herpetology', 'ornithology', 'botany', 'zoology',
      'microbiology', 'biochemistry', 'genetics', 'evolution', 'natural selection',
      'mutation', 'hybridization', 'cloning', 'stem cell', 'embryo', 'foetus', 'placenta',
      'ovary', 'sperm', 'pollen', 'germination', 'pollination', 'fermentation',
      'pasteurisation', 'pasteurization', 'adulteration', 'malnutrition', 'obesity',
      'anaemia', 'anemia', 'goitre', 'rickets', 'scurvy', 'beriberi', 'pellagra',
      'kwashiorkor', 'marasmus', 'diabetes', 'hypertension', 'malaria', 'dengue',
      'chikungunya', 'typhoid', 'cholera', 'plague', 'leprosy', 'tuberculosis', 'polio',
      'measles', 'mumps', 'rubella', 'chickenpox', 'smallpox', 'influenza', 'swine flu',
      'sars', 'mers', 'ebola', 'zika', 'hiv', 'aids', 'cancer', 'tumour', 'carcinoma',
      'leukemia', 'asthma', 'arthritis', 'epilepsy', 'migraine', 'insomnia', 'alzheimer',
      'parkinson', 'sickle cell', 'haemophilia', 'thalassemia', 'down syndrome',
      'cystic fibrosis', 'muscular dystrophy', 'jaundice', 'hepatitis', 'cirrhosis',
      'hpv', 'rabies', 'tetanus', 'diphtheria', 'pertussis', 'bcg', 'dpt', 'mmr',
      'pulse polio', 'unicef', 'icmr', 'ayush', 'unani', 'homeopathy', 'allopathy',
      'drug', 'dosage', 'prescription', 'antibiotic', 'penicillin', 'aspirin',
      'paracetamol', 'ibuprofen', 'morphine', 'quinine', 'chloroquine', 'artemisinin',
      'disease', 'disorder', 'deficiency', 'hospital', 'doctor', 'patient', 'clinic',
      'medicine', 'health', 'nutrition', 'physician', 'surgeon', 'epidemic',
      'first aid', 'red cross', 'ambulance', 'midwife', 'blood', 'haemoglobin',
      'haemoglobin', 'platelet', 'plasma', 'serum', 'lymph', 'spleen', 'kidney', 'liver',
      'pancreas', 'intestine', 'stomach', 'lung', 'heart', 'brain', 'skull', 'ribcage',
      'femur', 'skull', 'retina', 'cornea', 'pupil', 'iris', 'optic', 'cochlea',
      'eardrum', 'taste bud', 'olfactory', 'nephron', 'neuron', 'ganglion', 'reflex arc',
      'central nervous', 'peripheral nervous', 'autonomic', 'sympathetic', 'parasympathetic',
      'cerebrum', 'cerebellum', 'medulla', 'spinal cord', 'cranium', 'vertebrae',
      'fertilisation', 'fertilization', 'ovulation', 'menstruation', 'puberty', 'puberty',
      'adolescence', 'zygote', 'embryology', 'parthenocarpy', 'parthenogenesis',
      'grafting', 'hybridisation', 'variegated', 'chloroplast', 'mitochondria',
      'ribosome', 'lysosome', 'vacuole', 'cytoplasm', 'nucleolus', 'chromatin',
      'centromere', 'chromatid', 'meiosis', 'mitosis', 'cell division', 'cell wall',
      'cell membrane', 'nuclear membrane', 'endoplasmic', 'golgi', 'plastid',
    ],
    weak: ['body', 'human', 'life', 'living', 'organ', 'tissue', 'blood', 'bone',
      'skin', 'hair', 'nail', 'muscle', 'nerve', 'digest', 'breathe', 'excrete',
      'reproduce', 'growth', 'health', 'hygiene', 'sanitation', 'clean', 'safe',
      'toxic', 'poison', 'allergy', 'pain', 'fever', 'cough', 'cold', 'infection',
      'germ', 'microbe', 'hygiene', 'diet', 'food', 'nutrient', 'calorie', 'energy',
      'exercise', 'yoga', 'meditation', 'mental', 'stress', 'child', 'maternal',
      'infant', 'mortality', 'birth', 'death', 'pregnant', 'pregnancy', 'breastfeeding',
      'lactation', 'weaning', 'adolescent', 'adolescence', 'teenage', 'adult', 'ageing',
      'aging', 'old age', 'elderly', 'senior', 'geriatric', 'paediatric', 'childhood',
      'infancy', 'puberty', 'menopause', 'hereditary', 'hereditary', 'inherit', 'trait',
      'recessive', 'dominant', 'sex-linked', 'genetic', 'inborn', 'congenital'],
  },
  'science-tech': {
    strong: [
      'atom', 'atomic', 'molecule', 'molecular', 'element', 'compound', 'mixture',
      'acid', 'base', 'alkali', 'oxide', 'hydroxide', 'carbonate', 'sulphate', 'nitrate',
      'chloride', 'electrolysis', 'electrolytic', 'cathode', 'anode', 'ion',
      'ionic', 'covalent', 'valence', 'oxidation', 'reduction', 'redox', 'molar', 'mole',
      'avogadro', 'dalton', 'mendeleev', 'periodic table', 'halogen', 'noble gas',
      'alkali metal', 'transition metal', 'lanthanide', 'actinide', 'isotope', 'isobar',
      'isotone', 'radioactivity', 'radioactive', 'alpha', 'beta', 'gamma ray', 'neutron',
      'proton', 'electron', 'quark', 'nucleus', 'orbit', 'orbital', 'quantum', 'photon',
      'laser', 'spectrum', 'wavelength', 'frequency', 'amplitude', 'resonance', 'doppler',
      'newton', 'force', 'pressure', 'pascal', 'joule', 'watt', 'volt', 'ampere', 'ohm',
      'farad', 'henry', 'tesla', 'weber', 'lumen', 'lux', 'calorie', 'entropy',
      'enthalpy', 'kinetic', 'potential energy', 'momentum', 'inertia', 'friction',
      'viscosity', 'surface tension', 'elasticity', 'stress', 'strain', 'buoyancy',
      'archimedes', 'bernoulli', 'charles', 'boyle', 'faraday', 'coulomb', 'kirchhoff',
      'lens', 'mirror', 'reflection', 'refraction', 'diffraction', 'interference',
      'polarisation', 'dispersion', 'prism', 'telescope', 'microscope', 'periscope',
      'sonar', 'radar', 'satellite', 'rocket', 'jet', 'turbine', 'engine', 'reactor',
      'fission', 'fusion', 'solar cell', 'photovoltaic', 'fuel cell', 'battery',
      'capacitor', 'semiconductor', 'diode', 'transistor', 'integrated circuit',
      'microprocessor', 'nano', 'polymer', 'plastic', 'rubber', 'glass', 'ceramic',
      'cement', 'steel', 'alloy', 'brass', 'bronze', 'stainless', 'galvanisation',
      'electroplating', 'smelting', 'roasting', 'calcination', 'leaching', 'distillation',
      'crystallisation', 'crystallization', 'filtration', 'sedimentation', 'decantation',
      'centrifugation', 'chromatography', 'sublimation', 'evaporation', 'condensation',
      'boiling', 'melting', 'freezing', 'barometer', 'thermometer', 'hygrometer',
      'anemometer', 'rain gauge', 'hydrometer', 'manometer', 'altimeter', 'speedometer',
      'odometer', 'seismograph', 'voltmeter', 'ammeter', 'galvanometer', 'multimeter',
      'spectrometer', 'calorimeter', 'electricity', 'electric', 'current', 'circuit',
      'resistance', 'resistor', 'conductor', 'insulator', 'magnet', 'magnetic',
      'electromagnet', 'electromagnetic', 'generator', 'motor', 'transformer', 'inductor',
      'ac', 'dc', 'static electricity', 'lightning', 'thunder', 'sound', 'ultrasound',
      'lpg', 'cng', 'png', 'biogas', 'ethanol', 'methane', 'propane', 'butane',
      'hydrogen', 'oxygen', 'nitrogen', 'carbon dioxide', 'sulphur dioxide',
      'carbon monoxide', 'liquefied petroleum gas',
      'infrared', 'ultraviolet', 'x-ray', 'gamma', 'microwave', 'radio wave', 'frequency',
      'hertz', 'decibel', 'echo', 'sonar', 'supersonic', 'aeroplane', 'aircraft', 'rocket',
      'spacecraft', 'orbit', 'geostationary', 'polar satellite', 'insat', 'irs', 'aryabhata',
      'bhaskara', 'kalpana', 'chandrayaan', 'mangalyaan', 'astrosat', 'gsat',
      'communication satellite', 'remote sensing', 'geosynchronous', 'apogee', 'perigee',
      'escape velocity', 'orbital velocity', 'black hole', 'white dwarf', 'nebula', 'galaxy',
      'quasar', 'pulsar', 'supernova', 'red giant', 'binary star', 'light year',
      'astronomical unit', 'parsec', 'eclipse', 'solstice', 'equinox', 'apogee',
      'asteroid', 'meteor', 'meteorite', 'comet', 'constellation', 'zenith', 'nadir',
      'meridian', 'apogee', 'perigee', 'syzygy', 'umbra', 'penumbra', 'solar', 'lunar',
      'eclipse', 'tide', 'tidal', 'spring tide', 'neap tide', 'universal time', 'ist',
      'greenwich', 'international date line', 'time zone', 'leap year', 'epoch',
    ],
    weak: ['science', 'scientific', 'experiment', 'laboratory', 'measure', 'measurement',
      'unit', 'meter', 'instrument', 'device', 'machine', 'tool', 'energy', 'power',
      'work', 'heat', 'light', 'sound', 'wave', 'motion', 'speed', 'velocity', 'acceleration',
      'gravity', 'weight', 'mass', 'density', 'volume', 'area', 'length', 'distance',
      'time', 'temperature', 'degree', 'celsius', 'fahrenheit', 'kelvin', 'scale',
      'formula', 'equation', 'law', 'principle', 'theory', 'discovery', 'invented',
      'inventor', 'discovered', 'scientist', 'chemist', 'physicist', 'astronomer',
      'mathematician', 'chemical', 'chemistry', 'physics', 'astronomy', 'physical',
      'natural', 'matter', 'mass', 'solid', 'liquid', 'gas', 'plasma', 'state', 'change',
      'process', 'method', 'technique', 'technology', 'technical', 'industrial', 'engineering',
      'computer', 'software', 'hardware', 'internet', 'network', 'data', 'information',
      'system', 'model', 'structure', 'function', 'cell', 'organ', 'tissue', 'molecule',
      'atom', 'particle', 'charge', 'electron', 'proton', 'neutron', 'ion', 'bond',
      'reaction', 'reactant', 'product', 'catalyst', 'enzyme', 'solution', 'solute',
      'solvent', 'soluble', 'insoluble', 'saturated', 'unsaturated', 'concentration',
      'dilute', 'acidic', 'basic', 'neutral', 'salt', 'indicator', 'litmus', 'phenolphthalein'],
  },
};

// A category that wins on its own words must also beat a question whose
// only signal is that the word "mizo" or "state" appeared once by accident.
const STRONG_WEIGHT = 3;
const WEAK_WEIGHT = 1;
const THRESHOLD = 3; // one strong hit, or three weak hits in one category

// Mizoram first, exactly as v2 left it: a Mizoram High Court Article-12
// question is a Mizoram question before it is a polity question. The
// remaining order is by how specific each category's vocabulary is —
// the more specific, the earlier it breaks ties.
const PRIORITY = [
  'mizoram', 'general-science', 'science-tech', 'economy', 'geography',
  'polity-constitution', 'modern-indian-history', 'art-culture',
  'current-affairs',
];

// Matching is word-bounded, not substring: t.includes('ion') also
// matches nation, option, constitution, station — that single bug
// put 436 of 671 "science-tech" questions there. Single words match
// as whole words; multi-word entries match as phrases. Each matched
// entry counts once, so a word repeated in stem + options +
// explanation does not stack.
function buildIndex() {
  const idx = {};
  for (const [cat, lists] of Object.entries(TABLES)) {
    // a word listed twice would count twice; dedupe so every
    // entry carries exactly one vote
    const uniq = (ws) => [...new Set(ws.map((w) => w.toLowerCase()))];
    idx[cat] = {
      strong: split(listLists(uniq(lists.strong))),
      weak: split(listLists(uniq(lists.weak))),
    };
  }
  return idx;
}
// split a word list into singles and phrases
function listLists(words) {
  const singles = [], phrases = [];
  for (const w of words) (w.includes(' ') ? phrases : singles).push(w);
  return { singles, phrases };
}
// A word matches with an optional plural: "festival" matches
// "Festivals", "country" matches "countries". Phrases match
// as written.
function split(lists) {
  const re = (w, plural) => {
    const esc = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const tail = plural
      ? (w.endsWith('y') ? '(s|ies)?' : '(s|es)?')
      : '';
    return new RegExp('(^|[^a-z0-9])' + esc + tail + '([^a-z0-9]|$)', 'i');
  };
  return {
    singles: lists.singles.map((w) => ({ w, re: re(w, true) })),
    phrases: lists.phrases.map((w) => ({ w, re: re(w, false) })),
  };
}
const IDX = buildIndex();

// The stem and options are the exam content; the explanation is
// meta-text that names whatever the solver reached for — "Nehru"
// inside "Jawaharlal Nehru Port" must not turn a geography
// question into history. So the explanation can only ever
// contribute weak-weight evidence, even for strong words.
function scoreText(stemOptions, explanation) {
  const out = {};
  const add = (cat, n) => { out[cat] = (out[cat] || 0) + n; };
  for (const [cat, lists] of Object.entries(IDX)) {
    let n = 0;
    for (const e of lists.strong.singles) if (e.re.test(stemOptions)) n += STRONG_WEIGHT;
    for (const e of lists.strong.phrases) if (e.re.test(stemOptions)) n += STRONG_WEIGHT;
    for (const e of lists.weak.singles) if (e.re.test(stemOptions)) n += WEAK_WEIGHT;
    for (const e of lists.weak.phrases) if (e.re.test(stemOptions)) n += WEAK_WEIGHT;
    // explanation: strong words count as weak, weak words not at all —
    // except Mizoram, whose vocabulary (Aizawl, Tlawng, Saizahawla…)
    // never appears incidentally. A "which state" question whose
    // explanation names Mizoram is a Mizoram question, whereas "Nehru"
    // inside "Jawaharlal Nehru Port" is a geography question about a
    // port. Mizo words are evidence wherever they sit.
    const mizFull = cat === 'mizoram';
    for (const e of lists.strong.singles) if (e.re.test(explanation)) n += mizFull ? STRONG_WEIGHT : WEAK_WEIGHT;
    for (const e of lists.strong.phrases) if (e.re.test(explanation)) n += mizFull ? STRONG_WEIGHT : WEAK_WEIGHT;
    if (n) add(cat, n);
  }
  return out;
}

function classifyGk(stemOptions, explanation, gkKind) {
  const s = scoreText(stemOptions, explanation);
  // gkKind is the build's own, curated signal — worth more than any
  // keyword, but a question whose stem names a domain stays in that
  // domain ("the current governor of Mizoram" is Mizoram first).
  if (gkKind === 'current') s['current-affairs'] = (s['current-affairs'] || 0) + STRONG_WEIGHT;
  let best = null, bestN = 0, tie = [];
  for (const cat of PRIORITY) {
    const n = s[cat] || 0;
    if (n > bestN) { best = cat; bestN = n; tie = [cat]; }
    else if (n === bestN && n > 0) tie.push(cat);
  }
  if (best && bestN >= THRESHOLD) return best;
  return 'general';
}

const stemOptionsOf = (q) =>
  [q.question, (q.options || []).join(' ')].filter(Boolean).join(' ');
const explanationOf = (q) => q.explanation || '';

const bucket = (q) => {
  const sec = sectionOf(q);
  if (sec !== 'gk') return sec;
  return classifyGk(stemOptionsOf(q), explanationOf(q), q.gkKind);
};

// The table's own _README, written on every regeneration so it
// cannot drift from the tool that produces the table.
const README = [
  'GK sub-topic per question, keyed by bank question id (slug-qNNN).',
  '',
  'Generated by classify_gk_subtopics.cjs (in this directory) —',
  'do not hand-edit; re-run it with --write. See the tool header',
  'for the matching rules, the measured distribution, and the',
  'boundary cases of the classification.',
  '',
  'The staged papers carry no section finer than "gk", so a',
  'sub-topic can only come from the question's content. The',
  'categories follow the taxonomy in PLAN-UDC-LDC.md section 5',
  '(current-affairs, modern-indian-history, art-culture,',
  'polity-constitution, geography, economy, general-science,',
  'science-tech) plus mizoram, which that taxonomy makes a',
  'top-level subject of its own. 'general' is the classifier's',
  'honest catch-all: a confident wrong label is worse than none.',
  '',
  'build_bank.py guards this file two ways — every GK question',
  'must have an entry, and every entry must match a question in',
  'the build — so a stale id fails the build instead of quietly',
  'dropping a classification.',
];


function main() {
  const write = process.argv.includes('--write');
  const Q = loadBankQuestions();

  const fresh = {};
  const counts = {};
  let gk = 0;
  for (const q of Q) {
    if (sectionOf(q) !== 'gk') continue;
    gk++;
    const b = bucket(q);
    fresh[q.id] = b;
    counts[b] = (counts[b] || 0) + 1;
  }
  console.log('GK questions: ' + gk);
  for (const [k, v] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
    console.log('  ' + k.padEnd(22) + v);
  }

  // Diff against the checked-in table. A regeneration after an
  // upstream change is reviewable before it lands, and a
  // hand-edited table is caught: the table is this tool's
  // output, so any difference is either an edit that should
  // have been a word-list change, or a stale regeneration.
  let old = {};
  if (fs.existsSync(TABLE_PATH)) {
    for (const [k, v] of Object.entries(
        JSON.parse(fs.readFileSync(TABLE_PATH, 'utf8')))) {
      if (!k.startsWith('_')) old[k] = v;
    }
  }
  const transitions = {};
  const examples = {};
  let changed = 0, added = 0, removed = 0;
  for (const [id, b] of Object.entries(fresh)) {
    const was = old[id];
    if (was === undefined) { added++; continue; }
    if (was !== b) {
      changed++;
      const key = was + ' -> ' + b;
      transitions[key] = (transitions[key] || 0) + 1;
      (examples[key] = examples[key] || []).push(id);
    }
  }
  for (const id of Object.keys(old)) if (!(id in fresh)) removed++;

  if (!changed && !added && !removed) {
    console.log('matches the checked-in table: no changes');
  } else {
    console.log('\nvs the checked-in table: ' + changed +
                ' reclassified, ' + added + ' added, ' + removed + ' removed');
    for (const [k, n] of Object.entries(transitions).sort((a, b) => b[1] - a[1])) {
      console.log('  ' + k + ': ' + n + '   e.g. ' + examples[k].slice(0, 3).join(', '));
    }
    if (added) console.log('  (new GK questions: ' + added + ')');
    if (removed) console.log('  (questions no longer in the bank: ' + removed + ')');
  }

  if (write) {
    const out = { _README: README };
    for (const [k, v] of Object.entries(fresh)) out[k] = v;
    fs.writeFileSync(TABLE_PATH, JSON.stringify(out, null, 1) + '\n');
    console.log('wrote ' + TABLE_PATH + ' (' + Object.keys(fresh).length + ' entries)');
    return;
  }
  if (changed || added || removed) process.exit(1);
}

if (require.main === module) main();
