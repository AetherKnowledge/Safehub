import { createWorker, getSupportedRtpCapabilities, types } from "mediasoup";
import { doLogging } from "./mediasoupLogging";

let worker: types.Worker;
let router: types.Router;

export async function initMediasoup() {
  if (worker) return router;
  worker = await createWorker({
    rtcMinPort: 20000,
    rtcMaxPort: 30000,
    logLevel: "warn",
  });

  console.log("Mediasoup worker created");
  router = await worker.createRouter({
    mediaCodecs: [
      { kind: "audio", mimeType: "audio/opus", clockRate: 48000, channels: 2 },
      {
        kind: "video",
        mimeType: "video/VP8",
        clockRate: 90000,
        parameters: {},
      },
    ],
  });
  doLogging();

  console.log(getSupportedRtpCapabilities());

  // optional: handle worker died, cleanup, etc.
  return router;
}

export function getMediasoupRouter() {
  if (!router) throw new Error("mediasoup not initialized");
  return router;
}
