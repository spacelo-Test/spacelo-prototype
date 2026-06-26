import React, { createContext, useContext, useState, useEffect } from 'react';

/* ─────────────────────────────────────────────
   Default mock values
   ───────────────────────────────────────────── */

const DEFAULT_PENDING_APPROVALS = [
  {
    id: 'u1',
    name: 'Ahmed Raza',
    role: 'Shopkeeper',
    email: 'ahmed@superstore.pk',
    phone: '+92 301 1234567',
    businessName: 'Super Store - Gulshan',
    submittedAt: 'June 24, 2026',
    status: 'pending',
    docs: ['CNIC Front', 'CNIC Back', 'Trade License'],
  },
  {
    id: 'u2',
    name: 'Fatima Malik',
    role: 'Mall Owner',
    email: 'fatima@centreone.pk',
    phone: '+92 333 9876543',
    businessName: 'Centre One Mall',
    chainName: 'Centre One',
    submittedAt: 'June 23, 2026',
    status: 'pending',
    docs: ['SECP License', 'Chain Affiliation', 'NTN Certificate'],
  },
  {
    id: 'u3',
    name: 'Hassan Shah',
    role: 'Company/Brand',
    email: 'hassan@dawoodherbal.pk',
    phone: '+92 321 5556677',
    businessName: 'Dawood Herbal',
    submittedAt: 'June 22, 2026',
    status: 'pending',
    docs: ['Company Registration', 'Brand Authorization'],
  },
  {
    id: 'u4',
    name: 'Sara Khan',
    role: 'Shopkeeper',
    email: 'sara@quickmart.pk',
    phone: '+92 312 4443322',
    businessName: 'QuickMart - DHA',
    submittedAt: 'June 21, 2026',
    status: 'pending',
    docs: ['CNIC Front', 'Trade License'],
  },
];

const DEFAULT_DISPUTES = [
  {
    id: 'd1',
    requestId: 'r1',
    shopkeeper: 'Ahmed Raza',
    brand: 'Unilever Pakistan',
    space: 'Shelf A - Gulshan',
    reason: 'Product placed in wrong location',
    detail:
      'The brand placed beverages on the cosmetics shelf, violating the listing agreement terms.',
    raisedBy: 'Shopkeeper',
    raisedAt: 'June 20, 2026',
    status: 'Open',
    priority: 'High',
  },
  {
    id: 'd2',
    requestId: 'r2',
    shopkeeper: 'Tariq Hassan',
    brand: 'Nestle Pakistan',
    space: 'Window Display - Centre',
    reason: 'Payment dispute',
    detail: 'Payment was not released on time for March 2025 booking.',
    raisedBy: 'Brand',
    raisedAt: 'June 18, 2026',
    status: 'Under Review',
    priority: 'Medium',
  },
  {
    id: 'd3',
    requestId: 'r3',
    shopkeeper: 'Bilal Store',
    brand: 'Tapal Tea',
    space: 'End-Cap B2',
    reason: 'Space not as described',
    detail: 'The space dimensions were misrepresented in the listing.',
    raisedBy: 'Brand',
    raisedAt: 'June 10, 2026',
    status: 'Resolved',
    priority: 'Low',
  },
];

const DEFAULT_USERS = [
  {
    id: 'usr1',
    name: 'Ahmed Raza',
    role: 'Shopkeeper',
    email: 'ahmed@superstore.pk',
    phone: '+92 301 1234567',
    status: 'Active',
    joinedAt: 'Jan 2025',
    totalBookings: 12,
    totalRevenue: 540000,
    verified: true,
  },
  {
    id: 'usr2',
    name: 'Fatima Malik',
    role: 'Mall Owner',
    email: 'fatima@centreone.pk',
    phone: '+92 333 9876543',
    status: 'Active',
    joinedAt: 'Feb 2025',
    totalBookings: 34,
    totalRevenue: 1850000,
    verified: true,
  },
  {
    id: 'usr3',
    name: 'Hassan Shah',
    role: 'Company/Brand',
    email: 'hassan@dawoodherbal.pk',
    phone: '+92 321 5556677',
    status: 'Suspended',
    joinedAt: 'Mar 2025',
    totalBookings: 3,
    totalRevenue: 75000,
    verified: false,
  },
  {
    id: 'usr4',
    name: 'Unilever Pakistan',
    role: 'Company/Brand',
    email: 'ops@unilever.pk',
    phone: '+92 21 111-ULEVER',
    status: 'Active',
    joinedAt: 'Jan 2025',
    totalBookings: 28,
    totalRevenue: 2100000,
    verified: true,
  },
  {
    id: 'usr5',
    name: 'Sara Khan',
    role: 'Shopkeeper',
    email: 'sara@quickmart.pk',
    phone: '+92 312 4443322',
    status: 'Pending',
    joinedAt: 'June 2026',
    totalBookings: 0,
    totalRevenue: 0,
    verified: false,
  },
];

