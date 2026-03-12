import AppLayout from '@/Layouts/AppLayout';
import { Head } from '@inertiajs/react';

interface Edition {
    id: number;
    name: string;
    theme: string;
    participation_mode: string;
    status: string;
    event_date: string | null;
}

interface Props {
    editions: Edition[];
}

export default function Index({ editions }: Props) {
    return (
        <AppLayout title="Ediciones">
            <Head title="Ediciones" />

            {editions.length === 0 ? (
                <div style={{
                    textAlign: 'center',
                    padding: '4rem 2rem',
                    color: 'var(--text-muted)',
                }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎭</div>
                    <p style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.2rem' }}>
                        No hay ediciones todavía
                    </p>
                    <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                        El administrador creará la primera edición pronto.
                    </p>
                </div>
            ) : (
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '1.5rem',
                }}>
                    {editions.map(edition => (
                        <div key={edition.id} style={{
                            background: 'var(--surface)',
                            border: '1px solid var(--border-gold)',
                            borderRadius: '10px',
                            padding: '1.5rem',
                        }}>
                            <h3 style={{ color: 'var(--gold)', marginBottom: '0.5rem' }}>
                                {edition.name}
                            </h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                {edition.theme}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </AppLayout>
    );
}