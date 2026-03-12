import AppLayout from '@/Layouts/AppLayout';
import { Head, router } from '@inertiajs/react';
import { ArrowLeft, Calendar, Users, Tag } from 'lucide-react';

interface Participation {
    id: number;
    is_leader: boolean;
    individual_ready: boolean;
    user: { id: number; name: string };
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
    userGroup: Group | null;
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

export default function Show({ edition, userGroup }: Props) {
    const status = STATUS_LABELS[edition.status] ?? { label: edition.status, color: 'var(--text-muted)' };

    const myParticipation = userGroup?.participations.find(
        p => p.user.id === (window as any).__page?.props?.auth?.user?.id
    ) ?? null;

    function markReady() {
        if (!userGroup) return;
        router.post(`/groups/${userGroup.id}/ready`);
    }

    return (
        <AppLayout title={edition.name}>
            <Head title={edition.name} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        onClick={() => router.visit('/editions')}
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            width: '32px', height: '32px', borderRadius: '8px',
                            border: '1px solid var(--border)', background: 'transparent',
                            color: 'var(--text-secondary)', cursor: 'pointer', flexShrink: 0,
                        }}
                    >
                        <ArrowLeft size={16} strokeWidth={1.5} />
                    </button>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        <Chip icon={<Tag size={11} />} label={edition.theme} />
                        <Chip icon={<Users size={11} />} label={MODE_LABELS[edition.participation_mode]} />
                        {edition.event_date && (
                            <Chip icon={<Calendar size={11} />} label={new Date(edition.event_date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })} />
                        )}
                        <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                            fontSize: '0.72rem', color: status.color,
                            background: `${status.color}18`,
                            border: `1px solid ${status.color}40`,
                            borderRadius: '20px', padding: '0.15rem 0.5rem',
                        }}>
                            {status.label}
                        </span>
                    </div>
                </div>

                {/* Mi letra (si aplica) */}
                {edition.use_letters && userGroup?.letter && (
                    <div style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border-gold)',
                        borderRadius: '12px',
                        padding: '2rem',
                        textAlign: 'center',
                    }}>
                        <div style={{
                            fontSize: '0.75rem', color: 'var(--text-muted)',
                            textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem',
                        }}>
                            Tu letra asignada
                        </div>
                        <div style={{
                            fontFamily: 'Playfair Display, serif',
                            fontSize: '6rem',
                            color: 'var(--gold)',
                            lineHeight: 1,
                        }}>
                            {userGroup.letter}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '1rem' }}>
                            Tu disfraz debe empezar por esta letra
                        </div>
                    </div>
                )}

                {/* Mi grupo */}
                {userGroup && (
                    <div style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                        padding: '1.25rem',
                    }}>
                        <div style={{
                            fontSize: '0.75rem', color: 'var(--text-muted)',
                            textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem',
                        }}>
                            {edition.participation_mode === 'individual' ? 'Mi participación' : 'Mi grupo'}
                        </div>

                        {userGroup.costume_name && (
                            <div style={{ fontSize: '1rem', color: 'var(--text-primary)', fontWeight: 500, marginBottom: '0.75rem' }}>
                                {userGroup.costume_name}
                            </div>
                        )}

                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
                            {userGroup.participations.map(p => (
                                <span key={p.id} style={{
                                    fontSize: '0.8rem',
                                    color: p.is_leader ? 'var(--gold)' : 'var(--text-secondary)',
                                    background: p.is_leader ? 'rgba(201,168,76,0.1)' : 'var(--surface-raised)',
                                    border: `1px solid ${p.is_leader ? 'var(--border-gold)' : 'var(--border)'}`,
                                    borderRadius: '20px',
                                    padding: '0.2rem 0.6rem',
                                }}>
                                    {p.user.name}{p.is_leader ? ' ★' : ''}
                                </span>
                            ))}
                        </div>

                        {/* Botón listo */}
                        {edition.status === 'costumes_revealed' && myParticipation && !myParticipation.individual_ready && (
                            <button
                                onClick={markReady}
                                style={{
                                    width: '100%', padding: '0.75rem',
                                    borderRadius: '8px', border: 'none',
                                    background: 'var(--gold)', color: '#0D0D0D',
                                    fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
                                }}
                            >
                                ¡Estoy listo! Revelar mi disfraz
                            </button>
                        )}
                        {edition.status === 'costumes_revealed' && myParticipation?.individual_ready && (
                            <div style={{
                                textAlign: 'center', fontSize: '0.85rem',
                                color: 'var(--success-light)', padding: '0.5rem',
                            }}>
                                ✓ Ya has marcado que estás listo
                            </div>
                        )}
                    </div>
                )}

                {/* Muro de disfraces */}
                {(edition.status === 'costumes_revealed' || edition.status === 'voting_open' || edition.status === 'closed') && (
                    <div style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                        padding: '1.25rem',
                    }}>
                        <div style={{
                            fontSize: '0.75rem', color: 'var(--text-muted)',
                            textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem',
                        }}>
                            Disfraces
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            {edition.groups.map(group => {
                                const isRevealed = group.reveal_status === 'revealed';
                                const isMyGroup = userGroup?.id === group.id;
                                return (
                                    <div key={group.id} style={{
                                        padding: '0.75rem 1rem',
                                        background: 'var(--surface-raised)',
                                        borderRadius: '8px',
                                        border: `1px solid ${isMyGroup ? 'var(--border-gold)' : 'var(--border)'}`,
                                        filter: isRevealed ? 'none' : 'blur(4px)',
                                        transition: 'filter 0.4s ease',
                                        userSelect: isRevealed ? 'auto' : 'none',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                                            {group.letter && (
                                                <span style={{
                                                    fontFamily: 'Playfair Display, serif',
                                                    fontSize: '1.1rem', color: 'var(--gold)', fontWeight: 700,
                                                }}>
                                                    {group.letter}
                                                </span>
                                            )}
                                            <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                                                {isRevealed ? (group.costume_name ?? '—') : '???'}
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                                            {group.participations.map(p => (
                                                <span key={p.id} style={{
                                                    fontSize: '0.75rem', color: 'var(--text-muted)',
                                                    background: 'var(--surface)', borderRadius: '20px',
                                                    padding: '0.15rem 0.5rem',
                                                }}>
                                                    {isRevealed ? p.user.name : '???'}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Votación */}
                {edition.status === 'voting_open' && userGroup && (
                    <div style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderRadius: '12px',
                        padding: '1.25rem',
                    }}>
                        <div style={{
                            fontSize: '0.75rem', color: 'var(--text-muted)',
                            textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '1rem',
                        }}>
                            Votación
                        </div>
                        {edition.categories.map(category => (
                            <div key={category.id} style={{ marginBottom: '1.25rem' }}>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500, marginBottom: '0.5rem' }}>
                                    {category.name}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                    {edition.groups
                                        .filter(g => g.id !== userGroup.id && g.reveal_status === 'revealed')
                                        .map(group => (
                                            <button
                                                key={group.id}
                                                onClick={() => router.post('/votes', {
                                                    category_id: category.id,
                                                    group_id: group.id,
                                                })}
                                                style={{
                                                    padding: '0.65rem 1rem',
                                                    borderRadius: '8px',
                                                    border: '1px solid var(--border)',
                                                    background: 'var(--surface-raised)',
                                                    color: 'var(--text-primary)',
                                                    fontSize: '0.85rem',
                                                    cursor: 'pointer',
                                                    textAlign: 'left',
                                                    transition: 'border-color 0.2s ease',
                                                }}
                                                onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-gold)')}
                                                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
                                            >
                                                {group.letter && <span style={{ color: 'var(--gold)', marginRight: '0.4rem' }}>{group.letter}</span>}
                                                {group.costume_name ?? group.name ?? '—'}
                                            </button>
                                        ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>
        </AppLayout>
    );
}

function Chip({ icon, label }: { icon: React.ReactNode; label: string }) {
    return (
        <span style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
            fontSize: '0.72rem', color: 'var(--text-muted)',
            background: 'var(--surface-raised)', borderRadius: '20px', padding: '0.15rem 0.5rem',
        }}>
            {icon}
            {label}
        </span>
    );
}