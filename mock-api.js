/* =====================================================================
   Offer-to-REX demo  ·  DUMMY API LAYER
   ---------------------------------------------------------------------
   Simulates the two back-end systems the production flow will talk to:
   REX CRM  and  Realworks (REI Forms Live). Nothing here calls a real
   server — data is held in the browser (localStorage) so the buyer form
   and the agent screen can share state on the same machine.

   >>> SWAP-IN POINTS FOR REAL APIS <<<  (replace bodies with real fetch())
        MockApi._rexFindOrCreateContact()
        MockApi._rexCreateOffer()
        MockApi._realworksCreateContract()
   ===================================================================== */
(function (global) {
  "use strict";

  const DUMMY_API = {
    rex: {
      baseUrl: "https://api.rexsoftware.com/v1",
      token:   "REX_API_TOKEN_GOES_HERE",
      endpoints: {
        findContact:  "/Contacts/search",
        createContact:"/Contacts/create",
        createOffer:  "/Listings/{listingId}/offers/create"
      }
    },
    realworks: {
      baseUrl: "https://api.formslive.com.au/v1",
      apiKey:  "REALWORKS_API_KEY_GOES_HERE",
      userToken: "REALWORKS_USER_TOKEN_GOES_HERE",
      endpoints: { createForm: "/forms", formTemplate: "QLD_CONTRACT_OF_SALE" }
    },
    simulated: true,
    latencyMs: 650
  };

  const STORE_KEY = "offerToRex.offers.v1";
  const LOG_KEY   = "offerToRex.lastIntegrationLog.v1";

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const now   = () => new Date().toISOString();
  const uid   = (p) => p + "-" + Math.random().toString(36).slice(2, 8).toUpperCase();
  const num   = (v) => v ? Number(String(v).replace(/[^0-9.]/g, "")) : 0;

  function read() { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch (e) { return []; } }
  function write(list) { localStorage.setItem(STORE_KEY, JSON.stringify(list)); }

  const MockApi = {
    config: DUMMY_API,

    async submitOffer(payload) {
      const list = read();
      const record = {
        id: uid("OFR"), status: "pending", submittedAt: now(),
        decidedAt: null, decidedBy: null, rejectReason: null, integration: null, data: payload
      };
      list.unshift(record); write(list);
      await sleep(300);
      return { ok: true, offerId: record.id };
    },

    listOffers(status) { const list = read(); return status ? list.filter((o) => o.status === status) : list; },
    getOffer(id) { return read().find((o) => o.id === id) || null; },

    async rejectOffer(id, reason, agent) {
      const list = read(); const o = list.find((x) => x.id === id);
      if (!o) return { ok: false, error: "not found" };
      o.status = "rejected"; o.rejectReason = reason || ""; o.decidedAt = now(); o.decidedBy = agent || "Agent";
      write(list); return { ok: true };
    },

    async approveOffer(id, agent, onStep) {
      const list = read(); const o = list.find((x) => x.id === id);
      if (!o) return { ok: false, error: "not found" };
      const log = []; const step = (e) => { log.push(e); if (onStep) onStep(e); };
      const contact = await this._rexFindOrCreateContact(o.data, step);
      const rexOffer = await this._rexCreateOffer(o.data, contact, step);
      const contract = await this._realworksCreateContract(o.data, contact, step);
      o.status = "approved"; o.decidedAt = now(); o.decidedBy = agent || "Agent";
      o.integration = {
        rexContactId: contact.id, rexContactNew: contact._created,
        rexOfferId: rexOffer.id, realworksFormId: contract.formId, realworksUrl: contract.url, log
      };
      write(list); localStorage.setItem(LOG_KEY, JSON.stringify(log));
      return { ok: true, integration: o.integration };
    },

    getLastLog() { try { return JSON.parse(localStorage.getItem(LOG_KEY)) || []; } catch (e) { return []; } },
    clearAll() { localStorage.removeItem(STORE_KEY); localStorage.removeItem(LOG_KEY); },

    /* ============ SWAP-IN POINTS ============ */

    async _rexFindOrCreateContact(d, step) {
      const c = DUMMY_API.rex;
      step({ system: "REX", title: "Search for existing buyer contact", request: {
        method: "POST", url: c.baseUrl + c.endpoints.findContact,
        headers: { Authorization: "Bearer " + c.token, "Content-Type": "application/json" },
        body: { criteria: [{ name: "email_address", value: d.buyer1Email }] }
      }});
      await sleep(DUMMY_API.latencyMs);
      step({ system: "REX", title: "Search response", response: { result: { rows: [], total: 0 } } });

      const createReq = {
        method: "POST", url: c.baseUrl + c.endpoints.createContact,
        headers: { Authorization: "Bearer " + c.token, "Content-Type": "application/json" },
        body: { data: {
          name: d.buyer1Name,
          email_address: d.buyer1Email,
          phone_number: d.buyer1Mobile,
          address: {
            street: d.buyer1Street || "",
            suburb: d.buyer1Suburb || "",
            state: d.buyer1State || "",
            postcode: d.buyer1Postcode || ""
          },
          type: "buyer", source: "QR Offer Form"
        }}
      };
      step({ system: "REX", title: "Create new buyer contact (with address)", request: createReq });
      await sleep(DUMMY_API.latencyMs);
      const id = uid("CONT");
      step({ system: "REX", title: "Contact created", response: { result: { id, _new: true } } });
      return { id, _created: true };
    },

    async _rexCreateOffer(d, contact, step) {
      const c = DUMMY_API.rex;
      const url = c.baseUrl + c.endpoints.createOffer.replace("{listingId}", d.listingId);
      const req = {
        method: "POST", url,
        headers: { Authorization: "Bearer " + c.token, "Content-Type": "application/json" },
        body: { data: {
          listing_id: d.listingId,
          buyer_contact_id: contact.id,
          second_buyer: d.buyer2Name ? { name: d.buyer2Name, email_address: d.buyer2Email || "", phone_number: d.buyer2Mobile || "" } : null,
          amount: num(d.offerPrice),
          offer_date: d.offerDate || null,
          offer_expiry: d.offerExpiry || null,
          deposit_initial: num(d.initialDeposit),
          deposit_initial_due: d.initialDepositDue || null,
          deposit_balance: num(d.balanceDeposit),
          deposit_balance_due: d.balanceDepositDue || null,
          finance: d.finance,
          lender: d.lender || null,
          loan_amount: num(d.loanAmount),
          finance_date: d.financeDate || null,
          building_pest: d.bp === "yes",
          building_pest_date: d.bpDate || null,
          settlement_date: d.settlementDate || null,
          settlement_days: d.settlementDays || null,
          conditions: d.conditions || "",
          inclusions: d.inclusions || "",
          exclusions: d.exclusions || "",
          solicitor: d.solicitorFirm ? {
            firm: d.solicitorFirm, contact: d.solicitorContact || "",
            email: d.solicitorEmail || "", phone: d.solicitorPhone || ""
          } : null,
          status: "offer_received"
        }}
      };
      step({ system: "REX", title: "Create offer under listing (full terms)", request: req });
      await sleep(DUMMY_API.latencyMs);
      const id = uid("OFR-REX");
      step({ system: "REX", title: "Offer logged in REX", response: { result: { id, listing_id: d.listingId } } });
      return { id };
    },

    async _realworksCreateContract(d, contact, step) {
      const c = DUMMY_API.realworks;
      const financeClause = d.finance === "subject_to_finance"
        ? ("Subject to finance · " + (d.lender || "lender TBC") + " · $" + num(d.loanAmount).toLocaleString() + " · approval by " + (d.financeDate || "TBC"))
        : "Cash / not subject to finance";
      const req = {
        method: "POST", url: c.baseUrl + c.endpoints.createForm,
        headers: { "X-Api-Key": c.apiKey, "X-User-Token": c.userToken, "Content-Type": "application/json" },
        body: {
          template: c.endpoints.formTemplate,
          fields: {
            property_address: d.address,
            seller_agent: d.agent,
            buyer_1_name: d.buyer1Name,
            buyer_1_email: d.buyer1Email,
            buyer_1_phone: d.buyer1Mobile,
            buyer_1_address: [d.buyer1Street, d.buyer1Suburb, d.buyer1State, d.buyer1Postcode].filter(Boolean).join(", "),
            buyer_2_name: d.buyer2Name || "",
            purchase_price: num(d.offerPrice),
            offer_date: d.offerDate || "",
            offer_expiry: d.offerExpiry || "",
            deposit_initial: num(d.initialDeposit),
            deposit_initial_due: d.initialDepositDue || "",
            deposit_balance: num(d.balanceDeposit),
            deposit_balance_due: d.balanceDepositDue || "",
            finance_clause: financeClause,
            building_pest: d.bp === "yes" ? ("Subject to building & pest · by " + (d.bpDate || "TBC")) : "Waived",
            settlement: d.settlementDate ? ("Settlement " + d.settlementDate) : ((d.settlementDays || "?") + " days from contract"),
            buyer_solicitor: d.solicitorFirm ? (d.solicitorFirm + (d.solicitorContact ? (" (" + d.solicitorContact + ")") : "")) : "",
            inclusions: d.inclusions || "",
            exclusions: d.exclusions || "",
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
