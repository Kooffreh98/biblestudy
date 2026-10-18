export type TranslationKey = 'KJV' | 'NIV' | 'Hebrew' | 'Greek' | 'GNV' | 'RSV';

export interface BibleBook {
  id: string;
  name: string;
  abbrev: string;
  testament: 'OT' | 'NT';
  genre: string;
  chapters: number;
  verses: number;
}

export interface Verse {
  id: string;
  book: string;
  bookAbbrev: string;
  chapter: number;
  verse: number;
  text: Record<TranslationKey, string>;
}

export const BIBLE_BOOKS: BibleBook[] = [
  { id: 'gen', name: 'Genesis', abbrev: 'Gen', testament: 'OT', genre: 'Law', chapters: 50, verses: 1533 },
  { id: 'exo', name: 'Exodus', abbrev: 'Exo', testament: 'OT', genre: 'Law', chapters: 40, verses: 1213 },
  { id: 'lev', name: 'Leviticus', abbrev: 'Lev', testament: 'OT', genre: 'Law', chapters: 27, verses: 859 },
  { id: 'num', name: 'Numbers', abbrev: 'Num', testament: 'OT', genre: 'Law', chapters: 36, verses: 1288 },
  { id: 'deu', name: 'Deuteronomy', abbrev: 'Deu', testament: 'OT', genre: 'Law', chapters: 34, verses: 959 },
  { id: 'jos', name: 'Joshua', abbrev: 'Jos', testament: 'OT', genre: 'History', chapters: 24, verses: 658 },
  { id: 'jdg', name: 'Judges', abbrev: 'Jdg', testament: 'OT', genre: 'History', chapters: 21, verses: 618 },
  { id: 'rut', name: 'Ruth', abbrev: 'Rut', testament: 'OT', genre: 'History', chapters: 4, verses: 85 },
  { id: '1sa', name: '1 Samuel', abbrev: '1Sa', testament: 'OT', genre: 'History', chapters: 31, verses: 810 },
  { id: '2sa', name: '2 Samuel', abbrev: '2Sa', testament: 'OT', genre: 'History', chapters: 24, verses: 695 },
  { id: '1ki', name: '1 Kings', abbrev: '1Ki', testament: 'OT', genre: 'History', chapters: 22, verses: 816 },
  { id: '2ki', name: '2 Kings', abbrev: '2Ki', testament: 'OT', genre: 'History', chapters: 25, verses: 719 },
  { id: '1ch', name: '1 Chronicles', abbrev: '1Ch', testament: 'OT', genre: 'History', chapters: 29, verses: 942 },
  { id: '2ch', name: '2 Chronicles', abbrev: '2Ch', testament: 'OT', genre: 'History', chapters: 36, verses: 822 },
  { id: 'ezr', name: 'Ezra', abbrev: 'Ezr', testament: 'OT', genre: 'History', chapters: 10, verses: 280 },
  { id: 'neh', name: 'Nehemiah', abbrev: 'Neh', testament: 'OT', genre: 'History', chapters: 13, verses: 406 },
  { id: 'est', name: 'Esther', abbrev: 'Est', testament: 'OT', genre: 'History', chapters: 10, verses: 167 },
  { id: 'job', name: 'Job', abbrev: 'Job', testament: 'OT', genre: 'Wisdom', chapters: 42, verses: 1070 },
  { id: 'psa', name: 'Psalms', abbrev: 'Psa', testament: 'OT', genre: 'Wisdom', chapters: 150, verses: 2461 },
  { id: 'pro', name: 'Proverbs', abbrev: 'Pro', testament: 'OT', genre: 'Wisdom', chapters: 31, verses: 915 },
  { id: 'ecc', name: 'Ecclesiastes', abbrev: 'Ecc', testament: 'OT', genre: 'Wisdom', chapters: 12, verses: 222 },
  { id: 'sng', name: 'Song of Solomon', abbrev: 'Sng', testament: 'OT', genre: 'Wisdom', chapters: 8, verses: 117 },
  { id: 'isa', name: 'Isaiah', abbrev: 'Isa', testament: 'OT', genre: 'Major Prophets', chapters: 66, verses: 1292 },
  { id: 'jer', name: 'Jeremiah', abbrev: 'Jer', testament: 'OT', genre: 'Major Prophets', chapters: 52, verses: 1364 },
  { id: 'lam', name: 'Lamentations', abbrev: 'Lam', testament: 'OT', genre: 'Major Prophets', chapters: 5, verses: 154 },
  { id: 'eze', name: 'Ezekiel', abbrev: 'Eze', testament: 'OT', genre: 'Major Prophets', chapters: 48, verses: 1273 },
  { id: 'dan', name: 'Daniel', abbrev: 'Dan', testament: 'OT', genre: 'Major Prophets', chapters: 12, verses: 357 },
  { id: 'hos', name: 'Hosea', abbrev: 'Hos', testament: 'OT', genre: 'Minor Prophets', chapters: 14, verses: 197 },
  { id: 'joe', name: 'Joel', abbrev: 'Joe', testament: 'OT', genre: 'Minor Prophets', chapters: 3, verses: 73 },
  { id: 'amo', name: 'Amos', abbrev: 'Amo', testament: 'OT', genre: 'Minor Prophets', chapters: 9, verses: 146 },
  { id: 'oba', name: 'Obadiah', abbrev: 'Oba', testament: 'OT', genre: 'Minor Prophets', chapters: 1, verses: 21 },
  { id: 'jon', name: 'Jonah', abbrev: 'Jon', testament: 'OT', genre: 'Minor Prophets', chapters: 4, verses: 48 },
  { id: 'mic', name: 'Micah', abbrev: 'Mic', testament: 'OT', genre: 'Minor Prophets', chapters: 7, verses: 105 },
  { id: 'nah', name: 'Nahum', abbrev: 'Nah', testament: 'OT', genre: 'Minor Prophets', chapters: 3, verses: 47 },
  { id: 'hab', name: 'Habakkuk', abbrev: 'Hab', testament: 'OT', genre: 'Minor Prophets', chapters: 3, verses: 56 },
  { id: 'zep', name: 'Zephaniah', abbrev: 'Zep', testament: 'OT', genre: 'Minor Prophets', chapters: 3, verses: 53 },
  { id: 'hag', name: 'Haggai', abbrev: 'Hag', testament: 'OT', genre: 'Minor Prophets', chapters: 2, verses: 38 },
  { id: 'zec', name: 'Zechariah', abbrev: 'Zec', testament: 'OT', genre: 'Minor Prophets', chapters: 14, verses: 211 },
  { id: 'mal', name: 'Malachi', abbrev: 'Mal', testament: 'OT', genre: 'Minor Prophets', chapters: 4, verses: 55 },
  { id: 'mat', name: 'Matthew', abbrev: 'Mat', testament: 'NT', genre: 'Gospels', chapters: 28, verses: 1071 },
  { id: 'mar', name: 'Mark', abbrev: 'Mar', testament: 'NT', genre: 'Gospels', chapters: 16, verses: 678 },
  { id: 'luk', name: 'Luke', abbrev: 'Luk', testament: 'NT', genre: 'Gospels', chapters: 24, verses: 1151 },
  { id: 'joh', name: 'John', abbrev: 'Joh', testament: 'NT', genre: 'Gospels', chapters: 21, verses: 879 },
  { id: 'act', name: 'Acts', abbrev: 'Act', testament: 'NT', genre: 'History', chapters: 28, verses: 1007 },
  { id: 'rom', name: 'Romans', abbrev: 'Rom', testament: 'NT', genre: 'Epistles', chapters: 16, verses: 433 },
  { id: '1co', name: '1 Corinthians', abbrev: '1Co', testament: 'NT', genre: 'Epistles', chapters: 16, verses: 437 },
  { id: '2co', name: '2 Corinthians', abbrev: '2Co', testament: 'NT', genre: 'Epistles', chapters: 13, verses: 257 },
  { id: 'gal', name: 'Galatians', abbrev: 'Gal', testament: 'NT', genre: 'Epistles', chapters: 6, verses: 149 },
  { id: 'eph', name: 'Ephesians', abbrev: 'Eph', testament: 'NT', genre: 'Epistles', chapters: 6, verses: 155 },
  { id: 'phi', name: 'Philippians', abbrev: 'Phi', testament: 'NT', genre: 'Epistles', chapters: 4, verses: 104 },
  { id: 'col', name: 'Colossians', abbrev: 'Col', testament: 'NT', genre: 'Epistles', chapters: 4, verses: 95 },
  { id: '1th', name: '1 Thessalonians', abbrev: '1Th', testament: 'NT', genre: 'Epistles', chapters: 5, verses: 89 },
  { id: '2th', name: '2 Thessalonians', abbrev: '2Th', testament: 'NT', genre: 'Epistles', chapters: 3, verses: 47 },
  { id: '1ti', name: '1 Timothy', abbrev: '1Ti', testament: 'NT', genre: 'Epistles', chapters: 6, verses: 113 },
  { id: '2ti', name: '2 Timothy', abbrev: '2Ti', testament: 'NT', genre: 'Epistles', chapters: 4, verses: 83 },
  { id: 'tit', name: 'Titus', abbrev: 'Tit', testament: 'NT', genre: 'Epistles', chapters: 3, verses: 46 },
  { id: 'phm', name: 'Philemon', abbrev: 'Phm', testament: 'NT', genre: 'Epistles', chapters: 1, verses: 25 },
  { id: 'heb', name: 'Hebrews', abbrev: 'Heb', testament: 'NT', genre: 'Epistles', chapters: 13, verses: 303 },
  { id: 'jam', name: 'James', abbrev: 'Jam', testament: 'NT', genre: 'Epistles', chapters: 5, verses: 108 },
  { id: '1pe', name: '1 Peter', abbrev: '1Pe', testament: 'NT', genre: 'Epistles', chapters: 5, verses: 105 },
  { id: '2pe', name: '2 Peter', abbrev: '2Pe', testament: 'NT', genre: 'Epistles', chapters: 3, verses: 61 },
  { id: '1jo', name: '1 John', abbrev: '1Jo', testament: 'NT', genre: 'Epistles', chapters: 5, verses: 105 },
  { id: '2jo', name: '2 John', abbrev: '2Jo', testament: 'NT', genre: 'Epistles', chapters: 1, verses: 13 },
  { id: '3jo', name: '3 John', abbrev: '3Jo', testament: 'NT', genre: 'Epistles', chapters: 1, verses: 14 },
  { id: 'jud', name: 'Jude', abbrev: 'Jud', testament: 'NT', genre: 'Epistles', chapters: 1, verses: 25 },
  { id: 'rev', name: 'Revelation', abbrev: 'Rev', testament: 'NT', genre: 'Prophecy', chapters: 22, verses: 404 },
];

