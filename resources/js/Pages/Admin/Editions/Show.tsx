import AppLayout from '@/Layouts/AppLayout';
import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash2, ChevronRight, Users, Tag, Calendar, ToggleRight } from 'lucide-react';

interface Participation {
    id: number;
    is_leader: boolean;
    user: { id: number; name: string; };
}

interface Group {
    id: number;
    name: string | null;
    letter: string | null;
    costume_name: string | null;
    reveal_status: string;
    participations: Participation[];
}

interface Category {
    id: number;
    name: string;
}

interface Edition {
    id: number;
    name: string;
    theme: string;
    participation_mode: string;
    group_size: number;
    status: string;
    event_date: string | null;
    use_letters: boolean;
    groups: Group[];
    categories: Category[];
}

interface Props {
    edition: Edition;
}

const STATUS_FLOW: { key: string; label: string }[] = [
    { key: 'draft',             label: 'Borrador' },
    { key: 'groups_forming',    label: 'Formando grupos' },
    { key: 'letters_assigned',  label: 'Letras asignadas' },
    { key: 'costumes_revealed', label: 'Disfraces visibles' },
    { key: 'voting_open',       label: 'Votación abierta' },
    { key: 'closed',            label: 'Cerrada' },
];

const MODE_LABELS: Record<string, string> = {
    individual: 'Individual',
    pairs: 'Parejas',
    groups: 'Grupos',
};

