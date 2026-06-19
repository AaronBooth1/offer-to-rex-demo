/* Shared listing catalog — Emily Xiong's current LJ Hooker Property Partners listings.
   Used by index.html (QR per listing), offer.html (prefill) and agent.html (seeding).
   A real QR only needs ?listingId=<id> — the property is resolved from here. */
(function (g) {
  "use strict";
  const LISTINGS = {
    "13225493": {
      listingId: "13225493",
      ref: "LJHPP-13225493",
      address: "226 Station Road, Sunnybank QLD 4109",
      beds: "5", baths: "5", cars: "2", land: "508m²",
      agent: "Emily Xiong · LJ Hooker Property Partners | Sunnybank Hills",
      agentPhone: "0401 056 588",
      img: "https://www.homely.com.au/img-variant/l-Rex-13225493-1.jpg?named-transform=webHeroTransform&version=.IHh81z5zBvjZADXq8X.Ql8PkhBiplK7"
    },
    "13215340": {
      listingId: "13215340",
      ref: "LJHPP-13215340",
      address: "64 Marcus Drive, Regents Park QLD 4118",
      beds: "4", baths: "2", cars: "2", land: "600m²",
      agent: "Emily Xiong · LJ Hooker Property Partners | Sunnybank Hills",
      agentPhone: "0401 056 588",
      img: "https://www.homely.com.au/img-variant/l-Rex-13215340-1.jpg?named-transform=webHeroTransform&version=nyhCx2JEsu8YNl0KGnfBRt6ctz0U9Ocl"
    }
  };
  const DEFAULT_ID = "13225493";

  function resolve(search) {
    const qp = new URLSearchParams(search || "");
    const id = qp.get("listingId");
    const base = (id && LISTINGS[id]) ? LISTINGS[id] : LISTINGS[DEFAULT_ID];
    const out = Object.assign({}, base);
    ["listingId","ref","address","beds","baths","cars","land","agent","agentPhone","img"].forEach(k => {
      if (qp.get(k)) out[k] = qp.get(k);
    });
    return out;
  }

  g.LISTINGS = LISTINGS;
  g.LISTINGS_DEFAULT_ID = DEFAULT_ID;
  g.resolveListing = resolve;
})(window);
