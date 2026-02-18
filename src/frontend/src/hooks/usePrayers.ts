import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { PrayerEntry, PrayerId, UserProfile } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useSubmitPrayer() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (prayerText: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitPrayer(prayerText);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prayerHistory'] });
    },
  });
}

export function useGetPrayerHistory() {
  const { actor, isFetching } = useActor();

  return useQuery<PrayerEntry[]>({
    queryKey: ['prayerHistory'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPrayerHistory();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPrayer(prayerId: PrayerId) {
  const { actor, isFetching } = useActor();

  return useQuery<PrayerEntry>({
    queryKey: ['prayer', prayerId.toString()],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getPrayer(prayerId);
    },
    enabled: !!actor && !isFetching && prayerId !== undefined,
  });
}
