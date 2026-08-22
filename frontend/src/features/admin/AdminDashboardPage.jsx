import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Users, Compass, MapPin, Activity, Sparkles, Check, AlertCircle, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../../core/hooks/useAuth';
import { PageWrapper } from '../../components/layout/PageWrapper';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { adminApi } from '../../core/api/admin.api';
import { formatDate } from '../../core/utils/date';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user && !isAdmin) {
      navigate('/dashboard');
      return;
    }

    async function loadAdminData() {
      setIsLoading(true);
      setError(null);
      try {
        const [statsRes, usersRes] = await Promise.all([
          adminApi.getStats(),
          adminApi.getUsers()
        ]);
        setStats(statsRes.data.stats);
        setUsersList(usersRes.data.users);
      } catch (err) {
        setError(err.error || 'Failed to load admin analytics');
      } finally {
        setIsLoading(false);
      }
    }

    loadAdminData();
  }, [user, isAdmin, navigate]);

  const handleRoleToggle = async (userId, currentRole) => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await adminApi.updateUserRole(userId, nextRole);
      setUsersList((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: nextRole } : u))
      );
    } catch {}
  };

  if (!isAdmin) {
    return null;
  }

  const metrics = stats?.metrics || {};

  return (
    <PageWrapper>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Badge variant="gold" icon={ShieldCheck}>ADMINISTRATOR PORTAL</Badge>
            <span style={{ fontSize: '13px', color: 'var(--ink-muted)' }}>Platform Supervisor</span>
          </div>
          <h1 className="font-display" style={{ fontSize: '28px', fontWeight: '800', color: 'var(--ink)' }}>
            System Analytics & Management
          </h1>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px' }}>
        <Card padding="md">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--traverse-light)', color: 'var(--traverse)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={20} />
            </div>
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-subtle)', fontWeight: '700' }}>Total Travelers</div>
              <div className="font-data" style={{ fontSize: '22px', fontWeight: '800', color: 'var(--ink)' }}>{metrics.total_users || 0}</div>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--terrain-light)', color: 'var(--terrain)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Compass size={20} />
            </div>
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-subtle)', fontWeight: '700' }}>Active Journeys</div>
              <div className="font-data" style={{ fontSize: '22px', fontWeight: '800', color: 'var(--ink)' }}>{metrics.total_trips || 0}</div>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--gold-light)', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MapPin size={20} />
            </div>
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-subtle)', fontWeight: '700' }}>Cities Seeded</div>
              <div className="font-data" style={{ fontSize: '22px', fontWeight: '800', color: 'var(--ink)' }}>{metrics.total_cities || 0}</div>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-md)', backgroundColor: '#F3E8FF', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Activity size={20} />
            </div>
            <div>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--ink-subtle)', fontWeight: '700' }}>Activity Catalog</div>
              <div className="font-data" style={{ fontSize: '22px', fontWeight: '800', color: 'var(--ink)' }}>{metrics.total_activities || 0}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Users Management Section */}
      <div style={{ marginBottom: '36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <h3 className="font-display" style={{ fontSize: '20px', fontWeight: '700', color: 'var(--ink)' }}>
            Registered Users & Role Management
          </h3>
        </div>

        <Card padding="none" style={{ overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--paper)', borderBottom: '1px solid var(--mist)', color: 'var(--ink-muted)', textTransform: 'uppercase', fontSize: '11px', letterSpacing: '0.5px' }}>
                  <th style={{ padding: '14px 20px' }}>User</th>
                  <th style={{ padding: '14px 20px' }}>Email</th>
                  <th style={{ padding: '14px 20px' }}>Role</th>
                  <th style={{ padding: '14px 20px' }}>Joined Date</th>
                  <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersList.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--mist)' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={u.avatar_url || 'https://api.dicebear.com/7.x/bottts/svg?seed=user'}
                          alt={u.name}
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <span style={{ fontWeight: '600', color: 'var(--ink)' }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '14px 20px', color: 'var(--ink-muted)' }}>{u.email}</td>
                    <td style={{ padding: '14px 20px' }}>
                      <Badge variant={u.role === 'admin' ? 'gold' : 'blue'} size="sm">
                        {u.role.toUpperCase()}
                      </Badge>
                    </td>
                    <td style={{ padding: '14px 20px', color: 'var(--ink-muted)' }}>{formatDate(u.created_at)}</td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      {u.id !== user?.id && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleRoleToggle(u.id, u.role)}
                        >
                          {u.role === 'admin' ? 'Demote to Traveler' : 'Promote to Admin'}
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Popular Global Cities Overview */}
      <div>
        <h3 className="font-display" style={{ fontSize: '20px', fontWeight: '700', color: 'var(--ink)', marginBottom: '14px' }}>
          Top Seeded Global Destinations
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
          {stats?.popular_cities?.map((c) => (
            <Card key={c.id} padding="md" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <img
                src={c.image_url}
                alt={c.name}
                style={{ width: '50px', height: '50px', borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
              />
              <div>
                <h4 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--ink)' }}>{c.name}</h4>
                <div style={{ fontSize: '12px', color: 'var(--ink-muted)' }}>{c.country} • {c.region}</div>
                <div style={{ fontSize: '11px', color: 'var(--terrain)', fontWeight: '700', marginTop: '2px' }}>
                  ★ {c.popularity_score} Popularity
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
