/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

/*
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

// Current backend implementation: limited to running model on 1000 intervals every 5s.
// Frontend should refresh at some rate > than this, to auto-refresh and show partial results.
// For historical non-high-cardinality detectors: refresh every 10s
// For historical high-cardinality detectors: refresh every 30s
export const HISTORICAL_DETECTOR_RESULT_REFRESH_RATE = 10000;
export const HISTORICAL_HC_DETECTOR_RESULT_REFRESH_RATE = 30000;

// Current backend implementation will handle stopping a historical detector task asynchronously. It is assumed
// that if the task is not in a stopped state after 5s, then there was a problem stopping.
export const HISTORICAL_DETECTOR_STOP_THRESHOLD = 5000;
