import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
} from "@/api/notification-api"
import type {
  NotificationItem,
  NotificationListResponse,
  NotificationTarget,
  UnreadNotificationCountResponse,
} from "@/types/notification-type"

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

  const syncReadNotificationInCache = (notification: NotificationItem) => {
    queryClient
      .getQueryCache()
      .findAll({ queryKey: ["notifications"] })
      .forEach((query) => {
        queryClient.setQueryData<NotificationListResponse>(
          query.queryKey,
          (data) =>
            data
              ? {
                  ...data,
                  items: data.items.map((item) =>
                    item.id === notification.id ? notification : item
                  ),
                }
              : data
        )
      })

    queryClient
      .getQueryCache()
      .findAll({ queryKey: ["notifications-unread-count"] })
      .forEach((query) => {
        queryClient.setQueryData<UnreadNotificationCountResponse>(
          query.queryKey,
          (data) =>
            data
              ? {
                  unread_count: Math.max(0, data.unread_count - 1),
                }
              : data
        )
      })
  }

  const syncReadAllNotificationsInCache = () => {
    queryClient
      .getQueryCache()
      .findAll({ queryKey: ["notifications"] })
      .forEach((query) => {
        queryClient.setQueryData<NotificationListResponse>(
          query.queryKey,
          (data) =>
            data
              ? {
                  ...data,
                  items: data.items.map((item) => ({
                    ...item,
                    is_read: true,
                  })),
                }
              : data
        )
      })

    queryClient
      .getQueryCache()
      .findAll({ queryKey: ["notifications-unread-count"] })
      .forEach((query) => {
        queryClient.setQueryData<UnreadNotificationCountResponse>(
          query.queryKey,
          (data) =>
            data
              ? {
                  unread_count: 0,
                }
              : data
        )
      })
  }

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
  })

  const unreadCountQuery = useQuery({
    queryKey: ["notifications-unread-count", staffId, target],
    queryFn: () =>
      getUnreadNotificationCount({
        staff_id: staffId,
        target,
      }),
    enabled,
  })

  const markNotificationReadMutation = useMutation({
    mutationFn: (notificationId: string) =>
      markNotificationRead(notificationId),
    onSuccess: syncReadNotificationInCache,
  })

  const markAllNotificationsReadMutation = useMutation({
    mutationFn: () =>
      markAllNotificationsRead({
        staff_id: staffId,
        target,
      }),
    onSuccess: syncReadAllNotificationsInCache,
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
