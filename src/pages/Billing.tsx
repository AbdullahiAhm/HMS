import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useData } from '@/context/DataContext';
import { Receipt, DollarSign, CreditCard, Eye, Printer, Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { PaymentMethod } from '@/types/hotel';

const Billing = () => {
  const { bills, payments, addPayment } = useData();
  const [addOpen, setAddOpen] = useState(false);
  const [viewBillId, setViewBillId] = useState<number | null>(null);

  const [formBillId, setFormBillId] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formMethod, setFormMethod] = useState<PaymentMethod>('cash');
  const [formRef, setFormRef] = useState('');

  const resetForm = () => { setFormBillId(''); setFormAmount(''); setFormMethod('cash'); setFormRef(''); };

  const totalRevenue = bills.reduce((sum, b) => sum + b.total, 0);
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
  const totalOutstanding = totalRevenue - totalPaid;

  const handleAddPayment = () => {
    if (!formBillId || !formAmount) { toast.error('Please fill required fields'); return; }
    addPayment({ bill_id: parseInt(formBillId), amount: parseFloat(formAmount), method: formMethod, reference: formRef || undefined });
    toast.success('Payment recorded');
    resetForm(); setAddOpen(false);
  };

  const viewBill = bills.find(b => b.id === viewBillId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Billing & Payments</h1>
          <p className="text-muted-foreground">Manage bills, invoices, and payment records</p>
        </div>
        <Dialog open={addOpen} onOpenChange={(o) => { setAddOpen(o); if (!o) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
              <Plus className="h-4 w-4 mr-2" /> Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Record Payment</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label>Bill</Label>
                <Select value={formBillId} onValueChange={setFormBillId}>
                  <SelectTrigger><SelectValue placeholder="Select bill" /></SelectTrigger>
                  <SelectContent>{bills.filter(b => b.status !== 'paid').map(b => <SelectItem key={b.id} value={b.id.toString()}>Bill #{b.id} - {b.booking.customer.first_name} {b.booking.customer.last_name} (KES {b.total.toLocaleString()})</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Amount (KES)</Label><Input type="number" placeholder="0" value={formAmount} onChange={e => setFormAmount(e.target.value)} /></div>
              <div>
                <Label>Payment Method</Label>
                <Select value={formMethod} onValueChange={(v) => setFormMethod(v as PaymentMethod)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="debit_card">Debit Card</SelectItem>
                    <SelectItem value="mobile_money">Mobile Money (M-Pesa)</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Reference Number</Label><Input placeholder="e.g. TXN-2026-002" value={formRef} onChange={e => setFormRef(e.target.value)} /></div>
              <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90" onClick={handleAddPayment}>Record Payment</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Bill Detail Dialog */}
      <Dialog open={!!viewBill} onOpenChange={(o) => { if (!o) setViewBillId(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Bill #{viewBill?.id} Details</DialogTitle></DialogHeader>
          {viewBill && (
            <div className="space-y-4 pt-2">
              <p className="text-sm text-muted-foreground">Guest: <span className="font-medium text-foreground">{viewBill.booking.customer.first_name} {viewBill.booking.customer.last_name}</span></p>
              <p className="text-sm text-muted-foreground">Room: <span className="font-medium text-foreground">{viewBill.booking.room.room_number}</span></p>
              <table className="w-full text-sm">
                <thead><tr className="border-b"><th className="text-left py-2">Item</th><th className="text-right py-2">Qty</th><th className="text-right py-2">Price</th><th className="text-right py-2">Total</th></tr></thead>
                <tbody>
                  {viewBill.items.map(item => (
                    <tr key={item.id} className="border-b border-border/50"><td className="py-2">{item.description}</td><td className="text-right py-2">{item.quantity}</td><td className="text-right py-2">KES {item.unit_price.toLocaleString()}</td><td className="text-right py-2 font-medium">KES {item.total.toLocaleString()}</td></tr>
                  ))}
                </tbody>
              </table>
              <div className="border-t pt-2 space-y-1 text-sm">
                <div className="flex justify-between"><span>Subtotal</span><span>KES {viewBill.subtotal.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Tax (16%)</span><span>KES {viewBill.tax.toLocaleString()}</span></div>
                <div className="flex justify-between font-bold text-base"><span>Total</span><span>KES {viewBill.total.toLocaleString()}</span></div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Summary */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center"><Receipt className="h-6 w-6 text-secondary" /></div>
            <div><p className="text-sm text-muted-foreground">Total Billed</p><p className="text-xl font-bold">KES {totalRevenue.toLocaleString()}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center"><DollarSign className="h-6 w-6 text-success" /></div>
            <div><p className="text-sm text-muted-foreground">Total Paid</p><p className="text-xl font-bold text-success">KES {totalPaid.toLocaleString()}</p></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center"><CreditCard className="h-6 w-6 text-warning" /></div>
            <div><p className="text-sm text-muted-foreground">Outstanding</p><p className="text-xl font-bold text-warning">KES {totalOutstanding.toLocaleString()}</p></div>
          </CardContent>
        </Card>
      </div>

      {/* Bills Table */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Bills</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-4 font-semibold text-muted-foreground">Bill #</th>
                  <th className="text-left p-4 font-semibold text-muted-foreground">Guest</th>
                  <th className="text-left p-4 font-semibold text-muted-foreground">Room</th>
                  <th className="text-left p-4 font-semibold text-muted-foreground">Items</th>
                  <th className="text-left p-4 font-semibold text-muted-foreground">Total</th>
                  <th className="text-left p-4 font-semibold text-muted-foreground">Status</th>
                  <th className="text-left p-4 font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bills.map((bill, i) => (
                  <tr key={bill.id} className={`border-b border-border/50 hover:bg-muted/20 ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                    <td className="p-4 font-medium">#{bill.id}</td>
                    <td className="p-4">{bill.booking.customer.first_name} {bill.booking.customer.last_name}</td>
                    <td className="p-4">{bill.booking.room.room_number}</td>
                    <td className="p-4">{bill.items.length}</td>
                    <td className="p-4 font-bold">KES {bill.total.toLocaleString()}</td>
                    <td className="p-4">
                      <Badge className={`border-0 ${bill.status === 'paid' ? 'bg-success text-success-foreground' : bill.status === 'partial' ? 'bg-warning text-warning-foreground' : 'bg-info text-info-foreground'}`}>{bill.status}</Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setViewBillId(bill.id)}><Eye className="h-4 w-4" /></Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => window.print()}><Printer className="h-4 w-4" /></Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Payment History</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left p-4 font-semibold text-muted-foreground">Payment #</th>
                  <th className="text-left p-4 font-semibold text-muted-foreground">Bill #</th>
                  <th className="text-left p-4 font-semibold text-muted-foreground">Amount</th>
                  <th className="text-left p-4 font-semibold text-muted-foreground">Method</th>
                  <th className="text-left p-4 font-semibold text-muted-foreground">Reference</th>
                  <th className="text-left p-4 font-semibold text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, i) => (
                  <tr key={payment.id} className={`border-b border-border/50 hover:bg-muted/20 ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                    <td className="p-4 font-medium">#{payment.id}</td>
                    <td className="p-4">#{payment.bill_id}</td>
                    <td className="p-4 font-bold text-success">KES {payment.amount.toLocaleString()}</td>
                    <td className="p-4 capitalize">{payment.method.replace('_', ' ')}</td>
                    <td className="p-4 font-mono text-xs">{payment.reference}</td>
                    <td className="p-4">{payment.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Billing;
