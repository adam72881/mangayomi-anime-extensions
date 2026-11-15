const mangayomiSources = [
    {
        "name": "AnimeSaturn",
        "lang": "it",
        "baseUrl": "https://www.animesaturn.net",
        "apiUrl": "",
        "iconUrl": "https://www.google.com/s2/favicons?sz=64&domain=animesaturn.net",
        "typeSource": "single",
        "isNsfw": false,
        "itemType": 1,
        "version": "1.0.0",
        "dateFormat": "",
        "dateFormatLocale": "",
        "pkgPath": "anime/src/it/animesaturn.js",
    },
];

const DEFAULT_BASE = "https://www.animesaturn.net";
const PREF_BASE = "animesaturn_base_url";
const PREF_QUALITY = "animesaturn_quality";
const PREF_SERVER = "animesaturn_server";

// Id del modulo /filter, letti il 15 novembre 2026.
const GENRES = [
    ["3", "Arti Marziali"],
    ["5", "Avanguardia"],
    ["2", "Avventura"],
    ["1", "Azione"],
    ["47", "Bambini"],
    ["4", "Commedia"],
    ["6", "Demoni"],
    ["7", "Drammatico"],
    ["8", "Ecchi"],
    ["9", "Fantasy"],
    ["10", "Gioco"],
    ["11", "Harem"],
    ["43", "Hentai"],
    ["13", "Horror"],
    ["49", "Isekai"],
    ["14", "Josei"],
    ["16", "Magia"],
    ["18", "Mecha"],
    ["19", "Militari"],
    ["21", "Mistero"],
    ["20", "Musicale"],
    ["22", "Parodia"],
    ["23", "Polizia"],
    ["24", "Psicologico"],
    ["46", "Romantico"],
    ["26", "Samurai"],
    ["28", "Sci-Fi"],
    ["27", "Scolastico"],
    ["29", "Seinen"],
    ["25", "Sentimentale"],
    ["30", "Shoujo"],
    ["31", "Shoujo Ai"],
    ["32", "Shounen"],
    ["33", "Shounen Ai"],
    ["34", "Slice of Life"],
    ["37", "Soprannaturale"],
    ["35", "Spazio"],
    ["36", "Sport"],
    ["12", "Storico"],
    ["38", "Superpoteri"],
    ["39", "Thriller"],
    ["40", "Vampiri"],
    ["48", "Veicoli"],
    ["41", "Yaoi"],
    ["42", "Yuri"],
];

