"use client";

import { useEffect, useState } from "react";
import { Mail, Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";

import { MobileSidebar } from "@/components/MobileSidebar";

export function Header() {
    const [userEmail, setUserEmail] = useState<string>("");
    const [userName, setUserName] = useState<string>("");

    useEffect(() => {
        // Get user info from cookies
        const email = Cookies.get("user_email") || "";
        setUserEmail(email);

        // Extract name from email (before @) or use default
        if (email) {
            const namePart = email.split("@")[0];
            // Capitalize first letter and replace dots/underscores with spaces
            const formattedName = namePart
                .replace(/[._]/g, " ")
                .split(" ")
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
            setUserName(formattedName);
        } else {
            setUserName("User");
        }
    }, []);

    // Get initials for avatar
    const getInitials = (name: string) => {
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <header className="h-20 px-4 md:px-8 flex items-center justify-between md:justify-end border-b border-slate-100 bg-white">
            <MobileSidebar />

            {/* Actions & Profile */}
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 hover:bg-slate-100">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                    </Button>
                    <div className="relative">
                        <Button variant="ghost" size="icon" className="rounded-full w-10 h-10 hover:bg-slate-100">
                            <Bell className="w-5 h-5 text-muted-foreground" />
                        </Button>
                        <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white" />
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 border border-slate-100 bg-[#6200EE]">
                        <AvatarFallback className="bg-[#6200EE] text-white font-semibold">
                            {getInitials(userName)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block">
                        <h3 className="text-sm font-bold text-foreground leading-none">{userName}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{userEmail}</p>
                    </div>
                </div>
            </div>
        </header>
    );
}
