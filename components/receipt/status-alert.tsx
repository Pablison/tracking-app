import { AlertCircle } from "lucide-react";

interface StatusAlertProps {
  message: string;
}

export function StatusAlert({ message }: StatusAlertProps) {
  return (
    <div className="mb-6 flex items-start rounded-2xl border border-red-100 bg-red-50 p-4 text-left text-sm text-red-600 shadow-sm">
      <AlertCircle className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />
      <span className="font-medium">{message}</span>
    </div>
  );
}
