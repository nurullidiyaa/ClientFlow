<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class InvoiceController extends Controller
{
    public function index()
    {
        $invoices = Invoice::all();

        return response()->json($invoices);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'project_id' => [
                'required',
                'integer',
                'exists:projects,id',
            ],
            'invoice_number' => [
                'required',
                'string',
                'max:255',
                'unique:invoices,invoice_number',
            ],
            'amount' => [
                'required',
                'numeric',
                'min:0',
            ],
            'status' => [
                'required',
                Rule::in(['draft', 'sent', 'paid', 'overdue']),
            ],
            'issue_date' => [
                'required',
                'date',
            ],
            'due_date' => [
                'nullable',
                'date',
                'after_or_equal:issue_date',
            ],
        ]);

        $invoice = Invoice::create($validated);

        return response()->json($invoice, 201);
    }

    public function show(int $id)
    {
        $invoice = Invoice::findOrFail($id);

        return response()->json($invoice);
    }

    public function update(Request $request, int $id)
    {
        $invoice = Invoice::findOrFail($id);

        $validated = $request->validate([
            'project_id' => [
                'required',
                'integer',
                'exists:projects,id',
            ],
            'invoice_number' => [
                'required',
                'string',
                'max:255',
                Rule::unique('invoices', 'invoice_number')
                    ->ignore($invoice->id),
            ],
            'amount' => [
                'required',
                'numeric',
                'min:0',
            ],
            'status' => [
                'required',
                Rule::in(['unpaid', 'paid']),
            ],
            'issue_date' => [
                'required',
                'date',
            ],
            'due_date' => [
                'nullable',
                'date',
                'after_or_equal:issue_date',
            ],
        ]);

        $invoice->update($validated);

        return response()->json($invoice);
    }

    public function destroy(int $id)
    {
        $invoice = Invoice::findOrFail($id);

        $invoice->delete();

        return response()->json([
            'message' => 'Invoice deleted successfully',
        ]);
    }
}