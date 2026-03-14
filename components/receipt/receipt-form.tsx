interface ReceiptFormProps {
  isSubmitting: boolean;
  nameError: boolean;
  observation: string;
  onConfirm: () => void;
  onObservationChange: (value: string) => void;
  onRecipientNameChange: (value: string) => void;
  recipientName: string;
}

export function ReceiptForm({
  isSubmitting,
  nameError,
  observation,
  onConfirm,
  onObservationChange,
  onRecipientNameChange,
  recipientName,
}: ReceiptFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className={`transition-all duration-300 ${nameError ? "animate-shake" : ""}`}>
        <label
          htmlFor="recipientNameInput"
          className="ml-1 mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500"
        >
          Nome do recebedor <span className="text-red-500">*</span>
        </label>
        <input
          id="recipientNameInput"
          type="text"
          placeholder="Digite o nome de quem esta recebendo..."
          value={recipientName}
          onChange={(event) => onRecipientNameChange(event.target.value)}
          className={`w-full rounded-xl border px-4 py-3 font-medium text-slate-800 shadow-sm transition-all placeholder:text-slate-400 focus:border-transparent focus:outline-none focus:ring-2 sm:py-4 ${
            nameError
              ? "border-red-400 bg-red-50/50 focus:ring-red-500"
              : "border-slate-200 bg-white focus:ring-blue-500"
          }`}
          disabled={isSubmitting}
        />
        {nameError && (
          <p className="animate-in fade-in slide-in-from-top-1 ml-1 mt-1.5 text-xs font-medium text-red-500">
            Por favor, preencha o nome do recebedor antes de confirmar.
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="observationInput"
          className="ml-1 mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500"
        >
          Observacoes{" "}
          <span className="font-normal normal-case text-slate-400">
            (opcional - informe divergencias)
          </span>
        </label>
        <div className="relative">
          <textarea
            id="observationInput"
            placeholder="Ex: Caixa 2 chegou amassada, faltou 1 unidade do produto X..."
            value={observation}
            onChange={(event) => {
              if (event.target.value.length <= 300) {
                onObservationChange(event.target.value);
              }
            }}
            rows={3}
            className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-sm transition-all placeholder:text-slate-400 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-amber-400"
            disabled={isSubmitting}
          />
          <span
            className={`absolute bottom-2.5 right-3 text-[10px] font-bold tabular-nums ${
              observation.length >= 280 ? "text-amber-500" : "text-slate-300"
            }`}
          >
            {observation.length}/300
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={onConfirm}
        disabled={isSubmitting}
        className="group relative mb-2 flex w-full flex-shrink-0 items-center justify-center space-x-3 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 font-bold text-white shadow-xl shadow-blue-500/30 transition-all hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:filter-grayscale sm:py-5"
      >
        <div className="absolute inset-0 h-full w-full translate-x-[-100%] bg-white/20 transition-transform duration-700 ease-in-out group-hover:translate-x-[100%]" />

        {isSubmitting ? (
          <>
            <svg
              className="h-6 w-6 animate-spin sm:h-7 sm:w-7"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                className="opacity-20"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-100"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            <span className="text-sm tracking-wide sm:text-base">PROCESSANDO...</span>
          </>
        ) : (
          <>
            <span className="text-sm tracking-wide sm:text-[16px]">
              SIM, RECEBI A MERCADORIA
            </span>
            <span className="text-xl transition-transform duration-300 group-hover:scale-125">
              +
            </span>
          </>
        )}
      </button>
    </div>
  );
}
