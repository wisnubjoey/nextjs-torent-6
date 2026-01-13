export default function Page() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Testing Sidebar</h1>
        <p className="text-muted-foreground">
          Halaman ini digunakan untuk testing implementasi sidebar.
        </p>
      </div>

      {/* Debug Info */}
      <div className="p-4 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900 rounded-md text-sm">
        <p className="font-semibold mb-1">Debug Info:</p>
        <div className="grid grid-cols-2 gap-2">
          <div>Viewport: <span className="hidden sm:inline">SM </span><span className="hidden md:inline">MD </span><span className="hidden lg:inline">LG </span><span className="hidden xl:inline">XL </span></div>
          <div className="sm:hidden">Mobile View (&lt;640px)</div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Jika sidebar masih di atas pada view MD/LG, berarti flex layout gagal.
        </p>
      </div>

      <div className="bg-card text-card-foreground border rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-medium mb-2">Instruksi Testing</h2>
        <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
          <li>Klik tombol panel di kiri atas untuk toggle sidebar</li>
          <li>Perhatikan apakah sidebar berada di sisi kiri layar</li>
          <li>Perhatikan apakah menu item muncul saat sidebar di-expand</li>
          <li>Cek di DevTools untuk melihat class Tailwind dan data attributes</li>
        </ul>
      </div>

      <div className="bg-card text-card-foreground border rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-medium mb-2">Menu Items</h2>
        <ul className="space-y-2 text-sm">
          <li>• Dashboard</li>
          <li>• Users</li>
          <li>• Database</li>
          <li>• Settings</li>
        </ul>
      </div>
    </div>
  )
}
