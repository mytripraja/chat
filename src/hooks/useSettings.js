import { useState, useEffect } from 'react';
import { getSettings, listenToSettings } from '../lib/firestore';
import { DEFAULT_SETTINGS } from '../data/settings';

export function useSettings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = listenToSettings(data => {
      setSettings({ ...DEFAULT_SETTINGS, ...data });
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return { settings, loading };
}
