const TaxActionButtons = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-8">
      <button className="flex-1 px-6 py-3 md:py-5 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-700 transition shadow-sm">
        세금 계산하기
      </button>

      <button className="flex-1 px-6 py-3 md:py-5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-sm">
        예상 세액
      </button>
    </div>
  );
};

export default TaxActionButtons;
