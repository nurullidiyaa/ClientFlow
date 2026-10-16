<?php

namespace App\Models;

use App\Models\Payment;
use App\Models\Project;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    protected $fillable = [
        'project_id',
        'invoice_number',
        'amount',
        'status',
        'issue_date',
        'due_date',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }
}