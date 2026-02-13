// js/scripts.js (patched)
(function($){
  'use strict';

  // ===== Safety: never get stuck on the black loader screen =====
  function forceHideLoader(){
    try { $('.loader').stop(true,true).fadeOut(200); } catch(e) {}
    try { document.body && document.body.classList.add('is-loaded'); } catch(e) {}
  }
  window.forceHideLoader = forceHideLoader;
  // If anything goes wrong, hide loader anyway
  window.addEventListener('error', forceHideLoader);
  window.addEventListener('unhandledrejection', forceHideLoader);
  // Hard timeout fallback (mobile Safari can be flaky)
  setTimeout(forceHideLoader, 4000);

  $(window).on('load', function(){
    forceHideLoader();
    if (typeof WOW !== 'undefined') {
      var wow = new WOW({ offset: 150, mobile: false });
      wow.init();
    }
  });

  // Animsition
  if ($.fn.animsition) {
    $(".animsition").animsition({
      inClass: 'fade-in',
      outClass: 'fade-out',
      inDuration: 1000,
      outDuration: 700,
      linkElement: 'a.project-box',
      loading: !window.matchMedia('(max-width: 991px), (pointer: coarse)').matches,
      loadingParentElement: 'body',
      loadingClass: 'spinner',
      loadingInner: '<div class="double-bounce1"></div><div class="double-bounce2"></div>',
      timeout: true,
      timeoutCountdown: 5000,
      onLoadEvent: true,
      browser: [ 'animation-duration', '-webkit-animation-duration'],
      overlay : false,
      overlayClass : 'animsition-overlay-slide',
      overlayParentElement : 'body',
      transition: function(url){ window.location.href = url; }
    });
  }

  // ===== School Carousel (single source of truth) =====
  function initSchoolCarousel(){
    var $c = $('#schoolCarousel');
    if (!$c.length) return;

    var isMobile = window.matchMedia('(max-width: 991px), (pointer: coarse)').matches;

    // cleanup if already owl
    if ($c.hasClass('owl-loaded')) {
      $c.trigger('destroy.owl.carousel');
      $c.removeClass('owl-loaded owl-drag owl-hidden');
      $c.find('.owl-stage-outer').children().unwrap();
      $c.find('.owl-stage').children().unwrap();
      $c.find('.owl-nav, .owl-dots').remove();
    }

    if (isMobile) {
      // Mobile: native horizontal scroll
      $c.removeClass('owl-carousel')
        .addClass('is-native-scroll')
        .css('display','flex');
      return;
    }

    if (!$.fn.owlCarousel) return;

    // Desktop: owl carousel
    $c.addClass('owl-carousel')
      .removeClass('is-native-scroll')
      .css('display','block');

    $c.owlCarousel({
      loop:false,
      margin:16,
      nav:false,
      dots:false,
      autoWidth:false,
      responsive:{
        0:{ items:1 },
        768:{ items:2 },
        1200:{ items:3 }
      }
    });
  }

  // expose for inline scripts (school data render)
  window.initSchoolCarousel = initSchoolCarousel;

 // DOM 완전히 구성된 뒤 실행
window.addEventListener("load", function(){
  setTimeout(function(){
    if (window.initSchoolCarousel) {
      window.initSchoolCarousel();
    }
  }, 100);
});

document.addEventListener('schoolsReady', function(){
  if (window.initSchoolCarousel) {
    window.initSchoolCarousel();
  }
});

  window.addEventListener('resize', function(){
    initSchoolCarousel();
  });

  // ===== pagepiling: PC only, Mobile = normal scroll =====
  var isMobile = window.matchMedia('(max-width: 991px), (pointer: coarse)').matches;

  // Only init if plugin exists and not mobile
  if (!isMobile && $.fn.pagepiling && $('.pagepiling').length){
    $('.pagepiling').pagepiling({
      scrollingSpeed: 280,
      easing: 'swing',
      loopBottom: false,
      loopTop: false,
      css3: true,
      navigation: false,
      normalScrollElements: '.inq-panel, .inq-panel *',
      afterLoad: function(anchorLink, index){
        // 섹션 진입 시 캐러셀 다시 맞춤
        if (index === 2) initSchoolCarousel();
      }
    });
  } else {
    // Mobile fallback: ensure page is scrollable
    try { document.body.classList.add('is-mobile'); } catch(e) {}
  }

})(jQuery);


