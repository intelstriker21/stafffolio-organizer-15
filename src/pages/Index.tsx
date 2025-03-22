
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Trash2, PlusCircle, Users, Trophy, ExternalLink, FolderPlus, Lock, UserCog, ShieldCheck } from "lucide-react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";

interface StaffMember {
  id: number;
  name: string;
  discordImage: string;
  role: string;
  project: string;
  bio: string;
  rank: string;
  folder: string;
  projectUrl?: string;
}

interface AdminCredentials {
  password: string;
  isLoggedIn: boolean;
}

const Index = () => {
  // Staff members state with enhanced data
  const [staff, setStaff] = useState<StaffMember[]>([
    {
      id: 1,
      name: "John Doe",
      discordImage: "https://cdn.discordapp.com/avatars/123456789/default.png",
      role: "Frontend Developer",
      project: "Website Redesign",
      bio: "Passionate about creating beautiful user interfaces and delivering exceptional user experiences. Specializes in React and modern CSS.",
      rank: "Senior",
      folder: "Development",
      projectUrl: "https://example.com/project1"
    },
    {
      id: 2,
      name: "Jane Smith",
      discordImage: "https://cdn.discordapp.com/avatars/987654321/default.png",
      role: "Backend Developer",
      project: "API Integration",
      bio: "Experienced in building scalable backend solutions with Node.js and MongoDB. Loves solving complex problems and optimizing performance.",
      rank: "Lead",
      folder: "Development",
      projectUrl: "https://example.com/project2"
    },
    {
      id: 3,
      name: "Alex Johnson",
      discordImage: "https://cdn.discordapp.com/avatars/456789123/default.png",
      role: "UI/UX Designer",
      project: "Mobile App Design",
      bio: "Creative designer with a passion for user-centered design. Focuses on creating intuitive and accessible interfaces for all users.",
      rank: "Junior",
      folder: "Design",
      projectUrl: "https://example.com/project3"
    }
  ]);

  // Admin authentication state
  const [admin, setAdmin] = useState<AdminCredentials>({
    password: "admin123", // In a real app, you would store this securely
    isLoggedIn: false
  });

  // New member state
  const [newMember, setNewMember] = useState({
    name: "",
    discordImage: "",
    role: "",
    project: "",
    bio: "",
    rank: "",
    folder: "General",
    projectUrl: ""
  });

  // State for folder management
  const [folders, setFolders] = useState<string[]>(["General", "Development", "Design", "Marketing"]);
  const [newFolder, setNewFolder] = useState("");
  const [selectedFolder, setSelectedFolder] = useState<string>("All");

  // Authentication dialog state
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const [authError, setAuthError] = useState("");

  // Get unique folders from staff members
  const getUniqueFolders = () => {
    const folderSet = new Set(folders);
    staff.forEach(member => folderSet.add(member.folder));
    return Array.from(folderSet);
  };

  // Filter staff by folder
  const filteredStaff = selectedFolder === "All" 
    ? staff 
    : staff.filter(member => member.folder === selectedFolder);

  // Toast notifications
  const { toast } = useToast();

  // Add new staff member
  const addStaffMember = () => {
    if (newMember.name && newMember.role) {
      const newId = staff.length > 0 ? Math.max(...staff.map(m => m.id)) + 1 : 1;
      setStaff([...staff, { ...newMember, id: newId }]);
      setNewMember({ 
        name: "", 
        discordImage: "", 
        role: "", 
        project: "", 
        bio: "", 
        rank: "", 
        folder: "General",
        projectUrl: ""
      });
      
      toast({
        title: "Staff member added",
        description: `${newMember.name} has been added to the team.`,
      });
    }
  };

  // Delete staff member
  const deleteStaffMember = (id: number) => {
    const memberToDelete = staff.find(member => member.id === id);
    setStaff(staff.filter(member => member.id !== id));
    
    toast({
      title: "Staff member removed",
      description: `${memberToDelete?.name} has been removed from the team.`,
      variant: "destructive",
    });
  };

  // Add new folder
  const addFolder = () => {
    if (newFolder && !folders.includes(newFolder)) {
      setFolders([...folders, newFolder]);
      setNewFolder("");
      
      toast({
        title: "Folder created",
        description: `${newFolder} folder has been created.`,
      });
    }
  };

  // Handle admin login
  const handleLogin = () => {
    if (loginPassword === admin.password) {
      setAdmin({ ...admin, isLoggedIn: true });
      setShowAuthDialog(false);
      setLoginPassword("");
      setAuthError("");
      
      toast({
        title: "Admin access granted",
        description: "You now have admin privileges.",
      });
    } else {
      setAuthError("Incorrect password. Please try again.");
    }
  };

  // Handle admin logout
  const handleLogout = () => {
    setAdmin({ ...admin, isLoggedIn: false });
    
    toast({
      title: "Logged out",
      description: "Admin session ended.",
    });
  };

  // Persist admin login status in localStorage
  useEffect(() => {
    const savedLoginStatus = localStorage.getItem("adminLoggedIn");
    if (savedLoginStatus === "true") {
      setAdmin(prev => ({ ...prev, isLoggedIn: true }));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("adminLoggedIn", admin.isLoggedIn.toString());
  }, [admin.isLoggedIn]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <Tabs defaultValue="staff" className="w-full max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Staff Portfolio</h1>
          <div className="flex flex-wrap gap-2 items-center">
            <TabsList className="mr-2">
              <TabsTrigger value="staff" className="gap-2">
                <Users size={16} />
                Staff Directory
              </TabsTrigger>
              <TabsTrigger 
                value="admin" 
                className="gap-2"
                onClick={() => {
                  if (!admin.isLoggedIn) {
                    setShowAuthDialog(true);
                  }
                }}
              >
                <UserCog size={16} />
                Admin Panel
              </TabsTrigger>
            </TabsList>
            
            {admin.isLoggedIn && (
              <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
                <Lock size={16} />
                Logout
              </Button>
            )}
          </div>
        </div>

        {/* Authentication Dialog */}
        <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Admin Authentication Required</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Enter admin password" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
                {authError && <p className="text-sm text-red-500">{authError}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowAuthDialog(false)}>Cancel</Button>
              <Button onClick={handleLogin}>Login</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Staff Directory Tab */}
        <TabsContent value="staff" className="animate-fade-in">
          <div className="flex flex-wrap gap-4 mb-6">
            <Button 
              variant="outline" 
              className={`gap-2 ${selectedFolder === "All" ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`}
              onClick={() => setSelectedFolder("All")}
            >
              All Staff
            </Button>
            {getUniqueFolders().map((folder) => (
              <Button 
                key={folder} 
                variant="outline" 
                className={`gap-2 ${selectedFolder === folder ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`}
                onClick={() => setSelectedFolder(folder)}
              >
                {folder}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStaff.map((member) => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                <div className="aspect-video w-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={member.discordImage} alt={member.name} className="object-cover" />
                    <AvatarFallback className="text-2xl">{member.name[0]}</AvatarFallback>
                  </Avatar>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{member.name}</CardTitle>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <Trophy size={12} />
                      {member.rank}
                    </Badge>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-sm text-muted-foreground font-medium">{member.role}</p>
                    <Badge>{member.folder}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-3"><strong>Project:</strong> {member.project}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
                <CardFooter className="pt-2">
                  {member.projectUrl && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full gap-2"
                      onClick={() => window.open(member.projectUrl, '_blank')}
                    >
                      <ExternalLink size={14} />
                      View Project
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>

          {filteredStaff.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No staff members found in this folder.</p>
            </div>
          )}
        </TabsContent>

        {/* Admin Panel Tab */}
        <TabsContent value="admin">
          {!admin.isLoggedIn ? (
            <Card className="p-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ShieldCheck size={48} className="text-muted-foreground mb-4" />
                <h2 className="text-2xl font-bold mb-2">Admin Authentication Required</h2>
                <p className="text-muted-foreground mb-4">You need to authenticate to access the admin panel</p>
                <Button onClick={() => setShowAuthDialog(true)}>
                  Login as Admin
                </Button>
              </div>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Staff Members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{staff.length}</div>
                    <p className="text-sm text-muted-foreground">Total team members</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Departments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{getUniqueFolders().length}</div>
                    <p className="text-sm text-muted-foreground">Active departments</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">
                      {new Set(staff.map(member => member.project)).size}
                    </div>
                    <p className="text-sm text-muted-foreground">Ongoing projects</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Add Staff Member Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PlusCircle size={18} />
                      Add New Staff Member
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Name"
                        value={newMember.name}
                        onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                      />
                      <Input
                        placeholder="Discord Avatar URL"
                        value={newMember.discordImage}
                        onChange={(e) => setNewMember({ ...newMember, discordImage: e.target.value })}
                      />
                      <Input
                        placeholder="Role (e.g. Developer)"
                        value={newMember.role}
                        onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                      />
                      <Input
                        placeholder="Project"
                        value={newMember.project}
                        onChange={(e) => setNewMember({ ...newMember, project: e.target.value })}
                      />
                      <Input
                        placeholder="Rank in Xenohost"
                        value={newMember.rank}
                        onChange={(e) => setNewMember({ ...newMember, rank: e.target.value })}
                      />
                      <Input
                        placeholder="Project URL"
                        value={newMember.projectUrl}
                        onChange={(e) => setNewMember({ ...newMember, projectUrl: e.target.value })}
                      />
                      <div className="md:col-span-2">
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                          value={newMember.folder}
                          onChange={(e) => setNewMember({ ...newMember, folder: e.target.value })}
                        >
                          {folders.map(folder => (
                            <option key={folder} value={folder}>{folder}</option>
                          ))}
                        </select>
                      </div>
                      <Input
                        placeholder="Bio"
                        value={newMember.bio}
                        onChange={(e) => setNewMember({ ...newMember, bio: e.target.value })}
                        className="md:col-span-2"
                      />
                    </div>
                    <Button onClick={addStaffMember} className="w-full">
                      Add Staff Member
                    </Button>
                  </CardContent>
                </Card>

                {/* Add Department/Folder Form */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FolderPlus size={18} />
                      Manage Departments
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="New Department Name"
                          value={newFolder}
                          onChange={(e) => setNewFolder(e.target.value)}
                        />
                        <Button onClick={addFolder} className="whitespace-nowrap">Add Department</Button>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Current Departments:</h3>
                        <div className="flex flex-wrap gap-2">
                          {folders.map(folder => (
                            <Badge key={folder} variant="outline" className="py-1 px-2">
                              {folder}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Staff Management List */}
              <Card>
                <CardHeader>
                  <CardTitle>Manage Staff Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {staff.map((member) => (
                      <Card key={member.id} className="overflow-hidden">
                        <div className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarImage src={member.discordImage} alt={member.name} />
                              <AvatarFallback>{member.name[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <div className="flex items-center gap-2">
                                <p className="text-sm text-muted-foreground">{member.role}</p>
                                <Badge variant="outline" className="text-xs">{member.folder}</Badge>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Sheet>
                              <SheetTrigger asChild>
                                <Button variant="outline" size="sm">View Details</Button>
                              </SheetTrigger>
                              <SheetContent>
                                <SheetHeader>
                                  <SheetTitle>Staff Member Details</SheetTitle>
                                </SheetHeader>
                                <div className="py-4">
                                  <div className="flex justify-center mb-4">
                                    <Avatar className="h-24 w-24">
                                      <AvatarImage src={member.discordImage} alt={member.name} />
                                      <AvatarFallback className="text-3xl">{member.name[0]}</AvatarFallback>
                                    </Avatar>
                                  </div>
                                  <div className="space-y-4">
                                    <div>
                                      <h3 className="text-lg font-bold">{member.name}</h3>
                                      <div className="flex items-center gap-2 mt-1">
                                        <Badge variant="secondary" className="flex items-center gap-1">
                                          <Trophy size={12} />
                                          {member.rank}
                                        </Badge>
                                        <Badge>{member.folder}</Badge>
                                      </div>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">Role</p>
                                      <p>{member.role}</p>
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">Project</p>
                                      <p>{member.project}</p>
                                      {member.projectUrl && (
                                        <Button 
                                          variant="outline" 
                                          size="sm" 
                                          className="mt-2 gap-2"
                                          onClick={() => window.open(member.projectUrl, '_blank')}
                                        >
                                          <ExternalLink size={14} />
                                          View Project
                                        </Button>
                                      )}
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium">About</p>
                                      <p className="text-sm">{member.bio}</p>
                                    </div>
                                  </div>
                                </div>
                              </SheetContent>
                            </Sheet>
                            <Button 
                              variant="destructive" 
                              size="icon"
                              onClick={() => deleteStaffMember(member.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Label component definition since we're using it inside the authentication dialog
const Label = ({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) => (
  <label 
    htmlFor={htmlFor} 
    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
  >
    {children}
  </label>
);

export default Index;