const STUDIOS = [
    ["398", "100studio"],
    ["92", "2:10 Animation"],
    ["357", "5 Inc."],
    ["62", "8bit"],
    ["3", "A-1 Pictures"],
    ["159", "A-Real"],
    ["201", "A.C.G.T."],
    ["517", "A24"],
    ["362", "ABJ COMPANY"],
    ["496", "Academy Productions"],
    ["35", "Acca effe"],
    ["189", "Actas"],
    ["296", "Adonero"],
    ["455", "Aeonium"],
    ["132", "AIC"],
    ["209", "AIC ASTA"],
    ["208", "AIC Build"],
    ["222", "AIC Classic"],
    ["340", "AIC Frontier"],
    ["140", "AIC PLUS+"],
    ["148", "AIC Spirits"],
    ["553", "Aisle"],
    ["116", "Ajia-do"],
    ["329", "Akatsuki"],
    ["174", "Albacrow"],
    ["352", "Alfred Imageworks"],
    ["253", "An DerCen"],
    ["261", "aNCHOR"],
    ["151", "Anima"],
    ["119", "Anima&Co."],
    ["396", "animate Film"],
    ["150", "Animation Do"],
    ["480", "animation studio42"],
    ["388", "Ankama Animations"],
    ["442", "Anpro"],
    ["472", "AOI Pro."],
    ["50", "APPP"],
    ["294", "AQUA ARIS"],
    ["319", "ARECT"],
    ["136", "Ark"],
    ["84", "Arms"],
    ["145", "Artland"],
    ["342", "Artmic"],
    ["8", "Arvo Animation"],
    ["26", "Asahi Production"],
    ["523", "Ascension"],
    ["236", "Ascension"],
    ["354", "Ashi Productions"],
    ["338", "ASK Animation Studio"],
    ["88", "asread."],
    ["474", "Assez Finaud Fabric"],
    ["483", "Atelier Peuplier"],
    ["317", "Atelier Pontdarc"],
    ["556", "AtoriE"],
    ["555", "Atra"],
    ["490", "Aubeck"],
    ["538", "Aura Studio"],
    ["405", "Avaco Creative Studios"],
    ["180", "AXsiZ"],
    ["110", "B.CMAY PICTURES"],
    ["427", "B.COOL STUDIO"],
    ["29", "Bakken Record"],
    ["549", "Bakkka"],
    ["74", "Bandai Namco Pictures"],
    ["266", "Barnum Studio"],
    ["309", "Bee Media"],
    ["225", "Bee Train"],
    ["479", "Bellnox Films"],
    ["498", "BENTEN Film"],
    ["141", "BeSTACK"],
    ["334", "Bibury Animation CG"],
    ["108", "Bibury Animation Studios"],
    ["68", "Big Firebird Culture"],
    ["487", "BIGBIGSUN"],
    ["234", "Blade"],
    ["177", "Blaze Studio"],
    ["375", "BloomZ"],
    ["9", "Bones"],
    ["421", "Bones Film"],
    ["507", "BooKong Culture"],
    ["86", "Brain's Base"],
    ["4", "Bridge"],
    ["516", "Brio Animation"],
    ["361", "BUG FILMS"],
    ["473", "BUILD DREAM"],
    ["93", "C-Station"],
    ["17", "C2C"],
    ["543", "CALF"],
    ["154", "CGCG Studio"],
    ["224", "Chaos Project"],
    ["297", "Charaction"],
    ["162", "Children's Playground Entertainment"],
    ["493", "Circus Production"],
    ["332", "CLAP"],
    ["440", "Climax Studio"],
    ["503", "Cloud Art"],
    ["318", "Cloud Hearts"],
    ["2", "CloverWorks"],
    ["52", "CMC Media"],
    ["403", "Cocktail Media"],
    ["69", "Colored Pencil Animation"],
    ["311", "Colored Pencil Animation Japan"],
    ["544", "CoMix Wave"],
    ["44", "CoMix Wave Films"],
    ["366", "CompTown"],
    ["33", "Connect"],
    ["247", "Craftar Studios"],
    ["432", "Creators Dot Com"],
    ["178", "Creators in Pack"],
    ["457", "Crew-Cell"],
    ["500", "Cue"],
    ["226", "CyberConnect2"],
    ["468", "Cyclone Graphics"],
    ["194", "CygamesPictures"],
    ["534", "Cypic"],
    ["551", "D.A.S.T Corporation"],
    ["546", "Dai-Ichi Douga"],
    ["265", "DandeLion Animation Studio"],
    ["310", "Dangun Pictures"],
    ["547", "Darts"],
    ["215", "Daume"],
    ["61", "David Production"],
    ["254", "Dawn Animation"],
    ["437", "Digital Frontier"],
    ["347", "Digital Network Animation"],
    ["66", "Diomedéa"],
    ["293", "Djinn Power"],
    ["82", "DLE"],
    ["198", "DMM.futureworks"],
    ["34", "Doga Kobo"],
    ["304", "domerica"],
    ["391", "Dongwoo A&E"],
    ["237", "DR Movie"],
    ["277", "DRAWIZ"],
    ["118", "Drive"],
    ["235", "drop"],
    ["508", "DropWave"],
    ["470", "dwarf"],
    ["153", "Dynamo Pictures"],
    ["380", "E&H Production"],
    ["471", "Eallin"],
    ["264", "East Fish Studio"],
    ["169", "Egg Firm"],
    ["542", "Eiken"],
    ["99", "EKACHI EPILKA"],
    ["552", "Electric Circus"],
    ["475", "ElectromagneticWave"],
    ["302", "Elias"],
    ["557", "Ellipse Animation"],
    ["240", "Emon"],
    ["122", "EMT Squared"],
    ["103", "Encourage Films"],
    ["117", "ENGI"],
    ["415", "Enishiya"],
    ["418", "EOTA"],
    ["486", "Equator"],
    ["290", "Ether Kitten"],
    ["365", "evg"],
    ["94", "Ezόla"],
    ["121", "Fanworks"],
    ["23", "feel."],
    ["164", "Felix Film"],
    ["289", "Fenz"],
    ["230", "Fifth Avenue"],
    ["173", "FILMONY"],
    ["314", "Flagship Line"],
    ["337", "Flat Studio"],
    ["81", "Foch Film"],
    ["269", "Fortes"],
    ["518", "Frederator Studios"],
    ["346", "Front Line"],
    ["363", "Fugaku"],
    ["263", "Fuji TV"],
    ["97", "G-angle"],
    ["385", "G&G Direction"],
    ["280", "G&G Entertainment"],
    ["414", "Ga-Crew"],
    ["83", "Gaina"],
    ["147", "Gainax"],
    ["115", "Gainax Kyoto"],
    ["200", "Gallop"],
    ["206", "GANSIS"],
    ["238", "GARDEN Culture"],
    ["11", "Gathering"],
    ["105", "Geek Toys"],
    ["358", "Gekkou"],
    ["186", "GEMBA"],
    ["167", "Geno Studio"],
    ["548", "GeyeG Pictures"],
    ["306", "Gift-o’-Animation"],
    ["36", "Giga Production"],
    ["275", "Ginga Ya"],
    ["109", "GoHands"],
    ["58", "Gonzo"],
    ["193", "Gosay Studio"],
    ["60", "Graphinica"],
    ["532", "Grass"],
    ["355", "Gravity Well"],
    ["170", "GRIZZLY"],
    ["228", "Group TAC"],
    ["494", "Grouper Productions"],
    ["157", "Guton Animation Studio"],
    ["47", "HAL Film Maker"],
    ["51", "Haoliners Animation"],
    ["412", "Hayabusa Film"],
    ["431", "Heart & Soul Animation"],
    ["348", "HMCH"],
    ["53", "Hoods Entertainment"],
    ["168", "HORNETS"],
    ["315", "Hotline"],
    ["276", "HOTZIPANG"],
    ["356", "HuaMei Animation"],
    ["142", "I.Gzwei"],
    ["134", "Ijigen Tokyo"],
    ["111", "ILCA"],
    ["379", "ILCASHIPS"],
    ["452", "Imageworks Studio"],
    ["400", "Imagica Infos"],
    ["163", "IMAGICA Lab."],
    ["213", "Imagin"],
    ["135", "Imagineer"],
    ["313", "Indivision"],
    ["197", "Issen"],
    ["28", "J.C.Staff"],
    ["439", "Japan Vistec"],
    ["550", "Jinnis Animation Studios"],
    ["335", "Jumondou"],
    ["284", "Jumonji"],
    ["499", "Juvenage"],
    ["217", "K-Factory"],
    ["255", "Kachidoki Studio"],
    ["426", "Kachigarasu"],
    ["190", "Kamikaze Douga"],
    ["492", "Kaname Productions"],
    ["554", "Kayac Animation"],
    ["459", "KeyEast"],
    ["46", "Khara"],
    ["324", "Kigumi"],
    ["54", "Kinema Citrus"],
    ["394", "Kino Production"],
    ["515", "Kio Studio"],
    ["218", "Kitty Film Mitaka Studio"],
    ["231", "Knack Productions"],
    ["407", "Kokusai Eigasha"],
    ["430", "Konami animation"],
    ["279", "KSS"],
    ["371", "Kung Fu Frog Animation"],
    ["49", "Kyoto Animation"],
    ["175", "l-a-unch・BOX"],
    ["558", "La Chouette Compagnie"],
    ["509", "Laftel"],
    ["100", "LAN Studio"],
    ["90", "LandQ studios"],
    ["32", "Lapin Track"],
    ["149", "Larx Entertainment"],
    ["98", "Lay-duce"],
    ["89", "Lerche"],
    ["12", "Lesprit"],
    ["353", "Liber"],
    ["195", "LICO"],
    ["24", "LIDENFILMS"],
    ["341", "Life Work"],
    ["384", "Light Chaser Animation Studios"],
    ["301", "Lingsanwu Animation"],
    ["424", "LinQ"],
    ["130", "Live2D Creative Studio"],
    ["370", "Liyu Culture"],
    ["241", "LMD"],
    ["199", "lxtl"],
    ["131", "Lyrics"],
    ["129", "M.S.C"],
    ["13", "Madhouse"],
    ["185", "Magia Doraglier"],
    ["1", "Magic Bus"],
    ["95", "Maho Film"],
    ["381", "Makaria"],
    ["397", "Manaa Animation"],
    ["429", "Manga Productions"],
    ["183", "Manglobe"],
    ["31", "MAPPA"],
    ["250", "Marone"],
    ["466", "Maru Animation"],
    ["214", "Marvy Jack"],
    ["478", "Marza Animation Planet"],
    ["409", "miHoYoAnime"],
    ["331", "Mili Pictures"],
    ["91", "Millepensee"],
    ["383", "Minami Machi Bugyousho"],
    ["369", "Mippei Eigeki Kiryuukan"],
    ["497", "Miyu Productions"],
    ["171", "MMT Technology"],
    ["73", "monofilmo"],
    ["445", "Mook DLE"],
    ["522", "Mua Film"],
    ["270", "Mushi Production"],
    ["143", "Namu Animation"],
    ["77", "NAZ"],
    ["514", "Netflix Animation"],
    ["537", "Newon"],
    ["96", "Nexus"],
    ["156", "Nice Boat Animation"],
    ["533", "Nichicaline"],
    ["513", "Nickelodeon Animation Studio"],
    ["125", "Nihon Ad Systems"],
    ["221", "Nippon Animation"],
    ["188", "Nomad"],
    ["155", "Nut"],
    ["482", "Nyan Pollution"],
    ["477", "October Media"],
    ["495", "Office Academy"],
    ["285", "Okuruto Noboru"],
    ["25", "OLM"],
    ["267", "OLM Digital"],
    ["126", "Orange"],
    ["232", "Ordet"],
    ["502", "ORENDA"],
    ["504", "Original Force"],
    ["540", "Outline"],
    ["392", "Oxybot"],
    ["325", "OZ"],
    ["14", "P.A. Works"],
    ["303", "P.I.C.S."],
    ["239", "Palm Studio"],
    ["372", "Panda Tower Studio"],
    ["312", "Paper Plane Animation Studio"],
    ["38", "Passione"],
    ["248", "Pastel"],
    ["120", "Pb Animation"],
    ["282", "Peak Hunt"],
    ["443", "Pepper Conpanna"],
    ["393", "PHANTOM"],
    ["446", "Phoenix Entertainment"],
    ["530", "Picante Circus"],
    ["438", "Picograph"],
    ["404", "Picture Magic"],
    ["411", "Pierrot Films"],
    ["16", "Pierrot Plus"],
    ["179", "PINE JAM"],
    ["22", "Platinum Vision"],
    ["242", "Plum"],
    ["158", "Polygon Pictures"],
    ["519", "Powerhouse Animation Studios"],
    ["165", "PRA"],
    ["246", "PrimeTime"],
    ["330", "Production +h."],
    ["212", "production doA"],
    ["298", "Production GoodBook"],
    ["40", "Production I.G"],
    ["128", "Production IMS"],
    ["114", "Production Reed"],
    ["521", "Project 51 Productions"],
    ["106", "Project No.9"],
    ["467", "Project Studio Q"],
    ["545", "Project Team Argos"],
    ["535", "Psyde Kick Studio"],
    ["395", "Public & Basic"],
    ["272", "Purple Cow Studio Japan"],
    ["526", "Qiying Animation"],
    ["485", "Qiyuan Yinghua"],
    ["512", "QPOLA Corp."],
    ["323", "Quad"],
    ["249", "Qualia Animation"],
    ["308", "Qubic Pictures"],
    ["481", "Qzil.la"],
    ["359", "Rabbit Gate"],
    ["245", "Radix"],
    ["451", "Raiose"],
    ["460", "REALTHING"],
    ["196", "Red Dog Culture House"],
    ["423", "Reirs"],
    ["436", "Remic"],
    ["127", "Revoroot"],
    ["229", "Rising Force"],
    ["488", "Rock'n Roll Mountain"],
    ["345", "Rockwell Eyes"],
    ["399", "ROLL2"],
    ["339", "Ruo Hong Culture"],
    ["501", "S.o.K"],
    ["506", "Saber Project"],
    ["419", "Saber Works"],
    ["37", "Saetta"],
    ["416", "SAFEHOUSE"],
    ["350", "Samsara Animation Studio"],
    ["434", "Sanrio"],
    ["161", "SANZIGEN"],
    ["441", "Sasayuri"],
    ["59", "Satelight"],
    ["42", "Science SARU"],
    ["529", "Sconosciuto"],
    ["336", "Scooter Films"],
    ["19", "Seven"],
    ["144", "Seven Arcs"],
    ["113", "Seven Arcs Pictures"],
    ["85", "Seven Stone Entertainment"],
    ["70", "Shaft"],
    ["520", "Shankar Animation"],
    ["326", "Sharefun Studio"],
    ["433", "Shengying Animation"],
    ["469", "Shenman Entertainment"],
    ["107", "Shin-Ei Animation"],
    ["461", "Shinkuukan"],
    ["260", "Shirogumi"],
    ["449", "Shogakukan Music & Digital Entertainment"],
    ["137", "Shuka"],
    ["78", "Signal.MD"],
    ["7", "Silver"],
    ["20", "SILVER LINK."],
    ["305", "Soft Garage"],
    ["425", "Soigne"],
    ["41", "Sola Digital Arts"],
    ["511", "Sola Entertainment"],
    ["447", "Sotsu"],
    ["191", "Space Neko Company"],
    ["463", "Sparkly Key Animation Studio"],
    ["510", "SpindleHorse Toons"],
    ["268", "Sprite Animation Studios"],
    ["343", "Staple Entertainment"],
    ["244", "StarLink"],
    ["373", "Stellar Pictures"],
    ["344", "Steve N' Steven"],
    ["462", "Stingray"],
    ["64", "Studio 3Hz"],
    ["182", "Studio 4°C"],
    ["10", "Studio A-CAT"],
    ["378", "Studio Add"],
    ["262", "Studio Animal"],
    ["349", "Studio Barcelona"],
    ["300", "Studio Bind"],
    ["204", "Studio Blanc."],
    ["176", "Studio CANDY BOX"],
    ["80", "Studio Chizu"],
    ["484", "Studio Chromato"],
    ["448", "Studio Clutch"],
    ["172", "Studio Colorido"],
    ["30", "Studio Comet"],
    ["476", "Studio Dadashow"],
    ["327", "Studio Daisy"],
    ["6", "Studio Deen"],
    ["417", "Studio DURIAN"],
    ["539", "Studio Eek"],
    ["273", "Studio Elle"],
    ["252", "Studio Fantasia"],
    ["181", "Studio Flad"],
    ["210", "Studio Flag"],
    ["456", "Studio Fusion"],
    ["453", "Studio Gazelle"],
    ["184", "Studio Ghibli"],
    ["428", "Studio Goindol"],
    ["75", "Studio Gokumi"],
    ["152", "Studio GOONEYS"],
    ["464", "Studio Graph77"],
    ["491", "Studio Hakk"],
    ["505", "Studio Harutonari"],
    ["251", "Studio Hibari"],
    ["87", "Studio Hokiboshi"],
    ["307", "Studio Jemi"],
    ["382", "Studio Junio"],
    ["321", "Studio Kafka"],
    ["227", "Studio KAI"],
    ["333", "Studio KeepFire"],
    ["420", "Studio LEO"],
    ["283", "Studio Lings"],
    ["220", "Studio M2"],
    ["465", "studio maf"],
    ["377", "Studio Massket"],
    ["243", "Studio Matrix"],
    ["351", "Studio Mir"],
    ["413", "Studio Moe"],
    ["322", "studio MOTHER"],
    ["402", "Studio N"],
    ["406", "Studio Nanahoshi"],
    ["316", "Studio Palette"],
    ["256", "Studio Pastoral"],
    ["48", "Studio Pierrot"],
    ["376", "Studio Polon"],
    ["401", "Studio Ponoc"],
    ["408", "Studio Ppuri"],
    ["18", "Studio PuYUKAI"],
    ["271", "Studio Rikka"],
    ["541", "Studio Signal"],
    ["166", "Studio Signpost"],
    ["65", "Studio VOLN"],
    ["458", "Studio Zero"],
    ["292", "Sublimation"],
    ["223", "Success Corp."],
    ["55", "Sunrise"],
    ["123", "Sunrise Beyond"],
    ["287", "Synergy Japan"],
    ["192", "SynergySP"],
    ["56", "Tatsunoko Production"],
    ["386", "TCJ"],
    ["390", "Team OneOne"],
    ["291", "Team TillDawn"],
    ["295", "team Yamahitsuji"],
    ["368", "Team YokkyuFuman"],
    ["233", "teamKG"],
    ["27", "Tear Studio"],
    ["422", "Teddy"],
    ["139", "Telecom Animation Film"],
    ["71", "Tezuka Productions"],
    ["133", "The Answer Studio"],
    ["528", "Think Corporation"],
    ["72", "Thundray"],
    ["527", "Thymos Media"],
    ["15", "TMS Entertainment"],
    ["124", "TNK"],
    ["5", "Toei Animation"],
    ["367", "TOHO animation STUDIO"],
    ["278", "Toho Interactive Animation"],
    ["257", "Tokyo Kids"],
    ["489", "Tokyo Movie"],
    ["45", "Tokyo Movie Shinsha"],
    ["387", "Tomovies"],
    ["203", "Trans Arts"],
    ["211", "Tri-Slash"],
    ["63", "Triangle Staff"],
    ["258", "TriF Studio"],
    ["43", "Trigger"],
    ["444", "Trinet Entertainment"],
    ["205", "TrioPen Studio"],
    ["104", "TROYCA"],
    ["320", "Tsuchida Productions"],
    ["374", "Tsumugi Akita Animation Lab"],
    ["281", "Twilight Studio"],
    ["187", "TYO Animations"],
    ["219", "Typhoon Graphics"],
    ["21", "ufotable"],
    ["101", "UKA"],
    ["364", "Unend"],
    ["160", "UWAN Pictures"],
    ["288", "Vega Entertainment"],
    ["435", "Venet"],
    ["454", "Viewworks"],
    ["299", "Visual Flight"],
    ["410", "Voil"],
    ["207", "W-Toon Studio"],
    ["216", "WAO World"],
    ["67", "Wawayu Animation"],
    ["57", "White Fox"],
    ["389", "Windy Studio"],
    ["102", "Wit Studio"],
    ["274", "Wolfsbane"],
    ["450", "WonderLand"],
    ["79", "Xebec"],
    ["202", "XEBEC M2"],
    ["76", "XFLAG"],
    ["259", "XFLAG Pictures"],
    ["524", "YAY! Animations"],
    ["360", "yell"],
    ["531", "Yien Animation Studio"],
    ["39", "Yokohama Animation Lab"],
    ["328", "Yostar Pictures"],
    ["112", "Yumeta Company"],
    ["286", "Zelico Film"],
    ["138", "Zero-G"],
    ["146", "Zexcs"],
    ["536", "ZG-R"],
    ["525", "Zomia"],
];

