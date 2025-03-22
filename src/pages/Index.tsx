
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Trash2, PlusCircle, Users } from "lucide-react";

interface StaffMember {
  id: number;
  name: string;
  discordImage: string;
  role: string;
  project: string;
  bio: string;
}

const Index = () => {
  const [staff, setStaff] = useState<StaffMember[]>([
    {
      id: 1,
      name: "John Doe",
      discordImage: "https://cdn.discordapp.com/avatars/123456789/default.png",
      role: "Frontend Developer",
      project: "Website Redesign",
      bio: "Passionate about creating beautiful user interfaces"
    },
    {
      id: 2,
      name: "Jane Smith",
      discordImage: "https://cdn.discordapp.com/avatars/987654321/default.png",
      role: "Backend Developer",
      project: "API Integration",
      bio: "Experienced in building scalable backend solutions"
    }
  ]);

  const [newMember, setNewMember] = useState({
    name: "",
    discordImage: "",
    role: "",
    project: "",
    bio: ""
  });

  const addStaffMember = () => {
    if (newMember.name && newMember.role) {
      setStaff([...staff, { ...newMember, id: staff.length + 1 }]);
      setNewMember({ name: "", discordImage: "", role: "", project: "", bio: "" });
    }
  };

  const deleteStaffMember = (id: number) => {
    setStaff(staff.filter(member => member.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Tabs defaultValue="staff" className="w-full max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Staff Portfolio</h1>
          <TabsList>
            <TabsTrigger value="staff" className="gap-2">
              <Users size={16} />
              Staff List
            </TabsTrigger>
            <TabsTrigger value="admin" className="gap-2">
              <PlusCircle size={16} />
              Admin
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="staff">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {staff.map((member) => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.discordImage} alt={member.name} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-xl">{member.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2"><strong>Project:</strong> {member.project}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="admin">
          <Card>
            <CardHeader>
              <CardTitle>Add New Staff Member</CardTitle>
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
                  placeholder="Role"
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                />
                <Input
                  placeholder="Project"
                  value={newMember.project}
                  onChange={(e) => setNewMember({ ...newMember, project: e.target.value })}
                />
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

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Manage Staff Members</h2>
            <div className="grid gap-4">
              {staff.map((member) => (
                <Card key={member.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={member.discordImage} alt={member.name} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                    <Button 
                      variant="destructive" 
                      size="icon"
                      onClick={() => deleteStaffMember(member.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Index;
