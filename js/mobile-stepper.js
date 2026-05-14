/* ============================================================
   MOBILE STEPPER — injected after DOM ready
   Intercepts openModal / openModalWithUnit on mobile
   ============================================================ */
(function initMobileStepper() {

  /* ── Only run on mobile ── */
  function isMob() { return window.innerWidth <= 768; }

  /* ── Build HTML ── */
  const HTML = `
<div id="mob-stepper-backdrop">
  <div id="mob-stepper-sheet">
    <div class="mst-handle"></div>
    <div class="mst-header">
      <div class="mst-header-title" data-i18n="stepper.title">Đặt lịch tham quan</div>
      <button class="mst-close" id="mst-close" data-i18n-aria="stepper.close" aria-label="Đóng">✕</button>
    </div>

    <!-- Progress steps -->
    <div class="mst-steps" id="mst-steps">
      <div class="mst-step active" data-step="1">
        <div class="mst-step-circle">1</div>
        <div class="mst-step-label" data-i18n="stepper.step1">Chọn căn</div>
      </div>
      <div class="mst-step-line" id="mst-line-1"><div class="mst-step-line-fill"></div></div>
      <div class="mst-step" data-step="2">
        <div class="mst-step-circle">2</div>
        <div class="mst-step-label" data-i18n="stepper.step2">Thông tin</div>
      </div>
      <div class="mst-step-line" id="mst-line-2"><div class="mst-step-line-fill"></div></div>
      <div class="mst-step" data-step="3">
        <div class="mst-step-circle">3</div>
        <div class="mst-step-label" data-i18n="stepper.step3">Xác nhận</div>
      </div>
    </div>

    <div class="mst-body" id="mst-body">

      <!-- ── Step 1: Chọn căn ── -->
      <div class="mst-panel active" id="mst-panel-1">
        <div class="mst-section-title" data-i18n="stepper.sectionTitle">Căn hộ quan tâm</div>
        <div class="mst-unit-filters" id="mst-type-filters"></div>
        <div class="mst-unit-list" id="mst-unit-list"></div>
        <span class="mst-skip-link" id="mst-skip-unit" data-i18n="stepper.skipUnit">Chưa chọn căn cụ thể →</span>
      </div>

      <!-- ── Step 2: Form thông tin ── -->
      <div class="mst-panel" id="mst-panel-2">
        <!-- Căn đã chọn preview -->
        <div id="mst-selected-preview" class="mst-selected-preview" style="display:none">
          <div>
            <div class="mst-preview-code" id="mst-prev-code">—</div>
            <div class="mst-preview-meta" id="mst-prev-meta">—</div>
          </div>
          <div class="mst-preview-price" id="mst-prev-price">—</div>
        </div>

        <div class="mst-form-wrap">
          <!-- Row 1: Họ tên + SĐT -->
          <div class="mst-row-2">
            <div class="mst-field">
              <label><span data-i18n="modal.name">Họ &amp; tên</span> <span class="req">*</span></label>
              <input class="mst-input" id="mst-name" type="text" data-i18n-placeholder="modal.namePh" placeholder="Nguyễn Văn A" autocomplete="name"/>
            </div>
            <div class="mst-field">
              <label><span data-i18n="modal.phone">Số điện thoại</span> <span class="req">*</span></label>
              <input class="mst-input" id="mst-phone" type="tel" data-i18n-placeholder="modal.phonePh" placeholder="09xx xxx xxx" autocomplete="tel"/>
            </div>
          </div>

          <!-- Row 2: Email + Zalo -->
          <div class="mst-row-2">
            <div class="mst-field">
              <label><span data-i18n="modal.fieldEmail">Email</span> <span class="opt" data-i18n="modal.fieldEmailOpt">(tuỳ chọn)</span></label>
              <input class="mst-input" id="mst-email" type="email" placeholder="email@example.com"/>
            </div>
            <div class="mst-field">
              <label><span data-i18n="modal.fieldZalo">Zalo</span> <span class="opt" data-i18n="modal.fieldZaloNote">(nếu khác SĐT)</span></label>
              <input class="mst-input" id="mst-zalo-field" type="tel" placeholder="09xx xxx xxx"/>
            </div>
          </div>

          <!-- Loại căn -->
          <div class="mst-field">
            <label data-i18n="modal.interest">Loại căn quan tâm</label>
            <select class="mst-input" id="mst-unit-type">
              <option value="" data-i18n="modal.selectType">— Chọn loại căn —</option>
              <option value="studio" data-i18n="modal.opt.studio">Studio</option>
              <option value="2br" data-i18n="modal.opt.2br">2 phòng ngủ</option>
              <option value="2br1" data-i18n="modal.opt.2br1">2 phòng ngủ +1</option>
              <option value="3br" data-i18n="modal.opt.3br">3 phòng ngủ</option>
              <option value="duplex" data-i18n="modal.opt.duplex">Duplex / Penthouse</option>
            </select>
          </div>

          <!-- Ngân sách -->
          <div class="mst-field">
            <label><span data-i18n="modal.fieldBudget">Ngân sách dự kiến</span> <span class="opt" data-i18n="modal.fieldEmailOpt">(tuỳ chọn)</span></label>
            <div class="mst-choice-group" id="mst-budget-group">
              <button type="button" class="mst-choice-btn" data-val="under5" data-i18n="modal.budget.under5">Dưới 5 tỷ</button>
              <button type="button" class="mst-choice-btn" data-val="5to8" data-i18n="modal.budget.5to8">5 – 8 tỷ</button>
              <button type="button" class="mst-choice-btn" data-val="8to12" data-i18n="modal.budget.8to12">8 – 12 tỷ</button>
              <button type="button" class="mst-choice-btn" data-val="over12" data-i18n="modal.budget.over12">Trên 12 tỷ</button>
            </div>
          </div>

          <!-- Mục đích -->
          <div class="mst-field">
            <label data-i18n="modal.fieldPurpose">Mục đích mua</label>
            <div class="mst-choice-group" id="mst-purpose-group">
              <button type="button" class="mst-choice-btn" data-val="live" data-i18n="modal.purpose.live">Ở thực</button>
              <button type="button" class="mst-choice-btn" data-val="invest" data-i18n="modal.purpose.invest">Đầu tư</button>
              <button type="button" class="mst-choice-btn" data-val="both" data-i18n="modal.purpose.both">Cả hai</button>
            </div>
          </div>

          <!-- Thời gian xem -->
          <div class="mst-field">
            <label data-i18n="modal.fieldTime">Thời gian muốn xem</label>
            <div class="mst-choice-group" id="mst-time-group">
              <button type="button" class="mst-choice-btn" data-val="weekend" data-i18n="modal.time.weekend">Cuối tuần</button>
              <button type="button" class="mst-choice-btn" data-val="nextweek" data-i18n="modal.time.nextweek">Tuần tới</button>
              <button type="button" class="mst-choice-btn" data-val="flexible" data-i18n="modal.time.flexible">Linh hoạt</button>
            </div>
          </div>

          <!-- Ghi chú -->
          <div class="mst-field">
            <label><span data-i18n="modal.note">Ghi chú</span> <span class="opt" data-i18n="modal.fieldEmailOpt">(tuỳ chọn)</span></label>
            <textarea class="mst-input" id="mst-note" rows="3" data-i18n-placeholder="modal.notePh" placeholder="Tôi muốn được tư vấn vào cuối tuần…" style="resize:vertical;min-height:70px"></textarea>
          </div>

          <!-- Consent -->
          <div class="mst-consent-row">
            <input type="checkbox" id="mst-consent-zalo"/>
            <label class="mst-consent-label" for="mst-consent-zalo" data-i18n-html="modal.consentZalo">
              Đồng ý nhận thông tin qua <strong>Zalo</strong>
            </label>
          </div>
          <div class="mst-consent-row">
            <input type="checkbox" id="mst-consent-sms"/>
            <label class="mst-consent-label" for="mst-consent-sms" data-i18n-html="modal.consentSms">
              Đồng ý nhận thông tin qua <strong>SMS</strong>
            </label>
          </div>

          <!-- Error -->
          <div class="mst-error" id="mst-error" style="display:none"></div>
        </div>
      </div>

      <!-- ── Step 3: Xác nhận ── -->
      <div class="mst-panel" id="mst-panel-3">
        <div class="mst-section-title" data-i18n="stepper.confirmTitle">Kiểm tra lại thông tin</div>
        <div class="mst-confirm-card" id="mst-confirm-card">
          <!-- Filled by JS -->
        </div>
        <p style="font-size:11.5px;color:rgba(245,241,232,0.4);text-align:center;line-height:1.6;margin-bottom:8px;" data-i18n-html="stepper.confirmAction">
          Nhấn <strong style="color:var(--accent)">Gửi yêu cầu</strong> để hoàn tất.<br/>
          Chúng tôi sẽ liên hệ trong <strong style="color:var(--fg)">30 phút</strong>.
        </p>
      </div>

      <!-- ── Success ── -->
      <div id="mst-success-screen" class="mst-panel" style="display:none">
        <div id="mob-stepper-success">
          <div class="mst-success-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9 12l2 2 4-4"/>
            </svg>
          </div>
          <div class="mst-success-title" data-i18n="stepper.successTitle">Đã gửi thành công!</div>
          <div class="mst-success-sub" data-i18n-html="stepper.successSub">
            Chúng tôi sẽ liên hệ lại trong <strong>vòng 30 phút</strong> trong giờ làm việc.
          </div>
          <a class="mst-success-zalo" id="mst-suc-zalo" href="https://zalo.me/0901234567" target="_blank" rel="noopener">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><text y="18" font-size="14" font-weight="bold">Z</text></svg>
            <span data-i18n="stepper.successZalo">Chat Zalo ngay</span>
          </a>
          <button class="mst-success-reset" id="mst-suc-reset" data-i18n="stepper.successReset">Gửi yêu cầu khác</button>
        </div>
      </div>

    </div><!-- /mst-body -->

    <!-- Footer nav -->
    <div class="mst-footer" id="mst-footer">
      <button class="mst-btn-back" id="mst-btn-back" style="display:none">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        <span data-i18n="stepper.back">Quay lại</span>
      </button>
      <button class="mst-btn-next" id="mst-btn-next">
        <span data-i18n="stepper.next">Tiếp theo</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </button>
    </div>
  </div>
</div>`;

  /* ── Inject HTML ── */
  document.body.insertAdjacentHTML('beforeend', HTML);
  if (window.I18n) I18n.applyStatic();

  /* ── State ── */
  let currentStep = 1;
  let selectedUnit = null; // { code, type, area, direction, floor, price, status }
  const TOTAL_STEPS = 3;

  /* ── DOM refs ── */
  const backdrop   = document.getElementById('mob-stepper-backdrop');
  const sheet      = document.getElementById('mob-stepper-sheet');
  const btnBack    = document.getElementById('mst-btn-back');
  const btnNext    = document.getElementById('mst-btn-next');
  const closeBtn   = document.getElementById('mst-close');
  const errorEl    = document.getElementById('mst-error');
  const successScr = document.getElementById('mst-success-screen');
  const footer     = document.getElementById('mst-footer');

  /* ── Build unit list from DATA ── */
  let activeTypeFilter = '';

  function buildUnitList() {
    if (!window.DATA) return;
    const units = window.DATA.floorplan.units;

    // Build type filters
    const filterWrap = document.getElementById('mst-type-filters');
    const types = [...new Set(units.map(u => u.type))];
    filterWrap.innerHTML = `<button class="mst-filter-btn active" data-t="">${I18n.t('stepper.filterAll')}</button>` +
      types.map(t => `<button class="mst-filter-btn" data-t="${t}">${t}</button>`).join('');

    filterWrap.querySelectorAll('.mst-filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        filterWrap.querySelectorAll('.mst-filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeTypeFilter = btn.dataset.t;
        renderUnitCards();
      });
    });

    renderUnitCards();
  }

  function renderUnitCards() {
    if (!window.DATA) return;
    let units = window.DATA.floorplan.units;
    if (activeTypeFilter) units = units.filter(u => u.type === activeTypeFilter);

    const list = document.getElementById('mst-unit-list');
    list.innerHTML = units.map(u => {
      const isSel = selectedUnit && selectedUnit.code === u.code;
      return `
        <div class="mst-unit-card ${isSel ? 'selected' : ''} ${u.status === 'sold' ? 'sold' : ''}"
             data-code="${u.code}" data-type="${u.type}" data-area="${u.area}"
             data-dir="${u.direction||''}" data-floor="${u.floor||''}" data-price="${u.price}"
             data-status="${u.status}">
          <div class="mst-unit-card-check">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
              <path d="M5 12l4 4L19 7"/>
            </svg>
          </div>
          <div class="mst-unit-card-body">
            <div class="mst-unit-card-code">${u.code}</div>
            <div class="mst-unit-card-meta">${I18n.tr(u.type)} · ${u.area}m² · ${I18n.t('stepper.direction')} ${u.direction||'—'} · ${I18n.t('stepper.floor')} ${u.floor||'—'}</div>
          </div>
          <div class="mst-unit-card-price">${u.price}</div>
        </div>`;
    }).join('');

    list.querySelectorAll('.mst-unit-card:not(.sold)').forEach(card => {
      card.addEventListener('click', () => {
        // Toggle
        if (selectedUnit && selectedUnit.code === card.dataset.code) {
          selectedUnit = null;
        } else {
          selectedUnit = {
            code: card.dataset.code,
            type: card.dataset.type,
            area: card.dataset.area,
            direction: card.dataset.dir,
            floor: card.dataset.floor,
            price: card.dataset.price,
            status: card.dataset.status,
          };
        }
        renderUnitCards();
      });
    });
  }

  /* ── Step rendering ── */
  function goToStep(n, direction) {
    const panels = document.querySelectorAll('.mst-panel');
    panels.forEach(p => {
      p.classList.remove('active', 'back-anim');
    });

    const target = document.getElementById(`mst-panel-${n}`);
    if (!target) return;
    if (direction === 'back') target.classList.add('back-anim');
    target.classList.add('active');

    currentStep = n;
    updateStepIndicator();
    updateFooter();
    updatePanel(n);

    // Reset scroll
    const body = document.getElementById('mst-body');
    if (body) body.scrollTop = 0;
  }

  function updateStepIndicator() {
    document.querySelectorAll('.mst-step').forEach(step => {
      const n = parseInt(step.dataset.step);
      step.classList.remove('active', 'done');
      if (n === currentStep) step.classList.add('active');
      else if (n < currentStep) step.classList.add('done');

      const circle = step.querySelector('.mst-step-circle');
      if (n < currentStep) {
        circle.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12l4 4L19 7"/></svg>`;
      } else {
        circle.textContent = n;
      }
    });

    // Lines
    for (let i = 1; i <= 2; i++) {
      const line = document.getElementById(`mst-line-${i}`);
      if (line) line.classList.toggle('done', currentStep > i);
    }
  }

  const SVG_NEXT = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`;
  const SVG_SEND = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>`;
  const SVG_BACK = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>`;

  function updateFooter() {
    btnBack.style.display = currentStep > 1 ? 'flex' : 'none';
    if (currentStep === TOTAL_STEPS) {
      btnNext.innerHTML = `${I18n.t('stepper.submit')} ${SVG_SEND}`;
    } else {
      btnNext.innerHTML = `${I18n.t('stepper.next')} ${SVG_NEXT}`;
    }
    btnBack.innerHTML = `${SVG_BACK} ${I18n.t('stepper.back')}`;
  }

  function updatePanel(n) {
    if (n === 2) {
      // Show selected unit preview
      const prev = document.getElementById('mst-selected-preview');
      if (selectedUnit) {
        prev.style.display = 'flex';
        document.getElementById('mst-prev-code').textContent = selectedUnit.code;
        document.getElementById('mst-prev-meta').textContent =
          `${I18n.tr(selectedUnit.type)} · ${selectedUnit.area}m² · ${I18n.t('stepper.direction')} ${selectedUnit.direction} · ${I18n.t('stepper.floor')} ${selectedUnit.floor}`;
        document.getElementById('mst-prev-price').textContent = selectedUnit.price;

        // Also pre-fill unit type select
        const sel = document.getElementById('mst-unit-type');
        if (sel && selectedUnit.type) {
          const typeMap = { '2PN': '2br', '2PN+1': '2br1', '3PN': '3br', 'Duplex 3PN': 'duplex' };
          const val = typeMap[selectedUnit.type] || '';
          if (val) sel.value = val;
        }
      } else {
        prev.style.display = 'none';
      }
    }

    if (n === 3) {
      buildConfirmCard();
    }
  }

  function buildConfirmCard() {
    const card = document.getElementById('mst-confirm-card');
    const name = (document.getElementById('mst-name')?.value || '').trim();
    const phone = (document.getElementById('mst-phone')?.value || '').trim();
    const email = (document.getElementById('mst-email')?.value || '').trim();
    const zaloF = (document.getElementById('mst-zalo-field')?.value || '').trim();
    const note  = (document.getElementById('mst-note')?.value || '').trim();
    const budget = document.querySelector('#mst-budget-group .mst-choice-btn.selected')?.textContent || '—';
    const purpose = document.querySelector('#mst-purpose-group .mst-choice-btn.selected')?.textContent || '—';
    const timing = document.querySelector('#mst-time-group .mst-choice-btn.selected')?.textContent || '—';
    const conZalo = document.getElementById('mst-consent-zalo')?.checked;
    const conSms  = document.getElementById('mst-consent-sms')?.checked;

    let unitSection = '';
    if (selectedUnit) {
      unitSection = `
        <div class="mst-confirm-section">
          <div class="mst-confirm-label">${I18n.t('stepper.confirm.unitSelected')}</div>
          <div class="mst-confirm-unit-code">${selectedUnit.code}</div>
          <div class="mst-confirm-unit-meta">${I18n.tr(selectedUnit.type)} · ${selectedUnit.area}m² · ${I18n.t('stepper.direction')} ${selectedUnit.direction} · ${I18n.t('stepper.floor')} ${selectedUnit.floor}</div>
          <div class="mst-confirm-unit-price">${selectedUnit.price}</div>
        </div>`;
    }

    const consents = [];
    if (conZalo) consents.push('<span class="mst-ctag">Zalo</span>');
    if (conSms)  consents.push('<span class="mst-ctag">SMS</span>');

    card.innerHTML = `
      ${unitSection}
      <div class="mst-confirm-section">
        <div class="mst-confirm-label">${I18n.t('stepper.confirm.contactInfo')}</div>
        <div class="mst-confirm-row">
          <span class="mst-confirm-row-label">${I18n.t('stepper.confirm.name')}</span>
          <span class="mst-confirm-row-val">${name || '—'}</span>
        </div>
        <div class="mst-confirm-row">
          <span class="mst-confirm-row-label">${I18n.t('stepper.confirm.phone')}</span>
          <span class="mst-confirm-row-val">${phone || '—'}</span>
        </div>
        ${email ? `<div class="mst-confirm-row"><span class="mst-confirm-row-label">${I18n.t('modal.fieldEmail')}</span><span class="mst-confirm-row-val">${email}</span></div>` : ''}
        ${zaloF ? `<div class="mst-confirm-row"><span class="mst-confirm-row-label">${I18n.t('modal.fieldZalo')}</span><span class="mst-confirm-row-val">${zaloF}</span></div>` : ''}
      </div>
      <div class="mst-confirm-section">
        <div class="mst-confirm-label">${I18n.t('stepper.confirm.request')}</div>
        <div class="mst-confirm-row">
          <span class="mst-confirm-row-label">${I18n.t('stepper.confirm.budget')}</span>
          <span class="mst-confirm-row-val">${budget}</span>
        </div>
        <div class="mst-confirm-row">
          <span class="mst-confirm-row-label">${I18n.t('stepper.confirm.purpose')}</span>
          <span class="mst-confirm-row-val">${purpose}</span>
        </div>
        <div class="mst-confirm-row">
          <span class="mst-confirm-row-label">${I18n.t('stepper.confirm.time')}</span>
          <span class="mst-confirm-row-val">${timing}</span>
        </div>
        ${note ? `<div class="mst-confirm-row"><span class="mst-confirm-row-label">${I18n.t('stepper.confirm.note')}</span><span class="mst-confirm-row-val">${note}</span></div>` : ''}
        ${consents.length ? `<div class="mst-confirm-row" style="align-items:center"><span class="mst-confirm-row-label">${I18n.t('stepper.confirm.contacts')}</span><div class="mst-consent-tags">${consents.join('')}</div></div>` : ''}
      </div>`;
  }

  /* ── Validation ── */
  function validateStep2() {
    const name  = document.getElementById('mst-name')?.value.trim();
    const phone = document.getElementById('mst-phone')?.value.trim();
    if (!name || !phone) {
      showError(I18n.t('modal.errRequired'));
      return false;
    }
    const phoneRe = /^(0|\+84)[0-9]{8,10}$/;
    if (!phoneRe.test(phone.replace(/\s/g, ''))) {
      showError(I18n.t('modal.errPhone'));
      return false;
    }
    hideError();
    return true;
  }

  function showError(msg) {
    errorEl.textContent = msg;
    errorEl.style.display = '';
    errorEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
  function hideError() { errorEl.style.display = 'none'; }

  /* ── Submit ── */
  function submit() {
    const name  = document.getElementById('mst-name')?.value.trim();
    const phone = document.getElementById('mst-phone')?.value.trim();
    const email = document.getElementById('mst-email')?.value.trim();
    const zaloF = document.getElementById('mst-zalo-field')?.value.trim();
    const note  = document.getElementById('mst-note')?.value.trim();
    const budget = document.querySelector('#mst-budget-group .mst-choice-btn.selected')?.dataset.val;
    const purpose = document.querySelector('#mst-purpose-group .mst-choice-btn.selected')?.dataset.val;
    const timing = document.querySelector('#mst-time-group .mst-choice-btn.selected')?.dataset.val;
    const conZalo = document.getElementById('mst-consent-zalo')?.checked;
    const conSms  = document.getElementById('mst-consent-sms')?.checked;
    const unitType = document.getElementById('mst-unit-type')?.value;

    const payload = {
      name, phone, email, zalo: zaloF,
      unitCode: selectedUnit?.code || null,
      unitType: selectedUnit?.type || unitType || null,
      budget, purpose, timing, note,
      consentZalo: conZalo, consentSms: conSms,
      source: 'vr360-mobile-stepper',
      timestamp: new Date().toISOString(),
    };
    console.log('[Aurora CRM] Mobile stepper payload:', payload);

    btnNext.classList.add('loading');
    btnNext.textContent = I18n.t('modal.sending');

    setTimeout(() => {
      btnNext.classList.remove('loading');
      // Show success
      document.querySelectorAll('.mst-panel').forEach(p => { p.classList.remove('active'); p.style.display = 'none'; });
      const sucScr = document.getElementById('mst-success-screen');
      sucScr.style.display = 'block';
      sucScr.classList.add('active');
      footer.style.display = 'none';

      // Update Zalo link
      const zaloNum = (zaloF || phone || '0901234567').replace(/\s/g, '');
      const zaloLink = document.getElementById('mst-suc-zalo');
      if (zaloLink) zaloLink.href = `https://zalo.me/${zaloNum}`;

      // Sync to desktop form too
      syncToDesktopForm(payload);
    }, 900);
  }

  /* Sync data to desktop form (in case user switches to desktop view) */
  function syncToDesktopForm(p) {
    try {
      const setVal = (id, val) => { const el = document.getElementById(id); if (el && val) el.value = val; };
      setVal('cf-name', p.name);
      setVal('cf-phone', p.phone);
      setVal('cf-email', p.email);
      setVal('cf-zalo', p.zalo);
      setVal('cf-note', p.note);
    } catch(e) {}
  }

  /* ── Reset ── */
  function resetStepper() {
    selectedUnit = null;
    activeTypeFilter = '';
    currentStep = 1;

    // Reset form fields
    ['mst-name','mst-phone','mst-email','mst-zalo-field','mst-note'].forEach(id => {
      const el = document.getElementById(id); if (el) el.value = '';
    });
    const uType = document.getElementById('mst-unit-type');
    if (uType) uType.selectedIndex = 0;
    document.querySelectorAll('.mst-choice-btn.selected').forEach(b => b.classList.remove('selected'));
    document.getElementById('mst-consent-zalo').checked = false;
    document.getElementById('mst-consent-sms').checked = false;
    hideError();

    // Reset panels
    const sucScr = document.getElementById('mst-success-screen');
    sucScr.style.display = 'none';
    sucScr.classList.remove('active');
    footer.style.display = 'flex';

    document.querySelectorAll('.mst-panel').forEach(p => {
      p.classList.remove('active', 'back-anim');
      p.style.display = '';
    });

    goToStep(1);
    buildUnitList();
  }

  /* ── Open / Close ── */
  function openStepper(preselectedCode, preselectedType) {
    if (!isMob()) return false; // desktop uses original modal

    backdrop.style.display = 'flex';
    requestAnimationFrame(() => backdrop.classList.add('open'));
    document.body.style.overflow = 'hidden';

    // Build units (wait for DATA)
    if (window.DATA) {
      buildUnitList();
      if (preselectedCode) {
        const u = window.DATA.floorplan.units.find(x => x.code === preselectedCode);
        if (u) {
          selectedUnit = {
            code: u.code, type: u.type, area: u.area,
            direction: u.direction || '—', floor: u.floor || '—',
            price: u.price, status: u.status,
          };
          renderUnitCards();
          // Skip step 1, go to step 2
          goToStep(2);
          return true;
        }
      }
    } else {
      // DATA not loaded yet — poll then render
      const poll = setInterval(() => {
        if (window.DATA) {
          clearInterval(poll);
          buildUnitList();
          if (preselectedCode) {
            const u = window.DATA.floorplan.units.find(x => x.code === preselectedCode);
            if (u) {
              selectedUnit = {
                code: u.code, type: u.type, area: u.area,
                direction: u.direction || '—', floor: u.floor || '—',
                price: u.price, status: u.status,
              };
              renderUnitCards();
              goToStep(2);
              return;
            }
          }
          // re-render step 1 with data
          goToStep(1);
        }
      }, 100);
    }

    goToStep(1);
    return true;
  }

  function closeStepper() {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => {
      backdrop.style.display = 'none';
    }, 380);
  }

  /* ── Button handlers ── */
  closeBtn.addEventListener('click', closeStepper);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop) closeStepper();
  });

  document.getElementById('mst-skip-unit')?.addEventListener('click', () => {
    selectedUnit = null;
    goToStep(2, 'forward');
  });

  btnBack.addEventListener('click', () => {
    if (currentStep > 1) goToStep(currentStep - 1, 'back');
  });

  btnNext.addEventListener('click', () => {
    if (currentStep === 1) {
      goToStep(2, 'forward');
    } else if (currentStep === 2) {
      if (!validateStep2()) return;
      goToStep(3, 'forward');
    } else if (currentStep === TOTAL_STEPS) {
      submit();
    }
  });

  document.getElementById('mst-suc-reset')?.addEventListener('click', resetStepper);

  /* ── Single-select choice buttons ── */
  document.querySelectorAll('.mst-choice-group').forEach(group => {
    group.querySelectorAll('.mst-choice-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        group.querySelectorAll('.mst-choice-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
      });
    });
  });

  /* ── Intercept openModal / openModalWithUnit on mobile ── */
  // Wait until main.js has run, then wrap
  const _interceptDelay = setInterval(() => {
    if (typeof window.openModal !== 'undefined' || typeof window.openModalWithUnit !== 'undefined') {
      clearInterval(_interceptDelay);

      // Wrap openModal (generic booking btn)
      const _origOpenModal = window.openModal;
      window.openModal = function() {
        if (isMob()) { openStepper(); return; }
        _origOpenModal && _origOpenModal.apply(this, arguments);
      };

      // Wrap openModalWithUnit (from unit table "Quan tâm")
      const _origOpenModalWithUnit = window.openModalWithUnit;
      window.openModalWithUnit = function(code, type) {
        if (isMob()) { openStepper(code, type); return; }
        _origOpenModalWithUnit && _origOpenModalWithUnit.apply(this, arguments);
      };
    }
  }, 50);

  // Also intercept direct button clicks that don't go through openModal()
  document.addEventListener('click', (e) => {
    if (!isMob()) return;
    const btn = e.target.closest('#open-modal, #open-modal-2, #mob-book-btn');
    if (btn) {
      e.stopImmediatePropagation();
      openStepper();
    }
  }, true); // capture phase to run before existing listeners

  // Swipe down to close
  let touchStartY = 0;
  sheet.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  sheet.addEventListener('touchmove', (e) => {
    const dy = e.touches[0].clientY - touchStartY;
    if (dy > 60) closeStepper();
  }, { passive: true });

  /* ── Re-render dynamic content on language change ── */
  window.addEventListener('langchange', () => {
    updateFooter();
    if (backdrop.style.display === 'flex') {
      buildUnitList();
      if (currentStep === 2) updatePanel(2);
      if (currentStep === 3) buildConfirmCard();
    }
  });

  /* ── Expose for external use ── */
  window.MobStepper = { open: openStepper, close: closeStepper, reset: resetStepper };

})();