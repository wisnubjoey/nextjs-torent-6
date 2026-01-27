'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Car, Settings, ChevronLeft, ChevronRight, History, Key, ShoppingCart, Bell } from 'lucide-react';
import { getReminders } from '@/actions/reminders';

const menuGroups = [
  {
    title: 'Overview',
    items: [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    title: 'Rent a Vehicle',
    items: [
      { name: 'Browse Vehicles', path: '/dashboard/browse-vehicles', icon: Car },
      { name: 'Cart', path: '/dashboard/cart', icon: ShoppingCart },
      { name: 'My Rentals', path: '/dashboard/my-rentals', icon: Key },
      { name: 'Reminders', path: '/dashboard/reminders', icon: Bell },
      { name: 'Order History', path: '/dashboard/orders', icon: History },
    ],
  },
  {
    title: 'Configuration',
    items: [
      { name: 'Settings', path: '/dashboard/settings', icon: Settings },
    ],
  },
];

export default function UserSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  const [hasReminders, setHasReminders] = useState(false);

  useEffect(() => {
    getReminders().then(data => {
      if (data.count > 0) setHasReminders(true);
    });
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside
        className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="font-bold text-xl text-gray-800">Torent</h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-6">
          {menuGroups.map((group) => (
            <div key={group.title} className="space-y-2">
              {!isCollapsed && (
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4">
                  {group.title}
                </h2>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.path;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? 'bg-blue-50 text-blue-600 font-medium'
                          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-blue-600' : ''}`} />
                      {!isCollapsed && <span>{item.name}</span>}
                      {item.name === 'Reminders' && hasReminders && (
                        <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
