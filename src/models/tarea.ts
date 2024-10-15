export default class Tarea {
  constructor(
    public id: number,
    public titulo: string,
    public descripcion: string,
    public completado: boolean = false,
    public usuarioId: number
  ) {}
}
