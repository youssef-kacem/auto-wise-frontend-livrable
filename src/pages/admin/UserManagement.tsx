import { useState, useEffect } from "react";
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
import { users } from "@/lib/mockData";
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

export default function UserManagement() {
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isMessageDialogOpen, setIsMessageDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [messageContent, setMessageContent] = useState("");
  const [isViewDetailsOpen, setIsViewDetailsOpen] = useState(false);
  
  // Utilisateur administrateur (simulé pour l'exemple)
  const adminUser = {
    id: "admin-1",
    firstName: "Admin",
    lastName: "AutoWise"
  };

  // Filter users when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }

    const term = searchTerm.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(term) ||
        user.lastName.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.phoneNumber.includes(term)
    );
    
    setFilteredUsers(filtered);
  }, [searchTerm]);

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

  // Fonction de suppression simulée
  const handleDeleteUser = () => {
    if (!currentUser) return;
    
    // Simuler la suppression de l'utilisateur
    const updatedUsers = filteredUsers.filter(user => user.id !== currentUser.id);
    setFilteredUsers(updatedUsers);
    toast.success(`Utilisateur ${currentUser.firstName} ${currentUser.lastName} supprimé`);
    setIsDeleteDialogOpen(false);
  };

  // Gestionnaire pour la vue détaillée
  const handleViewDetails = (user: User) => {
    setCurrentUser(user);
    setIsViewDetailsOpen(true);
  };

  // Copier l'email dans le presse-papier
  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    toast.success("Email copié dans le presse-papier");
  };

  // Nouveau composant pour le menu d'actions utilisateur
  function UserActionsMenu({ user, onMessage, onEdit, onDelete, onToggleActive, onViewReservations, onViewHistory }: {
    user: User;
    onMessage: () => void;
    onEdit: () => void;
    onDelete: () => void;
    onToggleActive: () => void;
    onViewReservations: () => void;
    onViewHistory: () => void;
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
        <Button size="icon" variant="ghost" title="Historique de connexion" onClick={onViewHistory}>
          <History className="w-4 h-4" />
        </Button>
        <Button size="icon" variant="ghost" title={user.isActive ? "Bloquer l'utilisateur" : "Débloquer l'utilisateur"} onClick={onToggleActive}>
          {user.isActive ? <Ban className="w-4 h-4 text-red-500" /> : <Unlock className="w-4 h-4 text-green-600" />}
        </Button>
        <Button size="icon" variant="ghost" title="Supprimer" onClick={onDelete}>
          <Trash2 className="w-4 h-4 text-destructive" />
        </Button>
      </div>
    );
  }

  // Ajouter la gestion du blocage/déblocage
  const handleToggleActive = (user: User) => {
    setFilteredUsers((prev) =>
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
  const handleViewHistory = (user: User) => {
    toast.info(`Historique de connexion de ${user.firstName} ${user.lastName} (mock)`);
  };

  return (
    <AdminLayout 
      title="Gestion des utilisateurs" 
      description="Gérez tous les utilisateurs de la plateforme"
    >
      {/* Action Bar */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <div className="relative w-64">
            <Input
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          </div>
          <Button variant="outline">Filtrer</Button>
        </div>
        <Button className="bg-autowise-blue hover:bg-autowise-navy">
          <UserPlus className="h-4 w-4 mr-2" />
          Nouvel utilisateur
        </Button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Utilisateur</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Rôle</TableHead>
              <TableHead>Inscription</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} className={user.isActive === false ? "opacity-60" : ""}>
                <TableCell className="font-mono text-xs text-gray-500">
                  {user.id.substring(0, 8)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 hover:ring-blue-500">
                          {user.profilePicture ? (
                            <AvatarImage src={user.profilePicture} alt={`${user.firstName} ${user.lastName}`} />
                          ) : (
                            <AvatarFallback className="bg-gray-200 text-gray-700">
                              {user.firstName.charAt(0)}
                              {user.lastName.charAt(0)}
                            </AvatarFallback>
                          )}
                        </Avatar>
                      </PopoverTrigger>
                      <PopoverContent className="w-60">
                        <div className="flex flex-col items-center space-y-2">
                          <Avatar className="h-20 w-20">
                            {user.profilePicture ? (
                              <AvatarImage src={user.profilePicture} alt={`${user.firstName} ${user.lastName}`} />
                            ) : (
                              <AvatarFallback className="text-xl bg-gray-200 text-gray-700">
                                {user.firstName.charAt(0)}
                                {user.lastName.charAt(0)}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <p className="font-semibold">{user.firstName} {user.lastName}</p>
                          {user.isActive === false && (
                            <Badge variant="destructive" className="mt-1 flex items-center gap-1"><Lock className="w-3 h-3 mr-1" /> Bloqué</Badge>
                          )}
                          <Button size="sm" variant="outline" onClick={() => handleCopyEmail(user.email)}>
                            Copier l'email
                          </Button>
                        </div>
                      </PopoverContent>
                    </Popover>
                    <span>{user.firstName} {user.lastName}</span>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phoneNumber}</TableCell>
                <TableCell>{user.role === "admin" ? <Badge variant="secondary">Admin</Badge> : "Client"}</TableCell>
                <TableCell>{formatDate(user.createdAt)}</TableCell>
                <TableCell className="text-right">
                  <UserActionsMenu
                    user={user}
                    onMessage={() => handleOpenMessageDialog(user)}
                    onEdit={() => handleViewDetails(user)}
                    onDelete={() => handleOpenDeleteDialog(user)}
                    onToggleActive={() => handleToggleActive(user)}
                    onViewReservations={() => handleViewReservations(user)}
                    onViewHistory={() => handleViewHistory(user)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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

      {/* Boîte de dialogue de confirmation pour la suppression */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              {currentUser && `Vous êtes sur le point de supprimer ${currentUser.firstName} ${currentUser.lastName}. Cette action ne peut pas être annulée.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Annuler</Button>
            <Button variant="destructive" onClick={handleDeleteUser}>Supprimer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Boîte de dialogue pour les détails de l'utilisateur */}
      <Dialog open={isViewDetailsOpen} onOpenChange={setIsViewDetailsOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Détails de l'utilisateur</DialogTitle>
          </DialogHeader>
          {currentUser && (
            <div className="grid gap-4 py-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  {currentUser.profilePicture ? (
                    <AvatarImage src={currentUser.profilePicture} alt={`${currentUser.firstName} ${currentUser.lastName}`} />
                  ) : (
                    <AvatarFallback className="text-xl bg-gray-200 text-gray-700">
                      {currentUser.firstName.charAt(0)}
                      {currentUser.lastName.charAt(0)}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <h2 className="text-xl font-bold">{currentUser.firstName} {currentUser.lastName}</h2>
                  <p className="text-gray-500">{currentUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">ID</p>
                  <p className="font-mono">{currentUser.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Rôle</p>
                  <p>{currentUser.role === "admin" ? "Administrateur" : "Client"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Téléphone</p>
                  <p>{currentUser.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date d'inscription</p>
                  <p>{formatDate(currentUser.createdAt)}</p>
                </div>
                {currentUser.address && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500">Adresse</p>
                    <p>{currentUser.address}</p>
                  </div>
                )}
                {currentUser.postalCode && (
                  <div>
                    <p className="text-sm text-gray-500">Code postal</p>
                    <p>{currentUser.postalCode}</p>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button 
                  variant="outline" 
                  onClick={() => handleOpenMessageDialog(currentUser)}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Contacter
                </Button>
                <Button>
                  <Edit className="h-4 w-4 mr-2" />
                  Modifier
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
