"use client";

import { useAuth } from "@/context/AuthContext";
import TareaController from "@/controllers/tareaController";
import Tarea from "@/models/tarea";
import Tareas from "@/views/Tareas";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

function PaginaTareas() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const { state } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!state.token) {
      router.push("/");
    } else {
      const tareaController = new TareaController();
      const obtenerTareas = async () => {
        try {
          const tareasBD = await tareaController.obtenerTareas(state.user!.id);
          setTareas(tareasBD);
        } catch (error) {
          console.error("Error al obtener las tareas:", error);
        }
      };

      obtenerTareas();
    }
  }, [state.token, state.user, router]);

  return (
    <div className="m-8">
      <Tareas tareas={tareas} setTareas={setTareas} />
    </div>
  );
}

export default PaginaTareas;
