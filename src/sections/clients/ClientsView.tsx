import { useState, useMemo, useEffect } from "react";
import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton, SkeletonStats, SkeletonList } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { useNavigation } from "@/lib/NavigationContext";
import ClientList from "./components/ClientList";
import ClientDashboard from "./components/ClientDashboard";
import AddClientModal from "./components/AddClientModal";
import type { ClientFormData } from "./components/AddClientModal";
import EditClientModal from "./components/EditClientModal";
import type { EditClientFormData } from "./components/EditClientModal";
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
  const { navigateTo } = useNavigation();
  const [selectedClientId, setSelectedClientId] = useState<string | null>(
    clients.length > 0 ? clients[0].client_id : null,
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isLoadingClient, setIsLoadingClient] = useState(false);

  // Simulate loading when switching clients
  useEffect(() => {
    if (selectedClientId) {
      setIsLoadingClient(true);
      const timer = setTimeout(() => setIsLoadingClient(false), 400);
      return () => clearTimeout(timer);
    }
  }, [selectedClientId]);

  const handleAddClient = (clientData: ClientFormData) => {
    // In a real app, this would make an API call
    console.log("Adding new client:", clientData);
    // For demo, show success message
    alert(`Client ${clientData.first_name} ${clientData.last_name} added successfully!\nThis would normally save to the database.`);
  };

  const handleEditClient = (clientData: EditClientFormData) => {
    // In a real app, this would make an API call
    console.log("Updating client:", clientData);
    // For demo, show success message
    alert(`Client "${clientData.first_name} ${clientData.last_name}" updated successfully!`);
  };

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
        <Button
          onClick={() => setShowAddModal(true)}
        >
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
          {isLoadingClient ? (
            <Card className="p-6">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-20 w-20 rounded-full" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex gap-2">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </div>
                </div>
                <SkeletonStats />
                <SkeletonList items={3} />
              </div>
            </Card>
          ) : selectedClient ? (
            <ClientDashboard
              client={selectedClient}
              programs={clientPrograms}
              alerts={clientAlerts}
              onStartSession={(programId) => {
                // Navigate to Sessions with both client and program context
                navigateTo("/sessions", { 
                  clientId: selectedClient.client_id, 
                  programId,
                  sourceView: "clients"
                });
              }}
              onAddProgram={() => {
                // Navigate to Programs or show program assignment modal
                navigateTo("/programs", { 
                  clientId: selectedClient.client_id,
                  action: "create",
                  sourceView: "clients"
                });
              }}
              onViewReports={() => {
                // Navigate to Reporting filtered by this client
                navigateTo("/reporting", { 
                  clientId: selectedClient.client_id,
                  sourceView: "clients"
                });
              }}
              onEditProfile={() => {
                setShowEditModal(true);
              }}
            />
          ) : (
            <EmptyState
              icon={Users}
              title="Select a Client"
              description="Choose a client from the list to view their profile, programs, and session history."
              action={{
                label: "Add New Client",
                onClick: () => setShowAddModal(true),
              }}
            />
          )}
        </div>
      </div>

      {/* Add Client Modal */}
      <AddClientModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddClient}
      />

      {/* Edit Client Modal */}
      {selectedClient && (
        <EditClientModal
          open={showEditModal}
          onClose={() => setShowEditModal(false)}
          onSave={handleEditClient}
          client={selectedClient}
        />
      )}
    </div>
  );
}
