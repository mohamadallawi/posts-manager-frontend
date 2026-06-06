import { FormEvent, useEffect, useState } from 'react';
import type { User } from '../types/user';

interface UserFormProps {
  initialUser?: User | null;
  onSubmit: (data: { name: string; email: string }) => Promise<void>;
  onCancel?: () => void;
}

export function UserForm({ initialUser, onSubmit, onCancel }: UserFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialUser) {
      setName(initialUser.name);
      setEmail(initialUser.email);
    } else {
      setName('');
      setEmail('');
    }
  }, [initialUser]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setSubmitting(true);
    try {
      await onSubmit({ name: name.trim(), email: email.trim() });
      if (!initialUser) {
        setName('');
        setEmail('');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="user-form" onSubmit={handleSubmit}>
      <h2>{initialUser ? 'Edit User' : 'Create New User'}</h2>
      <div className="form-group">
        <label htmlFor="user-name">Name</label>
        <input
          id="user-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter user name"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="user-email">Email</label>
        <input
          id="user-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="user@example.com"
          required
        />
      </div>
      <div className="form-actions">
        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving...' : initialUser ? 'Update User' : 'Create User'}
        </button>
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