const SORTS = [
    ["", "Standard"],
    ["recent", "Ultime aggiunte"],
    ["az", "Lista A-Z"],
    ["za", "Lista Z-A"],
    ["oldest", "Più vecchi (anno)"],
    ["newest", "Più recenti (anno)"],
    ["most_viewed", "Più visti"],
    ["least_viewed", "Meno visti"],
    ["best_rated", "Meglio valutati"],
    ["worst_rated", "Peggio valutati"],
];

const STATES = [
    ["0", "In corso"],
    ["1", "Finito"],
    ["2", "Non rilasciato"],
    ["3", "Droppato"],
];

const TYPES = [
    ["1", "TV"],
    ["2", "Movie"],
    ["3", "OVA"],
    ["4", "Special"],
    ["5", "ONA"],
];

const SEASONS = [
    ["spring", "Primavera"],
    ["summer", "Estate"],
    ["fall", "Autunno"],
    ["winter", "Inverno"],
    ["unknown", "Sconosciuta"],
];

const AUDIO = [
    ["jp", "Giapponese"],
    ["it", "Italiano"],
    ["fr", "Francese"],
    ["en", "Inglese"],
    ["kr", "Coreano"],
    ["ch", "Cinese"],
];

// Playlist verificata il 15 novembre 2026 su play.saturncdn.net.
// Risponde 200 se il Referer è https://play.saturncdn.net/ (anche con
// Sec-Fetch-Site: cross-site) oppure se Sec-Fetch-Site è same-origin.
// same-site, cross-site e none, senza quel Referer, rispondono 403
// {"ok":false}. Un parametro ?referer= non basta. L'embed, /api/watch,
// ?download=1 e gli altri percorsi /api non contengono l'mp4: downloadUrl
// è null. Il file, una volta decodificato, è su un CDN e parte senza Referer.
// Sulla TV fetch non può impostare Referer né Sec-Fetch-Site: servono le
// API native descritte nella PR. Qui non si aggira quel controllo.
const REFERER_MSG =
    "Il player di AnimeSaturn consegna il link del file solo se la richiesta porta il Referer di play.saturncdn.net. " +
    "Su telefono e computer l'estensione lo invia e poi il video parte. " +
    "Sulla TV Tizen Cookie, Referer e User-Agent vengono tolti, quindi l'episodio non si apre. " +
    "Il file, una volta ottenuto, è un mp4 (o m3u8) che parte anche senza Referer.";

