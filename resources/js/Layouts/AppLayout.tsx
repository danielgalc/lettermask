import { Link, usePage } from '@inertiajs/react';
import { ReactNode } from 'react';
import { Calendar, User, Image, Settings } from 'lucide-react';
import Logo from '@/Components/Logo';

interface Props {
    children: ReactNode;
    title?: string;
}

export default function AppLayout({ children, title }: Props) {
    const { auth } = usePage().props as any;
    const user = auth.user;
    const isAdmin = user?.role === 'admin';

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>

            {/* ── SIDEBAR (desktop) ── */}
            <aside style={{
                width: '240px',
                minHeight: '100vh',
                background: 'var(--surface)',
                borderRight: '1px solid var(--border-gold)',
                display: 'flex',
                flexDirection: 'column',
                padding: '2rem 0',
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                zIndex: 100,
            }}
                className="desktop-sidebar"
            >
                {/* Logo */}
                <div style={{ padding: '0 1.5rem 2rem', borderBottom: '1px solid var(--border)' }}>
                    <Link href="/editions" style={{ textDecoration: 'none' }}>
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.5rem',
                        }}>
                            <Logo size={48} />
                            <span style={{
                                fontFamily: 'Playfair Display, serif',
                                fontSize: '1.3rem',
                                color: 'var(--gold)',
                                letterSpacing: '0.05em',
                            }}>
                                LetterMask
                            </span>
                            <span style={{
                                fontSize: '0.7rem',
                                color: 'var(--text-muted)',
                                letterSpacing: '0.08em',
                            }}>
                                Concurso de disfraces
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Nav */}
                <nav style={{ flex: 1, padding: '1.5rem 0' }}>
                    <SidebarItem href="/editions" label="Ediciones" icon={<Calendar size={16} strokeWidth={1.5} />} />
                    <SidebarItem href="/profile" label="Mi perfil" icon={<User size={16} strokeWidth={1.5} />} />
                    <SidebarItem href="/album" label="Álbum" icon={<Image size={16} strokeWidth={1.5} />} />
                    {isAdmin && (
                        <>
                            <div style={{
                                padding: '1.5rem 1.5rem 0.5rem',
                                fontSize: '0.7rem',
                                color: 'var(--text-muted)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.1em',
                            }}>
                                Administración
                            </div>
                            <SidebarItem href="/admin" label="Panel Admin" icon={<Settings size={16} strokeWidth={1.5} />} gold />
                        </>
                    )}
                </nav>

                {/* User */}
                <div style={{
                    padding: '1.5rem',
                    borderTop: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                }}>
                    <div style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: 'rgba(201, 168, 76, 0.1)',
                        border: '1px solid var(--border-gold)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        fontFamily: 'Playfair Display, serif',
                        fontSize: '1rem',
                        color: 'var(--gold)',
                        fontWeight: 600,
                    }}>
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <div style={{
                            fontSize: '0.85rem',
                            color: 'var(--text-primary)',
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}>
                            {user?.name}
                        </div>
                        <Link
                            href="/logout"
                            method="post"
                            as="button"
                            style={{
                                fontSize: '0.75rem',
                                color: 'var(--text-muted)',
                                background: 'none',
                                border: 'none',
                                padding: 0,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.3rem',
                            }}
                        >
                            Cerrar sesión
                        </Link>
                    </div>
                </div>
            </aside>

            {/* ── MAIN CONTENT ── */}
            <main className="main-content" style={{
                flex: 1,
                padding: '2rem',
                paddingBottom: '5rem',
            }}>
                {/* Mobile header */}
                <div className="mobile-header" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '1.5rem',
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Logo size={28} />
                        <span style={{
                            fontFamily: 'Playfair Display, serif',
                            fontSize: '1.1rem',
                            color: 'var(--gold)',
                        }}>
                            LetterMask
                        </span>
                    </div>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'rgba(201, 168, 76, 0.1)',
                        border: '1px solid var(--border-gold)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'Playfair Display, serif',
                        fontSize: '0.85rem',
                        color: 'var(--gold)',
                    }}>
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                </div>

                {title && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h1 style={{ fontSize: '1.8rem', color: 'var(--gold)' }}>{title}</h1>
                        <div style={{
                            width: '40px',
                            height: '2px',
                            background: 'var(--gold)',
                            marginTop: '0.5rem',
                            opacity: 0.4,
                        }} />
                    </div>
                )}

                {children}
            </main>

            {/* ── BOTTOM NAV (móvil) ── */}
            <nav className="bottom-nav" style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'var(--surface)',
                borderTop: '1px solid var(--border-gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                padding: '0.5rem 0',
                zIndex: 100,
            }}>
                <BottomNavItem href="/editions" label="Ediciones" icon={<Calendar size={20} strokeWidth={1.5} />} />
                <BottomNavItem href="/profile" label="Perfil" icon={<User size={20} strokeWidth={1.5} />} />
                <BottomNavItem href="/album" label="Álbum" icon={<Image size={20} strokeWidth={1.5} />} />
                {isAdmin && (
                    <BottomNavItem href="/admin" label="Admin" icon={<Settings size={20} strokeWidth={1.5} />} gold />
                )}
            </nav>
        </div>
    );
}

function SidebarItem({ href, label, icon, gold = false }: {
    href: string;
    label: string;
    icon: ReactNode;
    gold?: boolean;
}) {
    const { url } = usePage();
    const isActive = url.startsWith(href);

    return (
        <Link href={href} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.65rem 1.5rem',
            fontSize: '0.9rem',
            color: isActive ? 'var(--gold)' : gold ? 'var(--gold-light)' : 'var(--text-secondary)',
            background: isActive ? 'rgba(201, 168, 76, 0.08)' : 'transparent',
            borderLeft: isActive ? '2px solid var(--gold)' : '2px solid transparent',
            transition: 'all 0.2s ease',
            textDecoration: 'none',
            fontWeight: isActive ? 500 : 400,
        }}>
            <span style={{ opacity: isActive ? 1 : 0.7 }}>{icon}</span>
            <span>{label}</span>
        </Link>
    );
}

function BottomNavItem({ href, label, icon, gold = false }: {
    href: string;
    label: string;
    icon: ReactNode;
    gold?: boolean;
}) {
    const { url } = usePage();
    const isActive = url.startsWith(href);

    return (
        <Link href={href} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.25rem',
            padding: '0.4rem 1rem',
            textDecoration: 'none',
            color: isActive ? 'var(--gold)' : gold ? 'var(--gold-light)' : 'var(--text-muted)',
            transition: 'color 0.2s ease',
        }}>
            <span style={{ opacity: isActive ? 1 : 0.6 }}>{icon}</span>
            <span style={{ fontSize: '0.65rem', letterSpacing: '0.04em' }}>{label}</span>
        </Link>
    );
}