<?php

namespace App\Http\Controllers;

use App\Http\Resources\MessageResource;
use App\Models\Group;
use App\Models\Message;
use App\Models\User;

class MessageController extends Controller
{
    public function byUser(User $user)
    {
        $messages = Message::where('sender_id', auth()->id())
            ->where('receiver_id', $user->id)
            ->orWhere('sender_id', $user->id)
            ->where('receiver_id', auth()->id())
            ->latest()
            ->paginate(10);

        return inertia('Home', ['selectedConversation' => $user->toConversationArray(), 'messages' => MessageResource::collection($messages)],

        );
    }

    public function byGroup(Group $group)
    {
        $message = Message::where('group_id', $group->id)
            ->latest()
            ->paginate(10);

        return inertia('Home', ['selectedConversation' => $group->toConversationArray(), 'messages' => MessageResource::collection($messages)],

        );
    }

    public function loadOlder(Message $message)
    {
        if ($message->group_id) {
            $message = Message::where('created_at', '<', $message->created_at)->where('group_id', $message->group_id)->latest()->paginate(10);
        } else {
            $message = Message::where('created_at', '<', $message->created_at)->where(function ($query) use ($message) {
                $query->where('sender_id', $message->sender_id)
                    ->where('receiver_id', $message->receiver_id)
                    ->orWhere('sender_id', $message->sender_id)
                    ->where('receiver_id', $message->receiver_id);
            })->latest()->paginate(10);
        }

        return Message::collection($message);
    }

    public function store(StoreMessageRequest $request)
    {
        $data = $request->validated();
        $data['sender_id'] = auth()->id();
        $reciverId = $data['receiver_id'] ?? null;
        $groupId = $data['group_id'] ?? null;

        $files = $data['attachments'] ?? [];

        $message = Message::create($data);

        $attachments = [];
        if ($files) {
            foreach ($files as $file) {
                $directory = 'attachments/'.Str::random(32);
                Storage::makeDirectory($directory);

                $model = [
                    'message_id' => $message->id,
                    'name' => $file->getClientOriginalName(),
                    'mime' => $file->getClientMimeType(),
                    'size' => $file->getSize(),
                    'path' => $file->store($directory, 'public'),
                ];
                $attachment = MessageAttachment::create($model);
                $attachments = $attachments;
            }
            $message->attachments = $attachment;
        }

        if ($reciverId) {
            Conversation::updateConversationWithMessage($reciverId, auth()->id(), $message);
        }

        if ($groupId) {
            Group::updateGroupWithMessage($groupId, $message);
        }
        SocketMeessage::dispatch($message);

        return new MessageResource($message);

    }

    public function destroy(Message $message)
    {
        if ($message->sender_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $message->delete();

        return response()->json(['message' => 'Message deleted successfully'], 200);
    }
}
