// ============================================
// COMPREHENSIVE JLPT N5–N3 GRAMMAR REFERENCE (32 Lessons)
//
// Combines the 28 full N5–N4 lessons from nihongo-app with 4 N4–N3 bridge
// lessons (Transitive/Intransitive pairs, Volitional + ようと思う,
// Obligation なければならない, and Appearance/Hearsay そうだ/ようだ/らしい).
// ============================================

export interface GrammarExample {
  jp: string;
  reading: string;
  en: string;
}

export interface GrammarLesson {
  id: string;
  level: 'N5' | 'N4' | 'N3';
  order: number;
  title: string;
  idea: string;
  explanation: string;
  points: string[];
  examples: GrammarExample[];
}

export const GRAMMAR_LESSONS: GrammarLesson[] = [
  {
    "id": "sentence-structure",
    "level": "N5",
    "order": 1,
    "title": "Word Order — Subject-Object-Verb",
    "idea": "Japanese sentences put the verb at the end, and particles — not word order — show each word's grammatical job.",
    "explanation": "English relies heavily on word order (Subject-Verb-Object) to show who does what to whom. Japanese instead attaches small particles (助詞) directly after each word to mark its role — is it the topic, the subject, the object, the location? Because particles carry the meaning, word order is quite flexible; the one fixed rule is that the verb (or adjective/copula) comes at the very end of the sentence. This is called SOV order (Subject-Object-Verb).\n\nFor example, 私はパンを食べます (I eat bread) breaks down as 私+は (topic marker), then パン+を (object marker), then 食べます (verb, at the end). You could reorder it as パンを私は食べます and it still means the same thing, because を still marks パン as the object no matter where it sits in the sentence — only the verb's position at the end is fixed.\n\nBecause the verb comes last, listeners often don't know whether a sentence is affirmative, negative, a question, or past tense until the very last word — so get comfortable listening or reading all the way to the end before assuming you know the meaning. Also, subjects and objects are frequently dropped entirely when they're clear from context; this comes up again and again in the lessons ahead.",
    "points": [
      "Verb (or adjective/copula) always comes at the end of the sentence.",
      "Particles mark grammatical role, not word order — order can shift as long as the particle stays attached to its word.",
      "Subjects and objects are often omitted when they're understood from context."
    ],
    "examples": [
      {
        "jp": "私はパンを食べます。",
        "reading": "わたしはぱんをたべます。",
        "en": "I eat bread."
      },
      {
        "jp": "パンを私は食べます。",
        "reading": "ぱんをわたしはたべます。",
        "en": "As for bread, I eat it. (same meaning, reordered)"
      },
      {
        "jp": "田中さんは毎朝コーヒーを飲みます。",
        "reading": "たなかさんはまいあさこーひーをのみます。",
        "en": "Mr. Tanaka drinks coffee every morning."
      },
      {
        "jp": "私は図書館で本を読みます。",
        "reading": "わたしはとしょかんでほんをよみます。",
        "en": "I read a book at the library."
      },
      {
        "jp": "弟が公園でサッカーをします。",
        "reading": "おとうとがこうえんでさっかーをします。",
        "en": "My little brother plays soccer at the park."
      }
    ]
  },
  {
    "id": "wa-vs-ga",
    "level": "N5",
    "order": 2,
    "title": "は vs が — Topic and Subject",
    "idea": "は marks what the sentence is about (the topic); が marks the grammatical subject, often introducing new or emphasized information.",
    "explanation": "Both は and が can translate to 'is/are' in English, but they do different jobs. は marks the topic — what the rest of the sentence is a comment about; it says 'as for X, ...'. が marks the grammatical subject of a verb or adjective, and it often puts focus on that word, frequently introducing new information the listener didn't already know.\n\nCompare 私は学生です (As for me, I am a student — は because 'I' is the topic being introduced) with だれが学生ですか (Who is a student? — が because the answer is the unknown, focused piece of information). When you answer a question like that, the answer typically also uses が: 田中さんが学生です (It is Tanaka who is the student).\n\nは is also used to set up contrast: 犬は好きですが、猫は好きじゃないです (I like dogs, but I don't like cats) — each は marks one item being compared against the other. A useful rule of thumb: use は for general statements, topics, and things already established in the conversation; use が for specific facts, new information, answers to 'who/what' questions, and with certain verbs of existence or perception such as ある, いる, わかる, and 好き.",
    "points": [
      "は = topic ('as for X'); が = grammatical subject, often new or focused information.",
      "Answers to 'who/what' questions typically use が.",
      "は is also used to set up contrast between two items.",
      "Verbs/adjectives like ある, いる, わかる, 好き often pair with が for the thing that exists, is understood, or is liked."
    ],
    "examples": [
      {
        "jp": "私は学生です。",
        "reading": "わたしはがくせいです。",
        "en": "I am a student."
      },
      {
        "jp": "だれが先生ですか。",
        "reading": "だれがせんせいですか。",
        "en": "Who is the teacher?"
      },
      {
        "jp": "山田さんが先生です。",
        "reading": "やまださんがせんせいです。",
        "en": "Yamada is the teacher."
      },
      {
        "jp": "犬は好きですが、猫は好きじゃないです。",
        "reading": "いぬはすきですが、ねこはすきじゃないです。",
        "en": "I like dogs, but I don't like cats."
      },
      {
        "jp": "私は日本語がわかります。",
        "reading": "わたしはにほんごがわかります。",
        "en": "I understand Japanese."
      }
    ]
  },
  {
    "id": "wo-particle",
    "level": "N5",
    "order": 3,
    "title": "を — Marking the Direct Object",
    "idea": "を attaches to the noun that receives the action of a transitive verb.",
    "explanation": "を marks the direct object — the thing being acted upon. If a verb is transitive (it does something TO something), the noun right before を is what's being affected: reading a book, drinking water, watching TV.\n\nを is written with its own historical character but pronounced simply 'o' in modern speech. It always comes directly after the noun and before the verb, since Japanese sentences are SOV as covered in the previous lesson.\n\nSome movement verbs, such as 歩く (to walk), 飛ぶ (to fly), and 散歩する (to take a walk), use を not for a true direct object but for the space or path being traversed — 公園を歩きます (to walk through the park). This is a common special case worth remembering separately from ordinary direct objects.",
    "points": [
      "Noun + を + transitive verb: を marks what receives the action.",
      "を is pronounced 'o'.",
      "With movement verbs (歩く, 渡る, 散歩する), を marks the path or space traveled through, not an object being changed."
    ],
    "examples": [
      {
        "jp": "毎朝新聞を読みます。",
        "reading": "まいあさしんぶんをよみます。",
        "en": "I read the newspaper every morning."
      },
      {
        "jp": "水を飲みます。",
        "reading": "みずをのみます。",
        "en": "I drink water."
      },
      {
        "jp": "友達に手紙を書きます。",
        "reading": "ともだちにてがみをかきます。",
        "en": "I write a letter to my friend."
      },
      {
        "jp": "テレビを見ますか。",
        "reading": "てれびをみますか。",
        "en": "Do you watch TV?"
      },
      {
        "jp": "毎日公園を散歩します。",
        "reading": "まいにちこうえんをさんぽします。",
        "en": "I take a walk through the park every day."
      }
    ]
  },
  {
    "id": "ni-de-particles",
    "level": "N5",
    "order": 4,
    "title": "に vs で — Existence/Time/Destination vs Place of Action",
    "idea": "に marks where something exists, a destination, or a point in time; で marks the location where an action happens.",
    "explanation": "に and で can both be translated 'at/in', but they answer different questions. に is used with verbs of existence (ある/いる, 'there is/are') to mark WHERE something is located, with movement verbs (行く/来る/帰る) to mark the DESTINATION, and with specific points in time to mark WHEN something happens.\n\nで marks the location where an action takes place — the stage on which something happens. If you can ask 'where did you do the action?', the answer takes で: 図書館で勉強します (I study AT the library — the studying happens there).\n\nContrast 図書館に本があります (There IS a book at the library — existence, に) with 図書館で本を読みます (I read a book AT the library — action happening there, で). For destinations: 学校に行きます (go TO school, に marks the destination) but 学校で勉強します (study AT school, で marks where the studying happens).\n\nFor time, specific points use に — 七時に起きます (wake up AT seven o'clock), 月曜日に働きます — but relative time words like 今日, 明日, 毎日, and 今 usually take no particle at all.",
    "points": [
      "に = existence location (ある/いる), destination (行く/来る/帰る), or a specific point in time.",
      "で = the location where an action takes place.",
      "学校に行きます (go to school) vs 学校で勉強します (study at school).",
      "Relative time words like 今日・明日・毎日 usually take no particle."
    ],
    "examples": [
      {
        "jp": "机の上に本があります。",
        "reading": "つくえのうえにほんがあります。",
        "en": "There is a book on the desk."
      },
      {
        "jp": "毎日図書館で勉強します。",
        "reading": "まいにちとしょかんでべんきょうします。",
        "en": "I study at the library every day."
      },
      {
        "jp": "七時に起きます。",
        "reading": "しちじにおきます。",
        "en": "I wake up at seven o'clock."
      },
      {
        "jp": "明日学校に行きます。",
        "reading": "あしたがっこうにいきます。",
        "en": "I will go to school tomorrow."
      },
      {
        "jp": "レストランでばんごはんを食べます。",
        "reading": "れすとらんでばんごはんをたべます。",
        "en": "I eat dinner at a restaurant."
      },
      {
        "jp": "公園に子供がいます。",
        "reading": "こうえんにこどもがいます。",
        "en": "There is a child at the park."
      }
    ]
  },
  {
    "id": "to-ya-mo-particles",
    "level": "N5",
    "order": 5,
    "title": "と・や・も — And, Among Others, and Too",
    "idea": "と lists items exhaustively, や lists a few examples non-exhaustively, and も means 'also/too'.",
    "explanation": "When Japanese connects nouns with 'and', it distinguishes between a complete, exhaustive list and a partial, example-style list. と means 'and' in the sense of a complete list: 犬と猫がいます means there are exactly a dog and a cat, and nothing else.\n\nや also means 'and', but implies the list is incomplete — a few representative examples out of possibly more: 犬や猫がいます suggests there's a dog, a cat, and maybe other animals too. や is often paired with など ('etc.') at the end for extra clarity: 犬や猫などがいます.\n\nも means 'also/too' and replaces は or が after a noun to show that noun shares a property with something already mentioned: 私は学生です。田中さんも学生です (I am a student. Tanaka is also a student).",
    "points": [
      "と = exhaustive 'and' (a complete list).",
      "や = non-exhaustive 'and' (a few examples, possibly more); often paired with など.",
      "も = 'also/too', and it replaces は/が on the noun it attaches to."
    ],
    "examples": [
      {
        "jp": "かばんの中に本とノートがあります。",
        "reading": "かばんのなかにほんとのーとがあります。",
        "en": "There is a book and a notebook in the bag (and nothing else)."
      },
      {
        "jp": "冷蔵庫に卵や野菜などがあります。",
        "reading": "れいぞうこにたまごややさいなどがあります。",
        "en": "There are eggs, vegetables, and so on in the fridge."
      },
      {
        "jp": "私はコーヒーと紅茶が好きです。",
        "reading": "わたしはこーひーとこうちゃがすきです。",
        "en": "I like coffee and tea."
      },
      {
        "jp": "兄は医者です。姉も医者です。",
        "reading": "あにはいしゃです。あねもいしゃです。",
        "en": "My older brother is a doctor. My older sister is also a doctor."
      },
      {
        "jp": "週末は映画や買い物を楽しみます。",
        "reading": "しゅうまつはえいがやかいものをたのしみます。",
        "en": "On weekends I enjoy things like movies and shopping, among others."
      }
    ]
  },
  {
    "id": "desu-copula",
    "level": "N5",
    "order": 6,
    "title": "です — The Polite Copula",
    "idea": "です links a noun or な-adjective to the subject as 'is/am/are', and changes form for negative and past tense.",
    "explanation": "です is the polite form of the copula — the word that connects a noun (or な-adjective, covered in a later lesson) to the subject, similar to 'is/am/are' in English. 学生です means 'I am a student.' です itself never conjugates by person or number; the same word covers I am, you are, and they are.\n\nTo negate, replace です with じゃないです (casual-polite) or じゃありません (more formal): 学生じゃないです / 学生じゃありません (I am not a student). To make it past tense, です becomes でした: 学生でした (I was a student). Past negative combines both changes: 学生じゃなかったです or 学生じゃありませんでした.\n\nThese four forms — present affirmative, present negative, past affirmative, past negative — form a pattern you will see again with い-adjectives and な-adjectives in the next two lessons, so learning this pattern well now pays off later.",
    "points": [
      "Present affirmative: Noun + です.",
      "Present negative: Noun + じゃないです / じゃありません.",
      "Past affirmative: Noun + でした.",
      "Past negative: Noun + じゃなかったです / じゃありませんでした."
    ],
    "examples": [
      {
        "jp": "私は学生です。",
        "reading": "わたしはがくせいです。",
        "en": "I am a student."
      },
      {
        "jp": "田中さんは先生じゃないです。",
        "reading": "たなかさんはせんせいじゃないです。",
        "en": "Mr. Tanaka is not a teacher."
      },
      {
        "jp": "昨日は休みでした。",
        "reading": "きのうはやすみでした。",
        "en": "Yesterday was a day off."
      },
      {
        "jp": "この店は昔、パン屋じゃありませんでした。",
        "reading": "このみせはむかし、ぱんやじゃありませんでした。",
        "en": "This shop wasn't a bakery in the past."
      },
      {
        "jp": "彼は医者じゃなかったです。",
        "reading": "かれはいしゃじゃなかったです。",
        "en": "He was not a doctor."
      }
    ]
  },
  {
    "id": "i-adjectives",
    "level": "N5",
    "order": 7,
    "title": "い-adjectives — Conjugation Patterns",
    "idea": "い-adjectives conjugate on their own, without needing です, by changing their final い.",
    "explanation": "Japanese has two types of adjectives that behave very differently: い-adjectives and な-adjectives (next lesson). い-adjectives end in い (暑い hot, 高い expensive/tall, 楽しい fun) and, unlike English adjectives, they conjugate by themselves for tense and negation without needing です to carry that information. です can still be added afterward for politeness, but it doesn't change the meaning.\n\nPresent affirmative is just the plain form: 暑いです (it's hot). Present negative drops the final い and adds くない: 暑くないです (it's not hot). Past affirmative drops い and adds かった: 暑かったです (it was hot). Past negative combines both: 暑くなかったです (it was not hot). Note that いい (good) is irregular — its negative and past forms are built from よ: よくない, よかった, よくなかった.\n\nTo turn an い-adjective into an adverb ('quickly', 'well'), drop い and add く: 早い → 早く (early/quickly). This く-form is also the same building block used in the negative conjugation above.",
    "points": [
      "Present: ~い(です). Negative: ~く+ない(です). Past: ~かった(です). Past negative: ~く+なかった(です).",
      "です after an い-adjective only adds politeness — it doesn't change tense or negation.",
      "いい (good) is irregular: よくない/よかった/よくなかった.",
      "Adverb form: drop い, add く (暑い→暑く)."
    ],
    "examples": [
      {
        "jp": "今日は暑いです。",
        "reading": "きょうはあついです。",
        "en": "Today is hot."
      },
      {
        "jp": "このケーキは甘くないです。",
        "reading": "このけーきはあまくないです。",
        "en": "This cake is not sweet."
      },
      {
        "jp": "昨日のテストは難しかったです。",
        "reading": "きのうのてすとはむずかしかったです。",
        "en": "Yesterday's test was difficult."
      },
      {
        "jp": "先週の天気はよくなかったです。",
        "reading": "せんしゅうのてんきはよくなかったです。",
        "en": "Last week's weather was not good."
      },
      {
        "jp": "弟は早く走ります。",
        "reading": "おとうとははやくはしります。",
        "en": "My little brother runs quickly."
      }
    ]
  },
  {
    "id": "na-adjectives",
    "level": "N5",
    "order": 8,
    "title": "な-adjectives — A Different Conjugation Pattern",
    "idea": "な-adjectives behave like nouns grammatically: they need だ/です for tense and negation, and な before modifying a noun.",
    "explanation": "な-adjectives (also called nominal adjectives) look like plain words — 静か quiet, 便利 convenient, 元気 healthy/energetic — but they never carry conjugation themselves. Grammatically they behave just like nouns and lean on だ/です exactly the way です worked in the previous copula lesson.\n\nPresent affirmative: 静かです. Present negative: 静かじゃないです/じゃありません. Past: 静かでした. Past negative: 静かじゃなかったです/じゃありませんでした — identical to the pattern for nouns+です.\n\nThe key difference from い-adjectives shows up when modifying a noun directly: な-adjectives insert な before the noun (静かな部屋, a quiet room), which is why they're called な-adjectives. い-adjectives need no extra particle before a noun (暑い日, a hot day) — just the plain adjective.\n\nSome words are easy to mistake for the wrong type: 元気 (healthy/energetic) and 有名 (famous) are な-adjectives even though they don't 'look' like typical adjectives; there's no shortcut except memorizing each word's type as you learn it.",
    "points": [
      "な-adjectives use だ/です for tense and negation, just like nouns.",
      "Present: ~です. Negative: ~じゃないです. Past: ~でした. Past negative: ~じゃなかったです.",
      "Before a noun, insert な: 静かな部屋 (a quiet room).",
      "い-adjectives need no extra particle before a noun: 暑い日 (a hot day)."
    ],
    "examples": [
      {
        "jp": "この部屋は静かです。",
        "reading": "このへやはしずかです。",
        "en": "This room is quiet."
      },
      {
        "jp": "静かな部屋が好きです。",
        "reading": "しずかなへやがすきです。",
        "en": "I like quiet rooms."
      },
      {
        "jp": "あの人は有名じゃないです。",
        "reading": "あのひとはゆうめいじゃないです。",
        "en": "That person is not famous."
      },
      {
        "jp": "子供の頃、この町は便利じゃありませんでした。",
        "reading": "こどものころ、このまちはべんりじゃありませんでした。",
        "en": "When I was a child, this town was not convenient."
      },
      {
        "jp": "田中さんは元気でした。",
        "reading": "たなかさんはげんきでした。",
        "en": "Mr. Tanaka was healthy."
      }
    ]
  },
  {
    "id": "verb-groups-masu",
    "level": "N5",
    "order": 9,
    "title": "Verb Groups and the Polite ~ます Form",
    "idea": "Japanese verbs fall into three conjugation groups, and each forms the polite present ~ます differently.",
    "explanation": "Japanese verbs split into three groups. Group 1 (godan/u-verbs) end in an u-row kana in dictionary form (書く, 話す, 飲む), and their stem changes vary by verb ending. Group 2 (ichidan/ru-verbs) end in -iru or -eru (食べる, 見る) and are simpler — you just drop る. Group 3 is the two irregulars: する (to do) and 来る (to come).\n\nTo build the polite ~ます present tense: for ichidan verbs, drop る and add ます (食べる→食べます, 見る→見ます). For godan verbs, change the final u-row kana to the matching i-row kana, then add ます (書く→書きます, 話す→話します, 飲む→飲みます, 買う→買います). For irregulars: する→します, 来る→来ます.\n\nYou can usually tell godan from ichidan by the ending: if a verb ends in -eru or -iru, it's very likely ichidan, but there are exceptions — 帰る ('to return') looks like it should be ichidan but is actually godan, so its ます-form is 帰ります, not 帰えます. These exceptions need to be memorized individually as you meet them.",
    "points": [
      "Ichidan (Group 2, -iru/-eru verbs): drop る, add ます. 食べる→食べます.",
      "Godan (Group 1, u-verbs): change the final u-sound to an i-sound, add ます. 飲む→飲みます, 書く→書きます.",
      "Irregulars (Group 3): する→します, 来る→来ます.",
      "A few verbs look ichidan but are actually godan (e.g. 帰る→帰ります), so memorize exceptions as you meet them."
    ],
    "examples": [
      {
        "jp": "毎朝パンを食べます。",
        "reading": "まいあさぱんをたべます。",
        "en": "I eat bread every morning."
      },
      {
        "jp": "手紙を書きます。",
        "reading": "てがみをかきます。",
        "en": "I write a letter."
      },
      {
        "jp": "水を飲みます。",
        "reading": "みずをのみます。",
        "en": "I drink water."
      },
      {
        "jp": "毎日勉強します。",
        "reading": "まいにちべんきょうします。",
        "en": "I study every day."
      },
      {
        "jp": "友達が明日日本に来ます。",
        "reading": "ともだちがあしたにほんにきます。",
        "en": "My friend is coming to Japan tomorrow."
      },
      {
        "jp": "六時に家に帰ります。",
        "reading": "ろくじにいえにかえります。",
        "en": "I go home at six o'clock."
      }
    ]
  },
  {
    "id": "masu-negative-past",
    "level": "N5",
    "order": 10,
    "title": "~ません・~ました・~ませんでした",
    "idea": "The ~ます form conjugates for negative and past by changing its ending, while the verb stem stays fixed.",
    "explanation": "Once a verb is in its ~ます stem, as built in the previous lesson, the four polite tense/negation forms all attach to that same stem, so you never have to think about godan/ichidan/irregular rules again once you're in ます-form. Present affirmative is ~ます; present negative is ~ません.\n\nPast affirmative is ~ました; past negative is ~ませんでした. Notice the pattern mirrors what you saw with です (です/じゃないです/でした/じゃなかったです) — polite verbs and the polite copula share a similar four-way tense/negation grid.\n\nFor example, with 飲む (to drink), stem 飲み: 飲みます (drink), 飲みません (don't drink), 飲みました (drank), 飲みませんでした (didn't drink). This pattern applies identically no matter which verb group the stem came from.",
    "points": [
      "Present negative: stem + ません.",
      "Past affirmative: stem + ました.",
      "Past negative: stem + ませんでした.",
      "The stem itself never changes across these four forms."
    ],
    "examples": [
      {
        "jp": "朝ごはんを食べません。",
        "reading": "あさごはんをたべません。",
        "en": "I don't eat breakfast."
      },
      {
        "jp": "昨日映画を見ました。",
        "reading": "きのうえいがをみました。",
        "en": "I watched a movie yesterday."
      },
      {
        "jp": "今朝新聞を読みませんでした。",
        "reading": "けさしんぶんをよみませんでした。",
        "en": "I didn't read the newspaper this morning."
      },
      {
        "jp": "先週は雨が降りませんでした。",
        "reading": "せんしゅうはあめがふりませんでした。",
        "en": "It didn't rain last week."
      },
      {
        "jp": "昨夜よく寝ました。",
        "reading": "さくやよくねました。",
        "en": "I slept well last night."
      }
    ]
  },
  {
    "id": "te-form",
    "level": "N5",
    "order": 11,
    "title": "Building the て-form",
    "idea": "The て-form is a single, tense-neutral verb form built with specific sound-change rules per verb group, used as the base for many later grammar patterns.",
    "explanation": "The て-form is one of the most important forms in Japanese — it's the base for requests, ongoing actions, permission, sequencing, and many patterns in later lessons. For ichidan verbs, drop る and add て: 食べる→食べて, 見る→見て. For irregulars, する→して, 来る→来て.\n\nGodan verbs change depending on their final kana, following these sound-change groups: う・つ・る endings become って (買う→買って, 待つ→待って, 帰る→帰って); む・ぶ・ぬ endings become んで (飲む→飲んで, 遊ぶ→遊んで, 死ぬ→死んで); く endings become いて (書く→書いて; note the exception 行く→行って); ぐ endings become いで (泳ぐ→泳いで); す endings become して (話す→話して).\n\nThese rules look like a lot at first, but they're identical to the rules for building the plain past ~た form — just swap the final て for た, or で for だ — so learning て-form well means you get た-form almost for free.",
    "points": [
      "Ichidan: drop る, add て (食べる→食べて).",
      "Irregulars: する→して, 来る→来て.",
      "Godan: う/つ/る→って, む/ぶ/ぬ→んで, く→いて (行く is an exception: 行って), ぐ→いで, す→して.",
      "た-form follows the same sound changes, swapping て→た and で→だ."
    ],
    "examples": [
      {
        "jp": "朝ごはんを食べて、学校に行きます。",
        "reading": "あさごはんをたべて、がっこうにいきます。",
        "en": "I eat breakfast and go to school."
      },
      {
        "jp": "友達を待って、一緒に映画を見ます。",
        "reading": "ともだちをまって、いっしょにえいがをみます。",
        "en": "I wait for my friend and watch a movie together."
      },
      {
        "jp": "本を読んで、寝ます。",
        "reading": "ほんをよんで、ねます。",
        "en": "I read a book and go to sleep."
      },
      {
        "jp": "手紙を書いて、送ります。",
        "reading": "てがみをかいて、おくります。",
        "en": "I write a letter and send it."
      },
      {
        "jp": "プールで泳いで、疲れました。",
        "reading": "ぷーるでおよいで、つかれました。",
        "en": "I swam at the pool and got tired."
      },
      {
        "jp": "友達が家に来て、一緒に勉強しました。",
        "reading": "ともだちがいえにきて、いっしょにべんきょうしました。",
        "en": "My friend came to my house and we studied together."
      }
    ]
  },
  {
    "id": "te-form-uses",
    "level": "N5",
    "order": 12,
    "title": "て-form for Joining Actions and ~てください",
    "idea": "て-form links a sequence of actions in one sentence, and ~てください turns a verb into a polite request.",
    "explanation": "Beyond being a building block, the て-form itself is used directly to join two or more actions into a single sentence in the order they happen, similar to English 'and then': 起きて、シャワーを浴びて、朝ごはんを食べます (I get up, take a shower, and eat breakfast). Only the final verb in the chain carries the sentence's real tense; the て-form verbs earlier are tense-neutral.\n\nて-form + ください creates a polite request or instruction, 'please do ~': 待ってください (please wait), ドアを開けてください (please open the door). This is one of the most common everyday uses of て-form, appearing in instructions, classroom language, and requests to strangers.\n\nBecause て-form doesn't mark tense itself, the overall sentence's tense comes only from the final verb — 昨日、家に帰って、宿題をしました means 'Yesterday I went home and did homework' (past, from した), even though 帰って carries no tense information on its own.",
    "points": [
      "Verb-て + Verb-て + ... + final verb = a sequence of actions; only the final verb shows tense.",
      "Verb-て + ください = a polite request, 'please do ~'.",
      "て-form itself carries no tense; the whole sentence's tense comes from the last verb."
    ],
    "examples": [
      {
        "jp": "朝起きて、顔を洗って、朝ごはんを食べます。",
        "reading": "あさおきて、かおをあらって、あさごはんをたべます。",
        "en": "I wake up, wash my face, and eat breakfast."
      },
      {
        "jp": "ここに座ってください。",
        "reading": "ここにすわってください。",
        "en": "Please sit here."
      },
      {
        "jp": "窓を開けてください。",
        "reading": "まどをあけてください。",
        "en": "Please open the window."
      },
      {
        "jp": "昨日、宿題をして、早く寝ました。",
        "reading": "きのう、しゅくだいをして、はやくねました。",
        "en": "Yesterday I did my homework and went to bed early."
      },
      {
        "jp": "少し待ってください。",
        "reading": "すこしまってください。",
        "en": "Please wait a moment."
      }
    ]
  },
  {
    "id": "te-iru",
    "level": "N5",
    "order": 13,
    "title": "~ている — Ongoing Actions and States",
    "idea": "~ている describes either an action in progress or a resulting state, depending on the type of verb.",
    "explanation": "て-form + いる (~ている) is Japanese's rough equivalent of '-ing', but its exact meaning depends on what kind of verb it attaches to. With continuous action verbs (食べる, 読む, 勉強する), it means the action is currently in progress, matching English '-ing': 本を読んでいます (I am reading a book).\n\nWith instantaneous change-of-state verbs (結婚する to marry, 死ぬ to die, 知る to come to know), ~ている instead describes the resulting STATE after the change happened, not an ongoing process, because the action itself is too quick to be 'in progress'. 結婚しています means 'I am married' (the state that resulted from marrying), not 'I am in the middle of marrying'.\n\nThis creates the well-known ambiguity beginners run into: for many verbs, context alone tells you whether ~ている means 'in the middle of doing X' or 'in the state that resulted from X'. 窓が開いています, for example, describes the window's current open state.\n\nCasual speech commonly drops the い in ~ている, saying ~てる instead: 食べてる, 読んでる — you'll hear this constantly, though ~ています is the standard polite form.",
    "points": [
      "Continuous verbs + ~ている = an action in progress ('is doing').",
      "Instantaneous/change verbs + ~ている = the resulting state ('is in the state of having done').",
      "結婚しています = 'I am married' (a state), not 'I am in the process of marrying'.",
      "Casual speech often shortens ~ている to ~てる."
    ],
    "examples": [
      {
        "jp": "今、本を読んでいます。",
        "reading": "いま、ほんをよんでいます。",
        "en": "I am reading a book right now."
      },
      {
        "jp": "弟はテレビを見ています。",
        "reading": "おとうとはてれびをみています。",
        "en": "My little brother is watching TV."
      },
      {
        "jp": "田中さんは結婚しています。",
        "reading": "たなかさんはけっこんしています。",
        "en": "Mr. Tanaka is married."
      },
      {
        "jp": "窓が開いています。",
        "reading": "まどがあいています。",
        "en": "The window is open."
      },
      {
        "jp": "彼はもう帰っています。",
        "reading": "かれはもうかえっています。",
        "en": "He has already gone home (and is home now)."
      }
    ]
  },
  {
    "id": "plain-form-intro",
    "level": "N5",
    "order": 14,
    "title": "Plain Form vs Polite ~ます Form",
    "idea": "Every verb has a plain (dictionary) form used in casual speech and inside larger grammar structures, alongside the polite ~ます form used for speaking politely.",
    "explanation": "So far every verb example has used the polite ~ます style, appropriate for speaking to strangers, teachers, or in formal contexts. But every verb also has a plain form — the dictionary form you'd look up in a dictionary: 食べる, 飲む, する, 来る. This is the form used in casual conversation with close friends and family.\n\nPlain form conjugates too: present affirmative is the dictionary form itself (食べる), negative is the ない-form (食べない), past is the た-form (食べた, built with the same sound changes as て-form), and past negative is なかった (食べなかった).\n\nBeyond casual speech, plain form is essential because most grammar patterns from here on — relative clauses that modify nouns, conditionals, quoting, and more — attach to plain form, not ます form. Even in polite conversations, these larger sentence patterns often end with です/ます, but their inner clauses stay in plain form.\n\nChoosing which style to use is about the social relationship, not correctness — です/ます isn't 'more correct' than plain form, it's simply more appropriate for distance and politeness, while plain form isn't 'rude', just casual.",
    "points": [
      "Plain present affirmative = the dictionary form (食べる).",
      "Plain present negative = the ない-form (食べない).",
      "Plain past = the た-form (食べた); plain past negative = the なかった-form (食べなかった).",
      "Grammar patterns often attach to plain form even inside an otherwise-polite sentence."
    ],
    "examples": [
      {
        "jp": "明日、友達と映画を見る。",
        "reading": "あした、ともだちとえいがをみる。",
        "en": "Tomorrow I'll watch a movie with a friend."
      },
      {
        "jp": "今日は学校に行かない。",
        "reading": "きょうはがっこうにいかない。",
        "en": "I'm not going to school today."
      },
      {
        "jp": "昨日、公園で走った。",
        "reading": "きのう、こうえんではしった。",
        "en": "I ran at the park yesterday."
      },
      {
        "jp": "朝ごはんを食べなかった。",
        "reading": "あさごはんをたべなかった。",
        "en": "I didn't eat breakfast."
      },
      {
        "jp": "彼は忙しいと思います。",
        "reading": "かれはいそがしいとおもいます。",
        "en": "I think he is busy."
      }
    ]
  },
  {
    "id": "noun-modification",
    "level": "N5",
    "order": 15,
    "title": "Modifying Nouns with Plain-Form Clauses",
    "idea": "To describe a noun with a clause ('the book that I read'), Japanese places the plain-form clause directly before the noun — no relative pronoun needed.",
    "explanation": "English needs a relative pronoun ('that', 'which', 'who') to attach a clause to a noun, as in 'the book that I read'. Japanese has no equivalent word; instead, you simply put the whole clause, ending in plain form, directly in front of the noun it describes: 私が読んだ本 (the book I read), literally 'I-read book'.\n\nThis works with verbs, い-adjectives, and な-adjectives (with な) alike, in any tense: 昨日買った服 (the clothes I bought yesterday), 静かな部屋 (a quiet room — actually the same mechanism you saw with な-adjectives before a noun), 難しい問題 (a difficult problem).\n\nBecause the modifying clause always uses plain form regardless of the overall sentence's politeness level, you'll often see です/ます sentences containing plain-form relative clauses: 私が昨日買った本はおもしろいです (The book I bought yesterday is interesting) — 買った is plain past, even though the sentence ends politely with です.\n\nThe subject of the inner clause, if different from the sentence's main topic, is often marked with が instead of は inside the modifying clause: 私が読んだ本 uses が for 'I' because 'I' is only the subject of 'read', not the topic of the whole sentence (which is 本, the book).",
    "points": [
      "Plain-form clause + noun = 'the noun that [clause]', with no relative pronoun.",
      "Works with verbs, い-adjectives, and な+noun (な-adjectives).",
      "The clause always stays in plain form, even inside a polite sentence.",
      "The clause's own subject is usually marked with が, not は."
    ],
    "examples": [
      {
        "jp": "これは私が昨日買った本です。",
        "reading": "これはわたしがきのうかったほんです。",
        "en": "This is the book I bought yesterday."
      },
      {
        "jp": "田中さんが作った料理はおいしいです。",
        "reading": "たなかさんがつくったりょうりはおいしいです。",
        "en": "The dish Tanaka made is delicious."
      },
      {
        "jp": "あそこで走っている人は兄です。",
        "reading": "あそこではしっているひとはあにです。",
        "en": "The person running over there is my older brother."
      },
      {
        "jp": "これは難しい問題です。",
        "reading": "これはむずかしいもんだいです。",
        "en": "This is a difficult problem."
      },
      {
        "jp": "私が住んでいる町は静かです。",
        "reading": "わたしがすんでいるまちはしずかです。",
        "en": "The town I live in is quiet."
      }
    ]
  },
  {
    "id": "counters",
    "level": "N5",
    "order": 16,
    "title": "Counters — つ, 人, 枚, 本",
    "idea": "Japanese attaches a different counting suffix depending on the shape or category of what's being counted, instead of using bare numbers.",
    "explanation": "In English we just say 'three apples', but Japanese numbers usually need a counter word attached that matches the category of object being counted. There is a generic, catch-all counter for miscellaneous small objects and abstract things: ひとつ、ふたつ、みっつ、よっつ、いつつ (1-5, using native Japanese numbers), useful when you don't know or don't need a more specific counter.\n\n人 (にん, but ひとり/ふたり for one and two people) counts people: 一人 (ひとり, one person), 二人 (ふたり, two people), 三人 (さんにん, three people). 枚 (まい) counts flat, thin objects like paper, tickets, or plates: 紙が三枚あります (there are three sheets of paper). 本 (ほん, sound-changing to ぼん or ぽん after certain numbers) counts long, cylindrical objects like bottles, pens, and umbrellas: ペンが二本あります (there are two pens).\n\nCounters exist because Japanese nouns have no singular/plural distinction, and numbers can't attach directly to a noun — they need a counter to bridge the number and the noun's category. There are dozens of counters in total, but つ, 人, 枚, and 本 cover a huge share of everyday situations.",
    "points": [
      "つ (ひとつ、ふたつ、みっつ...) = a generic counter, useful for miscellaneous objects.",
      "人 = people (一人 ひとり, 二人 ふたり, then 三人 さんにん onward).",
      "枚 = flat, thin objects (paper, tickets, plates).",
      "本 = long, cylindrical objects (bottles, pens, umbrellas); it sound-changes to ぼん/ぽん after certain numbers."
    ],
    "examples": [
      {
        "jp": "りんごを三つ買いました。",
        "reading": "りんごをみっつかいました。",
        "en": "I bought three apples."
      },
      {
        "jp": "教室に学生が五人います。",
        "reading": "きょうしつにがくせいがごにんいます。",
        "en": "There are five students in the classroom."
      },
      {
        "jp": "紙を二枚ください。",
        "reading": "かみをにまいください。",
        "en": "Please give me two sheets of paper."
      },
      {
        "jp": "かばんの中にペンが三本あります。",
        "reading": "かばんのなかにぺんがさんぼんあります。",
        "en": "There are three pens in the bag."
      },
      {
        "jp": "家族は四人です。",
        "reading": "かぞくはよにんです。",
        "en": "There are four people in my family."
      }
    ]
  },
  {
    "id": "question-words",
    "level": "N5",
    "order": 17,
    "title": "Question Words and the Sentence-Final か",
    "idea": "か at the end of a sentence turns it into a question, and specific question words ask for specific missing information.",
    "explanation": "To turn any statement into a yes/no question in Japanese, you don't need to change the word order at all — just add か to the end: 学生です→学生ですか (Are you a student?). This is much simpler than English's subject-verb inversion.\n\nTo ask for a specific piece of information, replace the unknown part of the sentence with a question word and still end with か: 何 (なに/なん, what), だれ (who), どこ (where), いつ (when), どう (how), どうして (why), いくつ (how many/what age), and いくら (how much money).\n\nQuestion words stay in the normal sentence position — wherever that piece of information would go — because Japanese doesn't front question words the way English does, and the particle that would mark that word's role still attaches to it: どこで勉強しますか (Where do you study?, で because 'where' is the location of the action), 何を食べますか (What do you eat?, を because 'what' is the object).",
    "points": [
      "Add か to the end of any sentence to make it a yes/no question.",
      "何 (なに/なん) what, だれ who, どこ where, いつ when, どう how, どうして why, いくつ how many, いくら how much.",
      "Question words keep their normal particle and sentence position — there's no fronting like in English."
    ],
    "examples": [
      {
        "jp": "あなたは学生ですか。",
        "reading": "あなたはがくせいですか。",
        "en": "Are you a student?"
      },
      {
        "jp": "これは何ですか。",
        "reading": "これはなんですか。",
        "en": "What is this?"
      },
      {
        "jp": "今どこにいますか。",
        "reading": "いまどこにいますか。",
        "en": "Where are you now?"
      },
      {
        "jp": "誕生日はいつですか。",
        "reading": "たんじょうびはいつですか。",
        "en": "When is your birthday?"
      },
      {
        "jp": "どうして日本語を勉強しますか。",
        "reading": "どうしてにほんごをべんきょうしますか。",
        "en": "Why do you study Japanese?"
      },
      {
        "jp": "このりんごはいくらですか。",
        "reading": "このりんごはいくらですか。",
        "en": "How much is this apple?"
      }
    ]
  },
  {
    "id": "comparisons",
    "level": "N5",
    "order": 18,
    "title": "Comparisons — より, ほど, and 一番",
    "idea": "より marks the thing being compared against, ~ほど~ない compares negatively, and 一番 marks a superlative.",
    "explanation": "To compare two things in Japanese ('A is more X than B'), mark the thing being compared against with より and put the adjective describing A at the end: 電車はバスより速いです (Trains are faster than buses — literally 'trains, compared-to buses, are fast'). より attaches to whatever 'than' is compared to in English.\n\nA common alternative pattern for negative comparison uses ~ほど~ない: バスは電車ほど速くないです (Buses are not as fast as trains — literally 'buses, to the extent of trains, are not fast'). This is useful when you want to say something is 'not as much as' rather than directly saying the other thing is 'more'.\n\nFor superlatives ('the most X'), add 一番 (いちばん, literally 'number one') before the adjective, often together with で marking the comparison group: この中で富士山が一番高いです (Among these, Mt. Fuji is the tallest). 一番 simply means 'most/number one' and slots in right before the adjective being emphasized.",
    "points": [
      "A + は + B + より + adjective = 'A is more [adjective] than B'.",
      "A + は + B + ほど + adjective-ない = 'A is not as [adjective] as B'.",
      "[group] + で + 一番 + adjective = 'the most [adjective] in/among [group]'."
    ],
    "examples": [
      {
        "jp": "電車はバスより速いです。",
        "reading": "でんしゃはばすよりはやいです。",
        "en": "Trains are faster than buses."
      },
      {
        "jp": "今日は昨日より寒いです。",
        "reading": "きょうはきのうよりさむいです。",
        "en": "Today is colder than yesterday."
      },
      {
        "jp": "バスは電車ほど速くないです。",
        "reading": "ばすはでんしゃほどはやくないです。",
        "en": "Buses are not as fast as trains."
      },
      {
        "jp": "兄は父ほど背が高くないです。",
        "reading": "あにはちちほどせがたかくないです。",
        "en": "My older brother is not as tall as my father."
      },
      {
        "jp": "家族の中で母が一番料理が上手です。",
        "reading": "かぞくのなかではははいちばんりょうりがじょうずです。",
        "en": "Among my family, my mother is the best at cooking."
      }
    ]
  },
  {
    "id": "potential-form",
    "level": "N4",
    "order": 19,
    "title": "Potential Form — 'Can Do'",
    "idea": "Verbs conjugate into a potential form meaning 'can do X', replacing the need for a separate word for 'can'.",
    "explanation": "To say you're able to do something, Japanese changes the verb itself into its potential form rather than adding a helper word like English 'can'. For ichidan verbs, drop る and add られる: 食べる→食べられる (can eat), 見る→見られる (can see). In casual speech this is often shortened to just ~れる (食べれる), called ら抜き言葉 ('ra-dropped speech') — common in speech but best avoided in formal writing.\n\nFor godan verbs, change the final u-row kana to the matching e-row kana and add る: 書く→書ける (can write), 話す→話せる (can speak), 飲む→飲める (can drink), 買う→買える (can buy). For irregulars, する→できる (can do), 来る→来られる (can come).\n\nPotential verbs behave like ordinary ichidan verbs once formed (食べられます, 書けます), and the object of a potential verb is often marked with が rather than を, since the sentence is really about your ability regarding that thing: 日本語が話せます (I can speak Japanese) is more natural than marking it with を, though を is also heard, especially when the object is far from the verb.\n\nできる deserves a special note: besides being the potential of する, it also stands alone as a general verb meaning 'to be possible/capable' — 日本語ができます (I'm capable with Japanese) is extremely common.",
    "points": [
      "Ichidan: -る→-られる (食べる→食べられる); casual ら抜き shortens it to -れる.",
      "Godan: change the u-row ending to the matching e-row kana + る (書く→書ける, 飲む→飲める).",
      "する→できる, 来る→来られる.",
      "The object of a potential verb often takes が instead of を."
    ],
    "examples": [
      {
        "jp": "私はすしが食べられます。",
        "reading": "わたしはすしがたべられます。",
        "en": "I can eat sushi."
      },
      {
        "jp": "漢字が少し読めます。",
        "reading": "かんじがすこしよめます。",
        "en": "I can read a little kanji."
      },
      {
        "jp": "田中さんは英語が話せます。",
        "reading": "たなかさんはえいごがはなせます。",
        "en": "Mr. Tanaka can speak English."
      },
      {
        "jp": "明日は早く来られますか。",
        "reading": "あしたははやくこられますか。",
        "en": "Can you come early tomorrow?"
      },
      {
        "jp": "姉は料理ができます。",
        "reading": "あねはりょうりができます。",
        "en": "My older sister can cook."
      }
    ]
  },
  {
    "id": "volitional-form",
    "level": "N4",
    "order": 20,
    "title": "Volitional Form — 'Let's / Shall We'",
    "idea": "The volitional form turns a verb into a suggestion or an expression of intention, 'let's do X' or 'I will do X'.",
    "explanation": "The volitional form is used to suggest doing something together or to state your own intention or resolve. For ichidan verbs, drop る and add よう: 食べる→食べよう (let's eat / I'll eat). For godan verbs, change the final u-row kana to the matching o-row kana and add う: 行く→行こう (let's go), 話す→話そう (let's talk), 飲む→飲もう (let's drink). For irregulars, する→しよう, 来る→来よう.\n\nThe polite equivalent, ~ましょう, is built from the ます-stem you already know (行きます→行きましょう) and is more appropriate when speaking politely, whereas the plain volitional above is for casual speech or for expressing private intention, often followed by と思う ('I think I will...').\n\n~ましょうか or the plain volitional + か can also offer to do something for someone: 手伝いましょうか (Shall I help you?), or 一緒に行こうか (Shall we go together?) — adding か softens a suggestion into a question, inviting the other person's input rather than just declaring it.",
    "points": [
      "Ichidan: -る→-よう (食べる→食べよう). Godan: u-row→o-row+う (行く→行こう, 飲む→飲もう). する→しよう, 来る→来よう.",
      "Polite equivalent: ます-stem + ましょう (行きましょう).",
      "Often followed by と思う to express personal intention: 勉強しようと思います.",
      "Adding か (行こうか / ましょうか) turns it into a softer offer or invitation."
    ],
    "examples": [
      {
        "jp": "一緒に映画を見よう。",
        "reading": "いっしょにえいがをみよう。",
        "en": "Let's watch a movie together."
      },
      {
        "jp": "そろそろ帰ろうか。",
        "reading": "そろそろかえろうか。",
        "en": "Shall we head home soon?"
      },
      {
        "jp": "来年、日本に行こうと思います。",
        "reading": "らいねん、にほんにいこうとおもいます。",
        "en": "I'm thinking I'll go to Japan next year."
      },
      {
        "jp": "少し休みましょう。",
        "reading": "すこしやすみましょう。",
        "en": "Let's take a little break."
      },
      {
        "jp": "荷物を持ちましょうか。",
        "reading": "にもつをもちましょうか。",
        "en": "Shall I carry your luggage?"
      }
    ]
  },
  {
    "id": "ta-form-uses",
    "level": "N4",
    "order": 21,
    "title": "~たことがある and ~たり~たりする",
    "idea": "~たことがある expresses past experience ('have done before'); ~たり~たりする lists a few example actions non-exhaustively.",
    "explanation": "To say you have, or haven't, experienced doing something at some point in your life, attach plain past (~た-form) + ことがある: 日本に行ったことがあります (I have been to Japan before). This is about lifetime experience, not a specific single occasion — for a specific past event you'd just use plain past ~た or ~ました instead.\n\nThe negative, ~たことがない, says you have never done something: 納豆を食べたことがないです (I have never eaten natto). This pattern is extremely common for talking about travel, food, and life experiences.\n\n~たり~たりする lists a few representative actions out of a larger set, parallel to the non-exhaustive や you saw with nouns — it says 'things like doing A and doing B, among others', not a complete, ordered list. Both verbs go into plain past +り, and the whole phrase ends with する, which itself takes whatever tense fits the context: 週末は本を読んだり、映画を見たりします (On weekends I do things like reading books and watching movies).\n\nBecause it's non-exhaustive, ~たり~たりする is perfect for describing typical, varied activity without claiming it's the complete list of what you do — contrast this with plain て-form sequencing from an earlier lesson, which does list actions in their actual order.",
    "points": [
      "Plain past + ことがある = 'have done X before' (life experience).",
      "Plain past + ことがない = 'have never done X'.",
      "Plain past(A) + り + Plain past(B) + り + する = 'do things like A and B, among others'.",
      "~たり~たりする is non-exhaustive and doesn't imply strict order, unlike て-form chaining."
    ],
    "examples": [
      {
        "jp": "日本に行ったことがあります。",
        "reading": "にほんにいったことがあります。",
        "en": "I have been to Japan before."
      },
      {
        "jp": "納豆を食べたことがないです。",
        "reading": "なっとうをたべたことがないです。",
        "en": "I have never eaten natto."
      },
      {
        "jp": "富士山に登ったことがありますか。",
        "reading": "ふじさんにのぼったことがありますか。",
        "en": "Have you ever climbed Mt. Fuji?"
      },
      {
        "jp": "週末は本を読んだり、音楽を聞いたりします。",
        "reading": "しゅうまつはほんをよんだり、おんがくをきいたりします。",
        "en": "On weekends I do things like read books and listen to music."
      },
      {
        "jp": "休みの日は掃除をしたり、洗濯をしたりします。",
        "reading": "やすみのひはそうじをしたり、せんたくをしたりします。",
        "en": "On days off I do things like clean and do laundry."
      }
    ]
  },
  {
    "id": "conditionals",
    "level": "N4",
    "order": 22,
    "title": "と・ば・たら・なら — Comparing Conditionals",
    "idea": "Japanese has four overlapping conditional forms, each with its own nuance about certainty, natural consequence, or discussing a topic already raised.",
    "explanation": "The と-conditional (plain form + と) expresses a natural, automatic, or inevitable consequence — great for habits, natural laws, and things that always happen: 春になると、桜が咲きます (When spring comes, cherry blossoms bloom). Because it implies an automatic result, と is awkward for one-time willed actions or for advice/requests in the result clause.\n\nThe ば-conditional (formed by changing the final u-row to the matching e-row and adding ば for verbs; い→ければ for い-adjectives; noun/な-adjective + なら) focuses on the condition itself as the key factor for the result, often used for hypotheticals and general advice: 安ければ、買います (If it's cheap, I'll buy it). ば is common in proverbs and general truths, and less natural for describing a known, one-time situation.\n\nThe たら-conditional (plain past + ら, so the た-form + ら for all word types) is the most flexible and colloquial, usable for hypothetical, one-time, and sequential situations, and it freely allows commands, suggestions, or requests in the result clause: 駅に着いたら、電話してください (When you arrive at the station, please call me).\n\nなら responds directly to something already mentioned or assumed, meaning 'if that's the case...' — it comments on a situation rather than setting up a hypothetical from scratch: 日本に行くなら、京都がおすすめです (If you're talking about going to Japan, I recommend Kyoto) — said in response to someone mentioning their trip plans.",
    "points": [
      "と = an automatic/natural consequence; no commands or requests in the result clause.",
      "ば = focuses on the condition as the key factor; common for hypotheticals and proverbs (安ければ, 静かなら).",
      "たら = the most flexible/colloquial; works for one-time events and allows commands or requests in the result.",
      "なら = responds to a topic already raised, 'if that's the case...'."
    ],
    "examples": [
      {
        "jp": "春になると、桜が咲きます。",
        "reading": "はるになると、さくらがさきます。",
        "en": "When spring comes, cherry blossoms bloom."
      },
      {
        "jp": "このボタンを押すと、電気がつきます。",
        "reading": "このぼたんをおすと、でんきがつきます。",
        "en": "If you press this button, the light turns on."
      },
      {
        "jp": "安ければ、そのかばんを買います。",
        "reading": "やすければ、そのかばんをかいます。",
        "en": "If it's cheap, I'll buy that bag."
      },
      {
        "jp": "駅に着いたら、電話してください。",
        "reading": "えきについたら、でんわしてください。",
        "en": "When you arrive at the station, please call me."
      },
      {
        "jp": "日本に行くなら、京都がおすすめです。",
        "reading": "にほんにいくなら、きょうとがおすすめです。",
        "en": "If you're going to Japan, I recommend Kyoto."
      }
    ]
  },
  {
    "id": "giving-receiving",
    "level": "N4",
    "order": 23,
    "title": "あげる・くれる・もらう — Direction of Giving",
    "idea": "Japanese uses three different verbs for 'give/receive' depending on the direction the giving moves, especially relative to the speaker.",
    "explanation": "English 'give' works the same regardless of direction, but Japanese requires a different verb depending on whether the giving moves away from the speaker's side or toward it. あげる is used when the speaker, or someone in the speaker's in-group, gives something to someone else: 私は友達に花をあげました (I gave flowers to my friend) — giving moves outward, away from 'me'.\n\nくれる is used when someone else gives something TO the speaker or the speaker's in-group — giving moves inward, toward 'me': 友達が私に花をくれました (My friend gave flowers to me). Even though both sentences could be 'translated' as 'give' in English, あげる and くれる are not interchangeable; they're chosen based on the direction relative to the speaker, not just who is the grammatical subject.\n\nもらう flips the perspective to the receiver's side, meaning 'to receive', with に or から marking who it came from: 私は友達に花をもらいました (I received flowers from my friend) — describing the same event as the くれる example above from the opposite point of view.\n\nA useful way to remember: if the arrow of giving points away from you, use あげる; if it points toward you, use くれる; if you're describing yourself as the receiver regardless of direction, use もらう. Choosing the right one signals whose perspective the sentence is told from, which is a very natural-sounding detail in Japanese.",
    "points": [
      "あげる = give, moving away from the speaker's side.",
      "くれる = give, moving toward the speaker's side (someone gives to me/us).",
      "もらう = receive, with に or から marking the giver.",
      "The same event can be described with different verbs depending on whose perspective is centered."
    ],
    "examples": [
      {
        "jp": "私は友達に誕生日のプレゼントをあげました。",
        "reading": "わたしはともだちにたんじょうびのぷれぜんとをあげました。",
        "en": "I gave my friend a birthday present."
      },
      {
        "jp": "友達が私に誕生日のプレゼントをくれました。",
        "reading": "ともだちがわたしにたんじょうびのぷれぜんとをくれました。",
        "en": "My friend gave me a birthday present."
      },
      {
        "jp": "私は先生にお土産をもらいました。",
        "reading": "わたしはせんせいにおみやげをもらいました。",
        "en": "I received a souvenir from my teacher."
      },
      {
        "jp": "弟に本をあげました。",
        "reading": "おとうとにほんをあげました。",
        "en": "I gave my little brother a book."
      },
      {
        "jp": "母がセーターをくれました。",
        "reading": "ははがせーたーをくれました。",
        "en": "My mother gave me a sweater."
      }
    ]
  },
  {
    "id": "passive-voice",
    "level": "N4",
    "order": 24,
    "title": "Passive Form — れる/られる",
    "idea": "The passive form shifts focus onto the person or thing affected by an action, and often carries a nuance of being inconvenienced (the 'suffering passive').",
    "explanation": "The passive form is built similarly to the potential form for godan verbs but always uses れる: change the final u-row kana to the matching a-row kana and add れる — 書く→書かれる (is written), 壊す→壊される (is broken). For ichidan verbs, drop る and add られる: 食べる→食べられる (is eaten) — identical in shape to the ichidan potential form, so context tells them apart. Irregulars: する→される, 来る→来られる.\n\nDirect passive works much like English passive voice, shifting focus to the receiver of an action: この本は有名な作家に書かれました (This book was written by a famous author) — the 'doer' of the action, if mentioned, is marked with に.\n\nJapanese also has a distinctive 'suffering passive' with no direct English equivalent: it's used even with intransitive verbs to show the speaker was negatively affected by someone else's action, often translating best as 'had something unfortunate happen to me because of X': 雨に降られました (literally 'was rained on', meaning the speaker got caught in the rain and it was a problem for them).\n\nThis suffering nuance is why passive sentences in Japanese often feel more emotionally loaded than plain English passive translations suggest — hearing a passive sentence about a person, rather than an inanimate object, is a strong hint that the speaker is expressing being affected or inconvenienced.",
    "points": [
      "Godan: u-row→a-row+れる (書く→書かれる). Ichidan: -る→-られる (食べる→食べられる). する→される, 来る→来られる.",
      "Direct passive: the doer of the action is marked with に.",
      "'Suffering passive' expresses that the speaker was negatively affected, even with intransitive verbs (雨に降られました).",
      "Passive sentences about people often carry an inconvenienced or affected nuance beyond plain English passive."
    ],
    "examples": [
      {
        "jp": "この本は有名な作家に書かれました。",
        "reading": "このほんはゆうめいなさっかにかかれました。",
        "en": "This book was written by a famous author."
      },
      {
        "jp": "このパソコンは兄に壊されました。",
        "reading": "このぱそこんはあににこわされました。",
        "en": "This computer was broken by my older brother."
      },
      {
        "jp": "昨日、雨に降られました。",
        "reading": "きのう、あめにふられました。",
        "en": "I got caught in the rain yesterday, and it was a bother."
      },
      {
        "jp": "電車の中で足を踏まれました。",
        "reading": "でんしゃのなかであしをふまれました。",
        "en": "My foot got stepped on inside the train."
      },
      {
        "jp": "子供の頃、よく兄にいじめられました。",
        "reading": "こどものころ、よくあににいじめられました。",
        "en": "When I was a child, I was often bullied by my older brother."
      }
    ]
  },
  {
    "id": "causative",
    "level": "N4",
    "order": 25,
    "title": "Causative Form — せる/させる",
    "idea": "The causative form expresses making or letting someone do something, with the meaning (force vs. permission) depending on context.",
    "explanation": "The causative form is built by changing a verb into a form meaning 'make/let [someone] do'. For godan verbs, change the final u-row kana to the matching a-row kana and add せる: 書く→書かせる (make/let write), 飲む→飲ませる (make/let drink). For ichidan verbs, drop る and add させる: 食べる→食べさせる (make/let eat). Irregulars: する→させる, 来る→来させる.\n\nWhether the meaning is 'force someone to do' or 'allow/let someone do' depends on context, and often on the particle marking the person: with transitive verbs, the person made to act is usually marked with に (先生は学生に漢字を書かせました, the teacher made the students write kanji), while with intransitive verbs the person may be marked with を (母は子供を公園で遊ばせました, the mother let her child play at the park).\n\nCausative sentences where a superior makes a subordinate do something (parent-child, teacher-student, boss-employee) usually lean toward the 'make/have someone do' reading, while causative + あげる often clarifies a 'let/allow' reading as a kindness: 先生は学生を早く帰らせてあげました (The teacher kindly let the students go home early).\n\nThe causative-passive form (させられる, or shortened to される for godan) combines both, expressing being made to do something against your will: 妹に野菜を食べさせられました (I was made to eat vegetables by my little sister) — useful for describing unwilling obligations.",
    "points": [
      "Godan: u-row→a-row+せる (書く→書かせる). Ichidan: -る→-させる (食べる→食べさせる). する→させる, 来る→来させる.",
      "Meaning ranges from 'force to do' to 'let/allow to do', depending on context.",
      "The person caused to act is often marked with に (transitive verbs) or を (intransitive verbs).",
      "Causative-passive (~させられる) = being made to do something unwillingly."
    ],
    "examples": [
      {
        "jp": "先生は学生に漢字を書かせました。",
        "reading": "せんせいはがくせいにかんじをかかせました。",
        "en": "The teacher made the students write kanji."
      },
      {
        "jp": "母は子供を公園で遊ばせました。",
        "reading": "はははこどもをこうえんであそばせました。",
        "en": "The mother let her child play at the park."
      },
      {
        "jp": "部長は私に資料を作らせました。",
        "reading": "ぶちょうはわたしにしりょうをつくらせました。",
        "en": "The manager had me prepare the materials."
      },
      {
        "jp": "先生は学生を早く帰らせてあげました。",
        "reading": "せんせいはがくせいをはやくかえらせてあげました。",
        "en": "The teacher kindly let the students go home early."
      },
      {
        "jp": "妹に野菜を食べさせられました。",
        "reading": "いもうとにやさいをたべさせられました。",
        "en": "I was made to eat vegetables by my little sister."
      }
    ]
  },
  {
    "id": "desire-tai-hoshii",
    "level": "N4",
    "order": 26,
    "title": "~たい vs ほしい — Wanting to Do vs Wanting a Thing",
    "idea": "~たい attaches to a verb stem to mean 'want to do [verb]', while ほしい is a separate い-adjective meaning 'want [a thing]'.",
    "explanation": "To say you want to DO something, attach たい to a verb's ます-stem: 食べます→食べたい (want to eat), 行きます→行きたい (want to go). ~たい then conjugates exactly like an い-adjective: 食べたいです (want to eat), 食べたくないです (don't want to eat), 食べたかったです (wanted to eat).\n\nTo say you want a THING, use ほしい, also an い-adjective, but attached directly after the noun with が rather than を: 水がほしいです (I want water), 新しいかばんがほしいです (I want a new bag). ほしい conjugates the same way as any other い-adjective: ほしくないです, ほしかったです.\n\nA key grammatical detail: when the object of a ~たい verb is a typical direct object, Japanese often marks it with が instead of を, echoing the potential-form pattern from an earlier lesson — 水が飲みたいです (I want to drink water) is more natural than marking it with を, though を is also acceptable, especially with distance between the object and the verb.\n\nBoth たい and ほしい describe the speaker's own desire by default; describing someone else's desire ('he wants to...') usually needs an extra layer like ~たがっている, which softens a direct assertion about another person's inner feelings — a nuance worth knowing exists even if you save the full pattern for later study.",
    "points": [
      "Verb ます-stem + たい = 'want to do X'; conjugates like an い-adjective.",
      "Noun + が + ほしい = 'want [a thing]'; ほしい is its own い-adjective.",
      "The object of ~たい is often marked with が instead of を.",
      "たい/ほしい describe the speaker's own desire by default."
    ],
    "examples": [
      {
        "jp": "今日は寿司が食べたいです。",
        "reading": "きょうはすしがたべたいです。",
        "en": "Today I want to eat sushi."
      },
      {
        "jp": "冷たい水が飲みたいです。",
        "reading": "つめたいみずがのみたいです。",
        "en": "I want to drink cold water."
      },
      {
        "jp": "新しい靴がほしいです。",
        "reading": "あたらしいくつがほしいです。",
        "en": "I want new shoes."
      },
      {
        "jp": "今は何もほしくないです。",
        "reading": "いまはなにもほしくないです。",
        "en": "I don't want anything right now."
      },
      {
        "jp": "子供の頃、犬がほしかったです。",
        "reading": "こどものころ、いぬがほしかったです。",
        "en": "When I was a child, I wanted a dog."
      }
    ]
  },
  {
    "id": "obligation-permission",
    "level": "N4",
    "order": 27,
    "title": "~なければならない vs ~なくてもいい",
    "idea": "~なければならない expresses obligation ('must do'), while ~なくてもいい expresses lack of obligation ('don't have to').",
    "explanation": "To say something must be done, take the verb's ない-form, drop the final い, and add ければならない: 行かない→行かなければならない (must go), 食べない→食べなければならない (must eat). This literally means something like 'if I don't do X, it won't do' — a double negative that lands on 'must'.\n\nIn casual speech this is often shortened to ~なきゃ or ~なくちゃ (行かなきゃ, 食べなくちゃ), extremely common in spoken Japanese even though it looks quite different from the full form — worth recognizing even before you use it yourself.\n\nTo say something is NOT required, take the ない-form, drop い, and add くてもいい: 行かなくてもいい (don't have to go), 食べなくてもいいです (don't have to eat) — literally 'even if you don't do X, it's fine'.\n\nThese two patterns are opposites in meaning but built from the same ない-form starting point, differing only in how the ending continues — ければならない pushes toward 'must', while くてもいい releases the obligation entirely. Note that these are about obligation, not ability or permission, which use the potential form and other patterns already covered.",
    "points": [
      "ない-form, drop い, + ければならない = 'must do X'.",
      "Casual contractions: ~なきゃ, ~なくちゃ.",
      "ない-form, drop い, + くてもいい = 'don't have to do X'.",
      "Both build off the same ない-form but diverge at the ending."
    ],
    "examples": [
      {
        "jp": "明日は早く起きなければなりません。",
        "reading": "あしたははやくおきなければなりません。",
        "en": "I have to wake up early tomorrow."
      },
      {
        "jp": "宿題を今日中にしなければなりません。",
        "reading": "しゅくだいをきょうじゅうにしなければなりません。",
        "en": "I must finish my homework by the end of today."
      },
      {
        "jp": "もう帰らなきゃ。",
        "reading": "もうかえらなきゃ。",
        "en": "I've got to go home now."
      },
      {
        "jp": "今日は残業しなくてもいいです。",
        "reading": "きょうはざんぎょうしなくてもいいです。",
        "en": "I don't have to work overtime today."
      },
      {
        "jp": "靴を脱がなくてもいいです。",
        "reading": "くつをぬがなくてもいいです。",
        "en": "You don't have to take off your shoes."
      }
    ]
  },
  {
    "id": "because-but",
    "level": "N4",
    "order": 28,
    "title": "から vs ので, and けど vs が",
    "idea": "から and ので both mean 'because', and けど and が both mean 'but' — the choice within each pair is about formality and how strongly to assert the reason.",
    "explanation": "から attaches after a plain-form clause to give a reason, and it carries a somewhat direct, subjective, speaker-focused feel — the natural choice when stating your own opinion, excuse, or when the reason is the main point of the sentence: 疲れたから、早く寝ます (Because I'm tired, I'll go to bed early). から can also stand alone as an answer to 'why?': どうして休みましたか。頭が痛かったからです (Why were you absent? Because I had a headache).\n\nので also attaches after a plain-form clause, with a small adjustment: な-adjectives and nouns insert な before ので. It gives a softer, more objective-sounding reason, common in polite requests, formal writing, and apologies, since it sounds less like the speaker is asserting a personal justification: 電車が遅れたので、遅刻しました (Because the train was late, I was late) reads more like a neutral report of fact than the から version would.\n\nFor 'but', が is the more neutral, slightly formal connector, usable in both writing and speech, attaching directly after a full clause: このレストランは高いですが、おいしいです (This restaurant is expensive, but it's delicious). けど is the casual spoken equivalent of が, common between friends, and it can even trail off at the end of a sentence to soften a statement: 行きたいんですけど... (I want to go, but... implying some hesitation or circumstance).\n\nIn short: から/けど lean casual and speaker-centered; ので/が lean neutral, objective, and safer for polite or written contexts. None of the four are 'wrong' in casual speech, but knowing the softer, more formal member of each pair matters once you need to sound polite or professional.",
    "points": [
      "から = a direct/subjective reason, plain-form + から, and it can stand alone as an answer to 'why'.",
      "ので = a softer/more objective reason, plain-form + ので (with な before ので for nouns/な-adjectives).",
      "が = a neutral 'but', usable in both speech and writing.",
      "けど = a casual spoken 'but', which can trail off to soften a statement."
    ],
    "examples": [
      {
        "jp": "疲れたから、早く寝ます。",
        "reading": "つかれたから、はやくねます。",
        "en": "Because I'm tired, I'll go to bed early."
      },
      {
        "jp": "電車が遅れたので、遅刻しました。",
        "reading": "でんしゃがおくれたので、ちこくしました。",
        "en": "Because the train was delayed, I was late."
      },
      {
        "jp": "静かなので、この部屋が好きです。",
        "reading": "しずかなので、このへやがすきです。",
        "en": "Because it's quiet, I like this room."
      },
      {
        "jp": "このレストランは高いですが、おいしいです。",
        "reading": "このれすとらんはたかいですが、おいしいです。",
        "en": "This restaurant is expensive, but it's delicious."
      },
      {
        "jp": "行きたいんですけど、時間がないです。",
        "reading": "いきたいんですけど、じかんがないです。",
        "en": "I want to go, but I don't have time."
      }
    ]
  },
  {
    "id": "transitive-intransitive",
    "level": "N4",
    "order": 29,
    "title": "自動詞 vs 他動詞 — Transitive & Intransitive Verb Pairs",
    "idea": "Intransitive verbs (自動詞) describe something happening on its own (marked by が); transitive verbs (他動詞) describe an agent doing an action to an object (marked by を).",
    "explanation": "Japanese systematically pairs intransitive verbs (自動詞, jidōshi — \"self-move verbs\") with transitive verbs (他動詞, tadōshi — \"other-move verbs\"). In English, the same word often does both jobs (\"The door opened\" vs \"I opened the door\"), whereas Japanese uses two distinct related verbs sharing the same kanji root: ドアが開く (doa ga aku — the door opens, intransitive with が) versus ドアを開ける (doa o akeru — I open the door, transitive with を).\n\nRecognizing three high-frequency stem patterns saves hundreds of hours of memorization:\n1. -aru (intransitive) vs -eru (transitive): 閉まる (shimaru, closes) / 閉める (shimeru, close it); 始まる (hajimaru, begins) / 始める (hajimeru, begin it); 集まる (atsumaru, gather) / 集める (atsumeru, collect); 決まる (kimaru) / 決める (kimeru).\n2. -reru (intransitive) vs -su (transitive): 壊れる (kowareru, breaks) / 壊す (kowasu, break it); 汚れる (yogoreru) / 汚す (yogosu).\n3. -ru (intransitive) vs -su (transitive): 出る (deru, exit) / 出す (dasu, take out); 戻る (modoru) / 戻す (modosu); 直る (naoru) / 直す (naosu).\n\nNotice how resulting state differs with 〜ている vs 〜てある: ドアが開いています (using intransitive 開く + ている) simply observes \"the door is open\", whereas ドアが開けてあります (using transitive 開ける + てある) implies \"someone purposely opened the door and left it open for a reason.\"",
    "points": [
      "自動詞 (intransitive) takes が for the subject undergoing the change: ドアが開く (the door opens).",
      "他動詞 (transitive) takes を for the direct object acted upon: ドアを開ける (open the door).",
      "-aru verbs are almost always intransitive (始まる, 閉まる, 止まる); -su verbs are almost always transitive (出す, 壊す, 直す, 消す).",
      "Intransitive + ている describes a current state (電気がついている = the light is on); Transitive + てある describes a state purposely prepared by someone."
    ],
    "examples": [
      {
        "jp": "授業が始まりました。",
        "reading": "じゅぎょうがはじまりました。",
        "en": "The class has started. (自動詞 with が)"
      },
      {
        "jp": "先生が授業を始めました。",
        "reading": "せんせいがじゅぎょうをはじめました。",
        "en": "The teacher started the class. (他動詞 with を)"
      },
      {
        "jp": "風が吹いて、窓が開きました。",
        "reading": "かぜがふいて、まどがあきました。",
        "en": "The wind blew and the window opened."
      },
      {
        "jp": "暑いから、窓を開けてください。",
        "reading": "あついから、まどをあけてください。",
        "en": "Because it is hot, please open the window."
      },
      {
        "jp": "パソコンが壊れたので、兄が直しました。",
        "reading": "ぱそこんがこわれたので、あにがなおしました。",
        "en": "Because the PC broke (自動詞), my older brother fixed it (他動詞)."
      }
    ]
  },
  {
    "id": "volitional-you-to-omou",
    "level": "N4",
    "order": 30,
    "title": "〜よう / 〜おう — Volitional Form & 〜ようと思う",
    "idea": "The volitional form is the casual equivalent of 〜ましょう (\"let's...\") and combines with と思う to express firm personal intentions (\"I'm thinking of doing...\").",
    "explanation": "While 〜ましょう is used in polite speech to say \"let's do X\", casual Japanese uses the volitional form (意向形, ikōkei). For Ichidan (Group 2) verbs, replace final る with よう: 食べる → 食べよう (let's eat), 見る → 見よう (let's watch). For Godan (Group 1) verbs, shift the final う-vowel to its お-row equivalent and add う: 行く → 行こう (ikō, let's go), 飲む → 飲もう (nomō, let's drink), 話す → 話そう, 待つ → 待とう. The two irregulars are 来る → 来よう (koyō) and する → しよう (shiyō).\n\nBeyond casual invitations, the volitional form is essential in grammar constructions across N4 and N3:\n• Volitional + と思う (〜ようと思う): \"I think I will...\" (a decision made right now).\n• Volitional + と思っている (〜ようと思っている): \"I have been planning/intending to...\" (an ongoing intention decided earlier).\n• Volitional + とする (〜ようとする): \"to try to do / to be just about to do\" (e.g., 出かけようとしたとき、雨が降り出した = Just as I was about to go out, it started raining).",
    "points": [
      "Ichidan (る-verbs): drop る + よう (食べる → 食べよう, 寝る → 寝よう).",
      "Godan (う-verbs): shift final syllable to お-row + う (行く → 行こう, 読む → 読もう, 買う → 買おう).",
      "Irregulars: する → しよう, 来る (くる) → 来よう (こよう).",
      "〜ようと思っています expresses an established personal plan; 〜ようとする means \"try to / be about to\"."
    ],
    "examples": [
      {
        "jp": "週末は海へ行こう！",
        "reading": "しゅうまつはうみへいこう！",
        "en": "Let's go to the beach this weekend!"
      },
      {
        "jp": "来年からもっと日本語を勉強しようと思っています。",
        "reading": "らいねんからもっとにほんごをべんきょうしようとおもっています。",
        "en": "I am planning to study Japanese more starting next year."
      },
      {
        "jp": "そろそろ寝ようかな。",
        "reading": "そろそろねようかな。",
        "en": "I think I should probably go to sleep soon."
      },
      {
        "jp": "電車に乗ろうとしたとき、ドアが閉まりました。",
        "reading": "でんしゃにのろうとしたとき、どあがしまりました。",
        "en": "Just as I was about to board the train, the door closed."
      },
      {
        "jp": "疲れたから、少し休もう。",
        "reading": "つかれたから、すこしやすもう。",
        "en": "I'm tired, so let's rest a little."
      }
    ]
  },
  {
    "id": "obligation-nakereba-naranai",
    "level": "N4",
    "order": 31,
    "title": "〜なければならない & 〜なくてもいい — Obligation vs Lack of Necessity",
    "idea": "Japanese expresses \"must do\" via a double negative (\"if I do not do X, it will not do\"), and \"don't have to\" via negative te-form + もいい (\"even if not doing X, it is fine\").",
    "explanation": "To say \"must\" or \"have to\" in Japanese, take a verb's negative ない-form, drop the final い, and attach ければならない (or polite ければなりません / ければいけません): 行く → 行かない → 行かなければならない (\"must go\"). Literally, it means \"if one does not go, it will not do.\" In everyday conversation, native speakers frequently contract なければならない into なくちゃ or なきゃ: もう行かなきゃ！ (\"I've gotta go now!\").\n\nBy contrast, to say \"you don't have to do X\", take the ない-form, replace い with くて, and add もいいです (〜なくてもいいです): 明日来なくてもいいです (\"You don't need to come tomorrow\"). Be careful not to confuse 〜なくてもいい (\"don't have to\") with 〜てはいけない (\"must not / forbidden\"): 靴を脱がなくてもいいです means \"you don't have to take off your shoes\", whereas 靴を履いてはいけません means \"you must not wear shoes.\"",
    "points": [
      "Must do: ない-stem + ければならない / ければいけません (食べる → 食べなければならない).",
      "Casual spoken contractions of \"must\": 〜なきゃ (行かなきゃ) and 〜なくちゃ (勉強しなくちゃ).",
      "Don't have to: ない-stem + くてもいいです (払う → 払わなくてもいいです = you don't have to pay).",
      "Distinguish 〜なくてもいい (not necessary) from 〜てはいけない (prohibited)."
    ],
    "examples": [
      {
        "jp": "毎日薬を飲まなければなりません。",
        "reading": "まいにちくすりをのまなければなりません。",
        "en": "I have to take medicine every day."
      },
      {
        "jp": "明日は日曜日だから、早く起きなくてもいいです。",
        "reading": "あしたはにちようびだから、はやくおきなくてもいいです。",
        "en": "Tomorrow is Sunday, so I don't have to wake up early."
      },
      {
        "jp": "この書類は今日中に送らなければいけません。",
        "reading": "このしょるいはきょうじゅうにおくらなければいけません。",
        "en": "I must send this document before the end of today."
      },
      {
        "jp": "もう遅いから、帰らなきゃ。",
        "reading": "もうおそいから、かえらなきゃ。",
        "en": "It's already late, so I've got to go home."
      },
      {
        "jp": "全部食べなくてもいいですよ。",
        "reading": "ぜんぶたべなくてもいいですよ。",
        "en": "You don't have to eat all of it, you know."
      }
    ]
  },
  {
    "id": "souda-youda-rashii",
    "level": "N3",
    "order": 32,
    "title": "〜そうだ・〜ようだ・〜らしい — Appearance, Hearsay & Conjecture",
    "idea": "How you attach そうだ determines whether it means \"it looks like\" (stem + そうだ) or \"I heard that\" (plain form + そうだ), while ようだ and らしい express evidence-based conjecture.",
    "explanation": "One of the classic JLPT N4/N3 traps is the difference between visual appearance (様態の「そうだ」) and hearsay report (伝聞の「そうだ」):\n1. Visual Appearance (\"looks like / about to\"): Attach そうだ to the verb ます-stem or adjective stem (drop final い or な): 雨が降りそうだ (\"It looks like it's about to rain — I see dark clouds\"); このケーキはおいしそうだ (\"This cake looks delicious\"). Exception: いい (good) becomes よさそうだ!\n2. Hearsay (\"I heard that / according to...\"): Attach そうだ to the complete plain form (dictionary, た, ない, だ): 天気予報によると、明日雨が降るそうだ (\"According to the forecast, I heard it will rain tomorrow\"); このケーキはおいしいそうだ (\"I heard this cake is delicious\").\n3. 〜ようだ / 〜みたいだ vs 〜らしい: 〜ようだ (and spoken 〜みたいだ) expresses a subjective impression or inference drawn from your own senses and reasoning (\"The ground is wet, so it seems it rained: 雨が降ったようだ\"). 〜らしい expresses an objective conjecture based on reliable external information or typical traits (\"Apparently / it seems from what people say\").",
    "points": [
      "Verb ます-stem / Adj-stem + そうだ = \"looks like / appears about to\" (降りそうだ, おいしそうだ, 静かそうだ; いい → よさそうだ).",
      "Full Plain Form + そうだ = \"I heard that...\" (降るそうだ, おいしいそうだ, 静かだそうだ).",
      "〜ようだ (written) / 〜みたいだ (spoken) = speaker's own sensory/contextual inference (\"it seems as though\").",
      "〜らしい = conjecture backed by external rumour, news, or characteristic traits."
    ],
    "examples": [
      {
        "jp": "空が暗いから、もうすぐ雨が降りそうです。",
        "reading": "そらがくらいから、もうすぐあめがふりそうです。",
        "en": "The sky is dark, so it looks like it will rain any moment. (appearance: ます-stem)"
      },
      {
        "jp": "ニュースによると、明日も雨が降るそうです。",
        "reading": "にゅーすによると、あしたもあめがふるそうです。",
        "en": "According to the news, I heard it will rain tomorrow too. (hearsay: plain form)"
      },
      {
        "jp": "この問題は難しそうですね。",
        "reading": "このもんだいはむずかしそうですね。",
        "en": "This question looks difficult, doesn’t it? (い-adj stem)"
      },
      {
        "jp": "道が濡れている。昨夜雨が降ったようだ。",
        "reading": "みちがぬれている。さくやあめがふったようだ。",
        "en": "The road is wet. It seems it rained last night. (sensory inference)"
      },
      {
        "jp": "あの新しいカフェはコーヒーがとてもおいしいらしい。",
        "reading": "あのあたらしいかふぇはこーひーがとてもおいしいらしい。",
        "en": "Apparently, the coffee at that new café is very delicious. (external report)"
      }
    ]
  }
];
