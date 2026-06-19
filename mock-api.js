/* =====================================================================
   Offer-to-REX demo  ·  DUMMY API LAYER
   ---------------------------------------------------------------------
   This file simulates the two back-end systems the production flow will
   talk to:  REX CRM  and  Realworks (REI Forms Live).

   NOTHING here calls a real server. Data is held in the browser
   (localStorage) so the buyer form and the agent screen can share state
   on the same machine for a walkthrough demo.

   >>> SWAP-IN POINT FOR REAL APIS <<<
   When the real API keys arrive, replace the bodies of:
        MockApi._rexFindOrCreateContact()
        MockApi._rexCreateOffer()
        MockApi._realworksCreateContract()
   with real fetch() calls to the endpoints in DUMMY_API.endpoints.
   The rest of the app does not change.
   ===================================================================== */

(function (global) {
  "use strict";

  /* ---- Config: where the real calls will go (placeholders for now) ---- */
  const DUMMY_API = {
    rex: {
      baseUrl: "https://api.rexsoftware.com/v1",         // TODO: confirm region/host with REX
      token:   "REX_API_TOKEN_GOES_HERE",                 // TODO: paste real token
      endpoints: {
        findContact:  "/Contacts/search",
        createContact:"/Contacts/create",
        createOffer:  "/Listings/{listingId}/offers/create"
      }
    },
    realworks: {
      baseUrl: "https://api.formslive.com.au/v1",          // TODO: confirm with Forms Live
      apiKey:  "REALWORKS_API_KEY_GOES_HERE",              // TODO: paste real key
      userToken: "REALWORKS_USER_TOKEN_GOES_HERE",         // TODO: per-agent token
      endpoints: {
        createForm: "/forms",                              // create + populate a form
        formTemplate: "QLD_CONTRACT_OF_SALE"               // template id to use
      }
    },
    /* set to false once you wire real fetch() calls */
    simulated: true,
    latencyMs: 650
  };

  const STORE_KEY = "offerToRex.offers.v1";
  const LOG_KEY   = "offerToRex.lastIntegrationLog.v1";

  /* ----------------------------- helpers ----------------------------- */
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const now   = () => new Date().toISOString();
  const uid   = (p) => p + "-" + Math.random().toString(36).slice(2, 8).toUpperCase();

  function read() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; }
    catch (e) { return []; }
  }
  function write(list) { localStorage.setItem(STORE_KEY, JSON.stringify(list)); }

  /* ============================ Mock API ============================ */
  const MockApi = {

    config: DUMMY_API,

    /* --- 1. BUYER submits an offer (public form). Held for approval. --- */
    async submitOffer(payload) {
      const list = read();
      const record = {
        id: uid("OFR"),
        status: "pending",                // pending -> approved | rejected
        submittedAt: now(),
        decidedAt: null,
        decidedBy: null,
        rejectReason: null,
        integration: null,                // filled on approval
        data: payload
      };
      list.unshift(record);
      write(list);
      await sleep(300);
      return { ok: true, offerId: record.id };
    },

    listOffers(status) {
      const list = read();
      return status ? list.filter((o) => o.status === status) : list;
    },

    getOffer(id) { return read().find((o) => o.id === id) || null; },

    async rejectOffer(id, reason, agent) {
      const list = read();
      const o = list.find((x) => x.id === id);
      if (!o) return { ok: false, error: "not found" };
      o.status = "rejected";
      o.rejectReason = reason || "";
      o.decidedAt = now();
      o.decidedBy = agent || "Agent";
      write(list);
      return { ok: true };
    },

    /* --- 2. AGENT approves -> push to REX, then create Realworks form --- */
    async approveOffer(id, agent, onStep) {
      const list = read();
      const o = list.find((x) => x.id === id);
      if (!o) return { ok: false, error: "not found" };

      const log = [];
      const step = (entry) => { log.push(entry); if (onStep) onStep(entry); };

      // Step A: find or create the buyer contact in REX
      const contact = await this._rexFindOrCreateContact(o.data, step);
      // Step B: create the offer record under the listing in REX
      const rexOffer = await this._rexCreateOffer(o.data, contact, step);
      // Step C: generate the pre-filled Realworks contract
      const contract = await this._realworksCreateContract(o.data, contact, step);

      o.status = "approved";
      o.decidedAt = now();
      o.decidedBy = agent || "Agent";
      o.integration = {
        rexContactId: contact.id,
        rexContactNew: contact._created,
        rexOfferId: rexOffer.id,
        realworksFormId: contract.formId,
        realworksUrl: contract.url,
        log
      };
      write(list);
      localStorage.setItem(LOG_KEY, JSON.stringify(log));
      return { ok: true, integration: o.integration };
    },

    getLastLog() {
      try { return JSON.parse(localStorage.getItem(LOG_KEY)) || []; }
      catch (e) { return []; }
    },

    clearAll() { localStorage.removeItem(STORE_KEY); localStorage.removeItem(LOG_KEY); },

    /* ===================================================================
       The three calls below are the SWAP-IN POINTS.
       Each returns a fake response and records the request/response so the
       Integration Console can display exactly what production will send.
       =================================================================== */

    async _rexFindOrCreateContact(d, step) {
      const c = DUMMY_API.rex;

      // (a) search for an existing contact by email
      const searchReq = {
        method: "POST",
        url: c.baseUrl + c.endpoints.findContact,
        headers: { Authorization: "Bearer " + c.token, "Content-Type": "application/json" },
        body: { criteria: [{ name: "email_address", value: d.buyer1Email }] }
      };
      step({ system: "REX", title: "Search for existing buyer contact", request: searchReq });
      await sleep(DUMMY_API.latencyMs);
      const found = false; // demo: pretend no match -> we create one
      step({ system: "REX", title: "Search response", response: { result: { rows: [], total: 0 } } });

      if (found) {
        return { id: "CONT-EXISTING", _created: false };
      }

      // (b) create a new contact
      const createReq = {
        method: "POST",
        url: c.baseUrl + c.endpoints.createContact,
        headers: { Authorization: "Bearer " + c.token, "Content-Type": "application/json" },
        body: {
          data: {
            name: d.buyer1Name,
            email_address: d.buyer1Email,
            phone_number: d.buyer1Mobile,
            type: "buyer",
            source: "QR Offer Form"
          }
        }
      };
      step({ system: "REX", title: "Create new buyer contact", request: createReq });
      await sleep(DUMMY_API.latencyMs);
      const id = uid("CONT");
      step({ system: "REX", title: "Contact created", response: { result: { id, _new: true } } });
      return { id, _created: true };
    },

    async _rexCreateOffer(d, contact, step) {
      const c = DUMMY_API.rex;
      const url = c.baseUrl + c.endpoints.createOffer.replace("{listingId}", d.listingId);
      const req = {
        method: "POST",
        url,
        headers: { Authorization: "Bearer " + c.token, "Content-Type": "application/json" },
        body: {
          data: {
            listing_id: d.listingId,
            buyer_contact_id: contact.id,
            amount: Number(d.offerPrice),
            deposit: Number(d.deposit || 0),
            finance: d.finance,
            finance_days: d.financeDays || null,
            building_pest_days: d.bpDays || null,
            settlement_days: d.settlementDays || null,
            conditions: d.conditions || "",
            status: "offer_received"
          }
        }
      };
      step({ system: "REX", title: "Create offer under listing", request: req });
      await sleep(DUMMY_API.latencyMs);
      const id = uid("OFR-REX");
      step({ system: "REX", title: "Offer logged in REX", response: { result: { id, listing_id: d.listingId } } });
      return { id };
    },

    async _realworksCreateContract(d, contact, step) {
      const c = DUMMY_API.realworks;
      const req = {
        method: "POST",
        url: c.baseUrl + c.endpoints.createForm,
        headers: {
          "X-Api-Key": c.apiKey,
          "X-User-Token": c.userToken,
          "Content-Type": "application/json"
        },
        body: {
          template: c.endpoints.formTemplate,
          fields: {
            property_address: d.address,
            seller_agent: d.agent,
            buyer_1_name: d.buyer1Name,
            buyer_1_email: d.buyer1Email,
            buyer_1_phone: d.buyer1Mobile,
            buyer_2_name: d.buyer2Name || "",
            purchase_price: Number(d.offerPrice),
            deposit: Number(d.deposit || 0),
            finance_clause: d.finance === "subject_to_finance"
              ? ("Subject to finance · " + (d.financeDays || "?") + " days · " + (d.lender || ""))
              : "Cash / not subject to finance",
            building_pest: d.bpDays ? ("Subject to B&P · " + d.bpDays + " days") : "Waived",
            settlement: (d.settlementDays || "?") + " days from contract",
            buyer_solicitor: d.solicitorFirm || "",
            special_conditions: d.conditions || ""
          }
        }
      };
      step({ system: "Realworks", title: "Create & populate Contract of Sale", request: req });
      await sleep(DUMMY_API.latencyMs);
      const formId = uid("RW");
      const url = "https://app.formslive.com.au/forms/" + formId + "?demo=1";
      step({ system: "Realworks", title: "Contract ready for review / e-sign", response: { formId, url, status: "draft" } });
      return { formId, url };
    }
  };

  global.MockApi = MockApi;
})(window);
