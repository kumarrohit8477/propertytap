'use client';

import React, { useEffect, useState } from 'react';
import { create_client } from '@/lib/supabase/client';
import { UserProfile } from '@/types/user';
import AdminSidebar from '@/components/layout/admin_sidebar';
import Button from '@/components/ui/button';
import { format_date } from '@/lib/utils/utils';
import './users.css';

export default function AdminUsersPage() {
  const [users, set_users] = useState<UserProfile[]>([]);
  const [loading, set_loading] = useState(true);

  useEffect(() => {
    async function load_users() {
      set_loading(true);
      const supabase = create_client();
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      set_users((data as UserProfile[]) || []);
      set_loading(false);
    }
    load_users();
  }, []);

  return (
    <div className="admin_layout_container">
      <AdminSidebar />

      <main className="admin_main_content">
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#111827', margin: 0 }}>
          User Accounts Management
        </h1>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#ffffff', borderRadius: '12px' }}>
            <h3>Loading users...</h3>
          </div>
        ) : (
          <div className="admin_table_card">
            <table className="admin_table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 600 }}>{u.full_name}</td>
                    <td>{u.email}</td>
                    <td>{u.phone || 'N/A'}</td>
                    <td>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '0.15rem 0.4rem', borderRadius: '4px', backgroundColor: u.role === 'admin' ? '#fef2f2' : '#eff6ff', color: u.role === 'admin' ? '#dc2626' : '#2563eb' }}>
                        {u.role}
                      </span>
                    </td>
                    <td>{format_date(u.created_at)}</td>
                    <td>
                      <Button variant="outline" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}>
                        Manage
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
