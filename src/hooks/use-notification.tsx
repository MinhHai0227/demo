import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/api/notification-api"
import type { NotificationTarget } from "@/types/notification-type"

type UseNotificationOptions = {
  enabled?: boolean
  staffId?: string
  target?: NotificationTarget
  limit?: number
}

const useNotification = ({
  enabled = true,
  staffId,
  target,
  limit = 8,
}: UseNotificationOptions) => {
  const queryClient = useQueryClient()

  const notificationsQuery = useQuery({
    queryKey: ["notifications", staffId, target, limit],
    queryFn: () =>
      getNotifications({
        limit,
        offset: 0,
        staff_id: staffId,
        target,
      }),
    enabled,
    refetchInterval: 15000,
  })

  const unreadCountQuery = useQuery({
    queryKey: ["notifications-unread-count", staffId, target],
    queryFn: () =>
      getUnreadNotificationCount({
        staff_id: staffId,
        target,
      }),
    enabled,
    refetchInterval: 15000,
  })

  const invalidateNotifications = async () => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["notifications"] }),
      queryClient.invalidateQueries({
        queryKey: ["notifications-unread-count"],
      }),
    ])
  }

  const markNotificationReadMutation = useMutation({
    mutationFn: (notificationId: string) =>
      markNotificationRead(notificationId),
    onSuccess: invalidateNotifications,
  })

  const markAllNotificationsReadMutation = useMutation({
    mutationFn: () =>
      markAllNotificationsRead({
        staff_id: staffId,
        target,
      }),
    onSuccess: invalidateNotifications,
  })

  return {
    notifications: notificationsQuery.data?.items ?? [],
    notificationsPending: notificationsQuery.isLoading,
    unreadCount: unreadCountQuery.data?.unread_count ?? 0,
    unreadCountPending: unreadCountQuery.isLoading,
    markNotificationRead: markNotificationReadMutation.mutateAsync,
    markNotificationReadPending: markNotificationReadMutation.isPending,
    markAllNotificationsRead: markAllNotificationsReadMutation.mutateAsync,
    markAllNotificationsReadPending: markAllNotificationsReadMutation.isPending,
  }
}

export default useNotification