// ===== Korea region data (minimal, editable) =====
// 필요하면 나중에 "세종/제주" 등 더 추가하면 됨.
const KOREA_REGIONS = {
  "서울특별시": [
    "종로구","중구","용산구","성동구","광진구","동대문구","중랑구","성북구","강북구","도봉구","노원구",
    "은평구","서대문구","마포구","양천구","강서구","구로구","금천구","영등포구","동작구","관악구",
    "서초구","강남구","송파구","강동구"
  ],
  "부산광역시": [
    "중구","서구","동구","영도구","부산진구","동래구","남구","북구","해운대구","사하구","금정구",
    "강서구","연제구","수영구","사상구","기장군"
  ],
  "대구광역시": ["중구","동구","서구","남구","북구","수성구","달서구","달성군","군위군"],
  "인천광역시": ["중구","동구","미추홀구","연수구","남동구","부평구","계양구","서구","강화군","옹진군"],
  "광주광역시": ["동구","서구","남구","북구","광산구"],
  "대전광역시": ["동구","중구","서구","유성구","대덕구"],
  "울산광역시": ["중구","남구","동구","북구","울주군"],
  "세종특별자치시": ["세종시"],

  "경기도": [
    "수원시","성남시","고양시","용인시","부천시","안산시","안양시","남양주시","화성시","평택시","의정부시",
    "시흥시","파주시","김포시","광명시","광주시","군포시","오산시","이천시","안성시","의왕시","하남시",
    "포천시","양주시","동두천시","과천시","구리시","연천군","가평군","양평군"
  ],
  "강원특별자치도": [
    "춘천시","원주시","강릉시","동해시","태백시","속초시","삼척시",
    "홍천군","횡성군","영월군","평창군","정선군","철원군","화천군","양구군","인제군","고성군","양양군"
  ],
  "충청북도": ["청주시","충주시","제천시","보은군","옥천군","영동군","증평군","진천군","괴산군","음성군","단양군"],
  "충청남도": ["천안시","공주시","보령시","아산시","서산시","논산시","계룡시","당진시","금산군","부여군","서천군","청양군","홍성군","예산군","태안군"],
  "전라북도": ["전주시","군산시","익산시","정읍시","남원시","김제시","완주군","진안군","무주군","장수군","임실군","순창군","고창군","부안군"],
  "전라남도": ["목포시","여수시","순천시","나주시","광양시","담양군","곡성군","구례군","고흥군","보성군","화순군","장흥군","강진군","해남군","영암군","무안군","함평군","영광군","장성군","완도군","진도군","신안군"],
  "경상북도": ["포항시","경주시","김천시","안동시","구미시","영주시","영천시","상주시","문경시","경산시","의성군","청송군","영양군","영덕군","청도군","고령군","성주군","칠곡군","예천군","봉화군","울진군","울릉군"],
  "경상남도": ["창원시","진주시","통영시","사천시","김해시","밀양시","거제시","양산시","의령군","함안군","창녕군","고성군","남해군","하동군","산청군","함양군","거창군","합천군"],
  "제주특별자치도": ["제주시","서귀포시"]
};

function fillSelectOptions(selectEl, options, placeholderText) {
  selectEl.innerHTML = "";
  const ph = document.createElement("option");
  ph.value = "";
  ph.textContent = placeholderText;
  selectEl.appendChild(ph);

  options.forEach((opt) => {
    const o = document.createElement("option");
    o.value = opt;
    o.textContent = opt;
    selectEl.appendChild(o);
  });
}

