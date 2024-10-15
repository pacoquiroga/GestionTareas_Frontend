"use client";

import TarjetaTarea from "@/components/TarjetaTarea";
import Tarea from "@/models/tarea";
import { useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import ModalTareas from "./ModalTareas";
import ModalEliminarTarea from "@/views/ModalEliminarTarea";

function Tareas({
  tareas,
  setTareas,
}: Readonly<{
  tareas: Tarea[];
  setTareas: React.Dispatch<React.SetStateAction<Tarea[]>>;
}>) {
  const [tareaSeleccionada, setTareaSeleccionada] = useState<Tarea | null>(
    null
  );
  const [abrirModal, setAbrirModal] = useState(false);
  const [abrirModalEliminar, setAbrirModalEliminar] = useState(false);

  const handleAgregarTarea = () => {
    setTareaSeleccionada(null);
    setAbrirModal(true);
  };

  return (
    <div className="mt-5">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-900">Todas las Tareas</h2>
        <button className="hover:text-gray-600" onClick={handleAgregarTarea}>
          <IoMdAddCircleOutline size={40} />
        </button>
      </div>

      {tareas.length === 0 && (
        <p className="text-xl text-gray-600 mt-5">No hay tareas registradas</p>
      )}

      <div className="m-10 grid grid-cols-3 gap-10">
        {tareas.map((tarea) => (
          <TarjetaTarea
            key={tarea.id}
            tarea={tarea}
            setTareaSeleccionada={setTareaSeleccionada}
            setAbrirModal={setAbrirModal}
            setAbrirModalEliminar={setAbrirModalEliminar}
          />
        ))}
      </div>

      {abrirModal && (
        <ModalTareas
          tarea={tareaSeleccionada}
          abrirModal={abrirModal}
          setAbrirModal={setAbrirModal}
          setTareas={setTareas}
        />
      )}

      {abrirModalEliminar && (
        <ModalEliminarTarea
          tarea={tareaSeleccionada!}
          abrirModalEliminar={abrirModalEliminar}
          setAbrirModalEliminar={setAbrirModalEliminar}
          setTareas={setTareas}
        />
      )}
    </div>
  );
}

export default Tareas;
