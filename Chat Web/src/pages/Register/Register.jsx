import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import BackButton from '../../components/BackButton';

const inputClass =
  'block w-full rounded-xl bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 ring-1 ring-inset ring-white/10 transition focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-sky-400';

function Register() {
  const { register } = useContext(AuthContext);
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(fullname, email, password);
      navigate('/');
    } catch (err) {
      console.error('Registration error:', err);
      setError(
        err?.response?.data?.message ||
          'We could not create your account. Check your details and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#12161d] bg-[radial-gradient(60rem_40rem_at_10%_-10%,rgba(56,189,248,0.12),transparent),radial-gradient(50rem_40rem_at_100%_110%,rgba(129,140,248,0.14),transparent)] px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center gap-3">
          <BackButton />
        </div>

        <div className="rounded-2xl bg-white/[0.04] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.35)] ring-1 ring-white/10 backdrop-blur sm:p-8">
          <h1 className="text-2xl font-semibold tracking-tight text-white">
            Create your account
          </h1>
          <p className="mt-1.5 text-sm text-slate-400">
            Sign up to start chatting with your contacts.
          </p>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div
                role="alert"
                className="rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-300 ring-1 ring-inset ring-rose-400/30"
              >
                {error}
              </div>
            )}

            <div>
              <label htmlFor="fullname" className="mb-1.5 block text-sm font-medium text-slate-200">
                Full name
              </label>
              <input
                id="fullname"
                name="fullname"
                type="text"
                autoComplete="name"
                required
                placeholder="Priya Sharma"
                value={fullname}
                onChange={(e) => setFullname(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-200">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-slate-200">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClass} pr-16`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute inset-y-0 right-0 px-4 text-sm font-medium text-slate-400 transition hover:text-white focus:outline-none focus-visible:text-sky-300"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-xl bg-sky-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#12161d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-sky-300 underline-offset-4 transition hover:text-sky-200 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Register;