function base64Decode(input) {
    var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var str = String(input).replace(/[^A-Za-z0-9+\/]/g, "");
    var out = "";
    for (var i = 0; i < str.length; i += 4) {
        var a = chars.indexOf(str.charAt(i));
        var b = chars.indexOf(str.charAt(i + 1));
        var c = i + 2 < str.length ? chars.indexOf(str.charAt(i + 2)) : -1;
        var d = i + 3 < str.length ? chars.indexOf(str.charAt(i + 3)) : -1;
        if (a < 0 || b < 0) break;
        out += String.fromCharCode((a << 2) | (b >> 4));
        if (c >= 0) out += String.fromCharCode(((b & 15) << 4) | (c >> 2));
        if (d >= 0) out += String.fromCharCode(((c & 3) << 6) | d);
    }
    return out;
}

function xorText(raw, key) {
    var src = "";
    var k = String(key || "");
    if (!k) return "";
    for (var i = 0; i < raw.length; i++) {
        src += String.fromCharCode(raw.charCodeAt(i) ^ k.charCodeAt(i % k.length));
    }
    return src;
}

function checkedOn(state) {
    return state === true || state === 1;
}

class DefaultExtension extends MProvider {
    constructor() {
        super();
        this.client = new Client();
    }

    getPreference(key) {
        return new SharedPreferences().get(key);
    }

