/* ==========================================================
   DS SATVA — site behaviour
   1. product grid (drops in a real photo the moment one exists)
   2. hero slider: push transition + parallax band + Ken Burns
   3. scroll reveal, mobile nav, year
   ========================================================== */
(function () {
  "use strict";

  /* a page can give its own WhatsApp number: window.SATVA_WA_NUMBER
     (ports/8002, 14 Oct 2026, owner's new number). Unset - the old one. */
  var WA_NO = window.SATVA_WA_NUMBER || "919689888822"; /* 20 Oct 2026: default is the new number too */
  var WA = "https://wa.me/" + WA_NO + "?text=";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     1. THE RANGE
     English is the product's name; Hindi sits under it as a
     secondary line. `cat` is the fine-grained shelf, while GROUPS
     decides which tabs exist — so the two can differ, and ground
     and whole spices share a single tab.
     `img` is tried first. If the file is not there yet, the card
     keeps its designed tile — so to add a real photo later, just
     save it at that exact path and reload. Nothing else to edit.
     --------------------------------------------------------- */
  /* THE RANGE, as the owner set it on 20 Sep 2026. Twelve spices, two pulses,
     four seeds, three essentials - 21 in all.

     THREE THINGS MOVED OR LEFT, and they are worth naming because copy all over
     this page was written around them:
       - METHI moved from Spices to Seeds. It was "Fenugreek Seeds", a whole
         spice for the tadka; it is now a seed on the Seeds shelf.
       - THE FOUR COLD-PRESSED OILS ARE GONE. Groundnut, sesame, mustard and
         coconut oil are no longer in the range, which is why Healthy Essentials
         dropped from six items to three.
       - KHANDSARI IS GONE TOO, replaced by coconut sugar and monk fruit.
     Kanda Lasun Masala and Chaat Masala also left the spice list; Coriander
     Seeds, Black Pepper and Sambar Masala joined it.

     Every new `ink` was measured, as the others were: all six clear 5.4:1 or
     better on white and on cream. */
  var PRODUCTS = [
    /* ---- SPICES · ground ---- */
    { acc:"#e8a713", ink:"#94660a", en:"Turmeric", hi:"हल्दी", cat:"spices", form:"Ground", glyph:"हल",
      d:"The everyday base — dal, sabzi and every tadka starts here.",
      make:"Boiled, sun-dried, polished and stone-ground. Six steps, nine months.", mfilm:"turmeric",
      img:"assets/p-haldi.webp", photo:true, tint:"linear-gradient(150deg,#e3ae3c,#c1860f)" },
    { acc:"#c3341a", ink:"#a52a13", en:"Chilli Powder", hi:"लाल मिर्च", cat:"spices", form:"Ground", glyph:"मि",
      d:"Colour and heat, ground from whole dried chillies.",
      make:"Whole dried chillies, stems off, ground with the seed left in for the heat.", mfilm:"chilli",
      img:"assets/p-mirchi.webp", photo:true, tint:"linear-gradient(150deg,#cf5238,#a8321b)" },
    { acc:"#93a04b", ink:"#5f6a26", en:"Coriander Powder", hi:"धनिया पावडर", cat:"spices", form:"Ground", glyph:"ध",
      d:"Warm and nutty — the quiet base under a good curry.",
      make:"Sun-dried seed, roasted lightly, then stone-ground so the oils stay in.", mfilm:"dhaniya",
      img:"assets/p-dhane.webp", photo:true, tint:"linear-gradient(150deg,#bcae63,#948537)" },

    /* ---- SPICES · whole, for tadka ---- */
    { acc:"#a3763f", ink:"#6b5029", en:"Cumin Seeds", hi:"जीरा", cat:"spices", form:"Whole", glyph:"जी",
      d:"Whole, for the first crackle in hot oil.",
      make:"Threshed, winnowed and sieved. Sold whole so you roast it fresh.",
      img:"assets/p-jeera.jpg", tint:"linear-gradient(150deg,#b98d55,#8a6a3a)" },
    { acc:"#c9962a", ink:"#8a6510", en:"Mustard Seeds", hi:"राई", cat:"spices", form:"Whole", glyph:"रा",
      d:"Small, sharp and made for tadka.",
      make:"Dried on the plant, threshed and cleaned. Whole, for the tadka.",
      img:"assets/p-rai.jpg", tint:"linear-gradient(150deg,#d3a844,#a87d16)" },
    { acc:"#6b6259", ink:"#413b34", en:"Black Pepper", hi:"काली मिर्च", cat:"spices", form:"Whole", glyph:"का",
      d:"Whole peppercorns — grind them over the dish, not into the pot.",
      make:"Picked green, blanched, then sun-dried until the skin wrinkles black.",
      img:"assets/p-pepper.webp", photo:true, tint:"linear-gradient(150deg,#847a6f,#57504a)" },

    /* ---- SPICES · masala blends ---- */
    { acc:"#7d5630", ink:"#634324", en:"Garam Masala", hi:"गरम मसाला", cat:"spices", glyph:"गर",
      d:"The finishing spoon — stirred in at the end, not boiled away.",
      make:"Each spice roasted on its own, then ground together. No filler, no colour.",
      img:"assets/p-garam.webp", photo:true, tint:"linear-gradient(150deg,#a38055,#74562f)" },
    { acc:"#e2912b", ink:"#94590c", en:"Biryani Masala", hi:"बिरयानी मसाला", cat:"spices", glyph:"बि",
      d:"For layered rice — whole spices ground for aroma, not just heat.",
      make:"Whole spices roasted and ground in small batches, not held in a warehouse.",
      img:"assets/p-biryani.webp", photo:true, tint:"linear-gradient(150deg,#e8a750,#c07a17)" },
    /* 23 Oct 2026, owner: "replace meat masala with chaat masala in the website". */
    { acc:"#8f2e28", ink:"#7a2620", en:"Chaat Masala", hi:"चाट मसाला", cat:"spices", glyph:"चा",
      d:"Tangy and salty — for fruit, salads, raita, chaat and nimbu pani.",
      make:"Cumin dry-roasted, then ground fine with amchur and black salt, so it clings to whatever you sprinkle it on.",
      img:"assets/p-chaat.webp", tint:"linear-gradient(150deg,#a7473f,#7c2721)" },
    { acc:"#c05a24", ink:"#8a3d10", en:"Sambar Masala", hi:"सांबार मसाला", cat:"spices", glyph:"सां",
      d:"For sambar and the South Indian pot — roasted dal in the blend.",
      make:"The dals are roasted with the chillies before grinding. That is what makes it sambar.",
      img:"assets/p-sambar.jpg", tint:"linear-gradient(150deg,#d4703a,#a24a14)" },
    /* 23 Oct 2026, owner: renamed from "Chatpat Masala" to "Chatpat / Kanda Lasun Masala"; */
    { acc:"#b8453c", ink:"#96332b", en:"Chatpat / Kanda Lasun Masala", hi:"चटपट / कांदा लसूण मसाला", cat:"spices", glyph:"चट",
      d:"Sharp, tangy and full of kanda-lasun depth — for chivda, raw mango, peanuts, anything that needs a lift.",
      make:"Dry-roasted and ground, with the amchur folded in last so it stays sharp.",
      img:"assets/p-chatpat.jpg", tint:"linear-gradient(150deg,#c9605a,#a3352c)" },

    /* ---- PULSES ----
       CHANA DAL, not "Chana". The owner's 20 Sep list said Chana; this is the
       split dal, on three pieces of evidence that all point the same way: the
       venture's own master list (fmcg/Household-Items-List.md) says "Chana dal",
       the product description here is written for the split gram, and the Pulses
       hero copy calls these "the two dals this kitchen cooks most". Whole chana
       and chana dal are different products, so if it really is the whole
       chickpea, change the name, this description AND that hero line together -
       they have to agree. */
    { acc:"#cf8f34", ink:"#8a5c14", en:"Toor Dal", hi:"तूर दाल", cat:"pulses", glyph:"तू",
      d:"Unpolished arhar — the everyday varan, cooked soft.",
      make:"Cleaned, graded and split. Never polished with oil or water to make it shine.",
      img:"assets/p-toor.jpg", tint:"linear-gradient(150deg,#dda751,#b5761d)" },
    { acc:"#cbab3c", ink:"#7f6a14", en:"Chana Dal", hi:"चना दाल", cat:"pulses", glyph:"च",
      d:"Split gram, unpolished — for dal, puran and amti.",
      make:"Split and cleaned. The skin comes off in the splitting, not with a polish.",
      img:"assets/p-chana.jpg", tint:"linear-gradient(150deg,#d7bc5c,#a98d22)" },

    /* ---- SEEDS ---- */
    { acc:"#68737e", ink:"#3f4952", en:"Chia Seeds", hi:"चिया बीज", cat:"seeds", glyph:"चि",
      d:"Stir into water, curd or a smoothie.",
      make:"Cleaned and sieved, and nothing else. Not roasted, not ground.", mfilm:"seeds",
      img:"assets/p-chia.jpg", tint:"linear-gradient(150deg,#7c8794,#55606b)" },
    { acc:"#a08256", ink:"#6a4a33", en:"Flax Seeds", hi:"अलसी", cat:"seeds", glyph:"अल",
      d:"Roast and grind for chutney, or stir into roti dough.",
      make:"Cleaned cold and left whole, so the oil stays in the seed until you grind it.", mfilm:"seeds",
      img:"assets/p-flax.webp", photo:true, tint:"linear-gradient(150deg,#b39468,#8a6244)" },
    /* 20 Oct 2026, owner: "remove quinoa ... and keep coriander seeds here" -
       Quinoa is off the whole site; Coriander Seeds moved from Spices into its place. */
    { acc:"#8a9a52", ink:"#57632a", en:"Coriander Seeds", hi:"धनिया", cat:"seeds", form:"Whole", glyph:"ध",
      d:"Whole dhaniya — crush it fresh, or roast it for a masala.",
      make:"Cleaned and graded whole. Nothing ground, nothing polished.",
      img:"assets/p-dhaniya-whole.jpg", tint:"linear-gradient(150deg,#a6b268,#7d8a3c)" },
    /* moved here from Spices on 20 Sep 2026 */
    { acc:"#b08b2e", ink:"#7d6118", en:"Methi Seeds", hi:"मेथी दाना", cat:"seeds", glyph:"मे",
      d:"A bitter edge for pickles, dal and tadka.",
      make:"Dried, cleaned and graded whole. Bitter on purpose.",
      img:"assets/p-methi.jpg", tint:"linear-gradient(150deg,#bf9c48,#94781f)" },

    /* ---- HEALTHY ESSENTIALS ----
       No oils on this shelf any more, and no khandsari. Salt and two
       unrefined sweeteners.
       MONK FRUIT SWEETENER, not "Monk Fruit Sugar". The owner's wording was
       Sugar; this is the one change made against it, because monk fruit contains
       no sugar and Indian labelling rules are strict about that word - the same
       caution that sat on khandsari before it. The shelf's own copy already says
       "sweet without being sugar at all", so the name now agrees with the
       sentence next to it. Coconut sugar IS a sugar and keeps the word. */
    { acc:"#d98a8a", ink:"#a04a55", en:"Himalayan Pink Salt", hi:"गुलाबी नमक", cat:"essentials", glyph:"नम",
      d:"Unrefined rock salt, ground coarse or fine.",
      make:"Rock salt, crushed and graded. Not washed, not bleached, not iodised.", mfilm:"salt",
      img:"assets/p-pinksalt.jpg", tint:"linear-gradient(150deg,#e3a3a3,#c07474)" },
    { acc:"#b07a42", ink:"#7d5320", en:"Coconut Sugar", hi:"नारियल शक्कर", cat:"essentials", glyph:"ना",
      d:"From the sap of the coconut palm, dried and never bleached.",
      make:"Sap from the flower, boiled down and dried. Nothing refined out of it.",
      img:"assets/p-coconutsugar.jpg", tint:"linear-gradient(150deg,#c48f57,#96682c)" },
    { acc:"#7fa06a", ink:"#4e6a3c", en:"Monk Fruit Sweetener", hi:"मंक फ्रूट", cat:"essentials", glyph:"मं",
      d:"Sweetness from the fruit itself, with no sugar in it at all, and a zero glycemic index.",
      make:"The fruit juiced and dried to a powder. No sugar alcohols added.",
      img:"assets/p-monkfruit.jpg", tint:"linear-gradient(150deg,#96b380,#64854e)" }
  ];


  /* THE FOUR SHELVES. 16 Sep 2026, the owner: "Keep everything in the site in
     this order Spices | Pulses | Seeds | Healthy Essentials ... anything else can
     be added later. So only these four categories."

     So this array IS the site's category order, and it is the only place that
     order is written down - the shop-by-category cards, the header dropdown, the
     hero shelf slides and the footer range list are all read from it or ordered
     to match it. A fifth shelf is added here first, never in the markup.

     The six shelves that came before (ground / whole / blends / seeds / pantry /
     oils) were not deleted, they were folded in: ground, whole and blends are all
     Spices now, and pantry (salt, khandsari) and oils are Healthy Essentials.
     `cat` on a product is still the fine-grained shelf, so that split survives in
     the data and can be un-folded later without retyping the range. */
  var GROUPS = [
    { id:"spices",     label:"Spices",            cats:["spices"] },
    { id:"pulses",     label:"Pulses",            cats:["pulses"] },
    { id:"seeds",      label:"Seeds",             cats:["seeds"] },
    { id:"essentials", label:"Healthy Essentials", cats:["essentials"] }
  ];

  /* A page can take a whole shelf off the site without editing this file:
     window.SATVA_HIDE_SHELVES = ["pulses"] (ports/8002, 13 Oct 2026, owner:
     "remove the pulses section from the whole website"). The shelf goes from
     GROUPS and its products from PRODUCTS, so the counts, the dropdown, the
     category cards, the range listing and "How we make" all lose it at once.
     Unset - every other page - nothing changes. */
  var HIDE = window.SATVA_HIDE_SHELVES || [];

  /* Run fn once el comes within ~a screen of view (26 Oct 2026). The photo
     checks below used to download every category and recipe picture while
     the page was still opening, competing with the hero photo on phones. */
  function whenNear(el, fn) {
    if (!("IntersectionObserver" in window)) { fn(); return; }
    var io = new IntersectionObserver(function (es) {
      if (es[0].isIntersecting) { io.disconnect(); fn(); }
    }, { rootMargin: "700px 0px" });
    io.observe(el);
  }
  // names of the products that went with it - a recipe that calls for
  // "Satva Toor Dal" then reads plain "toor dal", not as something we sell
  var HIDDEN = PRODUCTS.filter(function (p) { return HIDE.indexOf(p.cat) > -1; })
                       .map(function (p) { return p.en; });
  if (HIDE.length) {
    GROUPS = GROUPS.filter(function (g) { return HIDE.indexOf(g.id) < 0; });
    PRODUCTS = PRODUCTS.filter(function (p) { return HIDE.indexOf(p.cat) < 0; });
  }

  /* Not a category - the dropdown's "see the lot" entry, kept out of GROUPS so
     that array stays exactly the four shelves the owner asked for. */
  var ALL = { id:"all", label:"Everything", cats:null };

  var MORTAR = '<svg class="mortar" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 11h14a7 7 0 0 1-7 7 7 7 0 0 1-7-7Z"/><path d="M12 18v3M8 21h8"/><path d="M16 8.5 19 4"/></svg>';
  var CHAT = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.5 14.4c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.1s-.8 1-1 1.2c-.2.2-.4.3-.7.1a8.2 8.2 0 0 1-2.4-1.5 9.1 9.1 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.7l.6-.7c.1-.2.2-.4.1-.6l-.9-2.1c-.2-.5-.4-.5-.6-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.6s1.1 3 1.3 3.2c.1.2 2 3.2 4.9 4.4 2.4 1 2.9.8 3.4.8.5-.1 1.7-.7 1.9-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.2-.6-.4zM12 21.5c-1.7 0-3.4-.5-4.9-1.3l-3.4.9.9-3.3A9.4 9.4 0 0 1 2.6 12 9.4 9.4 0 0 1 12 2.6 9.4 9.4 0 0 1 21.4 12 9.4 9.4 0 0 1 12 21.5z"/></svg>';
  var VEG = '<span class="veg" title="Vegetarian"><i></i></span>';

  // the spice-spectrum rules are drawn from the product list, so the range can
  // grow to any length and the rule (and the grid) simply follow
  document.querySelectorAll(".spectrum").forEach(function (bar) {
    bar.innerHTML = PRODUCTS.map(function (p) {
      return '<i style="background:' + p.acc + '" title="' + p.en + '"></i>';
    }).join("");
  });

  /* The range tabs, showGroup() and the menu-first listing were removed with the
     range block on 10 Sep 2026 - their DOM (#tabs, #grid, #rangepick) no longer
     exists. GROUPS and PRODUCTS stay: the shelf counts, the header dropdown, the
     hero pills and the recipe accents are all still driven from them. */
  var inGroup = function (g, cat) { return !g.cats || g.cats.indexOf(cat) > -1; };

  /* ---------------------------------------------------------
     1a. THE RANGE — the listing itself
     Restored 20 Sep 2026. The site was counting 21 products in
     four places and showing them in none: the listing was
     deleted on 10 Sep and the category cards were rewired to
     open WhatsApp. Now a card, a hero pill and a dropdown entry
     all do the same thing — filter this grid and scroll to it.

     Built entirely from PRODUCTS and GROUPS, so a new product
     appears here, in the counts, in the tabs and in the spectrum
     with one edit and no markup change.
     --------------------------------------------------------- */
  var pGrid = document.getElementById("pgrid");
  var rTabs = document.getElementById("rtabs");
  var rSub  = document.getElementById("rangesub");
  var rangeSection = document.getElementById("range");

  function askLink(p) {
    return WA + encodeURIComponent("Namaskar! Please tell me about " + p.en + ".");
  }

  var ARROW_DOWN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M19 12l-7 7-7-7"/></svg>';
  var PLAY_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" ' +
    'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
    '<circle cx="12" cy="12" r="9"/><path d="M10 8.6l5.2 3.4-5.2 3.4V8.6z"/></svg>';
  var X_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" ' +
    'stroke-linecap="round" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg>';

  var JOURNEYS = {
    "Turmeric": {
      hi: "हल्दी",
      intro: {
        kick: "Field to plate",
        title: "How turmeric becomes haldi",
        text: "Nine months in the ground, then six steps by hand. Nothing here is a " +
              "metaphor — this is the process every honest packet of haldi goes through.",
        shot: "assets/j-turmeric-1-field.webp"
      },
      stages: [
        { when: "Month 7–9",
          title: "It grows as a root, not a spice",
          text: "Turmeric is a rhizome — an underground stem of the ginger family. " +
                "For seven to nine months you see only these broad green leaves. " +
                "When they yellow and begin to dry, the crop underneath is ready.",
          short: "Seven to nine months underground, until the leaves yellow.",
          shot: "assets/j-turmeric-1-field.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Turmeric_plants_images.jpg" target="_blank" rel="noopener">Turmeric plants</a>, CC0.' },

        { when: "Harvest",
          title: "Lifted, washed, and split",
          text: "The clump comes out whole: one round mother bulb with slender " +
                "\"fingers\" around it. The fingers are snapped off and washed. " +
                "Cut one open and the inside is already this orange — that is the " +
                "curcumin, and everything that follows is about keeping it.",
          short: "Snapped off the mother bulb and washed clean.",
          shot: "assets/j-turmeric-2-lifted.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Liat_Portal_for_Foodie_Disorder_-_Turmeric_Root.jpg" target="_blank" rel="noopener">Turmeric root</a> by Liat Portal, CC BY-SA 4.0.' },

        { when: "40–60 minutes",
          title: "Boiled, within two days of lifting",
          text: "The fingers are boiled until soft — forty minutes to an hour, no " +
                "longer. It is the step that decides the colour: it drives the curcumin " +
                "evenly through the flesh, kills the sprout so the root cannot grow " +
                "again, and takes the raw earth smell out. What you see here is a root " +
                "cut open beside the powder it becomes — no photograph of the boiling " +
                "itself exists that we are free to use.",
          short: "Boiled soft — the step that fixes the colour. (Root shown cut, not boiling.)",
          shot: "assets/j-turmeric-3-cured.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Curcuma_longa_roots.jpg" target="_blank" rel="noopener">Curcuma longa roots</a>, CC BY-SA 3.0.' },

        { when: "10–15 days",
          title: "Dried in the sun, turned every day",
          text: "Spread five to seven centimetres deep on mats and turned by hand " +
                "each day, until the fingers lose about four-fifths of their weight " +
                "and snap cleanly instead of bending. Rush this with heat and the " +
                "colour dulls. There is no shortcut that does not cost you something.",
          short: "Turned by hand on mats until a finger snaps clean.",
          shot: "assets/j-turmeric-4-drying.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Drying_Turmeric.jpg" target="_blank" rel="noopener">Drying turmeric</a>, CC BY-SA 4.0.' },

        { when: "Polishing",
          title: "Rubbed smooth — and nothing added",
          text: "Dried fingers come out dull and scaly. Tumbling them against each " +
                "other takes the rough skin off and brings up the surface. This is " +
                "where the trade often adds lead chromate for a brighter yellow. " +
                "We do not. The colour you see is the colour the root had.",
          short: "Tumbled smooth. No lead chromate, not ever.",
          shot: "assets/j-turmeric-5-polished.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Dry_Turmeric_at_temple.jpg" target="_blank" rel="noopener">Dry turmeric</a>, CC BY-SA 4.0.' },

        { when: "The last step",
          title: "Ground slowly, so it keeps its oils",
          text: "Ground between stones rather than blasted through a hammer mill. " +
                "The difference is heat: turmeric's aroma lives in volatile oils " +
                "that a hot, fast grind drives straight off. Slow and cool keeps " +
                "them in the powder.",
          /* NOT the Wikimedia "turmeric grinding disc" clip, which was the
             only free-licence turmeric video in existence and turned out to
             be mislabelled: the footage is a Chinese market stall grinding
             Yunnan yellow GINGER, price board and all. Wrong spice, wrong
             country, wrong look. This is the Pexels clip the "how it is
             made" carousel already uses - real turmeric on a stone grinder,
             free commercially, no attribution required. */
          short: "Stone-ground cool, so the aroma stays in the powder.",
          video: "assets/proc-turmeric.mp4",
          shot: "assets/proc-turmeric.webp",
          credit: 'Film: turmeric on a stone grinder. Pexels, free for commercial use.' }
      ],
      end: {
        title: "And that is what is in the packet",
        text: "One root, nine months, six steps, nothing added at any of them. " +
              "That is the whole reason this is worth paying for.",
        shot: "assets/j-turmeric-6-ground.webp",
        credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Turmeric_(Haldi)_(49696132012).jpg" target="_blank" rel="noopener">Turmeric (Haldi)</a>, CC BY 2.0.'
      }
    },

    /* ---- the eight the free-licence pool could actually support -----
       Sourced the same way turmeric was: Wikimedia Commons, commercial
       use cleared, every CC BY / BY-SA credited on its own stage.

       THESE ARE SHORTER THAN TURMERIC ON PURPOSE. Turmeric has six
       stages because six good photographs of the turmeric process
       exist. Padding these to six would have meant using a dull or
       borrowed picture to hit a number, which is exactly the thing
       this block is supposed to prove we do not do. Three or four
       real stages beats six with two lies in them.

       Thirteen products still have no journey - see README-v3.md for
       which, and why the pool cannot supply them. */

    "Chilli Powder": {
      hi: "लाल मिर्च",
      intro: { kick: "Field to plate", title: "How chilli becomes colour and heat",
        text: "Two things come out of a chilli - the red and the burn - and they come " +
              "from different parts of it. Everything below is about keeping both.",
        shot: "assets/j-chilli-1-field.webp" },
      stages: [
        { when: "Month 4–5", title: "Picked red, never green",
          text: "Chillies ripen on the bush from green through orange to deep red. Only " +
                "the fully red ones are cut — an underripe chilli gives you neither the " +
                "colour nor the heat, and no amount of processing puts them back.",
          short: "Only the fully red ones are cut.",
          shot: "assets/j-chilli-1-field.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Mirci_ready_in_the_field.JPG" target="_blank" rel="noopener">Mirci ready in the field</a>, public domain.' },
        { when: "7–10 days", title: "Dried in the open, not in a kiln",
          text: "Spread out until the skin wrinkles and the moisture falls below a tenth " +
                "of its weight. Sun holds the red. A hot kiln is faster and turns the " +
                "whole crop brown, which is then corrected with dye.",
          short: "Sun holds the red. A kiln browns it.",
          shot: "assets/j-chilli-2-drying.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Red_chili_processing.jpg" target="_blank" rel="noopener">Red chili processing</a>, CC BY-SA 4.0.' },
        { when: "Sorting", title: "Every stalk snapped off by hand",
          text: "Stalks go into the mill as grit and come out as specks. Taking them off " +
                "first is slow, unskilled, unglamorous work, and it is the difference " +
                "between a clean powder and a gritty one.",
          short: "Stalk in the mill means grit in the powder.",
          shot: "assets/j-chilli-3-baskets.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Sun_dry_red_chilli.jpg" target="_blank" rel="noopener">Sun dry red chilli</a>, CC BY 2.0.' },
        { when: "The last step", title: "Ground with the seed left in",
          text: "The heat lives in the seed and the white pith, not the skin. Sieving " +
                "them out gives a bright powder that does nothing. We grind them in.",
          short: "The heat is in the seed. We grind it in.",
          shot: "assets/arch-spices-chilli-powder.webp" }
      ],
      end: { title: "Red you can see, heat you can taste",
        text: "No dye, no stalk, no seed thrown away. That is the whole recipe.",
        shot: "assets/arch-spices-chilli-powder.webp" }
    },

    "Coriander Powder": {
      hi: "धनिया पावडर",
      intro: { kick: "Field to plate", title: "How dhaniya becomes powder",
        text: "The quietest spice in the box, and the one that goes stale fastest once " +
              "it is ground. Three steps, and the last one is the one that matters.",
        shot: "assets/j-coriander-1-flower.webp" },
      stages: [
        { when: "Month 3", title: "It flowers before it seeds",
          text: "Coriandrum sativum throws small white umbels across the field. When " +
                "they fade, the green seed sets behind them — two to a stalk, in pairs.",
          short: "White umbels first; the seed sets behind them.",
          shot: "assets/j-coriander-1-flower.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Coriandrum_sativum_flower.jpg" target="_blank" rel="noopener">Coriandrum sativum flower</a>, CC BY-SA 4.0.' },
        { when: "Harvest", title: "Cut whole, dried, then threshed",
          text: "The crop is cut standing and dried on the field before it is beaten to " +
                "free the seed. Cut it a week late and the seed shatters on the ground.",
          short: "Cut standing, dried, then beaten free.",
          shot: "assets/j-coriander-2-seed.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Koriander-spice.jpg" target="_blank" rel="noopener">Koriander-spice</a>, CC BY-SA 1.0.' },
        { when: "The last step", title: "Roasted short, ground cool",
          text: "A brief dry roast wakes the oils; a long one turns the nuttiness bitter. " +
                "Then a cool grind, because this is the spice that loses most to heat.",
          short: "A short roast wakes it. A long one ruins it.",
          shot: "assets/j-coriander-3-powder.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Coriander_Powder.jpg" target="_blank" rel="noopener">Coriander Powder</a>, CC BY-SA 4.0.' }
      ],
      end: { title: "Buy it small, use it fast",
        text: "Ground coriander is at its best for weeks, not years. We pack it small on purpose.",
        shot: "assets/p-dhane.webp" }
    },

    "Coriander Seeds": {
      hi: "धनिया",
      intro: { kick: "Field to plate", title: "How dhaniya is left whole",
        text: "The same crop as the powder, stopped one step earlier — and that one step " +
              "is worth more than anything we could do to it.",
        shot: "assets/j-coriander-1-flower.webp" },
      stages: [
        { when: "Month 3", title: "It flowers before it seeds",
          text: "Small white umbels across the field. When they fade, the green seed sets " +
                "behind them in pairs and slowly goes from green to straw.",
          short: "White umbels first; the seed sets behind them.",
          shot: "assets/j-coriander-1-flower.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Coriandrum_sativum_flower.jpg" target="_blank" rel="noopener">Coriandrum sativum flower</a>, CC BY-SA 4.0.' },
        { when: "Harvest", title: "Threshed, winnowed, graded",
          text: "Beaten free of the stalk, fanned clean of chaff, then sieved by size. " +
                "Nothing is roasted and nothing is ground.",
          short: "Beaten free, fanned clean, sieved by size.",
          shot: "assets/j-coriander-4-whole.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Whole_Coriander.jpg" target="_blank" rel="noopener">Whole coriander</a>, CC0.' },
        { when: "Whole", title: "The grinding is yours to do",
          text: "A whole seed holds its aroma for a year; the moment it is ground the " +
                "clock starts. Crush it in your hand the day you cook and you get what " +
                "the powder was like on the day it was made.",
          short: "Whole holds a year. Ground starts a clock.",
          shot: "assets/j-coriander-2-seed.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Koriander-spice.jpg" target="_blank" rel="noopener">Koriander-spice</a>, CC BY-SA 1.0.' }
      ],
      end: { title: "We stopped one step early on purpose",
        text: "The last step belongs in your kitchen, not our mill.",
        shot: "assets/j-coriander-4-whole.webp" }
    },

    "Mustard Seeds": {
      hi: "राई",
      intro: { kick: "Field to plate", title: "How rai gets its bite",
        text: "A mustard seed is not hot. It has no heat at all until you break it in " +
              "something hot or wet — which is the whole trick of the tadka.",
        shot: "assets/j-mustard-1-field.webp" },
      stages: [
        { when: "Month 2–3", title: "A field of yellow, all at once",
          text: "Brassica juncea flowers across the whole field before a single pod sets. " +
                "It is the loudest three weeks in the crop year and then it is over.",
          short: "The whole field flowers before a pod sets.",
          shot: "assets/j-mustard-1-field.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Mustard_Field-1.jpg" target="_blank" rel="noopener">Mustard Field</a>, CC BY-SA 4.0.' },
        { when: "Harvest", title: "Brown seed out of a yellow field",
          text: "The crop stays standing until the pods rattle — cut it green and the " +
                "seed shrivels in storage. What falls out is this: small, hard and dark, " +
                "nothing like the flower it came from.",
          short: "Small, hard and dark. Nothing like the flower.",
          shot: "assets/j-mustard-2-pods.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Mustard_black.JPG" target="_blank" rel="noopener">Mustard black</a>, public domain.' },
        { when: "Whole", title: "Threshed, winnowed, and left alone",
          text: "Beaten out, fanned clean, graded by size. Never ground, because a " +
                "ground mustard seed has already spent its heat before it reaches you.",
          short: "Never ground — it would spend its heat early.",
          shot: "assets/j-mustard-3-seed.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Mustard_Seeds.JPG" target="_blank" rel="noopener">Mustard Seeds</a>, CC BY-SA 3.0.' }
      ],
      end: { title: "It waits for your hot oil",
        text: "Everything we do to rai is about making sure nothing has happened to it yet.",
        shot: "assets/j-mustard-3-seed.webp" }
    },

    "Toor Dal": {
      hi: "तूर दाल",
      intro: { kick: "Field to plate", title: "How toor is split, not polished",
        text: "Almost every dal on a shelf has been given a coat to make it shine. " +
              "Ours has not, and this is what that means.",
        shot: "assets/j-toor-1-plant.webp" },
      stages: [
        { when: "Month 5–9", title: "Flowers and pods at the same time",
          text: "Cajanus cajan carries yellow flowers on one branch and filling pods on " +
                "another, so a field is never all at one stage. It is picked over, not cleared.",
          short: "Never all at one stage. Picked over, not cleared.",
          shot: "assets/j-toor-1-plant.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:%E0%A4%A4%E0%A5%82%E0%A4%B0_%E0%A4%AA%E0%A4%BF%E0%A4%95%E0%A4%BE%E0%A4%9A%E0%A5%8D%E0%A4%AF%E0%A4%BE_%E0%A4%B6%E0%A5%87%E0%A4%82%E0%A4%97%E0%A4%BE_%E0%A4%B5_%E0%A4%AB%E0%A5%81%E0%A4%B2%E0%A4%82_Pods_%26_flowers_of_Pigeon_pea_(Cajanus_cajan).jpg" target="_blank" rel="noopener">Pods &amp; flowers of pigeon pea</a>, CC BY-SA 4.0.' },
        { when: "Harvest", title: "Dried on the plant, then threshed",
          text: "Left until the pods go brown and brittle, then beaten to free the whole " +
                "pea. Dry it off the plant and the pea case hardens unevenly.",
          short: "Left until the pods go brown and brittle.",
          shot: "assets/j-toor-2-pods.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Pigeon_pea_pods_dried.jpg" target="_blank" rel="noopener">Pigeon pea pods dried</a>, CC0.' },
        { when: "The last step", title: "Split — and nothing after that",
          text: "Milled to take the skin off and split the pea in two. Here most dal gets " +
                "oil, water or leather-polished to a shine. A dull dal is an honest one; " +
                "the shine is a coat you then wash down your sink.",
          short: "A dull dal is an honest one.",
          shot: "assets/j-toor-3-dal.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Tur_Dal.JPG" target="_blank" rel="noopener">Tur Dal</a>, public domain.' }
      ],
      end: { title: "It will not shine, and that is the point",
        text: "Rinse it once and the water runs almost clear. That is how you can tell.",
        shot: "assets/j-toor-3-dal.webp" }
    },

    "Flax Seeds": {
      hi: "अलसी",
      intro: { kick: "Field to plate", title: "How alsi stays sealed",
        text: "Flax oil turns rancid faster than almost anything in a kitchen. Every " +
              "step below exists to keep the seed shut until you open it.",
        shot: "assets/j-flax-1-flower.webp" },
      stages: [
        { when: "Month 2", title: "Blue for a single morning",
          text: "Linum usitatissimum opens pale blue flowers that each last one morning " +
                "and are gone by afternoon. The field flowers for weeks, one day at a time.",
          short: "Each flower lasts one morning.",
          shot: "assets/j-flax-1-flower.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Linum_usitatissimum,_Findlay_Township,_2024-10-22.jpg" target="_blank" rel="noopener">Linum usitatissimum</a>, CC0.' },
        { when: "Harvest", title: "Bolls, not pods",
          text: "Each flower becomes a round boll holding up to ten seeds. The crop is " +
                "cut when the bolls turn gold and rattle.",
          short: "Each flower becomes a boll of ten seeds.",
          shot: "assets/j-flax-2-bolls.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Linum_usitatissimum_field,_Vlasveld_(1).jpg" target="_blank" rel="noopener">Flax field</a>, CC BY-SA 3.0.' },
        { when: "Whole", title: "Cleaned cold, and never ground",
          text: "No heat anywhere in the cleaning. Ground flax starts oxidising in days, " +
                "which is why we sell the seed whole and tell you to grind it the morning " +
                "you use it.",
          short: "Ground flax starts turning in days.",
          shot: "assets/j-flax-3-seed.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Brown_Flax_Seeds.jpg" target="_blank" rel="noopener">Brown flax seeds</a>, CC BY-SA.' }
      ],
      end: { title: "Grind it the morning you use it",
        text: "A coffee grinder, ten seconds. That is the freshest flax you will ever eat.",
        shot: "assets/j-flax-3-seed.webp" }
    },

    "Monk Fruit Sweetener": {
      hi: "मंक फ्रूट",
      intro: { kick: "Field to plate", title: "How a gourd becomes sweetness",
        text: "It is sweet without being sugar — the sweetness is a different molecule " +
              "altogether, and getting it out takes drying, not refining.",
        shot: "assets/j-monk-1-fruit.webp" },
      stages: [
        { when: "Autumn", title: "A small melon, picked hard",
          text: "Siraitia grosvenorii grows on a climbing vine in Guangxi and is cut while " +
                "the fruit is still green and firm. Split one open fresh and it is barely " +
                "sweet at all — the sweetness is made later, in the drying.",
          short: "Cut green and firm. The sweetness comes later.",
          shot: "assets/j-monk-1-fruit.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Siraitia_grosvenorii_%E7%BE%85%E6%BC%A2%E6%9E%9C.jpg" target="_blank" rel="noopener">Siraitia grosvenorii</a>, CC BY 2.0.' },
        { when: "Days", title: "Dried slowly, in its own skin",
          text: "Dried low and slow while still whole. This is where the sweetness " +
                "concentrates; rush it with heat and the fruit scorches and turns bitter.",
          short: "Dried whole and slow. Heat makes it bitter.",
          shot: "assets/j-monk-2-dried.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Dried_monk_fruit.jpg" target="_blank" rel="noopener">Dried monk fruit</a>, CC0.' },
        { when: "The last step", title: "Juiced, then dried to a powder",
          text: "The sweetness is mogrosides, not sugar — which is why it does not feed " +
                "a blood sugar spike. No sugar alcohols are added to bulk it out.",
          short: "Mogrosides, not sugar. Nothing added to bulk it.",
          shot: "assets/j-monk-3-powder.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Monkfruit_Sweetener.jpg" target="_blank" rel="noopener">Monkfruit Sweetener</a>, CC BY-SA 4.0.' }
      ],
      end: { title: "Sweet, from a fruit nobody eats",
        text: "Far sweeter than sugar by weight, so a very little goes a long way.",
        shot: "assets/j-monk-3-powder.webp" }
    },

    /* ---- the seven recovered on the second pass -------------------
       These were written off as impossible earlier in the day. They
       were not: commons.wikimedia.org started failing its SSL
       handshake from this machine, so the searches that "returned
       nothing" had in fact returned NOTHING BECAUSE THEY NEVER RAN.
       Re-run through the Openverse API - a different host, which was
       up - every one of them came back with usable photography,
       including the Khewra mine in the Salt Range, which is the
       actual source of Himalayan pink salt.

       Downloads go through upload.wikimedia.org (which stayed up)
       using hand-built /thumb/ paths at standard widths. */

    "Cumin Seeds": {
      hi: "जीरा",
      intro: { kick: "Field to plate", title: "How jeera is grown and left alone",
        text: "A hundred days from sowing to harvest, and almost nothing done to it " +
              "afterwards. The flavour is already finished when it comes off the plant.",
        shot: "assets/j-cumin-1-field.webp" },
      stages: [
        { when: "Month 3", title: "A field of small white flowers",
          text: "Cuminum cyminum is an umbellifer, cousin to carrot and coriander. It " +
                "flowers white across the whole field, then sets seed in feathery heads.",
          short: "An umbellifer. White flowers, then feathery heads.",
          shot: "assets/j-cumin-1-field.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Beautiful_fields_of_cumin_._Photo_By_Raju_Odedra_Mo_07698787895.jpg" target="_blank" rel="noopener">Fields of cumin</a> by Raju Odedra, CC BY.' },
        { when: "Harvest", title: "Pulled whole, dried, threshed",
          text: "The plant is pulled rather than cut, dried in small stacks, then beaten " +
                "to free the seed. It is a short, dry crop and it does not wait.",
          short: "Pulled whole, stacked to dry, then beaten.",
          shot: "assets/j-cumin-3-threshed.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Cuminum_cyminum_JEERA.jpg" target="_blank" rel="noopener">Cuminum cyminum</a>, CC BY-SA.' },
        { when: "Whole", title: "Sieved, graded, and nothing more",
          text: "No roasting and no grinding. Jeera gives up its oil in a hot pan in " +
                "about four seconds — that is your job, not ours.",
          short: "No roasting, no grinding. That is your pan's job.",
          shot: "assets/j-cumin-2-seed.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Cuminum_cyminum_JEERA.jpg" target="_blank" rel="noopener">Cuminum cyminum</a>, CC BY-SA.' }
      ],
      end: { title: "Four seconds in hot ghee",
        text: "That is the entire point of buying it whole.",
        shot: "assets/j-cumin-2-seed.webp" }
    },

    "Methi Seeds": {
      hi: "मेथी दाना",
      intro: { kick: "Field to plate", title: "How methi keeps its bitterness",
        text: "The only spice we sell where the bitterness is the product. Everything " +
              "below is about not losing it.",
        shot: "assets/j-methi-1-plant.webp" },
      stages: [
        { when: "Month 3", title: "A clover, not a grass",
          text: "Trigonella foenum-graecum grows low and bushy with three-part leaves and " +
                "small pale flowers. The leaf is a vegetable in its own right — this is " +
                "the same plant as kasuri methi.",
          short: "Same plant as the leaf you cook as a vegetable.",
          shot: "assets/j-methi-1-plant.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Trigonella_foenum_graecum-1-bangalore-India.jpg" target="_blank" rel="noopener">Trigonella foenum-graecum</a>, CC BY-SA 4.0.' },
        { when: "Harvest", title: "It grows low, and close together",
          text: "A dense, low crop cut whole at ground level. The pods it carries are slim " +
                "and easy to miss, ten to twenty seeds in each — left a week too long they " +
                "split and the crop is on the floor.",
          short: "Cut whole at ground level, pods and all.",
          shot: "assets/j-methi-3-crop.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Trigonella_foenum_graecum-3-xavier_cottage-yercaud-salem-India.jpg" target="_blank" rel="noopener">Trigonella foenum-graecum</a>, CC BY-SA 4.0.' },
        { when: "Whole", title: "Dried, cleaned, graded",
          text: "Bitter on purpose. That bitterness is what it is for in a tadka, in a " +
                "pickle and in sambar — and it is the first thing lost if the seed is " +
                "over-dried to make it grind easily.",
          short: "Bitter on purpose. Over-drying kills it.",
          shot: "assets/j-methi-2-seed.webp" }
      ],
      end: { title: "A little goes a long way",
        text: "Half a teaspoon is a decision. A whole one is a mistake.",
        shot: "assets/j-methi-2-seed.webp" }
    },

    "Black Pepper": {
      hi: "काली मिर्च",
      intro: { kick: "Field to plate", title: "How pepper turns black",
        text: "Black, green, white and red pepper are the same berry. What separates " +
              "them is when it is picked and what is done to it next.",
        shot: "assets/j-pepper-1-vine.webp" },
      stages: [
        { when: "Year 3–7", title: "It climbs, and it waits",
          text: "Piper nigrum is a vine trained up a living support tree. It gives nothing " +
                "for three years, then bears for decades.",
          short: "Three years to the first crop, then decades.",
          shot: "assets/j-pepper-1-vine.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Base_Pepper_Vines_Tree_Balamuri_Feb24_D72_25936.jpg" target="_blank" rel="noopener">Pepper vines</a>, CC BY-SA 4.0.' },
        { when: "7–10 days", title: "Picked green, dried black",
          text: "The spikes come off green and are blanched, then spread in the sun. The " +
                "skin darkens and wrinkles as an enzyme in it oxidises. Nothing is added " +
                "— that black is the berry doing it to itself.",
          short: "The black is the berry oxidising, not a dye.",
          shot: "assets/j-pepper-2-whole.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Black_pepper_whole.JPG" target="_blank" rel="noopener">Black pepper whole</a>, public domain.' },
        { when: "Whole", title: "Graded, never ground",
          text: "Sorted so the light hollow berries are blown out. Sold whole because " +
                "piperine — the heat — starts leaving a ground pepper within weeks.",
          short: "Ground pepper loses its bite within weeks.",
          shot: "assets/j-pepper-3-corns.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Black_peppercorns_with_mortar_and_pestle.jpg" target="_blank" rel="noopener">Black peppercorns</a>, CC BY-SA.' }
      ],
      end: { title: "Grind it at the table",
        text: "The difference between a mill and a packet is not subtle. It is the whole spice.",
        shot: "assets/j-pepper-3-corns.webp" }
    },

    "Chana Dal": {
      hi: "चना दाल",
      intro: { kick: "Field to plate", title: "How chana is split",
        text: "The skin does not come off with a polish. It comes off in the splitting, " +
              "which is a different machine and a different result.",
        shot: "assets/j-chana-1-field.webp" },
      stages: [
        { when: "Month 3–4", title: "One pink flower, one pod",
          text: "Cicer arietinum flowers pink or white, and each flower makes a single " +
                "short pod holding one or two seeds. It is grown on stored soil moisture " +
                "through the cool months and gives nitrogen back to the field.",
          short: "Each flower makes one short pod. Feeds the soil back.",
          shot: "assets/j-chana-2-pods.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:CSIRO_ScienceImage_3196_Chickpeas_in_glasshouse.jpg" target="_blank" rel="noopener">Chickpea plant</a>, CC BY.' },
        { when: "Harvest", title: "Left until the whole field goes brown",
          text: "Nothing is cut while it is green. The crop stands until the plant is " +
                "brown and brittle right through, and is then beaten to free the whole gram.",
          short: "Nothing is cut green. It stands until brittle.",
          shot: "assets/j-chana-1-field.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Chickpea_field,_Ni%C4%9Fde_2017-08-05_01-1.jpg" target="_blank" rel="noopener">Chickpea field</a>, CC BY-SA 4.0.' },
        { when: "The last step", title: "Split, and left dull",
          text: "Milled so the skin comes away as the gram splits. Most chana dal on a " +
                "shelf has then been polished with oil or water to make it shine. Ours " +
                "has not, which is why it looks like a pulse and not a bead.",
          short: "Polished dal is a bead. This is a pulse.",
          shot: "assets/j-chana-3-dal.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Split_Chickpeas.jpg" target="_blank" rel="noopener">Split chickpeas</a>, CC BY-SA.' }
      ],
      end: { title: "Dull, and honest about it",
        text: "The shine is a coat. You would only wash it off again.",
        shot: "assets/j-chana-3-dal.webp" }
    },

    "Chia Seeds": {
      hi: "चिया बीज",
      intro: { kick: "Field to plate", title: "How chia is cleaned and nothing else",
        text: "The shortest process of anything we sell. There is no step here that " +
              "changes the seed — and that is the whole claim.",
        shot: "assets/j-chia-1-plant.webp" },
      stages: [
        { when: "Month 3–4", title: "A sage, with blue flowers",
          text: "Salvia hispanica is a true sage — the same family as the herb — and it " +
                "flowers blue and white in spikes before it sets seed.",
          short: "A true sage. It flowers blue before it seeds.",
          shot: "assets/j-chia-1-plant.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Salvia_hispanica_kz1.jpg" target="_blank" rel="noopener">Salvia hispanica</a>, CC BY-SA.' },
        { when: "Growing", title: "Square stems, and a mint's leaf",
          text: "The giveaway that this is a mint-family plant: paired leaves, a square " +
                "stem, and that scent when you crush one. The seed sets in spikes above " +
                "these leaves and is cut once it goes brown and brittle.",
          short: "Paired leaves, square stem — a mint, botanically.",
          shot: "assets/j-chia-2-leaf.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Chia_plant_leafs_3.jpg" target="_blank" rel="noopener">Chia plant leaves</a>, CC BY-SA.' },
        { when: "Whole", title: "Sieved, and that is the end of it",
          text: "Not roasted, not ground, not treated. Chia's oil is protected inside a " +
                "hard seed coat that also makes the gel — break it and you lose both.",
          short: "Not roasted, not ground, not treated.",
          /* Replaced 22 Sep 2026. The previous frame was a botanical macro -
             genuinely chia, but shot at such magnification that the seeds read
             as river pebbles. The owner asked, reasonably, whether it was real
             chia at all.
             Replaced first with a flat field of seed - correct, but a grey
             rectangle with no focal point - and then with this: the same seed
             in a white dish on slate, cropped so the dish fills the arch. The
             rim gives it a shape and the slate gives it depth, which the flat
             texture could not. */
          shot: "assets/j-chia-3-seed.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Chia_Seed.jpg" target="_blank" rel="noopener">Chia Seed</a> by Jubair Bin Iqbal, CC BY-SA 4.0.' }
      ],
      end: { title: "Nothing happened to it",
        text: "Which, for a seed this fragile, is the most you can ask.",
        shot: "assets/j-chia-3-seed.webp" }
    },

    "Himalayan Pink Salt": {
      hi: "गुलाबी नमक",
      intro: { kick: "Rock to plate", title: "How pink salt is mined, not made",
        text: "This one has no field. It is rock, cut out of a hill that was a sea about " +
              "six hundred million years ago.",
        shot: "assets/j-salt-1-range.webp" },
      stages: [
        { when: "600 million years", title: "The Salt Range, in Punjab",
          text: "A ridge of folded hills south of the Himalaya where an ancient inland sea " +
                "dried out and was buried. The pink is iron oxide, left in the crystal as " +
                "the water went.",
          short: "An ancient sea, dried out and buried.",
          shot: "assets/j-salt-1-range.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Khewra_Salt_Mines_landscape_IMG_3127.jpg" target="_blank" rel="noopener">Khewra Salt Mines landscape</a>, CC BY-SA.' },
        { when: "Underground", title: "Cut by room and pillar",
          text: "Half the salt in any chamber is left standing as a pillar to hold the " +
                "roof up. Nothing is pumped, dissolved or evaporated — it is quarried dry.",
          short: "Quarried dry. Half is left holding the roof up.",
          shot: "assets/j-salt-2-mine.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Khewra_Salt_Mine_-_Crystal_Deposits_on_the_mine_wall.jpg" target="_blank" rel="noopener">Khewra Salt Mine crystal deposits</a>, CC BY-SA.' },
        { when: "The last step", title: "Crushed and graded. Nothing else.",
          text: "Not washed, not bleached, not iodised, not anti-caked. What is in the " +
                "packet is the rock, broken smaller. The colour varies between batches " +
                "because rock does.",
          short: "Not washed, bleached, iodised or anti-caked.",
          shot: "assets/j-salt-3-rock.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Rock_salt_(halitite)_(Billianwala_Salt_Member,_Salt_Range_Formation).jpg" target="_blank" rel="noopener">Rock salt, Salt Range Formation</a>, CC BY.' }
      ],
      end: { title: "If it is all one colour, ask why",
        text: "Real rock salt is uneven. Uniform pink has usually been helped.",
        shot: "assets/j-salt-3-rock.webp" }
    },

    "Coconut Sugar": {
      hi: "नारियल शक्कर",
      intro: { kick: "Tree to plate", title: "How sap becomes sugar",
        text: "It does not come from the coconut. It comes from the flower, before the " +
              "coconut ever forms.",
        shot: "assets/j-coco-1-flower.webp" },
      stages: [
        { when: "Daily", title: "The flower, not the fruit",
          text: "The palm throws a long flower spike. Tapped for sap, that spike will " +
                "never become a nut — every litre of sap is a coconut the tree did not grow.",
          short: "Every litre of sap is a coconut not grown.",
          shot: "assets/j-coco-1-flower.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Coconut_Flower_01.jpg" target="_blank" rel="noopener">Coconut flower</a>, CC BY-SA.' },
        { when: "Twice a day", title: "Cut, and collected",
          text: "The spike is sliced a sliver at a time and a pot hung under it, emptied " +
                "morning and evening — sap ferments within hours in the heat. The palms " +
                "in this photograph are DATE palms, not coconut: the tapping is the same " +
                "job done the same way, but we are not going to caption it as ours.",
          short: "Tapped twice a day. (Photograph: date palms, same method.)",
          shot: "assets/j-coco-2-sap.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Sweet_sap_from_date_palm.JPG" target="_blank" rel="noopener">Sweet sap from date palm</a>, CC BY-SA — <strong>date palm, not coconut</strong>; shown for the tapping method.' },
      ],
      /* TWO stages, not three. The boiling-down step is real and is described
         on the closing card, but no photograph of it exists that we may use -
         the only candidate was a MUSEUM DISPLAY of jaggery tools, behind glass,
         with a "do not touch" sign. Repeating the sap photograph to make a
         third stage would have been the dishonest option. */
      end: { title: "Then boiled down, and dried",
        text: "The sap is reduced over an open fire until it crystallises, then broken " +
              "up. Nothing is refined out of it, which is why it stays brown and tastes " +
              "of caramel — white sugar is what is left when you remove everything that " +
              "had a flavour.",
        shot: "assets/j-coco-1-flower.webp" }
    },

    /* ---- the five blends ------------------------------------------
       These were the last five without a journey, and they are a
       different problem from the single spices: a masala has no field
       and no harvest of its own. Its process is ROASTING and GRINDING,
       which is why the owner asked for grinding footage rather than
       more photographs.

       FIVE DISTINCT GRINDING CLIPS, one per blend, so no two cards
       show the same film:
         proc-seeds        a pestle working spice powder in a mortar
         proc-dhaniya      a sil-batta, the flat Indian grinding stone
         proc-salt         a wooden mortar and pestle
         proc-chakki-stone a water-powered atta chakki, stone turning
         proc-chakki-flour the same mill, flour lifted off the stone

       The first three are the Pexels clips already on the site (free
       commercially, no attribution). The two chakki clips are new: cut
       from "Flour mill running on water in Tawang district" (CC BY-SA
       4.0, Research Institute of World's Ancient Traditions, Cultures
       and Heritage), a traditional water-driven stone mill at Sakyur
       village, Arunachal Pradesh.

       SAID PLAINLY ON THE CARD: that mill is grinding MILLET, not our
       masala, and it is not our mill. The site's media-honesty line
       already covers this for every clip on the page, and each of
       these stages repeats it rather than letting the picture imply
       something it should not.

       TWO STAGES EACH, not three. A blend genuinely has two steps we
       can show - what goes in, and the grinding - and padding it with
       a roasting photograph we do not have would be the same mistake
       the earlier entries were pulled up for. */

    "Garam Masala": {
      hi: "गरम मसाला",
      intro: { kick: "Whole to ground", title: "How garam masala is built",
        text: "“Garam” is warming, not hot. There is no chilli in a true garam " +
              "masala — the heat you taste is cinnamon, clove and black pepper.",
        shot: "assets/cat-whole.webp" },
      stages: [
        { when: "Weighed out", title: "Eight or nine spices, whole",
          text: "Cinnamon, clove, green and black cardamom, bay, black pepper, cumin, " +
                "mace. Each is roasted separately, because they do not brown at the same " +
                "speed — clove is done long before cumin has started.",
          short: "Each roasted separately. They brown at different speeds.",
          shot: "assets/cat-whole.webp" },
        { when: "The last step", title: "Ground cool, in small batches",
          text: "A stone or a slow mortar rather than a fast steel mill. The aroma of a " +
                "garam masala is volatile oil, and a hot grind drives it off before the " +
                "packet is even sealed.",
          short: "A hot grind drives the aroma off before it is packed.",
          video: "assets/proc-seeds.mp4", shot: "assets/proc-seeds.webp",
          credit: "Film: a pestle working spice to powder. Pexels, free for commercial use. Not our mill." }
      ],
      end: { title: "No chilli, no colour, no filler",
        text: "If a garam masala is bright red, something has been added that does not belong.",
        shot: "assets/cat-whole.webp" }
    },

    "Biryani Masala": {
      hi: "बिरयानी मसाला",
      intro: { kick: "Whole to ground", title: "How biryani masala is built",
        text: "Built for aroma rather than heat, because in a biryani the masala has to " +
              "carry through rice, meat and a sealed lid.",
        shot: "assets/p-biryani.webp" },
      stages: [
        { when: "Weighed out", title: "Cardamom and cinnamon lead",
          text: "Green cardamom, cinnamon, clove, bay, mace and star anise — the " +
                "perfumed end of the spice box. Chilli is a small part of it, not the point.",
          short: "The perfumed end of the box. Chilli is a small part.",
          shot: "assets/p-biryani.webp" },
        { when: "The last step", title: "Ground on stone, in small batches",
          text: "Ground to order rather than held in a warehouse. A biryani masala that " +
                "has sat a year smells of dust, and no amount of it will fix a biryani.",
          short: "Ground to order. A year-old blend smells of dust.",
          video: "assets/proc-dhaniya.mp4", shot: "assets/proc-dhaniya.webp",
          credit: "Film: a sil-batta, the flat Indian grinding stone. Pexels, free for commercial use. Not our mill." }
      ],
      end: { title: "Aroma first, heat second",
        text: "Add your own chilli. You cannot take ours out.",
        shot: "assets/cat-blend.webp" }
    },

    "Chaat Masala": {
      hi: "चाट मसाला",
      intro: { kick: "Whole to ground", title: "How chaat masala is built",
        text: "Sour, salty and a little smoky. Amchur and black salt do the talking; " +
              "roasted cumin holds it together.",
        shot: "assets/p-chilli-whole.webp" },
      stages: [
        { when: "Weighed out", title: "Cumin, amchur and black salt, by weight",
          text: "Cumin is dry-roasted until it smells nutty, then weighed with amchur, " +
                "black salt, dried mint and a little chilli. Blended by weight, not by scoop, " +
                "so one batch tastes like the last.",
          short: "Blended by weight so one batch matches the last.",
          shot: "assets/p-chilli-whole.webp" },
        { when: "The last step", title: "Ground fine, so it clings",
          text: "Chaat masala is sprinkled, not cooked, so it is ground fine enough to " +
                "stick to cut fruit, sev and chana. The amchur goes in last so it stays sharp.",
          short: "Fine on purpose, so it sticks.",
          video: "assets/proc-salt.mp4", shot: "assets/proc-salt.webp",
          credit: "Film: a wooden mortar and pestle. Pexels, free for commercial use. Not our mill." }
      ],
      end: { title: "Sprinkle it last",
        text: "Over the plate, just before you eat. Heat dulls the amchur.",
        shot: "assets/cat-ground.webp" }
    },

    "Sambar Masala": {
      hi: "सांबार मसाला",
      intro: { kick: "Whole to ground", title: "How sambar masala is built",
        text: "The one blend with lentils in it. That is not a filler — it is the " +
              "thing that makes sambar taste like sambar.",
        shot: "assets/j-chana-3-dal.webp" },
      stages: [
        { when: "Roasted first", title: "The dal goes in the pan too",
          text: "Chana dal and toor dal are dry-roasted alongside the coriander, chilli " +
                "and methi until they turn nutty and gold. Leave them out and you have a " +
                "curry powder, not a sambar podi.",
          short: "Roasted dal is what makes it sambar, not curry powder.",
          shot: "assets/j-chana-3-dal.webp",
          credit: 'Photograph: <a href="https://commons.wikimedia.org/wiki/File:Split_Chickpeas.jpg" target="_blank" rel="noopener">Split chickpeas</a>, CC BY-SA.' },
        { when: "The last step", title: "Stone-ground, so the dal does not gum",
          text: "Roasted dal turns pasty in a hot mill. Ground cool and slow between " +
                "stones it stays a powder — which is why this blend is the one that " +
                "most repays doing it the old way.",
          short: "Roasted dal gums up in a hot mill. Stone keeps it powder.",
          video: "assets/proc-chakki-stone.mp4", shot: "assets/proc-chakki-stone.webp",
          credit: 'Film: a water-driven stone chakki at Sakyur, Tawang — grinding <em>millet</em>, not masala, and not our mill. <a href="https://commons.wikimedia.org/wiki/File:Flour_mill_running_on_water_in_Tawang_district.webm" target="_blank" rel="noopener">Source</a>, CC BY-SA 4.0, Research Institute of World’s Ancient Traditions, Cultures and Heritage.' }
      ],
      end: { title: "Lentils in the blend, on purpose",
        text: "It is what thickens the sambar and what makes it smell like a South Indian kitchen.",
        shot: "assets/j-chana-3-dal.webp" }
    },

    "Chatpat / Kanda Lasun Masala": {
      hi: "चटपट / कांदा लसूण मसाला",
      intro: { kick: "Whole to ground", title: "How chatpat / kanda lasun masala is built",
        text: "The only blend here that is meant to be sprinkled on at the end rather " +
              "than cooked. Everything about it is built for that.",
        shot: "assets/cat-blend.webp" },
      stages: [
        { when: "Weighed out", title: "Cumin, black salt, and the sour one",
          text: "Roasted cumin, kala namak, black pepper, ajwain — and amchur, dried " +
                "green mango, which is where the sourness comes from. No tamarind, no " +
                "citric acid.",
          short: "Amchur for the sour, not citric acid.",
          shot: "assets/cat-blend.webp" },
        { when: "The last step", title: "Ground, with the amchur folded in last",
          text: "Amchur is hygroscopic — it pulls water out of the air and cakes. It " +
                "goes in at the end, after everything else is ground and cool, so the " +
                "blend stays loose in the jar.",
          short: "Amchur last, or the whole jar cakes solid.",
          video: "assets/proc-chakki-flour.mp4", shot: "assets/proc-chakki-flour.webp",
          credit: 'Film: flour lifted from the stone at a water-driven chakki in Tawang — <em>millet</em>, not masala, and not our mill. <a href="https://commons.wikimedia.org/wiki/File:Flour_mill_running_on_water_in_Tawang_district.webm" target="_blank" rel="noopener">Source</a>, CC BY-SA 4.0, Research Institute of World’s Ancient Traditions, Cultures and Heritage.' }
      ],
      end: { title: "Sprinkle it on, do not cook it",
        text: "Heat kills the amchur and the kala namak. This one goes on last.",
        shot: "assets/cat-blend.webp" }
    }
  };

  /* A page can take single photographs out of the "How it is made" stories
     without editing this file: window.SATVA_DROP_SHOTS = ["assets/x.jpg"]
     (ports/8002, 14 Oct 2026, owner on the third mustard picture: "i want to
     remove this particular picture of the mustard seed. others are ok").
     Any stage showing a listed photograph is dropped, and an end card that
     used it takes the last remaining stage's photograph instead.
     Unset - every other page - nothing changes. */
  var DROP_SHOTS = window.SATVA_DROP_SHOTS || [];
  if (DROP_SHOTS.length) {
    Object.keys(JOURNEYS).forEach(function (k) {
      var j = JOURNEYS[k];
      if (!j.stages) return;
      j.stages = j.stages.filter(function (st) { return DROP_SHOTS.indexOf(st.shot) < 0; });
      var last = j.stages[j.stages.length - 1];
      if (j.end && DROP_SHOTS.indexOf(j.end.shot) > -1 && last) j.end.shot = last.shot;
      if (j.intro && DROP_SHOTS.indexOf(j.intro.shot) > -1 && j.stages[0]) j.intro.shot = j.stages[0].shot;
    });
  }

  function productCard(p) {
    var card = document.createElement("article");
    card.className = "pcard reveal";
    card.style.setProperty("--acc", p.acc);
    card.style.setProperty("--acc-ink", p.ink);
    /* The tile is the DEFAULT, not the fallback: most of the range has no
       photograph, and a card that renders empty and then fills in looks broken.
       The photo is probed after, and only swaps in if it actually loads - the
       same pattern the category cards use. */
    card.innerHTML =
      '<div class="pthumb tile" style="--tint:' + p.tint + '">' +
        VEG +
        '<span class="glyph">' + p.glyph + "</span>" + MORTAR +
        (JOURNEYS[p.en]
          ? '<button class="pjbadge" type="button" data-journey="' + p.en + '" ' +
              'aria-label="See how ' + p.en + ' is made">' +
              PLAY_ICON + "<span>How it's made</span></button>"
          : "") +
      "</div>" +
      '<div class="pbody">' +
        "<h3>" + p.en + "</h3>" +
        '<p class="dv">' + p.hi + "</p>" +
        (p.form ? '<span class="pform">' + p.form + "</span>" : "") +
        "<p>" + p.d + "</p>" +
        '<a class="ask" href="' + askLink(p) + '" target="_blank" rel="noopener">Ask about this ' + CHAT + "</a>" +
        /* The journey button only exists for products we have actually
           documented. A button that opens an empty panel is worse than
           no button, so it is driven off the JOURNEYS data, not a flag. */
        (JOURNEYS[p.en]
          ? '<button class="pjourney" type="button" data-journey="' + p.en + '">' +
              PLAY_ICON + "See how it is made</button>"
          : "") +
      "</div>";
    if (p.img && p.photo) {
      var probe = new Image();
      probe.onload = function () {
        var thumb = card.querySelector(".pthumb");
        if (!thumb) return;
        /* This clears the tile wholesale, so anything that must survive
           the swap has to be carried across by hand. */
        var badge = thumb.querySelector(".pjbadge");
        thumb.classList.remove("tile");
        thumb.removeAttribute("style");
        thumb.innerHTML = VEG;
        if (badge) thumb.appendChild(badge);
        probe.alt = p.en;
        probe.loading = "lazy";
        thumb.appendChild(probe);
      };
      probe.src = p.img;
    }
    return card;
  }

  /* ---------------------------------------------------------
     THE INLINE VARIANT (inline.html only)          20 Sep 2026
     ---------------------------------------------------------
     The owner's objection to the overlay was not that it looked
     wrong - it was "I'm not sure how many customers will open and
     see". Fair. A click is a toll, and most people do not pay it.

     So on inline.html the turmeric card stops being a 248px tile
     and becomes a full-width band that spans the whole grid row,
     with all six stages laid out in it as a filmstrip. Nothing is
     hidden: scroll past the range and you have read the process
     whether you meant to or not.

     Switched on by <body class="jrn-inline">, so index.html is
     untouched and the two can be compared side by side.
     --------------------------------------------------------- */
  var INLINE = document.body.classList.contains("jrn-inline");

  /* ---------------------------------------------------------
     THE ONE-CARD VARIANT (card.html only)          21 Sep 2026
     ---------------------------------------------------------
     inline.html answered "nobody will click" by giving turmeric the
     whole grid row. The objection to THAT is scale: it works for one
     product and falls apart at five, because five full-width bands
     is no longer a range, it is five essays.

     So this version puts the same six stages inside the card's own
     square - the tile keeps its place in the grid beside the other
     twenty, and the picture area cycles through the process on its
     own. Nothing is hidden and nothing is bigger than a card.
     --------------------------------------------------------- */
  var CARDMODE = document.body.classList.contains("jrn-card");

  /* ---------------------------------------------------------
     THE STILL VARIANT (still.html only)            22 Sep 2026
     ---------------------------------------------------------
     "Keep only one picture in these pictures and make all these
     visible when we click How its made, and in a different link."

     So the card stops cycling: ONE photograph, held still, and the
     whole sequence lives behind the button instead. The picture
     used is the journey's FIRST stage - the crop in the field -
     because it is a real photograph for all twenty-one, where
     p.img only exists for eight of them.
     --------------------------------------------------------- */
  var STILL = document.body.classList.contains("jrn-still");
  var CARD_DELAY = 3000;   /* same beat as the hero shelves, SH_DELAY */

  function journeyCard(p) {
    var j = JOURNEYS[p.en];
    var card = document.createElement("article");
    card.className = "pcard is-journey reveal";
    card.style.setProperty("--acc", p.acc);
    card.style.setProperty("--acc-ink", p.ink);

    var film = j.stages.map(function (s, n) {
      /* The last stage is the only one with footage. It is left as a
         poster here and only swapped for the <video> when it scrolls
         into view - a card this wide is not worth an autoplaying
         decode on a phone the moment the grid renders. */
      return '<button class="jfilm" type="button" data-journey="' + p.en + '" ' +
               'aria-label="Step ' + (n + 1) + ': ' + s.title + '">' +
               '<span class="jfilm-shot">' +
                 '<img src="' + s.shot + '" alt="" loading="lazy">' +
                 (s.video ? '<span class="jfilm-play">' + PLAY_ICON + "</span>" : "") +
               "</span>" +
               '<span class="jfilm-when">' + s.when + "</span>" +
               "<b>" + s.title + "</b>" +
               "<i>" + (s.short || "") + "</i>" +
             "</button>";
    }).join("");

    card.innerHTML =
      '<div class="jinline-head">' +
        '<div class="jinline-id">' +
          '<p class="kick">' + j.intro.kick + "</p>" +
          "<h3>" + p.en + ' <span class="dv">' + p.hi + "</span></h3>" +
          (p.form ? '<span class="pform">' + p.form + "</span>" : "") +
          "<p>" + p.d + "</p>" +
          '<a class="ask" href="' + askLink(p) + '" target="_blank" rel="noopener">Ask about this ' + CHAT + "</a>" +
        "</div>" +
        '<div class="jinline-lede">' +
          "<h4>" + j.intro.title + "</h4>" +
          "<p>" + j.intro.text + "</p>" +
        "</div>" +
      "</div>" +
      '<div class="jfilmstrip">' + film + "</div>" +
      '<p class="jinline-foot">' +
        "Every step above is the real process, with the real timings. " +
        '<button class="jinline-more" type="button" data-journey="' + p.en + '">' +
          "See it full screen</button>" +
      "</p>";
    return card;
  }

  /* Assigned further down, by the inline block. showGroup is the ONE
     place the grid is ever rebuilt, so it is the one place that has to
     re-attach the filmstrip observer. */
  var watchFilm = null;

  function cardJourney(p) {
    var j = JOURNEYS[p.en];
    var card = document.createElement("article");
    card.className = "pcard is-cardjrn reveal";
    card.style.setProperty("--acc", p.acc);
    card.style.setProperty("--acc-ink", p.ink);

    /* Stage 6 is the only one with footage. It is a <video> from the
       start here rather than a lazy swap: the tile is 260px, the clip
       is 328KB, and it has to be ready the moment the cycle reaches
       it or the sequence stutters on the last beat. preload="none"
       keeps it off the critical path until then. */
    var slides = j.stages.map(function (s, n) {
      var media = s.video
        ? '<video muted loop playsinline preload="none" poster="' + s.shot + '">' +
            '<source src="' + s.video + '" type="video/mp4"></video>'
        : '<img src="' + s.shot + '" alt="" loading="lazy">';
      return '<figure class="jcs" data-n="' + n + '"' + (n === 0 ? ' data-on="1"' : "") + ">" +
               media +
               '<figcaption class="jcs-cap">' +
                 '<span class="jcs-meta">' +
                   s.when + /* 20 Oct 2026: step number removed */
                 "</span>" +
                 "<strong>" + s.title + "</strong>" +
               "</figcaption>" +
             "</figure>";
    }).join("");

    /* One segment per stage. They are buttons, not decoration - with
       reduced motion the cycle never starts and these become the only
       way through, so they have to be operable. */
    var rail = j.stages.map(function (s, n) {
      return '<button type="button" class="jcr" data-go="' + n + '"' +
             (n === 0 ? ' aria-current="true"' : "") +
             ' aria-label="Step ' + (n + 1) + ' of ' + j.stages.length + ': ' + s.title + '">' +
             "<i></i></button>";
    }).join("");

    card.innerHTML =
      '<div class="jcard-film" data-count="' + j.stages.length + '">' +
        VEG +
        slides +
        '<div class="jcard-rail">' + rail + "</div>" +
      "</div>" +
      '<div class="pbody">' +
        '<p class="jcard-kick">' + j.intro.kick + "</p>" +
        "<h3>" + p.en + "</h3>" +
        '<p class="dv">' + p.hi + "</p>" +
        (p.form ? '<span class="pform">' + p.form + "</span>" : "") +
        "<p>" + p.d + "</p>" +
        '<a class="ask" href="' + askLink(p) + '" target="_blank" rel="noopener">Ask about this ' + CHAT + "</a>" +
        '<button class="pjourney" type="button" data-journey="' + p.en + '">' +
          PLAY_ICON + "See it full screen</button>" +
      "</div>";

    return card;
  }

  /* The one picture each still card shows: the ingredient itself, as
     it is sold - not the crop in the field.                 6 Oct 2026
     "i want it to be natural picture ... with the main ingredient",
     then "i want stunning pictures".
     u-*.jpg are Unsplash License photographs - free for commercial
     use; photographer and link for each in assets/UNSPLASH-CREDITS.txt.
     Coriander Powder and Monk Fruit keep their journey photographs:
     Unsplash had nothing true to the product for either. */
  var STILL_SHOT = {
    "Turmeric":             "assets/u-turmeric.webp",
    "Chilli Powder":        "assets/u-chilli-powder.webp",
    "Coriander Powder":     "assets/j-coriander-3-powder.webp",
    "Coriander Seeds":      "assets/u-coriander-seeds.webp",
    "Cumin Seeds":          "assets/u-cumin-seeds.webp",
    "Mustard Seeds":        "assets/u-mustard-seeds.webp",
    "Black Pepper":         "assets/u-black-pepper.webp",
    "Garam Masala":         "assets/u-garam-masala.webp",
    "Biryani Masala":       "assets/u-biryani-masala.webp",
    "Chaat Masala":         "assets/u-chaat-masala.webp",
    "Sambar Masala":        "assets/u-sambar-masala.webp",
    "Chatpat / Kanda Lasun Masala":       "assets/u-chatpat-masala.webp",
    "Toor Dal":             "assets/u-toor-dal.webp",
    "Chana Dal":            "assets/u-chana-dal.webp",
    "Chia Seeds":           "assets/u-chia-seeds.webp",
    "Flax Seeds":           "assets/u-flax-seeds.webp",
    "Methi Seeds":          "assets/u-methi-seeds.webp",
    "Himalayan Pink Salt":  "assets/u-himalayan-pink-salt.webp",
    "Coconut Sugar":        "assets/u-coconut-sugar.webp",
    "Monk Fruit Sweetener": "assets/j-monk-3-powder.webp"
  };
  /* a page can swap single card pictures: window.SATVA_STILL_SHOT =
     {"Name": "assets/x.jpg"} (ports/8002, 15 Oct 2026: Sambar Masala in
     the colour of the owner's own blend). Unset - nothing changes. */
  if (window.SATVA_STILL_SHOT) {
    Object.keys(window.SATVA_STILL_SHOT).forEach(function (k) { STILL_SHOT[k] = window.SATVA_STILL_SHOT[k]; });
  }

  /* The dish behind each "How it's made" card's Recipe button - an id in
     RECIPES (name, time, line) and RECIPE_BOOK (ingredients, method).
     Owner, 8 Oct 2026. Where the page's rotating recipe sets already
     pair a product with a dish, this uses the same dish. */
  var RECIPE_FOR = {
    "Turmeric":             "haldi-doodh",
    "Chilli Powder":        "misal",
    "Coriander Powder":     "bharli-vangi",
    "Coriander Seeds":      "dhane-aloo",
    "Cumin Seeds":          "jeera-bhaat",
    "Mustard Seeds":        "fodni-poha",
    "Black Pepper":         "miri-rasam",
    "Garam Masala":         "chole",
    "Biryani Masala":       "biryani",
    "Chaat Masala":         "bhel",
    "Sambar Masala":        "sambar",
    "Chatpat / Kanda Lasun Masala":       "shengdana",
    "Toor Dal":             "varan-bhaat",
    "Chana Dal":            "chana-dal",
    "Chia Seeds":           "chia",
    "Flax Seeds":           "javas-chutney",
    "Methi Seeds":          "methi-dal",
    "Himalayan Pink Salt":  "nimbu-pani",
    "Coconut Sugar":        "kheer",
    "Monk Fruit Sweetener": "shrikhand"
  };

  function stillCard(p) {
    var j = JOURNEYS[p.en];
    var card = document.createElement("article");
    card.className = "pcard is-still reveal";
    card.style.setProperty("--acc", p.acc);
    card.style.setProperty("--acc-ink", p.ink);
    card.innerHTML =
      '<div class="still-shot">' +
        VEG +
        '<img src="' + (STILL_SHOT[p.en] || j.stages[0].shot) + '" alt="' + p.en + '" loading="lazy">' +
      "</div>" +
      '<div class="pbody">' +
        '<p class="jcard-kick">' + j.intro.kick + "</p>" +
        "<h3>" + p.en + "</h3>" +
        '<p class="dv">' + p.hi + "</p>" +
        (p.form ? '<span class="pform">' + p.form + "</span>" : "") +
        "<p>" + p.d + "</p>" +
        '<a class="ask" href="' + askLink(p) + '" target="_blank" rel="noopener">Ask about this ' + CHAT + "</a>" +
        '<button class="pjourney" type="button" data-journey="' + p.en + '">' +
          PLAY_ICON + "How it is made</button>" +
      "</div>";
    return card;
  }

  /* Every card film on the page, wound up and left running. Rebuilt
     on each showGroup() the same way the inline strip is. */
  var cardFilms = [];
  function startCardFilms() {
    cardFilms.forEach(function (f) { window.clearInterval(f.timer); });
    cardFilms = [];
    [].forEach.call(document.querySelectorAll(".jcard-film"), function (film, nth) {
      var slides = [].slice.call(film.querySelectorAll(".jcs"));
      var dots = [].slice.call(film.querySelectorAll(".jcr"));
      if (slides.length < 2) return;
      var f = { film: film, i: 0, timer: 0, paused: false };

      function go(n) {
        f.i = (n + slides.length) % slides.length;
        slides.forEach(function (sl, k) {
          var on = k === f.i;
          if (on) sl.setAttribute("data-on", "1"); else sl.removeAttribute("data-on");
          var v = sl.querySelector("video");
          /* only the visible slide's clip runs - the others are not
             just hidden, they are stopped */
          if (v) { if (on) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); } else v.pause(); }
        });
        dots.forEach(function (d, k) {
          if (k === f.i) d.setAttribute("aria-current", "true"); else d.removeAttribute("aria-current");
        });
      }
      function tick() { if (!f.paused) go(f.i + 1); }

      dots.forEach(function (d) {
        d.addEventListener("click", function () {
          go(+d.dataset.go);
          /* a deliberate choice restarts the clock, so the stage you
             picked gets a full beat rather than whatever was left */
          window.clearInterval(f.timer);
          if (!reduce) f.timer = window.setInterval(tick, CARD_DELAY);
        });
      });

      /* Hovering is reading. Stop moving the thing being read. */
      film.addEventListener("mouseenter", function () { f.paused = true; });
      film.addEventListener("mouseleave", function () { f.paused = false; });
      film.addEventListener("focusin", function () { f.paused = true; });
      film.addEventListener("focusout", function () { f.paused = false; });

      /* Stagger the starting stage. Coriander Powder and Coriander Seeds
         share their first two stages - same plant, same photograph - so
         left in lockstep they sat side by side in the grid showing an
         identical frame and read as a duplicate card rather than two
         products. Offsetting by position fixes it for every pair. */
      go(nth % slides.length);
      if (!reduce) f.timer = window.setInterval(tick, CARD_DELAY);
      cardFilms.push(f);
    });
  }

  var rangeCur = "all";

  function showGroup(id) {
    if (!pGrid) return;
    var g = id === "all" ? ALL : GROUPS.filter(function (o) { return o.id === id; })[0];
    if (!g) g = ALL;
    rangeCur = g.id;
    var list = PRODUCTS.filter(function (p) {
      if (!inGroup(g, p.cat)) return false;
      /* only "Everything" honours hideInAll - a shelf always shows its whole shelf */
      return !(g.id === "all" && p.hideInAll);
    });
    pGrid.innerHTML = "";
    list.forEach(function (p) {
      var el = JOURNEYS[p.en]
        ? (STILL ? stillCard(p)
          : CARDMODE ? cardJourney(p)
          : INLINE ? journeyCard(p)
          : productCard(p))
        : productCard(p);
      pGrid.appendChild(el);
    });
    if (rSub) {
      if (g.id === "all") {
        /* The claim is about the RANGE, so it counts PRODUCTS, not the grid -
           list.length would say 20 here and under-report what we actually
           sell. Anything held back by hideInAll is named instead, so the
           number and the cards on screen cannot quietly disagree. */
        var held = PRODUCTS.filter(function (p) { return p.hideInAll; })
                           .map(function (p) { return p.en; });
        /* 20 Oct 2026, owner: no numbers anywhere on the site - the count of
           staples and shelves is gone; only the held-back note stays. */
        rSub.textContent = held.length ? held.join(", ") +
             (held.length === 1 ? " is" : " are") + " on the Spices shelf." : "";
      } else {
        rSub.textContent = "Everything on the " + g.label + " shelf"; /* 20 Oct 2026: count removed */
      }
    }
    if (rTabs) [].forEach.call(rTabs.children, function (b) {
      b.setAttribute("aria-selected", b.dataset.group === g.id ? "true" : "false");
    });
    /* reveal-on-scroll already ran for this section, so cards built now would
       stay invisible; they are shown directly instead */
    [].forEach.call(pGrid.querySelectorAll(".reveal"), function (el) { el.classList.add("in"); });
    if (watchFilm) watchFilm();
    if (CARDMODE) startCardFilms();
  }

  /* The one clip in the strip is loaded lazily and only plays while it is
     actually on screen, the same rule the overlay uses. */
  if (INLINE && "IntersectionObserver" in window) {
    var filmIO = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var shot = e.target;
        if (!e.isIntersecting || e.intersectionRatio < 0.5) {
          var v0 = shot.querySelector("video");
          if (v0) v0.pause();
          return;
        }
        if (shot.querySelector("video") || reduce) return;
        var v = document.createElement("video");
        v.muted = v.loop = v.playsInline = true;
        v.setAttribute("muted", "");
        v.setAttribute("playsinline", "");
        v.poster = "assets/proc-turmeric.webp";
        v.innerHTML = '<source src="assets/proc-turmeric.mp4" type="video/mp4">';
        shot.appendChild(v);
        var pr = v.play();
        if (pr && pr.catch) pr.catch(function () {});
      });
    }, { threshold: [0, 0.5] });
    watchFilm = function () {
      [].forEach.call(document.querySelectorAll(".jfilm-play"), function (el) {
        filmIO.observe(el.parentNode);
      });
    };
  }

  /* the tab strip, with a count on each, from the same pair everything else uses */
  if (rTabs) {
    [ALL].concat(GROUPS).forEach(function (g) {
      var n = PRODUCTS.filter(function (p) { return inGroup(g, p.cat); }).length;
      if (!n) return;
      var b = document.createElement("button");
      b.className = "etab"; b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", g.id === "all" ? "true" : "false");
      b.dataset.group = g.id;
      b.innerHTML = g.label; /* 20 Oct 2026: count removed (owner: no numbers) */
      b.addEventListener("click", function () { showGroup(g.id); });
      rTabs.appendChild(b);
    });
  }

  /* One way in, used by the category cards, the hero pills and the dropdown. */
  function goToShelf(id) {
    showGroup(id);
    if (rangeSection) rangeSection.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  if (pGrid) showGroup("all");

  /* ---------------------------------------------------------
     1b. SHOP BY CATEGORY
     Arch-topped cards, one per GROUPS entry, in GROUPS order -
     so the four shelves appear here as Spices, Pulses, Seeds,
     Healthy Essentials. Counts and labels come off GROUPS and
     PRODUCTS, so adding a product or a shelf updates this block
     with no edit here. Clicking a card asks about that shelf on
     WhatsApp.
     --------------------------------------------------------- */
  /* One entry per GROUPS id. A group with no art here gets no card, so this map
     and GROUPS are edited together. The four tints are deliberately far apart -
     spice orange, dal sand, seed green, salt rose - because three of the four
     shelves are otherwise yellow and the cards would read as one block. */
  var CAT_ART = {
    spices:     { tint:"linear-gradient(150deg,#f6d7a0,#d98a2b)",
                  blurb:"Ground, whole and blended - in their own colour and smell.",
                  icon:'<path d="M5 11h14a7 7 0 0 1-7 7 7 7 0 0 1-7-7Z"/><path d="M12 18v3M8 21h8"/><path d="M16 8.5 19 4"/>' },
    pulses:     { tint:"linear-gradient(150deg,#eee6c0,#c2ab4e)",
                  blurb:"Unpolished dal - no dangerous polish to make it shine.",
                  icon:'<circle cx="12" cy="7.8" r="4.3"/><path d="M7.7 7.8h8.6"/><ellipse cx="7" cy="17.2" rx="3.1" ry="2.2" transform="rotate(-18 7 17.2)"/><ellipse cx="16.6" cy="17.2" rx="3.1" ry="2.2" transform="rotate(14 16.6 17.2)"/>' },
    seeds:      { tint:"linear-gradient(150deg,#d8e2b4,#93a04b)",
                  blurb:"Whole and unrefined, nothing polished off.",
                  icon:'<ellipse cx="8" cy="9" rx="3.2" ry="2.2" transform="rotate(-25 8 9)"/><ellipse cx="15.5" cy="11" rx="3.2" ry="2.2" transform="rotate(15 15.5 11)"/><ellipse cx="11" cy="15.5" rx="3.2" ry="2.2" transform="rotate(-8 11 15.5)"/>' },
    essentials: { tint:"linear-gradient(150deg,#f2d3d3,#d98a8a)",
                  blurb:"Unrefined salt, and sweetness that was never refined.",
                  icon:'<path d="M10.5 3h3v3l2.8 3.5A4 4 0 0 1 17 12v7a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-7a4 4 0 0 1 .7-2.5L10.5 6Z"/><path d="M12 13.5c1.2 1.4 2 2.4 2 3.2a2 2 0 1 1-4 0c0-.8.8-1.8 2-3.2Z"/>' }
  };

  var catWrap = document.getElementById("cats");
  if (catWrap) {
    GROUPS.forEach(function (g) {
      var a = CAT_ART[g.id];
      if (!a) return;                                   // no art, no card
      var count = PRODUCTS.filter(function (p) {
        return !g.cats || g.cats.indexOf(p.cat) > -1;
      }).length;
      if (!count) return;                               // never an empty card

      var card = document.createElement("button");
      card.type = "button";
      card.className = "catcard reveal";
      card.dataset.cat = g.id;
      card.innerHTML =
        '<span class="cshot" style="--tint:' + a.tint + '">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" ' +
            'stroke-linecap="round" stroke-linejoin="round">' + a.icon + '</svg>' +
          '<span class="cscrim"></span>' +
          '<span class="cname">' + g.label + '</span>' +
          '<span class="carrow" aria-hidden="true">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
              'stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h13M12 5l7 7-7 7"/></svg>' +
          '</span>' +
        '</span>' +
        '<span class="cmeta">' +
          '<span class="cblurb">' + a.blurb + '</span>' +
        '</span>';

      // the photograph replaces the icon tile, same probe pattern as everywhere else
      (function (c) {
        var probe = new Image();
        probe.onload = function () {
          var shot = c.querySelector(".cshot");
          if (!shot) return;
          probe.alt = "";
          probe.loading = "lazy";
          shot.insertBefore(probe, shot.firstChild);
          shot.querySelector("svg").remove();
          shot.classList.add("has-photo");
        };
        /* A page may name its own card pictures (window.SATVA_CAT_IMG, set
           before this script, e.g. ports/8002). Without it: cat-<id>.jpg. */
        whenNear(c, function () {
          probe.src = (window.SATVA_CAT_IMG && window.SATVA_CAT_IMG[g.id]) ||
                      ("assets/cat-" + g.id + ".webp");
        });
      })(card);

      /* There IS a listing again (20 Sep 2026), so the card does the obvious
          thing: filters the range to this shelf and scrolls to it. */
      card.addEventListener("click", function () { goToShelf(g.id); });

      catWrap.appendChild(card);
    });
  }

  /* ---------------------------------------------------------
     1c. THE SHELF SLIDER
     Four editorial openings, one per shelf and in GROUPS order,
     after the page the owner sent on 6 Sep 2026
     (jainfarmfresh.com/products/spices).

     Deliberately NOT autoplaying. The hero already advances on
     its own, and two carousels moving at once on one page read
     as noise; this one is browsed, not watched. The named tab
     strip is the real navigation - arrows and swipe are there
     for anyone who would rather flick through.

     Counts and tab labels come off the slides and PRODUCTS, so
     adding a fifth slide needs no edit here, and a count can
     never drift from what the range below will actually list.
     --------------------------------------------------------- */
  var shStage = document.getElementById("shstage");
  var shTabs  = document.getElementById("shtabs");

  if (shStage) {
    var shelves = [].slice.call(shStage.querySelectorAll(".shelf"));
    var shCur = 0, shBusy = false;

    // count line, off the same PRODUCTS/GROUPS pair the tabs use
    shelves.forEach(function (s) {
      var el = s.querySelector(".sh-count");
      if (!el) return;
      var g = GROUPS.filter(function (o) { return o.id === s.dataset.shelf; })[0];
      if (!g) return;
      var n = PRODUCTS.filter(function (p) { return inGroup(g, p.cat); }).length;
      el.hidden = true; /* 20 Oct 2026: "N items packed" removed (owner: no numbers) */
    });

    function shGo(to) {
      var n = shelves.length;
      to = ((to % n) + n) % n;
      if (to === shCur || shBusy) return;
      shBusy = true;
      shelves[shCur].classList.remove("is-on");
      shelves[to].classList.add("is-on");
      if (shTabs) {
        [].forEach.call(shTabs.children, function (b, i) {
          b.setAttribute("aria-selected", i === to ? "true" : "false");
          b.tabIndex = i === to ? 0 : -1;
        });
      }
      shCur = to;
      if (typeof shPaint === "function") shPaint();
      /* must match the .shelf opacity transition in the stylesheet (now .7s,
         raised from .62s with the interval change) or a quick click is eaten */
      setTimeout(function () { shBusy = false; }, reduce ? 20 : 700);
    }

    if (shTabs) {
      shelves.forEach(function (s, i) {
        var b = document.createElement("button");
        b.className = "etab";
        b.type = "button";
        b.setAttribute("role", "tab");
        b.setAttribute("aria-selected", i === 0 ? "true" : "false");
        b.tabIndex = i === 0 ? 0 : -1;
        b.textContent = s.dataset.label || ("Shelf " + (i + 1));
        b.addEventListener("click", function () { shStop(); shGo(i); });
        // left/right walk the strip, the usual tablist behaviour
        b.addEventListener("keydown", function (e) {
          var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
          if (!d) return;
          e.preventDefault();
          var nx = ((shCur + d) % shelves.length + shelves.length) % shelves.length;
          shGo(nx);
          shTabs.children[nx].focus();
        });
        shTabs.appendChild(b);
      });
    }

    /* ---- autoplay, after the hero slideshow on consciousfood.com -----------
       Their hero advances on its own; ours never did, because when this block
       was written the brand hero above it autoplayed and two carousels fight.
       That hero is gone, so this one takes the job.

       Four things make it polite rather than annoying:
       - it pauses while the pointer is over it, and while anything inside has
         keyboard focus, so nobody loses a line they are reading
       - it pauses when the tab is hidden - no invisible carousel burning a
         phone battery in a background tab
       - it stops for good the moment the visitor drives it themselves, by tab,
         arrow or swipe. Once someone has chosen a shelf, moving it under them
         is the site arguing with its own reader
       - prefers-reduced-motion never starts it at all
       The tab strip carries a progress line while it runs, so the movement is
       explained before it happens rather than being a surprise. */
    /* 4000, not 6000 — matched to kovaikisan.com on 20 Sep 2026 at the owner's
       request ("I want it to be that way, the transition seconds"). Their hero
       is a Divi fullwidth slider carrying the class et_slider_speed_4000, and
       filming the live page confirmed it: six consecutive gaps of 4003, 4001,
       4001, 4003, 4002, 4002ms. So the number is theirs, measured, not guessed.
       Worth knowing what it costs: at 4s a visitor gets about 2.4 seconds of
       stillness per slide once the 1.6s of entrance animation has finished. The
       shelf names below the hero remain the way to arrive at a shelf on purpose,
       and any click still stops the autoplay for good. */
    var SH_DELAY = 4000;
    var shTimer = null, shStopped = false;

    function shPaint() {
      if (!shTabs) return;
      [].forEach.call(shTabs.children, function (b, i) {
        b.classList.toggle("is-timing", !shStopped && shTimer !== null && i === shCur);
      });
    }
    function shStop() {                     // for good - a visitor took over
      shStopped = true;
      clearTimeout(shTimer); shTimer = null;
      if (shTabs) [].forEach.call(shTabs.children, function (b) { b.classList.remove("is-timing"); });
    }
    function shPause() { clearTimeout(shTimer); shTimer = null; shPaint(); }
    function shPhoneHold() {
      return window.SATVA_HERO_HOLD_PHONE && window.matchMedia("(max-width: 900px)").matches
        ? +window.SATVA_HERO_HOLD_PHONE : 0;
    }
    /* a finger on a phone fires pointerenter/leave too; with a phone hold set,
       a touch while scrolling must not pause and restart the countdown */
    function shHover(fn) {
      return function (e) { if (e && e.pointerType === "touch" && shPhoneHold()) return; fn(); };
    }
    function shPlay() {
      if (shStopped || reduce || shelves.length < 2) return;
      clearTimeout(shTimer);
      /* a slide may ask to be held longer with data-hold="ms" - ports/8002's
         "Why SATVA" slide steps through four cards of its own (13 Oct 2026) */
      /* 27 Oct 2026, ports/8002 owner: on phones every slide the same time
         (window.SATVA_HERO_HOLD_PHONE, ms), not 3s for some and 5s for others */
      var hold = shPhoneHold() || +shelves[shCur].dataset.hold || SH_DELAY;
      shTimer = setTimeout(function () { shGo(shCur + 1); shPlay(); }, hold);
      shPaint();
    }
    /* A slide that runs a sequence of its own can hand on to the next slide
       when it is done, paused or not (ports/8002 "Why SATVA", 13 Oct 2026) */
    window.SATVA_HERO_NEXT = function () { shGo(shCur + 1); shPlay(); };

    if (!reduce && shelves.length > 1) {
      shStage.addEventListener("pointerenter", shHover(shPause));
      shStage.addEventListener("pointerleave", shHover(function () { shPlay(); }));
      var shSection = shStage.closest(".shelves");
      if (shSection) {
        shSection.addEventListener("focusin", shPause);
        shSection.addEventListener("focusout", function () { shPlay(); });
        shSection.addEventListener("pointerenter", shHover(shPause));
        shSection.addEventListener("pointerleave", shHover(function () { shPlay(); }));
      }
      document.addEventListener("visibilitychange", function () {
        if (document.hidden) shPause(); else shPlay();
      });
      shPlay();
    }

    var shPrev = document.getElementById("shprev");
    var shNext = document.getElementById("shnext");
    if (shPrev) shPrev.addEventListener("click", function () { shStop(); shGo(shCur - 1); });
    if (shNext) shNext.addEventListener("click", function () { shStop(); shGo(shCur + 1); });

    // swipe, same threshold as the hero
    var sx0 = null;
    shStage.addEventListener("pointerdown", function (e) { sx0 = e.clientX; });
    shStage.addEventListener("pointerup", function (e) {
      if (sx0 === null) return;
      var dx = e.clientX - sx0; sx0 = null;
      if (Math.abs(dx) > 55) { shStop(); shGo(shCur + (dx < 0 ? 1 : -1)); }
    });
    shStage.addEventListener("pointercancel", function () { sx0 = null; });

    /* "See all spices" means it again: the pill filters the restored listing to
       its own shelf and scrolls there, which is what the words promise. */
    shStage.addEventListener("click", function (e) {
      var pill = e.target.closest ? e.target.closest(".pill[data-go]") : null;
      if (!pill) return;
      e.preventDefault();
      goToShelf(pill.dataset.go);
    });
  }

  /* 1d. EVERYDAY ESSENTIALS - REMOVED 5 Sep 2026.
     It was a curated row of 13 products, every one of which is also in the
     full range below, so the same spices were introduced twice on one page
     (and Cumin Seeds appeared twice inside the row itself, being in both the
     "Kitchen staples" and "Whole spices" lists). The way into the range is
     now SHOP BY CATEGORY above, which filters rather than repeats.
     If a curated row is ever wanted again, it must show something the range
     does not - a seasonal set, or the pack sizes the range omits. */

  /* ---------------------------------------------------------
     1e. HEADER: range dropdown + rotating announcement
     Both after curiospice.com. The dropdown is filled from
     GROUPS, in GROUPS order, so it can never list a shelf the
     category cards do not show; "Everything" is prepended from
     ALL rather than stored as a group, because the range is
     exactly four categories.
     --------------------------------------------------------- */
  var rangeMenu = document.getElementById("rangemenu");
  if (rangeMenu) {
    /* Back to what it was built for: every entry filters the listing and scrolls
       to it, "Everything" included. One filtering mechanism for the whole site. */
    var askAbout = function (g) {
      if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
      goToShelf(g.id);
    };

    [ALL].concat(GROUPS).forEach(function (g) {
      var count = PRODUCTS.filter(function (p) {
        return !g.cats || g.cats.indexOf(p.cat) > -1;
      }).length;
      if (!count) return;

      var li = document.createElement("li");
      var a  = document.createElement("a");
      a.href = "#range";
      a.innerHTML = (g.id === "all" ? "Everything" : g.label); /* 20 Oct 2026: count removed */
      if (g.id === "all") li.className = "all";
      a.addEventListener("click", function (e) {
        e.preventDefault();
        askAbout(g);
      });
      li.appendChild(a);
      rangeMenu.appendChild(li);
    });

    // Escape closes the menu wherever focus is inside it
    var hasmenu = rangeMenu.closest(".hasmenu");
    if (hasmenu) {
      /* The submenu opens on :hover OR :focus-within. Clicking "Our Range"
         leaves focus on that anchor, so :focus-within held the panel open
         even after the pointer had moved away - the owner's "once the user
         goes up with his cursor, then close that extension".
         Dropping focus on pointer-leave releases it. Guarded on the pointer
         type so a keyboard user, who never fires mouseleave, is untouched. */
      hasmenu.addEventListener("mouseleave", function () {
        var a = document.activeElement;
        if (a && hasmenu.contains(a) && typeof a.blur === "function") a.blur();
      });
      hasmenu.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && document.activeElement && document.activeElement.blur) {
          document.activeElement.blur();
        }
      });
    }
  }

  /* the announcement line. The count message is written here rather than in the
     HTML so it can never disagree with PRODUCTS. */
  var tick = document.getElementById("tickline");
  if (tick) {
    var countMsg = document.getElementById("tickcount");
    if (countMsg) {
      /* 20 Oct 2026, owner: no numbers - the "N daily kitchen staples" line stays hidden. */
      countMsg.remove();
    }

    var msgs = [].slice.call(tick.querySelectorAll(".tmsg"));
    if (msgs.length > 1 && !reduce) {
      var at = 0, hold = null;
      var turn = function () {
        msgs[at].classList.remove("is-on");
        at = (at + 1) % msgs.length;
        msgs[at].classList.add("is-on");
      };
      var run   = function () { hold = setInterval(turn, 4200); };
      var pause = function () { clearInterval(hold); };
      run();
      tick.addEventListener("mouseenter", pause);
      tick.addEventListener("mouseleave", run);
      document.addEventListener("visibilitychange", function () {
        if (document.hidden) pause(); else run();
      });
    }
  }

  /* ---------------------------------------------------------
     2. HERO SLIDER
     --------------------------------------------------------- */
  var hero   = document.querySelector(".hero");
  var slides = [].slice.call(document.querySelectorAll(".slide"));
  var dots   = document.getElementById("dots");
  var bar    = document.getElementById("bar");
  var nextup = document.getElementById("nextup");
  var nImg   = document.getElementById("nextupImg");
  var nTitle = document.getElementById("nextupTitle");
  var DUR = 1000, DELAY = 5600;
  var cur = 0, busy = false, timer = null;

  if (hero && slides.length) {
    slides.forEach(function (s, i) {
      var b = document.createElement("button");
      b.setAttribute("role", "tab");
      b.setAttribute("aria-label", "Slide " + (i + 1));
      b.setAttribute("aria-current", i === 0 ? "true" : "false");
      b.addEventListener("click", function () { go(i); });
      dots.appendChild(b);
    });

    function paintNextUp() {
      var n = slides[(cur + 1) % slides.length];
      nImg.src = n.getAttribute("data-thumb") || "";
      nTitle.textContent = n.getAttribute("data-title") || "";
    }

    function restartBar() {
      if (!bar || reduce) return;
      bar.style.transition = "none";
      bar.style.width = "0%";
      void bar.offsetWidth;
      bar.style.transition = "width " + DELAY + "ms linear";
      bar.style.width = "100%";
    }

    function schedule() {
      clearTimeout(timer);
      if (reduce) return;
      restartBar();
      timer = setTimeout(function () { go(cur + 1); }, DELAY);
    }

    function go(to) {
      var n = slides.length;
      to = ((to % n) + n) % n;
      if (to === cur || busy) return;
      var dir = to > cur ? 1 : -1;
      if (cur === 0 && to === n - 1) dir = -1;
      if (cur === n - 1 && to === 0) dir = 1;

      var out = slides[cur], inc = slides[to];
      busy = true;

      hero.classList.remove("anim");
      inc.style.transform = "translate3d(" + (dir > 0 ? 100 : -100) + "%,0,0)";
      inc.classList.add("is-active");
      out.classList.add("is-leaving");
      void inc.offsetWidth;

      hero.classList.add("anim");
      inc.style.transform = "translate3d(0,0,0)";
      out.style.transform = "translate3d(" + (dir > 0 ? -38 : 38) + "%,0,0)";

      dots.children[cur].setAttribute("aria-current", "false");
      dots.children[to].setAttribute("aria-current", "true");
      cur = to;
      paintNextUp();

      setTimeout(function () {
        out.classList.remove("is-active", "is-leaving");
        out.style.transform = "";
        inc.style.transform = "";
        busy = false;
      }, reduce ? 20 : DUR);

      schedule();
    }

    document.getElementById("prev").addEventListener("click", function () { go(cur - 1); });
    document.getElementById("next").addEventListener("click", function () { go(cur + 1); });
    nextup.addEventListener("click", function () { go(cur + 1); });

    hero.addEventListener("mouseenter", function () { clearTimeout(timer); if (bar) bar.style.transition = "none"; });
    hero.addEventListener("mouseleave", schedule);
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) clearTimeout(timer); else schedule();
    });

    // swipe
    var x0 = null;
    hero.addEventListener("pointerdown", function (e) { x0 = e.clientX; });
    hero.addEventListener("pointerup", function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 55) go(cur + (dx < 0 ? 1 : -1));
    });
    hero.addEventListener("pointercancel", function () { x0 = null; });

    // keyboard, only while the hero is on screen
    var heroVisible = true;
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) { heroVisible = es[0].isIntersecting; },
        { threshold: 0.25 }).observe(hero);
    }
    document.addEventListener("keydown", function (e) {
      if (!heroVisible) return;
      if (e.key === "ArrowRight") go(cur + 1);
      if (e.key === "ArrowLeft") go(cur - 1);
    });

    paintNextUp();
    schedule();
  }

  /* The floating WhatsApp button appears once the opening section has scrolled
     away - it would otherwise sit on top of that section's own controls.
     It used to live inside the hero block and observe .hero; when the shelf
     slider replaced the hero on 6 Sep 2026 that block stopped running, and the
     button would never have shown again. It now observes whichever section
     opens the page, so it survives the next reshuffle too. */
  (function () {
    var fab = document.querySelector(".wafab");
    if (!fab) return;
    var first = document.querySelector("main > section, body > section");
    if (!first || !("IntersectionObserver" in window)) { fab.classList.add("show"); return; }
    new IntersectionObserver(function (es) {
      fab.classList.toggle("show", !es[0].isIntersecting);
    }, { threshold: 0.12 }).observe(first);
  })();

  /* ---------------------------------------------------------
     2b. ORIGIN — where it comes from
     Modelled on the three place cards on onyxcoffeelab.com
     (PERU / ECUADOR / COLOMBIA): a name, one paragraph of
     terroir, one link, over full-bleed media.

     What is deliberately different: Onyx runs a looping video
     behind each card. The owner said "we'll not have a video as
     of now", so each card renders a tinted ground with line art
     and probes for media - drop `assets/origin-<id>.jpg` (or
     .mp4) in and that card switches over with no code edit.

     IMPORTANT: a region only appears here once the owner has
     confirmed it. `todo:true` renders the card visibly
     unfinished rather than inventing a sourcing story - see
     "Copy on this page is the owner's, or it does not ship" in
     the README. Only the grinding location is stated as fact,
     because it is the one already on the page.
     --------------------------------------------------------- */
  var LEAF = '<path d="M12 21c0-7 3-12 9-15-1 8-4 13-9 15Z"/><path d="M12 21C12 14 9 9 3 6c1 8 4 13 9 15Z"/><path d="M12 21v-6"/>';
  var HILL = '<path d="M2 18h20"/><path d="M2 18 9 7l4.5 7"/><path d="M11 18l4-6 7 6"/><circle cx="17.5" cy="5.5" r="2"/>';
  var MILL = '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="2.4"/><path d="M12 4v2.6M12 17.4V20M4 12h2.6M17.4 12H20"/>';

  var ORIGINS = [
    { id:"grind", place:"Chhatrapati Sambhajinagar", hi:"छत्रपती संभाजीनगर",
      icon:MILL, tint:"linear-gradient(150deg,#c9a24a,#7d5630)",
      tag:"Where it is ground",
      blurb:"Marathwada. Every pouch is ground in small batches and packed here — the address on the back of the packet is the address the spice was last touched at.",
      link:{ label:"What is on our pouch", href:"#freshness" } },

    { id:"region-1", place:"Region to be named", icon:HILL, todo:true,
      tint:"linear-gradient(150deg,#b7c48a,#6f8168)",
      tag:"To confirm",
      blurb:"The owner is collecting photographs and the growers’ own account from the farms this range is sourced from. Nothing is written here until that arrives." },

    { id:"region-2", place:"Region to be named", icon:LEAF, todo:true,
      tint:"linear-gradient(150deg,#e2c98f,#b08b3a)",
      tag:"To confirm",
      blurb:"The second sourcing region, on the same terms. A named place, one honest paragraph, and a photograph we actually own." }
  ];

  /* ---------------------------------------------------------
     2b. HOW IT IS MADE
     A coverflow carousel of flip cards, after "Meet Our Canneries"
     on eatfishwife.com. Front: the process, on video. Back: the
     shelf itself. Turning a card is the point of the block, so the
     centre card flips on click and the side cards step to centre.
     One card per shelf, four of them, in GROUPS order.

     The videos are muted, looping, playsinline and - the part that
     matters - ONLY the centre one plays. Several videos decoding at
     once on a laptop is a fan-spinner for no benefit, and autoplay
     with sound would be refused by every browser anyway.
     --------------------------------------------------------- */
  /* Copy kept SHORT on purpose (cut hard 9 Sep 2026). A card that turns itself
     after four seconds cannot carry a paragraph - nobody finishes it before the
     card moves. One line on the front, one on the back, both readable at a
     glance. The long version of any of this belongs in the range or the story. */
  /* ONE CARD PER SHELF - 17 Sep 2026, the owner: "IN these cards sliding, have
     only those categories". This was six cards named after products and
     processes (Chilli, Turmeric, Coriander, Seeds, Cold-Pressed Oils, Pink
     Salt), which made the block read as a second, competing list of the range.
     It is now the same four shelves as GROUPS, in the same order, so the whole
     site says the range once: Spices, Pulses, Seeds, Healthy Essentials.

     `film` is the footage's own name, kept separate from `id` (the shelf) on
     purpose: the film on the Spices card is turmeric being stone-ground, and
     naming the file for what it actually shows is what stops the next person
     assuming there is a "spices" clip. It resolves to assets/proc-<film>.mp4
     with assets/proc-<film>.jpg as the poster.

     `film:null` means no footage exists yet, and `still` is the photograph the
     card shows instead. Only Pulses is in that position. mPaint() already wraps
     play() in a catch, so a card with no film simply sits on its still. */
  var MAKING = [
    { id:"spices",     en:"Spices",             hi:"मसाले",
      film:"turmeric",                       // turmeric on the grinding stone
      step:"Stone-ground slowly, or left whole for the tadka.",
      back:"assets/cat-spices.webp",
      note:"Ground, whole and blended. Colour from the spice." },
    /* No pulses footage and no second pulses photograph exist yet, so this card
       shows one still on both faces and only its words change on the turn. It
       is the weakest of the four and the first to fix - see the shelf
       photographs table above. */
    { id:"pulses",     en:"Pulses",             hi:"डाळ",
      film:null, still:"assets/cat-pulses.webp",
      step:"Cleaned and graded. Never polished.",
      back:"assets/cat-pulses.webp",
      note:"Toor and chana, exactly as they grew." },
    { id:"seeds",      en:"Seeds",              hi:"बिया",
      film:"seeds",
      step:"Cleaned, and left whole. Never ground.",
      back:"assets/cat-seeds.webp",
      note:"Roast them the day you use them." },
    /* The oil press left with the oils on 20 Sep 2026. proc-salt.mp4 was the
       unused film in this set and is now the right one: rock salt is what this
       shelf actually leads with. */
    { id:"essentials", en:"Healthy Essentials", hi:"मीठ · गोडवा",
      film:"salt",
      step:"Rock salt crushed and graded. Sweetness dried, not refined.",
      back:"assets/cat-pantry.webp",
      note:"Pink salt, coconut sugar, monk fruit." }
  ];
  MAKING = MAKING.filter(function (m) { return HIDE.indexOf(m.id) < 0; });


  var mTrack = document.getElementById("mkrow");
  /* A page may ask for the per-product "How we make" without the rest of
     card.html's journey cards (window.SATVA_MAKE_PER_PRODUCT, e.g.
     ports/8002). It then also runs on from one shelf into the next, so
     every product's making slides past in turn. */
  var MKPROD = CARDMODE || !!window.SATVA_MAKE_PER_PRODUCT;
  var mTabs  = document.getElementById("mtabs");
  /* card.html rebuilds this section per PRODUCT rather than per shelf - see
     the block after this one. index.html, inline.html and a3.html keep the
     four-shelf coverflow exactly as it was. */
  if (mTrack && !MKPROD) {
    var mCards = [], mCur = 0;

    MAKING.forEach(function (m, i) {
      var card = document.createElement("article");
      card.className = "mcard";
      card.dataset.i = i;
      // the poster is the film's own still unless the shelf has no film yet
      var poster = m.still || ("assets/proc-" + m.film + ".webp");
      // no <source> at all when there is no footage, so nothing asks the server
      // for an mp4 that was never shot
      var source = m.film
        ? '<source src="assets/proc-' + m.film + '.mp4" type="video/mp4">'
        : "";
      card.innerHTML =
        '<div class="mflip">' +
          '<div class="mface mfront">' +
            '<video class="mvid" muted loop playsinline preload="none" ' +
                   'poster="' + poster + '" aria-hidden="true">' +
              source +
            "</video>" +
            '<span class="mtag">How it is made</span>' +
            '<div class="mcopy">' +
              "<h3>" + m.en + '<span class="dv">' + m.hi + "</span></h3>" +
              "<p>" + m.step + "</p>" +
            "</div>" +
            '<span class="mturn">Turn <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg></span>' +
          "</div>" +
          '<div class="mface mback">' +
            '<img src="' + m.back + '" alt="' + m.en + '" loading="lazy">' +
            '<div class="mcopy">' +
              "<h3>" + m.en + "</h3>" +
              "<p>" + m.note + "</p>" +
            "</div>" +
            '<span class="mturn">Back <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/></svg></span>' +
          "</div>" +
        "</div>";

      card.addEventListener("click", function () {
        if (i === mCur) {
          card.classList.toggle("is-flipped");   // centre card turns by hand
          mClear();                              // and the timers stand down
          if (!mHold && !reduce) {
            mT2 = setTimeout(function () { mGo(mCur + 1); }, M_BACK);
          }
        } else {
          mGo(i);                                // a side card steps in
        }
      });
      mTrack.appendChild(card);
      mCards.push(card);
    });

    /* The coverflow's far positions are handled in CSS, and how many "far"
       positions exist depends on how many cards there are - so the count goes
       onto the track for CSS to read. With an even number the card opposite the
       centre one cannot sit on both sides at once, and at four it would hang
       alone on the right; the stylesheet hides it at that count so the row stays
       symmetrical. See the note on [data-count="4"] in satva.css. */
    mTrack.dataset.count = String(mCards.length);

    function mPaint() {
      var n = mCards.length;
      mCards.forEach(function (c, i) {
        // shortest way round, so the row wraps instead of unspooling
        var d = i - mCur;
        if (d >  n / 2) d -= n;
        if (d < -n / 2) d += n;
        var abs = Math.abs(d);
        c.style.setProperty("--d", d);
        c.style.setProperty("--abs", abs);
        c.style.zIndex = String(20 - abs);
        c.classList.toggle("is-on", d === 0);
        c.setAttribute("aria-hidden", d === 0 ? "false" : "true");
        if (d !== 0) c.classList.remove("is-flipped");         // a card that leaves turns back
        var v = c.querySelector(".mvid");
        if (!v) return;
        if (d === 0 && !reduce) { v.play().catch(function () {}); }
        else { v.pause(); }
      });
      if (mTabs) [].forEach.call(mTabs.children, function (b, i) {
        b.setAttribute("aria-selected", i === mCur ? "true" : "false");
      });
    }

    function mGo(to) {
      var n = mCards.length;
      mCur = ((to % n) + n) % n;
      mPaint();
      mCycle();                       // a new card starts its four seconds
    }

    if (mTabs) {
      MAKING.forEach(function (m, i) {
        var b = document.createElement("button");
        b.className = "etab"; b.type = "button";
        b.setAttribute("role", "tab");
        b.setAttribute("aria-selected", i === 0 ? "true" : "false");
        b.textContent = m.en;
        b.addEventListener("click", function () { mGo(i); });
        mTabs.appendChild(b);
      });
    }
    /* ---- the cycle the owner asked for -----------------------------------
       Four seconds on the front, the card turns itself, three seconds on the
       back, then the next card - which arrives on ITS front, so the rhythm
       repeats rather than drifting.

       Two timers rather than one interval, because the two halves are different
       lengths and an interval cannot express that. Both are cleared on every
       state change, so a visitor who clicks never ends up with a stale timer
       turning a card under them.

       It pauses on hover and on keyboard focus, and while the tab is hidden.
       Unlike the hero it RESUMES afterwards instead of stopping for good: here
       the turning is the content, not decoration, so stopping it permanently
       would empty the block out. Manual navigation just restarts the cycle.
       prefers-reduced-motion never starts it. */
    var M_FRONT = 4000, M_BACK = 2000;   // 4s on the front, 2s on the back
    var mT1 = null, mT2 = null, mHold = false;

    function mClear() { clearTimeout(mT1); clearTimeout(mT2); mT1 = mT2 = null; }

    function mCycle() {
      mClear();
      if (mHold || reduce || mCards.length < 2) return;
      mT1 = setTimeout(function () {
        var c = mCards[mCur];
        if (c) c.classList.add("is-flipped");        // turn it over
        mT2 = setTimeout(function () { mGo(mCur + 1); }, M_BACK);
      }, M_FRONT);
    }

    function mPause() { mHold = true;  mClear(); }
    function mResume() { mHold = false; mCycle(); }

    if (!reduce) {
      var mSec = mTrack.closest(".made");
      if (mSec) {
        mSec.addEventListener("pointerenter", mPause);
        mSec.addEventListener("pointerleave", mResume);
        mSec.addEventListener("focusin", mPause);
        mSec.addEventListener("focusout", mResume);
      }
      document.addEventListener("visibilitychange", function () {
        if (document.hidden) mPause(); else mResume();
      });
    }

    var mp = document.getElementById("mprev"), mn = document.getElementById("mnext");
    if (mp) mp.addEventListener("click", function () { mGo(mCur - 1); });
    if (mn) mn.addEventListener("click", function () { mGo(mCur + 1); });

    // swipe, same threshold as the hero
    var mx0 = null;
    mTrack.addEventListener("pointerdown", function (e) { mx0 = e.clientX; });
    mTrack.addEventListener("pointerup", function (e) {
      if (mx0 === null) return;
      var dx = e.clientX - mx0; mx0 = null;
      if (Math.abs(dx) > 55) mGo(mCur + (dx < 0 ? 1 : -1));
    });

    mPaint();
    mCycle();
  }


  /* ---------------------------------------------------------
     "HOW WE MAKE", PER PRODUCT (card.html only)    21 Sep 2026
     ---------------------------------------------------------
     The four-shelf version said "Spices: stone-ground slowly, or
     left whole for the tadka" and stopped there. The owner asked
     for the shelf to open up: "put all the spices in the spices
     tab". So the tabs now choose a SHELF and the coverflow carries
     that shelf's PRODUCTS - twelve cards under Spices, two under
     Pulses, four under Seeds, three under Healthy Essentials.

     Every product carries its own `make` line, written from what
     actually happens to it. Where genuine footage of that product
     exists it plays (`mfilm`); where it does not, the card shows
     the product's own photograph rather than borrowing a film of
     something else and implying it is ours.

     TURMERIC IS THE EXCEPTION and the reason this page exists: its
     front face is not one still but the six-stage journey, cycling,
     the same treatment the range card uses.
     --------------------------------------------------------- */
  if (mTrack && MKPROD) {
    var mkCards = [], mkCur = 0, mkShelf = GROUPS[0].id, mkFilms = [];
    var MK_FRONT = 4600, MK_BACK = 2200;
    var mkT1 = null, mkT2 = null, mkHold = false, mkRecipeOpen = false;
    var mkNote = document.querySelector(".mnote");

    function mkFace(p) {
      /* Turmeric's front is the journey, not a still. */
      if (JOURNEYS[p.en]) {
        var j = JOURNEYS[p.en];
        return '<div class="mkjrn">' +
          j.stages.map(function (st, n) {
            var media = st.video
              ? '<video muted loop playsinline preload="none" poster="' + st.shot + '">' +
                  '<source src="' + st.video + '" type="video/mp4"></video>'
              : '<img src="' + st.shot + '" alt="" loading="lazy">';
            return '<figure class="mkjs"' + (n === 0 ? ' data-on="1"' : "") + ">" + media +
                     '<figcaption>' + /* 20 Oct 2026: step number removed */
                       "<span>" + st.when + "</span>" + st.title +
                     "</figcaption></figure>";
          }).join("") +
          '<div class="mkjrn-rail">' +
            j.stages.map(function () { return "<i></i>"; }).join("") +
          "</div></div>";
      }
      if (p.mfilm) {
        return '<video class="mvid" muted loop playsinline preload="none" ' +
                 'poster="assets/proc-' + p.mfilm + '.jpg" aria-hidden="true">' +
                 '<source src="assets/proc-' + p.mfilm + '.mp4" type="video/mp4"></video>';
      }
      /* No film for this one. Its own photograph if it has one, else the
         shelf's - never another product's film. */
      var still = (p.img && p.photo) ? p.img : ("assets/cat-" + p.cat + ".webp");
      return '<img class="mstill" src="' + still + '" alt="" loading="lazy">';
    }

    function mkBuild(shelf) {
      mkStop();
      mkShelf = shelf;
      mTrack.innerHTML = "";
      mkCards = []; mkFilms = [];
      var list = PRODUCTS.filter(function (p) { return p.cat === shelf; });

      list.forEach(function (p, i) {
        var card = document.createElement("article");
        card.className = "mcard";
        if (JOURNEYS[p.en]) card.classList.add("has-jrn");
        card.dataset.i = i;
        card.style.setProperty("--acc", p.acc);
        card.innerHTML =
          '<div class="mflip">' +
            '<div class="mface mfront">' +
              mkFace(p) +
              '<span class="mtag">How it is made</span>' +
              '<div class="mcopy">' +
                "<h3>" + p.en + '<span class="dv">' + p.hi + "</span></h3>" +
                "<p>" + p.make + "</p>" +
              "</div>" +
              '<span class="mturn">Turn <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 4v5h5"/></svg></span>' +
            "</div>" +
            '<div class="mface mback">' +
              /* the ingredient itself (STILL_SHOT), never the shelf picture -
                 owner, 8 Oct 2026: coriander, cumin and mustard all turned
                 over to turmeric powder */
              '<img src="' + (STILL_SHOT[p.en] || ((p.img && p.photo) ? p.img : "assets/cat-" + p.cat + ".webp")) + '" alt="' + p.en + '" loading="lazy">' +
              '<div class="mcopy">' +
                "<h3>" + p.en + "</h3>" +
                "<p>" + p.d + "</p>" +
                (RECIPE_FOR[p.en]
                  ? '<button type="button" class="mrecipe">Recipe <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>'
                  : "") +
              "</div>" +
              '<span class="mturn">Back <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 4v5h-5"/></svg></span>' +
            "</div>" +
          "</div>";

        var rb = card.querySelector(".mrecipe");
        if (rb) rb.addEventListener("click", function (e) {
          e.stopPropagation();                    // the card must not turn
          mkRecipeOpen = true; mkClear();         // nor the carousel move under the sheet
          openRecipe(p, function () { mkRecipeOpen = false; mkCycle(); });
        });

        card.addEventListener("click", function () {
          if (i === mkCur) {
            card.classList.toggle("is-flipped");
            mkClear();
            if (!mkHold && !reduce) mkT2 = setTimeout(mkNext, MK_BACK);
          } else mkGo(i);
        });
        mTrack.appendChild(card);
        mkCards.push(card);
      });

      mTrack.dataset.count = String(mkCards.length);
      mkCur = 0;
      mkWindJourneys();
      mkPaint();
      mkCycle();
      if (mkNote) {
        var filmed = list.filter(function (p) { return p.mfilm || JOURNEYS[p.en]; }).length;
        var rest = list.length - filmed;
        /* "film" was the wrong word once journeys arrived: most of these are
           photographs of the process, not footage of it. The count is the
           union of the two, so the sentence has to cover both. */
        /* 20 Oct 2026, owner: no numbers - same sentence, without the counts. */
        mkNote.textContent = filmed === 0
            ? "None have their process documented yet - each card shows the product itself until we shoot our own."
            : (rest ? "Some show how they are made, step by step; the rest show the product itself until we shoot our own."
                    : "Each shows how it is made, step by step.");
      }
    }

    /* Turmeric's six stages run on their own clock inside the card. It is
       deliberately SLOWER than the card.html range tile: this card also
       flips every 4.6s, and two fast rhythms on one object reads as a
       fault rather than a sequence. */
    function mkWindJourneys() {
      mkFilms.forEach(function (f) { clearInterval(f.t); });
      mkFilms = [];
      [].forEach.call(mTrack.querySelectorAll(".mkjrn"), function (film, nth) {
        var slides = [].slice.call(film.querySelectorAll(".mkjs"));
        var bars = [].slice.call(film.querySelectorAll(".mkjrn-rail i"));
        if (slides.length < 2) return;
        var f = { i: 0, t: 0 };
        f.go = function (n) {
          f.i = (n + slides.length) % slides.length;
          slides.forEach(function (sl, k) {
            if (k === f.i) sl.setAttribute("data-on", "1"); else sl.removeAttribute("data-on");
            var v = sl.querySelector("video");
            if (v) { if (k === f.i) { var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); } else v.pause(); }
          });
          bars.forEach(function (b, k) { b.classList.toggle("on", k === f.i); });
        };
        f.go(nth % slides.length);   /* same anti-lockstep offset as the grid */
        if (!reduce) f.t = setInterval(function () { f.go(f.i + 1); }, 2600);
        f.n = slides.length;
        film.__mk = f;
        mkFilms.push(f);
      });
    }

    function mkPaint() {
      var n = mkCards.length;
      mkCards.forEach(function (c, i) {
        var d = i - mkCur;
        if (d >  n / 2) d -= n;
        if (d < -n / 2) d += n;
        var abs = Math.abs(d);
        c.style.setProperty("--d", d);
        c.style.setProperty("--abs", abs);
        c.style.zIndex = String(20 - abs);
        c.classList.toggle("is-on", d === 0);
        c.setAttribute("aria-hidden", d === 0 ? "false" : "true");
        if (d !== 0) c.classList.remove("is-flipped");
        /* Only the centre card's media runs - with twelve cards under
           Spices this is the difference between one decode and twelve. */
        [].forEach.call(c.querySelectorAll("video"), function (v) {
          if (d === 0 && !reduce && !v.closest(".mkjs:not([data-on])")) {
            var pr = v.play(); if (pr && pr.catch) pr.catch(function () {});
          } else v.pause();
        });
      });
    }

    function mkGo(to) {
      var n = mkCards.length;
      if (!n) return;
      mkCur = ((to % n) + n) % n;
      mkPaint();
      mkCycle();
    }

    function mkClear() { clearTimeout(mkT1); clearTimeout(mkT2); mkT1 = mkT2 = null; }
    function mkStop() { mkClear(); mkFilms.forEach(function (f) { clearInterval(f.t); }); mkFilms = []; }
    function mkCycle() {
      mkClear();
      if (mkHold || mkRecipeOpen || reduce || mkCards.length < 2) return;
      /* On a page that asked for every shelf (SATVA_MAKE_PER_PRODUCT) a card
         is PLAYED before it turns: a product whose front is a step-by-step
         journey starts from step one and shows every step, and only then
         turns over. Elsewhere the front holds for MK_FRONT, as before. */
      var front = MK_FRONT, cc = mkCards[mkCur];
      var film = window.SATVA_MAKE_PER_PRODUCT && cc && cc.querySelector(".mkjrn");
      if (film && film.__mk) {
        var f = film.__mk;
        clearInterval(f.t);
        f.go(0);
        f.t = setInterval(function () { f.go(f.i + 1); }, 2600);
        front = Math.max(MK_FRONT, f.n * 2600);
      }
      mkT1 = setTimeout(function () {
        var c = mkCards[mkCur];
        if (c) c.classList.add("is-flipped");
        mkT2 = setTimeout(mkNext, MK_BACK);
      }, front);
    }

    /* The next card - or, on a page that asked for every shelf to run
       on, the first card of the next shelf once this one is done. */
    function mkNext() {
      if (window.SATVA_MAKE_PER_PRODUCT && mkCur === mkCards.length - 1) {
        var gi = 0;
        GROUPS.forEach(function (g, i) { if (g.id === mkShelf) gi = i; });
        mkShelfGo((gi + 1) % GROUPS.length);
      } else mkGo(mkCur + 1);
    }
    function mkShelfGo(gi) {
      if (mTabs) [].forEach.call(mTabs.children, function (x, i) {
        x.setAttribute("aria-selected", i === gi ? "true" : "false");
      });
      mkBuild(GROUPS[gi].id);
    }

    /* The tabs now choose a shelf, not a card. */
    if (mTabs) {
      mTabs.innerHTML = "";
      GROUPS.forEach(function (g, i) {
        var b = document.createElement("button");
        b.className = "etab"; b.type = "button";
        b.setAttribute("role", "tab");
        b.setAttribute("aria-selected", i === 0 ? "true" : "false");
        b.innerHTML = g.label; /* 20 Oct 2026: count removed */
        b.addEventListener("click", function () { mkShelfGo(i); });
        mTabs.appendChild(b);
      });
    }

    if (!reduce && window.SATVA_MAKE_PER_PRODUCT) {
      /* Here it runs on by itself, card after card (owner, 8 Oct 2026: "once
         each card is played, I want the next card to come automatically") -
         so no pause under the pointer, which read as the slider having
         stopped. It waits only while it is off screen or the tab is hidden. */
      var mkVis = true;
      var mkRun = function () {
        var hold = !mkVis || document.hidden;
        if (hold === mkHold) return;
        mkHold = hold;
        if (hold) mkClear(); else mkCycle();
      };
      if ("IntersectionObserver" in window) {
        new IntersectionObserver(function (es) { mkVis = es[0].isIntersecting; mkRun(); },
          { threshold: 0.3 }).observe(mTrack);
      }
      document.addEventListener("visibilitychange", mkRun);
    } else if (!reduce) {
      var mkSec = mTrack.closest(".made");
      if (mkSec) {
        mkSec.addEventListener("pointerenter", function () { mkHold = true; mkClear(); });
        mkSec.addEventListener("pointerleave", function () { mkHold = false; mkCycle(); });
        mkSec.addEventListener("focusin", function () { mkHold = true; mkClear(); });
        mkSec.addEventListener("focusout", function () { mkHold = false; mkCycle(); });
      }
      document.addEventListener("visibilitychange", function () {
        if (document.hidden) { mkHold = true; mkClear(); } else { mkHold = false; mkCycle(); }
      });
    }

    var mkP = document.getElementById("mprev"), mkN = document.getElementById("mnext");
    if (mkP) mkP.addEventListener("click", function () { mkGo(mkCur - 1); });
    if (mkN) mkN.addEventListener("click", function () { mkGo(mkCur + 1); });

    var mkx0 = null;
    mTrack.addEventListener("pointerdown", function (e) { mkx0 = e.clientX; });
    mTrack.addEventListener("pointerup", function (e) {
      if (mkx0 === null) return;
      var dx = e.clientX - mkx0; mkx0 = null;
      if (Math.abs(dx) > 55) mkGo(mkCur + (dx < 0 ? 1 : -1));
    });

    mkBuild(GROUPS[0].id);
  }

  /* ---------------------------------------------------------
     2c. RECIPES
     After the recipe row on dandelionchocolate.com. The one
     thing taken from it is the cook time sitting on the card
     ("Just Chocolate Cake · 2½ Hours") - it is what turns a
     photograph into something a cook can decide about.

     Not taken: their MORE RECIPES link, because there is no
     recipe library to link to yet. Each card names the SATVA
     product it uses instead, which is the point of the block.

     These are ordinary household recipes in our own voice, not
     claims about the business. `uses` must match a name in
     PRODUCTS or the accent falls back to gold.
     --------------------------------------------------------- */
  var POT  = '<path d="M4 9h16v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V9Z"/><path d="M2 9h20"/><path d="M20 11h2v3h-2M4 11H2v3h2"/><path d="M9 6c0-1.5 1.3-2 1.3-3.5M14 6c0-1.5 1.3-2 1.3-3.5"/>';
  var RICE = '<path d="M2.5 19.5h19"/><path d="M4.5 19.5c0-4.8 3.4-8.2 7.5-8.2s7.5 3.4 7.5 8.2"/><path d="M8.8 15.6c1.1-.9 2-1.3 3.2-1.3s2.1.4 3.2 1.3"/><path d="M12 11V7.4"/><path d="M10.2 8.6 12 6.2l1.8 2.4"/>';
  var PAN  = '<circle cx="10" cy="12" r="7.2"/><path d="M17.4 12H22"/><circle cx="10" cy="12" r="3.2"/>';

  /* Two groups, because the range is no longer masala alone:
     what the blends are for, and what the seeds and grains are for.
     `id` keys the photo (assets/recipe-<id>.jpg) - keyed on the recipe
     and NOT on `uses`, so two recipes may share a product.
     `uses` must still match an `en` name in PRODUCTS or the accent
     falls back to gold. A card with no photo file keeps its tile. */
  var RECIPES = [
    /* ---- with the masalas ---- */
    { id:"varan-bhaat", group:"masala", name:"Everyday Varan Bhaat", hi:"वरण भात", time:"40 min",
      icon:POT, tint:"linear-gradient(150deg,#f7e2ad,#deac3f)",
      desc:"Toor dal, turmeric, a spoon of ghee and a tadka of cumin and mustard. The plainest thing in the kitchen, and the fastest way to tell whether your turmeric is real.",
      uses:"Turmeric" },

    { id:"biryani", group:"masala", name:"Sunday Biryani", hi:"बिर्याणी", time:"1 hr 30 min",
      icon:RICE, tint:"linear-gradient(150deg,#d8c69a,#8a6210)",
      desc:"Whole spices bloomed in ghee first, the blend layered in with the rice, then sealed and left alone. The long one — worth starting before lunch.",
      uses:"Biryani Masala" },

    { id:"rassa", group:"masala", name:"Aitwarcha Rassa", hi:"आयतवारचा रस्सा", time:"1 hr 15 min",
      icon:POT, tint:"linear-gradient(150deg,#c98a63,#8c3a1c)",
      desc:"Onion and dry coconut browned properly before anything else goes in — that browning is the whole gravy. Mutton on the bone, and the thinnest rassa you can still call thick.",
      uses:"Garam Masala" },

    { id:"chole", group:"masala", name:"Chole", hi:"छोले", time:"45 min",
      icon:POT, tint:"linear-gradient(150deg,#e3c98d,#a4761f)",
      desc:"Chana soaked overnight, cooked soft, then garam masala stirred in at the end rather than the start so it stays fragrant instead of turning bitter.",
      uses:"Garam Masala" },

    { id:"bhel", group:"masala", name:"Bhel", hi:"भेळ", time:"10 min",
      icon:PAN, tint:"linear-gradient(150deg,#f0d7a8,#c98b2c)",
      desc:"Mix it at the table, eat it in five minutes, and never before — bhel waits for nobody. Chaat masala goes on last, over everything.",
      uses:"Chaat Masala" },

    { id:"shengdana", group:"masala", name:"Masala Shengdana", hi:"मसाला शेंगदाणे", time:"15 min",
      icon:PAN, tint:"linear-gradient(150deg,#e9c98f,#b06a22)",
      desc:"Peanuts roasted dry, tossed hot with chatpat / kanda lasun masala and a squeeze of lime. The thing that disappears off the counter before dinner is served.",
      uses:"Chatpat / Kanda Lasun Masala" },

    { id:"misal", group:"masala", name:"Misal", hi:"मिसळ", time:"1 hr",
      icon:POT, tint:"linear-gradient(150deg,#e0a07f,#a32d10)",
      desc:"The kat is where the chilli has to be honest — colour without a burnt edge. Sprouted matki under it, farsan on top, pav on the side.",
      uses:"Chilli Powder" },

    { id:"bharli-vangi", group:"masala", name:"Bharli Vangi", hi:"भरली वांगी", time:"40 min",
      icon:PAN, tint:"linear-gradient(150deg,#c9a9c4,#6b3f66)",
      desc:"Small brinjals slit and stuffed with coriander, groundnut and coconut, then left to cook slowly until the skins give. Dhane powder does most of the work.",
      uses:"Coriander Powder" },

    { id:"sambar", group:"masala", name:"Sambar", hi:"सांबार", time:"40 min",
      icon:POT, tint:"linear-gradient(150deg,#e8a06a,#b8551f)",
      desc:"Toor cooked soft, vegetables in late so they keep their shape, and the masala stirred in off the boil. The tamarind goes in before the masala, never after.",
      uses:"Sambar Masala" },

    /* ---- with the seeds and grains ---- */
    { id:"jeera-bhaat", group:"seed", name:"Jeera Bhaat", hi:"जिरा भात", time:"20 min",
      icon:RICE, tint:"linear-gradient(150deg,#efe0bd,#c19a4e)",
      desc:"Cumin in hot ghee until it darkens a shade and smells like a kitchen — no further. Rice on top, lid on, no stirring. What you make when the curry is doing the talking.",
      uses:"Cumin Seeds" },

    { id:"fodni-poha", group:"seed", name:"Fodnicha Poha", hi:"फोडणीचे पोहे", time:"20 min",
      icon:PAN, tint:"linear-gradient(150deg,#f6e7a8,#d8a72b)",
      desc:"Wait for the mustard to actually pop before the onion goes in; everything after that is timing. Peanuts for the crunch, lime at the end, coconut if you have it.",
      uses:"Mustard Seeds" },

    { id:"methi-dal", group:"seed", name:"Methi Dal Tadka", hi:"मेथी डाळ", time:"35 min",
      icon:POT, tint:"linear-gradient(150deg,#f4dda1,#c68f1e)",
      desc:"Four or five methi seeds in the tadka — no more. They turn the dal faintly bitter in the way that makes you want the next spoon, and too many ruin it outright.",
      uses:"Methi Seeds" },

    { id:"javas-chutney", group:"seed", name:"Javas Chutney", hi:"जवस चटणी", time:"15 min",
      icon:PAN, tint:"linear-gradient(150deg,#dcc39a,#8e6435)",
      desc:"Flax roasted till it crackles, cooled completely, then ground coarse with garlic, chilli and salt. Keeps a fortnight in a steel dabba. Bhakri, bhaat, or a spoon straight off the plate.",
      uses:"Flax Seeds" },

    { id:"chia", group:"seed", name:"Overnight Chia", hi:"चिया", time:"5 min + a night",
      icon:POT, tint:"linear-gradient(150deg,#e4e6ef,#9aa3bd)",
      desc:"Three spoons of chia to a cup of milk, sweetened however you take it, left in the fridge overnight. Fruit in the morning. Nothing is cooked and nothing can go wrong.",
      uses:"Chia Seeds" },

    /* ---- for the "How it's made" Recipe button (RECIPE_FOR), 8 Oct 2026 ---- */
    { id:"haldi-doodh", group:"masala", name:"Haldi Doodh", hi:"हळदीचे दूध", time:"10 min",
      icon:POT, tint:"linear-gradient(150deg,#f7e2ad,#deac3f)",
      desc:"Warm milk, a spoon of turmeric, a pinch of pepper and a little ginger, simmered gently and never boiled hard. What gets made when someone in the house has a cold.",
      uses:"Turmeric" },

    { id:"dhane-aloo", group:"seed", name:"Dhaniya Aloo", hi:"धने आलू", time:"25 min",
      icon:PAN, tint:"linear-gradient(150deg,#e3e6c0,#8a9a52)",
      desc:"Coriander seeds roasted and crushed coarse by hand, not ground — the bits of husk are the point. Tossed with boiled potatoes until the edges catch.",
      uses:"Coriander Seeds" },

    { id:"miri-rasam", group:"seed", name:"Miri Rasam", hi:"मिरी रसम", time:"25 min",
      icon:POT, tint:"linear-gradient(150deg,#cfc8bf,#6b6259)",
      desc:"Pepper, cumin and garlic pounded together and dropped into hot tamarind water. Take it off the moment it froths — boiled pepper turns harsh.",
      uses:"Black Pepper" },

    /* ---- for the rotating "Cook something for someone" row on :8002
       (js/recipes-rotate-8002.js), 8 Oct 2026 - the owner: clicking a
       picture must show its recipe ---- */
    { id:"paneer-tikka", group:"masala", name:"Paneer Tikka", hi:"पनीर टिक्का", time:"40 min + 2 hr resting",
      icon:PAN, tint:"linear-gradient(150deg,#f0b97a,#b5561d)",
      desc:"Paneer, onion and capsicum in a thick curd marinade coloured with chilli, then charred hot and fast. The chilli is there for colour as much as heat, so be generous with it.",
      uses:"Chilli Powder" },

    { id:"butter-chicken", group:"masala", name:"Butter Chicken", hi:"बटर चिकन", time:"1 hr + 1 hr resting",
      icon:POT, tint:"linear-gradient(150deg,#f3b585,#b44a1f)",
      desc:"Chicken charred first, then simmered in a tomato and cashew gravy finished with butter, kasuri methi and a little cream. Garam masala at the start and again at the end.",
      uses:"Garam Masala" },

    { id:"pav-bhaji", group:"masala", name:"Pav Bhaji", hi:"पाव भाजी", time:"45 min",
      icon:PAN, tint:"linear-gradient(150deg,#f2a86b,#b9461c)",
      desc:"Vegetables boiled, then mashed down on the pan with butter, tomato and chilli until they are one thick bhaji. Butter-toasted pav, raw onion and lemon on the side.",
      uses:"Chilli Powder" },

    { id:"pepper-mutton", group:"masala", name:"Pepper Mutton Fry", hi:"मिरी मटण", time:"1 hr 15 min",
      icon:PAN, tint:"linear-gradient(150deg,#b7a48f,#4f3b2c)",
      desc:"Mutton cooked tender, then fried dry with onions and curry leaves. A heap of freshly crushed black pepper goes in at the very end, so it stays sharp.",
      uses:"Black Pepper" },

    { id:"chicken-curry", group:"masala", name:"Chicken Curry", hi:"चिकन करी", time:"50 min",
      icon:POT, tint:"linear-gradient(150deg,#e8a35f,#9c4a17)",
      desc:"A home chicken curry, built on onions browned slowly and plenty of coriander powder, which thickens the gravy as much as it flavours it.",
      uses:"Coriander Powder" },

    { id:"chana-dal", group:"seed", name:"Chana Dal Fry", hi:"चणा डाळ", time:"45 min",
      icon:POT, tint:"linear-gradient(150deg,#f3e2a6,#cbab3c)",
      desc:"Cooked soft but still holding its shape, then a second tadka of ghee and red chilli poured over at the table.",
      uses:"Chana Dal" },

    { id:"nimbu-pani", group:"seed", name:"Nimbu Pani", hi:"निंबू पाणी", time:"5 min",
      icon:POT, tint:"linear-gradient(150deg,#f6e3e3,#d98a8a)",
      desc:"Lemon, cold water, a little sugar and just enough pink salt that you notice it. Roasted cumin if you want it to taste like a summer afternoon.",
      uses:"Himalayan Pink Salt" },

    { id:"kheer", group:"seed", name:"Kheer", hi:"खीर", time:"45 min",
      icon:POT, tint:"linear-gradient(150deg,#ecd8bf,#b07a42)",
      desc:"Rice cooked slowly in milk until the milk gives up a third of itself. Coconut sugar goes in off the heat and turns it the colour of caramel.",
      uses:"Coconut Sugar" },

    { id:"shrikhand", group:"seed", name:"Shrikhand", hi:"श्रीखंड", time:"15 min + a night",
      icon:POT, tint:"linear-gradient(150deg,#e7efdf,#7fa06a)",
      desc:"Yogurt hung overnight until it is thick enough to hold a spoon, then sweetened with monk fruit, saffron and cardamom. No sugar in it at all.",
      uses:"Monk Fruit Sweetener" }
  ];

  var RGROUPS = [
    { id:"masala", label:"With our masalas" },
    { id:"seed",   label:"With our seeds & grains" }
  ];

  /* ---------------------------------------------------------
     THE RECIPE SHEET - the "How it's made" cards' Recipe button
     (owner, 8 Oct 2026: "the same stunning image and the list of
     ingredients with measurements and the way to make it").
     RECIPES above holds each dish's name, time and line; this
     holds what goes in and how. Ordinary household quantities,
     cups and spoons as an Indian kitchen measures them. An item
     beginning "Satva " is one of ours and is marked on the sheet.
     --------------------------------------------------------- */
  var RECIPE_BOOK = {
    "haldi-doodh": { serves:"2",
      ing:[["2 cups","full-fat milk"],["1 tsp","Satva Turmeric"],["a pinch","Satva Black Pepper, freshly crushed"],
           ["½ inch","ginger, grated"],["1 small stick","cinnamon"],["2 tsp","jaggery or honey"],["½ tsp","ghee"]],
      steps:["Put the milk, turmeric, pepper, ginger and cinnamon in a small pan and whisk so the turmeric does not clump.",
             "Bring it up to a gentle simmer and keep it there for 5 minutes, whisking now and then. Do not let it boil hard.",
             "Strain into two cups and stir in the ghee.",
             "Sweeten once it is warm rather than hot - honey especially should never go into boiling milk."] },

    "misal": { serves:"4",
      ing:[["2 cups","sprouted matki (moth beans)"],["2","onions - 1 sliced, 1 finely chopped"],["¼ cup","dry coconut, grated"],
           ["6 cloves","garlic"],["1 inch","ginger"],["4 tbsp","oil"],["2 tsp","Satva Chilli Powder"],["½ tsp","Satva Turmeric"],
           ["1 tsp","Satva Garam Masala"],["1 tsp","tamarind paste"],["to taste","salt"],["2 cups","farsan or mixed namkeen"],
           ["¼ cup","coriander leaves, chopped"],["1","lemon, in wedges"],["8","pav"]],
      steps:["Dry-roast the sliced onion in a pan until deep brown, then add the coconut and roast until it browns too - about 12 minutes in all. Grind with the garlic, ginger and a little water to a smooth paste.",
             "Pressure-cook the matki with ¼ tsp turmeric, salt and 2 cups water for 2 whistles. It should be cooked but still whole.",
             "For the kat, heat the oil, add the paste and fry for 5 minutes until the oil separates. Lower the heat, add the chilli powder and the rest of the turmeric and stir for 20 seconds - colour without a burnt edge.",
             "Add the garam masala, tamarind, 4 cups water and salt. Simmer 15 minutes until a red layer of oil (the tarri) floats on top.",
             "To serve: matki in a bowl, kat poured over, then farsan, chopped onion and coriander. Lemon and pav on the side."] },

    "bharli-vangi": { serves:"4",
      ing:[["8","small round brinjals (about 400 g)"],["⅓ cup","roasted peanuts"],["⅓ cup","dry coconut, grated"],
           ["1 tbsp","sesame seeds"],["2 tsp","Satva Coriander Powder"],["1 tsp","Satva Chilli Powder"],["¼ tsp","Satva Turmeric"],
           ["½ tsp","Satva Garam Masala"],["1 tsp","jaggery"],["1 tsp","tamarind paste"],["1 tsp","salt"],
           ["2 tbsp","coriander leaves, chopped"],["3 tbsp","oil"],["½ tsp","Satva Mustard Seeds"],["½ cup","water"]],
      steps:["Dry-roast the coconut and sesame for 2 minutes, then grind coarse with the peanuts.",
             "Mix in the coriander powder, chilli, turmeric, garam masala, jaggery, tamarind, salt, coriander leaves and 1 tbsp of the oil. This is the stuffing.",
             "Slit each brinjal in a cross from the bottom, stopping short of the stem so it holds together. Keep them in salted water until you are ready.",
             "Press the stuffing into each brinjal. Keep whatever is left over.",
             "Heat the rest of the oil, let the mustard seeds pop, then lay the brinjals in. Add the leftover stuffing and the water.",
             "Cover and cook on low for 20-25 minutes, turning gently now and then, until the skins give. Serve with bhakri or chapati."] },

    "dhane-aloo": { serves:"4",
      ing:[["4 medium","potatoes (about 500 g), boiled and cubed"],["1½ tbsp","Satva Coriander Seeds"],["½ tsp","Satva Cumin Seeds"],
           ["2","green chillies, slit"],["1 tsp","ginger, grated"],["2 tbsp","oil"],["¼ tsp","Satva Turmeric"],
           ["½ tsp","Satva Chilli Powder"],["¾ tsp","salt"],["1 tbsp","lemon juice"],["2 tbsp","coriander leaves, chopped"]],
      steps:["Dry-roast the coriander seeds for 1-2 minutes until they smell warm and turn a shade darker. Cool, then crush coarse in a mortar - not to a powder.",
             "Heat the oil, add the cumin, then the crushed coriander, green chillies and ginger. Stir for 30 seconds.",
             "Add the turmeric and chilli powder, then straight away the potatoes and salt.",
             "Toss on medium-high for 6-8 minutes, leaving them alone long enough for the edges to catch and crisp.",
             "Finish with lemon juice and coriander leaves."] },

    "jeera-bhaat": { serves:"3-4",
      ing:[["1 cup","basmati rice"],["1¾ cups","water"],["2 tbsp","ghee"],["1½ tsp","Satva Cumin Seeds"],
           ["1","bay leaf"],["2","cloves"],["¾ tsp","salt"]],
      steps:["Rinse the rice until the water runs clear, soak for 20 minutes, then drain.",
             "Heat the ghee and add the cumin. Wait until it darkens a shade and smells toasted - 30 to 40 seconds, no longer.",
             "Add the bay leaf and cloves, then the rice. Stir gently for a minute to coat every grain.",
             "Pour in the water and salt and bring to a boil. Cover, turn the heat to its lowest and cook 12 minutes. No stirring.",
             "Turn off the heat, leave the lid on for 5 minutes, then fluff with a fork."] },

    "fodni-poha": { serves:"3",
      ing:[["2 cups","thick poha"],["2 tbsp","oil"],["1 tsp","Satva Mustard Seeds"],["½ tsp","Satva Cumin Seeds"],
           ["10","curry leaves"],["¼ cup","raw peanuts"],["1 large","onion, chopped"],["2","green chillies, chopped"],
           ["½ tsp","Satva Turmeric"],["¾ tsp","salt"],["1 tsp","sugar"],["½","lemon"],
           ["2 tbsp","coriander leaves, chopped"],["2 tbsp","fresh coconut, grated (optional)"]],
      steps:["Rinse the poha in a sieve under running water for a few seconds, drain, and sprinkle over the salt and sugar. Leave 5 minutes to soften.",
             "Heat the oil and fry the peanuts until golden. Lift them out.",
             "Add the mustard seeds and wait until they actually pop. Then the cumin, curry leaves and chillies.",
             "Add the onion and cook until soft, about 3 minutes. Stir in the turmeric.",
             "Add the poha and toss gently until it is evenly yellow. Cover and leave on low for 2 minutes.",
             "Finish with the peanuts, a squeeze of lemon, coriander and coconut."] },

    "miri-rasam": { serves:"4",
      ing:[["1 tbsp","tamarind paste (or a lime-sized ball soaked in 1 cup water)"],["1","tomato, chopped"],
           ["1½ tsp","Satva Black Pepper"],["1 tsp","Satva Cumin Seeds"],["4 cloves","garlic"],["¼ tsp","Satva Turmeric"],
           ["1 tsp","salt"],["4 cups","water"],["1 tbsp","ghee"],["½ tsp","Satva Mustard Seeds"],["8","curry leaves"],
           ["a pinch","asafoetida (hing)"],["2 tbsp","coriander leaves, chopped"]],
      steps:["Pound the pepper, cumin and garlic together to a coarse paste.",
             "Simmer the tamarind with the tomato, turmeric, salt and 2 cups of the water for 8 minutes, until the raw tamarind smell has gone.",
             "Add the remaining 2 cups water and the pounded spices. Heat until a froth rises to the top, then turn it off - do not let it boil.",
             "Heat the ghee, let the mustard seeds pop, add the curry leaves and hing, and pour it over the rasam.",
             "Scatter coriander leaves. Serve with hot rice, or drink it from a cup."] },

    "chole": { serves:"4",
      ing:[["1 cup","kabuli chana, soaked overnight"],["3 cups","water"],["1","tea bag (for colour, optional)"],
           ["2","onions, finely chopped"],["2","tomatoes, pureed"],["1 tbsp","ginger-garlic paste"],["1","green chilli, slit"],
           ["3 tbsp","oil"],["1 tsp","Satva Cumin Seeds"],["2 tsp","Satva Coriander Powder"],["1 tsp","Satva Chilli Powder"],
           ["½ tsp","Satva Turmeric"],["1½ tsp","Satva Garam Masala"],["1 tsp","amchur"],["1¼ tsp","salt"],
           ["to finish","coriander leaves, ginger strips, lemon"]],
      steps:["Pressure-cook the chana with the water, salt and tea bag for 5-6 whistles, until very soft. Throw away the tea bag; keep the water.",
             "Heat the oil, add the cumin, then the onions. Cook until properly golden brown, about 10 minutes.",
             "Add the ginger-garlic paste and chilli for a minute, then the coriander powder, chilli powder and turmeric for 30 seconds.",
             "Add the tomato and cook until the oil separates, about 8 minutes.",
             "Add the chana with its water and mash a few against the side of the pot. Simmer 15 minutes.",
             "Turn off the heat, then stir in the garam masala and amchur and cover for 5 minutes. Finish with coriander, ginger and lemon."] },

    "biryani": { serves:"4-5",
      ing:[["750 g","chicken, bone-in, in large pieces"],["¾ cup","thick yogurt"],["2½ tbsp","Satva Biryani Masala"],
           ["1½ tbsp","ginger-garlic paste"],["½ tsp","Satva Turmeric"],["1 tsp","Satva Chilli Powder"],["1","lemon"],
           ["2 tsp","salt, plus more for the rice water"],["2 cups","basmati rice"],["3","onions, thinly sliced and fried golden"],
           ["4 tbsp","ghee"],["2 + 4 + 4","bay leaves, green cardamom, cloves"],["1 inch","cinnamon"],
           ["½ cup each","mint and coriander leaves"],["a pinch","saffron, in 3 tbsp warm milk"]],
      steps:["Marinate the chicken with the yogurt, 2 tbsp of the biryani masala, ginger-garlic paste, turmeric, chilli, lemon juice, salt, half the fried onions and half the mint. At least an hour; overnight in the fridge is better.",
             "Rinse the rice and soak it for 30 minutes.",
             "Boil a large pot of well-salted water with half the whole spices. Add the drained rice and cook until about 70% done, 5-6 minutes. Drain.",
             "In a heavy pot, warm 2 tbsp ghee with the rest of the whole spices for 30 seconds. Add the chicken and marinade and cook on medium for 10 minutes.",
             "Spread the rice over the chicken. Sprinkle the last ½ tbsp of masala, the rest of the onions, mint and coriander, the saffron milk and the remaining ghee.",
             "Seal the lid with foil or dough. Cook 3 minutes on high, then 30 minutes on the lowest heat, ideally on a tawa under the pot.",
             "Leave it sealed for 10 minutes off the heat. Open it at the table."] },

    "rassa": { serves:"4",
      ing:[["750 g","mutton, bone-in"],["½ cup","yogurt"],["3 tbsp","Satva Garam Masala"],["½ tsp","Satva Turmeric"],
           ["1½ tsp","salt"],["3","onions - 2 sliced, 1 chopped"],["½ cup","dry coconut, grated"],["8 cloves","garlic"],
           ["1 inch","ginger"],["½ cup","coriander leaves"],["4 tbsp","oil"],["4 cups","water"]],
      steps:["Marinate the mutton with the yogurt, turmeric, salt and 1 tbsp of the garam masala for an hour.",
             "Roast the sliced onions in 1 tbsp oil until deep brown, then add the coconut and roast until brown too - about 12 minutes. This browning is the whole gravy; do not hurry it.",
             "Grind the onion and coconut with the garlic, ginger, coriander leaves and a little water to a smooth paste.",
             "Heat the remaining oil, fry the chopped onion until golden, add the mutton and sear for 8 minutes.",
             "Add the paste and the rest of the garam masala. Fry 5 minutes until the oil shows at the edges.",
             "Add the water and pressure-cook 6-7 whistles (or simmer, covered, 1¼ hours) until the meat is tender. Thin it to taste. Serve with bhakri or rice."] },

    "sambar": { serves:"4-5",
      ing:[["¾ cup","Satva Toor Dal"],["½ tsp","Satva Turmeric"],["2 cups","mixed vegetables (drumstick, pumpkin, brinjal, okra)"],
           ["10","shallots, or 1 onion in chunks"],["1","tomato, chopped"],["1 tbsp","tamarind paste"],["1 tsp","jaggery"],
           ["2½ tbsp","Satva Sambar Masala"],["1½ tsp","salt"],["2 tbsp","oil or ghee"],["1 tsp","Satva Mustard Seeds"],
           ["¼ tsp","Satva Methi Seeds"],["2","dry red chillies"],["10","curry leaves"],["a pinch","asafoetida (hing)"],
           ["2 tbsp","coriander leaves"]],
      steps:["Pressure-cook the dal with the turmeric and 2½ cups water for 4 whistles. Mash smooth.",
             "Simmer the vegetables, shallots and tomato in 2 cups water with the salt until just tender, 8-10 minutes. Drumstick first, okra last, so everything keeps its shape.",
             "Add the tamarind and jaggery and boil for 5 minutes.",
             "Add the dal, bring back to the boil, then lower the heat. Stir in the sambar masala (loosened in a little water) off the boil and simmer gently 5 minutes.",
             "Heat the oil, pop the mustard seeds, then the methi, red chillies, curry leaves and hing. Pour over and add the coriander."] },

    "bhel": { serves:"4",
      ing:[["4 cups","puffed rice (kurmura)"],["1 cup","fine sev"],["1","boiled potato, diced"],["1","onion, finely chopped"],
           ["1","tomato, finely chopped"],["¼ cup","roasted peanuts"],["3 tbsp","green chutney"],["3 tbsp","tamarind-date chutney"],
           ["1½ tsp","Satva Chaat Masala"],["½","lemon"],["¼ cup","coriander leaves, chopped"]],
      steps:["If the puffed rice is not crisp, dry-roast it for 2-3 minutes and let it cool.",
             "Have everything chopped and ready before you start mixing. Bhel waits for nobody.",
             "In a big bowl, toss the puffed rice with the potato, onion, tomato and peanuts.",
             "Add both chutneys and toss quickly.",
             "Top with sev and coriander, squeeze over the lemon, and dust the chatpat / kanda lasun masala over everything last. Eat straight away."] },

    "varan-bhaat": { serves:"4",
      ing:[["¾ cup","Satva Toor Dal"],["2½ cups","water"],["½ tsp","Satva Turmeric"],["1 tsp","salt"],
           ["1 tsp","jaggery (optional)"],["2 tbsp","ghee, plus more to serve"],["½ tsp","Satva Mustard Seeds"],
           ["½ tsp","Satva Cumin Seeds"],["a pinch","asafoetida (hing)"],["to serve","steamed rice and a lemon wedge"]],
      steps:["Rinse the dal three times.",
             "Pressure-cook it with the water and turmeric for 4-5 whistles, until completely soft.",
             "Whisk smooth, add the salt and jaggery, and simmer 5 minutes. Loosen with hot water until it pours.",
             "Heat the ghee, let the mustard seeds pop, add the cumin and hing, and pour it over the dal.",
             "Serve over hot rice with a spoon of ghee on top and lemon on the side."] },

    "chana-dal": { serves:"4",
      ing:[["1 cup","Satva Chana Dal, soaked 1 hour"],["½ tsp","Satva Turmeric"],["3 cups","water"],
           ["2 + 1 tbsp","ghee"],["1 tsp","Satva Cumin Seeds"],["1","onion, chopped"],["1","tomato, chopped"],
           ["1 tsp","ginger-garlic paste"],["1","green chilli, slit"],["1 tsp","Satva Chilli Powder, plus a pinch"],
           ["1 tsp","Satva Coriander Powder"],["½ tsp","Satva Garam Masala"],["1 tsp","salt"],["2","dry red chillies"],
           ["to finish","lemon and coriander leaves"]],
      steps:["Pressure-cook the drained dal with the turmeric and water for 3 whistles - soft, but still holding its shape.",
             "Heat 2 tbsp ghee, add the cumin, then the onion. Cook until golden.",
             "Add the ginger-garlic paste and green chilli, then the tomato, and cook until soft.",
             "Stir in the chilli and coriander powders for 30 seconds, then add the dal and salt. Add water to the thickness you like and simmer 10 minutes. Stir in the garam masala.",
             "For the second tadka, heat 1 tbsp ghee, add the red chillies and a pinch of chilli powder, and pour it over at the table. Lemon and coriander to finish."] },

    "chia": { serves:"1",
      ing:[["3 tbsp","Satva Chia Seeds"],["1 cup","milk (any kind)"],["1-2 tsp","honey or jaggery"],
           ["a pinch","cardamom powder"],["½ cup","fresh fruit"],["1 tbsp","chopped nuts"]],
      steps:["Whisk the chia into the milk with the sweetener and cardamom.",
             "Leave 5 minutes, then whisk again - this breaks up the clumps that always form the first time.",
             "Cover and refrigerate overnight, or at least 4 hours.",
             "In the morning, stir, and top with the fruit and nuts."] },

    "javas-chutney": { serves:"makes about 1 cup",
      ing:[["½ cup","Satva Flax Seeds"],["4-6","dry red chillies (or 1½ tsp Satva Chilli Powder)"],["6-8 cloves","garlic"],
           ["½ tsp","Satva Cumin Seeds"],["¾ tsp","salt"],["2 tbsp","dry coconut, grated (optional)"]],
      steps:["Dry-roast the flax on low-medium for 4-5 minutes, stirring, until the seeds crackle and puff. Tip them out.",
             "In the same pan, roast the red chillies and cumin for 30 seconds (and the coconut, if using).",
             "Let everything cool completely - warm seeds turn to paste.",
             "Grind the flax, chillies, cumin and salt in short pulses until coarse.",
             "Add the garlic and pulse 2-3 more times. It should stay coarse and dry. Keeps a fortnight in an airtight dabba."] },

    "methi-dal": { serves:"4",
      ing:[["¾ cup","Satva Toor Dal"],["½ tsp","Satva Turmeric"],["1","tomato, chopped"],["1 tsp","salt"],
           ["2 tbsp","ghee"],["4-5 seeds","Satva Methi Seeds (no more)"],["½ tsp","Satva Mustard Seeds"],
           ["½ tsp","Satva Cumin Seeds"],["3 cloves","garlic, sliced"],["2","dry red chillies"],["a pinch","asafoetida (hing)"],
           ["½ tsp","Satva Chilli Powder"],["to finish","coriander leaves and lemon"]],
      steps:["Pressure-cook the dal with the turmeric, tomato and 2½ cups water for 4 whistles. Whisk, add the salt, loosen with hot water and simmer 5 minutes.",
             "Heat the ghee and pop the mustard seeds. Add the methi seeds and let them turn reddish-brown - about 10 seconds. Black methi is bitter; start again if it burns.",
             "Add the cumin, then the garlic until golden, then the red chillies and hing.",
             "Turn off the heat, stir in the chilli powder, and pour the tadka over the dal. Cover for 2 minutes.",
             "Finish with coriander and a squeeze of lemon."] },

    "nimbu-pani": { serves:"4",
      ing:[["3","lemons"],["4 cups","chilled water"],["½ tsp","Satva Himalayan Pink Salt"],["4 tbsp","sugar or jaggery"],
           ["½ tsp","Satva Cumin Seeds, roasted and ground"],["a pinch","Satva Black Pepper"],["8","mint leaves"],["to serve","ice"]],
      steps:["Dissolve the sugar and salt in 1 cup of the water first - they will not dissolve in ice-cold water later.",
             "Roll the lemons on the counter, then squeeze them in.",
             "Add the rest of the water, the cumin and the pepper. Taste: the salt should be just noticeable, not salty.",
             "Bruise the mint leaves, drop them in, and serve over ice."] },

    "kheer": { serves:"4",
      ing:[["1 litre","full-fat milk"],["3 tbsp","short-grain or basmati rice, rinsed and soaked 20 minutes"],
           ["5 tbsp","Satva Coconut Sugar"],["4","green cardamom, crushed"],["a pinch","saffron"],
           ["2 tbsp","almonds and pistachios, slivered"]],
      steps:["Bring the milk to a boil in a heavy-bottomed pan. Add the drained rice.",
             "Simmer on low for 35-40 minutes, stirring often and scraping the bottom, until the rice is soft and the milk has reduced by about a third.",
             "Turn off the heat and wait 2 minutes. Then stir in the coconut sugar - added to boiling milk it can make the milk split.",
             "Stir in the cardamom and saffron, and scatter the nuts on top.",
             "Serve warm or chilled. It thickens as it cools."] },

    "shrikhand": { serves:"4",
      ing:[["1 kg","full-fat yogurt (hangs down to about 450 g)"],["to taste","Satva Monk Fruit Sweetener - start with ¼ tsp"],
           ["a pinch","saffron, in 1 tbsp warm milk"],["¼ tsp","cardamom powder"],["a pinch","nutmeg"],
           ["1 tbsp","pistachios, chopped"]],
      steps:["Tie the yogurt in a muslin cloth and hang it over a bowl in the fridge for 6-8 hours or overnight, until thick enough to hold a spoon.",
             "Whisk the hung yogurt until smooth, or press it through a sieve for a silkier finish.",
             "Add the monk fruit a little at a time, tasting as you go. It is far sweeter than sugar, so start with ¼ tsp.",
             "Stir in the saffron milk, cardamom and nutmeg.",
             "Chill for an hour, and scatter the pistachios over before serving."] },

    "paneer-tikka": { serves:"3-4",
      ing:[["400 g","paneer, in 1½ inch cubes"],["1 each","onion and capsicum, in squares"],["½ cup","thick hung curd"],
           ["1 tbsp","besan, dry-roasted"],["1 tbsp","ginger-garlic paste"],["2 tsp","Satva Chilli Powder"],
           ["½ tsp","Satva Turmeric"],["1 tsp","Satva Coriander Powder"],["1 tsp","Satva Garam Masala"],
           ["1 tbsp","mustard oil"],["1 tbsp","lemon juice"],["1 tsp","salt"],["2 tbsp","butter, melted, for basting"]],
      steps:["Roast the besan in a dry pan for a minute until it smells nutty. It binds the marinade so it clings instead of sliding off.",
             "Whisk the curd with the besan, ginger-garlic paste, chilli powder, turmeric, coriander powder, garam masala, mustard oil, lemon and salt.",
             "Fold in the paneer, onion and capsicum gently so the paneer does not break. Cover and rest for 2 hours in the fridge (30 minutes at least).",
             "Thread onto skewers, alternating paneer with onion and capsicum.",
             "Grill at 230°C (or over a hot tawa) for 12-15 minutes, turning once and basting with butter, until the edges char.",
             "Serve straight away with onion rings, lemon and green chutney."] },

    "butter-chicken": { serves:"4",
      ing:[["600 g","boneless chicken thighs, in pieces"],["½ cup","curd"],["1 tbsp","ginger-garlic paste"],
           ["2½ tsp","Satva Chilli Powder (1 for the marinade)"],["1½ tsp","Satva Garam Masala (½ for the marinade)"],["1 tbsp","lemon juice"],
           ["3 tbsp","butter"],["1 tbsp","oil"],["4 large","tomatoes, puréed"],["12","cashews, soaked and ground to a paste"],
           ["1 tsp","kasuri methi"],["1 tsp","Satva Coconut Sugar"],["⅓ cup","fresh cream"],["to taste","salt"]],
      steps:["Mix the chicken with the curd, half the ginger-garlic paste, 1 tsp chilli powder, ½ tsp garam masala, lemon and a little salt. Rest for an hour.",
             "Sear the chicken in a very hot pan, or grill it, until charred in places. It does not need to cook through. Set aside.",
             "Heat the butter and oil, add the rest of the ginger-garlic paste and stir for a minute. Add the tomato purée and cook for about 15 minutes, until it thickens and the butter separates.",
             "Stir in the cashew paste, the remaining chilli powder and garam masala, salt and 1 cup of water. Simmer for 10 minutes. Blend smooth if you like it silky.",
             "Add the chicken and simmer for 10 minutes until cooked through.",
             "Crush the kasuri methi between your palms over the pan, stir in the coconut sugar and cream, and take it off the heat. Rest for 5 minutes before serving."] },

    "pav-bhaji": { serves:"4",
      ing:[["3","potatoes"],["1 cup","cauliflower florets"],["½ cup","green peas"],["1","capsicum, finely chopped"],
           ["2","onions, finely chopped"],["4","tomatoes, finely chopped"],["1 tbsp","ginger-garlic paste"],
           ["2 tsp","Satva Chilli Powder"],["½ tsp","Satva Turmeric"],["2 tsp","Satva Coriander Powder"],["1 tsp","Satva Garam Masala"],
           ["5 tbsp","butter"],["to taste","salt"],["1","lemon"],["¼ cup","coriander leaves, chopped"],["8","pav"]],
      steps:["Pressure-cook the potatoes, cauliflower and peas for 3 whistles. Drain and mash roughly.",
             "Melt 3 tbsp butter in a wide pan. Fry half the onion until soft, then the capsicum and ginger-garlic paste for 2 minutes.",
             "Add the tomatoes and cook until they break down completely, about 6 minutes.",
             "Add the chilli powder, turmeric, coriander powder, garam masala and salt, and stir for a minute.",
             "Add the mashed vegetables and 1 cup of water. Keep mashing on the pan as it simmers for 10 minutes, until thick and smooth.",
             "Finish with a knob of butter, half the coriander and a squeeze of lemon.",
             "Slit the pav, toast it in the remaining butter on a tawa, and serve with the bhaji, the rest of the onion, coriander and lemon wedges."] },

    "pepper-mutton": { serves:"4",
      ing:[["500 g","mutton, on the bone"],["½ tsp","Satva Turmeric"],["1 tsp","salt"],["3 tbsp","oil"],
           ["1 tsp","Satva Cumin Seeds"],["2 sprigs","curry leaves"],["2","onions, thinly sliced"],["1 tbsp","ginger-garlic paste"],
           ["1 tsp","Satva Coriander Powder"],["½ tsp","Satva Chilli Powder"],["½ tsp","Satva Garam Masala"],
           ["2 tsp","Satva Black Pepper, freshly crushed"],["2 tbsp","coriander leaves, chopped"]],
      steps:["Pressure-cook the mutton with the turmeric, salt and 1 cup of water for 5-6 whistles, until tender. Keep the stock.",
             "Heat the oil, add the cumin seeds and curry leaves, then the onions. Fry until deep golden, about 10 minutes.",
             "Add the ginger-garlic paste and fry for 2 minutes, then the coriander powder, chilli powder and garam masala for 30 seconds.",
             "Add the mutton with its stock. Cook on high, stirring, until the liquid has gone and the masala coats every piece, about 10 minutes.",
             "Add the black pepper in the last 3 minutes and keep tossing until the meat looks dark and dry.",
             "Finish with coriander leaves."] },

    "chicken-curry": { serves:"4",
      ing:[["750 g","chicken, curry cut"],["3 tbsp","oil"],["1 tsp","Satva Cumin Seeds"],["1","bay leaf"],
           ["2","onions, finely chopped"],["1 tbsp","ginger-garlic paste"],["2","tomatoes, puréed"],
           ["2½ tsp","Satva Coriander Powder"],["1 tsp","Satva Chilli Powder"],["½ tsp","Satva Turmeric"],
           ["1 tsp","Satva Garam Masala"],["¼ cup","curd, whisked"],["to taste","salt"],["2 tbsp","coriander leaves, chopped"]],
      steps:["Heat the oil, add the cumin seeds and bay leaf, then the onions. Brown them slowly, 12-15 minutes. This is where the colour of the gravy comes from.",
             "Add the ginger-garlic paste and fry for 2 minutes, then the tomato purée. Cook until the oil separates, about 8 minutes.",
             "Lower the heat, add the coriander powder, chilli powder and turmeric, and stir for 30 seconds.",
             "Add the chicken and salt and fry for 5 minutes on high, so the masala sticks to it.",
             "Take the pan off the heat for a moment and stir in the curd so it does not split. Add 1½ cups of hot water, cover and simmer for 20 minutes until the chicken is done.",
             "Stir in the garam masala, rest for 5 minutes, and finish with coriander leaves."] }
  };

  var recSheet = null, recDone = null;

  function openRecipe(p, onClose) {
    var r = RECIPES.filter(function (o) { return o.id === RECIPE_FOR[p.en]; })[0];
    showRecipe(r, STILL_SHOT[p.en] || p.img, p.en, onClose);
  }

  /* A recipe by its id, with a photograph of the page's choosing - for the
     rotating recipe row on :8002 (js/recipes-rotate-8002.js), whose cards
     show a dish photo rather than a product's. Returns false when there is
     no recipe written for that id, so the caller can leave the card alone. */
  window.SATVA_openRecipe = function (id, shot, onClose, madeWith) {
    var r = RECIPES.filter(function (o) { return o.id === id; })[0];
    if (!r || !RECIPE_BOOK[r.id]) return false;
    showRecipe(r, shot, madeWith || r.uses, onClose);
    return true;
  };

  /* A recipe's name, Marathi name, time and one-line description, for the
     "See all recipes" gallery on :8002. Null when there is no recipe. */
  window.SATVA_recipeInfo = function (id) {
    var r = RECIPES.filter(function (o) { return o.id === id; })[0];
    if (!r || !RECIPE_BOOK[r.id]) return null;
    return { name: r.name, hi: r.hi, time: r.time, desc: r.desc };
  };

  function showRecipe(r, shot, madeWith, onClose) {
    var b = r && RECIPE_BOOK[r.id];
    if (!b) { if (onClose) onClose(); return; }

    if (!recSheet) {
      recSheet = document.createElement("dialog");
      recSheet.className = "rsheet";
      recSheet.setAttribute("aria-labelledby", "rsheet-title");
      document.body.appendChild(recSheet);
      // a click on the backdrop (the dialog itself, outside its box) closes it
      recSheet.addEventListener("click", function (e) { if (e.target === recSheet) recSheet.close(); });
      recSheet.addEventListener("close", function () {
        document.documentElement.classList.remove("rsheet-open");
        var f = recDone; recDone = null;
        if (f) f();
      });
    }

    var ours = function (item) {
      var gone = HIDDEN.filter(function (n) { return item.indexOf("Satva " + n) === 0; })[0];
      if (gone) return item.replace("Satva " + gone, gone.toLowerCase());
      return /^Satva /.test(item) ? '<b class="rs-ours">' + item + "</b>" : item;
    };
    recSheet.innerHTML =
      '<div class="rs-box">' +
        '<figure class="rs-shot"><img src="' + shot + '" alt="' + r.name + '"></figure>' +
        '<div class="rs-body">' +
          '<button type="button" class="rs-close" aria-label="Close recipe">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>' +
          "</button>" +
          '<p class="rs-kick">Recipe &middot; made with ' + madeWith + "</p>" +
          '<h2 id="rsheet-title">' + r.name + '<span class="dv">' + r.hi + "</span></h2>" +
          '<p class="rs-meta"><span>' + r.time + "</span><span>Serves " + b.serves + "</span></p>" +
          '<p class="rs-desc">' + r.desc + "</p>" +
          "<h3>Ingredients</h3>" +
          '<ul class="rs-ing">' +
            b.ing.map(function (x) { return "<li><span>" + x[0] + "</span><span>" + ours(x[1]) + "</span></li>"; }).join("") +
          "</ul>" +
          "<h3>Method</h3>" +
          '<ol class="rs-steps">' +
            b.steps.map(function (s) { return "<li>" + s + "</li>"; }).join("") +
          "</ol>" +
        "</div>" +
      "</div>";
    recSheet.querySelector(".rs-close").addEventListener("click", function () { recSheet.close(); });
    recSheet.querySelector(".rs-body").scrollTop = 0;

    recDone = onClose || null;
    document.documentElement.classList.add("rsheet-open");
    recSheet.showModal();
  }

  function buildRecipeCard(r, i) {
    var prod = PRODUCTS.filter(function (p) { return p.en === r.uses; })[0];
    var card = document.createElement("article");
    card.className = "reccard reveal d" + (i % 4);
    if (prod) card.style.setProperty("--acc", prod.acc);
    card.innerHTML =
      '<div class="rfield" style="--tint:' + r.tint + '">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" ' +
          'stroke-linecap="round" stroke-linejoin="round">' + r.icon + "</svg>" +
        '<span class="rtime">' + r.time + "</span>" +
      "</div>" +
      '<div class="rbody">' +
        "<h3>" + r.name + '<span class="rhi dv">' + r.hi + "</span></h3>" +
        '<p class="rdesc">' + r.desc + "</p>" +
        '<p class="ruses"><i></i>Made with ' + r.uses + "</p>" +
      "</div>";

    // a real photo replaces the tile, same as everywhere else on the page
    var probe = new Image();
    probe.onload = function () {
      var f = card.querySelector(".rfield");
      if (!f) return;
      probe.alt = r.name;
      probe.loading = "lazy";
      f.insertBefore(probe, f.firstChild);
      f.querySelector("svg").remove();
      f.classList.add("has-photo");
    };
    probe.src = "assets/recipe-" + r.id + ".webp";

    return card;
  }

  /* The strip, after the "See what else we're cooking up" marquee on graza.co.
     Measured off their live page 5 Sep 2026: a fixed card width with VARYING
     heights, top-aligned, 20px corners, and the whole set duplicated exactly
     twice inside a track that translates -50% on a linear loop - which is what
     makes the loop seamless without any JS running per frame.

     Taken differently in one place, on purpose: theirs does not pause on hover,
     because their slides are photographs and nothing else. Ours carry a name, a
     cook time and the masala it needs, so the strip pauses on hover and on
     keyboard focus - a moving target you cannot finish reading is worse than no
     movement. Reduced motion stops it altogether and hands back a normal
     scrollbar. */
  /* 2/3 was the tallest of these and it alone decided the strip height, since
     every card is top-aligned in one row. Capped at 3/4 so the stagger stays
     but the tallest card is ~11% shorter. */
  /* FOUR dishes, not fifteen, and a plain grid rather than the moving strip -
     after "Odd for every occasion" on oddbox.co.uk: photograph, name underneath,
     nothing else on the card.

     The four are chosen to be genuinely everyday and genuinely good for you -
     a poha breakfast, a dal, a stuffed vegetable and a grain bowl - and each one
     is built on a DIFFERENT product we actually pack, so the row reads as four
     reasons to buy four different things. The other eleven recipes stay in
     RECIPES; change FEATURED to change what shows. */
  var FEATURED = ["fodni-poha", "methi-dal", "bharli-vangi", "jeera-bhaat"]; /* 20 Oct 2026: quinoa removed */
  /* A page may choose its own four and their photographs
     (window.SATVA_FEATURED / window.SATVA_RECIPE_IMG, set before this
     script, e.g. ports/8002). Without them nothing changes. */
  if (window.SATVA_FEATURED) FEATURED = window.SATVA_FEATURED;

  var recGrid = document.getElementById("recipes-grid");
  if (recGrid) {
    FEATURED.forEach(function (id, i) {
      var r = RECIPES.filter(function (o) { return o.id === id; })[0];
      if (!r) return;                                   // a bad id shows nothing, not a broken card
      var prod = PRODUCTS.filter(function (p) { return p.en === r.uses; })[0];

      var card = document.createElement("article");
      card.className = "reccard reveal d" + (i % 4);
      if (prod) card.style.setProperty("--acc", prod.ink || prod.acc);
      card.innerHTML =
        '<div class="rshot"></div>' +
        "<h3>" + r.name + "</h3>" +
        '<p class="ruses">Made with ' + r.uses + "</p>";

      // the photograph, or nothing at all - a card with no picture simply does
      // not appear, rather than showing a coloured tile in a row this clean
      var probe = new Image();
      probe.onload = function () {
        var shot = card.querySelector(".rshot");
        if (!shot) return;
        probe.alt = r.name;
        probe.loading = "lazy";
        shot.appendChild(probe);
        shot.classList.add("has-photo");
      };
      whenNear(card, function () {
        probe.src = (window.SATVA_RECIPE_IMG && window.SATVA_RECIPE_IMG[r.id]) ||
                    ("assets/recipe-" + r.id + ".webp");
      });

      recGrid.appendChild(card);
    });
  }

  /* ---------------------------------------------------------
     2c-bis. THE MISSION / STORY SLIDER
     Two slides in the rumispice.com/pages/about layout: the
     mission, then a precis of the story. Stacked in one grid
     cell by the CSS, so this only has to move a class - there is
     no track to measure and no transform to keep in step.

     Autoplay follows the same manners as the shelf slider above,
     for the same reasons: it pauses under the pointer and while
     anything inside has focus, pauses when the tab is hidden,
     stops for good once a visitor drives it themselves, and
     never starts at all under prefers-reduced-motion. Slower
     than the shelf (9s against 6s) because a slide here is a
     paragraph to read, not a shelf name to glance at.
     --------------------------------------------------------- */
  var msld = document.getElementById("msld");
  if (msld) {
    var msSlides = [].slice.call(msld.querySelectorAll(".msslide"));
    var msDots   = document.getElementById("msdots");
    var msCur = 0, msTimer = null, msStopped = false;

    // one dot per slide, built here so the markup cannot fall out of step
    msSlides.forEach(function (sl, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("role", "tab");
      b.setAttribute("aria-selected", i === 0 ? "true" : "false");
      b.setAttribute("aria-label", sl.getAttribute("aria-label") || ("Slide " + (i + 1)));
      // a dot to the right of the current one slides forward, to the left back
      b.addEventListener("click", function () { msStop(); msGo(i, i > msCur ? 1 : -1); });
      if (msDots) msDots.appendChild(b);
    });

    /* The slides TRAVEL now (17 Sep 2026) rather than cross-fading, so each one
       has to be on the correct side before it moves. CSS parks a waiting slide
       at translateX(var(--x)) and pulls the current one to 0; this works out
       which side is which.

       The arriving card is the fiddly one: it is already parked wherever the
       last move left it, and if that is the side it is supposed to arrive FROM,
       fine - but after a Back it is on the wrong side, and animating it across
       would send it the wrong way. So it is moved to the entry side with its
       transition switched off, the layout is flushed, and only then does it get
       is-on. Reading offsetWidth is what forces that flush; without it the two
       style changes collapse into one frame and nothing animates. */
    function msGo(to, dir) {
      var n = msSlides.length;
      var prev = msCur;
      msCur = (to + n) % n;
      if (dir === undefined) {
        // forward unless this is a step back; for two slides either is one step
        dir = (((msCur - prev) % n) + n) % n === 1 ? 1 : -1;
      }
      var enter = dir > 0 ? "100%" : "-100%";
      var exit  = dir > 0 ? "-100%" : "100%";

      if (msCur !== prev) {
        var inc = msSlides[msCur];
        inc.style.transition = "none";
        inc.style.setProperty("--x", enter);
        void inc.offsetWidth;                 // flush, so the next change moves
        inc.style.transition = "";
        if (msSlides[prev]) msSlides[prev].style.setProperty("--x", exit);
      }
      msSlides.forEach(function (sl, i) {
        // anything neither arriving nor leaving waits on the entry side
        if (i !== msCur && i !== prev) sl.style.setProperty("--x", enter);
        var on = i === msCur;
        sl.classList.toggle("is-on", on);
        // the off slide is still in the grid cell, so it has to be taken out
        // of the reading order too - not just faded out
        sl.setAttribute("aria-hidden", on ? "false" : "true");
        if ("inert" in sl) sl.inert = !on;
      });
      if (msDots) [].forEach.call(msDots.children, function (b, i) {
        b.setAttribute("aria-selected", i === msCur ? "true" : "false");
      });
    }

    function msStop()  { msStopped = true; clearTimeout(msTimer); msTimer = null; }
    function msPause() { clearTimeout(msTimer); msTimer = null; }
    function msPlay()  {
      if (msStopped || reduce || msSlides.length < 2) return;
      clearTimeout(msTimer);
      msTimer = setTimeout(function () { msGo(msCur + 1, 1); msPlay(); }, 9000);
    }

    msGo(0, 1);   // slide 2 waits on the right, which is where it comes from

    /* The whole of Our Story now lives inside the story slide, behind this
       button. Two things have to happen when it opens, and both are the point:
       autoplay STOPS for good - sliding an article out from under someone
       mid-paragraph is the worst thing this carousel could do - and the slider
       is put on the story slide first, in case the button was reached by a
       #story link rather than by hand. */
    var msOpen = document.getElementById("msopen");
    var msStorySlide = document.getElementById("story");

    var msFull  = document.getElementById("msfull");
    var msInner = msFull && msFull.querySelector(".msfullin");
    var msSettle = null;

    /* The panel's height is animated in PIXELS from here rather than left to a
       0fr->1fr grid transition in the CSS. Measured on the page, that
       transition did not interpolate - the row held at 15px for the full half
       second and then jumped to its full height - because `1fr` has nothing to
       resolve against while its container is collapsed. Two real lengths
       animate properly. It is handed back to `auto` once open so the panel
       still reflows if the window is resized or the type wraps differently. */
    function msShowStory(open) {
      if (!msOpen || !msStorySlide) return;
      msStorySlide.classList.toggle("is-open", open);
      msOpen.setAttribute("aria-expanded", open ? "true" : "false");
      msOpen.textContent = open ? "Close the story" : "Read the whole story";
      if (open) msStop();
      if (!msFull || !msInner) return;

      if (open) {
        msFull.style.height = msInner.scrollHeight + "px";
        /* Hand back to `auto` once it has arrived, so the panel still reflows if
           the window is resized or the type wraps differently.
           BOTH a transitionend and a timer, because the end state must not
           depend on the animation running at all. Caught in testing: where
           transitions do not tick, the first open left the panel pinned at a
           height that never took, and the section actually got SHORTER than
           when it was closed - the picture shrank, the story never appeared,
           and only a second click fixed it. A reader must never have to press
           it twice, so the timer settles it whether the transition fires or
           not, and whichever wins cancels the other. */
        clearTimeout(msSettle);
        var settle = function () {
          clearTimeout(msSettle);
          msFull.removeEventListener("transitionend", onEnd);
          if (msStorySlide.classList.contains("is-open")) msFull.style.height = "auto";
        };
        var onEnd = function (e) { if (e.propertyName === "height") settle(); };
        msFull.addEventListener("transitionend", onEnd);
        msSettle = setTimeout(settle, 600);          // the transition is 450ms
      } else {
        // from `auto` there is nothing to animate FROM, so pin the current
        // height first, force the browser to take it, then go to zero
        clearTimeout(msSettle);
        msFull.style.height = msInner.offsetHeight + "px";
        void msFull.offsetHeight;
        msFull.style.height = "0px";
      }
    }

    if (msOpen) {
      msOpen.addEventListener("click", function () {
        var open = msOpen.getAttribute("aria-expanded") !== "true";
        msStop();
        msGo(msSlides.indexOf(msStorySlide), 1);
        msShowStory(open);
      });
    }

    /* Every #story link on the page - the nav, the footer, the dropdown - used
       to point at a section of its own. It now points at this slide, so the
       slider has to turn to it and open it, or the link would land on a slide
       that is faded out and a story that is closed. */
    function msFromHash() {
      if (location.hash !== "#story" || !msStorySlide) return;
      msStop();
      msGo(msSlides.indexOf(msStorySlide), 1);
      msShowStory(true);
    }
    addEventListener("hashchange", msFromHash);
    msFromHash();

    var msPrevBtn = document.getElementById("msprev");
    var msNextBtn = document.getElementById("msnext");
    if (msPrevBtn) msPrevBtn.addEventListener("click", function () { msStop(); msGo(msCur - 1, -1); });
    if (msNextBtn) msNextBtn.addEventListener("click", function () { msStop(); msGo(msCur + 1, 1); });

    if (!reduce && msSlides.length > 1) {
      msld.addEventListener("pointerenter", msPause);
      msld.addEventListener("pointerleave", function () { msPlay(); });
      msld.addEventListener("focusin", msPause);
      msld.addEventListener("focusout", function () { msPlay(); });
      document.addEventListener("visibilitychange", function () {
        if (document.hidden) msPause(); else msPlay();
      });
      // swipe, same 55px threshold as the hero and the shelf slider
      var mx0 = null;
      msld.addEventListener("pointerdown", function (e) { mx0 = e.clientX; });
      msld.addEventListener("pointerup", function (e) {
        if (mx0 === null) return;
        var dx = e.clientX - mx0; mx0 = null;
        if (Math.abs(dx) > 55) { msStop(); msGo(msCur + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1); }
      });
      msPlay();
    }
  }

  /* ---------------------------------------------------------
     2d. THE MISSION COLOUR-SHIFT
     The owner noticed a reference site whose ground changes
     colour only for its mission section - "when we come here to
     our mission, the site color is changing. It's like that only
     for our mission." The domain was never named in the
     recording, so only the idea is borrowed.

     --mx runs 0 -> 1 as the section's centre approaches the
     centre of the viewport, and the CSS mixes cream toward gold
     across that range. Nothing else on the page reads --mx, so
     the effect cannot leak into a neighbouring section.
     --------------------------------------------------------- */
  var mission = document.querySelector(".mission");
  if (mission && !reduce) {
    var mTick = false;
    var mShift = function () {
      mTick = false;
      var r = mission.getBoundingClientRect();
      var vh = window.innerHeight || 1;
      if (r.bottom < 0 || r.top > vh) return;           // off screen, leave it
      // 0 when the section's centre is a full viewport away, 1 when centred
      var dist = Math.abs((r.top + r.height / 2) - vh / 2);
      var mx = 1 - Math.min(dist / (vh * 0.75), 1);
      mission.style.setProperty("--mx", mx.toFixed(3));
    };
    var onMScroll = function () {
      if (mTick) return;
      mTick = true;
      requestAnimationFrame(mShift);
    };
    addEventListener("scroll", onMScroll, { passive: true });
    addEventListener("resize", onMScroll);
    requestAnimationFrame(mShift);   // 26 Oct 2026: not during load - measuring here forced a whole-page layout early (slow on phones)
  }

  /* ---------------------------------------------------------
     3. reveal on scroll
     --------------------------------------------------------- */
  function reveal() {
    var els = [].slice.call(document.querySelectorAll(".reveal"));
    if (reduce || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  }
  reveal();
  // cards are injected after first paint
  setTimeout(reveal, 60);

  /* ---------------------------------------------------------
     4. mobile nav + year
     --------------------------------------------------------- */
  var burger = document.getElementById("burger"), nav = document.getElementById("nav");
  if (burger) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A" && nav.classList.contains("open")) {
        nav.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      }
    });
  }
  var yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     5. FIELD TO PLATE — the product journey            20 Sep 2026
     ---------------------------------------------------------
     The owner asked for "a stunning video of how this turmeric
     powder is got from the actual plant ... from the beginning
     till the end ... whoever enters the website will also learn
     how the product is got from the field to the plate."

     WHAT WAS LOOKED FOR AND NOT FOUND: a single film of the whole
     turmeric process that we are allowed to use. Wikimedia Commons
     and Openverse were searched across roughly thirty queries. The
     entire free-licence pool holds ONE relevant turmeric clip - a
     7.5-second shot of a grinding disc, CC BY 4.0 - plus a handful
     of wedding and temple footage. There is no full-journey film to
     embed that we own or may use commercially.

     WHAT WAS BUILT INSTEAD: the real six-stage process, sourced from
     the agricultural literature (ICAR / Kerala Agricultural University
     post-harvest notes), told one stage per screen, in licensed
     photographs, with the grinding clip playing at the stage it
     actually belongs to. It teaches the process better than a single
     film would, because each stage gets its own caption and its own
     elapsed time, and it is all cleared for commercial use.

     Every timing below is from the literature, not invented:
     boiling 40-60 minutes, sun-drying 10-15 days, the whole crop
     7-9 months in the ground.

     TO ADD THE NEXT PRODUCT: add one entry to JOURNEYS keyed by the
     product's English name. Nothing else changes - the button
     appears on that card by itself.
     --------------------------------------------------------- */

  var jrn = null, jrnScroll = null, jrnRail = null, jrnReturn = null, jrnIO = null, jrnY = 0;

  function jStageHTML(s, i, total, kind) {
    var media = s.video
      ? '<video muted loop playsinline preload="none" poster="' + s.shot + '">' +
          '<source src="' + s.video + '" type="video/mp4"></video>'
      : '<img src="' + s.shot + '" alt="" loading="lazy">';
    var body = "";
    if (kind === "intro") {
      body = '<span class="jkick">' + s.kick + "</span>" +
             "<h3>" + s.title + "</h3>" +
             "<p>" + s.text + "</p>" +
             '<span class="jscroll-hint">Scroll ' + ARROW_DOWN + "</span>";
    } else if (kind === "end") {
      body = "<h3>" + s.title + "</h3>" +
             "<p>" + s.text + "</p>" +
             '<div class="jend-actions">' +
               '<a class="j-primary" href="' + s.ask + '" target="_blank" rel="noopener">Ask about turmeric</a>' +
               '<button type="button" data-jclose>Back to the range</button>' +
             "</div>";
    } else {
      body = /* 20 Oct 2026: stage number removed */
             '<span class="jstage-when">' + s.when + "</span>" +
             "<h3>" + s.title + "</h3>" +
             "<p>" + s.text + "</p>";
    }
    return '<section class="jstage' + (kind === "intro" ? " is-intro" : kind === "end" ? " is-end" : "") +
             '" aria-label="' + (kind === "stage" ? "Step " + i + " of " + total + ": " : "") + s.title + '">' +
             '<div class="jstage-shot">' + media + "</div>" +
             '<div class="jstage-copy">' + body + "</div>" +
             (s.credit ? '<p class="jcredit">' + s.credit + "</p>" : "") +
           "</section>";
  }

  function buildJourney(name) {
    var j = JOURNEYS[name];
    if (!j) return null;
    var total = j.stages.length;
    var html = jStageHTML(j.intro, 0, total, "intro");
    j.stages.forEach(function (s, n) { html += jStageHTML(s, n + 1, total, "stage"); });
    j.end.ask = "https://wa.me/" + WA_NO + "?text=" +
      encodeURIComponent("Namaskar! I watched how " + name + " is made. Please send me the price.");
    html += jStageHTML(j.end, 0, total, "end");

    var el = document.createElement("div");
    el.className = "jrn";
    el.id = "journey";
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-modal", "true");
    el.setAttribute("aria-label", name + " — from the field to the plate");
    el.innerHTML =
      '<button class="jrn-close" type="button" data-jclose aria-label="Close">' + X_ICON + "</button>" +
      '<div class="jrn-rail" aria-hidden="true"></div>' +
      '<div class="jrn-scroll" tabindex="-1">' + html + "</div>";
    document.body.appendChild(el);
    return el;
  }

  function openJourney(name, trigger) {
    if (jrn) { closeJourney(true); }
    jrn = buildJourney(name);
    if (!jrn) return;
    jrnReturn = trigger || null;
    jrnScroll = jrn.querySelector(".jrn-scroll");
    jrnRail = jrn.querySelector(".jrn-rail");
    var stages = [].slice.call(jrn.querySelectorAll(".jstage"));

    /* One dot per stage, the intro and the closing card included, so
       the rail's length matches what you actually scroll through. */
    stages.forEach(function (st, i) {
      var b = document.createElement("button");
      b.type = "button";
      b.setAttribute("aria-label", "Go to step " + (i + 1));
      b.addEventListener("click", function () {
        st.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      });
      jrnRail.appendChild(b);
    });
    var dots = [].slice.call(jrnRail.children);

    /* Only the stage in view animates, and only its video decodes.
       Several 1080p clips decoding at once is what makes this kind of
       page stutter, so the others stay paused. */
    jrnIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var i = stages.indexOf(e.target);
        var v = e.target.querySelector("video");
        if (e.isIntersecting && e.intersectionRatio > 0.55) {
          e.target.classList.add("is-on");
          dots.forEach(function (d, n) { d.classList.toggle("on", n === i); });
          if (v && !reduce) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        } else if (v) {
          v.pause();
        }
      });
    }, { threshold: [0, 0.55, 0.9] });
    stages.forEach(function (st) { jrnIO.observe(st); });

    jrn.addEventListener("click", function (e) {
      if (e.target.closest("[data-jclose]")) closeJourney();
    });

    /* WHY NOT body{overflow:hidden}: scrollIntoView() on a stage walks
       EVERY scrollable ancestor, and an overflow-hidden body still
       reports as one, so each snap quietly dragged the page underneath.
       Measured: the grid was left 1137px away from where it was opened.
       Pinning the body at its current offset removes the second scroll
       container entirely, and the offset is what we scroll back to. */
    jrnY = window.scrollY || window.pageYOffset || 0;
    document.body.style.top = -jrnY + "px";
    document.body.classList.add("jrn-lock");
    requestAnimationFrame(function () {
      jrn.classList.add("is-open");
      jrnScroll.focus({ preventScroll: true });
    });
  }

  function closeJourney(immediate) {
    if (!jrn) return;
    var el = jrn, io = jrnIO, back = jrnReturn, y = jrnY;
    jrn = jrnScroll = jrnRail = jrnIO = jrnReturn = null;
    document.body.classList.remove("jrn-lock");
    document.body.style.top = "";
    window.scrollTo(0, y);
    el.classList.remove("is-open");
    if (io) io.disconnect();
    if (back) back.focus({ preventScroll: true });
    if (immediate) { el.remove(); return; }
    /* Removed rather than hidden: keeping six full-screen photographs
       and a video element parked in the DOM costs memory for a panel
       most visitors open once. Rebuilding it is instant from cache. */
    window.setTimeout(function () { el.remove(); }, 480);
  }

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && jrn) closeJourney();
  });

  /* The trigger is delegated, so it survives every re-render of the
     grid when the shelf filter changes. */
  if (pGrid) {
    pGrid.addEventListener("click", function (e) {
      var b = e.target.closest("[data-journey]");
      if (b) openJourney(b.getAttribute("data-journey"), b);
    });
  }
})();
