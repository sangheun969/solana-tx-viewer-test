const TaxAdvisorBanner = () => {
  return (
    <div className="rounded-2xl p-6 mb-8 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-lg font-bold text-gray-900">
            복잡한 DEX 거래, 세무사와 바로 연결하세요
          </p>

          <p className="text-sm text-gray-600 mt-2 leading-6">
            스왑, 브릿지, 스테이킹처럼 정리가 어려운 거래도 코인 세무 경험이
            있는 세무사와 상담할 수 있습니다.
          </p>

          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-xs px-3 py-1 rounded-full bg-white border text-gray-600">
              DEX 거래 검토
            </span>

            <span className="text-xs px-3 py-1 rounded-full bg-white border text-gray-600">
              세금 신고 준비
            </span>

            <span className="text-xs px-3 py-1 rounded-full bg-white border text-gray-600">
              지갑별 리포트 기반 상담
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <button className="px-4 py-2 rounded-lg bg-orange-500 text-white font-semibold hover:bg-orange-600 transition">
            세무사 연결하기
          </button>

          <button className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition">
            자세히 보기
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaxAdvisorBanner;