export default function AdminEditionsShow({ edition }: Props) {
    const currentIndex = STATUS_FLOW.findIndex(s => s.key === edition.status);

    const nextStatus = STATUS_FLOW[currentIndex + 1] ?? null;
    const prevStatus = STATUS_FLOW[currentIndex - 1] ?? null;

    // Skip letters_assigned if use_letters is false
    const getNextStatus = () => {
        if (!nextStatus) return null;
        if (nextStatus.key === 'letters_assigned' && !edition.use_letters) {
            return STATUS_FLOW[currentIndex + 2] ?? null;
        }
        // Skip groups_forming if individual
        if (nextStatus.key === 'groups_forming' && edition.participation_mode === 'individual') {
            if (edition.use_letters) return STATUS_FLOW[currentIndex + 2] ?? null;
            return STATUS_FLOW[currentIndex + 2] ?? null;
        }
        return nextStatus;
    };

    const realNextStatus = getNextStatus();

    function transition(status: string) {
        if (!confirm(`¿Cambiar el estado a "${STATUS_FLOW.find(s => s.key === status)?.label}"?`)) return;
        router.post(`/admin/editions/${edition.id}/transition`, { status });
    }

    function deleteEdition() {
        if (!confirm('¿Eliminar esta edición? Esta acción no se puede deshacer.')) return;
        router.delete(`/admin/editions/${edition.id}`);
    }

    function addCategory() {
        const name = prompt('Nombre de la categoría:');
        if (!name?.trim()) return;
        router.post(`/admin/editions/${edition.id}/categories`, { name });
    }

    function deleteCategory(id: number) {
        if (!confirm('¿Eliminar esta categoría?')) return;
        router.delete(`/admin/categories/${id}`);
    }

    return (
        <AppLayout title={edition.name}>
            <Head title={edition.name} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/admin/editions" style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                        color: 'var(--text-secondary)',
                        textDecoration: 'none',
                        flexShrink: 0,
                    }}>
                        <ArrowLeft size={16} strokeWidth={1.5} />
                    </Link>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.3rem' }}>
                            <Chip icon={<Tag size={11} />} label={edition.theme} />
                            <Chip icon={<Users size={11} />} label={MODE_LABELS[edition.participation_mode]} />
                            {edition.event_date && (
                                <Chip icon={<Calendar size={11} />} label={new Date(edition.event_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })} />
                            )}
                        </div>
                    </div>
                    {edition.status === 'draft' && (
                        <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                            <Link href={`/admin/editions/${edition.id}/edit`} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: '32px', height: '32px', borderRadius: '8px',
                                border: '1px solid var(--border)', color: 'var(--text-secondary)',
                                textDecoration: 'none',
                            }}>
                                <Edit size={15} strokeWidth={1.5} />
                            </Link>
                            <button onClick={deleteEdition} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                width: '32px', height: '32px', borderRadius: '8px',
                                border: '1px solid var(--danger)', background: 'transparent',
                                color: 'var(--danger)',cursor: 'pointer',
                            }}>
                                <Trash2 size={15} strokeWidth={1.5} />
                            </button>
                        </div>
                    )}
                </div>

                {/* Progress bar de estados */}
                <div style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    padding: '1.25rem',
                }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                        Estado actual
                    </div>
                    <div style={{ display: 'flex', gap: '0.3rem', marginBottom: '1.25rem' }}>
                        {STATUS_FLOW.filter(s => {
                            if (s.key === 'letters_assigned' && !edition.use_letters) return false;
                            if (s.key === 'groups_forming' && edition.participation_mode === 'individual') return false;
                            return true;
                        }).map((s, i, arr) => {
                            const sIndex = STATUS_FLOW.findIndex(x => x.key === s.key);
                            const isPast = sIndex < currentIndex;
                            const isCurrent = sIndex === currentIndex;
                            return (
                                <div key={s.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                    <div style={{
                                        height: '4px',
                                        borderRadius: '2px',
                                        background: isPast || isCurrent ? 'var(--gold)' : 'var(--border)',
                                        opacity: isCurrent ? 1 : isPast ? 0.6 : 0.3,
                                    }} />
                                    <div style={{
                                        fontSize: '0.65rem',
                                        color: isCurrent ? 'var(--gold)' : isPast ? 'var(--text-muted)' : 'var(--text-muted)',
                                        opacity: isCurrent ? 1 : 0.6,
                                        fontWeight: isCurrent ? 500 : 400,
                                    }}>
                                        {s.label}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Botones de transición */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {prevStatus && edition.status !== 'draft' && (
                            <button
                                onClick={() => transition(prevStatus.key)}
                                style={{
                                    flex: 1,
                                    padding: '0.65rem',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border)',
                                    background: 'transparent',
                                    color: 'var(--text-secondary)',
                                    fontSize: '0.8rem',
                                    cursor: 'pointer',
                                }}
                            >
                                ← Retroceder
                            </button>
                        )}
                        {realNextStatus && (
                            <button
                                onClick={() => transition(realNextStatus.key)}
                                style={{
                                    flex: 2,
                                    padding: '0.65rem',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: 'var(--gold)',
                                    color: '#0D0D0D',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                }}
                            >
                                Avanzar a {realNextStatus.label} →
                            </button>
                        )}
                        {!realNextStatus && edition.status === 'closed' && (
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', flex: 1 }}>
                                Edición cerrada
                            </div>
                        )}
                    </div>
                </div>

                {/* Categorías */}
                <div style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    padding: '1.25rem',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                            Categorías de votación
                        </div>
                        <button
                            onClick={addCategory}
                            style={{
                                fontSize: '0.8rem',
                                color: 'var(--gold)',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '0.2rem 0.5rem',
                            }}
                        >
                            + Añadir
                        </button>
                    </div>
                    {edition.categories.length === 0 ? (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            No hay categorías. Añade al menos una antes de abrir la votación.
                        </p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            {edition.categories.map(cat => (
                                <div key={cat.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.6rem 0.75rem',
                                    background: 'var(--surface-raised)',
                                    borderRadius: '6px',
                                }}>
                                    <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                                        {cat.name}
                                    </span>
                                    <button
                                        onClick={() => deleteCategory(cat.id)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: 'var(--text-muted)',
                                            cursor: 'pointer',
                                            padding: '0.2rem',
                                        }}
                                    >
                                        <Trash2 size={14} strokeWidth={1.5} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Grupos / Participantes */}
                <div style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    padding: '1.25rem',
                }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem' }}>
                        {edition.participation_mode === 'individual' ? 'Participantes' : 'Grupos'}
                    </div>
                    {edition.groups.length === 0 ? (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Aún no hay {edition.participation_mode === 'individual' ? 'participantes' : 'grupos'} en esta edición.
                        </p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {edition.groups.map(group => (
                                <div key={group.id} style={{
                                    padding: '0.75rem 1rem',
                                    background: 'var(--surface-raised)',
                                    borderRadius: '8px',
                                    border: '1px solid var(--border)',
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            {group.letter && (
                                                <span style={{
                                                    fontFamily: 'Playfair Display, serif',
                                                    fontSize: '1.1rem',
                                                    color: 'var(--gold)',
                                                    fontWeight: 700,
                                                }}>
                                                    {group.letter}
                                                </span>
                                            )}
                                            <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                                                {group.costume_name ?? group.name ?? '—'}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (!confirm('¿Eliminar este grupo?')) return;
                                                router.delete(`/admin/groups/${group.id}`);
                                            }}
                                            style={{
                                                background: 'none', border: 'none',
                                                color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem',
                                            }}
                                        >
                                            <Trash2 size={14} strokeWidth={1.5} />
                                        </button>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                                        {group.participations.map(p => (
                                            <span key={p.id} style={{
                                                fontSize: '0.75rem',
                                                color: p.is_leader ? 'var(--gold)' : 'var(--text-muted)',
                                                background: p.is_leader ? 'rgba(201,168,76,0.1)' : 'var(--surface)',
                                                border: `1px solid ${p.is_leader ? 'var(--border-gold)' : 'var(--border)'}`,
                                                borderRadius: '20px',
                                                padding: '0.15rem 0.5rem',
                                            }}>
                                                {p.user.name}{p.is_leader ? ' ★' : ''}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

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