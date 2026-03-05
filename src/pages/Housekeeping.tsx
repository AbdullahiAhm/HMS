import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useData } from '@/context/DataContext';
import { Brush, CheckCircle2, Clock, AlertTriangle, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import type { HousekeepingStatus, HousekeepingPriority } from '@/types/hotel';

const statusStyles: Record<HousekeepingStatus, { class: string; icon: typeof Clock }> = {
  pending: { class: 'bg-warning text-warning-foreground', icon: Clock },
  in_progress: { class: 'bg-info text-info-foreground', icon: Brush },
  completed: { class: 'bg-success text-success-foreground', icon: CheckCircle2 },
};

const priorityStyles: Record<HousekeepingPriority, string> = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-info/20 text-info',
  high: 'bg-warning/20 text-warning',
  urgent: 'bg-destructive/20 text-destructive',
};

const Housekeeping = () => {
  const { housekeepingTasks, rooms, addTask, updateTaskStatus, deleteTask } = useData();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [addOpen, setAddOpen] = useState(false);

  const [formRoomId, setFormRoomId] = useState('');
  const [formType, setFormType] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formAssigned, setFormAssigned] = useState('');
  const [formPriority, setFormPriority] = useState<HousekeepingPriority>('medium');
  const [formDate, setFormDate] = useState('');

  const resetForm = () => { setFormRoomId(''); setFormType(''); setFormDesc(''); setFormAssigned(''); setFormPriority('medium'); setFormDate(''); };

  const handleAdd = () => {
    if (!formRoomId || !formType || !formAssigned || !formDate) { toast.error('Please fill all required fields'); return; }
    const room = rooms.find(r => r.id.toString() === formRoomId)!;
    addTask({ room, task_type: formType, description: formDesc, assigned_to: formAssigned, status: 'pending', priority: formPriority, scheduled_date: formDate });
    toast.success('Task created');
    resetForm(); setAddOpen(false);
  };

  const handleComplete = (id: number) => { updateTaskStatus(id, 'completed'); toast.success('Task marked complete'); };
  const handleStart = (id: number) => { updateTaskStatus(id, 'in_progress'); toast.success('Task started'); };
  const handleDeleteTask = (id: number) => { deleteTask(id); toast.success('Task deleted'); };

  const filteredTasks = housekeepingTasks.filter((t) => {
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  const pending = housekeepingTasks.filter(t => t.status === 'pending').length;
  const inProgress = housekeepingTasks.filter(t => t.status === 'in_progress').length;
  const completed = housekeepingTasks.filter(t => t.status === 'completed').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Housekeeping</h1>
          <p className="text-muted-foreground">Manage cleaning and maintenance tasks</p>
        </div>
        <Dialog open={addOpen} onOpenChange={(o) => { setAddOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Plus className="h-4 w-4 mr-2" /> New Task
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Housekeeping Task</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div><Label>Room</Label>
                <Select value={formRoomId} onValueChange={setFormRoomId}>
                  <SelectTrigger><SelectValue placeholder="Select room" /></SelectTrigger>
                  <SelectContent>{rooms.map(r => <SelectItem key={r.id} value={r.id.toString()}>Room {r.room_number}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Task Type</Label><Input placeholder="e.g. Daily Cleaning" value={formType} onChange={e => setFormType(e.target.value)} /></div>
              <div><Label>Description</Label><Input placeholder="Task description" value={formDesc} onChange={e => setFormDesc(e.target.value)} /></div>
              <div><Label>Assigned To</Label><Input placeholder="Staff name" value={formAssigned} onChange={e => setFormAssigned(e.target.value)} /></div>
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Priority</Label>
                  <Select value={formPriority} onValueChange={(v) => setFormPriority(v as HousekeepingPriority)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Date</Label><Input type="date" value={formDate} onChange={e => setFormDate(e.target.value)} /></div>
              </div>
              <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90" onClick={handleAdd}>Create Task</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary */}
      <div className="grid gap-4 grid-cols-3">
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">Pending</p><p className="text-3xl font-bold text-warning">{pending}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">In Progress</p><p className="text-3xl font-bold text-info">{inProgress}</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><p className="text-xs text-muted-foreground">Completed</p><p className="text-3xl font-bold text-success">{completed}</p></CardContent></Card>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Priority" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priority</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Task Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTasks.map((task) => {
          const StatusIcon = statusStyles[task.status].icon;
          return (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <StatusIcon className="h-4 w-4" />
                    <span className="font-semibold">Room {task.room.room_number}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge className={`${statusStyles[task.status].class} border-0 capitalize`}>{task.status.replace('_', ' ')}</Badge>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => handleDeleteTask(task.id)}><Trash2 className="h-3 w-3" /></Button>
                  </div>
                </div>
                <h3 className="font-medium text-sm">{task.task_type}</h3>
                <p className="text-xs text-muted-foreground mt-1">{task.description}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <div className="text-xs text-muted-foreground"><span className="font-medium text-foreground">{task.assigned_to}</span></div>
                  <Badge className={`${priorityStyles[task.priority]} border-0 text-[10px] capitalize`}>
                    {task.priority === 'urgent' && <AlertTriangle className="h-2.5 w-2.5 mr-0.5" />}
                    {task.priority}
                  </Badge>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">Scheduled: {task.scheduled_date}</p>
                {task.status === 'pending' && (
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="flex-1 bg-info text-info-foreground hover:bg-info/90" onClick={() => handleStart(task.id)}>
                      <Brush className="h-3 w-3 mr-1" /> Start
                    </Button>
                    <Button size="sm" className="flex-1 bg-success text-success-foreground hover:bg-success/90" onClick={() => handleComplete(task.id)}>
                      <CheckCircle2 className="h-3 w-3 mr-1" /> Complete
                    </Button>
                  </div>
                )}
                {task.status === 'in_progress' && (
                  <Button size="sm" className="w-full mt-3 bg-success text-success-foreground hover:bg-success/90" onClick={() => handleComplete(task.id)}>
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Mark Complete
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Housekeeping;
