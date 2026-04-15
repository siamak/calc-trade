/**
 * Umami offline event queue
 *
 * Persists analytics events to localStorage while the user is offline so that
 * nothing is silently dropped.  When the connection is restored the queue is
 * read once, cleared atomically, and every stored event is re-sent to Umami.
 *
 * Design decisions:
 * - localStorage is used instead of IndexedDB to keep the implementation
 *   synchronous and dependency-free.  Analytics payloads are tiny, so the
 *   storage overhead is negligible.
 * - The queue is capped at MAX_QUEUE_SIZE.  Oldest events are evicted first
 *   so that recent behaviour is always captured even under prolonged outages.
 * - The queue is cleared *before* re-sending to prevent duplicate delivery on
 *   a second failure during flush.
 */

const QUEUE_KEY = "umami_event_queue";
const MAX_QUEUE_SIZE = 50;

export interface QueuedEvent {
	name: string;
	data?: Record<string, string | number | boolean>;
	timestamp: number;
}

// ─── Internal helpers ────────────────────────────────────────────────────────

function readQueue(): QueuedEvent[] {
	try {
		const raw = localStorage.getItem(QUEUE_KEY);
		if (!raw) return [];
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

function writeQueue(queue: QueuedEvent[]): void {
	try {
		localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
	} catch {
		// localStorage may be full or unavailable — fail silently.
	}
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Append an event to the persistent offline queue.
 * If the queue is full the oldest entry is evicted to make room.
 */
export function enqueueEvent(
	name: string,
	data?: Record<string, string | number | boolean>
): void {
	if (typeof localStorage === "undefined") return;

	const queue = readQueue();

	if (queue.length >= MAX_QUEUE_SIZE) {
		queue.shift(); // evict oldest
	}

	queue.push({ name, data, timestamp: Date.now() });
	writeQueue(queue);
}

/**
 * Drain the queue and call `send` for every stored event.
 * The queue is wiped before sending so a second network failure during flush
 * does not cause duplicates on the next reconnect.
 *
 * Returns the number of events that were flushed.
 */
export function flushQueue(
	send: (
		name: string,
		data?: Record<string, string | number | boolean>
	) => void
): number {
	if (typeof localStorage === "undefined") return 0;

	const queue = readQueue();
	if (queue.length === 0) return 0;

	// Clear first — prevents duplicate delivery on partial failure.
	writeQueue([]);

	let sent = 0;
	for (const event of queue) {
		try {
			send(event.name, event.data);
			sent++;
		} catch {
			// Individual send failure — keep going for remaining events.
		}
	}

	return sent;
}

/** How many events are currently queued (useful for testing). */
export function getQueueSize(): number {
	if (typeof localStorage === "undefined") return 0;
	return readQueue().length;
}
