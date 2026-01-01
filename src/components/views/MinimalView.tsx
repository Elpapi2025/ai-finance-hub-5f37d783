
import { useAuthContext } from '@/contexts/AuthContext';
import { useFinance } from '@/hooks/useFinance';
import { Button } from '@/components/ui/button';

export function MinimalView() {
  const { user, logout } = useAuthContext();
  const { transactions, isLoading, refetch } = useFinance();

  if (!user) {
    return <div>No user found. This view should only be seen when logged in.</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Minimal Test View</h1>
      <hr />
      <h2>Authentication</h2>
      <p>
        Logged in as: <strong>{user.email}</strong>
      </p>
      <Button onClick={() => logout()}>Logout</Button>
      <hr style={{ margin: '20px 0' }} />

      <h2>Finance Data</h2>
      <Button onClick={() => refetch()}>Refetch Transactions</Button>
      {isLoading ? (
        <p>Loading transactions...</p>
      ) : (
        <div>
          <h3>Transactions ({transactions.length})</h3>
          <pre style={{ background: '#f4f4f4', padding: '10px', borderRadius: '5px', maxHeight: '300px', overflowY: 'auto' }}>
            {JSON.stringify(transactions, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
