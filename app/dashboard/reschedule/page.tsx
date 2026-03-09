import { Calendar, Clock, Wrench } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function ReschedulePage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="max-w-2xl w-full border-none shadow-xl rounded-3xl bg-linear-to-br from-purple-50 to-white">
        <CardContent className="p-12 text-center">
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-[#6200EE] rounded-full flex items-center justify-center shadow-lg shadow-purple-200">
                <Calendar className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Wrench className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-[#6200EE] mb-4">
            Reschedule Requests
          </h1>

          <p className="text-lg text-slate-600 mb-8 max-w-md mx-auto">
            Halaman ini sedang dalam pengembangan. Fitur reschedule akan segera
            hadir!
          </p>

          <div className="flex items-center justify-center gap-2 text-sm text-slate-500">
            <Clock className="w-4 h-4" />
            <span>Coming Soon</span>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-200">
            <p className="text-xs text-slate-400">
              Untuk saat ini, silakan gunakan menu lain yang tersedia
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
