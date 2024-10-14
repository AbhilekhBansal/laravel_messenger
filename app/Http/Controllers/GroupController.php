<?php

namespace App\Http\Controllers;

use App\Models\Group;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreGroupRequest;
use App\Http\Requests\UpdateGroupRequest;
use App\Jobs\DeleteGroupJob;

class GroupController extends Controller
{
    public function store(StoreGroupRequest $request)
    {
        
        $data = $request->validated();
        $user_ids =$data['user_ids'] ?? [];
        $group = Group::create($data);
        $group->users()->attach(array_unique([$request->user()->id, ...$user_ids]));
        return redirect()->back();
    }

     

    public function update(UpdateGroupRequest $request, Group $group)
    {
        $data = $request->validated();
        $user_ids =$data['user_ids'] ?? [];
        $group->update($data);

        // remove all users and attach the new ones to the group
        $group->users()->detach();
        $group->users()->attach(array_unique([$request->user()->id, ...$user_ids]));

        return redirect()->back();
    }

   
    public function destroy(Group $group)
    {
        // check if the user is owner of the group
        if($group->owner_id !== auth()->id()){
           
            return response()->json(['message'=>'Forbidden'], 403);
        }
        DeleteGroupJob::dispatch($group) ->delay(now()->addSecond(10));

        return response()->json(['status'=>200,'message'=>'Group delete was schaduled and will be deleted soon.']);
    }
}
 