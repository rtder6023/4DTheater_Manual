export const chapters = [
  {
    id: "overview",
    num: "Chapter 1",
    title: "시스템 개요",
    intro:
      "4DX 키오스크는 별도의 회원가입·로그인 없이, 고객이 화면 앞에 서서 상영 시간표를 확인하고 좌석을 선택해 즉시 예약·출력까지 마치는 무인 발권 시스템입니다.",
    body: `
      <ul>
        <li>여러 대의 키오스크를 매장에 동시에 설치해도, 좌석 현황이 실시간으로 서로 공유됩니다 (한 대에서 좌석을 고르면 다른 기기에서 즉시 회색으로 비활성화).</li>
        <li>예약이 끝나면 화면에 QR코드가 뜨고, 연결된 영수증(열전사) 프린터로 티켓이 자동 출력됩니다.</li>
        <li><code>/admin</code> 주소로 들어가는 별도의 관리자 페이지에서 상영 스케줄 관리, 방문 통계 확인, 예약 취소, 좌석 판매 금지 처리를 할 수 있습니다.</li>
      </ul>
      <div class="callout">
        <span class="callout-label">알아두기</span>
        <p>결제 기능은 포함되어 있지 않습니다. 좌석을 고르고 확인을 누르면 바로 예약이 확정되는 방식입니다 (매표소에서 별도로 결제를 받는 운영 방식을 전제로 합니다).</p>
      </div>
    `,
  },
  {
    id: "requirements",
    num: "Chapter 2",
    title: "준비물",
    intro: "설치를 시작하기 전에 아래 항목을 먼저 준비해 주세요.",
    body: `
      <div class="table-wrap">
        <table>
          <thead><tr><th>항목</th><th>필요한 이유 / 조건</th></tr></thead>
          <tbody>
            <tr><td><strong>키오스크용 PC</strong></td><td>Windows 또는 macOS. 터치스크린 또는 마우스로 조작 가능한 화면</td></tr>
            <tr><td><strong>브라우저</strong></td><td><strong>Chrome 또는 Edge 필수.</strong> 영수증 프린터 연결에 쓰이는 Web Serial 기능이 이 두 브라우저에만 있어 Safari·Firefox에서는 인쇄가 동작하지 않습니다.</td></tr>
            <tr><td><strong>Node.js 18 이상</strong></td><td>설치 프로그램을 내려받아 실행하는 컴퓨터에 필요 (키오스크 자체에는 빌드 후 결과물만 올려도 됨)</td></tr>
            <tr><td><strong>영수증(열전사) 프린터</strong></td><td>Epson 호환 모델, USB로 연결 시 시리얼 포트로 인식되는 제품, 통신속도 38400bps</td></tr>
            <tr><td><strong>인터넷 연결</strong></td><td>좌석 실시간 동기화(Firebase)에 필요 — 끊기면 좌석 선택이 다른 기기와 동기화되지 않습니다</td></tr>
            <tr><td><strong>웹캠 (관리자용)</strong></td><td>예약 취소 시 QR코드를 스캔할 때 사용. 내장캠 또는 USB캠 모두 가능</td></tr>
            <tr><td><strong>Firebase 계정</strong></td><td>구글 계정으로 무료(Spark) 요금제 사용 가능</td></tr>
          </tbody>
        </table>
      </div>
    `,
  },
  {
    id: "install",
    num: "Chapter 3",
    title: "프로그램 설치",
    intro:
      "소스 코드를 내려받아 필요한 구성요소를 설치합니다. 터미널(명령 프롬프트)을 사용합니다.",
    divider: true,
    body: `
      <ol class="steps">
        <li><div><strong>프로젝트 폴더 받기</strong><span class="step-body">전달받은 zip 파일을 풀거나, git으로 저장소를 내려받아 원하는 폴더에 둡니다.</span></div></li>
        <li><div><strong>터미널에서 폴더로 이동</strong><span class="step-body">아래 명령어의 경로 부분을 실제 폴더 위치로 바꿔 입력합니다.</span></div></li>
        <li><div><strong>필요한 구성요소 설치</strong><span class="step-body">아래 명령어 한 줄이면 필요한 모든 라이브러리가 자동으로 설치됩니다. 인터넷 상태에 따라 1~5분 정도 걸립니다.</span></div></li>
      </ol>
      <pre><code>cd theather4DX
npm install</code></pre>
      <p class="code-caption">설치 도중 붉은 글씨(경고)가 조금 나와도 정상입니다. 빨간 <code>error</code>로 멈추지만 않으면 문제 없습니다.</p>
    `,
  },
  {
    id: "firebase",
    num: "Chapter 4",
    title: "Firebase 설정 (좌석 실시간 동기화)",
    intro:
      "여러 키오스크가 좌석 현황을 실시간으로 공유하려면 Google의 Firebase(Firestore) 데이터베이스가 필요합니다. 무료 요금제로 충분합니다.",
    body: `
      <ol class="steps">
        <li><div><strong>Firebase 콘솔에서 새 프로젝트 만들기</strong><span class="step-body">구글 계정으로 Firebase 콘솔에 접속해 "프로젝트 추가"를 누르고 이름을 정합니다 (예: <code>4dx-kiosk</code>).</span></div></li>
        <li><div><strong>Firestore Database 활성화</strong><span class="step-body">왼쪽 메뉴 Build → Firestore Database → "데이터베이스 만들기"를 눌러 생성합니다. 지역은 서울(asia-northeast3)을 권장합니다.</span></div></li>
        <li><div><strong>웹 앱 등록 후 설정값 복사</strong><span class="step-body">프로젝트 설정(톱니바퀴) → 일반 → "내 앱" → 웹 아이콘(&lt;/&gt;)으로 앱을 등록하면 <code>apiKey</code>, <code>projectId</code> 등 설정값이 표시됩니다. 이 값을 5장에서 그대로 사용합니다.</span></div></li>
        <li><div><strong>Firestore 보안 규칙 설정</strong><span class="step-body">키오스크는 로그인이 없는 구조라서, 아래 규칙처럼 <code>seatSessions</code>와 <code>config</code> 컬렉션에 한해 인증 없이 읽고 쓸 수 있도록 열어줘야 합니다. Firestore → 규칙 탭에서 붙여넣고 게시합니다.</span></div></li>
        <li><div><strong>관리자 계정 만들기 (Authentication)</strong><span class="step-body">왼쪽 메뉴 Build → Authentication → "시작하기" → 로그인 방법에서 "이메일/비밀번호"를 사용 설정합니다. 이어서 Users 탭 → "사용자 추가"에서 관리자로 쓸 이메일과 비밀번호를 등록합니다. 이 이메일·비밀번호가 9장의 <code>/admin</code> 로그인 계정이 됩니다 (직원마다 계정을 따로 만들어도 됩니다).</span></div></li>
      </ol>
      <pre><code>match /seatSessions/{docId} {
  allow read, write: if true;
}
match /config/{docId} {
  allow read, write: if true;
}</code></pre>
      <div class="callout warning">
        <span class="callout-label">보안 주의</span>
        <p>이 규칙은 매장 키오스크 전용으로 만든 별도의 Firebase 프로젝트에만 적용하세요. 로그인 없이 누구나 값을 바꿀 수 있는 구조이므로, 회원 정보·결제 정보 등 민감한 데이터가 있는 프로젝트와는 절대 함께 쓰지 마세요.</p>
      </div>
      <p class="appendix-note"><code>config/schedule</code> 문서에 상영 스케줄이 저장됩니다. 문서가 아직 없으면 앱이 자동으로 기본 스케줄을 보여주고, 관리자 페이지에서 저장하는 순간 Firestore에 생성됩니다.</p>
    `,
  },
  {
    id: "env",
    num: "Chapter 5",
    title: "환경변수 설정",
    intro:
      "4장에서 복사한 Firebase 설정값을 .env.local 파일에 넣어줍니다. 이 파일은 프로젝트 폴더 맨 위(최상위)에 새로 만듭니다.",
    body: `
      <ol class="steps">
        <li><div><strong><code>.env.example</code> 파일을 복사</strong><span class="step-body">같은 폴더에 <code>.env.local</code>이라는 이름으로 복사본을 만듭니다.</span></div></li>
        <li><div><strong>Firebase 값 채워넣기</strong><span class="step-body">4장에서 복사해둔 6개 값을 <code>=</code> 뒤에 붙여넣습니다.</span></div></li>
      </ol>
      <pre><code>VITE_FIREBASE_API_KEY=여기에_붙여넣기
VITE_FIREBASE_AUTH_DOMAIN=여기에_붙여넣기
VITE_FIREBASE_PROJECT_ID=여기에_붙여넣기
VITE_FIREBASE_STORAGE_BUCKET=여기에_붙여넣기
VITE_FIREBASE_MESSAGING_SENDER_ID=여기에_붙여넣기
VITE_FIREBASE_APP_ID=여기에_붙여넣기</code></pre>
      <div class="callout">
        <span class="callout-label">참고</span>
        <p>관리자 페이지 로그인 비밀번호는 이 파일이 아니라 4장에서 Firebase Authentication에 등록한 계정으로 관리됩니다. 계정을 추가·삭제하거나 비밀번호를 바꿀 때는 빌드를 다시 할 필요 없이 Firebase 콘솔에서 바로 반영됩니다.</p>
      </div>
    `,
  },
  {
    id: "run",
    num: "Chapter 6",
    title: "실행 및 배포",
    body: `
      <h3>테스트로 실행해보기</h3>
      <p>설정이 잘 됐는지 확인할 때는 개발 서버로 켜봅니다.</p>
      <pre><code>npm run dev</code></pre>
      <p class="code-caption">터미널에 표시되는 <code>http://localhost:5173</code> 같은 주소를 브라우저(Chrome/Edge)로 열면 됩니다.</p>
      <h3>실제 매장에 올릴 결과물 만들기</h3>
      <p>키오스크에 실제로 띄울 때는 아래 명령으로 최적화된 결과물을 만듭니다.</p>
      <pre><code>npm run build</code></pre>
      <p>실행하면 <code>dist</code>라는 폴더가 생기는데, 이 폴더 안의 파일들을 정적 웹서버(또는 사내 호스팅)에 올려 키오스크 브라우저가 그 주소로 접속하게 하면 됩니다.</p>
      <div class="callout good">
        <span class="callout-label">키오스크 화면으로 쓸 때 팁</span>
        <p>Chrome에서 <code>F11</code>(전체화면) 또는 키오스크 모드(<code>--kiosk</code> 실행 옵션)로 띄우면 주소창 없이 매장용 화면으로 사용할 수 있습니다.</p>
      </div>
    `,
  },
  {
    id: "printer",
    num: "Chapter 7",
    title: "영수증 프린터 연결",
    intro:
      "예약이 끝나면 좌석 정보와 QR코드가 담긴 영수증이 자동으로 출력됩니다. 처음 한 번만 아래 절차로 프린터를 연결하면 됩니다.",
    body: `
      <ol class="steps">
        <li><div><strong>프린터를 USB로 PC에 연결</strong><span class="step-body">전원을 켠 상태에서 키오스크 PC와 USB로 연결합니다. (내부적으로 시리얼/COM 포트로 인식됩니다)</span></div></li>
        <li><div><strong>첫 예약을 완료해 인쇄를 한 번 시도</strong><span class="step-body">완료 화면에 도달하면 자동으로 인쇄가 시도되면서, 브라우저가 "포트 선택" 팝업을 띄웁니다.</span></div></li>
        <li><div><strong>목록에서 프린터를 선택하고 연결</strong><span class="step-body">팝업 목록에 뜬 포트(보통 프린터 모델명 또는 USB 시리얼 이름)를 선택하고 "연결"을 누릅니다.</span></div></li>
      </ol>
      <div class="callout good">
        <span class="callout-label">이후에는 자동</span>
        <p>한 번 허용하면 같은 브라우저·같은 기기에서는 다음 예약부터 팝업 없이 자동으로 인쇄됩니다. 브라우저 데이터(사이트 데이터)를 지우면 이 허용 정보도 사라져 다시 포트를 선택해야 합니다.</p>
      </div>
      <h3>인쇄 사양 (참고용)</h3>
      <div class="table-wrap">
        <table>
          <tbody>
            <tr><th>프린터 종류</th><td>Epson 호환 (ESC/POS 계열)</td></tr>
            <tr><th>통신 속도</th><td class="mono">38400 bps</td></tr>
            <tr><th>연결 방식</th><td>USB (시리얼 포트로 인식)</td></tr>
            <tr><th>문자 인코딩</th><td>한국어(Korean) 지원 설정</td></tr>
            <tr><th>출력 내용</th><td>매장명, 예약일자, 시작시간, 선택 좌석, QR코드, 발행 시각</td></tr>
          </tbody>
        </table>
      </div>
    `,
  },
  {
    id: "kiosk-usage",
    num: "Chapter 8",
    title: "고객용 키오스크 사용법",
    intro:
      "고객이 실제로 화면 앞에서 겪는 순서입니다. 매장 안내 시 참고하세요.",
    divider: true,
    body: `
      <ol class="steps">
        <li><div><strong>홈 화면</strong><span class="step-body">현재 시각이 표시되고, "START" 버튼을 누르면 시작됩니다.</span></div></li>
        <li><div><strong>상영 시간표 선택</strong><span class="step-body"><strong>오늘 상영하는 회차만</strong> 목록에 나타나며 30초마다 자동 새로고침됩니다. 이미 지난 회차는 흐리게 표시되어 선택할 수 없습니다.</span></div></li>
        <li><div><strong>좌석 선택</strong><span class="step-body">총 92석(A~F열)이 표시됩니다. 좌석을 누르면 <strong>2분간</strong> 임시로 배정(hold)되어 다른 키오스크에서는 "다른 창에서 선택 중"으로 비활성화됩니다. 2분 안에 예약을 마치지 않으면 자동으로 풀립니다.</span></div></li>
        <li><div><strong>예약 확인</strong><span class="step-body">선택한 좌석 목록을 다시 보여주는 팝업에서 "확인"을 누르면 예약이 즉시 확정됩니다. 그 사이 다른 손님이 같은 좌석을 먼저 예약했다면 해당 좌석만 빠지고 안내 메시지가 뜹니다.</span></div></li>
        <li><div><strong>완료 &amp; 영수증 출력</strong><span class="step-body">예약 완료 화면에 QR코드가 뜨고, 연결된 프린터로 영수증이 자동 출력됩니다(1회만). "처음으로"를 누르면 다음 손님을 위해 초기화됩니다.</span></div></li>
      </ol>
      <h3>좌석 화면 색상 안내</h3>
      <div class="legend-row">
        <span class="legend-chip"><span class="swatch" style="background:#3f8ce0"></span>선택 가능</span>
        <span class="legend-chip"><span class="swatch" style="background:#c94b4b"></span>예약됨</span>
        <span class="legend-chip"><span class="swatch" style="background:#e8b568"></span>내가 선택함</span>
        <span class="legend-chip"><span class="swatch" style="background:#9aa3b0"></span>이용 불가 (금지/타 기기 선택 중)</span>
      </div>
      <div class="callout">
        <span class="callout-label">QR코드에 담긴 정보</span>
        <p>영수증의 QR코드는 <strong>예약일자 + 회차 + 좌석 + 인원수</strong>를 담고 있습니다. 고객이 직접 취소하는 기능은 없고, 이 QR코드는 매장 직원이 관리자 페이지에서 스캔해 취소할 때 사용합니다 (9장 참고).</p>
      </div>
    `,
  },
  {
    id: "admin-usage",
    num: "Chapter 9",
    title: "관리자 페이지 사용법",
    intro:
      "브라우저에서 키오스크 주소 뒤에 /admin을 붙여 접속합니다. 4장에서 Firebase Authentication에 등록한 관리자 이메일과 비밀번호로 로그인하면 아래 4개 탭이 나타납니다.",
    body: `
      <div class="card-grid">
        <div class="card">
          <div class="card-title">스케줄 관리 <span class="card-tag">SCHEDULE</span></div>
          <ul>
            <li>영화별 상영 시간표를 표로 확인·수정</li>
            <li>요일·시간 변경, 회차 삭제, 새 회차 추가</li>
            <li>"기본 스케줄 복원"으로 초기값 되돌리기</li>
            <li>저장 즉시 모든 키오스크 화면에 실시간 반영</li>
          </ul>
        </div>
        <div class="card">
          <div class="card-title">방문인원 통계 <span class="card-tag">STATS</span></div>
          <ul>
            <li>날짜별 조회 또는 "전체 보기"</li>
            <li>방문객 수 · 총 예약 건수 · 현재 예약 좌석 수 카드</li>
            <li>날짜별·영화별 방문자 표</li>
            <li>최근 예약 50건 내역 (시간, 영화, 회차, 좌석, 인원)</li>
          </ul>
        </div>
        <div class="card">
          <div class="card-title">예약 취소 <span class="card-tag">RESERVATIONS</span></div>
          <ul>
            <li>예약이 있는 세션(회차)별 목록과 좌석 확인</li>
            <li>좌석 칩의 ✕ 버튼으로 개별 취소</li>
            <li>"전체 취소"로 해당 회차 일괄 취소</li>
            <li><strong>"QR 스캔"</strong>으로 손님 영수증 QR코드를 카메라로 읽어 즉시 취소</li>
          </ul>
        </div>
        <div class="card">
          <div class="card-title">좌석 금지 <span class="card-tag">SEAT BAN</span></div>
          <ul>
            <li>좌석 지도를 클릭해 판매 금지 좌석 지정/해제 (고장석 등)</li>
            <li>금지된 좌석은 모든 회차에서 선택 불가 처리</li>
            <li>금지 좌석 목록에서 개별 해제 가능</li>
            <li>"금지 전체 해제"로 한 번에 초기화</li>
          </ul>
        </div>
      </div>
      <h3>로그인 유지 &amp; 로그아웃</h3>
      <p>관리자 로그인은 브라우저 탭을 열어둔 동안만 유지됩니다(세션 저장). 브라우저를 완전히 닫으면 다음 접속 시 비밀번호를 다시 입력해야 합니다. 왼쪽 하단의 "로그아웃" 버튼으로 언제든 즉시 로그아웃할 수 있습니다.</p>
    `,
  },
  {
    id: "troubleshoot",
    num: "Chapter 10",
    title: "문제 해결",
    divider: true,
    body: `
      <div class="table-wrap">
        <table>
          <thead><tr><th style="width:34%">증상</th><th>해결 방법</th></tr></thead>
          <tbody>
            <tr><td>영수증이 인쇄되지 않아요</td><td>① Chrome 또는 Edge를 쓰고 있는지 확인 ② 프린터 USB 케이블·전원 확인 ③ 7장의 "포트 선택" 절차를 다시 진행 (브라우저 주소창 왼쪽 자물쇠 아이콘 → 사이트 설정에서 시리얼 포트 권한 확인)</td></tr>
            <tr><td>관리자 비밀번호를 잊어버렸어요</td><td>Firebase 콘솔 → Authentication → Users 탭에서 해당 계정을 찾아 "비밀번호 재설정" 메일을 보내거나, 계정을 삭제한 뒤 새 이메일·비밀번호로 다시 등록하세요. 빌드를 다시 할 필요는 없습니다.</td></tr>
            <tr><td>좌석이 "다른 창에서 선택 중"으로 계속 떠요</td><td>다른 손님이 2분 이내에 같은 좌석을 선택 중인 상태입니다. 2분 뒤 자동으로 풀리거나, 급하면 관리자 "좌석 금지" 탭에서 상태를 확인하세요.</td></tr>
            <tr><td>스케줄을 수정했는데 키오스크에 안 보여요</td><td>인터넷 연결과 5장의 Firebase 환경변수 값이 정확한지 확인하세요. 화면은 30초마다 자동 새로고침됩니다.</td></tr>
            <tr><td>QR 스캔 창이 안 열려요</td><td>브라우저의 카메라 권한이 차단되어 있는지 확인하세요. 주소창 왼쪽 아이콘 → 카메라 권한을 "허용"으로 변경 후 새로고침합니다.</td></tr>
          </tbody>
        </table>
      </div>
    `,
  },
  {
    id: "appendix",
    num: "Appendix",
    title: "환경변수 전체 목록",
    intro: ".env.local 파일에 들어가는 값 전체 정리입니다.",
    body: `
      <div class="table-wrap">
        <table>
          <thead><tr><th>변수명</th><th>설명</th></tr></thead>
          <tbody>
            <tr><td class="mono">VITE_FIREBASE_API_KEY</td><td>Firebase 프로젝트 API 키</td></tr>
            <tr><td class="mono">VITE_FIREBASE_AUTH_DOMAIN</td><td>Firebase 인증 도메인</td></tr>
            <tr><td class="mono">VITE_FIREBASE_PROJECT_ID</td><td>Firebase 프로젝트 ID</td></tr>
            <tr><td class="mono">VITE_FIREBASE_STORAGE_BUCKET</td><td>Firebase 스토리지 버킷 주소</td></tr>
            <tr><td class="mono">VITE_FIREBASE_MESSAGING_SENDER_ID</td><td>Firebase 메시징 발신자 ID</td></tr>
            <tr><td class="mono">VITE_FIREBASE_APP_ID</td><td>Firebase 웹 앱 ID</td></tr>
          </tbody>
        </table>
      </div>
    `,
  },
];

export const tocGroups = [
  {
    label: "시작하기",
    items: [
      { id: "overview", label: "1. 시스템 개요" },
      { id: "requirements", label: "2. 준비물" },
    ],
  },
  {
    label: "설치 & 설정",
    items: [
      { id: "install", label: "3. 프로그램 설치" },
      { id: "firebase", label: "4. Firebase 설정" },
      { id: "env", label: "5. 환경변수 설정" },
      { id: "run", label: "6. 실행 및 배포" },
      { id: "printer", label: "7. 영수증 프린터 연결" },
    ],
  },
  {
    label: "사용법",
    items: [
      { id: "kiosk-usage", label: "8. 고객용 키오스크 화면" },
      { id: "admin-usage", label: "9. 관리자 페이지" },
    ],
  },
  {
    label: "참고",
    items: [
      { id: "troubleshoot", label: "10. 문제 해결" },
      { id: "appendix", label: "부록 · 환경변수 표" },
    ],
  },
];
