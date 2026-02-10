const envelopeWrapper = document.querySelector('.envelope-wrapper');
const envelope = document.getElementById('envelope');
const seal = document.querySelector('.wax-seal');
const letterHandle = document.getElementById('letter-handle');
const letterContent = document.getElementById('letter-content');

// 1. 왁스 클릭 시 봉투 열기
seal.addEventListener('click', () => {
  envelope.classList.add('open');
  // 열릴 때는 가볍게 금가루 뿌리기
  confetti({
    particleCount: 80,
    spread: 60,
    origin: { y: 0.6 },
    colors: ['#FFD700', '#FFFFFF'], // 골드 & 화이트
    zIndex: 100,
  });
});

// 졸업 축하 폭죽 함수 (별 + 골드/실버/네이비)
function shootGraduationConfetti() {
  const defaults = {
    spread: 360,
    ticks: 100,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    shapes: ['star', 'circle'], // 별과 원 모양
    colors: ['#FFD700', '#C0C0C0', '#2c3e50', '#ffffff'], // 골드, 실버, 네이비, 화이트
    zIndex: 2000,
  };
  confetti({ ...defaults, particleCount: 40, scalar: 1.2, origin: { y: 0.5 } });
}

// 2. 드래그 로직 (마우스 + 터치 공용)
let isDragging = false;
let startY = 0;
let savedY = 0;
let isFinished = false;
let lastVibrateY = 0;

function startDrag(clientY) {
  if (!envelope.classList.contains('open') || isFinished) return;
  if (navigator.vibrate) navigator.vibrate(10);
  isDragging = true;
  startY = clientY;
  letterHandle.style.cursor = 'grabbing';
  letterHandle.style.transition = 'none';
}

function onDrag(clientY) {
  if (!isDragging || isFinished) return;
  const deltaY = clientY - startY;
  // 너무 많이 당겨지지 않도록 제한 (-350px)
  const newY = Math.min(0, Math.max(-350, savedY + deltaY));
  letterHandle.style.transform = `translateX(-50%) translateY(${newY}px)`;

  // 진동 피드백
  if (Math.abs(newY - lastVibrateY) > 40) {
    if (navigator.vibrate) navigator.vibrate(20);
    lastVibrateY = newY;
  }

  // 충분히 당겼을 때 트리거 (-200px)
  if (newY < -200) {
    if (navigator.vibrate) navigator.vibrate(40);
    isDragging = false;
    isFinished = true;

    // 봉투와 손잡이 숨기기
    envelopeWrapper.classList.add('hidden');
    letterHandle.classList.add('hidden');

    // 졸업 축하 폭죽 4연발
    setTimeout(shootGraduationConfetti, 0);
    setTimeout(shootGraduationConfetti, 200);
    setTimeout(shootGraduationConfetti, 400);
    setTimeout(shootGraduationConfetti, 600);

    // 학위증 본문 등장
    setTimeout(() => {
      letterContent.classList.add('show');
    }, 700);
  }
}

function endDrag(clientY) {
  if (!isDragging) return;
  isDragging = false;
  letterHandle.style.cursor = 'grab';
  const deltaY = clientY - startY;
  savedY = Math.min(0, Math.max(-350, savedY + deltaY));
  letterHandle.style.transition = 'transform 0.3s ease-out';
}

// --- 이벤트 리스너 ---
letterHandle.addEventListener('mousedown', (e) => startDrag(e.clientY));
window.addEventListener('mousemove', (e) => onDrag(e.clientY));
window.addEventListener('mouseup', (e) => endDrag(e.clientY));

// 모바일 터치
letterHandle.addEventListener(
  'touchstart',
  (e) => {
    if (e.cancelable) e.preventDefault();
    startDrag(e.touches[0].clientY);
  },
  { passive: false }
);
window.addEventListener(
  'touchmove',
  (e) => {
    if (!isDragging) return;
    if (e.cancelable) e.preventDefault();
    onDrag(e.touches[0].clientY);
  },
  { passive: false }
);
window.addEventListener('touchend', (e) => {
  endDrag(e.changedTouches[0].clientY);
});
