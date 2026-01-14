type UserCardProps = {
    user: {
      id: number;
      name: string;
      username: string;
      address: {
        street: string;
        city: string;
      };
    };
  };
  
  export default function UserCard({ user }: UserCardProps) {
    return (
      <div className="rounded-lg border p-3">
        <div className="font-semibold">{user.name}</div>
        <div className="text-sm text-gray-500">@{user.username}</div>
        <div className="text-sm">
          {user.address.street}, {user.address.city}
        </div>
      </div>
    );
  }
  