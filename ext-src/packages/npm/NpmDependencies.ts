/*
 * Copyright (c) 2019-present Sonatype, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { NpmPackage } from "./NpmPackage";
import { PackageDependencies } from "../PackageDependencies";
import { NpmCoordinate } from "./NpmCoordinate";
import { PackageDependenciesHelper } from "../PackageDependenciesHelper";
import { NpmUtils } from './NpmUtils';
import { ScanType } from "../../types/ScanType";
import { ComponentEntry } from "../../models/ComponentEntry";
import { NpmScanType } from "./NpmScanType";

export class NpmDependencies implements PackageDependencies {
  private scanType: string = "";

  public async packageForIq(): Promise<Array<NpmPackage>> {
    try {
      const npmUtils = new NpmUtils();
      const deps = await npmUtils.getDependencyArray(this.scanType);
      return Promise.resolve(deps);
    }
    catch (e) {
      return Promise.reject(e);
    }
  }

  public CheckIfValid(): boolean {
    this.scanType = PackageDependenciesHelper.checkIfValidWithArray(NpmScanType, "npm");
    return this.scanType === "" ? false : true;
  }

  public toComponentEntries(packages: Array<NpmPackage>): Map<string, ComponentEntry> {
    let map = new Map<string, ComponentEntry>();
    for (let pkg of packages) {
      let componentEntry = new ComponentEntry(
        pkg.Name,
        pkg.Version,
        "npm",
        ScanType.NexusIq
      );
      let coordinates = new NpmCoordinate(
        pkg.Name,
        pkg.Version
      );
      map.set(
        coordinates.asCoordinates(),
        componentEntry
      );
    }
    return map;
  }
}
