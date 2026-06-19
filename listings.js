/* Shared listing catalog (real current LJ Hooker Property Partners listings).
   Used by index.html (QR per listing), offer.html (prefill) and agent.html (seeding).
   A real QR only needs ?listingId=<id> — the property is resolved from here. */
(function (g) {
  "use strict";
  const LISTINGS = {
    "13253616": {
      listingId: "13253616",
      ref: "LJHPP-13253616",
      address: "120 West Sentinel Drive, Greenbank QLD 4124",
      beds: "4", baths: "2", cars: "2", land: "350m²",
      agent: "Mayank Patel · LJ Hooker Property Partners | Sunnybank Hills",
      img: "https://www.homely.com.au/img-variant/l-Rex-13253616-1.jpg?named-transform=webHeroTransform&version=AFruA3pU5KiElo8xXRjuZ488qbCGpYd."
    },
    "13243059": {
      listingId: "13243059",
      ref: "LJHPP-13243059",
      address: "9 Maibry Street, Wishart QLD 4122",
      beds: "4", baths: "2", cars: "2", land: "750m²",
      agent: "Kosma Comino · LJ Hooker Property Partners | Sunnybank Hills",
      img: "https://www.homely.com.au/img-variant/l-Rex-13243059-1.jpg?named-transform=webHeroTransform&version=AzKuSx7pyzkbUm3JA4DJV_9Tm.hxnH2_"
    }
  };
  const DEFAULT_ID = "13253616";

  // resolve a listing from URL params: ?listingId wins; any explicit field overrides
  function resolve(search) {
    const qp = new URLSearchParams(search || "");
    const id = qp.get("listingId");
    const base = (id && LISTINGS[id]) ? LISTINGS[id] : LISTINGS[DEFAULT_ID];
    const out = Object.assign({}, base);
    ["listingId","ref","address","beds","baths","cars","land","agent","img"].forEach(k => {
      if (qp.get(k)) out[k] = qp.get(k);
    });
    return out;
  }

  g.LISTINGS = LISTINGS;
  g.LISTINGS_DEFAULT_ID = DEFAULT_ID;
  g.resolveListing = resolve;
})(window);
