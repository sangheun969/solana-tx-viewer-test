import { calculateEstimatedTax } from "../../utils/tax";

type EstimatedTaxModalProps = {
  open: boolean;
  onClose: () => void;
  realizedProfitKrw: number;
};

const formatKrw = (amount: number) =>
  new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: "KRW",
    maximumFractionDigits: 0,
  }).format(amount);

const EstimatedTaxModal = ({
  open,
  onClose,
  realizedProfitKrw,
}: EstimatedTaxModalProps) => {
  if (!open) return null;

  const result = calculateEstimatedTax(realizedProfitKrw);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold">예상 세액 안내</h2>
            <p className="text-sm text-gray-500 mt-1">
              플랫폼 내부 추정 기준으로 계산된 참고용 수치입니다.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-sm text-gray-500 hover:bg-gray-100"
          >
            닫기
          </button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
            <span className="text-sm text-gray-600">연간 실현 손익</span>
            <span className="font-semibold">
              {formatKrw(result.realizedProfitKrw)}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
            <span className="text-sm text-gray-600">기본 공제</span>
            <span className="font-semibold">
              - {formatKrw(result.deductionKrw)}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
            <span className="text-sm text-gray-600">과세표준(추정)</span>
            <span className="font-semibold">
              {formatKrw(result.taxableBaseKrw)}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3">
            <span className="text-sm text-gray-600">적용 세율</span>
            <span className="font-semibold">
              {(result.taxRate * 100).toFixed(0)}%
            </span>
          </div>

          <div className="flex items-center justify-between rounded-xl bg-blue-50 px-4 py-4">
            <span className="text-base font-semibold text-blue-700">
              예상 세액
            </span>
            <span className="text-xl font-bold text-blue-700">
              {formatKrw(result.estimatedTaxKrw)}
            </span>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-sm text-yellow-800 leading-6">
            본 예상 세액은 플랫폼 내부 추정 로직에 따른 참고용 계산값이며, 실제
            신고세액과 차이가 발생할 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default EstimatedTaxModal;
