<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'invoice_id' => 'required|exists:invoices,id',
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'nullable|string|max:50',
            'transaction_id' => 'nullable|string|max:255|unique:payments,transaction_id',
            'status' => 'required|string|max:50',
            'paid_at' => 'nullable|date',
        ]);

        $payment = Payment::create($validated);

        if ($payment->status === 'paid') {
            $payment->invoice->update([
                'status' => 'paid'
            ]);
        }

        return response()->json($payment, 201);
    }

    public function index()
    {
        $payments = Payment::all();

        return response()->json($payments);
    }

    public function show(int $id)
    {
        $payment = Payment::findOrFail($id);

        return response()->json($payment);
    }

    public function update(Request $request, int $id)
    {
        $payment = Payment::findOrFail($id);

        $validated = $request->validate([
            'invoice_id' => 'required|exists:invoices,id',
            'amount' => 'required|numeric|min:0',
            'payment_method' => 'nullable|string|max:50',
            'transaction_id' => 'nullable|string|max:255',
            'status' => 'required|string|max:50',
            'paid_at' => 'nullable|date',
        ]);

        $payment->update($validated);

        if ($payment->status === 'paid') {
            $payment->invoice->update([
                'status' => 'paid'
            ]);
        }

        return response()->json($payment);
    }

    public function destroy(int $id)
    {
        $payment = Payment::findOrFail($id);

        $payment->delete();

        return response()->json([
            'message' => 'Payment deleted successfully'
        ]);
    }
}