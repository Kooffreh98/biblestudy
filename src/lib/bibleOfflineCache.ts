import { BIBLE_BOOKS, type TranslationKey } from './bibleData';

export interface CachedVerse {
  verse: number;
  text: string;
}

export interface CacheStatus {
  cached: boolean;
  totalBooks: number;
  cachedBooks: number;
  lastCached: string | null;
  cacheVersion: string;
}

const CACHE_VERSION = 'v1.0';
const CACHE_KEY_PREFIX = 'bible_cache_';
const CACHE_META_KEY = 'bible_cache_meta';

// ─── Real key verses embedded for accuracy ───────────────────────────────────
const REAL_VERSES: Record<string, Record<number, Record<number, Partial<Record<TranslationKey, string>>>>> = {
  gen: {
    1: {
      1: {
        KJV: 'In the beginning God created the heaven and the earth.',
        NIV: 'In the beginning God created the heavens and the earth.',
        Hebrew: 'בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ׃',
        Greek: 'Ἐν ἀρχῇ ἐποίησεν ὁ θεὸς τὸν οὐρανὸν καὶ τὴν γῆν.',
        GNV: 'In the beginning God created the heaven and the earth.',
        RSV: 'In the beginning God created the heavens and the earth.',
      },
      2: {
        KJV: 'And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters.',
        NIV: 'Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters.',
        Hebrew: 'וְהָאָרֶץ הָיְתָה תֹהוּ וָבֹהוּ וְחֹשֶׁךְ עַל פְּנֵי תְהוֹם וְרוּחַ אֱלֹהִים מְרַחֶפֶת עַל פְּנֵי הַמָּיִם׃',
        Greek: 'ἡ δὲ γῆ ἦν ἀόρατος καὶ ἀκατασκεύαστος, καὶ σκότος ἐπάνω τῆς ἀβύσσου, καὶ πνεῦμα θεοῦ ἐπεφέρετο ἐπάνω τοῦ ὕδατος.',
        GNV: 'And the earth was without form and void, and darkness was upon the deep, and the Spirit of God moved upon the waters.',
        RSV: 'The earth was without form and void, and darkness was upon the face of the deep; and the Spirit of God was moving over the face of the waters.',
      },
      3: {
        KJV: 'And God said, Let there be light: and there was light.',
        NIV: 'And God said, "Let there be light," and there was light.',
        Hebrew: 'וַיֹּאמֶר אֱלֹהִים יְהִי אוֹר וַיְהִי אוֹר׃',
        Greek: 'καὶ εἶπεν ὁ θεός Γενηθήτω φῶς. καὶ ἐγένετο φῶς.',
        GNV: 'Then God said, Let there be light: and there was light.',
        RSV: 'And God said, "Let there be light"; and there was light.',
      },
    },
  },
  psa: {
    23: {
      1: {
        KJV: 'The LORD is my shepherd; I shall not want.',
        NIV: 'The Lord is my shepherd, I lack nothing.',
        Hebrew: 'יְהוָה רֹעִי לֹא אֶחְסָר׃',
        Greek: 'Κύριος ποιμαίνει με, καὶ οὐδέν με ὑστερήσει.',
        GNV: 'The Lord is my shepherd; I shall not want.',
        RSV: 'The Lord is my shepherd, I shall not want;',
      },
      2: {
        KJV: 'He maketh me to lie down in green pastures: he leadeth me beside the still waters.',
        NIV: 'He makes me lie down in green pastures, he leads me beside still waters,',
        Hebrew: 'בִּנְאוֹת דֶּשֶׁא יַרְבִּיצֵנִי עַל מֵי מְנֻחוֹת יְנַהֲלֵנִי׃',
        Greek: 'ἐκεῖ με κατεσκήνωσεν, ἐπὶ ὕδατος ἀναπαύσεως ἐξέθρεψέν με.',
        GNV: 'He maketh me to rest in green pasture and leadeth me by the still waters.',
        RSV: 'he makes me lie down in green pastures. He leads me beside still waters;',
      },
      3: {
        KJV: "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.",
        NIV: "he refreshes my soul. He guides me along the right paths for his name's sake.",
        Hebrew: 'נַפְשִׁי יְשׁוֹבֵב יַנְחֵנִי בְמַעְגְּלֵי צֶדֶק לְמַעַן שְׁמוֹ׃',
        Greek: 'τὴν ψυχήν μου ἐπέστρεψεν, ὡδήγησέν με ἐπὶ τρίβους δικαιοσύνης ἕνεκεν τοῦ ὀνόματος αὐτοῦ.',
        GNV: "He restoreth my soul and leadeth me in the paths of righteousness for his Name's sake.",
        RSV: "he restores my soul. He leads me in paths of righteousness for his name's sake.",
      },
    },
    119: {
      105: {
        KJV: 'Thy word is a lamp unto my feet, and a light unto my path.',
        NIV: 'Your word is a lamp for my feet, a light on my path.',
        Hebrew: 'נֵר לְרַגְלִי דְבָרֶךָ וְאוֹר לִנְתִיבָתִי׃',
        Greek: 'Λύχνος τοῖς ποσίν μου ὁ νόμος σου καὶ φῶς ταῖς τρίβοις μου.',
        GNV: 'Thy word is a lantern unto my feet, and a light unto my path.',
        RSV: 'Thy word is a lamp to my feet and a light to my path.',
      },
    },
  },
  joh: {
    1: {
      1: {
        KJV: 'In the beginning was the Word, and the Word was with God, and the Word was God.',
        NIV: 'In the beginning was the Word, and the Word was with God, and the Word was God.',
        Hebrew: 'בְּרֵאשִׁית הָיָה הַדָּבָר וְהַדָּבָר הָיָה אֵצֶל הָאֱלֹהִים וֵאלֹהִים הָיָה הַדָּבָר׃',
        Greek: 'Ἐν ἀρχῇ ἦν ὁ λόγος, καὶ ὁ λόγος ἦν πρὸς τὸν θεόν, καὶ θεὸς ἦν ὁ λόγος.',
      },
      14: {
        KJV: 'And the Word was made flesh, and dwelt among us, (and we beheld his glory, the glory as of the only begotten of the Father,) full of grace and truth.',
        NIV: 'The Word became flesh and made his dwelling among us. We have seen his glory, the glory of the one and only Son, who came from the Father, full of grace and truth.',
        Hebrew: 'וְהַדָּבָר נַעֲשָׂה בָשָׂר וַיִּשְׁכֹּן בְּתוֹכֵנוּ וְרָאִינוּ אֶת כְּבוֹדוֹ כְּבוֹד בֵּן יָחִיד מֵאֵת הָאָב מָלֵא חֶסֶד וֶאֱמֶת׃',
        Greek: 'Καὶ ὁ λόγος σὰρξ ἐγένετο καὶ ἐσκήνωσεν ἐν ἡμῖν, καὶ ἐθεασάμεθα τὴν δόξαν αὐτοῦ, δόξαν ὡς μονογενοῦς παρὰ πατρός, πλήρης χάριτος καὶ ἀληθείας.',
      },
    },
    3: {
      16: {
        KJV: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
        NIV: 'For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.',
        Hebrew: 'כִּי כֵּן אָהַב אֱלֹהִים אֶת הָעוֹלָם עַד כִּי נָתַן אֶת בְּנוֹ יְחִידוֹ לְמַעַן לֹא יֹאבַד כָּל הַמַּאֲמִין בּוֹ אֶלָּא יִחְיֶה חַיֵּי עוֹלָם׃',
        Greek: 'Οὕτως γὰρ ἠγάπησεν ὁ θεὸς τὸν κόσμον, ὥστε τὸν υἱὸν τὸν μονογενῆ ἔδωγεν, ἵνα πᾶς ὁ πιστεύων εἰς αὐτὸν μὴ ἀπόληται ἀλλ᾽ ἔχῃ ζωὴν αἰώνιον.',
        GNV: 'For God so loved the world, that he gave his only-begotten Son, that whosoever believeth in him, should not perish, but have everlasting life.',
        RSV: 'For God so loved the world that he gave his only Son, that whoever believes in him should not perish but have eternal life.',
      },
    },
    11: {
      35: {
        KJV: 'Jesus wept.',
        NIV: 'Jesus wept.',
        Hebrew: 'וַיִּבְכֶּה יֵשׁוּעַ׃',
        Greek: 'ἐδάκρυσεν ὁ Ἰησοῦς.',
      },
    },
    14: {
      6: {
        KJV: 'Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.',
        NIV: 'Jesus answered, "I am the way and the truth and the life. No one comes to the Father except through me."',
        Hebrew: 'אָמַר אֵלָיו יֵשׁוּעַ אֲנִי הַדֶּרֶךְ וְהָאֱמֶת וְהַחַיִִים אֵין אִישׁ בָּא אֶל הָאָב כִּי אִם עַל יָדִי׃',
        Greek: 'λέγει αὐτῷ ὁ Ἰησοῦς· Ἐγώ εἰμι ἡ ὁδὸς καὶ ἡ ἀλήθεια καὶ ἡ ζωή· οὐδεὶς ἔρχεται πρὸς τὸν πατέρα εἰ μὴ δι᾽ ἐμοῦ.',
      },
    },
  },
  rom: {
    8: {
      28: {
        KJV: 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.',
        NIV: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
        Hebrew: 'וְיָדַעְנוּ כִּי לַאֲהֵבִים אֶת הָאֱלֹהִים כֹּל הַדְּבָרִים יַעֲבְדוּ לְטוֹבָה לַקְּרוּאִים לְמַטָּרָתוֹ׃',
        Greek: 'οἴδαμεν δὲ ὅτι τοῖς ἀγαπῶσιν τὸν θεὸν πάντα συνεργεῖ εἰς ἀγαθόν, τοῖς κατὰ πρόθεσιν κλητοῖς οὖσιν.',
      },
    },
    3: {
      23: {
        KJV: 'For all have sinned, and come short of the glory of God;',
        NIV: 'for all have sinned and fall short of the glory of God,',
        Hebrew: 'כִּי כֻלָּם חָטְאוּ וְחָסְרֵי כְּבוֹד אֱלֹהִים הֵם׃',
        Greek: 'πάντες γὰρ ἥμαρτον καὶ ὑστεροῦνται τῆς δόξης τοῦ θεοῦ,',
      },
    },
  },
  pro: {
    3: {
      5: {
        KJV: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding.',
        NIV: 'Trust in the Lord with all your heart and lean not on your own understanding;',
        Hebrew: 'בְּטַח אֶל יְהוָה בְּכָל לִבֶּךָ וְאֶל בִּינָתְךָ אַל תִּשָּׁעֵן׃',
        Greek: 'Πίστευε ἐν ὅλῃ καρδίᾳ σου ἐπὶ τῷ θεῷ, καὶ μὴ ἐπαίρου τῇ σαυτοῦ συνέσει.',
      },
      6: {
        KJV: 'In all thy ways acknowledge him, and he shall direct thy paths.',
        NIV: 'in all your ways submit to him, and he will make your paths straight.',
        Hebrew: 'בְּכָל דְּרָכֶיךָ דָעֵהוּ וְהוּא יְיַשֵּׁר אֹרְחֹתֶיךָ׃',
        Greek: 'ἐν πάσαις ταῖς ὁδοῖς σου γνώριζε αὐτήν, ἵνα ὀρθοτομῇ τὰς ὁδούς σου.',
      },
    },
  },
  isa: {
    40: {
      31: {
        KJV: 'But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.',
        NIV: 'but those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.',
        Hebrew: 'וְקוֹיֵ יְהוָה יַחֲלִיפוּ כֹחַ יַעֲלוּ אֵבֶר כַּנְּשָׁרִים יָרוּצוּ וְלֹא יִיגָעוּ יֵלְכוּ וְלֹא יִיעָפוּ׃',
        Greek: 'οἱ δὲ ὑπομένοντες τὸν θεὸν ἀλλάξουσιν ἰσχύν, πτεροφυήσουσιν ὡς ἀετοί, δραμοῦνται καὶ οὐ κοπιάσουσιν, βαδιοῦνται καὶ οὐ πεινάσουσιν.',
      },
    },
    53: {
      5: {
        KJV: 'But he was wounded for our transgressions, he was bruised for our iniquities: the chastisement of our peace was upon him; and with his stripes we are healed.',
        NIV: 'But he was pierced for our transgressions, he was crushed for our iniquities; the punishment that brought us peace was on him, and by his wounds we are healed.',
        Hebrew: 'וְהוּא מְחֹלָל מִפְּשָׁעֵנוּ מְדֻכָּא מֵעֲוֹנֹתֵינוּ מוּסַר שְׁלוֹמֵנוּ עָלָיו וּבַחֲבֻרָתוֹ נִרְפָּא לָנוּ׃',
        Greek: 'αὐτὸς δὲ ἐτραυματίσθη διὰ τὰς ἀνομίας ἡμῶν καὶ μεμαλάκισται διὰ τὰς ἁμαρτίας ἡμῶν· παιδεία εἰρήνης ἡμῶν ἐπ᾽ αὐτόν, τῷ μώλωπι αὐτοῦ ἡμεῖς ἰάθημεν.',
      },
    },
  },
  mat: {
    5: {
      3: {
        KJV: 'Blessed are the poor in spirit: for theirs is the kingdom of heaven.',
        NIV: 'Blessed are the poor in spirit, for theirs is the kingdom of heaven.',
        Hebrew: 'אַשְׁרֵי עֲנִיֵּי הָרוּחַ כִּי לָהֶם מַלְכוּת הַשָּׁמַיִם׃',
        Greek: 'Μακάριοι οἱ πτωχοὶ τῷ πνεύματι, ὅτι αὐτῶν ἐστιν ἡ βασιλεία τῶν οὐρανῶν.',
      },
    },
    6: {
      9: {
        KJV: 'After this manner therefore pray ye: Our Father which art in heaven, Hallowed be thy name.',
        NIV: 'This, then, is how you should pray: "Our Father in heaven, hallowed be your name,',
        Hebrew: 'לָכֵן כָּכָה תִּתְפַּלְּלוּ אָבִינוּ שֶׁבַּשָּׁמַיִם יִתְקַדַּשׁ שְׁמֶךָ׃',
        Greek: 'Οὕτως οὖν προσεύχεσθε ὑμεῖς· Πάτερ ἡμῶν ὁ ἐν τοῖς οὐρανοῖς, ἁγιασθήτω τὸ ὄνομά σου.',
      },
    },
    28: {
      19: {
        KJV: 'Go ye therefore, and teach all nations, baptizing them in the name of the Father, and of the Son, and of the Holy Ghost:',
        NIV: 'Therefore go and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit,',
        Hebrew: 'לְכוּ אֵפוֹא וְעִשׂוּ תַּלְמִידִים מִכָּל הַגּוֹיִם וְטַבְּלוּ אוֹתָם בְּשֵׁם הָאָב וְהַבֵּן וְרוּחַ הַקֹּדֶשׁ׃',
        Greek: 'πορευθέντες οὖν μαθητεύσατε πάντα τὰ ἔθνη, βαπτίζοντες αὐτοὺς εἰς τὸ ὄνομα τοῦ πατρὸς καὶ τοῦ υἱοῦ καὶ τοῦ ἁγίου πνεύματος,',
      },
    },
  },
  phi: {
    4: {
      13: {
        KJV: 'I can do all things through Christ which strengtheneth me.',
        NIV: 'I can do all this through him who gives me strength.',
        Hebrew: 'כֹּל אוּכַל בְּמָשִׁיחַ הַמְחַזְּקֵנִי׃',
        Greek: 'πάντα ἰσχύω ἐν τῷ ἐνδυναμοῦντί με Χριστῷ.',
      },
      7: {
        KJV: 'And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.',
        NIV: 'And the peace of God, which transcends all understanding, will guard your hearts and your minds in Christ Jesus.',
        Hebrew: 'וּשְׁלוֹם הָאֱלֹהִים הָעוֹלֶה עַל כָּל שֵׂכֶל יִשְׁמֹר אֶת לְבַבְכֶם וְאֶת מַחְשְׁבוֹתֵיכֶם בְּמָשִׁיחַ יֵשׁוּעַ׃',
        Greek: 'καὶ ἡ εἰρήνη τοῦ θεοῦ ἡ ὑπερέχουσα πάντα νοῦν φρουρήσει τὰς καρδίας ὑμῶν καὶ τὰ νοήματα ὑμῶν ἐν Χριστῷ Ἰησοῦ.',
      },
    },
  },
  jer: {
    29: {
      11: {
        KJV: 'For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.',
        NIV: '"For I know the plans I have for you," declares the Lord, "plans to prosper you and not to harm you, plans to give you hope and a future."',
        Hebrew: 'כִּי אָנֹכִי יָדַעְתִִי אֶת הַמַּחֲשָׁבוֹת אֲשֶׁר אָנֹכִי חֹשֵׁב עֲלֵיכֶם נְאֻם יְהוָה מַחְשְׁבוֹת שָׁלוֹם וְלֹא לְרָעָה לָתֵת לָכֶם אַחֲרִית וְתִקְוָה׃',
        Greek: 'ὅτι ἐγὼ οἶδα τοὺς λογισμοὺς οὓς ἐγὼ λογίζομαι ἐφ᾽ ὑμᾶς, λέγει κύριος, λογισμοὺς εἰρήνης καὶ οὐ κακῶν, τοῦ δοῦναι ὑμῖν ταῦτα.',
      },
    },
  },
  rev: {
    21: {
      4: {
        KJV: 'And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away.',
        NIV: '"He will wipe every tear from their eyes. There will be no more death or mourning or crying or pain, for the old order of things has passed away."',
        Hebrew: 'וּמָחָה אֱלֹהִים כָּל דִּמְעָה מֵעֵינֵיהֶם וְהַמָּוֶת לֹא יִהְיֶה עוֹד וְלֹא יִהְיֶה עוֹד אֵבֶל וְלֹא זְעָקָה וְלֹא מַכְאוֹב כִּי הָרִאשֹׁנוֹת עָבְרוּ׃',
        Greek: 'καὶ ἐξαλείψει πᾶν δάκρυον ἐκ τῶν ὀφθαλμῶν αὐτῶν, καὶ ὁ θάνατος οὐκ ἔσται ἔτι, οὔτε πένθος οὔτε κραυγὴ οὔτε πόνος οὐκ ἔσται ἔτι, ὅτι τὰ πρῶτα ἀπῆλθαν.',
      },
    },
    22: {
      20: {
        KJV: 'He which testifieth these things saith, Surely I come quickly. Amen. Even so, come, Lord Jesus.',
        NIV: 'He who testifies to these things says, "Yes, I am coming soon." Amen. Come, Lord Jesus.',
        Hebrew: 'הַמֵּעִיד עַל אֵלֶּה אֹמֵר אָמֵן בֹּא מַהֵר אָמֵן בֹּא אֲדוֹן יֵשׁוּעַ׃',
        Greek: 'Λέγει ὁ μαρτυρῶν ταῦτα· Ναί, ἔρχομαι ταχύ. Ἀμήν, ἔρχου, κύριε Ἰησοῦ.',
      },
    },
  },
};

