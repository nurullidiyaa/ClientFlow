<?php

namespace App\Models;

use App\Models\Client;
use App\Models\Task;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $fillable = [
        'client_id',
        'name',
        'description',
        'status',
        'start_date',
        'due_date',
    ];

    public function client()
    {
        return $this->belongsTo(Client::class);
    }

    public function tasks()
    {
        return $this->hasMany(Task::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }
    
}