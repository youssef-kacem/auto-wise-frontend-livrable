import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { Car, MessageSquare, User, LogOut } from "lucide-react";

export function Header() {
  const { user, logout, isAdmin } = useAuth();

  return (
    <header className="bg-white border-b shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div>
            <Link to="/" className="flex items-center">
              <img 
                src="/lovable-uploads/43daed69-9290-490b-99c3-7d35f12ec6d5.png" 
                alt="AutoWise Logo" 
                className="h-10" 
              />
            </Link>
          </div>

          {/* Navigation */}
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-autowise-blue transition-colors">
                  Accueil
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/cars" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-autowise-blue transition-colors">
                  Véhicules
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          to="/services"
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-autowise-light-blue to-autowise-blue p-6 no-underline outline-none focus:shadow-md"
                        >
                          <Car className="h-6 w-6 text-white" />
                          <div className="mt-4 mb-2 text-lg font-medium text-white">
                            Nos Services
                          </div>
                          <p className="text-sm leading-tight text-white/90">
                            Location, chauffeur, assurance, et plus
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <Link
                        to="/services/rental"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">
                          Location de véhicules
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Louez le véhicule parfait pour vos besoins
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/services/driver"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">
                          Service de chauffeur
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Voyagez avec un chauffeur professionnel
                        </p>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/services/insurance"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">
                          Assurances
                        </div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Options d'assurances complètes
                        </p>
                      </Link>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/contact" className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-autowise-blue transition-colors">
                  Contact
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/admin">
                      <User className="h-4 w-4 mr-1" />
                      <span className="hidden sm:inline">Admin</span>
                    </Link>
                  </Button>
                )}
                <Button variant="outline" size="sm" asChild>
                  <Link to="/messages">
                    <MessageSquare className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Messages</span>
                  </Link>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/profile">
                    <User className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Profil</span>
                  </Link>
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  <span className="hidden sm:inline">Déconnexion</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline" asChild>
                  <Link to="/login">Connexion</Link>
                </Button>
                <Button size="sm" className="bg-autowise-blue hover:bg-autowise-navy" asChild>
                  <Link to="/register">Inscription</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