    getBaseUrl() {
        var v = this.getPreference(PREF_BASE);
        return (v && String(v).length ? String(v) : DEFAULT_BASE).replace(/\/+$/, "");
    }

    qualityPref() {
        var v = this.getPreference(PREF_QUALITY);
        return v && String(v).length ? String(v) : "max";
    }

    serverPref() {
        var v = this.getPreference(PREF_SERVER);
        return v && String(v).length ? String(v) : "";
    }

    async doc(path) {
        var url = String(path).indexOf("http") === 0 ? path : this.getBaseUrl() + path;
        var res = await this.client.get(url);
        if (!res || res.statusCode >= 400) {
            throw new Error("Il sito ha risposto con errore " + (res ? res.statusCode : ""));
        }
        return { doc: new Document(res.body), html: res.body || "" };
    }

    filterValue(filters, name) {
        if (!filters || !filters.length) return "";
        for (var i = 0; i < filters.length; i++) {
            var f = filters[i];
            if (!f || f.type_name !== "SelectFilter" || f.name !== name) continue;
            var opt = f.values && f.values[f.state];
            return opt && opt.value != null ? String(opt.value) : "";
        }
        return "";
    }

    textValue(filters, name) {
        if (!filters || !filters.length) return "";
        for (var i = 0; i < filters.length; i++) {
            var f = filters[i];
            if (!f || f.type_name !== "TextFilter" || f.name !== name) continue;
            return f.state ? String(f.state).trim() : "";
        }
        return "";
    }

    checkedValues(filters, name) {
        var out = [];
        if (!filters || !filters.length) return out;
        for (var i = 0; i < filters.length; i++) {
            var f = filters[i];
            if (!f || f.type_name !== "GroupFilter" || f.name !== name || !f.state) continue;
            for (var j = 0; j < f.state.length; j++) {
                var c = f.state[j];
                if (c && checkedOn(c.state) && c.value) out.push(String(c.value));
            }
        }
        return out;
    }

    hasNext(doc) {
        var a = doc.selectFirst('a[rel="next"]');
        return !!(a && a.getHref);
    }

    absUrl(u) {
        var s = String(u || "").trim();
        if (s.indexOf("//") === 0) return "https:" + s;
        return s;
    }

    pathOf(href) {
        var s = String(href || "");
        var i = s.indexOf("://");
        if (i !== -1) {
            var rest = s.substring(i + 3);
            var slash = rest.indexOf("/");
            s = slash === -1 ? "/" : rest.substring(slash);
        }
        return s.split("?")[0].split("#")[0];
    }

    seriesPath(href) {
        var path = this.pathOf(href);
        var m = path.match(/\/(?:anime|episode)\/([^/]+)/i);
        return m ? "/anime/" + m[1] : path;
    }

