import { useState, useMemo } from "react";
import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ClientList from "./components/ClientList";
import ClientDashboard from "./components/ClientDashboard";
import clientsData from "../../../product-plan/sections/clients/data.json";
import type {
  Client,
  Program,
  Alert,
} from "../../../product-plan/sections/clients/types";

const clients = clientsData.clients as Client[];
const allPrograms = clientsData.programs as Program[];
const allAlerts = clientsData.alerts as Alert[];

export default function ClientsView() {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(
    clients.length > 0 ? clients[0].client_id : null,
  );

  const selectedClient = useMemo(() => {
    if (!selectedClientId) return null;
    return clients.find((c) => c.client_id === selectedClientId) || null;
  }, [selectedClientId]);

  const clientPrograms = useMemo(() => {
    if (!selectedClientId) return [];
    return allPrograms.filter((p) => p.client_id === selectedClientId);
  }, [selectedClientId]);

  const clientAlerts = useMemo(() => {
    if (!selectedClientId) return [];
    return allAlerts.filter((a) => a.client_id === selectedClientId);
  }, [selectedClientId]);

  const stats = useMemo(
    () => ({
      total: clients.length,
      active: clients.filter((c) => c.status === "active").length,
      needsAttention: clients.filter(
        (c) => c.ai_insights.intervention_suggested,
      ).length,
    }),
    [],
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900 dark:text-stone-100">
            Clients
          </h1>
          <p className="text-stone-500 dark:text-stone-400 mt-1">
            Manage client profiles and programs
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Client
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <span className="text-xs text-stone-500 dark:text-stone-400 uppercase font-medium">
              Total Clients
            </span>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-stone-900 dark:text-stone-100">
              {stats.total}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <span className="text-xs text-stone-500 dark:text-stone-400 uppercase font-medium">
              Active
            </span>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
              {stats.active}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <span className="text-xs text-stone-500 dark:text-stone-400 uppercase font-medium">
              Needs Attention
            </span>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">
              {stats.needsAttention}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Client List Sidebar */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Client Directory
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ClientList
              clients={clients}
              selectedClientId={selectedClientId || undefined}
              onSelectClient={setSelectedClientId}
            />
          </CardContent>
        </Card>

        {/* Client Dashboard */}
        <div className="lg:col-span-3">
          {selectedClient ? (
            <ClientDashboard
              client={selectedClient}
              programs={clientPrograms}
              alerts={clientAlerts}
              onStartSession={(id) => console.log("Start session:", id)}
              onAddProgram={() => console.log("Add program")}
              onViewReports={() => console.log("View reports")}
              onEditProfile={() => console.log("Edit profile")}
            />
          ) : (
            <Card className="p-12 text-center">
              <div className="flex flex-col items-center">
                <Users className="h-12 w-12 text-stone-400 mb-4" />
                <h3 className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                  Select a Client
                </h3>
                <p className="text-stone-500 dark:text-stone-400 mt-1">
                  Choose a client from the list to view their dashboard.
                </p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
