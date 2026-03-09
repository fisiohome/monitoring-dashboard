"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Phone, MessageCircle } from "lucide-react";
import { StuckOrder } from "@/lib/api";

export function ActionableOrderTable({ orders }: { orders?: StuckOrder[] }) {
    const safeOrders = orders || [];

    return (
        <Card className="rounded-3xl border-none shadow-sm bg-white h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-bold">⚠️ Action Required ({safeOrders.length})</CardTitle>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">View All</Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {safeOrders.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground text-sm">
                            No stuck orders. Great job!
                        </div>
                    ) : (
                        safeOrders.map((order) => (
                            <div key={order.id} className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 hover:border-purple-200 hover:shadow-md transition-all duration-300 group">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform duration-300">
                                        <AlertCircle className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-slate-800">{order.customer_name}</h4>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] bg-red-100 border border-red-200 text-red-700 px-2 py-0.5 rounded-full font-medium">
                                                {order.registration_number || order.id}
                                            </span>
                                            <span className="text-[11px] text-slate-500 font-medium">
                                                Waiting {order.time_elapsed}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="icon" className="h-9 w-9 rounded-full bg-green-50 hover:bg-green-100 text-green-600 shadow-sm border border-green-200">
                                        <MessageCircle className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="h-9 rounded-xl bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-xs font-semibold shadow-md shadow-red-200"
                                        onClick={() => {
                                            if (order.customer_phone) {
                                                const cleanPhone = order.customer_phone.replace(/\D/g, '');
                                                // Assume ID number if starts with 0 or 62 not present, simple cleanup
                                                const finalPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
                                                window.open(`https://wa.me/${finalPhone}`, '_blank');
                                            } else {
                                                alert('No phone number available for this customer');
                                            }
                                        }}
                                    >
                                        Contact Customer
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