    watchPath(url) {
        var path = this.pathOf(url);
        var m = path.match(/\/(?:anime|episode)\/([^/]+)\/(ep-[^/]+)/i);
        return m ? m[1] + "/" + m[2] : "";
    }

    parseList(pageDoc) {
        var doc = pageDoc.doc || pageDoc;
        var list = [];
        var seen = {};
        for (var item of doc.select("a.ac.group")) {
            var href = item.getHref;
            if (!href) continue;
            var path = this.pathOf(href);
            if (path.indexOf("/anime/") !== 0 && path.indexOf("/episode/") !== 0) continue;
            var link = this.seriesPath(href);
            if (!link || seen[link]) continue;
            var nameEl = item.selectFirst("h3.ac__title");
            var name = nameEl && nameEl.text ? nameEl.text.trim() : "";
            var img = item.selectFirst("img");
            var imageUrl = img ? this.absUrl(img.attr("src") || img.attr("data-src") || "") : "";
            if (!name && img) name = (img.attr("alt") || "").trim();
            if (!name) continue;
            seen[link] = true;
            list.push({ name: name, imageUrl: imageUrl, link: link });
        }
        return { list: list, hasNextPage: list.length > 0 && this.hasNext(doc) };
    }

    async getPopular(page) {
        return this.parseList(await this.doc("/ongoing/" + page));
    }

    async getLatestUpdates(page) {
        return this.parseList(await this.doc("/newest/" + page));
    }

    normName(s) {
        return String(s || "").toLowerCase().replace(/&amp;/g, "&").replace(/[^a-z0-9]+/g, "");
    }

    genreFor(text) {
        var key = this.normName(text);
        if (!key) return "";
        for (var i = 0; i < GENRES.length; i++) {
            if (this.normName(GENRES[i][1]) === key) return GENRES[i][0];
        }
        return "";
    }

    studioIds(text) {
        var q = this.normName(text);
        if (!q) return null;
        var exact = [];
        var partial = [];
        for (var i = 0; i < STUDIOS.length; i++) {
            var n = this.normName(STUDIOS[i][1]);
            if (n === q) exact.push(STUDIOS[i][0]);
            else if (q.length >= 3 && n.indexOf(q) !== -1) partial.push(STUDIOS[i][0]);
        }
        if (exact.length) return exact;
        if (partial.length && partial.length <= 20) return partial;
        if (partial.length > 20) {
            throw new Error("Troppi studi contengono «" + text.trim() + "». Scrivi il nome per intero.");
        }
        return [];
    }

    pushMulti(q, name, values) {
        for (var i = 0; i < values.length; i++) {
            if (values[i] == null || values[i] === "") continue;
            q.push(name + "[]=" + encodeURIComponent(values[i]));
        }
    }

    async search(query, page, filters) {
        var sort = this.filterValue(filters, "Ordine");
        var dub = this.filterValue(filters, "Lingua");
        var states = this.checkedValues(filters, "Stato");
        var types = this.checkedValues(filters, "Tipo");
        var seasons = this.checkedValues(filters, "Stagione");
        var years = this.checkedValues(filters, "Anno");
        var audio = this.checkedValues(filters, "Audio");
        var genres = this.checkedValues(filters, "Generi");
        var studioText = this.textValue(filters, "Studio");
        var text = query ? String(query).trim() : "";
        if (!genres.length && text) {
            var asGenre = this.genreFor(text);
            if (asGenre) {
                genres = [asGenre];
                text = "";
            }
        }
        var studios = studioText ? this.studioIds(studioText) : null;
        var any = !!(text || sort || dub || states.length || types.length || seasons.length ||
            years.length || audio.length || genres.length || studioText);
        if (!any) return this.getPopular(page);
        if (studios && studios.length === 0) return { list: [], hasNextPage: false };

        var q = [];
        if (text) q.push("key=" + encodeURIComponent(text));
        this.pushMulti(q, "categories", genres);
        this.pushMulti(q, "years", years);
        this.pushMulti(q, "states", states);
        this.pushMulti(q, "types", types);
        this.pushMulti(q, "seasons", seasons);
        this.pushMulti(q, "languages", audio);
        if (studios) this.pushMulti(q, "studios", studios);
        if (dub !== "") q.push("dub=" + encodeURIComponent(dub));
        if (sort !== "") q.push("sort=" + encodeURIComponent(sort));
        var qs = q.length ? "?" + q.join("&") : "";
        return this.parseList(await this.doc("/filter/" + page + qs));
    }

    cleanText(s) {
        return String(s || "")
            .replace(/\u00a0/g, " ")
            .replace(/[ \t]+\n/g, "\n")
            .replace(/\n{3,}/g, "\n\n")
            .replace(/[ \t]{2,}/g, " ")
            .trim();
    }

    metaText(link) {
        if (!link || !link.getHref) return "";
        var v = link.selectFirst("span.font-semibold");
        var t = v && v.text ? v.text.trim() : "";
        if (t) return t;
        v = link.selectFirst("span.font-medium");
        return v && v.text ? v.text.trim() : "";
    }

