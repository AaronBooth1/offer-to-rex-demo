/* Bilingual support: English + Simplified Chinese (中文).
   Apply with data-i18n="key" (textContent) and data-i18n-ph="key" (placeholder).
   JS-built strings use t(key). Language is read from ?lang=, else saved choice, else 'en'. */
(function (g) {
  "use strict";

  const STR = {
    en: {
      // shared chrome
      demoBuyer: "DEMO ENVIRONMENT · sample data only · no live contract is created",
      demoAgent: "DEMO ENVIRONMENT · REX & Realworks calls are simulated · watch the Integration Console when you approve",
      roleBuyer: "Buyer offer form",
      roleAgent: "Agent · Emily Xiong",
      // offer form
      pill: "Submit your offer online",
      listingAgent: "Listing agent:",
      ref: "Ref",
      uBed: "bed", uBath: "bath", uCar: "car",
      yourOffer: "Your offer",
      intro: "Complete the details below. Your agent reviews and confirms everything before it goes any further — nothing is binding until a contract is signed.",
      buyer1: "Buyer 1",
      fullName: "Full name",
      mobile: "Mobile",
      email: "Email",
      postal: "Postal address",
      buyer2: "Buyer 2 (optional)",
      offerTerms: "Offer terms",
      offerPrice: "Offer price (AUD)",
      deposit: "Deposit (AUD)",
      finance: "Finance",
      choose: "Choose…",
      cash: "Cash / not subject to finance",
      subjectFinance: "Subject to finance",
      lender: "Lender",
      financeDays: "Finance approval (days)",
      bp: "Building & pest",
      bpSubject: "Subject to building & pest",
      bpWaived: "Waived",
      bpDays: "B&P inspection (days)",
      settlement: "Settlement (days from contract)",
      conditions: "Special conditions (optional)",
      conditionsPh: "e.g. subject to sale of buyer's existing property at 12 Smith St…",
      solicitor: "Your solicitor / conveyancer (optional)",
      firm: "Firm",
      contactPhone: "Contact phone",
      consent: "I confirm these details are correct and consent to LJ Hooker Property Partners contacting me about this offer.",
      submit: "Submit offer to agent →",
      submitting: "Submitting…",
      errRequired: "Please complete all required (*) fields and tick the consent box.",
      errGeneric: "Something went wrong — please try again.",
      received: "Offer received ✓",
      thanks: "Thanks {name}!",
      receivedBody: "Your offer of {price} on {address} has been sent to the listing agent.",
      refNote: "Reference {id}. The agent will review and be in touch. Nothing is binding until a contract is signed.",
      // agent page
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
      fullName: "全名",
      mobile: "手机号码",
      email: "电子邮箱",
      postal: "通讯地址",
      buyer2: "买家二（可选）",
      offerTerms: "报价条款",
      offerPrice: "报价金额（澳元）",
      deposit: "定金（澳元）",
      finance: "贷款情况",
      choose: "请选择…",
      cash: "现金 / 无需贷款",
      subjectFinance: "需以贷款为条件",
      lender: "贷款银行",
      financeDays: "贷款批准期（天）",
      bp: "建筑与虫害检查",
      bpSubject: "需以建筑与虫害检查为条件",
      bpWaived: "放弃检查",
      bpDays: "检查期（天）",
      settlement: "交割期（自合同起天数）",
      conditions: "特别条款（可选）",
      conditionsPh: "例如：以买家位于 12 Smith St 的现有房产售出为条件……",
      solicitor: "您的律师 / 过户师（可选）",
      firm: "事务所名称",
      contactPhone: "联系电话",
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
    // toggle button label shows the OTHER language
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
