<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Conversation extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id1',
        'user_id2',
        'last_message_id',

    ];

    public function lastMessage()
    {
        return $this->belongTo(Message::class, 'last_message_id');
    }

    public function user1()
    {
        return $this->belongTo(User::class, 'user_id1');
    }

    public function user2()
    {
        return $this->belongTo(User::class, 'user_id2');
    }
}
