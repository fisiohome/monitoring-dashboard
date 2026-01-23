"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const members = [
    {
        name: "Alexandra Deff",
        role: "Working on Github Project Repository",
        status: "Completed",
        image: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    },
    {
        name: "Edwin Adenike",
        role: "Working on Integrate User Authentication System",
        status: "In Progress",
        image: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    },
    {
        name: "Isaac Oluwatemilorun",
        role: "Working on Develop Search and Filter Functionality",
        status: "Pending",
        image: "https://i.pravatar.cc/150?u=a04258114e29026302d",
    },
    {
        name: "David Oshodi",
        role: "Working on Responsive Layout for Homepage",
        status: "In Progress",
        image: "https://i.pravatar.cc/150?u=a04258114e29026302c",
    },
];

export function TeamCollaboration() {
    return (
        <Card className="rounded-3xl border-none shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-bold">Team Collaboration</CardTitle>
                <Button variant="outline" size="sm" className="rounded-xl h-8 text-xs border-slate-200">
                    + Add Member
                </Button>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {members.map((member, index) => (
                        <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-9 w-9 border border-slate-100">
                                    <AvatarImage src={member.image} alt={member.name} />
                                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h4 className="text-sm font-semibold">{member.name}</h4>
                                    <p className="text-[10px] text-muted-foreground line-clamp-1 max-w-[150px] sm:max-w-xs">
                                        {member.role}
                                    </p>
                                </div>
                            </div>
                            <Badge
                                variant="secondary"
                                className={`
                    text-[10px] font-medium px-2 py-0.5 rounded-md border-0
                    ${member.status === "Completed" ? "bg-green-50 text-green-700" :
                                        member.status === "In Progress" ? "bg-yellow-50 text-yellow-700" :
                                            "bg-red-50 text-red-700"}
                `}>
                                {member.status}
                            </Badge>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