// ─── Verse text templates per book genre ─────────────────────────────────────
const VERSE_TEMPLATES: Record<string, string[][]> = {
  Law: [
    ['And the LORD spoke unto Moses, saying,', 'And the LORD spake unto Moses, saying,', 'וַיְדַבֵּר יְהוָה אֶל מֹשֶׁה לֵּאמֹר׃', 'Καὶ ἐλάλησεν κύριος πρὸς Μωυσῆν λέγων·'],
    ['These are the commandments which the LORD commanded Moses for the children of Israel.', 'These are the commands the Lord gave Moses for the Israelites.', 'אֵלֶּה הַמִּצְוֹת אֲשֶׁר צִוָּה יְהוָה אֶת מֹשֶׁה לִבְנֵי יִשְׂרָאֵל׃', 'Αὗταί εἰσιν αἱ ἐντολαί, ἃς ἐνετείλατο κύριος τῷ Μωυσῇ πρὸς τοὺς υἱοὺς Ἰσραήλ.'],
    ['And it came to pass, when Moses had made an end of writing the words of this law in a book, until they were finished,', 'After Moses finished writing in a book the words of this law from beginning to end,', 'וַיְהִי כְּכַלּוֹת מֹשֶׁה לִכְתֹּב אֶת דִּבְרֵי הַתּוֹרָה הַזֹּאת עַל סֵפֶר עַד תֻּמָּם׃', 'Ἡνίκα δὲ συνετέλεσεν Μωυσῆς γράφων τοὺς λόγους τοῦ νόμου τούτου εἰς βιβλίον ἕως εἰς τέλος,'],
  ],
  History: [
    ['And it came to pass after these things, that God did tempt Abraham, and said unto him, Abraham: and he said, Behold, here I am.', 'Some time later God tested Abraham. He said to him, "Abraham!" "Here I am," he replied.', 'וַיְהִי אַחַר הַדְּבָרִים הָאֵלֶּה וְהָאֱלֹהִים נִסָּה אֶת אַבְרָהָם וַיֹּאמֶר אֵלָיו אַבְרָהָם וַיֹּאמֶר הִנֵּנִי׃', 'Καὶ ἐγένετο μετὰ τὰ ῥήματα ταῦτα ὁ θεὸς ἐπείραζεν τὸν Αβρααμ καὶ εἶπεν αὐτῷ Αβρααμ Αβρααμ. ὁ δὲ εἶπεν Ἰδοὺ ἐγώ.'],
    ['Now these are the kings of the land, whom the children of Israel smote, and possessed their land on the other side Jordan toward the rising of the sun,', 'These are the kings of the land whom the Israelites had defeated and whose territory they took over east of the Jordan,', 'וְאֵלֶּה מַלְכֵי הָאָרֶץ אֲשֶׁר הִכּוּ בְנֵי יִשְׂרָאֵל וַיִּרְשׁוּ אֶת אַרְצָם בְּעֵבֶר הַיַּרְדֵּן מִזְרְחָה הַשָּׁמֶשׁ׃', 'Καὶ οὗτοι οἱ βασιλεῖς τῆς γῆς, οὓς ἀνεῖλον οἱ υἱοὶ Ἰσραήλ, καὶ κατεκληρονόμησαν τὴν γῆν αὐτῶν πέραν τοῦ Ἰορδάνου ἀπ᾽ ἀνατολῶν ἡλίου,'],
    ['And the LORD was with Jehoshaphat, because he walked in the first ways of his father David, and sought not unto Baalim;', 'The Lord was with Jehoshaphat because he followed the ways of his father David before him. He did not consult the Baals', 'וַיְהִי יְהוָה עִם יְהוֹשָׁפָט כִּי הָלַךְ בְּדַרְכֵי דָוִיד אָבִיו הָרִאשֹׁנִים וְלֹא דָרַשׁ לַבְּעָלִים׃', 'Καὶ ἦν κύριος μετὰ Ἰωσαφατ, ὅτι ἐπορεύθη ἐν ταῖς ὁδοῖς τοῦ πατρὸς αὐτοῦ ταῖς πρώταις καὶ οὐκ ἐξεζήτησεν τὰ Βααλιμ·'],
  ],
  Wisdom: [
    ['Blessed is the man that walketh not in the counsel of the ungodly, nor standeth in the way of sinners, nor sitteth in the seat of the scornful.', 'Blessed is the one who does not walk in step with the wicked or stand in the way that sinners take or sit in the company of mockers,', 'אַשְׁרֵי הָאִישׁ אֲשֶׁר לֹא הָלַךְ בַּעֲצַת רְשָׁעִים וּבְדֶרֶךְ חַטָּאִים לֹא עָמָד וּבְמוֹשַׁב לֵצִים לֹא יָשָׁב׃', 'Μακάριος ἀνήρ, ὃς οὐκ ἐπορεύθη ἐν βουλῇ ἀσεβῶν καὶ ἐν ὁδῷ ἁμαρτωλῶν οὐκ ἔστη καὶ ἐπὶ καθέδραν λοιμῶν οὐκ ἐκάθισεν·'],
    ['The LORD is my strength and my shield; my heart trusted in him, and he helps me. My heart leaps for joy, and with my song I praise him.', 'The Lord is my strength and my shield; my heart trusts in him, and he helps me. My heart leaps for joy, and with my song I praise him.', 'יְהוָה עֻזִּי וּמָגִנִּי בּוֹ בָטַח לִבִּי וְנֶעֱזָרְתִִי וַיַּעֲלֹז לִבִּי וּמִשִּׁירִי אֲהוֹדֶנּוּ׃', 'Κύριος ἐμοὶ βοηθός, καὶ ὑπερασπιστής μου· ἐπ᾽ αὐτῷ ἤλπισεν ἡ καρδία μου, καὶ ἐβοηθήθην·'],
    ['How amiable are thy tabernacles, O LORD of hosts!', 'How lovely is your dwelling place, Lord Almighty!', 'מַה יְּדִידוֹת מִשְׁכְּנוֹתֶיךָ יְהוָה צְבָאוֹת׃', 'Ὡς ἀγαπητὰ τὰ σκηνώματά σου, κύριε τῶν δυνάμεων.'],
  ],
  'Major Prophets': [
    ['Comfort ye, comfort ye my people, saith your God.', '"Comfort, comfort my people," says your God.', 'נַחֲמוּ נַחֲמוּ עַמִּי יֹאמַר אֱלֹהֵיכֶם׃', 'Παρακαλεῖτε παρακαλεῖτε τὸν λαόν μου, λέγει ὁ θεός.'],
    ['The word of the LORD came unto me, saying,', 'The word of the Lord came to me:', 'וַיְהִי דְבַר יְהוָה אֵלַי לֵאמֹר׃', 'Καὶ ἐγένετο λόγος κυρίου πρός με λέγων·'],
    ['Thus saith the LORD of hosts; Consider your ways.', 'This is what the Lord Almighty says: "Give careful thought to your ways."', 'כֹּה אָמַר יְהוָה צְבָאוֹת שִׂימוּ לְבַבְכֶם עַל דַּרְכֵיכֶם׃', 'Τάδε λέγει κύριος παντοκράτωρ· Τάξατε τὰς καρδίας ὑμῶν εἰς τὰς ὁδοὺς ὑμῶν.'],
  ],
  'Minor Prophets': [
    ['The word of the LORD that came unto Hosea, the son of Beeri, in the days of Uzziah, Jotham, Ahaz, and Hezekiah, kings of Judah,', 'The word of the Lord that came to Hosea son of Beeri during the reigns of Uzziah, Jotham, Ahaz and Hezekiah, kings of Judah,', 'דְּבַר יְהוָה אֲשֶׁר הָיָה אֶל הוֹשֵׁעַ בֶּן בְּאֵרִי בִּימֵי עֻזִּיָּה יוֹתָם אָחָז יְחִזְקִיָּה מַלְכֵי יְהוּדָה׃', 'Λόγος κυρίου, ὃς ἐγενήθη πρὸς Ωσηε τὸν τοῦ Βεηρι, ἐν ἡμέραις Οζιου καὶ Ιωαθαμ καὶ Αχαζ καὶ Εζεκιου βασιλέων Ιουδα,'],
    ['Thus saith the LORD; For three transgressions, and for four, I will not turn away the punishment thereof;', 'This is what the Lord says: "For three sins, even for four, I will not relent."', 'כֹּה אָמַר יְהוָה עַל שְׁלֹשָׁה פִּשְׁעֵי וְעַל אַרְבָּעָה לֹא אֲשִׁיבֶנּוּ׃', 'Τάδε λέγει κύριος· Ἐπὶ τρισὶν ἀσεβείαις καὶ ἐπὶ τέτρασιν οὐκ ἀποστραφήσομαι αὐτόν·'],
    ['Return, O Israel, to the LORD thy God; for thou hast fallen by thine iniquity.', 'Return, Israel, to the Lord your God. Your sins have been your downfall!', 'שׁוּבָה יִשְׂרָאֵל עַד יְהוָה אֱלֹהֶיךָ כִּי כָשַׁלְתָּ בַּעֲוֹנֶךָ׃', 'Ἐπίστρεψον, Ισραηλ, πρὸς κύριον τὸν θεόν σου, διότι ἠσθένησας ἐν ταῖς ἀδικίαις σου.'],
  ],
  Gospels: [
    ['And Jesus went about all Galilee, teaching in their synagogues, and preaching the gospel of the kingdom, and healing all manner of sickness and all manner of disease among the people.', 'Jesus went throughout Galilee, teaching in their synagogues, proclaiming the good news of the kingdom, and healing every disease and sickness among the people.', 'וַיִּסַּב יֵשׁוּעַ בְּכָל הַגָּלִיל מְלַמֵּד בְּבָתֵּי כְנֵסִיּוֹתֵיהֶם וּמַכְרִיז אֶת בְּשׂוֹרַת הַמַּלְכוּת וּמְרַפֵּא כָּל חֳלִי וְכָל מַדְוֶה בָּעָם׃', 'Καὶ περιῆγεν ὅλην τὴν Γαλιλαίαν, διδάσκων ἐν ταῖς συναγωγαῖς αὐτῶν καὶ κηρύσσων τὸ εὐαγγέλιον τῆς βασιλείας καὶ θεραπεύων πᾶσαν νόσον καὶ πᾶσαν μαλακίαν ἐν τῷ λαῷ.'],
    ['And they were astonished at his doctrine: for he taught them as one that had authority, and not as the scribes.', 'The people were amazed at his teaching, because he taught them as one who had authority, not as the teachers of the law.', 'וַיִּשְׁתּוֹמְמוּ עַל תּוֹרָתוֹ כִּי הָיָה מְלַמֵּד אוֹתָם כְּבַעַל סַמְכוּת וְלֹא כַּסּוֹפְרִים׃', 'καὶ ἐξεπλήσσοντο ἐπὶ τῇ διδαχῇ αὐτοῦ· ἦν γὰρ διδάσκων αὐτοὺς ὡς ἐξουσίαν ἔχων, καὶ οὐχ ὡς οἱ γραμματεῖς.'],
    ['And he arose, and rebuked the wind, and said unto the sea, Peace, be still. And the wind ceased, and there was a great calm.', 'He got up, rebuked the wind and said to the waves, "Quiet! Be still!" Then the wind died down and it was completely calm.', 'וַיָּקָם וַיִּגְעַר בָּרוּחַ וַיֹּאמֶר אֶל הַיָּם שְׁתֹק הַס וַתִּשְׁבֹּת הָרוּחַ וַתְּהִי דְּמָמָה גְדוֹלָה׃', 'καὶ διεγερθεὶς ἐπετίμησεν τῷ ἀνέμῳ καὶ εἶπεν τῇ θαλάσσῃ· Σιώπα, πεφίμωσο. καὶ ἐκόπασεν ὁ ἄνεμος, καὶ ἐγένετο γαλήνη μεγάλη.'],
  ],
  Epistles: [
    ['Paul, an apostle of Jesus Christ by the will of God, to the saints which are at Ephesus, and to the faithful in Christ Jesus:', "Paul, an apostle of Christ Jesus by the will of God, To God's holy people in Ephesus, the faithful in Christ Jesus:", 'פָּאוּלוֹס שְׁלִיחַ יֵשׁוּעַ הַמָּשִׁיחַ בִּרְצוֹן הָאֱלֹהִים לַקְּדוֹשִׁים אֲשֶׁר בְּאֶפֶסוֹס וְלַנֶּאֱמָנִים בְּמָשִׁיחַ יֵשׁוּעַ׃', 'Παῦλος ἀπόστολος Χριστοῦ Ἰησοῦ διὰ θελήματος θεοῦ τοῖς ἁγίοις τοῖς οὖσιν ἐν Ἐφέσῳ καὶ πιστοῖς ἐν Χριστῷ Ἰησοῦ·'],
    ['Grace be unto you, and peace, from God our Father, and from the Lord Jesus Christ.', 'Grace and peace to you from God our Father and the Lord Jesus Christ.', 'חֶסֶד לָכֶם וְשָׁלוֹם מֵאֵת אֱלֹהִים אָבִינוּ וּמֵאֵת אֲדוֹן יֵשׁוּעַ הַמָּשִׁיחַ׃', 'χάρις ὑμῖν καὶ εἰρήνη ἀπὸ θεοῦ πατρὸς ἡμῶν καὶ κυρίου Ἰησοῦ Χριστοῦ.'],
    ['I thank my God upon every remembrance of you,', 'I thank my God every time I remember you.', 'אוֹדֶה לֵאלֹהַי בְּכָל זִכְרוֹנִי אֶתְכֶם׃', 'Εὐχαριστῶ τῷ θεῷ μου ἐπὶ πάσῃ τῇ μνείᾳ ὑμῶν,'],
  ],
  Prophecy: [
    ['The Revelation of Jesus Christ, which God gave unto him, to shew unto his servants things which must shortly come to pass;', 'The revelation from Jesus Christ, which God gave him to show his servants what must soon take place.', 'גִּלּוּי יֵשׁוּעַ הַמָּשִׁיחַ אֲשֶׁר נָתַן לוֹ הָאֱלֹהִים לְהַרְאוֹת לַעֲבָדָיו אֵת אֲשֶׁר צָרִיךְ לִהְיוֹת בִּמְהֵרָה׃', 'Ἀποκάλυψις Ἰησοῦ Χριστοῦ, ἣν ἔδωγεν αὐτῷ ὁ θεός, δεῖξαι τοῖς δούλοις αὐτοῦ ἃ δεῖ γενέσθαι ἐν τάχει,'],
    ['Blessed is he that readeth, and they that hear the words of this prophecy, and keep those things which are written therein: for the time is at hand.', 'Blessed is the one who reads aloud the words of this prophecy, and blessed are those who hear it and take to heart what is written in it, because the time is near.', 'אַשְׁרֵי הַקּוֹרֵא וְהַשּׁוֹמְעִים אֶת דִּבְרֵי הַנְּבוּאָה הַזֹּאת וְשׁוֹמְרִים אֶת הַכָּתוּב בָּהּ כִּי הַזְּמַן קָרוֹב׃', 'μακάριος ὁ ἀναγινώσκων καὶ οἱ ἀκούοντες τοὺς λόγους τῆς προφητείας καὶ τηροῦντες τὰ ἐν αὐτῇ γεγραμμένα, ὁ γὰρ καιρὸς ἐγγύς.'],
    ['And I saw a new heaven and a new earth: for the first heaven and the first earth were passed away; and there was no more sea.', 'Then I saw "a new heaven and a new earth," for the first heaven and the first earth had passed away, and there was no longer any sea.', 'וָאֶרְאֶה שָׁמַיִם חֲדָשִׁים וָאָרֶץ חֲדָשָׁה כִּי הַשָּׁמַיִם הָרִאשֹׁנִים וְהָאָרֶץ הָרִאשֹׁנָה עָבְרוּ וְהַיָּם אֵינֶנּוּ עוֹד׃', 'Καὶ εἶδον οὐρανὸν καινὸν καὶ γῆν καινήν· ὁ γὰρ πρῶτος οὐρανὸς καὶ ἡ πρώτη γῆ ἀπῆλθαν, καὶ ἡ θάλασσα οὐκ ἔστιν ἔτι.'],
  ],
};

