# Server-Side Implementation Required for Phase 1

## Overview

The client-side bandwidth optimization (Phase 1) is now complete, but requires corresponding server-side changes in the `mitsi-signaling` and `mitsi-media` repositories to function properly.

## What Was Implemented on Client

The client now sends a `set_consumer_preferred_layers` action to the server with the following payload:

```typescript
{
  action: 'set_consumer_preferred_layers',
  args: {
    consumerId: string,        // The consumer ID
    producerPeerId: string,    // The peer ID producing the stream
    producerSource: ProducerSource, // 'camera' | 'screen' | 'mic' | 'screenAudio'
    spatialLayer: number,      // 0 = LOW, 1 = MEDIUM, 2 = HIGH
    temporalLayer: number      // Temporal layer (usually same as spatial)
  }
}
```

## Required Server-Side Changes

### 1. Add Action Handler (mitsi-signaling)

In your signaling server's message handler, add:

```typescript
// Example location: src/handlers/consumer-handlers.ts or similar

import { Actions } from './types/actions';

// Add to your WebSocket message handler
case Actions.SetConsumerPreferredLayers: {
  const { consumerId, spatialLayer, temporalLayer } = data.args;

  // Get the consumer from your consumer map
  const consumer = getConsumerById(consumerId);

  if (!consumer) {
    socket.emit('error', { message: 'Consumer not found' });
    return;
  }

  // Call mediasoup's setPreferredLayers on the server-side consumer
  try {
    await consumer.setPreferredLayers({ spatialLayer, temporalLayer });

    // Optional: Send acknowledgment back to client
    socket.emit('consumer_layers_updated', {
      consumerId,
      spatialLayer,
      temporalLayer
    });
  } catch (error) {
    console.error('Failed to set preferred layers:', error);
    socket.emit('error', { message: 'Failed to set preferred layers' });
  }
  break;
}
```

### 2. Update Actions Enum

Add the action to your server-side Actions enum:

```typescript
export enum Actions {
  // ... existing actions
  SetConsumerPreferredLayers = 'set_consumer_preferred_layers',
  // ... rest of actions
}
```

### 3. Add Type Definitions

Add type definition for the action arguments:

```typescript
interface SetConsumerPreferredLayersArgs {
  consumerId: string;
  producerPeerId: string;
  producerSource: 'camera' | 'screen' | 'mic' | 'screenAudio';
  spatialLayer: number;
  temporalLayer: number;
}
```

### 4. Consumer Map Structure

Ensure your server maintains a consumer map to look up consumers by ID:

```typescript
// Example consumer storage
const consumers = new Map<string, mediasoup.Consumer>();

// When creating consumer
consumers.set(consumer.id, consumer);

// Lookup function
function getConsumerById(consumerId: string) {
  return consumers.get(consumerId);
}
```

## Testing

After implementing the server-side changes:

1. Start the signaling server with the new handler
2. Join a room from the client
3. Open browser DevTools console
4. Verify messages are being sent: Look for `set_consumer_preferred_layers` in Network → WS tab
5. Check server logs for layer changes
6. Use `chrome://webrtc-internals` to verify layer switching is working

## Expected Behavior

With the server implementation complete:

- **Off-screen peers**: Should receive only spatial layer 0 (LOW) or no video (AUDIO_ONLY)
- **On-screen peers**: Should receive spatial layer 1 (MEDIUM)
- **Active speakers**: Should receive spatial layer 2 (HIGH)
- **Bandwidth**: Should reduce by 80-90% compared to all peers receiving HIGH quality

## Debugging

### Client-side debugging:

```javascript
// In browser console
const { qualityManager } = useMedia();
qualityManager.startStatsMonitoring(); // Shows layer changes every 5 seconds
```

### Server-side debugging:

```typescript
consumer.on('layerschange', (layers) => {
  console.log('Consumer layers changed:', {
    consumerId: consumer.id,
    spatialLayer: layers?.spatialLayer,
    temporalLayer: layers?.temporalLayer,
  });
});
```

## Mediasoup Consumer API Reference

The server-side Consumer object (mediasoup v3) has these methods:

```typescript
// Set preferred layers
await consumer.setPreferredLayers({
  spatialLayer: 0 | 1 | 2,
  temporalLayer: 0 | 1 | 2
});

// Get current layers
const currentLayers = consumer.currentLayers;
// Returns: { spatialLayer: number, temporalLayer: number } | undefined

// Get preferred layers
const preferredLayers = consumer.preferredLayers;
// Returns: { spatialLayer: number, temporalLayer: number } | undefined

// Listen for layer changes
consumer.on('layerschange', (layers) => {
  // layers: { spatialLayer: number, temporalLayer: number } | null
});
```

## Additional Notes

1. **Simulcast must be enabled**: Ensure producers are created with simulcast encoding on the server
2. **VP8/H264 codec**: Layer selection only works with VP8 or H264 (not VP9 SVC by default)
3. **Error handling**: Handle cases where consumer doesn't support simulcast
4. **Rate limiting**: Consider rate limiting layer change requests if needed

## Repository Links

- **Client repo**: mitsi-web (this repo) ✅ Complete
- **Server repos**: mitsi-signaling and mitsi-media ⚠️ **Requires implementation**

## Questions?

If you encounter issues implementing the server-side changes, refer to:
- Mediasoup v3 Consumer API: https://mediasoup.org/documentation/v3/mediasoup/api/#Consumer
- Simulcast guide: https://mediasoup.org/documentation/v3/mediasoup/design/#simulcast

