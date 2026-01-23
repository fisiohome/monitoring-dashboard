"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";

export function Reminders() {
    return (
        <Card className="rounded-3xl border-none shadow-sm bg-white">
            <CardHeader>
                <CardTitle className="text-lg font-bold">Reminders</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col justify-between h-[200px]">
                <div>
                    <h3 className="font-bold text-xl leading-tight text-foreground">
                        Meeting with Arc Company
                    </h3>
                    <p className="text-muted-foreground text-sm mt-2">
                        Time: 02.00 pm - 04.00 pm
                    </p>
                </div>

                <Button className="w-full bg-[#105D3B] hover:bg-[#0E4D30] text-white rounded-xl h-12 text-sm font-semibold gap-2">
                    <Video className="w-4 h-4" />
                    Start Meeting
                </Button>
            </CardContent>
        </Card>
    );
}
