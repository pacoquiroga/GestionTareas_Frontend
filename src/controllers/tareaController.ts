import Tarea from "@/models/tarea";
import axios from "axios";

interface CrearTarea {
  titulo: string;
  descripcion: string;
  usuarioId: number;
}

export default class TareaController {
  tareasAPI = axios.create({
    baseURL: "http://localhost:3000/tareas",
  });

  public async obtenerTareas(idUsuario: number): Promise<Tarea[]> {
    const response = await this.tareasAPI.get(`/?userId=${idUsuario}`);
    return response.data;
  }

  public async obtenerTareaPorId(id: number): Promise<Tarea> {
    const response = await this.tareasAPI.get(`/${id}`);
    return response.data;
  }

  public async crearTarea(tarea: CrearTarea): Promise<Tarea> {
    const response = await this.tareasAPI.post("/", tarea);
    return response.data;
  }

  public async actualizarTarea(
    id: number,
    tarea: Partial<Tarea>
  ): Promise<Tarea> {
    const response = await this.tareasAPI.patch(`/${id}`, tarea);
    return response.data;
  }

  public async eliminarTarea(id: number): Promise<void> {
    const response = await this.tareasAPI.delete(`/${id}`);
  }
}
