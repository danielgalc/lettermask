import AppLayout from '@/Layouts/AppLayout';
import { Head, Link } from '@inertiajs/react';
import { Calendar, Tag, Users, ChevronRight } from 'lucide-react';
import { ReactNode } from 'react';

interface Stats {
    total_editions: number;
    active_editions: number;
    total_users: number;
}

interface Props {
    stats: Stats;
}

export default function AdminIndex({ stats }: Props) {
    return (
        <AppLayout title="Panel de administración">
            <Head title="Panel Admin" />

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Stats */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '0.75rem',
                }}>
                    <StatCard
                        label="Ediciones"
                        value={stats.total_editions}
                        icon={<Calendar size={16} strokeWidth={1.5} color="var(--gold)" />}
                    />
                    <StatCard
                        label="Activas"
                        value={stats.active_editions}
                        icon={<Tag size={16} strokeWidth={1.5} color="var(--gold)" />}
                    />
                    <StatCard
                        label="Participantes"
                        value={stats.total_users}
                        icon={<Users size={16} strokeWidth={1.5} color="var(--gold)" />}
                    />
                </div>

                {/* Acciones */}
                <div>
                    <h2 style={{
                        fontFamily: 'Playfair Display, serif',
                        fontSize: '1.1rem',
                        color: 'var(--text-secondary)',
                        marginBottom: '0.75rem',
                    }}>
                        Acciones rápidas
                    </h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        <ActionRow
                            href="/admin/editions/create"
                            icon={<Calendar size={16} strokeWidth={1.5} />}
                            label="Crear nueva edición"
                            description="Temática, modo de participación y fecha"
                        />
                        <ActionRow
                            href="/admin/editions"
                            icon={<Tag size={16} strokeWidth={1.5} />}
                            label="Gestionar ediciones"
                            description="Estados, letras y votaciones"
                        />
                        <ActionRow
                            href="/admin/users"
                            icon={<Users size={16} strokeWidth={1.5} />}
                            label="Gestionar participantes"
                            description="Usuarios registrados en la app"
                        />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

function StatCard({ label, value, icon }: {
    label: string;
    value: number;
    icon: ReactNode;
}) {
    return (
        <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border-gold)',
            borderRadius: '10px',
            padding: '1rem 0.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {icon}
                <span style={{
                    fontSize: '0.7rem',
                    color: 'var(--text-muted)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}>
                    {label}
                </span>
            </div>
            <div style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '2rem',
                color: 'var(--text-primary)',
                lineHeight: 1,
            }}>
                {value}
            </div>
        </div>
    );
}

function ActionRow({ href, icon, label, description }: {
    href: string;
    icon: ReactNode;
    label: string;
    description: string;
}) {
    return (
        <Link
            href={href}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: '10px',
                padding: '1rem 1.25rem',
                textDecoration: 'none',
                transition: 'border-color 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border-gold)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border)')}
        >
            <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(201, 168, 76, 0.1)',
                border: '1px solid var(--border-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--gold)',
                flexShrink: 0,
            }}>
                {icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                    fontSize: '0.9rem',
                    color: 'var(--text-primary)',
                    fontWeight: 500,
                }}>
                    {label}
                </div>
                <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    marginTop: '0.15rem',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}>
                    {description}
                </div>
            </div>
            <ChevronRight size={16} strokeWidth={1.5} color="var(--text-muted)" style={{ flexShrink: 0 }} />
        </Link>
    );
}