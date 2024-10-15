"use client";

import TareaController from "@/controllers/tareaController";
import Tarea from "@/models/tarea";
import React, { useEffect, useRef } from "react";

interface ModalEliminarTareaProps {
  tarea: Tarea;
  abrirModalEliminar: boolean;
  setAbrirModalEliminar: React.Dispatch<React.SetStateAction<boolean>>;
  setTareas: React.Dispatch<React.SetStateAction<Tarea[]>>;
}

const ModalEliminarTarea: React.FC<ModalEliminarTareaProps> = ({
  tarea,
  abrirModalEliminar,
  setAbrirModalEliminar,
  setTareas,
}) => {
  const dialogRef = useRef(null);
  const tareaController = new TareaController();

  useEffect(() => {
    if (abrirModalEliminar) {
      (dialogRef.current! as HTMLDialogElement).showModal();
    } else {
      (dialogRef.current! as HTMLDialogElement).close();
    }
  }, [abrirModalEliminar]);

  const handleSubmit = () => {
    const eliminarTareaBD = async (id: number) => {
      try {
        await tareaController.eliminarTarea(id);
        setTareas((tareas) => tareas.filter((t) => t.id !== id));
        console.log("Tarea eliminada:", id);
      } catch (error) {
        console.error("Error al eliminar la tarea:", error);
      }
    };

    eliminarTareaBD(tarea.id);

    setAbrirModalEliminar(false);
  };

  return (
    <dialog ref={dialogRef} className="rounded-lg shadow-lg p-5">
      <div className="flex flex-col px-5 py-8 gap-5">
        <h2 className="text-xl font-bold text-center">
          Eliminar Tarea: {tarea.titulo}
        </h2>
        <p className="text-gray-500 text-sm text-center">
          ¿Estás seguro de que deseas eliminar esta tarea?
        </p>
        <div className="my-4 flex justify-center gap-10">
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-md"
            onClick={handleSubmit}
          >
            Eliminar
          </button>
          <button
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md"
            onClick={() => setAbrirModalEliminar(false)}
          >
            Cancelar
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ModalEliminarTarea;
