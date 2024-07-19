<?php

namespace Database\Seeders;

use App\Models\Conversation;
use App\Models\Group;
use App\Models\Message;
use App\Models\User;
use Carbon\Carbon;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        User::factory()->create([
            'name' => 'David sane',
            'email' => 'david@example.com',
            'password' => bcrypt('password'),
            'is_admin' => true,
        ]);

        User::factory()->create([
            'name' => 'Jane doe',
            'email' => 'jane@example.com',
            'password' => bcrypt('password'),
        ]);

        User::factory(10)->create(); // Creates 10 more users (excluding the admin)

        for ($i = 0; $i < 5; $i++) {
            $group = Group::factory()->create(['owner_id' => 1]);
            // $user = User::inRandomOrder()->limit(rand(2, 5))->pluck('id');
            // $group->users()->attach(array_unique([1, ...$user]));

            // Fetch user IDs randomly, ensuring they are unique
            $userIds = User::inRandomOrder()->limit(rand(2, 5))->pluck('id')->toArray();

            // Ensure the owner is included and IDs are unique
            $userIds[] = 1;
            $uniqueUserIds = array_unique($userIds);

            // Attach users to the group
            $group->users()->attach($uniqueUserIds);
        }

        Message::factory(1000)->create(); // Creates 1000 messages (excluding the admin)
        $messages = Message::whereNull('group_id')->orderBy('created_at')->get();

        $conversations = $messages->groupBy(function ($messages) {
            return collect([$messages->sender_id, $messages->receiver_id])->sort()->implode('_');

        })->map(function ($groupMessages) {
            return [
                'user_id1' => $groupMessages->first()->sender_id,
                'user_id2' => $groupMessages->first()->receiver_id,
                'last_message_id' => $groupMessages->last()->id,
                'created_at' => new Carbon(),
                'updated_at' => new Carbon(),
            ];
        })->values();
        Conversation::insertOrignore($conversations->toArray());
    }
}
