// src/services/user.api.ts
export type Geo = { lat: string; lng: string };

export type Address = {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
};

export type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
};

const BASE_URL = "https://jsonplaceholder.typicode.com";

/** helper: ทำให้ fetch มี error handling มาตรฐาน */
async function http<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, init);

  if (!res.ok) {
    // โยน error เพื่อให้ page จับ .catch ได้
    throw new Error(`Request failed: ${res.status}`);
  }

  return res.json() as Promise<T>;
}

/** GET /users */
export function getUsers(): Promise<User[]> {
  return http<User[]>(`${BASE_URL}/users`);
}

/** GET /users/:id */
export function getUserById(id: number | string): Promise<User> {
  return http<User>(`${BASE_URL}/users/${id}`);
}