(function initKoreaRegionSelects(){
  const sido = document.getElementById("regionSido");
  const sigungu = document.getElementById("regionSigungu");
  if (!sido || !sigungu) return;

  const sidos = Object.keys(KOREA_REGIONS);
  fillSelectOptions(sido, sidos, "도/시");
  fillSelectOptions(sigungu, [], "시/군/구");
  sigungu.disabled = true;

  sido.addEventListener("change", () => {
    const selected = sido.value;
    const list = KOREA_REGIONS[selected] || [];
    fillSelectOptions(sigungu, list, "시/군/구");
    sigungu.disabled = list.length === 0;
  });
})();

// ===============================
// Inquiry Stepper (page8) - CLEAN & WORKING
// ===============================
(function () {
  const stepper = document.getElementById('inqStepper');
  if (!stepper) return;

  const panels = stepper.querySelectorAll('.inq-panel');
  const steps  = document.querySelectorAll('.inq-steps .inq-step');

  const btnAddClass = document.getElementById('btnAddClass');
  const btnNext = document.getElementById('btnNext');
  const btnBackTo1 = document.getElementById('btnBackTo1');
  const btnGoStep3 = document.getElementById('btnGoStep3');
  const btnBackTo2 = document.getElementById('btnBackTo2');
  const form = document.getElementById('inqForm');
const sessionEl = document.getElementById('sessionCount');
const gradeEl   = document.getElementById('grade');
const startEl   = document.getElementById('classStartTime');
const endEl     = document.getElementById('classEndTime');
const timeField = document.getElementById('timeField');
const timeError = document.getElementById('timeError');
const venueTypeEl = document.getElementById('venueType');
const venueEtcWrap = document.getElementById('venueEtcWrap');
const venueEtcEl = document.getElementById('venueEtc');

venueTypeEl?.addEventListener('change', () => {
  const isEtc = venueTypeEl.value === '기타';
  if (venueEtcWrap) venueEtcWrap.style.display = isEtc ? '' : 'none';
  if (!isEtc && venueEtcEl) venueEtcEl.value = '';
});

 let currentStep = 1;
let classes = [];

function setStep(n) {
  currentStep = n;

  // 패널 표시/숨김을 class로 제어
  panels.forEach(p => {
    p.classList.remove('is-active');
    if (p.dataset.step === String(n)) {
      p.classList.add('is-active');
    }
  });

  // 상단 스텝 표시(동그라미/텍스트 active)
  steps.forEach((li, i) => {
    li.classList.toggle('is-active', i === n - 1);
  });
}

  setStep(1);

function setTimeError(msg){
  if (timeField) timeField.classList.add('is-error');
  if (timeError) timeError.textContent = msg || '';
  if (timeField){
    timeField.classList.add('shake');
    setTimeout(()=> timeField.classList.remove('shake'), 320);
    timeField.scrollIntoView({ behavior:'smooth', block:'center' });
  }
}

function clearTimeError(){
  if (timeField) timeField.classList.remove('is-error');
  if (timeError) timeError.textContent = '';
}
function toMinutes(hhmm){
  const [h,m] = (hhmm||'').split(':').map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h*60+m;
}

function toHHMM(min){
  const h = Math.floor(min/60)%24;
  const m = min%60;
  return String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0');
}

function addMinutes(hhmm, plus){
  const base = toMinutes(hhmm);
  if (base === null) return '';
  return toHHMM(base + plus);
}



let lastAutoApplied = false;

function applyRecommendedTimes(force=false){
  if (!startEl || !endEl) return;
  const { start, end } = getRecommendedTimes();
  if (!start || !end) return;

  // 사용자가 이미 직접 입력했다면 강제로 덮어쓰지 않기
  const userAlreadyTyped = (startEl.value && !lastAutoApplied) || (endEl.value && !lastAutoApplied);
  if (!force && userAlreadyTyped) return;

  // 둘 다 비었거나, 이전에 자동입력이었으면 업데이트
  if (force || (!startEl.value && !endEl.value) || lastAutoApplied){
    startEl.value = start;
    endEl.value = end;
    lastAutoApplied = true;
    clearTimeError();
  }
}

// 차시/학년 변경 시 추천시간 자동 적용
sessionEl?.addEventListener('change', () => applyRecommendedTimes(false));
gradeEl?.addEventListener('change', () => applyRecommendedTimes(false));

// 사용자가 시간 필드를 손댄 순간부터는 "수동 입력"으로 간주
startEl?.addEventListener('input', () => { lastAutoApplied = false; clearTimeError(); });
endEl?.addEventListener('input', () => { lastAutoApplied = false; clearTimeError(); });

  // -------------------
  // Step 1 helpers
  // -------------------
  function getStep1Values() {
  return {
    sido: document.getElementById('regionSido')?.value || '',
    sigungu: document.getElementById('regionSigungu')?.value || '',
    school: document.querySelector('input[placeholder="학교 이름을 입력해주세요"]')?.value.trim() || '',
    grade: document.querySelectorAll('select.inq-control')[2]?.value || '',
    classCount: document.querySelector('input[type="number"]')?.value || '',
    program: document.querySelectorAll('select.inq-control')[3]?.value || '',
    session: document.querySelectorAll('select.inq-control')[4]?.value || '',
    date: document.querySelector('input[type="date"]')?.value || '',
    startTime: document.getElementById('classStartTime')?.value || '',
    endTime: document.getElementById('classEndTime')?.value || '',
venueType: document.getElementById('venueType')?.value || '',
venueEtc: document.getElementById('venueEtc')?.value.trim() || '',
venueFloor: document.getElementById('venueFloor')?.value.trim() || '',
  };
}


function validateStep1(v) {
  // 기존 필수값 체크(시간 제외)
  if (
    !v.sido || !v.sigungu || !v.school ||
    !v.grade || !v.classCount ||
    !v.program || !v.session || !v.date ||
    !v.venueType || !v.venueFloor

  ) {
    alert('필수 항목을 모두 입력해 주세요.');
    return false;
  }
if (v.venueType === '기타' && !v.venueEtc) { alert('기타 장소명을 입력해 주세요.'); return false; }

  // ✅ 시간 UX: 미입력/논리오류는 인라인 경고로
  if (!v.startTime && !v.endTime) {
    setTimeError('시작/종료 시간을 선택해 주세요.');
    return false;
  }
  if (!v.startTime) {
    setTimeError('시작 시간을 선택해 주세요.');
    return false;
  }
  if (!v.endTime) {
    setTimeError('종료 시간을 선택해 주세요.');
    return false;
  }
  if (toMinutes(v.endTime) <= toMinutes(v.startTime)) {
    setTimeError('종료 시간은 시작 시간보다 늦어야 해요.');
    return false;
  }

  clearTimeError();
  return true;
}

 function renderClassList() {
  const wrap = document.getElementById('classListWrap');
  const list = document.getElementById('classList');
  if (!wrap || !list) return;

  // 1) 일단 비우기
  list.innerHTML = '';

  // 2) classes 배열을 돌면서 카드 만들기
  classes.forEach((c, idx) => {
    const item = document.createElement('div');
    item.className = 'class-item';

    item.innerHTML = `
      <button type="button" class="class-close" data-index="${idx}" aria-label="삭제">×</button>

      <div class="meta">
        <div class="line1">
          ${c.school} <span class="muted">(${c.sido} ${c.sigungu})</span>
        </div>
        <div class="line2">
          ${c.grade} · ${c.classCount}학급 · ${c.program} · ${c.session}차시 · ${c.date} · ${c.startTime}~${c.endTime}
        </div>
      </div>
    `;

    list.appendChild(item);
  });

  // 3) 항목이 있을 때만 보이게
  wrap.style.display = classes.length ? '' : 'none';
}
document.getElementById('classList')?.addEventListener('click', (e) => {
  const btn = e.target.closest('.class-close');
  if (!btn) return;

  const idx = Number(btn.dataset.index);
  if (Number.isNaN(idx)) return;

  classes.splice(idx, 1);
  renderClassList();
});


  // -------------------
  // Step 1 actions
  // -------------------
btnAddClass?.addEventListener('click', () => {
  const v = getStep1Values();
  if (!validateStep1(v)) return;

  classes.push(v);
  renderClassList();
});

  // -------------------
  // Step navigation
  // -------------------
  btnNext?.addEventListener('click', () => setStep(2));
  btnBackTo1?.addEventListener('click', () => setStep(1));
  btnGoStep3?.addEventListener('click', () => setStep(2));
  btnBackTo2?.addEventListener('click', () => setStep(2));
   // -------------------
// Submit (Step 3)
// -------------------
const ENDPOINT = 'https://script.google.com/macros/s/AKfycbxilT2N2scxeMZZ73xDCFvH8u1GPOiGj2AuUHx3X3oFwLet3RPLZSwQbCofeN4HKywZ/exec';

let isSubmitting = false;

form?.addEventListener('submit', async (e) => {
  e.preventDefault();

  // 3단계에서만 제출
  if (currentStep !== 2) return;

  // 연타 방지
  if (isSubmitting) return;

  // ✅ 1) payload를 여기서 만들어야 함 (지금 코드엔 이게 빠져있음)
  const name  = document.getElementById('contactName')?.value.trim();
  const phone = document.getElementById('contactPhone')?.value.trim();
  const email = document.getElementById('contactEmail')?.value.trim() || '';
  const memo  = document.getElementById('contactMemo')?.value.trim() || '';
const audioAvail = document.querySelector('input[name="audioAvail"]:checked')?.value || '';
const screenAvail = document.querySelector('input[name="screenAvail"]:checked')?.value || '';

if (!audioAvail || !screenAvail) {
  alert('음향장비/스크린 가능 여부를 선택해 주세요.');
  return;
}

  if (!name || !phone) {
    alert('담당자 성함과 연락처는 필수입니다.');
    return;
  }

  if (!classes || classes.length === 0) {
    alert('수업 정보가 비어있습니다. 1단계로 돌아가 수업을 추가해 주세요.');
    setStep(1);
    return;
  }

  // 수업 요약(시트 한 칸에 들어가도록 텍스트로)
 const equipSummary = `음향: ${audioAvail} / 스크린: ${screenAvail}`;

const classSummary =
  equipSummary + '\n' +
  classes.map((c, i) => {
    const venueLabel = (c.venueType === '기타' ? c.venueEtc : c.venueType);
    return `${i + 1}) ${c.school} / ${c.sido} ${c.sigungu} / ${c.grade} / ${c.classCount}학급 / ${c.program} / ${c.session} / ${c.date} / ${venueLabel}(${c.venueFloor})`;
  }).join('\n') + (memo ? `\n\n[추가 요청]\n${memo}` : '');


  const payload = { name, phone, email, audioAvail, screenAvail, classSummary, classes };

  const submitBtn = document.getElementById('btnSubmitInquiry');

  // 잠그기
  isSubmitting = true;
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.dataset.originalText = submitBtn.textContent;
    submitBtn.textContent = '전송 중…';
  }

  try {
    // Apps Script 웹앱으로 POST
    await fetch(ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload)
    });

    alert('문의가 접수되었습니다. 빠르게 연락드릴게요.');
    if (submitBtn) submitBtn.textContent = '접수 완료';

  } catch (err) {
    console.error(err);
    alert('전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.');

    // 실패면 다시 풀기
    isSubmitting = false;
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = submitBtn.dataset.originalText || '제출';
    }
  }
});


})();

