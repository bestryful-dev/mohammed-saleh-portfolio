export function MonogramLogo({ isRtl }) {
  return (
    <div className="flex items-center gap-3 select-none">
      <div className="relative flex h-9 w-9 items-center justify-center border border-[#C9A24D]/45 bg-[#111419]">
        <span className="absolute top-0 left-0 h-1.5 w-1.5 border-t border-l border-[#C9A24D]" />
        <span className="absolute bottom-0 right-0 h-1.5 w-1.5 border-b border-r border-emerald-400" />
        <svg
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="h-5 w-5"
        >
          <path
            d="M12 2.5L4.5 5.8V11.4C4.5 16.3 7.7 20.6 12 21.8C16.3 20.6 19.5 16.3 19.5 11.4V5.8L12 2.5Z"
            stroke="#C9A24D"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M7.5 12H9.6L11 9.2L13 14.8L14.4 12H16.5"
            stroke="#10B981"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div className="hidden sm:flex flex-col leading-tight">
        <span className="text-sm font-semibold text-[#F3EFE6]">
          {isRtl ? "محمد صالح لطف الله" : "Mohammed Saleh"}
        </span>
        <span className="text-[11px] text-[#9CA3AF]">
          {isRtl ? "التأمين الصحي والذكاء الاصطناعي" : "Healthcare • Insurance • AI"}
        </span>
      </div>
    </div>
  );
}