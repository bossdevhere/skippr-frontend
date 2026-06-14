import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  ArrowUpDown, 
  Eye, 
  Trash2, 
  CheckCircle2,
  Clock,
  Truck,
  MoreHorizontal
} from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import api from '@/services/api';
import AdminLayout from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/ui/EmptyState';
import { LoadingState } from '@/components/ui/LoadingState';
import { cn } from '@/utils/cn';

const BookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);

  const fetchBookings = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/bookings');
      setBookings(response.data.data.bookings);
      setFilteredBookings(response.data.data.bookings);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    let result = bookings;
    
    if (search) {
      result = result.filter(b => 
        b.customer_name.toLowerCase().includes(search.toLowerCase()) ||
        b.service_name.toLowerCase().includes(search.toLowerCase()) ||
        b.id.toString().includes(search)
      );
    }

    if (statusFilter !== 'All') {
      result = result.filter(b => b.status === statusFilter);
    }

    setFilteredBookings(result);
  }, [search, statusFilter, bookings]);

  const handleUpdateStatus = async (status) => {
    try {
      await api.patch(`/bookings/${selectedBooking.id}`, { status });
      toast.success(`Booking ${status} successfully`);
      setIsUpdateModalOpen(false);
      fetchBookings();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;
    try {
      await api.delete(`/bookings/${id}`);
      toast.success('Booking deleted');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to delete booking');
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Bookings</h1>
            <p className="text-muted-foreground">Manage and track all service requests.</p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={fetchBookings}>
              Refresh
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader className="border-b bg-muted/20">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by name, service, or ID..." 
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="flex items-center gap-4">
                <Select 
                  className="w-[180px]" 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Assigned">Assigned</option>
                  <option value="Completed">Completed</option>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <LoadingState />
            ) : filteredBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-muted-foreground font-medium border-b">
                    <tr>
                      <th className="px-4 py-3 text-left">ID</th>
                      <th className="px-4 py-3 text-left">Customer</th>
                      <th className="px-4 py-3 text-left">Service</th>
                      <th className="px-4 py-3 text-left">Date & Time</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="hover:bg-muted/30 transition-colors group">
                        <td className="px-4 py-4 font-mono text-xs opacity-60">#{booking.id}</td>
                        <td className="px-4 py-4">
                          <p className="font-semibold">{booking.customer_name}</p>
                          <p className="text-xs text-muted-foreground">{booking.mobile}</p>
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant="outline" className="font-medium">{booking.service_name}</Badge>
                        </td>
                        <td className="px-4 py-4">
                          <p className="font-medium">{format(new Date(booking.booking_date.split('T')[0]), 'MMM dd, yyyy')}</p>
                          <p className="text-xs text-muted-foreground">{booking.time_slot}</p>
                        </td>
                        <td className="px-4 py-4">
                          <Badge variant={booking.status.toLowerCase()}>{booking.status}</Badge>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <div className="flex justify-end items-center space-x-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => { setSelectedBooking(booking); setIsUpdateModalOpen(true); }}
                              title="Update Status"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-destructive"
                              onClick={() => handleDeleteBooking(booking.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <EmptyState 
                title={search || statusFilter !== 'All' ? "No matching bookings" : "No bookings yet"}
                description="Start booking services to see them appear here."
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Update Status Modal */}
      <Modal 
        isOpen={isUpdateModalOpen} 
        onClose={() => setIsUpdateModalOpen(false)}
        title="Update Booking Status"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Change the status for booking <span className="font-bold text-foreground">#{selectedBooking?.id}</span> by <span className="font-bold text-foreground">{selectedBooking?.customer_name}</span>.
          </p>
          <div className="grid grid-cols-1 gap-2">
            {[
              { status: 'Pending', icon: Clock, color: 'text-yellow-500' },
              { status: 'Assigned', icon: Truck, color: 'text-blue-500' },
              { status: 'Completed', icon: CheckCircle2, color: 'text-emerald-500' },
            ].map((item) => (
              <button
                key={item.status}
                onClick={() => handleUpdateStatus(item.status)}
                className={cn(
                  "flex items-center justify-between p-3 rounded-md border text-sm hover:bg-accent transition-all",
                  selectedBooking?.status === item.status ? "border-primary bg-primary/5 text-primary-foreground" : "border-border"
                )}
              >
                <div className="flex items-center">
                  <item.icon className={cn("mr-3 h-4 w-4", item.color)} />
                  {item.status}
                </div>
                {selectedBooking?.status === item.status && <Check className="h-4 w-4 text-emerald-500" />}
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default BookingsPage;
