import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase'; // Asegúrate de que esta ruta sea correcta
import { useAppContext } from '../context/AppContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setIsGuest, setUser } = useAppContext(); // Obtener setIsGuest y setUser del contexto

  const validateEmail = (email: string): boolean => {
    // Regex simple para validar formato de email (puede ser más complejo si es necesario)
    const re = /^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com)$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password: string): boolean => {
    // Validación simple: al menos 6 caracteres (Supabase default)
    return password.length >= 6;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError('Por favor, ingresa un email válido de Gmail o Hotmail.');
      return;
    }
    if (!validatePassword(password)) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    setLoading(false);
    if (error) {
      console.error('Error al iniciar sesión:', error);
      // Mapear errores comunes de Supabase a mensajes amigables
      if (error.message.includes('Invalid login credentials')) {
         setError('Email o contraseña incorrectos.');
      } else if (error.message.includes('Email not confirmed')) {
         setError('Por favor, confirma tu email antes de iniciar sesión.');
      } 
      // Puedes añadir más casos según los errores específicos de Supabase que encuentres
      else {
         setError(`Error al iniciar sesión: ${error.message}`);
      }
    } else if (data.user) {
      setUser(data.user);
      setIsGuest(false); // Asegurarse de que no está en modo invitado
      navigate('/dashboard'); // Redirigir al dashboard
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(email)) {
      setError('Por favor, ingresa un email válido de Gmail o Hotmail.');
      return;
    }
    if (!validatePassword(password)) {
      setError('La contraseña debe tener al menos 6 caracteres.'); // Supabase default
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    setLoading(false);
    if (error) {
      console.error('Error al registrar usuario:', error);
       if (error.message.includes('User already registered')) {
          setError('El email ya está registrado.');
       } else if (error.message.includes('Password should be at least 6 characters')) {
          setError('La contraseña debe tener al menos 6 caracteres.');
       } 
       // Puedes añadir más casos según los errores específicos de Supabase que encuentres
       else {
          setError(`Error al registrar usuario: ${error.message}`);
       }
    } else if (data.user) {
      // Usuario registrado, Supabase enviará un email de confirmación si está configurado
      // Puedes redirigir a una página de éxito o mostrar un mensaje
      alert('Registro exitoso. Por favor, revisa tu email para confirmar tu cuenta.');
      setUser(data.user);
      setIsGuest(false); // Asegurarse de que no está en modo invitado
      navigate('/dashboard'); // O podrías redirigir a una página de espera de confirmación
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      // Redirige al usuario de vuelta a la aplicación después del login de Google
      // Asegúrate de que esta URL esté configurada en tu dashboard de Supabase -> Authentication -> URL de Redirección
      options: { redirectTo: window.location.origin + '/dashboard' } 
    });

    // Supabase Auth redirigirá al usuario al proveedor (Google), por lo que este código después
    // de la llamada a signInWithOAuth solo se ejecutará si hay un error antes de la redirección.
    setLoading(false);
    if (error) {
      console.error('Error al iniciar sesión con Google:', error);
      setError(`Error al iniciar sesión con Google: ${error.message}`);
    }
     // La redirección exitosa la maneja Supabase, y la página de dashboard
     // debe verificar el estado de autenticación al cargar.
  };

   const handleGuestLogin = () => {
      setIsGuest(true); // Establecer modo invitado
      setUser(null); // Asegurarse de que no hay usuario autenticado
      navigate('/dashboard'); // Redirigir al dashboard en modo invitado
   };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-neutral-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-neutral-800">
        <h2 className="text-2xl font-bold text-center text-neutral-800 dark:text-neutral-100">
          Welcome to FlashLingo
        </h2>

        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-md dark:bg-red-900 dark:text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-100"
              placeholder="Enter your Gmail or Hotmail"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6} // Client-side hint, validation is also on server
              className="w-full px-3 py-2 border border-neutral-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-700 dark:border-neutral-600 dark:text-neutral-100"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-white bg-primary-600 rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 dark:bg-primary-700 dark:hover:bg-primary-600 dark:focus:ring-offset-neutral-800"
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
           <button
            type="button"
            onClick={handleRegister}
            disabled={loading}
            className="w-full px-4 py-2 text-primary-600 bg-transparent border border-primary-600 rounded-md shadow-sm hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 dark:text-primary-400 dark:border-primary-400 dark:hover:bg-neutral-700 dark:focus:ring-offset-neutral-800"
          >
            Register
          </button>
        </form>
        
        <div className="relative mt-6">
           <div className="absolute inset-0 flex items-center">
             <div className="w-full border-t border-neutral-300 dark:border-neutral-600"></div>
           </div>
           <div className="relative flex justify-center text-sm">
             <span className="px-2 bg-white text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
               Or continue with
             </span>
           </div>
         </div>

         <button
           onClick={handleGoogleLogin}
           disabled={loading}
           className="w-full flex items-center justify-center px-4 py-2 space-x-2 border border-neutral-300 rounded-md shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 dark:border-neutral-600 dark:hover:bg-neutral-700 dark:focus:ring-offset-neutral-800"
         >
            {/* Icono de Google (puedes reemplazarlo por un SVG o icono real) */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12.0003 4.99998C13.9993 4.99998 15.6993 5.69998 17.0993 7.09998L19.7993 4.39998C17.8993 2.59998 15.1993 1.49998 12.0003 1.49998C8.20025 1.49998 4.80025 3.59998 3.00025 6.89998L5.69925 9.59998C6.69925 7.79998 9.10025 6.39998 12.0003 6.39998C12.6003 6.39998 13.2003 6.49998 13.7003 6.69998L12.0003 8.39998C11.5003 8.39998 11.0003 8.29998 10.6003 8.09998L8.00025 10.6999C8.30025 10.9999 8.50025 11.3999 8.60025 11.7999C8.70025 12.0999 8.70025 12.3999 8.70025 12.6999C8.70025 12.9999 8.70025 13.2999 8.60025 13.5999C8.50025 13.9999 8.30025 14.3999 8.00025 14.6999L10.6003 17.2999C11.0003 17.0999 11.5003 16.9999 12.0003 16.9999C14.8003 16.9999 17.2003 18.3999 18.3003 20.5999L20.9003 17.9999C19.7003 15.6999 17.1003 13.9999 14.2003 13.4999V11.9999H12.0003V10.4999H14.2003C14.5003 10.4999 14.8003 10.3999 15.1003 10.2999C15.2003 10.0999 15.3003 9.89992 15.4003 9.69992L17.8003 12.1999C17.1003 13.1999 16.2003 13.9999 15.2003 14.5999L17.0003 16.3999C17.7003 15.7999 18.3003 15.0999 18.8003 14.2999L21.3003 16.7999C19.7003 19.2999 17.0003 20.9999 14.0003 21.4999V23.4999H10.0003V21.4999C7.00025 20.9999 4.30025 19.2999 2.70025 16.7999L5.20025 14.2999C5.70025 15.0999 6.30025 15.7999 7.00025 16.3999L8.80025 14.5999C7.80025 13.9999 6.90025 13.1999 6.20025 12.1999L8.60025 9.69992C8.70025 9.89992 8.80025 10.0999 8.90025 10.2999C9.20025 10.3999 9.50025 10.4999 9.80025 10.4999H12.0003V11.9999H9.80025C7.00025 11.9999 4.60025 10.5999 3.50025 8.39998L5.69925 5.69998C6.50025 6.59998 7.50025 7.29998 8.70025 7.79998L10.0003 6.49998C9.40025 6.29998 8.90025 6.09998 8.40025 5.79998Z" fill="currentColor"/>
            </svg>
           <span>Sign in with Google</span>
         </button>

         <button
           onClick={handleGuestLogin}
           disabled={loading}
           className="w-full px-4 py-2 text-neutral-700 bg-transparent border border-neutral-300 rounded-md shadow-sm hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 dark:text-neutral-300 dark:border-neutral-600 dark:hover:bg-neutral-700 dark:focus:ring-offset-neutral-800"
         >
           Continue as Guest
         </button>

      </div>
    </div>
  );
};

export default LoginPage; 