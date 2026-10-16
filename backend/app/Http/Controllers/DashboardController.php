<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\Project;

class DashboardController extends Controller
{
    public function index()
    {
        $totalClients = Client::count();

        $totalProjects = Project::count();

        $totalInvoices = Invoice::count();

        $paidInvoices = Invoice::where('status', 'paid')->count();

        $unpaidInvoices = Invoice::where('status', 'unpaid')->count();

        $totalRevenue = Payment::where('status', 'paid')->sum('amount');

        $pendingPayments = Payment::where('status', 'pending')->sum('amount');

        return response()->json([
            'total_clients' => $totalClients,
            'total_projects' => $totalProjects,
            'total_invoices' => $totalInvoices,
            'paid_invoices' => $paidInvoices,
            'unpaid_invoices' => $unpaidInvoices,
            'total_revenue' => $totalRevenue,
            'pending_payments' => $pendingPayments,
        ]);
    }
}