import { Card } from '../../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';

export default function StaffPortal() {
  return (
    <div className="min-h-screen bg-[#F3F4F6] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-[#1F2937] mb-8">Staff Portal</h1>
        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">My Profile</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
            <TabsTrigger value="assignments">Assignments</TabsTrigger>
            <TabsTrigger value="salary">Salary</TabsTrigger>
          </TabsList>
          <TabsContent value="profile" className="mt-6">
            <Card className="p-6 bg-white"><p>Profile management</p></Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