    async getDetail(url) {
        var series = this.seriesPath(url);
        if (series.indexOf("/anime/") !== 0) series = this.pathOf(url);
        var doc = (await this.doc(series)).doc;

        var h1 = doc.selectFirst("h1");
        var name = h1 && h1.text ? h1.text.trim() : "";
        var altEl = doc.selectFirst("header.ag-headwrap p");
        var alt = altEl && altEl.text ? altEl.text.trim() : "";

        var storyEl = doc.selectFirst("section.ag-story div");
        var story = this.cleanText(storyEl && storyEl.text ? storyEl.text : "");
        if (!story) {
            var section = doc.selectFirst("section.ag-story");
            story = this.cleanText(section && section.text ? section.text : "");
            story = story.replace(/^Trama\s*/i, "").replace(/\s*Leggi tutto\s*$/i, "").replace(/\s*Mostra meno\s*$/i, "").trim();
        }

        var genre = [];
        for (var g of doc.select("div.ag-genres a")) {
            var t = g.text ? g.text.trim() : "";
            if (t && genre.indexOf(t) === -1) genre.push(t);
        }

        var status = 5;
        var st = doc.selectFirst('div.ag-meta a[href*="states="]');
        if (st && st.getHref) {
            var code = "";
            var cm = st.getHref.match(/states=(\d+)/);
            if (cm) code = cm[1];
            var label = this.metaText(st);
            if (code === "0" || label === "In corso") status = 0;
            else if (code === "1" || label === "Finito" || label === "Terminato") status = 1;
            else if (code === "3" || label === "Droppato") status = 3;
        }

        var studios = [];
        for (var s of doc.select('div.ag-meta a[href*="studios="]')) {
            var sn = this.metaText(s);
            if (sn && studios.indexOf(sn) === -1) studios.push(sn);
        }
        var tipo = this.metaText(doc.selectFirst('div.ag-meta a[href*="types="]'));
        var stagione = this.metaText(doc.selectFirst('div.ag-meta a[href*="seasons="]'));
        var audio = this.metaText(doc.selectFirst('div.ag-meta a[href*="languages="]'));

        var lines = [];
        if (tipo) lines.push("Tipo: " + tipo);
        if (stagione) lines.push("Stagione: " + stagione);
        if (audio) lines.push("Audio: " + audio);
        if (alt && (!name || alt.toLowerCase() !== name.toLowerCase())) lines.push("Titolo alternativo: " + alt);
        var description = lines.join("\n");
        if (story) description = description ? description + "\n\n" + story : story;
        if (!description) description = "Nessuna descrizione disponibile.";

        var poster = doc.selectFirst("div.ag-poster img");
        var imageUrl = poster ? this.absUrl(poster.attr("src") || "") : "";
        if (!imageUrl) {
            var og = doc.selectFirst('meta[property="og:image"]');
            imageUrl = og ? this.absUrl(og.attr("content") || "") : "";
        }

        var chapters = [];
        var seen = {};
        for (var a of doc.select("a.ep-tile")) {
            var href = a.getHref;
            if (!href) continue;
            var watch = this.watchPath(href);
            if (!watch) continue;
            var epUrl = "/anime/" + watch;
            if (seen[epUrl]) continue;
            seen[epUrl] = true;
            var title = (a.attr("title") || "").trim();
            if (!title) {
                var num = (href.match(/ep-(\d+(?:\.\d+)?)/i) || [])[1] || (a.text ? a.text.trim() : "");
                title = num ? "Episodio " + num : "Episodio";
            }
            chapters.push({ name: title, url: epUrl });
        }
        chapters.reverse();

        return {
            name: name,
            link: series,
            imageUrl: imageUrl,
            description: description,
            genre: genre,
            status: status,
            author: studios.join(", "),
            chapters: chapters,
        };
    }

    async watchApi(path) {
        var res = await this.client.get(this.getBaseUrl() + "/api/watch/" + path, {
            "Accept": "application/json",
        });
        var body = res && res.body ? String(res.body) : "";
        if (!res || res.statusCode >= 400 || body.charAt(0) !== "{") return null;
        try { return JSON.parse(body); } catch (e) { return null; }
    }

