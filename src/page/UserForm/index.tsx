import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getUserById } from "../../services/user.api";

type Mode = "create" | "edit";

type FormValues = {
  name: string;
  username: string;
  email: string;
  street: string;
  city: string;
};

type Props = {
  mode: Mode;
};

export default function UserForm({ mode }: Props) {
  const { id } = useParams();
  const navigate = useNavigate();

  const isEdit = mode === "edit";
  const title = useMemo(() => (isEdit ? "Edit User" : "Create User"), [isEdit]);

  const [values, setValues] = useState<FormValues>({
    name: "",
    username: "",
    email: "",
    street: "",
    city: "",
  });

  const [loading, setLoading] = useState<boolean>(isEdit); // edit ต้องโหลดค่าเดิมก่อน
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<Partial<Record<keyof FormValues, string>>>({});

  // ✅ โหลดข้อมูลเดิมเฉพาะตอน edit
  useEffect(() => {
    if (!isEdit) return;
    if (!id) {
      setError("Missing user id");
      setLoading(false);
      return;
    }

    setLoading(true);
    getUserById(id)
      .then((u) => {
        setValues({
          name: u.name ?? "",
          username: u.username ?? "",
          email: u.email ?? "",
          street: u.address?.street ?? "",
          city: u.address?.city ?? "",
        });
      })
      .catch((e) => setError(e.message ?? "Load user failed"))
      .finally(() => setLoading(false));
  }, [isEdit, id]);

  function onChange<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setFieldError((prev) => ({ ...prev, [key]: "" })); // พิมพ์แล้วเคลียร์ error ช่องนั้น
  }

  // ✅ validate แบบง่าย (งานจริงค่อยใช้ zod/yup)
  function validate(v: FormValues) {
    const next: Partial<Record<keyof FormValues, string>> = {};

    if (!v.name.trim()) next.name = "กรุณากรอกชื่อ";
    if (!v.username.trim()) next.username = "กรุณากรอก username";
    if (!v.email.trim()) next.email = "กรุณากรอก email";
    else if (!/^\S+@\S+\.\S+$/.test(v.email)) next.email = "รูปแบบ email ไม่ถูกต้อง";

    setFieldError(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!validate(values)) return;

    try {
      // ✅ mock submit (ยิงไป jsonplaceholder ได้)
      const payload = {
        name: values.name,
        username: values.username,
        email: values.email,
        address: {
          street: values.street,
          city: values.city,
        },
      };

      const url = isEdit
        ? `https://jsonplaceholder.typicode.com/users/${id}`
        : `https://jsonplaceholder.typicode.com/users`;

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Submit failed: ${res.status}`);

      // ✅ เสร็จแล้วพากลับไปหน้า list (หรือจะไป detail ก็ได้)
      navigate("/users");
    } catch (e: any) {
      setError(e?.message ?? "Submit failed");
    }
  }

  if (loading) return <div className="p-6">กำลังโหลด...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="p-6 max-w-xl">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">{title}</h1>
        <Link to="/users" className="text-blue-600 underline">
          ← Back
        </Link>
      </div>

      <form onSubmit={onSubmit} className="space-y-4 rounded-xl border p-4">
        <Field
          label="Name"
          value={values.name}
          error={fieldError.name}
          onChange={(v) => onChange("name", v)}
        />
        <Field
          label="Username"
          value={values.username}
          error={fieldError.username}
          onChange={(v) => onChange("username", v)}
        />
        <Field
          label="Email"
          value={values.email}
          error={fieldError.email}
          onChange={(v) => onChange("email", v)}
        />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field
            label="Street"
            value={values.street}
            error={fieldError.street}
            onChange={(v) => onChange("street", v)}
          />
          <Field
            label="City"
            value={values.city}
            error={fieldError.city}
            onChange={(v) => onChange("city", v)}
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded-lg !bg-blue-600 px-4 py-2 text-white hover:!bg-blue-700"
          >
            {isEdit ? "Update" : "Create"}
          </button>

          <Link
            to="/users"
            className="rounded-lg border px-4 py-2 hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

function Field(props: {
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
}) {
  const { label, value, error, onChange } = props;

  return (
    <label className="block">
      <div className="mb-1 text-sm font-medium">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border px-3 py-2 outline-none ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error ? <div className="mt-1 text-sm text-red-600">{error}</div> : null}
    </label>
  );
}
