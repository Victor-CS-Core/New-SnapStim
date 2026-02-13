import { Search, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import type { Client } from "../../../../product-plan/sections/clients/types";

interface ClientListProps {
  clients: Client[];
  selectedClientId?: string;
  onSelectClient: (clientId: string) => void;
}

const statusColors: Record<string, string> = {
  active:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  inactive: "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400",
  discharged: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400",
};

function getInitials(firstName: string, lastName: string): string {
  return `${firstName[0]}${lastName[0]}`.toUpperCase();
}

export default function ClientList({
  clients,
  selectedClientId,
  onSelectClient,
}: ClientListProps) {
  const [search, setSearch] = useState("");

  const filteredClients = clients.filter((client) => {
    const fullName = `${client.first_name} ${client.last_name}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Client List */}
      <div className="space-y-2">
        {filteredClients.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <UserIcon className="h-8 w-8 text-stone-400 mb-2" />
            <p className="text-sm text-stone-500">No clients found</p>
          </div>
        ) : (
          filteredClients.map((client) => (
            <Card
              key={client.client_id}
              className={`p-3 cursor-pointer transition-colors ${
                selectedClientId === client.client_id
                  ? "bg-primary/5 border-primary"
                  : "hover:bg-stone-50 dark:hover:bg-stone-800/50"
              }`}
              onClick={() => onSelectClient(client.client_id)}
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={client.avatar_url}
                    alt={`${client.first_name} ${client.last_name}`}
                  />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {getInitials(client.first_name, client.last_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-stone-900 dark:text-stone-100 truncate">
                      {client.first_name} {client.last_name}
                    </span>
                    <Badge
                      variant="secondary"
                      className={statusColors[client.status]}
                    >
                      {client.status}
                    </Badge>
                  </div>
                  <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-2">
                    <span>{client.age} years old</span>
                    <span>•</span>
                    <span>
                      {client.aggregates.active_program_count} programs
                    </span>
                  </div>
                </div>
                {client.ai_insights.intervention_suggested && (
                  <div
                    className="h-2 w-2 rounded-full bg-red-500 shrink-0"
                    title="Intervention suggested"
                  />
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