// ─── Translation index helper ─────────────────────────────────────────────────
const TRANSLATION_IDX: Record<TranslationKey, number> = {
  KJV: 0, NIV: 1, Hebrew: 2, Greek: 3, GNV: 0, RSV: 1,
};

// ─── Generate a verse text for a given book/chapter/verse/translation ─────────
function generateVerseText(
  bookId: string,
  chapter: number,
  verse: number,
  translation: TranslationKey,
  genre: string,
): string {
  // 1. Check for a real embedded verse
  const realBook = REAL_VERSES[bookId];
  if (realBook?.[chapter]?.[verse]?.[translation]) {
    return realBook[chapter][verse][translation] as string;
  }

  // 2. Fall back to a genre template (deterministic by verse number)
  const templates = VERSE_TEMPLATES[genre] ?? VERSE_TEMPLATES['History'];
  const tpl = templates[(verse - 1) % templates.length];
  const idx = Math.min(TRANSLATION_IDX[translation] ?? 0, tpl.length - 1);
  const base = tpl[idx];

  // Append a light contextual suffix so each verse is distinguishable
  const suffix = translation === 'Hebrew' || translation === 'Greek'
    ? ''
    : ` (${bookId.toUpperCase()} ${chapter}:${verse})`;
  return base + suffix;
}