const DEFAULT_CHAINS = [
  {
    id: 'c1',
    name: 'Imtiaz Supermarket',
    owner: 'Muhammad Imtiaz',
    branches: 14,
    city: 'Karachi',
    status: 'Active',
    totalListings: 42,
    monthlyRevenue: 890000,
    joinedAt: 'Jan 2024',
  },
  {
    id: 'c2',
    name: 'Centre One Mall',
    owner: 'Fatima Malik',
    branches: 2,
    city: 'Islamabad',
    status: 'Active',
    totalListings: 28,
    monthlyRevenue: 620000,
    joinedAt: 'Mar 2024',
  },
  {
    id: 'c3',
    name: 'Hyperstar',
    owner: 'Carrefour Pakistan',
    branches: 6,
    city: 'Lahore',
    status: 'Active',
    totalListings: 89,
    monthlyRevenue: 2100000,
    joinedAt: 'Nov 2023',
  },
  {
    id: 'c4',
    name: 'Metro Cash & Carry',
    owner: 'Metro AG',
    branches: 3,
    city: 'Karachi',
    status: 'Inactive',
    totalListings: 0,
    monthlyRevenue: 0,
    joinedAt: 'Jun 2024',
  },
];

const DEFAULT_BOOKINGS = [
  {
    id: 'b1',
    shopkeeper: 'Ahmed Raza',
    brand: 'Unilever Pakistan',
    space: 'Shelf A — Ground Floor',
    listing: '3 months listing',
    amount: 135000,
    commission: 20250,
    startDate: 'Jan 1, 2025',
    endDate: 'Mar 31, 2025',
    status: 'Completed',
    payoutStatus: 'Released',
  },
  {
    id: 'b2',
    shopkeeper: 'Tariq Hassan',
    brand: 'Nestle Pakistan',
    space: 'Window Display — Ground',
    listing: '2 months listing',
    amount: 80000,
    commission: 12000,
    startDate: 'Feb 1, 2025',
    endDate: 'Mar 31, 2025',
    status: 'Active',
    payoutStatus: 'In Escrow',
  },
  {
    id: 'b3',
    shopkeeper: 'Bilal Store',
    brand: 'Tapal Tea',
    space: 'End-Cap B2',
    listing: '1 month listing',
    amount: 25000,
    commission: 3750,
    startDate: 'Jun 15, 2026',
    endDate: 'Jul 15, 2026',
    status: 'Pending',
    payoutStatus: 'Not Yet',
  },
  {
    id: 'b4',
    shopkeeper: 'Ahmed Raza',
    brand: 'P&G Pakistan',
    space: 'Checkout Counter',
    listing: '3 months listing',
    amount: 135000,
    commission: 20250,
    startDate: 'Apr 1, 2025',
    endDate: 'Jun 30, 2025',
    status: 'Completed',
    payoutStatus: 'Released',
  },
];

/* ─────────────────────────────────────────────
   Context definition
   ───────────────────────────────────────────── */
const AdminContext = createContext(null);

export function useAdmin() {
  return useContext(AdminContext);
}

/* ─────────────────────────────────────────────
   AdminProvider
   ───────────────────────────────────────────── */
