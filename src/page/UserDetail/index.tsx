import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserById } from "../../services/user.api";

type User = {
  id: number;
  name: string;
  email: string;
};

export default function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!id) return;

    getUserById(id)
      .then((data) => setUser(data))
      .catch((e) => setError(e.message ?? "โหลดไม่สำเร็จ"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="p-6">กำลังโหลด...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;
  if (!user) return <div className="p-6">ไม่พบข้อมูล</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">{user.name}</h1>
      <div>{user.email}</div>
    </div>
  );
}
