import axios from "axios";

interface respuestaLogin {
  token: string;
  user: {
    id: number;
    username: string;
  };
}

export default class UsuarioController {
  usuarioAPI = axios.create({
    baseURL: "http://localhost:3000/auth",
  });

  public async login(
    username: string,
    password: string
  ): Promise<respuestaLogin> {
    try {
      const response = await this.usuarioAPI.post("/signin", {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      throw new Error((error as any).response.data.message);
    }
  }

  public async signup(
    username: string,
    password: string
  ): Promise<respuestaLogin> {
    try {
      await this.usuarioAPI.post("/signup", {
        username,
        password,
      });
      const usuario = await this.login(username, password);
      return usuario;
    } catch (error) {
      throw new Error((error as any).response.data.message);
    }
  }
}
