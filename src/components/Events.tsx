import { Avatar } from '@/untitled_ui/base/avatar/avatar';
import { Badge } from '@/untitled_ui/base/badges/badges';
import { Button } from '@/untitled_ui/base/buttons/button';
import { Plus, MoreHorizontal, FileText } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  time: string;
  attendee: {
    name: string;
    avatar?: string;
  };
  type: 'meeting' | 'file';
  fileInfo?: {
    name: string;
    size: string;
  };
}

export const Events = () => {
  const events: Event[] = [
    {
      id: '1',
      title: 'Client review meeting with Rodriguez',
      time: '3:30PM - 4:00PM',
      attendee: {
        name: 'Rodriguez',
        avatar: undefined
      },
      type: 'meeting'
    },
    {
      id: '2',
      title: 'notes.pdf',
      time: '720 kB',
      attendee: {
        name: 'General'
      },
      type: 'file',
      fileInfo: {
        name: 'notes.pdf',
        size: '720 kB'
      }
    },
    {
      id: '3',
      title: 'Roth conversion meeting with Casey Morgan',
      time: '4:30PM - 5:00PM',
      attendee: {
        name: 'Casey Morgan',
        avatar: undefined
      },
      type: 'meeting'
    },
    {
      id: '4',
      title: 'Portfolio review with Thompson family',
      time: '9:00AM - 9:30AM',
      attendee: {
        name: 'Thompson',
        avatar: undefined
      },
      type: 'meeting'
    },
    {
      id: '5',
      title: 'tax_documents.xlsx',
      time: '1.2 MB',
      attendee: {
        name: 'Finance'
      },
      type: 'file',
      fileInfo: {
        name: 'tax_documents.xlsx',
        size: '1.2 MB'
      }
    },
    {
      id: '6',
      title: 'Investment strategy planning with Wilson',
      time: '11:00AM - 12:00PM',
      attendee: {
        name: 'Wilson',
        avatar: undefined
      },
      type: 'meeting'
    },
    {
      id: '7',
      title: 'Retirement planning session with Anderson',
      time: '2:00PM - 3:00PM',
      attendee: {
        name: 'Anderson',
        avatar: undefined
      },
      type: 'meeting'
    },
    {
      id: '8',
      title: 'quarterly_report.pdf',
      time: '3.4 MB',
      attendee: {
        name: 'Reports'
      },
      type: 'file',
      fileInfo: {
        name: 'quarterly_report.pdf',
        size: '3.4 MB'
      }
    },
    {
      id: '9',
      title: 'Estate planning consultation with Martinez',
      time: '10:30AM - 11:30AM',
      attendee: {
        name: 'Martinez',
        avatar: undefined
      },
      type: 'meeting'
    },
    {
      id: '10',
      title: 'Insurance review with Cooper family',
      time: '1:30PM - 2:30PM',
      attendee: {
        name: 'Cooper',
        avatar: undefined
      },
      type: 'meeting'
    }
  ];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Events</h2>
        <div className="flex items-center space-x-2">
          <Button
            color="tertiary"
            size="sm"
            iconLeading={Plus}
            className="p-2"
          />
          <Button
            color="tertiary"
            size="sm"
            iconLeading={MoreHorizontal}
            className="p-2"
          />
        </div>
      </div>

      <div className="space-y-4 flex-1 overflow-y-auto">
        {events.map((event) => (
          <div key={event.id} className="flex items-start space-x-3">
            {event.type === 'meeting' ? (
              <Avatar
                size="sm"
                initials={event.attendee.name.charAt(0)}
                src={event.attendee.avatar}
              />
            ) : (
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <FileText className="w-4 h-4 text-red-600" />
              </div>
            )}
            
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 mb-1">
                {event.title}
              </div>
              <div className="text-xs text-gray-600">
                {event.type === 'file' ? event.attendee.name : event.time}
              </div>
              {event.type === 'file' && (
                <Badge
                  type="pill-color"
                  color="error"
                  size="sm"
                  className="mt-1"
                >
                  PDF
                </Badge>
              )}
            </div>
            
            {event.type === 'file' && (
              <div className="text-xs text-gray-500">
                {event.time}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <Button
          color="link-color"
          size="sm"
          className="text-blue-600"
        >
          View all
        </Button>
      </div>
    </div>
  );
};