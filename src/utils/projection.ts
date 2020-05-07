const DECAY_FAST = 0.99

/**
 * movement projection based on velocity
 * @param velocityPxMs
 * @param decay
 */
export const projection = (velocityPxMs: number, decay = DECAY_FAST) => (velocityPxMs * decay) / (1 - decay)
