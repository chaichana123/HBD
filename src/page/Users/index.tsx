import { useEffect, useState } from "react";
import UserCard from "../../component/UserCard";
import { Link } from "react-router-dom";
import { getUsers } from "../../services/user.api";

type Geo = {
    lat: string;
    lng: string;
};

type Address = {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: Geo;
};

type User = {
    id: number;
    name: string;
    username: string;
    email: string;
    address: Address;
};


export default function Users() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getUsers()
            .then((data) => setUsers(data))
            .catch((e) => setError(e.message ?? "โหลดไม่สำเร็จ"))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="p-6">กำลังโหลด...</div>;
    if (error) return <div className="p-6 text-red-600">Error: {error}</div>;


    const filteredUsers = users.filter((u) =>
        u.name.toLowerCase().includes(keyword.toLowerCase())
    );

    return (
        <>
            <div className="flex flex-row gap-2 items-center mb-4">
                <div className="flex">
                    <Link
                        to="/users/new"
                        className="inline-flex rounded-lg bg-transparent border px-4 py-2 text-white"
                    >
                        <span>+ Create User</span>
                    </Link>
                </div>
                <div className="flex flex-row gap-2">
                    {users.map((u) => (
                        <Link
                            to={`/users/${u.id}/edit`}
                            className="text-blue-600 underline"
                        >
                            Edit
                        </Link>

                    ))}
                </div>
            </div>
            <div>
                {users.map((u) => (
                    <Link
                        key={u.id}
                        to={`/users/${u.id}`}
                        className="block rounded border p-3 hover:bg-gray-50"
                    >
                        <div className="font-semibold">{u.name}</div>
                        <div className="text-sm text-gray-500">{u.email}</div>
                    </Link>
                ))}
            </div>
            <div className="flex flex-row gap-2">
                <div className="flex flex-col">
                    <h2>Level 1</h2>
                    {users.map((u) => (
                        <div key={u.id} style={{ marginBottom: 8 }}>
                            <div>{u.name}</div>
                            <div>{u.email}</div>
                            <div>{u.address.city}</div>
                        </div>
                    ))}
                </div>
                <div className="flex flex-col">
                    <h2>Level 2</h2>
                    {users.map((u) => (
                        <UserCard key={u.id} user={u} />
                    ))}
                </div>
                <div className="flex flex-col">
                    <h2>Level 3</h2>
                    Setload
                </div>
                <div className="flex flex-col">
                    <h2>Level 4</h2>
                    <input
                        type="text"
                        placeholder="ค้นหาชื่อ..."
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="mb-4 rounded border px-3 py-2"
                    />

                    {filteredUsers.map((u) => (
                        <UserCard key={u.id} user={u} />
                    ))}

                </div>
                <div className="flex flex-col">
                    <h2>Level 5 B</h2>
                    {users.map((u) => (
                        <a
                            href={`https://www.google.com/maps?q=${u.address.geo.lat},${u.address.geo.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline"
                        >
                            ดูแผนที่
                        </a>

                    ))}

                </div>
                <div className="flex flex-col">
                    <h2>Level 5 C</h2>
                    <table className="w-full border">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-3 py-2">Name</th>
                                <th className="border px-3 py-2">Email</th>
                                <th className="border px-3 py-2">City</th>
                                <th className="border px-3 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <td className="border px-3 py-2">{u.name}</td>
                                    <td className="border px-3 py-2">{u.email}</td>
                                    <td className="border px-3 py-2">{u.address.city}</td>
                                    <td className="border px-3 py-2">
                                        <Link
                                            to={`/users/${u.id}/edit`}
                                            className="text-blue-600 underline"
                                        >
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
