import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ProfileTab({ user, onSave }) {
  return (
    <div className="max-w-xl mx-auto">
      <Card className="rounded-2xl shadow-md">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-4">
            <img
              src={user?.avatar || "https://i.pravatar.cc/150?img=12"}
              className="w-20 h-20 rounded-full object-cover border"
            />
            <div>
              <p className="font-semibold text-lg">
                {user?.displayName || "User"}
              </p>
              <p className="text-sm opacity-70">{user?.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded bg-[#D4AF37] text-black">
                {user?.role === "vip" ? "VIP" : "USER"}
              </span>
            </div>
          </div>

          <Input
            placeholder="Nama Tampilan"
            defaultValue={user?.displayName}
          />

          <Input placeholder="Bio singkat" defaultValue={user?.bio} />

          <Input
            placeholder="Avatar URL"
            defaultValue={user?.avatar || ""}
          />

          <Button
            onClick={onSave}
            className="w-full bg-[#D4AF37] text-black"
          >
            Simpan Profil
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
