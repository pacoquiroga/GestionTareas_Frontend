"use client";

import TareaController from "@/controllers/tareaController";
import Tarea from "@/models/tarea";
import React, { useState } from "react";
import { MdEditSquare, MdDelete } from "react-icons/md";

function TarjetaTarea({
  tarea,
  setTareaSeleccionada,
  setAbrirModal,
  setAbrirModalEliminar,
}: Readonly<{
  tarea: Tarea;
  setTareaSeleccionada: React.Dispatch<React.SetStateAction<Tarea | null>>;
  setAbrirModal: React.Dispatch<React.SetStateAction<boolean>>;
  setAbrirModalEliminar: React.Dispatch<React.SetStateAction<boolean>>;
}>) {
  const [completado, setCompletado] = useState<boolean>(tarea.completado);

  const tareaController = new TareaController();

  const handleEditar = () => {
    setTareaSeleccionada(tarea);
    setAbrirModal(true);
  };

  const handleEditarCompleto = () => {
    const editarTareaBD = async (id: number, completado: boolean) => {
      try {
        const tareaBD = await tareaController.actualizarTarea(id, {
          completado,
        });
        setCompletado(completado);
        console.log("Tarea editada:", tareaBD);
      } catch (error) {
        console.error("Error al editar la tarea:", error);
      }
    };

    editarTareaBD(tarea.id, !completado);
  };

  const handleEliminar = () => {
    setTareaSeleccionada(tarea);
    setAbrirModalEliminar(true);
  };

  return (
    <div className="h-52">
      <div className="flex flex-col justify-around gap-3 h-full bg-blue-500 shadow-md rounded-md p-4 text-white">
        <h3 className="text-lg font-semibold">{tarea.titulo}</h3>
        <p className="text-slate-200 text-sm">{tarea.descripcion}</p>
        <div className="mt-2 flex justify-between">
          <button
            onClick={handleEditarCompleto}
            className={`px-2 py-3 rounded-full
              ${
                completado
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-red-500 hover:bg-red-600"
              }`}
          >
            {completado ? "Completado" : "Por Completar"}
          </button>

          <div className="self-end">
            <button
              className="hover:text-yellow-400 mr-1"
              onClick={handleEditar}
            >
              <MdEditSquare size={30} />
            </button>
            <button className="hover:text-red-400" onClick={handleEliminar}>
              <MdDelete size={30} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TarjetaTarea;
