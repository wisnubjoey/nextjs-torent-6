import { getReminders } from '@/actions/reminders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Clock, AlertCircle } from 'lucide-react';

export default async function UserRemindersPage() {
  const { reminders } = await getReminders();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">My Rental Reminders</h1>
        <Badge variant="outline" className="text-lg px-4 py-1">
          {reminders.length} Active
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reminders.length === 0 ? (
           <div className="col-span-full flex flex-col items-center justify-center py-12 text-center bg-white rounded-lg border border-dashed">
             <div className="bg-gray-50 p-4 rounded-full mb-4">
                <Clock className="w-8 h-8 text-gray-400" />
             </div>
             <h3 className="text-lg font-medium text-gray-900">No active reminders</h3>
             <p className="text-gray-500 mt-1 max-w-sm">You don&apos;t have any rentals starting or ending in the next 24 hours.</p>
           </div>
        ) : (
          reminders.map((reminder) => (
            <Card key={reminder.id} className={`shadow-sm border-l-4 ${reminder.hoursRemaining <= 5 ? 'border-l-red-500' : 'border-l-blue-500'}`}>
              <CardHeader className="pb-2">
                <CardTitle className="flex justify-between items-start text-base">
                  <span className="font-semibold truncate pr-2" title={reminder.productName}>{reminder.productName}</span>
                  <Badge variant={reminder.hoursRemaining <= 5 ? "destructive" : "secondary"}>
                    {reminder.hoursRemaining}h left
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span>
                      {reminder.type === 'start' ? 'Pick up' : 'Return'}: {format(reminder.date, 'MMM d, HH:mm')}
                    </span>
                  </div>
                   <div className="flex items-center gap-2">
                    <AlertCircle className={`w-4 h-4 ${reminder.type === 'start' ? 'text-green-500' : 'text-orange-500'}`} />
                    <span className="capitalize font-medium text-gray-900">
                        Rental {reminder.type === 'start' ? 'Starting' : 'Ending'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
