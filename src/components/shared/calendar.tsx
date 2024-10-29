'use client';

import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { TimePicker } from '@/components/ui/time-picker';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  type: 'course' | 'assignment' | 'meeting' | 'personal';
  courseId?: string;
  groupId?: string;
}

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventDialog, setShowEventDialog] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<CalendarEvent>>({
    type: 'personal'
  });

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const fetchEvents = async () => {
    try {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      
      const response = await fetch(`/api/calendar/events?start=${start.toISOString()}&end=${end.toISOString()}`);
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  const handleCreateEvent = async () => {
    try {
      const response = await fetch('/api/calendar/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent)
      });

      if (!response.ok) throw new Error('Failed to create event');

      const createdEvent = await response.json();
      setEvents(prev => [...prev, createdEvent]);
      setShowEventDialog(false);
      setNewEvent({ type: 'personal' });
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  const getDaysInMonth = () => {
    return eachDayOfInterval({
      start: startOfMonth(currentDate),
      end: endOfMonth(currentDate)
    });
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.startDate), date));
  };

  return (
    <div className="space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentDate(subMonths(currentDate, 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            onClick={() => setCurrentDate(addMonths(currentDate, 1))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <Card className="p-4">
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-semibold p-2">
              {day}
            </div>
          ))}
          
          {getDaysInMonth().map(date => {
            const dayEvents = getEventsForDate(date);
            const isCurrentMonth = isSameMonth(date, currentDate);
            
            return (
              <div
                key={date.toISOString()}
                className={`min-h-[100px] p-2 border rounded-md ${
                  isCurrentMonth ? 'bg-white' : 'bg-gray-50'
                } ${
                  isSameDay(date, new Date()) ? 'border-blue-500' : ''
                }`}
                onClick={() => {
                  setSelectedDate(date);
                  setShowEventDialog(true);
                }}
              >
                <div className="text-right text-sm">
                  {format(date, 'd')}
                </div>
                <div className="space-y-1 mt-1">
                  {dayEvents.map(event => (
                    <div
                      key={event.id}
                      className={`text-xs p-1 rounded truncate ${
                        event.type === 'course' ? 'bg-blue-100' :
                        event.type === 'assignment' ? 'bg-red-100' :
                        event.type === 'meeting' ? 'bg-green-100' :
                        'bg-gray-100'
                      }`}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Create Event Dialog */}
      <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Create Event - {selectedDate ? format(selectedDate, 'PP') : ''}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="title">Title</label>
              <Input
                id="title"
                value={newEvent.title || ''}
                onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
              />
            </div>

            <div>
              <label htmlFor="description">Description</label>
              <Textarea
                id="description"
                value={newEvent.description || ''}
                onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label>Start Time</label>
                <TimePicker
                  value={newEvent.startDate}
                  onChange={date => setNewEvent({ ...newEvent, startDate: date })}
                />
              </div>
              <div>
                <label>End Time</label>
                <TimePicker
                  value={newEvent.endDate}
                  onChange={date => setNewEvent({ ...newEvent, endDate: date })}
                />
              </div>
            </div>

            <div>
              <label>Event Type</label>
              <select
                value={newEvent.type}
                onChange={e => setNewEvent({ ...newEvent, type: e.target.value as CalendarEvent['type'] })}
                className="w-full p-2 border rounded"
              >
                <option value="personal">Personal</option>
                <option value="course">Course</option>
                <option value="assignment">Assignment</option>
                <option value="meeting">Meeting</option>
              </select>
            </div>

            <Button onClick={handleCreateEvent} className="w-full">
              Create Event
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quick Add Event Button */}
      <Button
        className="fixed bottom-4 right-4 rounded-full p-3"
        onClick={() => {
          setSelectedDate(new Date());
          setShowEventDialog(true);
        }}
      >
        <Plus className="w-6 h-6" />
      </Button>
    </div>
  );
} 