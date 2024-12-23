import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Swal from 'sweetalert2';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handlerLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:8888/login", {
        email,
        password,
      });

      if (response.data.error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: response.data.error,
        });
        return;
      } else {
        const { accessToken, user } = response.data;
        login(accessToken, user.role); // Pass the role to the login function
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`; // Set the token in the headers
        Swal.fire({
          icon: 'success',
          title: 'Inicio de sesión exitoso',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          navigate("/admin/dashboard");
        });
      }

    } catch (error) {
      console.log(error);
      if (error.response && error.response.status === 404) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Datos ingresados incorrectos.',
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error al iniciar sesión',
        });
      }
      return;
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <>
      <div className="flex justify-center items-center h-[70.8vh]">
        <div className="md:w-1/3 flex justify-end">
          <img
            src="/images/Car1.webp"
            alt="bg"
            className="scale-125 hidden md:block"
          />
        </div>
        <div className="md:w-1/3 flex justify-center">
          <div className=" bg-zinc-800 p-8 rounded-lg shadow-lg w-96 text-white">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Iniciar Sesión
            </h2>
            <form className="space-y-4" onSubmit={handlerLogin}>
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
                  placeholder="correo@ejemplo.com"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
                    placeholder="Ingresa tu contraseña"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-2xl text-black pr-2"
                    onClick={togglePasswordVisibility}
                  >
                    {passwordVisible ? <FaEye /> : <FaEyeSlash size={25} />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
              >
                Iniciar Sesión
              </button>
            </form>
            <div className="mt-4 text-center">
              <p>¿No tienes una cuenta? <Link to="/register" className="text-blue-500 underline">Regístrate</Link></p>
            </div>
          </div>
        </div>

        <div className="md:w-1/3 flex justify-start">
          <img src="/images/Car2.webp" alt="bg" className="hidden md:block" />
        </div>
      </div>
    </>
  );
}