    async videosFromServer(server) {
        var name = (server && server.name) || "AnimeSaturn";
        var link = server && server.link ? String(server.link) : "";
        if (!link) return [];
        var embed = link.match(/^(https?:\/\/[^/]+)\/embed\/(\d+)\?([^#]+)/i);
        if (embed && server.embed !== false) {
            var playlist = embed[1] + "/embed/" + embed[2] + "/playlist?" + embed[3];
            var token = "";
            var tm = embed[3].match(/(?:^|&)token=([^&]+)/);
            if (tm) {
                try { token = decodeURIComponent(tm[1]); } catch (e) { token = tm[1]; }
            }
            var res = await this.client.get(playlist, { "Referer": embed[1] + "/" });
            var body = res && res.body ? String(res.body) : "";
            if (!res || res.statusCode === 403 || body.indexOf('"d"') === -1) return "referer";
            var data;
            try { data = JSON.parse(body); } catch (e) { return []; }
            var src = xorText(base64Decode(data.d || ""), token);
            if (!/^https?:\/\//i.test(src)) return [];
            var tracks = xorText(base64Decode(data.t || ""), token);
            var videos = await this.expandMedia(src, name);
            this.attachSubs(videos, tracks, name);
            return videos;
        }
        if (/\.(mp4|m3u8|webm)(\?|$)/i.test(link)) return this.expandMedia(link, name);
        return [];
    }

    attachSubs(videos, tracks, name) {
        if (!tracks || tracks.indexOf("http") !== 0) return;
        if (!/\.(vtt|webvtt)(\?|$)/i.test(tracks)) return;
        for (var i = 0; i < videos.length; i++) {
            videos[i].subtitles = [{ file: tracks, label: name }];
        }
    }

    async expandMedia(url, name) {
        var lower = url.split("?")[0].toLowerCase();
        if (lower.indexOf(".m3u8") === -1) {
            return [this.video(url, name + " · MP4")];
        }
        var res;
        try { res = await this.client.get(url); } catch (e) { res = null; }
        var body = res && res.statusCode < 400 && res.body ? String(res.body) : "";
        if (body.indexOf("#EXTM3U") === -1) return [this.video(url, name + " · Auto")];
        if (body.indexOf("#EXT-X-STREAM-INF") === -1) return [this.video(url, name + " · Auto")];
        var lines = body.split(/\r?\n/);
        var out = [];
        for (var i = 0; i < lines.length; i++) {
            if (lines[i].indexOf("#EXT-X-STREAM-INF") !== 0) continue;
            var next = "";
            for (var j = i + 1; j < lines.length; j++) {
                if (lines[j] && lines[j].charAt(0) !== "#") { next = lines[j].trim(); break; }
            }
            if (!next) continue;
            var hm = lines[i].match(/RESOLUTION=\d+x(\d+)/i);
            var label = hm ? hm[1] + "p" : "Auto";
            out.push(this.video(this.resolveUrl(url, next), name + " · " + label));
        }
        if (!out.length) out.push(this.video(url, name + " · Auto"));
        return out;
    }

    resolveUrl(base, rel) {
        if (/^https?:\/\//i.test(rel)) return rel;
        if (rel.indexOf("//") === 0) return "https:" + rel;
        var root = base.split("?")[0];
        if (rel.charAt(0) === "/") {
            var m = root.match(/^(https?:\/\/[^/]+)/i);
            return m ? m[1] + rel : rel;
        }
        return root.replace(/[^/]+$/, "") + rel;
    }

    video(url, quality) {
        return { url: url, originalUrl: url, quality: quality, headers: {} };
    }

    async getVideoList(url) {
        var path = this.watchPath(url);
        if (!path) throw new Error("Impossibile ricavare l'episodio");
        var data = await this.watchApi(path);
        var servers = data && data.servers && data.servers.length ? data.servers : [];
        if (!servers.length && data && data.videoUrl) {
            servers = [{ name: "AnimeSaturn", link: data.videoUrl, embed: true }];
        }
        if (!servers.length) {
            var page = await this.doc("/anime/" + path);
            var frame = page.doc.selectFirst('iframe[src*="embed"]');
            var src = frame ? frame.attr("src") : "";
            if (src) servers = [{ name: "Server principale", link: src, embed: true }];
        }
        var videos = [];
        var needReferer = false;
        for (var i = 0; i < servers.length; i++) {
            var got;
            try { got = await this.videosFromServer(servers[i]); }
            catch (e) { got = []; }
            if (got === "referer") needReferer = true;
            else if (got && got.length) videos = videos.concat(got);
        }
        videos = videos.filter(function (v) {
            return v && v.url && v.url.indexOf("youtube/") !== 0 && !/youtube\.com|youtu\.be/i.test(v.url);
        });
        if (!videos.length) {
            if (needReferer) throw new Error(REFERER_MSG);
            throw new Error("Nessuno stream trovato per questo episodio");
        }
        return this.sortVideos(videos);
    }

    sortVideos(videos) {
        var server = this.serverPref().toLowerCase();
        var quality = this.qualityPref();
        var want = parseInt(quality, 10);
        function heightOf(v) {
            var m = String(v.quality || "").match(/(\d{3,4})p/);
            return m ? parseInt(m[1], 10) : 0;
        }
        function rank(v) {
            var label = String(v.quality || "").toLowerCase();
            var serverRank = server && label.indexOf(server) !== -1 ? 0 : 1;
            var h = heightOf(v);
            var qRank = 0;
            if (quality === "auto") qRank = label.indexOf("auto") !== -1 ? -100000 : (h ? -h : 1);
            else if (!want) qRank = h ? -h : 1;
            else if (h === want) qRank = -100000;
            else if (!h) qRank = 80000;
            else qRank = Math.abs(h - want);
            return serverRank * 1000000 + qRank;
        }
        return videos.slice().sort(function (a, b) { return rank(a) - rank(b); });
    }

    options(pairs, anyLabel) {
        var out = [];
        if (anyLabel) out.push({ type_name: "SelectOption", name: anyLabel, value: "" });
        for (var i = 0; i < pairs.length; i++) {
            out.push({ type_name: "SelectOption", name: pairs[i][1], value: pairs[i][0] });
        }
        return out;
    }

    checks(pairs) {
        var out = [];
        for (var i = 0; i < pairs.length; i++) {
            out.push({ type_name: "CheckBox", name: pairs[i][1], value: pairs[i][0] });
        }
        return out;
    }

    yearPairs() {
        var y = new Date().getFullYear();
        if (!y || y < 2020) y = 2026;
        var out = [];
        for (var i = y; i >= 1960; i--) out.push([String(i), String(i)]);
        return out;
    }

    getFilterList() {
        return [
            {
                type_name: "HeaderFilter",
                name: "I filtri si combinano, anche con il testo. Generi, anno, stato, tipo, stagione e audio: escono gli anime che ne hanno almeno uno. Lingua è Doppiato ITA o Sub ITA. Studio: scrivi il nome, per esempio J.C.Staff.",
            },
            { type_name: "SelectFilter", name: "Ordine", state: 0, values: this.options(SORTS) },
            {
                type_name: "SelectFilter",
                name: "Lingua",
                state: 0,
                values: [
                    { type_name: "SelectOption", name: "Tutte", value: "" },
                    { type_name: "SelectOption", name: "Doppiato ITA", value: "1" },
                    { type_name: "SelectOption", name: "Sub ITA", value: "0" },
                ],
            },
            { type_name: "GroupFilter", name: "Stato", state: this.checks(STATES) },
            { type_name: "GroupFilter", name: "Tipo", state: this.checks(TYPES) },
            { type_name: "GroupFilter", name: "Stagione", state: this.checks(SEASONS) },
            { type_name: "GroupFilter", name: "Audio", state: this.checks(AUDIO) },
            { type_name: "GroupFilter", name: "Anno", state: this.checks(this.yearPairs()) },
            { type_name: "GroupFilter", name: "Generi", state: this.checks(GENRES) },
            { type_name: "TextFilter", name: "Studio", state: "" },
        ];
    }

    getSourcePreferences() {
        return [
            {
                key: PREF_BASE,
                editTextPreference: {
                    title: "Dominio AnimeSaturn",
                    summary: "Cambialo se il sito cambia indirizzo (es. https://www.animesaturn.net)",
                    value: DEFAULT_BASE,
                    dialogTitle: "Dominio AnimeSaturn",
                    dialogMessage: "URL base, senza slash finale",
                },
            },
            {
                key: PREF_QUALITY,
                listPreference: {
                    title: "Qualità preferita",
                    summary: "Va per prima quando un episodio ha più qualità. Le altre restano nel player.",
                    valueIndex: 0,
                    entries: ["Massima disponibile", "1080p", "720p", "480p", "360p"],
                    entryValues: ["max", "1080", "720", "480", "360"],
                },
            },
            {
                key: PREF_SERVER,
                listPreference: {
                    title: "Server preferito",
                    summary: "Va per primo. Gli altri server restano nel player.",
                    valueIndex: 0,
                    entries: ["Qualsiasi", "Server principale"],
                    entryValues: ["", "Server principale"],
                },
            },
        ];
    }
}
