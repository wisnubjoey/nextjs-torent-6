import { getReminders } from '@/actions/reminders';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Clock, AlertCircle, User } from 'lucide-react';

export default async function AdminRemindersPage() {
  const { reminders } = await getReminders();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Rental Reminders</h1>
        <Badge variant="outline" className="text-lg px-4 py-1">
          {reminders.length} Active
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reminders.length === 0 ? (
           <p className="text-muted-foreground col-span-full">No active reminders at the moment.</p>
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
                      {reminder.type === 'start' ? 'Starts' : 'Ends'}: {format(reminder.date, 'MMM d, HH:mm')}
                    </span>
                  </div>
                   <div className="flex items-center gap-2">
                    <AlertCircle className={`w-4 h-4 ${reminder.type === 'start' ? 'text-green-500' : 'text-orange-500'}`} />
                    <span className="capitalize font-medium text-gray-900">
                        Rental {reminder.type === 'start' ? 'Starting' : 'Ending'}
                    </span>
                  </div>
                  
                  {(reminder.userName || reminder.userEmail) && (
                    <div className="pt-3 mt-3 border-t border-gray-100 flex items-start gap-3">
                       <div className="bg-gray-100 p-2 rounded-full">
                           <User className="w-4 h-4 text-gray-600" />
                       </div>
                       <div>
                           <p className="font-medium text-gray-900 leading-none">{reminder.userName || 'Unknown User'}</p>
                           <p className="text-xs text-gray-500 mt-1">{reminder.userEmail}</p>
                       </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
