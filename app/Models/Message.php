<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;

    protected $fillable = [
        'message',
        'sender_id',
        'group_id',
        'receiver_id',
    ];

    public function sender()
    {
        return $this->belongTo(User::class, 'sender_id');
    }

    public function receiver()
    {
        return $this->belongTo(User::class, 'receiver_id');
    }

    public function group()
    {
        return $this->belongTo(Group::class);
    }

    public function attachment()
    {
        return $this->hasMany(MessageAttachment::class);
    }
}
