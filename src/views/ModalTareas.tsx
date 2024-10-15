"use client";

import { useAuth } from "@/context/AuthContext";
import TareaController from "@/controllers/tareaController";
import Tarea from "@/models/tarea";
import React, { useEffect, useRef, useState } from "react";
import { FaTimes } from "react-icons/fa";

interface CrearTarea {
  titulo: string;
  descripcion: string;
  usuarioId: number;
}

interface EditarTarea {
  id: number;
  titulo?: string;
  descripcion?: string;
  completado?: boolean;
}

const initialForm = {
  titulo: "",
  descripcion: "",
  completado: false,
};

const initialErrors = {
  titulo: false,
  descripcion: false,
};

function ModalTareas({
  tarea,
  abrirModal,
  setAbrirModal,
  setTareas,
}: Readonly<{
  tarea: Tarea | null;
  abrirModal: boolean;
  setAbrirModal: React.Dispatch<React.SetStateAction<boolean>>;
  setTareas: React.Dispatch<React.SetStateAction<Tarea[]>>;
}>) {
  const dialogRef = useRef(null);
  const [form, setForm] = useState(tarea || initialForm);
  const [errors, setErrors] = useState<{ [key: string]: boolean }>(
    initialErrors
  );
  const tareaController = new TareaController();
  const { state } = useAuth();

  useEffect(() => {
    if (abrirModal) {
      (dialogRef.current! as HTMLDialogElement).showModal();
    } else {
      (dialogRef.current! as HTMLDialogElement).close();
    }
  }, [abrirModal]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: false });
    }
  };

  const handleCompletoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm({
      ...form,
      completado: e.target.value === "1",
    });
  };

  const validateForm = () => {
    const newErrors = { ...initialErrors };
    let isValid = true;
    if (!form.titulo) {
      newErrors.titulo = true;
      isValid = false;
    }
    if (!form.descripcion) {
      newErrors.descripcion = true;
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const agregarTareaBD = async (tarea: CrearTarea) => {
    try {
      const tareaBD = await tareaController.crearTarea(tarea);
      setTareas((prevTareas) => [...prevTareas, tareaBD]);
      console.log("Tarea creada:", tareaBD);
    } catch (error) {
      console.error("Error al crear la tarea:", error);
    }
  };

  const editarTareaBD = async (tarea: Partial<Tarea>) => {
    try {
      const tareaEditada: EditarTarea = {
        id: tarea.id!,
        titulo: tarea.titulo,
        descripcion: tarea.descripcion,
        completado: tarea.completado,
      };

      const tareaBD = await tareaController.actualizarTarea(
        tarea.id!,
        tareaEditada
      );
      setTareas((prevTareas) =>
        prevTareas.map((t) => (t.id === tareaBD.id ? tareaBD : t))
      );
      console.log("Tarea editada:", tareaBD);
    } catch (error) {
      console.error("Error al editar la tarea:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      if (tarea) {
        editarTareaBD(form);
        console.log("Editar tarea:", form);
      } else {
        const nuevaTarea = { ...form, usuarioId: state.user!.id };
        agregarTareaBD(nuevaTarea);
        console.log("Agregar tarea:", form);
      }
      setForm(initialForm);
      setAbrirModal(false);
    }
  };

  return (
    <dialog ref={dialogRef} className="rounded-lg shadow-lg p-5">
      <div className="flex justify-end">
        <button
          type="button"
          className="text-gray-400 hover:text-gray-600"
          onClick={() => setAbrirModal(false)}
        >
          <FaTimes size={20} />
        </button>
      </div>
      <div className="flex flex-col px-5 py-8">
        <h2 className="text-xl font-bold text-center">
          {tarea ? `Editar tarea: ${tarea.titulo}` : "Agregar Tarea"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="flex gap-5 items-center my-5">
            <label htmlFor="titulo" className="font-semibold text-base">
              Titulo:
            </label>
            <input
              className={`bg-[#F1F4F9] border-[#D8D8D8] border rounded-lg p-2
            ${errors.titulo ? "ring-red-500 ring" : ""}`}
              type="text"
              id="titulo"
              name="titulo"
              placeholder="Titulo de la tarea"
              value={form.titulo}
              onChange={handleChange}
            />
          </div>

          <div className="flex flex-col gap-2 my-5">
            <label htmlFor="descripcion" className="font-semibold text-base">
              Descripción:
            </label>
            <textarea
              className={`bg-[#F1F4F9] border-[#D8D8D8] border rounded-lg p-2
            ${errors.descripcion ? "ring-red-500 ring" : ""}`}
              id="descripcion"
              name="descripcion"
              placeholder="Descripción de la tarea"
              value={form.descripcion}
              onChange={handleChange}
            />
          </div>

          <div className="flex gap-5 items-center my-5">
            <label htmlFor="completado" className="font-semibold text-base">
              Completado:
            </label>
            <select
              className="bg-[#F1F4F9] border-[#D8D8D8] border rounded-lg p-2 mt-3"
              name="completado"
              onChange={handleCompletoChange}
              value={form.completado ? "1" : "0"}
            >
              <option value="0">Por Completar</option>
              <option value="1">Completado</option>
            </select>
          </div>

          <div className="flex flex-col">
            <button
              className={`${
                tarea ? "bg-blue-600" : "bg-green-600"
              } text-white font-bold text-lg rounded-lg py-3 mt-10 sm:mt-5`}
              type="submit"
            >
              {tarea ? "Editar Tarea" : "Agregar Tarea"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}

ModalTareas.defaultProps = {
  tarea: null,
};

export default ModalTareas;
