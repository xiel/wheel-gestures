const DECAY_FAST = 0.99
export const projection = (velocityPxMs: number) => (velocityPxMs * DECAY_FAST) / (1 - DECAY_FAST)
