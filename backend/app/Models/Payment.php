<?php

namespace App\Models;

use App\Models\Invoice;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'invoice_id',
        'amount',
        'payment_method',
        'transaction_id',
        'status',
        'paid_at',
    ];

    public function invoice()
    {
        return $this->belongsTo(Invoice::class);
    }
}