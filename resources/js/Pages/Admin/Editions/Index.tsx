import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import { Plus, ChevronRight, Calendar, Users, Tag } from 'lucide-react';

interface Edition {
    id: number;
    name: string;
    theme: string;
    participation_mode: string;
    group_size: number;
    status: string;
    event_date: string | null;
    use_letters: boolean;
}

interface Props {
    editions: Edition[];
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    draft:              { label: 'Borrador',           color: 'var(--text-muted)' },
    groups_forming:     { label: 'Formando grupos',    color: '#6B9FD4' },
    letters_assigned:   { label: 'Letras asignadas',   color: '#C9A84C' },
    costumes_revealed:  { label: 'Disfraces visibles', color: '#9B72CF' },
    voting_open:        { label: 'Votación abierta',   color: '#52B788' },
    closed:             { label: 'Cerrada',            color: 'var(--text-muted)' },
};

const MODE_LABELS: Record<string, string> = {
    individual: 'Individual',
    pairs:      'Parejas',
    groups:     'Grupos',
};

export default function AdminEditionsIndex({ editions }: Props) {
    return (
        <AppLayout title="Ediciones">
            <Head title="Gestionar ediciones" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

                {/* Botón crear */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        onClick={() => router.visit('/admin/editions/create')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            background: 'var(--gold)',
                            color: '#0D0D0D',
                            borderRadius: '8px',
                            padding: '0.65rem 1.25rem',
                            fontSize: '0.9rem',
                            fontWeight: 600,
                            border: 'none',
                            cursor: 'pointer',
                        }}
                    >
                        <Plus size={16} strokeWidth={2} />
                        Nueva edición
                    </button>
                </div>

                {/* Lista */}
                {editions.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '3rem 1rem',
                        color: 'var(--text-muted)',
                        background: 'var(--surface)',
                        borderRadius: '10px',
                        border: '1px solid var(--border)',
                    }}>
                        <Calendar size={32} strokeWidth={1} style={{ marginBottom: '1rem', opacity: 0.4 }} />
                        <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.1rem' }}>
                            No hay ediciones todavía
                        </p>
                        <p style={{ fontSize: '0.8rem', marginTop: '0.4rem' }}>
                            Crea la primera edición para empezar
                        </p>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {editions.map(edition => {
                            const status = STATUS_LABELS[edition.status] ?? { label: edition.status, color: 'var(--text-muted)' };
                            return (
                                <div
                                    key={edition.id}
                                    onClick={() => router.visit(`/admin/editions/${edition.id}`)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        background: 'var(--surface)',
                                        border: '1px solid var(--border)',
                                        borderRadius: '10px',
                                        padding: '1rem 1.25rem',
                                        cursor: 'pointer',
                                        transition: 'border-color 0.2s ease',
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-gold)')}
                                    onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                                >
                                    {/* Info */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            fontSize: '0.95rem',
                                            color: 'var(--text-primary)',
                                            fontWeight: 500,
                                            marginBottom: '0.4rem',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}>
                                            {edition.name}
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                            <Chip icon={<Tag size={11} />} label={edition.theme} />
                                            <Chip icon={<Users size={11} />} label={MODE_LABELS[edition.participation_mode]} />
                                            {edition.event_date && (
                                                <Chip icon={<Calendar size={11} />} label={new Date(edition.event_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })} />
                                            )}
                                        </div>
                                    </div>

                                    {/* Status + arrow */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
                                        <span style={{
                                            fontSize: '0.72rem',
                                            color: status.color,
                                            background: `${status.color}18`,
                                            border: `1px solid ${status.color}40`,
                                            borderRadius: '20px',
                                            padding: '0.2rem 0.6rem',
                                            whiteSpace: 'nowrap',
                                        }}>
                                            {status.label}
                                        </span>
                                        <ChevronRight size={16} strokeWidth={1.5} color="var(--text-muted)" />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

function Chip({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem',
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            background: 'var(--surface-raised)',
            borderRadius: '20px',
            padding: '0.15rem 0.5rem',
        }}>
            {icon}
            {label}
        </span>
    );
}