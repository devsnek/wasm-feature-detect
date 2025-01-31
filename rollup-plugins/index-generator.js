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

import { promises as fsp } from "fs";
import { dirname, join } from "path";

import { camelCaseify } from "./helpers.mjs";

export default function({ indexPath, pluginFolder }) {
  const rootPluginPath = join(dirname(indexPath), pluginFolder);
  return {
    resolveId(id) {
      if (id === indexPath) {
        return id;
      }
    },
    async load(id) {
      if (id !== indexPath) {
        return;
      }

      const plugins = await fsp.readdir(rootPluginPath);
      const src = plugins
        .map(
          plugin =>
            `
              export {default as ${camelCaseify(
                plugin
              )}} from "./${pluginFolder}/${plugin}/index.js"; 
            `
        )
        .join("\n");

      return src;
    }
  };
}
