<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class CommunityActivityNotification extends Notification
{
    use Queueable;

    public function __construct(public array $details) {}

    public function via(object $notifiable): array
    {
        return ['database'];
    }

    public function toArray(object $notifiable): array
    {
        return [
            'message' => (string) ($this->details['message'] ?? 'New activity'),
            'post_id' => $this->details['post_id'] ?? null,
            'comment_id' => $this->details['comment_id'] ?? null,
            'actor_id' => $this->details['actor_id'] ?? null,
            'action' => (string) ($this->details['action'] ?? 'activity'),
        ];
    }
}
