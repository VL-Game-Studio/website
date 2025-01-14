import { useAppContext } from 'hooks';
import config from 'config';

/**
 * Checks if event has expired from event
 * time
 */
function hasFired(time) {
  if (!time) return false;

  return new Date().getTime() >= new Date(time).getTime();
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
  const isAuthorized = user?.roles?.includes(config?.organizedPlay);

  return {
    events,
    activeEvent: {
      ...activeEvent,
      fired: hasFired(activeEvent?.time)
    },
    otherEvents,
    player,
    isAuthorized,
  };
}

export default useEventData;
