import AppLayout from '@/Layouts/AppLayout';
import { Head, useForm } from '@inertiajs/react';
import { ReactNode } from 'react';
import { Calendar, Users, Tag, ToggleLeft } from 'lucide-react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        theme: '',
        participation_mode: 'individual',
        group_size: 1,
        event_date: '',
        use_letters: false,
    });

    function submit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/editions');
    }

    const isIndividual = data.participation_mode === 'individual';

    return (
        <AppLayout title="Nueva edición">
            <Head title="Nueva edición" />

            <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '560px' }}>

                {/* Nombre */}
                <Field label="Nombre de la edición" error={errors.name}>
                    <input
                        type="text"
                        value={data.name}
                        onChange={e => setData('name', e.target.value)}
                        placeholder="Ej: Navidad 2025"
                    />
                </Field>

                {/* Temática */}
                <Field label="Temática" error={errors.theme}>
                    <input
                        type="text"
                        value={data.theme}
                        onChange={e => setData('theme', e.target.value)}
                        placeholder="Ej: Películas de los 90, Libre, Videojuegos..."
                    />
                </Field>

                {/* Fecha */}
                <Field label="Fecha del evento" error={errors.event_date}>
                    <input
                        type="date"
                        value={data.event_date}
                        onChange={e => setData('event_date', e.target.value)}
                        style={{ colorScheme: 'dark' }}
                    />
                </Field>

                {/* Modo de participación */}
                <Field label="Modo de participación" error={errors.participation_mode}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                        {(['individual', 'pairs', 'groups'] as const).map(mode => (
                            <button
                                key={mode}
                                type="button"
                                onClick={() => {
                                    setData('participation_mode', mode);
                                    if (mode === 'individual') setData('group_size', 1);
                                    if (mode === 'pairs') setData('group_size', 2);
                                    if (mode !== 'individual') setData('use_letters', false);
                                }}
                                style={{
                                    padding: '0.6rem',
                                    borderRadius: '8px',
                                    border: `1px solid ${data.participation_mode === mode ? 'var(--gold)' : 'var(--border)'}`,
                                    background: data.participation_mode === mode ? 'rgba(201, 168, 76, 0.1)' : 'var(--surface-raised)',
                                    color: data.participation_mode === mode ? 'var(--gold)' : 'var(--text-secondary)',
                                    fontSize: '0.85rem',
                                    fontWeight: data.participation_mode === mode ? 500 : 400,
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                }}
                            >
                                {mode === 'individual' ? 'Individual' : mode === 'pairs' ? 'Parejas' : 'Grupos'}
                            </button>
                        ))}
                    </div>
                </Field>

                {/* Tamaño de grupo (solo si no es individual) */}
                {!isIndividual && (
                    <Field label={`Participantes por ${data.participation_mode === 'pairs' ? 'pareja' : 'grupo'}`} error={errors.group_size}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <button
                                type="button"
                                onClick={() => setData('group_size', Math.max(2, data.group_size - 1))}
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border)',
                                    background: 'var(--surface-raised)',
                                    color: 'var(--text-primary)',
                                    fontSize: '1.2rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}
                            >
                                −
                            </button>
                            <div style={{
                                flex: 1,
                                textAlign: 'center',
                                fontFamily: 'Playfair Display, serif',
                                fontSize: '1.8rem',
                                color: 'var(--gold)',
                            }}>
                                {data.group_size}
                            </div>
                            <button
                                type="button"
                                onClick={() => setData('group_size', Math.min(20, data.group_size + 1))}
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border)',
                                    background: 'var(--surface-raised)',
                                    color: 'var(--text-primary)',
                                    fontSize: '1.2rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    flexShrink: 0,
                                }}
                            >
                                +
                            </button>
                        </div>
                    </Field>
                )}

                {/* Usar letras (solo si es individual) */}
                {isIndividual && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'var(--surface)',
                        border: `1px solid ${data.use_letters ? 'var(--border-gold)' : 'var(--border)'}`,
                        borderRadius: '10px',
                        padding: '1rem 1.25rem',
                        cursor: 'pointer',
                        transition: 'border-color 0.2s ease',
                    }}
                        onClick={() => setData('use_letters', !data.use_letters)}
                    >
                        <div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                                Sortear letras
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                                Cada participante recibirá una letra asignada
                            </div>
                        </div>
                        <div style={{
                            width: '44px',
                            height: '24px',
                            borderRadius: '12px',
                            background: data.use_letters ? 'var(--gold)' : 'var(--border)',
                            position: 'relative',
                            transition: 'background 0.2s ease',
                            flexShrink: 0,
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '3px',
                                left: data.use_letters ? '23px' : '3px',
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                background: 'white',
                                transition: 'left 0.2s ease',
                            }} />
                        </div>
                    </div>
                )}

                {/* Submit */}
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <button
                        type="button"
                        onClick={() => window.history.back()}
                        style={{
                            flex: 1,
                            padding: '0.8rem',
                            borderRadius: '8px',
                            border: '1px solid var(--border)',
                            background: 'transparent',
                            color: 'var(--text-secondary)',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                        }}
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={processing}
                        style={{
                            flex: 2,
                            padding: '0.8rem',
                            borderRadius: '8px',
                            border: 'none',
                            background: 'var(--gold)',
                            color: '#0D0D0D',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            cursor: processing ? 'not-allowed' : 'pointer',
                            opacity: processing ? 0.7 : 1,
                            transition: 'opacity 0.2s ease',
                        }}
                    >
                        {processing ? 'Creando...' : 'Crear edición'}
                    </button>
                </div>
            </form>
        </AppLayout>
    );
}

function Field({ label, error, children }: {
    label: string;
    error?: string;
    children: ReactNode;
}) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <label style={{
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
            }}>
                {label}
            </label>
            {children}
            {error && (
                <p style={{ fontSize: '0.8rem', color: 'var(--danger-light)', marginTop: '0.2rem' }}>
                    {error}
                </p>
            )}
        </div>
    );
}