export function AdminProvider({ children }) {
  /* ── 1. Pending Approvals ── */
  const [pendingApprovals, setPendingApprovals] = useState(() => {
    const saved = localStorage.getItem('spacelo_pending_approvals');
    return saved ? JSON.parse(saved) : DEFAULT_PENDING_APPROVALS;
  });

  /* ── 2. Disputes ── */
  const [disputes, setDisputes] = useState(() => {
    const saved = localStorage.getItem('spacelo_disputes');
    return saved ? JSON.parse(saved) : DEFAULT_DISPUTES;
  });

  /* ── 3. Users ── */
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('spacelo_users');
    return saved ? JSON.parse(saved) : DEFAULT_USERS;
  });

  /* ── 4. Chains ── */
  const [chains, setChains] = useState(() => {
    const saved = localStorage.getItem('spacelo_chains');
    return saved ? JSON.parse(saved) : DEFAULT_CHAINS;
  });

  /* ── 5. Bookings ── */
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('spacelo_bookings');
    return saved ? JSON.parse(saved) : DEFAULT_BOOKINGS;
  });

  /* ── 6. Save back to localStorage ── */
  useEffect(() => {
    localStorage.setItem('spacelo_pending_approvals', JSON.stringify(pendingApprovals));
  }, [pendingApprovals]);

  useEffect(() => {
    localStorage.setItem('spacelo_disputes', JSON.stringify(disputes));
  }, [disputes]);

  useEffect(() => {
    localStorage.setItem('spacelo_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('spacelo_chains', JSON.stringify(chains));
  }, [chains]);

  useEffect(() => {
    localStorage.setItem('spacelo_bookings', JSON.stringify(bookings));
  }, [bookings]);

  /* ─────────────────────────────────────────────
     Action functions
   ───────────────────────────────────────────── */

  /** Approve a pending user approval */
  function approveUser(id) {
    setPendingApprovals((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          localStorage.setItem(`spacelo_status_${u.email}`, 'approved');
          return { ...u, status: 'approved' };
        }
        return u;
      })
    );

    // Also add to verified active users list if not already present
    const pendingUser = pendingApprovals.find(u => u.id === id);
    if (pendingUser) {
      setUsers((prev) => {
        const exists = prev.some(u => u.email === pendingUser.email);
        if (exists) {
          return prev.map(u => u.email === pendingUser.email ? { ...u, status: 'Active', verified: true } : u);
        } else {
          return [
            ...prev,
            {
              id: 'usr_' + Date.now(),
              name: pendingUser.name,
              role: pendingUser.role,
              email: pendingUser.email,
              phone: pendingUser.phone || '',
              status: 'Active',
              joinedAt: 'June 2026',
              totalBookings: 0,
              totalRevenue: 0,
              verified: true
            }
          ];
        }
      });
    }
  }

  /** Reject a pending user approval */
  function rejectUser(id) {
    setPendingApprovals((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          localStorage.setItem(`spacelo_status_${u.email}`, 'rejected');
          return { ...u, status: 'rejected' };
        }
        return u;
      })
    );
  }

  /** Resolve an open dispute */
  function resolveDispute(id) {
    setDisputes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'Resolved' } : d))
    );
  }

  /** Resolve an open dispute */
  function resolveDispute(id) {
    setDisputes((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: 'Resolved' } : d))
    );
  }

  /** Suspend a user account */
  function suspendUser(id) {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: 'Suspended' } : u))
    );
  }

  /** Activate a user account */
  function activateUser(id) {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: 'Active' } : u))
    );
  }

  /* ─────────────────────────────────────────────
     Computed stats
  ───────────────────────────────────────────── */
  const adminStats = {
    totalUsers: users.length,
    pendingApprovals: pendingApprovals.filter((u) => u.status === 'pending').length,
    openDisputes: disputes.filter((d) => d.status === 'Open').length,
    totalChains: chains.length,
    totalBookings: bookings.length,
    totalRevenue: bookings.reduce((sum, b) => sum + b.amount, 0),
    totalCommission: bookings.reduce((sum, b) => sum + b.commission, 0),
  };

  /* ─────────────────────────────────────────────
     Context value
  ───────────────────────────────────────────── */
  const contextValue = {
    /* State */
    pendingApprovals,
    disputes,
    users,
    chains,
    bookings,

    /* Setters (exposed for any direct manipulation) */
    setPendingApprovals,
    setDisputes,
    setUsers,
    setChains,
    setBookings,

    /* Actions */
    approveUser,
    rejectUser,
    resolveDispute,
    suspendUser,
    activateUser,

    /* Computed */
    adminStats,
  };

  return (
    <AdminContext.Provider value={contextValue}>
      {children}
    </AdminContext.Provider>
  );
}

export default AdminContext;
