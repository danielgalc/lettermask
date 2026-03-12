import { FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Ticket } from 'lucide-react';

export default function Login({ status, canResetPassword }: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), { onFinish: () => reset('password') });
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--background)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'DM Sans, sans-serif',
        }}>
            <Head title="Iniciar sesión" />

            <div style={{
                width: '100%',
                maxWidth: '420px',
                padding: '0 1.5rem',
            }}>
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}>
                        <Ticket size={28} color="var(--gold)" strokeWidth={1.5} />
                        <span style={{
                            fontFamily: 'Playfair Display, serif',
                            fontSize: '2.5rem',
                            color: 'var(--gold)',
                            letterSpacing: '0.02em',
                        }}>
                            LetterMask
                        </span>
                    </div>
                    <div style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-muted)',
                        marginTop: '0.4rem',
                    }}>
                        Concurso de disfraces
                    </div>
                </div>

                {/* Card */}
                <div style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border-gold)',
                    borderRadius: '12px',
                    padding: '2.5rem',
                }}>
                    <h2 style={{
                        fontFamily: 'Playfair Display, serif',
                        fontSize: '1.4rem',
                        color: 'var(--text-primary)',
                        marginBottom: '2rem',
                    }}>
                        Bienvenido de nuevo
                    </h2>

                    {status && (
                        <div style={{
                            background: 'rgba(82, 183, 136, 0.1)',
                            border: '1px solid var(--success-light)',
                            color: 'var(--success-light)',
                            borderRadius: '6px',
                            padding: '0.75rem 1rem',
                            fontSize: '0.85rem',
                            marginBottom: '1.5rem',
                        }}>
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {/* Email */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.8rem',
                                color: 'var(--text-secondary)',
                                marginBottom: '0.4rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                            }}>
                                Email
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={e => setData('email', e.target.value)}
                                autoComplete="username"
                                required
                            />
                            {errors.email && (
                                <p style={{ color: 'var(--danger-light)', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label style={{
                                display: 'block',
                                fontSize: '0.8rem',
                                color: 'var(--text-secondary)',
                                marginBottom: '0.4rem',
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                            }}>
                                Contraseña
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={e => setData('password', e.target.value)}
                                autoComplete="current-password"
                                required
                            />
                            {errors.password && (
                                <p style={{ color: 'var(--danger-light)', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginTop: '0.5rem',
                        }}>
                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    style={{
                                        fontSize: '0.8rem',
                                        color: 'var(--text-muted)',
                                    }}
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            )}
                            <button
                                type="submit"
                                disabled={processing}
                                style={{
                                    background: 'var(--gold)',
                                    color: '#0D0D0D',
                                    border: 'none',
                                    borderRadius: '6px',
                                    padding: '0.7rem 2rem',
                                    fontWeight: 600,
                                    fontSize: '0.9rem',
                                    letterSpacing: '0.05em',
                                    opacity: processing ? 0.7 : 1,
                                    marginLeft: 'auto',
                                }}
                            >
                                {processing ? 'Entrando...' : 'Entrar'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}