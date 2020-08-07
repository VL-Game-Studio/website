import { useAppContext } from 'hooks';
import config from 'config';

/**
 * Checks if event has expired from event
 * time
 */
function hasFired(time) {
  if (!time) return false;

  return new Date() >= new Date(time);
}

function useEventData(eventID) {
  const { events, user } = useAppContext();

  /**
   * Filters to find active event by eventID
   */
  const activeEvent = events?.length > 0 && events
    .filter(({ id }) => id === eventID)[0];

  /**
   * Filters to find other active events
   */
  const otherEvents = events?.length > 0 && events
    .filter(({ id, time }) => !hasFired(time) && id !== eventID);

  /**
   * Filters activeEvent players to find
   * registered player
   */
  const player = activeEvent?.players && activeEvent?.players[user?.id];

  /**
   * Checks with server to escalate user
   * privileges
   */
  const isAuthorized = config?.admins?.includes(user?.id);

  return {
    events,
    activeEvent,
    otherEvents,
    player,
    isAuthorized,
  };
}

export default useEventData;
