"use client";

import { useAuth } from "@/context/AuthContext";
import UsuarioController from "@/controllers/userController";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const initialForm = {
  user: "",
  password: "",
};

type Errors = {
  [key: string]: boolean;
};

const initialErrors: Errors = {
  user: false,
  password: false,
  auth: false,
};

export default function Home() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState(initialErrors);
  const router = useRouter();
  const { state, dispatch } = useAuth();
  const tareaController = new UsuarioController();

  useEffect(() => {
    if (state.token) {
      router.push("/tareas");
    }
  }, [state.token, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: false });
    }
  };

  const validateForm = () => {
    const newErrors = { ...initialErrors };
    let isValid = true;
    if (!form.user) {
      newErrors.user = true;
      isValid = false;
    }
    if (!form.password) {
      newErrors.password = true;
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      const login = async () => {
        try {
          const data = await tareaController.login(form.user, form.password);
          localStorage.setItem("user", JSON.stringify(data));
          dispatch({
            type: "SET_AUTH",
            payload: {
              token: data.token,
              user: { id: data.user.id, username: data.user.username },
            },
          });
          setForm(initialForm);
          router.push("/tareas");
        } catch (error) {
          console.error("Error al obtener las tareas:", error);
          setErrors({ ...errors, auth: true });
        }
      };
      login();
    }
  };

  return (
    <main>
      <div className="m-7">
        <h2 className="text-center text-3xl font-bold my-8">Iniciar Sesión</h2>

        <form className="flex flex-col w-1/2 mx-auto" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label htmlFor="user" className="font-semibold text-base">
              Nombre de Usuario
            </label>
            <input
              className={`bg-[#F1F4F9] border-[#D8D8D8] border rounded-lg p-2 mt-3 ${
                errors.user ? "ring-red-500 ring" : ""
              }`}
              type="text"
              id="user"
              name="user"
              placeholder="Ingrese su nombre de usuario"
              value={form.user}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col mt-6">
            <label
              htmlFor="password"
              className="font-semibold text-lg sm:text-base"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                className={`bg-[#F1F4F9] border-[#D8D8D8] border rounded-lg p-2 my-3 w-full ${
                  errors.password ? "ring-red-400 ring" : ""
                }`}
                type={"password"}
                id="password"
                name="password"
                placeholder="••••••"
                value={form.password}
                onChange={handleChange}
              />
            </div>
          </div>

          {errors.auth ? (
            <p className="text-red-500 font-semibold text-sm">
              Las credenciales no son correctas. Si olvidaste tu contraseña
              contacta al administrador.
            </p>
          ) : (
            ""
          )}

          <button
            className="bg-blue-500 text-white font-bold text-lg rounded-lg py-3 mt-10 hover:bg-blue-600"
            type="submit"
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </main>
  );
}
