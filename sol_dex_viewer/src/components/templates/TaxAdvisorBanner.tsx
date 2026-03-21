const TaxAdvisorBanner = () => {
  return (
    <div className="rounded-2xl p-6 mb-8 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div>
          <p className="text-lg font-bold text-gray-900">
            이런 거래가 있다면 세무 검토가 필요할 수 있어요
          </p>

          <p className="text-sm text-gray-600 mt-2 leading-6 max-w-2xl">
            스왑, 브릿지, 스테이킹 보상, 에어드랍, 지갑 간 자산 이동처럼 분류가
            헷갈리는 거래는 과세 판단이 복잡할 수 있습니다. 거래 수가 많거나
            여러 지갑을 함께 쓰고 있다면 전문가 검토가 도움이 됩니다.
          </p>

          <div className="flex flex-wrap gap-2 mt-4">
            <span className="text-xs px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-600">
              스왑 · 브릿지
            </span>

            <span className="text-xs px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-600">
              스테이킹 · 에어드랍
            </span>

            <span className="text-xs px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-600">
              다중 지갑 거래
            </span>

            <span className="text-xs px-3 py-1 rounded-full bg-gray-50 border border-gray-200 text-gray-600">
              신고 전 검토
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 shrink-0">
          <button className="px-4 py-2 rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-800 transition">
            내 거래 점검하기
          </button>

          <button className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition">
            상담 안내 보기
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaxAdvisorBanner;
