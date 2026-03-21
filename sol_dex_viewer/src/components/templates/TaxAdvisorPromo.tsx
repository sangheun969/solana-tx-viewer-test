import WorkerImage from "../../assets/image/worker1.png";

const TaxAdvisorPromo = () => {
  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-500 text-white shadow-lg">
      <div className="absolute inset-0 bg-black/10" />

      <div className="relative grid grid-cols-1 md:grid-cols-[1.4fr_1fr] items-center gap-6 px-6 py-8 md:px-10 md:py-10">
        <div className="z-10">
          <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-xs font-semibold tracking-wide text-white backdrop-blur-sm">
            세무사 상담 지원
          </span>

          <h2 className="mt-4 text-2xl font-bold leading-tight md:text-4xl">
            코인 세금,
            <br className="hidden sm:block" />
            전문가와 바로 연결하세요
          </h2>

          <p className="mt-3 max-w-xl text-sm text-white/90 md:text-base">
            복잡한 DEX 거래 내역 정리부터 예상 세액 확인, 신고 준비까지 세무
            전문가가 한 번에 도와드립니다.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-indigo-700 shadow-sm transition hover:bg-slate-100">
              세무사 상담 받기
            </button>

            <button className="rounded-xl border border-white/40 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20">
              서비스 자세히 보기
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-2 text-xs text-white/85">
            <span className="rounded-full bg-white/10 px-3 py-1">
              DEX 거래 분석
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1">
              예상 세액 확인
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1">
              세무 신고 연계
            </span>
          </div>
        </div>

        <div className="relative flex justify-center md:justify-end">
          <div className="absolute h-40 w-40 rounded-full bg-white/20 blur-3xl" />
          <img
            src={WorkerImage}
            alt="세무사 홍보 이미지"
            className="relative z-10 max-h-[260px] w-auto object-contain drop-shadow-2xl md:max-h-[320px]"
          />
        </div>
      </div>
    </section>
  );
};

export default TaxAdvisorPromo;
