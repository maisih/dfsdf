import { Building2, Bell, Settings, User, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import ProjectSelector from "@/components/project/ProjectSelector";
import SmoothLink from "@/components/ui/smooth-link";
import { navigation } from "@/components/layout/Sidebar";
import { useInvitationAuth } from "@/contexts/InvitationAuthContext";
import { useToast } from "@/hooks/use-toast";
import { memo } from "react";
import MobileTabBar from "@/components/layout/MobileTabBar";
import { useInvitationAuth } from "@/contexts/InvitationAuthContext";

const Header = () => {
  const { user, signOut } = useInvitationAuth();
  const { toast } = useToast();

  const handleSignOut = async () => {
    signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
  };
  return (
    <>
    <header className="h-16 sticky top-0 z-40 bg-gradient-surface/95 backdrop-blur supports-[backdrop-filter]:bg-gradient-surface/70 border-b border-border px-4 md:px-6 flex items-center justify-between shadow-soft">
      <div className="flex items-center gap-3 md:gap-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <SheetHeader className="p-4">
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <nav className="px-2 pb-4 space-y-1">
              {navigation.map((item) => (
                <Button key={item.name} variant="ghost" className="w-full justify-start" asChild>
                  <SmoothLink to={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </SmoothLink>
                </Button>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex items-center gap-2">
          <Building2 className="h-8 w-8 text-primary" />
          <h1 className="text-xl font-bold text-foreground">InfraCloud</h1>
        </div>
        <div className="hidden sm:block">
          <ProjectSelector />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-accent rounded-full"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/avatars/01.png" alt="@user" />
                <AvatarFallback>
                  {user?.role?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1) || 'User'}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.role} access via invitation
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
    <MobileTabBar />
    </>
  );
};

export default memo(Header);