export const GENRE_COLORS: Record<string, string> = {
  'Law': 'bg-amber-100 text-amber-800',
  'History': 'bg-blue-100 text-blue-800',
  'Wisdom': 'bg-emerald-100 text-emerald-800',
  'Major Prophets': 'bg-purple-100 text-purple-800',
  'Minor Prophets': 'bg-rose-100 text-rose-800',
  'Gospels': 'bg-sky-100 text-sky-800',
  'Epistles': 'bg-indigo-100 text-indigo-800',
  'Prophecy': 'bg-orange-100 text-orange-800',
};

// Mock verse data for key passages — backend would serve full Bible text
export const SAMPLE_VERSES: Verse[] = [
  {
    id: 'joh-3-16',
    book: 'John',
    bookAbbrev: 'Joh',
    chapter: 3,
    verse: 16,
    text: {
      KJV: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
      NIV: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
      Hebrew: 'כִּי כֵּן אָהַב אֱלֹהִים אֶת הָעוֹלָם עַד כִּי נָתַן אֶת בְּנוֹ יְחִידוֹ לְמַעַן לֹא יֹאבַד כָּל הַמַּאֲמִין בּוֹ אֶלָּא יִחְיֶה חַיֵּי עוֹלָם׃',
      Greek: 'Οὕτως γὰρ ἠγάπησεν ὁ θεὸς τὸν κόσμον, ὥστε τὸν υἱὸν τὸν μονογενῆ ἔδωκεν, ἵνα πᾶς ὁ πιστεύων εἰς αὐτὸν μὴ ἀπόληται ἀλλ᾽ ἔχῃ ζωὴν αἰώνιον.',
      GNV: 'For God so loved the world, that he gave his only-begotten Son, that whosoever believeth in him, should not perish, but have everlasting life.',
      RSV: 'For God so loved the world that he gave his only Son, that whoever believes in him should not perish but have eternal life.',
    },
  },
  {
    id: 'psa-23-1',
    book: 'Psalms',
    bookAbbrev: 'Psa',
    chapter: 23,
    verse: 1,
    text: {
      KJV: 'The LORD is my shepherd; I shall not want.',
      NIV: 'The Lord is my shepherd, I lack nothing.',
      Hebrew: 'יְהוָה רֹעִי לֹא אֶחְסָר׃',
      Greek: 'Κύριος ποιμαίνει με, καὶ οὐδέν με ὑστερήσει.',
      GNV: 'The Lord is my shepherd; I shall not want.',
      RSV: 'The Lord is my shepherd, I shall not want;',
    },
  },
  {
    id: 'gen-1-1',
    book: 'Genesis',
    bookAbbrev: 'Gen',
    chapter: 1,
    verse: 1,
    text: {
      KJV: 'In the beginning God created the heaven and the earth.',
      NIV: 'In the beginning God created the heavens and the earth.',
      Hebrew: 'בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ׃',
      Greek: 'Ἐν ἀρχῇ ἐποίησεν ὁ θεὸς τὸν οὐρανὸν καὶ τὴν γῆν.',
      GNV: 'In the beginning God created the heaven and the earth.',
      RSV: 'In the beginning God created the heavens and the earth.',
    },
  },
  {
    id: 'rom-8-28',
    book: 'Romans',
    bookAbbrev: 'Rom',
    chapter: 8,
    verse: 28,
    text: {
      KJV: 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.',
      NIV: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
      Hebrew: 'וְיָדַעְנוּ כִּי לַאֲהֵבִים אֶת הָאֱלֹהִים כֹּל הַדְּבָרִים יַעֲבְדוּ לְטוֹבָה לַקְּרוּאִים לְמַטָּרָתוֹ׃',
      Greek: 'οἴδαμεν δὲ ὅτι τοῖς ἀγαπῶσιν τὸν θεὸν πάντα συνεργεῖ εἰς ἀγαθόν, τοῖς κατὰ πρόθεσιν κλητοῖς οὖσιν.',
      GNV: 'And we know that all things work together for good, to them that love God, even to them that are called of his purpose.',
      RSV: 'We know that in everything God works for good with those who love him, who are called according to his purpose.',
    },
  },
  {
    id: 'pro-3-5',
    book: 'Proverbs',
    bookAbbrev: 'Pro',
    chapter: 3,
    verse: 5,
    text: {
      KJV: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding.',
      NIV: 'Trust in the Lord with all your heart and lean not on your own understanding;',
      Hebrew: 'בְּטַח אֶל יְהוָה בְּכָל לִבֶּךָ וְאֶל בִּינָתְךָ אַל תִּשָּׁעֵן׃',
      Greek: 'Πίστευε ἐν ὅλῃ καρδίᾳ σου ἐπὶ τῷ θεῷ, καὶ μὴ ἐπαίρου τῇ σαυτοῦ συνέσει.',
      GNV: 'Trust in the Lord with all thine heart, and lean not unto thine own wisdom.',
      RSV: 'Trust in the Lord with all your heart, and do not rely on your own insight.',
    },
  },
  {
    id: 'isa-40-31',
    book: 'Isaiah',
    bookAbbrev: 'Isa',
    chapter: 40,
    verse: 31,
    text: {
      KJV: 'But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.',
      NIV: 'but those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.',
      Hebrew: 'וְקוֹיֵ יְהוָה יַחֲלִיפוּ כֹחַ יַעֲלוּ אֵבֶר כַּנְּשָׁרִים יָרוּצוּ וְלֹא יִיגָעוּ יֵלְכוּ וְלֹא יִיעָפוּ׃',
      Greek: 'οἱ δὲ ὑπομένοντες τὸν θεὸν ἀλλάξουσιν ἰσχύν, πτεροφυήσουσιν ὡς ἀετοί, δραμοῦνται καὶ οὐ κοπιάσουσιν, βαδιοῦνται καὶ οὐ πεινάσουσιν.',
      GNV: 'But they that wait upon the Lord shall renew their strength; they shall lift up the wings as the eagles; they shall run and not be weary, and they shall walk and not faint.',
      RSV: 'but they who wait for the Lord shall renew their strength, they shall mount up with wings like eagles, they shall run and not be weary, they shall walk and not faint.',
    },
  },
  {
    id: 'mat-5-3',
    book: 'Matthew',
    bookAbbrev: 'Mat',
    chapter: 5,
    verse: 3,
    text: {
      KJV: 'Blessed are the poor in spirit: for theirs is the kingdom of heaven.',
      NIV: 'Blessed are the poor in spirit, for theirs is the kingdom of heaven.',
      Hebrew: 'אַשְׁרֵי עֲנִיֵּי הָרוּחַ כִּי לָהֶם מַלְכוּת הַשָּׁמַיִם׃',
      Greek: 'Μακάριοι οἱ πτωχοὶ τῷ πνεύματι, ὅτι αὐτῶν ἐστιν ἡ βασιλεία τῶν οὐρανῶν.',
      GNV: 'Blessed are the poor in spirit, for theirs is the kingdom of heaven.',
      RSV: 'Blessed are the poor in spirit, for theirs is the kingdom of heaven.',
    },
  },
  {
    id: 'phi-4-13',
    book: 'Philippians',
    bookAbbrev: 'Phi',
    chapter: 4,
    verse: 13,
    text: {
      KJV: 'I can do all things through Christ which strengtheneth me.',
      NIV: 'I can do all this through him who gives me strength.',
      Hebrew: 'כֹּל אוּכַל בְּמָשִׁיחַ הַמְחַזְּקֵנִי׃',
      Greek: 'πάντα ἰσχύω ἐν τῷ ἐνδυναμοῦντί με Χριστῷ.',
      GNV: 'I can do all things through Christ which strengtheneth me.',
      RSV: 'I can do all this through him who gives me strength.',
    },
  },
];

