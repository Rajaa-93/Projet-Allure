import { mkdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const avatarRoot = path.join(root, "public", "models", "avatar");
const baseRoot = path.join(avatarRoot, "base");
const looksRoot = path.join(avatarRoot, "looks");

const width = 1024;
const height = 1536;

const views = [
  { slug: "face", source: "face.png" },
  { slug: "right", source: "right.png" },
  { slug: "back", source: "back.png" },
  { slug: "left", source: "left.png" },
];

const looks = [
  {
    productSlug: "1-trench-coat-long",
    category: "outerwear",
    variants: [
      { slug: "camel", fill: "#b18a53" },
      { slug: "noir", fill: "#2d2924" },
      { slug: "prince-de-galles", fill: "#b8945b", pattern: "check" },
    ],
  },
  {
    productSlug: "2-robe-midi-a-pois",
    category: "dress",
    variants: [
      { slug: "noir-pois", fill: "#211d1b", pattern: "dots" },
      { slug: "ecru", fill: "#e8dbc6" },
      { slug: "rouge-brique", fill: "#9f4636" },
    ],
  },
  {
    productSlug: "3-jean-wide",
    category: "bottom",
    variants: [
      { slug: "bleu-clair", fill: "#7f9fbd", pattern: "denim" },
      { slug: "denim-brut", fill: "#334b66", pattern: "denim" },
    ],
  },
  {
    productSlug: "4-baskets-city",
    category: "shoes",
    variants: [
      { slug: "blanc", fill: "#f5f1e8" },
      { slug: "sable", fill: "#c4aa78" },
      { slug: "graphite", fill: "#3a3936" },
    ],
  },
  {
    productSlug: "5-chemise-satin",
    category: "top",
    variants: [
      { slug: "ivoire", fill: "#eee2d0" },
      { slug: "champagne", fill: "#d8b982" },
      { slug: "rayures-fines", fill: "#d8b982", pattern: "stripes" },
    ],
  },
  {
    productSlug: "6-escarpins-nude",
    category: "shoes",
    variants: [
      { slug: "nude", fill: "#c99777" },
      { slug: "noir", fill: "#201b18" },
      { slug: "vernis", fill: "#9b654d", pattern: "gloss" },
    ],
  },
];

function darken(hex, amount = 0.18) {
  const value = hex.replace("#", "");
  const r = Math.max(0, Math.round(parseInt(value.slice(0, 2), 16) * (1 - amount)));
  const g = Math.max(0, Math.round(parseInt(value.slice(2, 4), 16) * (1 - amount)));
  const b = Math.max(0, Math.round(parseInt(value.slice(4, 6), 16) * (1 - amount)));

  return `#${[r, g, b].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

function lighten(hex, amount = 0.2) {
  const value = hex.replace("#", "");
  const channels = [value.slice(0, 2), value.slice(2, 4), value.slice(4, 6)];

  return `#${channels
    .map((channel) => {
      const next = Math.min(
        255,
        Math.round(parseInt(channel, 16) + (255 - parseInt(channel, 16)) * amount)
      );
      return next.toString(16).padStart(2, "0");
    })
    .join("")}`;
}

function fabricDefs(variant) {
  const fill = variant.fill;
  const dark = darken(fill, 0.22);
  const light = lighten(fill, 0.28);

  let pattern = "";

  if (variant.pattern === "dots") {
    pattern = `
      <pattern id="fabricPattern" width="30" height="30" patternUnits="userSpaceOnUse">
        <rect width="30" height="30" fill="url(#fabricGradient)" />
        <circle cx="9" cy="10" r="3.8" fill="#f7efe1" opacity="0.92" />
      </pattern>`;
  } else if (variant.pattern === "stripes") {
    pattern = `
      <pattern id="fabricPattern" width="34" height="34" patternUnits="userSpaceOnUse" patternTransform="rotate(8)">
        <rect width="34" height="34" fill="url(#fabricGradient)" />
        <rect x="0" y="0" width="8" height="34" fill="${light}" opacity="0.72" />
      </pattern>`;
  } else if (variant.pattern === "check") {
    pattern = `
      <pattern id="fabricPattern" width="44" height="44" patternUnits="userSpaceOnUse">
        <rect width="44" height="44" fill="url(#fabricGradient)" />
        <path d="M0 12h44M0 32h44M12 0v44M32 0v44" stroke="${dark}" stroke-width="3" opacity="0.34" />
        <path d="M0 22h44M22 0v44" stroke="#fff8ec" stroke-width="1.5" opacity="0.4" />
      </pattern>`;
  } else if (variant.pattern === "denim") {
    pattern = `
      <pattern id="fabricPattern" width="28" height="28" patternUnits="userSpaceOnUse" patternTransform="rotate(17)">
        <rect width="28" height="28" fill="url(#fabricGradient)" />
        <path d="M0 6h28M0 18h28" stroke="${light}" stroke-width="1.1" opacity="0.18" />
        <path d="M8 0v28M21 0v28" stroke="${dark}" stroke-width="1.1" opacity="0.22" />
      </pattern>`;
  } else if (variant.pattern === "gloss") {
    pattern = `
      <linearGradient id="fabricPattern" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="${light}" />
        <stop offset="34%" stop-color="${fill}" />
        <stop offset="48%" stop-color="#fff3e2" />
        <stop offset="58%" stop-color="${dark}" />
        <stop offset="100%" stop-color="${fill}" />
      </linearGradient>`;
  }

  return `
    <linearGradient id="fabricGradient" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="${light}" />
      <stop offset="48%" stop-color="${fill}" />
      <stop offset="100%" stop-color="${dark}" />
    </linearGradient>
    ${pattern}
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="#1f160e" flood-opacity="0.18" />
    </filter>
  `;
}

function fillUrl(variant) {
  return variant.pattern ? "url(#fabricPattern)" : "url(#fabricGradient)";
}

function commonDetails() {
  return `
    <path d="M360 420 C430 452 590 452 664 420" fill="none" stroke="#fff8ee" stroke-width="3" opacity="0.28" />
    <path d="M512 355 C486 377 483 405 512 421 C541 405 538 377 512 355Z" fill="#f7efe5" opacity="0.36" />
    <path d="M512 430 L512 682" stroke="#fff8ee" stroke-width="2" opacity="0.26" />
  `;
}

function frontShapes(category, variant) {
  const fill = fillUrl(variant);

  if (category === "outerwear") {
    return `
      <g filter="url(#softShadow)" opacity="0.94">
        <path d="M354 392 C410 354 612 354 670 392 L722 870 C662 914 576 928 512 922 C448 928 362 914 302 870Z" fill="${fill}" />
        <path d="M317 420 C284 500 276 642 314 778 L374 770 C350 630 355 506 393 420Z" fill="${fill}" />
        <path d="M707 420 C740 500 748 642 710 778 L650 770 C674 630 669 506 631 420Z" fill="${fill}" />
        <path d="M512 398 L468 896M512 398 L556 896" stroke="#fff8ee" stroke-width="4" opacity="0.3" />
        <path d="M382 564 H642" stroke="#2a2118" stroke-width="7" opacity="0.22" />
      </g>`;
  }

  if (category === "dress") {
    return `
      <g filter="url(#softShadow)" opacity="0.95">
        <path d="M362 392 C420 360 604 360 662 392 L648 586 C600 615 424 615 376 586Z" fill="${fill}" />
        <path d="M378 574 C442 614 582 614 646 574 L740 974 C672 1010 578 1022 512 1016 C446 1022 352 1010 284 974Z" fill="${fill}" />
        ${commonDetails()}
      </g>`;
  }

  if (category === "top") {
    return `
      <g filter="url(#softShadow)" opacity="0.94">
        <path d="M356 382 C410 354 614 354 668 382 L646 688 C594 720 430 720 378 688Z" fill="${fill}" />
        <path d="M318 415 C292 462 284 534 302 604 L380 592 C356 520 366 458 398 412Z" fill="${fill}" />
        <path d="M706 415 C732 462 740 534 722 604 L644 592 C668 520 658 458 626 412Z" fill="${fill}" />
        ${commonDetails()}
        <circle cx="512" cy="485" r="4" fill="#fffaf0" opacity="0.58" />
        <circle cx="512" cy="548" r="4" fill="#fffaf0" opacity="0.58" />
        <circle cx="512" cy="611" r="4" fill="#fffaf0" opacity="0.58" />
      </g>`;
  }

  if (category === "bottom") {
    return `
      <g filter="url(#softShadow)" opacity="0.93">
        <path d="M360 686 C420 716 604 716 664 686 L670 760 C596 788 428 788 354 760Z" fill="${fill}" />
        <path d="M356 744 C396 760 454 760 496 746 L492 1296 C452 1312 396 1310 366 1294Z" fill="${fill}" />
        <path d="M528 746 C570 760 628 760 668 744 L658 1294 C628 1310 572 1312 532 1296Z" fill="${fill}" />
        <path d="M512 746 L512 1288" stroke="#101820" stroke-width="4" opacity="0.28" />
        <path d="M374 742 H650" stroke="#fff8ee" stroke-width="3" opacity="0.2" />
      </g>`;
  }

  return `
    <g filter="url(#softShadow)" opacity="0.95">
      <path d="M334 1326 C392 1298 470 1304 508 1344 C482 1396 374 1402 316 1364Z" fill="${fill}" />
      <path d="M516 1344 C554 1304 632 1298 690 1326 L708 1364 C650 1402 542 1396 516 1344Z" fill="${fill}" />
      <path d="M360 1364 C410 1380 462 1375 498 1348" stroke="#fff8ee" stroke-width="5" opacity="0.35" />
      <path d="M664 1364 C614 1380 562 1375 526 1348" stroke="#fff8ee" stroke-width="5" opacity="0.35" />
    </g>`;
}

function backShapes(category, variant) {
  const fill = fillUrl(variant);

  if (category === "outerwear") {
    return `
      <g filter="url(#softShadow)" opacity="0.94">
        <path d="M354 386 C420 356 604 356 670 386 L718 875 C662 914 584 930 512 924 C440 930 362 914 306 875Z" fill="${fill}" />
        <path d="M318 418 C284 510 282 642 316 780 L374 772 C350 632 358 504 394 418Z" fill="${fill}" />
        <path d="M706 418 C740 510 742 642 708 780 L650 772 C674 632 666 504 630 418Z" fill="${fill}" />
        <path d="M380 480 C458 512 566 512 644 480" stroke="#fff8ee" stroke-width="4" opacity="0.28" />
        <path d="M512 392 L512 902" stroke="#1f1711" stroke-width="4" opacity="0.2" />
      </g>`;
  }

  if (category === "dress") {
    return `
      <g filter="url(#softShadow)" opacity="0.95">
        <path d="M362 388 C426 360 598 360 662 388 L648 586 C600 616 424 616 376 586Z" fill="${fill}" />
        <path d="M378 574 C442 614 582 614 646 574 L738 974 C668 1010 580 1020 512 1014 C444 1020 356 1010 286 974Z" fill="${fill}" />
        <path d="M390 414 C456 442 568 442 634 414" stroke="#fff8ee" stroke-width="3" opacity="0.28" />
      </g>`;
  }

  if (category === "top") {
    return `
      <g filter="url(#softShadow)" opacity="0.94">
        <path d="M356 382 C418 356 606 356 668 382 L646 688 C596 720 428 720 378 688Z" fill="${fill}" />
        <path d="M316 416 C292 462 288 534 306 604 L380 592 C358 520 366 456 398 412Z" fill="${fill}" />
        <path d="M708 416 C732 462 736 534 718 604 L644 592 C666 520 658 456 626 412Z" fill="${fill}" />
        <path d="M386 430 C452 456 572 456 638 430" stroke="#fff8ee" stroke-width="3" opacity="0.24" />
      </g>`;
  }

  if (category === "bottom") {
    return `
      <g filter="url(#softShadow)" opacity="0.93">
        <path d="M358 684 C422 716 602 716 666 684 L672 762 C596 790 428 790 352 762Z" fill="${fill}" />
        <path d="M356 744 C398 762 454 762 496 746 L492 1298 C452 1312 396 1310 366 1294Z" fill="${fill}" />
        <path d="M528 746 C570 762 626 762 668 744 L658 1294 C628 1310 572 1312 532 1298Z" fill="${fill}" />
        <path d="M512 744 L512 1290" stroke="#101820" stroke-width="5" opacity="0.3" />
      </g>`;
  }

  return `
    <g filter="url(#softShadow)" opacity="0.95">
      <path d="M330 1326 C388 1304 468 1308 506 1346 C478 1394 374 1402 316 1364Z" fill="${fill}" />
      <path d="M518 1346 C556 1308 636 1304 694 1326 L708 1364 C650 1402 546 1394 518 1346Z" fill="${fill}" />
    </g>`;
}

function sideShapes(category, variant, side) {
  const fill = fillUrl(variant);
  const mirror = side === "left";
  const transform = mirror ? `transform="translate(${width} 0) scale(-1 1)"` : "";

  if (category === "outerwear") {
    return `
      <g ${transform} filter="url(#softShadow)" opacity="0.94">
        <path d="M438 380 C498 348 584 362 610 414 L628 892 C560 924 486 920 410 888 L430 556Z" fill="${fill}" />
        <path d="M470 420 C420 520 405 654 432 792 L490 782 C464 650 474 522 520 424Z" fill="${fill}" />
        <path d="M548 392 C580 492 590 670 568 894" stroke="#fff8ee" stroke-width="4" opacity="0.3" />
        <path d="M426 590 H610" stroke="#2a2118" stroke-width="7" opacity="0.2" />
      </g>`;
  }

  if (category === "dress") {
    return `
      <g ${transform} filter="url(#softShadow)" opacity="0.95">
        <path d="M432 386 C498 350 574 370 610 414 L604 594 C558 624 484 620 424 588Z" fill="${fill}" />
        <path d="M426 574 C486 612 558 612 606 574 L664 970 C594 1006 490 1008 398 974Z" fill="${fill}" />
        <path d="M508 394 C486 416 484 440 512 458" stroke="#fff8ee" stroke-width="3" opacity="0.28" />
      </g>`;
  }

  if (category === "top") {
    return `
      <g ${transform} filter="url(#softShadow)" opacity="0.94">
        <path d="M430 382 C498 350 578 370 612 414 L598 690 C550 722 488 718 426 688Z" fill="${fill}" />
        <path d="M468 414 C424 476 408 548 430 612 L498 598 C474 520 490 456 530 414Z" fill="${fill}" />
        <path d="M514 430 L514 682" stroke="#fff8ee" stroke-width="2" opacity="0.25" />
      </g>`;
  }

  if (category === "bottom") {
    return `
      <g ${transform} filter="url(#softShadow)" opacity="0.93">
        <path d="M418 684 C480 716 574 716 620 688 L626 760 C570 790 480 788 414 760Z" fill="${fill}" />
        <path d="M426 744 C478 762 548 762 616 744 L600 1302 C548 1320 476 1314 430 1292Z" fill="${fill}" />
        <path d="M444 746 C492 774 554 774 606 746" stroke="#fff8ee" stroke-width="3" opacity="0.2" />
      </g>`;
  }

  return `
    <g ${transform} filter="url(#softShadow)" opacity="0.95">
      <path d="M352 1328 C432 1296 550 1302 620 1346 C598 1396 430 1402 332 1364Z" fill="${fill}" />
      <path d="M396 1362 C470 1382 552 1372 612 1344" stroke="#fff8ee" stroke-width="5" opacity="0.35" />
    </g>`;
}

function shapes(category, variant, viewSlug) {
  if (viewSlug === "face") return frontShapes(category, variant);
  if (viewSlug === "back") return backShapes(category, variant);
  return sideShapes(category, variant, viewSlug);
}

function renderSvg(category, variant, viewSlug) {
  return `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>${fabricDefs(variant)}</defs>
      ${shapes(category, variant, viewSlug)}
    </svg>`;
}

for (const look of looks) {
  for (const variant of look.variants) {
    const outputDir = path.join(looksRoot, look.productSlug, variant.slug);
    await mkdir(outputDir, { recursive: true });

    for (const view of views) {
      const input = path.join(baseRoot, view.source);
      const output = path.join(outputDir, `${view.slug}.jpg`);
      const svg = renderSvg(look.category, variant, view.slug);

      await sharp(input)
        .resize(width, height, { fit: "cover" })
        .composite([{ input: Buffer.from(svg), blend: "over" }])
        .jpeg({ quality: 82, mozjpeg: true })
        .toFile(output);
    }
  }
}

console.log("Generated try-on assets in public/models/avatar/looks");
