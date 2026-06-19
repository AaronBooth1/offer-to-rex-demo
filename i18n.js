/* Bilingual support: English + Simplified Chinese (中文).
   Apply with data-i18n="key" (textContent) and data-i18n-ph="key" (placeholder).
   JS-built strings use t(key). Language is read from ?lang=, else saved choice, else 'en'. */
(function (g) {
  "use strict";

  const STR = {
    en: {
      demoBuyer: "DEMO ENVIRONMENT · sample data only · no live contract is created",
      demoAgent: "DEMO ENVIRONMENT · REX & Realworks calls are simulated · watch the Integration Console when you approve",
      roleBuyer: "Buyer offer form",
      roleAgent: "Agent · Emily Xiong",
      pill: "Submit your offer online",
      listingAgent: "Listing agent:",
      ref: "Ref",
      uBed: "bed", uBath: "bath", uCar: "car",
      yourOffer: "Your offer",
      intro: "Complete the details below. Your agent reviews and confirms everything before it goes any further — nothing is binding until a contract is signed.",

      buyer1: "Buyer 1",
      buyer2: "Buyer 2 (optional)",
      fullName: "Full legal name",
      email: "Email",
      mobile: "Mobile",
      resAddress: "Residential address",
      street: "Street address",
      suburb: "Suburb",
      state: "State",
      postcode: "Postcode",

      solicitor: "Buyer's solicitor / conveyancer (optional)",
      firm: "Firm",
      contactName: "Contact name",
      contactPhone: "Phone",

      offerTerms: "Offer & price",
      offerPrice: "Offer / purchase price (AUD)",
      offerDate: "Offer date",
      offerExpiry: "Offer valid until",

      depositSection: "Deposit",
      initialDeposit: "Initial deposit (AUD)",
      initialDepositDue: "Initial deposit due",
      balanceDeposit: "Balance deposit (AUD, optional)",
      balanceDepositDue: "Balance deposit due (optional)",
      dueOnSigning: "On contract signing",
      dueOnFinance: "On finance approval",
      dueOnUncond: "When unconditional",

      finance: "Finance",
      cash: "Cash / not subject to finance",
      subjectFinance: "Subject to finance",
      lender: "Lender",
      loanAmount: "Loan amount (AUD)",
      financeDate: "Finance approval by",

      bp: "Building & pest",
      bpSubject: "Subject to building & pest",
      bpWaived: "Waived",
      bpDate: "Inspection completed by",

      settlementSection: "Settlement",
      settlementDate: "Settlement date",
      settlementDays: "…or settlement period (days)",

      conditionsSection: "Conditions & inclusions",
      conditions: "Special conditions (optional)",
      conditionsPh: "e.g. subject to sale of buyer's property at 12 Smith St by 30 Aug…",
      inclusions: "Inclusions (optional)",
      inclusionsPh: "e.g. dishwasher, curtains, pool equipment, garden shed…",
      exclusions: "Exclusions (optional)",
      exclusionsPh: "e.g. wall-mounted TV brackets, potted plants…",

      choose: "Choose…",
      consent: "I confirm these details are correct and consent to LJ Hooker Property Partners contacting me about this offer.",
      submit: "Submit offer to agent →",
      submitting: "Submitting…",
      errRequired: "Please complete all required (*) fields and tick the consent box.",
      errGeneric: "Something went wrong — please try again.",
      received: "Offer received ✓",
      thanks: "Thanks {name}!",
      receivedBody: "Your offer of {price} on {address} has been sent to the listing agent.",
      refNote: "Reference {id}. The agent will review and be in touch. Nothing is binding until a contract is signed.",

      approvals: "Offer approvals",
      agentIntro: "Buyers submit via the QR form. Each offer waits here for your confirmation. Approving pushes it to REX (contact + offer) and generates a pre-filled Realworks contract.",
      refresh: "↻ Refresh",
      addSample: "+ Add sample offer",
      clearData: "Clear demo data",
      pending: "Pending",
      decided: "Decided",
      emptyPending: "No offers waiting. Open the buyer form (or scan the QR) to submit one, or click “Add sample offer”.",
      emptyDecided: "Approved & rejected offers appear here."
    },
    zh: {
      demoBuyer: "演示环境 · 仅为示例数据 · 不会生成正式合同",
      demoAgent: "演示环境 · REX 与 Realworks 调用为模拟 · 审批时请留意集成控制台",
      roleBuyer: "买家报价表",
      roleAgent: "中介 · Emily Xiong",
      pill: "在线提交您的报价",
      listingAgent: "挂牌中介：",
      ref: "编号",
      uBed: "卧", uBath: "卫", uCar: "车位",
      yourOffer: "您的报价",
      intro: "请填写以下信息。您的中介会先审核并确认所有内容 —— 在正式签署合同之前，一切均不具约束力。",

      buyer1: "买家一",
      buyer2: "买家二（可选）",
      fullName: "法定全名",
      email: "电子邮箱",
      mobile: "手机号码",
      resAddress: "居住地址",
      street: "街道地址",
      suburb: "区 / 郊区",
      state: "州",
      postcode: "邮政编码",

      solicitor: "买家律师 / 过户师（可选）",
      firm: "事务所名称",
      contactName: "联系人",
      contactPhone: "电话",

      offerTerms: "报价与价格",
      offerPrice: "报价 / 购买价（澳元）",
      offerDate: "报价日期",
      offerExpiry: "报价有效期至",

      depositSection: "定金",
      initialDeposit: "首期定金（澳元）",
      initialDepositDue: "首期定金支付时间",
      balanceDeposit: "余下定金（澳元，可选）",
      balanceDepositDue: "余下定金支付时间（可选）",
      dueOnSigning: "签署合同时",
      dueOnFinance: "贷款批准时",
      dueOnUncond: "无条件成交时",

      finance: "贷款情况",
      cash: "现金 / 无需贷款",
      subjectFinance: "需以贷款为条件",
      lender: "贷款银行",
      loanAmount: "贷款金额（澳元）",
      financeDate: "贷款批准期限",

      bp: "建筑与虫害检查",
      bpSubject: "需以建筑与虫害检查为条件",
      bpWaived: "放弃检查",
      bpDate: "检查完成期限",

      settlementSection: "交割",
      settlementDate: "交割日期",
      settlementDays: "…或交割期（天）",

      conditionsSection: "条款与包含物品",
      conditions: "特别条款（可选）",
      conditionsPh: "例如：以买家位于 12 Smith St 的房产在 8 月 30 日前售出为条件……",
      inclusions: "包含物品（可选）",
      inclusionsPh: "例如：洗碗机、窗帘、泳池设备、花园棚……",
      exclusions: "不包含物品（可选）",
      exclusionsPh: "例如：墙挂电视支架、盆栽……",

      choose: "请选择…",
      consent: "我确认以上信息准确无误，并同意 LJ Hooker Property Partners 就此报价与我联系。",
      submit: "提交报价给中介 →",
      submitting: "提交中…",
      errRequired: "请填写所有必填（*）项并勾选同意框。",
      errGeneric: "出了点问题 —— 请重试。",
      received: "报价已收到 ✓",
      thanks: "谢谢您，{name}！",
      receivedBody: "您对 {address} 的报价 {price} 已发送给挂牌中介。",
      refNote: "参考编号 {id}。中介会进行审核并与您联系。在正式签署合同之前，一切均不具约束力。",

      approvals: "报价审批",
      agentIntro: "买家通过二维码表单提交报价。每条报价都会在此等待您的确认。批准后会推送至 REX（联系人 + 报价）并生成预填的 Realworks 合同。",
      refresh: "↻ 刷新",
      addSample: "+ 添加示例报价",
      clearData: "清除演示数据",
      pending: "待处理",
      decided: "已处理",
      emptyPending: "暂无待处理报价。打开买家表单（或扫描二维码）提交一条，或点击“添加示例报价”。",
      emptyDecided: "已批准和已拒绝的报价会显示在这里。"
    }
  };

  const KEY = "offerToRex.lang";
  let cur = "en";

  function t(key, lang) { const L = STR[lang || cur] || STR.en; return (key in L) ? L[key] : (STR.en[key] ?? key); }

  function apply(lang) {
    cur = STR[lang] ? lang : "en";
    document.documentElement.setAttribute("lang", cur === "zh" ? "zh-CN" : "en");
    document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.getAttribute("data-i18n")); });
    document.querySelectorAll("[data-i18n-ph]").forEach(el => { el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph"))); });
    const tog = document.getElementById("langToggle");
    if (tog) tog.textContent = cur === "en" ? "中文" : "EN";
  }

  function setLang(lang) { try { localStorage.setItem(KEY, lang); } catch (e) {} apply(lang); if (g.onLangChange) g.onLangChange(cur); }
  function toggle() { setLang(cur === "en" ? "zh" : "en"); }

  function init() {
    const qp = new URLSearchParams(location.search).get("lang");
    let saved = null; try { saved = localStorage.getItem(KEY); } catch (e) {}
    apply(qp || saved || "en");
  }

  g.I18N = STR;
  g.t = t;
  g.applyTranslations = apply;
  g.setLang = setLang;
  g.toggleLang = toggle;
  g.initLang = init;
  g.currentLang = () => cur;
})(window);
