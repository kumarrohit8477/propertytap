import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SettingsPage() {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/dashboard/profile', { replace: true });
  }, [navigate]);
  return null;
}
