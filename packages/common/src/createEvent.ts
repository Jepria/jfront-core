export function createEvent(eventName: string) {
  let event;
  if (typeof Event === "function") {
    event = new Event(eventName, { cancelable: true, bubbles: true });
  } else {
    event = document.createEvent("Event");
    event.initEvent(eventName, true, true);
  }
  return event;
}