// Mock chapter data — backend would serve full Bible chapters
// Backend integration point: GET /api/bible/{bookId}/{chapter}?translation={key}
export const JOHN_3_VERSES = [
  { verse: 1, text: 'There was a man of the Pharisees, named Nicodemus, a ruler of the Jews:' },
  { verse: 2, text: 'The same came to Jesus by night, and said unto him, Rabbi, we know that thou art a teacher come from God: for no man can do these miracles that thou doest, except God be with him.' },
  { verse: 3, text: 'Jesus answered and said unto him, Verily, verily, I say unto thee, Except a man be born again, he cannot see the kingdom of God.' },
  { verse: 4, text: 'Nicodemus saith unto him, How can a man be born when he is old? can he enter the second time into his mother\'s womb, and be born?' },
  { verse: 5, text: 'Jesus answered, Verily, verily, I say unto thee, Except a man be born of water and of the Spirit, he cannot enter into the kingdom of God.' },
  { verse: 6, text: 'That which is born of the flesh is flesh; and that which is born of the Spirit is spirit.' },
  { verse: 7, text: 'Marvel not that I said unto thee, Ye must be born again.' },
  { verse: 8, text: 'The wind bloweth where it listeth, and thou hearest the sound thereof, but canst not tell whence it cometh, and whither it goeth: so is every one that is born of the Spirit.' },
  { verse: 9, text: 'Nicodemus answered and said unto him, How can these things be?' },
  { verse: 10, text: 'Jesus answered and said unto him, Art thou a master of Israel, and knowest not these things?' },
  { verse: 11, text: 'Verily, verily, I say unto thee, We speak that we do know, and testify that we have seen; and ye receive not our witness.' },
  { verse: 12, text: 'If I have told you earthly things, and ye believe not, how shall ye believe, if I tell you of heavenly things?' },
  { verse: 13, text: 'And no man hath ascended up to heaven, but he that came down from heaven, even the Son of man which is in heaven.' },
  { verse: 14, text: 'And as Moses lifted up the serpent in the wilderness, even so must the Son of man be lifted up:' },
  { verse: 15, text: 'That whosoever believeth in him should not perish, but have eternal life.' },
  { verse: 16, text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.' },
  { verse: 17, text: 'For God sent not his Son into the world to condemn the world; but that the world through him might be saved.' },
  { verse: 18, text: 'He that believeth on him is not condemned: but he that believeth not is condemned already, because he hath not believed in the name of the only begotten Son of God.' },
  { verse: 19, text: 'And this is the condemnation, that light is come into the world, and men loved darkness rather than light, because their deeds were evil.' },
  { verse: 20, text: 'For every one that doeth evil hateth the light, neither cometh to the light, lest his deeds should be reproved.' },
  { verse: 21, text: 'But he that doeth truth cometh to the light, that his deeds may be made manifest, that they are wrought in God.' },
  { verse: 22, text: 'After these things came Jesus and his disciples into the land of Judaea; and there he tarried with them, and baptized.' },
  { verse: 23, text: 'And John also was baptizing in Aenon near to Salim, because there was much water there: and they came, and were baptized.' },
  { verse: 24, text: 'For John was not yet cast into prison.' },
  { verse: 25, text: 'Then there arose a question between some of John\'s disciples and the Jews about purifying.' },
  { verse: 26, text: 'And they came unto John, and said unto him, Rabbi, he that was with thee beyond Jordan, to whom thou barest witness, behold, the same baptizeth, and all men come to him.' },
  { verse: 27, text: 'John answered and said, A man can receive nothing, except it be given him from heaven.' },
  { verse: 28, text: 'Ye yourselves bear me witness, that I said, I am not the Christ, but that I am sent before him.' },
  { verse: 29, text: 'He that hath the bride is the bridegroom: but the friend of the bridegroom, which standeth and heareth him, rejoiceth greatly because of the bridegroom\'s voice: this my joy therefore is fulfilled.' },
  { verse: 30, text: 'He must increase, but I must decrease.' },
  { verse: 31, text: 'He that cometh from above is above all: he that is of the earth is earthly, and speaketh of the earth: he that cometh from heaven is above all.' },
  { verse: 32, text: 'And what he hath seen and heard, that he testifieth; and no man receiveth his testimony.' },
  { verse: 33, text: 'He that hath received his testimony hath set to his seal that God is true.' },
  { verse: 34, text: 'For he whom God hath sent speaketh the words of God: for God giveth not the Spirit by measure unto him.' },
  { verse: 35, text: 'The Father loveth the Son, and hath given all things into his hand.' },
  { verse: 36, text: 'He that believeth on the Son hath everlasting life: and he that believeth not the Son shall not see life; but the wrath of God abideth on him.' },
];

export const CROSS_REFERENCES: Record<string, string[]> = {
  'joh-3-16': ['Rom 5:8', 'Eph 2:4-5', '1 Jo 4:9', 'Joh 1:14', 'Joh 10:28'],
  'gen-1-1': ['Heb 11:3', 'Psa 33:6', 'Col 1:16', 'Joh 1:1-3'],
  'psa-23-1': ['Joh 10:11', 'Eze 34:11', 'Isa 40:11', 'Heb 13:20'],
  'rom-8-28': ['Jer 29:11', 'Gen 50:20', 'Phi 4:7', 'Isa 46:10'],
};