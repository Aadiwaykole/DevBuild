import "dotenv/config";

import { processNextSyncJob } from "@/lib/syncWorker";

async function runWorker() {
  console.log("Sync worker started");

  while (true) {
    const processed = await processNextSyncJob();

    if (!processed) {
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
  }
}

runWorker().catch((error) => {
  console.error("Worker crashed:", error);
  process.exit(1);
});