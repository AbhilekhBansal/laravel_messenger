<?php

namespace App\Events;

use App\Http\Resources\MessageResource;
use App\Models\Message;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class SocketMessage implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public function __construct(public Message $message) {}

    public function broadcastWith(): array
    {

        return [

            'message' => new MessageResource($this->message),
        ];
    }

    public function broadcastAs()
    {
        return 'SocketMessage';
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {

        $m = $this->message;
        $channels = [];
        // dd($m->receiver_id);
        if ($m->group_id) {
            $channels[] = new PrivateChannel('message.group.'.$m->group_id);

        } else {
            $channels[] = new PrivateChannel('message.user.'.collect([$m->sender_id, $m->receiver_id])->sort()->implode('-'));
        }
        // dd($channels);

        return $channels;
    }
}