// ─── localStorage helpers ─────────────────────────────────────────────────────
function storageGet<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function storageSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage quota exceeded — silently ignore
  }
}

function storageRemove(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    // ignore
  }
}

interface CacheMeta {
  version: string;
  lastCached: string;
  cachedBookIds: string[];
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Returns the verses for a given book + chapter + translation.
 * Checks localStorage first; generates and caches them on miss.
 */
export function getOrGenerateChapter(
  bookId: string,
  chapter: number,
  translation: TranslationKey,
): CachedVerse[] {
  const cacheKey = `${CACHE_KEY_PREFIX}${bookId}_${chapter}_${translation}`;
  const cached = storageGet<CachedVerse[]>(cacheKey);
  if (cached && Array.isArray(cached) && cached.length > 0) {
    return cached;
  }

  // Find book metadata for verse count and genre
  const book = BIBLE_BOOKS.find((b) => b.id === bookId);
  if (!book) return [];

  // Approximate verse count per chapter (actual counts vary; use a reasonable default)
  // Real apps would look this up from a full verse-count table.
  const verseCount = Math.max(10, Math.round(book.verses / book.chapters));

  const verses: CachedVerse[] = Array.from({ length: verseCount }, (_, i) => ({
    verse: i + 1,
    text: generateVerseText(bookId, chapter, i + 1, translation, book.genre),
  }));

  storageSet(cacheKey, verses);
  return verses;
}

/**
 * Returns a snapshot of the overall cache state for the UI.
 */
export function getCacheStatus(): CacheStatus {
  const meta = storageGet<CacheMeta>(CACHE_META_KEY);
  const cachedBooks = meta?.cachedBookIds?.length ?? 0;

  return {
    cached: cachedBooks > 0,
    totalBooks: BIBLE_BOOKS.length,
    cachedBooks,
    lastCached: meta?.lastCached ?? null,
    cacheVersion: meta?.version ?? CACHE_VERSION,
  };
}

/**
 * Pre-populates the cache for every book × all translations.
 * Runs asynchronously so it doesn't block the UI.
 */
export async function cacheAllBooks(): Promise<void> {
  const TRANSLATIONS: TranslationKey[] = ['KJV', 'NIV', 'Hebrew', 'Greek', 'GNV', 'RSV'];
  const cachedBookIds: string[] = [];

  for (const book of BIBLE_BOOKS) {
    for (let ch = 1; ch <= book.chapters; ch++) {
      for (const translation of TRANSLATIONS) {
        // Only generate if not already cached
        const cacheKey = `${CACHE_KEY_PREFIX}${book.id}_${ch}_${translation}`;
        if (!storageGet(cacheKey)) {
          getOrGenerateChapter(book.id, ch, translation);
        }
      }
    }
    if (!cachedBookIds.includes(book.id)) {
      cachedBookIds.push(book.id);
    }

    // Yield to the event loop between books to keep the UI responsive
    await new Promise<void>((resolve) => setTimeout(resolve, 0));
  }

  const meta: CacheMeta = {
    version: CACHE_VERSION,
    lastCached: new Date().toISOString(),
    cachedBookIds,
  };
  storageSet(CACHE_META_KEY, meta);
}

/**
 * Removes all bible cache entries from localStorage.
 */
export function clearBibleCache(): void {
  const keysToRemove: string[] = [];

  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(CACHE_KEY_PREFIX)) {
        keysToRemove.push(key);
      }
    }
  } catch {
    // ignore
  }

  keysToRemove.forEach(storageRemove);
  storageRemove(CACHE_META_KEY);
}
