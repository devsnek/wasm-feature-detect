/**
 * Copyright 2019 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Name: Threads
// Proposal: https://github.com/webassembly/threads

import inlineModule from "wat2wasm:--enable-threads:./module.wat";

import { testCompile } from "../../helpers.js";

export default async function() {
  try {
    // Test for availability of shared Wasm memory
    new WebAssembly.Memory({ initial: 1, maximum: 1, shared: true });
    // Test for transferability of SABs (needed for Firefox)
    // https://groups.google.com/forum/#!msg/mozilla.dev.platform/IHkBZlHETpA/dwsMNchWEQAJ
    await new Promise(resolve => {
      const sab = new SharedArrayBuffer(1);
      const { port1, port2 } = new MessageChannel();
      port2.onmessage = resolve;
      port1.postMessage(sab);
    });
    // Test for atomics
    return testCompile(inlineModule);
  } catch (e) {
    return false;
  }
}
