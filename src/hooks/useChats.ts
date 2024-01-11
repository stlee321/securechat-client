import { useInfiniteQuery } from "@tanstack/react-query";

type ChatItem = {
  content: string;
  timestamp: number;
};

type ChatItemPage = {
  chats: ChatItem[];
  firstTimestamp: number;
} | null;

export function useChats(
  chatRoomId: string,
  initialTimestamp: number,
  enabled: boolean
) {
  return useInfiniteQuery<ChatItemPage, Error>({
    queryKey: ["chats"],
    initialPageParam: initialTimestamp,
    queryFn: async ({ pageParam: timestamp, signal }) => {
      const res = await fetch(`/api/chats/${chatRoomId}/${timestamp}?size=10`, {
        signal: signal,
      });
      if (res.status === 200) {
        const chatItems = (await res.json()) as ChatItem[];
        const chatItemPage: ChatItemPage = {
          chats: chatItems,
          firstTimestamp: 0,
        };
        if (chatItemPage.chats.length > 0) {
          chatItemPage.firstTimestamp = chatItemPage.chats[0].timestamp;
        }
        return chatItemPage;
      }
      return null;
    },
    enabled: enabled,
    staleTime: Infinity,
    getPreviousPageParam: (firstPage) =>
      firstPage ? firstPage.firstTimestamp - 1 : undefined,
    getNextPageParam: () => undefined,
  });
}
