import { useState, useEffect, useRef } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { UserPlus, Search, Eye, Edit, Trash2, Mail, Ban, Lock, Unlock, MessageSquare, History, ListChecks } from "lucide-react";
import { userService } from "@/services/userService";
import { User } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { messageService } from "@/services/messageService";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

export default function UserManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user: connectedUser } = useAuth();
  
  // Utilisateur administrateur (simulé pour l'exemple)
  const adminUser = {
    id: "admin-1",
    firstName: "Admin",
    lastName: "AutoWise"
  };

  // Edit user state
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await userService.getUsers({ page, search: searchTerm });
        setUsers(data.member);
        setTotalItems(data.totalItems);
      } catch (e: any) {
        setError(e.message || "Erreur lors du chargement des utilisateurs.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [page, searchTerm]);

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR");
  };

  // Gestionnaire pour la boite de dialogue d'envoi de message
  const handleOpenMessageDialog = (user: User) => {
    setCurrentUser(user);
    setIsMessageDialogOpen(true);
  };

  // Gestionnaire d'envoi de message
  const handleSendMessage = async () => {
    if (!currentUser || !messageContent.trim()) return;
    
    try {
      await messageService.sendMessage(adminUser.id, currentUser.id, messageContent);
      toast.success(`Message envoyé à ${currentUser.firstName} ${currentUser.lastName}`);
      setMessageContent("");
      setIsMessageDialogOpen(false);
    } catch (error) {
      toast.error("Erreur lors de l'envoi du message");
      console.error(error);
    }
  };

  // Gestionnaire pour la boite de dialogue de confirmation de suppression
  const handleOpenDeleteDialog = (user: User) => {
    setCurrentUser(user);
    setIsDeleteDialogOpen(true);
  };

  // Delete user from backend
  const handleDeleteUser = async () => {
    if (!currentUser) return;
    try {
      setIsLoading(true);
      setError(null);
      // Call backend DELETE endpoint
      const token = localStorage.getItem("autowise-token");
      const response = await fetch(`http://localhost:8000/api/user/${currentUser.id}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Erreur lors de la suppression de l'utilisateur.");
      }
      setUsers((prev) => prev.filter((u) => u.id !== currentUser.id));
      toast.success(`Utilisateur ${currentUser.nom} ${currentUser.prenom} supprimé`);
      setIsDeleteDialogOpen(false);
    } catch (e: any) {
      setError(e.message || "Erreur lors de la suppression de l'utilisateur.");
    } finally {
      setIsLoading(false);
    }
  };

  // Gestionnaire pour la vue détaillée
  const handleViewDetails = (user: any) => {
    setCurrentUser(user);
    setIsViewDetailsOpen(true);
    setIsEditMode(false);
    setEditData({ ...user, plainPassword: "" });
    setEditError(null);
  };

  // Handle edit form changes
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev: any) => ({ ...prev, [name]: value }));
  };

  // Handle image upload and convert to base64
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setEditData((prev: any) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  // Handle edit submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError(null);
    try {
      const updated = await userService.patchUser(currentUser.id, {
        nom: editData.nom,
        prenom: editData.prenom,
        email: editData.email,
        telephone: editData.telephone,
        image: editData.image,
        plainPassword: editData.plainPassword || undefined,
      });
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      setCurrentUser(updated);
      setIsEditMode(false);
      toast.success("Utilisateur mis à jour avec succès");
    } catch (e: any) {
      setEditError(e.message || "Erreur lors de la mise à jour de l'utilisateur.");
    } finally {
      setEditLoading(false);
    }
  };

  // Copier l'email dans le presse-papier
  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    toast.success("Email copié dans le presse-papier");
  };

  // Nouveau composant pour le menu d'actions utilisateur
  function UserActionsMenu({ user, onMessage, onEdit, onDelete, onToggleActive, onViewReservations }: {
    user: any;
    onMessage: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onToggleActive: () => void;
    onViewReservations: () => void;
  }) {
    return (
      <div className="flex items-center gap-2">
        <Button size="icon" variant="ghost" title="Envoyer un message" onClick={onMessage}>
          <Mail className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="ghost" title="Modifier le profil" onClick={onEdit}>
          <Edit className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="ghost" title="Voir réservations" onClick={onViewReservations}>
          <ListChecks className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="ghost" title={user.isActive ? "Bloquer l'utilisateur" : "Débloquer l'utilisateur"} onClick={onToggleActive}>
          {user.isActive ? <Ban className="w-4 h-4 text-red-500" /> : <Unlock className="w-4 h-4 text-green-600" />}
        </Button>
        {/* Hide delete button for connected user */}
        {connectedUser?.id !== user.id && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button size="icon" variant="ghost" title="Supprimer" onClick={() => handleOpenDeleteDialog(user)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                <AlertDialogDescription>
                  {user && `Vous êtes sur le point de supprimer ${user.nom} ${user.prenom}. Cette action ne peut pas être annulée.`}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteUser} className="bg-red-600 hover:bg-red-700">Supprimer</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    );
  }

  // Ajouter la gestion du blocage/déblocage
  const handleToggleActive = (user: User) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === user.id ? { ...u, isActive: !u.isActive } : u
      )
    );
    toast.success(
      user.isActive
        ? `Utilisateur ${user.firstName} ${user.lastName} bloqué.`
        : `Utilisateur ${user.firstName} ${user.lastName} débloqué.`
    );
  };

  // Mock pour voir réservations et historique
  const handleViewReservations = (user: User) => {
    // Redirection simulée
    toast.info(`Voir les réservations de ${user.firstName} ${user.lastName}`);
  };

  // Search handler
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
    // searchTerm is already bound to input
  };

  // Pagination handlers
  const totalPages = Math.ceil(totalItems / 10); // Assuming 10 per page
  const handlePrevPage = () => setPage((p) => Math.max(1, p - 1));
  const handleNextPage = () => setPage((p) => Math.min(totalPages, p + 1));

  return (
    <AdminLayout 
      title="Gestion des utilisateurs" 
      description="Gérez tous les utilisateurs de la plateforme"
    >
      {/* Action Bar */}
      <div className="flex justify-between items-center mb-6">
        <form onSubmit={handleSearch} className="flex items-center space-x-2">
          <div className="relative w-64">
            <Input
              placeholder="Rechercher par email, nom, prénom..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          <Button type="submit" variant="outline">Rechercher</Button>
        </form>
      </div>

      {/* Loading and error states */}
      {isLoading && <div className="text-center py-4">Chargement...</div>}
      {error && <div className="text-center text-red-500 py-4">{error}</div>}

      {/* Users Table */}
      {!isLoading && !error && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">ID</TableHead>
                <TableHead>Nom</TableHead>
                <TableHead>Prénom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Rôles</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} className={user.isActive === false ? "opacity-60" : ""}>
                  <TableCell className="font-mono text-xs text-gray-500">{user.id}</TableCell>
                  <TableCell>{user.nom}</TableCell>
                  <TableCell>{user.prenom}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.telephone}</TableCell>
                  <TableCell>
                    {Array.isArray(user.roles) && user.roles.map((role: string) => (
                      <Badge key={role} variant={role === "ROLE_ADMIN" ? "secondary" : undefined} className="mr-1">
                        {role.replace("ROLE_", "")}
                      </Badge>
                    ))}
                  </TableCell>
                  <TableCell className="text-right">
                    <UserActionsMenu
                      user={user}
                      onMessage={() => handleOpenMessageDialog(user)}
                      onEdit={() => handleViewDetails(user)}
                      onDelete={() => handleOpenDeleteDialog(user)}
                      onToggleActive={() => handleToggleActive(user)}
                      onViewReservations={() => handleViewReservations(user)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination Controls */}
      {!isLoading && !error && totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button onClick={handlePrevPage} disabled={page === 1} variant="outline">Précédent</Button>
          <span>Page {page} / {totalPages}</span>
          <Button onClick={handleNextPage} disabled={page === totalPages} variant="outline">Suivant</Button>
        </div>
      )}

      {/* Boîte de dialogue pour l'envoi de message */}
      <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Envoyer un message</DialogTitle>
            <DialogDescription>
              {currentUser && `Envoyez un message à ${currentUser.firstName} ${currentUser.lastName}`}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              placeholder="Saisissez votre message ici..."
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsMessageDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleSendMessage}>Envoyer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Boîte de dialogue pour les détails de l'utilisateur */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Détails de l'utilisateur</DialogTitle>
          </DialogHeader>
          {currentUser && !isEditMode && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  {currentUser.image ? (
                    <AvatarImage src={currentUser.image} alt={`${currentUser.prenom} ${currentUser.nom}`} />
                  ) : (
                    <AvatarFallback className="text-xl bg-gray-200 text-gray-700">
                      {currentUser.prenom && currentUser.prenom.charAt(0)}
                      {currentUser.nom && currentUser.nom.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{currentUser.prenom} {currentUser.nom}</h2>
                  <p className="text-gray-500">{currentUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">ID</p>
                  <p className="font-mono">{currentUser.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Rôles</p>
                  <p>{Array.isArray(currentUser.roles) && currentUser.roles.map((role: string) => role.replace("ROLE_", "")).join(", ")}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p>{currentUser.telephone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p>{currentUser.email}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsEditMode(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              </div>
            </div>
          )}
          {currentUser && isEditMode && (
            <form className="grid gap-4 py-4" onSubmit={handleEditSubmit}>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  {editData.image ? (
                    <AvatarImage src={editData.image} alt={`${editData.prenom} ${editData.nom}`} />
                  ) : (
                    <AvatarFallback className="text-xl bg-gray-200 text-gray-700">
                      {editData.prenom && editData.prenom.charAt(0)}
                      {editData.nom && editData.nom.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                  />
                  <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    Changer la photo
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nom</label>
                  <Input name="nom" value={editData.nom || ""} onChange={handleEditChange} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Prénom</label>
                  <Input name="prenom" value={editData.prenom || ""} onChange={handleEditChange} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <Input name="email" type="email" value={editData.email || ""} onChange={handleEditChange} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Téléphone</label>
                  <Input name="telephone" value={editData.telephone || ""} onChange={handleEditChange} required />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium mb-1">Nouveau mot de passe</label>
                  <Input name="plainPassword" type="password" value={editData.plainPassword || ""} onChange={handleEditChange} placeholder="Laisser vide pour ne pas changer" />
                </div>
              </div>
              {editError && <div className="text-red-500 text-center">{editError}</div>}
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setIsEditMode(false)} disabled={editLoading}>
                  Annuler
                </Button>
                <Button type="submit" className="bg-autowise-blue" disabled={editLoading}>
                  {editLoading ? "Enregistrement..." : "Enregistrer"}
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
