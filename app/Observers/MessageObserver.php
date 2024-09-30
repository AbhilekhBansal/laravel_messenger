<?php

namespace App\Observers;

use App\Models\Group;
use App\Models\Message;
use App\Models\Conversation;
use Illuminate\Support\Facades\Storage;


class MessageObserver
{
    public function deleting(Message $message)
    {
        // Delete associated attachments before deleting the message
        $message->attachments->each(function ($attachment) {

            // Delete the file from storage
            $dir = dirname($attachment->path);
            Storage::disk('public')->deleteDirectory($dir);
        });
        // Delete all attachments related to message from database
        $message->attachments()->delete();

        // Delete all conversation entries related to message
        if ($message->group_id) {
            $group = Group::where('last_message_id', $message->id)->first();

            if ($group) {
                $prevMessage = Group::where('group_id', $message->group_id)->where('id', '!=', $message->id)
                    ->latest()
                    ->limit(1)
                    ->first();

                if ($prevMessage) {

                    $group->last_message_id = $prevMessage->id;
                    $group->save();
                }
            }
        } else {
            $conversation = Conversation::where('last_message_id', $message->id)->first();

            if ($conversation) {
                $prevMessage = Message::where(function ($query) use ($message) {
                    $query->where(function ($q) use ($message) {
                        $q->where('sender_id', $message->sender_id)
                          ->where('receiver_id', $message->receiver_id);
                    })
                    ->orWhere(function ($q) use ($message) {
                        $q->where('sender_id', $message->receiver_id)
                          ->where('receiver_id', $message->sender_id);
                    });
                })
                ->where('id', '!=', $message->id)
                ->latest()
                ->first();
                if ($prevMessage) {

                    $conversation->last_message_id = $prevMessage->id;
                    $conversation->save();
                }
            }

        }

    }
}
